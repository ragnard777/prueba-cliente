import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-pokemon',
  templateUrl: './edit-pokemon.component.html',
  styleUrls: ['./edit-pokemon.component.css']
})
export class EditPokemonComponent implements OnInit {

  pokemonId: number | string | null = null;
  pokemonId_: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id'); // Obtiene el valor del parámetro 'id'
      console.log('ID del Pokémon a editar:', this.pokemonId);
      if (this.pokemonId) {
        // Convierte a número si es necesario para tu lógica
        this.pokemonId_ = +this.pokemonId; 

      }
    });
  
  }

}
