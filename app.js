const express = require('express');
const cors = require('cors')
const slowDown = require('express-slow-down')

const app = express()
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // allow 100 requests per 15 minutes, then...
  delayMs: 60*1000, // begin adding 500ms of delay per request above 100:
  maxDelayMs: 10*60 *1000,
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});
app.use(cors())

app.get("/",speedLimiter,(req,res)=>{
    res.status(200).json({message:"ok" + req.ip})
})

app.listen(process.env.PORT || 3000);
