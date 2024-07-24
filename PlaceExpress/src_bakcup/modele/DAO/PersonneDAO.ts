import { Personne } from "../class/Personne";
import { Connexion } from "./connexion";

import { ref, Database, onValue, DatabaseReference, DataSnapshot,set,update,remove  } from 'firebase/database';

export class PersonneDAO {
    private db: Database;
    private connexion: Connexion;
    private branch: string;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.db = this.connexion.getDatabaseInstance();
        this.branch = "Personne/";
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    private snapshotDePersonne(snapshot: DataSnapshot): Personne {
        const value = snapshot.val();
        const personne = new Personne();

        personne.idCompte = snapshot.key ?? '';

        personne.dateInscription = value.dateInscription;
        personne.idPhotoProfil = value.idPhotoProfil;
        personne.mail = value.mail;
        personne.nom = value.nom;
        personne.prenom = value.prenom;
        personne.pseudo = value.pseudo;
        personne.telephone = value.telephone;
        personne.estAdministrateur = value.estAdministrateur;

        return personne;
    }

    private onValuePromise(requete: DatabaseReference): Promise<DataSnapshot> {
        return new Promise((resolve, reject) => {
            onValue(requete, resolve, reject);
        });
    }

    private async loadQuery(requete: DatabaseReference): Promise<Array<Personne>> {
        const snapshot = await this.onValuePromise(requete);
        const data: Array<Personne> = [];

        snapshot.forEach((childSnapshot) => {
            const personne = this.snapshotDePersonne(childSnapshot);
            data.push(personne);
        });
        return data;
    }

    private async loadQueryOneResult(requete: DatabaseReference): Promise<Personne> {
        const snapshot = await this.onValuePromise(requete);

        if (snapshot.exists()) {
            return this.snapshotDePersonne(snapshot);
        } else {
            throw new Error("vide");
        }
    }

    public getAll(): Promise<Array<Personne>> {
        return this.loadQuery(ref(this.db, this.branch));
    }

    public async getLesAdmin(): Promise<Array<Personne>> {

        let lesPersonnes = await this.getAll();

        lesPersonnes=lesPersonnes.filter(elt => elt.estAdministrateur);

        return lesPersonnes;
    }
    public async getByDebutEmail(saisie: string): Promise<Array<Personne>> {

        let lesPersonnes = await this.getAll();

        lesPersonnes=lesPersonnes.filter(elt => elt.mail.startsWith(saisie));

        return lesPersonnes;
    }

    public async existe(idPersonne: string): Promise<boolean> {
        try {
            await this.loadQueryOneResult(ref(this.db, this.branch + idPersonne));
            return true;
        } catch (e) {
            return false;
        }
    }

    public async estAdministrateur(idPersonne: string): Promise<boolean> {
        try {
            const resultat = await this.loadQueryOneResult(ref(this.db, this.branch + idPersonne));
            return resultat.estAdministrateur;
        } catch (e) {
            return false;
        }
    }

    public async getByPersonne(idPersonne: string): Promise<Personne> {

        const unePersonne = await this.loadQueryOneResult(ref(this.db, this.branch + idPersonne));
        unePersonne.idCompte = idPersonne;

        return unePersonne;
    }

    async ajout( personne : Personne ) {
        const existe = await this.existe(personne.idCompte)
        if(existe){
            throw new Error("Le compte existe déjà")
        }

            const newPersonneRef = ref(this.db, this.branch + personne.idCompte);

            const personneData={
                dateInscription: Date.now(),
                idPhotoProfil: personne.idPhotoProfil,
                mail: personne.mail,
                nom: personne.nom,
                prenom: personne.prenom,
                pseudo: personne.pseudo,
                telephone:personne.telephone,
                estAdministrateur: personne.estAdministrateur,
            }
            await set(newPersonneRef, personneData);
        
    }

    async update(personne : Personne) {
        const personneRef = ref(this.db, this.branch + personne.idCompte);

        const personneData={
            dateInscription: Date.now(),
            idPhotoProfil: personne.idPhotoProfil,
            mail: personne.mail,
            nom: personne.nom,
            prenom: personne.prenom,
            pseudo: personne.pseudo,
            telephone:personne.telephone,
            estAdministrateur: personne.estAdministrateur,
        }

        await update(personneRef, personneData);
    }

    async supprimer(personne : Personne) {
        const personneRef = ref(this.db, this.branch + personne.idCompte);
        await remove(personneRef);
    }
    
}