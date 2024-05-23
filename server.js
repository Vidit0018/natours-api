const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const mongoose = require('mongoose')

const app = require('./app');
// console.log('app server inititated')

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose
.connect(DB,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify :false
}).then(con => {
  // console.log(con.connections);
  console.log("db connection successful✌️")
  
}).catch((err) => {
    console.log(err)
});



 

const port = process.env.Port;
// console.log(port)
app.listen(port, () => {
    console.log(`App running on PORT : ${port}`);
  });