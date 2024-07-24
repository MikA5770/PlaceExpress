import { Place } from "../class/Place";
import { Connexion } from "./connexion";
import { EtageDAO } from "./EtageDAO";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove, push  } from 'firebase/database';
import { ReservationDAO } from "./ReservationDAO";

export class PlaceDAO{
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Place/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private async snapshotDePlace(snapshot: DataSnapshot): Promise<Place> {
        const etageDAO = new EtageDAO()
        const value = snapshot.val();
        const place = new Place();

        place.idPlace = snapshot.key ?? '';

        place.etage= await etageDAO.getByEtage(value.idEtage)
        place.hauteur=value.hauteur
        place.largeur=value.largeur
        place.libellePlace=value.libellePlace
        place.x=value.x
        place.y=value.y

        return place;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Place>> {
        const snapshot = await this.onValuePromise(requete);
        let data: Array<Place> = [];

        const promises : Promise<Place>[]= [];

        snapshot.forEach((childSnapshot) => {
            promises.push(this.snapshotDePlace(childSnapshot));
        });

        data = await Promise.all(promises);

    return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Place> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return await this.snapshotDePlace(snapshot);
        } else {
            throw new Error("Place vide");
        }
    }

    public getAll(): Promise<Array<Place>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByPlace(idPlace: string): Promise<Place> {

        const unePlace = await this.loadQueryOneResult(ref(this.db, this.branch + idPlace));
        unePlace.idPlace = idPlace;

        return unePlace;
    }
    public async getByEtage(idEtage: string): Promise<Array<Place>> {

        let lesPlaces = await this.getAll();
        lesPlaces = lesPlaces.filter(elt => elt.etage.idEtage===idEtage);
        return lesPlaces;
        
    }

    public async existe(idPlace: string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch + idPlace));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( place : Place ) {
            const newPlaceRef = push(ref(this.db, this.branch));
            const placeData={
                hauteur : place.hauteur,
                idEtage : place.etage.idEtage,
                largeur : place.largeur,
                libellePlace : place.libellePlace,
                x : place.x,
                y : place.y,
            }
            await set(newPlaceRef, placeData);
    }
    async ajouterToutes(place : Array<{ place : Place, changementNom : boolean}>) {
        for(const p of place){
            await this.ajout(p.place);
        }
    }
    
    async update( place : Place ) {
        const placeRef = ref(this.db, this.branch + place.idPlace);

        const placeData={
            hauteur : place.hauteur,
            idEtage : place.etage.idEtage,
            largeur : place.largeur,
            libellePlace : place.libellePlace,
            x : place.x,
            y : place.y,
        }
        await update(placeRef, placeData);
    }
    async updateToutes(place : Array<{ place : Place , changementNom : boolean}>, idEtage : string) {
        const placeParEtage=await this.getByEtage(idEtage);

        const lesPlaceParEtageId=placeParEtage.map(elt => elt.idPlace);

        const lesPlaceId=place.map(elt => elt.place.idPlace);


        for(const p of place){ // pour l'ajouter ou modifier
            if( lesPlaceParEtageId.includes(p.place.idPlace) ){
                await this.update(p.place);
            }else{
                await this.ajout(p.place);
            }
        }

        for(const p of placeParEtage){ // pour  supprimer 
            if( !lesPlaceId.includes(p.idPlace)){
                await this.supprimer(p);
            }
        }


    }

    async supprimer(place : Place) {
        if(place.idPlace.trim()!=""){
            const reservationDAO= new ReservationDAO();
            const lesReservations = await reservationDAO.getByPlace(place.idPlace);
            for(const res of lesReservations){
                await reservationDAO.supprimer(res);
            }


            const placeRef = ref(this.db, this.branch + place.idPlace);
            await remove(placeRef);
        }else{
            throw new Error("id vide ");
        }
    }

 

    async nombre() : Promise<number> {
        const place = await this.getAll();
        return place.length;
    }
    
}