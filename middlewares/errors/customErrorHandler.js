const CustomError = require("../../helpers/error/CustomError");
const customErrorHandler = (err, req, res, next) => {

    let customError = err;
    // console.log(err);

    if (err.name === "SyntaxError") {
        customError = new CustomError("Unexpected Syntax", 400);
    }
    if (err.name === "ValidationError") {
        // console.log(err.message)
        customError = new CustomError(err.message, 400);
    }
    if (err.name === "CastError") {
        customError = new CustomError("Please proivde a valid id", 400)
    }
    
    if (err.code === 11000) {
        // Duplicate Key
        customError = new CustomError("Duplicate Key Found : Check Your Input", 400);
    }

    res
    .status(customError.status || 500)
    .json({
        success : false,
        message : customError.message || "Internal Server Error"
    })
};

module.exports = customErrorHandler;