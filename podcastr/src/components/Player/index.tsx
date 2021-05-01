import { useContext, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import {PlayerContext} from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function Player(){

  //puxa o contexto e utiliza como uma => passando o episodeList e currentEpisode
  const {episodeList, currentEpisode, isPlaying, toggleIsPlaying, playingState} = useContext(PlayerContext);
  const episode = episodeList[currentEpisode]

  //referencia de audio
  const audioRef = useRef<HTMLAudioElement>(null); // ate o elemento audio ser tocado em tela

  //useEffect -> ativa toda vez que os isPlaying tiver o valor alterado
  useEffect(() => {
    //nao retorna nada quando a variavel estiver vazia
    if(!audioRef.current){
      return;
    }

    // condicao quando estiver um elemento dentro da variavel
    if(isPlaying){
      audioRef.current.play(); //play
    }else {
      audioRef.current.pause(); //pause
    }

  }, [isPlaying]);

  return (
    
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="playing" />
        <strong><b>Tocando agora</b> <br/> {episode?.title}  </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
          <div className={styles.emptyPlayerContainer}>
            <strong> Selecione o podcast para ouvir! </strong>
          </div>
      )}

      <footer className={!episode ?styles.empty : '' }>
        <div className={styles.progress}>
          <span>{}</span>
          <div className={styles.slider} >
            {episode ? (
              <Slider
                handleStyle={{borderWidth:2}}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>{}</span> 
        </div>
         {/*tag de audio*/ }
        {episode && (
          <audio src={episode.url} 
                ref={audioRef} 
                autoPlay 
                onPlay={() => playingState(true)} 
                onPause={() => playingState(false)} 
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="shuffle" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="play-previous" />
          </button>
          <button type="button" 
                  className={styles.playButton} 
                  disabled={!episode} 
                  onClick={toggleIsPlaying}>
            { isPlaying 
                ? <img src="/pause.svg" alt="play" />
                : <img src="/play.svg" alt="play" />
            }
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="play-next" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="repeat" />
          </button>
        </div>
      </footer>
    </div>
  )
}