jQuery(document).ready(($) => {
    const siteID = drExpressOptions.siteID;
    const apiKey = drExpressOptions.apiKey;
    const domain = drExpressOptions.domain;
    const apiBaseUrl = 'https://' + domain + '/v1/shoppers';
    const drLocale = drExpressOptions.drLocale || 'en_US';

    //floating labels
    FloatLabel.init();

    // Globals
    var digitalriverjs = new DigitalRiver(drExpressOptions.digitalRiverKey);
    var payload  = { shipping: {}, billing: {} };
    var paymentPayload = {};

    // Section progress
    let finishedSectionIdx = -1;

    // Submit first (email) form
    var emailPayload;

    function prepareAddress($form) {
        const addressType = ($form.attr('id') === 'checkout-shipping-form') ? 'shipping' : 'billing';

        // Validate form
        $form.addClass('was-validated');
        $form.find('.dr-err-field').hide();
        const validateItems = document.querySelectorAll(`[name^=${addressType}-]`);
        for (let i = 0, len = validateItems.length; i < len; i++) {
            if ($(validateItems[i]).is(':visible') && validateItems[i].checkValidity() === false) {
                return false;
            }
        }

        // Build payload
        $.each($form.serializeArray(), function(index, obj) {
            let key = obj.name.split('-')[1];
            payload[addressType][key] = obj.value;
        });
        payload[addressType].emailAddress = emailPayload;
        if (payload[addressType].country !== 'US') {
            payload[addressType].countrySubdivision = '';
        }
        return true;
    }

    function updateCart(queryParams = {}, cartRequest = {}) {
        const queryStr = $.param(queryParams);
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${drExpressOptions.accessToken}`,
                },
                url: (() => {
                    let url = `${apiBaseUrl}/me/carts/active?`;
                    url += `&token=${drExpressOptions.accessToken}&${queryStr}`;
                    return url;
                })(),
                data: JSON.stringify({
                    cart: cartRequest
                }),
                success: (data) => {
                    resolve(data);
                },
                error: (jqXHR) => {
                    reject(jqXHR);
                }
            });
        });
    }

    function displaySavedAddress(addressObj, $target) {
        const addressArr = [
            `${addressObj.firstName} ${addressObj.lastName}`,
            addressObj.line1,
            addressObj.city,
            addressObj.country
        ];
        $target.text(addressArr.join(', '));
    }

    function displayAddressErrMsg(jqXHR, $target) {
        if (jqXHR.status === 409) {
            if (jqXHR.responseJSON.errors.error[0].code === 'restricted-bill-to-country') {
                $target.text('Address not accepted for current currency.').show();
            }

            if (jqXHR.responseJSON.errors.error[0].code === 'restricted-ship-to-country') {
                $target.text('Address not accepted for current currency.').show();
            }
        } else {
            $target.text(jqXHR.responseJSON.errors.error[0].description).show();
        }
    }

    function moveToNextSection($section) {
        const $prevSection = $section.prev();
        const $nextSection = $section.next();

        if ($('.dr-checkout__el').index($section) > finishedSectionIdx) {
            finishedSectionIdx = $('.dr-checkout__el').index($section);
        }

        $section.removeClass('active').addClass('closed');
        $nextSection.addClass('active').removeClass('closed');

        if ($nextSection.hasClass('small-closed-left')) {
            $nextSection.removeClass('small-closed-left');
            $nextSection.next().removeClass('small-closed-right');
        }

        adjustColumns($section);
    }

    function adjustColumns($section) {
        const $shippingSection = $('.dr-checkout__shipping');
        const $billingSection = $('.dr-checkout__billing');
        const $paymentSection = $('.dr-checkout__payment');
        const $confirmSection = $('.dr-checkout__confirmation');

        if ($shippingSection.is(':visible') && $shippingSection.hasClass('closed') && $billingSection.hasClass('closed')) {
            $shippingSection.addClass('small-closed-left');
            $billingSection.addClass('small-closed-right');
        } else {
            $shippingSection.removeClass('small-closed-left');
            $billingSection.removeClass('small-closed-right');
        }

        if ($section && $section.hasClass('dr-checkout__payment')) {
            $paymentSection.addClass('small-closed-left');
            $confirmSection.addClass('small-closed-right').removeClass('d-none');
        } else {
            $paymentSection.removeClass('small-closed-left');
            $confirmSection.removeClass('small-closed-right').addClass('d-none');
        }
    }

    $('#checkout-email-form').on('submit', function(e) {
        e.preventDefault();

        // If no items are in cart, do not even continue, maybe give feedback
        if (! drExpressOptions.cart.cart.lineItems.hasOwnProperty('lineItem')) return;

        let $form = $('#checkout-email-form');
        let email = $form.find('input[name=email]').val().trim();

        $form.addClass('was-validated');

        if ($form[0].checkValidity() === false) {
            return false;
        }

        emailPayload = email;

        const $section = $('.dr-checkout__email');
        $section.find('.dr-panel-result__text').text(emailPayload);
        moveToNextSection($section);
    });

    // Submit shipping info form
    $('#checkout-shipping-form').on('submit', function(e) {
        e.preventDefault();

        const $form = $(e.target);
        const $button = $form.find('button[type="submit"]');
        const isFormValid = prepareAddress($form);

        if (!isFormValid) return;

        $button.addClass('sending').blur();
        updateCart({ expand: 'all' }, { shippingAddress: payload.shipping }).then((data) => {
            $button.removeClass('sending').blur();

            setShippingOptions(data.cart.shippingOptions);

            const $section = $('.dr-checkout__shipping');
            displaySavedAddress(data.cart.shippingAddress, $section.find('.dr-panel-result__text'));
            moveToNextSection($section);
        }).catch((jqXHR) => {
            $button.removeClass('sending').blur();
            displayAddressErrMsg(jqXHR, $form.find('.dr-err-field'));
        });
    });

    $('#checkout-billing-form').on('submit', function(e) {
        e.preventDefault();

        const $form = $(e.target);
        const $button = $form.find('button[type="submit"]');
        const billingSameAsShipping = $('[name="checkbox-billing"]').is(':visible:checked');
        const isFormValid = prepareAddress($form);

        if (!isFormValid) return;
        if (billingSameAsShipping) payload.billing = Object.assign({}, payload.shipping);

        $button.addClass('sending').blur();
        updateCart({ expand: 'all' }, { billingAddress: payload.billing }).then((data) => {
            $button.removeClass('sending').blur();

            const $section = $('.dr-checkout__billing');
            displaySavedAddress(data.cart.billingAddress, $section.find('.dr-panel-result__text'));
            moveToNextSection($section);
        }).catch((jqXHR) => {
            $button.removeClass('sending').blur();
            displayAddressErrMsg(jqXHR, $form.find('.dr-err-field'));
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
                        >
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
            $('form#checkout-delivery-form').children().find('input:radio').first().prop("checked", true);
        });
        // Initial Shipping Option
        let shippingInitID = $('form#checkout-delivery-form').children().find('input:radio:checked').first().data('id');
        applyShippingAndUpdateCart(shippingInitID);
    }

    // Submit delivery form
    $('form#checkout-delivery-form').on('submit', function(e) {
        e.preventDefault();

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
                button.removeClass('sending').blur();

                const $section = $('.dr-checkout__delivery');
                const resultText = $input.length > 0 ? `${$input.data('desc')} ${$input.data('cost')}` : 'Digital Product(s) Only';
                $section.find('.dr-panel-result__text').text(resultText);
                moveToNextSection($section);
            },
            error: (jqXHR) => {
                console.log(jqXHR);
            }
        });
    });

    $('form#checkout-delivery-form').on('change', 'input[type="radio"]', function() {
      let shippingObject =  $('form#checkout-delivery-form').children().find('input:radio:checked').first();
      let shippingoptionID = shippingObject.data('id');
      applyShippingAndUpdateCart(shippingoptionID);
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

        $('#dr-checkout-err-field').text('').hide();

        const $section = $('.dr-checkout__payment');
        $section.find('.dr-panel-result__text').text(
            `Credit card ending in ${paymentPayload['credit-card-number'].substr(paymentPayload['credit-card-number'].length - 4)}`
        );
        moveToNextSection($section);
    });

    $('form#checkout-confirmation-form').on('submit', function(e) {
        e.preventDefault();
        $(this).find('button[type="submit"]').toggleClass('sending').blur();
        $('#dr-payment-failed-msg').hide();
        sendPaymentData();
    });

    function applyShippingAndUpdateCart(shippingoptionID){
      let data = {
        token           : drExpressOptions.accessToken,
        expand          : 'all',
        fields          : null,
        shippingOptionId: shippingoptionID
      };


      $.ajax({
        type: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        url: (() => {
            let url = `${apiBaseUrl}/me/carts/active/apply-shipping-option?${$.param(data)}`;
            return url;
        })(),
        success: (data) => {
          let { formattedShippingAndHandling, formattedOrderTotal } = data.cart.pricing;
          if(data.cart.pricing.shippingAndHandling.value === 0 )formattedShippingAndHandling = "FREE";
          $('div.dr-summary__shipping > .item-value').text(formattedShippingAndHandling);
          $('div.dr-summary__total > .total-value').text(formattedOrderTotal);
        },
        error: (jqXHR) => {
            console.log(jqXHR);
        }
      });
    }


    function sendPaymentData() {
        const cart = drExpressOptions.cart.cart;
        let digitalRiverPayload = {};

        if (paymentPayload.selector === 'credit-card') {
            digitalRiverPayload = {
                "type": "creditCard",
                "owner": {
                    "firstName": payload.billing.firstName,
                    "lastName": payload.billing.lastName,
                    "email": payload.billing.emailAddress,
                    "address": {
                        "line1": payload.billing.line1,
                        "city": payload.billing.city,
                        "state": payload.billing.state,
                        "country": payload.billing.country,
                        "postalCode": payload.billing.postalCode
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
                    "requestShipping": requestShipping,
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
                const billingSameAsShipping = $('[name="checkbox-billing"]').is(':checked');
                if (billingSameAsShipping) {
                    submitCart();
                } else {
                    applyBillingAddress(payload.billing).then(() => submitCart());
                }
            },
            error: (jqXHR) => {
                $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
                $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
                $('body').css({'pointer-events': 'auto', 'opacity': 1});
            }
        });
    }

    function applyBillingAddress(billingAddress) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${drExpressOptions.accessToken}`,
                },
                url: (() => {
                    let url = `${apiBaseUrl}/me/carts/active?`;
                    url += `&token=${drExpressOptions.accessToken}`;
                    return url;
                })(),
                data: JSON.stringify({
                    cart: {
                        billingAddress
                    }
                }),
                success: (data) => {
                    resolve(data);
                },
                error: (jqXHR) => {
                    $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
                    $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
                    reject(jqXHR);
                }
            });
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
                $('body').css({'pointer-events': 'auto', 'opacity': 1});
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

        let $section = $(e.target).parent().parent();
        let $allSections = $section.siblings().andSelf();
        let $finishedSections = $allSections.eq(finishedSectionIdx).prevAll().andSelf();
        let $activeSection = $allSections.filter($('.active'));
        let $nextSection =  $section.next();
        let $prevSection = $section.prev();

        if ($allSections.index($section) > $allSections.index($activeSection)) {
            return;
        }

        $finishedSections.addClass('closed');
        $activeSection.removeClass('active');
        $section.removeClass('closed').addClass('active');

        adjustColumns();
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

    $('input:radio[name="selector"]').on('change', function() {
        switch ($(this).val()) {
            case 'credit-card':
                $('#dr-paypal-button').hide();
                $('.credit-card-info').show();
                $('#dr-submit-payment').text('pay with card'.toUpperCase()).show();

                break;
            case 'paypal':
                $('#dr-submit-payment').hide();
                $('.credit-card-info').hide();
                $('#dr-paypal-button').show();
                $('#dr-submit-payment').text('pay with paypal'.toUpperCase());

                break;
        }
    });

    $('#shipping-field-country').on('change', function() {
        if ( this.value === 'US' ) {
            $('#shipping-field-state').parent('.form-group').removeClass('d-none');
        } else {
            $('#shipping-field-state').parent('.form-group').addClass('d-none');
        }
    });

    $('#billing-field-country').on('change', function() {
        if ( this.value === 'US' ) {
            $('#billing-field-state').parent('.form-group').removeClass('d-none');
        } else {
            $('#billing-field-state').parent('.form-group').addClass('d-none');
        }
    });

    if ($('#dr-paypal-button').length) {
        // need to get the actual height of the wrapper for rendering the PayPal button
        $('#checkout-payment-form').removeClass('dr-panel-edit').css('visibility', 'hidden');

        paypal.Button.render({
            env: (domain.indexOf('test') === -1) ? 'production' : 'sandbox',
            locale: drLocale,
            style: {
                label: 'checkout',
                size: 'responsive',
                height: 40,
                color: 'gold',
                shape: 'rect',
                layout: 'horizontal',
                fundingicons: 'false',
                tagline: 'false'
            },
            onEnter: function() {
                $('#checkout-payment-form').addClass('dr-panel-edit').css('visibility', 'visible');
                $('#dr-paypal-button').hide();
            },
            payment: function() {
                const cart = drExpressOptions.cart.cart;
                const requestShipping = ($('#checkout-delivery-form-msg').text().trim() === '');
                let payPalItems = [];

                $.each(cart.lineItems.lineItem, function( index, item ) {
                    payPalItems.push({
                        "name": item.product.name,
                        "quantity": item.quantity,
                        "unitAmount": item.pricing.listPrice.value
                    })
                });

                let payPalPayload = {
                    "type": "payPal",
                    "amount": cart.pricing.orderTotal.value,
                    "currency": "USD",
                    "payPal": {
                        "returnUrl": window.location.href + '?ppsuccess=true',
                        "cancelUrl": window.location.href + '?ppcancel=true',
                        "items": payPalItems,
                        "taxAmount": cart.pricing.tax.value,
                        "requestShipping": requestShipping
                    }
                };

                if (requestShipping) {
                    payPalPayload['shipping'] = {
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

                return digitalriverjs.createSource(payPalPayload).then(function(result) {
                    if (result.error) {
                        $('#dr-payment-failed-msg').text(result.error.errors[0].message).show();
                    } else {
                        sessionStorage.setItem('paymentSourceId', result.source.id);

                        return result.source.payPal.token;
                    }
                });
            },
            onAuthorize: function() {
                const sourceId = sessionStorage.getItem('paymentSourceId');

                $('body').css({'pointer-events': 'none', 'opacity': 0.5});
                applyPaymentToCart(sourceId);
            }
        }, '#dr-paypal-button');
    }
});