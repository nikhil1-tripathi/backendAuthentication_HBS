const express = require("express");
const router = express.Router();
const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/tokenVerify")

router.get("/", (req, res) => {
  res.render("home");
  // render is used to render pages while send just send the normal text 
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/Wishlist", (req, res) => {
  res.render("Wishlist");
});

router.get("/secure",auth, (req, res) => {
 
  res.render("secure");
});
router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/logout",auth,async (req, res) => {
  // if we put auth middleware in any route  anywhere that means that page will only get render i if that browser has token in his cookie
  try{
  //  SINGLE USER LOGOUT
  // filtering the data for storing the only tokens which is not matched if its matched then we wont save that token into our database
    req.user.tokens = req.user.tokens.filter((currentEle)=> {
      return currentEle.token !== req.token
     })

    //  ALL USER LOGOUT
    // we are just kind of deleting all tokens
    req.user.tokens = []

   res.clearCookie("jwt")
  //  inbuilt methoed for deleting the cookie
   res.status(200).render("login")
    await req.user.save()
    // SAVE THE DATA INTO DATABASE
  }
  catch(e){
    res.status(500).render(e)
  }
  // res.render("logout");
});

router.post("/signin", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  // just taking the password from the request

    if (password === confirmPassword) {
      const registerUser = User({
        name: req.body.name,
        password: password,
        confirmPassword: confirmPassword,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        city: req.body.city,
        locality: req.body.locality,
        landmark: req.body.landmark,
        pincode: req.body.pincode,
      });
      // console.log(`the user data is ${registerUser}`);

      const token = await registerUser.generateJwtToken();
      // invoking generate jwt function


    // methoed to create a cookie 
    // first parameter will be name of cookie and second paramter will be value of cookie and third will be when that cookie will expire
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 3000000),
        httpOnly: true,
        //secure:true
      });
  
      const registered = await registerUser.save();
      res.status(201).send(registered);
    } else {
      res.send("PASSWORD AND CONFIRM PASSWORD ARE NOT SAME");
    }
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});


// LOGIN BHII TO KRLE

router.post("/login", async (req, res) => {
  try {
    let password = req.body.password;
    let email = req.body.email;
    const userData = await User.findOne({ email: email });
    // FINDING THE USER THROUGH THE EMAIL
    // console.log("userData", userData)
    const isMatch = await bcrypt.compare(password, userData.password)
    // COMPARIG THE HASHED PASSWORD AND THE NORMAL WITH INBUILT METHOED(bcrypt.compare())
   

    const token = await userData.generateJwtToken()

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3000000),
      httpOnly: true,
      //secure:true
    });
    // methoed to create a cookie 
    // first parameter will be name of cookie and second paramter will be value of cookie and third will be when that cookie will expire
 
    if (password === userData.password || isMatch) {
      res.status(200).render("home");
    
    } else {
      res.send("INVALID PASSWORD");
    }
  } catch (error) {
    res.status(400).send("error");
  }
});
module.exports = router;


