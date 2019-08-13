"use strict";

var FloatLabel = function () {
  // add active class
  var handleFocus = function handleFocus(e) {
    var target = e.target;
    target.parentNode.classList.add('active'); // target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
  }; // remove active class


  var handleBlur = function handleBlur(e) {
    var target = e.target;

    if (!target.value) {
      target.parentNode.classList.remove('active');
    } // target.removeAttribute('placeholder');

  }; // register events


  var bindEvents = function bindEvents(element) {
    var floatField = element.querySelector('input');
    floatField.addEventListener('focus', handleFocus);
    floatField.addEventListener('blur', handleBlur);
  }; // get DOM elements


  var init = function init() {
    var floatContainers = document.querySelectorAll('.float-container');

    for (var i = 0; i < floatContainers.length; i++) {
      var element = floatContainers[i];

      if (element.querySelector('input').value) {
        element.classList.add('active');
      }

      bindEvents(element);
    }
  };

  return {
    init: init
  };
}();
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

jQuery(document).ready(function ($) {
  if (typeof $().modal !== "function") {
    'use strict'; // MODAL CLASS DEFINITION
    // ======================


    var Modal = function Modal(element, options) {
      this.options = options;
      this.$element = $(element);
      this.$backdrop = this.isShown = null;

      if (this.options.remote) {
        this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal');
        }, this));
      }
    };

    Modal.DEFAULTS = {
      backdrop: true,
      keyboard: true,
      show: true
    };

    Modal.prototype.toggle = function (_relatedTarget) {
      return this[!this.isShown ? 'show' : 'hide'](_relatedTarget);
    };

    Modal.prototype.show = function (_relatedTarget) {
      var that = this;
      var e = $.Event('show.bs.modal', {
        relatedTarget: _relatedTarget
      });
      this.$element.trigger(e);

      if (this.isShown || e.isDefaultPrevented()) {
        return;
      }

      this.isShown = true;
      this.escape();
      this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade');

        if (!that.$element.parent().length) {
          that.$element.appendTo(document.body); // don't move modals dom position
        }

        that.$element.show().scrollTop(0);

        if (transition) {
          that.$element[0].offsetWidth; // force reflow
        }

        that.$element.addClass('in').attr('aria-hidden', false);
        that.enforceFocus();
        var e = $.Event('shown.bs.modal', {
          relatedTarget: _relatedTarget
        });
        transition ? that.$element.find('.modal-dialog') // wait for modal to slide in
        .one($.support.transition.end, function () {
          that.$element.focus().trigger(e);
        }).emulateTransitionEnd(300) : that.$element.focus().trigger(e);
      });
    };

    Modal.prototype.hide = function (e) {
      if (e) {
        e.preventDefault();
      }

      e = $.Event('hide.bs.modal');
      this.$element.trigger(e);

      if (!this.isShown || e.isDefaultPrevented()) {
        return;
      }

      this.isShown = false;
      this.escape();
      $(document).off('focusin.bs.modal');
      this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal');
      $.support.transition && this.$element.hasClass('fade') ? this.$element.one($.support.transition.end, $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal();
    };

    Modal.prototype.enforceFocus = function () {
      $(document).off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus();
        }
      }, this));
    };

    Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
          e.which === 27 && this.hide();
        }, this));
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.bs.modal');
      }
    };

    Modal.prototype.hideModal = function () {
      var that = this;
      this.$element.hide();
      this.backdrop(function () {
        that.removeBackdrop();
        that.$element.trigger('hidden.bs.modal');
      });
    };

    Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove();
      this.$backdrop = null;
    };

    Modal.prototype.backdrop = function (callback) {
      var animate = this.$element.hasClass('fade') ? 'fade' : '';

      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate;
        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body);
        this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) {
            return;
          }

          this.options.backdrop === 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this);
        }, this));

        if (doAnimate) {
          this.$backdrop[0].offsetWidth;
        } // force reflow


        this.$backdrop.addClass('in');

        if (!callback) {
          return;
        }

        doAnimate ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in');
        $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();
      } else if (callback) {
        callback();
      }
    }; // MODAL PLUGIN DEFINITION
    // =======================


    var old = $.fn.modal;

    $.fn.modal = function (option, _relatedTarget) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data('bs.modal');
        var options = $.extend({}, Modal.DEFAULTS, $this.data(), _typeof(option) === 'object' && option);

        if (!data) {
          $this.data('bs.modal', data = new Modal(this, options));
        }

        if (typeof option === 'string') {
          data[option](_relatedTarget);
        } else if (options.show) {
          data.show(_relatedTarget);
        }
      });
    };

    $.fn.modal.Constructor = Modal; // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
      $.fn.modal = old;
      return this;
    }; // MODAL DATA-API
    // ==============


    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this = $(this);
      var href = $this.attr('href');
      var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')); //strip for ie7

      var option = $target.data('bs.modal') ? 'toggle' : $.extend({
        remote: !/#/.test(href) && href
      }, $target.data(), $this.data());

      if ($this.is('a')) {
        e.preventDefault();
      }

      $target.modal(option, this).one('hide', function () {
        $this.is(':visible') && $this.focus();
      });
    });
    $(document).on('body', '.modal', function () {
      $(document.body).addClass('modal-open');
    }).on('body', '.modal', function () {
      $(document.body).removeClass('modal-open');
    });
  }
});
"use strict";

/* global drgc_params, iFrameResize */

