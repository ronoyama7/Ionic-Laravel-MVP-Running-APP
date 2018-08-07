<?php

namespace App\Http\Controllers;

use App\Places;
use Illuminate\Http\Request;

class PlacesController extends Controller
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

    public function get(Places $places)
    {
        $records = $places->all();
        return view ('admin.place',["places"=>$records]);
    }

    public function api_get(Places $places)
    {
        $records = $places->all();
        return response()->json($records, 200);
    }

    public function getplace()
    {
        return response()->json(true, 200);;
    }

    public function save(Request $request, Places $places)
    {
        $record = $places->where('id',$request->id)->first();
        if ($record != []) {
            $record->data = $request->data;
            $record->value = $request->value;
            $record->update();
            return response()->json($record, 200);;
        } else {
            $places->data = $request->data;
            $places->value = $request->value;
            $places->save();
            return response()->json($places, 200);;
        }
    }

    public function delete(Request $request, Places $places)
    {
        $record = $places->where('id',$request->id)->first();
        if ($record != []) {
            $record->delete();
            return response()->json($record, 200);;
        } else {
            return response()->json(false, 200);;
        }
    }

    public function edit(Places $places, $id = 'index')
    {
        if ($id == 'new') {
            $record = null;
            return view ('admin.place.edit',["places"=>$record]);
        }
        $record = $places->where('id',$id)->first();
        if ($record != []) {
            return view ('admin.place.edit',["places"=>$record]);
        } else {
            $records = $places->all();
            return view ('admin.place',["places"=>$records]);
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
     * @param  \App\Places  $places
     * @return \Illuminate\Http\Response
     */
    public function show(Places $places)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Places  $places
     * @return \Illuminate\Http\Response
     */

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Places  $places
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Places $places)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Places  $places
     * @return \Illuminate\Http\Response
     */
    public function destroy(Places $places)
    {
        //
    }
}
