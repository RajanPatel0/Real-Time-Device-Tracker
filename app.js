const express=require('express');
const app=express();
const path=require('path');

const http=require('http'); //for socket neet http: cuzz socket run on http

const socketio=require("socket.io"); //npm package(one of)so require it
const server=http.createServer(app);    //it will create server(for app)
const io=socketio(server);  //callinng socket io function=pass server to this & it will give io

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function(socket){   //handling unique socket key,connection event handling done here
    socket.on("send-location", function(data){  //it show value receive(mil gayi)
        io.emit("receive-location",{id: socket.id, ...data});   //it will send back msg to all connection (ON FRONTEND) 
    });

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    });

    console.log("connected");
})





app.get('/', function(req,res){
    res.render("index");
});
app.get('/learn', function(req,res){
    res.render("learn");
});

server.listen(3000);