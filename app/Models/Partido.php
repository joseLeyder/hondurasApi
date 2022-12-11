<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class Partido extends Model
    {
        use HasFactory;

        public static $rulesPost         = [
            'nombre'                 => 'required|max:200|min:3',
            'fechaDeCreacion'        => 'required',
            'resenaHistorica'        => 'required|min:3',
            'lineamientos'           => 'required|min:3',
            'lugar'                  => 'required|max:100|min:3',
            'color'                  => 'required|string',
            'fileEstatutos'              => 'required',
            'imagen'                 => 'required',
            'datosContacto.*.cuenta' => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
        ];
        public static $rulesPostMessages = [
            'nombre.required'                 => 'El nombre del partido es requerido.',
            'nombre.max'                      => 'El nombre del partido no puede ser mayor a :max caracteres.',
            'nombre.min'                      => 'El nombre del partido no puede ser menor a :min caracteres.',
            'fechaDeCreacion.required'        => 'La fecha es requerido.',
            'resenaHistorica.required'        => 'La reseña histórica es requerida.',
            'resenaHistorica.min'             => 'La reseña no puede ser menor a :min caracteres.',
            'lineamientos.required'           => 'Los lineamientos son requeridos.',
            'lineamientos.min'                => 'Los lineamientos no pueden ser menor a :min caracteres.',
            'lugar.required'                  => 'El lugar es requerido.',
            'lugar.max'                       => 'El lugar no puede ser mayor a :max caracteres.',
            'lugar.min'                       => 'El lugar no puede ser menor a :min caracteres.',
            'color.required'                  => 'El color del partido es requerido',
            'estatutos.required'              => 'El archivo de estatutos es requerido.',
            'imagen.required'                 => 'La imagen es requerida',
            'datosContacto.*.cuenta.required' => 'El dato de contacto es requerido.',
            'datosContacto.*.cuenta.max'      => 'El dato de contacto no puede ser mayor a :max caracteres.',
            'datosContacto.*.cuenta.min'      => 'El dato de contacto no puede ser menor a :min caracteres.',
        ];
        public static $rulesPut          = [
            'nombre'                 => 'required|max:200|min:3',
            'fechaDeCreacion'        => 'required',
            'resenaHistorica'        => 'required|min:3',
            'lineamientos'           => 'required|min:3',
            'lugar'                  => 'required|max:100|min:3',
            'color'                  => 'required|string',
            'datosContacto.*.cuenta' => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
        ];
        public static $rulesPutMessages  = [
            'nombre.required'                 => 'El nombre del partido es requerido.',
            'nombre.max'                      => 'El nombre del partido no puede ser mayor a :max caracteres.',
            'nombre.min'                      => 'El nombre del partido no puede ser menor a :min caracteres.',
            'fechaDeCreacion.required'        => 'La fecha es requerido.',
            'resenaHistorica.required'        => 'La reseña histórica es requerida.',
            'resenaHistorica.min'             => 'La reseña no puede ser menor a :min caracteres.',
            'lineamientos.required'           => 'Los lineamientos son requeridos.',
            'lineamientos.min'                => 'Los lineamientos no pueden ser menor a :min caracteres.',
            'color.required'                  => 'El color del partido es requerido',
            'lugar.required'                  => 'El lugar es requerido.',
            'lugar.max'                       => 'El lugar no puede ser mayor a :max caracteres.',
            'lugar.min'                       => 'El lugar no puede ser menor a :min caracteres.',
            'datosContacto.*.cuenta.required' => 'El dato de contacto es requerido.',
            'datosContacto.*.cuenta.max'      => 'El dato de contacto no puede ser mayor a :max caracteres.',
            'datosContacto.*.cuenta.min'      => 'El dato de contacto no puede ser menor a :min caracteres.',
        ];
        protected     $fillable          = [
            'nombre',
            'resenaHistorica',
            'lineamientos',
            'lugar',
            'color',
            'fechaDeCreacion',
            'estatutos',
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

        public function partidoDatosContacto()
        {
            return $this->hasMany('App\Models\PartidoDatosContacto')->with("datosContacto")->where(
                'activo',
                1
            );
        }

        public function partidoImagen()
        {
            return $this->hasMany('App\Models\PartidoImagen')->where(
                'activo',
                1
            );
        }
    }
