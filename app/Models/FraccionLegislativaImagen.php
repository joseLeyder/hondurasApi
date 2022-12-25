<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FraccionLegislativaImagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'fraccion_legislativa_id',
        'imagen',
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

    public function fraccionLegislativa()
    {
        return $this->hasOne('App\Models\FraccionLegislativa', 'id', 'fraccion_legislativa_id');
    }
}
