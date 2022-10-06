const app = require('./app');
const mongoose = require("mongoose")
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: `./.${process.env.NODE_ENV}.env` });
} else {
  require('dotenv').config({ path: './.local.env' });
}



const connectionString =  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.vdhpldx.mongodb.net/natours?retryWrites=true&w=majority`

mongoose.connect(connectionString,{
    useNewUrlParser:true , 
}).then(()=>{
    console.log("Database Connected SuccessFully..")
}).catch(
    err=>console.log(err)
)


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});


process.on("unhandledRejection",(err)=>{
    console.log(err.name , err.message)
    process.exit(1)
})

process.on("uncaughtException",(err)=>{
    console.log(err.name , err.message)
    process.exit(1)
})
