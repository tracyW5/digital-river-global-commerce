<div class="dr-checkout__shipping dr-checkout__el">
    <button class="dr-accordion">

        <span class="dr-accordion__name">

            <span class="dr-accordion__icon shipping-icon"></span>

            <span class="dr-accordion__title-long">

                <?php echo __( 'Shipping information' ); ?>

            </span>

            <span class="dr-accordion__title-short">

                <?php echo __( 'Shipping' ); ?>

            </span>

        </span>

        <span class="dr-accordion__edit"><?php echo __( 'Edit', 'dr-express' ); ?>></span>
        
    </button>
    <form id="checkout-shipping-form" class="dr-panel-edit dr-panel-edit--shipping needs-validation" novalidate>

         <div class="required-text">
            <?php echo __( 'Fields marked with * are mandatory' ); ?>
         </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--first-name">

                <label for="shipping-field-first-name" class="float-label ">

                    <?php echo __( 'First Name *' ); ?>

                </label>

                <input id="shipping-field-first-name" type="text" value="<?php echo $cart['cart']['shippingAddress']['firstName'] ?>" name="shipping-firstName" class="form-control float-field float-field--first-name" required>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>

            </div>

        </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--last-name">

                <label for="shipping-field-last-name" class="float-label ">

                    <?php echo __( 'Last Name *' ); ?>

                </label>

                <input id="shipping-field-last-name" type="text" value="<?php echo $cart['cart']['shippingAddress']['lastName'] ?>" name="shipping-lastName" class="form-control float-field float-field--last-name" required>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>

            </div>

        </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--address1">

                <label for="shipping-field-address1" class="float-label ">

                    <?php echo __( 'Address line 1 *' ); ?>

                </label>

                <input id="shipping-field-address1" type="text" value="<?php echo $cart['cart']['shippingAddress']['line1'] ?>" name="shipping-line1" class="form-control float-field float-field--address1" required>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>

            </div>

        </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--address2">

                <label for="shipping-field-address2" class="float-label">

                    <?php echo __( 'Address line 2/Company' ); ?>

                </label>

                <input id="shipping-field-address2" type="text" name="shipping-line2" value="<?php echo $cart['cart']['shippingAddress']['line2'] ?>" class="form-control float-field float-field--address2">
            
            </div>

        </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--city">

                <label for="shipping-field-city" class="float-label">

                    <?php echo __( 'City *' ); ?>
                    
                </label>

                <input id="shipping-field-city" type="text" name="shipping-city" value="<?php echo $cart['cart']['shippingAddress']['city'] ?>" class="form-control float-field float-field--city" required>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>
            
            </div>
            
        </div>

        <div class="form-group dr-panel-edit__el">

            <select class="custom-select" name="shipping-country" id="shipping-field-country" required>
                <option value="">
                    <?php echo __( 'Select Country *' ); ?>
                </option>

                <?php foreach ( $locales['locales'] as $locale => $currency ): ?>
                    <?php
                        $country = code_to_counry($locale);
                        $abrvCountyName = code_to_counry($locale, true);

                        $output = "<option ";
                        $output .= ($cart['cart']['shippingAddress']['country'] === $abrvCountyName ? 'selected ' : '');
                        $output .= "value=\"{$abrvCountyName}\">{$country}</option>";
                        echo $output;
                    ?>
                <?php endforeach; ?>
            </select>

            <div class="invalid-feedback">

                <?php echo __( 'This field is required.' ); ?>

            </div>

        </div>

            
        <div class="form-group dr-panel-edit__el">

            <select class="custom-select <?php echo $cart['cart']['shippingAddress']['country'] !== 'US' ? 'd-none' : '' ?>" name="shipping-countrySubdivision" id="shipping-field-state">

                <option value="">
                    <?php echo __( 'Select State *' ); ?>
                </option>

                <?php foreach ($usa_states as $key => $state): ?>
                        <?php 
                            $option = "<option ";
                            $option .= $cart['cart']['shippingAddress']['countrySubdivision'] === $state ? 'selected ' : '';
                            $option .= "value=\"{$state}\">{$state}</option>";
                            echo $option;
                        ?>
                <?php endforeach; ?>

            </select>

            <div class="invalid-feedback">

                <?php echo __( 'This field is required.' ); ?>

            </div>

        </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--zip">

                <label for="shipping-field-zip" class="float-label">

                    <?php echo __( 'Zipcode *' ); ?>

                </label>

                <input id="shipping-field-zip" type="text" name="shipping-postalCode" value="<?php echo $cart['cart']['shippingAddress']['postalCode'] ?>" class="form-control float-field float-field--zip" required>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>

            </div>
            
        </div>

        <div class="form-group dr-panel-edit__el">

            <div class="float-container float-container--phone">

                <label for="shipping-field-phone" class="float-label">

                    <?php echo __( 'Phone' ); ?>

                </label>
                
                <input id="shipping-field-phone" type="text" name="shipping-phoneNumber" value="<?php echo $cart['cart']['shippingAddress']['phoneNumber'] ?>" class="form-control float-field float-field--phone">
            
            </div>

        </div>
        
        <div id="dr-err-field" class="invalid-feedback" style="display: none"></div>

        <div class="form-group dr-panel-edit__check">

            <p class="field-text">

                <?php echo __( 'What is your billing address?' ); ?>

            </p>

            <div class="field-checkbox">

                <input type="checkbox" name="checkbox-billing" id="checkbox-billing" checked="checked">

                <label for="checkbox-billing" class="checkbox-label">

                    <?php echo __( 'Billing address is the same as delivery address' ); ?>

                </label>
            
            </div>
            
            <!--<div class="field-checkbox">

                <input type="checkbox" name="checkbox-subscribe" id="checkbox-subscribe" value="value">

                <label for="checkbox-subscribe" class="checkbox-label">

                <?php // echo __( 'Subscribe me to the Newsletter' ); ?>
            
                </label>

            </div>-->

        </div>

        <div class="billing-section">

            <div class="billing-section__name">

            <?php echo __( 'Billing information' ); ?>

            </div>

            <div class="form-group dr-panel-edit__el">

                <div class="float-container float-container--first-name">

                    <label for="billing-field-first-name" class="float-label ">

                        <?php echo __( 'First Name *' ); ?>

                    </label>

                    <input id="billing-field-first-name" type="text" name="billing-firstName" value="<?php echo $cart['cart']['billingAddress']['firstName'] ?>" class="form-control float-field float-field--first-name" required>

                    <div class="invalid-feedback">

                        <?php echo __( 'This field is required.' ); ?>

                    </div>

                </div>

            </div>

            <div class="form-group dr-panel-edit__el">

                <div class="float-container float-container--last-name">

                    <label for="billing-field-last-name" class="float-label">

                        <?php echo __( 'Last Name *' ); ?>

                    </label>

                    <input id="billing-field-last-name" type="text" name="billing-lastName" value="<?php echo $cart['cart']['billingAddress']['lastName'] ?>" class="form-control float-field float-field--last-name" required>

                    <div class="invalid-feedback">

                        <?php echo __( 'This field is required.' ); ?>

                    </div>

                </div>

            </div>

            <div class="form-group dr-panel-edit__el">

                <div class="float-container float-container--address1">

                    <label for="billing-field-address1" class="float-label ">

                        <?php echo __( 'Address line 1 *' ); ?>

                    </label>

                    <input id="billing-field-address1" type="text" name="billing-line1" value="<?php echo $cart['cart']['billingAddress']['line1'] ?>" class="form-control float-field float-field--address1" required>

                    <div class="invalid-feedback">

                        <?php echo __( 'This field is required.' ); ?>

                    </div>

                </div>

            </div>

            <div class="form-group dr-panel-edit__el">

                <div class="float-container float-container--address2">

                    <label for="billing-field-address2" class="float-label">

                        <?php echo __( 'Address line 2/Company' ); ?>

                    </label>

                    <input id="billing-field-address2" type="text" name="billing-line2" value="<?php echo $cart['cart']['billingAddress']['line2'] ?>" class="form-control float-field float-field--address2" >

                </div>

            </div>

            <div class="form-group dr-panel-edit__el">

                <div class="float-container float-container--city">

                    <label for="billing-field-city" class="float-label">

                        <?php echo __( 'City *' ); ?>
                        
                    </label>

                    <input id="billing-field-city" type="text" name="billing-city" value="<?php echo $cart['cart']['billingAddress']['city'] ?>" class="form-control float-field float-field--city" required>

                    <div class="invalid-feedback">

                        <?php echo __( 'This field is required.' ); ?>

                    </div>

                </div>

            </div>

            <div class="form-group dr-panel-edit__el">

                <select class="custom-select" name="billing-country" id="billing-field-country" required>
                    
                    <option value="">
                        <?php echo __( 'Select Country *' ); ?>
                    </option>

                    <?php foreach ( $locales['locales'] as $locale => $currency ): ?>
                        <?php
                            $country = code_to_counry($locale);
                            $abrvCountyName = code_to_counry($locale, true);

                            $output = "<option ";
                            $output .= ($cart['cart']['billingAddress']['country'] === $abrvCountyName ? 'selected ' : '');
                            $output .= "value=\"{$abrvCountyName}\">{$country}</option>";
                            echo $output;
                        ?>
                    <?php endforeach; ?>

                </select>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>

            </div>

            <div class="dr-panel-edit__el">

                <select class="custom-select <?php echo $cart['cart']['billingAddress']['country'] !== 'US' ? 'd-none' : '' ?>" name="billing-countrySubdivision" id="billing-field-state" required>

                    <option value="">
                        <?php echo __( 'Select State *' ); ?>
                    </option>

                    <?php foreach ($usa_states as $key => $state): ?>
                        <?php 
                            $option = "<option ";
                            $option .= $cart['cart']['shippingAddress']['countrySubdivision'] === $state ? 'selected ' : '';
                            $option .= "value=\"{$state}\">{$state}</option>";
                            echo $option;
                        ?>
                    <?php endforeach; ?>

                </select>

                <div class="invalid-feedback">

                    <?php echo __( 'This field is required.' ); ?>

                </div>

            </div>

            <div class="dr-panel-edit__el">

                <div class="float-container float-container--zip">

                    <label for="billing-field-zip" class="float-label">

                        <?php echo __( 'Zipcode *' ); ?>

                    </label>

                    <input id="billing-field-zip" type="text" name="billing-postalCode" value="<?php echo $cart['cart']['billingAddress']['postalCode'] ?>" class="form-control float-field float-field--zip" required>

                    <div class="invalid-feedback">

                        <?php echo __( 'This field is required.' ); ?>

                    </div>

                </div>

            </div>

            <div class="form-group dr-panel-edit__el">

                <div class="float-container float-container--phone">

                    <label for="billing-field-phone" class="float-label ">

                        <?php echo __( 'Phone' ); ?>
                    
                    </label>
                    
                    <input id="billing-field-phone" type="text" name="billing-phoneNumber" value="<?php echo $cart['cart']['billingAddress']['phoneNumber'] ?>" class="form-control float-field float-field--phone" >

                </div>

            </div>

        </div>

        <button type="submit" class="dr-panel-edit__btn dr-btn">

            <?php echo __( 'Save and continue' ); ?>

        </button>

    </form>

    <div class="dr-panel-result">

        <p class="dr-panel-result__text"></p>

    </div>

</div>