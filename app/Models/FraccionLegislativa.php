<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FraccionLegislativa extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'nombre' => 'required|max:200|min:3',
        'imagen' => 'required'
    ];
    public static $messagesPost = [
        'nombre.required'   => 'El nombre es requerido.',
        'nombre.max'        => 'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre no puede ser menor a :min caracteres.',
        'imagen.required'   => 'La imagen es requerida'
    ];
    public static $rulesPut = [
        'nombre' => 'required|max:200|min:3'
    ];
    public static $messagesPut = [
        'nombre.required'   => 'El nombre es requerido.',
        'nombre.max'        => 'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre no puede ser menor a :min caracteres.',
        'imagen.required'   => 'La imagen es requerida'
    ];
    protected $fillable = [
        'nombre',
        'usercreated',
        'activo',
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

    public function fraccionLegislativaImagen()
    {
        return $this->hasMany('App\Models\FraccionLegislativaImagen')->where('activo', 1);
    }
}
