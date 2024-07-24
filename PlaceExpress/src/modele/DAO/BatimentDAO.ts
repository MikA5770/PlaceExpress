import { Batiment } from "../class/Batiment";
import { AccesDAO } from "./AccesDAO";
import { EtageDAO } from "./EtageDAO";
import { Connexion } from "./connexion";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove, push  } from 'firebase/database';

import { UploadFile } from 'antd/lib/upload/interface';
import { FichierDAO } from "./FichierDAO";

export class BatimentDAO {
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Batiment/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private snapshotDeBatiment(snapshot: DataSnapshot): Batiment {
        const value = snapshot.val();
        const batiment = new Batiment();

        batiment.idBatiment = snapshot.key ?? '';
        batiment.idImage = value.idImage;
        batiment.adresse = value.adresse;
        batiment.dateCreation = value.dateCreation;
        batiment.description = value.description;
        batiment.libelle = value.libelle;

        return batiment;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Batiment>> {
        const snapshot = await this.onValuePromise(requete);
        const data: Array<Batiment> = [];

        snapshot.forEach((childSnapshot) => {
            const batiment = this.snapshotDeBatiment(childSnapshot);
            data.push(batiment);
        });
        return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Batiment> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return this.snapshotDeBatiment(snapshot);
        } else {
            throw new Error("Batiment vide");
        }
    }

    public getAll(): Promise<Array<Batiment>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByBatiment(idBatiment: string): Promise<Batiment> {

        const unBatiment = await this.loadQueryOneResult(ref(this.db, this.branch + idBatiment));
        unBatiment.idBatiment = idBatiment;

        return unBatiment;
    }

    public async existe(idBatiment: string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch + idBatiment));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( batiment : Batiment ) {

            const newBatimentRef = push(ref(this.db, this.branch));
            const batimentData={
                adresse : batiment.adresse,
                dateCreation : batiment.dateCreation,
                description : batiment.description,
                libelle : batiment.libelle,
                idImage : batiment.idImage,
            }
            await set(newBatimentRef, batimentData);
    }
    async ajoutAvecFichier( batiment : Batiment, file : UploadFile<File> ) {
        const fichierDAO= new FichierDAO();

        const newBatimentRef = push(ref(this.db, this.branch));
        file.name=newBatimentRef.key+"."+file.name.split(".")[1];
        const batimentData={
            adresse : batiment.adresse,
            dateCreation : batiment.dateCreation,
            description : batiment.description,
            libelle : batiment.libelle,
            idImage : file.name,
        }
        await set(newBatimentRef, batimentData);
        await fichierDAO.ajoutFichier(file,"imageBatiment");
}

    async update( batiment : Batiment ) {
        const batimenteRef = ref(this.db, this.branch + batiment.idBatiment);

        const batimentData={
            adresse : batiment.adresse,
            dateCreation : batiment.dateCreation,
            description : batiment.description,
            libelle : batiment.libelle,
            idImage : batiment.idImage,
        }

        await update(batimenteRef, batimentData);
    }

    async updateSansFichier( batiment : Batiment ) {
        const fichierDAO= new FichierDAO();
        await fichierDAO.supprimer("imageBatiment/"+batiment.idImage);
        batiment.idImage="";

        await this.update(batiment)
    }

    async updateAvecFichier( batiment : Batiment , file : UploadFile<File>) {
        const fichierDAO= new FichierDAO();

        if(batiment.idImage!=""){
            await fichierDAO.supprimer("imageBatiment/"+batiment.idImage);
        }
        file.name=batiment.idBatiment+"."+file.name.split(".")[1];
        batiment.idImage=batiment.idBatiment+"."+file.name.split(".")[1];
        await fichierDAO.ajoutFichier(file,"imageBatiment");
       

        this.update(batiment)
    }

    

    async supprimer(batiment : Batiment) {
        if(batiment.idBatiment.trim()!=""){
            const etageDAO = new EtageDAO()
            const lesEtages= await etageDAO.getByBatiment(batiment.idBatiment);
            for(const etage of lesEtages){
                await etageDAO.supprimer(etage);
            }
            const accesDAO= new AccesDAO()
            const lesAcces = await accesDAO.getByBatiment(batiment.idBatiment)
            for(const acces of lesAcces){
                await accesDAO.supprimer(acces);
            }

            const fichierDAO= new FichierDAO();
            if(batiment.idImage!=""){
                await fichierDAO.supprimer("imageBatiment/"+batiment.idImage);
            }

            const batimenteRef = ref(this.db, this.branch + batiment.idBatiment);

            await remove(batimenteRef);

        }else{
            throw new Error("id vide ");
        }
    }

    async supprimerParId(id : string) {
        const batiment= await this.getByBatiment(id);
        this.supprimer(batiment);
    }

    async nombre() : Promise<number> {
        const batiment = await this.getAll();
        return batiment.length;
    }


    
}