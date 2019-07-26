<?php
/**
 * Render product import button.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/admin/partials
 */
?>

<?php if ( isset( $_GET['import-complete'] ) ) : ?>
    <div class="notice notice-success is-dismissible"><p><?php _e( 'Import Complete!' ); ?></p></div>
<?php endif; ?>

<div class="wrapImport">
    <noscript><p><em><?php _e( 'You must enable Javascript in order to proceed!', 'dr-express' ) ?></em></p></noscript>
    <div id="dr-data-process-progressbar"></div>
</div>
<div class="wrapImportControls">
    <p>
        Processing <span id="dr-data-process-counter">0</span> out of <span id="dr-data-process-total">many</span>
    </p>

    <button type="button" id="products-import-btn" class="button"><?php echo __( 'Import Products', 'dr-express' ); ?></button>
</div>
