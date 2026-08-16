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

			{{ $bag->items->count() }}

		</td>

		<td class="text-center">

			{{ strtoupper($bag->status) }}

		</td>
	</tr>

</table>
