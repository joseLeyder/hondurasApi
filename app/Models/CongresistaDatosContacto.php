<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresistaDatosContacto extends Model
{
    use HasFactory;

    protected $fillable = [
        'cuenta',
        'congresista_id',
        'dato_contacto_id',
        'usercreated',
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

    public function datosContacto()
    {
        return $this->hasOne('App\Models\DatosContacto', 'id', 'dato_contacto_id')->with("datosContactoImagen");
    }

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id');
    }
}
