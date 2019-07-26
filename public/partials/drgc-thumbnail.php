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

<div class="pd-item-thumbnail">
    <img src="<?php echo get_post_meta( get_the_ID(), 'gc_thumbnail_url', true ); ?>" alt="">
</div>
