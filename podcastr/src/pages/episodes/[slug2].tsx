import { GetStaticProps, GetStaticPaths } from 'next';
import {useRouter} from 'next/router';
import { api } from '../../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString'
import Link from 'next/link';
import Image from 'next/image';

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
    <h1>{episode.title}</h1>
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