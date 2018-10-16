var srcType = 'all',
    pc;
$(function () {
    //https://developerblog.zendesk.com/making-modals-work-in-zaf-v2-251b7c940e58

    // Initialise the Zendesk JavaScript API client
    // https://developer.zendesk.com/apps/docs/apps-v2
    var client = ZAFClient.init();
    client.on('app.registered', init);

    function init() {
        pc = getParentClient(getGuid(window.location.hash));
    }

    function getGuid(paramString) {
        return paramString.split('=')[1];
    }

    function getParentClient(parent_guid) { //Definitely redundant but w/e
        return client.instance(parent_guid)
    }

    //actual modal functionality

    $(document).on('click', '#src-all', function () {
        if (srcType === 'all') {

        } else {
            $('#src-' + srcType).addClass('btn-secondary').removeClass('btn-dark');
            $('#src-all').addClass('btn-dark').removeClass('btn-secondary');
            srcType = 'all';
        }
    });

    $(document).on('click', '#src-fav', function () {
        if (srcType === 'fav') {

        } else {
            $('#src-' + srcType).addClass('btn-secondary').removeClass('btn-dark');
            $('#src-fav').addClass('btn-dark').removeClass('btn-secondary');
            srcType = 'fav';
        }
    });

    $(document).on('click', '#src-my', function () {
        if (srcType === 'my') {

        } else {
            $('#src-' + srcType).addClass('btn-secondary').removeClass('btn-dark');
            $('#src-my').addClass('btn-dark').removeClass('btn-secondary');
            srcType = 'my';
        }
    });

    $(document).on('click', '.copy-link', function (e) {
        let id = e.target.id.split('-')[2];
        let link = $('#article_link_' + (id)).attr('href');
        let heading = $('#article_' + (id)).text();
        let data = '<p><a href="' + link + '">' + heading + '</a></p>';
        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + data);
            $('#copy-link-' + id).removeClass('copy-link').addClass('active').text("Copied!");
            setTimeout(function(){
                $('#copy-link-' + id).addClass('copy-link').removeClass('active').html("&#x1F517;");
            },1000);
        });
    });

    $(document).on('click', '.copy-text', function (e) {
        let id = e.target.id.split('-')[2];
        let body = $('#article_body_' + (id)).text();
        let data = '<p>' + body + '</p>';
        pc.get('comment.text').then(function (ticket_data) {
            pc.set('comment.text', ticket_data['comment.text'] + data);
            $('#copy-txt-' + id).addClass('active').text("Copied!");
            setTimeout(function(){
                $('#copy-txt-' + id).removeClass('active').text("Copy");
            },1000);
        });
    });

});