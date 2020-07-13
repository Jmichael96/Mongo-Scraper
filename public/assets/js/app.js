'use strict'

// on window load call a GET request to see if there are any articles in the DB
window.onload = function () {
    // getting the window pathname and executing the get request accordingly
    let urlPath = window.location.pathname;

    if (urlPath === '/') {
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
                            <a onclick="saveArticle('${item._id}');" id="save-item"><button class="saveBtn" type="button">SAVE</button></a>
                            <a href="${item.link}" target="_blank"><button class="linkBtn" type="button">VIEW SOURCE</button></a>
                        </div>
                    </div>
            `
                }).join('');
            })
            .catch((err) => {
                throw err;
            });
    } else if (urlPath === '/saved') {
        $.ajax({
            method: 'GET',
            url: '/api/article/all_saved'
        })
            .then((res) => {
                let renderArea = document.getElementById('renderSaved');

                renderArea.innerHTML = res.map((item) => {
                    return `
                    <article class="savedWrap">
                        <div class="savedCard" id="{{this._id}}"
                            style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), 
                            url(${item.image}); 
                            background-position: center;
                            background-repeat: no-repeat;
                            background-size: cover;">
                            <div class="savedCardContent">
                                <p class="savedCardDate">${item.date}</p>
                                <h4 class="savedCardTitle">${item.title}</h4>
                            </div>
                            <div class="savedCardBtnWrap">
                                <a onclick="unsaveArticle('${item._id}');" id="unsave-item"><button class="saveBtn" type="button">DELETE</button></a>
                                <a href="${item.link}" target="_blank"><button class="linkBtn" type="button">VIEW SOURCE</button></a>
                            </div>
                        </div>
                        <section class="commentSection">
                            <div class="postedComments">
                                ${renderComments(item.comment)}
                            </div>
                            <div class="commentInput">
                                <form method="POST">
                                    <div class="form-group">
                                        <label>Add Comment</label>
                                        <div class="inputWrap">
                                            <input id="commentInput" name="comment" type="text" class="" />
                                            <button id="submitComment" type="submit">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </article>
                `
                }).join('');

            })
            .catch((err) => {
                throw err;
            });
    }
};

function renderComments(arr) {
    if (arr.length >= 1) {
        arr.map((comment) => {
            return `
                <div>
                    <p>${comment}</p>
                    <hr />
                </div>
            `
        });
    } else {
        return `<p>No comments</p><hr />`;
    }
}

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

// // handle saving an article
// $('#save-item').on('click', () => {
//     console.log('saved!')
//     let thisId = $(this).attr("data-id");

//     // $.ajax({
//     //     method: "PUT",
//     //     url: "/api/article/save/" + thisId
//     // })
//     // .done(function(data) {
//     //     window.location = "/saved"
//     // })
// });

function saveArticle(id) {
    let articleId = id;
    console.log('saveArticle()', articleId);
    $.ajax({
        method: "PUT",
        url: "/api/article/save/" + articleId
    })
        .done(function (data) {
            window.location = '/saved'
        });
}

// delete all articles
$('#clearBtn').on('click', () => {
    $.ajax({
        method: 'DELETE',
        url: '/api/article/clear'
    })
        .then(() => {
            console.log('deleted')
            window.location.reload();
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
            window.location.reload();
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
            window.location = '/';
        })
        .catch((err) => {
            // const error = err.response.data.serverMsg;
            console.log(err.response.data.serverMsg);
        });
});