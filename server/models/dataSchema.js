const mongoose = require('mongoose');
const dataSchema=new mongoose.Schema({
  songId: {
    type: String,
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
})

const Odata=mongoose.model('DATA',dataSchema);
module.exports=Odata;