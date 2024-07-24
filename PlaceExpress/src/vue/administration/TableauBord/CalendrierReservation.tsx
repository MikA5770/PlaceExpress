import type { Dayjs } from 'dayjs';
import type {  CalendarProps } from 'antd';

import { Calendar,Badge  } from 'antd';

import { useState,useEffect, useContext } from "react";
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';
import { StatistiqueContext } from './StatistiqueContext';

export function CalendrierReservation(){
    const [reservations, setReservation] = useState<{date : string, count : number}[]>([]);

    const endroit =  useContext(StatistiqueContext);

    const monthCellRender = (value : Dayjs) => {
        const yearMonth = value.format('YYYY-MM');
        const monthlyReservations = reservations.filter((r) =>
            r.date.startsWith(yearMonth)
        );
      
        const totalReservations = monthlyReservations.reduce(
            (total, reservation) => total + reservation.count,
            0
        );
      
        return totalReservations > 0 ? (
            <Badge count={totalReservations} style={{ backgroundColor: '#52c41a' }} />
          ) : <Badge count={0} style={{ backgroundColor: 'red' }} /> ;
        };

    const dateCellRender = (value: Dayjs) => {
        const date = value.format('YYYY-MM-DD');
        const dailyReservations = reservations.filter((r) => r.date === date);
    
        const totalReservations = dailyReservations.reduce(
          (total, reservation) => total + reservation.count,
          0
        );
    
        return totalReservations > 0 ? (
          <Badge count={totalReservations} size="default" style={{ backgroundColor: '#52c41a' }} />
        ) :  <Badge count={0} style={{ backgroundColor: 'red' }} /> ;
    };
  
    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };
    
    useEffect(() => { // Code à exécuter après chaque rendu 
      const reservationDAO = new ReservationDAO();

      async function affichageCalendrier() {

            let calendrier : {date:string,count:number}[]=[]

                if(endroit.type==="site"){
                    calendrier = await reservationDAO.calendrierTout();
    
                }else if(endroit.type==="batiment"){
                    calendrier = await reservationDAO.calendrierByBatiment(endroit.id);

                }else if(endroit.type==="etage"){
                    calendrier = await reservationDAO.calendrierByEtage(endroit.id);

                }else if(endroit.type==="compte"){
                    calendrier = await reservationDAO.calendrierByCompte(endroit.id);
                }

            setReservation(calendrier);
          
      }
      
      affichageCalendrier();

  }, [endroit]);


    return(
        <Calendar cellRender={cellRender} className="administration_contenu_section_gauche_grand_calendrier"/>
    )

}