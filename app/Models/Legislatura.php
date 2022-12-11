<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Legislatura extends Model
{
    use HasFactory;
    public $table = "legislaturas";
    public static $rules = [
        'nombre'=>'required|max:200|min:3',
        'fechaInicio' => 'required|before_or_equal:fechaFin',
        'fechaFin' => 'required|after_or_equal:fechaInicio',
        'cuatrienio_id'=>'required'

    ];

    public static $messages = [
        'nombre.required' => 'El nombre es requerido.',
        'nombre.max' =>'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre no puede ser menor a :min caracteres.',   
        'fechaInicio.required' => 'La fecha inicio es requerida.',
        'fechaFin.required' => 'La fecha fin es requerida.',
        'fechaFin.after_or_equal' => 'La fecha fin debe ser mayor a fecha Inicio.',
        'fechaInicio.before_or_equal' => 'La fecha Inicio debe ser menor a fecha Fin.',
        'cuatrienio_id.required' => 'El cuatrienio es requerido.'        
    ];
    
    protected $fillable = [
        'nombre',
        'fechaInicio',
        'fechaFin',
        'cuatrienio_id',
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
}
