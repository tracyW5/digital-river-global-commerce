<?php
/**
 * Render variations area.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/admin/partials
 */
$variations = dr_get_product_variations( get_the_ID() );
?>
<?php if ( $variations ) : ?>
    <fieldset>
        <legend><span><?php echo __( 'Variations', 'dr-express' ); ?></span></legend>
        <table class="data-table">
            <thead>
                <tr>
                    <th><?php echo __( 'ID', 'dr-express' ); ?></th>
                    <th><?php echo __( 'Internal Variation Name', 'dr-express' ); ?></th>
                    <th><?php echo __( 'Variation Attributes', 'dr-express' ); ?></th>
                </tr>
            </thead>
            <tbody>
            <?php 
                foreach ( $variations as $variation ) {
                    $base_variation_attributes = get_post_meta( get_the_ID(), 'variation_attributes', true );
                    $varying_attribute_array = [];

                    foreach ($base_variation_attributes as $key => $value) {
                        if ( $value === 'productType' ) {
                            $base_variation_attributes[$key] = 'product_type';
                        }

                        $attr = get_post_meta( $variation->ID, $base_variation_attributes[$key], true );

                        if ( ! empty( $attr ) ) {
                            array_push( $varying_attribute_array, $attr );
                        }
                    }
            ?>
                    <tr>
                        <td><a href="<?php echo admin_url( 'post.php?post=' . $variation->ID . '&action=edit' ) ?>"><?php echo esc_attr( get_post_meta( $variation->ID, 'gc_product_id', true ) ) ?></a></td>
                        <td><?php echo esc_attr( $variation->post_title ) ?></td>
                        <td><?php echo esc_attr( implode( ', ', $varying_attribute_array) ) ?></td>
                    </tr>
            <?php
                }
            ?>
            </tbody>
        </table>
    </fieldset>
<?php endif; ?>