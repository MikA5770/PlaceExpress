import CountUp from 'react-countup';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

import { Statistic, StatisticProps } from 'antd';

import { StatPetitElement } from './StatPetitElement';
import { CalendrierReservation } from './CalendrierReservation';

import { useState,useEffect,useContext } from "react";
import { BatimentDAO } from '../../../modele/DAO/BatimentDAO';

import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';
import { StatistiqueContext } from './StatistiqueContext';
import { PlaceDAO } from '../../../modele/DAO/PlaceDAO';
import { EtageDAO } from '../../../modele/DAO/EtageDAO';

export function DivTableauBordGauche(){

    const [nbrBatiment, setNombreBatiment] = useState(0);
    const [nbrPlace, setNombrePlace] = useState(0);
    const [nbrActif, setNombreActif] = useState(0);
    const [tauxRemplissage, setTauxRemplissage] = useState(0);
    const [augmentationTaux, setAugmentationTaux] = useState(true);

    const endroit =  useContext(StatistiqueContext);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const batimentDAO= new BatimentDAO();
        const reservationDAO= new ReservationDAO();
        const etageDAO= new EtageDAO();
        const placeDAO= new PlaceDAO();

        async function affichage() {
            let nombreBat = 0;
            let nombrePlace=0;
            let nombreActif = 0;
            let taux = { ancien : 0, nouveau : 0};
               
            
            if(endroit.type==="site"){
                nombreBat = await batimentDAO.nombre();
                nombreActif = await reservationDAO.nombreUtilisateurActifTotal();
                taux = await reservationDAO.tauxRemplissageTotal();
                nombrePlace = await placeDAO.nombre();

            }else if(endroit.type==="batiment"){
                nombreBat = await etageDAO.nombrebyBatiment(endroit.id);
                nombrePlace = await placeDAO.nombrebyBatiment(endroit.id);

                nombreActif = await reservationDAO.nombreUtilisateurActifbyBatiment(endroit.id);
                taux = await reservationDAO.tauxRemplissagebyBatiment(endroit.id);
            }else if(endroit.type==="etage"){
                nombrePlace = await placeDAO.nombrebyEtage(endroit.id);

                nombreActif = await reservationDAO.nombreUtilisateurActifbyEtage(endroit.id);
                taux = await reservationDAO.tauxRemplissagebyEtage(endroit.id);
            }else if(endroit.type==="compte"){
                nombreActif = await reservationDAO.nombreReservation(endroit.id);
                taux =  { nouveau : await reservationDAO.nombreAbsence(endroit.id),ancien : 0}

                nombreBat = await reservationDAO.heurePresence(endroit.id);
                nombrePlace = await reservationDAO.placesDiff(endroit.id)
            }

            setNombreBatiment(nombreBat);
            setNombrePlace(nombrePlace);
            setNombreActif(nombreActif);
            setTauxRemplissage(taux.nouveau);
            setAugmentationTaux(taux.ancien <= taux.nouveau);

        }

        affichage();

    }, [endroit]);

    const formatter = (value: number) => <CountUp end={value} separator=" " />;

    return(
        <div className="administration_contenu_section_gauche">
                    <div className="administration_contenu_section_gauche_grand">
                            <CalendrierReservation />
                    </div>
                    <div className="administration_contenu_section_gauche_sousEnsemble">

                        {endroit.type==="site" ? 
                        (<>
                            <StatPetitElement nombre={nbrActif} titre="Utilisateurs Actifs" />
            
                            <div className="administration_contenu_section_gauche_sousEnsemble_petit">
                            <Statistic title="Taux de remplissage" value={tauxRemplissage}  suffix="%" valueStyle={ augmentationTaux ? { color: '#3f8600' } : { color: '#cf1322' } } prefix={ augmentationTaux ? <ArrowUpOutlined /> : <ArrowDownOutlined />  } formatter={formatter as StatisticProps['formatter']} />
                            </div>
            
                            <StatPetitElement nombre={nbrBatiment} titre="Batiments" />
                            <StatPetitElement nombre={nbrPlace}  titre="Places" />
                        </>) : 
                        endroit.type==="batiment" ? 
                        (<>
                            <StatPetitElement nombre={nbrActif} titre="Utilisateurs Actifs" />
            
                            <div className="administration_contenu_section_gauche_sousEnsemble_petit">
                            <Statistic title="Taux de remplissage" value={tauxRemplissage}  suffix="%" valueStyle={ augmentationTaux ? { color: '#3f8600' } : { color: '#cf1322' } } prefix={ augmentationTaux ? <ArrowUpOutlined /> : <ArrowDownOutlined />  } formatter={formatter as StatisticProps['formatter']} />
                            </div>
            
                            <StatPetitElement nombre={nbrBatiment} titre="Etage" />
                            <StatPetitElement nombre={nbrPlace}  titre="Places" />
                        </>) : endroit.type==="etage" ? 

                        (<>
                            <StatPetitElement nombre={nbrActif} titre="Utilisateurs Actifs" />
            
                            <div className="administration_contenu_section_gauche_sousEnsemble_moyen">
                            <Statistic title="Taux de remplissage" value={tauxRemplissage}  suffix="%" valueStyle={ augmentationTaux ? { color: '#3f8600' } : { color: '#cf1322' } } prefix={ augmentationTaux ? <ArrowUpOutlined /> : <ArrowDownOutlined />  } formatter={formatter as StatisticProps['formatter']} />
                            </div>
            
                            <StatPetitElement nombre={nbrPlace}  titre="Places" />
                        </>) 

                        :(<>
                            <StatPetitElement nombre={nbrActif} titre="Réservations" />
                            <StatPetitElement nombre={tauxRemplissage} titre="Absences" />
                            
                            <StatPetitElement nombre={nbrBatiment} titre="Heures présents" />
                            <StatPetitElement nombre={nbrPlace}  titre="Places différentes" />
                        </>)






                        }

                    </div>
        </div>
    )
}