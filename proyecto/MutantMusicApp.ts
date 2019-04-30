import * as fs from 'fs';
import * as WavEncoder from 'wav-encoder';
import * as WavDecoder from 'wav-decoder';

import { SongStructure } from './SongStructure';


export class MutantMusic{

    private s1AudioData: any;
    private s2AudioData: any;

    private mainSample: SongStructure;
    private targetSample: SongStructure;

    public constructor(s1Structure: SongStructure, s2Structure: SongStructure){
        this.mainSample = s1Structure;
        this.targetSample = s2Structure;
    }

    
    public matchOperation(pMainSample: SongStructure, pTargetSample: SongStructure){
        
    }

    
}