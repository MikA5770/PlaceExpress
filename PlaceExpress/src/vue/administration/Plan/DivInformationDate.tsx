import dayjs from 'dayjs';
import { DatePicker,Alert } from 'antd';

export function DivInformationDate(value : {valeur : string, titre :string, fonction : (valeur: string ) => void , erreur:boolean, erreurNom : string , default : boolean }){

    const dateFormat = 'DD-MM-YYYY';
    return (
    <div  className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_uneInfo">
                        <div>{value.titre}</div>
                        <DatePicker className="administration_contenu_lesInfos_uneInfo_date" 
                            value={ value.default ? undefined : dayjs(value.valeur, dateFormat)}
                            onChange={(date, dateString) => value.fonction(dateString)}
                            format={dateFormat}
                            status={value.erreur ? "error" : undefined }
                        />
                    
                    </div>
                    {value.erreur? 
                    <div  className="administration_contenu_lesInfos_uneErreur">
                        <Alert message={value.erreurNom} type="error" className="administration_contenu_lesInfos_uneErreur_alert" />
                    </div> : <> </>
                    }
    </div> )
}