require('dotenv').config();
const fs = require('fs');
const cheerio = require('cheerio');
const bulkJSONFetch = require('./bulk-fetch'); 
const endPoints = require('./endpoints')(process.env.TOKEN);

const URLs = JSON.parse(fs.readFileSync('./jobs/complete.json')).map((d)=>{
    return endPoints.jobDetail(d.jobId);
});

console.log(URLs);

bulkJSONFetch(URLs, 1, saveCompany, 500);

function cleanHTMLText(t){ //add spaces where needed, where tags would have provided
    return t.replace(/([A-Z]+)/g, ' $1')
        .replace(/\s\s/g, ' ')
        .trim();
}

function saveCompany(json){
    const description = cleanHTMLText(cheerio.load(json.data.jobDescription).text());
    json.data.jobDescription = description;
    fs.writeFileSync(`./data/${json.data.jobId}.json`,JSON.stringify(json.data, null, ' '));
    console.log(`saved ${json.data.jobId}`);
}