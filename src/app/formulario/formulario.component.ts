import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  @Input() pokemonId: number | string | undefined;
  checkoutForm;
  formGroup:any;
  titulo:string = '';
  nombre_boton = 'Agregar';
  id: any;

  constructor(private _formBuilder: FormBuilder, private pokemonService_:PokemonService,private router: Router) {
    this.checkoutForm = this._formBuilder.group({
      nombre: [ '', Validators.required],
      url: ['', [
        Validators.required
      ]]
    });
   }

  ngOnInit(): void {
    console.log('pokemon id', this.pokemonId );
    
    if(typeof this.pokemonId != 'undefined' || this.pokemonId != null){
      this.id = this.pokemonId;
      this.nombre_boton = 'Editar';
    }else{
     this.nombre_boton = 'Agregar';
    }

  }

  onSubmit(customerData:any) {
    if(this.checkoutForm.valid){
     console.log("customerData",customerData);
     this.guardarPokemon(customerData);
     this.checkoutForm.reset();
    }else{
      console.warn("El formulario no es valido !!")
    }
    
  }

  guardarPokemon(customerData:any){
    if(typeof this.pokemonId != 'undefined'){
      const pokemon:any = {nombre:customerData.nombre, url:customerData.url,id:this.pokemonId}
      console.log("pokemon ",pokemon);
      
      this.pokemonService_.editarPokemon(pokemon);
       console.log("porkemon editado");
    }else{
      this.pokemonService_.agregarNuevoPokemon(customerData);
      console.log("porkemon guardado");
    }
    this.irHome();
  }

  irHome(){
    this.router.navigate(['/home']);
  }


}
