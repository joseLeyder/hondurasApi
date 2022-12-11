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
                </div>
            </div>
        );
    }
}

export default Home;
