const express=require('express');
const router=express.Router();
const passport=require('passport');
const catchasync=require('../utils/catchasync');
const { storeReturnTo } = require('../middleware');
const user=require('../controllers/users')

router.route('/register')
      .get(user.renderRegister)
      .post(catchasync(user.register))

router.route('/login')
      .get(user.renderLogin)
      .post(storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), user.login)

router.get('/logout', user.logout); 

module.exports=router;



