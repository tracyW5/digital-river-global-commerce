jQuery(document).ready(($) => {
    if ($('.dr-thank-you-wrapper').length) {
        $(document).on('click', '#print-button', function() {
            var printContents = $('.dr-thank-you-wrapper').html();
            var originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        });
    }
});