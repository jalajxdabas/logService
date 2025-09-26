const logModel = require('../model/logModel'); 

exports.serveLogs = async (req, res) => {
    try{
        console.log("running");
        const last10 = await logModel.getLast10Lines();
        console.log(last10);
        res.json({logs: last10});
    }catch(err){
        
        res.status(500).json({err});
    }

}