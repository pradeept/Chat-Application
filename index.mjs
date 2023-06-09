import {Server} from 'socket.io';
import http from 'http';
import fs from 'fs';
import db from './public/db.js';

//Connect to mongoDB
const database = new db();
database.connect();

//Http Server.
const httpServer = http.createServer((req,res)=>{

  // Routing..
  if(req.url === '/'){
    res.writeHead(200,{"Content-Type": "text/html"});
    const html = fs.readFileSync("./index.html");
    res.end(html);
  }else if(req.url.match('Room') !== null){
    res.writeHead(200,{"ContentType":"text/html"});
    const html = fs.readFileSync("./chat.html");
    res.end(html);
  }else if(req.url.match("\.css$")){
    
    var cssPath = "./public/"+req.url;
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, {"Content-Type": "text/css"});
    fileStream.pipe(res);
}else if(req.url.match("\.js$")){
    var scriptPath = "./public/"+req.url;
    var fileStream = fs.createReadStream(scriptPath);
    res.writeHead(200, {"Content-Type": "text/javascript"});
    fileStream.pipe(res);
}else if(req.url.match(".\png$")){
  var imagePath = '.'+req.url;
  var fileStream = fs.createReadStream(imagePath);
  res.writeHead(200, {"Content-Type": "image/png"});
  fileStream.pipe(res);
}else{
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("No Page Found");
}
});


//Socket.io

const io = new Server(httpServer,{});
var usersOnline = [];

//schema and model
const schema = database.schema();
var chatModel;

//Listening for connection.
io.on("connection",(socket)=>{
  console.log("Connection recieved!");
  console.log(socket.id);


  //emitting online users list every second.
  // setInterval(()=>{
  //   socket.emit("user-online",usersOnline)
  // }, 1000);

  //Listening for room join request.
  socket.on('join-room',async(room,name)=>{
    await socket.join(room);

    chatModel = database.model(schema,room);

    usersOnline.includes(name)?null:usersOnline.push(name);
    console.log(usersOnline);
    socket.to(room).emit('user-online',usersOnline);

    socket.on('req-chat-history',(roomName)=>{

      chatModel.find()
          .then((chats) => {
            // console.log(chats);
            resultEmit(roomName,chats);
          })
          .catch((err)=>{console.log(err)});
      });
  });

  

    function resultEmit(roomName,chats){
      socket.emit('res-chat-history',chats);
    }
  //Listening for message.
  socket.on("Clicked",(msg,name,time,room)=>{
    const newMsg = new chatModel({
      from:name,
      msg
    }).save();

    socket.to(room).emit('broadcast',msg,name,time);
    socket.to(room).emit('user-online',usersOnline);
  }); 
});


//http Server listening on port 3000.
//Go to http://127.0.0.1:3000/ 
httpServer.listen(3000,()=>console.log('HTTP Server Listening on 3000!'));
