// dotenv use here
if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const ejsMate = require('ejs-mate');
const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
     .then(()=>{
        console.log("connected to DB");
     });
     
async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// concept of ejs-mate
app.engine("ejs",ejsMate);
// for public folder
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

// expresss session
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
    }
};




app.use(session(sessionOptions));
app.use(flash());

// authenticate concept 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //  (req.user)-> se ham pta kar sakte hai ki kaun sa user login hai || ye ham navbar me login and signup ko ak sath dikhane aur logout ko
    //  alag dikhane ke liye define kiya hai aur isko ham navbar me access karenge
    next(); // is middleware ka use ham index.ejs me karenge because /listings pe redirect ho rha hai router
});

// create new user for authentication
app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"studdent@gmail.com",
        username:"delta-student",
    });

    let registeredUser = await User.register(fakeUser , "helloworld");
    //register(user, password, cb) Convenience method
    //  to register a new user instance with a given password. Checks if username is unique.
    res.send(registeredUser);
})
app.get("/akhileshuser",async(req,res)=>{
    let fakeUser = new User({
        email:"akhilesh@gmail.com",
        username:"akhilesh-chaurasia",
    });

    let registeredUser = await User.register(fakeUser , "helloworld");
    //register(user, password, cb) Convenience method
    //  to register a new user instance with a given password. Checks if username is unique.
    res.send(registeredUser);
})

// yaha router ke ander ke listing ko require kiya gya hai
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/",userRouter);


// regix
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// custom error handler 
app.use((err,req,res,next)=>{
    let{status , message} = err;
    res.render("error.ejs",{message});
    //res.status(status).send(message);
    
});

app.listen(8080 , ()=>{
    console.log("server is listening to port 8080");
});