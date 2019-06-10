jQuery(document).ready(($) => {
    const siteID = drExpressOptions.siteID;
    const apiKey = drExpressOptions.apiKey;
    const domain = drExpressOptions.domain;
    const apiBaseUrl = 'https://api.digitalriver.com/v1/shoppers';
    const drLocale = drExpressOptions.drLocale || 'en_US';

    //floating labels
    FloatLabel.init();
    
    // Globals
    var digitalriverjs = new DigitalRiver(drExpressOptions.digitalRiverKey);
    var payload  = { shipping: {}, billing: {} };
    var paymentPayload = {};

    //Sections
    var shouldShippingOpen = false,
        shouldDeliveryOpen = false,
        shouldPaymentOpen  = false;

    // Submit first (email) form
    var emailPayload;
    $('#checkout-email-form').on('submit', function(e) {
        e.preventDefault();

        // If no items are in cart, do not even continue, maybe give feedback
        if (! drExpressOptions.cart.cart.lineItems.hasOwnProperty('lineItem')) return;

        let $form = $('#checkout-email-form');
        let email = $form.find('input[name=email]').val().trim();

        shouldShippingOpen = false;

        $form.addClass('was-validated');

        if ($form[0].checkValidity() === false) {
            return false;
        }

        emailPayload = email;

        let section = $('.dr-checkout__email');
        let nextSection =  section.next();

        $(section).find('.dr-panel-result__text').text(emailPayload);
        shouldShippingOpen = true;

        section.removeClass('active').addClass('closed');
        nextSection.addClass('active').removeClass('closed');
    });

    // Submit shipping info form
    $('#checkout-shipping-form').on('submit', function(e) {
        e.preventDefault();

        let validateItems,
            billingSameAsShipping = true,
            $form = $('#checkout-shipping-form');

        shouldDeliveryOpen = false;

        $form.addClass('was-validated');
        $('#dr-err-field').hide();

        if ($('[name="checkbox-billing"]').is(':checked')) {
            billingSameAsShipping = true;
            validateItems = document.querySelectorAll('[name^=shipping-]');
            for (let i=0; i<validateItems.length; i++) {
                if (validateItems[i].checkValidity() === false) {
                    return false;
                }
            }
        } else {
            billingSameAsShipping = false;
            if ($form[0].checkValidity() === false) {
                return false;
            }
        }

        let button = $form.find('button[type="submit"]').toggleClass('sending').blur();

        $.each($form.serializeArray(), function( index, obj ) {

            if ( obj.name.startsWith('shipping') ) {
                let key = obj.name.split('-')[1];
                payload['shipping'][key] = obj.value;
            }

            if (obj.name.startsWith('billing')) {
                let key = obj.name.split('-')[1];
                payload['billing'][key] = obj.value;
            }
        });

        payload['shipping']['emailAddress'] = emailPayload;
        payload['billing']['emailAddress'] = emailPayload;
        
        let data = {
            cart: {
                shippingAddress: payload['shipping']
            },
        };
        
        if (data.cart.shippingAddress.country !== 'US') {
            delete data.cart.shippingAddress.countrySubdivision;
        }
    
        if ( billingSameAsShipping ) {
            data.cart.billingAddress = payload['shipping']
        } else {
            data.cart.billingAddress = payload['billing']
        }

        $.ajax({
            type: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active?`;
                url += `&token=${drExpressOptions.accessToken}`;
                url += `&expand=all`;
                return url;
            })(),
            data: JSON.stringify(data),
            success: (data) => {
                shouldDeliveryOpen = true;
                button.removeClass('sending').blur();

                setShippingOptions(data.cart.shippingOptions);

                let section = $('.dr-checkout__shipping');
                let nextSection = section.next();

                $(section).find('.dr-panel-result__text').text(`
                    ${payload.shipping.firstName},
                    ${payload.shipping.lastName},
                    ${payload.shipping.line1},
                    ${payload.shipping.city},
                    ${payload.shipping.country}
                `);

                section.removeClass('active').addClass('closed');
                nextSection.addClass('active').removeClass('closed');
            },
            error: (jqXHR) => {
                if (jqXHR.status === 409) {
                    if (jqXHR.responseJSON.errors.error[0].code === 'restricted-bill-to-country') {
                        $('#dr-err-field').text('Address not accepted for current currency.').show();
                    }

                    if (jqXHR.responseJSON.errors.error[0].code === 'restricted-ship-to-country') {
                        $('#dr-err-field').text('Address not accepted for current currency.').show();
                    }
                } else {
                    $('#dr-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
                }

                button.removeClass('sending').blur();

            }
        });
    });

    function setShippingOptions(shippingOptions) {
        $('#checkout-delivery-form-msg').hide();

        if (! shippingOptions.hasOwnProperty('shippingOption')) {
            $('#checkout-delivery-form-msg').text('Digital product(s) only').show();
            return;
        }

        $.each(shippingOptions.shippingOption, function( index, option ) {
            if ($('input[type=radio]#' + option.id).length) return;

            let html = `
                <div class="field-radio">
                    <input type="radio"
                        name="selector"
                        id="${option.id}"
                        data-cost="${option.formattedCost}"
                        data-id="${option.id}"
                        data-desc="${option.description}"
                        checked>
                    <label for="radio-standart">
                        <span>
                            ${option.description}
                        </span>
                        <span class="black">
                            ${option.formattedCost}
                        </span>
                        <span class="smoller">
                            Estimated Arrival:
                        </span>
                        <span class="black">
                            Apr 08 - Apr 11
                        </span>
                    </label>
                </div>
            `;
    
            $('form#checkout-delivery-form .dr-panel-edit__el').append(html);
        });
    }

    // Submit delivery form
    $('form#checkout-delivery-form').on('submit', function(e) {
        e.preventDefault();

        shouldPaymentOpen = false;

        let $input = $(this).children().find('input:radio:checked').first();
        let button = $(this).find('button[type="submit"]').toggleClass('sending').blur();
        
        // Validate shipping option
        let data = {
            token           : drExpressOptions.accessToken,
            expand          : 'all',
            fields          : null,
            shippingOptionId: $input.data('id')
        };

        $.ajax({
            type: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active/apply-shipping-option?${$.param(data)}`;
                return url;
            })(),
            success: (data) => {
                let section = $('.dr-checkout__delivery');

                let nextSection =  section.next();
                let prevSection = section.prev();

                let resultText = $input > 0 ? `${$input.data('desc')} ${$input.data('cost')}` : 'Digital Product(s) Only';

                $(section).find('.dr-panel-result__text').text(resultText);

                button.removeClass('sending').blur();
                shouldPaymentOpen = true;

                section.removeClass('active').addClass('closed');
                nextSection.addClass('active').removeClass('closed');

                prevSection.addClass('small-closed-left');
                section.addClass('small-closed-right');
            },
            error: (jqXHR) => {
                console.log(jqXHR);
            }
        });
    });

    $('form#checkout-payment-form').on('submit', function(e) {
        e.preventDefault();
        let $form = $('form#checkout-payment-form');

        $form.addClass('was-validated');
        if ($form[0].checkValidity() === false) {
            return false;
        }
        
        let formdata = $(this).serializeArray();
        paymentPayload = {};
        $(formdata).each(function(index, obj){
            paymentPayload[obj.name] = obj.value;
        });

        let section = $('.dr-checkout__payment');
        let nextSection =  section.next();

        $(section).find('.dr-panel-result__text').text(
            `Credit card ending in ${paymentPayload['credit-card-number'].substr(paymentPayload['credit-card-number'].length - 4)}`
        );

        shouldPaymentOpen = true;

        section.removeClass('active').addClass('closed');
        nextSection.addClass('active').removeClass('closed');

        section.addClass('small-closed-left');
        nextSection.removeClass('d-none').addClass('small-closed-right');

        $('#dr-checkout-err-field').text('').hide();
    });

    $('form#checkout-confirmation-form').on('submit', function(e) {
        e.preventDefault();
        $(this).find('button[type="submit"]').toggleClass('sending').blur();
        $('#dr-payment-failed-msg').hide();
        sendPaymentData();
    });

    function sendPaymentData() {
        const cart = drExpressOptions.cart.cart;
        let digitalRiverPayload = {};

        if (paymentPayload.selector === 'credit-card') {
            digitalRiverPayload = {
                "type": "creditCard",
                "owner": {
                    "firstName": cart.shippingAddress.firstName || payload.shipping.firstName,
                    "lastName": cart.shippingAddress.lastName || payload.shipping.lastName,
                    "email": cart.shippingAddress.emailAddress || payload.shipping.emailAddress,
                    "address": {
                        "line1": cart.shippingAddress.line1 || payload.shipping.line1,
                        "city": cart.shippingAddress.city || payload.shipping.city,
                        "state": cart.shippingAddress.state || payload.shipping.state,
                        "country": cart.shippingAddress.country || payload.shipping.country,
                        "postalCode": cart.shippingAddress.postalCode || payload.shipping.postalCode
                    }
                },
                "creditCard": {
                    "number": $('#card-number').val(),
                    "expirationMonth":  $('#card-expiration-mm').val(),
                    "expirationYear": $('#card-expiration-yy').val(),
                    "cvv": $('#card-cvv').val(),
                },
                "amount": cart.pricing.orderTotal.value,
                "currency": cart.pricing.orderTotal.currency
            }
        }

        if (paymentPayload.selector === 'paypal') {
            let payPalItems = [];
            $.each(cart.lineItems.lineItem, function( index, item ) {
                payPalItems.push({
                    "name": item.product.name,
                    "quantity": item.quantity,
                    "unitAmount": item.product.inventoryStatus.availableQuantity
                })
            });
            
            digitalRiverPayload = {
                "type": "payPal",
                "amount": cart.pricing.orderTotal.value,
                "currency": "USD",
                "payPal": {
                    "returnUrl": window.location.href + '?ppsuccess=true',
                    "cancelUrl": window.location.href + '?ppcancel=true',
                    "items": payPalItems,
                    "taxAmount": cart.pricing.tax.value,
                    "shipping": {
                        "recipient":  `${cart.shippingAddress.firstName} ${cart.shippingAddress.lastName} `,
                        "phoneNumber":  cart.shippingAddress.phoneNumber,
                        "address": {
                            "line1": cart.shippingAddress.line1,
                            "line2": cart.shippingAddress.line2,
                            "city": cart.shippingAddress.city,
                            "state": cart.shippingAddress.state,
                            "country":  cart.shippingAddress.country,
                            "postalCode": cart.shippingAddress.postalCode
                        }
                    }
                }
            }
        }
        
        digitalriverjs.createSource(digitalRiverPayload).then(function(result) {
            if (result.error) {
                $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();

                if (result.error.state === 'failed') {
                    $('#dr-payment-failed-msg').text('Failed payment for specified credit card').show();
                }

                if (result.error.errors) {
                    $('#dr-payment-failed-msg').text(result.error.errors[0].message).show();
                }
            } else {
                // Success!  You can now send the token to your server for use in downstream API calls.
                if (result.source.type === 'creditCard' && result.source.state === 'chargeable') {
                    applyPaymentToCart(result.source.id);
                }

                if (result.source.type === 'payPal') {
                    window.location.href = result.source.redirect.redirectUrl
                }
            }
        });
    }

    // Initial state for payPal
    if ( drExpressOptions.payPal.sourceId ) {
        $('.dr-checkout').children().addClass('closed');
        $('.dr-checkout').children().removeClass('active');
        $('.dr-checkout__payment').removeClass('closed').addClass('active');

        if (drExpressOptions.payPal.failure == 'true') {
            // TODO: Display Error on paypal form maybe
        }

        if (drExpressOptions.payPal.success == 'true') {
            applyPaymentToCart(drExpressOptions.payPal.sourceId);
        }
    }

    function applyPaymentToCart(id) {
        let data = {
            'paymentMethod': {
              'sourceId': id
            }
        }

        $.ajax({
            type: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${drExpressOptions.accessToken}`
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active/apply-payment-method?`;
                url += `&token=${drExpressOptions.accessToken}`;
                url += `&expand=all`;
                return url;
            })(),
            data: JSON.stringify(data),
            success: () => {
                submitCart();
            },
            error: (jqXHR) => {
                $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
                $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
            }
        });
    }

    function submitCart() {
        $.ajax({
            type: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                Authorization: `Bearer ${drExpressOptions.accessToken}`
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active/submit-cart?`;
                url += `&token=${drExpressOptions.accessToken}`;
                url += `&expand=all`;
                return url;
            })(),
            success: (data) => {
                window.location.replace(
                    `${drExpressOptions.thankYouEndpoint}?order=${data.submitCart.order.id}`
                )
            },
            error: (jqXHR) => {
                $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();

                $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
            }
        });
    }

    // check billing info
    $('[name="checkbox-billing"]').on('click', function (ev) {
        let $this = $(this);

        if (!$this.is(':checked')) {
            $('.billing-section').css('display', 'block');
        } else {
            $('.billing-section').css('display', 'none');
        }
    });

    // show and hide sections
    $('.dr-accordion__edit').on('click', function(e) {
        e.preventDefault();

        $('.dr-checkout__payment').removeClass('small-closed-left');
        $('.dr-checkout__confirmation').addClass('d-none').removeClass('small-closed-right');

        let $this = $(this).parent();
        let otherSections = $this.parent().siblings();
        let section = $this.parent();
        let nextSection =  $this.parent().next();
        let prevSection = section.prev();

        if( /_email/.test(section.attr('class'))) {
            shouldShippingOpen = false;
            shouldDeliveryOpen = false;
            shouldPaymentOpen = false;

            otherSections.removeClass('small-closed-left');
            otherSections.removeClass('small-closed-right');
        }

        if( /_shipping/.test(section.attr('class'))) {
            if(!shouldShippingOpen){
                return;
            } else {
                shouldDeliveryOpen = false;
                shouldPaymentOpen = false;
            }
        }

        if( /_delivery/.test(section.attr('class'))) {
            if(!shouldDeliveryOpen) {
                return;
            } else {
                shouldPaymentOpen = false;
            }
        }

        if( /_payment/.test(section.attr('class')) && ! shouldPaymentOpen ) {
            return;
        }

        otherSections.addClass('closed').removeClass('active');
        section.removeClass('closed').addClass('active');

        if (section.hasClass('dr-checkout__delivery')) {
            if (section.hasClass('closed') && prevSection.hasClass('closed')) {
                prevSection.addClass('small-closed-left');
                section.addClass('small-closed-right');
            }  else {
                prevSection.removeClass('small-closed-left');
                section.removeClass('small-closed-right');
            }
        } else {
            section.removeClass('small-closed-left'); 
            nextSection.removeClass('small-closed-right');
        }
    });

    // print thank you page
    $('#print-button').on('click', function (ev) {
        var printContents = $('.dr-thank-you-wrapper').html();

        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    });

    if ($('#radio-credit-card').is(':checked')) {
        $('.credit-card-info').show();
    }

    $("#radio-credit-card, #radio-paypal").on("click", function(){
        if ($('#radio-credit-card').is(':checked')) {
            $('.credit-card-info').show();

            $('#dr-submit-payment').text('pay with card'.toUpperCase());
        } else {
            $('.credit-card-info').hide();
            $('#dr-submit-payment').text('pay with paypal'.toUpperCase());
        }
    });

    $('#shipping-field-country').on('change', function() {
        if ( this.value === 'US' ) {
            $('#shipping-field-state').removeClass('d-none');
        } else {
            $('#shipping-field-state').addClass('d-none');
        }
    });

    $('#billing-field-country').on('change', function() {
        if ( this.value === 'US' ) {
            $('#billing-field-state').removeClass('d-none');
        } else {
            $('#billing-field-state').addClass('d-none');
        }
    });
});