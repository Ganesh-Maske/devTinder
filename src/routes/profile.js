const express =require("express");
const bcrypt = require("bcrypt");
const profileRouter =express.Router();
const userAuth = require("../middlewares/auth");
const {validateEditProfileData } =require("../utils/validation")

profileRouter.get("/profile/view", userAuth,async(req,res)=>{
  try{
    const user =req.user;
    res.send(user);
  }catch(err){
    res.status(400).send("Error :"+err. message);
  }
});  

profileRouter.patch("/profile/edit", userAuth,async(req,res)=>{
   try{
       if(!validateEditProfileData(req)){
        throw new Error("Inavalid Edit Errror"); 
       }
       const loggedUser = req.user;
    // console.log(loggedUser);
        Object.keys(req.body).forEach((key) => {
      loggedUser[key] = req.body[key];
    });
    // console.log(loggedUser);
    await loggedUser.save(); 

    res.json({message:`${loggedUser.firstName}, your Profile updated successfully`,data:loggedUser} );
   }catch(err){
    res.status(400).send("ERROR:" +err.message);    
   }  
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // check input
    if (!oldPassword || !newPassword) {
      throw new Error("Both passwords are required");
    }

    const user = req.user;

    // 1. verify old password
    const isMatch = await user.validatePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // 2. prevent same password
    if (oldPassword === newPassword) {
      throw new Error("New password cannot be same as old password");
    }

    // 3. hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. save
    user.password = hashedPassword;
    await user.save();

    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = profileRouter;