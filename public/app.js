// Create card function
function createCard(data) {
    let card = `
    <div class="card small blue-grey darken-1">
        <div class="card-content white-text">
            <span class="card-title">${data.title}</span>
            <a target="_blank" href="${data.link}">Go To Article</a>
        </div>
        <div class="card-action">
            <a id="save" class="btn-small" style="background-color: #02276b;">Save Article</a>
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
            createCard(data[i]);
        };
    });
});

// Save Article Function
$("#save").on("click", function () {

    console.log("Clicked");
    
    $.ajax({
        type: "POST",
        url: "/saved",
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