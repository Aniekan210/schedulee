export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // Here you would normally query your database or external service
  // For now, we'll use mock data similar to your original implementation

  try {
    // Simulate database/API delay
    const mockTimes = [
      "09:00 AM",
      "10:30 AM",
      "11:00 AM",
      "01:30 PM",
      "02:15 PM",
      "03:45 PM",
      "04:30 PM",
    ];

    // Filter based on some condition
    const availableTimes = mockTimes.filter(() => Math.random() > 0.3);

    return Response.json({
      availableTimes: availableTimes.length
        ? availableTimes
        : ["No available times"],
      dateRequested: date,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return Response.json(
      { availableTimes: ["Error loading times"] },
      { status: 500 }
    );
  }
}
