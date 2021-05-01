import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import Header from '../components/Header'
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';
import { useState } from 'react';


function MyApp({ Component, pageProps }) {

  //useState de toda aplicacao
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode){
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

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisode, isPlaying, play, toggleIsPlaying, playingState }}> 
      <div className={styles.appWrapper}> 
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  ); 
}

export default MyApp

/** ANNOTATION */
/** wrapper  Uma wrapper class é uma classe que "embrulha", envolve, 
 * outros objetos afim de adicionar algum atributo ao conjunto ou melhor 
 * organizar seu código. */
/** arquivo global que envolve todos os meus arquivos */
/**</PlayerContext.Provider> em volta de todos os elementos afetados pelo contexto */
/** o play passa pelo contexto para se ter acesso a ele pela home */