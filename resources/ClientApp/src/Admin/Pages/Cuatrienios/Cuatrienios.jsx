import React, { Component } from "react";
import TableReact from "../../../Components/TableReact";
import CuatrienioDataService from "../../../Services/Catalogo/Cuatrienio.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import DatePicker from "../../../Components/DatePicker";
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import AuthLogin from "../../../Utils/AuthLogin";
import * as FechaMysql from "../../../Utils/FormatDate";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    nombre: "",
    dpfechaInicio:new Date(),
    fechaInicio:2020,
    dpfechaFin:new Date(),
    fechaFin:2020,
    activo: 1,
    user: auth.username(),
};
const errorsConst = {
    id: "",
    nombre: "",
    fechaInicio:"",
    fechaFin:"",
    activo: "",
};

class Cuatrienios extends Component {
    constructor(props) {
        super(props);



        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Cuatrienios",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                            },
                            {
                                Header: "Activo",
                                id: "activo",
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="icheckbox"
                                            checked={
                                                tableProps.row.values.activo
                                            }
                                            readOnly
                                        />
                                    );
                                },
                            },
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Cuatrienio.Obtener}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#modal-accion"
                                                    className="btn btn-info"
                                                    style={{ width: "100%" }}
                                                    onClick={() => {
                                                        this.resetFields();
                                                        this.getByID(
                                                            tableProps.row.values.id
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-edit"></i> Editar
                                                </button>
                                            }
                                    />

                                ),
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Cuatrienio.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#message-box-danger"
                                                    className={`btn ${tableProps.row.values.activo === 1
                                                        ? "btn-danger"
                                                        : "btn-warning"} eliminar`}
                                                    style={{ width: "100%" }}
                                                    data-id={tableProps.row.values.id}
                                                    onClick={() => {
                                                        this.handlerDesactivar(
                                                            tableProps.row.values
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-eraser"></i>{" "}
                                                    {tableProps.row.values.activo === 1
                                                        ? "Desactivar"
                                                        : "Activar"}
                                                </button>
                                            }
                                    />

                                ),
                            },
                        ],
                    },
                ],
                hiddenColumns: ["id", "activo"],
                data: []
            },
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
        };
    }


    async componentDidMount() {
        this.getAll(
            this.state.filterActive.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            nombre: item.nombre,
            activo: item.activo,
            dpfechaInicio:new Date(),
            fechaInicio:new Date(),
            dpfechaFin:new Date(),
            fechaFin:new Date()
        };
        this.setState({
            fields: desActObj,
        });
    };

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.fechaInicio = FechaMysql.YearFormatMySql(data.dpfechaInicio);
        data.fechaFin=FechaMysql.YearFormatMySql(data.dpfechaFin);
        data.nombre=data.fechaInicio +" - "+ data.fechaFin;

        if (this.state.fields["id"] === 0) {
            await CuatrienioDataService.create(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        } else {
            await CuatrienioDataService.update(
                this.state.fields["id"],
                data
            )
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            this.refs.closemodalSave.click();
            this.resetFields();
        }
    };

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await CuatrienioDataService.delete(this.state.fields["id"])
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(
                    error.response.data.errors,
                    errors
                );
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    };

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await CuatrienioDataService.getAll(
            idFilterActive,
            search,
            page,
            rows
        )
            .then((response) => {
                tableInfo["data"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });



        this.setState({
            tableInfo: tableInfo,
            loading: false,
        });
    };

    getByID = async (id) => {
        this.setState({ loading: true });
        await CuatrienioDataService.get(id)
            .then((response) => {

                let fields = response.data;
                console.log(fields)
                fields.dpfechaInicio = new Date(fields.fechaInicio, 0);
                fields.dpfechaFin = new Date(fields.fechaFin, 0);
                Object.assign(fields, { user: auth.username() });
                this.setState({
                    fields: fields,
                    loading: false,
                });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
    };

    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Cuatrienios</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de cuatrienios
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterActive
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterActive
                                                    }
                                                    selectoptions={
                                                        this.state
                                                            .dataSelectActive
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.Cuatrienio.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            style={{ minHeight: "37px" }}
                                                            data-toggle="modal"
                                                            data-target="#modal-accion"
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                this.resetFields();
                                                            }}
                                                        >
                                                            <i className="fa fa-plus"></i> Nuevo registro
                                                        </button>
                                                    }
                                            />

                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Cuatrienio.ObtenerTodos}
                                            DefaultTemplate=
                                                {
                                                    <TableReact
                                                        columns={
                                                            this.state.tableInfo["columns"]
                                                        }
                                                        data={this.state.tableInfo["data"]}
                                                        hiddenColumns={
                                                            this.state.tableInfo[
                                                                "hiddenColumns"
                                                                ]
                                                        }
                                                    />
                                                }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal"
                    id="modal-accion"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="largeModalHead"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    onClick={async () => {
                                        this.resetFields();
                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Cerrar</span>
                                </button>
                                <h4 className="modal-title" id="largeModalHead">
                                    <i className="fa fa-list"></i>{" "}
                                    {this.state.fields["id"] === 0
                                        ? "Nuevo"
                                        : "Editar"}{" "}
                                    cuatrienio{" "}
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form
                                    name="formAccion"
                                    className="form-horizontal"
                                    onSubmit={(e) => {
                                        this.saveSubmit(e);
                                    }}
                                >
                                    <Input
                                        divClass="col-md-12"
                                        inputName="id"
                                        inputType="hidden"
                                        inputValue={this.state.fields["id"]}
                                    />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                            <label>Año de inicio</label>
                                            <div className="input-group">
                                                <DatePicker
                                                  id="dateInicio"
                                                  showInputTime={false}
                                                  divClass="input-group"
                                                  dateSelected={this.state.fields["dpfechaInicio"] || ''}
                                                  onChangeDate={e => {
                                                    let fields = this.state.fields;
                                                    let errors = this.state.errors;
                                                    fields = validForm.handleChangeDateField("dpfechaInicio", fields, e);
                                                    errors = validForm.handleChangeErrors("fechaInicio", errors, e);
                                                    this.setState({ fields: fields, errors: errors });}}
                                                  spanClass="error"
                                                  spanError={this.state.errors["fechaInicio"] || ''}
                                                  divClassSpanType={1}
                                                  divClassSpan="input-group-addon"
                                                  yearPicker={true}
                                                  divClassSpanI="fa fa-calendar"/>
                                            </div>
                                            </div>
                                            <div className="form-group">
                                            <label>Año de finalización</label>
                                                <div className="input-group">
                                                    <DatePicker
                                                      id="dateInicio"
                                                      showInputTime={false}
                                                      divClass="input-group"
                                                      dateSelected={this.state.fields["dpfechaFin"] || ''}
                                                      yearPicker={true}
                                                      onChangeDate={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleChangeDateField("dpfechaFin", fields, e);
                                                        errors = validForm.handleChangeErrors("fechaFin", errors, e);
                                                        this.setState({ fields: fields, errors: errors });}}
                                                      spanClass="error"
                                                      spanError={this.state.errors["fechaFin"] || ''}
                                                      divClassSpanType={1}
                                                      divClassSpan="input-group-addon"
                                                      divClassSpanI="fa fa-calendar"/>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 push-up-30">
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                data-dismiss="modal"
                                                ref="closemodalSave"
                                                onClick={async () => {
                                                    this.resetFields();
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.Cuatrienio.Nuevo
                                                        : ModuloPermiso.Cuatrienio.Modificar
                                                }
                                                DefaultTemplate=
                                                    {
                                                        <button className="btn btn-success pull-right">
                                                            <i className="fa fa-check">
                                                            </i> Guardar
                                                        </button>
                                                    }
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} cuatrienio</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} el cuatrienio ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Cuatrienio.Eliminar}
                                            DefaultTemplate=
                                                {
                                                    <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
                                                }
                                        />
                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
            </div>
        );
    }
}

export default Cuatrienios;
