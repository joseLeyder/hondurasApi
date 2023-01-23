import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const comisiones = "controlpolitico";
const Utils = "utils";

class ControlPoliticoDataService{
    async getAll(
        idFilter,
        proyectoDeLey,
        diputado,
        search = "",
        page = 1,
        rows = 4
    ) {
        if(proyectoDeLey == -1)
            proyectoDeLey = '';
        if(diputado == -1)
            diputado = '';
        return await http.get(
            `/control-politico?idFilter=${idFilter}&proyectoDeLey=${proyectoDeLey}&diputado=${diputado}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecordsControlPolitico(idFilter, proyectoDeLey, diputado, search) {
        if(proyectoDeLey == -1)
            proyectoDeLey = '';
        if(diputado == -1)
            diputado = '';
        return await http.get(
            `/control-politico/totalrecords?idFilter=${idFilter}&proyectoDeLey=${proyectoDeLey}&diputado=${diputado}&search=${search}`
        );
    }
    async get(id) {
        return await http.get(`/control-politico/${id}`);
    }

    async getCitantesFilter(nombre, controlPolitico){
        return await http.get(`controlpolitico/getCitantesFilter?nombre=${nombre}&controlPolitico=${controlPolitico}`);
    }
    async getCitadosFilter(nombre, controlPolitico){
        return await http.get(`controlpolitico/getCitadosFilter?nombre=${nombre}&controlPolitico=${controlPolitico}`);
    }

    async getComboProyectoDeLey() {
        return await apibase.get(`/${Utils}/getComboProyectosDeLey`);
    }
    async getComboDiputado() {
        return await apibase.get(`/${Utils}/getComboDiputado`);
    }


}

export default new ControlPoliticoDataService();

