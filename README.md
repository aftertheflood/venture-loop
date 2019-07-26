Some scripts for reading the Ventureloop job API

# Getting started

The scripts expect an API token via a `.env` file in the repository root the content sof which should be eg.
```
TOKEN={THE ACTUAL TOKEN}
```

## getJobList.js

gets all the job summaries in batches of 1000

## mergeJobLists.js

puts all the joblists together into one big file

## getFullJobData.js

goes through the full merged joblist and retrievs all the individual job details

# Index ventures data

Index ventures have provided some data too. It's in the '/index-data' folder 

# Pages

The pages folder contains some visualisations of the data, using D3 each one is a self contained HTML pageyou can serve them with `npm run serve`

