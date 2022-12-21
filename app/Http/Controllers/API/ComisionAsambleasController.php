<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\ComisionAsamblea;
use Validator;
use DB;

class ComisionAsambleasController extends Controller
{
    
    public function index(Request $request)
    {
        $comisionAsamblea = ComisionAsamblea::select('id','nombre','activo')
        ->where('activo', ($request->input('idFilter') != "-1") ? '=' : '!=', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($comisionAsamblea, 200);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ComisionAsamblea::$rulesPost, ComisionAsamblea::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $comisionAsamblea = new ComisionAsamblea;
            $request->request->add(['usercreated' => $request->user]);
            $result = $comisionAsamblea->create($request->all());
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
        $comisionAsamblea = ComisionAsamblea::select('id','nombre','activo')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($comisionAsamblea, 200);
    }
    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), ComisionAsamblea::$rulesPut, ComisionAsamblea::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $comisionAsamblea = ComisionUCCAEP::find($id);                            
            $request->request->add(['usermodifed' => $request->user]);
            $comisionAsamblea->fill($request->all());
            $comisionAsamblea->save();DB::commit();
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
        $comisionAsamblea = ComisionUCCAEP::find($id);
        $comisionAsamblea->activo=!$comisionAsamblea->activo;
        $comisionAsamblea->save();
        return response($comisionAsamblea, 200);
    }
        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $count = ComisionUCCAEP::where('activo', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
