<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CtrlPolitico extends Model
{
    use HasFactory;

    //Rules
    public static $rules                        = [
        'tema'                                      => 'required|max:200|min:3',
        'fecha'                                     => 'required',
        //'proyecto_ley_id'                              => 'required|int|min:1',
        'persona_id'                                  => 'required|int|min:1',
        'intervencion'                            => 'required'
    ];

    public static $rulesMessages = [
        'tema.required'                   => 'El tema del control político es requerido.',
        'tema.max'                        => 'El tema del control político no puede ser mayor a :max caracteres.',
        'tema.min'                        => 'El tema del control político no puede ser menor a :min caracteres.',
        'fecha.required'                    => 'La fecha es requerida.',
        //'proyecto_ley_id.min'                 => 'Debe seleccionar un proyecto de ley.',
        'persona_id.min'                      => 'Debe seleccionar un diputado.',
        'intervencion.required'           => 'la Intervención es requerida.'
    ];

    //End rules


    //Atributes
    protected     $fillable          = [
        'tema',
        'proyecto_ley_id',
        'persona_id',
        'fecha',
        'intervencion',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    protected     $hidden            = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    //End atributes

    //Relations
    public function Persona(){
        return $this->hasOne('App\Models\Persona', 'id', 'persona_id')->where(
            'activo',1
        );
    }

    public function ProyectoLey(){
        return $this->hasOne('App\Models\ProyectoLey', 'id', 'proyecto_ley_id')->where(
            'activo',1
        );
    }
    //End relations
}
