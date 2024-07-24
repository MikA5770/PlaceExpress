import React from 'react';
import { Collapse } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useEffect,useState } from "react";
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';

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

  useEffect(() => { // Code à exécuter après chaque rendu 
    const reservationDAO = new ReservationDAO();

    async function affichageBar() {
        try {
            const donnee = await reservationDAO.semaine();
            setData(donnee);
        } catch (error) {
            console.error(error);
        }
    }
    
    affichageBar();

  }, []);

  return (
    <Collapse
      className="administration_contenu_section_droite_graph"
      items={[
        {
          key: '1',
          label: 'Affluence de la semaine',
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