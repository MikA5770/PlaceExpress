
import React, { useState } from 'react';
import { Tooltip, Popover } from 'antd';

import "../style/Reserver.css";
import { Place } from "../modele/class/Place.ts";
import { Header } from './header/Header.tsx'
import plan from '../style/image/plan.png'
import '../style/App.css'
import { PopupLibre } from './reserver/popup_libre.tsx';
import { PopupOccupee } from './reserver/popup_occupee.tsx';
import { PopupAdminLibre } from './reserver/popup_admin_libre.tsx';
import { PopupAdminOccupee } from './reserver/popup_admin_occupee.tsx';
import { Titre } from './reserver/titre.tsx';
import { Abonnement } from './reserver/abonnement.tsx';
import { Footer } from './Footer.tsx';


export function Reserver() {
  
  const place = new Place();

  const pl = (
    <PopupLibre valeur={place.idPlace}/>
  )
  const po = (
    <PopupOccupee />
  )
  const pal = (
    <PopupAdminLibre />
  )
  const pol = (
    <PopupAdminOccupee />
  )

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };  

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

    return(
      <>
        <Header page="reserverUnePlace"/>
        <Titre />
        <div className="div_plan">
          <img className='plan' src={plan} alt="plan.png" />
          <div className='cont'>
          <Popover content={pl} trigger="click" ><Tooltip placement="bottom" title="Place 1" color="#759242"><div className="p1 case"><span>P1</span></div></Tooltip></Popover>
          <Popover content={pal} trigger="click" > <Tooltip placement="bottom" title="Place 2" color="#759242"><div className="p2 case"><span>P2</span></div></Tooltip></Popover>
          <Popover content={po} trigger="click" ><Tooltip placement="bottom" title="Place 3 : Réservée par Mikail" color="red"><div className="p3 case" ><span>P3</span></div></Tooltip></Popover>
          <Popover content={pol} trigger="click" ><Tooltip placement="bottom" title="Place 4 : Réservée par Thibault" color="red"><div className="p4 case"><span>P4</span></div></Tooltip></Popover>
        </div>
        </div>  

        <Abonnement />
        <Footer />
      </>
  
  )
}


  
  