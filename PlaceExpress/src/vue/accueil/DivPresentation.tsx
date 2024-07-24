import { useState } from "react";
import { DivNavigation } from "./DivNavigation"
import { HeaderAccueil } from "./HeaderAccueil"

export function DivPresentation(){

  const [visibility, setVisibility] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);


    return(
      <>
      <DivNavigation visibility={visibility} click={click} setVisibility={()=> setVisibility(false)}/>
      <div className="accueil_presentation">
        <HeaderAccueil  visibility={visibility} setClick={()=> setClick(true)} setVisibility={()=> setVisibility(true)}/>
        <div className="accueil_presentation_slogan">Reservez instantanement et profitez de l'instant</div>
      </ div>
      </>
    )
  
  }