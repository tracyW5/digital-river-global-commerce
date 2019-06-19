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

/* global drExpressOptions, iFrameResize */

/* eslint-disable no-alert, no-console */
jQuery(document).ready(function ($) {
  var apiBaseUrl = 'https://api.digitalriver.com/v1/shoppers'; // Very basic throttle function,
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
        "Accept": "application/json"
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active/line-items/").concat(lineItemId, "?");
        url += "&token=".concat(drExpressOptions.accessToken);
        return url;
      }(),
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
      'token': drExpressOptions.accessToken,
      'action': 'update',
      'quantity': $qty.val(),
      'expand': 'all',
      'fields': null
    };
    $.ajax({
      type: 'POST',
      headers: {
        "Accept": "application/json"
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active/line-items/").concat(lineItemId, "?").concat($.param(params));
        return url;
      }(),
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

  function fetchFreshCart() {
    $.ajax({
      type: 'GET',
      headers: {
        "Accept": "application/json"
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active?");
        url += "&expand=all";
        url += "&token=".concat(drExpressOptions.accessToken);
        return url;
      }(),
      success: function success(data) {
        renderCartProduct(data);
        displayMiniCart(data.cart);
      },
      error: function error(jqXHR) {
        console.log(jqXHR);
      }
    });
  }

  function renderCartProduct(data) {
    $('.dr-cart__products').html("");
    console.log(data.cart);
    $.each(data.cart.lineItems.lineItem, function (index, lineitem) {
      var permalink = '';
      $.ajax({
        type: 'POST',
        async: false,
        url: drExpressOptions.ajaxUrl,
        data: {
          action: 'get_permalink',
          productID: lineitem.product.id
        },
        success: function success(response) {
          permalink = response;
          var lineItemHTML = "\n            <div data-line-item-id=\"".concat(lineitem.id, "\" class=\"dr-product\">\n              <div class=\"dr-product-content\">\n                  <div class=\"dr-product__img\" style=\"background-image: url(").concat(lineitem.product.thumbnailImage, ")\"></div>\n                  <div class=\"dr-product__info\">\n                      <a class=\"product-name\" href=\"").concat(permalink, "\">").concat(lineitem.product.displayName, "</a>\n                      <div class=\"product-sku\">\n                          <span>Product </span>\n                          <span>#").concat(lineitem.product.id, "</span>\n                      </div>\n                      <div class=\"product-qty\">\n                          <span class=\"qty-text\">Qty ").concat(lineitem.quantity, "</span>\n                          <span class=\"dr-pd-cart-qty-minus value-button-decrease\"></span>\n                          <input type=\"number\" class=\"product-qty-number\" step=\"1\" min=\"1\" max=\"999\" value=\"").concat(lineitem.quantity, "\" maxlength=\"5\" size=\"2\" pattern=\"[0-9]*\" inputmode=\"numeric\" readonly=\"true\">\n                          <span class=\"dr-pd-cart-qty-plus value-button-increase\"></span>\n                      </div>\n                  </div>\n              </div>\n              <div class=\"dr-product__price\">\n                  <button class=\"dr-prd-del remove-icon\"></button>\n                  <span class=\"sale-price\">").concat(lineitem.pricing.formattedSalePriceWithQuantity, "</span>\n                  <span class=\"regular-price\">").concat(lineitem.pricing.formattedListPriceWithQuantity, "</span>\n              </div>\n            </div>\n            ");
          $('.dr-cart__products').append(lineItemHTML);
        }
      });
    });
    var _data$cart$pricing = data.cart.pricing,
        formattedShippingAndHandling = _data$cart$pricing.formattedShippingAndHandling,
        formattedSubtotal = _data$cart$pricing.formattedSubtotal;
    $('div.dr-summary__shipping .shipping-value').text(formattedShippingAndHandling);
    $('div.dr-summary__subtotal .subtotal-value').text(formattedSubtotal);

    if ($('.dr-cart__products').children().length <= 0) {
      $('.dr-cart__products').text('Your cart is empty!');
      $('#cart-estimate').hide();
    }
  }

  $('.dr-currency-select').on('change', function (e) {
    e.preventDefault();
    var data = {
      currency: e.target.value,
      locale: $(this).find('option:selected').attr('data-locale')
    };
    $.ajax({
      type: 'POST',
      url: function () {
        var url = "".concat(apiBaseUrl, "/me?");
        url += "format=json";
        url += "&token=".concat(drExpressOptions.accessToken);
        url += "&currency=".concat(data.currency);
        url += "&locale=".concat(data.locale);
        return url;
      }(),
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
      var miniCartViewCartBtn = "<a class=\"dr-btn\" id=\"dr-minicart-view-cart-btn\" href=\"".concat(drExpressOptions.cartUrl, "\">View Cart</a>");
      var miniCartCheckoutBtn = "<a class=\"dr-btn\" id=\"dr-minicart-checkout-btn\" href=\"".concat(drExpressOptions.cartUrl, "\">Checkout</a>");
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
  } //init cart via JS


  fetchFreshCart();
});
"use strict";

jQuery(document).ready(function ($) {
  var siteID = drExpressOptions.siteID;
  var apiKey = drExpressOptions.apiKey;
  var domain = drExpressOptions.domain;
  var apiBaseUrl = 'https://api.digitalriver.com/v1/shoppers';
  var drLocale = drExpressOptions.drLocale || 'en_US'; //floating labels

  FloatLabel.init(); // Globals

  var digitalriverjs = new DigitalRiver(drExpressOptions.digitalRiverKey);
  var payload = {
    shipping: {},
    billing: {}
  };
  var paymentPayload = {}; //Sections

  var shouldShippingOpen = false,
      shouldDeliveryOpen = false,
      shouldPaymentOpen = false; // Submit first (email) form

  var emailPayload;
  $('#checkout-email-form').on('submit', function (e) {
    e.preventDefault(); // If no items are in cart, do not even continue, maybe give feedback

    if (!drExpressOptions.cart.cart.lineItems.hasOwnProperty('lineItem')) return;
    var $form = $('#checkout-email-form');
    var email = $form.find('input[name=email]').val().trim();
    shouldShippingOpen = false;
    $form.addClass('was-validated');

    if ($form[0].checkValidity() === false) {
      return false;
    }

    emailPayload = email;
    var section = $('.dr-checkout__email');
    var nextSection = section.next();
    $(section).find('.dr-panel-result__text').text(emailPayload);
    shouldShippingOpen = true;
    section.removeClass('active').addClass('closed');
    nextSection.addClass('active').removeClass('closed');
  }); // Submit shipping info form

  $('#checkout-shipping-form').on('submit', function (e) {
    e.preventDefault();
    var validateItems,
        billingSameAsShipping = true,
        $form = $('#checkout-shipping-form');
    shouldDeliveryOpen = false;
    $form.addClass('was-validated');
    $('#dr-err-field').hide();

    if ($('[name="checkbox-billing"]').is(':checked')) {
      billingSameAsShipping = true;
      validateItems = document.querySelectorAll('[name^=shipping-]');

      for (var i = 0; i < validateItems.length; i++) {
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

    var button = $form.find('button[type="submit"]').toggleClass('sending').blur();
    $.each($form.serializeArray(), function (index, obj) {
      if (obj.name.startsWith('shipping')) {
        var key = obj.name.split('-')[1];
        payload['shipping'][key] = obj.value;
      }

      if (obj.name.startsWith('billing')) {
        var _key = obj.name.split('-')[1];
        payload['billing'][_key] = obj.value;
      }
    });
    payload['shipping']['emailAddress'] = emailPayload;
    payload['billing']['emailAddress'] = emailPayload;
    var data = {
      cart: {
        shippingAddress: payload['shipping']
      }
    };

    if (data.cart.shippingAddress.country !== 'US') {
      delete data.cart.shippingAddress.countrySubdivision;
    }

    if (billingSameAsShipping) {
      data.cart.billingAddress = payload['shipping'];
    } else {
      data.cart.billingAddress = payload['billing'];
    }

    $.ajax({
      type: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active?");
        url += "&token=".concat(drExpressOptions.accessToken);
        url += "&expand=all";
        return url;
      }(),
      data: JSON.stringify(data),
      success: function success(data) {
        shouldDeliveryOpen = true;
        button.removeClass('sending').blur();
        setShippingOptions(data.cart.shippingOptions);
        var section = $('.dr-checkout__shipping');
        var nextSection = section.next();
        $(section).find('.dr-panel-result__text').text("\n                    ".concat(payload.shipping.firstName, ",\n                    ").concat(payload.shipping.lastName, ",\n                    ").concat(payload.shipping.line1, ",\n                    ").concat(payload.shipping.city, ",\n                    ").concat(payload.shipping.country, "\n                "));
        section.removeClass('active').addClass('closed');
        nextSection.addClass('active').removeClass('closed');
      },
      error: function error(jqXHR) {
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

    if (!shippingOptions.hasOwnProperty('shippingOption')) {
      $('#checkout-delivery-form-msg').text('Digital product(s) only').show();
      return;
    }

    $.each(shippingOptions.shippingOption, function (index, option) {
      if ($('input[type=radio]#' + option.id).length) return;
      var html = "\n                <div class=\"field-radio\">\n                    <input type=\"radio\"\n                        name=\"selector\"\n                        id=\"".concat(option.id, "\"\n                        data-cost=\"").concat(option.formattedCost, "\"\n                        data-id=\"").concat(option.id, "\"\n                        data-desc=\"").concat(option.description, "\"\n                        >\n                    <label for=\"radio-standart\">\n                        <span>\n                            ").concat(option.description, "\n                        </span>\n                        <span class=\"black\">\n                            ").concat(option.formattedCost, "\n                        </span>\n                        <span class=\"smoller\">\n                            Estimated Arrival:\n                        </span>\n                        <span class=\"black\">\n                            Apr 08 - Apr 11\n                        </span>\n                    </label>\n                </div>\n            ");
      $('form#checkout-delivery-form .dr-panel-edit__el').append(html);
      $('form#checkout-delivery-form').children().find('input:radio').first().prop("checked", true);
    }); // Initial Shipping Option

    var shippingInitID = $('form#checkout-delivery-form').children().find('input:radio:checked').first().data('id');
    applyShippingAndUpdateCart(shippingInitID);
  } // Submit delivery form


  $('form#checkout-delivery-form').on('submit', function (e) {
    e.preventDefault();
    shouldPaymentOpen = false;
    var $input = $(this).children().find('input:radio:checked').first();
    var button = $(this).find('button[type="submit"]').toggleClass('sending').blur(); // Validate shipping option

    var data = {
      token: drExpressOptions.accessToken,
      expand: 'all',
      fields: null,
      shippingOptionId: $input.data('id')
    };
    $.ajax({
      type: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active/apply-shipping-option?").concat($.param(data));
        return url;
      }(),
      success: function success(data) {
        var section = $('.dr-checkout__delivery');
        var nextSection = section.next();
        var prevSection = section.prev();
        var resultText = $input.length > 0 ? "".concat($input.data('desc'), " ").concat($input.data('cost')) : 'Digital Product(s) Only';
        $(section).find('.dr-panel-result__text').text(resultText);
        button.removeClass('sending').blur();
        shouldPaymentOpen = true;
        section.removeClass('active').addClass('closed');
        nextSection.addClass('active').removeClass('closed');
        prevSection.addClass('small-closed-left');
        section.addClass('small-closed-right');
      },
      error: function error(jqXHR) {
        console.log(jqXHR);
      }
    });
  });
  $('form#checkout-delivery-form').on('change', 'input[type="radio"]', function () {
    var shippingObject = $('form#checkout-delivery-form').children().find('input:radio:checked').first();
    var shippingoptionID = shippingObject.data('id');
    applyShippingAndUpdateCart(shippingoptionID);
  });
  $('form#checkout-payment-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $('form#checkout-payment-form');
    $form.addClass('was-validated');

    if ($form[0].checkValidity() === false) {
      return false;
    }

    var formdata = $(this).serializeArray();
    paymentPayload = {};
    $(formdata).each(function (index, obj) {
      paymentPayload[obj.name] = obj.value;
    });
    var section = $('.dr-checkout__payment');
    var nextSection = section.next();
    $(section).find('.dr-panel-result__text').text("Credit card ending in ".concat(paymentPayload['credit-card-number'].substr(paymentPayload['credit-card-number'].length - 4)));
    shouldPaymentOpen = true;
    section.removeClass('active').addClass('closed');
    nextSection.addClass('active').removeClass('closed');
    section.addClass('small-closed-left');
    nextSection.removeClass('d-none').addClass('small-closed-right');
    $('#dr-checkout-err-field').text('').hide();
  });
  $('form#checkout-confirmation-form').on('submit', function (e) {
    e.preventDefault();
    $(this).find('button[type="submit"]').toggleClass('sending').blur();
    $('#dr-payment-failed-msg').hide();
    sendPaymentData();
  });

  function applyShippingAndUpdateCart(shippingoptionID) {
    var data = {
      token: drExpressOptions.accessToken,
      expand: 'all',
      fields: null,
      shippingOptionId: shippingoptionID
    };
    $.ajax({
      type: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active/apply-shipping-option?").concat($.param(data));
        return url;
      }(),
      success: function success(data) {
        var _data$cart$pricing = data.cart.pricing,
            formattedShippingAndHandling = _data$cart$pricing.formattedShippingAndHandling,
            formattedOrderTotal = _data$cart$pricing.formattedOrderTotal;
        $('div.dr-summary__shipping > .item-value').text(formattedShippingAndHandling);
        $('div.dr-summary__total > .total-value').text(formattedOrderTotal);
      },
      error: function error(jqXHR) {
        console.log(jqXHR);
      }
    });
  }

  function sendPaymentData() {
    var cart = drExpressOptions.cart.cart;
    var digitalRiverPayload = {};

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
          "expirationMonth": $('#card-expiration-mm').val(),
          "expirationYear": $('#card-expiration-yy').val(),
          "cvv": $('#card-cvv').val()
        },
        "amount": cart.pricing.orderTotal.value,
        "currency": cart.pricing.orderTotal.currency
      };
    }

    if (paymentPayload.selector === 'paypal') {
      var payPalItems = [];
      $.each(cart.lineItems.lineItem, function (index, item) {
        payPalItems.push({
          "name": item.product.name,
          "quantity": item.quantity,
          "unitAmount": item.product.inventoryStatus.availableQuantity
        });
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
            "recipient": "".concat(cart.shippingAddress.firstName, " ").concat(cart.shippingAddress.lastName, " "),
            "phoneNumber": cart.shippingAddress.phoneNumber,
            "address": {
              "line1": cart.shippingAddress.line1,
              "line2": cart.shippingAddress.line2,
              "city": cart.shippingAddress.city,
              "state": cart.shippingAddress.state,
              "country": cart.shippingAddress.country,
              "postalCode": cart.shippingAddress.postalCode
            }
          }
        }
      };
    }

    digitalriverjs.createSource(digitalRiverPayload).then(function (result) {
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
          window.location.href = result.source.redirect.redirectUrl;
        }
      }
    });
  } // Initial state for payPal


  if (drExpressOptions.payPal.sourceId) {
    $('.dr-checkout').children().addClass('closed');
    $('.dr-checkout').children().removeClass('active');
    $('.dr-checkout__payment').removeClass('closed').addClass('active');

    if (drExpressOptions.payPal.failure == 'true') {// TODO: Display Error on paypal form maybe
    }

    if (drExpressOptions.payPal.success == 'true') {
      applyPaymentToCart(drExpressOptions.payPal.sourceId);
    }
  }

  function applyPaymentToCart(id) {
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
        Authorization: "Bearer ".concat(drExpressOptions.accessToken)
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active/apply-payment-method?");
        url += "&token=".concat(drExpressOptions.accessToken);
        url += "&expand=all";
        return url;
      }(),
      data: JSON.stringify(data),
      success: function success() {
        var billingSameAsShipping = $('[name="checkbox-billing"]').is(':checked');

        if (billingSameAsShipping) {
          submitCart();
        } else {
          applyBillingAddress(payload.billing).then(function () {
            return submitCart();
          });
        }
      },
      error: function error(jqXHR) {
        $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
        $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
      }
    });
  }

  function applyBillingAddress(billingAddress) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer ".concat(drExpressOptions.accessToken)
        },
        url: function () {
          var url = "".concat(apiBaseUrl, "/me/carts/active?");
          url += "&token=".concat(drExpressOptions.accessToken);
          return url;
        }(),
        data: JSON.stringify({
          cart: {
            billingAddress: billingAddress
          }
        }),
        success: function success(data) {
          resolve(data);
        },
        error: function error(jqXHR) {
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
        'Content-Type': 'application/json',
        Authorization: "Bearer ".concat(drExpressOptions.accessToken)
      },
      url: function () {
        var url = "".concat(apiBaseUrl, "/me/carts/active/submit-cart?");
        url += "&token=".concat(drExpressOptions.accessToken);
        url += "&expand=all";
        return url;
      }(),
      success: function success(data) {
        window.location.replace("".concat(drExpressOptions.thankYouEndpoint, "?order=").concat(data.submitCart.order.id));
      },
      error: function error(jqXHR) {
        $('form#checkout-confirmation-form').find('button[type="submit"]').removeClass('sending').blur();
        $('#dr-checkout-err-field').text(jqXHR.responseJSON.errors.error[0].description).show();
      }
    });
  } // check billing info


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
    $('.dr-checkout__payment').removeClass('small-closed-left');
    $('.dr-checkout__confirmation').addClass('d-none').removeClass('small-closed-right');
    var $this = $(this).parent();
    var otherSections = $this.parent().siblings();
    var section = $this.parent();
    var nextSection = $this.parent().next();
    var prevSection = section.prev();

    if (/_email/.test(section.attr('class'))) {
      shouldShippingOpen = false;
      shouldDeliveryOpen = false;
      shouldPaymentOpen = false;
      otherSections.removeClass('small-closed-left');
      otherSections.removeClass('small-closed-right');
    }

    if (/_shipping/.test(section.attr('class'))) {
      if (!shouldShippingOpen) {
        return;
      } else {
        shouldDeliveryOpen = false;
        shouldPaymentOpen = false;
      }
    }

    if (/_delivery/.test(section.attr('class'))) {
      if (!shouldDeliveryOpen) {
        return;
      } else {
        shouldPaymentOpen = false;
      }
    }

    if (/_payment/.test(section.attr('class')) && !shouldPaymentOpen) {
      return;
    }

    otherSections.addClass('closed').removeClass('active');
    section.removeClass('closed').addClass('active');

    if (section.hasClass('dr-checkout__delivery')) {
      if (section.hasClass('closed') && prevSection.hasClass('closed')) {
        prevSection.addClass('small-closed-left');
        section.addClass('small-closed-right');
      } else {
        prevSection.removeClass('small-closed-left');
        section.removeClass('small-closed-right');
      }
    } else {
      section.removeClass('small-closed-left');
      nextSection.removeClass('small-closed-right');
    }
  }); // print thank you page

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

  $("#radio-credit-card, #radio-paypal").on("click", function () {
    if ($('#radio-credit-card').is(':checked')) {
      $('.credit-card-info').show();
      $('#dr-submit-payment').text('pay with card'.toUpperCase());
    } else {
      $('.credit-card-info').hide();
      $('#dr-submit-payment').text('pay with paypal'.toUpperCase());
    }
  });
  $('#shipping-field-country').on('change', function () {
    if (this.value === 'US') {
      $('#shipping-field-state').removeClass('d-none');
    } else {
      $('#shipping-field-state').addClass('d-none');
    }
  });
  $('#billing-field-country').on('change', function () {
    if (this.value === 'US') {
      $('#billing-field-state').removeClass('d-none');
    } else {
      $('#billing-field-state').addClass('d-none');
    }
  });
});
"use strict";

