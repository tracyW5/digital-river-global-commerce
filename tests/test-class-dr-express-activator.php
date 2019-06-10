<?php
/**
 * Class Test_Dr_Express_Activator
 *
 * @package Dr_Express
 */

require_once 'includes/class-dr-express-activator.php';
require_once 'includes/dr-express-core-functions.php';

class Test_Dr_Express_Activator extends WP_UnitTestCase {
    /**
     * Test it creates short code pages
     */
    public function test_it_adds_creates_shortcode_pages() {

        DR_Express_Activator::create_pages();

        $this->assertTrue(is_object(get_page_by_title('Cart')));
        $this->assertTrue(is_object(get_page_by_title('Checkout')));
        $this->assertTrue(is_object(get_page_by_title('Login')));
        $this->assertTrue(is_object(get_page_by_title('Thank You')));
    }
}
