
import { LienMobile } from "./LienMobile";

export function DivNavigationMobile( value : { hidden: boolean,pageActuel : Record<string, boolean >}){
    return(
        <div className={value.hidden ? "header_haut_navigation": "header_haut_navigation invisible" } >
            <LienMobile nom="Mes Batiments" chemin="/mesBatiments" actuel={value.pageActuel['mesBatiment']}/>
            <LienMobile nom="Réserver une place" chemin="/reserver" actuel={value.pageActuel['reserverUnePlace']} />
            <LienMobile nom="Mes Réservations" chemin="/mesReservations" actuel={value.pageActuel['mesReservation']} />
            <LienMobile nom="Administration"  chemin="/administration" actuel={value.pageActuel['administration'] } />
        </div>
    )
}