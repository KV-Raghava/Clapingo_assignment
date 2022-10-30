const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middlewares/jwt")
const { JWT_SECRET } = require("../constants");

exports.login = [
    body("email").exists().withMessage("Invalid email").toLowerCase().trim(),
    body("password").exists().withMessage("Password must be valid").trim(),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation Error",
                    data: errors.array()
                });
            } else {
                const { email, password } = req.body;
                const userExists = await UserModel.findOne({ emailId: email })
                if (userExists) {
                    const comparePassword = await bcrypt.compare(password, userExists.password)
                    if (comparePassword) {
                        const token = jwt.sign({ id: userExists._id, emailId: userExists.emailId, accountType: userExists.accountType }, JWT_SECRET, { expiresIn: "1d" })
                        return res.status(200).json({
                            message: "Login success",
                            data: token
                        })
                    }
                }
                return res.status(401).json({
                    message: "Email / Password incorrect",
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
];

exports.register = [
    body("email").exists().withMessage("Invalid Email").toLowerCase().trim(),
    body("firstName").exists().withMessage("Invalid First Name").toLowerCase().trim(),
    body("lastName").exists().withMessage("Invalid Last Name").toLowerCase().trim(),
    body("accountType").exists().withMessage("Invalid Account Type").toLowerCase().trim(),
    body("password").exists().withMessage("Password must be valid").trim(),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation Error",
                    data: errors.array()
                });
            } else {
                const { email, password, accountType, firstName, lastName } = req.body;
                const hashedPassword = await bcrypt.hash(password, 12);
                const user = new UserModel({
                    emailId: email,
                    firstName: firstName,
                    lastName: lastName,
                    accountType: accountType === "student" ? "STUDENT" : "TEACHER",
                    password: hashedPassword
                })
                await user.save();
                return res.status(200).json({
                    message: " User created successfully"
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
];

exports.getUsers = [
    authMiddleware,
    async function (req, res) {
        try {
            const users = await UserModel.find().select({ password: 0 })
            return res.status(200).json({
                message: "Users",
                data: users
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
];
