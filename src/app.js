 const express = require("express");

 const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName:"Ganesh", lastName: "Maske"});
 });

 app.post("/user",(req,res)=>{
   console.log(req.body);
   //saving data to DB
    res.send("Data successsfully saved to the database!");
 });

 app.delete("/user",(req,res)=>{
    res.send("Deleted successsfully!");
 });

 app.get("/user/:userId/:name/:password",(req,res) =>{
   console.log(req.params);
   res.send({firstName:"Ganesh",lastName:"Maske"});
 });

// this will match all the HTTP method API calls to 
 app.use("/test",(req,res)=>{
    res.send("Hello from the server!");
 });

 //  app.use( "/hello",(req,res)=>{
//     res.send("Hello Hello Hello!");
//  });

//   app.use( "/",(req,res)=>{
//     res.send("Namaste Ganesh!");
//  });

 app.listen(3000,()=>{
    console.log("Server is Successfully listeing on port 3000...");
 });