<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Customer;
use App\Models\Kantor;
use App\Models\Offering;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        // Create Users
        $users = User::factory()->count(5)->create();

        // Create Customers
        $customers = Customer::factory()->count(5)->create();

        // Create Offerings
        $offerings = Offering::factory()->count(10)->create([
            'user_id' => 3,
            'customer_id' => 1,
            'pickuper_id' => 5,
        ]);

        Kantor::create([
            'code' => "SMG",
            'name' => 'Kantor Semarang',
            'address' => 'Jl. Semarang No. 1',
            'phone' => '081234567892',
        ]);

        Kantor::create([
            'code' => "BDG",
            'name' => 'Kantor Bandung',
            'address' => 'Jl. Bandung No. 1',
            'phone' => '081234567891',
        ]);

        // Create Transactions
        foreach ($offerings as $offering) {
            Transaction::create([
                'offering_id' => $offering->id,
                'user_id' => 3,
                'customer_id' => 1,
                'pickuper_id' => 5,

                'order_number' => 'ORD-' . rand(1000, 9999),

                'senderName' => $offering->senderName,
                'senderPhone' => $offering->senderPhone,
                'senderAddress' => $offering->senderAddress,

                'receiverName' => $offering->receiverName,
                'receiverPhone' => $offering->receiverPhone,
                'receiverAddress' => $offering->receiverAddress,

                'total_item' => rand(1, 10),
                'p' => rand(10, 100),
                'l' => rand(10, 100),
                't' => rand(10, 100),
                'weight' => rand(1, 20),

                'isiKiriman' => 'Sample Item',
                'catatan' => 'Seeder data',

                'status' => 'accepted',
                'pickup_status' => 'success_pickup',
                'outgoing_status' => 'null',
                'delivery_status' => 'null',
                'shipment_status' => 'on_hold',

                'bag_id' => null,
                'manifest_id' => null,
            ]);
        }
    }
}