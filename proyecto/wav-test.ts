/**
 * Filename: wav-test.ts
 * Author: rnunez
 * Date: 04/10/2019
 * Description: testing wav encoder
 */

import * as fs from 'fs';
// import { complex as fft } from 'fft';
import * as WavEncoder from 'wav-encoder';
// import { default as ft } from 'fourier-transform';
import * as WavDecoder from 'wav-decoder';
import { SongStructure } from './SongStructure';
import { MutantMusic } from './MutantMusicApp';


async function readWav(filepathS1: string, filepathS2: string){
  const bufferS1 = await readFile(filepathS1);
  const audioDataS1 = await WavDecoder.decode(bufferS1);

  const bufferS2 = await readFile(filepathS2);
  const audioDataS2 = await WavDecoder.decode(bufferS2);
  return [audioDataS1, audioDataS2];
}

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

const filepathS1 = "C:\\Users\\tentz\\Desktop\\proyecto\\Lavender Buds.wav";
const filepathS2 = "C:\\Users\\tentz\\Desktop\\proyecto\\Lavender Buds_short.wav";


readWav(filepathS1, filepathS2).then((audioDataArray) => {
  const s1 = new SongStructure(audioDataArray[0], 402, 1000);
  const s2 = new SongStructure(audioDataArray[1], 400, 1000);

  const test = new MutantMusic(audioDataArray[0], audioDataArray[1]);

  test.matchOperation();

  console.log(s1.calculateDistribution());

});


/*readFile("C:\\Users\\tentz\\Desktop\\proyecto\\smalltest.wav").then((buffer) => {
  return WavDecoder.decode(buffer);
}).then(function(audioData){
  const s1 = new SongStructure(audioData);
                      
  songStructures.push(s1);
  console.log(songStructures[0].dominantStruct);
  });
*/

/*
const audioData2 = readFile("C:\\Users\\tentz\\Desktop\\proyecto\\smalltest2.wav").then((buffer) => {
  return WavDecoder.decode(buffer);})

s2 = new SongStructure(audioData2);
*/

/*

readFile("C:\\Users\\tentz\\Desktop\\proyecto\\smalltestfor3.wav").then((buffer) => {
  return WavDecoder.decode(buffer);
}).then(function(audioData) {
  console.log("test rodri");

  /*
  for(var i=0; i<30; i++) {
    console.log(audioData.channelData[0][i]);
    console.log(audioData.channelData[1][i]);
    console.log('*******************');
  }

  // for(var i=0; i<audioData.channelData[0].length; i++) {
  //   audioData.channelData[1][i]+=audioData.channelData[0][i];
  //   audioData.channelData[0][i]*=20;
  //   audioData.channelData[0][i]+=0.000000259254;
  // }

  for(var i=44100*5; i<44100*110; i++) {
    audioData.channelData[0][i-44100*5] = audioData.channelData[0][i];
  }

  for(var i=44100*11; i<44100*16; i++) {
    audioData.channelData[0][i+44100*6] = audioData.channelData[0][i];
  }
*/

  /*
  
  console.log("wav test" +audioData.channelData[0].length);
  const testSong = new SongStructure(audioData);
  console.log("writing...");
  WavEncoder.encode(audioData).then((buffer: any) => {
    fs.writeFileSync("C:\\Users\\tentz\\Desktop\\proyecto\\Lavender Buds_new.wav", new Buffer(buffer));
  });

});

*/



