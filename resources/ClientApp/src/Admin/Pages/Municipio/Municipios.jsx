import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import MunicipioDataService from "../../../Services/Catalogo/Municipio.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import Input from "../../../Components/Input";
import UtilsService from "../../../Services/General/Utils.Service";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    nombre: '',
    activo: 1,
    user: auth.username(),
};
const errorsConst = {
    id: '',
    nombre: '',
    activo: '',
    user: '',
};

class Municipios extends Component {
    constructor(props) {
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Provincias",
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
                                        IdModuloPermisoValidar={ModuloPermiso.Municipio.Obtener}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#modal-accion"
                                                    className="btn btn-info"
                                                    style={{ width: "100%" }}
                                                    onClick={async () => {
                                                        this.resetFields();
                                                        await this.getByID(
                                                            tableProps.row.values.id
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-edit"/> Editar
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
                                        IdModuloPermisoValidar={ModuloPermiso.Municipio.Eliminar}
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
                                                    <i className="fa fa-eraser"/>{" "}
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

    //<editor-fold desc="General">
    async componentDidMount() {
        await this.getAll(
            this.state.filterActive.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
    }
    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;

        if (this.state.fields["id"] === 0) {
            await MunicipioDataService.create(data)
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
            await MunicipioDataService.update(
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
            this.refs.closeModalSave.click();
            this.resetFields();
        }
    };
    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await MunicipioDataService.delete(this.state.fields["id"])
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
    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        }, ()=> {
            this.resetSelectsModal();
        });
    }
    resetSelectsModal = () => {
       
    };
    setSelectValue = (id, dataSelect, filter) => {
        let select = this.state[`${dataSelect}`];
        id = Number.parseInt(id);
        for (let i = 0; i < select.length; i++) {
            let idSelect = Number.parseInt(select[i].value);

            if (idSelect === id) {
                this.setState({ [filter]: select[i] });
                break;
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="Get">
    getByID = async (id) => {
        this.setState({ loading: true });
        await MunicipioDataService.get(id)
            .then((response) => {
                let fields = response.data;
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
    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await MunicipioDataService.getAll(
            idFilterActive,
            search,
            page,
            rows
        ).then((response) => {
            tableInfo["data"] = response.data;
        })
            .catch((e) => {
                console.log(e);
            });

        await MunicipioDataService.totalrecords(idFilterActive, search)
            .then((response) => {
                tableInfo["totalRows"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({
            tableInfo: tableInfo,
            loading: false,
        });
    };

    //</editor-fold>

    //<editor-fold desc="Handler">
    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            nombre: item.nombre,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };
    //</editor-fold>

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay) tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    this.state.filterActive.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            delayAccion
        );
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Provincias</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"/>{" "}
                                        Listado de Provincias
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
                                                IdModuloPermisoValidar={ModuloPermiso.Municipio.Nuevo}
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
                                                            <i className="fa fa-plus"/> Nuevo registro
                                                        </button>
                                                    }
                                            />

                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Municipio.ObtenerTodos}
                                            DefaultTemplate=
                                                {
                                                    <TableReactExtends
                                                        columns={
                                                            this.state.tableInfo["columns"]
                                                        }
                                                        data={this.state.tableInfo["data"]}
                                                        hiddenColumns={
                                                            this.state.tableInfo[
                                                                "hiddenColumns"
                                                                ]
                                                        }
                                                        handler={this.tableHandler}
                                                        pageExtends={
                                                            this.state.tableInfo["page"]
                                                        }
                                                        totalRows={
                                                            this.state.tableInfo[
                                                                "totalRows"
                                                                ]
                                                        }
                                                        search={
                                                            this.state.tableInfo["search"]
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

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}/> {this.state.fields.activo ? "Desactivar" : "Activar"} provincia</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la provincia ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Municipio.Eliminar}
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
                                    <i className="fa fa-list"/>{" "}
                                    {this.state.fields["id"] === 0
                                        ? "Nueva"
                                        : "Editar"}{" "}
                                    provincia{" "}
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form
                                    name="formAccion"
                                    className="form-horizontal"
                                    onSubmit={async (e) => {
                                        await this.saveSubmit(e);
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
                                                <div className="col-md-12">
                                                    <label htmlFor="">
                                                        Nombre
                                                    </label>
                                                    <Input
                                                        divClass="input-group"
                                                        inputName="nombre"
                                                        inputType="text"
                                                        inputClass="form-control"
                                                        inputplaceholder="Ingrese el nombre del municipio"
                                                        inputValue={
                                                            this.state.fields[
                                                                "nombre"
                                                                ] || ""
                                                        }
                                                        inputOnchange={(e) => {
                                                            let fields = this
                                                                .state.fields;
                                                            let errors = this
                                                                .state.errors;
                                                            fields = validForm.handleChangeField(
                                                                "nombre",
                                                                fields,
                                                                e
                                                            );
                                                            errors = validForm.handleChangeErrors(
                                                                "nombre",
                                                                errors,
                                                                e
                                                            );
                                                            this.setState({
                                                                fields: fields,
                                                                errors: errors,
                                                            });
                                                        }}
                                                        spanClass="error"
                                                        spanError={
                                                            this.state.errors[
                                                                "nombre"
                                                                ] || ""
                                                        }
                                                        divClassSpanType={1}
                                                        divClassSpan="input-group-addon"
                                                        divClassSpanI="fa fa-indent"
                                                    />
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
                                                ref="closeModalSave"
                                                onClick={() => {
                                                    this.resetFields();
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.Municipio.Nuevo
                                                        : ModuloPermiso.Municipio.Modificar
                                                }
                                                DefaultTemplate=
                                                    {
                                                        <button className="btn btn-success pull-right">
                                                            Guardar
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

            </div>
        );
    }
}

export default Municipios;
