const puppeteer = require('puppeteer');
const fs =require('fs');
let {parse} = require('json2csv');
const path = require('path');
const schedule = require('node-schedule');

const getData = async (url) =>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const search =await page.evaluate(()=>{
        let actorsImdbLinks =Array.from(document.querySelectorAll('#main > div > div.lister.list.detail.sub-list > div.lister-list > div > div.lister-item-content > h3 > a')).map((a) => a.href);
        let actorsNames =Array.from(document.querySelectorAll('#main > div > div.lister.list.detail.sub-list > div.lister-list > div > div.lister-item-content > h3 > a')).map((a) => a.textContent.split('\n')[0]);
        let actorsImgs =Array.from(document.querySelectorAll('#main > div > div.lister.list.detail.sub-list > div.lister-list > div > div.lister-item-image > a > img')).map((a) => a.src);
        let actorsSummary =Array.from(document.querySelectorAll('#main > div > div.lister.list.detail.sub-list > div.lister-list > div > div.lister-item-content > p:nth-child(3)')).map((a) => a.textContent.split('\n')[1]);
        return actorsNames.map((actorName,i)=>({name:actorName,imgUrl:actorsImgs[i],summary:actorsSummary[i],link:actorsImdbLinks[i]}))
    })
    await browser.close();
    return search;
}

const getBestActors =async () => {
    const data = await getData('https://www.imdb.com/list/ls000004615/');
    try{
        const csv = parse(data,{ fields:['name','imgUrl','link','summary'] });
        fs.writeFileSync(path.normalize(`${__dirname}/../csv/bestActors.csv`), csv);
        fs.writeFileSync(path.normalize(`${__dirname}/../json/bestActors.json`), JSON.stringify(data));
      }catch(e){
        console.log(e);
      }
}
const getFunniestActors =async () => {
    const data = await getData('https://www.imdb.com/list/ls051583078/');
    try{
        const csv = parse(data,{ fields:['name','imgUrl','link','summary'] });
        fs.writeFileSync(path.normalize(`${__dirname}/../csv/funniestActors.csv`), csv);
        fs.writeFileSync(path.normalize(`${__dirname}/../json/funniestActors.json`), JSON.stringify(data));
      }catch(e){
        console.log(e);
      }
}
schedule.scheduleJob('2 * * * *', function(){
  console.log('The answer to life, get Funniest Actors data!');
  getFunniestActors()
});
schedule.scheduleJob('1 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  getBestActors()
});

module.exports = {getBestActors , getFunniestActors}