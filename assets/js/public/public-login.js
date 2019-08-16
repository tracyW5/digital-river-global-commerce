/* global drgc_params, iFrameResize */
/* eslint-disable no-alert, no-console */

jQuery(document).ready(($) => {
    const ajaxUrl = drgc_params.ajaxUrl;

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

    $('#dr_login_form, #dr-signup-form, #dr-pass-reset-form, #checkout-email-form').find('input[type=email]').on('change', (e) => {
        const elem = e.target;
        if (elem.validity.valueMissing) {
            $(elem).next('.invalid-feedback').text('This field is required.');
        } else if (elem.validity.typeMismatch) {
            $(elem).next('.invalid-feedback').text('Please enter a valid email address.');
        }
    });

    $('#dr-signup-form input[type=password], #dr-confirm-password-reset-form input[type=password]').on('input', (e) => {
        const $form = $(e.target).closest('form');
        const pw = $form.find('input[type=password]')[0];
        const cpw = $form.find('input[type=password]')[1];

        cpw.setCustomValidity(pw.value !== cpw.value ? 'Passwords do not match.' : '');
        if (cpw.validity.valueMissing) {
            $(cpw).next('.invalid-feedback').text('This field is required.');
        } else if (cpw.validity.customError) {
            $(cpw).next('.invalid-feedback').text(cpw.validationMessage);
        }
    });

    $('.dr-signup-form').on('submit', function(e) {
        e.preventDefault();

        const $form = $(e.target);

        $form.addClass('was-validated');

        if ($form.data('processing')) {
            return false;
        }

        if ($form[0].checkValidity() === false) {
            return false;
        }

        const $button = $form.find('button[type=submit]').toggleClass('sending').blur();
        $form.data('processing', true);

        $('.dr-signin-form-error').text('');

        const data = {
            action    : 'drgc_signup',
            first_name: $('.dr-signup-form input[name=first_name]').val(),
            last_name : $('.dr-signup-form input[name=last_name]').val(),
            username  : $('.dr-signup-form input[name=uemail]').val(),
            password  : $('.dr-signup-form input[name=upw]').val()
        };

        $.post(ajaxUrl, data, function(response) {
            if (response.success) {
                location.reload();
            } else {
                $form.data('processing', false);
                $button.removeClass('sending').blur();

                if (response.data && response.data.errors && response.data.errors.error[0].hasOwnProperty('description') ) {
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

    $('#dr-pass-reset-form').on('submit', function(e) {
        e.preventDefault();
        const $form = $(e.target);
        const $errMsg = $('#dr-reset-pass-error').text('').hide();

        $form.addClass('was-validated');
        if ($form[0].checkValidity() === false) {
            return false;
        }

        const $button = $form.find('button[type=submit]').addClass('sending').blur();

        const data = {
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

                $button.hide();
            }

            $button.removeClass('sending').blur();
        });
    });

    $('form.dr-confirm-password-reset-form').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        const $errMsg = $form.find('.dr-form-error-msg').text('').hide();

        $form.addClass('was-validated');
        if ($form[0].checkValidity() === false) {
            return false;
        }

        const searchParams = new URLSearchParams(window.location.search)
        if ( !searchParams.get('key') || !searchParams.get('login') ) {
            $errMsg.text('Something went wrong.').show();
            return;
        }

        const data = {
            'action': 'drgc_reset_password',
            'key': searchParams.get('key'),
            'login': searchParams.get('login')
        };

        $.each($form.serializeArray(), function(index, obj) {
            data[obj.name] = obj.value;
        });

        const $button = $form.find('button[type=submit]').addClass('sending').blur();
        $.post(ajaxUrl, data, function(response) {
            if (!response.success) {
               if (response.data) $errMsg.text(response.data).show();
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
        if ($('section.dr-login-sections__section.logged-in').length && !drgc_params.cart.cart.lineItems.hasOwnProperty('lineItem')) {
            $('section.dr-login-sections__section.logged-in > div').hide();
        }
    }
});
