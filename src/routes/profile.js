const express =require("express");
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

module.exports = profileRouter;