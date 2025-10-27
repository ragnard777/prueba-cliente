import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  constructor() { }

  ordenarArray(items){
  items.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  return this.agregarIndex(items);
}

agregarIndex(pokemones){
  let resultado = [];
  pokemones.forEach((element,i) => {
    console.log("indice", i);
    resultado.push({id:i,nombre:element.name, url:element.url});
  });
  return resultado;
}

eliminarPokemon(){

}


}
