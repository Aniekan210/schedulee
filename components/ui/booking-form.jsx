'use client';

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  Globe,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const FONT_FAMILIES = {
  "Inter": "Inter:wght@400;500;600;700",
  "Roboto": "Roboto:wght@400;500;700",
  "Open Sans": "Open+Sans:wght@400;600;700",
  "Montserrat": "Montserrat:wght@400;500;600;700",
  "Poppins": "Poppins:wght@400;500;600;700",
  "Lato": "Lato:wght@400;700;900",
  "Nunito": "Nunito:wght@400;600;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700",
  "Raleway": "Raleway:wght@400;500;600;700",
  "Merriweather": "Merriweather:wght@400;700",
  "Source Sans Pro": "Source+Sans+Pro:wght@400;600;700",
  "Noto Sans": "Noto+Sans:wght@400;700",
  "Rubik": "Rubik:wght@400;500;700",
  "Quicksand": "Quicksand:wght@400;500;700",
  "Work Sans": "Work+Sans:wght@400;500;600",
  "Manrope": "Manrope:wght@400;500;700",
  "Fira Sans": "Fira+Sans:wght@400;500;700",
  "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;700",
  "Jost": "Jost:wght@400;500;700",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;700",
  "Archivo": "Archivo:wght@400;500;700",
  "Sora": "Sora:wght@400;500;700",
  "Epilogue": "Epilogue:wght@400;500;700",
  "Space Grotesk": "Space+Grotesk:wght@400;500;700"
};

