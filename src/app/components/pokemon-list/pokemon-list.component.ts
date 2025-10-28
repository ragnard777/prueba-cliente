import { Component, OnInit, ViewChild, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';



@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, AfterViewInit {

  pokemonesSubscription: Subscription;
  paginacion;
  displayedColumns: string[] = ['id','nombre', 'url', 'accion']
  datasource: any;
  selection = new SelectionModel<any>(true, []);
  resetPokemon = [];
  eliminadodsPokemon = [];
  @Input() _pokemonesDesdeElHijo = {};
  pokemonesLocal = {};
  largoListaPokemon = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _pokemonService: PokemonService,private router: Router) { }

  ngOnInit(): void {
    this.listarNombresDePokemones();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.pokemonesLocal = this._pokemonesDesdeElHijo;
}


  listarNombresDePokemones() {

    let pokemonesGuardados = this._pokemonService.hayPokemonesGuardados();
    if(!pokemonesGuardados || typeof pokemonesGuardados == "undefined"){
      console.log('no tengo pokemones guardados, asi que pido una lista nueva.');
    this.pokemonesSubscription = this._pokemonService.validarPokemones().subscribe((resp:any) => {
       this.pokemonesLocal = resp;
       this._pokemonService.guardarPokemones(resp);
      this.inicializacionDeVariables(resp);
      this.setearPaginator();
    });
    } else{
      console.log(' tengo pokemones guardados, asi que los pido .');
      
        this.pokemonesLocal = this._pokemonService.rescatarPokemones();
        this.inicializacionDeVariables(this.pokemonesLocal);
        this.setearPaginator();
  }
  }

  eliminarPokemon(pokemon:any) {
    console.log("eliminarpokemon variable pokemon ",pokemon)
    
    this._pokemonService.eliminarPokemonEspecifico(pokemon.id);
                     this.datasource = new MatTableDataSource<Element>(this.datasource.pokemones);
        setTimeout(() => {
          this.datasource.paginator = this.paginator;
        }); 
        this.listarNombresDePokemones();
  }

  eliminamosYActualizamosPaginacion(nombre:any) {
    this.datasource.pokemones.forEach((element, i) => {
      if (element.nombre.indexOf(nombre) !== -1) {
        this.datasource.pokemones.splice(i, 1);
        this.datasource = new MatTableDataSource<Element>(this.datasource.pokemones);
        setTimeout(() => {
          this.datasource.paginator = this.paginator;
        });
      }
    });
  }

  buscarPokemon(e) {
    let nombre = e.target.value;
    let ultimaLetra = e.key;
    if (ultimaLetra == "Backspace") {
      this.datasource = new MatTableDataSource<Element>(this.resetPokemon);
      setTimeout(() => {
        this.datasource.paginator = this.paginator;
      });
    }
    if (nombre !== "") {
      let result = this.datasource.data.filter(item => item.nombre.indexOf(nombre) !== -1);
      this.datasource = new MatTableDataSource<Element>(result);
      setTimeout(() => {
        this.datasource.paginator = this.paginator;
      });
    }
  }

  ngAfterViewInit(): void {
    this.setearPaginator();
  }

  setearPaginator() {
    this.datasource.paginator = this.paginator;
  }

  inicializacionDeVariables(resp) {
    this.paginacion = resp.paginacion;
    this.datasource = new MatTableDataSource<any>(resp.pokemones);
    this.resetPokemon = resp.pokemones;
  }

  actualizarEnElArrayAuxiliar(nombre) {
    this.resetPokemon.forEach((element, i) => {
      if (element.name.indexOf(nombre) !== -1) {
        this.resetPokemon.splice(i, 1);
      }
    });
  }

  editarPokemon(id: number | string): void {
    this.router.navigate(['/edit-pokemon', id]);
  }

  agregarPokemon(){
    this.router.navigate(['/add-pokemon']);
  }

  eliminarPokemones(){
    this._pokemonService.eliminarPokemonesGuardados();
    this.listarNombresDePokemones();
  }


  ngOnDestroy() {
    if (this.pokemonesSubscription) {
      this.pokemonesSubscription.unsubscribe();
    }
  }

}
