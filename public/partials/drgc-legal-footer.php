<?php
/**
 * Provide a public-legal footer for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://www.digitalriver.com
 * @since      1.0.0
 *
 * @package    Digital_River_Global_Commerce
 * @subpackage Digital_River_Global_Commerce/public/partials
 */
?>

<div class="container dr-legal-footer text-center">
  <p class="dr-legalResellerStatement"><a class="dr-aboutDigitalRiver" href="https://store.digitalriver.com/store/defaults/<?php echo get_dr_locale( get_locale() );?>/DisplayDRAboutDigitalRiverPage" target="_blank">Digital River, Inc.</a><?php echo __( ' is the authorized reseller and merchant of the products and services offered within this store.' ); ?></p>
  <p class="dr-legalPolicyLinks"><a class="dr-privacyPolicy" href="https://store.digitalriver.com/store/defaults/<?php echo get_dr_locale( get_locale() );?>/DisplayDRPrivacyPolicyPage" target="_blank"><?php echo __( 'Privacy Policy' ); ?></a><a class="dr-termsAndConditions" href="https://store.digitalriver.com/store/defaults/<?php echo get_dr_locale( get_locale() );?>/DisplayDRTermsAndConditionsPage" target="_blank"><?php echo __( 'Terms of Sale' );?></a></p>
</div>