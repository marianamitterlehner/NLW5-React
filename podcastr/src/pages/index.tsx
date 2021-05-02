import {GetStaticProps} from 'next';
import {format, parseISO} from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

/**Tipagem */
type Episode = {
  /**array de objetos em json */
    id: string;      
    title:string;
    members:string;
    publishedAt: string;
    thumbnail:string;
    url:string;
    type: string;
    duration: number; 
    durationString:string;
}
type HomeProps = {
  /** array de episodes */
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
}

/**Funcao HTML */
export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  //usar o contexto criado e puxado pelo onclick do button
  const {playList} = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}> 
        <h2> Ultimos Lancamentos </h2>
        <ul>
          {latestEpisodes.map((episode, index) =>{
            return (
              <li key={episode.id}>
                <Image width={192} height={192} objectFit="cover" 
                      src={episode.thumbnail} alt={episode.title}/>
                
                <div className={styles.episodesDetails}> 
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt} </span>
                  <span>{episode.durationString}</span>
                </div>
                <button type="button" onClick={() => playList(episodeList, index)} > 
                  <img src="/play-green.svg" alt="play" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      
      <section className={styles.allEpisodes}>
        <h2>Todos os Episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duracao</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return(
                <tr>
                  <td style={{width:95, height:0}} >
                    <Image width={120} height={120} src={episode.thumbnail} 
                          alt={episode.title} objectFit="cover" />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width:100}} >{episode.publishedAt}</td>
                  <td>{episode.durationString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, 
                                                index + latestEpisodes.length)}> 
                      <img src="/play-green.svg" alt="play" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
 
/** getStaticProps - SSG(static-site-generation) */
export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort:'published_at',
      _order: 'desc'
    }
  })
  /** ?_limit=12&_sort=published_at&_order=desc  -> como eu quero que esses dados retornem pela url */
  
  /** formatar os dados que vem do backend */
  const episodes = data.map(episode => {
    return {
      id: episode.id,      
      title: episode.title,
      members:  episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      thumbnail: episode.thumbnail ,
      url: episode.file.url,
      type: episode.file.type,
      duration: Number(episode.file.duration),
      durationString: convertDurationToTimeString(Number(episode.file.duration)), 
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  
  return{
    props:{
      latestEpisodes,
      allEpisodes,
    },
    /**de quanto em quanto tempo a pagina sera atualizada */
    revalidate: 60 * 60 * 8,
  }
}

/** ANNOTATION*/
/**imutabilidade - nao atualiza a informacao mas copia todos os dados
 * dentro de uma variavel e modela a variavel  */ 