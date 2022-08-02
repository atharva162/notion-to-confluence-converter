const { Client } = require("@notionhq/client");
const Confluence = require("confluence-api");

const { isPageOnNotion, reCreatePage } = require('../utils/notion');
const { confluenceAvailability } = require('../utils/confluence');

const configConfluence = {
    username : process.env.CONFLUENCE_USERNAME,
    password : process.env.CONFLUENCE_API_KEY,
    baseUrl : process.env.CONFLUENCE_URL
}

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  })

const confluence = new Confluence(configConfluence);

const convertToConfluence = async(req,res,next) => {
    try{
        isPageOnNotion(req,res,next);
        confluenceAvailability(req,res,next);
        const title = req.title;
        const pageBlocks = await notion.blocks.children.list({block_id : req.body.notionPageId});
        const page = await reCreatePage(pageBlocks.results);
     
        confluence.postContent(req.body.confluenceWorkSpaceName,title,page,null,function(err,data)
        {
           if(data && data.status!=400)
           {
            res.status(200).json("Page transfer from notion to confluence successful")
           }
           
           else
           {
            res.status(404).json('Some error occurred')
        }
    })          
    }
    catch(err)
    {
        res.status(500).json("Some error occurred");
                }
}

module.exports = {
  convertToConfluence
}