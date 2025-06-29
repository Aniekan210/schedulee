"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { debounce } from "lodash";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BookingPage({ params }) {
  // ============= STATE MANAGEMENT =============
  const { username } = useParams();
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // User settings from API
  const [settings, setSettings] = useState({
    bgColor: "#ffffff",
    logoUrl: "",
    businessName: "Aniekan's",
  });

  // Form state
  const [date, setDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ============= DATA FETCHING =============
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `/api/getBookSettings?username=${username}`
        );
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [username]);

  const { businessName, bgColor, logoUrl } = settings;

  // ============= COLOR LOGIC =============
  const hexColor = bgColor.replace("#", "");

  // Parse hex to RGB (0-255)
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Convert RGB to HSL
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255;
  const max = Math.max(r1, g1, b1),
    min = Math.min(r1, g1, b1);
  let h,
    s,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r1) h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h /= 6;
  }

  // Calculate luminance
  const luminance = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const shouldDarken = luminance < 0.5;

  // Adjust lightness
  l = Math.max(0, Math.min(1, l * (shouldDarken ? 0.6 : 1.23)));

  // Convert HSL back to RGB
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    return t < 1 / 6
      ? p + (q - p) * 6 * t
      : t < 0.5
      ? q
      : t < 2 / 3
      ? p + (q - p) * (2 / 3 - t) * 6
      : p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const newR = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const newG = Math.round(hue2rgb(p, q, h) * 255);
  const newB = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  // Convert to hex
  const toHex = (c) => c.toString(16).padStart(2, "0");
  const newColor = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;

  // UI decisions based on background
  const textColor = shouldDarken ? "text-white" : "text-black";
  const borderColor = shouldDarken ? "border-white/70" : "border-black/70";
  const buttonVariant = shouldDarken ? "secondary" : "default";

  // Neutral colors for active states
  const activeBgColor = shouldDarken ? "bg-white/20" : "bg-black/10";
  const activeTextColor = shouldDarken ? "text-white" : "text-black";

  // ============= VALIDATION & HELPERS =============
  const validatePhoneNumber = (phone) => {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(phone);
  };

  // ============= API SIMULATION =============
  const fetchAvailableTimes = useCallback(
    debounce(async (selectedDate) => {
      setIsLoadingTimes(true);
      setSelectedTime("");
      setAvailableTimes([]);

      try {
        const response = await fetch(
          `/api/getAvailableTimes?date=${selectedDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available times");
        }
        const data = await response.json();
        setAvailableTimes(
          data.availableTimes.length
            ? data.availableTimes
            : ["No available times"]
        );
      } catch (error) {
        console.error("Error fetching available times:", error);
        setAvailableTimes(["Error loading times"]);
      } finally {
        setIsLoadingTimes(false);
      }
    }, 500),
    []
  );

  // ============= EVENT HANDLERS =============
  const handleDateSelect = (newDate) => {
    setDate(newDate);
    setSelectedTime("");
    if (newDate) {
      fetchAvailableTimes(newDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    let formIsValid = true;
    const newErrors = {
      fullName: "",
      phoneNumber: "",
      date: "",
      time: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      formIsValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      formIsValid = false;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      formIsValid = false;
    }

    if (!date) {
      newErrors.date = "Please select a date";
      formIsValid = false;
    }

    if (!selectedTime) {
      newErrors.time = "Please select a time";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isFormComplete =
    formData.fullName &&
    formData.phoneNumber &&
    validatePhoneNumber(formData.phoneNumber) &&
    date &&
    selectedTime;

  // ============= RENDER =============
  if (isLoadingSettings) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: newColor }}
      >
        <div className="flex flex-col items-center">
          <Loader2
            className="h-12 w-12 animate-spin"
            style={{ color: shouldDarken ? "white" : "black" }}
          />
          <p
            className={`mt-4 text-lg ${
              shouldDarken ? "text-white" : "text-black"
            }`}
          >
            Loading booking page...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: newColor }}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${textColor}`}
          style={{ backgroundColor: bgColor }}
        >
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="mb-6">
              Your appointment with {businessName} has been scheduled.
            </p>
            <div className="bg-opacity-20 rounded-lg p-4 mb-6">
              <p className="font-medium">{format(date, "PPP")}</p>
              <p className="text-xl font-bold">{selectedTime}</p>
            </div>
            <p className="text-sm opacity-80 mb-6">
              You'll receive a confirmation shortly.
            </p>
            <div className="mt-6 text-center text-xs opacity-70">
              Powered by{" "}
              <a
                target="_blank"
                href="/"
                className="font-medium hover:underline"
              >
                schedulee.app
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: newColor }}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${textColor}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="p-6 sm:p-8">
          {logoUrl && (
            <div className="flex justify-center mb-6">
              <Image
                src={logoUrl}
                alt="Logo"
                width={160}
                height={80}
                priority
                className="object-contain max-h-20"
              />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            You're booking with{" "}
            <span className="whitespace-nowrap">{businessName}</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full ${borderColor} bg-transparent focus-visible:ring-2 focus-visible:ring-opacity-50 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.fullName
                      ? "#ef4444"
                      : shouldDarken
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)",
                  }}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full ${borderColor} bg-transparent focus-visible:ring-2 focus-visible:ring-opacity-50 ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.phoneNumber
                      ? "#ef4444"
                      : shouldDarken
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)",
                  }}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" /> {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${borderColor} bg-transparent hover:border-2 ${
                        errors.date ? "border-red-500" : ""
                      }`}
                      style={{
                        borderWidth: "2px",
                        borderColor: errors.date
                          ? "#ef4444"
                          : shouldDarken
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" /> {errors.date}
                  </p>
                )}
              </div>

              {date && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Available Times
                  </label>
                  {isLoadingTimes ? (
                    <div className="flex justify-center py-4">
                      <Loader2
                        className="h-8 w-8 animate-spin"
                        style={{ color: shouldDarken ? "white" : "black" }}
                      />
                    </div>
                  ) : (
                    <>
                      {availableTimes.length === 1 &&
                      (availableTimes[0] === "No available times" ||
                        availableTimes[0] === "Error loading times") ? (
                        <div className="flex justify-center py-4 text-sm font-medium opacity-70">
                          {availableTimes[0]}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                if (
                                  time !== "No available times" &&
                                  time !== "Error loading times"
                                ) {
                                  setSelectedTime(time);
                                  setErrors((prev) => ({ ...prev, time: "" }));
                                }
                              }}
                              className={cn(
                                "py-2 px-3 rounded-md text-sm font-medium transition-all",
                                "flex items-center justify-center border",
                                selectedTime === time
                                  ? `${activeBgColor} border-2 ${activeTextColor} font-semibold`
                                  : `border-transparent hover:border-current ${textColor}`
                              )}
                            >
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                {time}
                              </>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {errors.time && !isLoadingTimes && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" /> {errors.time}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant={buttonVariant}
              className={cn(
                "w-full py-6 text-lg font-semibold transition-all",
                isFormComplete &&
                  "bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              )}
              disabled={isSubmitting || !isFormComplete}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                  Processing...
                </div>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs opacity-70">
            Powered by{" "}
            <a target="_blank" href="/" className="font-medium hover:underline">
              schedulee.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
