import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "proyectoley";

class ProyectoLeyDataService {
    async getAll(corporacion, cuatrienio, legislatura, iniciativa, tema, estado, tipo, search = "", page = 1, rows = 5) {
        return await http.get(
            `/${NombreDelModulo}?corporacion=${corporacion}&cuatrienio=${cuatrienio}&legislatura=${legislatura}&iniciativa=${iniciativa}&tema=${tema}&estado=${estado}&tipo=${tipo}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getProyectosRecientesEditados() {
        return await http.get(`/${NombreDelModulo}/getRecientesEditados`);
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async getTotalRecords(corporacion, cuatrienio, legislatura, iniciativa, tema, estado, tipo, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?corporacion=${corporacion}&cuatrienio=${cuatrienio}&legislatura=${legislatura}&iniciativa=${iniciativa}&tema=${tema}&estado=${estado}&tipo=${tipo}&search=${search}`
        );
    }
    async getAutoresFilter(nombre, proyecto, partido){
        return await http.get(`/${NombreDelModulo}/getAutoresFilter?nombre=${nombre}&proyecto=${proyecto}&partido=${partido}`);
    }
    async getPonentesFilter(tipo, proyecto, partido){
        return await http.get(`/${NombreDelModulo}/getPonentesFilter?tipo=${tipo}&proyecto=${proyecto}&partido=${partido}`);
    }
    async getCountVotos(votacion){
        return await http.get(`/${NombreDelModulo}/getCountVotos?votacion=${votacion}`);
    }

    async getAlertaProyectoLey(idAlerta){
        return await http.get(`/${NombreDelModulo}/getAlertaProyectoLey?idAlerta=${idAlerta}`);
    }
    
}

export default new ProyectoLeyDataService();
