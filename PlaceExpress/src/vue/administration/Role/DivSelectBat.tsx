import { Alert, Select } from 'antd';
import {  useEffect, useState } from 'react';
import { BatimentDAO } from '../../../modele/DAO/BatimentDAO';


export function DivSelectBatiment(value : {valeur : string[], titre :string, fonction : (valeur: string[] ) => void , erreur:boolean, erreurNom : string }){
    
    const [lesBatiments, setLesBatiments] = useState<{label : string, value : string}[]>([]);


    useEffect(() => { // Code à exécuter après chaque rendu 
        const batimentDAO = new BatimentDAO();

        async function remplissageSelect() {
            const b= await batimentDAO.getAll();
            const bat : {label : string, value : string}[] =[];
            b.forEach(elt => bat.push( {label : elt.libelle, value : elt.idBatiment }))
            setLesBatiments(bat);
            
        }
        remplissageSelect()   
        
    }, [] );

    return (
    <div className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_uneInfo">
                        <div>{value.titre}</div>
                        
                        <Select
                            className="administration_contenu_lesInfos_uneInfo_space"
                            mode="multiple"
                            allowClear
                            placeholder="Choisir un ou plusieurs batiments"
                            value={value.valeur}
                            onChange={(e) => value.fonction(e)}
                            options={lesBatiments}
                        />
                    
                    </div>
                    {value.erreur? 
                    <div  className="administration_contenu_lesInfos_uneErreur">
                        <Alert message={value.erreurNom} type="error" className="administration_contenu_lesInfos_uneErreur_alert" />
                    </div> : <> </>
                    }
    </div> )
}


