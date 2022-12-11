import React, { Component } from 'react';
import TableReactExtends from "../../../Components/TableReactExtends";
import ComisionDataService from "../../../Services/Catalogo/Comision.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', corporacion_id: 0, tipo_comision_id: 0, descripcion: '', activo: false };
const errorsConst = { id: '', nombre: '', corporacion_id: '', descripcion: '', activo: '' };
const SelectCorporacion = { value: -1, label: 'Filtrar por corporacion' };
const SelectTipoComision = { value: -1, label: 'Filtrar por tipo comision' };

class Comisiones extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Comisiones",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre"
                            },
                            {
                                Header: "Tipo de comision",
                                accessor: "tipo_comision.nombre"
                            }
                        ]
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Comision.Obtener}
                                        DefaultTemplate={
                                            <a href={`#/comision-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                className="btn btn-info btn-block">
                                                <i className="fa fa-edit"></i> Editar
                                            </a>
                                        }
                                    />
                                )
                            }
                        ]
                    }
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0
            },
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            filterCorporacion: SelectCorporacion,
            dataSelectCorporacion: [],
            filterTipoComision: SelectTipoComision,
            dataSelectTipoComision: []
        }
    }

    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay)
            tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(async function () {
            await this.getAll(this.state.filterActive.value, this.state.filterCorporacion.value, this.state.filterTipoComision.value, page, rows, search);
        }.bind(this), delayAccion);
    }
    componentDidMount = async () => {
        await this.getAll(this.state.filterActive.value, this.state.filterCorporacion.value, this.state.filterTipoComision.value, this.state.tableInfo["page"], this.state.tableInfo["rows"], this.state.tableInfo["search"]);
        await this.getComboTipoComision();
    }

    getComboTipoComision = async (value) => {
        await UtilsDataService.getComboTipoComision(value)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar por tipo de comisión" })
                this.setState({
                    dataSelectTipoComision: combo
                })
            });
    }

    getAll = async (idFilterActive, idCorporacion, idTipoComision, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await ComisionDataService.getAll(idFilterActive, idCorporacion, idTipoComision, search, page, rows)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        await ComisionDataService.getTotalRecordsComision(idFilterActive, idCorporacion, idTipoComision, search)
            .then(response => {
                tableInfo["totalRows"] = response.data;
            })
            .catch(e => {
                console.log(e);
            })

        this.setState({
            tableInfo: tableInfo,
            loading: false
        });
    }

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value, this.state.filterCorporacion.value, this.state.filterTipoComision.value, this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
    }

    handleFilterCorporacion = async (selectCorporacion) => {
        this.setState({ filterCorporacion: selectCorporacion, filterTipoComision: SelectTipoComision });
        await this.getAll(
            this.state.filterActive.value, selectCorporacion.value, SelectTipoComision.value, this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
        await this.getComboTipoComision(selectCorporacion.value);
    }

    handleFilterTipoComision = async (selectTipoComision) => {
        this.setState({ filterTipoComision: selectTipoComision });
        await this.getAll(
            this.state.filterActive.value, this.state.filterCorporacion.value, selectTipoComision.value, this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Catálogos</a></li>
                    <li><a href="/">Comisiones</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de comisiones</h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "200px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterTipoComision}
                                                    selectOnchange={this.handleFilterTipoComision}
                                                    selectoptions={this.state.dataSelectTipoComision}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    noOptionsMessage="Seleccione corporación"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterActive}
                                                    selectOnchange={this.handleFilterActive}
                                                    selectoptions={this.state.dataSelectActive}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Comision.Index}
                                            DefaultTemplate={
                                                <TableReactExtends
                                                    columns={this.state.tableInfo["columns"]}
                                                    data={this.state.tableInfo["data"]}
                                                    hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                                    handler={this.tableHandler}
                                                    pageExtends={this.state.tableInfo["page"]}
                                                    totalRows={this.state.tableInfo["totalRows"]}
                                                    search={this.state.tableInfo["search"]}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Comisiones;
