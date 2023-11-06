const mongoose = require('mongoose');

const db=process.env.DATABASE;
mongoose.connect(db).then(()=>{
  console.log("u");
}).catch((err)=>console.log(`heeeeeeeeeeeeeeeeeeee${err}`));