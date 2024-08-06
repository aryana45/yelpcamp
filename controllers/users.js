const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('user/register');
}

module.exports.register=async(req,res,next)=>{
    try{
    const {username,email,password}=req.body; 
    const user=new User({email,username});
    const registereduser=await User.register(user,password);
    req.login(registereduser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome to yelp camp');
    res.redirect('/campgrounds');
    })
    }
    catch(e){
     req.flash('error',e.message);
     res.redirect('/register')   
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('user/login');
}

module.exports.login=(req,res)=>{
    req.flash('success','welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    })
}