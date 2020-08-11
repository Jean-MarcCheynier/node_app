
function handleJsonRes(err, data, res, className = "ResponseHandler"){
    if(err){
        let errorMessage = "No message";
        let status = 520;
        //Checking if error message is present
        //DBS-SAP-CAI standard
        if(err.message){
            errorMessage = err.message;
        }
        //SAP-CAI API errors
        else if(err.response && err.response.text){
            let res = JSON.parse(err.response.text);
            if(res.message){
                errorMessage = res.message
            }
        //Unhandled errors
        }else{
            errorMessage = err;
        }
        //Checking if status is present
        if(err.status){
            status = err.status;
        }else{
            switch(err.code){
                case "ENOTFOUND" :
                    status = 404;
                    break;
                case "ETIMEDOUT" :
                    status = 408;
                    break;
                default : 
                    status = 520;
            }
        }
        console.error(className.concat(" : ").concat(err));
        res.status(status).json({message: errorMessage});
    }else{
        console.info(className.concat(" : ").concat("success"));
        res.json(data);
    }
}

var ResponseHandler = {
    handleJsonRes: handleJsonRes
}


module.exports = ResponseHandler;