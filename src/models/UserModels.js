require("dotenv").config();
const mongoose = require("mongoose");
// It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
const validator = require("validator");
// it is used for custome validation.
const bcrypt = require("bcryptjs");
//HASHING
const jwt = require("jsonwebtoken");
// https://jwt.io/introduction
// jwt is a json object used for many things like authentication, sharing informations.
// structure of jwt ------> header.payload("unique key + time of creation"(payload)).signature(secretkey)

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, unique: false },
  email: {
    type: String,
    // required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  phone: {
    type: Number,
    unique: false,
    required: true,
    minlength: 10,
  },
  password: { type: String, required: true, unique: true },
  confirmPassword: { type: String, required: true, unique: true },
  pincode: { type: Number, required: true, unique: false },
  city: { type: String, required: true, unique: false },
  address: { type: String, unique: false, required: true },
  locality: { type: String, unique: false },
  landmark: { type: String, unique: false },
  tokens: [
    {
      token: String,
      // required: true,
    },
  ],
},{
  timestamps:true
});
// a Schema object in your application code that maps to a collection in your MongoDB database.
// A Mongoose schema defines the structure of the document, default values, validators, etc

// implenting jwt token
// we have to create a token thats why we are creating this function("generateJwtToken") and we are using methods because on controllers page we are invoking it on a instance
UserSchema.methods.generateJwtToken = async function (req, res) {
  try {
    // jwt.sign is a inbuilt function methoed to create a function 
    // as a first parameter we are giving it a unique key so that it gets a idea on which document it have to create the token and second parameter is a secret key or signature 
    // and then we are saving that token into our database collection by using (this.save())

    const token = jwt.sign(
      { _id: this._id },
      "iamlearningauthenticationfromthapa"
    );
    this.tokens = this.tokens.concat({ token: token });
  
    const out = await this.save();
    // console.log("out", out)
  
    return token;
  } catch (e) {
    console.log(e);
  }
};

// implenting hashing in this
// pre is methoed is saying before save implement this function.
// isModified is using if only password get chagne then work 
UserSchema.pre("save", async function (req, res, next) {
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 4);
    // way of hashing the password
    this.confirmPassword = await bcrypt.hash(this.password, 4);
    console.log("this.password" + this.password);
  }
 
 

  next();
  // is is saying no you can go ahead (aage badho)
});


const Users = mongoose.model("users", UserSchema);
// The mongoose. model() function of the mongoose module is used to create a collection of a particular database of MongoDB.
module.exports = Users;
