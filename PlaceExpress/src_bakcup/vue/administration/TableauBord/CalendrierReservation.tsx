import type { Dayjs } from 'dayjs';
import type {  CalendarProps } from 'antd';

import { Calendar,Badge  } from 'antd';

import { useState,useEffect } from "react";
import { ReservationDAO } from '../../../modele/DAO/ReservationDAO';

export function CalendrierReservation(){
    const [reservations, setReservation] = useState<{date : string, count : number}[]>([]);

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
          try {
              const calendrier = await reservationDAO.calendrier();
              setReservation(calendrier);
          } catch (error) {
              console.error(error);
          }
      }
      
      affichageCalendrier();

  }, []);


    return(
        <Calendar cellRender={cellRender} className="administration_contenu_section_gauche_grand_calendrier"/>
    )

}