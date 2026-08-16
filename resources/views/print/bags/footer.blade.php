<div class="footer">

PT CNB LOGISTIK

|

Manifest :

{{ $bag->code }}

|

Dicetak :

{{ now()->format('d/m/Y H:i') }}

|

Halaman

<script type="text/php">
if(isset($pdf)){
    $x = 520;
    $y = 815;
    $text = "Page {PAGE_NUM} of {PAGE_COUNT}";
    $font = $fontMetrics->get_font("Arial");
    $size = 9;
    $pdf->page_text($x,$y,$text,$font,$size);
}
</script>

</div>