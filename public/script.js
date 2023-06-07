$(document).ready(()=>{
    var name = ""
    $('.chat-send').click(async ()=>{
        const val = $('.user-input').val();
        const el = `<p class='sender-chat'><span>${val}</span></p>`
        $('.msg-container').append(el);
        $(".msg-container").animate({ scrollTop: 20000000 },100);
        
        // emit msg event
        const time = new Date().toLocaleTimeString(); 
        await socket.emit('Clicked',val,name,time);
        $('.user-input').val("");
    });

    var socket = io();
   
    socket.on("connect", () => {
        name = prompt('Enter your name');
        $('.user-title').text(name);
        console.log("Connected ID: "+socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
        console.log("Disconnected!"); // undefined
    });

    
    socket.on('broadcast',(msg,name,time)=>{
        let el=`<div class='receiver-chat'>\
                <i class='fa-solid fa-user rec-userName'></i>\
                <span>${msg}</span>\
                <p class='user-name'>${name+"\n"+time}</p>\
                </div>`
        // let el =`<p class='receiver-chat'><span>${msg}</span></p>`
        $('.msg-container').append(el);
        $(".msg-container").animate({ scrollTop: 20000000 },100);
    });

    
});