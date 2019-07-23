const fs = require('fs');

const mergedJobData = fs.readdirSync('./jobs','utf-8')
    .reduce((acc, current)=>{
        const data = JSON.parse(fs.readFileSync(`./jobs/${current}`,'utf-8')).data;
        return [...acc, ...data];
    },[]);

fs.writeFileSync('./jobs/complete.json',JSON.stringify(mergedJobData, null, ' '));
