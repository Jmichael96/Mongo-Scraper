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
                    // iterating over comments for articles and then rendering the string in the return statement
                    let commentString = ``;
                    if (item.comments.length >= 1) {
                        let comments = item.comments;
                        for (let i = 0; i < comments.length; i++) {
                            commentString += `<li class="commentText">${comments[i].comment} <button onclick="deleteComment('${item._id}', '${comments[i]._id}')" class="deleteComment">X</button> <hr /></li>`
                        }
                    } else {
                        commentString = ``;
                    }
                    
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
                                <ul class="commentList">                                    
                                    ${commentString}
                                </ul>
                            </div>
                            <div class="commentInput">
                                <form action="/api/article/add_comment/${item._id}" method="POST" id="commentForm">
                                    <div class="form-group">
                                        <div class="inputWrap">
                                            <input id="comment" placeholder="Add a comment" name="comment" type="text" />
                                            <button id="submitComment" type="submit">SUBMIT</button>
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

//Handle Scrape button
$("#scrape").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/api/article/scrape",
    }).then((data) => {
        window.location.reload();
    })
    .catch((err) => {
        throw err;
    });
});

// delete a comment 
function deleteComment(postId, commentId) {
    console.log(postId, commentId);
    $.ajax({
        method: 'PUT',
        url: '/api/article/delete_comment/' + postId + '/' + commentId
    })
    .then((data) => {
        window.location.reload();
    })
    .catch((err) => {
        throw err;
    });
}

// save an article
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
            window.location.reload();
        })
        .catch((err) => {

        });
});

// unsave an article 
function unsaveArticle(id) {
    console.log('unsaveArticle()')
    $.ajax({
        method: 'PUT',
        url: '/api/article/unsave/' + id
    })
        .then((data) => {
            window.location.reload();
        })
        .catch((err) => {
            throw err;
        });
}

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
            throw err;
        });
});