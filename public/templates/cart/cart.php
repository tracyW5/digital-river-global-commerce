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

<div class="dr-cart-wrapper" id="dr-cart-page-wrapper">
    <form class="dr-cart-wrapper__content dr-cart">

        <section class="dr-cart__content">

            <div class="dr-cart__products">
                
                <?php if ( 1 < count($cart['cart']['lineItems'] )) : ?>
                    <?php foreach ($cart['cart']['lineItems']['lineItem'] as $line_item): ?>
                        <?php include PLUGIN_DIR . 'public/templates/cart/cart-product.php'; ?>
                    <?php endforeach; ?>
                <?php else: ?>
                    <?php echo __( 'Your cart is empty.', 'dr-express' ); ?>
                <?php endif; ?>

            </div>

            <div class="dr-cart__estimate" id="cart-estimate">
                
                <?php dr_express_currency_toggler(); ?>

                <?php include_once PLUGIN_DIR . 'public/templates/cart/cart-summary.php'; ?>

            </div>

        </section>

        <section class="dr-cart__actions-bottom">

            <a href="<?php echo get_post_type_archive_link( 'dr_product' ); ?>" class="continue-shopping"><?php echo __( 'Continue Shopping', 'dr-express' ); ?></a>

        </section>
        
    </form>

</div>
