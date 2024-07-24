import { Reservation } from "../class/Reservation";
import { Connexion } from "./connexion";
import { PlaceDAO } from "./PlaceDAO";
import { PersonneDAO } from "./PersonneDAO";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove  } from 'firebase/database';
import { Place } from "../class/Place";
import { Personne } from "../class/Personne";

import { addDays,format } from 'date-fns';
import { fr } from 'date-fns/locale';

export class ReservationDAO{
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Reservation/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private async snapshotDeReservation(snapshot: DataSnapshot): Promise<Reservation> {
        const placeDAO = new PlaceDAO();
        const personneDAO = new PersonneDAO();
        const value = snapshot.val();
        const reservation = new Reservation();

        reservation.dateRes = snapshot.key ?? '';

        const idPlace=snapshot.ref.parent?.key;
        reservation.place = idPlace!=null ? await placeDAO.getByPlace(idPlace) : new Place();

        reservation.commentaire=value.commentaire

        const existe= await personneDAO.existe(value.idPersonne);
        if(existe)
            reservation.personne = await personneDAO.getByPersonne(value.idPersonne);
        else{
            reservation.personne = new Personne(value.idPersonne);
        }

        reservation.heureDebut=value.heureDebut
        reservation.heureFin=value.heureFin
        reservation.present=value.present

        return reservation;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Reservation>> {
        const snapshot = await this.onValuePromise(requete);
        let data: Array<Reservation> = [];

        const promises : Promise<Reservation>[]= [];

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach(child => {
                promises.push(this.snapshotDeReservation(child));
            })
        });

        data = await Promise.all(promises);

