const mongoose = require('mongoose');

class db {
    constructor(){

    }
    //connect to db
    connect() {

        mongoose.connect("mongodb://localhost:27017/chat_app",{useNewUrlParser: true})
        .then(console.log('Connection Successful!'))
        .catch((err)=>{console.log(err);})
    }

    //schema 
    schema(){
        const chatSchema = new mongoose.Schema(
            {
                from:String,
                msg:String
                
            }
        );
        return chatSchema;
    }

    //model
    model(schema,roomName){
        const chat = mongoose.model(roomName,schema);
        return chat;
    }


}

module.exports = db;
