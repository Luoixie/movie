var Movie = require('../models/movie');
var Category =require('../models/category');
var Comment = require('../models/comment');
var _ =require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = function(req,res){
	var id = req.params.id;
	//$inc mongodb 里增减的操作
	//这里设置每一次的pv为1，则刷新后，pv为2,若将语句中的pv的值改为2,则下一次刷新的值为当前值2+2=4
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
		}
	})
	Movie.findById(id, function(err, movie) {
    Comment
      .find({movie: id})
      .populate('from','name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments){
      	console.log('comment:');
      	console.log(comments);
        res.render('detail', {
          title: 'imooc 详情页',
          movie: movie,
          comments: comments
        })
      })
  })
};

//admin new page
exports.new = function(req,res){
	Category.find({},function(err,categories){
		res.render('admin',{
			title:'immoc 后台录入页',
			categories:categories,
			movie: {}
		})
	})
}

//admin update movie
exports.update = function(req,res){
	var id = req.params.id;

	if(id){

		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){

				res.render('admin',{
					title:'后台更新页',
					movie:movie,
					categories:categories
				})
			})
		})
	}
};

//admin poster
exports.savePoster = function(req,res,next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp+ '.'+type;
			var newPath = path.join(__dirname,'../../','/public/upload/'+poster)

			fs.writeFile(newPath,data,function(err){
				req.poster = poster;
				console.log('145');
				next();
				
			})
		})
	}
	else{
		console.log('1000111');
		next();

	}
}

// admin post movie
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;

	var _movie;

	if(req.poster){
		movieObj.poster = req.poster;
	}

	//判断电影是否已经录入过
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
			    }

			    res.redirect('/movie/'+_movie.id);
			})

		})
	}else{
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;


		_movie.save(function(err,movie){
				if(err){
					console.log(err);
			    }
			    //判断是否已经录入了categoryId
			    if(categoryId){
				    Category.findById(categoryId,function(err,category){
				    	category.movies.push(movie._id);

				    	category.save(function(err,category){

				   			res.redirect('/movie/'+_movie.id);
				    	})
				    })			    	
			    }
			    //新增一个categoryId
			    else if(categoryName){
			    	var category = new Category({
			    		name:categoryName,
			    		movies:[movie._id]
			    	})
			    	category.save(function(err,category){
			    		movie.category = category._id;
			    		movie.save(function(err,category){
							res.redirect('/movie/'+_movie.id);
			    		})
				    })
			    }
			});
	}
};

//list page
exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
	
		res.render('list',{
			title:'immoc 列表页',
			movies:movies
		});
	});

};


//list delete movie
exports.del = function(req,res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success:1});
			}
		});
	}
};
