const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/jwt")
const UserModel = require("../models/UserModel");

exports.favorite = [
    body("userId").exists().withMessage("Invalid userId").toLowerCase().trim(),
    authMiddleware,
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation Error",
                    data: errors.array()
                });
            } else {
                const { userId } = req.body;
                console.log(req.user)
                const userExists = await UserModel.findByIdAndUpdate(req.user.id, {
                    $addToSet: {
                        favorites: userId
                    }
                })
                if (userExists)
                    return res.status(200).json({ message: "User added to Favorites" })
                return res.status(404).json({ message: "User not found" })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
];

exports.unfavorite = [
    body("userId").exists().withMessage("Invalid userId").toLowerCase().trim(),
    authMiddleware,
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation Error",
                    data: errors.array()
                });
            } else {
                const { userId } = req.body;
                const userExists = await UserModel.findByIdAndUpdate(req.user.id, {
                    $pull: {
                        favorites: userId
                    }
                })
                if (userExists)
                    return res.status(200).json({ message: "User removed from Favorites" })
                return res.status(404).json({ message: "User not found" })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
];

exports.userFavorites = [
    authMiddleware,
    async function (req, res) {
        try {
            const { id } = req.params;
            const favorites = await UserModel.findById(id).populate("favorites", { password: 0 }).select({ "password": 0 })
            return res.status(200).json({
                message: "User Favorites",
                data: favorites
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
];

exports.favorites = [
    authMiddleware,
    async function (req, res) {
        try {
            const favorites = await UserModel.find().populate("favorites", { password: 0 }).select({ "password": 0 })
            return res.status(200).json({
                message: "User Favorites",
                data: favorites
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
]

exports.mostFavorite = [
    authMiddleware,
    async function (req, res) {
        try {
            const mostFavorite = await UserModel.aggregate([
                [
                    {
                        '$unwind': {
                            'path': '$favorites'
                        }
                    }, {
                        '$group': {
                            '_id': '$favorites',
                            'favorites': {
                                '$count': {}
                            }
                        }
                    }, {
                        '$sort': { 'favoritesCount': 1 }
                    }
                    , {
                        '$limit': 1
                    }
                ]
            ])
            const user = await UserModel.findById(mostFavorite[0]._id).select({ password: 0 })
            return res.status(200).json({ message: "Most Favorite", data: { ...user._doc, favoritesCount: mostFavorite[0].favorites } })
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }
]