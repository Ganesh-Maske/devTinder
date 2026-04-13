const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

 const userSchema = new mongoose.Schema({
      firstName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50,
      },
      lastName:{
        type:String,
      },
      emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
      },
      password:{
        type:String,
        required:true,
        validate(value){
          if(!validator.isStrongPassword(value)){
           throw new Error("enter a strong password:" + value);
          }
        },
      },
      age:{
        type:Number,
        
        min:10,
      },
      gender:{
        type:String,
        
        validate (value){
          if(!["male","female","other"].includes(value)){
              throw new Error ("Gender data is not valid")
          }
        },
      },
      photoUrl:{
        type:String,
        default:""
      },
      about:{
        type:String,
        default:"this is a defult about of the user!",
      },
      skills:{
        type:[String],
      },
    },
    {
      timestamps:true,
    },
 );
  
 //userSchema.index({firstName:1,});


// JWT method
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    "DEV@Tinder$790",
    { expiresIn: "7d" }
  );
  return token;
};

// ✅ Password validation method (OUTSIDE)
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};


module.exports = mongoose.model("User", userSchema);