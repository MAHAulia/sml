<table class="signature">

	<tr>

		<td>

			 
		</td>

		<td>

			{{ $surat_jalan->creator->office }}, {{ date("d-m-Y")}} <br />
			Dibuat Oleh <br /><br /><br /><br /><br />

			<div>{{ $surat_jalan->creator->name }}</div>
			<div class="line"></div>
            <div style="margin-top: -12px;"><strong>Kantor : {{ $surat_jalan->creator->office }}</strong></div>

		</td>

	</tr>

</table>
