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
?>
<div class="dr-checkout-wrapper" id="dr-checkout-page-wrapper">

    <div class="dr-checkout-wrapper__actions">

        <div class="dr-check-account">

            <?php if ( $customer && 'Anonymous' === $customer['id'] ) : ?>

                <span class="dr-check-account__text"><?php echo __( 'Have an account?', 'dr-express' ); ?></span>

                <a href="<?php echo esc_url( dr_get_page_link( 'login' ) ); ?>" class="dr-check-account__link"><?php echo __( 'Sign in', 'dr-express' ); ?></a>

            <?php endif; ?>

        </div>

        <div class="back-link">

            <a href="" onclick="history.back(); return false;">&#60; Back</a>

        </div>

    </div>

    <div class="dr-checkout-wrapper__content">

        <div class="dr-checkout">

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-email.php'; ?>

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-shipping.php'; ?>

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-delivery.php'; ?>

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-payment.php'; ?>

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-confirmation.php'; ?>

        </div>

        <div class="dr-summary dr-summary--checkout">

            <?php dr_express_currency_toggler(); ?>

            <div class="dr-summary__products">

                <?php if ( 1 < count($cart['cart']['lineItems']) ) : ?>
                    <?php foreach ($cart['cart']['lineItems']['lineItem'] as $line_item): ?>
                        <?php include PLUGIN_DIR . 'public/templates/cart/cart-product.php'; ?>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-summary.php'; ?>

        </div>

    </div>

</div>