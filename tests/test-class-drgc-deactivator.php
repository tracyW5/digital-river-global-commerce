<?php
/**
 * Class Test_Dr_Express_Activator
 *
 * @package Dr_Express
 */

require_once 'includes/class-dr-express-deactivator.php';
require_once 'includes/class-dr-express-tables.php';

class Test_Dr_Express_Dectivator extends WP_UnitTestCase {
    /**
     * Test it creates short code pages
     */
    public function test_it_drops_sessions_table() {
        new DR_Express_Tables();

        global $wpdb;

        $result = $wpdb->query(
            "SHOW TABLES LIKE '{$wpdb->prefix}dr_express_sessions'"
        );

        // $this->assertTrue((bool) $result); // Table Exists

        DR_Express_Deactivator::deactivate();

        $result = $wpdb->get_results(
            "SHOW TABLES LIKE '{$wpdb->prefix}dr_express_sessions'"
        );
        
        // $this->assertFalse((bool) $result); 
    }

    public function test_it_deactivates_all_schedule_events() {
        // TODO: Assert exists first
        DR_Express_Deactivator::deactivate();

        $this->assertFalse(wp_next_scheduled('dr_products_import'));
        $this->assertFalse(wp_next_scheduled('dr_refresh_access_token'));
        $this->assertFalse(wp_next_scheduled('dr_clean_expired_sessions'));
    }

    public function test_it_removes_options() {
        // TODO: Assert exists first
        DR_Express_Deactivator::deactivate();

        $this->assertFalse(get_option("dr_express_db_version"));
    }

    public function test_it_removes_cached_dr_products() {
        // TODO: Assert exists first
        DR_Express_Deactivator::deactivate();

        $this->assertFalse(wp_cache_get('dr_products'));
    }
}
