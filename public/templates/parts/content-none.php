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
 * @subpackage DR_Express/public/templates/parts
 */
?>

<section class="no-results not-found">
    <h2 class="entry-title">
        <?php _e( 'Nothing Found', 'dr-express' ); ?>
    </h2>
    <div class="entry-content">
        <?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>
            <p><?php printf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'dr-express' ), esc_url( admin_url( 'post-new.php' ) ) ); ?></p>
        <?php elseif ( is_search() ) : ?>
            <p><?php _e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'dr-express' ); ?></p>
            <?php get_search_form(); ?>
        <?php else : ?>
            <p><?php _e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'dr-express' ); ?></p>
            <?php get_search_form(); ?>
        <?php endif; ?>
    </div>
</section>