/* eslint-disable no-alert, no-console */
jQuery(document).ready(function ($) {
  var apiBaseUrl = 'https://' + drgc_params.domain + '/v1/shoppers';
  var productLabel = $("#dr-cart-page-wrapper div.product-sku span:first-child").html(); // Very basic throttle function,
  // does not store calls white in limit period

  var throttle = function throttle(func, limit) {
    var inThrottle;
    return function () {
      var args = arguments;
      var context = this;

      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function () {
          return inThrottle = false;
        }, limit);
      }
    };
  };

  $('body').on('click', '.dr-prd-del', function (e) {
    e.preventDefault();
    var $this = $(e.target);
    var lineItemId = $this.closest('.dr-product').data('line-item-id');
    $.ajax({
      type: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me/carts/active/line-items/").concat(lineItemId),
      success: function success(data, textStatus, xhr) {
        if (xhr.status === 204) {
          $(".dr-product[data-line-item-id=\"".concat(lineItemId, "\"]")).remove();
          fetchFreshCart();
        } // TODO: On Error give feedback

      },
      error: function error(jqXHR) {
        console.log(jqXHR); // On Error give feedback
      }
    });
  });
  $('body').on('click', 'span.dr-pd-cart-qty-plus, span.dr-pd-cart-qty-minus', throttle(setProductQty, 200));

  function setProductQty(e) {
    // Get current quantity values
    var $this = $(e.target);
    var lineItemId = $this.closest('.dr-product').data('line-item-id');
    var $qty = $this.siblings('.product-qty-number:first');
    var val = parseInt($qty.val(), 10);
    var max = parseInt($qty.attr('max'), 10);
    var min = parseInt($qty.attr('min'), 10);
    var step = parseInt($qty.attr('step'), 10);
    var initialVal = $qty.val();

    if (val) {
      // Change the value if plus or minus
      if ($(e.currentTarget).is('.dr-pd-cart-qty-plus')) {
        if (max && max <= val) {
          $qty.val(max);
        } else {
          $qty.val(val + step);
        }
      } else if ($(e.currentTarget).is('.dr-pd-cart-qty-minus')) {
        if (min && min >= val) {
          $qty.val(min);
        } else if (val > 1) {
          $qty.val(val - step);
        }
      }
    } else {
      $qty.val('1');
    }

    var params = {
      'action': 'update',
      'quantity': $qty.val(),
      'expand': 'all',
      'fields': null
    };
    $.ajax({
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me/carts/active/line-items/").concat(lineItemId, "?").concat($.param(params)),
      success: function success(data, textStatus, xhr) {
        if (xhr.status === 200) {
          var _data$lineItem$pricin = data.lineItem.pricing,
              formattedListPriceWithQuantity = _data$lineItem$pricin.formattedListPriceWithQuantity,
              formattedSalePriceWithQuantity = _data$lineItem$pricin.formattedSalePriceWithQuantity;
          $("span#".concat(lineItemId, ".sale-price")).text(formattedSalePriceWithQuantity);
          $("span#".concat(lineItemId, ".regular-price")).text(formattedListPriceWithQuantity);
          fetchFreshCart();
        }
      },
      error: function error(jqXHR) {
        // TODO: Handle errors gracefully | revery back
        console.log(jqXHR);
      }
    });
  }

  function beforeAjax() {
    if ($('.dr-cart__products').length > 0) $('body').css({
      'pointer-events': 'none',
      'opacity': 0.5
    });
  }

  function afterAjax() {
    if ($('.dr-cart__products').length > 0) $('body').css({
      'pointer-events': 'auto',
      'opacity': 1
    });
  }

  $(document).ajaxSend(function () {
    beforeAjax();
  });
  $(document).ajaxStop(function () {
    afterAjax();
  });

  function fetchFreshCart() {
    $.ajax({
      type: 'GET',
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me/carts/active?expand=all"),
      success: function success(data) {
        renderCartProduct(data);
        displayMiniCart(data.cart);
      },
      error: function error(jqXHR) {
        console.log(jqXHR);
      }
    });
  }

  function shoppingCartBannerAndOutputLineItems() {
    $.ajax({
      type: 'GET',
      headers: {
        "Content-Type": 'application/json',
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me/point-of-promotions/Banner_ShoppingCartLocal/offers?format=json&expand=all"),
      success: function success(shoppingCartOfferData, textStatus, xhr) {
        $.each(shoppingCartOfferData.offers.offer, function (index, offer) {
          var shoppingCartHTML = "\n            <div class=\"dr-product\"><div class=\"dr-product-content\">".concat(offer.salesPitch[0], "</div><img src=\"").concat(offer.image, "\"></div>\n            ");
          $("#tempCartProducts").append(shoppingCartHTML);
          $(".dr-cart__products").html($("#tempCartProducts").html());
        });
      },
      error: function error(jqXHR) {
        reject(jqXHR);
      }
    });
  }

  function tightBundleRemoveElements(productID) {
    $.ajax({
      type: 'GET',
      headers: {
        "Content-Type": 'application/json',
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me/products/").concat(productID, "/offers?format=json&expand=all"),
      success: function success(tightData, textStatus, xhr) {
        $.each(tightData.offers.offer, function (index, offer) {
          if (offer.type == "Bundling" && offer.policyName == "Tight Bundle Policy") {
            $.each(offer.productOffers.productOffer, function (index, productOffer) {
              /*if product have  tight policy and it is not tight itself, remove the action button*/
              if (productOffer.product.id != productID) {
                $('div.dr-product[data-product-id="' + productOffer.product.id + '"]').find('.remove-icon,.value-button-increase,.value-button-decrease').remove();
              }
            });
          }
        });
      },
      error: function error(jqXHR) {
        reject(jqXHR);
      }
    });
  }

  function candyRackCheckAndRender(productID) {
    $.ajax({
      type: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me/products/").concat(productID, "/point-of-promotions/CandyRack_ShoppingCart/offers?format=json&expand=all"),
      success: function success(candyRackData, textStatus, xhr) {
        $.each(candyRackData.offers.offer, function (index, offer) {
          var promoText = offer.salesPitch[0].length > 0 ? offer.salesPitch[0] : "";
          var buyButtonText = offer.type == "Up-sell" ? "Upgrade" : "Add";
          $.each(offer.productOffers.productOffer, function (index, productOffer) {
            var candyRackProductHTML = "\n              <div  class=\"dr-product dr-candyRackProduct\" data-product-id=\"".concat(productOffer.product.id, "\" data-parent-product-id=\"").concat(productID, "\">\n                <div class=\"dr-product-content\">\n                    <img src=\"").concat(productOffer.product.thumbnailImage, "\" class=\"dr-candyRackProduct__img\"/>\n                    <div class=\"dr-product__info\">\n                      <div class=\"product-color\">\n                        <span style=\"background-color: yellow;\">").concat(promoText, "</span>\n                      </div>\n                      ").concat(productOffer.product.displayName, "\n                      <div class=\"product-sku\">\n                        <span>").concat(productLabel, "  </span>\n                        <span>#").concat(productOffer.product.id, "</span>\n                      </div>\n                    </div>\n                </div>\n                <div class=\"dr-product__price\">\n                    <button type=\"button\" class=\"dr-btn dr-buy-candyRack\" data-buy-uri=\"").concat(productOffer.addProductToCart.uri, "\">").concat(buyButtonText, "</button>\n                    <span class=\"sale-price\">").concat(productOffer.pricing.formattedSalePriceWithQuantity, "</span>\n                    <span class=\"regular-price dr-strike-price\">").concat(productOffer.pricing.formattedListPriceWithQuantity, "</span>\n                </div>\n              </div>\n              ");
            if ($('div.dr-product[data-product-id="' + productOffer.product.id + '"]:not(.dr-candyRackProduct)').length == 0) $('div[data-product-id="' + productID + '"]').after(candyRackProductHTML);
          });
        });
      },
      error: function error(jqXHR) {
        reject(jqXHR);
      }
    });
  }

  $('body').on('click', '.dr-buy-candyRack', function (e) {
    e.preventDefault();
    var $this = $(e.target);
    var buyUri = $this.attr('data-buy-uri');
    $.ajax({
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: function () {
        var url = buyUri;
        if (drgc_params.testOrder == "true") url += '&testOrder=true';
        return url;
      }(),
      success: function success(data, textStatus, xhr) {
        fetchFreshCart();
      },
      error: function error(jqXHR) {
        console.log(jqXHR); // On Error give feedback
      }
    });
  });

  function updateCart() {
    var queryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cartRequest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var queryStr = $.param(queryParams);
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer ".concat(drgc_params.accessToken)
        },
        url: "".concat(apiBaseUrl, "/me/carts/active?&").concat(queryStr),
        data: JSON.stringify({
          cart: cartRequest
        }),
        success: function success(data) {
          resolve(data);
        },
        error: function error(jqXHR) {
          reject(jqXHR);
        }
      });
    });
  }

  function getpermalink(permalinkProductId) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'POST',
        url: drgc_params.ajaxUrl,
        data: {
          action: 'get_permalink',
          productID: permalinkProductId
        },
        success: function success(data) {
          resolve(data);
        },
        error: function error(jqXHR) {
          reject(jqXHR);
        }
      });
    });
  }

  function updateSummary(data, hasPhysicalProduct) {
    var pricing = data.cart.pricing;

    if (hasPhysicalProduct) {
      $('.dr-summary__shipping').show();
    } else {
      $('.dr-summary__shipping').hide();
    }

    $('div.dr-summary__shipping .shipping-value').text(pricing.formattedShippingAndHandling); //overwrite $0.00 to FREE

    if (pricing.shippingAndHandling.value === 0) $('div.dr-summary__shipping .shipping-value').text("FREE");
    $('div.dr-summary__discount .discount-value').text("-".concat(pricing.formattedDiscount));
    $('div.dr-summary__discounted-subtotal .discounted-subtotal-value').text(pricing.formattedSubtotalWithDiscount);

    if (pricing.discount.value) {
      $('.dr-summary__discount').show();
    } else {
      $('.dr-summary__discount').hide();
    }
  }

  function renderLineItemsAndSummary(data, hasPhysicalProductinLineItem) {
    var lineItemCount = 0;
    $.each(data.cart.lineItems.lineItem, function (index, lineitem) {
      if (lineitem.product.productType == "PHYSICAL") hasPhysicalProductinLineItem = true;
      var permalinkProductId = lineitem.product.id;
      if (lineitem.product.parentProduct) permalinkProductId = lineitem.product.parentProduct.id;
      getpermalink(permalinkProductId).then(function (response) {
        var permalink = response;
        var lineItemHTML = "\n          <div   data-line-item-id=\"".concat(lineitem.id, "\" class=\"dr-product dr-product-lineitem\" data-product-id=\"").concat(lineitem.product.id, "\" data-sort=\"").concat(index, "\">\n            <div class=\"dr-product-content\">\n                <div class=\"dr-product__img\" style=\"background-image: url(").concat(lineitem.product.thumbnailImage, ")\"></div>\n                <div class=\"dr-product__info\">\n                    <a class=\"product-name\" href=\"").concat(permalink, "\">").concat(lineitem.product.displayName, "</a>\n                    <div class=\"product-sku\">\n                        <span>").concat(productLabel, " </span>\n                        <span>#").concat(lineitem.product.id, "</span>\n                    </div>\n                    <div class=\"product-qty\">\n                        <span class=\"qty-text\">Qty ").concat(lineitem.quantity, "</span>\n                        <span class=\"dr-pd-cart-qty-minus value-button-decrease\"></span>\n                        <input type=\"number\" class=\"product-qty-number\" step=\"1\" min=\"1\" max=\"999\" value=\"").concat(lineitem.quantity, "\" maxlength=\"5\" size=\"2\" pattern=\"[0-9]*\" inputmode=\"numeric\" readonly=\"true\">\n                        <span class=\"dr-pd-cart-qty-plus value-button-increase\"></span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"dr-product__price\">\n                <button class=\"dr-prd-del remove-icon\"></button>\n                <span class=\"sale-price\">").concat(lineitem.pricing.formattedSalePriceWithQuantity, "</span>\n                <span class=\"regular-price\">").concat(lineitem.pricing.formattedListPriceWithQuantity, "</span>\n            </div>\n          </div>\n          ");
        $('#tempCartProducts').append(lineItemHTML);
      }).then(function () {
        lineItemCount++;

        if (lineItemCount === data.cart.lineItems.lineItem.length) {
          updateSummary(data, hasPhysicalProductinLineItem);
          reOrderCartAndMerchandising(data);
        }
      }).catch(function (jqXHR) {
        if (jqXHR.responseJSON.errors) {
          var errMsgs = jqXHR.responseJSON.errors.error.map(function (err) {
            return err.description;
          });
          console.log(errMsgs);
        }
      });
    });
  }

  function reOrderCartAndMerchandising(data) {
    //1.Order dr-product-lineitem in temp area
    var $wrapper = $('#tempCartProducts');
    $wrapper.find('.dr-product-lineitem').sort(function (a, b) {
      return +a.dataset.sort - +b.dataset.sort;
    }).appendTo($wrapper); //2. Add banner at last and output lineitems

    shoppingCartBannerAndOutputLineItems(); //3. Main cart item displayed, Finish loading icon

    $('body').css({
      'pointer-events': 'auto',
      'opacity': 1
    }); //4. Execute candyRackCheckAndRender and tightBundleRemoveElements

    $.each(data.cart.lineItems.lineItem, function (index, lineitem) {
      candyRackCheckAndRender(lineitem.product.id);
      tightBundleRemoveElements(lineitem.product.id);
    });
  }

  function renderCartProduct(data) {
    var hasPhysicalProduct = false;
    $("#tempCartProducts").remove();
    $("<div id='tempCartProducts' style='display:none;'></div>").appendTo('body');

    if (data.cart.lineItems.lineItem) {
      renderLineItemsAndSummary(data, hasPhysicalProduct);
    } else {
      $('.dr-cart__products').text('Your cart is empty.');
      $('#cart-estimate').hide();
    }
  }

  $('body').on('change', '.dr-currency-select', function (e) {
    e.preventDefault();
    var data = {
      currency: e.target.value,
      locale: $(this).find('option:selected').attr('data-locale')
    };
    $.ajax({
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer ".concat(drgc_params.accessToken)
      },
      url: "".concat(apiBaseUrl, "/me?currency=").concat(data.currency, "&locale=").concat(data.locale),
      success: function success(data, textStatus, xhr) {
        if (xhr.status === 204) {
          location.reload();
        }
      },
      error: function error(jqXHR) {
        reject(jqXHR);
      }
    });
  });

  function displayMiniCart(cart) {
    if (cart === undefined || cart === null) {
      return;
    }

    var $display = $('.dr-minicart-display');
    var $body = $('<div class="dr-minicart-body"></div>');
    var $footer = $('<div class="dr-minicart-footer"></div>');
    var lineItems = cart.lineItems && cart.lineItems.lineItem ? cart.lineItems.lineItem : [];
    $('.dr-minicart-count').text(cart.totalItemsInCart);
    $('.dr-minicart-header').siblings().remove();

    if (!lineItems.length) {
      var emptyMsg = '<p class="dr-minicart-empty-msg">Your shopping cart is currently empty.</p>';
      $body.append(emptyMsg);
      $display.append($body);
    } else {
      var miniCartLineItems = '<ul class="dr-minicart-list">';
      var miniCartSubtotal = "<p class=\"dr-minicart-subtotal\"><label>Sub-Total</label><span>".concat(cart.pricing.formattedSubtotal, "</span></p>");
      var miniCartViewCartBtn = "<a class=\"dr-btn\" id=\"dr-minicart-view-cart-btn\" href=\"".concat(drgc_params.cartUrl, "\">View Cart</a>");
      var miniCartCheckoutBtn = "<a class=\"dr-btn\" id=\"dr-minicart-checkout-btn\" href=\"".concat(drgc_params.checkoutUrl, "\">Checkout</a>");
      lineItems.forEach(function (li) {
        var productId = li.product.uri.replace("".concat(apiBaseUrl, "/me/products/"), '');
        var listPrice = Number(li.pricing.listPriceWithQuantity.value);
        var salePrice = Number(li.pricing.salePriceWithQuantity.value);
        var formattedSalePrice = li.pricing.formattedSalePriceWithQuantity;
        var priceContent = '';

        if (listPrice > salePrice) {
          priceContent = "<del class=\"dr-strike-price\">".concat(listPrice, "</del><span class=\"dr-sale-price\">").concat(formattedSalePrice, "</span>");
        } else {
          priceContent = formattedSalePrice;
        }

        var miniCartLineItem = "\n                <li class=\"dr-minicart-item clearfix\">\n                    <div class=\"dr-minicart-item-thumbnail\">\n                        <img src=\"".concat(li.product.thumbnailImage, "\" alt=\"").concat(li.product.displayName, "\" />\n                    </div>\n                    <div class=\"dr-minicart-item-info\" data-product-id=\"").concat(productId, "\">\n                        <span class=\"dr-minicart-item-title\">").concat(li.product.displayName, "</span>\n                        <span class=\"dr-minicart-item-qty\">Qty.").concat(li.quantity, "</span>\n                        <p class=\"dr-pd-price dr-minicart-item-price\">").concat(priceContent, "</p>\n                    </div>\n                    <a href=\"#\" class=\"dr-minicart-item-remove-btn\" aria-label=\"Remove\" data-line-item-id=\"").concat(li.id, "\">Remove</a>\n                </li>");
        miniCartLineItems += miniCartLineItem;
      });
      miniCartLineItems += '</ul>';
      $body.append(miniCartLineItems, miniCartSubtotal);
      $footer.append(miniCartViewCartBtn, miniCartCheckoutBtn);
      $display.append($body, $footer);
    }
  }

  $('.promo-code-toggle').click(function () {
    $('.promo-code-wrapper').toggle();
  });
  $('#apply-promo-code-btn').click(function (e) {
    var promoCode = $('#promo-code').val();

    if (!promoCode) {
      $('#dr-promo-code-err-field').text('Please enter a valid promo code.').show();
      return;
    }

    $(e.target).addClass('sending').blur();
    updateCart({
      promoCode: promoCode
    }).then(function () {
      $(e.target).removeClass('sending');
      $('#dr-promo-code-err-field').text('').hide();
      fetchFreshCart();
    }).catch(function (jqXHR) {
      $(e.target).removeClass('sending');

      if (jqXHR.responseJSON.errors) {
        var errMsgs = jqXHR.responseJSON.errors.error.map(function (err) {
          return err.description;
        });
        $('#dr-promo-code-err-field').html(errMsgs.join('<br/>')).show();
      }
    });
  });
  $('#promo-code').keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $('#apply-promo-code-btn').trigger('click');
    }
  });
  /*init cart via JS*/

  if ($("#dr-cart-page-wrapper").length > 0) {
    fetchFreshCart();
  }
});
"use strict";

