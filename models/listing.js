// first step of project that is create collections
// which is within the model folder , this is the first collection 
const express = require("express");
const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;
const {CATEGORIES} = require("../utils/categories"); 

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    image:{
        url:String,
        filename:String,   // image ke liye updated
    },
    price:Number,
    location:String,
    country:String,

    // for reviews
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

    category:{
        type:String,
        enum:CATEGORIES.map(ele=>ele.name),//comming from utils/category 
        required:true
    },

    geometry:{
       type:{
         type:String,
         enum:["Point"],
         required:true,
       },
       coordinates:{
         type:[Number],
         required:true
       },
    },
});

// mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews} });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;