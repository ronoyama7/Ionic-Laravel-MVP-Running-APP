<?php

namespace App\Http\Controllers;

use App\Onboard;
use Illuminate\Http\Request;

class OnboardController extends Controller
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

    public function get(Request $request, Onboard $onboard)
    {
        $onboard = $onboard->all();
        return response()->json($onboard, 200);
    }

    public function save(Request $request, Onboard $onboard)
    {
        $id = $request->id;
        $onboards = $onboard->where('id',$id)->first();
        if ($onboards != []) {
            $data = $request->data;
            $value = $request->value;
            $onboards->data = $data;
            $onboards->value = $value;
            $onboards->update();
            return response()->json($onboards, 200);;
        } else {
            $data = $request->data;
            $value = $request->value;
            $onboard->data = $data;
            $onboard->value = $value;
            $onboard->save();
            return response()->json($onboard, 200);;
        }
       
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
     * @param  \App\onboard  $onboard
     * @return \Illuminate\Http\Response
     */
    public function show(Onboard $onboard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\onboard  $onboard
     * @return \Illuminate\Http\Response
     */
    public function edit(Onboard $onboard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\onboard  $onboard
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Onboard $onboard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\onboard  $onboard
     * @return \Illuminate\Http\Response
     */
    public function destroy(Onboard $onboard)
    {
        //
    }
}
