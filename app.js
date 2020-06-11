var express=require("express");
var app=express();
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var bodyParser=require("body-parser");
var expressSanitizer=require("express-sanitizer");
var methodOverride=require("method-override");
var Blog=require("./models/blog");
var User=require("./models/auth");

var blogsRoutes=require("./routes/blog");
var authRoutes=require("./routes/auth");

//===============================
//mongoose configuration
//===============================
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));
app.use(flash());

//======================
//passport-configuration
//======================

app.use(require("express-session")({
    secret: "Iris is one of the best club in NITK!!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========================================================
//For flash messages and managing login and logout on nav bar
//===========================================================

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use(blogsRoutes);
app.use(authRoutes);


app.listen(3000,function(){
	console.log("Server is running on port 3000");
})