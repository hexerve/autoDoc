var createModal;
$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {
        width: '100%',
        height: '152px'
    });

    client.on('app.registered', init);

    function init(){
    //   client.context().then(createModal);
    };

    createModal = function (context) {
        client.invoke('instances.create', {
            location: 'modal',
            url: 'assets/modals.html#parent_guid=' + context.instanceGuid,
        }).then(function (modalContext) {
            // The modal is on screen now
            var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);
            modalClient.invoke('resize', { width: '80vw', height: '80vh' });
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

    $(document).on('click', '#open', function(){
        client.context().then(createModal);
    });
});