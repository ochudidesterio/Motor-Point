const validator = require("validator")
const bycrypt = require("bcryptjs")
const md5 = require('md5')
const userCollection = require("../db").db().collection("users")

let User = function(data){
this.data = data
this.errors = []
}

User.prototype.cleanUp = function(){
if(typeof(this.data.username) != "string"){this.data.username = ""}
if(typeof(this.data.email) != "string"){this.data.email = ""}
if(typeof(this.data.password) != "string"){this.data.password = ""}

//get rid of bogus properties

this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
}
}

User.prototype.validate = function(){
    return new Promise(async (resolve,reject)=>{
        if (this.data.username == ""){this.errors.push("you must provide a username")}
        if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push("username can only contain letters and numbers")}
        if(!validator.isEmail(this.data.email)){this.errors.push("you must provide a valid email")}
        if(this.data.password == ""){this.errors.push("you must provide a password")}
        if(this.data.password.length >0 && this.data.password.length<6){this.errors.push("password must contain at lest six characters")}
        if(this.data.password.length>10){this.errors.push("password must not exceed 10 characters")}
        if(this.data.username.length >0 && this.data.username.length<4){this.errors.push("username must contain at lest 4 characters")}
        if(this.data.username.length>10){this.errors.push("username must not exceed 10 characters")}
        
        //check if user already exists
        
        if(this.data.username.length>3 && this.data.username.length<11 && validator.isAlphanumeric(this.data.username)){
            let usernameExist =await userCollection.findOne({username: this.data.username})
            if(usernameExist){this.errors.push("Username already exists")}
        }
        // check if email exists
        
        if(validator.isEmail(this.data.email)){
            let emailExists = await userCollection.findOne({email: this.data.email})
            if(emailExists){this.errors.push("email exists")}
        }
        resolve()
        })
}
User.prototype.login = function(){
    return new Promise((resolve,reject)=>{
        this.cleanUp()
    userCollection.findOne({username:this.data.username}).then((attemptedUser)=>{
        if(attemptedUser && bycrypt.compareSync(this.data.password,attemptedUser.password) ){
            this.data = attemptedUser;
            this.getAvatar();
            resolve("success")
        }else{
            reject("invalid username / password  ")
        }
    }).catch(e=>{reject("something went wrong!!!")})
    })
}
User.prototype.register = function(){
    return new Promise(async (resolve,reject)=>{
        //validate user data
        this.cleanUp()
        await this.validate()
    
        //save to db
        if(!this.errors.length){
    
            //hash user password
        let salt = bycrypt.genSaltSync(10)
        this.data.password = bycrypt.hashSync(this.data.password,salt)
         await userCollection.insertOne(this.data)
         this.getAvatar()
         resolve();
        }else{
            reject(this.errors);
        }
    
    })
}
User.prototype.getAvatar = function(){
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}
module.exports = User