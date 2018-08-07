<?php

Route::get('/', function () {
    return redirect('/admin/login');
});

Route::get('/admin/login', array('uses' => 'Auth\LoginController@showLogin'))->name("login");
Route::post('/admin/login', array('uses' => 'Auth\LoginController@doLogin'));

Route::group(['middleware' => 'auth'], function () {
    Route::get('/logout', array('uses' => 'Auth\LoginController@doLogout'));
    Route::post('/admin/image-upload' , 'ImageUploadController@upload');
    Route::post('/admin/image-remove' , 'ImageUploadController@remove');
    Route::post('/admin/image-get' , 'ImageUploadController@get');
    
    Route::post('/about/get' , 'AboutController@get');
    Route::post('/about/save' , 'AboutController@save');
    
    Route::post('/onboard/get' , 'OnboardController@get');
    Route::post('/onboard/save' , 'OnboardController@save');
    
    Route::get('/admin/track' , 'TracksController@get');
    Route::get('/admin/track/edit/{id?}' , 'TracksController@edit');
    Route::get('/admin/track/delete/{id?}' , 'TracksController@delete');
    Route::post('track/track-get' , 'TracksController@gettrack');
    Route::post('track/save' , 'TracksController@save');
    Route::get('track/delete' , 'TracksController@delete');
    
    Route::get('/admin/place' , 'PlacesController@get');
    Route::get('/admin/place/edit/{id?}' , 'PlacesController@edit');
    Route::get('/admin/place/delete/{id?}' , 'PlacesController@delete');
    Route::post('place/place-get' , 'PlacesController@getplace');
    Route::post('place/save' , 'PlacesController@save');
    Route::get('place/delete' , 'PlacesController@delete');
    
    Route::get('/admin/{demopage?}', 'DemoController@demo')->name('demo');
 });

