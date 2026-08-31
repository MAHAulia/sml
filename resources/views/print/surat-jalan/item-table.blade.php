<div class="section-title">

	DAFTAR MANIFEST

</div>

<table>

	<thead>

		<tr>

			<th width="5%">No</th>

			<th width="20%">No Manifest</th>

		</tr>

	</thead>

	<tbody>

		@foreach ($surat_jalan->items as $i => $row)
			<tr>
				<td class="text-center">

					{{ $i + 1 }}

				</td>

				<td>
					{{ $row->manifest->code ?? "-" }}

				</td>

			</tr>
		@endforeach

	</tbody>

</table>
