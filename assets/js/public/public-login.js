/* global drgc_params, iFrameResize */
/* eslint-disable no-alert, no-console */

jQuery(document).ready(($) => {
    const ajaxUrl = drgc_params.ajaxUrl;
    const apiBaseUrl = 'https://' + drgc_params.domain + '/v1/shoppers';

    $('#dr_login_form').on('submit', (e) => {
        e.preventDefault();

        let $form = $('#dr_login_form');

        $form.addClass('was-validated');

        if ($form.data('processing')) {
            return false;
        }

        if ($form[0].checkValidity() === false) {
            return false;
        }

        let but = $form.find('[type="submit"]').toggleClass('sending').blur();
        $form.data('processing', true);
        $('.dr-form-error-msg').text('');

        const data = {
            'action'    : 'drgc_login',
            'username'  : $(".dr-login-form input[name='username']").val(),
            'password'  : $(".dr-login-form input[name='password']").val()
        };

        $.post(ajaxUrl, data, function(response) {
            if ( response.success ) {
                location.reload();
            } else {
                $form.data('processing', false);
                but.removeClass('sending').blur();

                if ( response.data.hasOwnProperty('error_description') ) {
                    $('.dr-form-error-msg').text(response.data.error_description);
                }

                if ( Object.prototype.toString.call(response.data) == '[object String]' ) {
                    $('.dr-form-error-msg').text(response.data);
                }

                $('.dr-form-error-msg').css('color', 'red');
            }
        });

    });

    $('.drgc-wrapper').on('click', '.dr-logout', function(e) {
        e.preventDefault();

        if ($(this).data('processing')) {
            return;
        }

        var but = $(this).toggleClass('sending').blur();

        $(this).data('processing', true);

        const data = {
            'action'    : 'drgc_logout'
        };

        $.post(ajaxUrl, data, function(response) {
            location.reload();
        });
    });

    $('.dr-signup').on('click', '', function(e) {
        e.preventDefault();

        let $form = $('.dr-signup-form');

        $form.addClass('was-validated');

        if ($form.data('processing')) {
            return false;
        }

        if ($form[0].checkValidity() === false) {
            return false;
        }

        let but = $(this).toggleClass('sending').blur();
        $form.data('processing', true);

        $('.dr-signin-form-error').text('');

        const data = {
            'action'    : 'drgc_signup',
            'username'  : $(".dr-signup-form input[name='uemail']").val(),
            'password'  : $(".dr-signup-form input[name='upw']").val()
        };

        $.post(ajaxUrl, data, function(response) {
            if (response.success) {
                location.reload();
            } else {
                $form.data('processing', false);
                but.removeClass('sending').blur();

                if (response.data.errors && response.data.errors.error[0].hasOwnProperty('description') ) {
                    $('.dr-signin-form-error').text( response.data.errors.error[0].description );
                } else if (Object.prototype.toString.call(response.data) == '[object String]') {
                    $('.dr-signin-form-error').text(response.data);
                } else {
                    $('.dr-signin-form-error').text( 'Something went wrong.' );
                }

                $('.dr-signin-form-error').css('color', 'red');
            }
        });

    });

    $('#dr-pass-reset-submit').on('click', function(e) {
        let $errMsg = $('#dr-reset-pass-error').text('').hide();
        let $form = $('form#dr-pass-reset-form');

        $form.addClass('was-validated');
        if ($form[0].checkValidity() === false) {
            return false;
        }

        let $button = $(this).toggleClass('sending').blur().removeClass('btn');

        let data = {
            'action': 'drgc_pass_reset_request'
        };

        $.each($form.serializeArray(), function( index, obj ) {
            data[obj.name] = obj.value;
        });

        if (data['email'] !== data['email-confirm']) {
           $errMsg.text('Emails do not match').show();
           $button.removeClass('sending').blur();
           return;
        }

        $.post(ajaxUrl, data, function(response) {
            if (!response.success) {
               $errMsg.text(response.data[0].message).show();
            } else {
                $('#drResetPasswordModalBody').html('').html(`
                    <h3>Password reset email sent</h3>
                    <p>You will be receiving an email
                    soon with instructions on resetting your
                    login password</p>
                `);

                $('#dr-pass-reset-submit').hide();
            }

            $button.removeClass('sending').blur();
        });
    });

    $('form.dr-confirm-password-reset-form').on('submit', function(e) {
        e.preventDefault();
        let $form = $(this);
        let $errMsg = $('.dr-form-error-msg', this).text('').hide();


        $form.addClass('was-validated');
        if ($form[0].checkValidity() === false) {
            return false;
        }

        let $button = $('button[type=submit]', this).toggleClass('sending').blur().removeClass('btn');

        let searchParams = new URLSearchParams(window.location.search)
        if ( !searchParams.get('key') || !searchParams.get('login') ) {
            $errMsg.text('Something went wrong').show();
        }

        let data = {
            'action': 'drgc_reset_password',
            'key': searchParams.get('key'),
            'login': searchParams.get('login')
        };

        $.each($form.serializeArray(), function( index, obj ) {
            data[obj.name] = obj.value;
        });

        if (data['password'] !== data['confirm-password']) {
           $errMsg.text('Passwords do not match').show();
           $button.removeClass('sending').blur();
           return;
        }

        $.post(ajaxUrl, data, function(response) {
            if (!response.success) {
               $errMsg.text(response.data).show();
            } else {
                $('section.reset-password').html('').html(`
                    <h3>Password saved</h3>
                    <p>You can now log in with your new password</p>
                `).css('color', 'green');

                setTimeout(() => location.replace(`${location.origin}${location.pathname}`), 2000);
            }

            $button.removeClass('sending').blur();
        });
    });

    if ( $('section.logged-in').length) {
        toggleCartBtns();
    }

    function toggleCartBtns() {
        $.ajax({
            type: 'GET',
            headers: {
                "Accept": "application/json"
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active?`;
                url += `&expand=all`
                url += `&token=${drgc_params.accessToken}`
                return url;
            })(),
            success: (data) => {
                if ($('section.dr-login-sections__section.logged-in').length && data.cart.totalItemsInCart == 0) {
                    $('section.dr-login-sections__section.logged-in > div').hide();
                }
            },
            error: (jqXHR) => {
                console.log(jqXHR);
            }
        });
    }

});

(function (w) {
    w.URLSearchParams = w.URLSearchParams || function (searchString) {
        var self = this;
        self.searchString = searchString;
        self.get = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);
            if (results == null) {
                return null;
            }
            else {
                return decodeURI(results[1]) || 0;
            }
        };
    }
})(window)
