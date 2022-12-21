<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\ComisionUccaep;
use Validator;
use DB;

class ComisionUccaepsController extends Controller
{
    
    public function index(Request $request)
    {
        $comisionUccaep = ComisionUccaep::select('id','nombre','activo')
        ->where('activo', ($request->input('idFilter') != "-1") ? '=' : '!=', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($comisionUccaep, 200);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ComisionUccaep::$rulesPost, ComisionUccaep::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $comisionUccaep = new ComisionUccaep;
            $request->request->add(['usercreated' => $request->user]);
            $result = $comisionUccaep->create($request->all());
            $id = $result->id;
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    } 
    public function show($id)
    {
        $comisionUccaep = ComisionUccaep::select('id','nombre','activo')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($comisionUccaep, 200);
    }
    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), ComisionUccaep::$rulesPut, ComisionUccaep::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $comisionUccaep = ComisionUccaep::find($id);                            
            $request->request->add(['usermodifed' => $request->user]);
            $comisionUccaep->fill($request->all());
            $comisionUccaep->save();DB::commit();
            return response()->json(['message' => 'OK'], 202);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comisionUccaep = ComisionUccaep::find($id);
        $comisionUccaep->activo=!$comisionUccaep->activo;
        $comisionUccaep->save();
        return response($comisionUccaep, 200);
    }
        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $count = ComisionUccaep::where('activo', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
