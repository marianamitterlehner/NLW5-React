import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { usePlay } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export default function Player(){


  /** vai armazenar em segundos quanto ja se passou do video */
  const [progress, setProgress] = useState(0);

  function setupProgressListener(){
    audioRef.current.currentTime = 0; //zera o tempo atual;
    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress( Math.round(audioRef.current.currentTime) ); //retorna o tempo atual do player
    })
  }

  /**funcao do slider que reflete o progresso
   * onde pega o tempo atual do ep e reflete no slider
   */
  function handleSeek(amount:number){
    audioRef.current.currentTime = amount;
    setProgress(amount); // mantem o valor tb dentro da variavel do quanto o ep ja pecorreu
  }

  /**quando chega ao fim um episodio */
  function handleEnded(){
    if(hasNext){
      playAfter();
    }else{
      clearPlayerState();
    }
  }


  //puxa o contexto e utiliza como uma => passando o episodeList e currentEpisode
  const {episodeList, currentEpisode, isPlaying, toggleIsPlaying, playingState, 
          playAfter, playBefore, hasPrevious, hasNext, isLooping, toggleIsLooping,
          toggleIsShuffling, isShuffling, clearPlayerState
        } = usePlay();
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
          <Image width={592} height={592} src={episode.thumbnail} 
                  alt={episode.title} objectFit="cover" />
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
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider} >
            {episode ? (
              <Slider
                onChange={handleSeek}
                max={episode.duration} //maximo do ep 
                value={progress} //o quanto o ep ja progrediu
                handleStyle={{borderWidth:2}}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span> 
        </div>
        {/*tag de audio*/ }
        {episode && (
          <audio src={episode.url} 
                ref={audioRef} 
                autoPlay 
                onEnded = {handleEnded}
                onLoadedMetadata = {setupProgressListener}
                loop={isLooping} /*tag de loop do proprio html puxando a 
                                        funcao de controle(estado) do isLooping*/ 
                onPlay={() => playingState(true)} 
                onPause={() => playingState(false)} 
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleIsShuffling} 
            /**toggleIsShuffling - funcao de entra e sai do shuffle */
            className={isShuffling ? styles.Active : ''}>
            <img src="/shuffle.svg" alt="shuffle" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playBefore}>
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
          <button type="button" disabled={!episode || !hasNext} onClick={playAfter}>
            <img src="/play-next.svg" alt="play-next" />
          </button>
          <button type="button" disabled={!episode} onClick={toggleIsLooping} 
            /**toggleIsLooping - funcao de entra e sai do looping */
            className={isLooping ? styles.Active : ''} >
            <img src="/repeat.svg" alt="repeat" />
          </button>
        </div>
      </footer>
    </div>
  )
}