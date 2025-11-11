import Image from 'next/image';
import * as ih from './styled'

import EngineImage from '../../../public/assets/Engine.png'

export default function InputHome() {
 return (
   <ih.Container>
    <ih.Content>
        <ih.Title>Busca de Ensaios Clínicos</ih.Title>
        <ih.Input type="text" placeholder="Digite para buscar" />
        
        <ih.LinkSection>
            <Image src="/Engine.png" alt="Engine" width={18} height={20}/>
            <ih.Link href="https://www.clinicaltrials.gov/" target="_blank">
                Acesse o ClinicalTrials.gov
            </ih.Link>
        </ih.LinkSection>
    </ih.Content>
   </ih.Container>
 );
}