const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// use of multer for file upload
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});


// Router.route() -> index Route and Create route path same
// for both route so mix them by using Router.route()

router
  .route("/")
  // index Route 
  .get(wrapAsync(listingController.index))
  
  // Create Route
   .post(
     isLoggedIn,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.createListing)
   );

  


// New Route 
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);


router
  .route("/:id")
  // show route
  .get(wrapAsync(listingController.showListing))
  // update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),//for edit image link 
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // delete route
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );


// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
