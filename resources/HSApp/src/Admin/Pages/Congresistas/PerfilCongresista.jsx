import React from 'react';
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from 'suneditor-react';
import { Constantes } from "../../../Constants/Constantes.js"
import PerfilCongresistaSubList from "../../../Components/CongresoVisible/PerfilCongresistaSubList";
import PerfilCongresistaCtrlPoliticoSubList from "../../../Components/CongresoVisible/PerfilCongresistaCtrlPoliticoSubList";

const auth = new AuthLogin();
const dataConst = {
    id: 0,
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    municipio_id_nacimiento: 0,
    profesion_id: 0,
    genero_id: 0,
    fecha_fallecimiento: null,
    perfil_educativo: "",
    grado_estudio_id: 0,
    activo: 1,
    lugar_nacimiento: {
        id: 0,
        nombre: "",
    },
    grado_estudio: {
        id: 0,
        nombre: ""
    },
    genero: {
        id: 0,
        nombre: ""
    },
    profesion: {
        id: 0,
        nombre: ""
    },
    fraccion_legislativa:{
        id: 0,
        nombre :""
    },
    comision_miembro: null,
    imagenes: [],
    contactos: [],
    comision_miembros: [],

}
class PerfilCongresista extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id: id,
            subloader: true,
            subloaderAutorias: false,
            subloaderPonencias: false,
            subloaderCitante: false,
            subloaderComisiones: false,
            subloaderControlPolitico: false,
            listAutorias: {
                data: [],
                propiedades:
                {
                    id: 'proyecto_ley.id',
                    title: 'proyecto_ley.titulo',
                    description:
                        [
                            { title: "Tema principal", text: "proyecto_ley.tema_principal.nombre" },
                            { title: "Tema secundario", text: "proyecto_ley.tema_secundario.nombre" },
                            { title: "Tipo", text: "proyecto_ley.tipo_proyecto_ley.nombre" },
                            { title: "Iniciativa", text: "proyecto_ley.iniciativa.nombre" },
                        ]
                },
                totalRows: 0,
                search: "",
                page: 1,
                rows: 8
            },
            listComisiones: {
                data: [],
                propiedades:
                {
                    id: 'comision.id',
                    title: 'comision.nombre',
                     description:
                         [
                            //  { title: "Comisión: ", text: "comision.nombre" },
                            //  { title: "Tipo: ", text: "comision.tipocomision.nombre" },
                         ]
                },
                totalRows: 0,
                search: "",
                page: 1,
                rows: 8
            },
            listControlPolitico: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    title: 'tema',
                     description:
                         [
                            {title : "Proyecto de ley: ", text: "proyecto_ley.titulo"},
                              { title: "Intervención: ", text: "intervencion" },
                            //  { title: "Tipo: ", text: "comision.tipocomision.nombre" },
                         ]
                },
                totalRows: 0,
                search: "",
                page: 1,
                rows: 8
            },
            data: dataConst
        }
    }
    // Handlers

    handlerPaginationAutorias = async (page, rows, search = "") => {
        let listAutorias = this.state.listAutorias;
        listAutorias.page = page;
        listAutorias.rows = rows;
        listAutorias.search = search;
        this.setState({ listAutorias });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAutoriasByIdCongresista(this.state.id, search, page, rows);
            }.bind(this),
            1000
        );
    }

    handlerPaginationComisiones = async (page, rows, search = "") => {
        let listComisiones = this.state.listComisiones;
        listComisiones.page = page;
        listComisiones.rows = rows;
        listComisiones.search = search;
        this.setState({ listComisiones });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getComisionesByIdCongresista(this.state.id, search, page, rows);
            }.bind(this),
            1000
        );
    }

    handlerPaginationPonencias = async (page, rows, search = "") => {
        let listPonencias = this.state.listPonencias;
        listPonencias.page = page;
        listPonencias.rows = rows;
        listPonencias.search = search;
        this.setState({ listPonencias });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getPonenciasByIdCongresista(this.state.id, search, page, rows);
            }.bind(this),
            1000
        );
    }

    handlerPaginationCitante = async (page, rows, search = "") => {
        let listCitante = this.state.listCitante;
        listCitante.page = page;
        listCitante.rows = rows;
        listCitante.search = search;
        this.setState({ listCitante });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getCitantesByIdCongresista(this.state.id, search, page, rows);
            }.bind(this),
            1000
        );
    }

    handlerPaginationCtrlPolitico = async (page, rows, search = "") => {
        let listControlPolitico = this.state.listControlPolitico;
        listControlPolitico.page = page;
        listControlPolitico.rows = rows;
        listControlPolitico.search = search;
        this.setState({ listControlPolitico });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getCtrlPoliticoByIdCongresista(this.state.id, search, page, rows);
            }.bind(this),
            1000
        );
    }
    // 
    componentDidMount = async () => {
        await this.getByID(this.state.id);
        await this.getAutoriasByIdCongresista(this.state.id);
        await this.getComisionesByIdCongresista(this.state.id);
        await this.getControlPoliticoByIdCongresista(this.state.id);
    }
    // 

    // Métodos

    getAutoriasByIdCongresista = async (id, search, page, rows) => {
        this.setState({ subloaderAutorias: true });
        let listAutorias = this.state.listAutorias;
        await CongresistasDataService.getAutoriasByIdCongresista(id, search, page, rows).then((response) => {
            console.log(response.data)
            listAutorias.data = response.data;
        })
            .catch((e) => {
                console.error(e);
            });

        await CongresistasDataService.totalrecordsAutorias(id, search).then((response) => {
            listAutorias.totalRows = response.data;
        })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listAutorias,
            subloaderAutorias: false
        });
    };

    getComisionesByIdCongresista = async (id, search, page, rows) => {
        this.setState({ subloaderComisiones: true });
        let listComisiones = this.state.listComisiones;
        await CongresistasDataService.getComisionesByIdCongresista(id, search, page, rows).then((response) => {
            console.log(response.data)
            listComisiones.data = response.data;
        })
            .catch((e) => {
                console.error(e);
            });

        await CongresistasDataService.totalrecordsComisiones(id, search).then((response) => {
            listComisiones.totalRows = response.data;
        })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listComisiones,
            subloaderComisiones: false
        });
    };

    getControlPoliticoByIdCongresista = async (id, search, page, rows) => {
        this.setState({ subloaderControlPolitico: true });
        let listControlPolitico = this.state.listControlPolitico;
        await CongresistasDataService.getCtrlPoliticoByIdCongresista(id, search, page, rows).then((response) => {
            console.log(response.data);
            listControlPolitico.data = response.data;
            console.log(listControlPolitico);
        })
            .catch((e) => {
                console.error(e);
            });

        await CongresistasDataService.totalrecordsCtrlPolitico(id, search).then((response) => {
            listControlPolitico.totalRows = response.data;
        })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listControlPolitico,
            subloaderControlPolitico: false
        });
    };

    getByID = async (id) => {
        this.setState({ subloader: true });
        await CongresistasDataService.get(id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    data: response.data,
                    subloader: false
                });
            })
            .catch(e => {
                this.setState({
                    subloader: false
                });
                console.log(e);
            });
    }
    // 
    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Perfil del diputado</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Diputados</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Detalle</li>
                            </ul>
                        </div>
                    </section>

                    <div className="lg:flex justify-center pageSection">
                        <div className="itemSection">
                            <figure>
                                <img src={typeof this.state.data.imagenes[2] !== "undefined" ? auth.pathApi() + this.state.data.imagenes[2].imagen : Constantes.NoImagen} alt="" />
                            </figure>
                        </div>
                        <div className="info">
                            <div className="itemSection">
                                <h3>{this.state.data.nombres} {this.state.data.apellidos}</h3>
                                <div className="lg:flex lg:-mx-4">
                                        <div className="lg:w-1/3 lg:px-4">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Nacimiento</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.fechaNacimiento || "Sin fecha"}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Profesión</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.profesion?.nombre || "Sin profesión"}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Grado de estudio</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.grado_estudio?.nombre || "Sin grado de estudios"}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Género</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.genero?.nombre || "Sin género asignado"}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Provincia</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.lugar_nacimiento?.nombre || "Sin provincia asignada"}</div>
                                            </div>
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Fracción legislativa</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.fraccion_legislativa?.nombre || "Sin fracción legislativa asignada"}</div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="itemSection">
                                <h3>Datos de contacto</h3>
                                <div className="lg:flex flex-wrap">
                                    {
                                        this.state.data?.contactos !== null && typeof this.state.data?.contactos !== "undefined" ?
                                            this.state.data?.contactos.map((x, j) => {
                                                if (x.datos_contacto.tipo === 2) {
                                                    return (
                                                        <div key={j} className="card m-5 px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                            <p className="mt-2">
                                                                <img className="inline" src={typeof x.datos_contacto.datos_contacto_imagen[0] !== 'undefined' ? (auth.pathApi() + x.datos_contacto.datos_contacto_imagen[0].imagen) : Constantes.NoImagenPicture} alt="" />
                                                                {x.datos_contacto.nombre}
                                                            </p>
                                                            <div className="text-primary mt-1 text-xl leading-none">
                                                                <a href={x.cuenta || "#"} target="_blank">
                                                                    {x.cuenta || "Sin " + x.datos_contacto.nombre}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )
                                                }else{
                                                    return (
                                                        <div key={j} className="card m-5 px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                            <p className="mt-2">
                                                                <img className="inline" src={typeof x.datos_contacto.datos_contacto_imagen[0] !== 'undefined' ? (auth.pathApi() + x.datos_contacto.datos_contacto_imagen[0].imagen) : Constantes.NoImagenPicture} alt="" />
                                                                {x.datos_contacto.nombre}
                                                            </p>
                                                            <div className="text-primary mt-1 text-xl leading-none">
                                                                {x.cuenta || "Sin " + x.datos_contacto.nombre}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:flex justify-center pageSection">
                        <div className="itemSection info">
                            <h3>Descripción académica</h3>
                            <SunEditor
                                disable={true}
                                enableToolbar={true}
                                showToolbar={false}
                                width="100%"
                                height="100%"
                                setOptions={{ resizingBar: false, showPathLabel: false }}
                                setContents={this.state.data.perfil_educativo || ""}
                            />
                        </div>
                    </div>
                    
                    <div className="lg:flex justify-center pageSection">
                        
                        <div className="itemSection info">
                            <h3>Proyectos presentados</h3>
                            <div className="buscador items-center ml-auto mt-5 lg:mt-0 pd-25">
                                <div className="input-group">
                                    <input type="text" value={this.state.listAutorias.search}
                                    onChange={async (e) => {
                                        let data = this.state.listAutorias;
                                        data.search = e.target.value;
                                        this.setState({ listAutorias: data })
                                    }}
                                    onKeyUp={async (e) => {
                                        if (e.key === "Enter") {
                                            await this.handlerPaginationAutorias(this.state.listAutorias.page, this.state.listAutorias.rows, e.target.value)
                                        }
                                    }}
                                    placeholder="Escriba para buscar" className="form-control" />
                                    <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationAutorias(this.state.listAutorias.page, this.state.listAutorias.rows, this.state.listAutorias.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                </div>
                            </div>
                            <PerfilCongresistaSubList data={this.state.listAutorias.data} propiedades={this.state.listAutorias.propiedades} link={`#/detalle-proyecto-de-ley`} params={["proyecto_ley_id"]} handler={this.handlerPaginationAutorias} pageExtends={this.state.listAutorias.page} pageSize={this.state.listAutorias.rows} totalRows={this.state.listAutorias.rows} /> </div>

                    </div>
                    
                    <div className="lg:flex justify-center pageSection">
                        
                        <div className="itemSection info">
                            <h3>Comisiones</h3>
                            <div className="buscador items-center ml-auto mt-5 lg:mt-0 pd-25">
                                <div className="input-group">
                                    <input type="text" value={this.state.listComisiones.search}
                                    onChange={async (e) => {
                                        let data = this.state.listComisiones;
                                        data.search = e.target.value;
                                        this.setState({ listComisiones: data })
                                    }}
                                    onKeyUp={async (e) => {
                                        if (e.key === "Enter") {
                                            await this.handlerPaginationComisiones(this.state.listComisiones.page, this.state.listComisiones.rows, e.target.value)
                                        }
                                    }}
                                    placeholder="Escriba para buscar" className="form-control" />
                                    <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationComisiones(this.state.listComisiones.page, this.state.listComisiones.rows, this.state.listComisiones.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                </div>
                            </div>
                          
                            <PerfilCongresistaSubList data={this.state.listComisiones.data} propiedades={this.state.listComisiones.propiedades} link={`#/detalle-comision`} params={["comision_id"]} handler={this.handlerPaginationComisiones} pageExtends={this.state.listComisiones.page} pageSize={this.state.listComisiones.rows} totalRows={this.state.listComisiones.rows} />                        </div>
                    </div> 


                    <div className="lg:flex justify-center pageSection">
                        
                        <div className="itemSection info">
                            <h3>Intervenciones de control político</h3>
                            <div className="buscador items-center ml-auto mt-5 lg:mt-0 pd-25">
                                <div className="input-group">
                                    <input type="text" value={this.state.listControlPolitico.search}
                                    onChange={async (e) => {
                                        let data = this.state.listControlPolitico;
                                        data.search = e.target.value;
                                        this.setState({ listControlPolitico: data })
                                    }}
                                    onKeyUp={async (e) => {
                                        if (e.key === "Enter") {
                                            await this.handlerPaginationCtrlPolitico(this.state.listControlPolitico.page, this.state.listControlPolitico.rows, e.target.value)
                                        }
                                    }}
                                    placeholder="Escriba para buscar" className="form-control" />
                                    <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationCtrlPolitico(this.state.listControlPolitico.page, this.state.listControlPolitico.rows, this.state.listControlPolitico.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                </div>
                            </div>
                          
                            <PerfilCongresistaCtrlPoliticoSubList data={this.state.listControlPolitico.data} propiedades={this.state.listControlPolitico.propiedades} link={`#/detalle-ctrl_politico`} params={["ctrl_politico_id"]} handler={this.handlerPaginationCtrlPolitico} pageExtends={this.state.listControlPolitico.page} pageSize={this.state.listControlPolitico.rows} totalRows={this.state.listControlPolitico.rows} />                        </div>
                    </div> 


                </main>
            </>
        )
    }
}


export default PerfilCongresista;