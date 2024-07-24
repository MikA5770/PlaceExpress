import Search, { SearchProps } from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { PersonneDAO } from "../../../modele/DAO/PersonneDAO";
import { Personne } from "../../../modele/class/Personne";
import { DivAdmin } from "./DivAdmin";
import { DivUnResultat } from "./DivUnResultat";
import { message } from "antd";


export function DivPermission(){
    const [refreshData, setRefreshData] = useState(false);
    const [lesAdmin, setLesAdmin] = useState<Array<Personne>>([]);
    
    const [valeurRechercher, setValeurRechercher] = useState("");
    const [lesRecherches, setlesRecherches] = useState<Array<Personne>>([]);

    useEffect(() => { // Code à exécuter après chaque rendu 
        const personneDAO = new PersonneDAO();

        async function remplissageAdmin() {
            const admin= await personneDAO.getLesAdmin();
            setLesAdmin(admin);
        }

        remplissageAdmin();
        actualisationRecherche();


    }, [refreshData] );

     async function changementAdmin(id : string) {
        const personneDAO = new PersonneDAO();
        const personne = await personneDAO.getByPersonne(id);
        personne.estAdministrateur=!personne.estAdministrateur;

        personneDAO.update(personne);

        personne.estAdministrateur ? message.success("Administrateur "+ personne.nom+" "+personne.prenom+" ajouté") :message.success("Administrateur "+ personne.nom+" "+personne.prenom+" supprimé");
        actualisationRecherche();
        setRefreshData(!refreshData);
    }

    const recherche: SearchProps['onSearch'] = async (value) => {
        
        const personneDAO = new PersonneDAO();

        const lesPersonnes = await personneDAO.getByDebutEmail(value);
        setlesRecherches(lesPersonnes);
        setValeurRechercher(value);
    };

    const actualisationRecherche = async () => {
        const personneDAO = new PersonneDAO();

        const lesPersonnes = await personneDAO.getByDebutEmail(valeurRechercher);
        setlesRecherches(lesPersonnes);
    };


    return(
        <div className="administration_contenu_permission">
            <div className="administration_contenu_permission_admin">
                <div className="administration_contenu_permission_titre">
                    Comptes administrateurs
                </div>
                <div className="administration_contenu_permission_admin_lesAdmin">
                    {lesAdmin.map(elt =>(
                        <DivAdmin mail={elt.mail} nom={elt.nom} prenom={elt.prenom} idCompte={elt.idCompte} changementAdmin={changementAdmin} key={elt.idCompte} photoProfil={elt.idPhotoProfil}/>
                        ))
                    }
                    
                </div>
    
            </div>
            <div className="administration_contenu_permission_compte">
                <div className="administration_contenu_permission_titreDouble">
                    <div>Ajouter un administrateur</div>
                    <Search placeholder="Rechercher un e-mail" onSearch={recherche} style={{ width: 200 }} size="large"
                        className="administration_contenu_permission_titreDouble_recherche"
                    />
                </div>

                <div className="administration_contenu_permission_compte_lesResultats">
                    { lesRecherches.map(elt => (
                       <DivUnResultat estAdministrateur={elt.estAdministrateur} mail={elt.mail} nom={elt.nom} prenom={elt.prenom} idCompte={elt.idCompte} changementAdmin={changementAdmin} key={elt.idCompte} photoProfil={elt.idPhotoProfil}/>
                    ))}
                    
                </div>
                
            </div>
        </div>
    )
}