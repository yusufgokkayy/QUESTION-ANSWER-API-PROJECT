const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { reset } = require("nodemon");

const UserSchema = new Schema({

    name : {
        type : String,
        required : [true, "Please provide a name"]
    },
    email : {
        type : String,
        required : [true, "Please proivide and email address"],
        unique : [true, "This email is already in use"],
        match : [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email"
        ]
    },
    role : {
        type : String,
        default : "user",
        enum : ["user", "admin"]
    },
    password : {
        type : String,
        minlength : [6, "Please provide a password with a minimum length of 6"],
        required : [true, "Please provide a password"],
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    title : {
        type : String,
    },
    about : {
        type : String
    },
    place : {
        type : String
    },
    website : {
        type : String
    },
    profile_image : {
        type : String,
        default : "default.png"
    },
    blocked : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
});

// UserSchema Methods

UserSchema.methods.generateJwtFromUser = function(){
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;
    const payload = {
        id : this._id,
        name : this.name
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn : JWT_EXPIRE
    });
    return token;
}

// Pre Hooks

UserSchema.methods.getResetPasswordTokenFromUser = function() {
    const randomHexString = crypto.randomBytes(15).toString("hex");
    // console.log(randomHexString);
    const {RESET_PASSWORD_EXPIRE} = process.env;
    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex")

    this.resetPasswordToken = resetPasswordToken
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE)

    return resetPasswordToken;
}

UserSchema.pre("save", function(next) {

    if (!this.isModified("password")) {
        next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        
        bcrypt.hash(this.password, salt, (err, hash) => {
            // Store hash in your password DB.
            if (err) next(err);
            this.password = hash;
            next();
        })
    })
})

module.exports = mongoose.model("User", UserSchema);

// users

// User.create