$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {
        width: '100%',
        height: '100%'
    });

    var url = window.location.href;
    url = url.split('=');
    url = url[1].split('&');
    var base_url = decodeURIComponent(url[0]);

    $(document).on('click', '#submit', function () {
        let title = $('#macro').val();
        let comment = $('#macroDesc').val();
        if (title === "" || comment === ""){
            $('#msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops!</strong> Incomplete credentials.' +
                '</div>'
            );

            setTimeout(function(){
                $('.alert').hide(500);
            },1000);
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
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Success!</strong> Macro Created.' +
                    '</div>'
                );

                setTimeout(function(){
                    $('.alert').hide(500);
                },1000);
            });

    });
});