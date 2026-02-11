const Listing = require("../models/listing");
const Review = require("../models/review");

// for create Review Route
module.exports.createReview = async (req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let  newReview = new Review(req.body.review);
    // new review create karne ke bad agar same author login hoga tabhi push karenge
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);//review ka jao hamne array create kiya tha ushi me hamne llush kiya hai

    await newReview.save();
    await listing.save(); //save() ak async function hai isliye hamne await use kiya hai
    req.flash("success" , "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
};

// for delete review Route
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }   // Works if reviewId is ObjectId in schema
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")

    res.redirect(`/listings/${id}`);
};