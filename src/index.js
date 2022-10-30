const express = require('express')
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRouter = require("./routes")
const { PORT, MONGODB_URL } = require("./constants");

mongoose
    .connect(MONGODB_URL, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.error("MongoDB Connection error:", err.message);
        process.exit(1);
    });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/v1/', apiRouter)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})