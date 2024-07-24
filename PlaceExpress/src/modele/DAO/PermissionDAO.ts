import { Permission } from "../class/Permission";
import { Connexion } from "./connexion";

import { RoleDAO } from "./RoleDAO";
import { Role } from "../class/Role";
import { PersonneDAO } from "./PersonneDAO";
import { Personne } from "../class/Personne";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove  } from 'firebase/database';
import { Batiment } from "../class/Batiment";
import { AccesDAO } from "./AccesDAO";



export class PermissionDAO{
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Permission/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private async snapshotDePermission(snapshot: DataSnapshot): Promise<Permission> {
        const roleDAO = new RoleDAO();
        const personneDAO = new PersonneDAO();
        const value = snapshot.val();
        const permission = new Permission();

        permission.personne = snapshot.key!=null ? await personneDAO.getByPersonne(snapshot.key) : new Personne();

        const idRole=snapshot.ref.parent?.key;
        permission.role = idRole!=null ? await roleDAO.getByRole(idRole) : new Role();

        permission.valeur=value.valeur

        return permission;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Permission>> {
        const snapshot = await this.onValuePromise(requete);
        let data: Array<Permission> = [];

        const promises : Promise<Permission>[]= [];

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach(child => {
                promises.push(this.snapshotDePermission(child));
            })
        });

        data = await Promise.all(promises);

    return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Permission> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return await this.snapshotDePermission(snapshot);
        } else {
            throw new Error("Permission vide");
        }
    }

    public getAll(): Promise<Array<Permission>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByPermission(idRole: string,idPersonne : string ): Promise<Permission> {
        const personneDAO = new PersonneDAO();
        const roleDAO = new RoleDAO();

        const unAcces = await this.loadQueryOneResult(ref(this.db, this.branch + idRole+"/" + idPersonne));
        unAcces.personne = await personneDAO.getByPersonne(idPersonne);
        unAcces.role =  await roleDAO.getByRole(idRole);

        return unAcces;
    }
    public async getPermissionsByPersonne(idCompte: string): Promise<Array<Permission>> {

        let lesPerm = await this.getAll();
        lesPerm= lesPerm.filter(elt => elt.personne.idCompte===idCompte)
        return lesPerm;  
    }

    public async getBatimentByPersonne(idCompte: string): Promise<Array<Batiment>> {

        const lesPerm = await this.getPermissionsByPersonne(idCompte);
        const accesDAO= new AccesDAO();
        
        const data:Batiment[]= await accesDAO.getBatimentByPermissions(lesPerm);
        
        return data;  
    }
    
    public async getByPersonne(idCompte: string): Promise<Array<Role>> {

        const lesPermissions = await this.getAll();
        const lesRoles=[]

        for(const permission of lesPermissions){
            
            if(permission.personne.idCompte===idCompte){
                
                lesRoles.push(permission.role);
            }
        }
        return lesRoles
    }

    public async getByRole(idRole: string): Promise<Array<Permission>> {

        let lesEtages = await this.getAll();
        lesEtages= lesEtages.filter(elt => elt.role.idRole===idRole)
        return lesEtages;  
    }

    public async existe(idRole: string, idPersonne : string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch +  idRole+"/" + idPersonne));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( permission : Permission ) {
        const existe= await this.existe(permission.role.idRole,permission.personne.idCompte);
        if( !existe ){
            const newPermRef = ref(this.db, this.branch+permission.role.idRole+"/"+permission.personne.idCompte);

            const permData={
                valeur : permission.valeur
            }
            await set(newPermRef, permData);
        }else{
            throw new Error("Reservation déjà existante")
        }
    }

    async update( permission : Permission ) {
        const newPermRef = ref(this.db, this.branch+permission.role.idRole+"/"+permission.personne.idCompte);

        const permData={
            valeur : permission.valeur
        }
        

        await update(newPermRef, permData);
    }

    async updateTab( personne : Personne, lesRoles : string[] ) {
        

        for(const r of lesRoles){
            const role= new Role(r);
            const existe=await this.existe(role.idRole,personne.idCompte);

            if(!existe){
                const permission= new Permission(role,personne,true)
                await this.ajout(permission)
            } 
        }

        //supprimer ceux qui ne sont plus dans le tableau
        let byPersonne = await this.getPermissionsByPersonne(personne.idCompte);
        byPersonne=byPersonne.filter(elt => !lesRoles.includes(elt.role.idRole))

        for(const perm of byPersonne){
            await this.supprimer(perm);
        }
    }

    async supprimer(permission : Permission) {
        if(permission.personne.idCompte.trim()!="" && permission.role.idRole.trim()!="" ){
            const permissionRef = ref(this.db, this.branch+permission.role.idRole+"/"+permission.personne.idCompte);
            await remove(permissionRef);
        }else{
            throw new Error("Suppression impossible");
        }
    }
    
}