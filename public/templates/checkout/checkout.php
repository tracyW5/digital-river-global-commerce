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

    $display = '';
    if ($cart['cart']['totalItemsInCart'] == 0 ) {
        echo __( 'Your cart is empty!', 'dr-express' );
        $display = 'style="display:none;"';
    }
    
    $customerEmail = '';
    if ( $customer && $customer['id'] != 'Anonymous' ) {
        $customerEmail = $customer['emailAddress'];
    }
?>

<div class="dr-checkout-wrapper" id="dr-checkout-page-wrapper">
    <div class="dr-checkout-wrapper__actions" <?php echo $display; ?>>
        <div class="back-link">

            <a href="" onclick="history.back(); return false;">&#60; Back</a>

        </div>

    </div>

    <div class="dr-checkout-wrapper__content" <?php echo $display; ?>>

        <div class="dr-checkout">

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-email.php'; ?>

            <?php if( $cart['cart']['hasPhysicalProduct'] ) :
                include_once PLUGIN_DIR . 'public/templates/checkout/checkout-shipping.php';
            endif; ?>

            <?php include_once PLUGIN_DIR . 'public/templates/checkout/checkout-billing.php'; ?>

            <?php if( $cart['cart']['hasPhysicalProduct'] ) :
                include_once PLUGIN_DIR . 'public/templates/checkout/checkout-delivery.php';
            endif; ?>

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

    <div class="dr-checkout__actions-bottom">

        <a href="<?php echo get_post_type_archive_link( 'dr_product' ); ?>" class="continue-shopping"><?php echo __( 'Continue Shopping', 'dr-express' ); ?></a>

    </div>

</div>