const asyncHandler = require('express-async-handler');
const {getBestActors,getFunniestActors} =require('../scraper/bestActors');
const { getBestMovie } = require('../scraper/bestMovies');


const bestActors = asyncHandler(async (req, res) => {
    return res.status(200).send(await getBestActors())
})
const funniestActors = asyncHandler(async (req, res) => {
    return res.status(200).send(await getFunniestActors())
})
const bestMovie = asyncHandler(async (req, res) => {
    return res.status(200).send(await getBestMovie())
})


module.exports = {bestActors , funniestActors,bestMovie}