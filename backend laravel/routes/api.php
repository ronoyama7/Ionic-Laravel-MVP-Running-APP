<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/onboard' , 'OnboardController@get');
Route::get('/about' , 'AboutController@get');
Route::get('/track' , 'TracksController@api_get');
Route::get('/place' , 'PlacesController@api_get');
