
import { Button } from 'antd';

export function DivBienvenu(){
    return(
      <div className="accueil_bienvenu">
        <div className="accueil_bienvenu_img"></div>
        <div className="accueil_bienvenu_txt">
          <div className="accueil_txt_titre">
                Bienvenu sur PlaceExpress
          </div>
          <div>
          <div className="accueil_txt_sousTitre">
                Là où vos réservations deviennent un Plaisir !
          </div>
          <div className="accueil_txt_paragraphe">
                Chez PlaceExpress, nous avons repensé la manière dont vous réservez vos places au sein de votre entreprise, que ce soit pour des réunions, des formations, des événements spéciaux ou toute autre activité. Notre concept est simple : rendre la réservation de vos places fluide, agréable et adaptée à vos besoins.
          </div>
          </div>
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'><Button size='large'>Se Connecter</Button></a>
  
        </div>
      </div>
    )
  
  }