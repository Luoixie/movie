var mongoose = require('mongoose')
var Category = require('../models/category');




//admin category new page
exports.new = function(req,res){
	res.render('category_admin',{
		title:'immoc 后台分类录入页',
		category:{}
	});
};



// admin post categorylist
exports.save = function(req,res){
	var _category = req.body.category;
	
	var category = new Category(_category);

	category.save(function(err,category){
		if(err){
			console.log(err);
		}

		res.redirect('/admin/category/list');
	});
};


//categorylist page
exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err);
		}
	
		res.render('categorylist',{
			title:'immoc 分类列表页',
			categories:categories
		})
	})

}
