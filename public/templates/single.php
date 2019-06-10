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
 * @subpackage DR_Express/public/templates
 */
?>

<?php get_header(); ?>

<div class="main-content" id="main">

    <div class="container">

        <div class="row">
            <div class="col clearfix">
                <?php dr_express_currency_toggler(); ?>
            </div>
        </div>

        <div class="row">

            <div class="col">
                <hr>
                <?php if ( have_posts() ) :
                    while ( have_posts() ) :
                        the_post();
                        dr_express_get_template_part( 'content', 'single' );
                    endwhile;
                    else :
                        dr_express_get_template_part( 'content', 'none' );
                    endif;
                ?>
            </div>

        </div>

    </div>

</div>

<?php get_footer(); ?>
