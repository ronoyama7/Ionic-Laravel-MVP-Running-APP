<?php

namespace App\Http\Controllers;

use App\Tracks;
use Illuminate\Http\Request;

class TracksController extends Controller
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

    public function get(Tracks $tracks)
    {
        $records = $tracks->all();
        return view ('admin.track',["tracks"=>$records]);
    }

    public function api_get(Tracks $tracks)
    {
        $records = $tracks->all();
        return response()->json($records, 200);
    }

    public function gettrack()
    {
        return response()->json(true, 200);;
    }

    public function save(Request $request, Tracks $tracks)
    {
        $record = $tracks->where('id',$request->id)->first();
        if ($record != []) {
            $record->data = $request->data;
            $record->value = $request->value;
            $record->update();
            return response()->json($record, 200);;
        } else {
            $tracks->data = $request->data;
            $tracks->value = $request->value;
            $tracks->save();
            return response()->json($tracks, 200);;
        }
    }

    public function delete(Request $request, Tracks $tracks)
    {
        $record = $tracks->where('id',$request->id)->first();
        if ($record != []) {
            $record->delete();
            return response()->json($record, 200);;
        } else {
            return response()->json(false, 200);;
        }
    }

    public function edit(Tracks $tracks, $id = 'index')
    {
        if ($id == 'new') {
            $record = null;
            return view ('admin.track.edit',["tracks"=>$record]);
        }
        $record = $tracks->where('id',$id)->first();
        if ($record != []) {
            return view ('admin.track.edit',["tracks"=>$record]);
        } else {
            $records = $tracks->all();
            return view ('admin.track',["tracks"=>$records]);
        }
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
     * @param  \App\Tracks  $tracks
     * @return \Illuminate\Http\Response
     */
    public function show(Tracks $tracks)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Tracks  $tracks
     * @return \Illuminate\Http\Response
     */
    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Tracks  $tracks
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tracks $tracks)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Tracks  $tracks
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tracks $tracks)
    {
        //
    }
}
