import {Link as RouterLink } from 'react-router-dom';
import { Button } from 'antd';
import { Utilisateur } from '../../modele/DAO/Utilisateur';
import { useAuthState } from 'react-firebase-hooks/auth';


export function DivCompteMobile( value : {hidden : boolean}){

    const utilisateur = new Utilisateur();
    const [user] = useAuthState(utilisateur.getAuth());


    return(
        <div className={value.hidden ? "header_haut_compte": "header_haut_compte invisible" } >
            <div className="header_haut_compte_titre">Bonjour {user?.displayName} ! </div>
            
            
                <RouterLink to="/monCompte"><Button size='large'> Gérer mon compte</Button></RouterLink>
            

            <div onClick={() => utilisateur.deconnexion()} > Se déconnecter </div>
        </div>
    )
}