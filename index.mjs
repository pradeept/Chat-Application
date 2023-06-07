import {Server} from 'socket.io';
import http from 'http';
import fs from 'fs';


const httpServer = http.createServer((req,res)=>{
  console.log(req.url);
  if(req.url === '/'){
    res.writeHead(200,{"Content-Type": "text/html"});
    const html = fs.readFileSync("./index.html");
    res.end(html);
  }else if(req.url.match("\.css$")){
    console.log(req.url);
    var cssPath = "./public/"+req.url;
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, {"Content-Type": "text/css"});
    fileStream.pipe(res);
}else if(req.url.match("\.js$")){
    var imagePath = "./public/"+req.url;
    var fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, {"Content-Type": "text/javascript"});
    fileStream.pipe(res);
}else{
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("No Page Found");
}
});


const io = new Server(httpServer,{});
io.on("connection",(socket)=>{
  console.log("Connection recieved!");
  console.log(socket.id);
  
  socket.on("Clicked",(msg,name,time)=>{
    socket.broadcast.emit('broadcast',msg,name,time);
  });
  
});


httpServer.listen(3000,()=>console.log('HTTP Server Listening on 3000!'));
