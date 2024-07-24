import React, { useContext } from 'react';
import { Collapse } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useEffect,useState } from "react";
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';
import { StatistiqueContext } from './StatistiqueContext';

export function BarReservationSemaine() {
  // Données d'exemple pour les jours de la semaine
  const [data, setData] = useState<{day : string, reservation : number}[]>([
    { day: 'Lundi', reservation: 10 },
    { day: 'Mardi', reservation: 25 },
    { day: 'Mercredi', reservation: 15 },
    { day: 'Jeudi', reservation: 30 },
    { day: 'Vendredi', reservation: 20 },
    { day: 'Samedi', reservation: 5 },
    { day: 'Dimanche', reservation: 12 },
  ])

  const endroit =  useContext(StatistiqueContext);

  useEffect(() => { // Code à exécuter après chaque rendu 
    const reservationDAO = new ReservationDAO();

    async function affichageBar() {
        
            let donnee : {day : string, reservation : number}[]=[];

            if(endroit.type==="site"){
              donnee = await reservationDAO.semaine();

          }else if(endroit.type==="batiment"){
              donnee = await reservationDAO.semaineByBatiment(endroit.id);

          }else if(endroit.type==="etage"){
              donnee = await reservationDAO.semaineByEtage(endroit.id);

          }else if(endroit.type==="compte"){
            donnee = await reservationDAO.semaineByPersonne(endroit.id);
          }

          setData(donnee);
        
    }
    
    affichageBar();

  }, [endroit]);

  return (
    <Collapse
      className="administration_contenu_section_droite_graph"
      items={[
        {
          key: '1',
          label: endroit.type==="compte"? 'Présence lors de cette semaine' : 'Affluence de la semaine',
          children: (
            <ResponsiveContainer width="100%" height={300} >
              <BarChart data={data}>
                <XAxis dataKey="day" stroke="white"/>
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservation" fill="white" />
              </BarChart>
            </ResponsiveContainer>
          ),
        },
      ]}
    />
  );
}