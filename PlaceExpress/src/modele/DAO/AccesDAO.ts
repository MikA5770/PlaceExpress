import { Acces } from "../class/Acces";
import { Connexion } from "./connexion";

import { RoleDAO } from "./RoleDAO";
import { Role } from "../class/Role";
import { BatimentDAO } from "./BatimentDAO";
import { Batiment } from "../class/Batiment";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove  } from 'firebase/database';
import { Permission } from "../class/Permission";


export class AccesDAO{
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Acces/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private async snapshotDeAcces(snapshot: DataSnapshot): Promise<Acces> {
        const roleDAO = new RoleDAO();
        const batimentDAO = new BatimentDAO();
        const value = snapshot.val();
        const acces = new Acces();

        acces.batiment = snapshot.key!=null ? await batimentDAO.getByBatiment(snapshot.key) : new Batiment();

        const idRole=snapshot.ref.parent?.key;
        acces.role = idRole!=null ? await roleDAO.getByRole(idRole) : new Role();

        acces.dateDebutAcces=value.dateDebutAcces

        return acces;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Acces>> {
        const snapshot = await this.onValuePromise(requete);
        let data: Array<Acces> = [];

        const promises : Promise<Acces>[]= [];

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach(child => {
                promises.push(this.snapshotDeAcces(child));
            })
        });

        data = await Promise.all(promises);

    return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Acces> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return await this.snapshotDeAcces(snapshot);
        } else {
            throw new Error("Accès vide");
        }
    }

    public getAll(): Promise<Array<Acces>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByAcces(idRole: string,idBatiment : string ): Promise<Acces> {
        const batimentDAO = new BatimentDAO();
        const roleDAO = new RoleDAO();

        const unAcces = await this.loadQueryOneResult(ref(this.db, this.branch + idRole+"/" + idBatiment));
        unAcces.batiment = await batimentDAO.getByBatiment(idBatiment);
        unAcces.role =  await roleDAO.getByRole(idRole);

        return unAcces;
    }

    public async getByBatiment(idBatiment: string): Promise<Array<Acces>> {

        let lesEtages = await this.getAll();
        lesEtages= lesEtages.filter(elt => elt.batiment.idBatiment===idBatiment)
        return lesEtages;  
    }
    public async getAccesByRole(idRole: string): Promise<Array<Acces>> {

        let lesEtages = await this.getAll();
        lesEtages= lesEtages.filter(elt => elt.role.idRole===idRole)
        return lesEtages;  
    }

    public async getByRole(idRole: string): Promise<Array<Batiment>> {

        const lesRoles = await this.getAccesByRole(idRole);
        const lesBatiments : Batiment[] =[];

        lesRoles.forEach(acces => lesBatiments.push(acces.batiment))
        
        return lesBatiments
    }

    public async getBatimentByPermissions(lesPermission: Permission[]): Promise<Array<Batiment>> {

        const lesRoles:string[]=[];
        lesPermission.forEach(elt => {
            lesRoles.push(elt.role.idRole)
        })

        const mapAntiDoublon = new Map<string,boolean>();
        const lesAcces = await this.getAll();
        const lesBatiments : Batiment[] =[];

        lesAcces.forEach(elt =>{
            if(lesRoles.includes(elt.role.idRole) && !mapAntiDoublon.has(elt.batiment.idBatiment)){
                mapAntiDoublon.set(elt.batiment.idBatiment,true);
                lesBatiments.push(elt.batiment);
            }
        })

        return lesBatiments

    }

    

    public async existe(idRole: string, idBatiment : string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch +  idRole+"/" + idBatiment));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( acces : Acces ) {
        const existe= await this.existe(acces.role.idRole,acces.batiment.idBatiment);
        if( !existe ){
            const newAccesRef = ref(this.db, this.branch+acces.role.idRole+"/"+acces.batiment.idBatiment);

            const accesData={
                dateDebutAcces : acces.dateDebutAcces
            }
            await set(newAccesRef, accesData);
        }else{
            throw new Error("Reservation déjà existante")
        }
    }

    async ajoutTab( role : Role, bat : string[] ) {
        const dateDuJour: Date = new Date();

        const jour= dateDuJour.getDate()<10 ? "0"+dateDuJour.getDate() : dateDuJour.getDate();
        const date = jour+"-"+(dateDuJour.getMonth()+1)+"-"+dateDuJour.getFullYear();

        for(const batiment of bat){
            const b= new Batiment(batiment);
            const acces= new Acces(date,role,b)
            await this.ajout(acces)
        }
    }


    async update( acces : Acces ) {
        const newAccesRef = ref(this.db, this.branch+acces.role.idRole+"/"+acces.batiment.idBatiment);

            const accesData={
                dateDebutAcces : acces.dateDebutAcces
            }
        

        await update(newAccesRef, accesData);
    }

    async updateTab( role : Role, bat : string[] ) {
        const dateDuJour: Date = new Date();

        const jour= dateDuJour.getDate()<10 ? "0"+dateDuJour.getDate() : dateDuJour.getDate();
        const date = jour+"-"+(dateDuJour.getMonth()+1)+"-"+dateDuJour.getFullYear();

        for(const batiment of bat){
            const b= new Batiment(batiment);
            const existe=await this.existe(role.idRole,batiment);

            if(!existe){
                const acces= new Acces(date,role,b)
                await this.ajout(acces)
            } 
        }

        //supprimer ceux qui ne sont plus dans le tableau
        let byRole = await this.getAccesByRole(role.idRole);
        byRole=byRole.filter(elt => !bat.includes(elt.batiment.idBatiment))

        for(const acces of byRole){
            await this.supprimer(acces);
        }
    }

    async supprimer(acces : Acces) {
        if(acces.batiment.idBatiment.trim()!="" && acces.role.idRole.trim()!="" ){
            const accesRef = ref(this.db, this.branch+acces.role.idRole+"/"+acces.batiment.idBatiment);
            await remove(accesRef);
        }else{
            throw new Error("Suppression impossible");
        }
    }
    
}