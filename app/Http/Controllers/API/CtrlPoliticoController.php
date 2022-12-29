<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\CtrlPolitico;
use App\Models\ControlPoliticoTag;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;

class CtrlPoliticoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
       
        $controlPolitico = CtrlPolitico::select(
            'id','tema', 'fecha', 'proyecto_ley_id', 'persona_id','activo')
        ->with('Persona', 'ProyectoLey')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('tema', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($controlPolitico, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), CtrlPolitico::$rules, CtrlPolitico::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try {
            $CtrlPolitico = new CtrlPolitico;
            $request->request->add(['usercreated' => $request->user]);
            $result = $CtrlPolitico->create($request->all());
            DB::commit();
            return response()->json(['message' => 'OK'], 201);

        } catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => $e], 422);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $controlPolitico = CtrlPolitico::select('id','tema','intervencion','fecha', 'proyecto_ley_id', 'persona_id','activo')
        ->with('Persona', 'ProyectoLey')
        ->where('id',$id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($controlPolitico, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), CtrlPolitico::$rules, CtrlPolitico::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $controlPolitico = CtrlPolitico::find($id);
            if($controlPolitico != null){
                $request->request->add(['usermodifed' => $request->user]);
                $controlPolitico->fill($request->all());
                $controlPolitico->save();
            }
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
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
        $controlPolitico = CtrlPolitico::find($id);
        $controlPolitico->activo=!$controlPolitico->activo;
        $controlPolitico->save();
        return response($controlPolitico, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $count = CtrlPolitico::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('tema', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }

    /**Combos */

    public function getComboPersonas(){

    }
    public function getComboProyectoLey(){
        
    }
}
