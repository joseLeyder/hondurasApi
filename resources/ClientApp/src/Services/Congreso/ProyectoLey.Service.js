import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "proyectoLey";

class ProyectoLeyDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async createAlerta(data) {
        return await http.post(`/${NombreDelModulo}/storeAlerta`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async updateAlerta(id, data) {
        return await http2.post(`/${NombreDelModulo}/updateAlerta/${id}`, data);
    }
    async getAll(idFilter, tipo, estado, iniciativa, tema, legislatura, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&tipo_id=${tipo}&estado_id=${estado}&iniciativa_id=${iniciativa}&tema_id=${tema}&legislatura_id=${legislatura}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getAlertas(id_proyecto_ley, idFilter, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}/getAlertas?id_proyecto_ley=${id_proyecto_ley}&idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecordsAlertas(id_proyecto_ley, idFilter, search = "") {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsAlertas?id_proyecto_ley=${id_proyecto_ley}&idFilter=${idFilter}&search=${search}`
        );
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async getAlerta(id) {
        return await http.get(`/${NombreDelModulo}/getAlerta/${id}`);
    }
    async delete(id) {
        return await http.delete(`/${NombreDelModulo}/${id}`);
    }
    async deleteAlerta(id) {
        return await http.delete(`/${NombreDelModulo}/deleteAlerta/${id}`);
    }
    async patch(id) {
        return await http.patch(`/${NombreDelModulo}/patch/${id}`);
    }
    async getTotalRecords(idFilter, tipo, estado, iniciativa, tema, legislatura, search = "") {
        return await http.get(
            `/${NombreDelModulo}/totalrecords??idFilter=${idFilter}&tipo_id=${tipo}&estado_id=${estado}&iniciativa_id=${iniciativa}&tema_id=${tema}&legislatura_id=${legislatura}&search=${search}`
        );
    }
    async getCombo() {
        return await http.get(`/${NombreDelModulo}/LlenarCombo`);
    }
}

export default new ProyectoLeyDataService();
