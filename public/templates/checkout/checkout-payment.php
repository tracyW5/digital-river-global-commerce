
<div class="dr-checkout__payment dr-checkout__el">

<button class="dr-accordion">
    
    <span class="dr-accordion__name">

        <span class="dr-accordion__icon payment-icon"></span>
    
        <?php echo __( 'Payment' ); ?>

    </span>

    <span class="dr-accordion__edit">Edit></span>
    
</button>

<form id="checkout-payment-form" class="dr-panel-edit dr-panel-edit--payment needs-validation" novalidate>

    <div class="dr-panel-edit__info">

        <p class="payment-info">

            <?php echo __( 'How would you like to pay?' ); ?>

        </p>

    </div>

    <div class="dr-panel-edit__el">

        <div class="credit-card-section">

            <div class="field-radio">

                <input type="radio" id="radio-credit-card" name="selector" value="credit-card" checked>

                <label for="radio-credit-card">

                    <span class="credit-card-icon"></span>

                    <span class="black">
                        
                        <?php echo __( 'Credit Card' ); ?>
                    
                    </span>

                </label>

            </div>

            <div class="cards">

                <div class="american-express-icon"></div>

                <div  class="diners-club-icon"></div>

                <div  class="discover-icon"></div>

                <div  class="jcb-icon"></div>

                <div  class="master-card-icon"></div>

                <div  class="visa-icon"></div>

            </div>

        </div>

        <div class="credit-card-info">

            <input id="card-number" name="credit-card-number" class="form-control cc-number" type="tel" pattern="\d*" maxlength="19" placeholder="<?php echo __( 'Card Number' ); ?>" required>
            
            <div class="cc-expires-section">

                <input id="card-expiration-mm" name="credit-card-expires-mm" class="form-control cc-expires" type="tel" pattern="\d*" maxlength="5" placeholder="<?php echo __( 'MM' ); ?>" required  style="background-image: none">
                
                <div class="del">/</div>
                
                <input id="card-expiration-yy" name="credit-card-expires-yy" class="form-control cc-expires" type="tel" pattern="\d*" maxlength="2" placeholder="<?php echo __( 'YY' ); ?>" required  style="background-image: none">
            
            </div>
           
            <input id="card-cvv" name="credit-card-cvv" class="form-control cc-cvv" type="tel" pattern="\d*" maxlength="4" placeholder="<?php echo __( 'CVV' ); ?>" required  style="background-image: none">

        </div>

    </div>

    <div class="dr-panel-edit__el">

        <div class="field-radio">

            <input type="radio" id="radio-paypal" name="selector" value="paypal" >

            <label for="radio-paypal">

                <span class="paypal-icon"></span>

                <span class="black">

                    <?php echo __( 'PayPal' ); ?>

                </span>

            </label>

        </div>

    </div>

    <!-- <div class="dr-panel-edit__el">

        <div class="field-radio">

            <input type="radio" id="radio-paypal-credit" name="selector" value="paypal-credit" <?php echo 'paypal-credit' == $payment_type ? 'checked' : ''; ?>>

            <label for="radio-paypal-credit">

                <span class="paypal-credit-small-icon"></span>

                <span class="paypal-credit-logo-icon"></span>

            </label>

        </div>

    </div> -->

    <button id="dr-submit-payment" type="submit" class="dr-panel-edit__btn dr-btn">

        <?php echo __( 'Pay with card' ); ?>
        
    </button>

</form>

<div class="dr-panel-result">

    <p class="dr-panel-result__text"></p>

</div>

<div id="dr-payment-failed-msg" class="invalid-feedback"></div>

</div>