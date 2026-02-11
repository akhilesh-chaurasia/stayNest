
const User = require("../models/user");

// get signup
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

// post signup
module.exports.signup = async(req,res)=>{
    try{
        let { username,email,password} = req.body;
    const newUer = new User({username,email, password});
    const registeredUser = await User.register(newUer , password);
    console.log(registeredUser);

    // login inside signup -> agar user signup kiya to wo automatically login bhi ho jayega
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to Wanderlust!");
         res.redirect("/listings");
    });
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  };

//   get request for login form
  module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

// post request for login form
module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    // agar ham direct navbar se login kare to isLoggedIn middleware trigger nahi hoga to 
    let redirectUrl = res.locals.redirectUrl|| "/listings";
    // res.redirect("/listings");
    res.redirect(redirectUrl);
 };


//  request for logout form 
 module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are loggeed out!");
        res.redirect("/listings");
    });
};