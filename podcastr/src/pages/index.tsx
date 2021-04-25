import {GetStaticProps} from 'next';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

/**Tipagem */
type Episode = {
  /**array de objetos em json */
    id: string;      
    title:string;
    members:string;
    publishedAt: string;
    thumbnail:string;
    description:string;
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

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}> 
        <h2> Ultimos Lancamentos </h2>

        <ul>
          {latestEpisodes.map(episode =>{
            return (
              <li key={episode.id}>
                <img src={episode.thumbnail} alt={episode.title}/>
                <div className={styles.episodesDetails}> 
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt} </span>
                  <span>{episode.durationString}</span>
                </div>
                <button type="button"> 
                  <img src="/play-green.svg" alt="play" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>


      </section>
    </div>
  )
}
 
/** getStaticProps - SSG(static-site-generation) */
export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes', {
    params: {
      _limit: 5,
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
      description: episode.description,
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
