import { Select,Alert } from 'antd';
import { BatimentDAO } from "../../../modele/DAO/BatimentDAO";

import { useState,useEffect } from "react";

export function DivInformationSelect( value : { vDefault:string,titre :string, fonction : (valeur: string ) => void , erreur:boolean, erreurNom : string } ){
    
    const [lesBatiments, setLesBatiments] = useState([{value: "", label : ""}]);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const batimentDAO= new BatimentDAO();

        async function remplirSelect() {
            
            const batiments = await batimentDAO.getAll();
            const data : Array<{value: string , label : string }> = []

            batiments.forEach(elt => {
                    data.push({value:elt.idBatiment , label : elt.libelle})
            })

            setLesBatiments(data);
        }
       remplirSelect();
    }, []);



  const filterOption = ( input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  
    return(
        <div className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_uneInfo">
                        <div>{value.titre}</div>
            <Select
                className="administration_contenu_lesInfos_uneInfo_select"
                showSearch
                size='large'
                value={value.vDefault!="" ? value.vDefault : undefined}
                placeholder="Choisir un batiment"
                optionFilterProp="children"
                allowClear
                onChange={e => value.fonction(e)}
                filterOption={filterOption}
                options={ lesBatiments }
                status={value.erreur ? "error" : undefined }
            />
             

                    </div>
                    {value.erreur? 
                    <div  className="administration_contenu_lesInfos_uneErreur">
                        <Alert message={value.erreurNom} type="error" className="administration_contenu_lesInfos_uneErreur_alert" />
                    </div> : <> </>
                    }
    </div> 
);

}