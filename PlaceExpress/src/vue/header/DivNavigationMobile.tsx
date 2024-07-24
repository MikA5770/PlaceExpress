
import { LienMobile } from "./LienMobile";

export function DivNavigationMobile( value : { hidden: boolean,pageActuel : Record<string, boolean >, admin : boolean}){
    return(
        <div className="header_haut_navigation"
            style={{display: value.hidden? "flex" :"none"}}> 
            <LienMobile nom="Mes Batiments" chemin="/mesBatiments" actuel={value.pageActuel['mesBatiment']}/>
            <LienMobile nom="Réserver une place" chemin="/reserver" actuel={value.pageActuel['reserverUnePlace']} />
            <LienMobile nom="Mes Réservations" chemin="/mesReservations" actuel={value.pageActuel['mesReservation']} />

            { value.admin ?
                <LienMobile nom="Administration"  chemin="/administration" actuel={value.pageActuel['administration'] } />
             :
                <LienMobile nom="Contact"  chemin="/contact" actuel={value.pageActuel['contact'] } />
             }

            
        </div>
    )
}