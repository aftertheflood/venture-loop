require('dotenv').config();
const fs = require('fs');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const endPoints = require('./endpoints')(process.env.TOKEN);

const existingFiles = fs.readdirSync('./companies','utf-8')
  .filter(d=>(d.indexOf('.json') > 0))
  .map(d=>d.split('.json')[0]);

console.log(existingFiles);

fetch(endPoints.jobs(100, 900))
  .then(res=>res.json())
  .then(json=>{
    const companyURLs = json.data
      .filter(d => !(existingFiles.indexOf(d.jobId) > -1))
      .map(d => {
        return endPoints.jobDetail(d.jobId)
      });
    if(companyURLs.length == 0){
      console.log('no new files');
      exit(0);
    }
    console.log(`${companyURLs.length} new entries to get...`);
    rateLimitedBulkJSONFetch(companyURLs, 1, saveCompany, 500);
  });

function cleanHTMLText(t){ //add spaces where needed, where tags would have provided
  return t.replace(/([A-Z]+)/g, ' $1')
    .replace(/\s\s/g, ' ')
    .trim()
}

function saveCompany(json){
  const description = cleanHTMLText(cheerio.load(json.data.jobDescription).text());
  json.data.jobDescription = description;
  fs.writeFileSync(`./companies/${json.data.jobId}.json`,JSON.stringify(json.data, null, ' '));
  console.log(`saved ${json.data.jobId}`);
}

function rateLimitedBulkJSONFetch(urls, maxConcurrent=1, processor = d=>console.log(d), timeout = 2000){
  let active = 0;
  function tryFetch(){
    if(active < maxConcurrent && urls.length > 0){
      console.log('getting...')
      fetcher(urls.pop(), processor);
      tryFetch();
    }else{
      console.log(`waiting for completion of ${active} active transfers, the queue is ${urls.length} items long.` );
      setTimeout(tryFetch, timeout);
      if(urls.length == 0){
        process.exit(0);
      }
    }
  }

  function fetcher(url, processor){
    active ++;
    fetch(url)
      .then(res=>res.json())
      .then(json=>{
        console.log('got');
        processor(json);
        active--;
      });
  }

  tryFetch();
}