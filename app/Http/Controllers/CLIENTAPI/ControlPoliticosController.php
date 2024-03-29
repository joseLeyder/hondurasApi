<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CtrlPolitico;
use Illuminate\Support\Facades\DB;

class ControlPoliticosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = CtrlPolitico::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('proyectoDeLey') && !is_null($request["proyectoDeLey"]))
        {
            $query->where(
                'proyecto_ley_id',
                $request->proyectoDeLey
            );
        }

        if ($request->has('diputado') && !is_null($request["diputado"]))
        {
            $query->where(
                'persona_id',
                $request->diputado
            );
        }

        

        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');
            $query->Where(function($query) use ($search){
                $query->Where('intervencion', 'like', '%'. $search .'%')
                        ->orWhere('tema', 'like', '%'. $search .'%')
                       ->orWhere(function ($query) use ($search){
                             $query->orWhereHas('ProyectoLey', function ($query) use ($search) {
                                 $query->where('titulo', 'like', '%'. $search .'%');
                                //  $query->where(
                                //      DB::raw("COALESCE(`titulo`,'')"), 'LIKE', "%".$search."%");
                                
                              })->orWhereHas('Persona', function ($query) use ($search) {                                
                                  $query->where(
                                    DB::raw("CONCAT(`nombres`, ' ',COALESCE(`apellidos`,''))"), 'LIKE', "%".$search."%");
                             });
                       });
            });
        }

        $items = $query->with(['ProyectoLey', 'Persona'])
                ->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))
                ->orderBy('id','desc')
                ->get()
                ->toJson(JSON_PRETTY_PRINT);
        return response($items);
    }

    public function totalrecords(Request $request)
    {
        $query = CtrlPolitico::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('proyectoDeLey') && !is_null($request["proyectoDeLey"]))
        {
            $query->where(
                'proyecto_ley_id',
                $request->proyectoDeLey
            );
        }

        if ($request->has('diputado') && !is_null($request["diputado"]))
        {
            $query->where(
                'persona_id',
                $request->diputado
            );
        }

        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');
            $query->Where(function($query) use ($search){
                $query->Where('intervencion', 'like', '%'. $search .'%')
                      ->orWhere(function ($query) use ($search){
                            $query->orWhereHas('ProyectoLey', function ($query) use ($search) {
                                $query->where('titulo', 'like', '%'. $search .'%');
                            })->orWhereHas('Persona', function ($query) use ($search) {
                                $query->where(DB::raw("CONCAT(`nombres`, ' ', `apellidos`)"), 'LIKE', "%".$search."%");
                            });
                      });
            });
        }

        $count = $query->with(['ProyectoLey', 'Persona'])
                ->orderBy('id','desc')
                ->get()
                ->count();;
       
        return response($count);
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $query = CtrlPolitico::query();

        $item = $query->with(['ProyectoLey', 'Persona'])
                ->where('id',$id)
                ->get()
                ->toJson(JSON_PRETTY_PRINT);
        return response($item, 200);

        // $controlPolitico = CtrlPolitico::select(
        //     'id','titulo', 'fecha', 'comision_id', 'legislatura_id', 'cuatrienio_id', 'estado_control_politico_id', 'tema_id_principal', 'tema_id_secundario', 'numero_proposicion', 'detalles', 'tags', 'activo')
        // ->where('id',$id)
        // ->with('legislatura', 'cuatrienio', 'corporacion', 'estadoControlPolitico', 'temaPrincipalControlPolitico', 'temaSecundarioControlPolitico',
        // 'comision', 'controlPoliticoProposiciones', 'controlPoliticoCitantes', 'controlPoliticoTags',
        // 'controlPoliticoCitados', 'controlPoliticoRespuestas', 'controlPoliticoDocumentos')
        // ->get()
        // ->toJson(JSON_PRETTY_PRINT);
        // return response($controlPolitico, 200);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getCitantesFilter(Request $request){
        $nombre = $request->input('nombre');
        $controlPolitico = $request->input('controlPolitico');
        $items = ControlPoliticoCitante::select('control_politico_citantes.congresista_id')
        ->join('congresistas', 'control_politico_citantes.congresista_id', 'congresistas.id')
        ->join('personas', 'congresistas.persona_id', 'personas.id')
        ->where('congresistas.activo','1')
        ->where('control_politico_citantes.control_politico_id',$controlPolitico)
        ->where(function ($query) use ($nombre) {
            $query->where('personas.nombres', 'LIKE', '%' . $nombre . '%' )
                  ->orWhere('personas.apellidos', 'LIKE', '%' . $nombre . '%' );
        })
        ->where('control_politico_citantes.activo',1)
        ->with('congresista')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }

    public function getCitadosFilter(Request $request){
        $nombre = $request->input('nombre');
        $controlPolitico = $request->input('controlPolitico');
        $items = ControlPoliticoCitado::select('control_politico_citados.persona_id')
        ->join('personas', 'control_politico_citados.persona_id', 'personas.id')
        ->where('control_politico_id',$controlPolitico)
        ->where('control_politico_citados.activo',1)
        ->where(function ($query) use ($nombre) {
            $query->where('personas.nombres', 'LIKE', '%' . $nombre . '%' )
                  ->orWhere('personas.apellidos', 'LIKE', '%' . $nombre . '%' );
        })
        ->with('persona')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
}
