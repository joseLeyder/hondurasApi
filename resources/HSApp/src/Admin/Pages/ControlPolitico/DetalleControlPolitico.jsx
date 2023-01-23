import React from 'react';
import ControlPoliticoDataService from "../../../Services/ControlPolitico/ControlPolitico.Service";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
const dataConst = {
    id: 0,
    fecha: "",
    tema: "",
    intervencion: "",
    persona: 
    {
        nombres: "",
        apellidos: "",
    },
    proyecto_de_ley: {
        id: 0,
        nombre: "",
    }

}
class DetalleControlPolitico extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id: id,
            subloader: true,
            data: dataConst
        }
    }
  
    componentDidMount = async () => {
        await this.getByID(this.state.id);
    }
    
    getByID = async (id) => {
        this.setState({ subloader: true });
        await ControlPoliticoDataService.get(id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    data: response.data[0],
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

    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Detalle de intervención</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#/control-politico">Control político</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Detalle</li>
                            </ul>
                        </div>
                    </section>

                    <div className="lg:flex justify-center pageSection">
                        
                        <div className="info">
                            <div className="itemSection">
                            <h3>{this.state.data.tema}</h3>
                                <div className="lg:flex lg:-mx-4">
                                        <div className="lg:w-1/3 lg:px-4">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Diputado</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.persona.nombres} {this.state.data.persona.apellidos}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Fecha</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.fecha || "Sin fecha"}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Proyecto de ley</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.proyecto_de_ley?.nombre || "Sin proyecto de ley"}</div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="itemSection">
                                <h3>Intervención</h3>
                                <div className="lg:flex flex-wrap">
                                <div dangerouslySetInnerHTML={{ __html: this.state.data.intervencion  === null
                                                    || this.state.data.intervencion === ""
                                                    || this.state.data.intervencion === undefined
                                                    ? "No disponible" : this.state.data.intervencion}}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </>
        )
    }
}


export default DetalleControlPolitico;