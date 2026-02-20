const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
const port=process.env.PORT;
const express = require("express");
const cors = require('cors');
const app=express();
const cookieParser = require('cookie-parser');

console.log("env", process.env.NODE_ENV);

require('./db/conn');
app.use(cookieParser());


// Allow specific origins
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'http://localhost', // For local development
  'http://192.168.1.109:3000', // For local development
  'https://musync-enzoe.vercel.app', // For production
  'https://musync.najaf.in' // For production
];

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // If you need cookies or auth headers
  })
);

app.use(express.json());
app.use(require('./routes/authRoute'));
app.use(require('./routes/spotifyRoute'));
app.use(require('./routes/likedsongsRoute'));
app.use(require('./routes/playlistRoute'));
app.use(require('./routes/recommendRoute'));
app.use(require('./routes/ytRoute'));
app.use(require('./routes/najafMockRoute'));

app.get("/", (req,res)=>{
  res.send("hello")
});

app.listen(port,'0.0.0.0', ()=>{
  console.log(`running on port  ff${port}`);
})

app.use((req, res, next) => {
  console.log("No route matched in ytRoute. Path was:", req.originalUrl);
  next();
});
