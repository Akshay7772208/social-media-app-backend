const router=require('express').Router()  
const requireUser=require('../middlewares/requireUser')
const UserController=require('../controllers/userController')

router.post('/follow',requireUser,UserController.followOrUnfollowUserController)
//router.get('/getFeedData',requireUser,UserController.getPostsOfFollowing)
///3 apis remaining
router.get('/getMyPosts',requireUser,UserController.getMyPosts)
router.get('/getUserPosts',requireUser,UserController.getUserPosts)
router.delete('/',requireUser,UserController.deleteMyProfile)

//router.put('/',requireUser,UserController.updateUserProfile)
router.get('/getMyInfo',requireUser,UserController.getMyInfo)
router.post('/getUserProfile',requireUser,UserController.getUserProfile)
router.get('/getFeedData',requireUser,UserController.getPostsOfFollowing)

module.exports=router
