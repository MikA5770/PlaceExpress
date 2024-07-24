import { useEffect, useState } from "react";
import { DivTableauBordGauche } from "./TableauBord/DivTableauBordGauche";
import { DivTableauBordDroit } from "./TableauBord/DivTableauBordDroite";
import { Select } from "antd";
import { BatimentDAO } from "../../modele/DAO/BatimentDAO";
import { EtageDAO } from "../../modele/DAO/EtageDAO";
import { StatistiqueProvider } from "./TableauBord/StatistiqueContext";
import { PersonneDAO } from "../../modele/DAO/PersonneDAO";
import { Personne } from "../../modele/class/Personne";

export function DivStatistique(){

    const [visibilityBat, setVisibilityBat] = useState(true);
    const [visibilityCompte, setVisibilityCompte] = useState(true);

    const [lesBatiments, setLesBatiments] = useState([{value: "", label : ""}]);
    const [valeurSelectBat, setValeurSelectBat] = useState("");

    const [lesEtages, setLesEtages] = useState([{value: "", label : ""}]);
    const [valeurSelectEtage, setValeurSelectEtage] = useState("");

    const [lesComptes, setLesComptes] = useState([{value: "", label : ""}]);
    const [valeurSelectCompte, setValeurSelectCompte] = useState("");

    const [laPersonne, setLaPersonne] = useState(new Personne());

    const [refreshBatiment, setRefreshBatiment] = useState(true);

    const [valeurProvider, setValeurProvider] = useState({type:"batiment",id:""});

    const valeurDefault="general";

    useEffect(() => { // Code à exécuter après chaque rendu 
        const batimentDAO= new BatimentDAO();
       

        async function remplirSelect() {
            
            const batiments = await batimentDAO.getAll();
            const data : Array<{value: string , label : string }> = []

            batiments.forEach(elt => {
                    data.push({value:elt.idBatiment , label : elt.libelle})
            })

            setLesBatiments(data);
            changementBatiment(data[0].value)
        }
        remplirSelect();

    }, []);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const etageDAO= new EtageDAO();

        async function remplirEtage() {
            
            const etage = await etageDAO.getByBatiment(valeurSelectBat);
            const data : Array<{value: string , label : string }> = [{value:valeurDefault , label : "Tout le batiment"}]

            etage.forEach(elt => {
                    data.push({value:elt.idEtage , label : elt.libelleEtage})
            })

            setLesEtages(data);
            changementEtage(data[0].value);
        }
        remplirEtage();

    }, [refreshBatiment]);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const personneDAO= new PersonneDAO();

        async function remplirPersonne() {
            
            const personne = await personneDAO.getAll();
            const data : Array<{value: string , label : string }> = []

            personne.forEach(elt => {
                    data.push({value:elt.idCompte , label : elt.mail})
            })

            setLesComptes(data);
            changementCompte(data[0].value);
        }
        remplirPersonne();

    }, []);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const personneDAO= new PersonneDAO();

        async function remplirPersonne() {
            
            setLaPersonne(await personneDAO.getByPersonne(valeurSelectCompte));

        }
        remplirPersonne();

    }, [valeurSelectCompte]);

    const changementBatiment = (idBatiment:string) =>{
        setValeurSelectBat(idBatiment)
        setRefreshBatiment(!refreshBatiment);
    }

    const changementEtage = (idEtage:string) =>{
        setValeurSelectEtage(idEtage);
        changementProvider(idEtage);
    }

    const changementCompte = (idCompte:string) =>{
        setValeurSelectCompte(idCompte);
    }

    const changementProvider = (idEtage:string) =>{
        if(idEtage===valeurDefault){
            setValeurProvider({type : "batiment" , id : valeurSelectBat})
        }else{
            setValeurProvider({type : "etage" , id : idEtage})
        }
    }

    function rechercheValeurTableau(){
        return lesBatiments.find(elt => elt.value===valeurSelectBat)!.label
    }
    function rechercheValeurEtage(){
        return lesEtages.find(elt => elt.value===valeurSelectEtage)!.label
    }

    function titreBatiment(){
        const bat= rechercheValeurTableau();
        const etage=rechercheValeurEtage()
        if(etage===lesEtages[0].label){
            return <> <div className="administration_contenu_titreBouton_titreImg_bat" > </div> <div>{bat} </div></>
        }else{
            return <> <div className="administration_contenu_titreBouton_titreImg_plan" > </div>{etage+" - "+bat} </>
        }
    }

    function titreCompte(){
        return <> <div className="administration_contenu_titreBouton_titreImg_compte"
            style={{backgroundImage : laPersonne.idPhotoProfil!="" ? "url("+laPersonne.idPhotoProfil+")" : "" }}
        > </div> 
        <div
            style={{fontSize:"1.9rem", fontWeight : "bold"}}
        >{laPersonne.nom+" "+laPersonne.prenom} </div></>
        
    }

    const filterOption = ( input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  
    return(
        <div className="administration_contenu">
        <div className="administration_contenu_titreBouton" >
            <div className="administration_contenu_titreBouton_titreImg"> {titreBatiment()} </div>
            <div className="administration_contenu_titreBouton_boutonQuatre">
            <div className="administration_contenu_titreBouton_boutonQuatre_lesSelect">
                <Select
                    className="administration_contenu_titreBouton_boutonQuatre_select"
                    showSearch
                    size='large'
                    value={valeurSelectBat}
                    optionFilterProp="children"
                    onChange={e => changementBatiment(e)}
                    filterOption={filterOption}
                    options={ lesBatiments }
                />
                <Select
                    className="administration_contenu_titreBouton_boutonQuatre_select"
                    showSearch
                    size='large'
                    value={valeurSelectEtage}
                    optionFilterProp="children"
                    onChange={e => changementEtage(e)}
                    filterOption={filterOption}
                    options={ lesEtages }
                />
            </div>
                    <button  
                    className="administration_contenu_titreBouton_boutonQuatre_btn"
                    onClick={() =>setVisibilityBat(!visibilityBat)}> </button>
            </div>
        </div>

        <div className="administration_contenu_section"
            style={{display: visibilityBat ? "flex" :"none" }}
        >
            
            <StatistiqueProvider value={valeurProvider}> 
                    <DivTableauBordGauche />
                    <DivTableauBordDroit />
            </StatistiqueProvider> 
        </div>

        <div className="administration_contenu_titreBouton" 
        style={{marginTop :"2rem"}}
        >
            <div className="administration_contenu_titreBouton_titreImg"> {titreCompte()} </div>
            <div className="administration_contenu_titreBouton_boutonCinq">
                <Select
                    className="administration_contenu_titreBouton_boutonCinq_select"
                    showSearch
                    size='large'
                    value={valeurSelectCompte}
                    optionFilterProp="children"
                    onChange={e => changementCompte(e)}
                    filterOption={filterOption}
                    options={ lesComptes }
                />
                    <button  
                    className="administration_contenu_titreBouton_boutonCinq_btn"
                    onClick={() =>setVisibilityCompte(!visibilityCompte)}> </button>
            </div>
        </div>

        <div className="administration_contenu_section"
            style={{display: visibilityCompte ? "flex" :"none" }}
        >
            
            <StatistiqueProvider value={{type:"compte", id :valeurSelectCompte }}> 
                    <DivTableauBordGauche />
                    <DivTableauBordDroit />
            </StatistiqueProvider> 
        </div>
    </div>
    );
}