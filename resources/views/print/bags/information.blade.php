<div class="section-title">

	INFORMASI MANIFEST

</div>

<table class="info">

	<tr>

		<td width="18%"><b>Bag No</b></td>

		<td width="32%">

			{{ $bag->code }}

		</td>

		<td width="18%"><b>Status</b></td>

		<td>

			{{ strtoupper($bag->status) }}

		</td>

	</tr>

	<tr>

		<td><b>Tanggal</b></td>

		<td>

			{{ $bag->created_at->format("d M Y H:i") }}

		</td>

		<td></td>

		<td>

			

		</td>

	</tr>	

	<tr>

		<td><b>Kantor Asal</b></td>

		<td>

			{{ $bag->office }}

		</td>

		<td><b>Kantor Tujuan</b></td>

		<td>

			{{ $bag->office_to }}

		</td>

	</tr>

	<tr>

		<td><b>Dibuat Oleh</b></td>

		<td>

			{{ $bag->creator->name }}

		</td>

		<td></td>

		<td>

			

		</td>

	</tr>

</table>
