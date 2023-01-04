import React, { Component } from "react";
import ControlPoliticoDataService from "../../../Services/Congreso/ControlPolitico.Service";
import CtrlPoliticoService from "../../../Services/Congreso/CtrlPolitico.service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { Constantes } from "../../../Constants/Constantes.js";
import { ThemeProvider } from "react-bootstrap";
import Glosario from '../../../Components/Glosario';

const auth = new AuthLogin();
const validForm = new ValidForm();
const constFileds = {
    id: 0,
    tema:"",
    proyecto_ley_id: 0,
    persona_id: 0,
    fecha: new Date(),
    intervencion:'',
    user: ""
};
const constErrors = {
    id: '',
    tema: '',
    proyecto_ley_id: '',
    intervencion: '',
    persona_id: '',
    fecha: "",
    activo: '',
};

const constErrorsModal = {
    errorCuatrienio: '',
    errorMiembro: '',
    errorCargo: ''
};
const buttonList = [
    [
        "undo",
        "redo",
        "font",
        "fontSize",
        "formatBlock",
        "paragraphStyle",
        "blockquote",
        "bold",
        "underline",
        "italic",
        "strike",
        "subscript",
        "superscript",
        "fontColor",
        "hiliteColor",
        "textStyle",
        "removeFormat",
        "outdent",
        "indent",
        "align",
        "horizontalRule",
        "list",
        "lineHeight",
        "table",
        "link",
        "image",
        "video",
        "audio" /** 'math', */, // You must add the 'katex' library at options to use the 'math' plugin. // You must add the "imageGalleryUrl".
        /** 'imageGallery', */ "fullScreen",
        "showBlocks",
        "codeView",
        "preview",
        "print",
        "save",
        "template",
    ],
];

const SelectCorporacion = { value: -1, label: 'Seleccione proyecto' };
const SelectDiputado = { value: -1, label: 'Seleccione un Diputado' };

