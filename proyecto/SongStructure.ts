//Constantes para definir estructuras
const RISE = 0;
const FALL = 1;
const PLATEAU = 2;
const VALLEY = 3;

//canales de audio
const LEFT_CH = 0;
const RIGHT_CH = 1;

export class SongStructure{
    private audioData: any;
    private unifiedChannel: number[];
    public songStruct: number[][]; //contiene el tipo de estructura(0), tasa de cambio(1) y el indice donde comienza(2)

    public structureArrays: number[][]; //contiene 4 listas donde estan clasificadas las estructuras por tipo, las listas contienen los indices de las estructuras

    //constructor recibe el audiodata, la posicion donde comienza el analisis y el largo del analisis en samples
    public constructor(pWavAudio: any, pOffset: number, pAnalysisLength: number){
        this.songStruct = [];
        this.structureArrays = [[/*rises*/ ],[/*falls*/],[/*plateaus*/],[/*valleys*/]];
        this.audioData = pWavAudio;
        this.unifiedChannel = [];

        this.structureSong(pOffset, pAnalysisLength);
    }

    //metodo que define las estructuras en la cancion de 3 en 3 samples.
    //estas son guardadas en songStruct
    private structureSong(offset: number, analysisLength: number){
        var songIndex = 0;
        var structIndex = 0;
        var counter = 0;

        this.unifiedChannel.push(Math.abs((this.audioData.channelData[LEFT_CH][songIndex+offset] * this.audioData.channelData[RIGHT_CH][songIndex+offset]))); //primer elemento del canal unificado
        
        songIndex++;
        for(songIndex; songIndex<analysisLength; songIndex++ ){
            const unifiedSample = Math.abs((this.audioData.channelData[LEFT_CH][songIndex+offset] * this.audioData.channelData[RIGHT_CH][songIndex+offset]));
            this.unifiedChannel.push(unifiedSample);
            counter++;
            if(counter == 3){ //cada 3 elementos
                const changeRate = this.calculateChangeRate(this.unifiedChannel[songIndex-3], this.unifiedChannel[songIndex]);
                const tmpStruct = this.createStructure(changeRate, this.unifiedChannel[songIndex-3]);
                
                this.songStruct.push([tmpStruct, changeRate, (offset+songIndex-3)]);
                this.allocateStructure(tmpStruct, structIndex);
                structIndex++;
                counter = 0;
            }
        }
    }

    //calcula la tasa de varianza
    private calculateChangeRate(pFirstSample: number, pSecondSample: number): number {
        const changeRate = pSecondSample - pFirstSample;
        return changeRate;
    }

    //define una estructura basado en la tasa de varianza
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

    //agrega el indice de la estructura a structureArrays
    private allocateStructure(pStructure: number, pStructIndex: number){
        this.structureArrays[pStructure].push(pStructIndex);
    }

    //metodo para obtener la distribucion de formas en el segmento
    //divide el largo del array de indices de estructuras entre la cantidad total de estructuras
    public calculateDistribution(): number[]{
        var distribution: number[] = [];
        for(let structArrIndex = RISE; structArrIndex<=VALLEY; structArrIndex++){
            distribution.push(this.structureArrays[structArrIndex].length/this.songStruct.length);
        }
        return distribution;
    }
}