const express = require("express");
const router = express.Router();

const authentication = require("../middleware/authMiddleware");
const authorization = require("../middleware/authorization");
const {
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
} = require("../controllers/userController");

//Public Routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/userprofile", getUserProfile)
router.get("/allUsers", authentication, authorization("admin"), getAllUsers);
router.post("/updateProfile/:id",updateUserProfile);

//Admin delete user
router.delete("/deleteProfile/:id",deleteUser)

//Block Unblock user (for admin)
router.put("/user/block/:userId",authentication, authorization("admin"), blockUnblockUser);

//password change
router.put("/change-password", authentication, changePassword);

module.exports = router;





// PS C:\Users\Shivam Savita\OneDrive\Desktop\BackendRevision\FullStackProject\SkillServe\server> node
// Welcome to Node.js v22.15.1.
// Type ".help" for more information.
// > const bcrypt = require("bcrypt");
// undefined
// > let hashedPassword = await bcrypt.hash("Anuj@123",10);
// undefined
// > console.log(hashedPassword);
// $2b$10$cYxyDNJBT4NJwWh2cxP7u.uK1OFL8Rs8c2ePaLqQ78VzQeYcpPJce
// undefined
// >