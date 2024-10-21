const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
    const questions = await Question.find()

    return res.status(200)
    .json({
        success : true,
        data : questions
    })
})

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;

    const questions = await Question.findById(id)

    return res.status(200)
    .json({
        success : true,
        data : questions
    })
})

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
    const information = req.body;

    // console.log(information)

    const question = await Question.create({
        ...information,
        user : req.user.id,
    })

    res.status(200)
    .json({
        success : true,
        data : question
    })
})

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;
    // Info gibi alabilirsin
    // yani const {...information} = req.body;
    const {title, content} = req.body;

    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();

    return res.status(200)
    .json({
        success : true,
        data : question
    })
})

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;
    // Info gibi alabilirsin

    let question = await Question.findByIdAndDelete(id);

    return res.status(200)
    .json({
        success : true,
        message : "Question delete operation successful"
    })
})

module.exports = {
    askNewQuestion,
    getSingleQuestion,
    getAllQuestions,
    editQuestion,
    deleteQuestion
}