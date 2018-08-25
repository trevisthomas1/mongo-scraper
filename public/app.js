// Render Scraped card function
function renderScrapedCard(data) {
    let card = `
    <div class="card small blue-grey darken-1">
        <div class="card-content white-text">
            <span class="card-title">${data.title}</span>
            <a target="_blank" href="${data.link}">Go To Article</a>
        </div>
        <div class="card-action">
            <a class="btn-small saveArticle" style="background-color: #02276b;">Save Article</a>
        </div>
    </div>`
    
    $("#articles").append(card);
};

// Render Saved card function
function renderSavedCard(data) {
    let card = `
    <div class="card small blue-grey darken-1">
        <div class="card-content white-text">
            <span class="card-title">${data.title}</span>
            <a target="_blank" href="${data.link}">Go To Article</a>
        </div>
        <div class="card-action">
            <a class="btn-small addNote" data-id=${data._id} style="background-color: #02276b;">Add a Note to Article</a>
            <a class="btn-small removeFromSaved" data-id=${data._id} style="background-color: #d0052c;">Remove Saved Article</a>
        </div>
    </div>`

    $("#articles").append(card);

};

// Scrape Function
$("#scrape").on("click", function () {

    $("#articles").empty();

    $.getJSON("/all", function (data) {

        console.log(data);

        for (let i = 0; i < data.length; i++) {
            renderScrapedCard(data[i]);
        };
    });
});

// Save Article Function
$(document).on("click", ".saveArticle", function () {

    console.log("Clicked");

    $.ajax({
        type: "POST",
        url: "/save",
        dataType: "json",
        data: {
            title: $(this).parent().parent().find("span").text(),
            link: $(this).parent().parent().find("p").text(),
            created: Date.now()
        }
    })
        .then(function (data) {
            console.log(data);
            // getFaves();
        });

    return false;

})

// Render Saved Articles
$("#savedArticles").on("click", function () {

    $("#articles").empty();

    $.getJSON("/saved", function (data) {

        console.log(data);

        for (let i = 0; i < data.length; i++) {
            renderSavedCard(data[i]);
        };
    });
});


// Delete Article
$(document).on("click", ".removeFromSaved", function () {

    let card = $(this).parent().parent();
    let id = $(this).attr("data-id");
    console.log(id);

    $.ajax({
        type: "GET",
        url: "/remove/saved/" + id,

        success: function (response) {
            card.remove();
        }
    });
});