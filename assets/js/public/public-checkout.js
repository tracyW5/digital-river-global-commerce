jQuery(document).ready(($) => {
    if ($('#checkout-payment-form').length) {
        const siteID = drExpressOptions.siteID;
        const apiKey = drExpressOptions.apiKey;
        const domain = drExpressOptions.domain;
        const apiBaseUrl = 'https://' + domain + '/v1/shoppers';
        const drLocale = drExpressOptions.drLocale || 'en_US';


        function getAddress(addressType) {
            const address = {
            address: {
                nickName: $('#'+ addressType +'-field-address1').val(),
                firstName: $('#'+ addressType +'-field-first-name').val(),
                lastName: $('#'+ addressType +'-field-last-name').val(),
                line1: $('#'+ addressType +'-field-address1').val(),
                line2: $('#'+ addressType +'-field-address2').val(),
                city: $('#'+ addressType +'-field-city').val(),
                countrySubdivision: $('#'+ addressType +'-field-state').val(),
                postalCode: $('#'+ addressType +'-field-zip').val(),
                countryName: $('#'+ addressType +'-field-country :selected').text(),
                country: $('#'+ addressType +'-field-country :selected').val(),
                phoneNumber: $('#'+ addressType +'-field-phone').val()
            }
            };
            return address;
        }

        function saveShippingAddress() {
            var address = getAddress('shipping');
            address.address.isDefault = true;
            console.log('save shipping: ', address);
            saveShopperAddress(JSON.stringify(address))
        }

        function saveBillingAddress() {
            var address = getAddress('billing');
            address.address.isDefault = false;
            console.log('save billing: ', address);
            saveShopperAddress(JSON.stringify(address))
        }

        function saveShopperAddress(address) {
            $.ajax({
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${drExpressOptions.accessToken}`
                },
                data: address,
                url: `${apiBaseUrl}/me/addresses?client_id=${apiKey}&format=json`,
                success: (data) => {
                    console.log('address update success:',data);
                },
                error: (jqXHR) => {
                    console.log(jqXHR);
                }
            });
        }

        //floating labels
        FloatLabel.init();

        // Globals
        var digitalriverjs = new DigitalRiver(drExpressOptions.digitalRiverKey);
        var payload  = { shipping: {}, billing: {} };
        var paymentPayload = {};
        var paymentSourceId = null;

        // Section progress
        let finishedSectionIdx = -1;

        // Submit first (email) form
        var emailPayload;

        // Create elements through DR.js
        if ($('.credit-card-section').length) {
            const options = {
            classes: {
                base: 'DRElement',
                complete: 'DRElement--complete',
                empty: 'DRElement--empty',
                invalid: 'DRElement--invalid'
            },
            style: {
                base: getStyleOptionsFromClass('DRElement'),
                complete: getStyleOptionsFromClass('DRElement--complete'),
                empty: getStyleOptionsFromClass('DRElement--empty'),
                invalid: getStyleOptionsFromClass('DRElement--invalid')
            }
            };
            var cardNumber = digitalriverjs.createElement('cardnumber', options);
            var cardExpiration = digitalriverjs.createElement('cardexpiration', options);
            var cardCVV = digitalriverjs.createElement('cardcvv', options);

            cardNumber.mount('card-number');
            cardExpiration.mount('card-expiration');
            cardCVV.mount('card-cvv');

            cardNumber.on('change', function(evt) {
                activeCardLogo(evt);
                displayDRElementError(evt, $('#card-number-error'));
            });
            cardExpiration.on('change', function(evt) {
                displayDRElementError(evt, $('#card-expiration-error'));
            });
            cardCVV.on('change', function(evt) {
                displayDRElementError(evt, $('#card-cvv-error'));
            });

            function getStyleOptionsFromClass(className) {
                const tempDiv = document.createElement('div');
                tempDiv.setAttribute('id', 'tempDiv' + className);
                tempDiv.className = className;
                document.body.appendChild(tempDiv);
                const tempDivEl = document.getElementById('tempDiv' + className);
                const tempStyle = window.getComputedStyle(tempDivEl);

                const styles = {
                    color: tempStyle.color,
                    fontFamily: tempStyle.fontFamily.replace(new RegExp('"', 'g'), ''),
                    fontSize: tempStyle.fontSize,
                    height: tempStyle.height
                };
                document.body.removeChild(tempDivEl);

                return styles;
            }

            function activeCardLogo(evt) {
                $('.cards .active').removeClass('active');
                if (evt.brand && evt.brand !== 'unknown') {
                    $(`.cards .${evt.brand}-icon`).addClass('active');
                }
            }

            function displayDRElementError(evt, $target) {
                if (evt.error) {
                    $target.text(evt.error.message).show();
                } else {
                    $target.text('').hide();
                }
            }
        }

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
                const key = obj.name.split('-')[1];
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
                        Authorization: `Bearer ${drExpressOptions.accessToken}`
                    },
                    url: `${apiBaseUrl}/me/carts/active?${queryStr}`,
                    data: JSON.stringify({
                        cart: cartRequest
                    })
                })
                .done((data) => {
                    resolve(data);
                })
                .fail((jqXHR) => {
                    reject(jqXHR);
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
            updateTaxLabel();
        }

        function updateSummaryPricing(cart) {
            const {formattedOrderTotal, formattedTax} = cart.pricing;

            if (Object.keys(cart.shippingMethod).length > 0) {
                const formattedShippingAndHandling = (cart.pricing.shippingAndHandling.value === 0) ? 'FREE' : cart.pricing.formattedShippingAndHandling;

                $('div.dr-summary__shipping > .item-value').text(formattedShippingAndHandling);
            }

            $('div.dr-summary__tax > .item-value').text(formattedTax);
            $('div.dr-summary__total > .total-value').text(formattedOrderTotal);
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

        function updateTaxLabel() {
            if ($('.dr-checkout__el.active').hasClass('dr-checkout__payment') || $('.dr-checkout__el.active').hasClass('dr-checkout__confirmation')) {
                $('.dr-summary__tax > .item-label').text('Tax');
            } else {
                $('.dr-summary__tax > .item-label').text('Estimated Tax');
            }
        }

        $('#checkout-email-form').on('submit', function(e) {
            e.preventDefault();

            // If no items are in cart, do not even continue, maybe give feedback
            if (! drExpressOptions.cart.cart.lineItems.hasOwnProperty('lineItem')) return;

            const $form = $('#checkout-email-form');
            const email = $form.find('input[name=email]').val().trim();

            $form.addClass('was-validated');

            if ($form[0].checkValidity() === false) {
                return false;
            }

            emailPayload = email;

            const $section = $('.dr-checkout__email');
            $section.find('.dr-panel-result__text').text(emailPayload);
            moveToNextSection($section);
        });

        if ( $('input[name=email]').val() && $('#checkout-email-form').length ){
            $('#checkout-email-form').submit();
        }

        // Submit shipping info form
        $('#checkout-shipping-form').on('submit', function(e) {
            e.preventDefault();

            const $form = $(e.target);
            const $button = $form.find('button[type="submit"]');
            const isFormValid = prepareAddress($form);

            if (!isFormValid) return;

            $button.addClass('sending').blur();
            updateCart({ expand: 'all' }, { shippingAddress: payload.shipping }).then((data) => {
                saveShippingAddress();
                $button.removeClass('sending').blur();

                setShippingOptions(data.cart);

                const $section = $('.dr-checkout__shipping');
                displaySavedAddress(data.cart.shippingAddress, $section.find('.dr-panel-result__text'));
                moveToNextSection($section);
                updateSummaryPricing(data.cart);
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
                saveBillingAddress();
                $button.removeClass('sending').blur();

                const $section = $('.dr-checkout__billing');
                displaySavedAddress(data.cart.billingAddress, $section.find('.dr-panel-result__text'));
                moveToNextSection($section);
                updateSummaryPricing(data.cart);
            }).catch((jqXHR) => {
                $button.removeClass('sending').blur();
                displayAddressErrMsg(jqXHR, $form.find('.dr-err-field'));
            });
        });

        function setShippingOptions(cart) {
            const freeShipping = cart.pricing.shippingAndHandling.value === 0;
            const shippingOptionId = cart.shippingMethod.code;

            $.each(cart.shippingOptions.shippingOption, function( index, option ) {
                if ($('#shipping-option-' + option.id).length) return;

                const html = `
                    <div class="field-radio">
                        <input type="radio"
                            name="selector"
                            id="shipping-option-${option.id}"
                            data-cost="${option.formattedCost}"
                            data-id="${option.id}"
                            data-desc="${option.description}"
                            >
                        <label for="shipping-option-${option.id}">
                            <span>
                                ${option.description}
                            </span>
                            <span class="black">
                                ${freeShipping ? 'FREE' : option.formattedCost}
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

            $('form#checkout-delivery-form').children().find('input:radio[data-id="' + shippingOptionId + '"]').prop("checked", true);
        }

        function applyShippingOption() {
            const shippingOptionId = $('form#checkout-delivery-form').children().find('input:radio:checked').first().data('id');
            applyShippingAndUpdateCart(shippingOptionId);
        }

        // Submit delivery form
        $('form#checkout-delivery-form').on('submit', function(e) {
            e.preventDefault();

            const $input = $(this).children().find('input:radio:checked').first();
            const button = $(this).find('button[type="submit"]').toggleClass('sending').blur();
            // Validate shipping option
            const data = {
                expand: 'all',
                shippingOptionId: $input.data('id')
            };

            $.ajax({
                type: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${drExpressOptions.accessToken}`
                },
                url: `${apiBaseUrl}/me/carts/active/apply-shipping-option?${$.param(data)}`,
                success: (data) => {
                    button.removeClass('sending').blur();

                    const $section = $('.dr-checkout__delivery');
                    const freeShipping = data.cart.pricing.shippingAndHandling.value === 0;
                    const resultText = `${$input.data('desc')} ${freeShipping ? 'FREE' : $input.data('cost')}`;
                    $section.find('.dr-panel-result__text').text(resultText);
                    moveToNextSection($section);
                    updateSummaryPricing(data.cart);
                },
                error: (jqXHR) => {
                    console.log(jqXHR);
                }
            });
        });

        $('form#checkout-delivery-form').on('change', 'input[type="radio"]', function() {
            applyShippingOption();
        });



        $('form#checkout-payment-form').on('submit', function(e) {
            e.preventDefault();
            const $form = $('form#checkout-payment-form');
            const $button = $form.find('button[type="submit"]');

            $form.addClass('was-validated');
            if ($form[0].checkValidity() === false) {
                return false;
            }

            const formdata = $(this).serializeArray();
            paymentPayload = {};
            $(formdata).each(function(index, obj){
                paymentPayload[obj.name] = obj.value;
            });

            $('#dr-payment-failed-msg, #dr-checkout-err-field').text('').hide();

            const $section = $('.dr-checkout__payment');

            if (paymentPayload.selector === 'credit-card') {
                const cart = drExpressOptions.cart.cart;
                const creditCardPayload = {
                    type: 'creditCard',
                    owner: {
                        firstName: payload.billing.firstName,
                        lastName: payload.billing.lastName,
                        email: payload.billing.emailAddress,
                        address: {
                            line1: payload.billing.line1,
                            city: payload.billing.city,
                            state: payload.billing.state,
                            country: payload.billing.country,
                            postalCode: payload.billing.postalCode
                        }
                    },
                    amount: cart.pricing.orderTotal.value,
                    currency: cart.pricing.orderTotal.currency
                };

                $button.addClass('sending').blur();
                digitalriverjs.createSource(cardNumber, creditCardPayload).then(function(result) {
                    $button.removeClass('sending').blur();
                    if (result.error) {
                        if (result.error.state === 'failed') {
                            $('#dr-payment-failed-msg').text('Failed payment for specified credit card').show();
                        }
                        if (result.error.errors) {
                            $('#dr-payment-failed-msg').text(result.error.errors[0].message).show();
                        }
                    } else {
                        if (result.source.state === 'chargeable') {
                            paymentSourceId = result.source.id;
                            $section.find('.dr-panel-result__text').text(
                                `Credit card ending in ${result.source.creditCard.lastFourDigits}`
                            );
                            moveToNextSection($section);
                        }
                    }
                });
            }
        });

        $('form#checkout-confirmation-form').on('submit', function(e) {
            e.preventDefault();
            $(this).find('button[type="submit"]').toggleClass('sending').blur();
            $('#dr-payment-failed-msg').hide();
            applyPaymentToCart(paymentSourceId);
        });

        function applyShippingAndUpdateCart(shippingOptionId) {
            const data = {
                expand: 'all',
                shippingOptionId: shippingOptionId
            };

            $.ajax({
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${drExpressOptions.accessToken}`
                },
                url: `${apiBaseUrl}/me/carts/active/apply-shipping-option?${$.param(data)}`,
                success: (data) => {
                    updateSummaryPricing(data.cart);
                },
                error: (jqXHR) => {
                    console.log(jqXHR);
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
            if (!id) return;

            const data = {
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
                url: `${apiBaseUrl}/me/carts/active/apply-payment-method?expand=all`,
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
                        Authorization: `Bearer ${drExpressOptions.accessToken}`
                    },
                    url: `${apiBaseUrl}/me/carts/active`,
                    data: JSON.stringify({
                        cart: {
                            billingAddress
                        }
                    })
                })
                .done((data) => {
                    resolve(data);
                })
                .fail((jqXHR) => {
                    $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
                    $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
                    reject(jqXHR);
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
                url: `${apiBaseUrl}/me/carts/active/submit-cart?expand=all`,
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
            const $this = $(this);

            if (!$this.is(':checked')) {
                $('.billing-section').css('display', 'block');
            } else {
                $('.billing-section').css('display', 'none');
            }
        });

        // show and hide sections
        $('.dr-accordion__edit').on('click', function(e) {
            e.preventDefault();

            const $section = $(e.target).parent().parent();
            const $allSections = $section.siblings().andSelf();
            const $finishedSections = $allSections.eq(finishedSectionIdx).prevAll().andSelf();
            const $activeSection = $allSections.filter($('.active'));
            const $nextSection =  $section.next();
            const $prevSection = $section.prev();

            if ($allSections.index($section) > $allSections.index($activeSection)) {
                return;
            }

            $finishedSections.addClass('closed');
            $activeSection.removeClass('active');
            $section.removeClass('closed').addClass('active');

            adjustColumns();
            updateTaxLabel();
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
                    const requestShipping = $('.dr-checkout__shipping').length ? true : false;
                    let payPalItems = [];

                    $.each(cart.lineItems.lineItem, function( index, item ) {
                        payPalItems.push({
                            'name': item.product.name,
                            'quantity': item.quantity,
                            'unitAmount': item.pricing.listPrice.value
                        })
                    });

                    let payPalPayload = {
                        'type': 'payPal',
                        'amount': cart.pricing.orderTotal.value,
                        'currency': 'USD',
                        'payPal': {
                            'returnUrl': window.location.href + '?ppsuccess=true',
                            'cancelUrl': window.location.href + '?ppcancel=true',
                            'items': payPalItems,
                            'taxAmount': cart.pricing.tax.value,
                            'requestShipping': requestShipping
                        }
                    };

                    if (requestShipping) {
                        payPalPayload['shipping'] = {
                            'recipient':  `${cart.shippingAddress.firstName} ${cart.shippingAddress.lastName} `,
                            'phoneNumber':  cart.shippingAddress.phoneNumber,
                            'address': {
                                'line1': cart.shippingAddress.line1,
                                'line2': cart.shippingAddress.line2,
                                'city': cart.shippingAddress.city,
                                'state': cart.shippingAddress.state,
                                'country':  cart.shippingAddress.country,
                                'postalCode': cart.shippingAddress.postalCode
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
    }
});
