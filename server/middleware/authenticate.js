const jwt=require("jsonwebtoken");
const User = require('../models/userSchema');

const authenticate=async (req, res, next)=>{
  try {
    const token=req.cookies.jtoken;
    const tverify=jwt.verify(token, process.env.SECRET_KEY);
    const rootuser= await User.findOne({_id:tverify._id, "tokens.token":token});

    if(!rootuser){
      throw new Error("User not found");
    }
    req.token=token;
    req.rootuser=rootuser;
    req.userID=rootuser._id;
    next();

  } catch (error) {
    res.status(401).send("No token provided");
    console.log(error);
  }
}

module.exports=authenticate;