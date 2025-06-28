export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  try {
    //code to get settigs from db
    let settings = {
        bgColor: "#84bfe0",
        logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXsZmib0oY_RGJbewv7i1FqOcvmIaNDRNRsw&s",
        businessName: "Aniekan's Business"
    };

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}