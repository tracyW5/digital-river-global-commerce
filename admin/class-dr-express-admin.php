<?php
/**
 * Admin-specific functionality
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/admin
 */

class DR_Express_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $dr_express
	 */
	private $dr_express;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version
	 */
	private $version;

	/**
	 * The plugin name
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string     $plugin_name
	 */
	private $plugin_name = 'dr-express';

	/**
	 * The option name to be used in this plugin
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string     $option_name
	 */
	private $option_name = 'dr_express';

	/**
	 * site ID
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string
	 */
	private $dr_express_site_id;

	/**
	 * API key
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string
	 */
	private $dr_express_api_key;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $dr_express
	 * @param      string    $version
	 */
	public function __construct( $dr_express, $version, $dr_ajx ) {
		$this->dr_express = $dr_express;
		$this->version = $version;
		$this->dr_ajx = $dr_ajx;
		$this->dr_express_site_id = get_option( 'dr_express_site_id' );
		$this->dr_express_api_key = get_option( 'dr_express_api_key' );
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->dr_express, PLUGIN_URL . 'assets/css/dr-express-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		wp_enqueue_script( $this->dr_express, PLUGIN_URL . 'assets/js/dr-express-admin' . $suffix . '.js', array( 'jquery', 'jquery-ui-progressbar' ), $this->version, false );

		// transfer dr-express options from PHP to JS
		wp_localize_script( $this->dr_express, 'dr_object',
			array(
				'api_key'               => $this->dr_express_api_key,
				'site_id'               => $this->dr_express_site_id,
				'dr_ajx_instance_id'    => $this->dr_ajx->instance_id,
				'ajax_url'              => admin_url( 'admin-ajax.php' ),
				'ajax_nonce'            => wp_create_nonce( 'dr_express_ajx' ),
			)
		);
	}

	/**
	 * Add settings menu and link it to settings page.
	 *
	 * @since    1.0.0
	 */
	public function add_settings_page() {
		add_menu_page(
			__( 'DR Express Settings', 'dr-express' ),
			__( 'DR Express', 'dr-express' ),
			'manage_options',
			'dr-express',
			array( $this, 'display_settings_page' ),
			'dashicons-screenoptions',
			100
		);
	}

	/**
	 * Render settings page.
	 *
	 * @since    1.0.0
	 */
	public function display_settings_page() {
		// Double check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		include_once 'partials/dr-express-admin-display.php';
	}

	/**
	 * Register settings fields.
	 *
	 * @since    1.0.0
	 */
	public function register_settings_fields() {

		add_settings_section(
			$this->option_name . '_general',
			__( 'Please setup your Digital River data here.', 'dr-express' ),
			array( $this, $this->option_name . '_general_cb' ),
			$this->plugin_name
		);

		add_settings_field(
			$this->option_name . '_site_id',
			__( 'Site ID', 'dr-express' ),
			array( $this, $this->option_name . '_site_id_cb' ),
			$this->plugin_name,
			$this->option_name . '_general',
			array( 'label_for' => $this->option_name . '_site_id' )
		);

		add_settings_field(
			$this->option_name . '_api_key',
			__( 'API Key', 'dr-express' ),
			array( $this, $this->option_name . '_api_key_cb' ),
			$this->plugin_name,
			$this->option_name . '_general',
			array( 'label_for' => $this->option_name . '_api_key' )
		);

		add_settings_field(
			$this->option_name . '_domain',
			__( 'Domain', 'dr-express' ),
			array( $this, $this->option_name . '_domain_cb' ),
			$this->plugin_name,
			$this->option_name . '_general',
			array( 'label_for' => $this->option_name . '_domain' )
		);

		add_settings_field(
			$this->option_name . '_digitalRiver_key',
			__( 'Digital River Plugin Key', 'dr-express' ),
			array( $this, $this->option_name . '_digitalRiver_key_cb' ),
			$this->plugin_name,
			$this->option_name . '_general',
			array( 'label_for' => $this->option_name . '_digitalRiver_key' )
		);

		add_settings_field(
			$this->option_name . '_cron_handler',
			__( 'Scheduled Products Import', 'dr-express' ),
			array( $this, $this->option_name . '_cron_handler_cb' ),
			$this->plugin_name,
			$this->option_name . '_general',
			array( 'label_for' => $this->option_name . '_cron_handler' )
		);

		add_settings_section(
			$this->option_name . '_extra',
			'',
			array( $this, $this->option_name . '_extra_cb' ),
			$this->plugin_name
		);

		register_setting( $this->plugin_name, $this->option_name . '_site_id', array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ) );
		register_setting( $this->plugin_name, $this->option_name . '_api_key', array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ) );
		register_setting( $this->plugin_name, $this->option_name . '_domain', array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ) );
		register_setting( $this->plugin_name, $this->option_name . '_digitalRiver_key', array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ) );
		register_setting( $this->plugin_name, $this->option_name . '_cron_handler', array( 'sanitize_callback' => array( $this, 'dr_sanitize_checkbox' ), 'default' => '' ) );
	}

	/**
	 * Render the text for the general section.
	 *
	 * @since  1.0.0
	 */
	public function dr_express_general_cb() {
		echo '<p>' . __( 'Please change the settings accordingly.', 'dr-express' ) . '</p>';
	}

	/**
	 * Render the text for the extra section.
	 *
	 * @since  1.0.0
	 */
	public function dr_express_extra_cb() {
		echo '<p class="description">' . __( 'Please contact your account representative for assistance with these settings.', 'dr-express' ) . '</p>';
	}

	/**
	 * Render input text field for Site ID.
	 *
	 * @since    1.0.0
	 */
	public function dr_express_site_id_cb() {
		$site_id = get_option( $this->option_name . '_site_id' );
		echo '<input type="text" class="regular-text" name="' . $this->option_name . '_site_id' . '" id="' . $this->option_name . '_site_id' . '" value="' . $site_id . '"> ';
	}

	/**
	 * Render input text field for API Key.
	 *
	 * @since    1.0.0
	 */
	public function dr_express_api_key_cb() {
		$api_key = get_option( $this->option_name . '_api_key' );
		echo '<input type="text" class="regular-text" name="' . $this->option_name . '_api_key' . '" id="' . $this->option_name . '_api_key' . '" value="' . $api_key . '"> ';
	}

	/**
	 * Render input text field for domain setting.
	 *
	 * @since    1.0.0
	 */
	public function dr_express_domain_cb() {
		$domain = get_option( $this->option_name . '_domain' );
		echo '<input type="text" class="regular-text" name="' . $this->option_name . '_domain' . '" id="' . $this->option_name . '_domain' . '" value="' . $domain . '"> ';
	}

	/**
	 * Render input text field for DigitalRiver Plugin
	 *
	 * @since    1.0.0
	 */
	public function dr_express_digitalRiver_key_cb() {
		$digitalRiver_key = get_option( $this->option_name . '_digitalRiver_key' );
		echo '<input type="text" class="regular-text" name="' . $this->option_name . '_digitalRiver_key' . '" id="' . $this->option_name . '_digitalRiver_key' . '" value="' . $digitalRiver_key . '"> ';
	}

	/**
	 * Render checkbox field for enabling scheduled import
	 *
	 * @since    1.0.0
	 */
	public function dr_express_cron_handler_cb() {
		$option = get_option( $this->option_name . '_cron_handler' );
		$checked = '';
		
		if ( is_array( $option ) && $option['checkbox'] === '1' ) {
			$checked = 'checked="checked"';
		}

		echo '<input type="checkbox" class="regular-text" name="' . $this->option_name . '_cron_handler[checkbox]" id="' . $this->option_name . '_cron_handler" value="1" ' . $checked . ' />';
		echo '<span class="description" id="cron-description">' . __( 'Twice daily product synchronization with GC.', 'dr-express' ) . '</span>';
	}

	public function dr_sanitize_checkbox( $input ) {
		$new_input['checkbox'] = trim( $input['checkbox'] );
		return $new_input;
	}

	/**
	 * Render button of products import.
	 *
	 * @since    1.0.0
	 */
	public function render_products_import_button( $views ) {
		include_once PLUGIN_DIR . 'admin/partials/dr-express-products-import-btn.php';
		return $views;
	}

	/**
	 * Delete associated variations when a DR product is being deleted
	 * Note: This fires when the user empties the Trash
	 *
	 * @param $postid
	 */
	public function clean_variations_on_product_deletion( $postid ) {
		if ( get_post_type( $postid ) != 'dr_product' ) {
			return;
		}

		$variations = dr_get_product_variations( $postid );

		if ( $variations ) {
			foreach ( $variations as $variation ) {
				wp_delete_post( $variation->ID, true );
			}
		}
	}
}
