const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
 


app.get('/api/cd', async (req, res) => {
    var returnInfo = {};
    var numOfItems = 0;
    var path;
    if (req.query.path == null) {
        path = "/home/ben/"
        console.log(
            "Not Working yet"
        )
    } else {
        path = req.query.path;
    }
    fs.readdir(path, async function(err, items) {
        console.log(items)
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