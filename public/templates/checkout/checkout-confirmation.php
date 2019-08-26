<div class="dr-checkout__confirmation dr-checkout__el d-none">

    <p>
        <?php echo __( 'Please review your order details and place your order below.' ); ?>
    </p>
    
    <hr style="margin-top: -5px">

    <form id="checkout-confirmation-form" action="<?php echo esc_url( drgc_get_page_link( 'thank-you' ) ); ?>" method="post">
        <input type="hidden" name="order_id">
        <button type="submit" class="dr-btn">
            <?php echo __( 'Place Order' ); ?>
        </button>
    </form>

    <div id="dr-checkout-err-field" class="invalid-feedback" >Specifed method not supported for the card</div>        

</div>
