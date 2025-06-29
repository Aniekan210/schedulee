export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    //code to get settigs from db
    let settings = {
      bgColor: "#ffffff",
      logoUrl: "/logo.avif",
      businessName: "Schedulee.app",
    };

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
