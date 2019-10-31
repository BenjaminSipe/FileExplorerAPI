const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
 

//read directory
app.get('/api/cd', async (req, res) => {
    var returnInfo = {};
    var numOfItems = 0;
    var path;
    if (req.query.path == null) {
        res.send("No path provided in query.")
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
                    isDirectory:stats.isDirectory(),
                    permissions:stats["mode"],
                }
                if (numOfItems == items.length) {
                    res.send(await returnInfo) 
                }
            });
        }
    });
})
//rename file

app.listen(port, () => {console.log(`Example app listening on port ${port}!`)})