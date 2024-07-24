import CountUp from 'react-countup';

export function LigneTableauBord( value : { nombre: number, titre : string }){
    return(
        <div className="administration_contenu_section_droite_tab_contenu">
            <span>{value.titre}</span>
            <CountUp end={value.nombre} separator=" " />
        </div>
    )
}