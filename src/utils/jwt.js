const jwt = require("jsonwebtoken")

const generateKey = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expireIn: "1y"});
};

const verifyKey = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {generateKey, verifyKey}; 