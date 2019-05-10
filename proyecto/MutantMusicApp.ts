import { SongStructure } from './SongStructure';

const HALF_SECOND = 22050; //medio segundo en samples
const RISE = 0;
const FALL = 1;
const PLATEAU = 2;
const VALLEY = 3;


export class MutantMusic{

    //audioData de s1 y s2
    private s1: any;
    private s2: any;

    /**
     * arrays de clasificacion de distribuciones de s1
     * cada array contiene 10 arrays, esto para ir de 0-10, 10-20,...,90-100 para porcentajes de distribucion de formas
     * cada subarray contiene el indice de la seccion de la cancion con el tipo de distribucion especifica
     * ej: riseDistributions[1] contiene el array que tiene los indices de la secciones de s1 que tienen entre 10%-20% de subidas
     */
    private riseDistributions: number[][];
    private fallDistributions: number[][];
    private plateauDistributions: number[][];
    private valleyDistributions: number[][];


    public constructor(s1AudioData: any, s2AudioData: any){
        this.s1 = s1AudioData; 
        this.s2 = s2AudioData;
        this.riseDistributions = [[], [], [], [], [], [], [], [], [], []];
        this.fallDistributions = [[], [], [], [], [], [], [], [], [], []];
        this.plateauDistributions = [[], [], [], [], [], [], [], [], [], []];
        this.valleyDistributions = [[], [], [], [], [], [], [], [], [], []];
    }

    //analiza una cancion de principio a fin
    //utilizado para s1
    private analyzeSong(pAudioData: any): SongStructure[] {
        var analyzedSong: SongStructure[] = []; 
        for(let index = 0; index<pAudioData.length; index+=HALF_SECOND){
            analyzedSong.push(new SongStructure(pAudioData, index, HALF_SECOND));
        }

        return analyzedSong;
    }

    //analiza una seccion aleatoria de la cancion
    //utilizado para s2
    private analyzeRandomSample(pAudioData: any): SongStructure {
        const range = (pAudioData.length-HALF_SECOND);
        const randomStart = Math.round(Math.random()*range);
        
        return new SongStructure(pAudioData, randomStart, HALF_SECOND);
    }

    //obtiene la distribucion de cada seccion de s1 y lo asigna a los arrays de distribuciones
    private allocateDistributions(pStructuredSong: SongStructure[]){
        for(let sectionIndex = 0; sectionIndex < pStructuredSong.length; sectionIndex++){
            const tmpDistribution = pStructuredSong[sectionIndex].calculateDistribution();

            this.pushDistribution(tmpDistribution, sectionIndex);
        }
        console.log("Distributions allocated");
    }

    //recibe un array de distribucion de seccion y el indice de la seccion
    //realiza push al subarray respectivo de cada tipo de estructura
    private pushDistribution(pDistributionArray: number[], pSectionIndex: number){
        const risePercentIndex = this.findPercentIndex(pDistributionArray[RISE]);
        this.riseDistributions[risePercentIndex].push(pSectionIndex);

        const fallPercentIndex = this.findPercentIndex(pDistributionArray[FALL]);
        this.fallDistributions[fallPercentIndex].push(pSectionIndex);

        const plateauPercentIndex = this.findPercentIndex(pDistributionArray[PLATEAU]);
        this.plateauDistributions[plateauPercentIndex].push(pSectionIndex);

        const valleyPercentIndex = this.findPercentIndex(pDistributionArray[VALLEY]);
        this.valleyDistributions[valleyPercentIndex].push(pSectionIndex);
    }

    //retorna el indice del porcentaje de distribucion basado en el porcentaje de distribucion
    private findPercentIndex(pDistribution: number): number{
        var minPercent = 0;
        var maxPercent = 0.1;
        if(pDistribution == 0)
            return 0;
        for(let percentageIndex = 0; percentageIndex < 10; percentageIndex++){
            if((pDistribution > minPercent) && (pDistribution <= maxPercent)){
                return percentageIndex;
            } else {
                minPercent += 0.1;
                maxPercent += 0.1;
            }
        }
        return -1;
    }

