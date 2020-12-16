const express = require('express');
const userModel = require('../models/users');
const router = new express.Router();

const blockedUser=()=>{

    router.post('/blockeduser',async (req,res)=>{
      try{
      req.logout();
      const users=await userModel.findOne({ email :req.body.email})
      if(users){
        if(!users.blocked){
           return res.send({success:true,userBlocked:false})
        }
        await userModel.findOneAndUpdate({ email :req.body.email }, {
            $set:{
                loginAttempts: 0,
                blocked:false
            }
        }, { new: true, runValidators: true, useFindAndModify: false });
        res.send({success:true,userBlocked:true});
      }else{
        res.send({success:false,message:"User not Registered"});
      }
      }
      catch(error){
        res.status(500).send({success:false,message:"something went wrong"});
      }
    })

    return router;
}

module.exports = blockedUser;