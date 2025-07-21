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
import { UploadCloud, X } from "lucide-react";
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

export default function FormSettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: "",
    logoUrl: "",
    bgColor: "#ffffff",
    timezone: "America/Halifax",
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

    // If there's an existing logo (not just a newly selected file)
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
    // Clear the local state regardless
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
        <div className="grid gap-4 md:grid-cols-2 h-[calc(100vh-64px)]">
          <Skeleton className="h-full w-full rounded" />
          <Skeleton className="h-full w-full rounded" />
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

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Preview Section */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-hidden">
            <div className="pointer-events-none h-full relative">
              <div className=" h-full w-full absolute top-0 left-0 bg-black opacity-[0.03]"></div>
              <BookingForm business_id={user?.id} key={refreshKey} />
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Customization</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-hidden">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.bgColor}
                      onChange={(e) =>
                        handleInputChange({
                          target: { name: "bgColor", value: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.bgColor}
                      onChange={(e) =>
                        handleInputChange({
                          target: { name: "bgColor", value: e.target.value },
                        })
                      }
                      name="bgColor"
                      className="flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

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

                <div className="pt-2 mt-auto">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
