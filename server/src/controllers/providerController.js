const mongoose = require("mongoose");
const providerModel = require("../models/providermodel");
const usermMdel = require("../models/userModel");

const {isValid } = require("../utils/validator");

//Apply As Provider
const applyAsProvider = async (req, res) =>{
    try{

    }catch(error){
        return res.status(500).json({msg:"Internal Server Error",error});
    }
};

module.exports = {applyAsProvider}