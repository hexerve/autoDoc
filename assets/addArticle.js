var currentUser, articleBody, getSections;

var url = window.location.href;
url = url.split('=');
url = url[1].split('&');
var base_url = decodeURIComponent(url[0]);

$(function () {
    var client = ZAFClient.init();
    client.on('app.registered', init);

    function init() {
        client.get('currentUser').then(function (agent) {
            currentUser = agent.currentUser;
        });
        pc = getParentClient(getGuid(window.location.hash));
        pc.get('comment.text').then(function (data) {
            articleBody = data['comment.text'];
        });



        getSections(base_url + '/api/v2/help_center/sections.json');
    }

    getSections = function (url) {
        var options = {
            url: url,
            type: 'GET',
            contentType: "application/json",
            cors: true
        };
        pc.request(options).then(function (response) {
            response.sections.forEach(section => {
                $('#section').append('<option value=' + section.id + '>' + section.name + '</option>');
            });
            if (response.next_page) {
                getSections(response.next_page);
            }
        });
    }

    function getGuid(paramString) {
        return paramString.split('=')[1];
    }

    function getParentClient(parent_guid) {
        return client.instance(parent_guid);
    }

    //actual modal functionality
    postArticle = function () {

        let sectionId = $('#section').val();
        let title = $('#title').val();

        if (!title || !sectionId || !articleBody || articleBody === "<p></p>") {
            $('.alert').remove();
            setTimeout(() => {
                $('#modal-msg').append(
                    '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'Incomplete data!' +
                    '</div>'
                );
                $('.alert').fadeOut(5000);
            }, 200);
            return;
        }

        var options = {
            url: base_url + '/api/v2/help_center/sections/' + sectionId + '/articles.json',
            data: '{"article": {"title": "' + title + '", "body": "' + articleBody + '"}}',
            type: 'POST',
            contentType: "application/json",
            cors: true
        };
        pc.request(options).then(
            function (response) {
                $('.alert').remove();
                setTimeout(() => {
                    $('#modal-msg').append(
                        '<div class="alert alert-small-right alert-sm alert-success alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Article posted!' +
                        '</div>'
                    );
                    $('.alert').fadeOut(5000);
                }, 200);
                $('#title').val('');
            },
            function (err) {
                if (err) {
                    $('.alert').remove();
                    setTimeout(() => {
                        $('#modal-msg').append(
                            '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                            'Some error occured!' +
                            '</div>'
                        );
                        $('.alert').fadeOut(5000);
                    }, 200);
                }
            });
    };

    $(document).on('click', '#submit', function () {
        postArticle();
    })
});