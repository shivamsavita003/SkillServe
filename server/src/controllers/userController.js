const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const {
  isValid,
  isValidName,
  isValidEmail,
  isValidContact,
  isValidPassword,
} = require("../utils/validator");
const mongoose = require("mongoose");

// Signup User
const signupUser = async (req, res) => {
  try {
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided." });
    }

    let { name, email, phone , password , authProvider} = data;

    //authProvider
    if(!isValid(authProvider)){
      return res.status(400).json({msg:"Auth Provider is Required"});
    }

    if(!["google","phone", "manual"].includes(authProvider)){
      return res.status(400).json({msg:"Invalid Auth Provider"});
    }

     if(authProvider !== "manual"){
      return res.status(400).json({msg:"Use Respective login API for googel or OTP Authentication",});
    }

    if(authProvider === "manual"){

      // Name Validation
    if (!isValid(name)) {
      return res.status(400).json({ msg: "Name is Required" });
    }

    if (!isValidName(name)) {
      return res.status(400).json({ msg: "Invalid Name" });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let duplicateEmail = await userModel.findOne({ email });

    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    // Phone Number Validation
    if (!isValid(phone)) {
      return res.status(400).json({ msg: "Phone Number is Required" });
    }

    if (!isValidContact(phone)) {
      return res.status(400).json({ msg: "Invalid Phone Number" });
    }

    let duplicateContact = await userModel.findOne({ phone });
    if (duplicateContact) {
      return res.status(400).json({ msg: "Contact Number Already Exists" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    }

    data.role = "user";
    let userCreated = await userModel.create(data);
    return res.status(201).json({msg:"User Registered Successfully", userData: userCreated});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login User (Manual)
const loginUser = async (req, res) => {
  try {
    let data = req.body;
        
    //validation
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided." });
    }

    let { email, password , authProvider } = data;

    if(!isValid(authProvider)){
      return res.status(400).json({msg: "auth Provider is Required"});
    }

    if(authProvider !=="manual"){
      return res.status(400).json({msg: "Use Respective login API for google or OTP Authentication,"});
    }

    if (!isValid(email) || !isValidEmail(email)) {
      return res.status(400).json({ msg: "Email is Missing or Required" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

  if(user.authProvider !== "manual"){
    return res.status(400).json({msg:`This Email Registered using ${user.authProvider} login`,});
  }

  let isPasswordMatch = await bcrypt.compare(password, user.password);
  if(!isPasswordMatch){
    return res.status(401).json({msg:"Incorrect Password"});
  }

    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.SECRET_KEY,
      {
        expiresIn:"24hr",
      }
    );

    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//OTP Login
const otpLogin = async (req, res) => {
  try {
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Google Login
const googleLogin = async (req, res) => {
  try {
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    if(req.userRole !=="admin"){
      return res.status(403).json({msg:"Access Denied Admin Only"});
    }

    let users = await userModel
         .find().
         select("-password")
         .sort({createdAt:-1});

    if(!users || users.length === 0){
      return res.status(404).json({msg:"No Users Found"});
    }

    return res.status(200).json({msg:"Users Fetched Successfully",
      totalUsers: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    let userId = req.userId;

    if (!userId) {
      return res.status(400).json({ msg: "User Id is required" });
    }

    let user = await userModel.findById(userId).select("password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "user profile fetched successfully",data:user, });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update user Profile
const updateUserProfile = async (req, res) => {
  try {
    let id =  req.userId;
    let data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided." });
    }

    let { name, email, phone, password } = data;

    if (name !== undefined) {
      if (!isValid(name)) {
        return res.status(400).json({ msg: "Name is Required" });
      }

      if (!isValidName(name)) {
        return res.status(400).json({ msg: "Invalid Name" });
      }
    }

    if (email !== undefined) {
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is Required" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }

      let duplicateEmail = await userModel.findOne({ email });

      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email Already Exists" });
      }
    }

    if (phone !== undefined) {
      if (!isValid(phone)) {
        return res.status(400).json({ msg: "Contact Number is Required" });
      }

      if (!isValidContact(phone)) {
        return res.status(400).json({ msg: "Invalid Contact Number" });
      }

      let duplicateContact = await userModel.findOne({ phone });
      if (duplicateContact) {
        return res.status(400).json({ msg: "Contact Number Already Exists" });
      }
    }

    if (password !== undefined) {
      if (!isValid(password)) {
        return res.status(400).json({ msg: "Password is Required" });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
    }

    let update = await userModel.findByIdAndUpdate(id, userData, { new: true });
    if (!update) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res
      .status(200)
      .json({ msg: "User Updated Successfully", updatedData: update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete User Profile
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    let deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Block Unblock User(Admin)
const blockUnblockUser  = async (req, res) => {
  try {
    let userId = req.params.userId;
    let {isBlocked} = req.body;
     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }
    if(typeof isBlocked !== "Boolean"){
      return res.status(400).json({msg:"IsBlocked Must be a Boolean Value"});
    }

    let user = await userModel.findById(userId);

    if(!user){
      return res.status(404).json({msg:"user not found"});
    }

    if(user.role === "admin"){
      return res.status(403).json({msg:"Admin Can't be Blocked"});
    }

    user.isBlocked = isBlocked;
    await user.save();
    
    return res.status(200).json({msg:`${isBlocked ? "Blocked" : "UnBlocked"} Successfully`,});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//change password
const changePassword = async (req, res) => {
  try {
    let userId = req.userId

    let {oldPassword, newPassword} = req.body;

    if(!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({msg:"Bad Request ! No Data Provided."});
    }

    if(!isValid(oldPassword)){
      return res.status(400).json({msg:"old password is Required"});
    }

     if(!isValid(newPassword)){
      return res.status(400).json({msg:"new password is Required"});
    }
    
    if(!isValidPassword(newPassword)){
      return res.status(400).json({msg:"Invalid new password"});
    }

    let user = await userModel.findById(userId).select("+password");

    if(!user){
      return res.status(404).json({msg:"User Not Found"})
    }

    if(user.authProvider !== "manual"){
      return res.status(400).json({msg:"password change allowed only for manual login users."});
    }

    let passwordMatch = await bcrypt.compare(oldPassword, user.Password);

    if(!passwordMatch){
      return res.status(401).json({msg:"old Password is Incorrect"});
    }

    let hashedNewPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedNewPassword

    await user.save();
    return res.status(200).json({msg:"Password Changed Successfully"});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  signupUser,
  getAllUsers,
  getUserProfile,
  loginUser,
  otpLogin,
  googleLogin,
  updateUserProfile,
  deleteUser,
  blockUnblockUser,
  changePassword,
};
