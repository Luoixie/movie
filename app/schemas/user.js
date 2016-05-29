var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');//专门为密码存储儿设计的算法
var SALT_WORK_FACTOR = 10;  //计算长度越大，破解越难

var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	//role,角色,用number而不用String方便后期维护开发
	//0:normal;
	//1:verified user  通过邮件激活
	//2:professonal user  高级用户
	//
	//>10：admin
	//>50:super admin
	role:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	//加盐，在哈希的基础上混合盐，混合加密
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    	if(err) return next(err);

    	bcrypt.hash(user.password, null, null, function (err, hash){
        if (err) {
            return next(err)
        } 
        user.password = hash
        next()    
	})
    });
});

UserSchema.methods ={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return cb(err)

			cb(null,isMatch)
		})
	}
}

UserSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
};

module.exports = UserSchema;