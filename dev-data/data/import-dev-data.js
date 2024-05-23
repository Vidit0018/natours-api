const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const mongoose = require('mongoose')
const fs = require('fs');
const Tour = require('./../../models/tourmodels')
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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

// Importing Data into db
const importData = async()=>{
    try {
        await Tour.create(tours)
        console.log('data successfully loaded into db!')
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

// Delete all data form db
const deleteData= async()=>{
    try {
        await Tour.deleteMany()
        console.log('data deleted from the db!');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}
if(process.argv[2]=== '--import'){
    importData();
}
if(process.argv[2]=== '--delete'){
    deleteData();
}
console.log(process.argv)
