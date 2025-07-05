"use client";

import { useAuth } from "@/context/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Save,
  Clock,
  X,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";

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
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

const formatTimeDisplay = (time) => {
  if (!time) return "";
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function AvailabilityPage() {
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
      is_available: weekday !== "saturday" && weekday !== "sunday",
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

  const handleAddBreak = (weekday) => {
    setAvailabilities((prev) =>
      prev.map((avail) =>
        avail.weekday === weekday
          ? {
              ...avail,
              breaks: [
                ...avail.breaks,
                {
                  id: `temp-${Date.now()}`,
                  availability_id: avail.id,
                  start_time: "12:00",
                  end_time: "13:00",
                },
              ],
            }
          : avail
      )
    );
    setHasChanges(true);
  };

  const handleBreakChange = (weekday, breakId, field, value) => {
    setAvailabilities((prev) =>
      prev.map((avail) =>
        avail.weekday === weekday
          ? {
              ...avail,
              breaks: avail.breaks.map((br) =>
                br.id === breakId ? { ...br, [field]: value } : br
              ),
            }
          : avail
      )
    );
    setHasChanges(true);
  };

  const handleRemoveBreak = (weekday, breakId) => {
    setAvailabilities((prev) =>
      prev.map((avail) =>
        avail.weekday === weekday
          ? {
              ...avail,
              breaks: avail.breaks.filter((br) => br.id !== breakId),
            }
          : avail
      )
    );
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
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

  const handleAddOverride = () => {
    setCurrentOverride({
      business_id: user?.id,
      date: new Date().toISOString().split("T")[0],
      is_available: true,
      start_time: "09:00",
      end_time: "17:00",
      interval_minutes: 60,
    });
    setIsOverrideDialogOpen(true);
  };

  const handleEditOverride = (override) => {
    setCurrentOverride({
      ...override,
      // Ensure we're working with the UTC times in the dialog
      start_time: override.start_time || "09:00",
      end_time: override.end_time || "17:00",
    });
    setIsOverrideDialogOpen(true);
  };

  const handleDeleteOverride = (id) => {
    setOverrideToDelete(id);
    setIsDeleteOverrideDialogOpen(true);
  };

  const handleSaveOverride = async () => {
    try {
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
    }
  };

  const handleDeleteOverrideConfirm = async () => {
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

  const VisualSchedule = () => {
    const timeSlots = generateTimeSlots();

    return (
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-8 border-b sticky top-0 bg-white dark:bg-gray-900 z-10">
            <div className="p-2 font-medium border-r text-sm">Time</div>
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="p-2 font-medium text-center border-r text-sm last:border-r-0"
              >
                {WEEKDAY_LABELS[day]}
              </div>
            ))}
          </div>
          {timeSlots.map((time) => {
            const [hour, minute] = time.split(":").map(Number);
            const isHalfHour = minute === 30;
            const displayTime = `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;

            return (
              <div
                key={time}
                className={`grid grid-cols-8 border-b ${
                  isHalfHour ? "bg-gray-50 dark:bg-gray-800" : ""
                }`}
              >
                <div className="p-2 border-r text-xs text-muted-foreground">
                  {displayTime}
                </div>
                {WEEKDAYS.map((day) => {
                  const dayAvailability = availabilities.find(
                    (a) => a.weekday === day
                  );
                  if (!dayAvailability) return null;

                  const isAvailable = dayAvailability.is_available;
                  const isWorkingHour =
                    isAvailable &&
                    time >= dayAvailability.start_time &&
                    time < dayAvailability.end_time;

                  const isBreakTime = isWorkingHour
                    ? dayAvailability.breaks.some(
                        (br) => time >= br.start_time && time < br.end_time
                      )
                    : false;

                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`p-1 border-r text-center ${
                        isWorkingHour
                          ? isBreakTime
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                      title={
                        isWorkingHour
                          ? isBreakTime
                            ? `Break: ${dayAvailability.breaks
                                .filter(
                                  (br) =>
                                    time >= br.start_time && time < br.end_time
                                )
                                .map((br) => `${br.start_time}-${br.end_time}`)
                                .join(", ")}`
                            : `Available (${dayAvailability.start_time}-${dayAvailability.end_time})`
                          : "Unavailable"
                      }
                    >
                      {isWorkingHour ? (
                        isBreakTime ? (
                          <Clock className="h-3 w-3 mx-auto text-red-500 dark:text-red-400" />
                        ) : (
                          <Check className="h-3 w-3 mx-auto text-green-500 dark:text-green-400" />
                        )
                      ) : (
                        <X className="h-3 w-3 mx-auto text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const RecurringAvailabilityCard = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle className="text-lg md:text-xl">Weekly Schedule</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            {hasChanges && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-200 self-start"
              >
                Unsaved Changes
              </Badge>
            )}
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
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
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {availabilities.map((availability) => (
              <div
                key={availability.weekday}
                className="p-3 md:p-4 border rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={availability.is_available}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(
                          availability.weekday,
                          "is_available",
                          checked
                        )
                      }
                      className="data-[state=checked]:bg-blue-500"
                    />
                    <Label className="text-sm sm:text-base">
                      {WEEKDAY_LABELS[availability.weekday]}
                    </Label>
                  </div>
                  {!availability.is_available && (
                    <Badge
                      variant="outline"
                      className="self-start sm:self-auto"
                    >
                      Unavailable
                    </Badge>
                  )}
                </div>

                {availability.is_available && (
                  <div className="space-y-4 ml-0 sm:ml-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="mb-1 block text-sm">Start Time</Label>
                        <TimePicker
                          value={availability.start_time}
                          onChange={(value) =>
                            handleAvailabilityChange(
                              availability.weekday,
                              "start_time",
                              value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="mb-1 block text-sm">End Time</Label>
                        <TimePicker
                          value={availability.end_time}
                          onChange={(value) =>
                            handleAvailabilityChange(
                              availability.weekday,
                              "end_time",
                              value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Interval (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={availability.interval_minutes}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              availability.weekday,
                              "interval_minutes",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <Label className="text-sm">Breaks</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBreak(availability.weekday)}
                          className="text-blue-500 border-blue-200 hover:bg-blue-50 w-full sm:w-auto"
                        >
                          <Plus className="h-3 w-3 mr-1 sm:mr-2" />
                          Add Break
                        </Button>
                      </div>

                      {availability.breaks.length === 0 ? (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          No breaks scheduled
                        </p>
                      ) : (
                        // In the RecurringAvailabilityCard component, update the breaks section:
                        <div className="space-y-2">
                          {availability.breaks.map((br) => (
                            <div
                              key={br.id}
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full"
                            >
                              <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                                <div className="w-full">
                                  <TimePicker
                                    value={br.start_time}
                                    onChange={(value) =>
                                      handleBreakChange(
                                        availability.weekday,
                                        br.id,
                                        "start_time",
                                        value
                                      )
                                    }
                                  />
                                </div>
                                <div className="w-full">
                                  <TimePicker
                                    value={br.end_time}
                                    onChange={(value) =>
                                      handleBreakChange(
                                        availability.weekday,
                                        br.id,
                                        "end_time",
                                        value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveBreak(availability.weekday, br.id)
                                }
                                className="px-2 sm:px-3"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Availability Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Configure your regular hours and special dates
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 sm:space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="overrides">Special Dates</TabsTrigger>
          <TabsTrigger value="visual">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <RecurringAvailabilityCard />
        </TabsContent>

        <TabsContent value="overrides" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-lg md:text-xl">
                  Special Dates
                </CardTitle>
                <Button
                  onClick={handleAddOverride}
                  className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
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
                <p className="text-muted-foreground text-center py-8">
                  No special dates configured
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">
                          Date
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Hours
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Interval
                        </TableHead>
                        <TableHead className="text-right whitespace-nowrap">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overrides.map((override) => (
                        <TableRow key={override.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(override.date).toLocaleDateString()}
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
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                              }
                            >
                              {override.is_available
                                ? "Available"
                                : "Unavailable"}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {override.is_available
                              ? `${formatTimeDisplay(
                                  override.start_time || ""
                                )} - ${formatTimeDisplay(
                                  override.end_time || ""
                                )}`
                              : "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {override.is_available
                              ? `${override.interval_minutes} mins`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditOverride(override)}
                                  className="text-blue-600"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={() =>
                                    handleDeleteOverride(override.id)
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

        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Weekly Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VisualSchedule />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isOverrideDialogOpen}
        onOpenChange={setIsOverrideDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentOverride?.id ? "Edit Special Date" : "Add Special Date"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="override-date">Date</Label>
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
              <Label className="text-base">
                {currentOverride?.is_available ? "Available" : "Unavailable"}
              </Label>
            </div>

            {currentOverride?.is_available && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Start Time</Label>
                    <TimePicker
                      value={currentOverride?.start_time || "09:00"}
                      onChange={(value) =>
                        setCurrentOverride((prev) => ({
                          ...prev,
                          start_time: value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">End Time</Label>
                    <TimePicker
                      value={currentOverride?.end_time || "17:00"}
                      onChange={(value) =>
                        setCurrentOverride((prev) => ({
                          ...prev,
                          end_time: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Interval (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentOverride?.interval_minutes || 60}
                    onChange={(e) =>
                      setCurrentOverride((prev) => ({
                        ...prev,
                        interval_minutes: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveOverride}
              disabled={!currentOverride?.date}
              className="bg-blue-500 hover:bg-blue-600"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Special Date</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this special date?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOverrideDialogOpen(false)}
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
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
