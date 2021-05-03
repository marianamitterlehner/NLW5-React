import { createContext, useState, ReactNode, useContext } from 'react';
import Episode from '../pages/episodes/[slug2]';

/**tipagem */
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
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean; 
  hasPrevious: boolean;
  playList: (list: Episode[], index: number) => void;
  play: (episode:Episode) => void; //tipagem de uma funcao
  playAfter: () => void;
  playBefore: () => void;
  toggleIsPlaying: () => void; 
  toggleIsLooping: () => void; 
  toggleIsShuffling: () => void; 
  clearPlayerState: () => void; 
  playingState: (state: boolean) => void; // retorna o estado  
}
type PlayerContextProviderProps = {
  children: ReactNode;
}

/** exportando o contexto */
export const PlayerContext = createContext({} as PlayContext);

/**exportando a funcao contexto que gera as modificacoes*/
export function PlayerContextProvider({children}:PlayerContextProviderProps){
  //useState de toda aplicacao
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode){
    setEpisodeList([episode]); //pega um unico episodio dentro do array
    setCurrentEpisode(0); // index zerado
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list); //array de episodios 
    setCurrentEpisode(index); // index dos episodios
    setIsPlaying(true);
  }

  /** criar uma variavel para validacao do button */
  const hasNext = isShuffling || (currentEpisode + 1) < episodeList.length
  const hasPrevious = currentEpisode > 0;
  function playAfter(){
    /**verificacao */

    if(isShuffling){
      /**embaralha o index passado pelo episodeList com o random e seta
       * para o currentEpisode
       */
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisode(nextRandomEpisodeIndex);
    }else if(hasNext){
      setCurrentEpisode(currentEpisode + 1);
    }
  }

  function playBefore(){
    if(hasPrevious){
      setCurrentEpisode(currentEpisode - 1);
    } 
  }

  /** funcao de verificacao se esta tocando */
  function toggleIsPlaying(){
    setIsPlaying(!isPlaying);
  }
  /**controla se esta em loop ou nao  */
  function toggleIsLooping(){
    setIsLooping(!isLooping);
  }

  /**controla o shuffle */
  function toggleIsShuffling(){
    setIsShuffling(!isShuffling);
  }

  /**estado do play */
  function playingState(state: boolean){
    setIsPlaying(state);
  }

  /**limpa todo os estados */
  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisode(0);
  }

  /**retorna a funcao pode ser aplicada em volta do app */
  return(
    <PlayerContext.Provider value={{ episodeList, currentEpisode, isPlaying, 
                                      play, toggleIsPlaying, playingState, playList,
                                      playAfter, playBefore, hasPrevious, hasNext,
                                      isLooping, toggleIsLooping,toggleIsShuffling, isShuffling,
                                      clearPlayerState 
                                      }}>
      {children}
    </PlayerContext.Provider>
  )

}

/** exporta uma variavel que contem o useContext(PlayerContext) que 
 * aparece em diversos arquivos, pois ele importava muita coisa
*/
export const usePlay = () =>{
  return useContext(PlayerContext);
}

/** ANNOTATION */
/** {} as PlayContext -  forca (mesmo objeto estando vazio) receber a tipagem*/
/**children e utilizado pois dentro do PlayerContext.Provider tem um conteudo
 * passando vindo do app, assim passando todo o conteudo do app para o context
*/
/** ReactNode - propriedade para retornar qualquer elemento vindo do children 
 * que o react aceitaria vindo do jsx
*/

