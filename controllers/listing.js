
const {CATEGORIES} = require("../utils/categories");
const Listing = require("../models/listing");
const { all } = require("../routes/listing");

const getCoordinates = async (location) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "wanderlust-project"
    }
  });

  const data = await res.json();

  //  safety check (mam ke Mapbox jaisa behaviour)
  if (!data || data.length === 0) {
    console.log(" No geocoding result for:", location);
    return {
      type: "Point",
      coordinates: []
    };
  }

  return {
    type: "Point",
    coordinates: [
      parseFloat(data[0].lon),
      parseFloat(data[0].lat)
    ]
  };
};

// index route

module.exports.index = async (req, res) => {
  console.log("QUERY:", req.query);

  const { search, category } = req.query;
  let query = {};

  // Category filter
  if(category){
    query.category = category;
  }

  // Search filter
  if(search){
    query.$or = [
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } }
    ];
  }

  const allListings = await Listing.find(query);

  res.render("listings/index.ejs", { allListings, category, search,CATEGORIES });
};





// for new Route
module.exports.renderNewForm = (req,res)=>{
   res.render("listings/new.ejs",{CATEGORIES});
};

// for show Route
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    // .populate("reviews") ab mai review ke author ka name access ke liye populate karunga
    // nested populate
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
      if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
      }
        // SAFE GUARD FOR MAP
      if (!listing.geometry || listing.geometry.coordinates.length !== 2) {
         listing.geometry = null;
      }
    // pass to the show function 
    res.render("listings/show.ejs",{listing});
};

// for create Route
module.exports.createListing = async(req,res,next)=>{
    //extract url and filename from model/listing for image save
    let url = req.file.path;
    let filename = req.file.filename;
  
    const geometry = await getCoordinates(req.body.listing.location);
    console.log(" Location:", req.body.listing.location);
  console.log(" Geometry:", geometry);
  console.log(
    " Coordinates:",
    geometry.coordinates
  );

       const newListing = new Listing(req.body.listing); 
        // Listing ka owner set kar rahe hain (Mongo khud username nahi deta)
        newListing.owner = req.user._id;

        newListing.image = {url,filename};

        // import Line 
        newListing.geometry = geometry;
        await newListing.save();
      req.flash("success","New Listing Created!");

      res.redirect("/listings"); 
};

// for edit listing
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl , CATEGORIES});
};

// for update Route
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    //update listing 
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file !== "undefined"){ // if file exist then save but not exit then undefined type of
   //  in java script for this purpose
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url , filename};
     await listing.save();
   }
   

   req.flash("success","Review Updated!");
    res.redirect(`/listings/${id}`);
};

// for delete Route
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success" , "Listing Deleted!")
    res.redirect("/listings");
};

