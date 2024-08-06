const express=require('express');
const router=express.Router({mergeParams:true});
const catchasync=require('../utils/catchasync');
const {validateReview,islogged,isReviewAuthor}=require('../middleware');
const review=require('../controllers/review');


router.post('/', validateReview, islogged, catchasync(review.createReview));

router.delete('/:reviewId', islogged, isReviewAuthor, catchasync(review.deleteReview))

module.exports=router;