import { Select, DatePicker, Empty, Popconfirm, message, Popover, Switch, Modal } from 'antd';

import { Header } from './header/Header.tsx'
import { Footer } from './Footer.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EtageDAO } from '../modele/DAO/EtageDAO.ts';
import { PermissionDAO } from '../modele/DAO/PermissionDAO.ts';
import { Utilisateur } from '../modele/DAO/Utilisateur.ts';
import { useAuthState } from 'react-firebase-hooks/auth';

import dayjs from 'dayjs';
import { FichierDAO } from '../modele/DAO/FichierDAO.ts';
import { Place } from '../modele/class/Place.ts';
import { PlaceDAO } from '../modele/DAO/PlaceDAO.ts';
import { ReservationDAO } from '../modele/DAO/ReservationDAO.ts';
import { Reservation } from '../modele/class/Reservation.ts';
import { Personne } from '../modele/class/Personne.ts';
import { PersonneDAO } from '../modele/DAO/PersonneDAO.ts';
import { AbonnementDAO } from '../modele/DAO/AbonnementDAO.ts';
import { Abonnement  } from '../modele/class/Abonnement.ts';
import { Batiment } from '../modele/class/Batiment.ts';
export function Reserver() {

    const [dernierClick, setDernierClick] = useState(0);
    const [clickEnfonce, setClickEnfonce] = useState(false);

    const [visibility, setVisibility] = useState(true);

    const [positionChangementEndroit, setPositionChangement] = useState<{x:number,y:number}>(); 

    const [decalage, setDecalage] = useState<{x:number,y:number}>({x:20,y:20}); 

    const changementEndroitDate = useRef<HTMLDivElement | null>(null);

    const [lesBatiments, setLesBatiments] = useState([{value: "", label : ""}]);
    const [valeurSelectBat, setValeurSelectBat] = useState("");

    const [lesEtages, setLesEtages] = useState([{value: "", label : ""}]);
    const [valeurSelectEtage, setValeurSelectEtage] = useState("");

    const [lesPersonnes, setLesPersonnes] = useState([{value: "", label : ""}]);
    const [valeurSelectPersonne, setValeurSelectPersonne] = useState("");
    const [lesPhotosUrl, setLesPhotosUrl] = useState(new Map<string,string>());

    const [dateReservation, setDateReservation] = useState("16/01/2004");
    const [dateFinReservation, setDateFinReservation] = useState("16/01/2004");
  
    const [refreshBatiment, setRefreshBatiment] = useState(true);
    const [refreshEtage, setRefreshEtage] = useState(true);
    const [refreshPlein, setRefreshPlein] = useState(true);

    const utilisateur = new Utilisateur();
    const [user] = useAuthState(utilisateur.getAuth());

    const [url, setUrl] = useState("");

    const [lesPlaces, setLesPlaces] = useState<{place: Place, reserve : boolean, reservation : Reservation[]}[]>([]);

    const elementRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({x:0,y:0});

    const [admin, setAdmin] = useState(false);

    const [switchActive, setSwitchActive] = useState(true);

    const [visibiltyAbonnement, setVisibiltyAbonnement] = useState(false);

    useEffect(() => { 

      setDateReservation(formatDate(new Date()));
      setDateFinReservation(formatDate(new Date()));

    },[])

    useEffect(() => { // Code à exécuter après chaque rendu 
      const personneDAO= new PersonneDAO();

      async function administrateur(){
          const estAdmin= await personneDAO.estAdministrateur(user!.uid)
          setAdmin(estAdmin);

          if(estAdmin){
            const perso = await personneDAO.getAll();
            const data : Array<{value: string , label : string }> = [];
            const mapPhoto= new Map<string,string>()
  
            perso.forEach(elt => {
                    data.push({value:elt.idCompte , label : elt.mail})
                    mapPhoto.set(elt.idCompte,elt.idPhotoProfil); 
                    console.log(data)
                    console.log(mapPhoto)
            })
  
            setLesPersonnes(data);
            setLesPhotosUrl(mapPhoto);
            changementPersonne(user!.uid);
          }
      }
      administrateur();

  }, [user]);

    useEffect(() => { 

      if (changementEndroitDate.current) {
        const boundingBox = changementEndroitDate.current.getBoundingClientRect();
        setPositionChangement({
            x: boundingBox.left + window.scrollX,
            y: boundingBox.top + window.scrollY
          });
      }

      const permissionDAO= new PermissionDAO();

        async function remplirSelect() {
            
          if(user?.uid!=null && user?.uid!=undefined){  
            const batiments=await permissionDAO.getBatimentByPersonne(user?.uid)
            const data : Array<{value: string , label : string }> = []

            batiments.forEach(elt => {
                    data.push({value:elt.idBatiment , label : elt.libelle})
            })

            setLesBatiments(data);
            changementBatiment(data[0].value)
          }
        }
        remplirSelect();

    },[user?.uid])

    useEffect(() => { // Code à exécuter après chaque rendu 
      const etageDAO= new EtageDAO();

      async function remplirEtage() {
          
          const etage = await etageDAO.getByBatiment(valeurSelectBat);
          const data : Array<{value: string , label : string }> = []

          etage.forEach(elt => {
                  data.push({value:elt.idEtage , label : elt.libelleEtage})
          })

          setLesEtages(data);
          changementEtage(data[0].value);
      }
      remplirEtage();
      setRefreshEtage(!refreshEtage);
  }, [refreshBatiment]);

  useEffect(() => { // Code à exécuter après chaque rendu 
    const etageDAO = new EtageDAO();
    const fichierDAO = new FichierDAO();

    async function chercherUrl() {
        const eta= await etageDAO.getByEtage(valeurSelectEtage)

        if(eta.idImagePlan!=""){
            const urlModif = await fichierDAO.image(eta.idImagePlan,"imagePlan");
            setUrl(urlModif);
        }else{
          setUrl("");
        }
        const placeDAO= new PlaceDAO();
        const reservationDAO= new ReservationDAO();
        const touteslesPlaces = await placeDAO.getByEtage(eta.idEtage);

        const ajt :Array<{place :Place, reserve : boolean,reservation : Reservation[] }> =[]

        // voir si les places sont réserver ou non avec le switch
        let dateRes = [changementFormatDate(dateReservation)]

        //les dates de réservations
        if(!switchActive){
          const dateDebut = new Date(changementFormatDateAnglais(dateReservation));
          const dateFin = new Date(changementFormatDateAnglais(dateFinReservation));
          dateRes=toutesLesDates(dateDebut,dateFin);
        }


        for(const unePlace of touteslesPlaces){

          if(switchActive){
            const existance = await reservationDAO.existe(unePlace.idPlace,dateRes[0]);
            let laReservation = new Reservation();
            if(existance){
              laReservation = await reservationDAO.getByReservation(unePlace.idPlace,dateRes[0]); 
            }
            ajt.push({ place: unePlace , reserve: existance, reservation: [laReservation] })
          }else{
            let existance = false;
            const tabReservation : Reservation[] = [];
            for(const date of dateRes){
              const testExistanceRes = (await reservationDAO.existe(unePlace.idPlace,date));
              existance = existance || testExistanceRes;

              if(testExistanceRes){
                  tabReservation.push(await reservationDAO.getByReservation(unePlace.idPlace,date))
              }
            }
            if(tabReservation.length===0){
              tabReservation.push(new Reservation);
            }

            ajt.push({ place: unePlace , reserve: existance, reservation: tabReservation  })
          }
        }
        
        setLesPlaces(ajt)


        if (elementRef.current) {
          const boundingBox = elementRef.current.getBoundingClientRect();
          setPosition({
              x: boundingBox.left + window.scrollX,
              y: boundingBox.top + window.scrollY
            });
      }
    }
    if(valeurSelectEtage!=""){
        chercherUrl()
    }
    
  }, [valeurSelectEtage,dateReservation,refreshEtage,dateFinReservation,switchActive]);

  useEffect(() => { // Code à exécuter après chaque rendu 
    const reservationDAO= new ReservationDAO();
    const abonnementDAO= new AbonnementDAO();
    
    async function verifierPlein() {
      const [jour, mois, annee] = dateReservation.split("/");
      const dateRes=new Date(mois+"/"+jour+"/"+annee);

      const estPlein = await reservationDAO.getPleinByJourByBatiment(valeurSelectBat,dateRes);
      const existeAbo = await abonnementDAO.existe(user!.uid,valeurSelectBat,changementFormatDate(dateReservation))

        if(estPlein && !existeAbo){
          setVisibiltyAbonnement(true);
        }
    }
    if(switchActive && valeurSelectBat!="" ){
      verifierPlein()
    }

  }, [dateReservation,dateFinReservation,switchActive,valeurSelectBat,refreshPlein]);
  
  function toutesLesDates(startDate :Date, endDate : Date) {
    const dates = [];
    const currentDate = startDate;
    // Boucle jusqu'à la date de fin en ajoutant un jour à chaque itération
    while (currentDate <= endDate) {
      dates.push(changementFormatDate(currentDate.toLocaleDateString('fr-FR')));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

    const changementSwitch = () => {
      setSwitchActive(!switchActive);
    };

    const changementBatiment = (idBatiment:string) =>{
      setValeurSelectBat(idBatiment)
      setRefreshBatiment(!refreshBatiment);
  }
    const changementPersonne = (idPersonne : string) =>{
      setValeurSelectPersonne(idPersonne);
    }
    const changementEtage = (idEtage:string) =>{
      setValeurSelectEtage(idEtage);
    }
    const changementDate = (date:string) =>{
      const [jour, mois, annee] = date.split("/");
      const nouvDate=new Date(mois+"/"+jour+"/"+annee);

      const ajrd = new Date();
      ajrd.setHours(0, 0, 0, 0);

      if(nouvDate >= ajrd || admin){
        setDateReservation(date);
      }

      const [jourFin, moisFin, anneeFin] = dateFinReservation.split("/");
      const dateRes = new Date(moisFin+"/"+jourFin+"/"+anneeFin);

      if(dateRes < nouvDate){
        setDateFinReservation(date);
      }

      
    }

    const changementDateFin = (date:string) =>{
      const [jour, mois, annee] = date.split("/");
      const nouvDate=new Date(mois+"/"+jour+"/"+annee);

      const [jourFin, moisFin, anneeFin] = dateReservation.split("/");
      const dateRes = new Date(moisFin+"/"+jourFin+"/"+anneeFin);

      if(nouvDate >= dateRes){
        setDateFinReservation(date);
      }
    }


    const changementFormatDate = (date:string) =>{
      const dateFormat = date.split("/");
      return dateFormat[0]+"-"+dateFormat[1]+"-"+dateFormat[2]
    }

    const changementFormatDateAnglais = (date:string) =>{
      const dateFormat = date.split("/");
      return dateFormat[2]+"-"+dateFormat[1]+"-"+dateFormat[0]
    }

    const formatDate  = (date : Date ) => {
      return date.getDate()+"/"+date.getMonth()+1+"/"+date.getFullYear()
    }
    const changementDateFrancais = (date:string) =>{
      const [jour, mois, annee] = date.split("/");

      const dateObj = new Date(mois+"/"+jour+"/"+annee);

      const dateFormatee = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return dateFormatee;
    }

    const changementDateFrancaisTiret = (date:string) =>{
      const [jour, mois, annee] = date.split("-");

      const dateObj = new Date(mois+"/"+jour+"/"+annee);

      const dateFormatee = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return dateFormatee;
    }


    const changementPosition = useCallback(
      (x: number, y: number) => {
        const currentTime = new Date().getTime();
        const clickDuration = currentTime - dernierClick;
  
        if (clickEnfonce && clickDuration > 300) {
          setPositionChangement({ x: x - decalage.x, y: y-decalage.y});
        }
      },
      [clickEnfonce, dernierClick, positionChangementEndroit]
    );

    const modifierTaille = (x: number, y: number) => {
      const currentTime = new Date().getTime();

      setDecalage({x:x-positionChangementEndroit!.x,y:y-positionChangementEndroit!.y});
 
      setDernierClick(currentTime);
      setClickEnfonce(true);
    }

    const filterOption = ( input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


    const ajouterReservation = (place : Place) => {
        const reservationDAO = new ReservationDAO();
        let dateFormat=[changementFormatDate(dateReservation)]

        if(!switchActive){
          const dateDebut = new Date(changementFormatDateAnglais(dateReservation));
          const dateFin = new Date(changementFormatDateAnglais(dateFinReservation));
          dateFormat=toutesLesDates(dateDebut,dateFin);
        }

        for(const date of dateFormat){
          const reservation = new Reservation(place,new Personne(user!.uid),"",date,"8:00","17:00",true);
          if(admin){
            reservation.personne.idCompte=valeurSelectPersonne;
          }
          reservationDAO.ajout(reservation);
         
        } 

        switchActive || dateReservation===dateFinReservation? 
          message.success('Nouvelle réservation le '+changementDateFrancais(dateReservation)+' à la place '+place.libellePlace)
          :

          message.success('Nouvelle réservation  du '+changementDateFrancais(dateReservation)+' au '+changementDateFrancais(dateFinReservation)+' à la place '+place.libellePlace);
        

        setRefreshEtage(!refreshEtage);
        setRefreshPlein(!refreshPlein)
    }

    const modifierAbsence = (reservation : Reservation) => {
      const reservationDAO = new ReservationDAO();
     
      reservation.present = !reservation.present;
      reservationDAO.update(reservation);

      reservation.present ?
        message.success(reservation.personne.nom+" "+reservation.personne.prenom+" a été mis présent le "+changementDateFrancaisTiret(reservation.dateRes)+" à la place "+reservation.place.libellePlace)
        :
        message.success(reservation.personne.nom+" "+reservation.personne.prenom+" a été mis absent le "+changementDateFrancaisTiret(reservation.dateRes)+" à la place "+reservation.place.libellePlace)
      ;

      setRefreshEtage(!refreshEtage);
  }


  const okAbonnement = () => {
    const abonnementDAO = new AbonnementDAO()
    const abo = new Abonnement(new Batiment(valeurSelectBat),new Personne(user?.uid),changementFormatDate(dateReservation),true);
    abonnementDAO.ajout(abo);
    
    setVisibiltyAbonnement(false);
  };

  const annulerAbonnement = () => {
    setVisibiltyAbonnement(false);
  };

    return(
      <>
        <Header page="reserverUnePlace"/>
        
        <div className='reserver'
        onPointerMove={e =>  changementPosition(e.pageX,e.pageY)}
        >   

        {lesBatiments.length!=0 ?(
          <>
            <div className='reserver_changementPlanJour'
              ref={changementEndroitDate} 
              onMouseDown={e =>modifierTaille(e.pageX,e.pageY)}
              onMouseUp={() =>setClickEnfonce(false)}
              style={{top:positionChangementEndroit?.y, left:positionChangementEndroit?.x }}
            >
              <div className='reserver_changementPlanJour_titre'>
                <div className='reserver_changementPlanJour_texte'>
                  Paramètres de Réservation
                </div>
                <input type='button' 
                onClick={()=>setVisibility(!visibility)}
                />
              </div>

              <div className='reserver_changementPlanJour_contenu'
              style={{display : visibility ? "flex" : "none"}}
              >
              <div className='reserver_changementPlanJour_donnee'>
                <div className='reserver_changementPlanJour_donnee_image reserver_changementPlanJour_donnee_batiment'>
                </div>

                <Select className='reserver_changementPlanJour_donnee_select'
                  showSearch
                  value={valeurSelectBat}
                  optionFilterProp="children"
                  onChange={e => changementBatiment(e)}
                  filterOption={filterOption}
                  options={ lesBatiments }
                />
              </div>
              <div className='reserver_changementPlanJour_donnee'>
                <div className='reserver_changementPlanJour_donnee_image reserver_changementPlanJour_donnee_etage'>
                </div>

                <Select className='reserver_changementPlanJour_donnee_select'
                  showSearch
                  value={valeurSelectEtage}
                  optionFilterProp="children"
                  onChange={e => changementEtage(e)}
                  filterOption={filterOption}
                  options={ lesEtages }
                />
              </div>
              <div className='reserver_changementPlanJour_donnee'>
                <div className='reserver_changementPlanJour_donnee_titre'>
                    Durée :
                </div>

                <Switch checkedChildren="Un jour" unCheckedChildren="Plusieurs jours" 
                checked={switchActive}  onChange={changementSwitch}
                />
    
              </div>
              { switchActive ? (
                <div className='reserver_changementPlanJour_donnee'>
                  <div className='reserver_changementPlanJour_donnee_image reserver_changementPlanJour_donnee_date'>
                  </div>

                  <DatePicker className='reserver_changementPlanJour_donnee_datePicker' format='DD/MM/YYYY'

                  value={ dayjs(dateReservation, 'DD/MM/YYYY')}
                  onChange={(date, dateString) => changementDate(dateString)}
                  />
                </div>
              ):(<>
                <div className='reserver_changementPlanJour_donnee'>
                  <div className='reserver_changementPlanJour_donnee_image reserver_changementPlanJour_donnee_entree'>
                  </div>

                  <DatePicker className='reserver_changementPlanJour_donnee_datePicker' format='DD/MM/YYYY'

                  value={ dayjs(dateReservation, 'DD/MM/YYYY')}
                  onChange={(date, dateString) => changementDate(dateString)}
                  />
                </div>
                <div className='reserver_changementPlanJour_donnee'>
                  <div className='reserver_changementPlanJour_donnee_image reserver_changementPlanJour_donnee_sortie'>
                  </div>

                  <DatePicker className='reserver_changementPlanJour_donnee_datePicker' format='DD/MM/YYYY'

                  value={ dayjs(dateFinReservation, 'DD/MM/YYYY')}
                  onChange={(date, dateString) => changementDateFin(dateString)}
                  />
                </div>
                </>)}
              { admin ? (<>
              <div className='reserver_changementPlanJour_donnee'>
                <div className='reserver_changementPlanJour_donnee_titre'>
                    Réserver pour :
                </div>

              </div>
              <div className='reserver_changementPlanJour_donnee'>
                <div className='reserver_changementPlanJour_donnee_image reserver_changementPlanJour_donnee_personne reserver_changementPlanJour_donnee_arrondi'
                style={{backgroundImage : "url("+lesPhotosUrl.get(valeurSelectPersonne)+")"}}
                >
                </div>

                <Select className='reserver_changementPlanJour_donnee_select'
                  showSearch
                  value={valeurSelectPersonne}
                  optionFilterProp="children"
                  onChange={e => changementPersonne(e)}
                  filterOption={filterOption}
                  options={ lesPersonnes }
                />
              </div> </>) : (<></>) }

            </div>
            </div>
          <div className="reserver_contourPlan">
            <div 
              ref={elementRef} 
              style={{backgroundImage : `url(${url})`}}
              className="reserver_contourPlan_plan" 
            >
                    {lesPlaces.map((elt) => (
                        elt.reserve ? 

                      (admin && switchActive ? 
                      ( <Popover content={ 
                        <div  className="reserver_contourPlan_plan_imageContent">
                          <div
                            className="reserver_contourPlan_plan_imageContent_image"
                            style={{backgroundImage : "url("+elt.reservation[0].personne.idPhotoProfil+")"}}
                          >
                          </div>
                        </div>} 


                        title={"Réservé par "+elt.reservation[0].personne.nom+" "+elt.reservation[0].personne.prenom} >
                        <Popover
                            content={
                              <div className='reserver_contourPlan_plan_imageContent'>
                                  <Switch checkedChildren="Présent" unCheckedChildren="Absent"  
                                  checked={elt.reservation[0].present}
                                  onChange={()=>modifierAbsence(elt.reservation[0])}
                                  />
                              </div>
                            }
                            title={"Modifier la présence de "+elt.reservation[0].personne.nom+" "+elt.reservation[0].personne.prenom}
                            trigger="click"
  
                          >
                        <div className="reserver_contourPlan_plan_place" key={elt.place.idPlace}
                            style= {{
                                height : elt.place.hauteur+"px",
                                width : elt.place.largeur+"px",
                                top : elt.place.y+position.y,
                                left : elt.place.x+position.x,
                                backgroundColor : elt.reservation[0].present ? "#a40a26" : "#ED7F10",
                            }}>
                            {elt.place.libellePlace}
                        </div>
                        </Popover>
                        </Popover>
                        ) :
                        ( <Popover content={ 
                          <div>
                            {elt.reservation.map(elt => (<>• {changementDateFrancaisTiret(elt.dateRes)} par {elt.personne.nom+" "+elt.personne.prenom}<br/></>))}
                          </div>
                          } 
                          trigger="hover"
                          title="Réservé le " >

                          

                          <div className="reserver_contourPlan_plan_place" key={elt.place.idPlace}
                              style= {{
                                  height : elt.place.hauteur+"px",
                                  width : elt.place.largeur+"px",
                                  top : elt.place.y+position.y,
                                  left : elt.place.x+position.x,
                                  backgroundColor :"#a40a26" ,
                              }}>
                              {elt.place.libellePlace}
                          </div>
                          </Popover>
                          ) ) 
                        :(
                          <Popconfirm key={elt.place.idPlace}
                                    title="Nouvelle Réservation"
                                    description={switchActive || dateReservation===dateFinReservation? 
                                      "Êtes vous sûr de réserver cette place pour le "+changementDateFrancais(dateReservation)+" ?"
                                      :
                                      "Êtes vous sûr de réserver cette place pour du "+changementDateFrancais(dateReservation)+" au "+changementDateFrancais(dateFinReservation)+" ?"
                                    }
                                    onConfirm={() => ajouterReservation(elt.place)}
                                    onCancel={ () => message.error('Réservation annulé')}
                                    okText="Oui"
                                    cancelText="Non"
                                >
                          
                          <div className="reserver_contourPlan_plan_place"
                              style= {{
                                  height : elt.place.hauteur+"px",
                                  width : elt.place.largeur+"px",
                                  top : elt.place.y+position.y,
                                  left : elt.place.x+position.x,
                              }}>
                              {elt.place.libellePlace}
                          </div>
                          
                          </Popconfirm>
                          )



                    ))}
              {url ==="" ?
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 200,marginTop:"6rem" }}
                description={
                <span style={{fontSize : "1.6em"}}>
                  Plan de cet étage momentanément indisponible
                </span>
                }
              ></Empty>
              :""}

            </div>
          </div>
          </>
        )
        :
        (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 200,marginTop:"6rem" }}
            description={
          <span style={{fontSize : "1.6em"}}>
            Vous n'avez accès à aucun des batiments pour le moment
          </span>
          }
        ></Empty>
        )
        }
        </div>
        <Modal title="S'abonner à un jour" 
        open={visibiltyAbonnement} 
        onOk={okAbonnement} 
        onCancel={annulerAbonnement}>
          <p style={{textAlign:'center'}}>Ce batiment est plein pour cette date </p>
          <p style={{textAlign:'center'}}>Voulez-vous vous abonner pour cette date et être notifié si une place se libère ?</p>
        </Modal>
        <Footer couleur="dore"/>
      </>
  
  )
}


  
  