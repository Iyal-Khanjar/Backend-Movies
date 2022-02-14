const puppeteer = require('puppeteer');

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
  return search
}

module.exports={getBestMovie}