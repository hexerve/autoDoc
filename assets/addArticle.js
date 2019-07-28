var currentUser, articleBody, getSections, getUserSegment, getPermissionGroup;
var base_url;
var userSegment = null
var permissionGroup = null

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

        pc.get('ticket.subject').then(function (data) {
            $('#title').val(data['ticket.subject']);
        });

        client.get('currentAccount.subdomain').then(function (res) {
            base_url = 'https://' + res['currentAccount.subdomain'] + '.zendesk.com';

            getSections(base_url + '/api/v2/help_center/sections.json');
            setTimeout(function () {
                $('.loader').addClass('hide');
                $('#body-container').removeClass('hide');
            }, 1000);

            getUserSegment(base_url + '/api/v2/help_center/user_segments.json')
            getPermissionGroup(base_url + '/api/v2/guide/permission_groups.json')
        });
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

    getUserSegment = function (url) {
        var options = {
            url: url,
            type: 'GET',
            contentType: "application/json",
            cors: true
        };
        pc.request(options).then(function (response) {
            response.user_segments.forEach(segment => {
                if(segment.user_type === "signed_in_users"){
                    userSegment = segment.id
                }
            });
        });
    }

    
    getPermissionGroup = function (url) {
        var options = {
            url: url,
            type: 'GET',
            contentType: "application/json",
            cors: true
        };
        pc.request(options).then(function (response) {
            console.log(response.permission_groups)
                
            response.permission_groups.forEach(group => {
                console.log(group.name)
                if(group.name === "Agents and Managers"){
                    permissionGroup = group.id
                }
            });
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
        }else if(userSegment === null || permissionGroup === undefined){
            $('.alert').remove();
            setTimeout(() => {
                $('#modal-msg').append(
                    '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'User Segment not found for signed in users!' +
                    '</div>'
                );
                $('.alert').fadeOut(5000);
            }, 200);
            return;
        }else if(permissionGroup === null){
            $('.alert').remove();
            setTimeout(() => {
                $('#modal-msg').append(
                    '<div class="alert alert-small-right alert-sm alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'Permission group not found!' +
                    '</div>'
                );
                $('.alert').fadeOut(5000);
            }, 200);
            return;
        }

        var options = {
            url: base_url + '/api/v2/help_center/sections/' + sectionId + '/articles.json',
            data: '{"article": {"title": "' + title + '", "body": "' + articleBody + '", "draft": true, "user_segment_id": "' + userSegment + '", "permission_group_id": "' + permissionGroup + '"}}',
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