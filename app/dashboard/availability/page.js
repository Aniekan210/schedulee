"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Save,
  Clock,
  X,
  Check,
  Edit,
  Trash2,
  MoreVertical,
  Copy,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { DateTime } from "luxon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const WEEKDAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const WEEKDAY_SHORT_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
});

const INTERVAL_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const TimePicker = ({ value, onChange, placeholder = "Select time" }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800 dark:border-gray-700">
        {TIME_OPTIONS.map((time) => (
          <SelectItem
            key={time}
            value={time}
            className="dark:hover:bg-gray-700/50 dark:text-white"
          >
            {DateTime.fromFormat(time, "HH:mm").toLocaleString(
              DateTime.TIME_SIMPLE
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DaySchedule = ({ day, availability, onChange, onCopyToAll }) => {
  const [isExpanded, setIsExpanded] = useState(availability.is_available);

  const handleToggleAvailable = (checked) => {
    onChange(day, "is_available", checked);
    setIsExpanded(checked);
  };

  return (
    <div className="w-full border rounded-xl overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center gap-3">
          <Switch
            checked={availability.is_available}
            onCheckedChange={handleToggleAvailable}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label className="text-sm font-medium dark:text-gray-300">
            {WEEKDAY_LABELS[day]}
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              availability.is_available
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }
          >
            {availability.is_available ? "Available" : "Unavailable"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopyToAll(availability)}
            className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300 p-2"
            title="Copy to all days"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      {availability.is_available && (
        <div className="p-4 space-y-6 border-t dark:border-gray-700">
          {/* Time Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm dark:text-gray-300">Start Time</Label>
                <TimePicker
                  value={availability.start_time}
                  onChange={(value) => onChange(day, "start_time", value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm dark:text-gray-300">End Time</Label>
                <TimePicker
                  value={availability.end_time}
                  onChange={(value) => onChange(day, "end_time", value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm dark:text-gray-300">Interval</Label>
              <Select
                value={availability.interval_minutes.toString()}
                onValueChange={(value) =>
                  onChange(day, "interval_minutes", parseInt(value))
                }
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 dark:border-gray-700">
                  {INTERVAL_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                      className="dark:hover:bg-gray-700/50 dark:text-white"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Breaks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm dark:text-gray-300">
                Breaks between
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(day, "breaks", [
                    ...availability.breaks,
                    {
                      id: `temp-${Date.now()}`,
                      start_time: "12:00",
                      end_time: "13:00",
                    },
                  ]);
                }}
                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 dark:text-blue-400"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Break
              </Button>
            </div>

            {availability.breaks.length === 0 ? (
              <div className="text-center py-2 text-sm text-muted-foreground dark:text-gray-400">
                No breaks scheduled
              </div>
            ) : (
              <div className="space-y-3 overflow-x-auto">
                {availability.breaks.map((br) => (
                  <div
                    key={br.id}
                    className="flex items-center gap-3 flex-nowrap"
                  >
                    <div className="flex-1">
                      <TimePicker
                        value={br.start_time}
                        onChange={(value) => {
                          const updatedBreaks = availability.breaks.map((b) =>
                            b.id === br.id ? { ...b, start_time: value } : b
                          );
                          onChange(day, "breaks", updatedBreaks);
                        }}
                        placeholder="Start"
                      />
                    </div>
                    <span className="text-muted-foreground text-sm dark:text-gray-400">
                      to
                    </span>
                    <div className="flex-1">
                      <TimePicker
                        value={br.end_time}
                        onChange={(value) => {
                          const updatedBreaks = availability.breaks.map((b) =>
                            b.id === br.id ? { ...b, end_time: value } : b
                          );
                          onChange(day, "breaks", updatedBreaks);
                        }}
                        placeholder="End"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedBreaks = availability.breaks.filter(
                          (b) => b.id !== br.id
                        );
                        onChange(day, "breaks", updatedBreaks);
                      }}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-red-400 px-2 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const WeekView = ({ availabilities, onChange }) => {
  const handleCopyToAll = (sourceAvailability) => {
    const { is_available, start_time, end_time, interval_minutes, breaks } =
      sourceAvailability;

    WEEKDAYS.forEach((day) => {
      onChange(day, "is_available", is_available);
      if (is_available) {
        onChange(day, "start_time", start_time);
        onChange(day, "end_time", end_time);
        onChange(day, "interval_minutes", interval_minutes);
        onChange(day, "breaks", [...breaks]);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
      {WEEKDAYS.map((day) => {
        const dayAvailability = availabilities.find(
          (a) => a.weekday === day
        ) || {
          weekday: day,
          is_available: false,
          start_time: "09:00",
          end_time: "17:00",
          interval_minutes: 60,
          breaks: [],
        };

        return (
          <DaySchedule
            key={day}
            day={day}
            availability={dayAvailability}
            onChange={onChange}
            onCopyToAll={handleCopyToAll}
          />
        );
      })}
    </div>
  );
};

const formatTimeDisplay = (time) => {
  if (!time) return "";
  return DateTime.fromFormat(time, "HH:mm").toLocaleString(
    DateTime.TIME_SIMPLE
  );
};

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-800"
        />
      ))}
    </div>
  );
};

const AvailabilityPage = () => {
  const { user } = useAuth();
  const [timezone, setTimezone] = useState("America/Halifax");
  const [availabilities, setAvailabilities] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("recurring");
  const [isOverrideDialogOpen, setIsOverrideDialogOpen] = useState(false);
  const [isDeleteOverrideDialogOpen, setIsDeleteOverrideDialogOpen] =
    useState(false);
  const [currentOverride, setCurrentOverride] = useState(null);
  const [overrideToDelete, setOverrideToDelete] = useState(null);

  useEffect(() => {
    if (!user || availabilities.length > 0) return;

    const defaultAvailabilities = WEEKDAYS.map((weekday) => ({
      id: `temp-${weekday}`,
      business_id: user.id,
      is_available: false,
      weekday,
      start_time: "09:00",
      end_time: "17:00",
      interval_minutes: 60,
      breaks: [],
    }));

    setAvailabilities(defaultAvailabilities);
  }, [user, availabilities]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [availRes, overridesRes, settingsRes] = await Promise.all([
          fetch(
            `/api/availability?business_id=${
              user?.id
            }&timezone=${encodeURIComponent(timezone)}`
          ),
          fetch(
            `/api/overrides?business_id=${
              user?.id
            }&timezone=${encodeURIComponent(timezone)}`
          ),
          fetch(`/api/form-settings?id=${user?.id}`),
        ]);

        if (availRes.ok) {
          const availData = await availRes.json();
          setAvailabilities(availData);
        }

        if (overridesRes.ok) {
          const overridesData = await overridesRes.json();
          setOverrides(overridesData);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setTimezone(settingsData.timezone || "America/Halifax");
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      window.location.href = "/login";
    }
  }, [user, timezone]);

  const handleAvailabilityChange = (weekday, field, value) => {
    setAvailabilities((prev) =>
      prev.map((avail) =>
        avail.weekday === weekday ? { ...avail, [field]: value } : avail
      )
    );
    setHasChanges(true);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: user?.id,
          timezone,
          availabilities,
        }),
      });

      if (!response.ok) throw new Error("Failed to save availability");

      const data = await response.json();
      setAvailabilities(data);
      setHasChanges(false);
      toast.success("Availability saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOverride = (e) => {
    e.preventDefault();
    setCurrentOverride({
      business_id: user?.id,
      date: DateTime.now().setZone(timezone).toISODate(),
      is_available: true,
      start_time: "09:00",
      end_time: "17:00",
      interval_minutes: 60,
    });
    setIsOverrideDialogOpen(true);
  };

  const handleEditOverride = (override, e) => {
    e.preventDefault();
    setCurrentOverride({
      ...override,
      start_time: override.start_time || "09:00",
      end_time: override.end_time || "17:00",
    });
    setIsOverrideDialogOpen(true);
  };

  const handleDeleteOverride = (id, e) => {
    e.preventDefault();
    setOverrideToDelete(id);
    setIsDeleteOverrideDialogOpen(true);
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const method = currentOverride?.id ? "PUT" : "POST";

      const response = await fetch("/api/overrides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentOverride,
          timezone,
          business_id: user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to save override");

      const data = await response.json();
      setOverrides((prev) =>
        currentOverride?.id
          ? prev.map((o) => (o.id === currentOverride.id ? data : o))
          : [...prev, data]
      );
      setIsOverrideDialogOpen(false);
      toast.success("Override saved successfully");
    } catch (error) {
      console.error("Save override error:", error);
      toast.error("Failed to save override");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOverrideConfirm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/overrides", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: overrideToDelete,
          timezone,
          business_id: user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete override");

      setOverrides((prev) => prev.filter((o) => o.id !== overrideToDelete));
      setIsDeleteOverrideDialogOpen(false);
      toast.success("Override deleted successfully");
    } catch (error) {
      console.error("Delete override error:", error);
      toast.error("Failed to delete override");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col space-y-1 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
          Availability Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
          Configure your regular hours and special dates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full gap-1 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="recurring"
            className="text-xs sm:text-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            Recurring Times
          </TabsTrigger>
          <TabsTrigger
            value="overrides"
            className="text-xs sm:text-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            Special Dates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <CardTitle className="text-lg md:text-xl dark:text-white">
                  Weekly Schedule
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  {hasChanges && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      Unsaved Changes
                    </Badge>
                  )}
                  <Button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges || isSaving}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white w-full sm:w-auto"
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-48 w-full rounded-xl bg-gray-200 dark:bg-gray-700"
                    />
                  ))}
                </div>
              ) : (
                <WeekView
                  availabilities={availabilities}
                  onChange={handleAvailabilityChange}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overrides" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-lg md:text-xl dark:text-white">
                  Special Dates
                </CardTitle>
                <Button
                  onClick={handleAddOverride}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Special Date
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton />
              ) : overrides.length === 0 ? (
                <p className="text-muted-foreground dark:text-gray-400 text-center py-8">
                  No special dates configured
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                        <TableHead className="whitespace-nowrap dark:text-gray-300">
                          Date
                        </TableHead>
                        <TableHead className="whitespace-nowrap dark:text-gray-300">
                          Status
                        </TableHead>
                        <TableHead className="whitespace-nowrap dark:text-gray-300">
                          Hours
                        </TableHead>
                        <TableHead className="whitespace-nowrap dark:text-gray-300">
                          Interval
                        </TableHead>
                        <TableHead className="text-right whitespace-nowrap dark:text-gray-300">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overrides.map((override) => (
                        <TableRow
                          key={override.id}
                          className="dark:border-gray-700 dark:hover:bg-gray-700/50"
                        >
                          <TableCell className="whitespace-nowrap dark:text-gray-300">
                            {override.date}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant={
                                override.is_available
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                override.is_available
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  : ""
                              }
                            >
                              {override.is_available
                                ? "Available"
                                : "Unavailable"}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap dark:text-gray-300">
                            {override.is_available
                              ? `${formatTimeDisplay(
                                  override.start_time || ""
                                )} - ${formatTimeDisplay(
                                  override.end_time || ""
                                )}`
                              : "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap dark:text-gray-300">
                            {override.is_available
                              ? `${override.interval_minutes} mins`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="dark:hover:bg-gray-700/30"
                                >
                                  <MoreVertical className="h-4 w-4 dark:text-gray-300" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white dark:bg-gray-800 dark:border-gray-700"
                              >
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    handleEditOverride(override, e)
                                  }
                                  className="text-blue-600 dark:text-blue-400 dark:hover:bg-gray-700/50"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700/50"
                                  onClick={(e) =>
                                    handleDeleteOverride(override.id, e)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isOverrideDialogOpen}
        onOpenChange={setIsOverrideDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {currentOverride?.id ? "Edit Special Date" : "Add Special Date"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="override-date" className="dark:text-gray-300">
                Date
              </Label>
              <Input
                id="override-date"
                type="date"
                value={currentOverride?.date || ""}
                onChange={(e) =>
                  setCurrentOverride((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Switch
                checked={currentOverride?.is_available || false}
                onCheckedChange={(checked) =>
                  setCurrentOverride((prev) => ({
                    ...prev,
                    is_available: checked,
                  }))
                }
                className="data-[state=checked]:bg-blue-500"
              />
              <Label className="text-base dark:text-gray-300">
                {currentOverride?.is_available ? "Available" : "Unavailable"}
              </Label>
            </div>

            {currentOverride?.is_available && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block dark:text-gray-300">
                      Start Time
                    </Label>
                    <TimePicker
                      value={currentOverride?.start_time || "09:00"}
                      onChange={(value) =>
                        setCurrentOverride((prev) => ({
                          ...prev,
                          start_time: value,
                        }))
                      }
                      placeholder="Start time"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block dark:text-gray-300">
                      End Time
                    </Label>
                    <TimePicker
                      value={currentOverride?.end_time || "17:00"}
                      onChange={(value) =>
                        setCurrentOverride((prev) => ({
                          ...prev,
                          end_time: value,
                        }))
                      }
                      placeholder="End time"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">
                    Interval (minutes)
                  </Label>
                  <Select
                    value={
                      currentOverride?.interval_minutes?.toString() || "60"
                    }
                    onValueChange={(value) =>
                      setCurrentOverride((prev) => ({
                        ...prev,
                        interval_minutes: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="max-w-[180px] bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 dark:border-gray-700">
                      {INTERVAL_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                          className="dark:hover:bg-gray-700/50 dark:text-white"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveOverride}
              disabled={!currentOverride?.date}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteOverrideDialogOpen}
        onOpenChange={setIsDeleteOverrideDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Delete Special Date
            </DialogTitle>
          </DialogHeader>
          <p className="dark:text-gray-300">
            Are you sure you want to delete this special date?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOverrideDialogOpen(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOverrideConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilityPage;
