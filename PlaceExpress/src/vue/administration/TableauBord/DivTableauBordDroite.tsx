import { Statistic, StatisticProps  } from 'antd';
import CountUp from 'react-countup';

import { LigneTableauBord } from './LigneTableauBord';
import { BarReservationSemaine } from './BarReservationSemaine';

import { useState,useEffect,useContext } from "react";
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';

import { BatimentDAO } from '../../../modele/DAO/BatimentDAO';
import { StatistiqueContext } from './StatistiqueContext';
import { PlaceDAO } from '../../../modele/DAO/PlaceDAO';
import { EtageDAO } from '../../../modele/DAO/EtageDAO';
import { Reservation } from '../../../modele/class/Reservation';


export function DivTableauBordDroit(){
    const [nbrResDuJour, setNombreReservationDuJour] = useState(0);
    const [nbrPlace, setNombrePlace] = useState(0);
    const [reservationActuel, setReservationActuel] = useState(new Reservation());

    const [visibilityPremier, setVisibilityPremier] = useState(false);
    const [visibilitySecond, setVisibilitySecond] = useState(false);
    const [visibilityTroisieme, setVisibilityTroisieme] = useState(false);


    const [batimentActif, setBatimentActif] = useState<{nombre : number, libelle : string}[]>([]);
    const [utlisateursPresent, setUtilisateursPresent] = useState<{nombre : number, libelle : string}[]>([]);
    const [utilisateursAbsent, setUtilisateursAbsent] = useState<{nombre : number, libelle : string}[]>([]);

    const [ancienneRes, setAncienneRes] = useState<{horaire : string, libelle : string}[]>([]);
    const [prochaineRes, setProchaineRes] = useState<{horaire : string, libelle : string}[]>([]);

    const endroit =  useContext(StatistiqueContext);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const reservationDAO= new ReservationDAO();
        const batimentDAO= new BatimentDAO();
        const etageDAO= new EtageDAO();
        const placeDAO= new PlaceDAO();

        async function affichage() {
                let nobrDuJour = 0;
                let nombrePlace=0;
                let tableau : {nombre : number, libelle : string}[]=[];
                let presents : {nombre : number, libelle : string}[]=[];
                let absents : {nombre : number, libelle : string}[]=[];
                
                if(endroit.type==="site"){
                    nobrDuJour = await reservationDAO.nombreDuJour();
                    nombrePlace = await placeDAO.nombre();
                    setVisibilityPremier(true);

                    const lesBatiments= await batimentDAO.getAll();
                    for(const batiment of lesBatiments){
                        const nbr = await reservationDAO.nombreDuJourByBatiment(batiment.idBatiment);
                        tableau.push({nombre : nbr, libelle : batiment.libelle});
                    }
                }else if(endroit.type==="batiment"){
                    nobrDuJour = await reservationDAO.nombreDuJourByBatiment(endroit.id);
                    nombrePlace = await placeDAO.nombrebyBatiment(endroit.id);

                    const lesEtages= await etageDAO.getByBatiment(endroit.id);
                    for(const etage of lesEtages){
                        const nbr = await reservationDAO.nombreDuJourByEtage(etage.idEtage);
                        tableau.push({nombre : nbr, libelle : etage.libelleEtage});
                    }
                    presents=await reservationDAO.utilisateursPlusPresentByBatiment(endroit.id);
                    absents=await reservationDAO.utilisateursPlusAbsentByBatiment(endroit.id);

                }else if(endroit.type==="etage"){
                    nobrDuJour = await reservationDAO.nombreDuJourByEtage(endroit.id);
                    nombrePlace = await placeDAO.nombrebyEtage(endroit.id);

                    const lesPlaces= await placeDAO.getByEtage(endroit.id);
                    for(const place of lesPlaces){
                        const nbr = await reservationDAO.nombreDuJourByPlace(place.idPlace);
                        tableau.push({nombre : nbr, libelle : place.libellePlace});
                    }

                    presents=await reservationDAO.utilisateursPlusPresentByEtage(endroit.id);
                    absents=await reservationDAO.utilisateursPlusAbsentByEtage(endroit.id);

                }else if(endroit.type==="compte"){
                    setReservationActuel(await reservationDAO.reservationEnCours(endroit.id))

                    tableau=await reservationDAO.placesFrequentes(endroit.id);
                    setAncienneRes(await reservationDAO.ancienneReservation(endroit.id))
                    setProchaineRes( await reservationDAO.prochaineReservation(endroit.id))
                }   

                setNombreReservationDuJour(nobrDuJour);
                setNombrePlace(nombrePlace)

                tableau = tableau.sort((a, b) => b.nombre - a.nombre);
                setBatimentActif(tableau);
                setUtilisateursPresent(presents);
                setUtilisateursAbsent(absents);

        }
        
        affichage();

    }, [endroit]);


    const formatter = (value: number) => <CountUp end={value} separator=" " />;

    return (
        <div className="administration_contenu_section_droite">
            <div className="administration_contenu_section_droite_titre">
                Actuellement 
            </div>

            <div className="administration_contenu_section_droite_stat">
                {endroit.type==="compte" ? (<>
                    <div>{reservationActuel.place.libellePlace==="" ? "Aucune Réservation" :reservationActuel.place.libellePlace+" "+reservationActuel.place.etage.batiment.libelle}</div>
                    <div>{reservationActuel.heureDebut+" - "+reservationActuel.heureFin}</div>
                    </>) 
                    :
                    <>
                    <Statistic title="Réservations" value={nbrResDuJour} formatter={formatter as StatisticProps['formatter']} />
                    <Statistic title="Places libres" value={ nbrPlace - nbrResDuJour} formatter={formatter as StatisticProps['formatter']} />
                    </>
}
            </div>

            <BarReservationSemaine />
            
            {endroit.type==="site" ?
            (<div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityPremier(!visibilityPremier)}
                >
                    <span>Batiments les plus actifs</span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityPremier? "block" : "none"}}
                >
                { batimentActif.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            )

            : endroit.type==="batiment" ? 
            (<>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityPremier(!visibilityPremier)}
                >
                    <span>Etages les plus fréquentées  </span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityPremier? "block" : "none"}}
                >
                { batimentActif.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilitySecond(!visibilitySecond)}
                >
                    <span>Utilisateurs les plus présents</span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilitySecond? "block" : "none"}}
                >
                { utlisateursPresent.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityTroisieme(!visibilityTroisieme)}
                >
                    <span>Utilisateurs les plus absents</span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityTroisieme? "block" : "none"}}
                >
                { utilisateursAbsent.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            </>
            )
            : endroit.type==="etage" ? 
            (<>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityPremier(!visibilityPremier)}
                >
                    <span>Places les plus fréquentées  </span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityPremier? "block" : "none"}}
                >
                { batimentActif.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilitySecond(!visibilitySecond)}
                >
                    <span>Utilisateurs les plus présents</span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilitySecond? "block" : "none"}}
                >
                { utlisateursPresent.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityTroisieme(!visibilityTroisieme)}
                >
                    <span>Utilisateurs les plus absents</span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityTroisieme? "block" : "none"}}
                >
                { utilisateursAbsent.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            </>
            )

            : 
            (<>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityPremier(!visibilityPremier)}
                >
                    <span>Places les plus fréquentées    </span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityPremier? "block" : "none"}}
                >
                { batimentActif.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle} key={elt.libelle}/>)
                })}
                </div> 
            </div>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilitySecond(!visibilitySecond)}
                >
                    <span>Anciennes Réservations </span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilitySecond? "block" : "none"}}
                >
                { ancienneRes.map( elt => {
                    return(
                    <div className="administration_contenu_section_droite_tab_contenu">
                        <span>{elt.libelle}</span>
                        <span>{elt.horaire}</span>
                    </div>
                    )
                })}
                </div> 
            </div>
            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre"
                    onClick={() => setVisibilityTroisieme(!visibilityTroisieme)}
                >
                    <span>Réservations à venir </span>
                    <span>Réservations</span>
                </div>
                <div
                    style={{display : visibilityTroisieme? "block" : "none"}}
                >
                { prochaineRes.map( elt => {
                    return(
                        <div className="administration_contenu_section_droite_tab_contenu">
                            <span>{elt.libelle}</span>
                            <span>{elt.horaire}</span>
                        </div>
                        )
                })}
                </div> 
            </div>
            </>
            )
            }
                
    
</div>)
}