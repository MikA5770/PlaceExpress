import { Header } from "../../src/vue/header/Header.tsx"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { ref, getDownloadURL } from 'firebase/storage';

import {ReservationDAO} from '../../src/modele/DAO/ReservationDAO.ts'
import { Reservation } from "../../src/modele/class/Reservation.ts";

import '../style/mesRes.css';
import { Utilisateur } from "../modele/DAO/Utilisateur.ts";
import { Connexion } from "../modele/DAO/connexion.ts";

export function MesReservations() {
  const co = Connexion.getInstance();
  const utilisateur = new Utilisateur();
  const [user] = useAuthState(utilisateur.getAuth());

  const reservationDAO = new ReservationDAO();

  const idPersonne = user?.uid;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const recupReservations = async () => {
      try {
        if (idPersonne) {  
          const reservationsData = await reservationDAO.getByPersonne(idPersonne);
          setReservations(reservationsData);
        }
      } catch (erreur) {
        console.error("Une erreur s'est produite : ", erreur);
      }
    };

    recupReservations();

  }, []);

  

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = await Promise.all(reservations.map(reservation => downloadImageForReservation(reservation)));
      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [reservations]);

  const downloadImageForReservation = async (reservation: Reservation) => {
    try {
      const imagePath = `gs://proj-reservation-places.appspot.com/imageBatiment/${reservation.place.etage.batiment.idImage}`;
      const imageRef = ref(co.getStorageInstance(), imagePath);
  
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      return ''; // ou une URL de repli
    }
  };


  const handleDeleteReservation = async (reservation: Reservation, index : number) => {
    index++;
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer la réservation n°"+ index +" ?");
    if (isConfirmed) {
      try {
        await reservationDAO.supprimer(reservation);
        setReservations(prevReservations => prevReservations.filter((_, i) => i !== index - 1));// supprime la reservation qui vient detre supprimée de reseravtions en filtrant les reservations qui ont un index différent de celui de la reservation supprimée et en gardant les autres
      } catch (error) {
        console.error("Erreur lors de la suppression de la réservation : ", error);
      }
    }
  };
  
  

  return (
    <div>
      <Header page="mesReservation" />

      {reservations.length === 0 ? (
        <p className="zeroRes">Vous n'avez aucune réservation de faite.</p>
      ) : (
      <ul className="reservations">
        {reservations.map((reservation : Reservation, index: number) => (
          

         
          <li key={index} className="reservation">

            <div className="numRes_mod_supp">
              <h2 className="reservation-id">Réservation #{index + 1}</h2>
              <a href="#" className="sup-res" onClick={() => handleDeleteReservation(reservation, index)}>
                Supprimer
              </a>
              <a href="#" className="modif-res">
                Modifier
              </a>
            </div>

            <div className="Info_res">
              
              <div className="Bat_Ad_Etage_Place">
                <img style={{ width: "40%" }} src={imageUrls[index]} alt="imgBat" className="reservation-batImg"></img>
                <p className="reservation-bat">Bâtiment: {reservation.place.etage.batiment.libelle}</p>
                <p className="reservation-bat">Adresse: {reservation.place.etage.batiment.adresse}</p>

                <p className="reservation-bat">
                Etage: {reservation.place.etage.numeroEtage == 0
                      ? "Rez-De-Chaussée"
                      : reservation.place.etage.numeroEtage == 1
                      ? reservation.place.etage.numeroEtage + "er étage"
                      : reservation.place.etage.numeroEtage + "eme étage"}
                </p>

                <p className="reservation-place">Place: {reservation.place.libellePlace} </p>
              </div>

              <div className="comm_date_heure">  
                <p className="reservation-commentaire">Commentaire: {reservation.commentaire}</p>
                <p className="reservation-date">Date: {reservation.dateRes}</p>
                <p className="reservation-heure">Heure de début: {reservation.heureDebut}</p>
                <p className="reservation-heure">Heure de fin: {reservation.heureFin}</p>
              </div>

            </div>
          </li>
          
        ))}
      </ul>
  )}
    </div>
  );
}