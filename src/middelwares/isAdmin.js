
const isAdmin = async (req, res, next) => {
    try {
       if(req.user.rol === "admin") {
        next();
       } else{
       return res.status(401).json ("no estas autorizado");
       }
    } catch (error) {
        return res.status(401).json ("no estas autorizado");
    }
};

module.exports = {isAdmin}