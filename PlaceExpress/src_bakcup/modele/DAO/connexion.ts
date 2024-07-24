import { initializeApp,deleteApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Database, getDatabase } from "firebase/database";
import { FirebaseStorage, getStorage } from "firebase/storage";




export class Connexion {
    private static instance: Connexion | null = null;
    private app;
    private db: Database;
    private storage: FirebaseStorage;
    private auth: Auth;

    private constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyDam9O657_FzmKfQ7SNy83FGBv2be4HH3o",
            authDomain: "proj-reservation-places.firebaseapp.com",
            databaseURL: "https://proj-reservation-places-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "proj-reservation-places",
            storageBucket: "proj-reservation-places.appspot.com",
            messagingSenderId: "215295503570",
            appId: "1:215295503570:web:fcb4f09d67c354c2de910b"
          };

        this.app = initializeApp(firebaseConfig);
        this.db = getDatabase(this.app);
        this.storage=getStorage();
        this.auth= getAuth(this.app);
    }

    public static getInstance(): Connexion {
        if (!Connexion.instance) {
            Connexion.instance = new Connexion();
        }

        return Connexion.instance;
    }

    public getDatabaseInstance(): Database {
        return this.db;
    }

    public getStorageInstance(): FirebaseStorage {
        return this.storage;
    }

    public getAuth(): Auth {
        
        return this.auth;
    }

    public closeConnection(): void {
        deleteApp(this.app);
    }
}