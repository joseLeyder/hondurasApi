<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\TipoProyecto;
use Validator;
use DB;

class TipoProyectoController extends Controller
{
    
    public function index(Request $request)
    {
        $tipoproyecto = TipoProyecto::select('id','nombre','activo')
        ->where('activo', ($request->input('idFilter') != "-1") ? '=' : '!=', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($tipoproyecto, 200);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), TipoProyecto::$rulesPost, TipoProyecto::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $tipoproyecto = new TipoProyecto;
            $request->request->add(['usercreated' => $request->user]);
            $result = $tipoproyecto->create($request->all());
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
        $tipoproyecto = TipoProyecto::select('id','nombre','activo')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($tipoproyecto, 200);
    }
    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), TipoProyecto::$rulesPut, TipoProyecto::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $tipoproyecto = TipoProyecto::find($id);                            
            $request->request->add(['usermodifed' => $request->user]);
            $tipoproyecto->fill($request->all());
            $tipoproyecto->save();DB::commit();
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
        $tipoproyecto = TipoProyecto::find($id);
        $tipoproyecto->activo=!$tipoproyecto->activo;
        $tipoproyecto->save();
        return response($tipoproyecto, 200);
    }
        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $activo  =$request->input('idFilter');
        $count = TipoProyecto::where('activo', ($activo != "-1") ? '=' : '!=', $activo)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
