import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import Header from '../components/Header'
import Player from '../components/Player';


function MyApp({ Component, pageProps }) {

  return (
    <div className={styles.appWrapper}> 
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  ); 
}

export default MyApp

/** ANNOTATION */
/** wrapper  Uma wrapper class é uma classe que "embrulha", envolve, 
 * outros objetos afim de adicionar algum atributo ao conjunto ou melhor 
 * organizar seu código. */
/** arquivo global que envolve todos os meus arquivos */