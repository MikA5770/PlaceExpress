import { Alert, ColorPickerProps, Space, ColorPicker } from 'antd';
import {  useState } from 'react';


export function DivColorPicker(value : {valeur : string, titre :string, fonction : (valeur: string ) => void , erreur:boolean, erreurNom : string }){
    
    
    const [formatRgb, setFormatRgb] = useState<ColorPickerProps['format']>('rgb');


    return (
    <div className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_uneInfo">
                        <div>{value.titre}</div>
                        
                        <Space className="administration_contenu_lesInfos_uneInfo_space">
                            <ColorPicker
                                format={formatRgb}
                                value={value.valeur}
                                onChange={(e) => value.fonction(e.toRgbString())}
                                onFormatChange={setFormatRgb}
                                />
                            <span>RGB: {value.valeur}</span>
                        </Space>
                    
                    </div>
                    {value.erreur? 
                    <div  className="administration_contenu_lesInfos_uneErreur">
                        <Alert message={value.erreurNom} type="error" className="administration_contenu_lesInfos_uneErreur_alert" />
                    </div> : <> </>
                    }
    </div> )
}


