const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

const auth  =async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        // req.cookies.jwt is used for getting the value of jwt saved in cookie
        
        const verifyToken = jwt.verify(token, "iamlearningauthenticationfromthapa")
        // jwt.verify is a methoed to verify the token from the database and from the cookie
        
        const employeeData = await User.findOne({_id:verifyToken._id});
        // User.findOne is used find the matched user with the id that we get from verified user.
     
        req.token = token;
        req.user = employeeData;
        next()
    } catch(e){
        res.status(400).send("Please Login Again For this page")
    }
   

}

module.exports = auth