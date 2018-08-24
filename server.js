const express = require("express");
const mongojs = require("mongojs");
const bodyParser = require("body-parser");
const logger = require("morgan");
const request = require("request");
const cheerio = require("cheerio");

const app = express();

app.use(logger("dev"));

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.static("public"));

const databaseUrl = "mongo_scraper";
const collections = ["scraped_data" , "saved_articles", "article_notes"];

const db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});



app.get("/", function (req, res) {
    res.send(index.html);
});


// Route 1
app.get("/all", function (req, res) {
    db.scraped_data.find({}, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });
});

// Route 2
app.get("/scrape", function (req, res) {
    request("https://www.mlb.com/", function (error, response, html) {

        const $ = cheerio.load(html);

        $(".p-headline-stack__headline").each(function (i, element) {
            const title = $(this).children("a").text();
            const link = $(this).children("a").attr("href");

            if (title && link) {
                db.scraped_data.save({
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


// Route 2
app.post("/save", function (req, res) {
    console.log(req.body);
    // Insert the note into the notes collection
    db.saved_articles.insert(req.body, function (error, saved) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        else {
            // Otherwise, send the note back to the browser
            // This will fire off the success function of the ajax request
            res.send(saved);
        }
    });
});

// Route 3
app.get("/saved", function (req, res) {

    db.saved_articles.find({}, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });

});


app.listen(3000, function () {
    console.log("App running on port 3000.");
});