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
  ChevronDown,
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

// List of common timezones
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Halifax", label: "Atlantic Time (AT)" },
  { value: "America/St_Johns", label: "Newfoundland Time (NT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

export default function BookingPage() {
  const { id: business_id } = useParams();
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [settings, setSettings] = useState(null);
  const [timezone, setTimezone] = useState("America/Halifax"); // Default timezone
  const [date, setDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [icsUrl, setIcsUrl] = useState(null);

  // Fetch business settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/form-settings?id=${business_id}`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();

        if (!data || !data.businessName) throw new Error("Invalid business ID");
        setSettings(data);
        // Set timezone from settings if available
        if (data.businessTimezone) {
          setTimezone(data.businessTimezone);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setSettings(null);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [business_id]);

  // Fetch available times when date or timezone changes
  const fetchAvailableTimes = useCallback(
    debounce(async (selectedDate) => {
      if (!selectedDate) return;

      setIsLoadingTimes(true);
      setSelectedTime("");
      try {
        const { businessTimezone } = settings;
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(
          `/api/availability/client?business_id=${business_id}&date=${dateStr}&timezone=${timezone}&business_timezone=${businessTimezone}`
        );

        if (!response.ok) throw new Error("Failed to fetch available times");

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setAvailableTimes(
          data.availableTimes && data.availableTimes.length
            ? data.availableTimes
            : ["No available times"]
        );
      } catch (error) {
        console.error("Error fetching available times:", error);
        setAvailableTimes(["Error loading times"]);
      } finally {
        setIsLoadingTimes(false);
      }
    }, 300),
    [business_id, timezone]
  );

  // Reload times when timezone changes
  useEffect(() => {
    if (date) {
      fetchAvailableTimes(date);
    }
  }, [timezone, date, fetchAvailableTimes]);

  const handleDateSelect = (newDate) => {
    setDate(newDate);
    setSelectedTime("");
    if (newDate) fetchAvailableTimes(newDate);
  };

  const validatePhoneNumber = (phone) =>
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    let formIsValid = true;
    const newErrors = { name: "", phoneNumber: "", date: "", time: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      formIsValid = false;
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      formIsValid = false;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number";
      formIsValid = false;
    }
    if (!date) {
      newErrors.date = "Select a date";
      formIsValid = false;
    }
    if (!selectedTime) {
      newErrors.time = "Select a time";
      formIsValid = false;
    }

    setErrors(newErrors);
    if (!formIsValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare booking data
      const bookingData = {
        business_id,
        name: formData.name,
        phone_number: formData.phoneNumber,
        booking_date: format(date, "yyyy-MM-dd"),
        booking_time: selectedTime,
        timezone,
      };

      // Submit booking
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      // Create calendar event
      const eventStart = new Date(date);
      const [hours, minutes] = selectedTime.split(":");
      eventStart.setHours(parseInt(hours, 10));
      eventStart.setMinutes(parseInt(minutes, 10));

      const eventEnd = new Date(eventStart.getTime() + 30 * 60 * 1000);
      const pad = (n) => String(n).padStart(2, "0");
      const formatICSDate = (d) =>
        `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
          d.getUTCDate()
        )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schedulee//EN
BEGIN:VEVENT
UID:${Date.now()}@schedulee.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(eventStart)}
DTEND:${formatICSDate(eventEnd)}
SUMMARY:Appointment with ${settings.businessName}
DESCRIPTION:Scheduled via schedulee.app
LOCATION:Online or In-Person
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      setIcsUrl(URL.createObjectURL(blob));
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      setErrors((prev) => ({
        ...prev,
        form: error.message || "Failed to book appointment",
      }));
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
    formData.name &&
    formData.phoneNumber &&
    validatePhoneNumber(formData.phoneNumber) &&
    date &&
    selectedTime;

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-md p-8 text-center border border-gray-200">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Booking Link</h2>
          <p className="text-sm text-gray-600">
            This booking page is not available. Please check the link and try
            again.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Go back to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { businessName, bgColor, logoUrl } = settings;

  // Color calculations
  const hexColor = bgColor.replace("#", "");
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
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

  const luminance = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const shouldDarken = luminance < 0.5;
  l = Math.max(0, Math.min(1, l * (shouldDarken ? 0.5 : 0.9)));
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
  const toHex = (c) => c.toString(16).padStart(2, "0");
  const newColor = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  const textColor = shouldDarken ? "text-white" : "text-black";
  const borderColor = shouldDarken ? "border-white/70" : "border-black/70";
  const buttonVariant = shouldDarken ? "secondary" : "default";
  const activeBgColor = shouldDarken ? "bg-white/20" : "bg-black/10";
  const activeTextColor = shouldDarken ? "text-white" : "text-black";
  const hoverBgColor = shouldDarken ? "hover:bg-white/10" : "hover:bg-black/5";
  const focusRingColor = shouldDarken
    ? "focus:ring-white/50"
    : "focus:ring-black/50";

  if (isSuccess) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: newColor }}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-xl p-8 ${textColor}`}
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Booking Confirmed!
          </h2>
          <p className="mb-4 text-center">
            Your appointment with {businessName} is booked for:
          </p>
          <div className="bg-opacity-20 rounded-lg p-4 mb-6 text-center">
            <p className="font-medium">{format(date, "PPP")}</p>
            <p className="text-xl font-bold">{selectedTime}</p>
            <p className="text-sm opacity-70 mt-1">
              (
              {TIMEZONES.find((tz) => tz.value === timezone)?.label || timezone}
              )
            </p>
          </div>
          {icsUrl && (
            <a
              href={icsUrl}
              download={`booking-${businessName}-${format(
                date,
                "yyyyMMdd"
              )}.ics`}
              className="block mb-4"
            >
              <Button variant="outline" className="w-full py-3 font-semibold">
                Add to Calendar
              </Button>
            </a>
          )}
          <div className="text-center text-xs opacity-70">
            Powered by{" "}
            <a href="/" className="font-medium hover:underline">
              schedulee.app
            </a>
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
            Book with {businessName}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Improved Timezone Selector */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={cn(
                      "w-full p-2.5 rounded-md border bg-transparent appearance-none pr-8",
                      "focus:outline-none focus:ring-2 focus:ring-opacity-50",
                      borderColor,
                      hoverBgColor,
                      focusRingColor,
                      "transition-colors duration-200"
                    )}
                  >
                    {TIMEZONES.map((tz) => (
                      <option
                        key={tz.value}
                        value={tz.value}
                        className={shouldDarken ? "bg-gray-800" : "bg-white"}
                      >
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-70 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full ${borderColor} bg-transparent focus-visible:ring-2 focus-visible:ring-opacity-50 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.name
                      ? "#ef4444"
                      : shouldDarken
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)",
                  }}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" /> {errors.name}
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
                  placeholder="(123) 456-7890"
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

            {errors.form && (
              <div className="text-red-500 text-sm text-center">
                <XCircle className="w-4 h-4 inline mr-1" />
                {errors.form}
              </div>
            )}

            <Button
              type="submit"
              variant={buttonVariant}
              className={cn(
                "w-full py-6 text-lg font-semibold transition-all",
                isFormComplete && "hover:opacity-90",
                !isFormComplete && "opacity-50 cursor-not-allowed"
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
