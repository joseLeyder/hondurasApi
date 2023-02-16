<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLey extends Model
{
    use HasFactory;

    public static function rulesPost () {
        return [
            'titulo' => 'required',
            'fecha_radicacion' => 'required',
            'numero_camara' => 'required',
            'tema_id_principal' => 'numeric|required|min:0|not_in:0',
            'cuatrienio_id' => 'numeric|required|min:0|not_in:0',
            // 'legislatura_id' => 'numeric|required|min:0|not_in:0',
            'iniciativa_id' => 'numeric|required|min:0|not_in:0',
            'sinopsis' => 'required',
            'tipo_proyecto_id' => 'numeric|required|min:0|not_in:0',
        ];
    }

    public static $rulesPostMessages = [
        'titulo.required' => 'El título es requerido.',
        'fecha_radicacion.required' => 'La fecha de radicación es requerida.',
        'numero_camara.required' => 'El número de cámara es requerida.',

        'tema_id_principal.numeric' => 'El tema principal es requerido.',
        'tema_id_principal.required' => 'El tema principal es requerido.',
        'tema_id_principal.min' => 'El tema principal es requerido.',
        'tema_id_principal.not_in' => 'El tema principal es requerido.',

        'cuatrienio_id.numeric' => 'El cuatrienio es requerido.',
        'cuatrienio_id.required' => 'El cuatrienio es requerido.',
        'cuatrienio_id.min' => 'El cuatrienio es requerido.',
        'cuatrienio_id.not_in' => 'El cuatrienio es requerido.',

        // 'legislatura_id.numeric' => 'La legislatura es requerido.',
        // 'legislatura_id.required' => 'La legislatura es requerido.',
        // 'legislatura_id.min' => 'La legislatura es requerido.',
        // 'legislatura_id.not_in' => 'La legislatura es requerido.',

        'iniciativa_id.numeric' => 'La iniciativa es requerido.',
        'iniciativa_id.required' => 'La iniciativa es requerido.',
        'iniciativa_id.min' => 'La iniciativa es requerido.',
        'iniciativa_id.not_in' => 'La iniciativa es requerido.',

        'sinopsis.required' => 'La sinopsis es requerida.',

        'tipo_proyecto_id.numeric' => 'El tipo de proyecto de ley es requerido.',
        'tipo_proyecto_id.required' => 'El tipo de proyecto de ley es requerido.',
        'tipo_proyecto_id.min' => 'El tipo de proyecto de ley es requerido.',
        'tipo_proyecto_id.not_in' => 'El tipo de proyecto de ley es requerido.',
    ];

    public static function rulesPut () {
        return [
            'titulo' => 'required',
            'fecha_radicacion' => 'required',
            // 'legislatura_id' => 'numeric|required|min:0|not_in:0',
            'cuatrienio_id' => 'numeric|required|min:0|not_in:0',
            'comision_asamblea_id' => 'numeric|required|min:0|not_in:0',
            'comision_uccaeps_id' => 'numeric|required|min:0|not_in:0',
            'tipo_proyecto_id' => 'numeric|required|min:0|not_in:0',
            'iniciativa_id' => 'numeric|required|min:0|not_in:0',
            'tema_id_principal' => 'numeric|required|min:0|not_in:0',
            'sinopsis' => 'required',
            'fecha_cuatrienal' => 'required',
            'fecha_dictamen' => 'required',
        ];
    }

    public static $rulesPutMessages = [
        'titulo.required' => 'El título es requerido.',
        'fecha_radicacion.required' => 'La fecha de radicación es requerida.',
        'fecha_cuatrienial.required' => 'La fecha cuatrienial es requerida',
        'fecha_dictamen.required' => 'La fecha estimada de dictamen es requerida',
        // 'legislatura_id.numeric' => 'La legislatura es requerido.',
        // 'legislatura_id.required' => 'La legislatura es requerido.',
        // 'legislatura_id.min' => 'La legislatura es requerido.',
        // 'legislatura_id.not_in' => 'La legislatura es requerido.',

        'cuatrienio_id.numeric' => 'El periodo legislativo es requerido.',
        'cuatrienio_id.required' => 'El periodo legislativo es requerido.',
        'cuatrienio_id.min' => 'El periodo legislativo es requerido.',
        'cuatrienio_id.not_in' => 'El periodo legislativo es requerido.',

        'comision_uccaeps_id.numeric' => 'La comisión interna es requerida.',
        'comision_uccaeps_id.required' => 'La comisión interna es requerida.',
        'comision_uccaeps_id.min' => 'La comisión interna es requerida.',
        'comision_uccaeps_id.not_in' => 'La comisión interna es requerida.',
        
        'comision_asamblea_id.numeric' => 'La comisión de asamblea legislativa es requerida.',
        'comision_asamblea_id.required' => 'La comisión de asamblea legislativa es requerida.',
        'comision_asamblea_id.min' => 'La comisión de asamblea legislativa es requerida.',
        'comision_asamblea_id.not_in' => 'La comisión de asamblea legislativa es requerida.',

        'tipo_proyecto_id.numeric' => 'El tipo de expediente es requerido.',
        'tipo_proyecto_id.required' => 'El tipo de expediente es requerido.',
        'tipo_proyecto_id.min' => 'El tipo de expediente es requerido.',
        'tipo_proyecto_id.not_in' => 'El tipo de expediente es requerido.',

        'iniciativa_id.numeric' => 'La iniciativa es requerido.',
        'iniciativa_id.required' => 'La iniciativa es requerido.',
        'iniciativa_id.min' => 'La iniciativa es requerido.',
        'iniciativa_id.not_in' => 'La iniciativa es requerido.',

        'tema_id_principal.numeric' => 'El tema principal es requerido.',
        'tema_id_principal.required' => 'El tema principal es requerido.',
        'tema_id_principal.min' => 'El tema principal es requerido.',
        'tema_id_principal.not_in' => 'El tema principal es requerido.',

        'sinopsis.required' => 'La sinopsis es requerida.',
    ];

    protected $fillable = [
        'cuatrienio_id',
        'legislatura_id',
        'titulo',
        'alias',
        'fecha_radicacion',
        'numero_camara',
        'iniciativa_id',
        'tipo_proyecto_id',
        'tema_id_principal',
        'tema_id_secundario',
        'sinopsis',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at',
        'fecha_cuatrienal',
        'fecha_dictamen',
        'comision_uccaeps_id',
        'comision_asamblea_id'
    ];

    protected $hidden = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    public function Iniciativa(){
        return $this->hasOne(Iniciativa::class, 'id', 'iniciativa_id')->where('activo', 1);
    }
    public function Legislatura(){
        return $this->hasOne(Legislatura::class, 'id', 'legislatura_id');
    }
    public function Cuatrienio(){
        return $this->hasOne(Cuatrienio::class, 'id', 'cuatrienio_id');
    }
    public function TipoProyectoLey(){
        return $this->hasOne(TipoProyecto::class, 'id', 'tipo_proyecto_id');
    }
    public function TemaPrincipal(){
        return $this->hasOne(Tema::class, 'id', 'tema_id_principal');
    }
    public function TemaSecundario(){
        return $this->hasOne(Tema::class, 'id', 'tema_id_secundario');
    }
    public function ProyectoLeyEstado(){
        return $this->hasMany(ProyectoLeyEstado::class)->where('activo', 1)->with(["TipoEstado", 'Comisiones']);
    }
    public function ProyectoLeyAutorPersonas(){
        return $this->hasMany(ProyectoLeyAutor::class)->where('activo', 1)->with('Persona');
    }
    public function ProyectoLeyAutorLegislativo(){
        return $this->hasMany(ProyectoLeyAutorLegislativo::class)->where('activo', 1);
    }
    public function ProyectoLeyVotacion(){
        return $this->hasMany(Votacion::class, 'proyecto_de_ley_id', 'id')->where('activo',1)->with(['votacionCongresista']);
    }
    public function ComisionUccaep(){
        return $this->hasOne(ComisionUccaep::class, 'id', 'comision_uccaeps_id');
    }
    public function ComisionAsamblea(){
        return $this->hasOne(Comision::class, 'id', 'comision_asamblea_id');
    }
}
