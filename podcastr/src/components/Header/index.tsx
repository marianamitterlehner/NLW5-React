import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from  './styles.module.scss';

export default function Header() {

/**formatacao da data */
const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
  locale: ptBR
});

  return (
    <header className={styles.headerContainer}> 
      <img src="/logo.svg" alt="Podcastr"/>
      <p> Suas musicas em um so lugar </p>
      <span>{currentDate}</span>
    </header>
  );
}

