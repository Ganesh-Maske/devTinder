
const mongoose =require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
             ref:"User",
            required:true,
        },
        status:{
            type:String,
            required:true,
            enum:{
                values: ["ignored", "interested", "accepted", "rejected"], 
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {timestamps:true},  
);
 //connectionRequest .find({fromUserId:11123546754322345, toUserId:987654321234567999})
connectionRequestSchema.index({fromUserId:1,toUserId:1});



connectionRequestSchema.pre("save",function (){
const connectionRequest = this;
 // check if the fromUserId is name as toUserId
 if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself!")
 }
 
});


const ConnectionRequestModel =new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema   
);
 
module.exports =ConnectionRequestModel;