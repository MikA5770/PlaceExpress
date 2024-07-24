import { DivTableauBordGauche } from "./TableauBord/DivTableauBordGauche";
import { DivTableauBordDroit } from "./TableauBord/DivTableauBordDroite";

import { useState,useEffect } from "react";

import { PlaceDAO } from "../../modele/DAO/PlaceDAO";

import { NombrePlaceProvider } from "./TableauBord/NombrePlaceContext";
import { StatistiqueProvider } from "./TableauBord/StatistiqueContext";

export function DivTableauBord(){
    const [nbrPlace, setNombrePlace] = useState(0);

    useEffect(() => { // Code à exécuter après chaque rendu 

        async function affichagePlace() {
            try {
                const placeDAO= new PlaceDAO();
                const nombre = await placeDAO.nombre();
                setNombrePlace(nombre);
            } catch (error) {
                console.error(error);
            }
        }
        affichagePlace();

    }, []);
    
    return(
        <div className="administration_contenu">

            <div className="administration_contenu_titre">
                Tableau de Bord
            </div>

            <div className="administration_contenu_section">
            
            <StatistiqueProvider value={{type:"site",id:""}} >
                <NombrePlaceProvider value={nbrPlace}>
                    <DivTableauBordGauche />
                    <DivTableauBordDroit />
                </NombrePlaceProvider>
            </StatistiqueProvider>
            </div>
        </div>
    );
}