<?php
/**
 * Cart Shortcode
 *
 * Used on the cart page, the cart shortcode displays the cart contents and other relevant pieces.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/includes/shortcodes
 */

defined( 'ABSPATH' ) || exit;

/**
 * Shortcode cart class.
 */
class DR_Shortcode_Cart {

	/**
	 * Output the cart shortcode.
	 *
     * @since    1.0.0
     * @access   public
	 * @param array $atts Shortcode attributes.
	 */
	public static function output( $atts ) {
		$cart = DR_Express()->cart->retrieve_cart();
		$locales = get_option( 'dr_store_locales' );

		dr_get_template(
			'cart/cart.php',
			compact('cart', 'locales')
		);
	}
}
