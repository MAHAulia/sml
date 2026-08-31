<div class="section-title">

	INFORMASI SURAT JALAN

</div>

<table class="info">

	<tr>

		<td width="18%"><b>No. Surat Jalan</b></td>

		<td width="32%">

			{{ $surat_jalan->code }}

		</td>

		<td width="18%"><b>Status</b></td>

		<td>

			{{ strtoupper($surat_jalan->status) }}

		</td>

	</tr>

	<tr>

		<td><b>Tanggal</b></td>

		<td>

			{{ $surat_jalan->created_at->format("d M Y H:i") }}

		</td>

		<td><b>Angkutan</b></td>

		<td>
			{{ strtoupper($surat_jalan->nopol) }}
		</td>

	</tr>

	<tr>

		<td><b>Kantor Asal</b></td>

		<td>

			{{ $surat_jalan->creator->office }}

		</td>

		<td><b>Kantor Tujuan</b></td>

		<td>

			{{ $surat_jalan->to }}

		</td>

	</tr>

	<tr>

		<td><b>Dibuat Oleh</b></td>

		<td>

			{{ $surat_jalan->creator->name }}

		</td>

		<td></td>

		<td>

		</td>

	</tr>

</table>
