import Search, { SearchProps } from "antd/es/input/Search";
import { useContext, useEffect, useState } from "react";
import { Role } from "../../../modele/class/Role";
import { RoleDAO } from "../../../modele/DAO/RoleDAO";
import { Batiment } from "../../../modele/class/Batiment";
import { AccesDAO } from "../../../modele/DAO/AccesDAO";
import { Personne } from "../../../modele/class/Personne";
import { PersonneDAO } from "../../../modele/DAO/PersonneDAO";
import { PermissionDAO } from "../../../modele/DAO/PermissionDAO";
import { EndroitContext } from "../Plan/EndroitProvider";
import { IdContext } from "../Plan/IdProvider";
import { Popconfirm, message } from "antd";

export function DivRoleTotal(){

    const updateEndroit =  useContext(EndroitContext);
    const updateId =  useContext(IdContext);

    const [lesRoles, setLesRoles] = useState<Role[]>([]);
    const [mapRoleBat, setLaMap] = useState<Map<string,Array<Batiment>>>( new Map<string,Array<Batiment>>());

    const [valeurRechercher, setValeurRechercher] = useState("");

    const [lesRecherches, setlesRecherches] = useState<Array<Personne>>([]);
    const [mapUtiRole, setLaMapDeux] = useState<Map<string,Array<Role>>>( new Map<string,Array<Role>>());

    const [refreshData, setRefreshData] = useState(false);


    useEffect(() => { // Code à exécuter après chaque rendu 
        const roleDAO = new RoleDAO();
        const accesDAO = new AccesDAO();

        async function remplissageRole() {
            const role= await roleDAO.getAll();
            setLesRoles(role);

        
            const map = new Map<string,Array<Batiment>>()
            for(const ro of role){
                const lesBatiments= await accesDAO.getByRole(ro.idRole);
                map.set(ro.idRole,lesBatiments);
            }
            setLaMap(map);
            

        }

        remplissageRole();
        actualisationRecherche();

    }, [refreshData] );


    const recherche: SearchProps['onSearch'] = async (value) => {
        
        const personneDAO = new PersonneDAO();

        const lesPersonnes = await personneDAO.getByDebutEmail(value);
        setlesRecherches(lesPersonnes);
        setValeurRechercher(value);

        const permissionDAO = new PermissionDAO()

        const map = new Map<string,Array<Role>>()
            for(const personne of lesPersonnes){
                const lesRoles= await permissionDAO.getByPersonne(personne.idCompte);
                map.set(personne.idCompte,lesRoles);
            }
        setLaMapDeux(map);
    };

    const actualisationRecherche = async () => {

        const personneDAO = new PersonneDAO();

        const lesPersonnes = await personneDAO.getByDebutEmail(valeurRechercher);
        setlesRecherches(lesPersonnes);

        const permissionDAO = new PermissionDAO()

        const map = new Map<string,Array<Role>>()
            for(const personne of lesPersonnes){
                const lesRoles= await permissionDAO.getByPersonne(personne.idCompte);
                map.set(personne.idCompte,lesRoles);
            }
        setLaMapDeux(map);
    };

    function modifAjout(endroit : string, id: string):void{
        updateEndroit(endroit);
        updateId.fonction(id);
    }

    async function supprimerRole(role : Role){
        const roleDAO= new RoleDAO()
        try{
        await roleDAO.supprimer(role);
        }catch(e){
            alert(e);
        }
        setRefreshData(!refreshData);
        message.success('Suppression validé')
    }


    return(
        <div className="administration_contenu">
            <div className="administration_contenu_titreBouton">
                <div className="administration_contenu_titreBouton_titreDeux"> Roles </div>
                <div className="administration_contenu_titreBouton_boutonSoloPlan">
                    <button onClick={() => modifAjout("role","")}>Ajouter un role</button>
                </div>
            </div>
            
        <div className="administration_contenu_lesRoles">
            {
                lesRoles.map(elt => (
                    <div  className="administration_contenu_lesRoles_unRole" key={elt.idRole}>
                        <div className="bouton-hover-container" >
                            <input type="button" className="bouton-hover" 
                             onClick={() => modifAjout("role",elt.idRole)}/>
                            <Popconfirm
                                    title="Suppression"
                                    description="Etes vous sûr de supprimer ce role ?"
                                    onConfirm={() => supprimerRole(elt)}
                                    onCancel={ () => message.error('Suppression annulé')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                <input type="button" className="bouton-supprimer " />
                            </Popconfirm>
                            
                        </div>
                            
                            
                    <div className="administration_contenu_lesRoles_unRole_titre">
                        <div className="administration_contenu_lesRoles_unRole_titre_couleur" 
                        style={{backgroundColor : elt.color}}
                        >
                        </div>

                        <div className="administration_contenu_lesRoles_unRole_titre_contenu">
                            {elt.libelle}
                        </div>
                    </div>
                
                    <div className="administration_contenu_lesRoles_unRole_lesBatiments"
                    style={{
                        backgroundColor : elt.color.trim().slice(0, -1)+", 0.1)", 
                        borderColor : elt.color
                    }}
                    
                    >   
                        { mapRoleBat.has(elt.idRole) ?
                            
                            mapRoleBat.get(elt.idRole)!.map(bat => (
                                <div key={bat.idBatiment}>{bat.libelle}</div>
                            )) : ""
                        }
                        
                    </div>
                    </div>
                ))

            }

        </div>

        <div className="administration_contenu_lesComptes">
            <div className="administration_contenu_lesComptes_titre">
                <div className="administration_contenu_lesComptes_titre_titre">
                    Comptes
                </div>
                <div className="administration_contenu_lesComptes_titre_recherche">
                    <Search placeholder="Rechercher un e-mail" style={{ width: 200 }} size="large" onSearch={recherche}
                        className="administration_contenu_permission_compte_recherche_ant"
                    />
                </div>
            </div>
            
            {lesRecherches.map(elt => (
                <div className="administration_contenu_lesComptes_unCompte">
                <div className="administration_contenu_lesComptes_unCompte_profil">
                    <div className="administration_contenu_lesComptes_unCompte_profil_photo"
                    style={{backgroundImage: "url("+elt.idPhotoProfil+")"}}
                    >
                    </div>
                    <div className="administration_contenu_lesComptes_unCompte_profil_txt">
                        {elt.mail}
                    </div>
                    <div className="administration_contenu_lesComptes_unCompte_profil_txt">
                        {elt.nom} 
                    </div>
                    <div className="administration_contenu_lesComptes_unCompte_profil_txt">
                        {elt.prenom} 
                    </div>
                </div>
                <div className="administration_contenu_lesComptes_unCompte_droite">
                    <div className="administration_contenu_lesComptes_unCompte_lesRoles">
                        {   mapUtiRole.has(elt.idCompte) ? 
                                mapUtiRole.get(elt.idCompte)?.map(role => (
                                    <div className="administration_contenu_lesComptes_unCompte_lesRoles_unRole">
                                        <div className="administration_contenu_lesComptes_unCompte_lesRoles_unRole_couleur"
                                        style={{backgroundColor : role.color}}>
                                        </div>
                                        <div className="administration_contenu_lesComptes_unCompte_lesRoles_unRole_libelle">
                                            {role.libelle}
                                        </div>
                                    </div>
                                ))
                            :
                            ""
                        }        
                    </div>
                    <input type="button" className="administration_contenu_lesComptes_unCompte_modifier" 
                    onClick={() => modifAjout("personne",elt.idCompte)}
                    />
                </div>
            </div>
            ))}

            
        </div>



    </div>
    );
}