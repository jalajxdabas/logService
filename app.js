const express = require('express');
const PORT = 3000;
const http = require("http");
const WebSocket = require('ws');
const logRouter = require("./routes/logRoutes");
const startWS = require("./service/logWatcher");
const path = require("path");


const app = express();

const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "views")));

 // connect html

const wss = new WebSocket.Server({server});  // create ws server
app.set("wss", wss);
startWS(wss); // running my log Watcher

app.use("/log", logRouter);


server.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
})
