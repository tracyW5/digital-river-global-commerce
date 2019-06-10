<?php
/**
 * Login Shortcode
 *
 * Used on the login page, the login shortcode displays the login contents and other relevant pieces.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/includes/shortcodes
 */

defined( 'ABSPATH' ) || exit;

/**
 * Shortcode login class.
 */
class DR_Shortcode_Login {

	/**
	 * Output the login shortcode.
	 *
     * @since    1.0.0
     * @access   public
	 * @param array $atts Shortcode attributes.
	 */
	public static function output( $atts ) {
		$customer = DR_Express()->shopper->retrieve_shopper();
		
		dr_get_template(
			'login/login.php',
			array(
				'customer'  => $customer,
			)
		);
	}
}