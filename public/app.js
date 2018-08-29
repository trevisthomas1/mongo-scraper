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
            <a href="#" class="btn-small modal-trigger addNote" data-id=${data._id} style="background-color: #02276b;">Add a Note to Article</a>
            <a class="btn-small removeFromSaved" data-id=${data._id} style="background-color: #d0052c;">Remove Saved Article</a>
        </div>
    </div>`

    $("#articles").append(card);

};

// See Scraped Function
$("#seeScraped").on("click", function () {

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
function renderSavedArticles() {
    $("#articles").empty();

    $.getJSON("/saved", function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            renderSavedCard(data[i]);
        };
    });
};

// Render Saved Articles on Click
$("#savedArticles").on("click", function () {
    renderSavedArticles();
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

// Add Note Modal Function
$(document).on("click", ".addNote", function () {

    $(".modal").modal("open");
    let id = $(this).attr("data-id");
    $("#saveNote").attr("data-id", id);
    $("#note").val("");
    $("#Mheader").empty();
    $("#Mheader").text($(this).parent().parent().find("span").text());
    $("#Mtext").empty();
    $("#Mtext").append($(this).parent().parent().find("a").first());

    $.getJSON("/find/" + id, function (data) {
        for (let i = 0; i < data.length; i++) {
            $("#savedNotes").append(`
                <li data-id=${data[i]._id} class="collection-item"> ${data[i].note} 
                    <a id="deleteNote" class="btn-floating btn-small waves-effect waves-light red right deleteNote">
                        <i class='material-icons'>delete_forever</i>
                    </a>
                </li>`);
        };
    });
});

// Save Notes Function
$(document).on("click", "#saveNote", function () {

    id = $(this).data("id");

    $.ajax({
        type: "POST",
        url: "/saveNote",
        dataType: "json",
        data: {
            articleid: id,
            note: $("#note").val(),
            created: Date.now()
        }
    })
        .then(function (data) {
            $("#savedNotes").append(`
                <li data-id=${data._id} class="collection-item"> ${data.note}
                    <a id="deleteNote" class="btn-floating btn-small waves-effect waves-light red right deleteNote">
                        <i class='material-icons'>delete_forever</i>
                    </a>
                </li>`);
            $("#note").val("");
        });

    return false;

});

// Delete Note Function
$(document).on("click", ".deleteNote", function () {

    let selected = $(this).parent();
    let id = selected.attr("data-id");

    console.log(selected);
    console.log(id);

    $.ajax({
        type: "GET",
        url: "/delete/note/" + id,

        success: function (response) {
            selected.remove();
            $("#note").val("");
        }
    });
});