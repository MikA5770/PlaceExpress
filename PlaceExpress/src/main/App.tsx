import '../style/App.css'

import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import { Administration } from '../vue/Administration';
import { Contact } from '../vue/Contact';
import { ConnexionUtilisateur } from '../vue/ConnexionUtilisateur';
import { MesBatiments } from '../vue/MesBatiments';
import { MesReservations } from '../vue/MesReservations';
import { Accueil } from '../vue/Accueil';
import { Reserver } from '../vue/Reserver';
import { MonCompte } from '../vue/MonCompte';
import { MentionsLegales } from '../vue/MentionsLegales';



function App() {

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary:'#7B914D',
            colorLinkActive:'#7b914d',
            colorLinkHover:'#a4ab91',
            colorPrimaryActive:'#586b33',
            colorPrimaryBorder:'#b5b8ad',
            colorPrimaryHover:'#909e6d',
            colorText:'rgba(0, 0, 0, 0.88)',
            colorTextDisabled:'rgba(0, 0, 0, 0.25)',
            colorTextLightSolid:'#fff',
            controlOutline:'rgba(46, 55, 3, 0.23)',
            controlTmpOutline:'rgba(0, 0, 0, 0.02)',
        },Menu :{
            itemSelectedBg: 'rgba(123,145,77,0.15)',
            itemSelectedColor: '#374709',
            itemActiveBg:'rgba(123,145,77,0.15)',
        },Calendar : {
          colorPrimary:'#A99063',
          itemActiveBg: '#F7F4F0',
          paddingXS : 5,
          marginXS: 5,
          colorLink: '#A99063',
        }, Badge : {
           indicatorHeight: 30,
           textFontSize:15,
        },Radio : {
           colorPrimary : '#A99063',
           colorPrimaryActive: '#A99063',
           colorPrimaryHover : '#A99063',
        }, Select : {
          colorPrimary : '#A99063',
          colorPrimaryHover: '#A99063',
          colorPrimaryActive: '#A99063',
          optionSelectedBg : '#F7F4F0',
        }, Collapse : {
          contentBg : 'rgb(0,0,0,0)',
          colorTextHeading : 'white',
        },Input: {
          activeBorderColor:'#A99063',
          hoverBorderColor:'#A99063',
          colorPrimary : '#A99063',
          colorPrimaryHover :'#A99063',
          
        },DatePicker : {
          activeBorderColor:'#A99063',
          hoverBorderColor:'#A99063',
        },InputNumber : {
          activeBorderColor:'#A99063',
          hoverBorderColor:'#A99063',
        },Upload : {
          colorPrimary:'#A99063',
        }
      },
    }}
    >
    
    <Router>
      <Routes>
        <Route path="*" element={ <Accueil/> } />
        <Route path="/administration" element={ <Administration/> } />
        <Route path="/mesBatiments" element={ <MesBatiments/> } />
        <Route path="/mesReservations" element={ <MesReservations/> } />
        <Route path="/reserver" element={ <Reserver/> } />
        <Route path="/monCompte" element={ <MonCompte/> } />
        <Route path="/connexion" element={ <ConnexionUtilisateur/> } />
        <Route path="/contact" element={ <Contact/> } />
        <Route path="/mentionsLegales" element={ <MentionsLegales/> } />
      </Routes>
    </Router>

    </ConfigProvider>
  )
}

export default App
