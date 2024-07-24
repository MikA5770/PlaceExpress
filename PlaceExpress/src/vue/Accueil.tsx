import { DivAccueilTexte } from './accueil/DivAccueilTexte';
import { DivPhoto } from './accueil/DivPhoto';
import { DivPresentation } from './accueil/DivPresentation';
import { DivBienvenu } from './accueil/DivBienvenu';

import { FloatButton } from 'antd';
import { Footer } from './Footer';


export function Accueil() {

    return (
      <>
        <DivPresentation />
        <DivBienvenu />
        <DivPhoto cheminGrandeImg="../src/style/image/accueil/fond.jpg" cheminPetiteImg="../src/style/image/accueil/fond.jpg"/>
        <DivAccueilTexte />
        <DivPhoto cheminGrandeImg="../src/style/image/accueil/fond.jpg" cheminPetiteImg="../src/style/image/accueil/fond.jpg"/>
        <Footer couleur="vert"/>
        <FloatButton.BackTop />

      </>
    )
}
  