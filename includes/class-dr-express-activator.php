<?php
/**
 * Fired during plugin activation
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/includes
 */

class DR_Express_Activator {

	/**
	 * On plugin activated.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		self::create_pages();
		new DR_Express_Tables();
	}

	/**
	 * Create pages that the plugin relies on and stores their ID for reference
	 */
	public static function create_pages() {
		$pages = array(
			'cart' => array(
				'post_name'     => __( 'cart', 'dr-express' ),
				'post_title'    => __( 'Cart', 'dr-express' ),
				'post_content'  => '<!-- wp:shortcode -->[dr-cart]<!-- /wp:shortcode -->',
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_author'    => 1,
			),
            'checkout' => array(
		    	'post_name'     => __( 'checkout', 'dr-express' ),
			    'post_title'    => __( 'Checkout', 'dr-express' ),
			    'post_content'  => '<!-- wp:shortcode -->[dr-checkout]<!-- /wp:shortcode -->',
			    'post_type'      => 'page',
			    'post_status'    => 'publish',
			    'post_author'    => 1,
		    ),
			'login' => array(
				'post_name'     => __( 'login', 'dr-express' ),
				'post_title'    => __( 'Login', 'dr-express' ),
				'post_content'  => '<!-- wp:shortcode -->[dr-login]<!-- /wp:shortcode -->',
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_author'    => 1,
            ),
            'thank-you' => array(
				'post_name'     => __( 'thank-you', 'dr-express' ),
				'post_title'    => __( 'Thank You', 'dr-express' ),
				'post_content'  => '<!-- wp:shortcode -->[dr-thank-you]<!-- /wp:shortcode -->',
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_author'    => 1,
			),
		);

		foreach ( $pages as $key => $page ) {
			dr_create_page_and_reference( $page, 'dr_express_page_id_' . $key );
		}
	}
}
