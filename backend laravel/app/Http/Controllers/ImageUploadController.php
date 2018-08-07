<?php

namespace App\Http\Controllers;
use File;
use App\ImageUpload;
use Illuminate\Http\Request;

class ImageUploadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ImageUpload  $imageUpload
     * @return \Illuminate\Http\Response
     */
    public function show(ImageUpload $imageUpload)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ImageUpload  $imageUpload
     * @return \Illuminate\Http\Response
     */
    public function edit(ImageUpload $imageUpload)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ImageUpload  $imageUpload
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ImageUpload $imageUpload)
    {
        //
    }

    public function upload(Request $request, ImageUpload $imageUpload)
    {
        // Creating a new time instance, we'll use it to name our file and declare the path
        $time = \Carbon\Carbon::now();
        // Requesting the file from the form
        $image = $request->file('file');
        // Getting the extension of the file 
        $extension = $image->getClientOriginalExtension();
        $original_name = $image->getClientOriginalName();
        $file_size = $image->getClientSize();
        // Creating the directory, for example, if the date = 18/10/2017, the directory will be 2017/10/
        $directory = date_format($time, 'Y') . '/' . date_format($time, 'm');
        // Creating the file name: random string followed by the day, random number and the hour
        $filename = str_random(5).date_format($time,'d').rand(1,9).date_format($time,'h').".".$extension;
        // This is our upload main function, storing the image in the storage that named 'public'
        $upload_success = $image->storeAs($directory, $filename, 'public');
        // If the upload is successful, return the name of directory/filename of the upload.
        if ($upload_success) {
            $imageUpload->path = $upload_success;
            $imageUpload->filename = $filename;
            $imageUpload->original_name = $original_name;
            $imageUpload->file_size = $file_size;
            $imageUpload->save();
            return response()->json($imageUpload, 200);
        }
        // Else, return error 400
        else {
            return response()->json('error', 400);
        }
    }

    public function remove(Request $request, ImageUpload $imageUpload)
    {
        // Creating a new time instance, we'll use it to name our file and declare the path
        $name = $request->id;
        // $recentImage = $imageUpload->where('original_name', 'like', $name)->first();
        // if ($recentImage) {
        //     $res= $imageUpload->where('id',$recentImage->id)->delete();
        //     $path = public_path('uploads').'/'.$recentImage->path;
        //     if ( File::exists( $path ) )
        //     {
        //         File::delete( $path );
        //     }
        //     return response()->json($path, 200);;
        // }
        $sessionImage = $imageUpload->where('filename', 'like', $name)->first();
        if (!$sessionImage) {
            return response()->json('unknown file', 200);;
        }
        $res= $imageUpload->where('id',$sessionImage->id)->delete();
        $path = public_path('uploads').'/'.$sessionImage->path;
        if ( File::exists( $path ) )
        {
            File::delete( $path );
        }
        return response()->json($path, 200);;
    }

    public function get(Request $request, ImageUpload $imageUpload)
    {
        // Creating a new time instance, we'll use it to name our file and declare the path
        $images = $imageUpload->all();
        return response()->json($images, 200);;
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ImageUpload  $imageUpload
     * @return \Illuminate\Http\Response
     */
    public function destroy(ImageUpload $imageUpload)
    {
        //
    }
}
