import * as fs from 'fs';
import * as WavEncoder from 'wav-encoder';
import * as WavDecoder from 'wav-decoder';

import { SongStructure } from './SongStructure';

const HALF_SECOND = 22050;


export class MutantMusic{

    private s1: any;
    private s2: any;
    //private s2: SongStructure[];


    public constructor(s1AudioData: any, s2AudioData: any){
        this.s1 = s1AudioData; 
        this.s2 = s2AudioData;
    }

    private analyzeSong(pAudioData: any): SongStructure[] {
        var structure: SongStructure[] = []; 
        for(let index = 0; index<pAudioData.length; index+=HALF_SECOND){
            structure.push(new SongStructure(pAudioData, index, HALF_SECOND));
        }

        return structure;
    }

    private analyzeRandomSample(pAudioData: any): SongStructure {
        const range = (pAudioData.length-HALF_SECOND);
        const randomStart = Math.round(Math.random()*range);
        
        return new SongStructure(pAudioData, randomStart, HALF_SECOND);
    }

    
    public matchOperation(){
        const s1ChunkStructure = this.analyzeSong(this.s1);
        for(let i = 0; i<50; i++){
            console.log(s1ChunkStructure[i].calculateDistribution());
        }

        console.log(this.analyzeRandomSample(this.s2).songStruct[0][2]);
    }

    
}