const socket= io(); //it send a connection request to backend

if(navigator.geolocation){  //checkign window browser supports map naviagtion type something
    navigator.geolocation.watchPosition((position)=>{   //it watch position when device move anywhere
        const {latitude,longitude}= position.coords;    //extreacting lat, long from position sent
        socket.emit("send-location", {latitude,longitude}); //sending these location data to backend 
    }, (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,   //millisecond=5sec
        maximumAge:0, //can take data anytime so that cached data cant play role here
    }
);

}

const map = L.map("map").setView([0,0], 16);   //it asks user ki location do apni   --[0,0]show earth center, 10  show 10 level zoom

//it will show map in real
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Rajan Patel",
}).addTo(map);

const marker={};

socket.on("receive-location", (data)=>{ //this show location on frontend map
    const {id, latitude, longitude}=data;
    map.setView([latitude,longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }else{
        marker[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id)=>{
if(marker[id]){
    map.removeLayer(marker[id]);
    delete marker[id];
}
});