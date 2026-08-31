<div class="section-title">

	RINGKASAN

</div>

<table>

	<tr>

		<th>Total Item</th>

		<th>Status</th>
	</tr>

	<tr>

		<td class="text-center">

			{{ $surat_jalan->items->count() }}

		</td>

		<td class="text-center">

			{{ strtoupper($surat_jalan->status) }}

		</td>
	</tr>

</table>
