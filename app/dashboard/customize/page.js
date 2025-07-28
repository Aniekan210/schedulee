"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { UploadCloud, X, Settings, Eye } from "lucide-react";
import BookingForm from "@/components/ui/booking-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const FONT_FAMILIES = [
  { value: "Inter", label: "Inter (Default)" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Lato", label: "Lato" },
  { value: "Nunito", label: "Nunito" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Raleway", label: "Raleway" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Noto Sans", label: "Noto Sans" },
  { value: "Rubik", label: "Rubik" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Manrope", label: "Manrope" },
  { value: "Fira Sans", label: "Fira Sans" },
  { value: "IBM Plex Sans", label: "IBM Plex Sans" },
  { value: "Jost", label: "Jost" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans" },
  { value: "Archivo", label: "Archivo" },
  { value: "Sora", label: "Sora" },
  { value: "Epilogue", label: "Epilogue" },
  { value: "Space Grotesk", label: "Space Grotesk" },
];

const BORDER_RADIUS_OPTIONS = [
  { value: "0", label: "None", class: "rounded-none" },
  { value: "0.25rem", label: "Small", class: "rounded-sm" },
  { value: "0.5rem", label: "Medium", class: "rounded-md" },
  { value: "0.75rem", label: "Large", class: "rounded-lg" },
];

export default function FormSettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: "",
    logoUrl: "",
    bgColor: "#ffffff",
    timezone: "America/Halifax",
    textColor: "#000000",
    accentColor: "#2563eb",
    fontFamily: "Inter",
    borderRadius: "0.5rem",
    ctaText: "Book Now",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/form-settings?id=${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();

        setFormData({
          businessName: data.businessName || "",
          logoUrl: data.logoUrl || "",
          bgColor: data.bgColor || "#ffffff",
          timezone: data.timezone || "America/Halifax",
          textColor: data.textColor || "#000000",
          accentColor: data.accentColor || "#2563eb",
          fontFamily: data.fontFamily || "Inter",
          borderRadius: data.borderRadius || "0.5rem",
          ctaText: data.ctaText || "Book Now",
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, logoUrl: previewUrl }));
  };

  const handleRemoveFile = async () => {
    if (!user) return;

    if (formData.logoUrl && !selectedFile) {
      try {
        setIsSaving(true);
        const response = await fetch(`/api/form-settings?userId=${user.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete logo");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error.message);
        return;
      } finally {
        setIsSaving(false);
      }
    }
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", user.id);
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("bgColor", formData.bgColor);
      formDataToSend.append("timezone", formData.timezone);
      formDataToSend.append("textColor", formData.textColor);
      formDataToSend.append("accentColor", formData.accentColor);
      formDataToSend.append("fontFamily", formData.fontFamily);
      formDataToSend.append("borderRadius", formData.borderRadius);
      formDataToSend.append("ctaText", formData.ctaText);

      if (selectedFile) {
        formDataToSend.append("logoFile", selectedFile);
      }

      const response = await fetch("/api/form-settings", {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      toast.success("Settings saved successfully");
      setRefreshKey((prev) => prev + 1);
      setSelectedFile(null);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const FileUploader = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current.click();
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    const handleChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    };

    const handleFile = useCallback((file) => {
      if (!["image/png", "image/jpeg"].some((type) => file.type.match(type))) {
        toast.error("Invalid file type. Only PNG and JPEG are allowed");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 2MB");
        return;
      }

      handleFileSelect(file);
    }, []);

    return (
      <div className="space-y-2">
        {formData.logoUrl ? (
          <div className="relative group">
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={formData.logoUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFile();
              }}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`relative border-2 border-dashed rounded-lg transition-all ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200"
            } ${
              isSaving
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer hover:border-blue-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div
              className="flex flex-col items-center justify-center p-8 text-center"
              onClick={handleClick}
            >
              <UploadCloud className="h-8 w-8 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 160×80 • Max 2MB
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleClick}
              >
                Select File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg"
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 min-h-screen">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-[600px] w-full rounded-lg" />
          <Skeleton className="h-[600px] w-full md:w-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Form Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Customize your booking form appearance
        </p>
      </div>

      {/* Main Content - Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview Section - Takes remaining space */}
        <div className="flex-1">
          <Card className="w-full h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <CardTitle>Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-auto min-h-[500px] w-full">
                <div className="h-full w-full pointer-events-none p-6">
                  <BookingForm business_id={user.id} key={refreshKey} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel - Fixed width on larger screens */}
        <div className="w-full lg:w-[400px]">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                <CardTitle>Customization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Business Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Business Info
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <FileUploader />
                    </div>
                  </div>
                </div>

                {/* Design Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Design
                  </h3>
                  <div className="space-y-3">
                    {/* Color Picker Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Background</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.bgColor}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "bgColor",
                                  value: e.target.value,
                                },
                              })
                            }
                            className="w-7 h-7 rounded-md border cursor-pointer"
                          />
                          <Input
                            value={formData.bgColor}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "bgColor",
                                  value: e.target.value,
                                },
                              })
                            }
                            name="bgColor"
                            className="h-8 text-xs"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Text</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.textColor}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "textColor",
                                  value: e.target.value,
                                },
                              })
                            }
                            className="w-7 h-7 rounded-md border cursor-pointer"
                          />
                          <Input
                            value={formData.textColor}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "textColor",
                                  value: e.target.value,
                                },
                              })
                            }
                            name="textColor"
                            className="h-8 text-xs"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Accent</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.accentColor}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "accentColor",
                                  value: e.target.value,
                                },
                              })
                            }
                            className="w-7 h-7 rounded-md border cursor-pointer"
                          />
                          <Input
                            value={formData.accentColor}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "accentColor",
                                  value: e.target.value,
                                },
                              })
                            }
                            name="accentColor"
                            className="h-8 text-xs"
                            placeholder="#2563eb"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select
                        value={formData.fontFamily}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            fontFamily: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-2">
                      <Label>Border Radius</Label>
                      <div className="flex gap-2 flex-wrap">
                        {BORDER_RADIUS_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`flex-1 min-w-[80px] h-10 flex items-center justify-center transition-all ${
                              formData.borderRadius === option.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            } ${option.class}`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                borderRadius: option.value,
                              }))
                            }
                          >
                            <span className="text-xs">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Content
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="ctaText">Button Text</Label>
                      <Input
                        id="ctaText"
                        name="ctaText"
                        value={formData.ctaText}
                        onChange={handleInputChange}
                        placeholder="Book Now"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, timezone: value }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