jQuery(document).ready(function ($) {
  if ($('#checkout-payment-form').length) {
    var getAddress = function getAddress(addressType) {
      var address = {
        address: {
          nickName: $('#' + addressType + '-field-address1').val(),
          firstName: $('#' + addressType + '-field-first-name').val(),
          lastName: $('#' + addressType + '-field-last-name').val(),
          line1: $('#' + addressType + '-field-address1').val(),
          line2: $('#' + addressType + '-field-address2').val(),
          city: $('#' + addressType + '-field-city').val(),
          countrySubdivision: $('#' + addressType + '-field-state').val(),
          postalCode: $('#' + addressType + '-field-zip').val(),
          countryName: $('#' + addressType + '-field-country :selected').text(),
          country: $('#' + addressType + '-field-country :selected').val(),
          phoneNumber: $('#' + addressType + '-field-phone').val()
        }
      };
      return address;
    };

    var saveShippingAddress = function saveShippingAddress() {
      var address = getAddress('shipping');
      address.address.isDefault = true;
      saveShopperAddress(JSON.stringify(address));
    };

    var saveBillingAddress = function saveBillingAddress() {
      var address = getAddress('billing');
      address.address.isDefault = false;
      saveShopperAddress(JSON.stringify(address));
    };

    var saveShopperAddress = function saveShopperAddress(address) {
      $.ajax({
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer ".concat(drgc_params.accessToken)
        },
        data: address,
        url: "".concat(apiBaseUrl, "/me/addresses"),
        success: function success() {
          console.log('address update success.');
        },
        error: function error(jqXHR) {
          console.log(jqXHR);
        }
      });
    }; //floating labels


    var prepareAddress = function prepareAddress($form) {
      var addressType = $form.attr('id') === 'checkout-shipping-form' ? 'shipping' : 'billing'; // Validate form

      $form.addClass('was-validated');
      $form.find('.dr-err-field').hide();
      var validateItems = document.querySelectorAll("[name^=".concat(addressType, "-]"));

      for (var i = 0, len = validateItems.length; i < len; i++) {
        if ($(validateItems[i]).is(':visible') && validateItems[i].checkValidity() === false) {
          return false;
        }
      } // Build payload


      $.each($form.serializeArray(), function (index, obj) {
        var key = obj.name.split('-')[1];
        payload[addressType][key] = obj.value;
      });
      payload[addressType].emailAddress = emailPayload;

      if (payload[addressType].country !== 'US') {
        payload[addressType].countrySubdivision = '';
      }

      return true;
    };

    var updateCart = function updateCart() {
      var queryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cartRequest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var queryStr = $.param(queryParams);
      return new Promise(function (resolve, reject) {
        $.ajax({
          type: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer ".concat(drgc_params.accessToken)
          },
          url: "".concat(apiBaseUrl, "/me/carts/active?").concat(queryStr),
          data: JSON.stringify({
            cart: cartRequest
          })
        }).done(function (data) {
          resolve(data);
        }).fail(function (jqXHR) {
          reject(jqXHR);
        });
      });
    };

    var displaySavedAddress = function displaySavedAddress(addressObj, $target) {
      var addressArr = ["".concat(addressObj.firstName, " ").concat(addressObj.lastName), addressObj.line1, addressObj.city, addressObj.country];
      $target.text(addressArr.join(', '));
    };

    var displayAddressErrMsg = function displayAddressErrMsg(jqXHR, $target) {
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
    };

    var moveToNextSection = function moveToNextSection($section) {
      var $prevSection = $section.prev();
      var $nextSection = $section.next();

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
    };

    var updateSummaryPricing = function updateSummaryPricing(cart) {
      var _cart$pricing = cart.pricing,
          formattedOrderTotal = _cart$pricing.formattedOrderTotal,
          formattedTax = _cart$pricing.formattedTax;

      if (Object.keys(cart.shippingMethod).length > 0) {
        var formattedShippingAndHandling = cart.pricing.shippingAndHandling.value === 0 ? 'FREE' : cart.pricing.formattedShippingAndHandling;
        $('div.dr-summary__shipping > .item-value').text(formattedShippingAndHandling);
      }

      $('div.dr-summary__tax > .item-value').text(formattedTax);
      $('div.dr-summary__total > .total-value').text(formattedOrderTotal);
    };

    var adjustColumns = function adjustColumns($section) {
      var $shippingSection = $('.dr-checkout__shipping');
      var $billingSection = $('.dr-checkout__billing');
      var $paymentSection = $('.dr-checkout__payment');
      var $confirmSection = $('.dr-checkout__confirmation');

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
    };

    var updateTaxLabel = function updateTaxLabel() {
      if ($('.dr-checkout__el.active').hasClass('dr-checkout__payment') || $('.dr-checkout__el.active').hasClass('dr-checkout__confirmation')) {
        $('.dr-summary__tax > .item-label').text('Tax');
      } else {
        $('.dr-summary__tax > .item-label').text('Estimated Tax');
      }
    };

    var setShippingOptions = function setShippingOptions(cart) {
      var freeShipping = cart.pricing.shippingAndHandling.value === 0;
      var shippingOptionId = cart.shippingMethod.code;
      $.each(cart.shippingOptions.shippingOption, function (index, option) {
        if ($('#shipping-option-' + option.id).length) return;
        var html = "\n                    <div class=\"field-radio\">\n                        <input type=\"radio\"\n                            name=\"selector\"\n                            id=\"shipping-option-".concat(option.id, "\"\n                            data-cost=\"").concat(option.formattedCost, "\"\n                            data-id=\"").concat(option.id, "\"\n                            data-desc=\"").concat(option.description, "\"\n                            >\n                        <label for=\"shipping-option-").concat(option.id, "\">\n                            <span>\n                                ").concat(option.description, "\n                            </span>\n                            <span class=\"black\">\n                                ").concat(freeShipping ? 'FREE' : option.formattedCost, "\n                            </span>\n                            <span class=\"smoller\">\n                                Estimated Arrival:\n                            </span>\n                            <span class=\"black\">\n                                Apr 08 - Apr 11\n                            </span>\n                        </label>\n                    </div>\n                ");
        $('form#checkout-delivery-form .dr-panel-edit__el').append(html);
      });
      $('form#checkout-delivery-form').children().find('input:radio[data-id="' + shippingOptionId + '"]').prop("checked", true);
    };

    var applyShippingOption = function applyShippingOption() {
      var shippingOptionId = $('form#checkout-delivery-form').children().find('input:radio:checked').first().data('id');
      applyShippingAndUpdateCart(shippingOptionId);
    }; // Submit delivery form


    var applyShippingAndUpdateCart = function applyShippingAndUpdateCart(shippingOptionId) {
      var data = {
        expand: 'all',
        shippingOptionId: shippingOptionId
      };
      $.ajax({
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer ".concat(drgc_params.accessToken)
        },
        url: "".concat(apiBaseUrl, "/me/carts/active/apply-shipping-option?").concat($.param(data)),
        success: function success(data) {
          updateSummaryPricing(data.cart);
        },
        error: function error(jqXHR) {
          console.log(jqXHR);
        }
      });
    }; // Initial state for payPal


    var applyPaymentToCart = function applyPaymentToCart(id) {
      if (!id) return;
      var data = {
        'paymentMethod': {
          'sourceId': id
        }
      };
      $.ajax({
        type: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer ".concat(drgc_params.accessToken)
        },
        url: "".concat(apiBaseUrl, "/me/carts/active/apply-payment-method?expand=all"),
        data: JSON.stringify(data),
        success: function success() {
          submitCart();
        },
        error: function error(jqXHR) {
          $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
          $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
          $('body').css({
            'pointer-events': 'auto',
            'opacity': 1
          });
        }
      });
    };

    var submitCart = function submitCart() {
      $.ajax({
        type: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer ".concat(drgc_params.accessToken)
        },
        url: "".concat(apiBaseUrl, "/me/carts/active/submit-cart?expand=all"),
        success: function success(data) {
          window.location.replace("".concat(drgc_params.thankYouEndpoint, "?order=").concat(data.submitCart.order.id));
        },
        error: function error(jqXHR) {
          $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
          $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
          $('body').css({
            'pointer-events': 'auto',
            'opacity': 1
          });
        }
      });
    }; // check billing info


    var domain = drgc_params.domain;
    var isLogin = drgc_params.isLogin;
    var apiBaseUrl = 'https://' + domain + '/v1/shoppers';
    var drLocale = drgc_params.drLocale || 'en_US';
    FloatLabel.init(); // Globals

    var digitalriverjs = new DigitalRiver(drgc_params.digitalRiverKey);
    var payload = {
      shipping: {},
      billing: {}
    };
    var paymentPayload = {};
    var paymentSourceId = null; // Section progress

    var finishedSectionIdx = -1; // Submit first (email) form

    var emailPayload; // Create elements through DR.js

    if ($('.credit-card-section').length) {
      var getStyleOptionsFromClass = function getStyleOptionsFromClass(className) {
        var tempDiv = document.createElement('div');
        tempDiv.setAttribute('id', 'tempDiv' + className);
        tempDiv.className = className;
        document.body.appendChild(tempDiv);
        var tempDivEl = document.getElementById('tempDiv' + className);
        var tempStyle = window.getComputedStyle(tempDivEl);
        var styles = {
          color: tempStyle.color,
          fontFamily: tempStyle.fontFamily.replace(new RegExp('"', 'g'), ''),
          fontSize: tempStyle.fontSize,
          height: tempStyle.height
        };
        document.body.removeChild(tempDivEl);
        return styles;
      };

      var activeCardLogo = function activeCardLogo(evt) {
        $('.cards .active').removeClass('active');

        if (evt.brand && evt.brand !== 'unknown') {
          $(".cards .".concat(evt.brand, "-icon")).addClass('active');
        }
      };

      var displayDRElementError = function displayDRElementError(evt, $target) {
        if (evt.error) {
          $target.text(evt.error.message).show();
        } else {
          $target.text('').hide();
        }
      };

      var options = {
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
      cardNumber.on('change', function (evt) {
        activeCardLogo(evt);
        displayDRElementError(evt, $('#card-number-error'));
      });
      cardExpiration.on('change', function (evt) {
        displayDRElementError(evt, $('#card-expiration-error'));
      });
      cardCVV.on('change', function (evt) {
        displayDRElementError(evt, $('#card-cvv-error'));
      });
    }

    $('#checkout-email-form').on('submit', function (e) {
      e.preventDefault(); // If no items are in cart, do not even continue, maybe give feedback

      if (!drgc_params.cart.cart.lineItems.hasOwnProperty('lineItem')) return;
      var $form = $('#checkout-email-form');
      var email = $form.find('input[name=email]').val().trim();
      $form.addClass('was-validated');

      if ($form[0].checkValidity() === false) {
        return false;
      }

      emailPayload = email;
      var $section = $('.dr-checkout__email');
      $section.find('.dr-panel-result__text').text(emailPayload);
      moveToNextSection($section);
    });

    if ($('input[name=email]').val() && $('#checkout-email-form').length) {
      $('#checkout-email-form').submit();
    } // Submit shipping info form


    $('#checkout-shipping-form').on('submit', function (e) {
      e.preventDefault();
      var $form = $(e.target);
      var $button = $form.find('button[type="submit"]');
      var isFormValid = prepareAddress($form);
      if (!isFormValid) return;
      $button.addClass('sending').blur();
      updateCart({
        expand: 'all'
      }, {
        shippingAddress: payload.shipping
      }).then(function (data) {
        if (isLogin == 'true') saveShippingAddress();
        $button.removeClass('sending').blur();
        setShippingOptions(data.cart);
        var $section = $('.dr-checkout__shipping');
        displaySavedAddress(data.cart.shippingAddress, $section.find('.dr-panel-result__text'));
        moveToNextSection($section);
        updateSummaryPricing(data.cart);
      }).catch(function (jqXHR) {
        $button.removeClass('sending').blur();
        displayAddressErrMsg(jqXHR, $form.find('.dr-err-field'));
      });
    });
    $('#checkout-billing-form').on('submit', function (e) {
      e.preventDefault();
      var $form = $(e.target);
      var $button = $form.find('button[type="submit"]');
      var billingSameAsShipping = $('[name="checkbox-billing"]').is(':visible:checked');
      var isFormValid = prepareAddress($form);
      var requestShipping = $('.dr-checkout__shipping').length ? true : false;
      if (!isFormValid) return;
      if (billingSameAsShipping) payload.billing = Object.assign({}, payload.shipping);
      $button.addClass('sending').blur();
      updateCart({
        expand: 'all'
      }, {
        billingAddress: payload.billing
      }).then(function (data) {
        if (isLogin == 'true') {
          if (requestShipping && !billingSameAsShipping || !requestShipping) {
            saveBillingAddress();
          }
        }

        $button.removeClass('sending').blur();
        var $section = $('.dr-checkout__billing');
        displaySavedAddress(data.cart.billingAddress, $section.find('.dr-panel-result__text'));
        moveToNextSection($section);
        updateSummaryPricing(data.cart);
      }).catch(function (jqXHR) {
        $button.removeClass('sending').blur();
        displayAddressErrMsg(jqXHR, $form.find('.dr-err-field'));
      });
    });
    $('form#checkout-delivery-form').on('submit', function (e) {
      e.preventDefault();
      var $input = $(this).children().find('input:radio:checked').first();
      var button = $(this).find('button[type="submit"]').toggleClass('sending').blur(); // Validate shipping option

      var data = {
        expand: 'all',
        shippingOptionId: $input.data('id')
      };
      $.ajax({
        type: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer ".concat(drgc_params.accessToken)
        },
        url: "".concat(apiBaseUrl, "/me/carts/active/apply-shipping-option?").concat($.param(data)),
        success: function success(data) {
          button.removeClass('sending').blur();
          var $section = $('.dr-checkout__delivery');
          var freeShipping = data.cart.pricing.shippingAndHandling.value === 0;
          var resultText = "".concat($input.data('desc'), " ").concat(freeShipping ? 'FREE' : $input.data('cost'));
          $section.find('.dr-panel-result__text').text(resultText);
          moveToNextSection($section);
          updateSummaryPricing(data.cart);
        },
        error: function error(jqXHR) {
          console.log(jqXHR);
        }
      });
    });
    $('form#checkout-delivery-form').on('change', 'input[type="radio"]', function () {
      applyShippingOption();
    });
    $('form#checkout-payment-form').on('submit', function (e) {
      e.preventDefault();
      var $form = $('form#checkout-payment-form');
      var $button = $form.find('button[type="submit"]');
      $form.addClass('was-validated');

      if ($form[0].checkValidity() === false) {
        return false;
      }

      var formdata = $(this).serializeArray();
      paymentPayload = {};
      $(formdata).each(function (index, obj) {
        paymentPayload[obj.name] = obj.value;
      });
      $('#dr-payment-failed-msg, #dr-checkout-err-field').text('').hide();
      var $section = $('.dr-checkout__payment');

      if (paymentPayload.selector === 'credit-card') {
        var cart = drgc_params.cart.cart;
        var creditCardPayload = {
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
        digitalriverjs.createSource(cardNumber, creditCardPayload).then(function (result) {
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
              $section.find('.dr-panel-result__text').text("Credit card ending in ".concat(result.source.creditCard.lastFourDigits));
              moveToNextSection($section);
            }
          }
        });
      }
    });
    $('form#checkout-confirmation-form').on('submit', function (e) {
      e.preventDefault();
      $(this).find('button[type="submit"]').toggleClass('sending').blur();
      $('#dr-payment-failed-msg').hide();
      applyPaymentToCart(paymentSourceId);
    });

    if (drgc_params.payPal.sourceId) {
      $('.dr-checkout').children().addClass('closed');
      $('.dr-checkout').children().removeClass('active');
      $('.dr-checkout__payment').removeClass('closed').addClass('active');

      if (drgc_params.payPal.failure == 'true') {// TODO: Display Error on paypal form maybe
      }

      if (drgc_params.payPal.success == 'true') {
        applyPaymentToCart(drgc_params.payPal.sourceId);
      }
    }

    $('[name="checkbox-billing"]').on('click', function (ev) {
      var $this = $(this);

      if (!$this.is(':checked')) {
        $('.billing-section').css('display', 'block');
      } else {
        $('.billing-section').css('display', 'none');
      }
    }); // show and hide sections

    $('.dr-accordion__edit').on('click', function (e) {
      e.preventDefault();
      var $section = $(e.target).parent().parent();
      var $allSections = $section.siblings().andSelf();
      var $finishedSections = $allSections.eq(finishedSectionIdx).prevAll().andSelf();
      var $activeSection = $allSections.filter($('.active'));
      var $nextSection = $section.next();
      var $prevSection = $section.prev();

      if ($allSections.index($section) > $allSections.index($activeSection)) {
        return;
      }

      $finishedSections.addClass('closed');
      $activeSection.removeClass('active');
      $section.removeClass('closed').addClass('active');
      adjustColumns();
      updateTaxLabel();
    });

    if ($('#radio-credit-card').is(':checked')) {
      $('.credit-card-info').show();
    }

    $('input:radio[name="selector"]').on('change', function () {
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
    $('#shipping-field-country').on('change', function () {
      if (this.value === 'US') {
        $('#shipping-field-state').parent('.form-group').removeClass('d-none');
      } else {
        $('#shipping-field-state').parent('.form-group').addClass('d-none');
      }
    });
    $('#billing-field-country').on('change', function () {
      if (this.value === 'US') {
        $('#billing-field-state').parent('.form-group').removeClass('d-none');
      } else {
        $('#billing-field-state').parent('.form-group').addClass('d-none');
      }
    });

    if ($('#dr-paypal-button').length) {
      // need to get the actual height of the wrapper for rendering the PayPal button
      $('#checkout-payment-form').removeClass('dr-panel-edit').css('visibility', 'hidden');
      paypal.Button.render({
        env: domain.indexOf('test') === -1 ? 'production' : 'sandbox',
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
        onEnter: function onEnter() {
          $('#checkout-payment-form').addClass('dr-panel-edit').css('visibility', 'visible');
          $('#dr-paypal-button').hide();
        },
        payment: function payment() {
          var cart = drgc_params.cart.cart;
          var requestShipping = $('.dr-checkout__shipping').length ? true : false;
          var payPalItems = [];
          $.each(cart.lineItems.lineItem, function (index, item) {
            payPalItems.push({
              'name': item.product.name,
              'quantity': item.quantity,
              'unitAmount': item.pricing.listPrice.value
            });
          });
          var payPalPayload = {
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
              'recipient': "".concat(cart.shippingAddress.firstName, " ").concat(cart.shippingAddress.lastName, " "),
              'phoneNumber': cart.shippingAddress.phoneNumber,
              'address': {
                'line1': cart.shippingAddress.line1,
                'line2': cart.shippingAddress.line2,
                'city': cart.shippingAddress.city,
                'state': cart.shippingAddress.state,
                'country': cart.shippingAddress.country,
                'postalCode': cart.shippingAddress.postalCode
              }
            };
          }

          return digitalriverjs.createSource(payPalPayload).then(function (result) {
            if (result.error) {
              $('#dr-payment-failed-msg').text(result.error.errors[0].message).show();
            } else {
              sessionStorage.setItem('paymentSourceId', result.source.id);
              return result.source.payPal.token;
            }
          });
        },
        onAuthorize: function onAuthorize() {
          var sourceId = sessionStorage.getItem('paymentSourceId');
          $('body').css({
            'pointer-events': 'none',
            'opacity': 0.5
          });
          applyPaymentToCart(sourceId);
        }
      }, '#dr-paypal-button');
    }
  }
});
"use strict";

