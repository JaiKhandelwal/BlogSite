var Blog=require("../models/blog");
var middlewareObj={};

middlewareObj.isBlogOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id,function(err,foundBlog){
			if(err){
				req.flash("error","Product not found");
				res.redirect("back");
			}
			else{
				if(foundBlog.author.id.equals(req.user._id)||req.user.isAdmin){
					return next();
				}
				else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}


middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

module.exports=middlewareObj;