<table class="header-table">

	<tr>

		<td width="20%">

			<img src="{{ public_path("logo.svg") }}" height="100">

		</td>

		<td class="text-center" width="60%">

			<h2 style="margin:0">

				PT CNB LOGISTIK

			</h2>

			Warehouse Management System

			<br>

			<b>MANIFEST @if ($manifest->type == "linehaul")
				KANTONG
			@else
				KIRIMAN
			@endif</b>

		</td>

		<td class="text-center" width="20%">

			{!! DNS2D::getBarcodeHTML($manifest->code, "QRCODE", 2, 2) !!}

		</td>

	</tr>

</table>

<hr style="margin-top: -15px; margin-bottom: 5px;">
