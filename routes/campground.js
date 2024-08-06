const express=require('express');
const router=express.Router();
const campground=require('../controllers/campground')
const catchasync=require('../utils/catchasync');
const {islogged,validateCampground,isAuthor}=require('../middleware');
const multer  = require('multer');
const {storage}=require('../cloudinary')
const upload = multer({ storage })

router.route('/')
      .get(catchasync(campground.index))
      .post(islogged, upload.array('image'), validateCampground, catchasync(campground.createCampground))
      
            
      

router.get('/new', islogged, campground.renderNewForm);

router.route('/:id')
      .get(catchasync(campground.showCampground))
      .put( islogged, isAuthor, upload.array('image'), validateCampground, catchasync(campground.updateCampground))
      .delete(islogged, catchasync(campground.deleteCampground))

router.get('/:id/edit', islogged, isAuthor, catchasync(campground.renderEditForm));
     
module.exports=router;