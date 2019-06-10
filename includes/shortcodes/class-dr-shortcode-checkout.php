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
		
		dr_get_template(
			'checkout/checkout.php',
			compact('cart', 'customer', 'usa_states', 'locales')
		);
	}
}
