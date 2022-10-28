const jwt = require("jsonwebtoken");

// função da verificação do token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['x-access-token'];
    jwt.verify(bearerHeader, process.env.SECRET, (err, authData) => { 
        if (err) {return res.sendStatus(401);            
        } else {
            req.user_id = authData.user_id;
            next();
        }
    })
}
export default verifyToken;