const path = require('path');
const fs = require('fs');

const logFile = path.join(__dirname, "../sample.log");

exports.getFilePath = () => logFile;

// exports.getLast10Lines = async(req, res) =>{
//     return new Promise((resolve, reject) => {
//         fs.readFile(logFile, "utf8", (err, data)=>{
//             if(err) return reject(err);

//             const lines = data.split("\n").filter(l => l.trim() !== "");
//             const last10 = lines.slice(-10);
//             return resolve(last10);
//         });
//     });
// };

exports.getLast10Lines = async (req, res) =>{
    try{
        const filePath = logFile;
        const fd = await fs.promises.open(filePath, "r"); // read only access;
        
        const stat = await fd.stat();
        let fileSize = stat.size;
        

        if(fileSize === 0){
            await fd.close();
            return [];
        }

        let chunkSize = 64 * 1024;  // 64kb
        let buffer = Buffer.alloc(chunkSize);
        let position = fileSize;
        let lines = [];
        let leftOver = "";
        

        while(position > 0 && lines.length <= 10){
            const readSize = Math.min(chunkSize, position);
            position -= readSize;

            const { bytesRead } = await fd.read(buffer, 0, readSize, position);
             //(where to store, which location to start storing, bytes to read, fom where to read)
            ;
            const chunk = buffer.slice(0, bytesRead).toString("utf8");
            const combined = chunk + leftOver;
            

            const parts = combined.split("\n").filter(l=>l.trim !== "");
            // if a line is not complete by change
            leftOver = parts.shift();

            lines = parts.concat(lines);
        }

        await fd.close();
       

        if(leftOver) lines.unshift(leftOver);
        console.log(lines);
        return lines.slice(-10);

    }catch(err){
        res.status(500).json({err});
    }
};
