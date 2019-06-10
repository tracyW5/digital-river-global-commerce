<?php
/**
 * Render product details meta box.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/admin/partials
 */
?>

<div class="meta-form-group">
    <h2 id="drcc-link"><a href="https://gc.digitalriver.com/gc/ent/site/selectSite.do?siteID=<?php echo get_option('dr_express_site_id') ?>" target="_blank">Manage Products</a></h2>
    <table class="form-table">
        <tbody>
        <tr>
            <th scope="row"> <label for="gc-product-id"><?php echo __( 'GC Product ID', 'dr-express' ); ?></label></th>
            <td><input type="text" class="regular-text" id="gc-product-id" name="gc_product_id" value="<?php echo esc_attr( get_post_meta( get_the_ID(), 'gc_product_id', true ) ); ?>" readonly /></td>
        </tr>
        <tr>
            <th scope="row"> <label for="ext-reference-id"><?php echo __( 'External Reference ID', 'dr-express' ); ?></label></th>
            <td><input type="text" class="regular-text" id="ext-reference-id" name="external_reference_id" value="<?php echo esc_attr( get_post_meta( get_the_ID(), 'external_reference_id', true ) ); ?>" readonly /></td>
        </tr>
        <tr>
            <th scope="row"> <label for="sku"><?php echo __( 'SKU', 'dr-express' ); ?></label></th>
            <td><input type="text" class="regular-text" id="sku" name="sku" value="<?php echo esc_attr( get_post_meta( get_the_ID(), 'sku', true ) ); ?>" readonly /></td>
        </tr>
        <tr>
            <th scope="row"> <label for="price"><?php echo __( 'Price', 'dr-express' ); ?></label></th>
            <td><input type="text" class="regular-text" id="price" name="price" value="<?php echo esc_attr( get_post_meta( get_the_ID(), 'price', true ) ); ?>" readonly /></td>
        </tr>
        <tr>
            <th scope="row"> <label for="short-description"><?php echo __( 'Short Description', 'dr-express' ); ?></label></th>
            <td><textarea id="short-description" class="large-text" rows="3" readonly><?php echo esc_attr( get_post_meta( get_the_ID(), 'short_description', true ) ); ?></textarea></td>
        </tr>
        <tr>
            <th scope="row"> <label for="long-description"><?php echo __( 'Long Description', 'dr-express' ); ?></label></th>
            <td><textarea id="long-description" class="large-text" rows="10" readonly><?php echo esc_attr( get_post_meta( get_the_ID(), 'long_description', true ) ); ?></textarea></td>
        </tr>
        <tr>
            <th scope="row"> <label for="thumbnail"><?php echo __( 'Thumbnail', 'dr-express' ); ?></label></th>
            <td><img src="<?php echo esc_url(get_post_meta( get_the_ID(), 'gc_thumbnail_url', true ) ); ?>" alt=""/></td>
        </tr>
        <tr>
            <th scope="row"> <label for="product-image"><?php echo __( 'Product Image', 'dr-express' ); ?></label></th>
            <td><img src="<?php echo esc_url( get_post_meta( get_the_ID(), 'gc_product_images_url', true ) ); ?>" alt=""/></td>
        </tr>
        </tbody>
    </table>
</div>
