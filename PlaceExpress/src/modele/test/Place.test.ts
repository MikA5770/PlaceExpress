import { Place } from "../class/Place";
import { PlaceDAO } from "../DAO/PlaceDAO";

describe('Place', () => {
    let  placeDAO : PlaceDAO ;
    let id="";
  
    beforeAll(() => {
        placeDAO = new PlaceDAO();
    });

      
    it('getAll',  async () => {
      const places =  await placeDAO.getAll(); // on attend l'arrivé d'information 

      expect(places.length > 0).toBe(true);
    });
  
    it('getByPlace', async () => {
        const place =  await placeDAO.getByPlace("idPlace");


        let resultat = true;
        resultat=resultat && place.hauteur===32;
        resultat=resultat && place.largeur===23;
        resultat=resultat && place.libellePlace==="Place 1";
        resultat=resultat && place.x===34;
        resultat=resultat && place.y===23;
        resultat=resultat && place.etage.idEtage==="idEtage";
        resultat=resultat && place.etage.numeroEtage===0;

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const place =  await placeDAO.existe("idPlace");
  
        expect(place).toBe(true);
    });

    it('existe pas',async () => {
        const place = await  placeDAO.existe("blabla");
  
        expect(place).toBe(false);
    });

    it("Ajout", async() => {
        const place = new Place();
        place.libellePlace="test";
        place.etage.idEtage="idEtage";
        await placeDAO.ajout(place);

        const lesPlaces = await placeDAO.getAll();
        let existe = false;

        lesPlaces.forEach( elt => {
            if(elt.libellePlace==="test"){
                existe=true;
                id=elt.idPlace;
            }
        })
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const place = await placeDAO.getByPlace(id);
        place.libellePlace="Place 2";
        await placeDAO.update(place);

        const newPlace =  await placeDAO.getByPlace(id);
        expect(newPlace.libellePlace).toBe("Place 2");
    });

    it("Supprimer", async() => {

        const place = await placeDAO.getByPlace(id);

        await placeDAO.supprimer(place);
        const existe =  await placeDAO.existe(id);
        
        expect(existe).toBe(false);
    });

    it("ByEtage", async() => {
        const places =  await placeDAO.getByEtage("idEtage"); // on attend l'arrivé d'information 

        expect(places.length === 1).toBe(true);
    });


    

    afterAll(() => {
        placeDAO.closeConnection();
    });

  });