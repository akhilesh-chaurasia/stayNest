const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

async function getCoordinates(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "wanderlust-project" }
  });
  const data = await res.json();

  if (!data || data.length === 0) {
    return { type: "Point", coordinates: [] };
  }

  return {
    type: "Point",
    coordinates: [
      Number(data[0].lon),
      Number(data[0].lat),
    ],
  };
}

async function fixListings() {
  const listings = await Listing.find({ geometry: { $exists: false } });

  for (let listing of listings) {
    const geometry = await getCoordinates(listing.location);
    listing.geometry = geometry;
    await listing.save();
    console.log(`Fixed: ${listing.title}`);
  }

  mongoose.connection.close();
}

fixListings();
