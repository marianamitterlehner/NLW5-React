
export function convertDurationToTimeString(duration: number){
  const hour = Math.floor(duration / 3600);  
  const minute = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const time = [hour, minute, seconds].map(s => String(s).padStart(2, '0')).join(':'); 
  return time;
}

/** ANNOTATION */
/**60 segundos x 60 minutos = 3600 segundos. 
  Então uma hora é composta de 3600 segundos. 
  Então, para fazer este cálculo basta dividir 
  a quantidade de segundos por 3600 e você terá o resultado. */