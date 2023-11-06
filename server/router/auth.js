const express = require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const User = require('../models/userSchema');
const authenticate=require('../middleware/authenticate');

router.get('/',(req,res)=>{
  res.send("hello i'am auth from router");
});
// Using Promise
// router.post('/register',(req,res)=>{

//   const {name,email,phone,password,cpassword}=req.body;
//   if(!name || !email || !phone || !password || !cpassword){
//     return res.status(422).json({error:"errrrrrrrrrrrrrrrr"});
//   }

//   User.findOne({email: email})
//     .then((userExist)=>{
//       if(userExist){
//         return res.status(422).json({error:"email exists"});
//       }
//       const user=new User({name,email,phone,password,cpassword});

//       user.save()
//       .then(()=>res.status(201).json({message:"Registered successfully"}))
//       .catch((err)=>res.status(500).json({error:"Failed to register"}));
//     }).catch((err)=>res.status(500).json({error:"Failed to register"}));
// });

// Using async await
//email register
router.post('/serverregister',async(req,res)=>{
  const {name,email,password,cpassword}=req.body;
  if(!name || !email || !password || !cpassword){
    return res.status(422).json({error:"errrrrrrrrrrrrrrrr"});
  }  

  try {
    const userExist=await User.findOne({email:email});
    if(userExist){
      return res.status(422).json({error:"User already exists"});
    }
    const user=new User({name,email,password,cpassword});
    // hashing password

    await user.save();
    res.status(201).json({message:"User registered successfully"});

} catch (error) {
    console.log(error);
  }
})

//google register
router.post('/googleserverregister', async (req, res) => {
  const { email,name,image } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
  
    if (existingUser) {
      return res.status(422).json({ error: 'User already registered with Google' });
    }
    const newUser = new User({email, name,image });
  
    await newUser.save();
    res.status(201).json({message:"User registered successfully"});
  } catch (error) {
    console.log(error);
  }
});



// Login
router.post('/serverlogin',async(req,res)=>{
  try {
    let token;
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({error:"Please fill data"})
    }
    const userExists=await User.findOne({email:email});

    if(userExists){
      const passmatch=await bcrypt.compare(password,userExists.password);
      
      token=await userExists.generateAuthToken();
      console.log(token);
      res.cookie("jtoken",token,{
        expires:new Date(Date.now()+(60000*60*24)),
        httpOnly:true
      });
      if(!passmatch){
        return res.status(401).json({error:"Invalid credentials"});
      }else{
        // console.log(passmatch);
        res.json({message:"Logged in successfully"})
      }
    }else{
      return res.status(401).json({error:"Invalid credentials"});
    }

  } catch (error) {
    console.log(error);
  }
});

// Google Login
router.post('/googleserverlogin', async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const token = await userExists.generateAuthToken();
      console.log(token);
      res.cookie("jtoken", token, {
        expires: new Date(Date.now() + (60000 * 60 * 24)),
        httpOnly: true,
      });
      return res.status(200).json({ message: "Logged in successfully" });
    } else {
      return res.status(401).json({ error: "User doesn't exist!! Try registering" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});


router.post('/logout', (req, res) => {
  res.clearCookie('jtoken');
  return res.status(200).json({ message: 'Logout successful' });
});


router.get('/serverprofile', authenticate ,(req,res)=>{
  // console.log("serverprofile");
  res.send(req.rootuser)
})

module.exports=router;