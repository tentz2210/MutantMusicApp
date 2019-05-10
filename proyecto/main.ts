/**
 * Hans Fernandez Murillo
 * 2016193340
 */

import * as fs from 'fs';
import * as WavDecoder from 'wav-decoder';
import { MutantMusic } from './MutantMusicApp';


const readFile = (filepath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};

//funcion utilizada para leer los archivos de audio en el sistema
async function readWav(filepathS1: string, filepathS2: string){
  const bufferS1 = await readFile(filepathS1);
  const audioDataS1 = await WavDecoder.decode(bufferS1);

  const bufferS2 = await readFile(filepathS2);
  const audioDataS2 = await WavDecoder.decode(bufferS2);
  return [audioDataS1, audioDataS2];
}



const filepathS1 = "C:\\Users\\tentz\\Desktop\\proyecto\\Lavender Buds.wav";
const filepathS2 = "C:\\Users\\tentz\\Desktop\\proyecto\\Lavender Buds_normal_sample.wav";

//main start
readWav(filepathS1, filepathS2).then((audioDataArray) => {

  const test = new MutantMusic(audioDataArray[0], audioDataArray[1]);

  test.matchOperation();

});