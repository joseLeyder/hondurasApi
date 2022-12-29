import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class CtrlPoliticoDataService {
    async create(data) {
        return await http.post("/ctrlPolitico", data);
    }
    async update(id, data) {
        return await http2.post(`/ctrlPolitico/${id}`, data);
    }
    async getAll(
        idFilter,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/ctrlPolitico?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async get(id) {
        return await http.get(`/ctrlPolitico/${id}`);
    }
   
    async delete(id) {
        return await http.delete(`/ctrlPolitico/${id}`);
    }
   
    async getTotalRecordsControlPolitico(idFilter,search) {
        return await http.get(
            `/ctrlPolitico/totalrecords?idFilter=${idFilter}&search=${search}`
        );
    }

    async getAllPersonas(idFilter,search = "",page = 1,rows = 4) {
        return await http.get(
            `/personas?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async totalrecordsPersonas(idFilter, search = "") {
        return await http.get(
            `/personas/totalrecords?idFilter=${idFilter}&search=${search}`
        );
    }
}

export default new CtrlPoliticoDataService();
