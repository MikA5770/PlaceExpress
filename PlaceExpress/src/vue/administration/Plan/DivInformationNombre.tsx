

import { InputNumber, Alert } from 'antd';


export function DivInformationNombre(value : {valeur : number, titre :string, fonction : (valeur: number ) => void , erreur:boolean, erreurNom : string }){
    

    return (
    <div className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_uneInfo">
                        <div>{value.titre}</div>
                        <InputNumber className="administration_contenu_lesInfos_uneInfo_number" status={value.erreur ? "error" : undefined } size="large" value={value.valeur} onChange={e => value.fonction(Number(e))}/>
                    </div>
                    {value.erreur? 
                    <div  className="administration_contenu_lesInfos_uneErreur">
                        <Alert message={value.erreurNom} type="error" className="administration_contenu_lesInfos_uneErreur_alert" />
                    </div> : <> </>
                    }
    </div> )
}