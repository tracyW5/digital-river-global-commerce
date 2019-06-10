<?php
/**
 * Class Test_Dr_Express_Tables
 *
 * @package Dr_Express
 */

require_once 'includes/class-dr-express-tables.php';

class Test_Dr_Express_Tables extends WP_UnitTestCase {
    
    /**
     * Test it creates session table
     */
    public function test_it_creates_session_table() {
        new DR_Express_Tables();

        global $wpdb;

		$result = $wpdb->query(
            $wpdb->prepare(
                "SELECT count(*)
                FROM information_schema.TABLES
                WHERE (TABLE_SCHEMA = %s) AND (TABLE_NAME = %s)",
                $wpdb->prefix . 'dr_express_sessions',
                $wpdb->dbname
            )
        );
        
        $this->assertTrue((bool) $result);
    }
}
