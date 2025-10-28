import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonService } from '../../../app/services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pokemonesSubscription: Subscription;
  pokemonesDesdeElPadre = {};

  constructor(private _pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.listarNombresDePokemones();
  }

   listarNombresDePokemones() {
    let pokemonesGuardados = this._pokemonService.hayPokemonesGuardados();
    let pokemonesRescatados:any = [];
    
    if(!pokemonesGuardados || typeof pokemonesGuardados == "undefined"){
    this.pokemonesSubscription = this._pokemonService.validarPokemones().subscribe((resp:any) => {
      this.pokemonesDesdeElPadre = resp;
      this._pokemonService.guardarPokemones(resp);
    });
  }else{
        pokemonesRescatados = this._pokemonService.rescatarPokemones();
        this.pokemonesDesdeElPadre = pokemonesRescatados;
  }
  }


  ngOnDestroy() {
    if (this.pokemonesSubscription) {
      this.pokemonesSubscription.unsubscribe();
    }
  }

}
