
import {Link as RouterLink } from 'react-router-dom';
import { Button } from 'antd';


export function LienMobile ( value : {nom: string,chemin : string, actuel : boolean}  ){
    return(
        <RouterLink to={value.chemin} >
        <Button type={value.actuel ? "primary": "text" } className={value.actuel ? "blanc": "" } size='large'> 
                {value.nom}
        </Button>
        </RouterLink>
    )
}
