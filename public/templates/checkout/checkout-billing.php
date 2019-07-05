<div class="dr-checkout__billing dr-checkout__el">
    <button class="dr-accordion">

        <span class="dr-accordion__name">

            <span class="dr-accordion__icon billing-icon"></span>

            <span class="dr-accordion__title-long">

                <?php echo __( 'Billing information' ); ?>

            </span>

            <span class="dr-accordion__title-short">

                <?php echo __( 'Billing' ); ?>

            </span>

        </span>

        <span class="dr-accordion__edit"><?php echo __( 'Edit', 'dr-express' ); ?>></span>

    </button>

    <form id="checkout-billing-form" class="dr-panel-edit dr-panel-edit--billing needs-validation" novalidate>

        <div class="form-group dr-panel-edit__check" <?php echo !$cart['cart']['hasPhysicalProduct'] ? 'style="display: none;"' : '' ?>>

            <p class="field-text">

                <?php echo __( 'What is your billing address?' ); ?>

            </p>

            <div class="field-checkbox">

                <input type="checkbox" name="checkbox-billing" id="checkbox-billing" checked="checked">

                <label for="checkbox-billing" class="checkbox-label">

                    <?php echo __( 'Billing address is the same as delivery address' ); ?>

                </label>

            </div>

        </div>

        <div class="billing-section" <?php echo !$cart['cart']['hasPhysicalProduct'] ? 'style="display: block;"' : '' ?>>

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

                <select class="form-control custom-select" name="billing-country" id="billing-field-country" required>
                    
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

            <div class="form-group dr-panel-edit__el <?php echo $cart['cart']['billingAddress']['country'] !== 'US' ? 'd-none' : '' ?>">

                <select class="form-control custom-select" name="billing-countrySubdivision" id="billing-field-state" required>

                    <option value="">
                        <?php echo __( 'Select State *' ); ?>
                    </option>

                    <?php foreach ($usa_states as $key => $state): ?>
                        <?php 
                            $option = "<option ";
                            $option .= $cart['cart']['billingAddress']['countrySubdivision'] === $state ? 'selected ' : '';
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

        <div class="invalid-feedback dr-err-field" style="display: none"></div>

        <button type="submit" class="dr-panel-edit__btn dr-btn">

            <?php echo __( 'Save and continue' ); ?>

        </button>

    </form>

    <div class="dr-panel-result">

        <p class="dr-panel-result__text"></p>

    </div>

</div>