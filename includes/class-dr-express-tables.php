<?php
/**
 * Create DB Tables for the needs of the plugin
 *
 * @package    DR_Express
 * @subpackage DR_Express/includes
 * @version 1.0.0
 */
class DR_Express_Tables {

	/**
	 * DR_Express_Tables constructor.
	 */
	public function __construct() {
		$this->sessions_table();
	}

	/**
	 * Create the sessions table
	 */
	public function sessions_table() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'dr_express_sessions';
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
					id bigint NOT NULL AUTO_INCREMENT,
					session_id char(32) NOT NULL,
					expires bigint unsigned NOT NULL,
					session_data longtext DEFAULT '' NOT NULL,
					PRIMARY KEY (id),
					UNIQUE KEY session_id (session_id)
				) $charset_collate;";

		// This examines the current table structure.
		// It's used for both creating and updating the database table.
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

		// Add version for the table. Useful when updating
		add_option( 'dr_express_db_version', '1.0.0' );
	}
}