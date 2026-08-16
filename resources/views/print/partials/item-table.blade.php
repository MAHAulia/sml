<div class="section-title">

	DAFTAR @if ($manifest->type == "linehaul")
		KANTONG
	@else
		BARANG
	@endif

</div>

<table>

	<thead>

		<tr>

			<th width="5%">No</th>

			<th width="20%">
				@if ($manifest->type == "linehaul")
					Kode Kantong
				@else
					Resi/Barcode
				@endif
			</th>

			@if ($manifest->type != "linehaul")
				<th>Nama Barang</th>
			@endif

			<th width="10%">Status</th>

			<th width="18%">Tanggal</th>

		</tr>

	</thead>

	<tbody>

		@foreach ($manifest->items as $i => $row)
			<tr>
				<td class="text-center">

					{{ $i + 1 }}

				</td>

				<td>

					@if ($manifest->type == "linehaul")
						{{ $row->item->code ?? "-" }}
					@else
						{{ $row->item->order_number ?? "-" }}
					@endif

				</td>
				@if ($manifest->type != "linehaul")
					<td>

						{{ $row->item->isiKiriman ?? "ITEM " . $row->item_id }}

					</td>
				@endif

				<td class="text-center">

					@if ($manifest->type == "linehaul")
						{{ strtoupper($row->item->status) }}
					@else
						{{ strtoupper($row->status) }}
					@endif

				</td>

				<td class="text-center">

					{{ $row->created_at->format("d/m/Y H:i") }}

				</td>

			</tr>
		@endforeach

	</tbody>

</table>
