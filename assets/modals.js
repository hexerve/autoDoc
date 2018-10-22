var srcType = 'all',
    pc, currentUser, autoCopy = true;

var url = window.location.href;
url = url.split('=');
url = url[1].split('&');
var base_url = decodeURIComponent(url[0]);

var getArticles;
var appendArticles;
var copy;
var paste;
var copyData;

var typingTimer;
var doneTyping;
var doneTypingInterval = 300;

$(function () {
    $('#myAccordion').hide();
    //https://developerblog.zendesk.com/making-modals-work-in-zaf-v2-251b7c940e58

    // Initialise the Zendesk JavaScript API client
    // https://developer.zendesk.com/apps/docs/apps-v2
    var client = ZAFClient.init();
    client.on('app.registered', init);

    function init() {
        client.get('currentUser').then(function (agent) {
            currentUser = agent.currentUser;
            data = base_url + '/api/v2/help_center/users/' + currentUser.id + '/articles.json';
            getArticles(data, 'my');
        });
        pc = getParentClient(getGuid(window.location.hash));
    }

    function getGuid(paramString) {
        return paramString.split('=')[1];
    }

    function getParentClient(parent_guid) { //Definitely redundant but w/e
        return client.instance(parent_guid)
    }

    //actual modal functionality

    copyData = function () {
        if (!autoCopy) {
            return;
        }
        try {
            let ok = document.execCommand('copy');
            if (!ok) {
                $('.alert').remove();
                setTimeout(() => {
                    $('#modal-msg').append(
                        '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Unable to copy!' +
                        '</div>'
                    );
                    $('.alert').fadeOut(5000);
                }, 200);
            }
        } catch (err) {
            $('.alert').remove();
            setTimeout(() => {
                $('#modal-msg').append(
                    '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'Unsupported Browser!' +
                    '</div>'
                );
                $('.alert').fadeOut(5000);
            }, 200);
        }
    };

    paste = function (e) {
        var clipboardData, pastedData;

        // Stop data actually being pasted
        e.stopPropagation();
        e.preventDefault();

        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('text/html');

        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + pastedData);
        });

        $('.alert').remove();
        setTimeout(() => {
            $('#modal-msg').append(
                '<div class="alert alert-small-right alert-sm alert-success alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                'Pasted!' +
                '</div>'
            );
            $('.alert').fadeOut(5000);
        }, 200);

    };

    copy = function (id, type) {
        try {
            let ok = document.execCommand('copy');

            if (ok) {
                $('#' + type + '_selected-text-' + id).removeClass('selected-text').addClass('active').text("Copied!");
                setTimeout(function () {
                    $('#' + type + '_selected-text-' + id).addClass('selected-text').removeClass('active').html("&lobrk; o &robrk;");
                }, 500);
            } else {
                $('.alert').remove();
                setTimeout(() => {
                    $('#modal-msg').append(
                        '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Unable to copy!' +
                        '</div>'
                    );
                    $('.alert').fadeOut(5000);
                }, 200);
            }
        } catch (err) {
            $('.alert').remove();
            setTimeout(() => {
                $('#modal-msg').append(
                    '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'Unsupported Browser!' +
                    '</div>'
                );
                $('.alert').fadeOut(5000);
            }, 200);
        }
    };

    appendArticles = function (response, type) {
        for (let i = 0; i < response.count; i++) {
            let j = i + 1;
            let results;

            if (type === 'all') {
                results = response.results;
            } else {
                results = response.articles;
            }

            let data_parent = (type === 'all') ? '"#accordion">' : '"#myAccordion">';

            let id = results[i].id;
            let url = results[i].html_url;
            let title = results[i].title;
            let body = results[i].body;

            let article = '<div class="card">' +
                '<div class="card-header row">' +
                '<div class="col-sm-9">' +
                '<div class="collapsed" id="' + type + '_heading' + j + '" data-toggle="collapse" data-target="#' + type + '_collapse' + j +
                '" aria-expanded="false" aria-controls="' + type + '_collapse"' + j + '">' +
                '<div class="row">' +
                '<div class="col-sm-3">#' + id + '</div>' +
                '<div class="col-sm-9">' +
                '<div class="postHeading" id="' + type + '_article_' + j + '">' + title + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-3">' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<button type="button" class="btn copy-btn copy-link ' + type + '-copy-link" id="' + type + '_copy-link-' + j + '">&#x1F517;</button>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<button type="button" class="btn copy-btn selected-text ' + type + '-selected-text" id="' + type + '_selected-text-' + j + '" onclick=copy(' + j + ',"' + type + '");>&lobrk; o &robrk;</button>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<button type="button" class="btn copy-btn ' + type + '-copy-text" id="' + type + '_copy-txt-' + j + '">Copy</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="' + type + '_collapse' + j + '" class="collapse" aria-labelledby="' + type + '_heading' + j + '" data-parent=' + data_parent +
                '<a class="article-link" id="' + type + '_article_link_' + j + '" href="' + url + '"></a>' +
                '<div class="card-body" id="' + type + '_article_body_' + j + '">' +
                body +
                '</div>' +
                '</div>' +
                '</div>';
            if (type === 'all') {
                $('#accordion').append(article);
            } else {
                $('#myAccordion').append(article);
            }
        }
    };

    getArticles = function (url, type) {
        var options = {
            url: url,
            type: 'GET',
            contentType: "application/json",
            cors: true
        };
        pc.request(options).then(
            function (response) {
                console.log(response);
                if (response.page === 1) {
                    if (type === 'all') {
                        $('#accordion').empty();
                        if (response.count === 0) {
                            $('#accordion').append('<div class="pl-4"> No data found...</div>');
                        }
                    } else {
                        if (response.count === 0) {
                            $('#myAccordion').append('<div class="pl-4"> No data found...</div>');
                        }
                    }
                }
                appendArticles(response, type);
                while (response.next_page) {
                    getArticles(response.next_page, type);
                }
            });
    };

    doneTyping = function () {
        let data = $('#search').val();
        if (data) {
            data = base_url + "/api/v2/help_center/articles/search.json?query=" + data;
            getArticles(data, 'all');
        }
    };

    $(document).on('click', '#src-all', function () {
        if (srcType === 'all') {

        } else {
            $('#src-' + srcType).addClass('btn-secondary').removeClass('btn-dark');
            $('#src-all').addClass('btn-dark').removeClass('btn-secondary');
            srcType = 'all';
            $('#search').show(300);
            $('#myAccordion').fadeOut(150);
            setTimeout(() => {
                $('#accordion').fadeIn(150);
            }, 150);
        }
    });

    $(document).on('click', '#src-my', function () {
        if (srcType === 'my') {

        } else {
            $('#src-' + srcType).addClass('btn-secondary').removeClass('btn-dark');
            $('#src-my').addClass('btn-dark').removeClass('btn-secondary');
            srcType = 'my';
            $('#search').hide(200);
            $('#accordion').fadeOut(200);
            setTimeout(() => {
                $('#myAccordion').fadeIn(150);
            }, 200);
        }
    });

    $(document).on('click', '.all-copy-link', function (e) {
        let id = e.target.id.split('-')[2];
        let link = $('#all_article_link_' + (id)).attr('href');
        let heading = $('#all_article_' + (id)).text();
        let data = '<p><a href="' + link + '">' + heading + '</a></p>';
        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + data);
            $('#all_copy-link-' + id).removeClass('copy-link').addClass('active').text("Copied!");
            setTimeout(function () {
                $('#all_copy-link-' + id).addClass('copy-link').removeClass('active').html("&#x1F517;");
            }, 1000);
        });
    });

    $(document).on('click', '.all-copy-text', function (e) {
        let id = e.target.id.split('-')[2];
        let body = $('#all_article_body_' + (id)).html();
        let data = '<p>' + body + '</p>';
        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + data);
            $('#all_copy-txt-' + id).addClass('active').text("Copied!");
            setTimeout(function () {
                $('#all_copy-txt-' + id).removeClass('active').text("Copy");
            }, 1000);
        });
    });

    $(document).on('click', '.my-copy-link', function (e) {
        let id = e.target.id.split('-')[2];
        let link = $('#my_article_link_' + (id)).attr('href');
        let heading = $('#my_article_' + (id)).text();
        let data = '<p><a href="' + link + '">' + heading + '</a></p>';
        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + data);
            $('#my_copy-link-' + id).removeClass('copy-link').addClass('active').text("Copied!");
            setTimeout(function () {
                $('#my_copy-link-' + id).addClass('copy-link').removeClass('active').html("&#x1F517;");
            }, 1000);
        });
    });

    $(document).on('click', '.my-copy-text', function (e) {
        let id = e.target.id.split('-')[2];
        let body = $('#my_article_body_' + (id)).html();
        let data = '<p>' + body + '</p>';
        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + data);
            $('#my_copy-txt-' + id).addClass('active').text("Copied!");
            setTimeout(function () {
                $('#my_copy-txt-' + id).removeClass('active').text("Copy");
            }, 1000);
        });
    });

    $(document).on('click', '#auto-copy', function () {
        autoCopy = !autoCopy;
        autoCopy ? $('#auto-copy').removeClass('gear-inactive') : $('#auto-copy').addClass('gear-inactive')
    });

    $(document).on('keyup', '#search', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $(document).on('keydown', '#search', function () {
        clearTimeout(typingTimer);
    });

    $(document).on('mouseup', '.card-body', copyData)

    document.addEventListener('paste', paste);
});