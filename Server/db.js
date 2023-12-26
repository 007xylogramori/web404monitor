const mongoose=require('mongoose');
const mongoConnect=()=>{
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connected to mongodb");
        })
        .catch((e)=>{
            console.log('failed',e);
        })
}
module.exports=mongoConnect;