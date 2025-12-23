const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");

const authentication = async (req, res, next) => {
    try {
        let token = req.headers["authorization"] || req.headers["Authorization"];
        if (!token) {
            return res.status(401).json({ msg: "Authorization Token is Required" });
        }
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken) {
            return res.status(401).json({ msg: "Invalid Token" });
        }
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        req.userId = decodedToken.userId;
        req.userRole = user.role;
        next();
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = authentication;