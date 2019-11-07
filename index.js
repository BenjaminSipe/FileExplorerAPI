const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');

app.put('/api/mkdir', (req, res) => {
    var path = req.query.path;
    if (path == null) res.send("No path specified in query.");
    var name = req.query.name;
    if (name == null) res.send("No name specified in query.");
    fs.mkdir(path + "/" + name, (err) => {
        if (err) res.send(err);
        else res.send("success")
    });
})

app.put('/api/mkfile', (req, res) => {
    console.log(req.query)
    var path = req.query.path;
    if (path == null) res.send("No path specified in query.");
    var name = req.query.name;
    if (name == null) res.send("No name specified in query.");
    fs.open(path + "/" + name, "wx", (err, fd) => {
        if (err) res.send(err);
        else {
            fs.close(fd, (err) => {
                if (err) console.log(err)
                res.send("success")
            })
        }
    });
})

app.all('/api', (req, res) => {
    res.send("TEST RESPONSE")
})
//read directory
app.get('/api/ls', async (req, res) => {
    var returnInfo = [];
    var numOfItems = 0;
    var path;

    if (req.query.path == null) {
        res.send("No path provided in query.")
    } else {
        path = req.query.path;
    }
    fs.readdir(path, async function (err, items) {
        console.log(items)
        if (items.length == 0) {
            res.send("[]")
        } else {


            for (const item of items) {

                await fs.stat(path + "/" + item, async function (err, stats) {
                    numOfItems++
                    returnInfo.push({
                        name: item,
                        size: stats["size"],
                        isDirectory: stats.isDirectory(),
                        permissions: stats["mode"],
                    })
                    if (numOfItems == items.length) {
                        res.send(JSON.stringify(await returnInfo))
                    }
                });
            }
        }
    });
})
//rename file

app.listen(port, () => { console.log(`Example app listening on port ${port}!`) })