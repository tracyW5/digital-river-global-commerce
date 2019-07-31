<?php
/**
 * Digital River Global Commerce
 *
 * @link              https://www.digitalriver.com
 * @since             1.0.0
 * @package           Digital_River_Global_Commerce
 *
 * @wordpress-plugin
 * Plugin Name:       Digital River Global Commerce
 * Plugin URI:        https://www.digitalriver.com
 * Description:       The Digital River Global Commerce plugin from Digital River allows you to easily integrate with Digital River's Global Commerce platform
 * Version:           1.0.0
 * Author:            Digital River
 * Author URI:        https://www.digitalriver.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       digital-river-global-commerce
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
    die;
}

/**
 * Current Plugin Version
 */
define( 'DRGC_VERSION', '1.0.0.' . time() );
define( 'PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin Activation
 */
function activate_drgc() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-drgc-activator.php';
    DRGC_Activator::activate();
}

/**
 * Plugin Deactivation
 */
function deactivate_drgc() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-drgc-deactivator.php';
    DRGC_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_drgc' );
register_deactivation_hook( __FILE__, 'deactivate_drgc' );

/**
 * Core Plugin Class
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-drgc.php';

/**
 * Returns the main instance of DRGC
 */
function DRGC() {
	return DRGC::instance();
}

/**
 * Initialization
 */
function run_drgc() {
    $plugin = new DRGC();
    $plugin->run();
}

run_drgc();