class ControlPoliticoAddUpd extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: false,
            fields: constFileds,
            errors: constErrors,
          
            selectCorporacion: SelectCorporacion,
            SelectDiputado: SelectDiputado,
            dataSelectCorporacion: [SelectCorporacion],
            dataSelectDiputado: [SelectDiputado],
        
            glosarioSelected: [],
            glosarioData: [],
            url: "",
            txtDetalles: ""
        };
    }

    componentDidMount = async () => {
        this.resetFields();
     
        await this.getComboCorporacion();
        await this.getComboDiputado();
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();

        let id = this.state.id;
        if (id != 0) {
            await this.getByID(id);
        }
        //await this.getComboGlosarioLegislativo();
    };

    //Combos
    
    getComboCorporacion = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboProyectoLey().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.titulo })
            })
            combo.unshift(SelectCorporacion)
            this.setState({
                dataSelectCorporacion: combo,
                loading: false
            });
        });
    }
    getComboDiputado = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboDiputado().then(response => {
            console.log("Response->",response)
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombres })
            })
            combo.unshift(SelectDiputado)
            this.setState({
                dataSelectDiputado: combo,
                loading: false
            });
        });
    }
    
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
   
    //End combos


    //Handlers

    handleSelectCorporacion = async (selectCorporacion) => {
        this.setState({ selectCorporacion: selectCorporacion});

    }
    handleSelectDiputado = async (selectDiputado) => {
        this.setState({ SelectDiputado: selectDiputado });
     
    }


    //End handlers

    //Metodos

    getByID = async (id) => {
        this.setState({ loading: true });
        let fields = null;
        let txtDetalles = this.state.txtDetalles;
        await CtrlPoliticoService.get(id)
            .then((response) => {
                fields = this.state.fields;
                let errors = this.state.errors;
                fields = response.data[0];
                txtDetalles = fields.intervencion;
                console.log(fields,txtDetalles);
                Object.assign(fields, { user: auth.username() });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
        if (fields !== null) {
            // await this.getComboLegislatura(fields.cuatrienio_id);
            // await this.getComboTipoComision(fields.corporacion_id);
            // if(fields.comision !== null)
            //     await this.getComboComision(fields.corporacion_id, fields.comision.tipo_comision_id)
            this.setState({
                fields: fields,
                loading: false,
                intervencion: txtDetalles
            }, () => {
                this.setSelectValue(
                    fields.proyecto_ley_id,
                    "dataSelectCorporacion",
                    "selectCorporacion"
                );
                this.setSelectValue(
                    fields.persona_id ,
                    "dataSelectDiputado",
                    "SelectDiputado"
                );              
            });
        }
    };

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.fields;
        data.fecha = FechaMysql.DateFormatMySql(data.fecha);
        data.proyecto_ley_id = this.state.selectCorporacion.value;
        data.persona_id = this.state.SelectDiputado.value;
        data.user = auth.username();
        let responseData;
        console.log(data);
        if (data.id === 0) {
            await CtrlPoliticoService.create(data)
                .then((response) => {
                    responseData = response.data;
                    console.log(responseData);
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        } else {
            await CtrlPoliticoService.update(data.id, data)
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
            this.resetFields();
            this.props.history.push({
                pathname: "/control-politico",
            });
        }
    };

    resetFields() {
        let fields = Object.assign({}, constFileds);
        let errors = validForm.cleanErrors(this.state.errors);
        this.setState({ fields, errors: validForm.cleanErrors(this.state.errors), txtDetalles: '' });
    }

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Control político</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">
                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">
                                            <strong>
                                                <i className="fa fa-user"></i>{" "}
                                                {this.state.fields["id"] === 0
                                                    ? "Crear"
                                                    : "Editar"}{" "}
                                                control político
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información del control político</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Tema                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="tema"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el tema"
                                                                inputValue={
                                                                    this.state
                                                                        .fields
                                                                        .tema ||
                                                                    ""
                                                                }
                                                                inputOnchange={(
                                                                    e
                                                                ) => {
                                                                    let fields = this
                                                                        .state
                                                                        .fields;
                                                                    let errors = this
                                                                        .state
                                                                        .errors;
                                                                    fields = validForm.handleChangeField(
                                                                        "tema",
                                                                        fields,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "tema",
                                                                        errors,
                                                                        e
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            fields: fields,
                                                                            errors: errors,
                                                                        }
                                                                    );
                                                                }}
                                                                spanClass="error"
                                                                spanError={
                                                                    this.state
                                                                        .errors[
                                                                    "tema"
                                                                    ] || ""
                                                                }
                                                                divClassSpanType={
                                                                    1
                                                                }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Proyecto de ley
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectCorporacion}
                                                                selectOnchange={this.handleSelectCorporacion}
                                                                selectoptions={this.state.dataSelectCorporacion}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["proyecto_ley_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                   <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Diputado
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.SelectDiputado}
                                                                selectOnchange={this.handleSelectDiputado}
                                                                selectoptions={this.state.dataSelectDiputado}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["persona_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Fecha
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="date"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.fields["fecha"] || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("fecha", fields, e);
                                                                    errors = validForm.handleChangeErrors("fecha", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["fecha"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar" />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Intervención
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.intervencion || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state.fields;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("intervencion", fields, e);
                                                                errors = validForm.handleChangeErrors("intervencion", errors, e);
                                                                this.setState({ state: fields, errors: errors, });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 400,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["intervencion"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="panel-footer">
                                            {
                                                this.state.id !== 0 ?
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Modificar}
                                                        DefaultTemplate={<button
                                                            type="button"
                                                            onClick={() => {
                                                                this.saveSubmit();
                                                            }}
                                                            className="btn btn-success pull-right"
                                                        >
                                                            <i className="fa fa-check"></i>{" "}
                                                                Guardar
                                                            </button>}
                                                    />
                                                    :
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Nuevo}
                                                        DefaultTemplate={<button
                                                            type="button"
                                                            onClick={() => {
                                                                this.saveSubmit();
                                                            }}
                                                            className="btn btn-success pull-right"
                                                        >
                                                            <i className="fa fa-check"></i>{" "}
                                                                Guardar
                                                            </button>}
                                                    />
                                            }

                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal footer-fixed" id="select-concepto" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Cerrar</span>
                                    </button>
                                    <h4 className="modal-title" id="largeModalHead">
                                    <i className="fas fa-font"></i>{" "}
                                        Seleccionar conceptos
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form name="formCurul" className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Glosario 
                                                accesableKey="palabra" 
                                                glosarioData={this.state.glosarioData} 
                                                selectWordHandler={this.selectWordHandler}
                                                unselectWordHandler={this.unselectWordHandler}
                                                glosarioSelected={this.state.glosarioSelected} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {/* <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Cerrar</button> */}
                                            <button className="btn btn-primary pull-right" data-dismiss="modal"><i className="fa fa-check"></i> Aceptar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ControlPoliticoAddUpd;
