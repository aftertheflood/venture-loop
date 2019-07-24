const fs = require('fs');
const d3 = require('d3');

const data = d3.tsvParse(fs.readFileSync('./index-data.tsv','utf-8'),(row)=>{
    row['Posted Date'] = new Date(row['Posted Date']);
    row['Archived Date'] = new Date(row['Archived Date'])
    row['Days Live'] = Math.floor((row['Archived Date'].getTime() - row['Posted Date'].getTime())/(1000*60*60*24));
    row['Month Posted'] = `${row['Posted Date'].getFullYear()}-${row['Posted Date'].getMonth()+1}`
    return row;
});
console.log(data[0]);

const companies = splitArrayOn(data,'Company Name');
const jobCategories = splitArrayOn(data, 'Job Category Id');
const industries = splitArrayOn(data, 'Job Industry Id');
const locations = splitArrayOn(data, 'Job Locations');

function splitArrayOn(array, property){
    const A = array.reduce((dict, current)=>{
        if(current == undefined) return dict;
        if(!dict[current[property]]){
            dict[current[property]] = [];
        }
        dict[current[property]].push(current);
        return dict;
    }, {});

    return Object.values(A);
}
console.log(data.columns)

console.log(
`${data.length} records.
${jobCategories.length} job categories.
${companies.length} companies.
${industries.length} industries.
${locations.length} locations.`);
