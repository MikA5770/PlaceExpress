import { Permission } from "../class/Permission";
import { Connexion } from "./connexion";

import { RoleDAO } from "./RoleDAO";
import { Role } from "../class/Role";
import { PersonneDAO } from "./PersonneDAO";
import { Personne } from "../class/Personne";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove  } from 'firebase/database';


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
            throw new Error("Resultat vide");
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

    async supprimer(permission : Permission) {
        if(permission.personne.idCompte.trim()!="" && permission.role.idRole.trim()!="" ){
            const permissionRef = ref(this.db, this.branch+permission.role.idRole+"/"+permission.personne.idCompte);
            await remove(permissionRef);
        }else{
            throw new Error("Suppression impossible");
        }
    }
    
}