import { Batiment } from "../../../modele/class/Batiment";

import { EndroitContext } from "./EndroitProvider";
import { IdContext } from "./IdProvider";
import { NotifContext } from "./NotificationProvider";

import { useContext,useState,useEffect,useRef } from "react";


import { DivTitrePlan } from "./DivTitrePlan";
import { DivInformation } from "./DivInformation";
import { Etage } from "../../../modele/class/Etage";
import { EtageDAO } from "../../../modele/DAO/EtageDAO";
import { DivInformationSelect } from "./DivInformationSelect";
import { DivInformationNombre } from "./DivInformationNombre";
import { DivInformationUpload } from "./DivInformationUpload";


import { UploadFile } from 'antd/lib/upload/interface';
import { FichierDAO } from "../../../modele/DAO/FichierDAO";
import { Place } from "../../../modele/class/Place";
import { Input, Popover } from "antd";
import { PlaceDAO } from "../../../modele/DAO/PlaceDAO";

export function DivEtage(){
    const [etage, setEtage] = useState(new Etage());
    
    const [erreurNom, setErreurNom] = useState(false);
    const [erreurBatiment, setErreurBatiment] = useState(false);
    const [erreurNumeroEtage, setErreurNumeroEtage] = useState(false);

    const [file, setFile] = useState<UploadFile<File> | null>(null);
    const [url, setUrl] = useState("");
    const [modifUrl, setModifUrl] = useState(true);

    const [lesPlaces, setLesPlaces] = useState<Array<{place :Place, changementNom : boolean }>>([]);
    const [idDeplacement, setIdDeplacement] = useState("");
    const [idAgrandissement, setIdAgrandissement] = useState("");
    const [position, setPosition] = useState({x:0,y:0});
    const [supprimer, setSupprimer] = useState(0);

    const [dernierClick, setDernierClick] = useState(0);
    const [clickEnfonce, setClickEnfonce] = useState(false);

    const elementRef = useRef<HTMLDivElement | null>(null);
    const supprimerRef = useRef<HTMLButtonElement | null>(null);

    
    const updateEndroit =  useContext(EndroitContext);
    const id =  useContext(IdContext);
    const notification =  useContext(NotifContext);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const etageDAO = new EtageDAO();
        const fichierDAO = new FichierDAO();

        async function remplissageInput() {
            const eta= await etageDAO.getByEtage(id.id)
            setEtage(eta);

            if(eta.idImagePlan!=""){
                const urlModif = await fichierDAO.image(eta.idImagePlan,"imagePlan");
                setUrl(urlModif);
            }

            const placeDAO= new PlaceDAO();

            const place= await placeDAO.getByEtage(eta.idEtage);
            const ajt :Array<{place :Place, changementNom : boolean }> =[]

            place.forEach(elt=> ajt.push({ place: elt , changementNom: false }))

            setLesPlaces(ajt)
        }

        if(id.id!=""){
            remplissageInput()
        }

        miseAJourCoordonnee();
        
        
    }, []);


    function changementLibelle(valeur :string){
        const newEtage= new Etage(etage.idEtage,etage.numeroEtage,etage.idImagePlan
            , etage.descriptionEtage,valeur,etage.batiment);
        setEtage(newEtage);
    }
    function changementDescription(valeur :string){
        const newEtage= new Etage(etage.idEtage,etage.numeroEtage,etage.idImagePlan
            , valeur ,etage.libelleEtage,etage.batiment);
        setEtage(newEtage);
    }
    function changementBatiment(valeur :string){
        const newEtage= new Etage(etage.idEtage,etage.numeroEtage,etage.idImagePlan
            , etage.descriptionEtage ,etage.libelleEtage,new Batiment(valeur));
        setEtage(newEtage);
    }
    function changementNumeroEtage(valeur :number){
        const newEtage= new Etage(etage.idEtage,valeur,etage.idImagePlan
            , etage.descriptionEtage ,etage.libelleEtage,etage.batiment);
        setEtage(newEtage);
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
        miseAJourCoordonnee();
      }

    function changementNom(id :string, valeur : string){
        setLesPlaces(prevLesPlaces => {
            const tableauModifier = [...prevLesPlaces]; // Crée une copie du tableau pour éviter la mutation directe de l'état
    
            tableauModifier.forEach(element => {
                if (element.place.idPlace === id) {
                    element.place.libellePlace = valeur;
                }
            });
    
            return tableauModifier;
        });
    }

    const modifierNom = (id : string ) => {
        setLesPlaces(prevLesPlaces => {
            const tableauModifier = [...prevLesPlaces]; // Crée une copie du tableau pour éviter la mutation directe de l'état
    
            tableauModifier.forEach(element => {
                if (element.place.idPlace === id) {
                    element.changementNom = !element.changementNom;
                }
            });
    
            return tableauModifier;
        });
    };
    const modifierId = (id: string ) => {
        if(idDeplacement===id){
            setIdDeplacement("")
            //filter le tableau
            setLesPlaces(prevLesPlaces => {
                let tableauModifier = [...prevLesPlaces]; // Crée une copie du tableau pour éviter la mutation directe de l'état
                tableauModifier = tableauModifier.filter(elt => elt.place.y + position.y > supprimer);
                return tableauModifier;
            });
            
        }else{ 
            setIdDeplacement(id)
        }



    }

    const modifierTaille = (id :string) => {
        const currentTime = new Date().getTime();
        const clickDuration = currentTime - dernierClick;

        if (clickDuration < 300) {
            modifierNom(id);
            setIdDeplacement("");
        }else{
            modifierId(id)
        }
        setDernierClick(currentTime);
        setClickEnfonce(true);
        setIdAgrandissement(id);
    }
    
    function changementPosition(x : number, y : number){

        const currentTime = new Date().getTime();
        const clickDuration = currentTime - dernierClick;

        if(clickEnfonce && clickDuration > 300){
            setIdDeplacement("");
        }

        setLesPlaces(prevLesPlaces => {
            const tableauModifier = [...prevLesPlaces]; // Crée une copie du tableau pour éviter la mutation directe de l'état
    
                tableauModifier.forEach(element => {
                    if (element.place.idPlace === idDeplacement && !clickEnfonce) {
                        element.place.x=x-position.x-element.place.largeur/2;
                        element.place.y=y-position.y-element.place.hauteur/2
                    }
                    if (element.place.idPlace === idAgrandissement && clickEnfonce && clickDuration > 300) {
                        if( y-element.place.y-position.y >= 25){  element.place.hauteur= y-element.place.y-position.y }
                        if( x-element.place.x-position.x >= 25){   element.place.largeur=x-element.place.x-position.x }
                    }
                });

            return tableauModifier;
        });

    }
    const miseAJourCoordonnee = () => {
        if (elementRef.current) {
            const boundingBox = elementRef.current.getBoundingClientRect();
            setPosition({
                x: boundingBox.left + window.scrollX,
                y: boundingBox.top + window.scrollY
              });
        }
        if (supprimerRef.current) {
            const boundingBox = supprimerRef.current.getBoundingClientRect();
            setSupprimer( boundingBox.top+ window.scrollY+boundingBox.height.valueOf());
        }
    }
    function ajouterPlace(){
  
        const p= new Place(Math.random().toString(36).substring(2),50,50,0,0,"Place "+lesPlaces.length,new Etage(etage.idEtage));
        let test = [];
        do{
            test=lesPlaces.filter( elt => elt.place.idPlace===p.idPlace)
        }while ( test.length>0)
        
        setLesPlaces([... lesPlaces , { place : p ,changementNom : false } ] );
    }


    function verifierNom():boolean{
        const test = etage.libelleEtage!="";
        setErreurNom(!test)
        return test
    }
    function verifierBatiment():boolean{
        const test = etage.batiment.idBatiment!="";
        setErreurBatiment(!test)
        return test
    }
    function verifierEtage():boolean{
        const test = etage.numeroEtage!=null;
        setErreurNumeroEtage(!test)
        return test
    }



    function enregister(){
        let correct=true;

        correct = verifierNom() && correct ;
        correct = verifierBatiment() && correct ;
        correct = verifierEtage() && correct ;
        //vérifier numéro étage

        if(correct){
            const etageDAO = new EtageDAO();
            const placeDAO= new PlaceDAO();

            if(id.id===""){
                if(file === null){
                    etageDAO.ajoutAvecPlace(etage,lesPlaces);
                }else{
                    etageDAO.ajoutAvecFichier(etage,file,lesPlaces);
                }
                notification("Etage",etage.libelleEtage+" a été ajouté avec "+lesPlaces.length +" nouvelles places"); 

            }else{
                if(file === null){ // si null aucun fichier est rentré
                    if(modifUrl){ // si le fichier a été modifier
                        etageDAO.update(etage)
                    }else{
                        //aucun fichier est entrée on modifie et supprime l'existant si il y en a un
                        //le  IdImg doit etre rajouter dans la classe DAO avant il est la pour savoir s'il y avair une image avant ou non
                        etageDAO.updateSansFichier(etage)
                    }
                }else{
                    //si modifier on ajoute sur le fichier existante 
                    etageDAO.updateAvecFichier(etage,file)
                }
                placeDAO.updateToutes(lesPlaces, etage.idEtage);

                notification("Etage",etage.libelleEtage+" a été mis à jour avec "+lesPlaces.length +" places"); 
            }

            updateEndroit("plan");


        }
    }

    
        
    return(
        <div className="administration_contenu"  >
            <DivTitrePlan titre={id.id===""? "Ajouter un étage" : "Modifier un étage"}>
                <div className="administration_contenu_titreBouton_boutonDeux">
                    <button onClick={() => updateEndroit("plan")}>Retour</button>
                    <button onClick={() => enregister()}>Enregister </button>
                </div>
            </DivTitrePlan>

            <div className="administration_contenu_lesInfos">
                <DivInformation valeur={etage.libelleEtage} titre="Nom" fonction={(valeur: string) => changementLibelle(valeur)} erreur={erreurNom} erreurNom="Veuillez saisir un nom"  />

                <DivInformation valeur={etage.descriptionEtage} titre="Description" fonction={(valeur: string) => changementDescription(valeur)} erreur={false} erreurNom=""  />
                
                <DivInformationSelect vDefault={etage.batiment.idBatiment} titre="Batiment associé" fonction={(valeur: string) => changementBatiment(valeur)} erreur={erreurBatiment} erreurNom="Veuillez saisir un batiment"  />

                <DivInformationNombre valeur={etage.numeroEtage} titre="Numéro de l'étage" fonction={(valeur: number) => changementNumeroEtage(valeur)} erreur={erreurNumeroEtage} erreurNom="Veuillez saisir un numéro d'étage"  />
                
                <DivInformationUpload titre="Plan de l'étage" fonction={(valeur: UploadFile<File>[]) => changementFichier(valeur)}   />
                

            </div>
            
            <div className="administration_contenu_titreBouton">
                <div className="administration_contenu_titreBouton_titre"> Plan de l'étage </div>
                <div className="administration_contenu_titreBouton_boutonDeuxPlan">
                    <button onClick={() => ajouterPlace() } >Ajouter une place</button>
                    <button ref={supprimerRef} >Poubelle </button>
                </div>
            </div>
            <div className="administration_contenu_autour" >
            <div ref={elementRef} 
                style={{backgroundImage : `url(${url})`}}
                
                className="administration_contenu_plan" 
                onPointerMove={e =>  changementPosition(e.pageX,e.pageY)}
            >
                {lesPlaces.map((elt) => (
                    
                <Popover key={elt.place.idPlace}
                    content={<Input size="small" value={elt.place.libellePlace} onChange={e => changementNom(elt.place.idPlace, e.target.value )}/>  }
                    title="Nom "
                    trigger="click"
                    open={elt.changementNom}
                >
                    <div className="administration_contenu_plan_place"
                        onMouseDown={() =>modifierTaille(elt.place.idPlace)}
                        onMouseUp={() =>setClickEnfonce(false)}
                        style= {{
                            height : elt.place.hauteur+"px",
                            width : elt.place.largeur+"px",
                            top : elt.place.y+position.y,
                            left : elt.place.x+position.x,
                        }}>
                        {elt.place.libellePlace}
                        
                    </div>
                </Popover>
                   
                    
                ))}
                
            </div></div>


        </div>
    )
}

