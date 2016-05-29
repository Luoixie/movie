var User =require('../models/user');


//showSignup
exports.showSignup = function(req,res){
	
		res.render('signup',{
			title:'注册页面'
		});

};

//showSignin
exports.showSignin = function(req,res){
	
		res.render('signin',{
			title:'登录页面'
		});

};

//signup
exports.signup = function(req,res){
	//拿到表单的数据
	//var _user = req.body.user;
	//也可用req.param('user');但有多个id时，会出现错误，按顺序获取一个
	
	var _user = req.body.user;
	

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/signin');
		}
		else{
			user = new User(_user);

			user.save(function(err,user){
			if(err){
				console.log(err);
			}
			res.redirect('/admin/user/list')
			})
		}
	})
	
};


//user signin
exports.signin = function(req,res){
	var _user = req.body.user;
	console.log(_user)
	var name = _user.name
	var password = _user.password;

	User.findOne({name:name},function(err,user){
		if (err) {
			console.log(err);
		}
		if(!user){
			console.log('用户不存在');
			return res.redirect('/signup');

		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				//session 服务器和客户端的会话
				req.session.user = user;
				console.log('Password is matched')
				return res.redirect('/');
			}
			else{
				return res.redirect('/signin');
			}
		})
	})
};

//logout
exports.logout = function(req,res){
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
};

//userlist page
exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
	
		res.render('userlist',{
			title:'immoc 用户列表页',
			users:users
		});
	});

};

//midware for user
exports.signinRequired = function(req,res,next){
	var user = req.session.user;

	if(!user){
		return res.redirect('/signin');
	}

	next();
};

//midware for admin
exports.adminRequired = function(req,res,next){
	var user = req.session.user;

	if(user.role <= 10){
		return res.redirect('/signin');
	}

	next();
};