    //recibe un array de distribucion de seccion (normalmente de s2)
    //retorna un array con los indices de s1 donde existe una distribucion similar a la input
    private findDistributionMatches(pDistributionArray: number[]): number[]{
        var structureRanges: number[][] = [];

        var percentIndex = this.findPercentIndex(pDistributionArray[RISE]);
        structureRanges.push(this.riseDistributions[percentIndex]);

        percentIndex = this.findPercentIndex(pDistributionArray[FALL]);
        structureRanges.push(this.fallDistributions[percentIndex]);

        percentIndex = this.findPercentIndex(pDistributionArray[PLATEAU]);
        structureRanges.push(this.plateauDistributions[percentIndex]);

        percentIndex = this.findPercentIndex(pDistributionArray[VALLEY]);
        structureRanges.push(this.valleyDistributions[percentIndex]);

        const matches = this.intersectRanges(structureRanges);

        return matches;
    }

    //metodo que encuentra entre 4 arrays que contienen indices de secciones de s1, las secciones que pertenecen a los 4 arrays 
    //(que tienen una distribucion similar a la seccion random de s2)
    private intersectRanges(pStructureRanges: number[][]): number[]{
        var smallestArrIndex = RISE;
        var smallestArrLength = pStructureRanges[RISE].length;

        for(let structureType = RISE; structureType <= VALLEY; structureType++){ //encuentra el array de secciones mas pequeño de los 4 arrays de distribuciones
            if(pStructureRanges[structureType].length < smallestArrLength){
                smallestArrLength = pStructureRanges[structureType].length;
                smallestArrIndex = structureType;
            }
        }

        var riseIndex = 0;
        var fallIndex = 0;
        var plateauIndex = 0;
        var valleyIndex = 0;
        
        var elementChecker: boolean[] = [false, false, false, false]; //checker si encontro el mismo elemento en los 4 arrays

        const smallestStructArr = pStructureRanges[smallestArrIndex];
        var intersectedElements: number[] = [];

        for(let arrIndex = 0; arrIndex < smallestStructArr.length; arrIndex++){ //busca cada elemento del array mas pequeño en los otros arrays, guarda el indice de cada lista cuando lo encuentra
            const songSectionIndex = smallestStructArr[arrIndex];

            var tmpIndex = pStructureRanges[RISE].indexOf(songSectionIndex, riseIndex);
            if(tmpIndex != -1){
                riseIndex = tmpIndex;
                elementChecker[RISE] = true;
            }

            tmpIndex = pStructureRanges[FALL].indexOf(songSectionIndex, fallIndex);
            if(tmpIndex != -1){
                fallIndex = tmpIndex;
                elementChecker[FALL] = true;
            }

            tmpIndex = pStructureRanges[PLATEAU].indexOf(songSectionIndex, plateauIndex);
            if(tmpIndex != -1){
                plateauIndex = tmpIndex;
                elementChecker[PLATEAU] = true;
            }

            tmpIndex = pStructureRanges[VALLEY].indexOf(songSectionIndex, valleyIndex);
            if(tmpIndex != -1){
                valleyIndex = tmpIndex;
                elementChecker[VALLEY] = true;
            }

            for(let checkIndex = 0; checkIndex<elementChecker.length; checkIndex++){ //revisa el element checker
                if(elementChecker[checkIndex] == false){
                    break;
                } else if(checkIndex == 3){
                    intersectedElements.push(songSectionIndex);
                }

            }

            elementChecker = [false, false, false, false];
        }
        return intersectedElements;
    }

    //metodo que compara dos secciones forma por forma
    //retorna el porcentaje de similaridad
    private compareSections(s1Section: SongStructure, s2Section: SongStructure): number{
        var comparisonCounter = 0;
        const sectionLength = s2Section.songStruct.length;

        for(let structureIndex = 0; structureIndex < sectionLength; structureIndex++){
            if(s1Section.songStruct[structureIndex][0] == s2Section.songStruct[structureIndex][0]){
                comparisonCounter++;
            }
        }

        return comparisonCounter/sectionLength;
    }

    //metodo que debia hacer match
    public matchOperation(){
        const s1ChunkStructure = this.analyzeSong(this.s1);
        this.allocateDistributions(s1ChunkStructure);

        for(let i = 0; i < 7000; i++){
            const s2RandomChunk = this.analyzeRandomSample(this.s2);
            const analysisDistrib = s2RandomChunk.calculateDistribution();
            const possibleMatches = this.findDistributionMatches(analysisDistrib);

            for(let matchIndex = 0; matchIndex < possibleMatches.length; matchIndex++){
                if(this.compareSections(s1ChunkStructure[possibleMatches[matchIndex]], s2RandomChunk) > 0.6){
                    //aqui se comprueba que la comparacion no funciona
                }
            }
        }
    }

    

    
}