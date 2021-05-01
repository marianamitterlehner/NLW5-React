import { createContext } from 'react';
import Episode from '../pages/episodes/[slug2]';

type Episode = {   
  title:string;
  members:string;
  thumbnail:string;
  url:string;
  duration: number; 
}

type PlayContext = {
  episodeList: Array<Episode>;
  currentEpisode: number;
  isPlaying: boolean; //para saber se o ep ta tocando
  play: (episode: Episode) => void; //tipagem de uma funcao
  toggleIsPlaying: () => void; 
  playingState: (state: boolean) => void; // retorna o estado  

}

export const PlayerContext = createContext({} as PlayContext);

/** ANNOTATION */
/** {} as PlayContext -  forca (mesmo objeto estando vazio) receber a tipagem*/