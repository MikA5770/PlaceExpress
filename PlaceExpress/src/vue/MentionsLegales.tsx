import { Header } from "./header/Header"
import "../style/mentionsLegales.css";

export function MentionsLegales() {

    return (
      <>
        <Header page="mentionslegales" />
        <div className="body">
            <div className="container_mentionsLegales">
                <div className="titre_mentionsLegales">
                    MENTIONS LÉGALES
                </div>

                <div className="txt_mentionsLegales">
                    Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie 
                    numérique, il est précisé aux utilisateurs du site PlaceExpress l'identité des différents intervenants
                    dans le cadre de sa réalisation et de son suivi.
                </div>

                <div className="titre_section">
                    Edition du site 
                </div>

                <div className="txt_mentionsLegales">
                    Le présent site est édité par : Thibault KOBLER, BELMADANI Abdourrahmane, ER Mikail, Alexis FRIDERICH
                    et Alexandre RONIN, étant tous de nationalité Française et résidant tous en France. <br />
                    Le site PlaceExpress a intégré l'utilisation de la plateforme "Flaticon" dans son interface, au sein des icones.
                </div>

                <div className="titre_section">
                    Hébergement
                </div>

                <div className="txt_mentionsLegales">
                    Le Site est hébergé par l'Université de Lorraine, situé sur l'Ile du Saulcy 57000 Metz.
                </div>

                <div className="titre_section">
                    Directeur de publication 
                </div>
                
                <div className="txt_mentionsLegales">
                    Les Directeurs de la publication du Site sont : Thibault KOBLER, BELMADANI Abdourrahmane, ER Mikail, 
                    Alexis FRIDERICH ainsi que Alexandre RONIN. <br />
                    Afin de nous contacter, cliquez <a href="contact">ici</a>.
                </div>
            </div>
        </div>
      </>
    )
  }
  