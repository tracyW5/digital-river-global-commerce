<?php
/**
 * Fired during plugin deactivation
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/includes
 */

class DR_Express_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */

	public static function deactivate() {
	    global $wpdb;

	    //clear scheduled events by the plugin
		wp_clear_scheduled_hook( 'dr_products_import' );
		wp_clear_scheduled_hook( 'dr_refresh_access_token' );
        wp_clear_scheduled_hook( 'dr_clean_expired_sessions' );

        //Drop session table
        $table_name = $wpdb->prefix . 'dr_express_sessions';
        $wpdb->query(
            "DROP TABLE IF EXISTS $table_name"
        );
        delete_option("dr_express_db_version");

        //delete cache
		wp_cache_delete( 'dr_products' );
	}
}
