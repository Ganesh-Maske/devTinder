const mongoose = require("mongoose");
 const connectDB =async ()=>{
    await mongoose.connect("mongodb+srv://Namastedev:1aYRH6F1FGJeFPe7@namastenode.hdmchis.mongodb.net/devtinder")
 };
module.exports = connectDB;