const getLuminance = (hexColor) => {
  const r = parseInt(hexColor.substring(1, 3), 16) / 255;
  const g = parseInt(hexColor.substring(3, 5), 16) / 255;
  const b = parseInt(hexColor.substring(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export default function BookingForm({ business_id }) {
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [settings, setSettings] = useState(null);
  const [timezone, setTimezone] = useState("America/Halifax");
  const [businessTimezone, setBusinessTimezone] = useState("America/Halifax");
  const [date, setDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [icsUrl, setIcsUrl] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/form-settings?id=${business_id}`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();

        if (!data || !data.businessName) throw new Error("Invalid booking ID");
        setSettings(data);
        if (data.timezone) {
          setTimezone(data.timezone);
          setBusinessTimezone(data.timezone);
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

  const fetchAvailableTimes = useCallback(
    debounce(async (selectedDate) => {
      if (!selectedDate) return;

      setIsLoadingTimes(true);
      setSelectedTime("");
      try {
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
    [business_id, timezone, businessTimezone]
  );

  useEffect(() => {
    if (date) {
      fetchAvailableTimes(date);
    }
  }, [timezone, date, fetchAvailableTimes]);

  const handleDateSelect = (newDate) => {
    if (!newDate) return;
    setDate(newDate);
    setSelectedTime("");
    fetchAvailableTimes(newDate);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let formIsValid = true;
    const newErrors = { name: "", email: "", date: "", time: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      formIsValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      formIsValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
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
      const bookingData = {
        id: 1,
        business_id: business_id,
        name: formData.name,
        email: formData.email,
        booking_date: format(date, "yyyy-MM-dd"),
        booking_time: selectedTime,
        timezone,
      };

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
        form: error instanceof Error ? error.message : "Failed to book appointment",
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
    formData.email &&
    validateEmail(formData.email) &&
    date &&
    selectedTime;

  const fontUrl = settings?.fontFamily ? `https://fonts.googleapis.com/css2?family=${FONT_FAMILIES[settings.fontFamily]}&display=swap` : null;

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
            This booking page ID is invalid or no longer active. Please check
            the link and try again.
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

  const {
    bgColor,
    logoUrl,
    businessName,
    textColor,
    accentColor,
    fontFamily = "Inter",
    borderRadius,
    ctaText
  } = settings;

  const ctaTextColor = getLuminance(accentColor) > 0.5 ? "#000000" : "#ffffff";

  if (isSuccess) {
    return (
      <>
        {fontUrl && (
          <link rel="stylesheet" href={fontUrl} />
        )}
        <div
          className="min-h-screen w-full flex items-center justify-center p-4"
          style={{ backgroundColor: accentColor }}
        >
          <div
            className={`w-full max-w-md rounded-2xl shadow-xl p-8`}
            style={{
              backgroundColor: bgColor,
              color: textColor,
              borderRadius: borderRadius,
              fontFamily: `'${fontFamily}', sans-serif`
            }}
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
            <div 
              className="rounded-lg p-4 mb-6 text-center"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <p className="font-medium">{format(date, "PPP")}</p>
              <p className="text-xl font-bold">{selectedTime}</p>
              <p className="text-sm mt-1" style={{ opacity: 0.8 }}>
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
                <Button 
                  variant="outline" 
                  className="w-full py-3 font-semibold"
                  style={{
                    color: textColor,
                    borderColor: textColor,
                    borderRadius: borderRadius
                  }}
                >
                  Add to Calendar
                </Button>
              </a>
            )}
            <div className="text-center text-xs opacity-70" style={{ fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
              Powered by{" "}
              <a href="/" className="font-medium hover:underline">
                schedulee.app
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {fontUrl && (
        <link rel="stylesheet" href={fontUrl} />
      )}
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: accentColor }}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-300`}
          style={{
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: borderRadius,
            fontFamily: `'${fontFamily}', sans-serif`
          }}
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
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent focus-visible:ring-2 focus-visible:ring-opacity-50"
                    style={{
                      borderColor: errors.name
                        ? "#ef4444"
                        : textColor,
                      opacity: 0.7,
                      borderRadius: borderRadius
                    }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent focus-visible:ring-2 focus-visible:ring-opacity-50"
                    style={{
                      borderColor: errors.email
                        ? "#ef4444"
                        : textColor,
                      opacity: 0.7,
                      borderRadius: borderRadius
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" /> {errors.email}
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
                        className="w-full justify-start text-left font-normal bg-transparent hover:border-2"
                        style={{
                          borderWidth: "2px",
                          borderColor: errors.date
                            ? "#ef4444"
                            : textColor,
                          opacity: 0.7,
                          borderRadius: borderRadius
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
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
                    <div className="flex justify-between items-center mb-1 gap-1">
                      <label className="block text-sm font-medium">
                        Available Times
                      </label>
                      <div
                        className="flex items-center text-sm gap-1"
                        style={{ opacity: 0.8 }}
                      >
                        <Globe className="w-4 h-4" />
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger
                            className="bg-transparent border-none p-0 h-auto text-sm gap-1"
                            icon={
                              <ChevronDown
                                className="w-4 h-4"
                              />
                            }
                          >
                            <SelectValue placeholder="Timezone" />
                          </SelectTrigger>
                          <SelectContent 
                            className="bg-white text-gray-900"
                            style={{ fontFamily: `'${fontFamily}', sans-serif` }}
                          >
                            {TIMEZONES.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {isLoadingTimes ? (
                      <div className="flex justify-center py-4">
                        <Loader2
                          className="h-8 w-8 animate-spin"
                          style={{ color: textColor }}
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
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
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
                                  "flex items-center justify-center",
                                  selectedTime === time
                                    ? `font-semibold`
                                    : `hover:opacity-90`
                                )}
                                style={{
                                  backgroundColor: selectedTime === time ? `${accentColor}20` : 'transparent',
                                  opacity: selectedTime === time ? 1 : 0.7,
                                  borderRadius: borderRadius
                                }}
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
                className={cn(
                  "w-full py-6 text-lg font-semibold transition-all",
                  isFormComplete && "hover:opacity-90",
                  !isFormComplete && "opacity-50 cursor-not-allowed"
                )}
                style={{
                  backgroundColor: accentColor,
                  color: ctaTextColor,
                  borderRadius: borderRadius
                }}
                disabled={isSubmitting || !isFormComplete}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-3" />
                    Processing...
                  </div>
                ) : (
                  ctaText || "Book Appointment"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs opacity-70" style={{ fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
              Powered by{" "}
              <a target="_blank" href="/" className="font-medium hover:underline">
                schedulee.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}