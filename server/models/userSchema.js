const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        // required: true,
      }
    }
  ],
  likedSongs: [String],
  playlists: [
    {
      playlistName: {
        type: String,
        required: true,
      },
      songs: [String],
    },
  ],
});

// hashing password
userSchema.pre('save',async function(next){
  if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,12);
  }
  next();
});

userSchema.methods.generateAuthToken=async function(){
  try {
    let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)

     // Ensure `tokens` is an array before pushing the token
     if (!Array.isArray(this.tokens)) {
      this.tokens = [];
    }
    console.log("token", token);

    this.tokens=this.tokens.concat({token:token});
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
}


const User = mongoose.model('REGISTERATION',userSchema);
module.exports=User;