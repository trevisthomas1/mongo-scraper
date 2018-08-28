const express = require("express");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const request = require("request");
const cheerio = require("cheerio");

// const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.static("public"));

app.use(bodyParser.json());

// const databaseUrl = "mongo_scraper";
// const collections = ["scraped_data" , "saved_articles", "article_notes"];
// const db = mongojs(databaseUrl, collections);

const db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo_scraper";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

app.get("/", function (req, res) {
    res.send(index.html);
});


// Access Scraped Data Route
app.get("/all", function (req, res) {
    db.Scraped.find({}, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });
});


// Execute Scrape Route
app.get("/scrape", function (req, res) {
    request("https://www.mlb.com/", function (error, response, html) {

        const $ = cheerio.load(html);

        $(".p-headline-stack__headline").each(function (i, element) {
            const title = $(this).children("a").text();
            const link = $(this).children("a").attr("href");

            if (title && link) {
                db.Scraped.save({
                    title: title,
                    link: link
                },
                    function (error, saved) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(saved);
                        }
                    });
            }
        });
    });

    res.send("Scrape complete");

});


// Execute Save Article Route
app.post("/save", function (req, res) {
    console.log(req.body);

    db.Saved.insert(req.body, function (error, saved) {

        if (error) {
            console.log(error);
        }
        else {

            res.send(saved);
        }
    });
});

// Access Saved Articles Route
app.get("/saved", function (req, res) {

    db.Saved.find({}, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });

});

// Execute Save Note Route
app.post("/saveNote", function (req, res) {

    console.log(req.body);

    db.Notes.insert(req.body, function (error, saved) {
        if (error) {
            console.log(error);
        }
        else {
            res.send(saved);
            console.log(saved)
        }
    });
});

// Access Saved Notes Route
app.get("/notes", function (req, res) {

    db.Notes.find({}, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });

});

// Execute Remove Saved Article Route
app.get("/remove/saved/:id", function (req, res) {

    db.Saved.remove(
        { 
            _id: mongojs.ObjectID(req.params.id)
        }, 
        function (error, removed) {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(removed);
                res.send(removed);
            }
        }
    );
});

// Execute Find Article Note Route
app.get("/find/:id", function (req, res) {

    db.Notes.find(
        {
            articleid: req.params.id
        },
        function (error, found) {

            if (error) {
                console.log(error);
                res.send(error);
            }
            else {

                console.log(found);
                res.send(found);
            }
        }
    );
});

// Execute Remove Note Route
app.get("/delete/note/:id", function (req, res) {

    db.Notes.remove(
        {
            _id: mongojs.ObjectID(req.params.id)
        },
        function (error, removed) {

            if (error) {
                console.log(error);
                res.send(error);
            }
            else {

                console.log(removed);
                res.send(removed);
            }
        }
    );
});


// Server Running Notification
app.listen(MONGODB_URI, function () {
    console.log(`App running on port: ${MONGODB_URI}`);
});