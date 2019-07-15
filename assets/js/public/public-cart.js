/* global drExpressOptions, iFrameResize */
/* eslint-disable no-alert, no-console */

jQuery(document).ready(($) => {
    const apiBaseUrl = 'https://' + drExpressOptions.domain + '/v1/shoppers';

    // Very basic throttle function,
    // does not store calls white in limit period
    const throttle = (func, limit) => {
        let inThrottle

        return function() {
          const args = arguments
          const context = this

          if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
          }
        }
    }

    $('body').on('click', '.dr-prd-del', (e) => {
        e.preventDefault();

        const $this = $(e.target);
        const lineItemId = $this.closest('.dr-product').data('line-item-id');

        $.ajax({
            type: 'DELETE',
            headers: {
                "Accept": "application/json"
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active/line-items/${lineItemId}?`;
                url += `&token=${drExpressOptions.accessToken}`
                return url;
            })(),
            success: (data, textStatus, xhr) => {
                if ( xhr.status === 204 ) {
                    $(`.dr-product[data-line-item-id="${lineItemId}"]`).remove();
                    fetchFreshCart();
                }
                // TODO: On Error give feedback
            },
            error: (jqXHR) => {
                console.log(jqXHR);
                 // On Error give feedback
            }
        });
    });

    $('body').on('click', 'span.dr-pd-cart-qty-plus, span.dr-pd-cart-qty-minus', throttle(setProductQty, 200));

    function setProductQty(e) {
        // Get current quantity values
        const $this = $(e.target);
        const lineItemId = $this.closest('.dr-product').data('line-item-id');
        const $qty = $this.siblings('.product-qty-number:first');
        const val = parseInt($qty.val(), 10);
        const max = parseInt($qty.attr('max'), 10);
        const min = parseInt($qty.attr('min'), 10);
        const step = parseInt($qty.attr('step'), 10);
        const initialVal = $qty.val();

        if (val) {
            // Change the value if plus or minus
            if ($(e.currentTarget).is('.dr-pd-cart-qty-plus')) {
                if (max && (max <= val)) {
                    $qty.val(max);
                } else {
                    $qty.val(val + step);
                }
            } else if ($(e.currentTarget).is('.dr-pd-cart-qty-minus')) {
                if (min && (min >= val)) {
                    $qty.val(min);
                } else if (val > 1) {
                    $qty.val(val - step);
                }
            }
        } else {
            $qty.val('1');
        }

        let params = {
            'token'               : drExpressOptions.accessToken,
            'action'              : 'update',
            'quantity'            : $qty.val(),
            'expand'              : 'all',
            'fields'              : null
        }

        $.ajax({
            type: 'POST',
            headers: {
                "Accept": "application/json"
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active/line-items/${lineItemId}?${$.param(params)}`;
                return url;
            })(),
            success: (data, textStatus, xhr) => {
                if (xhr.status === 200) {
                    let { formattedListPriceWithQuantity, formattedSalePriceWithQuantity } = data.lineItem.pricing;
                    $(`span#${lineItemId}.sale-price`).text(formattedSalePriceWithQuantity);
                    $(`span#${lineItemId}.regular-price`).text(formattedListPriceWithQuantity);

                    fetchFreshCart();
                }
            },
            error: (jqXHR) => {
                // TODO: Handle errors gracefully | revery back
                console.log(jqXHR);
            }
        });
    }

    function beforeAjax() {
      if($('.dr-cart__products').length > 0)$('body').css({ 'pointer-events': 'none', 'opacity': 0.5 });
    }

    function afterAjax() {
      if($('.dr-cart__products').length > 0)$('body').css({ 'pointer-events': 'auto', 'opacity': 1 });
    }

    $(document).ajaxSend(function() {
      beforeAjax();
    });

    $(document).ajaxStop(function() {
      afterAjax();
    });


    function fetchFreshCart() {
        $.ajax({
            type: 'GET',
            headers: {
                "Accept": "application/json"
            },
            url: (() => {
                let url = `${apiBaseUrl}/me/carts/active?`;
                url += `&expand=all`
                url += `&token=${drExpressOptions.accessToken}`
                return url;
            })(),
            success: (data) => {
                renderCartProduct(data);
                displayMiniCart(data.cart);
                merchandisingInit(data);
            },
            error: (jqXHR) => {
                console.log(jqXHR);
            }
        });
    }

    function merchandisingInit(data){
      $.each(data.cart.lineItems.lineItem, function( index, lineitem ) {
        candyRackCheckAndRender(lineitem.product.id);
        tightBundleRemoveElements(lineitem.product.id);
      });
      shoppingCartBanner();
      $('body').css({ 'pointer-events': 'auto', 'opacity': 1 });
    }

    function shoppingCartBanner(){
      $.ajax({
        type: 'GET',
        url: (() => {
            let url = `${apiBaseUrl}/me/point-of-promotions/Banner_ShoppingCartLocal/offers?`;
            url += `format=json`
            url += `&expand=all`
            url += `&token=${drExpressOptions.accessToken}`
            return url;
        })(),
        success: (shoppingCartOfferData, textStatus, xhr) => {
          $.each(shoppingCartOfferData.offers.offer, function( index, offer ) {
            let shoppingCartHTML = `
            <div class="dr-product"><div class="dr-product-content">${offer.salesPitch[0]}</div><img src="${offer.image}"></div>
            `;
            $(".dr-cart__products").append(shoppingCartHTML);
          });
        },
        error: (jqXHR) => {
            reject(jqXHR);
        }
      });
    }

    function tightBundleRemoveElements(productID){
      $.ajax({
        type: 'GET',
        url: (() => {
            let url = `${apiBaseUrl}/me/products/${productID}/offers?`;
            url += `format=json`
            url += `&expand=all`
            url += `&token=${drExpressOptions.accessToken}`
            return url;
        })(),
        success: (tightData, textStatus, xhr) => {
          $.each(tightData.offers.offer, function( index, offer ) {
            if(offer.type =="Bundling" && offer.policyName == "Tight Bundle Policy"){
             $.each(offer.productOffers.productOffer, function( index, productOffer ) {
               /*if product have  tight policy and it is not tight itself, remove the action button*/
               if(productOffer.product.id != productID)$('div.dr-product[data-product-id="'+productOffer.product.id+'"]').find('.remove-icon,.value-button-increase,.value-button-decrease').remove();
             });
            }
          });

        },
        error: (jqXHR) => {
            reject(jqXHR);
        }
      });
    }


    function candyRackCheckAndRender(productID){
      $.ajax({
        type: 'GET',
        url: (() => {
            let url = `${apiBaseUrl}/me/products/${productID}/point-of-promotions/CandyRack_ShoppingCart/offers?`;
            url += `format=json`
            url += `&expand=all`
            url += `&token=${drExpressOptions.accessToken}`
            return url;
        })(),
        success: (candyRackData, textStatus, xhr) => {
          $.each(candyRackData.offers.offer, function( index, offer ) {
            let promoText = offer.salesPitch[0].length > 0 ? offer.salesPitch[0]   : "";
            let buyButtonText = (offer.type == "Up-sell") ? "Upgrade" : "Add";
            $.each(offer.productOffers.productOffer, function( index, productOffer ) {
              let candyRackProductHTML = `
              <div  class="dr-product dr-candyRackProduct" data-product-id="${productOffer.product.id}">
                <div class="dr-product-content">
                    <img src="${productOffer.product.thumbnailImage}" height="40px"/>
                    <!-- <div class="dr-product__img" style="background-image: url(${productOffer.product.thumbnailImage});background-size:50%;background-repeat: no-repeat;background-position: right; height:40px;"></div> -->
                    <div class="dr-product__info">
                      <div class="product-color">
                        <span style="background-color: yellow;">${promoText}</span>
                      </div>
                      ${productOffer.product.displayName}
                      <div class="product-sku">
                        <span>Product </span>
                        <span>#${productOffer.product.id}</span>
                      </div>
                    </div>
                </div>
                <div class="dr-product__price">
                    <button type="button" class="dr-btn dr-buy-candyRack" data-buy-uri="${productOffer.addProductToCart.uri}">${buyButtonText}</button>
                    <span class="sale-price">${productOffer.pricing.formattedSalePriceWithQuantity}</span>
                    <span class="regular-price dr-strike-price">${productOffer.pricing.formattedListPriceWithQuantity}</span>
                </div>
              </div>
              `;
              if($('div.dr-product[data-product-id="'+productOffer.product.id+'"]:not(.dr-candyRackProduct)').length == 0)$('div[data-product-id="'+productID+'"]').after(candyRackProductHTML);
            });
          });
        },
        error: (jqXHR) => {
            reject(jqXHR);
        }
      });
    }

    $('body').on('click', '.dr-buy-candyRack', (e) => {
      e.preventDefault();
      const $this = $(e.target);
      const buyUri = $this.attr('data-buy-uri');
      $.ajax({
          type: 'POST',
          headers: {
              "Accept": "application/json"
          },
          url: (() => {
              let url = buyUri;
              if(drExpressOptions.testOrder == "true")url += '&testOrder=true';
              url += `&token=${drExpressOptions.accessToken}`
              return url;
          })(),
          success: (data, textStatus, xhr) => {
            fetchFreshCart();
          },
          error: (jqXHR) => {
            console.log(jqXHR);
               // On Error give feedback
          }
      });
    });

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

    function renderCartProduct(data){
      $('.dr-cart__products').html("");
      let hasPhysicalProduct = false;
      $.each(data.cart.lineItems.lineItem, function( index, lineitem ) {
        let permalink = '';
        if(lineitem.product.productType == "PHYSICAL")hasPhysicalProduct = true;
        $.ajax({
          type: 'POST',
          async: false,
          url: drExpressOptions.ajaxUrl,
          data: {
            action: 'get_permalink',
            productID: lineitem.product.id
          },
          success: (response) => {
            permalink = response;
            let lineItemHTML = `
            <div data-line-item-id="${lineitem.id}" class="dr-product" data-product-id="${lineitem.product.id}">
              <div class="dr-product-content">
                  <div class="dr-product__img" style="background-image: url(${lineitem.product.thumbnailImage})"></div>
                  <div class="dr-product__info">
                      <a class="product-name" href="${permalink}">${lineitem.product.displayName}</a>
                      <div class="product-sku">
                          <span>Product </span>
                          <span>#${lineitem.product.id}</span>
                      </div>
                      <div class="product-qty">
                          <span class="qty-text">Qty ${lineitem.quantity}</span>
                          <span class="dr-pd-cart-qty-minus value-button-decrease"></span>
                          <input type="number" class="product-qty-number" step="1" min="1" max="999" value="${lineitem.quantity}" maxlength="5" size="2" pattern="[0-9]*" inputmode="numeric" readonly="true">
                          <span class="dr-pd-cart-qty-plus value-button-increase"></span>
                      </div>
                  </div>
              </div>
              <div class="dr-product__price">
                  <button class="dr-prd-del remove-icon"></button>
                  <span class="sale-price">${lineitem.pricing.formattedSalePriceWithQuantity}</span>
                  <span class="regular-price">${lineitem.pricing.formattedListPriceWithQuantity}</span>
              </div>
            </div>
            `;
            $('.dr-cart__products').append(lineItemHTML);
          }
        });
      });
      const pricing = data.cart.pricing;
      if(hasPhysicalProduct){
        $('.dr-summary__shipping').show();
      }else{
        $('.dr-summary__shipping').hide();
      }
      $('div.dr-summary__shipping .shipping-value').text(pricing.formattedShippingAndHandling);
      //overwrite $0.00 to FREE
      if(pricing.shippingAndHandling.value === 0 )$('div.dr-summary__shipping .shipping-value').text("FREE");
      $('div.dr-summary__discount .discount-value').text(`-${pricing.formattedDiscount}`);
      $('div.dr-summary__discounted-subtotal .discounted-subtotal-value').text(pricing.formattedSubtotalWithDiscount);

      if (pricing.discount.value) {
        $('.dr-summary__discount').show();
      } else {
        $('.dr-summary__discount').hide();
      }
      if ($('.dr-cart__products').children().length <= 0) {
        $('.dr-cart__products').text('Your cart is empty!');
        $('#cart-estimate').hide();
      }
    }

    $('.dr-currency-select').on('change', function(e) {
        e.preventDefault();

        let data = {
            currency: e.target.value,
            locale: $(this).find('option:selected').attr('data-locale')
        };

        $.ajax({
            type: 'POST',
            url: (() => {
                let url = `${apiBaseUrl}/me?`;
                url += `format=json`
                url += `&token=${drExpressOptions.accessToken}`
                url += `&currency=${data.currency}`
                url += `&locale=${data.locale}`
                return url;
            })(),
            success: (data, textStatus, xhr) => {
                if (xhr.status === 204) {
                    location.reload();
                }
            },
            error: (jqXHR) => {
                reject(jqXHR);
            }
        });
    });



    function displayMiniCart(cart) {

        if ( cart === undefined || cart === null ) {
            return;
        }

        const $display = $('.dr-minicart-display');
        const $body = $('<div class="dr-minicart-body"></div>');
        const $footer = $('<div class="dr-minicart-footer"></div>');

        let lineItems = (cart.lineItems && cart.lineItems.lineItem) ? cart.lineItems.lineItem : [];

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
                const productId = li.product.uri.replace(`${apiBaseUrl}/me/products/`, '');
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

    $('.promo-code-toggle').click(() => {
        $('.promo-code-wrapper').toggle();
    });

    $('#apply-promo-code-btn').click((e) => {
        const promoCode = $('#promo-code').val();

        if (!promoCode) {
          $('#dr-promo-code-err-field').text('Please enter a valid promo code.').show();
          return;
        }

        $(e.target).addClass('sending').blur();
        updateCart({ promoCode }).then(() => {
            $(e.target).removeClass('sending');
            $('#dr-promo-code-err-field').text('').hide();
            fetchFreshCart();
        }).catch((jqXHR) => {
            $(e.target).removeClass('sending');
            if (jqXHR.responseJSON.errors) {
                const errMsgs = jqXHR.responseJSON.errors.error.map((err) => {
                    return err.description;
                });
                $('#dr-promo-code-err-field').html(errMsgs.join('<br/>')).show();
            }
        });
    });

    $('#promo-code').keypress((e) => {
        if ( e.which == 13 ) {
            e.preventDefault();
            $('#apply-promo-code-btn').trigger('click');
        }
    });

    /*init cart via JS*/
    if($("#dr-cart-page-wrapper").length >0){
      fetchFreshCart();
    }
});
