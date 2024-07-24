import { Input, Alert } from 'antd';


export function DivInformation(value : {valeur : string, titre :string, fonction : (valeur: string ) => void , erreur:boolean, erreurNom : string }){
    

    return (
    <div className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_uneInfo">
                        <div>{value.titre}</div>
                        <Input status={value.erreur ? "error" : undefined } size="large" placeholder="Votre réponse" value={value.valeur} onChange={e => value.fonction(e.target.value)}/>
                    </div>
                    {value.erreur? 
                    <div  className="administration_contenu_lesInfos_uneErreur">
                        <Alert message={value.erreurNom} type="error" className="administration_contenu_lesInfos_uneErreur_alert" />
                    </div> : <> </>
                    }
    </div> )
}