const RISE = 0;
const FALL = 1;
const PLATEAU = 2;
const VALLEY = 3;

const LEFT_CH = 0;
const RIGHT_CH = 1;

export class SongStructure{
    private audioData: any;
    private unifiedChannel: number[];
    private songStruct: number[][]; //contiene el tipo de estructura y el indice donde comienza

    //indices de SongStruct
    private rises: number[]; //contiene los indices donde hay subidas
    private falls: number[]; //contiene los indices donde hay bajadas
    private plateaus: number[]; //contiene los indices donde hay mesetas
    private valleys: number[]; //contiene los indices donde hay valles


    public constructor(pWavAudio: any){
        this.songStruct = [];
        this.rises = [];
        this.falls = [];
        this.plateaus = [];
        this.valleys = [];
        this.audioData = pWavAudio;
        this.unifiedChannel = [];
    }

    public structureSong(){
        this.unifiedChannel.push(Math.abs((this.audioData.channelData[LEFT_CH][0] * this.audioData.channelData[RIGHT_CH][0])));
        var structIndex = 0;
        for(let songIndex = 1; songIndex<this.audioData.length; songIndex++ ){
            const unifiedSample = Math.abs((this.audioData.channelData[0][songIndex] * this.audioData.channelData[1][songIndex]));
            this.unifiedChannel.push(unifiedSample);
            if(songIndex%4 == 0){
                const tmpStruct = this.createStructure(this.unifiedChannel[songIndex-4], this.unifiedChannel[songIndex]);
                this.songStruct.push([songIndex-4, tmpStruct]);
                this.allocateStructure(tmpStruct, structIndex);
                structIndex++;
            }
        }
       /* console.log("song unified");
        console.log(this.unifiedChannel.length);
        for(var i=44100; i<44130; i++) {
            console.log(this.unifiedChannel[i]);
            console.log('*******************');
          }*/
        console.log(this.plateaus.length);
        console.log(this.falls.length);
        console.log(this.rises.length);
        console.log(this.valleys.length);
    }

    private createStructure(pFirstSample: number, pSecondSample: number): number {
        const changeRate = pSecondSample - pFirstSample;
        if(Math.abs(changeRate) < 0.01){
            if(pFirstSample < 0.05){
                return VALLEY;
            } else {
                return PLATEAU;
            }
        } else {
            if(changeRate < 0){
                return FALL;
            } else {
                return RISE;
            }
        }
    }

    private allocateStructure(pStructure: number, pStructIndex: number){
        switch(pStructure){
            case VALLEY:
                this.valleys.push(pStructIndex);
                break;

            case PLATEAU:
                this.plateaus.push(pStructIndex);
                break;

            case RISE:
                this.rises.push(pStructIndex);
                break;

            case FALL:
                this.falls.push(pStructIndex);
                break;
        }
    }
}