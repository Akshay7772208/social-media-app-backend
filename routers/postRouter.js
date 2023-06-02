const router=require('express').Router()
const postsController=require('../controllers/postController')
const requireUser=require('../middlewares/requireUser')
//const createPostController=require('../controllers/postController')
const UserController=require('../controllers/userController')

//router.get('/all',requireUser,postsController.getAllPostsController)
//router.post('/login',authController.loginController)
//router.post("/",requireUser,postsController.createPostController)
router.post('/like',requireUser,postsController.likeAndUnlikePost)
router.put('/',requireUser,postsController.updatePostController)
router.delete('/',requireUser,postsController.deletePost)

module.exports=router;
