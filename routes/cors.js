const cors = require("cors");

const whitelist = ["http://localhost:3000", "https://localhost:3443"];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header("Origin"));
    if(whitelist.indexOf(req.header("Origin")) !== -1) {  //checking if an origin can be found
        corsOptions = { origin: true };         //allows to request to be accepted
    } else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);   //null means no error
}


//These two will give us options. if we only want whitelist, we don't need to top export. if we want them all, then we dont need bottom export
exports.cors = cors();          //this will return a middleware function configured to allow access-control-allow-origin with a wildcard as its value
exports.corsWithOptions = cors(corsOptionsDelegate);  //Allows us to apply the whitelist Cors requests.