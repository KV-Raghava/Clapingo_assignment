const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants")

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(400).json({ message: "Authorization token is not found" })
        }
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                console.log(err);
                if (err.name === "TokenExpiredError") {
                    return res.status(400).json({ message: "Token Expired" })
                }
                return res.status(400).json({ message: "Invalid Token" })
            }
            req.user = payload;
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Authorization Error" })
    }
};
