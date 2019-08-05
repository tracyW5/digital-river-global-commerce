<?php
use function GuzzleHttp\json_encode;

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    Digital_River_Global_Commerce
 * @subpackage Digital_River_Global_Commerce/public
 */

class DRGC_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $drgc    The ID of this plugin.
	 */
	private $drgc;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $drgc       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $drgc, $version ) {
		$this->drgc = $drgc;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in DRGC_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The DRGC_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->drgc, plugin_dir_url( __FILE__ ) . '../assets/css/drgc-public.min.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		wp_enqueue_script( $this->drgc, PLUGIN_URL . 'assets/js/drgc-public' . $suffix . '.js', array( 'jquery' ), $this->version, false );

		if ( is_page( 'checkout' ) ) {
			wp_enqueue_script( 'digital-river-js', 'https://js.digitalriver.com/v1/DigitalRiver.js', array( $this->drgc ), null, true );
			wp_enqueue_script( 'paypal-checkout-js', 'https://www.paypalobjects.com/api/checkout.js', array( $this->drgc ), null, true );
		}

		$access_token = '';
		if ( DRGC()->authenticator ) {
			$access_token = DRGC()->authenticator->get_token();
		}

		$cart_obj = '';
		if ( DRGC()->cart ) {
			$cart_obj = DRGC()->cart->retrieve_cart();
		}

    //test Order Handler
    $testOrder_option = get_option( 'drgc_testOrder_handler' );
		$testOrder_enable = ( is_array( $testOrder_option ) && '1' == $testOrder_option['checkbox'] )  ? "true" : "false";

		// transfer drgc options from PHP to JS
		$options = array(
			'wpLocale'          =>  get_locale(),
			'drLocale'          =>  get_dr_locale( get_locale() ),
			'ajaxUrl'           =>  admin_url( 'admin-ajax.php' ),
			'cartUrl'           =>  drgc_get_page_link( 'cart' ),
			'checkoutUrl'	      =>  drgc_get_page_link( 'checkout' ),
			'siteID'            =>  get_option( 'drgc_site_id' ),
			'apiKey'            =>  get_option( 'drgc_api_key' ),
			'domain'            =>  get_option( 'drgc_domain' ),
			'digitalRiverKey'   =>  get_option( 'drgc_digitalRiver_key' ),
			'accessToken'       =>  $access_token,
			'cart'              =>  $cart_obj,
			'thankYouEndpoint'  =>  esc_url( drgc_get_page_link( 'thank-you' ) ),
			'isLogin'              =>  drgc_get_user_status(),
			'payPal'            =>  array (
				'sourceId' => isset( $_GET['sourceId'] ) ? $_GET['sourceId'] : false,
				'failure' => isset( $_GET['ppcancel'] ) ? $_GET['ppcancel'] : false,
				'success' => isset ( $_GET['ppsuccess'] ) ? $_GET['ppsuccess'] : false,
      ),
      'testOrder' => $testOrder_enable,
		);

		wp_localize_script( $this->drgc, 'drgc_params', $options );
	}

	public function ajax_attempt_auth() {
		$plugin = DRGC();

		if ( (isset( $_POST['username'] ) && isset( $_POST['password'] )) ) {
			$username = sanitize_text_field( $_POST['username'] );
			$password = sanitize_text_field( $_POST['password'] );

			$user = wp_authenticate( $username, $password );

			if ( is_wp_error( $user ) ) {
				wp_send_json_error( __( 'Authorization failed for specified credentials' ) );
			}

			$attempt = $plugin->shopper->generate_access_token_by_login_id( $username, $password );
		}

		if ( array_key_exists( 'error', $attempt ) ) {
			wp_send_json_error( $attempt );
		}

		if ( array_key_exists( 'access_token', $attempt ) ) {
			$plugin->session->dirty_set_session( $_COOKIE['drgc_session'] );

			wp_send_json_success( $attempt );
		}
	}

	public function dr_signup_ajax() {
		$plugin = DRGC();

		if ( (isset( $_POST['username'] ) && isset( $_POST['password'] )) ) {
			$email = sanitize_text_field( $_POST['username'] );
			$password = sanitize_text_field( $_POST['password'] );

			$plugin->session->dirty_set_session( $_COOKIE['drgc_session'] );

			$parts_name = '';
			$parts = explode( "@",$email );
			$username = $parts[0];
			$delimiters = array( '.', '-', '_' );

			foreach ( $delimiters as $delimiter ) {
				if ( strpos( $username, $delimiter ) ) {
					$parts_name = explode( $delimiter, $username );
					break;
				}
			}
			if ( ! empty( $parts_name ) ) {
				$first_name = ucfirst( strtolower( $parts_name[0] ) );
				$last_name = ucfirst( strtolower( $parts_name[1] ) );
			} else {
				$first_name = ucfirst( strtolower( $username ) );
				$last_name = ucfirst( strtolower( $username ) );
			}

			if ( 6 > strlen( $password )) {
				wp_send_json_error( __( 'Password is too short, at least 6 symbols required' ) );
				return;
			}

			// Attemp WP user store
			$userdata = array(
				'user_login'  => $email,
				'user_pass'   => $password,
				'user_email'  => $email,
				'first_name'  => $first_name,
				'last_name'   => $last_name,
				'role'        => 'subscriber'
			);

			$user_id = wp_insert_user( $userdata ) ;
			$externalReferenceId = md5(uniqid( $user_id, true ));

			add_user_meta( $user_id, '_external_reference_id', $externalReferenceId);

			if ( is_wp_error( $user_id ) ) {
				wp_send_json_error( $user_id->get_error_message() );
				return;
			}

			$attempt = $plugin->shopper->create_shopper( $email, $password, $first_name, $last_name, $email, $externalReferenceId );

			if ( ! is_null( $attempt ) && array_key_exists( 'errors', $attempt ) ) {
				wp_delete_user( $user_id );
				wp_send_json_error( $attempt );
			} else {
				$user = wp_authenticate( $email, $password );

				if ( is_wp_error( $user ) ) {
					wp_send_json_error( $user );
				}

				$attempt = $plugin->shopper->generate_access_token_by_login_id($email, $password);
				wp_send_json_success( $attempt );
			}
		} else {
			wp_send_json_error();
		}
	}

	public function dr_logout_ajax() {
		$plugin = DRGC();
		$plugin->shopper = null;
		$plugin->session->dirty_set_session( $_COOKIE['drgc_session'] );
		$plugin->session->clear_session();
		wp_send_json_success();
	}

	/**
	 * Ajax handles sending password retrieval email to user.
	 */
	function dr_send_email_reset_pass_ajax() {
		$errors = new WP_Error();

		$email = sanitize_text_field( $_POST['email'] );
		if ( empty( $email ) || ! is_string( $email ) ) {
			$errors->add( 'empty_username', __( 'Enter a username or email address.' ) );
		} elseif ( strpos( $email, '@' ) ) {
			$user_data = get_user_by( 'email', wp_unslash( $email ) );
			if ( empty( $user_data ) ) {
				$errors->add( 'invalid_email', __( 'There is no account with that username or email address.' ) );
			}
		} else {
			$user_data = get_user_by( 'login', $email );
		}

		/**
		 * Fires before errors are returned from a password reset request.
		 */
		do_action( 'lostpassword_post', $errors );
		if ( $errors->has_errors() ) {
			wp_send_json_error($errors);
		}
		if ( ! $user_data ) {
			$errors->add( 'invalidcombo', __( 'There is no account with that username or email address.' ) );
			wp_send_json_error($errors);
		}

		// Redefining user_login ensures we return the right case in the email.
		$user_login = $user_data->user_login;
		$user_email = $user_data->user_email;
		$key        = get_password_reset_key( $user_data );

		if ( is_wp_error( $key ) ) {
			wp_send_json_error($key);
		}
		if ( is_multisite() ) {
			$site_name = get_network()->site_name;
		} else {
			/*
			* The blogname option is escaped with esc_html on the way into the database
			* in sanitize_option we want to reverse this for the plain text arena of emails.
			*/
			$site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
		}

		$message = __( '<p> Someone has requested a password reset for the following account:' ) . "</p><br>";
		$message .= sprintf( __( '<p> Site Name: %s' ), $site_name ) . "<br>";
		$message .= sprintf( __( 'Username: %s' ), $user_login ) . "</p><br>";
		$message .= __( '<p> If this was a mistake, just ignore this email and nothing will happen.' ) . "<br>";
		$message .= __( 'To reset your password, visit the following address:' ) . "</p><br>";
		$message .= '<a href="' . drgc_get_page_link( 'login'  ) . "?action=rp&key=$key&login=" . rawurlencode( $user_login ) . "\">\r\n";
		$message .=  __( 'Reset Password</a>');

		$title = sprintf( __( '[%s] Password Reset' ), $site_name );

		/**
		 * Filters the subject of the password reset email.
		 */
		$title = apply_filters( 'retrieve_password_title', $title, $user_login, $user_data );

		/**
		 * Filters the message body of the password reset mail.
		 * If the filtered message is empty, the password reset email will not be sent.
		 */
		$message = apply_filters( 'retrieve_password_message', $message, $key, $user_login, $user_data );
		add_filter( 'wp_mail_content_type', function( $content_type ) { return 'text/html'; });

		if ( $message && ! wp_mail( $user_email, wp_specialchars_decode( $title ), $message ) ) {
			wp_die( __( 'The email could not be sent. Possible reason: your host may have disabled the mail() function.' ) );
		}

		wp_send_json_success();
	}

	/**
	 * Reset user password AJAX
	 */
	public function dr_reset_password_ajax() {
		$password = sanitize_text_field( $_POST['password'] );
		$confirm = sanitize_text_field( $_POST['confirm-password'] );
		$key = sanitize_text_field( $_POST['key'] );
		$login = urldecode( sanitize_text_field( $_POST['login'] ) );

		if (
			empty( $password ) || ! is_string( $password ) ||
			empty( $key ) || ! is_string( $key ) ||
			empty( $login ) || ! is_string( $login )
		) {
			wp_send_json_error( __( 'Something went wrong' ) );
		}

		$user = check_password_reset_key( $key, $login );

		// Check if key is valid
		if ( is_wp_error( $user ) ) {
			if ( $user->get_error_code() === 'expired_key' ){
				wp_send_json_error( __( 'Expired key' ) );
			} else {
				wp_send_json_error( __( 'Invalid key' ) );
			}
		}

		// check if keys match
		if ( isset( $password ) && $password !== $confirm ) {
			wp_send_json_error( __( 'Passwords do not match' ) );
			return;
		}

		if ( 6 > strlen( $password ) ) {
			wp_send_json_error( __( 'Password is too short, at least 6 symbols required' ) );
			return;
		}

		reset_password($user, $password);
		wp_send_json_success();
	}

	/**
	 * Get permalink by product ID for AJAX usage.
	 *
	 * @since  1.0.0
	 */
	public function ajax_get_permalink_by_product_id() {
		$product_id = isset( $_POST['productID'] ) ? intval( $_POST['productID'] ) : NULL;

		if ( $product_id ) {
			$products = get_posts(
				array(
					'post_type'     => 'dr_product',
					'meta_key'      => 'gc_product_id',
					'meta_value'    => $product_id
				)
			);

			if ( ! empty( $products ) ) {
				echo get_permalink( $products[0]->ID );
			}
		}

		echo '#';
		die();
	}

	/**
	 * Hide sidebar when, subscriber is authenticated
	 */

	public function remove_admin_bar() {
		if ( ! current_user_can( 'administrator' ) && ! is_admin() ) {
			show_admin_bar( false );
		}
		// if ( ! current_user_can( 'manage_optins' )  ) {
		// 	add_filter('show_admin_bar', '__return_false');
		// }
	}

	/**
	 * Render minicart on header.
	 *
	 * @since  1.0.0
	 */
	public function minicart_in_header( $content ) {
		if ( !is_page( 'cart' ) && !is_page( 'checkout' ) && !is_page( 'thank-you' ) ) {
			ob_start();
			include_once 'partials/minicart.php';
			$append = ob_get_clean();
			return $content . $append;
		}
		return $content;
	}

	/**
	 * Render the full page by overwriting template.
	 *
	 * @since  1.0.0
	 */
	public function overwrite_template( $template ) {
		$theme = wp_get_theme();
		if ( 'Digital River' != $theme->name ) {
			if ( is_singular( 'dr_product' ) ) {
				$template = PLUGIN_DIR . 'public/templates/single.php';
			} else if ( is_post_type_archive( 'dr_product' ) || is_tax( 'dr_product_category' ) ) {
				$template = PLUGIN_DIR . 'public/templates/archive.php';
			}
		}
		return $template;
	}

	public function send_smtp_email( $phpmailer ) {
		$phpmailer->isSMTP();
		$phpmailer->Host       = 'smtp.mailtrap.io';
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Port       = 2525;
		$phpmailer->Username   = '8c0d84a880f6b1';
		$phpmailer->Password   = 'ab951668e78885';
  }

	public function add_legal_link() {
		if ( is_page( 'cart' ) || is_page( 'checkout' ) || is_page( 'thank-you' ) ) {
			include_once 'partials/drgc-legal-footer.php';
    }
	}
}
