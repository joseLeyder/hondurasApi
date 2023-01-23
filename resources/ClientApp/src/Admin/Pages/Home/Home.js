import React, { Component } from 'react';
import Spinner from '../../../Components/Spinner';

class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ loading: false });
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        if(window.location.href.includes("/?#/home"))            
                window.location.href = "/#/home";

        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li><a href="#/">Página principal</a></li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row menuHome">
                        {/* <div className="col-md-3">
                            <a href="#/agenda" className="tile tile-danger"><span className="fa fa-calendar-alt"></span> <p>Agenda legislativa</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/alerta" className="tile tile-success"><span className="fa fa-bell"></span> <p>Alertas</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/proyectos" className="tile tile-info"><span className="fa fa-book"></span> <p>Proyectos de ley</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/representantes" className="tile tile-primary"><span className="fa fa-users"></span> <p>Congresistas</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/comisiones" className="tile tile-warning"><span className="fa fa-university"></span> <p>Comisiones</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/contacto-tickets" className="tile tile-danger"><span className="fa fa-ticket-alt"></span> <p>Tickets</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/contacto-avisos" className="tile tile-danger"><span className="fa fa-exclamation"></span> <p>Avisos</p></a>
                        </div> */}
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-12 sloganDesc">
                            <h2> Bienvenidos al Observatorio Legislativo de UCCAEP.</h2>
                        </div>
                        <div className="col-md-12 resumen">
                                <p> En este sistema encontrará información sobre expedientes que se encuentran en trámite en la Asamblea Legislativa y que son considerados por la Unión de Cámaras como transversales y de mayor importancia para el sector productivo; además, podrá obtener información relevante sobre los diputados de la República y recibir alertas sobre el quehacer legislativo. </p>
                                <p> <strong>Es un gusto tener esta herramienta al servicio de nuestras cámaras y asociaciones afiliadas. </strong></p>
                        </div>
                        <div className="col-md-2">
                            <div className="col-md-6 ">
                                <div className="">
                                    <div className="col-md-2">
                                        <img src="/images/UCCAEP.png" alt="UCCAEP"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