    return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Reservation> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return await this.snapshotDeReservation(snapshot);
        } else {
            throw new Error("Resultat vide");
        }
    }

    public getAll(): Promise<Array<Reservation>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getByReservation(idPlace: string,dateReservation : string ): Promise<Reservation> {
        const placeDAO = new PlaceDAO();

        const uneReservation = await this.loadQueryOneResult(ref(this.db, this.branch + idPlace+"/" + dateReservation));
        uneReservation.place = await placeDAO.getByPlace(idPlace);
        uneReservation.dateRes = dateReservation;

        return uneReservation;
    }

    public async getByPersonne(idPersonne: string): Promise<Array<Reservation>> {

        let lesReservation = await this.loadQuery(ref(this.db, this.branch));
        lesReservation = lesReservation.filter(elt => elt.personne.idCompte===idPersonne);
        return lesReservation; 
    }

    public async getByEtage(idEtage: string): Promise<Array<Reservation>> {

        let  lesReservation = await this.loadQuery(ref(this.db, this.branch));
        lesReservation = lesReservation.filter(elt => elt.place.etage.idEtage===idEtage);
        return lesReservation; 
    }
    public async getByPlace(idPlace: string): Promise<Array<Reservation>> {

        let  lesReservation = await this.loadQuery(ref(this.db, this.branch));
        lesReservation = lesReservation.filter(elt => elt.place.idPlace===idPlace);
        return lesReservation; 
    }



    public async existe(idPlace: string, dateReservation : string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch +  idPlace+"/" + dateReservation));
            return true;
        } catch (e) {
            return false;
        }
    }

    async ajout( reservation : Reservation ) {
        const existe= await this.existe(reservation.place.idPlace, reservation.dateRes);
        if( !existe ){
            const newReservationRef = ref(this.db, this.branch+reservation.place.idPlace+"/"+reservation.dateRes);

            const reservationData={
                idPersonne : reservation.personne.idCompte,
                commentaire : reservation.commentaire,
                heureDebut : reservation.heureDebut,
                heureFin : reservation.heureFin,
                present : reservation.present,
            }
            await set(newReservationRef, reservationData);
        }else{
            throw new Error("Reservation déjà existante")
        }
    }

    async update( reservation : Reservation ) {
        const reservationRef = ref(this.db, this.branch +reservation.place.idPlace+"/"+reservation.dateRes);

        const reservationData={
            idPersonne : reservation.personne.idCompte,
            commentaire : reservation.commentaire,
            heureDebut : reservation.heureDebut,
            heureFin : reservation.heureFin,
            present : reservation.present,
        }

        await update(reservationRef, reservationData);
    }

    async supprimer(reservation : Reservation) {
        if(reservation.dateRes.trim()!="" && reservation.place.etage.idEtage.trim()!="" ){
            const reservationRef = ref(this.db, this.branch +reservation.place.idPlace+"/"+reservation.dateRes);
            await remove(reservationRef);
        }else{
            throw new Error("Suppression impossible");
        }
    }

    async getByJour( date : Date= new Date() ): Promise<Array<Reservation>> { // si on met pas de date c'est celle du jour

        let lesReservation = await this.loadQuery(ref(this.db, this.branch));

        const jour= date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        const dateString = jour+"-"+(date.getMonth()+1)+"-"+date.getFullYear();

        lesReservation = lesReservation.filter(elt =>  elt.dateRes === dateString );
        return lesReservation;
    }


    public async getByBatimentAjrd(idBatiment: string): Promise<Array<Reservation>> {

        let  lesReservation = await this.loadQuery(ref(this.db, this.branch));
        const dateDuJour: Date = new Date();

        const jour= dateDuJour.getDate()<10 ? "0"+dateDuJour.getDate() : dateDuJour.getDate();
        const date = jour+"-"+(dateDuJour.getMonth()+1)+"-"+dateDuJour.getFullYear();

        lesReservation = lesReservation.filter(elt => {
            if(elt.place.etage.batiment.idBatiment === idBatiment && elt.dateRes===date){
                
                return elt
            } 
        });

        return lesReservation; 
    }

    public async reservationMois(): Promise<Reservation[]> { // sur le dernier mois en cours

        let  lesReservation = await this.getAll();
        const dateDuJour: Date = new Date();
        dateDuJour.setMonth(dateDuJour.getMonth() - 1 );

        lesReservation = lesReservation.filter(elt => {
            const datePartie = elt.dateRes.split('-');

            const annee = parseInt(datePartie[2], 10);
            const mois = parseInt(datePartie[1], 10) - 1;
            const jour = parseInt(datePartie[0], 10);

            const dateObject = new Date(annee, mois, jour);

            return dateDuJour.getTime() <= dateObject.getTime();
        });

    
        return lesReservation; 
    }


    public async nombreUtilisateurActif(): Promise<number> { // sur le dernier mois en cours

        const lesReservation = await this.reservationMois();

        let compteur=0;
        const mapUtilisateur = new Map<string,number>();

        lesReservation.forEach(elt => {
            if(!mapUtilisateur.has(elt.personne.idCompte)){
                compteur++;
                mapUtilisateur.set(elt.personne.idCompte,1);
            }
        })

        return compteur; 
    }


    async nombreDuJour(): Promise<number> {

        const lesReservation = await this.getByJour()
        return lesReservation.length;
    }

    async nombreDuJourByBatiment(idBatiment: string): Promise<number> {

        const lesReservation = await this.getByBatimentAjrd(idBatiment)
        return lesReservation.length;
    }

    async calendrier() : Promise<Array<{date:string , count : number}>> {
        const lesReservations = await this.getAll();
        const mapData = new Map<string,number>();

        lesReservations.forEach(elt => {
            if(mapData.has(elt.dateRes)){
                mapData.set(elt.dateRes,mapData.get(elt.dateRes)!+1);
            }else{
                mapData.set(elt.dateRes,1);
            }
        });
        
        const data : Array<{date:string , count : number}> = [];

        mapData.forEach((elt,idx) => {
            const datePartie = idx.split('-');
            const unJour= datePartie[2]+"-"+datePartie[1]+"-"+datePartie[0]
            data.push({date:unJour , count : elt})
        })

        return data;
    }

    async semaine() : Promise<Array<{day : string, reservation : number}>>{
        const dateJour = new Date();

        const differenceJour = dateJour.getDay();

        const datesJoursSemaine = [];

        for(let i=0;i<7;i++){  // obtenir les jours de la semaine en cours
            datesJoursSemaine.push(addDays(dateJour, i - differenceJour + 1));
        }
    
        const data = []
        for(const date of datesJoursSemaine){
            const nombreDeReservation = await this.getByJour(date);
            const jour = format(date, 'EEEE', { locale: fr });
            data.push({day : jour , reservation : nombreDeReservation.length })
        }

        return data
    }

    async tauxRemplissage(): Promise<number> { // taux sur le dernier mois ( tous les jours compris )
        const placeDAO = new PlaceDAO();

        const lesReservation = await this.reservationMois();
        const nombreRes = lesReservation.length;
        const nombrePossible = await placeDAO.nombre();

        const dateJour = new Date();
        const dernierJour = new Date(dateJour.getFullYear(), dateJour.getMonth(), 0).getDate();

        return parseFloat((nombreRes/ (nombrePossible*dernierJour)*100 ).toFixed(2))
    }

    async tauxAncienMois(): Promise<number> { // taux sur le dernier dernier mois (pour comparer )
        let  lesReservation = await this.getAll();
        const dateDuJour: Date = new Date();
        dateDuJour.setMonth( dateDuJour.getMonth() - 1 );
        const dateAncien: Date = new Date();
        dateDuJour.setMonth( dateDuJour.getMonth() - 2 );

        lesReservation = lesReservation.filter(elt => {
            const datePartie = elt.dateRes.split('-');

            const annee = parseInt(datePartie[2], 10);
            const mois = parseInt(datePartie[1], 10) - 1;
            const jour = parseInt(datePartie[0], 10);

            const dateObject = new Date(annee, mois, jour);

            return dateAncien.getTime() <= dateObject.getTime() && dateObject.getTime() <= dateDuJour.getTime();
        });

        const placeDAO = new PlaceDAO();
        
        const nombreRes = lesReservation.length;
        const nombrePossible = await placeDAO.nombre();

        const dernierJour = new Date(dateAncien.getFullYear(), dateAncien.getMonth(), 0).getDate();
        
        return parseFloat((nombreRes/ (nombrePossible*dernierJour)*100 ).toFixed(2))
    }

}