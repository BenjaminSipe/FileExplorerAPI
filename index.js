const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');

app.put('/api/mkdir', (req, res) => {
    //Get the variables from query.
    var path = req.query.path;
    var name = req.query.name;
    //Check the variables to see if they exist.
    if (path == null)
        res.send("No path specified in query.");
    else
        if (name == null) res.send("No name specified in query.");
        else {
            //If they both exist, remove optional first / from name
            if (name[0] === "/") {
                name = name.substr(1);
            }
            //Append directory names with delimiters
            let createPath = "/" + path + "/" + name;

            //Remove redundant delimiters
            createPath = createPath.replace(/\/\//g, "\/")
            //Check for invalid directory entry, (only exists if more than 3 '/' entered sequentially.)
            if (createPath.includes("\/\/")) {
                //Send bad input (400) error. 
                res.status(400).send({ "err": "Directory entered invalid.", "input": createPath })
            } else {
                //Make folder.
                fs.mkdir(createPath, { recursive: true }, (err) => {
                    //if error was caught, throw 500 error.
                    if (err) res.status(500).send(err);
                    else {
                        //Send success result.
                        res.send("Created Directory at " + createPath)
                    }
                });
            }
        }
})

app.put('/api/touch', (req, res) => {
    var path = req.query.path;
    var name = req.query.name;
    //Check the variables to see if they exist.
    if (path == null)
        res.send("No path specified in query.");
    else
        if (name == null) res.send("No name specified in query.");
        else {
            //If they both exist, remove optional first / from name
            if (name[0] === "/") {
                name = name.substr(1);
            }
            //Append file name to directory with delimiters
            let createPath = "/" + path + "/" + name;

            //Remove redundant delimiters
            createPath = createPath.replace(/\/\//g, "\/")
            //Check for invalid directory entry, (only exists if more than 3 '/' entered sequentially.)
            if (createPath.includes("\/\/")) {
                //Send bad input (400) error. 
                res.status(400).send({ "err": "FileName entered invalid.", "input": createPath })
            } else {
                //Make file.
                fs.open(createPath, "wx", (err, fd) => {
                    //if error was caught, throw 500 error.
                    if (err) res.status(500).send(err);
                    else {
                        fs.close(fd, (err) => {
                            if (err) res.status(500).send(err);
                            else
                                //Send success result.
                                res.send("Created File at " + createPath)
                        })

                    }
                });
            }
        }
})

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
    fs.readdir(path, async function (err, items) {
        console.log(items)
        for (const item of items) {

            await fs.stat(path + "/" + item, async function (err, stats) {
                if (err) res.send(err)
                else {
                    numOfItems++
                    returnInfo[item] = {
                        size: stats["size"],
                        isDirectory: stats.isDirectory(),
                        permissions: stats["mode"],
                    }
                    if (numOfItems == items.length) {
                        res.send(await returnInfo)
                    }
                }
            });
        }

    });
})
//rename file

app.listen(port, () => { console.log(`Example app listening on port ${port}!`) })