const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
const port=process.env.PORT;
const express = require("express");
const cors = require('cors');
const app=express();
const cookieParser = require('cookie-parser');

require('./db/conn');


app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "https://musync-enzoe.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
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