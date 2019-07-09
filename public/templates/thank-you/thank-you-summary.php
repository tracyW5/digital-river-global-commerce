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
// $subtotal_items = $order['order']['totalItemsInCart'];

$subtotal_items = 0;

if ( isset( $order['order'] ) ) {
    foreach( $order['order']['lineItems']['lineItem'] as $lineItem) {
        $subtotal_items += $lineItem['quantity'];
    }
}

$subtotal_items_text = $subtotal_items > 1 ? __('items') : __('item');
$subtotal_value = $order['order']['pricing']['formattedSubtotal'] ?? '';
$tax_value = $order['order']['pricing']['formattedTax'] ?? '';
$shipping_price_value = ($order['order']['pricing']['shipping']['value'] ?? '') === 0 ? 'FREE' : ($order['order']['pricing']['formattedShipping'] ?? '');
$discount = $order['order']['pricing']['incentive']['value'];
$formatted_discount = $order['order']['pricing']['formattedIncentive'];
$total_value = $order['order']['pricing']['formattedTotal'] ?? '';
// $delivery_info = 'Delivery in 2-5 working days and extended 30 days return period';
?>


<div class="dr-summary__subtotal">
    <input id="dr-total-float" type="hidden" value="<?php echo $cart['cart']['pricing']['orderTotal']['value'] ?>">
    <p class="subtotal-label"><?php echo __('Subtotal') . ' - (' .  $subtotal_items . ' ' . $subtotal_items_text . ')' ?></p>

    <p class="subtotal-value"><?php echo $subtotal_value; ?></p>
</div>

<div class="dr-summary__tax">

    <p class="item-label"><?php echo __('Tax') ?></p>

    <p class="item-value"><?php echo $tax_value; ?></p>

</div>

<div class="dr-summary__shipping">

    <p class="item-label"><?php echo __('Shipping') ?></p>

    <p class="item-value"><?php echo $shipping_price_value; ?></p>

</div>

<div class="dr-summary__discount" <?php if ( $discount === 0 ) echo 'style="display: none;"' ?>>

    <p class="discount-label"><?php echo __('Discount') ?></p>

    <p class="discount-value"><?php echo '-' . $formatted_discount; ?></p>

</div>

<div class="dr-summary__total">

    <p class="total-label"><?php echo __('Total') ?></p>

    <p class="total-value"><?php echo $total_value; ?></p>

</div>
