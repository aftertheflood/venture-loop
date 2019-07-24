module.exports = (token = 'aaa')=>{
  return {
    functions: `http://www.ventureloop.com/ventureloop/api/functions.php?api_key=${token}`,
    jobs: (start=0, limit=100)=>`http://www.ventureloop.com/ventureloop/api/jobs.php?start=${start}&limit=${limit}&api_key=${token}`,
    jobDetail: (id)=>`http://www.ventureloop.com/ventureloop/api/jobdetail.php?jobid=${id}&api_key=${token}`,
    rapi: (id)=>`https://ventureloop.com/ventureloop/api/rapi.php?jobId=${id}`,
  };
}
