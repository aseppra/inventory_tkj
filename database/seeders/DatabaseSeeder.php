<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'TKJ Admin Unit',
            'email' => 'admin@tkj.sch.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'class' => 'VLAN-10 / Server Room A',
        ]);

        // Student User
        User::create([
            'name' => 'Budi Setiawan',
            'email' => 'budi@student.sch.id',
            'password' => Hash::make('password'),
            'role' => 'student',
            'nisn' => '009283741',
            'class' => 'XII TKJ 1',
        ]);

        $categories = [
            ['name' => 'Networking Gear', 'slug' => 'networking'],
            ['name' => 'Server Units', 'slug' => 'servers'],
            ['name' => 'Field Tools', 'slug' => 'tools'],
            ['name' => 'Cables', 'slug' => 'cables'],
        ];

        foreach ($categories as $cat) {
            $category = Category::create($cat);

            if ($cat['slug'] === 'networking') {
                Item::create([
                    'category_id' => $category->id,
                    'name' => 'Cisco Catalyst 2960',
                    'slug' => Str::slug('Cisco Catalyst 2960'),
                    'serial_number' => 'FOC1532X01A',
                    'description' => '24-Port Managed Switch, PoE+ Support, Layer 2.',
                    'stock' => 15,
                    'location' => 'RACK-01-A',
                    'status' => 'available',
                ]);

                Item::create([
                    'category_id' => $category->id,
                    'name' => 'MikroTik CCR1036',
                    'slug' => Str::slug('MikroTik CCR1036'),
                    'serial_number' => 'MK-111122-CC',
                    'description' => 'Carrier grade router with 36 core Tilera CPU.',
                    'stock' => 5,
                    'location' => 'RACK-02-B',
                    'status' => 'available',
                ]);
            }

            if ($cat['slug'] === 'servers') {
                Item::create([
                    'category_id' => $category->id,
                    'name' => 'Dell PowerEdge R740',
                    'slug' => Str::slug('Dell PowerEdge R740'),
                    'serial_number' => 'DELL-XR-990',
                    'description' => 'Virtualization Server, 128GB RAM, 2x Xeon Gold.',
                    'stock' => 2,
                    'location' => 'SRV-DL-02',
                    'status' => 'in_use',
                ]);
            }

            if ($cat['slug'] === 'tools') {
                Item::create([
                    'category_id' => $category->id,
                    'name' => 'Fluke 179 Multimeter',
                    'slug' => Str::slug('Fluke 179 Multimeter'),
                    'serial_number' => 'FL-9911-X',
                    'description' => 'True-RMS Digital Multimeter for field testing.',
                    'stock' => 10,
                    'location' => 'CAB-TOOLS-01',
                    'status' => 'available',
                ]);
            }
        }
    }
}
