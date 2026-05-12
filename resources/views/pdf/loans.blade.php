<!DOCTYPE html>
<html>
<head>
    <title>Laporan Peminjaman Alat</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            text-transform: uppercase;
            font-weight: bold;
        }
        .status {
            text-transform: uppercase;
            font-weight: bold;
            font-size: 10px;
        }
        .footer {
            margin-top: 50px;
            text-align: right;
            font-style: italic;
        }
        .meta {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan Peminjaman Alat & Bahan</h2>
        <p>TKJ PINJAM ALAT SYSTEM</p>
    </div>

    <div class="meta">
        <p>Dicetak pada: {{ $date }}</p>
        <p>Total Data: {{ count($loans) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Peminjam</th>
                <th>Barang & Jumlah</th>
                <th>Tgl Pinjam</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($loans as $index => $loan)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>TRX-{{ str_pad($loan->id, 5, '0', STR_PAD_LEFT) }}</td>
                <td>
                    <strong>{{ $loan->user ? $loan->user->name : $loan->borrower_name }}</strong><br>
                    <small>{{ $loan->user ? $loan->user->nisn : $loan->class }}</small>
                </td>
                <td>
                    @foreach($loan->items as $item)
                        - {{ $item->name }} ({{ $item->pivot->quantity }})<br>
                    @endforeach
                </td>
                <td>{{ \Carbon\Carbon::parse($loan->loan_date)->format('d M Y') }}</td>
                <td>
                    <span class="status">{{ $loan->status }}</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Mengetahui,</p>
        <br><br><br>
        <p>Admin Lab TKJ</p>
    </div>
</body>
</html>
