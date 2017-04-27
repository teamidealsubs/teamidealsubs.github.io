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
                                window.location = dataDownload['result']['url'], '_blank';

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
            }
        },
        complete: function () {
            $btn.button('reset')
        }
    });
    // @TODO: error handling
})

$('.views-panel').each(function() {
    var $viewPanel = $(this)
    $.ajax({
        type: 'GET',
        url: 'https://teamidealsubs-165916.appspot.com/query?id=ahZlfnRlYW1pZGVhbHN1YnMtMTY1OTE2chULEghBcGlRdWVyeRiAgICAgICACgw',
        dataType: 'json',
        success: function (dataAllViews) {
            var dataFound = false
            dataAllViews["rows"].forEach(function (pageViews) {
                if (pageViews[0] == $viewPanel.data("page-path")) {
                    $viewPanel.html("Views: <b>" + pageViews[1] + "</b>")
                    dataFound = true
                }
            });
            if (dataFound == false) {
                $viewPanel.text("No views yet")
            }
        },
        error: function() {
            $viewPanel.text("Error")
        }
    })
})
