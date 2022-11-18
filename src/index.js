require("dotenv").config();
// WE ARE USING THIS SO THAT WE CAN KEEP OUR SECRET THINGS INTO THE .env FILE. AND LATER ON WE CAN USE THAT FILE WITH THE HELP OF process.en.FILE-NAME


const express = require("express");
const app = express();
const hbs = require("hbs");
// HBS IS USED TO RENDER WEB PAGES TO THE CLIENT SIDE FROM DATA ON THE SERVER SIDE.
//  To use handlebars in express, we need to store HTML code into a .hbs extension in the 'views' folder in the source directory as hbs looks for the pages in the views folder. 
//  WE JUST INSTALL IT BE COMMAND "npm i hbs".


const bcrypt = require("bcryptjs");
//BCRYPTJS IS USED FOR SENSITIVE DATAS (STORING PASSWORDS) INTO HASH PASSWORDS INSTEAD OF PLAIN TEXT.

const path = require("path");
// The Path module provides a way of working with directories and file paths.

require("./db/config");
// IT IS USED FOR ACCESSING THE DATABASE INTO THE MAINE FILE.
const cookieParser = require("cookie-parser");
// cookie-parser is a middleware which parses cookies attached to the client request object.
//  To use it, we will require it in our index. js file; this can be used the same way as we use other middleware.
// IN OTHER WORDS -----
// COOKIE PARSER IS USED TO SHOW TO COOKIES THE THAT WE SAVED IN BROWSER THROUGH "-----req.cookies.COOKIE_NAME" THIS COMMANED . 
// WE NEED VALUE OF COOKIE SO THAT WE CAN COMPARE THE JWT FROM BROWSER AND FROM THE DATABASE. IF BOTH ARE SAME THEN WE CAN GIVE ACCESS TO THAT PAGE OTHERWISE WWE SHOW THE  ERROR.(IN SOME CASES)

const UserModels = require("../src/models/UserModels");
// IT IS FOR USING THE SCHEMAS 
const router = require("./controllers/UserControllers");
// IT IS FOR USING THE CONTROLLERS
const auth = require("./middlewares/tokenVerify");
const { registerPartials } = require("hbs");
// IT IS A MIDDLEWARE THAT WE USE FOR COOKIE-BASED AUTHENTICATION.
// IF WE PASS THIS MIDDLEWARE TO ANY CONTROLLER THAT MEANS YOU ARE VALIDATING THAT EITHER THAT COOKIE VALUE (JWT) IS SAME THAT YOU HAVE(JWT) IN YOUR DATABASE.
// IF THE BROWSER COOKIE VALUE IS SAME AS THAT YOU HAVE THEN YOU HAVE ACCESS TO THAT PAGE OTHERWISE IT WILL THROW YOU THE ERROR


const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../src/templates/views");
const partialsPath = path.join(__dirname, "../src/templates/partials");
// connecting to the files and folders

app.use(express.json());
// It parses incoming JSON requests and puts the parsed data in req.
// THIS LINE IS MAINLY USED TO PARSE THE DATA OF REQUEST THAT WE PUT IN BODY AS A PAYLOAD SO THAT WE CAN USE THAT IN OUR CODE
// app.use(express.urlencoded({ extended: false }));

// CONTROLLERTS
app.use(express.static(staticPath));
// The express.static() function is a built-in middleware function in Express. It serves static files and is based on serve-static
app.set("view engine", "hbs");
app.set("views", viewsPath);
// METHOEDS TO USE HBS


hbs.registerPartials(partialsPath);
// we use registerPartials for reusable code like navbar and for reusable code we have to make a new folder names partials and then make the file inside that and just do this ({{>Navbar}})

app.use(cookieParser())
// COOKIE PARSER IS USED TO SHOW TO COOKIES THE THAT WE SAVED IN BROWSER THROUGH "-----req.cookies.COOKIE_NAME" THIS COMMANED . WE NEED VALUE OF COOKIE SO THAT WE CAN COMPARE THE JWT FROM BROWSER AND FROM THE DATABASE. IF BOTH ARE SAME THEN WE CAN GIVE ACCESS TO THAT PAGE OTHERWISE WWE SHOW THE  ERROR.
app.use(express.urlencoded({ extended: false }));
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(router);

// SERVER

app.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
});

// The app. listen() function is used to bind and listen the connections on the specified host and port.
