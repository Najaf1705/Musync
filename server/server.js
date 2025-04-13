const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
const port=process.env.PORT;
const express = require("express");
const cors = require('cors');
const app=express();
const cookieParser = require('cookie-parser');

require('./db/conn');


app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
  }
));
app.use(express.json());
app.use(require('./routes/authRoute'));
app.use(require('./routes/spotifyRoute'));
app.use(require('./routes/likedsongsRoute'));
app.use(require('./routes/playlistRoute'));
app.use(require('./routes/recommendRoute'));

app.get("/", (req,res)=>{
  res.send("hello")
});

app.listen(port, ()=>{
  console.log(`running on port  ff${port}`);
})