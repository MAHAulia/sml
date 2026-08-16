<div class="section-title">

	DAFTAR BARANG

</div>

<table>

	<thead>

		<tr>

			<th width="5%">No</th>

			<th width="20%">Resi/Barcode</th>

			<th>Nama Barang</th>

			<th width="10%">Status</th>

			<th width="18%">Tanggal</th>

		</tr>

	</thead>

	<tbody>

		@foreach ($bag->items as $i => $row)
			<tr>
				<td class="text-center">

					{{ $i + 1 }}

				</td>

				<td>

					{{ $row->item->order_number ?? "-" }}

				</td>
				<td>
                    
					{{ $row->item->isiKiriman ?? "ITEM " . $row->item_id }}

				</td>

				<td class="text-center">

					{{ strtoupper($row->status) }}

				</td>

				<td class="text-center">

					{{ $row->created_at->format("d/m/Y H:i") }}

				</td>

			</tr>
		@endforeach

	</tbody>

</table>
