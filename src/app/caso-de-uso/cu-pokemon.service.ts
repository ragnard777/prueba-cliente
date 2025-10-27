import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import {endpoints} from '../constanst/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CuPokemonService {

  constructor(private _http: HttpClient) { }


  obtenerPokemones(): Observable<any> {
    let response: Observable<any>;
    const url = endpoints.URL;
    const params: any = {};
    params.url = url;
    params.HttpOptions = {
        params: {
          offset: '0',
          limit: '151'
        }
    };
    response = this._http.get(params.url, params.HttpOptions);
    console.log("Estoy en el caso de uso", response);
    return response;
}
}
