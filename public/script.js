$(document).ready(()=>{
    $('.chat-send').click(()=>{
        const val = $('.user-input').val();
        console.log(val)
        const el = `<p class='sender-chat'>${val}</p>`
        $('.msg-container').append(el);
    });

    var socket = io();
        socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        });

        socket.on("disconnect", () => {
        console.log(socket.id); // undefined
        });

        // const form = document.querySelector(".msgForm");

        // form.addEventListener("submit",(event)=>{
        //     event.preventDefault();
        //     const msg = document.querySelector(".msg").value;
        //     console.log(msg);
            
        //     socket.emit("message", msg);
        // });
});