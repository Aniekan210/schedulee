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
  Filter,
  ChevronLeft,
  ChevronRight,
  Copy,
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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ITEMS_PER_PAGE = 5;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const FILTER_OPTIONS = {
  today: "Today",
  tomorrow: "Tomorrow",
  next7: "Next 7 Days",
  upcoming: "All Upcoming",
  past30: "Past 30 Days",
  recent: "Recently Booked",
  all: "All Bookings",
  custom: "Custom Date",
};

const TableSkeleton = () => (
  <div className="space-y-4 p-6">
    {[...Array(5)].map((_, i) => (
      <Skeleton
        key={i}
        className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-800"
      />
    ))}
  </div>
);

const formatDisplayDate = (dateString) => {
  try {
    const date = new Date(dateString + "T00:00:00");
    return format(date, "MMM do, yyyy");
  } catch {
    return dateString;
  }
};

const formatDisplayTime = (timeString) => {
  try {
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${(minutes || "00").padStart(2, "0")}`;
  } catch {
    return timeString;
  }
};

export default function BookingsOverviewPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("Your Business");
  const [timezone, setTimezone] = useState("America/Halifax");
  const [bookings, setBookings] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [filter, setFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  const [customDate, setCustomDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [totalBookings, setTotalBookings] = useState(0);

  const bookingLink = `${process.env.NEXT_PUBLIC_SITE_URL}/book/${user?.id}`;

  // Fetch business settings
  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await fetch(`/api/form-settings?id=${user?.id}`);
        const data = await response.json();
        setBusinessName(data.businessName);
        setTimezone(data.timezone || "America/Halifax");
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    if (user) {
      getSettings();
    } else {
      window.location.href = "/login";
    }
  }, [user]);

  // Fetch bookings function
  const fetchBookings = async () => {
    setIsLoading(true);
    if (!user) return;

    try {
      const params = new URLSearchParams({
        filter,
        page: currentPage,
        itemsPerPage,
        timezone,
        ...(filter === "custom" && {
          customDate: customDate.toISOString().split("T")[0],
        }),
      });

      const response = await fetch(`/api/bookings?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.bookings) {
        setBookings(data.bookings);
        setTotalPages(data.totalPages || 1);
        setTotalBookings(data.totalCount || 0);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Fetch bookings error:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on dependencies change
  useEffect(() => {
    fetchBookings();
  }, [user, filter, currentPage, customDate, timezone, itemsPerPage]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingLink);
    toast.success("Booking link copied to clipboard!");
  };

  const handleEdit = (booking) => {
    setCurrentBooking({
      id: booking.id,
      name: booking.name,
      email: booking.email,
      booking_date: booking.booking_date,
      booking_time: booking.booking_time,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setBookingToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingToDelete }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Booking deleted successfully");
        fetchBookings(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error(error.message);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = currentBooking.id ? "PUT" : "POST";
      const url = "/api/bookings";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentBooking,
          timezone,
          business_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.id) {
        toast.success(
          `Booking ${currentBooking.id ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        fetchBookings();
      } else {
        throw new Error(data.error || "Failed to save booking");
      }
    } catch (error) {
      console.error("Save booking error:", error);
      toast.error(error.message);
    }
  };

  const handleAddNew = () => {
    const now = new Date();
    setCurrentBooking({
      id: "",
      name: "",
      email: "",
      booking_date: now.toISOString().split("T")[0],
      booking_time: now.getHours().toString().padStart(2, "0") + ":00",
    });
    setIsDialogOpen(true);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 dark:bg-gray-900 min-h-screen">
      {/* Header and Booking Link Card */}
      <div className="grid gap-4">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Welcome {businessName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
            Manage your bookings and appointments
          </p>
        </div>

        <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-xs text-muted-foreground dark:text-gray-400 uppercase tracking-wider">
              Your Booking Link
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center gap-2 w-full">
              <p className="flex-1 min-w-0 truncate bg-muted dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm font-mono dark:text-gray-300">
                {bookingLink}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white h-9"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              Filter:
            </span>
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {Object.entries(FILTER_OPTIONS).map(([key, label]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:text-white"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filter === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(customDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                    className="dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            )}

            <div className="flex items-center gap-2">
              <Button
                onClick={fetchBookings}
                variant="outline"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  Per page:
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[80px] bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem
                        key={option}
                        value={option.toString()}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:text-white"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        </div>

        {/* Active Filter Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300"
          >
            {FILTER_OPTIONS[filter]}
          </Badge>
          {!isLoading && (
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              Showing {bookings.length} of {totalBookings}{" "}
              {totalBookings === 1 ? "booking" : "bookings"}
            </span>
          )}
        </div>

        {/* Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <TableSkeleton />
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground dark:text-gray-400">
              No bookings found for the selected filter.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className="px-6 dark:text-gray-300">
                      Customer
                    </TableHead>
                    <TableHead className="px-6 dark:text-gray-300">
                      Email
                    </TableHead>
                    <TableHead className="px-6 dark:text-gray-300">
                      Date
                    </TableHead>
                    <TableHead className="px-6 dark:text-gray-300">
                      Time
                    </TableHead>
                    <TableHead className="px-6 text-right dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="dark:border-gray-700 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="px-6 dark:text-gray-300">
                        {booking.name}
                      </TableCell>
                      <TableCell className="px-6 dark:text-gray-300">
                        {booking.email}
                      </TableCell>
                      <TableCell className="px-6 dark:text-gray-300">
                        {formatDisplayDate(booking.booking_date)}
                      </TableCell>
                      <TableCell className="px-6 dark:text-gray-300">
                        {formatDisplayTime(booking.booking_time)}
                      </TableCell>
                      <TableCell className="px-6 text-right">
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
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          >
                            <DropdownMenuItem
                              onClick={() => handleEdit(booking)}
                              className="dark:hover:bg-gray-700/50 dark:text-gray-300"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700/50"
                              onClick={() => handleDelete(booking.id)}
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

              {/* Pagination */}
              <div className="flex justify-between items-center px-6 py-4 border-t dark:border-gray-700">
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {currentBooking?.id ? "Edit Booking" : "New Booking"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                Customer Name
              </Label>
              <Input
                id="name"
                value={currentBooking?.name || ""}
                onChange={(e) =>
                  setCurrentBooking((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentBooking?.email || ""}
                onChange={(e) =>
                  setCurrentBooking((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="dark:text-gray-300">
                  Date
                </Label>
                <Input
                  type="date"
                  id="date"
                  value={currentBooking?.booking_date || ""}
                  onChange={(e) =>
                    setCurrentBooking((prev) => ({
                      ...prev,
                      booking_date: e.target.value,
                    }))
                  }
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="dark:text-gray-300">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time"
                  value={currentBooking?.booking_time || ""}
                  onChange={(e) =>
                    setCurrentBooking((prev) => ({
                      ...prev,
                      booking_time: e.target.value,
                    }))
                  }
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
              >
                {currentBooking?.id ? "Save Changes" : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground dark:text-gray-400">
            Are you sure you want to delete this booking?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
