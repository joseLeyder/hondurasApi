<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyAlerta extends Model
{
    use HasFactory;

    public static function rulesPost () {
        return [
            'informacion' => 'required',
            'proyecto_ley_id' => 'required',
        ];
    }

    public static $rulesPostMessages = [
        'informacion.required' => 'La información de interés es requerida.',
        'proyecto_ley_id.required' => 'Se requiere un proyecto de ley.',
    ];

    public static function rulesPut () {
        return [
            'informacion' => 'required',
            'proyecto_ley_id' => 'required',
        ];
    }

    public static $rulesPutMessages = [
        'informacion.required' => 'La información de interés es requerida.',
        'proyecto_ley_id.required' => 'Se requiere un proyecto de ley.',
    ];

    protected $fillable = [
        'id',
        'informacion',
        'url_archivo',
        'proyecto_ley_id',
        'clearContent',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    
    public function ProyectoLey(){
        return $this->hasOne(ProyectoLey::class, 'id', 'proyecto_ley_id');
    }
}
