<table class="signature">

	<tr>

		<td>

			Diserahkan Oleh <br /><br /><br /><br /><br />

			<div>{{ $manifest->creator->name }}</div>
			<div class="line"></div>
            <div style="margin-top: -12px;"><strong>{{ $manifest->from }}</strong></div>

		</td>

		<td>

			Diterima Oleh <br /><br /><br /><br /><br />

			<div>{{ optional($manifest->receiver)->name }}</div>
			<div class="line"></div>
            <div style="margin-top: -12px;"><strong>{{ $manifest->to }}</strong></div>
		</td>

	</tr>

</table>
