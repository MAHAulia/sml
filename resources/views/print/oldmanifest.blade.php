<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manifest {{ $manifest['code'] }}</title>

    <style>
        @page {
            size: A4;
            margin: 15mm;
        }

        body{
            font-family: Arial, Helvetica, sans-serif;
            font-size:12px;
            color:#000;
        }

        h1,h2,h3,h4,h5{
            margin:0;
        }

        table{
            width:100%;
            border-collapse:collapse;
        }

        .header{
            margin-bottom:20px;
        }

        .company{
            font-size:20px;
            font-weight:bold;
        }

        .manifest-title{
            text-align:right;
        }

        .manifest-title h2{
            font-size:24px;
        }

        .section{
            margin-top:20px;
        }

        .info td{
            padding:4px;
        }

        .table{
            margin-top:10px;
        }

        .table th,
        .table td{
            border:1px solid #000;
            padding:8px;
        }

        .table th{
            background:#f2f2f2;
        }

        .footer{
            margin-top:60px;
        }

        .signature{
            width:33%;
            text-align:center;
        }

        .line{
            margin-top:60px;
            border-top:1px solid #000;
            width:180px;
            display:inline-block;
        }

    </style>

</head>
<body>

<!-- ================= HEADER ================= -->

<table class="header">
    <tr>

        <td width="60%">
            <div class="company">
                YOUR COMPANY
            </div>

            <div>
                Warehouse Management System
            </div>
        </td>

        <td width="40%" class="manifest-title">

            <h2>MANIFEST</h2>

            <strong>{{ $manifest['code'] }}</strong>

        </td>

    </tr>
</table>

<hr>

<!-- ================= INFORMATION ================= -->

<div class="section">

    <table class="info">

        <tr>
            <td width="20%"><strong>Manifest No</strong></td>
            <td width="30%">: {{ $manifest['code'] }}</td>

            <td width="20%"><strong>Status</strong></td>
            <td width="30%">: {{ strtoupper($manifest['status']) }}</td>
        </tr>

        <tr>
            <td><strong>Date</strong></td>
            <td>: {{ \Carbon\Carbon::parse($manifest['created_at'])->format('d M Y H:i') }}</td>

            <td><strong>Type</strong></td>
            <td>: {{ strtoupper($manifest['type']) }}</td>
        </tr>

        <tr>
            <td><strong>From</strong></td>
            <td>: {{ $manifest['from'] }}</td>

            <td><strong>To</strong></td>
            <td>: {{ $manifest['to'] }}</td>
        </tr>

        <tr>
            <td><strong>Office From</strong></td>
            <td>: {{ $manifest['office_from'] }}</td>

            <td><strong>Office To</strong></td>
            <td>: {{ $manifest['office_to'] }}</td>
        </tr>

        <tr>
            <td><strong>Created By</strong></td>
            <td>: {{ $manifest['creator']['name'] }}</td>

            <td><strong>Receiver</strong></td>
            <td>: {{ $manifest['receiver']['name'] ?? '-' }}</td>
        </tr>

    </table>

</div>

<!-- ================= ITEM ================= -->

<div class="section">

    <h3>ITEM LIST</h3>

    <table class="table">

        <thead>

        <tr>
            <th width="5%">No</th>
            <th width="20%">Item ID</th>
            <th>Status</th>
            <th width="25%">Created At</th>
        </tr>

        </thead>

        <tbody>

        @forelse($manifest['items'] as $index => $item)

            <tr>

                <td align="center">
                    {{ $index + 1 }}
                </td>

                <td align="center">
                    {{ $item['item_id'] }}
                </td>

                <td align="center">
                    {{ strtoupper($item['status']) }}
                </td>

                <td align="center">
                    {{ \Carbon\Carbon::parse($item['created_at'])->format('d-m-Y H:i') }}
                </td>

            </tr>

        @empty

            <tr>

                <td colspan="4" align="center">
                    No Item
                </td>

            </tr>

        @endforelse

        </tbody>

    </table>

</div>

<!-- ================= SUMMARY ================= -->

<div class="section">

    <table>

        <tr>

            <td width="70%"></td>

            <td width="30%">

                <table class="table">

                    <tr>
                        <td><strong>Total Item</strong></td>
                        <td align="center">{{ count($manifest['items']) }}</td>
                    </tr>

                </table>

            </td>

        </tr>

    </table>

</div>

<!-- ================= SIGNATURE ================= -->

<table class="footer">

    <tr>

        <td class="signature">

            Sender

            <div class="line"></div>

            <br>

            {{ $manifest['creator']['name'] }}

        </td>

        <td class="signature">

            Courier

            <div class="line"></div>

        </td>

        <td class="signature">

            Receiver

            <div class="line"></div>

            <br>

            {{ $manifest['receiver']['name'] ?? '' }}

        </td>

    </tr>

</table>

</body>
</html>