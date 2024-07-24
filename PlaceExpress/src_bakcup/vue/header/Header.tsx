import { useEffect, useState } from "react"
import {Link as RouterLink, useNavigate } from 'react-router-dom';

import { DivCompteMobile } from "./DivCompteMobile";
import { DivNavigationMobile } from "./DivNavigationMobile";

import { Lien } from "./Lien";
import { LienAvecPhoto } from "./LienAvecPhoto";

import { Utilisateur } from "../../modele/DAO/Utilisateur";
import { useAuthState } from "react-firebase-hooks/auth";
import { PersonneDAO } from "../../modele/DAO/PersonneDAO";

export function Header(valeur : { page: string }){

    const utilisateur = new Utilisateur();
    const personneDAO= new PersonneDAO()
    const [user] = useAuthState(utilisateur.getAuth());

    const navigate = useNavigate();

    if (!user) {  
        navigate('/*');
    }

    useEffect(() => { // Code à exécuter après chaque rendu 

        async function administrateur(){
            const estAdmin= await personneDAO.estAdministrateur(user!.uid)
            setAdmin(estAdmin);
            
            if ( !estAdmin && pagesActuel['administration']) {  
                navigate('/reserver');
            }

        }
        administrateur();

    }, [user]);
    

    // map des pages
    const pagesActuel: Record<string, boolean> = {
        "administration": false,
        "mesBatiment": false,
        "reserverUnePlace": false,
        "mesReservation": false,
        "monCompte": false,
        "contact": false,
      };
    pagesActuel[valeur.page]=true;

    const [admin, setAdmin] = useState(false);
    const [visiCompte, changeVisiCompte] = useState(false);
    const [visiNavigation, changevisiNavigation] = useState(false);

    function clickCompte(){
        changeVisiCompte(!visiCompte);
    }
    function clickNav(){
        changevisiNavigation(!visiNavigation);
    }

    return(
        <div className="header">
            <div className="header_haut">

                <DivNavigationMobile hidden={visiNavigation} pageActuel={pagesActuel}/>

                {admin ? (
                    <>
                    <LienAvecPhoto nom="Administration"  source={ pagesActuel['administration']? "adminActuel.png" : "admin.png" } chemin="/administration" actuel={pagesActuel['administration'] }/>
                    </>
                ) : 
                (
                    <>
                    <LienAvecPhoto nom="Contact"  source={ pagesActuel['contact']? "contactActuel.png" : "contact.png" } chemin="/contact" actuel={pagesActuel['contact'] }/>
                    </>
                )
                }
                <input type="submit" value=" " onClick={clickNav} className="img_navigation header_haut_btnNav" />

                <RouterLink to="*" className="header_haut_logo"> </RouterLink>

                <span className= { pagesActuel['monCompte']? "header_haut_spanCompte vert " : " header_haut_spanCompte"}> 
                <input type="submit" value="Mon Compte" onClick={clickCompte} className= { pagesActuel['monCompte']? "img_compteActuel vert header_haut_btnCompte" : "img_compte header_haut_btnCompte"}/>
                </span>  

                <DivCompteMobile hidden={visiCompte}/>

            </div>
            <div className="header_bas">
                <span>
                    <Lien nom="Mes Batiments" chemin="/mesBatiments" actuel={pagesActuel['mesBatiment']}/>
                    <Lien nom="Réserver une place" chemin="/reserver" actuel={pagesActuel['reserverUnePlace']} />
                    <Lien nom="Mes Réservations" chemin="/mesReservations" actuel={pagesActuel['mesReservation']} />
                </span>
            </div>
        </div>
    )
}