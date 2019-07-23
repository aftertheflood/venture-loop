const fetch = require('node-fetch');

function rateLimitedBulkJSONFetch(urls, maxConcurrent=1, processor = d=>console.log(d), timeout = 2000){
    let active = 0;
    function tryFetch(){
        if(active < maxConcurrent && urls.length > 0){
        console.log('getting...')
        fetcher(urls.shift(), processor);
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
            console.log('got', url);
            processor(json);
            active--;
        });
    }

    tryFetch();
}

module.exports = rateLimitedBulkJSONFetch;