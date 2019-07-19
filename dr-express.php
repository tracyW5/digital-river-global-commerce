<?php
/**
 * Digital River for WordPress
 *
 * @link              https://www.digitalriver.com
 * @since             1.0.0
 * @package           DR_Express
 *
 * @wordpress-plugin
 * Plugin Name:       Digital River for WordPress
 * Plugin URI:        https://www.digitalriver.com
 * Description:       The Digital River for WordPress plugin from Digital River allows you to easily integrate with Digital River's Global Commerce platform
 * Version:           1.0.0
 * Author:            Digital River
 * Author URI:        https://www.digitalriver.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       dr-express
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
    die;
}

/**
 * Current Plugin Version
 */
define( 'DR_EXPRESS_VERSION', '1.0.0.' . time() );
define( 'PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin Activation
 */
function activate_dr_express() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-dr-express-activator.php';
    DR_Express_Activator::activate();
}

/**
 * Plugin Deactivation
 */
function deactivate_dr_express() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-dr-express-deactivator.php';
    DR_Express_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_dr_express' );
register_deactivation_hook( __FILE__, 'deactivate_dr_express' );

/**
 * Core Plugin Class
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-dr-express.php';

/**
 * Returns the main instance of DR_Express
 */
function DR_Express() {
	return DR_Express::instance();
}

/**
 * Initialization
 */
function run_dr_express() {
    $plugin = new DR_Express();
    $plugin->run();
}

run_dr_express();
