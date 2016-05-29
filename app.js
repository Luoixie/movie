var express  = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var serverStatic = require('serve-static');
var port = process.env.PORT ||3000;
var app = express();
var fs = require('fs');
var dbUrl = 'mongodb://localhost/luoi';

mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath = path +'/'+file
			var stat = fs.statSync(newPath)

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath)
				}
			}
			else if(stat.isDirectory()){
				walk(newPath)
			}
		})
}

app.set('views','./app/views/pages');
app.set('view engine','jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

//session依赖于cookieParser才能正常运作
app.use(session({
	secret:'luoi',
	resave:false,
	saveUnitialized:true,
	store:new MongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}));

var env = process.env.NODE_ENV || 'development'


//配置本地开发变量，使之能在控制台打印
//获取开发变量
if('development' === env){
	//在屏幕上打印错误信息
	app.set('showStackError',true)
	//传入的参数值
	app.use(logger(':method:url:status'))
	//解压代码，增加代码可读性，本地环境才使用
	app.locals.pretty = true
	mongoose.set('debug',true)
};

require('./config/routes')(app);

app.listen(port);
app.locals.moment = require('moment');
app.use(serverStatic(path.join(__dirname, 'public')));

console.log('imooc started on port' +port);



