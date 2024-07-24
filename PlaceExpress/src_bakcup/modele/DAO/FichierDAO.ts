

import { FirebaseStorage,ref,getDownloadURL,uploadBytes,deleteObject } from "firebase/storage";
import { Connexion } from "./connexion";

import { UploadFile } from 'antd/lib/upload/interface';


export class FichierDAO {
    private storage: FirebaseStorage;
    private connexion: Connexion;

    constructor() {
        this.connexion = Connexion.getInstance();
        this.storage = this.connexion.getStorageInstance();
    }

    public closeConnection(): void {
        this.connexion.closeConnection();
    }

    public async image(nom : string, dossier : string): Promise<string>{
        const imageRef = ref(this.storage, dossier+"/"+nom);
        try {
            // Obtenir l'URL de l'image
            const url = await getDownloadURL(imageRef);
            return url;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'URL de l'image :", error);
            throw error;
        }
    }

    public async ajoutFichier(value : UploadFile<File> , dossier : string){
        
        const imageRef = ref(this.storage, dossier+"/"+value.name);
        try {
            // Obtenir l'URL de l'image
            await uploadBytes(imageRef,value.originFileObj as Blob);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'image :", error);
            throw error;
        }
    }

    public async supprimer(chemin : string){
        //suppriemr avec le nom
        try {
              const imageRef = ref(this.storage, chemin);
              await deleteObject(imageRef);
            
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            throw error;
        }
    }

    
}