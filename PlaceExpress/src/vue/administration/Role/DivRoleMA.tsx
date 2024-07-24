

import { EndroitContext } from "../Plan/EndroitProvider";
import { IdContext } from "../Plan/IdProvider";
import { NotifContext } from "../Plan/NotificationProvider";

import { useContext,useState,useEffect } from "react";

import { DivTitrePlan } from "../Plan/DivTitrePlan";
import { DivInformation } from "../Plan/DivInformation";

import { Role } from "../../../modele/class/Role";
import { RoleDAO } from "../../../modele/DAO/RoleDAO";
import { DivColorPicker } from "./DivInformationColorPicker";
import { DivSelectBatiment } from "./DivSelectBat";
import { AccesDAO } from "../../../modele/DAO/AccesDAO";

export function DivRoleMA (){
    
    const [role, setRole] = useState(new Role());
    const [batiment, setlesBatiments] = useState<string[]>([]);
    
    const [erreurNom, setErreurNom] = useState(false);
    const [erreurBatiment, setErreurBatiment] = useState(false);

    const updateEndroit =  useContext(EndroitContext);
    const id =  useContext(IdContext);
    const notification =  useContext(NotifContext);
    

    useEffect(() => { // Code à exécuter après chaque rendu 
        const roleDAO = new RoleDAO();
        const accesDAO = new AccesDAO();

        async function remplissageInput() {
            const r= await roleDAO.getByRole(id.id)
            setRole(r);

            const acces= await accesDAO.getByRole(id.id);
            const a : string[] =[]
            acces.forEach(elt => a.push(elt.idBatiment))
            changementBatiment(a)
        }

        if(id.id!=""){
            remplissageInput()   
        }else{
            changementColor("rgb(169,144,99)")
        }
    }, [] );

    function changementLibelle(valeur :string){
        const newRole= new Role(role.idRole,valeur, role.color);
        setRole(newRole);
    }

    function changementColor(valeur :string){
        const newRole= new Role(role.idRole,role.libelle, valeur);
        setRole(newRole);
    }

    function changementBatiment(valeur :string[]){
        setlesBatiments(valeur);
    }


    function verifierNom():boolean{
        const test = role.libelle!="";
        setErreurNom(!test)
        return test
    }

    function verifierBat():boolean{
        const test = batiment.length>0;
        setErreurBatiment(!test)
        return test
    }


    async function enregister(){
        let correct=true;

        correct = verifierNom() && correct ;
        correct = verifierBat() && correct ;

        if(correct){

            const roleDAO = new RoleDAO();
            const accesDAO = new AccesDAO();
            if(id.id===""){
                await roleDAO.ajoutTab(role,batiment) 
                notification("Role",role.libelle+" a été ajouté "); 
            }else{
                await roleDAO.update(role)
                await accesDAO.updateTab(role,batiment);
                notification("Role",role.libelle+" a été mis à jour "); 
            }
            updateEndroit("accueil");
        }
    }
    

    return(
        <div className="administration_contenu">
            <DivTitrePlan titre={id.id===""? "Ajouter un role" : "Modifier un role"}>
                <div className="administration_contenu_titreBouton_boutonDeux">
                    <button onClick={() => updateEndroit("accueil")}>Retour</button>
                    <button onClick={() => enregister()}>Enregister </button>
                </div>
            </DivTitrePlan>

            <div className="administration_contenu_lesInfos">
                <DivInformation valeur={role.libelle} titre="Nom" fonction={(valeur: string) => changementLibelle(valeur)} erreur={erreurNom} erreurNom="Veuillez saisir un nom"  />

                <DivColorPicker valeur={role.color} titre="Couleur associé" fonction={(valeur: string) => changementColor(valeur)} erreur={false} erreurNom="Veuillez saisir un nom"  />

                <DivSelectBatiment valeur={batiment} titre="Batiments associés" fonction={(valeur: string[]) => changementBatiment(valeur)} erreur={erreurBatiment} erreurNom="Veuillez saisir au moins un batiment"  />

            </div>
            

            

        </div>
    )
}



