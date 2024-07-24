import React from "react";
import { Routes, Route } from "react-router-dom";
import Profil from "../pages/Profil"
import Donnees from "../pages/Donnees"
import Password from "../pages/Password";
import SuppressionCompte from "../pages/SuppressionCompte";
import { useState } from 'react';

function NavPage () {

  const [pseudo, setPseudo] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');

  return (
    <React.Fragment>
      <section>
        <Routes>
        <Route path="/profil" element={<Profil />} />
        <Route path="/personal_data" element={<Donnees  pseudo={pseudo} mail={mail} telephone={telephone} setPseudo={setPseudo} setMail={setMail} setTelephone={setTelephone} />} />
        <Route path="/password" element={<Password />} />
        <Route path="/delete_account" element={<SuppressionCompte />} />
        </Routes>
      </section>
    </React.Fragment>
  );
}

export default NavPage

