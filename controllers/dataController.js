const asyncHandler = require('express-async-handler');
const {getBestActors,getFunniestActors} =require('../scraper/bestActors');
const { getBestMovie } = require('../scraper/bestMovies');
const fs = require('fs');
const path = require('path');


const bestActors = asyncHandler(async (req, res) => {
    fs.readFile(path.normalize(`${__dirname}/../json/bestActors.json`), 'utf8',  function (err,data) {
         if (err) { getBestActors(); return res.status(404).send("")} res.status(200).send(data); });
})
const funniestActors = asyncHandler(async (req, res) => {
    fs.readFile(path.normalize(`${__dirname}/../json/funniestActors.json`), 'utf8', function (err,data) {
        if (err) { getFunniestActors(); return res.status(404).send("")} res.status(200).send(data); });
        
    })
const bestMovie = asyncHandler((req, res) => {
    fs.readFile(path.normalize(`${__dirname}/../json/bestMovies.json`), 'utf8', async function  (err,data) {
        if (err) {getBestMovie(); return res.status(404).send("")} res.status(200).send(data); });
})


module.exports = {bestActors , funniestActors,bestMovie}