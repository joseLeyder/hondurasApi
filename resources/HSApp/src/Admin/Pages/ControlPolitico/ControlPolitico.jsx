import React from "react";
import Select from "../../../Components/Select";
import SelectCurul from "../../../Components/SelectCurul";
import ControlPoliticoDataService from "../../../Services/ControlPolitico/ControlPolitico.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import PerfilCongresistaCtrlPoliticoSubList from "../../../Components/CongresoVisible/PerfilCongresistaCtrlPoliticoSubList";
import { Constantes } from "../../../Constants/Constantes.js";
import CtrlPoliticoList from "../../../Components/CongresoVisible/CtrlPoliticoList";

const auth = new AuthLogin();
const defaultDiputado = { value: -1, label: "Seleccione un diputado" };
const defaultProyectoDeLey = { value: -1, label: "Seleccione un proyecto de ley" };


class ControlPolitico extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            subloader: true,

            filterProyectoDeLey: { value: -1, label: "Elegir proyecto de ley" },
            filterDiputado: { value: -1, label: "Ver todos" },
            filterActive: { value: 1, label: "Activo" },

            dataSelectProyectoDeLey: [],
            dataSelectDiputado: [],

            listData: [],
            curulData: [],
            page: 1,
            rows: 8,
            search: "",
            totalRows: 0,
            propiedades:
            {
                id : 'id',
                proyecto : 'titulo',
                diputado : 'nombre',
                fecha : 'fecha',
                intervencion: 'intervencion'
                // id: 'id',
                // title: 'titulo',
                //     description:
                //         [
                //         {title : "Proyecto de ley: ", text: "titulo"},
                //             { title: "Intervención: ", text: "intervencion" },
                //             {title: "Diputado: ", text:"nombre"},
                //             {title: "Fecha:", text:"fecha"  }
                //         //  { title: "Tipo: ", text: "comision.tipocomision.nombre" },
                //         ]
            },
            esCurul: true,
            esLista: false,
        };
    }
    handlerFilterProyectoDeLey = async (proyectoDeLeySelected) => {
        this.setState({
            filterProyectoDeLey: proyectoDeLeySelected,
            subloader: true,
        });
        await this.getAll(
            1,
            proyectoDeLeySelected.value,                
            this.state.filterDiputado.value,
            this.state.page,
            this.state.rows,
            this.state.search
        );
    };
    handlerFilterDiputado = async (diputadoSelected) => {        
            this.setState({
                filterDiputado: diputadoSelected,
                subloader: true,
            });
            await this.getAll(
                1,
                this.state.filterProyectoDeLey.value,                
                diputadoSelected.value,
                this.state.page,
                this.state.rows,
                this.state.search
            );        
    };

    
    handlerPagination = async (page, rows, search = "") => {
        this.setState({ page, rows, search });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    1,
                    this.state.filterProyectoDeLey.value,
                    this.state.filterDiputado.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    };

    componentDidMount = async () => {
        await this.getListadoIntervenciones();
    };

    getAll = async (
        idFilterActive,
        proyectoDeLey,
        diputado,
        page,
        rows,
        search
    ) => {
        this.setState({ subloader: true });
        let listData = this.state.listData;
        await ControlPoliticoDataService.getAll(
            idFilterActive,
            proyectoDeLey,
            diputado,
            search,
            page,
            rows
        )
            .then((response) => {

                let listDataTemp = [];

                response.data.forEach(i => {
                    listDataTemp.push({ 
                        id: i.id, 
                        intervencion: i.intervencion,
                        titulo :  (i.proyecto_ley === null ? ' Sin proyecto ' : i.proyecto_ley.titulo),
                        nombre : i.persona.nombres + ' ' + i.persona.apellidos,
                        fecha: new Date(i.fecha).toLocaleDateString('es-mx', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
                    })
                })
                listData = listDataTemp;
            })
            .catch((e) => {
                console.error(e);
            });
        let totalRows = 0;
        await ControlPoliticoDataService.getTotalRecordsControlPolitico(
            idFilterActive,
            proyectoDeLey,
            diputado,
            search
        )
            .then((response) => {
                totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listData,
            totalRows,
            subloader: false,
        });
    };

    getComboProyectoDeLey = async () => {
        await ControlPoliticoDataService.getComboProyectoDeLey().then(
            (response) => {
                let combo = [];
                let selected = { value: -1, label: "Ver todos" };
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.titulo });
                });
                combo.unshift({ value: -1, label: "Ver todos" });
                this.setState({
                    dataSelectProyectoDeLey: combo,
                    filterProyectoDeLey: selected,
                });
            }
        );
    };

    getComboDiputado = async () => {
        await ControlPoliticoDataService.getComboDiputado().then(
            (response) => {
                let combo = [];
                let selected = { value: -1, label: "Ver todos" };
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombres + ' ' + i.apellidos });
                });
                combo.unshift({ value: -1, label: "Ver todos" });
                this.setState({
                    dataSelectDiputado: combo,
                    filterDiputado: selected,
                });
            }
        );
    };

    getListadoIntervenciones = async () => {
        this.setState({ subloader: true });
        // Verificamos si cada combo tiene datos, sino, se mandan a traer.        
        if (
            this.state.dataSelectDiputado.length === 0 ||
            typeof this.state.dataSelectDiputado === "undefined" ||
            this.state.dataSelectDiputado === null
        )
            await this.getComboDiputado();
        if (
            this.state.dataSelectProyectoDeLey.length === 0 ||
            typeof this.state.dataSelectProyectoDeLey === "undefined" ||
            this.state.dataSelectProyectoDeLey === null
        )
            await this.getComboProyectoDeLey();
        

        await this.getAll(
            this.state.filterActive.value,
            this.state.filterProyectoDeLey.value,
            this.state.filterDiputado.value,
            this.state.page,
            this.state.rows,
            this.state.search
        );
    };

    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Control político</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Intervenciones de control político</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Listado</li>
                            </ul>
                        </div>

                        <div className="buscador items-center ml-auto mt-5 lg:mt-0 pd-25">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={this.state.search}
                                    onChange={async (e) => {
                                        this.setState({search: e.target.value});
                                    }}
                                    onKeyUp={async (e) => {
                                        if (e.key === "Enter") {
                                            await this.handlerPagination(this.state.page, this.state.rows, e.target.value);
                                        }
                                    }}
                                    placeholder="Escriba para buscar"
                                    className="form-control"
                                />

                                <span className="input-group-text">
                                    <button
                                        onClick={async () => {
                                            await this.handlerPagination(this.state.page, this.state.rows, this.state.search);
                                        }}
                                        type="button"
                                        className="btn btn_primary uppercase mr-5 mb-5"
                                    >
                                        <span className="icon la la-search"></span>
                                    </button>
                                </span>
                                <span className="input-group-text">
                                    <button
                                        onClick={(e) => {
                                            toggleFilter(e.currentTarget);
                                        }}
                                        type="button"
                                        className="btn btn_secondary uppercase mb-5"
                                    >
                                        <span className="icon la la-filter"></span>
                                    </button>
                                </span>
                            </div>
                            <div className="floatingFilters evenColors">
                                <div className="one-columns relative no-margin">
                                    <div className="item">
                                        <label htmlFor="">Proyecto de ley</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterProyectoDeLey}
                                            selectOnchange={this.handlerFilterProyectoDeLey}
                                            selectoptions={this.state.dataSelectProyectoDeLey}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Diputado</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterDiputado}
                                            selectOnchange={this.handlerFilterDiputado}
                                            selectoptions={this.state.dataSelectDiputado}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="relative">
                    
                        <div className={`subloader ${this.state.subloader ? "active" : ""}`}><div className="relative"></div></div>
                        
                        <CtrlPoliticoList 
                                data={!this.state.subloader? this.state.listData: []}
                                propiedades={this.state.propiedades} 
                                link={`#/detalle-control-politico`} 
                                params={["id"]} 
                                handler={this.handlerPagination} 
                                pageExtends={this.state.page} 
                                pageSize={this.state.rows} 
                                totalRows={this.state.rows} />
                    </div>
                </main>
            </>
        );
    }
}

function toggleFilter(element) {
    element.parentNode.parentNode.parentNode
        .querySelector(".floatingFilters")
        .classList.toggle("active");
}

export default ControlPolitico;
