const router = require('express').Router();

const userRouter = require('./userRouter');
const recipeRouter = require('./recipeRouter');


router.use('/users', userRouter);
router.use('/recipe', recipeRouter);

module.exports = router;