<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Offering>
 */
class OfferingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'senderName' => fake()->name(),
            'senderPhone' => fake()->phoneNumber(),
            'senderAddress' => fake()->address(),

            'receiverName' => fake()->name(),
            'receiverPhone' => fake()->phoneNumber(),
            'receiverAddress' => fake()->address(),

            'total_item' => rand(1, 5),
            'p' => rand(10, 50),
            'l' => rand(10, 50),
            't' => rand(10, 50),
            'weight' => rand(1, 10),

            'isiKiriman' => fake()->word(),
            'catatan' => fake()->sentence(),

            'status' => 'accepted',
            'pickup_status' => 'success_pickup',
        ];
    }
}
