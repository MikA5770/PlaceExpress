export function DivPhoto(value:{ cheminGrandeImg : string, cheminPetiteImg : string}){
    return(
      <div className="accueil_divPhoto">
        <img className="accueil_divPhoto_petite" src={value.cheminPetiteImg} />
        <img className="accueil_divPhoto_grande" src={`${value.cheminGrandeImg}`} />
      </div>
    )
}