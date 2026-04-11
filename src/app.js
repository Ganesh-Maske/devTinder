const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");  
const { validateSignupData } = require("./utils/validation");
const bcrypt=require("bcrypt");
const cookieparser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const userAuth = require("./middlewares/auth");


const app = express();
app.use(express.json());
app.use(cookieparser());
/////


app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user add successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});
  
/////
app.get("/user", async (req,res)=>{
  const useremail = req.body.emailId;
  // try{
  //  const user = await User.findOne({ emailId: useremail });
  //   if(!user){
  //     res.status(404).send("user not found");
  //   }else{
  //     res.send(user);
  //   }

    try{
   const users = await User.find({ emailId: useremail });
    if(users.length === 0){
      res.status(404).send("user not found");
    }else{
      res.send(users);
    }

  }catch(err){
    res.status(400).send("somthing went wrong");
  }
});

//////
app.get("/feed",async(req,res)=>{
 try{
  const users = await User.find({})
  res.send(users)
 }catch(err){
  res.status(400).send("something went wrong");
 }
});

/////
app.delete("/user", async(req,res)=>{
  const userId =req.body.userId;
  try{
    //const User =await User .findByIdAndDelete({_id:userId});
    const user = await User .findByIdAndDelete(userId);
    res.send("user deleted Successfully");
  }catch(err){
    res.status(400).send("something went wrong");
  }
});

/////
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const ALLOWED_UPDATE = ["photoURL", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data.skill && data.skill.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // 👇 तुझा expected output
    res.send("User updated successfully");

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//////
app.get("/profile",userAuth, async(req,res)=>{
  try{
    const user =req.user;
    res.send(user);
  }catch(err){
    res.status(400).send("Error :"+err. message);
  }
});

//////
app.post("/sendconnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("sending a connection request");

    const user = req.user; 

    res.send(user.firstName + " connection request sent!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

/////
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordvalid = await user.validatePassword(password);

    if (isPasswordvalid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Successfully !!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("Server is Successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected!!");
  });