@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
@elseif (trim($slot) === 'NSS Board')
<img src="{{ asset('logo.svg') }}" class="logo" alt="{{env("APP_NAME")}}">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
