var srcType = 'all';
$(function () {
    //https://developerblog.zendesk.com/making-modals-work-in-zaf-v2-251b7c940e58
    
    // Initialise the Zendesk JavaScript API client
    // https://developer.zendesk.com/apps/docs/apps-v2
    var client = ZAFClient.init();
    client.on('app.registered', init);

    function init() {
        pc = getParentClient(getGuid(window.location.hash));
        pc.get('ticket').then(function (ticket_data) {
            console.log(ticket_data)
        }); //And like that we now have easy access to the parent ticket modal without guessing which instance the parent is from an array.. Winning!

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

});