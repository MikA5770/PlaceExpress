import { Role } from "../class/Role";
import { AccesDAO } from "./AccesDAO";
import { PermissionDAO } from "./PermissionDAO";
import { Connexion } from "./connexion";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove, push  } from 'firebase/database';

export class RoleDAO {
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Role/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private snapshotDeRole(snapshot: DataSnapshot): Role {
        const value = snapshot.val();
        const role = new Role();

        role.idRole = snapshot.key ?? '';

        role.libelle = value.libelle;
        role.color = value.color;
        

        return role;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Role>> {
        const snapshot = await this.onValuePromise(requete);
        const data: Array<Role> = [];

        snapshot.forEach((childSnapshot) => {
            const role = this.snapshotDeRole(childSnapshot);
            data.push(role);
        });
        return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Role> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return this.snapshotDeRole(snapshot);
        } else {
            throw new Error("Role vide");
        }
    }

    public getAll(): Promise<Array<Role>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByRole(idRole: string): Promise<Role> {

        const unRole = await this.loadQueryOneResult(ref(this.db, this.branch + idRole));
        unRole.idRole = idRole;

        return unRole;
    }

    public async existe(idRole: string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch + idRole));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( role : Role ) {

            const newRoleRef = push(ref(this.db, this.branch));
            const roleData={
                libelle : role.libelle,
                color : role.color,
            }
            await set(newRoleRef, roleData);
    }

    async ajoutTab( role : Role, bat : string[] ) {
        const accesDAO= new AccesDAO;

        const newRoleRef = push(ref(this.db, this.branch));
        const roleData={
            libelle : role.libelle,
            color : role.color,
        }
        await set(newRoleRef, roleData);
        role.idRole=newRoleRef.key!

        await accesDAO.ajoutTab(role,bat);
}

    async update( role : Role ) {
        const roleRef = ref(this.db, this.branch + role.idRole);

        const roleData={
            libelle : role.libelle,
            color : role.color,
        }

        await update(roleRef, roleData);
    }

    async supprimer(role : Role) {
        // supprimer les acces et les permissions associé.

        if(role.idRole.trim()!=""){
            const accesDAO = new AccesDAO()
            const lesAcces= await accesDAO.getAccesByRole(role.idRole);
            for(const acces of lesAcces){
                await accesDAO.supprimer(acces);
            }

            const permissionDAO = new PermissionDAO()
            const lesPermissions= await permissionDAO.getByRole(role.idRole);
            for(const role of lesPermissions){
                await permissionDAO.supprimer(role);
            }


            const roleRef = ref(this.db, this.branch + role.idRole);
            await remove(roleRef);

        }else{
            throw new Error("id vide ");
        }
    }
    
}