/* global drgc_params, iFrameResize */

/* eslint-disable no-alert, no-console */
jQuery(document).ready(function ($) {
  var ajaxUrl = drgc_params.ajaxUrl;
  $('#dr_login_form').on('submit', function (e) {
    e.preventDefault();
    var $form = $('#dr_login_form');
    $form.addClass('was-validated');

    if ($form.data('processing')) {
      return false;
    }

    if ($form[0].checkValidity() === false) {
      return false;
    }

    var but = $form.find('[type="submit"]').toggleClass('sending').blur();
    $form.data('processing', true);
    $('.dr-form-error-msg').text('');
    var data = {
      'action': 'drgc_login',
      'username': $(".dr-login-form input[name='username']").val(),
      'password': $(".dr-login-form input[name='password']").val()
    };
    $.post(ajaxUrl, data, function (response) {
      if (response.success) {
        location.reload();
      } else {
        $form.data('processing', false);
        but.removeClass('sending').blur();

        if (response.data.hasOwnProperty('error_description')) {
          $('.dr-form-error-msg').text(response.data.error_description);
        }

        if (Object.prototype.toString.call(response.data) == '[object String]') {
          $('.dr-form-error-msg').text(response.data);
        }

        $('.dr-form-error-msg').css('color', 'red');
      }
    });
  });
  $('.drgc-wrapper').on('click', '.dr-logout', function (e) {
    e.preventDefault();

    if ($(this).data('processing')) {
      return;
    }

    var but = $(this).toggleClass('sending').blur();
    $(this).data('processing', true);
    var data = {
      'action': 'drgc_logout'
    };
    $.post(ajaxUrl, data, function (response) {
      location.reload();
    });
  });
  $('#dr_login_form, #dr-signup-form, #dr-pass-reset-form, #checkout-email-form').find('input[type=email]').on('change', function (e) {
    var elem = e.target;

    if (elem.validity.valueMissing) {
      $(elem).next('.invalid-feedback').text('This field is required.');
    } else if (elem.validity.typeMismatch) {
      $(elem).next('.invalid-feedback').text('Please enter a valid email address.');
    }
  });
  $('.dr-signup').on('click', '', function (e) {
    e.preventDefault();
    var $form = $('.dr-signup-form');
    $form.addClass('was-validated');

    if ($form.data('processing')) {
      return false;
    }

    if ($form[0].checkValidity() === false) {
      return false;
    }

    var but = $(this).toggleClass('sending').blur();
    $form.data('processing', true);
    $('.dr-signin-form-error').text('');
    var data = {
      action: 'drgc_signup',
      first_name: $('.dr-signup-form input[name=first_name]').val(),
      last_name: $('.dr-signup-form input[name=last_name]').val(),
      username: $('.dr-signup-form input[name=uemail]').val(),
      password: $('.dr-signup-form input[name=upw]').val()
    };
    $.post(ajaxUrl, data, function (response) {
      if (response.success) {
        location.reload();
      } else {
        $form.data('processing', false);
        but.removeClass('sending').blur();

        if (response.data && response.data.errors && response.data.errors.error[0].hasOwnProperty('description')) {
          $('.dr-signin-form-error').text(response.data.errors.error[0].description);
        } else if (Object.prototype.toString.call(response.data) == '[object String]') {
          $('.dr-signin-form-error').text(response.data);
        } else {
          $('.dr-signin-form-error').text('Something went wrong.');
        }

        $('.dr-signin-form-error').css('color', 'red');
      }
    });
  });
  $('#dr-pass-reset-submit').on('click', function (e) {
    var $errMsg = $('#dr-reset-pass-error').text('').hide();
    var $form = $('form#dr-pass-reset-form');
    $form.addClass('was-validated');

    if ($form[0].checkValidity() === false) {
      return false;
    }

    var $button = $(this).toggleClass('sending').blur().removeClass('btn');
    var data = {
      'action': 'drgc_pass_reset_request'
    };
    $.each($form.serializeArray(), function (index, obj) {
      data[obj.name] = obj.value;
    });

    if (data['email'] !== data['email-confirm']) {
      $errMsg.text('Emails do not match').show();
      $button.removeClass('sending').blur();
      return;
    }

    $.post(ajaxUrl, data, function (response) {
      if (!response.success) {
        $errMsg.text(response.data[0].message).show();
      } else {
        $('#drResetPasswordModalBody').html('').html("\n                    <h3>Password reset email sent</h3>\n                    <p>You will be receiving an email\n                    soon with instructions on resetting your\n                    login password</p>\n                ");
        $('#dr-pass-reset-submit').hide();
      }

      $button.removeClass('sending').blur();
    });
  });
  $('form.dr-confirm-password-reset-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $errMsg = $('.dr-form-error-msg', this).text('').hide();
    $form.addClass('was-validated');

    if ($form[0].checkValidity() === false) {
      return false;
    }

    var $button = $('button[type=submit]', this).toggleClass('sending').blur().removeClass('btn');
    var searchParams = new URLSearchParams(window.location.search);

    if (!searchParams.get('key') || !searchParams.get('login')) {
      $errMsg.text('Something went wrong').show();
    }

    var data = {
      'action': 'drgc_reset_password',
      'key': searchParams.get('key'),
      'login': searchParams.get('login')
    };
    $.each($form.serializeArray(), function (index, obj) {
      data[obj.name] = obj.value;
    });

    if (data['password'] !== data['confirm-password']) {
      $errMsg.text('Passwords do not match').show();
      $button.removeClass('sending').blur();
      return;
    }

    $.post(ajaxUrl, data, function (response) {
      if (!response.success) {
        $errMsg.text(response.data).show();
      } else {
        $('section.reset-password').html('').html("\n                    <h3>Password saved</h3>\n                    <p>You can now log in with your new password</p>\n                ").css('color', 'green');
        setTimeout(function () {
          return location.replace("".concat(location.origin).concat(location.pathname));
        }, 2000);
      }

      $button.removeClass('sending').blur();
    });
  });

  if ($('section.logged-in').length) {
    toggleCartBtns();
  }

  function toggleCartBtns() {
    if ($('section.dr-login-sections__section.logged-in').length && !drgc_params.cart.cart.lineItems.hasOwnProperty('lineItem')) {
      $('section.dr-login-sections__section.logged-in > div').hide();
    }
  }
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* global drgc_params, iFrameResize */

/* eslint-disable no-alert, no-console */
jQuery(document).ready(function ($) {
  var DRService =
  /*#__PURE__*/
  function () {
    function DRService() {
      _classCallCheck(this, DRService);

      this.siteID = drgc_params.siteID;
      this.apiKey = drgc_params.apiKey;
      this.domain = drgc_params.domain;
      this.sessionToken = null;
      this.apiBaseUrl = 'https://' + this.domain + '/v1/shoppers';
      this.drLocale = drgc_params.drLocale || 'en_US';
    }

    _createClass(DRService, [{
      key: "updateShopper",
      value: function updateShopper() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'POST',
            headers: {
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: "".concat(_this.apiBaseUrl, "/me?locale=").concat(_this.drLocale),
            success: function success(data) {
              resolve(data);
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }, {
      key: "getCart",
      value: function getCart() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: "".concat(_this2.apiBaseUrl, "/me/carts/active"),
            success: function success(data) {
              resolve(data.cart);
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }, {
      key: "updateCart",
      value: function updateCart(productID, quantity) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: function () {
              var url = "".concat(_this3.apiBaseUrl, "/me/carts/active?productId=").concat(productID);
              if (quantity) url += "&quantity=".concat(quantity);
              if (drgc_params.testOrder == "true") url += '&testOrder=true';
              return url;
            }(),
            success: function success(data) {
              resolve(data.cart);
              openMiniCartDisplay();
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }, {
      key: "removeLineItem",
      value: function removeLineItem(lineItemID) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'DELETE',
            headers: {
              Accept: 'application/json',
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: "".concat(_this4.apiBaseUrl, "/me/carts/active/line-items/").concat(lineItemID),
            success: function success() {
              resolve();
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }, {
      key: "getOffersByPoP",
      value: function getOffersByPoP(popName) {
        var _this5 = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'GET',
            headers: {
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: "".concat(_this5.apiBaseUrl, "/me/point-of-promotions/SiteMerchandising_").concat(popName, "/offers?format=json&expand=all"),
            success: function success(data) {
              resolve(data);
              console.log('getOffers', data);
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }, {
      key: "getProductPricing",
      value: function getProductPricing(productID) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'GET',
            headers: {
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: "".concat(_this6.apiBaseUrl, "/me/products/").concat(productID, "/pricing?format=json&expand=all"),
            success: function success(data) {
              resolve(data);
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }, {
      key: "getProductInventoryStatus",
      value: function getProductInventoryStatus(productID) {
        var _this7 = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'GET',
            headers: {
              Authorization: "Bearer ".concat(drgc_params.accessToken)
            },
            url: "".concat(_this7.apiBaseUrl, "/me/products/").concat(productID, "/inventory-status?format=json&expand=all"),
            success: function success(data) {
              resolve(data);
              console.log('getProductInventoryStatus', data);
            },
            error: function error(jqXHR) {
              reject(jqXHR);
            }
          });
        });
      }
    }]);

    return DRService;
  }();

  var drService = new DRService();
  var lineItems = [];

  function toggleMiniCartDisplay() {
    var $miniCartDisplay = $('.dr-minicart-display');

    if ($miniCartDisplay.is(':visible')) {
      $miniCartDisplay.fadeOut(200);
    } else {
      $miniCartDisplay.fadeIn(200);
    }
  }

  function openMiniCartDisplay() {
    var $miniCartDisplay = $('.dr-minicart-display');

    if (!$miniCartDisplay.is(':visible')) {
      $miniCartDisplay.fadeIn(200);
    }
  }

  function displayMiniCart(cart) {
    var $display = $('.dr-minicart-display');
    var $body = $('<div class="dr-minicart-body"></div>');
    var $footer = $('<div class="dr-minicart-footer"></div>');
    lineItems = cart.lineItems && cart.lineItems.lineItem ? cart.lineItems.lineItem : [];
    $('.dr-minicart-count').text(cart.totalItemsInCart);
    $('.dr-minicart-header').siblings().remove();

    if ($('section.dr-login-sections__section.logged-in').length && cart.totalItemsInCart == 0) {
      $('section.dr-login-sections__section.logged-in > div').hide();
    }

    if (!lineItems.length) {
      var emptyMsg = '<p class="dr-minicart-empty-msg">Your shopping cart is currently empty.</p>';
      $body.append(emptyMsg);
      $display.append($body);
    } else {
      var miniCartLineItems = '<ul class="dr-minicart-list">';
      var miniCartSubtotal = "<p class=\"dr-minicart-subtotal\"><label>Sub-Total</label><span>".concat(cart.pricing.formattedSubtotal, "</span></p>");
      var miniCartViewCartBtn = "<a class=\"dr-btn\" id=\"dr-minicart-view-cart-btn\" href=\"".concat(drgc_params.cartUrl, "\">View Cart</a>");
      var miniCartCheckoutBtn = "<a class=\"dr-btn\" id=\"dr-minicart-checkout-btn\" href=\"".concat(drgc_params.checkoutUrl, "\">Checkout</a>");
      lineItems.forEach(function (li) {
        var productId = li.product.uri.replace("".concat(drService.apiBaseUrl, "/me/products/"), '');
        var listPrice = Number(li.pricing.listPriceWithQuantity.value);
        var salePrice = Number(li.pricing.salePriceWithQuantity.value);
        var formattedSalePrice = li.pricing.formattedSalePriceWithQuantity;
        var priceContent = '';

        if (listPrice > salePrice) {
          priceContent = "<del class=\"dr-strike-price\">".concat(listPrice, "</del><span class=\"dr-sale-price\">").concat(formattedSalePrice, "</span>");
        } else {
          priceContent = formattedSalePrice;
        }

        var miniCartLineItem = "\n                <li class=\"dr-minicart-item clearfix\">\n                    <div class=\"dr-minicart-item-thumbnail\">\n                        <img src=\"".concat(li.product.thumbnailImage, "\" alt=\"").concat(li.product.displayName, "\" />\n                    </div>\n                    <div class=\"dr-minicart-item-info\" data-product-id=\"").concat(productId, "\">\n                        <span class=\"dr-minicart-item-title\">").concat(li.product.displayName, "</span>\n                        <span class=\"dr-minicart-item-qty\">Qty.").concat(li.quantity, "</span>\n                        <p class=\"dr-pd-price dr-minicart-item-price\">").concat(priceContent, "</p>\n                    </div>\n                    <a href=\"#\" class=\"dr-minicart-item-remove-btn\" aria-label=\"Remove\" data-line-item-id=\"").concat(li.id, "\">Remove</a>\n                </li>");
        miniCartLineItems += miniCartLineItem;
      });
      miniCartLineItems += '</ul>';
      $body.append(miniCartLineItems, miniCartSubtotal);
      $footer.append(miniCartViewCartBtn, miniCartCheckoutBtn);
      $display.append($body, $footer);
    }
  }

  function displayPrice(priceObj, isInLoop) {
    var listPrice = Number(priceObj.listPriceWithQuantity.value);
    var salePrice = Number(priceObj.salePriceWithQuantity.value);
    var formattedSalePrice = priceObj.formattedSalePriceWithQuantity;
    var priceClass = isInLoop ? 'dr-pd-price dr-pd-item-price' : 'dr-pd-price';
    var priceContent = '';

    if (listPrice > salePrice) {
      priceContent = "<p class=\"".concat(priceClass, "\"><del class=\"dr-strike-price\">").concat(listPrice, "</del><span class=\"dr-sale-price\">").concat(formattedSalePrice, "</span></p>");
    } else {
      priceContent = "<p class=\"".concat(priceClass, "\">").concat(formattedSalePrice, "</p>");
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

  $.fn.appendLoadingIcon = function () {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'sm';
    var gap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
    var loader = "<div class=\"dr-loader-container\"><div class=\"dr-loader dr-loader-".concat(size, "\" style=\"margin: ").concat(gap, " auto;\">Loading...</div></div>");
    this.append(loader);
  };

  $.fn.removeLoadingIcon = function () {
    this.find('.dr-loader-container').remove();
  };

  (function () {
    if ($('#dr-minicart'.length)) {
      displayMiniCart(drgc_params.cart.cart);
    }
  })();

  $('.dr-minicart-toggle, .dr-minicart-close-btn').click(function (e) {
    e.preventDefault();
    toggleMiniCartDisplay();
  });
  $('body').on('click', '.dr-buy-btn', function (e) {
    e.preventDefault();
    var quantity = 1;
    var $this = $(e.target);
    var productID = $this.attr('data-product-id') ? $this.attr('data-product-id').toString() : '';
    var existingProducts = lineItems.map(function (li) {
      var uri = li.product.uri;
      var id = uri.replace("".concat(drService.apiBaseUrl, "/me/products/"), '');
      return {
        id: id,
        quantity: li.quantity
      };
    }); // PD page

    if ($('#dr-pd-offers').length) {
      quantity = parseInt($('#dr-pd-qty').val(), 10);
    }

    existingProducts.forEach(function (pd) {
      if (pd.id === productID) {
        quantity += pd.quantity;
      }
    });
    drService.updateCart(productID, quantity).then(function (cart) {
      return displayMiniCart(cart);
    }).catch(function (jqXHR) {
      return errorCallback(jqXHR);
    });
  });
  $('.dr-minicart-display').on('click', '.dr-minicart-item-remove-btn', function (e) {
    e.preventDefault();
    var lineItemID = $(e.target).data('line-item-id');
    drService.removeLineItem(lineItemID).then(function () {
      return drService.getCart();
    }).then(function (cart) {
      return displayMiniCart(cart);
    }).catch(function (jqXHR) {
      return errorCallback(jqXHR);
    });
  });
  $('span.dr-pd-qty-plus, span.dr-pd-qty-minus').on('click', function (e) {
    // Get current quantity values
    var $qty = $('#dr-pd-qty');
    var val = parseInt($qty.val(), 10);
    var max = parseInt($qty.attr('max'), 10);
    var min = parseInt($qty.attr('min'), 10);
    var step = parseInt($qty.attr('step'), 10);

    if (val) {
      // Change the value if plus or minus
      if ($(e.currentTarget).is('.dr-pd-qty-plus')) {
        if (max && max <= val) {
          $qty.val(max);
        } else {
          $qty.val(val + step);
        }
      } else if ($(e.currentTarget).is('.dr-pd-qty-minus')) {
        if (min && min >= val) {
          $qty.val(min);
        } else if (val > 1) {
          $qty.val(val - step);
        }
      }
    } else {
      $qty.val('1');
    }
  });
  $('.dr_prod-variations select').on('change', function (e) {
    e.preventDefault();
    var varId = $(this).val();
    var price = $(this).children("option:selected").data('price');
    var regularPrice = $(this).children("option:selected").data('regular-price');
    var salePriceValue = $(this).children("option:selected").data('sale-price-value');
    var listPriceValue = $(this).children("option:selected").data('list-price-value');
    var $prodPrice = $('.single-dr_product .dr-pd-content .dr-pd-price');
    var $buyBtn = $('.dr-buy-btn');
    var prodPriceHtml = "";
    $buyBtn.attr('data-product-id', varId);
    if (listPriceValue > salePriceValue) prodPriceHtml = '<del class="dr-strike-price">' + regularPrice + '</del>';
    prodPriceHtml += '<strong>' + price + '</strong>';
    $prodPrice.html(prodPriceHtml);
  });
  $("iframe[name^='controller-']").css('display', 'none');
});
"use strict";

jQuery(document).ready(function ($) {
  if ($('.dr-thank-you-wrapper').length) {
    $(document).on('click', '#print-button', function () {
      var printContents = $('.dr-thank-you-wrapper').html();
      var originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    });
  }
});
"use strict";

(function (w) {
  w.URLSearchParams = w.URLSearchParams || function (searchString) {
    var self = this;
    self.searchString = searchString;

    self.get = function (name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);

      if (results == null) {
        return null;
      } else {
        return decodeURI(results[1]) || 0;
      }
    };
  };
})(window);

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};