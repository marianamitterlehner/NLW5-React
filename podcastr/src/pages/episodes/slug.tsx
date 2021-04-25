import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

/**Tipagem */
type Episode = {
  /**array de objetos */
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
type EpisodeProps = {
  /** episodes */
  ep: Episode;
}

export default function Episode({ ep }:EpisodeProps) {
  return(
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href={`/`}>
          <button type="button">
            <img src="/arrow-left.svg" alt="voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={ep.thumbnail} alt={ep.title} objectFit="cover" />
        <button type="button">
          <img src="/play.svg" alt="tocar ep" />
        </button>
      </div>
      <header>
        <h1>{ep.title}</h1>
        <span>{ep.members}</span>
        <span>{ep.publishedAt}</span>
        <span>{ep.durationString}</span>
      </header>
      <div className={styles.description} dangerouslySetInnerHTML={{__html: ep.description}}></div>
    </div>
  )
}
/**dangerouslySetInnerHTML =  quando quero forcar ao arquivo json mostre os dados em html */


/** quando vou estilizar arquivos dinamicos utilizo GetStaticPaths */
export const getStaticPaths: GetStaticPaths =  async () =>{
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
  /**como n posso pegar o dados direto do useRouter eu vou passar um contexto(ctx) para puxar os dados do slug que vem da url */
  const {slug} = ctx.params; /**slug e o nome do arquivo / onde eu quero buscar os dados*/
  const {data} = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,      
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    type: data.file.type,
    duration: Number(data.file.duration),
    durationString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: {
      episode,
    }, 
    revalidate: 60 * 60 * 24 //24h
  }
}

