import { Abonnement } from "../class/Abonnement";
import { Connexion } from "./connexion";
import { Batiment } from "../class/Batiment";
import { BatimentDAO } from "./BatimentDAO";
import { Personne } from "../class/Personne";
import { PersonneDAO } from "./PersonneDAO";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove  } from 'firebase/database';

export class AbonnementDAO{
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Abonnement/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private async snapshotDeAbonnement(snapshot: DataSnapshot): Promise<Abonnement> {
        const personneDAO = new PersonneDAO();
        const batimentDAO = new BatimentDAO();
        const value = snapshot.val();
        const abonnement = new Abonnement();

        abonnement.dateAbonnement = snapshot.key!=null ? snapshot.key : " ";

        const idBatiment=snapshot.ref.parent?.key;
        abonnement.batiment = idBatiment!=null ? await batimentDAO.getByBatiment(idBatiment) : new Batiment();

        const idPersonne=snapshot.ref.parent?.parent?.key;
        abonnement.personne = idPersonne!=null ? await personneDAO.getByPersonne(idPersonne) : new Personne();

        abonnement.valeur=value.valeur

        return abonnement;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Abonnement>> {
        const snapshot = await this.onValuePromise(requete);
        let data: Array<Abonnement> = [];

        const promises : Promise<Abonnement>[]= [];

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach(child => {
                promises.push(this.snapshotDeAbonnement(child));
            })
        });

        data = await Promise.all(promises);

    return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Abonnement> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return await this.snapshotDeAbonnement(snapshot);
        } else {
            throw new Error("Abo vide");
        }
    }

    public getAll(): Promise<Array<Abonnement>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByAbonnement(idBatiment: string,idPersonne : string,date : string ): Promise<Abonnement> {
        const batimentDAO = new BatimentDAO();
        const personneDAO = new PersonneDAO();

        const unAbonnement = await this.loadQueryOneResult(ref(this.db, this.branch + idPersonne+"/" + idBatiment+"/"+date));
        unAbonnement.batiment = await batimentDAO.getByBatiment(idBatiment);
        unAbonnement.personne =  await personneDAO.getByPersonne(idPersonne);

        return unAbonnement;
    }

    public async getByBatiment(idBatiment: string): Promise<Array<Abonnement>> {

        let lesEtages = await this.getAll();
        lesEtages= lesEtages.filter(elt => elt.batiment.idBatiment===idBatiment)
        return lesEtages;  
    }


    public async existe(idPersonne: string, idBatiment : string,date:string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch +  idPersonne+"/" + idBatiment+"/"+date));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( abo : Abonnement ) {
        const existe= await this.existe(abo.personne.idCompte,abo.batiment.idBatiment,abo.dateAbonnement);
        if( !existe ){
            const newAccesRef = ref(this.db, this.branch+abo.personne.idCompte+"/"+abo.batiment.idBatiment+"/"+abo.dateAbonnement);

            const accesData={
                valeur : abo.valeur
            }
            await set(newAccesRef, accesData);
        }else{
            throw new Error("Abonnement déjà existante")
        }
    }

    async update( abo : Abonnement ) {
        const newAccesRef = ref(this.db, this.branch+abo.personne.idCompte+"/"+abo.batiment.idBatiment+"/"+abo.dateAbonnement);

            const accesData={
                valeur : abo.valeur
            }
        

        await update(newAccesRef, accesData);
    }

    async supprimer(abo : Abonnement) {
        if(abo.batiment.idBatiment.trim()!="" && abo.personne.idCompte.trim()!="" && abo.dateAbonnement.trim()!=""){
            const accesRef = ref(this.db, this.branch+abo.personne.idCompte+"/"+abo.batiment.idBatiment+"/"+abo.dateAbonnement);
            await remove(accesRef);
        }else{
            throw new Error("Suppression impossible");
        }
    }
    
}