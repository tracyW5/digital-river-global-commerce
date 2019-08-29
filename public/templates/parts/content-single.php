<?php
/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    Digital_River_Global_Commerce
 * @subpackage Digital_River_Global_Commerce/public/templates/parts
 */

$product_image = get_post_meta( get_the_ID(), 'gc_product_images_url', true );
$short_description = get_post_meta( get_the_ID(), 'short_description', true );
$long_description = get_post_meta( get_the_ID(), 'long_description', true );

$gc_id = get_post_meta( get_the_ID(), 'gc_product_id', true );
$purchasable = get_post_meta( get_the_ID(), 'purchasable', true );

$variations = drgc_get_product_variations( get_the_ID() );
if ( $variations && isset( $variations[0] ) ) {
  //sort variation array  by sale price here!
  $variations_sort = array();
  foreach ( $variations as $variation ){
    $var_pricing = drgc_get_product_pricing( $variation->ID );
    $variation->sort_pricing = $var_pricing['sale_price_value'];
    array_push($variations_sort,$variation);
  }
  usort($variations_sort, function($a, $b){
    return bccomp($a->sort_pricing, $b->sort_pricing);
  });
  $variations = $variations_sort;
	$gc_id = get_post_meta( $variations[0]->ID, 'gc_product_id', true );
	$pricing = drgc_get_product_pricing( $variations[0]->ID );
	$product_image = get_post_meta( $variations[0]->ID, 'gc_product_images_url', true );
} else {
	$pricing = drgc_get_product_pricing( get_the_ID() );

}
$list_price_value = isset( $pricing['list_price_value'] ) ? $pricing['list_price_value'] : '';
$sale_price_value = isset( $pricing['sale_price_value'] ) ? $pricing['sale_price_value'] : '';
$price = isset( $pricing['price'] ) ? $pricing['price'] : '';
$regular_price = isset( $pricing['regular_price'] ) ? $pricing['regular_price'] : '';
?>

<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="row">
        <div class="col-12 col-md-6">
            <img src="<?php echo $product_image ?>" alt="<?php the_title_attribute() ?>"/>
        </div>

        <div class="col-12 col-md-6">
		    <?php the_title( '<h1 class="entry-title dr-pd-title">', '</h1>' ); ?>
            <div class="dr-pd-content">
			    <?php if ( $short_description ) { ?>
                    <p class="dr-pd-short-desc"><?php echo $short_description; ?></p>
			    <?php } ?>
			    <?php the_content(); ?>

          <?php
          if ( $variations ) :
				    $var_type = '';
				    if ( ! empty( get_post_meta( get_the_ID(), 'color', true ) ) ) {
					    $var_type = 'color';
				    } else if ( ! empty( get_post_meta( get_the_ID(), 'sizes', true ) ) ) {
					    $var_type = 'sizes';
				    } else if ( ! empty( get_post_meta( get_the_ID(), 'duration', true ) ) ) {
					    $var_type = 'duration';
				    }
				    ?>
                    <h6><?php echo __( 'Select ', 'digital-river' ) . ucfirst( $var_type ) . ':'; ?></h6>

                    <div class="dr_prod-variations">

                        <select name="dr-variation" >
                <?php foreach ( $variations as $variation ) :
							    $var_gc_id = get_post_meta( $variation->ID, 'gc_product_id', true );
							    $variation_type = get_post_meta( $variation->ID, $var_type, true );
                  $var_pricing = drgc_get_product_pricing( $variation->ID );
							    ?>
                                <option value="<?php echo $var_gc_id; ?>"
                                        data-price="<?php echo isset( $var_pricing['price'] ) ? $var_pricing['price'] : ''; ?>"
                                        data-regular-price="<?php echo isset( $var_pricing['regular_price'] ) ? $var_pricing['regular_price'] : $var_pricing['price']; ?>"
                                        data-sale-price-value="<?php echo isset( $var_pricing['sale_price_value'] ) ? $var_pricing['sale_price_value'] : ''; ?>"
                                        data-list-price-value="<?php echo isset( $var_pricing['list_price_value'] ) ? $var_pricing['list_price_value'] : ''; ?>"
                                >
                    <?php
                      if(ucwords( $variation_type) != ""){
                        echo ucwords( $variation_type);
                      }else{
                        echo $variation->post_name;
                      }
                    ?>
                                </option>
						    <?php endforeach; ?>
                        </select>

                    </div>
			    <?php endif; ?>

                <form id="dr-pd-form">
                    <div class="dr-pd-price-wrapper" id="dr-pd-price-wrapper">

					    <?php if ( (float) $list_price_value > (float) $sale_price_value ) : ?>
                            <p class="dr-pd-price">
                                <del class="dr-strike-price">
								    <?php echo $regular_price; ?>
                                </del>
                                <span class="dr-sale-price">
                                <strong><?php echo $price; ?></strong>
                            </span>
                            </p>
					    <?php else: ?>
                            <p class="dr-pd-price">
                                <strong><?php echo $price; ?></strong>
                            </p>
					    <?php endif; ?>

                    </div>
                    <div class="dr-pd-qty-wrapper">
                    <span class="dr-pd-qty-minus" style="background-image: url('<?php echo get_site_url(); ?>/wp-content/plugins/digital-river-global-commerce/assets/images/product-minus.svg');" >
                    </span>
                        <input type="number" class="dr-pd-qty no-spinners" id="dr-pd-qty" step="1" min="1" max="999" value="1" maxlength="5" size="2" pattern="[0-9]*" inputmode="numeric"/>
                        <span class="dr-pd-qty-plus"  style="background-image: url('<?php echo DRGC_PLUGIN_URL; ?>assets/images/icons-plus.svg');" >
                    </span>
                    </div>
                    <p>
                        <button type="button" class="dr-btn dr-buy-btn" data-product-id="<?php echo $gc_id; ?>" <?php echo 'true' !== $purchasable ? 'disabled' : ''; ?> >
						    <?php echo __( 'Add to Cart', 'digital-river-global-commerce'); ?>
                        </button>
                    </p>
                </form>
            </div>
        </div>


    </div>

    <div class="row">
        <div class="col">
	        <?php if ( $long_description ) { ?>
                <section class="dr-pd-info">
                    <div class="dr-pd-long-desc">
				        <?php echo $long_description; ?>
                    </div>
                </section>
	        <?php } ?>
        </div>
        <section id="dr-pd-offers"></section>
    </div>

</div>
