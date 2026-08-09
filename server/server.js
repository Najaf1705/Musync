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


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost",
  "http://192.168.1.109:3000",
  "https://musync-enzoe.vercel.app",
  "https://musync.najaf.in",
  // "https://musynctest.najaf.in:3000",
  "https://musynctest.najaf.in",
  "http://192.168.49.2:30080"
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin);

    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.toLowerCase().includes("apidog")
    ) {
      return callback(null, true);
    }

    return callback(null, true); // TEMP allow all for debug
    // return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.set("trust proxy", 1);

app.use(express.json());
app.use(require('./routes/authRoute'));
// app.use(require('./routes/jiosaavnRoute'));
app.use(require('./routes/spotifyRoute'));
app.use(require('./routes/likedsongsRoute'));
app.use(require('./routes/playlistRoute'));
app.use(require('./routes/recommendRoute'));
app.use(require('./routes/ytRoute'));
app.use(require('./routes/najafMockRoute'));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.warn(`Rejected malformed JSON for ${req.method} ${req.originalUrl}`);
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }
  return next(error);
});

app.use((req, res) => {
  console.log("No route matched. Path was:", req.originalUrl);
  res.status(404).json({ error: 'Not Found' });
});

console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);

app.get("/", (req,res)=>{
  res.send("hello")
});

app.listen(port,'0.0.0.0', ()=>{
  console.log(`running on port  ff${port}`);
})
