var express=require("express");
var router=express.Router();
var Blog=require("../models/blog");
var middleware=require("../middleware");

//==========================
//routes
//==========================

router.get("/blogs",function(req,res){
	Blog.find({},function(err,blog){
		if(err){
			console.log("something went wrong");
		}
		else{
			res.render("index.ejs",{blogs:blog});
		}
	})
})
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
	res.render("new");
})
router.post("/blogs",middleware.isLoggedIn,function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	req.body.blog.author = {
    id: req.user._id,
    username: req.user.username
  }
	Blog.create(req.body.blog,function(err,blog){
		if(err){
			req.flash('error', err.message);
			res.render("new");
		}
		else{
			console.log(blog);
			res.redirect("/blogs");
		}
	})
})
router.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log("You have some error in code");
		}
		else{
			res.render("show",{blog: foundBlog});
		}
	});
});
router.get("/blogs/:id/edit",middleware.isBlogOwner,function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			req.flash("error", err.message);
			console.log("There is an error");
		}
		else{
			res.render("edit",{blog: foundBlog});
		}
	});
});
router.put("/blogs/:id",middleware.isBlogOwner,function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, {new:true}, function(err,updatedBlog){
		if(err){
			console.log("Error!!");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
router.delete("/blogs/:id",middleware.isBlogOwner,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,delBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});
module.exports=router;