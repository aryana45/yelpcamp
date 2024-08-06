const mongoose=require('mongoose');
const cities=require('./cities');
const {descriptors,places}=require('./seedHelpers');
const Campground=require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected");
})
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
    try{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const random=Math.floor(Math.random()*20)+10;
     const camp=   new Campground({location:`${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        images: [
           
            {
              url: 'https://res.cloudinary.com/dzc6vnngn/image/upload/v1722792608/YelpCamp/csrtdtucryjimvcbsy31.jpg',
              filename: 'YelpCamp/csrtdtucryjimvcbsy31',
         
            },
            {
                url: 'https://res.cloudinary.com/dzc6vnngn/image/upload/v1722792606/YelpCamp/htmd3x5tvrn8u7vobamf.jpg',
                filename: 'YelpCamp/htmd3x5tvrn8u7vobamf',
              
              }
          ],
        
    description:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
   price:random,
   geometry:{
    type:"Point",
    coordinates:[
        cities[random1000].longitude,
        cities[random1000].latitude,
    ]
   },
   author:'66af0c1b966a59de90594972'
}
     )
    await camp.save();
    }
console.log("successful");}
catch(err){
    console.log("unsuccessful");
}
}
seedDB();