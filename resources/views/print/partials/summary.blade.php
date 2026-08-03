<div class="section-title">

RINGKASAN

</div>

<table>

<tr>

<th>Total Item</th>

<th>Status</th>

<th>Manifest Type</th>

</tr>

<tr>

<td class="text-center">

{{ $manifest->items->count() }}

</td>

<td class="text-center">

{{ strtoupper($manifest->status) }}

</td>

<td class="text-center">

{{ strtoupper($manifest->type) }}

</td>

</tr>

</table>