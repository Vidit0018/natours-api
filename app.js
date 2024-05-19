const express = require('express');
const morgan = require('morgan');
const app = express();
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
app.use(express.static(`${__dirname}/public`))
app.use(express.json());
//Middlewares
if(process.env.Node_env==='development'){
  console.log('using morgan cause env is under development')
  app.use(morgan('dev'));  
}
app.use((req,res,next)=>{
  console.log("hello from the middleware ✌️");
  next();
})
app.use((req,res,next)=>{
   req.requestTime = new Date().toISOString();
  next();
})

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


// App
module.exports= app;
