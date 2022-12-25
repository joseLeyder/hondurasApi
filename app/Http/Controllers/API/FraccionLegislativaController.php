<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FraccionLegislativa;
use App\Models\FraccionLegislativaImagen;
use Validator;
use Illuminate\Support\Facades\Storage;
use DB;

class FraccionLegislativaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $fraccionlegislativa = FraccionLegislativa::select('id','nombre','activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($fraccionlegislativa, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), FraccionLegislativa::$rulesPost,  FraccionLegislativa::$messagesPost);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $fraccionlegislativa = new FraccionLegislativa;
            $request->request->add(['usercreated' => $request->user]);
            $result = $fraccionlegislativa->create($request->all());
            $id = $result->id;
            if($result != null)
            {
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    $nombre = $id;                    
                    foreach ($files as $file) 
                    {
                        // Se crea registro
                        $imagenFraccionLegislativa = new FraccionLegislativaImagen;
                        $imagenFraccionLegislativa->usercreated = $request->user;
                        $imagenFraccionLegislativa->fraccion_legislativa_id = $id;
                        $imagenFraccionLegislativa->activo = 1;
                        $path = $file->storeAs(
                            '/fraccionlegislativa/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenFraccionLegislativa->imagen = $path;
                        $imagenFraccionLegislativa->save();
                    }   
                }
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $fraccionlegislativa = FraccionLegislativa::select('id','nombre', 'activo')
        ->with('fraccionLegislativaImagen')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($fraccionlegislativa, 200);
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
        $validator = Validator::make($request->all(), FraccionLegislativa::$rulesPut,  FraccionLegislativa::$messagesPut);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $fraccionlegislativa = FraccionLegislativa::find($id);
            $files = $request->file('imagen');
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = FraccionLegislativaImagen::select('id')
                ->where('fraccion_legislativa_id', $fraccionlegislativa->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior) 
                    {
                        $imgAnterior = FraccionLegislativaImagen::find($imagenesAnteriores[$key]->id);
                        if(Storage::disk('public')->exists($imgAnterior->imagen))
                            Storage::disk('public')->delete($imgAnterior->imagen);
                        $imgAnterior->usermodifed = $request->user;
                        $imgAnterior->activo = 0;
                        $imgAnterior->save();
                    }
                }
                $nombre = $id;                    
                foreach ($files as $file) 
                {
                    // Se crea registro
                    $imagenFraccionLegislativa = new FraccionLegislativaImagen;
                    $imagenFraccionLegislativa->usercreated = $request->user;
                    $imagenFraccionLegislativa->fraccion_legislativa_id = $id;
                    $imagenFraccionLegislativa->activo = 1;
                    $path = $file->storeAs(
                        '/fraccionlegislativa/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );                
                    $imagenFraccionLegislativa->imagen = $path;
                    $imagenFraccionLegislativa->save();
                }  
            }
            $request->request->add(['usermodifed' => $request->user]);
            $fraccionlegislativa->fill($request->all());
            $fraccionlegislativa->save();
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
        $fraccionlegislativa = FraccionLegislativa::find($id);
        $fraccionlegislativa->activo=!$fraccionlegislativa->activo;
        $fraccionlegislativa->save();
        return response($fraccionlegislativa, 200);
    }
}
