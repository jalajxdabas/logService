const fs = require("fs");
const logModel = require('../model/logModel'); 

function startWS(wss) {
    const logFile = logModel.getFilePath();
    let fileSize = fs.statSync(logFile).size;

    fs.watchFile(logFile, {interval: 1000}, (curr, prev)=>{         // checking every 1s
        if(curr.size > prev.size){

            const stream = fs.createReadStream(logFile, {   // reading new data;
                start: fileSize, 
                end: curr.size
            });

            let buffer = "";  // store new data
            stream.on("data", chunk=>{
                buffer += chunk.toString();
            });

            stream.on("end", ()=>{
                const newLines = buffer.split("\n").filter(l => l.trim() !== "");

                wss.clients.forEach(client=>{
                    if(client.readyState == 1){
                        client.send(JSON.stringify({logs: newLines}));
                    }
                });
                fileSize = curr.size;
            })


        };
    });
};

module.exports = startWS;