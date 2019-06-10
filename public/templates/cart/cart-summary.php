<?php
/**
 * Provide a publidr-facing view for the plugin
 *
 * This file is used to markup the publidr-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/public/partials
 */
?>

<?php
$subtotal_value = $cart['cart']['pricing']['formattedSubtotal'];
$shipping_price = $cart['cart']['pricing']['formattedShippingAndHandling'];
$total_savings = $cart['cart']['pricing']['formattedDiscount'];
$subtotal_items = $cart['cart']['totalItemsInCart'];

$delivery_info = 'Delivery in 2-5 working days and extended 30 days return period';
?>

<div class="dr-summary">

    <!-- <div class="dr-summary__promo-code">

        <a href=""><?php echo _('Add Promo Code +') ?></a>

    </div> -->

     <div class="dr-summary__shipping">

        <p class="shipping-label"><?php echo __('Shipping') ?></p>

        <p class="shipping-value"><?php echo $shipping_price; ?></p>

    </div>

    <div class="dr-summary__subtotal">

        <p class="subtotal-label"><?php echo __('Subtotal') ?></p>

        <p class="subtotal-value"><?php echo $subtotal_value; ?></p>

    </div>

    <?php /*
    <div class="dr-summary__savings">
        <p class="savings-label"><?php echo __('Total Savings') ?></p>

        <p class="savings-value"><?php echo $total_savings; ?></p>

    </div>
    */ ?>

	<?php if ( 1 < count($cart['cart']['lineItems'] )) : ?>

        <a href="<?php echo esc_url( dr_get_page_link( 'checkout' ) ); ?>" class="dr-summary__proceed-checkout dr-btn"><?php echo __('Proceed to checkout') ?></a>

	<?php endif; ?>


    <?php /*
    <div class="dr-summary__delivery delivery-info">

        <span class="delivery-info__icon"></span>

        <span class="delivery-info__text"><?php echo $delivery_info; ?></span>

    </div>
 */ ?>

</div>