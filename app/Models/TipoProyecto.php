<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class TipoProyecto extends Model
    {
        use HasFactory;

        public static $rulesPost         = [
            'nombre'                 => 'required|max:200|min:3',
        ];
        public static $rulesPostMessages = [
            'nombre.required'                 => 'El nombre del tipo de expediente es requerido.',
            'nombre.max'                      => 'El nombre del tipo de expediente no puede ser mayor a :max caracteres.',
            'nombre.min'                      => 'El nombre del tipo de expediente no puede ser menor a :min caracteres.'
        ];
        public static $rulesPut          = [
            'nombre'                 => 'required|max:200|min:3'
        ];
        public static $rulesPutMessages  = [
            'nombre.required'                 => 'El nombre del tipo de expediente es requerido.',
            'nombre.max'                      => 'El nombre del tipo de expediente no puede ser mayor a :max caracteres.',
            'nombre.min'                      => 'El nombre del tipo de expediente no puede ser menor a :min caracteres.'
        ];
        protected     $fillable          = [
            'nombre',
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
    }

