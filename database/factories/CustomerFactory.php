<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake('id_ID')->name(),
            'phone' => substr(fake('id_ID')->phoneNumber(), 0, 15), // limit to 15 chars
            'email' => fake()->unique()->safeEmail(),
            'address' => substr(fake('id_ID')->address(), 0, 250), // limit to 250 chars
        ];
    }
}
