const puppeteer = require('puppeteer');
const fs =require('fs');
let {parse} = require('json2csv');
const path = require('path');
const schedule = require('node-schedule');


const getBestMovie =async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com/chart/top/');
  const search =await page.evaluate(()=>{
      let imdbLinks =Array.from(document.querySelectorAll('#main > div > span > div > div > div.lister > table > tbody > tr > td.titleColumn > a')).map((a) => a.href);
      let names =Array.from(document.querySelectorAll('#main > div > span > div > div > div.lister > table > tbody > tr > td.titleColumn > a')).map((a) => a.textContent);
      let imgs =Array.from(document.querySelectorAll('#main > div > span > div > div > div.lister > table > tbody > tr > td.posterColumn > a > img')).map((a) => a.src);
      let releaseYear =Array.from(document.querySelectorAll('#main > div > span > div > div > div.lister > table > tbody > tr > td.titleColumn > span')).map((a) => a.textContent);
      let rating =Array.from(document.querySelectorAll('#main > div > span > div > div > div.lister > table > tbody > tr > td.ratingColumn.imdbRating > strong')).map((a) => a.textContent);
      return names.map((actorName,i)=>({name:actorName,imgUrl:imgs[i],releaseYear:releaseYear[i],link:imdbLinks[i],rating:rating[i]}))
  })
  await browser.close();
  try{
    const csv = parse(search,{ fields:['name','imgUrl','link','releaseYear','rating'] });
    fs.writeFileSync(path.normalize(`${__dirname}/../csv/bestMovies.csv`), csv);
    fs.writeFileSync(path.normalize(`${__dirname}/../json/bestMovies.json`), JSON.stringify(search));
  }catch(e){
    console.log(e);
  }
}
schedule.scheduleJob('3 * * * *', function(){
  console.log('The answer to life, get Best Movie data!');
  getBestMovie()
});

module.exports={getBestMovie}