/* global drExpressOptions, iFrameResize */

/* eslint-disable no-alert, no-console */
jQuery(document).ready(function ($) {
  var ajaxUrl = drExpressOptions.ajaxUrl;
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
      'action': 'dr_express_login',
      'username': $(".dr-login-form input[name='username']").val(),
      'password': $(".dr-login-form input[name='password']").val(),
      'cookie': readCookie('dr_express_session')
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
  $('.dr-express-wrapper').on('click', '.dr-logout', function (e) {
    e.preventDefault();

    if ($(this).data('processing')) {
      return;
    }

    var but = $(this).toggleClass('sending').blur();
    $(this).data('processing', true);
    var data = {
      'action': 'dr_express_logout',
      'cookie': readCookie('dr_express_session')
    };
    $.post(ajaxUrl, data, function (response) {
      location.reload();
    });
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
      'action': 'dr_express_signup',
      'username': $(".dr-signup-form input[name='uemail']").val(),
      'password': $(".dr-signup-form input[name='upw']").val(),
      'cookie': readCookie('dr_express_session')
    };
    $.post(ajaxUrl, data, function (response) {
      if (response.success) {
        location.reload();
      } else {
        $form.data('processing', false);
        but.removeClass('sending').blur();

        if (response.data.errors && response.data.errors.error[0].hasOwnProperty('description')) {
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
      'action': 'dr_express_pass_reset_request'
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
        $('#drResetPasswordModalBody').html('').html("\n                    <h3>Password reset email sent</h3>\n                    <p>You will be receiving an email \n                    soon with instructions on resetting your\n                    login password</p>\n                ");
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
      'action': 'dr_express_reset_password',
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
});

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

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
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* global drExpressOptions, iFrameResize */

/* eslint-disable no-alert, no-console */
jQuery(document).ready(function ($) {
  var DRService =
  /*#__PURE__*/
  function () {
    function DRService() {
      _classCallCheck(this, DRService);

      this.siteID = drExpressOptions.siteID;
      this.apiKey = drExpressOptions.apiKey;
      this.domain = drExpressOptions.domain;
      this.sessionToken = null;
      this.apiBaseUrl = 'https://api.digitalriver.com/v1/shoppers';
      this.drLocale = drExpressOptions.drLocale || 'en_US';
    }

    _createClass(DRService, [{
      key: "updateShopper",
      value: function updateShopper() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          $.ajax({
            type: 'POST',
            headers: {
              Authorization: "Bearer ".concat(_this.sessionToken)
            },
            url: "".concat(_this.apiBaseUrl, "/me?format=json&locale=").concat(_this.drLocale),
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
              Authorization: "Bearer ".concat(drExpressOptions.accessToken)
            },
            url: function () {
              var url = "".concat(_this2.apiBaseUrl, "/me/carts/active?");
              url += 'format=json';
              url += "&token=".concat(drExpressOptions.accessToken);
              return url;
            }(),
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
              Authorization: "Bearer ".concat(drExpressOptions.accessToken)
            },
            url: function () {
              var url = "".concat(_this3.apiBaseUrl, "/me/carts/active?");
              url += 'format=json';
              url += "&productId=".concat(productID);
              if (quantity) url += "&quantity=".concat(quantity);
              url += "&token=".concat(drExpressOptions.accessToken);
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
              Accept: 'application/json'
            },
            url: function () {
              var url = "".concat(_this4.apiBaseUrl, "/me/carts/active/line-items/").concat(lineItemID, "?");
              url += 'format=json';
              url += "&token=".concat(drExpressOptions.accessToken);
              return url;
            }(),
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
              Authorization: "Bearer ".concat(_this5.sessionToken)
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
              Authorization: "Bearer ".concat(_this6.sessionToken)
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
              Authorization: "Bearer ".concat(_this7.sessionToken)
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

    if (!lineItems.length) {
      var emptyMsg = '<p class="dr-minicart-empty-msg">Your shopping cart is currently empty.</p>';
      $body.append(emptyMsg);
      $display.append($body);
    } else {
      var miniCartLineItems = '<ul class="dr-minicart-list">';
      var miniCartSubtotal = "<p class=\"dr-minicart-subtotal\"><label>Sub-Total</label><span>".concat(cart.pricing.formattedSubtotal, "</span></p>");
      var miniCartViewCartBtn = "<a class=\"dr-btn\" id=\"dr-minicart-view-cart-btn\" href=\"".concat(drExpressOptions.cartUrl, "\">View Cart</a>");
      var miniCartCheckoutBtn = "<a class=\"dr-btn\" id=\"dr-minicart-checkout-btn\" href=\"".concat(drExpressOptions.cartUrl, "\">Checkout</a>");
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
    displayMiniCart(drExpressOptions.cart.cart);
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
    var $prodPrice = $('.dr-pd-price');
    var $buyBtn = $('.dr-buy-btn');
    $buyBtn.attr('data-product-id', varId);
    $prodPrice.html('<strong>' + price + '</strong>');
  });
  $("iframe[name^='controller-']").css('display', 'none');
});