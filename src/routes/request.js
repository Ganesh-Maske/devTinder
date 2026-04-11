const express = require("express");
const requestRouter =express.Router();

const userAuth = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("sending a connection request");

    const user = req.user; 

    res.send(`${user.firstName} connection request sent!`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports=requestRouter;