 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
 const passportLocalMongoose = require("passport-local-mongoose").default;// new version of passport-local-mongoose


 const userSchema = new Schema ({
    email:{
        type:String,
        required:true,
    },
 });


 userSchema.plugin(passportLocalMongoose);//it generate bydefault password with hashing 
 // and salting and username so no need to define password and username implicitely

 module.exports = mongoose.model("User",userSchema);