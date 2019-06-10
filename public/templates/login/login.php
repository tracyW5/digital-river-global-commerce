<?php
/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/public/templates/parts
 */

$checkout_URI = dr_get_page_link( 'checkout' );
?>

<div class="dr-login-wrapper dr-login" id="full-width-page-wrapper">

    <div class="dr-login-sections">
	    <?php if ( $customer && 'Anonymous' !== $customer['id'] ) : ?>
            <section class="dr-login-sections__section section-returning logged-in">

                <?php echo __( 'Welcome ', 'dr-express' ) . $customer['username']; ?>

                <div>
                    <a class="btn dr-btn" href="<?php echo esc_url( dr_get_page_link( 'cart' ) ); ?>"><?php echo __( 'Cart', 'dr-express' ); ?></a>
                    <a class="btn dr-btn" href="<?php echo esc_url( $checkout_URI ); ?>"><?php echo __( 'Checkout', 'dr-express' ); ?></a>
                </div>

                <a class="dr-btn dr-logout" href="#"><?php echo __( 'Logout', 'dr-express' ); ?></a>
            </section>
        <?php else : ?>

        <?php if ( ($_GET['action'] ?? '') === 'rp' && isset($_GET['key'])) : ?>
            <section class="dr-login-sections__section reset-password">
                <div>
                    <h2><?php echo __( 'New password', 'dr-express' ); ?></h2>
                    <p><?php echo __( 'Please enter secure password twice to continue', 'dr-express' ); ?></p>
                </div>

                <form class="dr-confirm-password-reset-form needs-validation" novalidate>

                    <div class="form-group">
                        <input class="form-control" name="password" type="password" placeholder="New Password" required>

                        <div class="invalid-feedback">
                            <?php echo __( 'This field is required.' ); ?>
                        </div>
                    </div>

                    <div class="form-group">
                        <input class="form-control" name="confirm-password" type="password" placeholder="Confirm New Password" required>

                        <div class="invalid-feedback">
                            <?php echo __( 'This field is required.' ); ?>
                        </div>
                    </div>

                    <button type="submit" class="dr-btn"><?php echo __( 'Reset Password', 'dr-express' ); ?></button>

                    <div class="dr-form-error-msg"></div>
                </form>
            </section>
        <?php else : ?>

            <section class="dr-login-sections__section section-returning">
                <div>

                    <h2><?php echo __( 'Returning Customer', 'dr-express' ); ?></h2>
                    <p><?php echo __( 'If you have an existing account, please sign in.', 'dr-express' ); ?></p>
                </div>

                <form id="dr_login_form" class="dr-login-form needs-validation" novalidate>

                    <div class="form-group">
                        <input class="form-control" name="username" type="text" placeholder="Email/User Name" required>

                        <div class="invalid-feedback">
		                    <?php echo __( 'This field is required.' ); ?>
                        </div>
                    </div>

                    <div class="form-group">
                        <input class="form-control" name="password" type="password" placeholder="Password" required>

                        <div class="invalid-feedback">
		                    <?php echo __( 'This field is required.' ); ?>
                        </div>
                    </div>

                    <button type="submit" id="dr-auth-submit" class="dr-btn"><?php echo __( 'Login', 'dr-express' ); ?></button>

                    <div class="dr-form-error-msg"></div>
                </form>

                <a class="forgotten-password" href="#" data-toggle="modal" data-target="#drResetPassword"><?php echo __( 'Forgot password?', 'dr-express' ); ?></a>

                <div class="modal fade" id="drResetPassword" tabindex="-1" role="dialog" aria-labelledby="drResetPasswordTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    <?php echo __( 'Forgot Password', 'dr-express' ); ?>
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body" id="drResetPasswordModalBody">
                                <p>
                                    <?php echo __('To reset your password, please enter your email 
                                    address below and an email with instructions on
                                    resetting your password will be sent to you.', 'dr-express'); ?>
                                </p>
                                <form id="dr-pass-reset-form" novalidate>
                                    <div class="form-group">
                                        <label for="email-address" class="col-form-label"><?php echo __( 'Email Address:', 'dr-express' ); ?></label>
                                        <input name="email" type="email" class="form-control" id="email-address" required>
                                        <div class="invalid-feedback">
                                            <?php echo __( 'This field is required email.' ); ?>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="email-address-confirm" class="col-form-label"><?php echo __( 'Verify Email Address:', 'dr-express' ); ?></label>
                                        <input name="email-confirm" type="email" class="form-control" id="email-address-confirm" required>
                                        <div class="invalid-feedback">
                                            <?php echo __( 'This field is required email.' ); ?>
                                        </div>
                                    </div>
                                </form>

                                <div id="dr-reset-pass-error" class="invalid-feedback"></div>
                            </div>
                            <div class="modal-footer">
                                <button id="dr-pass-reset-submit" type="button" class="dr-btn w-100">
                                    <?php echo __( 'Reset Password', 'dr-express' ); ?>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        <?php endif; ?>

            <section class="dr-login-sections__section section-new">
                <div>

                    <h2><?php echo __( 'NEW CUSTOMER', 'dr-express' ); ?></h2>

                    <p>
		                <?php echo __( 'You can checkout as a guest or become a 
		                member for faster checkout and great offers.', 'dr-express' ); ?>
                    </p>
                </div>

                <form class="dr-signup-form needs-validation" oninput='upw2.setCustomValidity(upw2.value != upw.value ? "Passwords do not match." : "")' novalidate>

                    <div class="form-group">
                        <input class="form-control" name="uemail" type="email" minlength="4" placeholder="Email Address" required>

                        <div class="invalid-feedback">
			                <?php echo __( 'This field is required.' ); ?>
                        </div>
                    </div>

                    <div class="form-group">
                        <input class="form-control" name="upw" type="password" placeholder="Password" required>

                        <div class="invalid-feedback">
			                <?php echo __( 'This field is required.' ); ?>
                        </div>
                    </div>

                    <div class="form-group">
                        <input class="form-control" name="upw2" type="password" placeholder="Confirm Password" required>

                        <div class="invalid-feedback">
			                <?php echo __( 'Passwords do not match.' ); ?>
                        </div>
                    </div>

                    <div class="dr-signin-form-error"></div>
                </form>

                <div>

                    <a class="dr-btn dr-signup" href="#"><?php echo __( 'Sign Up', 'dr-express' ); ?></a>

                    <a class="dr-btn" href="<?php echo esc_url( dr_get_page_link( 'cart' ) ); ?>" ><?php echo __( 'Continue As Guest', 'dr-express' ); ?></a>

                </div>


            </section>
	    <?php endif; ?>

        <!-- <section class="dr-login-sections__section section-paypal">
            <div>
                <h2><?php echo __( 'PAYPAL CUSTOMERS', 'dr-express' ); ?></h2>
                <p>
		            <?php echo __( 'Make your payment with PayPal\'s secure services.', 'dr-express' ); ?>
		            <?php echo __( 'You can still add promotion codes before you complete your order.', 'dr-express' ); ?>
                </p>
            </div>

            <div class="section-paypal-img">
                <a href="<?php echo esc_url( add_query_arg( 'type', 'paypal', $checkout_URI ) ); ?>"><img src="<?php echo PLUGIN_URL . 'assets/images/paypal-checkout.png' ?>" alt="Checkout PayPal"></a>

                <a href="<?php echo esc_url( add_query_arg( 'type', 'paypal-credit', $checkout_URI ) ); ?>"><img src="<?php echo PLUGIN_URL . 'assets/images/paypal-credit.png' ?>" alt="Credit PayPal"></a>
            </div>
        </section> -->

    </div>
</div> 
