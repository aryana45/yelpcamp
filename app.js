
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


// require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
var methodOverride = require('method-override')
const ejsMate=require('ejs-mate')
const mongoose=require('mongoose');
const Expresserror=require('./utils/expresserror');
const reviewsroutes = require('./routes/review');
const campgroundsroutes=require('./routes/campground');
const userroutes=require('./routes/users')
const User=require('./models/user')
const passport=require('passport');
const localStrategy=require('passport-local');
const session=require('express-session');
const flash=require('connect-flash');
const helmet=require('helmet')
const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const MongoStore = require('connect-mongo');


mongoose.connect(dbUrl);
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected");
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith:'_'
}))
const secret=process.env.SECRET||'thisshouldbeabettersecret'
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
       secret
    }
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})
const sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzc6vnngn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   
    res.locals.currentUser=req.user;
   res.locals.success= req.flash('success');
res.locals.error=req.flash('error');
   next();
})

app.use('/campgrounds',campgroundsroutes)
app.use('/campgrounds/:id/reviews',reviewsroutes)
app.use('/',userroutes)
// app.get('/fakeuser',async(req,res)=>{
//     const user=new User({email:"jk@gmail.com",username:"coltt"})
//     const newuser=await User.register(user,'chicken');
//     res.send(newuser);
// })
app.get('/',(req,res)=>{
    res.render('home');
})


app.all('*',(req,res,next)=>{
    next( new Expresserror("Something went wrong",401))
})
app.use((err,req,res,next)=>{

const{status=404}=err;
if(!err.message) err.message='Oh No, Something went wrong!';
res.status(status).render('error',{err});
})
app.listen(3000,(req,res)=>{
    console.log("listening to port 3000");
})