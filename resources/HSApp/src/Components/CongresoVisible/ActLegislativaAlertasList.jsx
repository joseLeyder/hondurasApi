import React from 'react';
import AuthLogin from "../../Utils/AuthLogin";
const auth = new AuthLogin();
const ActLegislativaAlertasList = ({ data=[], handler, pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="EventosContainer">
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={async (e) => {
                            let pageSizeT = Number(e.target.value);
                            pageExtends = 1;
                            await handler(pageExtends, pageSizeT);
                        }}
                    >
                        {[8, 24, 64, 112, 500].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
                <div className="Eventos eventosContainer">
                    {                                
                        data !== null && data !== "undefined"? 
                        data.map((x, i) => {
                            return (
                                <div key={i}>
                                    <div className="evento">
                                    <div div className="">
                                        <label className="col-md-3 control-label">Información: </label>
                                    </div>   
                                    <div dangerouslySetInnerHTML={{ __html: x.informacion }} className = "title"></div>
                                    <br/>
                                        {
                                        x.url_archivo && (
                                                        <div className={`form-group`}>
                                                            <div div className="">
                                                                <label className="col-md-3 control-label">Documento</label>
                                                            </div>  
                                                            
                                                            <div className="col-md-9 ">
                                                                <a href={(auth.pathApi() + x.url_archivo) } target="_blank" className="control-label">Ver documento</a>
                                                            </div>                                                    
                                                        </div>
                                                    )
                                        }
                                    </div>
                                </div>);  
                        }):'Sin alertas de proyectos de ley'
                    }
                </div>
                <div className="pagination">
                    <div>
                        <span>
                            Página{" "}
                            <strong>
                                {pageExtends} de {Math.ceil(totalRows / pageSize)}
                            </strong>{" (Mostrando "}{data.length}{" registros)"}
                        </span>
                    </div>
                    <div>
                        <button onClick={async (e) => await handler(1, pageSize)} disabled={!(pageExtends > 1)}>
                            <i className="icon la la-angle-left"></i>
                            <i className="icon la la-angle-left"></i>
                        </button>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends > 1) {
                                pageExtends--;
                                await handler(pageExtends, pageSize);
                            }

                        }} disabled={!(pageExtends > 1)}>
                            <i className="icon la la-angle-left"></i>
                        </button>{" "}
                        <span>
                            <input
                                type="number"
                                value={pageExtends || ''}
                                className="form-control"
                                onFocus={handleFocus}
                                onClick={handleFocus}
                                onChange={async (e) => {
                                    if (e.target.value > 0) {
                                        pageExtends = Number(e.target.value);
                                        await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize);
                                    }
                                    else  if (e.target.value === 0){
                                        e.target.value = 1;
                                        pageExtends = 1;
                                        await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize);
                                    }
                                }}
                                style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                            />
                            {" / " + Math.ceil(totalRows / pageSize)}
                        </span>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends < Math.ceil(totalRows / pageSize)) {
                                pageExtends++;
                                await handler(pageExtends, pageSize);
                            }
                        }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="icon la la-angle-right"></i>
                        </button>{" "}
                        <button onClick={async (e) => await handler(Math.ceil(totalRows / pageSize), pageSize)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="icon la la-angle-right"></i>
                            <i className="icon la la-angle-right"></i>
                        </button>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActLegislativaAlertasList;