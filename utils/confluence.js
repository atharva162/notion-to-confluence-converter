const Confluence = require("confluence-api");

const config = {
    username : process.env.CONFLUENCE_USERNAME,
    password : process.env.CONFLUENCE_API_KEY,
    baseUrl : process.env.CONFLUENCE_URL
}

const confluence = new Confluence(config);

const confluenceAvailability = async(req,res,next) =>{
        try{
           confluence.getContentByPageTitle(req.body.confluenceWorkSpaceName, req.title, (err,data)=>{     
         if(err || data.results.length==0){
         next();
        }
        else if(data && data.results.length) {
            res.status(400).json({
                message : "The given page is already available on Confluence"
            })
            return;
           }}) }
        catch(err)
        {
            res.status(500).json({
                message : "Some error occured"
            })
            return;
        }
    }

module.exports = {
    confluenceAvailability
}    