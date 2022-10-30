require("dotenv").config();

console.log("PORT", process.env.PORT,
    "JWT_SECRET", process.env.JWT_SECRET,
    "MONGODB", process.env.MONGODB_URL)

module.exports = {
    PORT: process.env.PORT || 4000,
    JWT_SECRET: process.env.JWT_SECRET || "1234567890",
    MONGODB_URL: process.env.MONGODB_URL
}

