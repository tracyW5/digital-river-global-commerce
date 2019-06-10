<?php
/**
 * Thank you Shortcode
 *
 * Used on the Thank you page, the Thank you shortcode displays the Thank you contents and other relevant pieces.
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
class DR_Shortcode_Thank_You {

	/**
	 * Output the cart shortcode.
	 *
     * @since    1.0.0
     * @access   public
	 * @param array $atts Shortcode attributes.
	 */
	public static function output( $atts ) {
		$order = DR_Express()->cart->retrieve_order();
		
		dr_get_template(
			'thank-you/thank-you.php',
			array(
				'order'  => $order,
			)
		);
	}
}
