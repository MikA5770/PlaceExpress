import CountUp from 'react-countup';
import { Statistic, StatisticProps  } from 'antd';

export function StatPetitElement(value  : { nombre:number, titre: string} ){

    const formatter = (value: number) => <CountUp end={value} separator=" " />;

    return(
        <div className="administration_contenu_section_gauche_sousEnsemble_petit">
            <Statistic title={value.titre} value={value.nombre} formatter={formatter as StatisticProps['formatter']} />
        </div>
    )
}