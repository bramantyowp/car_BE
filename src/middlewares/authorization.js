const {verifyToken} = require('../helpers/jwt');
const UserModel = require('../models/user');
const user = new UserModel();

async function authorize(req, res, next) {
    try{
        const bearerToken = req.headers.authorization;
        if(!bearerToken) return res.status(401).json({message: 'Unauthorized'});
        const token = bearerToken.split(' ')[1]; // Bearer {token}
        const payload = verifyToken(token);
        
        req.user = await user.getById(payload.id, {
            omit: {
                password: true
            }
        })
        if(!req.user) return res.status(401).json({message: 'Unauthorized'});
        next();
    } catch(e) {
        console.log(e)
        next(e);
    }
}
 
function checkRole(roles){
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return res.status(403).json({message: 'Forbidden'});
        next();
    }
}

module.exports = {
    authorize, checkRole 
}