import { Etage } from "../class/Etage";
import { Connexion } from "./connexion";
import { BatimentDAO } from "./BatimentDAO";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove, push  } from 'firebase/database';
import { PlaceDAO } from "./PlaceDAO";

import { UploadFile } from 'antd/lib/upload/interface';
import { FichierDAO } from "./FichierDAO";
import { Place } from "../class/Place";

export class EtageDAO{
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Etage/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private async snapshotDeEtage(snapshot: DataSnapshot): Promise<Etage> {
        const batiment = new BatimentDAO()
        const value = snapshot.val();
        const etage = new Etage();

        etage.idEtage = snapshot.key ?? '';

        etage.batiment= await batiment.getByBatiment(value.idBatiment)
        etage.descriptionEtage=value.description
        etage.idImagePlan=value.idImagePlan
        etage.libelleEtage=value.libelleEtage
        etage.numeroEtage=value.numeroEtage

        return etage;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Etage>> {
        const snapshot = await this.onValuePromise(requete);
        let data: Array<Etage> = [];

        const promises : Promise<Etage>[]= [];

        snapshot.forEach((childSnapshot) => {
            promises.push(this.snapshotDeEtage(childSnapshot));
        });

        data = await Promise.all(promises);

    return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Etage> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return await this.snapshotDeEtage(snapshot);
        } else {
            throw new Error("Etage solo vide");
        }
    }

    public getAll(): Promise<Array<Etage>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByEtage(idEtage: string): Promise<Etage> {

        const unEtage = await this.loadQueryOneResult(ref(this.db, this.branch + idEtage));
        unEtage.idEtage = idEtage;

        return unEtage;
    }

    public async getByBatiment(idBatiment: string): Promise<Array<Etage>> {

        let lesEtages = await this.getAll();
        lesEtages= lesEtages.filter(elt => elt.batiment.idBatiment===idBatiment)
        lesEtages.sort((elt1, elt2) => elt2.numeroEtage - elt1.numeroEtage);


        return lesEtages;
    }

    public async existe(idEtage: string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch + idEtage));
            return true;
        } catch (e) {
            return false;
        }
    }
    async ajout( etage : Etage ) {

            const newEtageRef = push(ref(this.db, this.branch));
            const etageData={
                description : etage.descriptionEtage,
                idImagePlan : etage.idImagePlan,
                libelleEtage : etage.libelleEtage,
                numeroEtage : etage.numeroEtage,
                idBatiment : etage.batiment.idBatiment,
            }
            await set(newEtageRef, etageData);
    }

    async ajoutAvecPlace( etage : Etage, place : Array<{ place : Place , changementNom : boolean}> ) {

        const newEtageRef = push(ref(this.db, this.branch));
        const etageData={
            description : etage.descriptionEtage,
            idImagePlan : etage.idImagePlan,
            libelleEtage : etage.libelleEtage,
            numeroEtage : etage.numeroEtage,
            idBatiment : etage.batiment.idBatiment,
        }
        await set(newEtageRef, etageData);
        
        const placeDAO= new PlaceDAO();

        const lesPlaces= place
        lesPlaces.forEach(elt => {elt.place.etage.idEtage = newEtageRef.key! });
        placeDAO.ajouterToutes(lesPlaces)
}
    async ajoutAvecFichier( etage : Etage, file : UploadFile<File>, place : Array<{ place : Place , changementNom : boolean}> ) {
        const fichierDAO= new FichierDAO();

        const newEtageRef = push(ref(this.db, this.branch));
        file.name=newEtageRef.key+"."+file.name.split(".")[1];
        const etageData={
            description : etage.descriptionEtage,
            idImagePlan : file.name,
            libelleEtage : etage.libelleEtage,
            numeroEtage : etage.numeroEtage,
            idBatiment : etage.batiment.idBatiment,
        }
        await set(newEtageRef, etageData);
        await fichierDAO.ajoutFichier(file,"imagePlan");

        const placeDAO= new PlaceDAO();

        const lesPlaces= place
        lesPlaces.forEach(elt =>  elt.place.etage.idEtage = newEtageRef.key! );
        placeDAO.ajouterToutes(lesPlaces)
    }



    async update( etage : Etage ) {
        const etageRef = ref(this.db, this.branch + etage.idEtage);

        const etageData={
            description : etage.descriptionEtage,
            idImagePlan : etage.idImagePlan,
            libelleEtage : etage.libelleEtage,
            numeroEtage : etage.numeroEtage,
            idBatiment : etage.batiment.idBatiment,
        }

        await update(etageRef, etageData);
    }

    async updateSansFichier( etage : Etage ) {
        const fichierDAO= new FichierDAO();
        await fichierDAO.supprimer("imagePlan/"+etage.idImagePlan);

        etage.idImagePlan="";
        await this.update(etage);
    }

    async updateAvecFichier( etage : Etage , file : UploadFile<File>) {
        const fichierDAO= new FichierDAO();

        if(etage.idImagePlan!=""){
            await fichierDAO.supprimer("imagePlan/"+etage.idImagePlan);
        }
        file.name=etage.idEtage+"."+file.name.split(".")[1];
        await fichierDAO.ajoutFichier(file,"imagePlan");
        
        etage.idImagePlan=etage.idEtage+"."+file.name.split(".")[1];

        this.update(etage)
    }

    async supprimer(etage : Etage) {
        if(etage.idEtage.trim()!=""){
            const placeDAO = new PlaceDAO()
            const lesPlaces= await placeDAO.getByEtage(etage.idEtage);
            for(const place of lesPlaces){
                await placeDAO.supprimer(place);
            }
            const etageRef = ref(this.db, this.branch + etage.idEtage);
            await remove(etageRef);

            const fichierDAO= new FichierDAO();
            if(etage.idImagePlan!=""){
                await fichierDAO.supprimer("imagePlan/"+etage.idImagePlan);
            }

        }else{
            throw new Error("id vide ");
        }
    }
    async supprimerParId(id : string) {
        const etage= await this.getByEtage(id);
        this.supprimer(etage);
    }

    async nombrebyBatiment(id:string) : Promise<number> {
        const etage = (await this.getByBatiment(id));
        return etage.length;
    }
    
}