const { Schema, model } = require("mongoose");
const UserModel = new Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        accountType: {
            type: String,
            enum: ["STUDENT", "TEACHER"],
            default: "STUDENT",
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
);

module.exports = model("User", UserModel);
