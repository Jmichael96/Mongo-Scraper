'use strict'

// on window load call a GET request to see if there are any articles in the DB
window.onload = function () {
    $.ajax({
        method: 'GET',
        url: '/api/article/all_articles'
    })
        .then((res) => {
            let renderArea = document.getElementById('renderArticles');
            renderArea.innerHTML = res.map((item) => {
                return `
                    <div class="articleCard" id="{{this._id}}"
                        style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${item.image});">
                        <div class="contentWrap">
                            <p class="cardDate">${item.date}</p>
                            <h4 class="cardTitle">${item.title}</h4>
                        </div>
                        <div class="btnWrap">
                            <a data-id="{{id}}" id="save-item"><button class="saveBtn" type="button">SAVE</button></a>
                            <a href="${item.link}" target="_blank"><button class="linkBtn" type="button">VIEW SOURCE</button></a>
                        </div>
                    </div>
            `
            }).join('');
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

//Handle Scrape button
$("#scrape").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/api/article/scrape",
    }).done(function (data) {
        console.log(data)
        window.location.reload();
    })
});

//Handle Delete Article button
$("#delete-one").on("click", function () {
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/delete-one/" + thisId
    }).done(function (data) {
        window.location = "/saved"
    })
});

// handle saving an article
$('#save-item').on('click', () => {
    console.log('saved!')
    let thisId = $(this).attr("data-id");

    // $.ajax({
    //     method: "PUT",
    //     url: "/api/article/save/" + thisId
    // })
    // .done(function(data) {
    //     window.location = "/saved"
    // })
});



// delete all articles
$('#clearBtn').on('click', () => {
    $.ajax({
        method: 'DELETE',
        url: '/api/article/clear'
    })
        .then(() => {
            console.log('deleted')
            window.location = '/'
        })
        .catch((err) => {

        });
});

// unsave an article
$('#unsaveArticle').on('click', function () {
    let thisId = $(this).attr("data-id");
    console.log('unsave article ', thisId)
    $.ajax({
        method: 'PUT',
        url: '/api/article/unsave/' + thisId
    })
        .then((data) => {

        })
        .catch((err) => {
            console.log(err);
        });
});

// unsave all articles
$('#unsaveAll').on('click', function () {
    $.ajax({
        method: 'PUT',
        url: '/api/article/unsave_all'
    })
        .then((data) => {

        })
        .catch((err) => {
            // const error = err.response.data.serverMsg;
            console.log(err.response.data.serverMsg);
        });
});