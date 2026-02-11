
// functionality of data.js
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
 .then(()=>{
    console.log("connect to DB");
 })
 .catch((err)=>{
    console.log(err);
 });

 async function main(){
    await mongoose.connect(MONGO_URL);
 }

 const initDB = async()=>{
    // previous data delete
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>
      ({...obj,owner:"6942df4759936592ff51397e"}));
    // insert new data
    await Listing.insertMany(initData.data);
    // here initData is object and data is key 
    console.log("data was initialized");
 };

 initDB();