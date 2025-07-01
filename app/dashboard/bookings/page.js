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
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { da } from "date-fns/locale";

const ITEMS_PER_PAGE = 5;

export default function BookingsOverviewPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("Your Business");
  const [bookings, setBookings] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [filter, setFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  const [customDate, setCustomDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const bookingLink = `https://schedulee.app/book/${user?.id}`;

  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await fetch(`/api/getBookSettings?id=${user?.id}`);
        const data = await response.json();
        setBusinessName(data.businessName);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    getSettings();
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingLink);
    toast.success("Booking link copied to clipboard!");
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        filter,
        page: currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        ...(filter === "custom" && {
          customDate: customDate.toISOString().split("T")[0],
        }),
      });

      const response = await fetch(`/api/bookings?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        const formattedBookings = data.bookings.map((booking) => ({
          ...booking,
          date: booking.booking_date,
          time: booking.booking_time.slice(0, 5),
        }));

        setBookings(formattedBookings);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.error || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, filter, currentPage, customDate]);

  const handleEdit = (booking) => {
    setCurrentBooking({
      ...booking,
      date: booking.date,
      time: booking.time,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bookingToDelete }),
      });

      if (response.ok) {
        toast.success("Booking deleted successfully");
        fetchBookings();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete booking");
      }
    } catch (error) {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentBooking),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `Booking ${currentBooking.id ? "updated" : "created"} successfully`
        );
        fetchBookings();
        setIsDialogOpen(false);
      } else {
        const data = await response.json();
        throw new Error(
          data.error ||
            `Failed to ${currentBooking.id ? "update" : "create"} booking`
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddNew = () => {
    setCurrentBooking({
      id: "",
      name: "",
      phone: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00",
    });
    setIsDialogOpen(true);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filterLabels = {
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
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="grid gap-6">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {businessName}
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and appointments
          </p>
        </div>

        {/* Booking Link Card with improved truncation */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Your Booking Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-mono p-2 bg-muted rounded-md truncate text-ellipsis whitespace-nowrap">
                  {bookingLink}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
            </div>
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="next7">Next 7 days</SelectItem>
                <SelectItem value="upcoming">All upcoming</SelectItem>
                <SelectItem value="past30">Past 30 days</SelectItem>
                <SelectItem value="recent">Recently booked</SelectItem>
                <SelectItem value="all">All bookings</SelectItem>
                <SelectItem value="custom">Custom date</SelectItem>
              </SelectContent>
            </Select>

            {filter === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? (
                      format(customDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Add Booking Button */}
          <Button
            onClick={handleAddNew}
            className="sm:ml-auto bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Booking
          </Button>
        </div>

        {/* Active Filter Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            {filterLabels[filter] || "All Bookings"}
          </Badge>
          {!isLoading && bookings.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          )}
        </div>

        {/* Table Card */}
        <Card>
          {isLoading ? (
            <TableSkeleton />
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No bookings found for the selected filter.
            </div>
          ) : (
            <>
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Customer
                    </TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Contact
                    </TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Date
                    </TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Time
                    </TableHead>
                    <TableHead className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/50">
                      <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {booking.name}
                      </TableCell>
                      <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {booking.phone_number}
                      </TableCell>
                      <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {format(new Date(booking.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {booking.time}
                      </TableCell>
                      <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(booking)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
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
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentBooking?.id ? "Edit Booking" : "New Booking"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={currentBooking?.name || ""}
                  onChange={(e) =>
                    setCurrentBooking({
                      ...currentBooking,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={currentBooking?.phone || ""}
                  onChange={(e) =>
                    setCurrentBooking({
                      ...currentBooking,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentBooking?.date || ""}
                    onChange={(e) =>
                      setCurrentBooking({
                        ...currentBooking,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={currentBooking?.time || ""}
                    onChange={(e) =>
                      setCurrentBooking({
                        ...currentBooking,
                        time: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                {currentBooking?.id ? "Save Changes" : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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
