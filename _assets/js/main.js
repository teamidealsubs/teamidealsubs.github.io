$('.openload-download-button').on('click', function () {
    var $btn = $(this).button('loading')

    $.ajax({
        type: 'GET',
        url: 'https://api.openload.co/1/file/dlticket?file=' + $btn.data('openload-id'),
        dataType: 'json',
        success: function (dataTicket) {
            if (dataTicket['status'] == 200) {
                var modal = $('#openloadDownloadModal').modal('show')
                modal.find('.openload-download-modal-captcha').attr('src', dataTicket['result']['captcha_url'])
                modal.find('.openload-download-button-complete').on('click', function () {
                    var captchaContent = modal.find('#openloadDownloadModal-captcha-content').val()
                    $.ajax({
                        type: 'GET',
                        url: 'https://api.openload.co/1/file/dl?file=' + $btn.data('openload-id') + '&ticket=' + dataTicket['result']['ticket'] + '&captcha_response=' + captchaContent,
                        dataType: 'json',
                        success: function (dataDownload) {
                            if (dataDownload['status'] == 200) {
                                window.location.href = dataDownload['result']['url'];

                                modal.find('.openload-download-button-complete').prop('onclick', null).off('click');
                                modal.find('#openloadDownloadModal-captcha-content').val('')
                                $('#openloadDownloadModal').modal('hide')
                            }
                        },
                        complete: function () {
                            //$btn.button('reset')
                            // @TODO: make second button loading to, reset it here
                        }
                    });
                });
            } else {
                window.location.href = 'https://openload.co/f/' + $btn.data('openload-id');
            }
        },
        error: function() {
            window.location.href = 'https://openload.co/f/' + $btn.data('openload-id');
        },
        complete: function () {
            $btn.button('reset')
        }
    });
    // @TODO: error handling
})

$(document).ready(function(){
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
            dataType: 'json',
            success: function (dataAllViews) {
                $('.views-container').each(function() {
                    var $viewPanel = $(this)
                    var dataFound = false

                    dataAllViews["rows"].forEach(function (pageViews) {
                        if (pageViews[0] == $viewPanel.data("page-path")) {
                            $viewPanel.html($viewPanel.data("views-prefix") + "<b>" + pageViews[1] + "</b>")
                            dataFound = true
                        }
                    });
                    if (dataFound == false) {
                        $viewPanel.html($viewPanel.data("views-prefix") + "<b>N/A</b>")
                    }
                })
            },
            error: function() {
                $('.views-panel').each(function() {
                    $viewPanel.html($viewPanel.data("views-prefix") + "<b>N/A</b>")
                })
            }
        })
    }
});
