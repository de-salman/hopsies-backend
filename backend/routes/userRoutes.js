const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, getAllUsers, updateProfile, getSingleUserDetails, updateUserRole, deleteUser } = require('../controllers/userController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewear/auth')


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(logout)
router.route('/me').get(isAuthenticatedUser,getUserDetails)
// router.route('/me').get(isAuthenticatedUser,getUserDetails)
router.route('/me/update').put(isAuthenticatedUser,updateProfile)
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers)
router.route('/admin/getSingleUser/:id')
.get(isAuthenticatedUser,authorizeRoles('admin'),getSingleUserDetails)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUserRole)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
router.route("/password/update").put(isAuthenticatedUser, updatePassword);


module.exports = router