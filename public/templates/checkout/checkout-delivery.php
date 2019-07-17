<?php
$standart_price = '$0.00';
$standart_estimated_arrival = 'Apr 08 - Apr 11';
$express_price = '$10.00';
$express_estimated_arrival = 'Apr 09, 2019';
$overnight_price = '$20.00';
$overnight_estimated_arrival = 'Apr 08, 2019';

$result = 'Standard $0.00';

?>

<div class="dr-checkout__delivery dr-checkout__el">

    <button class="dr-accordion">
        
        <span class="dr-accordion__name">

            <span class="dr-accordion__title-long">

                <?php echo isset( $steps_titles['delivery'] ) ? $steps_titles['delivery'] : ''; ?>

            </span>

            <span class="dr-accordion__title-short">

                <?php echo __( 'Delivery' ); ?>

            </span>
            

        </span>

       <span class="dr-accordion__edit">Edit></span>
  
        
    </button>

    <form id="checkout-delivery-form" class="dr-panel-edit dr-panel-edit--delivery">

        <div class="dr-panel-edit__el">
<!-- 
            <div class="field-radio">

                <input type="radio" id="radio-standart" name="selector" value="standart">

                <label for="radio-standart">

                    <span>

                        <?php echo __( 'Standart' ); ?>

                    </span>

                    <span class="black">

                        <?php echo __( $standart_price ); ?>

                    </span>

                    <span class="smoller">

                        <?php echo __( 'Estimated Arrival:' ); ?>
                        
                    </span>

                    <span class="black">

                        <?php echo __( $standart_estimated_arrival ); ?>
                    
                    </span>

                </label>

            </div> -->

            <!-- <div class="field-radio">

                <input type="radio" id="radio-express" name="selector" value="express">

                <label for="radio-express">

                    <span>

                        <?php echo __( 'Express' ); ?>

                    </span>

                    <span class="black">

                        <?php echo __( $express_price ); ?>

                    </span>

                    <span class="smoller">
                        
                        <?php echo __( 'Estimated Arrival:' ); ?>
                        
                    </span>

                    <span class="black">
                        
                        <?php echo __( $express_estimated_arrival ); ?>
                    
                    </span>

                </label>

            </div> -->

            <!-- <div class="field-radio">

                <input type="radio" id="radio-overnight" name="selector" value="overnight">

                <label for="radio-overnight">

                    <span>

                        <?php echo __( 'Overnight' ); ?>
                    
                    </span>

                    <span class="black">
                        
                        <?php echo __( $overnight_price ); ?>
                    
                    </span>

                    <span class="smoller">
                        
                        <?php echo __( 'Estimated Arrival:' ); ?>
                    
                    </span>

                    <span class="black">
                        
                        <?php echo __( $overnight_estimated_arrival ); ?>
                    
                    </span>

                </label>

            </div> -->

        </div>

        <div id="checkout-delivery-form-msg" class="dr-panel-edit__info delivery-info"></div>

        <button type="submit" class="dr-panel-edit__btn dr-btn">
            
            <?php echo __( 'Save and continue' ); ?>
            
        </button>

    </form>

    <div class="dr-panel-result">
        
        <p class="dr-panel-result__text">

            <?php echo $result ?>

        </p>

    </div>

</div>