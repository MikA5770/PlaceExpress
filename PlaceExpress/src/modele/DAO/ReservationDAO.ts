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
            throw new Error("Reservation vide");
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

    public async getByBatiment(idBatiment: string): Promise<Array<Reservation>> {

        let  lesReservation = await this.loadQuery(ref(this.db, this.branch));
        lesReservation = lesReservation.filter(elt => elt.place.etage.batiment.idBatiment===idBatiment);
        return lesReservation; 
    }

    public async getByEtage(idEtage: string): Promise<Array<Reservation>> {

        let  lesReservation = await this.loadQuery(ref(this.db, this.branch));
        lesReservation = lesReservation.filter(elt => elt.place.etage.idEtage===idEtage);
        return lesReservation; 
    }
    public async getByPlace(idPlace: string): Promise<Array<Reservation>> {

        let  lesReservation = await this.getAll();
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

        //abonnement regarder les disponibilités par rapport aux anciennes valeur et envoyer des mails 
    }

    async supprimer(reservation : Reservation) {
        if(reservation.dateRes.trim()!="" && reservation.place.etage.idEtage.trim()!="" ){
            const reservationRef = ref(this.db, this.branch +reservation.place.idPlace+"/"+reservation.dateRes);
            await remove(reservationRef);

            //abonnement regarder les disponibilitées par rapport aux anciennes valeur et envoyer des mails si plein
        }else{
            throw new Error("Suppression impossible");
        }
    }
    ajrd( lesReservation : Reservation[],date : Date= new Date() ): Array<Reservation> { // si on met pas de date c'est celle du jour

        date.setHours(0, 0, 0, 0);
        lesReservation = lesReservation.filter(elt =>  
        {
            const [jour, mois, annee] = elt.dateRes.split("-");
            const dateReservation=new Date(mois+"/"+jour+"/"+annee);
            
            if(dateReservation.getTime() === date.getTime()){
                return elt
            }
        });
        return lesReservation;
    }

    async getByJour( date : Date= new Date() ): Promise<Array<Reservation>> { // si on met pas de date c'est celle du jour

        const lesReservation = await this.getAll();
        return this.ajrd(lesReservation,date);
    }


    public async getByJourByBatiment(idBatiment: string,date : Date= new Date()): Promise<Array<Reservation>> {
        const lesReservation = await this.getByBatiment(idBatiment);
        return this.ajrd(lesReservation,date);
    }

    public async getPleinByJourByBatiment(idBatiment: string,date : Date= new Date()): Promise<boolean> {
        const placeDAO = new PlaceDAO()
        const lesReservation = await this.getByJourByBatiment(idBatiment,date);
        const lesPlaces = await placeDAO.getByBatiment(idBatiment);

        return lesReservation.length===lesPlaces.length;
    }

    public async getByJourByEtage(idEtage: string,date : Date= new Date()): Promise<Array<Reservation>> {
        const lesReservation = await this.getByEtage(idEtage);
        return this.ajrd(lesReservation,date);
    }

    public async getByJourByPlace(idPlace: string,date : Date= new Date()): Promise<Array<Reservation>> {
        const lesReservation = await this.getByPlace(idPlace);
        return this.ajrd(lesReservation,date);
    }

    public async getByJourByPersonne(idCompte: string,date : Date= new Date()): Promise<Array<Reservation>> {
        const lesReservation = await this.getByPersonne(idCompte);
        return this.ajrd(lesReservation,date);
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

    public async reservationMoisbyBatiment (idBatiment : string): Promise<Reservation[]> { // sur le dernier mois en cours

        const lesReservation = (await this.reservationMois()).filter(elt => elt.place.etage.batiment.idBatiment===idBatiment)
        return lesReservation;
        
    }

    public async reservationMoisbyEtage (idEtage : string): Promise<Reservation[]> { // sur le dernier mois en cours

        const lesReservation = (await this.reservationMois()).filter(elt => elt.place.etage.idEtage===idEtage)
        return lesReservation;
        
    }

    public async nombreUtilisateurActif(lesReservation : Reservation[]): Promise<number> { // sur le dernier mois en cours

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

    public async nombreUtilisateurActifTotal(): Promise<number> { // sur le dernier mois en cours

        const lesReservation = await this.reservationMois();

        const compteur= await this.nombreUtilisateurActif(lesReservation);
        return compteur; 
    }

    public async nombreUtilisateurActifbyBatiment(idBatiment : string): Promise<number> { // sur le dernier mois en cours

        const lesReservation = await this.reservationMoisbyBatiment(idBatiment);

        const compteur= await this.nombreUtilisateurActif(lesReservation);
        return compteur; 
    }

    public async nombreUtilisateurActifbyEtage(idEtage : string): Promise<number> { // sur le dernier mois en cours

        const lesReservation = await this.reservationMoisbyEtage(idEtage);
       
        const compteur= await this.nombreUtilisateurActif(lesReservation);
        return compteur; 
    }


    async nombreDuJour(): Promise<number> {

        const lesReservation = await this.getByJour()
        return lesReservation.length;
    }

    async nombreDuJourByBatiment(idBatiment: string): Promise<number> {

        const lesReservation = await this.getByJourByBatiment(idBatiment)
        return lesReservation.length;
    }
    async nombreDuJourByEtage(idEtage: string): Promise<number> {

        const lesReservation = await this.getByJourByEtage(idEtage)
        return lesReservation.length;
    }

    async nombreDuJourByPlace(idPlace: string): Promise<number> {

        const lesReservation = await this.getByJourByPlace(idPlace)
        return lesReservation.length;
    }

    calendrier(lesReservations : Reservation[]) : Array<{date:string , count : number}> {

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

    async calendrierTout() : Promise<Array<{date:string , count : number}>> {
        const lesReservations = await this.getAll();
        return this.calendrier(lesReservations)
    }

    async calendrierByBatiment(idBatiment : string ) : Promise<Array<{date:string , count : number}>> {
        const lesReservations = await this.getByBatiment(idBatiment);
        return this.calendrier(lesReservations)
    }

    async calendrierByEtage(idEtage : string ) : Promise<Array<{date:string , count : number}>> {
        const lesReservations = await this.getByEtage(idEtage);
        return this.calendrier(lesReservations)
    }
    async calendrierByCompte(idCompte : string ) : Promise<Array<{date:string , count : number}>> {
        const lesReservations = await this.getByPersonne(idCompte);
        return this.calendrier(lesReservations)
    }

    jourDeLaSemaine(): Date[]{
        const dateJour = new Date();

        const differenceJour = dateJour.getDay();

        const datesJoursSemaine = [];

        for(let i=0;i<7;i++){  // obtenir les jours de la semaine en cours
            datesJoursSemaine.push(addDays(dateJour, i - differenceJour + 1));
        }
        return datesJoursSemaine
    }

    async semaine() : Promise<Array<{day : string, reservation : number}>>{
        const data = []
        const datesJoursSemaine=this.jourDeLaSemaine();

        for(const date of datesJoursSemaine){
            const nombreDeReservation = await this.getByJour(date);
            const jour = format(date, 'EEEE', { locale: fr });
            data.push({day : jour , reservation : nombreDeReservation.length })
        }
        return data
    }

    async semaineByBatiment(idBatiment : string) : Promise<Array<{day : string, reservation : number}>>{
        const data = []
        const datesJoursSemaine=this.jourDeLaSemaine();

        for(const date of datesJoursSemaine){
            const nombreDeReservation = await this.getByJourByBatiment(idBatiment,date);
            const jour = format(date, 'EEEE', { locale: fr });
            data.push({day : jour , reservation : nombreDeReservation.length })
        }
        return data
    }

    async semaineByEtage(idEtage : string) : Promise<Array<{day : string, reservation : number}>>{
        const data = []
        const datesJoursSemaine=this.jourDeLaSemaine();

        for(const date of datesJoursSemaine){
            const nombreDeReservation = await this.getByJourByEtage(idEtage,date);
            const jour = format(date, 'EEEE', { locale: fr });
            data.push({day : jour , reservation : nombreDeReservation.length })
        }
        return data
    }

    async semaineByPersonne(idCompte : string) : Promise<Array<{day : string, reservation : number}>>{
        const data = []
        const datesJoursSemaine=this.jourDeLaSemaine();

        for(const date of datesJoursSemaine){
            const nombreDeReservation = await this.getByJourByPersonne(idCompte,date);
            const jour = format(date, 'EEEE', { locale: fr });
            data.push({day : jour , reservation : nombreDeReservation.length })
        }
        return data
    }

    tauxRemplissage(nombrePossible: number, nombreRes:number): number { // taux sur le dernier mois ( tous les jours compris )

        const dateJour = new Date();
        const dernierJour = new Date(dateJour.getFullYear(), dateJour.getMonth(), 0).getDate();

        return parseFloat((nombreRes/ (nombrePossible*dernierJour)*100 ).toFixed(2))
    }

    async tauxRemplissageTotal(): Promise<{nouveau : number, ancien : number}> { // taux sur le dernier mois ( tous les jours compris )
        const placeDAO = new PlaceDAO();

        const lesReservation = (await this.reservationMois());
        const nombrePossible = await placeDAO.nombre();

        return {nouveau : this.tauxRemplissage(nombrePossible,lesReservation.length), 
            ancien :   this.tauxAncienMois(nombrePossible,lesReservation)
           } 
    }

    async tauxRemplissagebyBatiment(idBatiment:string): Promise<{nouveau : number, ancien : number}> { // taux sur le dernier mois ( tous les jours compris )
        const placeDAO = new PlaceDAO();

        const lesReservation = (await this.reservationMoisbyBatiment(idBatiment));
        const nombrePossible = await placeDAO.nombrebyBatiment(idBatiment);

        return {nouveau : this.tauxRemplissage(nombrePossible,lesReservation.length), 
            ancien :   this.tauxAncienMois(nombrePossible,lesReservation)
           } 
    }

    async tauxRemplissagebyEtage(idEtage:string): Promise<{nouveau : number, ancien : number}> { // taux sur le dernier mois ( tous les jours compris )
        const placeDAO = new PlaceDAO();

        const lesReservation = (await this.reservationMoisbyEtage(idEtage));
        const nombrePossible = await placeDAO.nombrebyEtage(idEtage);

        return {nouveau : this.tauxRemplissage(nombrePossible,lesReservation.length), 
                ancien :   this.tauxAncienMois(nombrePossible,lesReservation)
               } 
    }

    tauxAncienMois(nombrePossible : number,lesReservation : Reservation[]): number { // taux sur le dernier dernier mois (pour comparer )

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

        const nombreRes = lesReservation.length;

        const dernierJour = new Date(dateAncien.getFullYear(), dateAncien.getMonth(), 0).getDate();
        
        return parseFloat((nombreRes/ (nombrePossible*dernierJour)*100 ).toFixed(2))
    }

    utilisateursTrie(lesReservation:Reservation[]): {nombre : number, libelle : string}[] {
        const mapUtilisateur = new Map<string,number>();
        
        lesReservation.forEach(elt => {
            if(mapUtilisateur.has(elt.personne.mail)){
                mapUtilisateur.set(elt.personne.mail,mapUtilisateur.get(elt.personne.mail)!+1);
            }else{
                mapUtilisateur.set(elt.personne.mail,1);
            }
        })
        const data : {nombre : number, libelle : string}[]=[];

        mapUtilisateur.forEach((elt,idx) => {
            data.push({nombre : elt, libelle : idx});
        })

        data.sort((elt1, elt2) => elt2.nombre - elt1.nombre);
        return data
    }

    async reservationTrie(lesReservation:Reservation[]): Promise<{nombre : number, libelle : string}[]> {
        const mapUtilisateur = new Map<string,number>();
        
        lesReservation.forEach(elt => {
            if(mapUtilisateur.has(elt.place.idPlace)){
                mapUtilisateur.set(elt.place.idPlace,mapUtilisateur.get(elt.place.idPlace)!+1);
            }else{
                mapUtilisateur.set(elt.place.idPlace,1);
            }
        })
        const data : {nombre : number, libelle : string}[]=[];
        const placeDAO = new PlaceDAO()

        for(const element of mapUtilisateur.keys()){
            const lbl= (await placeDAO.getByPlace(element)).libellePlace
            const nbr=mapUtilisateur.get(element)
            data.push({nombre : nbr! , libelle : lbl });
        }

        data.sort((elt1, elt2) => elt2.nombre - elt1.nombre);
        return data
    }

    async placeTrie(lesReservation:Reservation[]): Promise<{horaire : string, libelle : string}[]> {
        //trier les réservations par jours

        const data=[]
        for(const element of lesReservation){
            data.push({horaire : "Le "+element.dateRes+" de "+element.heureDebut+" à "+element.heureFin , libelle : element.place.libellePlace+" - "+ element.place.etage.batiment.libelle });
        }

        return data
    }

    async utilisateursPlusPresent(): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getAll();
        lesReservation= lesReservation.filter(elt => elt.present);

        return this.utilisateursTrie(lesReservation);
    }

    async utilisateursPlusPresentByBatiment(idBatiment:string): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByBatiment(idBatiment);
        lesReservation= lesReservation.filter(elt => elt.present);

        return this.utilisateursTrie(lesReservation);
    }

    async utilisateursPlusPresentByEtage(idEtage:string): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByEtage(idEtage);
        lesReservation= lesReservation.filter(elt => elt.present);

        return this.utilisateursTrie(lesReservation);
    }

    async utilisateursPlusAbsent(): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getAll();
        lesReservation= lesReservation.filter(elt => !elt.present);

        return this.utilisateursTrie(lesReservation);
    }

    async utilisateursPlusAbsentByBatiment(idBatiment:string): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByBatiment(idBatiment);
        lesReservation= lesReservation.filter(elt => !elt.present);

        return this.utilisateursTrie(lesReservation);
    }

    async utilisateursPlusAbsentByEtage(idEtage:string): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByEtage(idEtage);
        lesReservation= lesReservation.filter(elt => !elt.present);

        return this.utilisateursTrie(lesReservation);
    }

    async nombreAbsence(idCompte:string): Promise<number> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByPersonne(idCompte);
        lesReservation= lesReservation.filter(elt => !elt.present);

        return lesReservation.length
    }

    async nombreReservation(idCompte:string): Promise<number> { // taux sur le dernier mois ( tous les jours compris )
        const lesReservation=await this.getByPersonne(idCompte);

        return lesReservation.length
    }

    async placesDiff(idCompte:string): Promise<number> { // taux sur le dernier mois ( tous les jours compris )
        const lesReservation=await this.getByPersonne(idCompte);

        let compteur=0;
        const mapUtilisateur = new Map<string,number>();

        lesReservation.forEach(elt => {
            if(!mapUtilisateur.has(elt.place.idPlace)){
                compteur++;
                mapUtilisateur.set(elt.place.idPlace,1);
            }
        })


        return compteur
    }

    async placesFrequentes(idCompte:string): Promise<{nombre : number, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        const lesReservation=await this.getByPersonne(idCompte);

        return this.reservationTrie(lesReservation);
    }

    async heurePresence(idCompte:string): Promise<number> { // taux sur le dernier mois ( tous les jours compris )
        const lesReservation=await this.getByPersonne(idCompte);
        let heurePresence=0;

        lesReservation.forEach(elt =>{
            const heureDebut=elt.heureDebut.split(":");
            const heureFin=elt.heureFin.split(":");

            heurePresence+= Number(heureFin[0])+(Number(heureFin[1])/60) - Number(heureDebut[0])+(Number(heureDebut[1])/60)
            
        })

        return heurePresence;
    }

    async ancienneReservation(idCompte:string): Promise<{horaire : string, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByPersonne(idCompte);
        lesReservation=lesReservation.filter(elt => {
            const [jour, mois, annee] = elt.dateRes.split('-').map(Number);
            const dateProchain= new Date(annee, mois - 1, jour );
            const ajrd = new Date();

            if(Number(dateProchain<ajrd)){
                return elt
            }
        })

        return this.placeTrie(lesReservation);
    }

    async prochaineReservation(idCompte:string): Promise<{horaire : string, libelle : string}[]> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByPersonne(idCompte);
        lesReservation=lesReservation.filter(elt => {
            const [jour, mois, annee] = elt.dateRes.split('-').map(Number);
            const dateProchain= new Date(annee, mois - 1, jour );
            const ajrd = new Date();

            if(Number(dateProchain>ajrd)){
                return elt
            }
        })

        return this.placeTrie(lesReservation);
    }

    async reservationEnCours(idCompte:string): Promise<Reservation> { // taux sur le dernier mois ( tous les jours compris )
        let lesReservation=await this.getByPersonne(idCompte);
        lesReservation=lesReservation.filter(elt => {
            const [jour, mois, annee] = elt.dateRes.split('-').map(Number);
            const dateProchain= new Date(annee, mois - 1, jour );
            const ajrd = new Date();

            if(Number(dateProchain===ajrd)){
                return elt
            }
        })
        lesReservation.push(new Reservation())

        return lesReservation[0];
    }
}