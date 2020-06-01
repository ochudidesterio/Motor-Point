const mongodb = require("mongodb").MongoClient
const dotenv = require("dotenv")
dotenv.config()
let url = 'mongodb://localhost/ComplexApp';


mongodb.connect(url,{useNewUrlParser:true, useUnifiedToplogy:true},(err,client)=>{
 
module.exports = client

const app = require('./app')
app.listen(process.env.PORT,function(){
    console.log("server running ")
})
})
