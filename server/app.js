const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
const port=process.env.PORT;
const express = require("express");
const cors = require('cors');
const app=express();
const cookieParser = require('cookie-parser');

require('./db/conn');
// const User=require('./models/userSchema');
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(require('./router/auth'));
app.use(require('./router/spotapi'));
app.use(require('./router/likedsongs'));
app.use(require('./router/recommend'));

app.get("/", (req,res)=>{
  res.send("hello")
});

app.listen(port, ()=>{
  console.log(`running on port  ff${port}`);
})