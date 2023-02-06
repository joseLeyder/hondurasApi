import React from 'react';
import ActividadesLegislativasDataService from "../../../Services/ActividadesLegislativas/ActividadesLegislativas.Service";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
const dataConst = {
    id: 0,
    informacion: "",
    proyecto_ley: {
        id: 0,
        titulo: "",
    }

}
class DetalleAlertaProyecto extends React.Component {
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
        await ActividadesLegislativasDataService.getAlertaDetalle(id)
            .then(response => {
                console.log(response.data);
                if(response.data !== null)
                {
                    console.log("1");
                    if(response.data[0] !== undefined)
                {
                    console.log("2");
                this.setState({
                    data: response.data[0],
                    subloader: false
                });
            }
            }
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
                            <h1>Detalle de alerta de proyecto de ley</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Alerta de proyecto de ley</li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Detalle</li>
                            </ul>
                        </div>
                    </section>

                    <div className="lg:flex justify-center pageSection">
                        
                        <div className="info">
                            <div className="itemSection">
                            <h3></h3>
                                <div className="lg:flex lg:-mx-4">
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <h3 className="mt-2">Proyecto de ley</h3>
                                                <div className="text-primary mt-1 text-xl leading-none">{this.state.data.proyecto_ley?.titulo || "Sin proyecto de ley"}</div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="itemSection">
                                <h3>Información</h3>
                                <div className="lg:flex flex-wrap">
                                <div dangerouslySetInnerHTML={{ __html: this.state.data.informacion  === null
                                                    || this.state.data.informacion === ""
                                                    || this.state.data.informacion === undefined
                                                    ? "No disponible" : this.state.data.informacion}}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </>
        )
    }
}


export default DetalleAlertaProyecto;