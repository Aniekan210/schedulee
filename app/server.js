"use server"

export async function getBookingPageSettings(username) {
  //do some stuff to get settings
  let settings = {
    bgColor: "#ff2578",
    logoUrl: "",
    businessName: process.env.NEXT_PRIVATE
  };

  return settings;
}