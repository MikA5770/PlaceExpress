import React from 'react';
import "../style/footer.css";



export function Footer() {
  return (
    <div className="footer">
      <div className="prenom">
        <ul className="ul_prenom">
          <li>ER Mikail</li>
          <li>KOBLER Thibault</li>
          <li>BELMADANI Abdourrahmane</li>
          <li>FRIDERICH Alexis</li>
        </ul>
      </div>

      <div className="info">
        <ul className="ul_info">
          <li><a href="#">Qui sommes-nous ?</a></li>
          <li><a href="#">Nous contacter</a></li>
          <li><a href="#">À propos</a></li>
          <li><a href="mentionslegales">Mentions légales</a></li>
        </ul>
      </div>

      <div className="logo">
        <img src="./navigateur-gps.jpg" alt="" /> <span className='loc'> EUR - FRANCE</span>
      </div>
    </div>
  );
}
