const express = require('express')
const router = express.Router()

const userController = require("./controllers/userController")
const favoriteController = require("./controllers/favoriteController")

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/users", userController.getUsers);

router.post("/favorite", favoriteController.favorite)
router.post("/unfavorite", favoriteController.unfavorite)
router.get("/favorites/:id", favoriteController.userFavorites)
router.get("/favorites", favoriteController.favorites)
router.get("/mostFavorite", favoriteController.mostFavorite)
module.exports = router;

