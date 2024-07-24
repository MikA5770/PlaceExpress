
import { useContext, useEffect, useState } from "react";
import { Role } from "../../../modele/class/Role";
import { RoleDAO } from "../../../modele/DAO/RoleDAO";
import { Batiment } from "../../../modele/class/Batiment";
import { AccesDAO } from "../../../modele/DAO/AccesDAO";
import { EndroitContext } from "../Plan/EndroitProvider";
import { IdContext } from "../Plan/IdProvider";
import { Personne } from "../../../modele/class/Personne";
import { PersonneDAO } from "../../../modele/DAO/PersonneDAO";
import { PermissionDAO } from "../../../modele/DAO/PermissionDAO";


export function DivUtiRole (){

    const updateEndroit =  useContext(EndroitContext);
    const id =  useContext(IdContext);

    const [utilisateur, setLesUtilisateurs] = useState(new Personne());
    const [lesPermissions, setLesPermissions] = useState<string[]>([]);

    const [lesRoles, setLesRoles] = useState<Role[]>([]);
    const [mapRoleBat, setLaMap] = useState<Map<string,Array<Batiment>>>( new Map<string,Array<Batiment>>());

    useEffect(() => { // Code à exécuter après chaque rendu 
        const roleDAO = new RoleDAO();
        const accesDAO = new AccesDAO();
        const permissionDAO = new PermissionDAO();
        const personneDAO = new PersonneDAO();

        async function remplissageRole() {
            const role= await roleDAO.getAll();
            setLesRoles(role);

        
            const map = new Map<string,Array<Batiment>>()
            for(const ro of role){
                const lesBatiments= await accesDAO.getByRole(ro.idRole);
                map.set(ro.idRole,lesBatiments);
            }
            setLaMap(map);
            
            const uti=  await personneDAO.getByPersonne(id.id);
            setLesUtilisateurs(uti);

            const perm = await permissionDAO.getByPersonne(id.id);
            const tab :string[] =[]
            perm.forEach(elt => tab.push(elt.idRole));
            setLesPermissions(tab);
        }

        remplissageRole();

    }, [] );

    const changementRole = (identifiant : string) => {
        let perm=[]
        perm=lesPermissions.filter(elt => elt!=identifiant);
        if( !lesPermissions.includes(identifiant)){
            perm.push(identifiant);
        }
        setLesPermissions(perm);
    }
    async function enregister(){
        const permissionDAO= new PermissionDAO();
        await permissionDAO.updateTab(utilisateur,lesPermissions);


        updateEndroit("accueil");
        
    }

    return(
        <div className="administration_contenu">

            <div className="administration_contenu_titreBouton">
                <div style={{display:"flex", alignItems:"center"}} >
                    { utilisateur.idPhotoProfil!="" ? (
                    <img src={utilisateur.idPhotoProfil}
                    style={{height:"1.8rem" , width : "1.8rem",marginRight:"1rem", borderRadius:"50%" }}/> ) : ""
                    }
                    {utilisateur.nom+" "+utilisateur.prenom}
                    </div>
                <div className="administration_contenu_titreBouton_boutonDeux">
                    <button onClick={() => updateEndroit("accueil")}>Retour</button>
                    <button onClick={() => enregister()}>Enregister </button>
                </div>
            </div>
            
        <div className="administration_contenu_lesRoles">
            {
                lesRoles.map(elt => (
                    <label className="administration_contenu_lesRoles_unRole" key={elt.idRole}
                    style={{ border : lesPermissions.includes(elt.idRole) ? "2px solid "+elt.color :"2px solid white" } }
                    >
                        <input type="checkbox" className="bouton-checkbox" 
                        onClick={() => changementRole(elt.idRole)}
                        checked={lesPermissions.includes(elt.idRole) ?  true : false}
                        />  
                            
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
                    </label>
                ))

            }

        </div>




    </div>
    );

}