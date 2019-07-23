require('dotenv').config();
const fs = require('fs');
const bulkJSONFetch = require('./bulk-fetch'); 
const endPoints = require('./endpoints')(process.env.TOKEN);

const URLs = [];
const max = 1000000;
const increment = 1000;

for(let i = 0; i <= max; i += increment){
    URLs.push(endPoints.jobs(i, i+increment-1));
}

console.log(URLs);
let count = 0;
bulkJSONFetch(URLs, 1, (d)=>{
    count++;
    if(d.data=='Nothing found'){
        process.exit(0);
    }
    fs.writeFileSync(`./jobs/${count}.json`, JSON.stringify(d))
})