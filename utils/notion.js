const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  })

const isPageOnNotion= async(req,res,next) => {
    try{
        const pageMetaData = await notion.pages.retrieve({page_id: req.body.notionPageId})
        req.title=pageMetaData.properties.title.title[0].plain_text;
        if(pageMetaData.object == "page"){
            next();
        } 
    }
    catch(err){
      return res.json({
            message :  'Some error occurred'
        })
    }
    }
    
    const styleText = (data)=>{
        let page="";
        if(data.annotations.bold)
        {
            page+="<b>"
        }
        if(data.annotations.italic)
        {
            page+="<i>"
        }
    
        page+=data.plain_text;
    
        if(data.annotations.italic)
        {
            page+="</i>"
        }
        if(data.annotations.bold)
        {
            page+="</b>"
        }
        return page;            
    }  
    
const reCreatePage = async(pageblocks) =>{
        let page="";
        for(let count=0;count<pageblocks.length;count++)
        {
            const type = pageblocks[count].type;
            console.log(type);
            switch (type) {
                case "paragraph":
                    if(pageblocks[count].paragraph.rich_text.length)
                    {
                    page+="<p>"
                    page+=styleText(pageblocks[count].paragraph.rich_text[0]);
                    page+="</p>"
                    }
                    else
                    {
                        page+="<br/>"
                    }
                    break;
    
                case "heading_3":
                    if(pageblocks[count].heading_3.rich_text.length)
                    {
                    page+="<h3>"
                    page+=styleText(pageblocks[count].heading_3.rich_text[0]);
                    page+="</h3>"
                    }
                    else
                    {
                        page+="<br/>"
                    }
                    break;
                
                case "heading_2":
                    if(pageblocks[count].heading_2.rich_text.length)
                    {
                    page+="<h2>"
                    page+=styleText(pageblocks[count].heading_2.rich_text[0]);
                    page+="</h2>"
                    }
                    else
                    {
                        page+="<br/>"
                    }
                    break;  
                
                case "heading_1":
                    if(pageblocks[count].heading_1.rich_text.length)
                    {
                    page+="<h1>"
                    page+=styleText(pageblocks[count].heading_1.rich_text[0]);
                    page+="</h1>"
                    }
                    else
                    {
                        page+="<br/>"
                    }
                    break;
                
                case "bulleted_list_item":
                    if(!pageblocks[count-1] || pageblocks[count-1].type!="bulleted_list_item") page+="\n<ul>";
    
                    if(pageblocks[count].bulleted_list_item.rich_text.length)
                    {
                    page+="<li>"
                    page+=styleText(pageblocks[count].bulleted_list_item.rich_text[0]);
                    page+="</li>"
                    }
                    else
                    {
                        page+="<br/>"
                    }
                    console.log(!pageblocks[count+1] || pageblocks[count+1].type!="bulleted_list_item");
                    if(!pageblocks[count+1] || pageblocks[count+1].type!="bulleted_list_item")
                    { 
                        page+="</ul>\n"; 
                        
                    }
                    break;
                
                case "table":
                    const has_column_header= pageblocks[count].table.has_column_header;
                    const has_row_header= pageblocks[count].table.has_row_header;
                    try
                    {
                       let tableData = await notion.blocks.children.list({ block_id: pageblocks[count].id});
                       let result = tableData.results;
                       page+="<table>";
                       for(let count=0;count<result.length;count++)
                       {
                        page+="<tr>";
                         for(let itr=0;itr<result[count].table_row.cells.length;itr++)
                         {
                            if(!result[count].table_row.cells[itr].length) continue;
    
                             if(count==0 && has_row_header)
                            {
                            page+="<th>"
                            page+=styleText(result[count].table_row.cells[itr][0]);
                            page+="</th>"
                            }
                            else if(itr==0 && has_column_header)
                            {
                                page+="<th>"
                                page+=styleText(result[count].table_row.cells[itr][0]);
                                page+="</th>"         
                            }
                            else
                            {
                            page+="<td>"
                            page+=styleText(result[count].table_row.cells[itr][0]);
                            page+="</td>"
                            }
                        }
                        page+="</tr>";
                    }
                       page+="</table>";
                    }
                    catch(err)
                    {
                        return err;
                    }
                    
                    break;
    
                default:
                    break;
            }
        }
        
        return page;
    } 
   
module.exports = {
    isPageOnNotion,
    reCreatePage
}    