<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();
        User::create(array(
            'name'     => 'Admin',
            'username' => 'admin',
            'email'    => 'admin@pixelfield.com',
            'password' => Hash::make('123456'),
        ));
    }
}
