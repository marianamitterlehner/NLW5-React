import { createContext, useState, ReactNode } from 'react';
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
  play: (episode: Episode) => void; //tipagem de uma funcao
  toggleIsPlaying: () => void; 
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

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisode(0);
    setIsPlaying(true);
  }

  function toggleIsPlaying(){
    setIsPlaying(!isPlaying);
  }

  function playingState(state: boolean){
    setIsPlaying(state);
  }
  /**retorna a funcao pode ser aplicada em volta do app */
  return(
    <PlayerContext.Provider value={{ episodeList, currentEpisode, isPlaying, 
                                      play, toggleIsPlaying, playingState }}>
      {children}
    </PlayerContext.Provider>
  )

}

/** ANNOTATION */
/** {} as PlayContext -  forca (mesmo objeto estando vazio) receber a tipagem*/
/**children e utilizado pois dentro do PlayerContext.Provider tem um conteudo
 * passando vindo do app, assim passando todo o conteudo do app para o context
*/
/** ReactNode - propriedade para retornar qualquer elemento vindo do children 
 * que o react aceitaria vindo do jsx
*/

