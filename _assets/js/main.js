$('.openload-download-button').on('click', function () {
    var $btn = $(this).button('loading')

    $.ajax({
        type: 'GET',
        url: 'https://api.openload.co/1/file/dlticket?file=' + $btn.data('openload-id'),
        dataType: 'json',
        success: function (dataTicket) {
            if (dataTicket['status'] == 200) {
                var modal = $('#openloadDownloadModal').modal('show')
                var $btnSubmit = modal.find('.openload-download-button-complete')
                var $alertContainer = modal.find('.openload-download-alert-container')
                modal.find('.openload-download-modal-captcha').attr('src', dataTicket['result']['captcha_url'])
                modal.find('form').submit(function (event) {
                    event.preventDefault();
                    $alertContainer.html('')
                    $btnSubmit.button('loading')
                    var captchaContent = modal.find('#openloadDownloadModal-captcha-content').val()
                    $.ajax({
                        type: 'GET',
                        url: 'https://api.openload.co/1/file/dl?file=' + $btn.data('openload-id') + '&ticket=' + dataTicket['result']['ticket'] + '&captcha_response=' + captchaContent,
                        dataType: 'json',
                        success: function (dataDownload) {
                            if (dataDownload['status'] == 200) {
                                $('#openloadDownloadModal').modal('hide')
                                window.location.href = dataDownload['result']['url'];
                            } else if (dataDownload['status'] == 403 && dataDownload['msg'] == 'Captcha not solved correctly') {
                                $alertContainer.html('<div class="alert alert-danger" role="alert">Invalid captcha!</div>')
                            } else {
                                window.location.href = 'https://oload.tv/f/' + $btn.data('openload-id');
                            }
                        },
                        complete: function () {
                            $btnSubmit.button('reset')
                        }
                    });
                })
            } else {
                window.location.href = 'https://oload.tv/f/' + $btn.data('openload-id');
            }
        },
        error: function () {
            window.location.href = 'https://oload.tv/f/' + $btn.data('openload-id');
        },
        complete: function () {
            $btn.button('reset')
        }
    });
})
$('#openloadDownloadModal').on('hide.bs.modal', function (e) {
    $('#openloadDownloadModal').find('#openloadDownloadModal-captcha-content').val('')
    $('#openloadDownloadModal').find('.openload-download-button-complete').prop('onclick', null).off('click');
    $('#openloadDownloadModal').find('.openload-download-alert-container').html('');
})

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    $('#back-to-top').tooltip('show');

    if ($.find('.views-container').length > 0) {
        $.ajax({
            type: 'GET',
            url: 'https://teamidealsubs-165916.appspot.com/query?id=ahZlfnRlYW1pZGVhbHN1YnMtMTY1OTE2chULEghBcGlRdWVyeRiAgICAgICACgw',
            cache: false,
            dataType: 'json',
            success: function (dataAllViews) {
                $('.views-container').each(function () {
                    var $viewPanel = $(this)
                    var dataFound = false

                    dataAllViews["rows"].forEach(function (pageViews) {
                        if (pageViews[0] == $viewPanel.data("page-path")) {
                            $viewPanel.html($viewPanel.data("views-prefix") + "<b>" + numeral(pageViews[1]).format('0,0') + "</b>")
                            dataFound = true
                        }
                    });
                    if (dataFound == false) {
                        $viewPanel.html($viewPanel.data("views-prefix") + "<b>N/A</b>")
                    }
                })
            },
            error: function () {
                $('.views-panel').each(function () {
                    $viewPanel.html($viewPanel.data("views-prefix") + "<b>N/A</b>")
                })
            }
        })
    }
    if ($.find('.comments-container').length > 0) {
        var listOfUrls = [];
        $('.comments-container').each(function () {
            listOfUrls.push('link:' + $(this).attr('data-page-url'));
        })

        $.ajax({
            type: 'GET',
            url: "https://disqus.com/api/3.0/threads/set.jsonp",
            data: {api_key: 'ze5cwNIhIOpuAOD4mVgUlSeYPIiKurO28O4SFYuwfeIEkNMHIEbhYxSUkc1SywxC', forum: 'teamidealsubs', thread: listOfUrls},
            cache: false,
            dataType: 'jsonp',
            success: function (dataThreadsSet) {
                if (dataThreadsSet['code'] == 0) {
                    $('.comments-container').each(function () {
                        $commentsContainer = $(this)
                        for (var i in dataThreadsSet['response']) {
                            if (dataThreadsSet['response'][i]['link'] == $commentsContainer.attr('data-page-url')) {
                                if (dataThreadsSet['response'][i]['posts'] >= $commentsContainer.data("comments-min")) {
                                    $commentsContainer.html($commentsContainer.data("comments-prefix") + "<b>" + numeral(dataThreadsSet['response'][i]['posts']).format('0,0') + "</b>")
                                }
                            }
                        }
                    })
                } else {
                    console.error("unexpected response from disqus: ", dataThreadsSet)
                }
            }
        });
    }
});

var trackOutboundLink = function(url) {
    ga('send', 'event', 'outbound', 'click', url, {
        'transport': 'beacon',
        'hitCallback': function(){document.location = url;}
    });
}