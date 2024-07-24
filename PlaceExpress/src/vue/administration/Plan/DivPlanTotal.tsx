import { BatimentDAO } from "../../../modele/DAO/BatimentDAO";
import { useState,useEffect,useContext } from "react";
import { EndroitContext } from "./EndroitProvider";
import { IdContext } from "./IdProvider";
import { EtageDAO } from "../../../modele/DAO/EtageDAO";
import { DivTitrePlan } from "./DivTitrePlan";
import { Batiment } from "../../../modele/class/Batiment";
import { Etage } from "../../../modele/class/Etage";
import { Popconfirm, message } from "antd";
import { DivUnEtage } from "./DivUnEtage";

export function DivPlanTotal(){

    const updateEndroit =  useContext(EndroitContext);
    const updateId =  useContext(IdContext);


    const [lesBatiments, setBatiments] = useState([<> </>]);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const batimentDAO = new BatimentDAO();

        async function afficherEtage(id: string) {
            const etageDAO = new EtageDAO();
            const lesEtages = await etageDAO.getByBatiment(id);
            return lesEtages.map( (elt) => (
                    <DivUnEtage  etage={elt} supprimerEtage={supprimerEtage} modifAjout={modifAjout} key={elt.idEtage}/>
            ))
        }


        async function affichageDesBatiments() {
            try {
                const batiments = await batimentDAO.getAll();
                const elements = [];

                for (const bat of batiments ) {
                    const batimentElement = (
                      <div className="administration_contenu_lesBatiments_unBatiment" key={bat.idBatiment}>
                        <div className="administration_contenu_lesBatiments_unBatiment_titre">
                          {bat.libelle}
                        </div>
                        <div className="administration_contenu_lesBatiments_unBatiment_toit"></div>
                        {await afficherEtage(bat.idBatiment)}
                        <div className="administration_contenu_lesBatiments_unBatiment_sol">
                          <div className="administration_contenu_lesBatiments_unBatiment_sol_adresse"> {bat.adresse}</div>
                          <div className="administration_contenu_lesBatiments_unBatiment_sol_bouton">
                            <input type="button" onClick={() => modifAjout("batiment",bat.idBatiment)}/>
                            <Popconfirm
                                    title="Suppression"
                                    description="Etes vous sûr de supprimer ce batiment ?"
                                    onConfirm={() => supprimerBatiment(bat)}
                                    onCancel={ () => message.error('Suppression annulé')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                <input type="button" />
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    );
          
                    elements.push(batimentElement);
                  }
                  
                setBatiments(elements);

            } catch (error) {
                console.error(error);
            }
        }
        
        affichageDesBatiments();
    }, [refreshData]);

    function modifAjout(endroit : string, id: string):void{
        updateEndroit(endroit);
        updateId.fonction(id);
    }

    async function supprimerEtage(etage : Etage){
        const etageDAO= new EtageDAO()
        await etageDAO.supprimer(etage);
        setRefreshData(!refreshData);
        message.success('Suppression validé')
    }

    async function supprimerBatiment(batiment : Batiment){
        const batimentDAO= new BatimentDAO()
        try{
        await batimentDAO.supprimer(batiment);
        }catch(e){
            alert(e);
        }
        setRefreshData(!refreshData);
        message.success('Suppression validé')
    }

    return (

        <div className="administration_contenu">
            <DivTitrePlan titre="Plan">
                <div className="administration_contenu_titreBouton_bouton">
                    <button onClick={() => modifAjout("batiment","")}>Ajouter un batiment</button>
                    <button onClick={() => modifAjout("etage","")}>Ajouter un étage </button>
                </div>
            </DivTitrePlan>
            
            <div className="administration_contenu_lesBatiments">
                {lesBatiments}
            </div>
        </div>


    )
}