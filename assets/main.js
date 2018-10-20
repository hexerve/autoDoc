var createModal;
var prevText = '';

$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {
        width: '100%',
        height: '152px'
    });

    client.on('app.registered', init);

    function init() {
        //   client.context().then(createModal);
    };

    createModal = function (context) {
        client.invoke('instances.create', {
            location: 'modal',
            url: 'assets/modals.html#parent_guid=' + context.instanceGuid,
        }).then(function (modalContext) {
            // The modal is on screen now
            var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);
            modalClient.invoke('resize', {
                width: '80vw',
                height: '80vh'
            });
            modalClient.on('modal.close', function () {
                // The modal has been closed
            });
        });
    }

    var url = window.location.href;
    url = url.split('=');
    url = url[1].split('&');
    var base_url = decodeURIComponent(url[0]);

    $(document).on('click', '#submit', function () {
        let title = $('#macro').val();
        let comment = $('#macroDesc').val();
        if (title === "" || comment === "") {
            $('#msg').append(
                '<div class="alert alert-sm alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops!</strong> Incomplete credentials.' +
                '</div>'
            );

            setTimeout(function () {
                $('.alert').hide(500);
            }, 1000);
            return;
        }
        let data = {
            macro: {
                'title': title,
                'actions': [{
                    'field': 'comment_value',
                    'value': comment
                }]
            }
        };
        var options = {
            url: base_url + "/api/v2/macros.json",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            cors: true
        };
        client.request(options).then(
            function (response) {
                $('#macro').val('');
                $('#macroDesc').val('');
                $('#msg').append(
                    '<div class="alert alert-sm alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Success!</strong> Macro Created.' +
                    '</div>'
                );

                setTimeout(function () {
                    $('.alert').hide(500);
                }, 1000);
            });

    });

    setInterval(function () {
        client.get('comment.text').then(function (text) {
            if (text["comment.text"] !== prevText) {
                prevText = text["comment.text"];

                let textFormat = prevText.replace(/<p>/g, " ").replace(/(<([^>]+)>)/g, "")
                    .split('&nbsp;').join(' ');
                let preIndex = textFormat.indexOf('`');
                let lastIndex = preIndex + 1;

                if (preIndex !== -1) {
                    let isNum = true;
                    while (isNum || isNum === 0) {
                        isNum = parseInt(textFormat.charAt(lastIndex));
                        lastIndex++;
                    }
                    lastIndex--;
                }
                if (preIndex !== -1 && lastIndex > preIndex && lastIndex < textFormat.length) {
                    let id = textFormat.substring(preIndex, lastIndex).trim();
                    id = id.substring(1, id.length);

                    let fIndex = prevText.indexOf('`');
                    let lIndex = fIndex;
                    let tempId = id;
                    while (tempId) {
                        let char = tempId.charAt(0);
                        tempId = tempId.substring(1);
                        lIndex = lIndex + prevText.substring(lIndex).indexOf(char);
                    }
                    let shortcut = prevText.substring(fIndex, lIndex + 1);

                    if (parseInt(id)) {
                        var options = {
                            url: base_url + '/api/v2/help_center/articles/' + id + '.json',
                            type: 'GET',
                            contentType: "application/json",
                            cors: true
                        };
                        client.request(options).then(
                            function (response) {
                                let article = '<h1>' + response.article.title + '</h1>' + response.article.body;
                                let new_text = prevText.replace(shortcut, article);
                                client.set('comment.text', "");
                                client.invoke('ticket.editor.insert', new_text);
                            },
                            function (err) {
                                if (err.status === 404) {
                                    let new_text = prevText.replace(shortcut, '<blockquote>Article id = <b>' + id + ' Not Available</b></blockquote>');
                                    client.set('comment.text', "");
                                    client.invoke('ticket.editor.insert', new_text);
                                }
                            });

                    } else {
                        let new_text = prevText.replace('`', "'");
                        client.set('comment.text', "");
                        client.invoke('ticket.editor.insert', new_text);
                    }
                }
            }
        });
    }, 1000);

    $(document).on('click', '#open', function () {
        client.context().then(createModal);
    });

});