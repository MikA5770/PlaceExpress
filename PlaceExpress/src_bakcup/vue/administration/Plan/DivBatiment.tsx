import { Batiment } from "../../../modele/class/Batiment";
import { BatimentDAO } from "../../../modele/DAO/BatimentDAO";

import { EndroitContext } from "./EndroitProvider";
import { IdContext } from "./IdProvider";
import { NotifContext } from "./NotificationProvider";

import { useContext,useState,useEffect } from "react";

import { DivTitrePlan } from "./DivTitrePlan";
import { DivInformationDate } from "./DivInformationDate";
import { DivInformation } from "./DivInformation";
import { FichierDAO } from "../../../modele/DAO/FichierDAO";
import { DivInformationUpload } from "./DivInformationUpload";

import { UploadFile } from 'antd/lib/upload/interface';


export function DivBatiment(){
    const [batiment, setBatiment] = useState(new Batiment());
    const [dateDefault, setDateDefault] = useState(true);
    
    const [erreurNom, setErreurNom] = useState(false);
    const [erreurDate, setErreurDate] = useState(false);
    const [erreurAdresse, setErreurAdresse] = useState(false);

    const [file, setFile] = useState<UploadFile<File> | null>(null);
    const [url, setUrl] = useState("");
    const [modifUrl, setModifUrl] = useState(true);

    const updateEndroit =  useContext(EndroitContext);
    const id =  useContext(IdContext);
    const notification =  useContext(NotifContext);
    

    useEffect(() => { // Code à exécuter après chaque rendu 
        const batimentDAO = new BatimentDAO();
        const fichierDAO = new FichierDAO();

        async function remplissageInput() {
            const bat= await batimentDAO.getByBatiment(id.id)
            setBatiment(bat);

            if(bat.idImage!=""){
                const urlModif = await fichierDAO.image(bat.idImage,"imageBatiment");
                setUrl(urlModif);
            }
        }

        if(id.id!=""){
            remplissageInput()
            if(batiment.dateCreation!=""){
                setDateDefault(false);
            }

            
        }
    }, [] );
    function changementLibelle(valeur :string){
        const newBatiment= new Batiment(batiment.idBatiment,batiment.adresse,
            batiment.dateCreation,batiment.description,valeur,batiment.idImage);
        setBatiment(newBatiment);
    }
    function changementDescription(valeur :string){
        const newBatiment= new Batiment(batiment.idBatiment,batiment.adresse,
            batiment.dateCreation,valeur,batiment.libelle,batiment.idImage);
        setBatiment(newBatiment);
    }
    function changementAdresse(valeur :string){
        const newBatiment= new Batiment(batiment.idBatiment,valeur,
            batiment.dateCreation,batiment.description,batiment.libelle,batiment.idImage);
        setBatiment(newBatiment);
    }
    function changementFichier(fileList: UploadFile<File>[]) {
        if (fileList.length > 0) {
          const file = fileList[0] ;

          // setFichier 
            setModifUrl(false);
            setFile(file);

                const reader = new FileReader();
            
                reader.onloadend = () => {
                  setUrl(reader.result as string);
                };
                reader.readAsDataURL(file.originFileObj!);

        } else {
                setUrl("");
                setFile(null);
        }
      }

    function changementDate(valeur :string){
        const newBatiment= new Batiment(batiment.idBatiment,batiment.adresse,
           valeur,batiment.description,batiment.libelle,batiment.idImage);
        setBatiment(newBatiment);
    }

    function verifierAdresse():boolean{
        const test=batiment.adresse!=""
        setErreurAdresse(!test)
        return test
    }

    function verifierNom():boolean{
        const test = batiment.libelle!="";
        setErreurNom(!test)
        return test
    }

    function verifierDate():boolean{
        if(batiment.dateCreation===""){
            return true;
        }
        const dateDuJour = new Date()
        const datePartie = batiment.dateCreation.split('-');

        const annee = parseInt(datePartie[2], 10);
        const mois = parseInt(datePartie[1], 10) - 1;
        const jour = parseInt(datePartie[0], 10);

        const dateObject = new Date(annee, mois, jour);

        const test = dateDuJour.getTime() >= dateObject.getTime()
        setErreurDate(!test)
        return test

    }

    function enregister(){
        let correct=true;

        correct = verifierDate() && correct ;
        correct = verifierNom() && correct ;
        correct = verifierAdresse() && correct ;

        if(correct){

            const batimentDAO = new BatimentDAO();
            if(id.id===""){
                if(file === null){
                    batimentDAO.ajout(batiment)
                }else{
                    batimentDAO.ajoutAvecFichier(batiment,file)
                }
                notification("Batiment",batiment.libelle+" a été ajouté "); 
            }else{
                if(file === null){ // si null aucun fichier est rentré
                    if(modifUrl){ // si le fichier a été modifier
                        batimentDAO.update(batiment)
                    }else{
                        //aucun fichier est entrée on modifie et supprime l'existant si il y en a un
                        //le  IdImg doit etre rajouter dans la classe DAO avant il est la pour savoir s'il y avair une image avant ou non
                        batimentDAO.updateSansFichier(batiment)
                    }
                }else{
                    //si modifier on ajoute sur le fichier existante 
                    batimentDAO.updateAvecFichier(batiment,file)
                }
                notification("Batiment",batiment.libelle+" a été mis à jour "); 
            }
            updateEndroit("plan");
        }
    }
    

    return(
        <div className="administration_contenu">
            <DivTitrePlan titre={id.id===""? "Ajouter un batiment" : "Modifier un batiment"}>
                <div className="administration_contenu_titreBouton_boutonDeux">
                    <button onClick={() => updateEndroit("plan")}>Retour</button>
                    <button onClick={() => enregister()}>Enregister </button>
                </div>
            </DivTitrePlan>

            <div className="administration_contenu_lesInfos">
                <DivInformation valeur={batiment.libelle} titre="Nom" fonction={(valeur: string) => changementLibelle(valeur)} erreur={erreurNom} erreurNom="Veuillez saisir un nom"  />

                <DivInformation valeur={batiment.description} titre="Description" fonction={(valeur: string) => changementDescription(valeur)} erreur={false} erreurNom=""  />
                
                <DivInformationDate valeur={batiment.dateCreation} titre="Date de création" fonction={(valeur: string) => changementDate(valeur)} erreur={erreurDate} erreurNom="Veuillez saisir une date passé ou aucune date" default={dateDefault} />
                
                <DivInformation valeur={batiment.adresse} titre="Adresse" fonction={(valeur: string) => changementAdresse(valeur)} erreur={erreurAdresse} erreurNom="Veuillez saisir une adresse"  />
            
                <DivInformationUpload titre="Image du batiment" fonction={(valeur: UploadFile<File>[]) => changementFichier(valeur)}   />
                
            </div>
            
            <div className="administration_contenu_titre">
                <div> Image </div>
            </div>

            <div className="administration_contenu_img">
                <img src={url} alt=""/>
            </div>  

            

        </div>
    )
}