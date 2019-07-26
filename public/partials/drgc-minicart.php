<?php
/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    DR_Express
 * @subpackage DR_Express/public/partials
 */
?>

<li class="dr-minicart"> <a href="#" class="dr-minicart-toggle">
    <span class="dr-minicart-count">0</span><span>&nbsp;ITEM(S)</span></a>
    <div class="dr-minicart-display" style="display: none;">
        <div class="dr-minicart-header">
            <h4 class="dr-minicart-title"><?php echo __( 'Shopping Cart', 'dr-express'); ?></h4>
            <button type="button" class="dr-minicart-close-btn">×</button>
        </div>
    </div>
</li>
