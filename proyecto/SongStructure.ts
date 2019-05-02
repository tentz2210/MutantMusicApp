const RISE = 0;
const FALL = 1;
const PLATEAU = 2;
const VALLEY = 3;

const LEFT_CH = 0;
const RIGHT_CH = 1;

export class SongStructure{
    private audioData: any;
    private unifiedChannel: number[];
    public songStruct: number[][]; //contiene el tipo de estructura y el indice donde comienza

    //indices de SongStruct
    public structureArrays: number[][]; //contiene 4 listas donde estan clasificadas las estructuras individualmente por indice


    public constructor(pWavAudio: any, pOffset: number, pAnalysisLength: number){
        this.songStruct = [];
        this.structureArrays = [[],[],[],[]];
        this.audioData = pWavAudio;
        this.unifiedChannel = [];

        this.structureSong(pOffset, pAnalysisLength);
    }

    private structureSong(offset: number, analysisLength: number){

        var songIndex = 0;
        var structIndex = 0;
        var counter = 0;

        this.unifiedChannel.push(Math.abs((this.audioData.channelData[LEFT_CH][songIndex+offset] * this.audioData.channelData[RIGHT_CH][songIndex+offset])));
        
        songIndex++;
        
        
        for(songIndex; songIndex<analysisLength; songIndex++ ){
            const unifiedSample = Math.abs((this.audioData.channelData[LEFT_CH][songIndex+offset] * this.audioData.channelData[RIGHT_CH][songIndex+offset]));
            this.unifiedChannel.push(unifiedSample);
            counter++;
            if(counter == 3){
                const changeRate = this.calculateChangeRate(this.unifiedChannel[songIndex-3], this.unifiedChannel[songIndex]);
                const tmpStruct = this.createStructure(changeRate, this.unifiedChannel[songIndex-3]);
                
                this.songStruct.push([tmpStruct, changeRate, (offset+songIndex-3)]);
                this.allocateStructure(tmpStruct, structIndex);
                structIndex++;
                counter = 0;
            }
        }
       
    }

    private calculateChangeRate(pFirstSample: number, pSecondSample: number): number {
        const changeRate = pSecondSample - pFirstSample;
        return changeRate;
    }

    private createStructure(pChangeRate: number, pFirstSample: number): number {
        if(Math.abs(pChangeRate) < 0.0075){
            if(pFirstSample < 0.03){
                return VALLEY;
            } else {
                return PLATEAU;
            }
        } else {
            if(pChangeRate < 0){
                return FALL;
            } else {
                return RISE;
            }
        }
    }

    private allocateStructure(pStructure: number, pStructIndex: number){
        this.structureArrays[pStructure].push(pStructIndex);
    }

    private findDominantStructure(): number{
        var dominantStruct = RISE;
        var dominantLength = 0;
        

        for(let index = 0; index<this.structureArrays.length; index++){
            const tmpStructLength = this.structureArrays[index].length;
            if(tmpStructLength > dominantLength){
                dominantLength = tmpStructLength;
                dominantStruct = index;
            }
        }
        return dominantStruct;
    }

    public calculateDistribution(): number[]{
        var distribution: number[] = [];
        for(let structArrIndex = RISE; structArrIndex<=VALLEY; structArrIndex++){
            distribution.push(this.structureArrays[structArrIndex].length/this.songStruct.length);
        }

        return distribution;
    }
}