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

<?php
$pricing = dr_get_product_pricing( get_the_ID() );

$product_image = get_post_meta( get_the_ID(), 'gc_product_images_url', true );
$list_price = isset( $pricing['list_price_value'] ) ? $pricing['list_price_value'] : '';
$sale_price = isset( $pricing['sale_price_value'] ) ? $pricing['sale_price_value'] : '';
$price = isset( $pricing['price'] ) ? $pricing['price'] : '';

$gc_id = get_post_meta( get_the_ID(), 'gc_product_id', true );
$purchasable = get_post_meta( get_the_ID(), 'purchasable', true );

$variations = dr_get_product_variations( get_the_ID() );
if ( $variations && isset( $variations[0] ) ) {
	$gc_id = get_post_meta( $variations[0]->ID, 'gc_product_id', true );
}

?>

<div class="dr-pd-item">
    <a href="<?php echo get_permalink(); ?>">
        <div class="dr-pd-item-thumbnail">
            <img src="<?php echo $product_image ?>" alt="<?php the_title_attribute() ?>"/>
        </div>

        <?php the_title( '<h3 class="dr-pd-item-title">', '</h3>' ); ?>

        <?php if ( (int) $list_price > (int) $sale_price ) : ?>
            <p class="dr-pd-price dr-pd-item-price">
                <del class="dr-strike-price">
                    <?php echo $list_price; ?>
                </del>
                <span class="dr-sale-price">
                    <?php echo $price; ?>
                </span>
            </p>
        <?php else: ?>
            <p class="dr-pd-price dr-pd-item-price">
                <?php echo $price; ?>
            </p>
        <?php endif; ?>

        <button type="button" class="dr-btn dr-buy-btn" data-product-id="<?php echo $gc_id; ?>" <?php echo 'true' !== $purchasable ? 'disabled' : ''; ?>>
            <?php echo __( 'Add to Cart', 'dr-express'); ?>
        </button>

        <?php the_content(); ?>
    </a>
</div>
