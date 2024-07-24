import CountUp from 'react-countup';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

import { Statistic, StatisticProps } from 'antd';

import { StatPetitElement } from './StatPetitElement';
import { CalendrierReservation } from './CalendrierReservation';

import { useState,useEffect,useContext } from "react";
import { BatimentDAO } from '../../../modele/DAO/BatimentDAO';

import { NombrePlaceContext } from './NombrePlaceContext';
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';

export function DivTableauBordGauche(){

    const [nbrBatiment, setNombreBatiment] = useState(0);
    const [nbrActif, setNombreActif] = useState(0);
    const [tauxRemplissage, setTauxRemplissage] = useState(0);
    const [augmentationTaux, setAugmentationTaux] = useState(true);
    const nbrPlace =  useContext(NombrePlaceContext);

    useEffect(() => { // Code à exécuter après chaque rendu 

        async function affichageBatiment() {
            try {
                const batimentDAO= new BatimentDAO();
                const nombre = await batimentDAO.nombre();
                setNombreBatiment(nombre);
            } catch (error) {
                console.error(error);
            }
        }
        
        async function affichageActif() {
            try {
                const reservationDAO= new ReservationDAO();
                const nombre = await reservationDAO.nombreUtilisateurActif();
                setNombreActif(nombre);
            } catch (error) {
                console.error(error);
            }
        }
        async function affichageTaux() {
            try {
                const reservationDAO= new ReservationDAO();
                const nombre = await reservationDAO.tauxRemplissage();
                const ancien = await reservationDAO.tauxAncienMois();
                setTauxRemplissage(nombre);
                setAugmentationTaux(ancien <= nombre);

            } catch (error) {
                console.error(error);
            }
        }
        affichageActif();
        affichageBatiment();
        affichageTaux();

    }, []);

    const formatter = (value: number) => <CountUp end={value} separator=" " />;

    return(
        <div className="administration_contenu_section_gauche">
                    <div className="administration_contenu_section_gauche_grand">
                            <CalendrierReservation />
                    </div>
                    <div className="administration_contenu_section_gauche_sousEnsemble">

                        <StatPetitElement nombre={nbrActif} titre="Utilisateurs Actifs" />

                        <div className="administration_contenu_section_gauche_sousEnsemble_petit">
                            <Statistic title="Taux de remplissage" value={tauxRemplissage}  suffix="%" valueStyle={ augmentationTaux ? { color: '#3f8600' } : { color: '#cf1322' } } prefix={ augmentationTaux ? <ArrowUpOutlined /> : <ArrowDownOutlined />  } formatter={formatter as StatisticProps['formatter']} />
                        </div> {/* Changer fleche et couleur suivant augmentation ou pas */}

                        <StatPetitElement nombre={nbrBatiment} titre="Batiments" />
                        <StatPetitElement nombre={nbrPlace}  titre="Places" />
                    </div>
        </div>
    )
}