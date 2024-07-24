import { Reservation } from "../class/Reservation";
import { ReservationDAO } from "../DAO/ReservationDAO";

describe('Reservation', () => {
    let  reservationDAO : ReservationDAO ;
    beforeAll(() => {
        reservationDAO = new ReservationDAO();
    });

      
    it('getAll',  async () => {
      const reservations =  await reservationDAO.getAll(); // on attend l'arrivé d'information 

      expect(reservations.length > 0).toBe(true);
    });
  
    it('getByReservation', async () => {
        const reservation =  await reservationDAO.getByReservation("idPlace","dateReservation");

        let resultat = true;
        resultat=resultat && reservation.commentaire==="bla bla bla";
        resultat=resultat && reservation.heureDebut==="08:00";
        resultat=resultat && reservation.heureFin==="17:00";
        resultat=resultat && reservation.present===true;
        resultat=resultat && reservation.personne.idCompte==="idCompte";
        resultat=resultat && reservation.place.idPlace==="idPlace";
        resultat=resultat && reservation.dateRes==="dateReservation";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const reservation =  await reservationDAO.existe("idPlace","dateReservation");
  
        expect(reservation).toBe(true);
    });

    it('existe pas',async () => {
        const reservation = await  reservationDAO.existe("idPlace","bla bla");
  
        expect(reservation).toBe(false);
    });

    it("Ajout", async() => {
        const reservation = new Reservation();

        reservation.commentaire="test";
        reservation.dateRes="02-11-2023";
        reservation.place.idPlace="idPlace"
        await reservationDAO.ajout(reservation);

        const existe= await reservationDAO.existe("idPlace","02-11-2023");

        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const reservation = await reservationDAO.getByReservation("idPlace","02-11-2023");
        reservation.commentaire="plouf";
        await reservationDAO.update(reservation);

        const newRes =  await reservationDAO.getByReservation("idPlace","02-11-2023");
        expect(newRes.commentaire).toBe("plouf");
    });

    it("Supprimer", async() => {

        const reservation = await reservationDAO.getByReservation("idPlace","02-11-2023");

        await reservationDAO.supprimer(reservation);
        const existe =  await reservationDAO.existe("idPlace","02-11-2023");
        
        expect(existe).toBe(false);
    });



    

    afterAll(() => {
        reservationDAO.closeConnection();
    });

  });