/* global drExpressOptions, iFrameResize */
/* eslint-disable no-alert, no-console */

jQuery(document).ready(($) => {
    class DRService {

        constructor() {
            this.siteID = drExpressOptions.siteID;
            this.apiKey = drExpressOptions.apiKey;
            this.domain = drExpressOptions.domain;
            this.sessionToken = null;
            this.apiBaseUrl = 'https://' + this.domain + '/v1/shoppers';
            this.drLocale = drExpressOptions.drLocale || 'en_US';
        }

        updateShopper() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.sessionToken}`,
                    },
                    url: `${this.apiBaseUrl}/me?format=json&locale=${this.drLocale}`,
                    success: (data) => {
                        resolve(data);
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }

        getCart() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${drExpressOptions.accessToken}`                    },
                    url: (() => {
                        let url = `${this.apiBaseUrl}/me/carts/active?`;
                        url += 'format=json'
                        url += `&token=${drExpressOptions.accessToken}`
                        return url;
                    })(),
                    success: (data) => {
                        resolve(data.cart);
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }

        updateCart(productID, quantity) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${drExpressOptions.accessToken}`
                    },
                    url: (() => {
                        let url = `${this.apiBaseUrl}/me/carts/active?`;
                        url += 'format=json'
                        url += `&productId=${productID}`
                        if (quantity) url += `&quantity=${quantity}`;
                        url += `&token=${drExpressOptions.accessToken}`
                        return url;
                    })(),
                    success: (data) => {
                        resolve(data.cart);
                        openMiniCartDisplay();
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }
        

        removeLineItem(lineItemID) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                    },
                    url: (() => {
                        let url = `${this.apiBaseUrl}/me/carts/active/line-items/${lineItemID}?`;
                        url += 'format=json'
                        url += `&token=${drExpressOptions.accessToken}`
                        return url;
                    })(),
                    success: () => {
                        resolve();
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }

        getOffersByPoP(popName) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.sessionToken}`,
                    },
                    url: `${this.apiBaseUrl}/me/point-of-promotions/SiteMerchandising_${popName}/offers?format=json&expand=all`,
                    success: (data) => {
                        resolve(data);
                        console.log('getOffers', data);
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }

        getProductPricing(productID) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.sessionToken}`,
                    },
                    url: `${this.apiBaseUrl}/me/products/${productID}/pricing?format=json&expand=all`,
                    success: (data) => {
                        resolve(data);
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }

        getProductInventoryStatus(productID) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.sessionToken}`,
                    },
                    url: `${this.apiBaseUrl}/me/products/${productID}/inventory-status?format=json&expand=all`,
                    success: (data) => {
                        resolve(data);
                        console.log('getProductInventoryStatus', data);
                    },
                    error: (jqXHR) => {
                        reject(jqXHR);
                    }
                });
            });
        }
    }

    const drService = new DRService();
    let lineItems = [];

    function toggleMiniCartDisplay() {
        const $miniCartDisplay = $('.dr-minicart-display');
        if ($miniCartDisplay.is(':visible')) {
            $miniCartDisplay.fadeOut(200);
        } else {
            $miniCartDisplay.fadeIn(200);
        }
    }

    function openMiniCartDisplay() {
        const $miniCartDisplay = $('.dr-minicart-display');
        if (! $miniCartDisplay.is(':visible')) {
            $miniCartDisplay.fadeIn(200);
        }
    }

    function displayMiniCart(cart) {
        const $display = $('.dr-minicart-display');
        const $body = $('<div class="dr-minicart-body"></div>');
        const $footer = $('<div class="dr-minicart-footer"></div>');

        lineItems = (cart.lineItems && cart.lineItems.lineItem) ? cart.lineItems.lineItem : [];

        $('.dr-minicart-count').text(cart.totalItemsInCart);
        $('.dr-minicart-header').siblings().remove();

        if (!lineItems.length) {
            const emptyMsg = '<p class="dr-minicart-empty-msg">Your shopping cart is currently empty.</p>';
            $body.append(emptyMsg);
            $display.append($body);
        } else {
            let miniCartLineItems = '<ul class="dr-minicart-list">';
            const miniCartSubtotal = `<p class="dr-minicart-subtotal"><label>Sub-Total</label><span>${cart.pricing.formattedSubtotal}</span></p>`;
            const miniCartViewCartBtn = `<a class="dr-btn" id="dr-minicart-view-cart-btn" href="${drExpressOptions.cartUrl}">View Cart</a>`;
            const miniCartCheckoutBtn = `<a class="dr-btn" id="dr-minicart-checkout-btn" href="${drExpressOptions.checkoutUrl}">Checkout</a>`;

            lineItems.forEach((li) => {
                const productId = li.product.uri.replace(`${drService.apiBaseUrl}/me/products/`, '');
                const listPrice = Number(li.pricing.listPriceWithQuantity.value);
                const salePrice = Number(li.pricing.salePriceWithQuantity.value);
                const formattedSalePrice = li.pricing.formattedSalePriceWithQuantity;
                let priceContent = '';

                if (listPrice > salePrice) {
                    priceContent = `<del class="dr-strike-price">${listPrice}</del><span class="dr-sale-price">${formattedSalePrice}</span>`;
                } else {
                    priceContent = formattedSalePrice;
                }

                const miniCartLineItem = `
                <li class="dr-minicart-item clearfix">
                    <div class="dr-minicart-item-thumbnail">
                        <img src="${li.product.thumbnailImage}" alt="${li.product.displayName}" />
                    </div>
                    <div class="dr-minicart-item-info" data-product-id="${productId}">
                        <span class="dr-minicart-item-title">${li.product.displayName}</span>
                        <span class="dr-minicart-item-qty">Qty.${li.quantity}</span>
                        <p class="dr-pd-price dr-minicart-item-price">${priceContent}</p>
                    </div>
                    <a href="#" class="dr-minicart-item-remove-btn" aria-label="Remove" data-line-item-id="${li.id}">Remove</a>
                </li>`;
                miniCartLineItems += miniCartLineItem;
            });
            miniCartLineItems += '</ul>';
            $body.append(miniCartLineItems, miniCartSubtotal);
            $footer.append(miniCartViewCartBtn, miniCartCheckoutBtn);
            $display.append($body, $footer);
        }
    }

    function displayPrice(priceObj, isInLoop) {
        const listPrice = Number(priceObj.listPriceWithQuantity.value);
        const salePrice = Number(priceObj.salePriceWithQuantity.value);
        const formattedSalePrice = priceObj.formattedSalePriceWithQuantity;
        const priceClass = isInLoop ? 'dr-pd-price dr-pd-item-price' : 'dr-pd-price';
        let priceContent = '';

        if (listPrice > salePrice) {
            priceContent = `<p class="${priceClass}"><del class="dr-strike-price">${listPrice}</del><span class="dr-sale-price">${formattedSalePrice}</span></p>`;
        } else {
            priceContent = `<p class="${priceClass}">${formattedSalePrice}</p>`;
        }

        return priceContent;
    }

    function errorCallback(jqXHR) {
        console.log('errorStatus', jqXHR.status);
        if (jqXHR.status === 401) {
            localStorage.removeItem('drSessionToken');
            init(); // eslint-disable-line no-use-before-define
        }
    }

    $.fn.appendLoadingIcon = function (size = 'sm', gap = '0') {
        const loader = `<div class="dr-loader-container"><div class="dr-loader dr-loader-${size}" style="margin: ${gap} auto;">Loading...</div></div>`;
        this.append(loader);
    };

    $.fn.removeLoadingIcon = function () {
        this.find('.dr-loader-container').remove();
    };

    (function () {
        displayMiniCart(drExpressOptions.cart.cart);
    }());

    $('.dr-minicart-toggle, .dr-minicart-close-btn').click((e) => {
        e.preventDefault();
        toggleMiniCartDisplay();
    });

    $('body').on('click', '.dr-buy-btn', (e) => {
        e.preventDefault();
        let quantity = 1;
        var $this = $(e.target);

        var productID = $this.attr('data-product-id') ? $this.attr('data-product-id').toString() : '';

        var existingProducts = lineItems.map((li) => {
            var { uri } = li.product;
            var id = uri.replace(`${drService.apiBaseUrl}/me/products/`, '');
            return {
                id,
                quantity: li.quantity
            };
        });

        // PD page
        if ($('#dr-pd-offers').length) {
            quantity = parseInt($('#dr-pd-qty').val(), 10);
        }

        existingProducts.forEach((pd) => {
            if (pd.id === productID) {
                quantity += pd.quantity;
            }
        });

        drService.updateCart(productID, quantity)
            .then(cart => displayMiniCart(cart))
            .catch(jqXHR => errorCallback(jqXHR));
    });

    $('.dr-minicart-display').on('click', '.dr-minicart-item-remove-btn', (e) => {
        e.preventDefault();
        const lineItemID = $(e.target).data('line-item-id');

        drService.removeLineItem(lineItemID)
            .then(() => drService.getCart())
            .then(cart => displayMiniCart(cart))
            .catch(jqXHR => errorCallback(jqXHR));
    });

    $('span.dr-pd-qty-plus, span.dr-pd-qty-minus').on('click', (e) => {
        // Get current quantity values
        const $qty = $('#dr-pd-qty');
        const val = parseInt($qty.val(), 10);
        const max = parseInt($qty.attr('max'), 10);
        const min = parseInt($qty.attr('min'), 10);
        const step = parseInt($qty.attr('step'), 10);
        if (val) {
            // Change the value if plus or minus
            if ($(e.currentTarget).is('.dr-pd-qty-plus')) {
                if (max && (max <= val)) {
                    $qty.val(max);
                } else {
                    $qty.val(val + step);
                }
            } else if ($(e.currentTarget).is('.dr-pd-qty-minus')) {
                if (min && (min >= val)) {
                    $qty.val(min);
                } else if (val > 1) {
                    $qty.val(val - step);
                }
            }
        } else {
            $qty.val('1');
        }
    });

    $('.dr_prod-variations select').on('change', function(e) {
        e.preventDefault();

        var varId = $(this).val();
        var price = $(this).children("option:selected").data('price');
        var $prodPrice = $('.dr-pd-price');
        var $buyBtn = $('.dr-buy-btn');

        $buyBtn.attr('data-product-id', varId);
        $prodPrice.html('<strong>' + price + '</strong>');
    });

    $( "iframe[name^='controller-']" ).css('display', 'none');
});
