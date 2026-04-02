const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");  


const app = express();
app.use(express.json());
/////
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
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

app.patch("/user", async(req,res)=>{
  const userId =req.body.userId;
  const data = req.body;
  try{
    const user = await User .findByIdAndUpdate({_id:userId},data,{rteunDocument:"after", 

    });
    console.log(user);
    res.send("user deleted Successfully");
  }catch(err){
    res.status(400).send("something went wrong");
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