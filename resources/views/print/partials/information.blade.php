<div class="section-title">

	INFORMASI MANIFEST

</div>

<table class="info">

	<tr>

		<td width="18%"><b>Manifest No</b></td>

		<td width="32%">

			{{ $manifest->code }}

		</td>

		<td width="18%"><b>Status</b></td>

		<td>

			{{ strtoupper($manifest->status) }}

		</td>

	</tr>

	<tr>

		<td><b>Tanggal</b></td>

		<td>

			{{ $manifest->created_at->format("d M Y H:i") }}

		</td>

		<td><b>Jenis</b></td>

		<td>

			{{ strtoupper($manifest->type) }}

		</td>

	</tr>

	<tr>

		<td><b>Dari</b></td>

		<td>

			{{ $manifest->from }}

		</td>

		<td><b>Ke</b></td>

		<td>

			{{ $manifest->to }}

		</td>

	</tr>

	<tr>

		<td><b>Office</b></td>

		<td>

			{{ $manifest->office_from }}

		</td>

		<td><b>Office Tujuan</b></td>

		<td>

			{{ $manifest->office_to }}

		</td>

	</tr>

	<tr>

		<td><b>PIC Pengirim</b></td>

		<td>

			{{ $manifest->creator->name }}

		</td>

		<td><b>PIC Penerima</b></td>

		<td>

			{{ optional($manifest->receiver)->name ?? "-" }}

		</td>

	</tr>

</table>
