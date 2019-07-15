<?php
/**
 * Checkout Shortcode
 *
 * Used on the checkout page, the checkout shortcode displays the checkout contents and other relevant pieces.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/includes/shortcodes
 */

defined( 'ABSPATH' ) || exit;

/**
 * Shortcode checkout class.
 */
class DR_Shortcode_Checkout {

	/**
	 * Output the checkout shortcode.
	 *
     * @since    1.0.0
     * @access   public
	 * @param array $atts Shortcode attributes.
	 */
	public static function output( $atts ) {
		$locales = get_option( 'dr_store_locales' );
		$cart = DR_Express()->cart->retrieve_cart();
		$customer = DR_Express()->shopper->retrieve_shopper();
		$usa_states = retrieve_usa_states();
		$steps_titles = apply_filters( 'dr_express_checkout_titles', array(
			'email'    => __( 'Email', 'dr_express' ),
			'shipping' => __( 'Shipping', 'information', 'dr_express' ),
			'billing'  => __( 'Billing', 'information', 'dr_express' ),
			'delivery' => __( 'Delivery', 'options', 'dr_express' ),
			'payment'  => __( 'Payment', 'dr_express' ),
		) );
		
		dr_get_template(
			'checkout/checkout.php',
			compact( 'cart', 'customer', 'usa_states', 'locales', 'steps_titles' )
		);
	}
}
