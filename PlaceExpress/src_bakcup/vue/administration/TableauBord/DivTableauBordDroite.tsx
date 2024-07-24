import { Statistic, StatisticProps  } from 'antd';
import CountUp from 'react-countup';

import { LigneTableauBord } from './LigneTableauBord';
import { BarReservationSemaine } from './BarReservationSemaine';

import { useState,useEffect,useContext } from "react";
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';

import { NombrePlaceContext } from './NombrePlaceContext';
import { BatimentDAO } from '../../../modele/DAO/BatimentDAO';


export function DivTableauBordDroit(){
    const [nbrResDuJour, setNombreReservationDuJour] = useState(0);
    const [batimentActif, setBatimentActif] = useState<{nombre : number, libelle : string}[]>([]);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const reservationDAO= new ReservationDAO();
        const batimentDAO= new BatimentDAO();

        async function affichageNombreduJour() {
            try {
                const nombre = await reservationDAO.nombreDuJour();
                setNombreReservationDuJour(nombre);
            } catch (error) {
                console.error(error);
            }
        }

        async function affichagebatimentActif() {
            try {
                

                let tableau=[];
                const lesBatiments= await batimentDAO.getAll();

                for(const batiment of lesBatiments){
                    const nbr = await reservationDAO.nombreDuJourByBatiment(batiment.idBatiment);
                    tableau.push({nombre : nbr, libelle : batiment.libelle});
                }

                //trier le tableau 
                tableau = tableau.sort((a, b) => b.nombre - a.nombre);

                setBatimentActif(tableau);
                
            } catch (error) {
                console.error(error);
            }
        }
        
        affichageNombreduJour();
        affichagebatimentActif();

    }, []);


    const formatter = (value: number) => <CountUp end={value} separator=" " />;

    const nbrPlace =  useContext(NombrePlaceContext);

    return (
        <div className="administration_contenu_section_droite">
            <div className="administration_contenu_section_droite_titre">
                Actuellement 
            </div>

            <div className="administration_contenu_section_droite_stat">
                <Statistic title="Réservations" value={nbrResDuJour} formatter={formatter as StatisticProps['formatter']} />
                <Statistic title="Places libres" value={ nbrPlace - nbrResDuJour} formatter={formatter as StatisticProps['formatter']} />
            </div>

            <BarReservationSemaine />

            <div className="administration_contenu_section_droite_tab">
                <div className="administration_contenu_section_droite_tab_titre">
                    <span>Batiments les plus actifs</span>
                    <span>Réservations</span>
                </div>
                { batimentActif.map( elt => {
                    return(<LigneTableauBord nombre={elt.nombre} titre={elt.libelle}/>)
                })}
    </div>
</div>)
}