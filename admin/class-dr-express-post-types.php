<?php
/**
 * Register post types and taxonomies of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/admin
 */

class DR_Express_Post_Types {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		add_action( 'admin_init', array( $this, 'set_default_category' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_product_details_meta_box' ) );
		add_action( 'save_post', array( $this, 'save_post_meta_data' ) );
		add_action( 'after-dr_product_category-table', array( $this, 'add_manage_categories_link' ) );
		add_action( 'dr_product_category_edit_form', array( $this, 'add_manage_categories_link' ) );
		add_filter( 'manage_dr_product_posts_columns', array( $this, 'add_custom_columns_to_product_list' ), 10, 1 );
		add_action( 'manage_dr_product_posts_custom_column', array( $this, 'add_value_to_custom_columns' ), 10, 2 );
		add_filter( 'manage_edit-dr_product_sortable_columns', array( $this, 'make_custom_columns_sortable' ), 10, 1 );
		add_action( 'pre_get_posts', array( $this, 'custom_columns_orderby' ), 10, 1 );
	}

	/**
	 * Register post types.
	 *
	 * @since    1.0.0
	 */
	public function register_post_types() {
		register_post_type(
			'dr_product',
			array(
				'labels' => array(
					'name' => __( 'DR Products', 'dr-express' ),
					'singular_name' => __( 'DR Product', 'dr-express' ),
					'all_items' => __( 'All Products', 'dr-express' ),
					'menu_name' => __( 'DR Products', 'dr-express' ),
					'add_new' => __( 'Add New', 'dr-express' ),
					'add_new_item' => __( 'Add new product', 'dr-express' ),
					'edit' => __( 'Edit', 'dr-express' ),
					'edit_item' => __( 'Edit product', 'dr-express' ),
					'new_item' => __( 'New product', 'dr-express' ),
					'view_item' => __( 'View product', 'dr-express' ),
					'view_items' => __( 'View products', 'dr-express' ),
					'search_items' => __( 'Search products', 'dr-express' ),
					'not_found' => __( 'No products found', 'dr-express' ),
					'not_found_in_trash' => __( 'No products found in trash', 'dr-express' )
				),
				'public' => true,
				'show_ui' => true,
				'show_in_menu' => true,
				'show_in_nav_menus' => true,
				'show_in_rest' => true,
				'rest_base' => 'dr_products',
				'menu_position' => 6,
				'publicly_queryable' => true,
				'exclude_from_search' => false,
				'hierarchical' => false,
				'query_var' => true,
				'has_archive' => true,
				'menu_icon' => 'dashicons-store',
				'capability_type' => 'post',
				'capabilities' => array(
					'create_posts' => 'do_not_allow'
				), // remove add new button
				'map_meta_cap' => true
			)
		);

		register_post_type(
			'dr_product_variation',
			array(
				'labels' => array(
					'name' => __( 'DR Variations', 'dr-express' ),
					'singular_name' => __( 'DR Variation', 'dr-express' ),
					'all_items' => __( 'All Variations', 'dr-express' ),
				),
				'public' => false,
				'show_in_rest' => true,
				'rest_base' => 'dr_products_variations',
				'hierarchical' => true,
				'query_var' => false,
				'has_archive' => false,
				'capability_type' => 'post',
				'capabilities' => array(
					'create_posts' => 'do_not_allow'
				),
			)
		);
	}

	/**
	 * Register taxonomies.
	 *
	 * @since    1.0.0
	 */
	public function register_taxonomies() {
		register_taxonomy(
			'dr_product_category',
			'dr_product',
			array(
				'labels' => array(
					'name' => __( 'DR Product Categories', 'dr-express' ),
					'singular_name' => __( 'Category', 'dr-express' ),
					'menu_name' => __( 'Categories', 'dr-express' ),
					'search_items' => __( 'Search categories', 'dr-express' ),
					'all_items' => __( 'All categories', 'dr-express' ),
					'parent_item' => __( 'Parent category', 'dr-express' ),
					'parent_item_colon' => __( 'Parent category:', 'dr-express' ),
					'edit_item' => __( 'Edit category', 'dr-express' ),
					'update_item' => __( 'Update category', 'dr-express' ),
					'add_new_item' => __( 'Add new category', 'dr-express' ),
					'new_item_name' => __( 'New category name', 'dr-express' ),
					'not_found' => __( 'No categories found', 'dr-express' ),
				),
				'hierarchical' => true,
				'show_ui' => true,
				'show_in_rest' => true,
				'rest_base' => 'dr_product_categories',
				'query_var' => true
			)
		);
	}

	/**
	 * Set default category.
	 *
	 * @since    1.0.0
	 */
	public function set_default_category() {
		$default_cat = array(
			'taxonomy' => 'dr_product_category',
			'cat_name' => 'Uncategorized',
			'category_nicename' => 'uncategorized',
			'category_parent' => ''
		);
		wp_insert_category( $default_cat );
	}

	/**
	 * Add meta box for product details.
	 *
	 * @since    1.0.0
	 */
	public function add_product_details_meta_box() {
		add_meta_box(
			'dr_product_details_box', // Unique ID
			__( 'Product Details', 'dr-express' ), // Box title
			array( $this, 'render_product_details_meta_box' ), // Content callback, must be of type callable
			'dr_product' // Post type
		);
	}

	/**
	 * Render meta box for product details.
	 *
	 * @since    1.0.0
	 */
	public function render_product_details_meta_box( $post ) {
		include_once 'partials/dr-express-product-details-meta-box.php';
	}

	/**
	 * Save meta data.
	 *
	 * @since    1.0.0
	 */
	public function save_post_meta_data( $post_id ) {
		$fields = [
			'gc_product_id'
		];
		foreach ( $fields as $field ) {
			if ( array_key_exists( $field, $_POST ) ) {
				update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
			}
		}
	}

	/**
	 * Add Manage Categories link.
	 *
	 * @since    1.0.0
	 */
	public function add_manage_categories_link() {
		echo '<p id="drcc-link"><a href="https://gc.digitalriver.com/gc/ent/site/selectSite.do?siteID=' . get_option( 'dr_express_site_id' ) . '" target="_blank">Manage Categories</a></p>';
	}

	/**
	 * Add custom columns to product list.
	 *
	 * @since    1.0.0
	 */
	public function add_custom_columns_to_product_list( $columns ) {
		$new_columns = array();
		foreach ( $columns as $key => $title ) {
			if ( $key === 'date' ) {
				$new_columns[ 'gc_product_id' ] = __( 'Product ID', 'dr-express' );
				$new_columns[ 'sku' ] = __( 'SKU', 'dr-express' );
			}
			$new_columns[ $key ] = $title;
		}
		return $new_columns;
	}

	/**
	 * Make custom columns sortable.
	 *
	 * @since    1.0.0
	 */
	public function make_custom_columns_sortable( $columns ) {
		$columns[ 'gc_product_id' ] = 'gc_product_id';
		$columns[ 'sku' ] = 'sku';
		return $columns;
	}

	public function custom_columns_orderby( $query ) {
		if ( ! is_admin() ) return;

		$orderby = $query->get( 'orderby' );

		if ( $orderby === 'gc_product_id' ) {
			$query->set( 'meta_key', 'gc_product_id' );
			$query->set( 'orderby', 'meta_value_num' );
		} elseif ( $orderby === 'sku' ) {
			$query->set( 'meta_key', 'sku' );
			$query->set( 'orderby', 'meta_value' );
		}
	}

	/**
	 * Add value to custom columns.
	 *
	 * @since    1.0.0
	 */
	public function add_value_to_custom_columns( $key, $post_id ) {
		switch ( $key ) {
			case 'gc_product_id':
				echo get_post_meta( $post_id, 'gc_product_id', true );
				break;
			case 'sku':
				echo get_post_meta( $post_id, 'sku', true );
				break;
		}
	}
}
