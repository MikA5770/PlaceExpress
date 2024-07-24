import { Header } from "./header/Header"

import React from "react";
import '../style/compte.css';
//import Header from "../header/Header"
import Sidebar from "./monCompte/components/Sidebar";
import NavPage from "./monCompte/components/NavPage";

export function MonCompte ()  {
  return (
    <>
      {/* heading section */}
      <Header page="monCompte"/>

      {/* sidebar section */}
      <section>
        <div className='layer'>
          <div className='sidebar'>
              <Sidebar/>
          </div>


          <div className='navpage'>
              <NavPage/>
          </div>
        </div>
      </section>
    </>
  );
}
  
  