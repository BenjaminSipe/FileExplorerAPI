const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
 


app.get('/', async (req, res) => {
    var returnInfo = {};
    var numOfItems = 0;
    var path = "/home/ben"
    fs.readdir(path, async function(err, items) {
        for (const item of items) {
    
            await fs.stat(path + "/" + item, async function(err, stats) {
                numOfItems++
                returnInfo[item] = {
                    size:stats["size"],
                    isDirectory:stats.isFile(),
                    permissions:stats["mode"],
                }
                if (numOfItems == items.length) {
                    res.send(await returnInfo) 
                }
               
            });
        }
          
    });
})


app.listen(port, () => {console.log(`Example app listening on port ${port}!`)})