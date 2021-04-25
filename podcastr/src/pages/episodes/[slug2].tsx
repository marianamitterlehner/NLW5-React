import { GetStaticProps, GetStaticPaths } from 'next';
import {useRouter} from 'next/router';
import { api } from '../../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString'
import Link from 'next/link';
import Image from 'next/image';

import styles from './episode.module.scss';

type Episode = {
    id: string;      
    title:string;
    members:string;
    publishedAt: string;
    thumbnail:string;
    url:string;
    type: string;
    description:string;
    duration: number; 
    durationString:string;
}
type EpisodeProps = {
  episode: Episode;
}

export default function Episode({episode}:EpisodeProps) {
  return(
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href={`/`}>
          <button type="button">
            <img src="/arrow-left.svg" alt="voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
        <button type="button">
          <img src="/play.svg" alt="tocar episode" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationString}</span>
      </header>
      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}></div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return{
    paths: [],
    fallback:'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
  const {slug2} = ctx.params; 
  /**como n posso pegar o dados direto do useRouter eu vou passar um contexto(ctx) 
   * para puxar os dados do slug que vem da url */
/**slug e o nome do arquivo / onde eu quero buscar os dados*/
  const {data} = await api.get(`/episodes/${slug2}`)

  const episode = {
    id: data.id,      
    title: data.title,
    members:  data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    thumbnail: data.thumbnail ,
    url: data.file.url,
    type: data.file.type,
    description: data.description,
    duration: Number(data.file.duration),
    durationString: convertDurationToTimeString(Number(data.file.duration)), 
  };

  return {
    props:{
      episode
    },
    revalidate: 60 * 60 * 24 //24h
  }
}

/**dangerouslySetInnerHTML =  quando quero forcar ao arquivo json mostre os dados em html */
/** quando vou estilizar arquivos dinamicos utilizo GetStaticPaths */