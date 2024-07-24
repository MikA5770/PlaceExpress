import { Header } from "./header/Header"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import {  getAuth } from "firebase/auth";
import {Connexion} from '../modele/DAO/connexion.ts';
import {ReservationDAO} from '../modele/DAO/ReservationDAO.ts'
import { Reservation } from "../modele/class/Reservation.ts";
import '../style/mesRes.css';
export function MesReservations() {
  /*const co = Connexion.getInstance();
  const auth =  getAuth(co.getAppInstance());
  
  const [user] = useAuthState(auth);
  const reservationDAO = new ReservationDAO();
  
  const idPersonne = user?.uid;
  const reservations = reservationDAO.getByPersonne(idPersonne!);
  const reservationsElements: Reservation[] = [];

  reservations.then((reservationS) => {
    

    for (const reservation of reservationS) {
    reservationsElements.push(
      
    );
  }
  }).catch((erreur) => {
    console.error("Une erreur s'est produite : ", erreur);
  });
  

  

  return (
    <div>
      <Header page="mesReservation"/>
      <h1>Mes réservation</h1>
     
    </div>
  );*/
  const co = Connexion.getInstance();
  const auth = getAuth(co.getAppInstance());

  const [user] = useAuthState(auth);
  const reservationDAO = new ReservationDAO();

  const idPersonne = user?.uid;
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsData = await reservationDAO.getByPersonne(idPersonne!);
        setReservations(reservationsData);
      } catch (erreur) {
        console.error("Une erreur s'est produite : ", erreur);
      }
    };

    fetchReservations();
    
  }, [idPersonne, reservationDAO]);
  

  return (
    <div>
      <Header page="mesReservation" />
      <h1>Mes réservations</h1>

      <ul className="app-container">
        {reservations.map((reservation, index) => (
          <li key={index} className="reservation-card">
            <h2 className="reservation-id">Réservation #{index + 1}</h2>
            <p className="reservation-bat">Bâtiment: {reservation.place.etage.batiment.libelle}</p>
            <p className="reservation-bat">Adresse: {reservation.place.etage.batiment.adresse}</p>

            <p className="reservation-bat">
              Etage: {reservation.place.etage.numeroEtage == 0
                      ? "Rez-De-Chaussée"
                      : reservation.place.etage.numeroEtage == 1
                      ? reservation.place.etage.numeroEtage + "er étage"
                      : reservation.place.etage.numeroEtage + "eme étage"}
            </p>

            <p className="reservation-place">Place: {reservation.place.etage.libelleEtage}</p>
            <p className="reservation-commentaire">Commentaire: {reservation.commentaire}</p>
            <p className="reservation-date">Date: {reservation.dateRes}</p>
            <p className="reservation-heure">Heure de début: {reservation.heureDebut}</p>
            <p className="reservation-heure">Heure de fin: {reservation.heureFin}</p>
            <div className="modif-suppRes">
              <a href="#" className="sup-res">
                Supprimer
              </a>
              <a href="#" className="modif-res">
                Modifier
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
  