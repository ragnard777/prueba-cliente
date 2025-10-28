import { Injectable } from '@angular/core';
import { CuPokemonService } from '../caso-de-uso/cu-pokemon.service';
import {Pokemon} from '../models/Pokemon';
import { Observable } from 'rxjs';
import { UtilsService } from '../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private readonly STORAGE_KEY = 'pokemonesFavoritos';

  constructor(private _cuPokemon:CuPokemonService, private utils:UtilsService) { }

  validarPokemones():Observable<any>{
    return new Observable((observer) => {
      let respuesta: any;
      this._cuPokemon.obtenerPokemones().subscribe(resp => {
          let arreglado = this.utils.ordenarArray(resp.results);
          respuesta = { estado: "ok", pokemones:  arreglado, paginacion: resp.results.length };
          observer.next(respuesta);
          observer.complete();
    });
  })
  }

  guardarPokemones(pokemones: any): void {
    try {
      const serializedPokemones = JSON.stringify(pokemones);
      localStorage.setItem(this.STORAGE_KEY, serializedPokemones);
    } catch (error) {
      console.error('Error al guardar en Local Storage', error);
    }
  }

  rescatarPokemones(): Pokemon[] | any {
    try {
      const serializedPokemones = localStorage.getItem(this.STORAGE_KEY);
      
      if (serializedPokemones === null) {
        return [];
      }

    const data = JSON.parse(serializedPokemones);

    if (!Array.isArray(data.pokemones)) {
        console.error("El dato recuperado de Local Storage no es un array.");
        return [];
    }

    const pokemonesMapeados = data.pokemones.map((item:any) => ({
        id: item.id,
        nombre: item.nombre,
        url: item.url
      })) as any[];

      return { 
        estado: "ok", 
        paginacion: data.paginacion, 
        pokemones: pokemonesMapeados 
    };

    } catch (error) {
      console.error('Error al recuperar de Local Storage', error);
      return [];
    }
  }

  hayPokemonesGuardados(): boolean {
    const data = this.rescatarPokemones();
    if (data && data.pokemones && data.pokemones.length >0) {
    return true;
}else{
  return false;
}
  }

  eliminarPokemonesGuardados(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar de Local Storage', error);
    }
  }

  agregarNuevoPokemon(nuevoPokemon: any): void {
    let pokemonesGuardados = this.rescatarPokemones();
    let paginacion = pokemonesGuardados.paginacion;

    let pokemonesActuales: any[];

if (pokemonesGuardados) {

    try {

        if (!Array.isArray(pokemonesGuardados.pokemones)) {
            pokemonesActuales = []; 
        }
        
    } catch (e) {
        console.error("Error al parsear el JSON de pokemones. Inicializando como array vacío.");
        pokemonesActuales = [];
    }
} else {
    pokemonesActuales = []; 
}
    
    let existe = pokemonesGuardados.pokemones.some((p:any) => p.nombre === nuevoPokemon.nombre);
    if (existe) {
      console.warn(`El Pokémon con índice ${nuevoPokemon.id} ya existe y no se añadió.`);
      return; 
    }

    const idNuevo = this.obtenerId(pokemonesGuardados.pokemones);

    pokemonesGuardados.pokemones.push({nombre:nuevoPokemon.nombre,url:nuevoPokemon.url,id:idNuevo});
    this.guardarPokemones({estado:"ok", paginacion:pokemonesGuardados.paginacion, pokemones:pokemonesGuardados.pokemones});
  }

  obtenerId(pokemones:any): number {
  if (pokemones.length === 0) {
    return 0;
  }
  const ultimoId = Math.max(...pokemones.map((p:any) => p.id));
  return ultimoId + 1;
}

  editarPokemon(pokemonEditado: any): boolean {
    let pokemones = this.rescatarPokemones()
    let pokemonesActuales = pokemones.pokemones;
    let indice = pokemones.indice;
    let index = pokemonesActuales.findIndex((p:any) => p.id === pokemonEditado.id);

    if (index !== -1) {
      pokemonesActuales[index] = pokemonEditado;
      this.guardarPokemones({estado:"ok",indice:indice, pokemones:pokemonesActuales});
      return true;
    } else {
      console.error(`No se encontró el Pokémon con índice ${pokemonEditado.id} para editar.`);
      return false;
    }
  }

  eliminarPokemonEspecifico(pokemonId: number): boolean {

  let response = this.rescatarPokemones();
  
  let pokemonesActuales = response.pokemones; 

  const index = pokemonesActuales.findIndex((p:any) => p.id === pokemonId);

  if (index !== -1) {
    pokemonesActuales.splice(index, 1);
    
    const nuevoPokemones = { 
        estado: 'ok', 
        paginacion: response.paginacion,
        pokemones: pokemonesActuales 
    };
    
    this.guardarPokemones(nuevoPokemones); 
    return true;
  } else {
    console.warn(`No se encontró el Pokémon con ID ${pokemonId} para eliminar.`);
    return false;
  }
}

}
