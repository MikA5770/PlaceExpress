import { Popconfirm, message } from "antd";
import { Etage } from "../../../modele/class/Etage";

export function DivUnEtage(elt : {etage : Etage ,supprimerEtage : (etage : Etage ) => void, modifAjout : (s : string, b :string) => void }){

    
    
    return(
        <div className="administration_contenu_lesBatiments_unBatiment_etage" key={elt.etage.idEtage}>
                            <div className="administration_contenu_lesBatiments_unBatiment_etage_titre">{elt.etage.numeroEtage} - {elt.etage.libelleEtage}</div>
                            <div className="administration_contenu_lesBatiments_unBatiment_etage_bouton">
                                <input type="button" onClick={() => elt.modifAjout("etage",elt.etage.idEtage)}/>
                                <Popconfirm
                                    title="Suppression"
                                    description="Etes vous sûr de supprimer cette étage ?"
                                    onConfirm={() => elt.supprimerEtage(elt.etage)}
                                    onCancel={ () => message.error('Suppression annulé')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <input type="button"/> 
                                </Popconfirm>
                            </div>
                    </div>
    )
}