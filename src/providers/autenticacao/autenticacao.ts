import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AutenticacaoProvider {

  serverURL = "http://localhost:3000";

  constructor(public http: HttpClient) {
    console.log('Hello AutenticacaoProvider Provider');
  }

  autenticaLogin(nome, senha){

    let data = JSON.stringify({
      nome: nome,
      senha: senha
    });

    return new Promise((resolve, reject)=>{
      this.http.post(this.serverURL+'/autenticaUsuario', data, {headers: {'Content-Type': 'application/json'}})
      .subscribe(res =>{
        resolve(res);
      }, (err)=>{
        reject(err);
      });
    });    
  }

  autenticaCadastro(nomeUsuario, senha){
    let data = JSON.stringify({
      nomeUsuario: nomeUsuario,
      senha: senha
    });    
   return new Promise((resolve, reject)=>{     
      this.http.post(this.serverURL+'/inserirUsuario', data, {headers: {'Content-Type' : 'application/json'}})
      .subscribe(res => {
        resolve(res);
      }, (err)=>{
        reject(err);
      });
    });  
  }

}
