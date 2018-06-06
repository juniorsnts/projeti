import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UpdateDadosProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UpdateDadosProvider Provider');
  }

  updateUsuario(antigoNome, novoNome, senha){  
    let data = JSON.stringify({
      antigoNome: antigoNome,
      novoNome: novoNome,
      senha: senha
    });
    const serverURL = "http://projetimeta.duckdns.org:3006"; 
    return new Promise((resolve, reject)=>{
      this.http.post(serverURL+"/updateUsuario", data, {headers: {'Content-Type': 'application/json'}})
      .subscribe(resp =>{
        resolve(resp);
      }, (err) => {
        resolve("errorUpdate");
      });      
    });
  }

  updateSenha(nomeUsuario, senhaAntiga, novaSenha){
    let data = JSON.stringify({
      nomeUsuario: nomeUsuario,
      senhaAntiga: senhaAntiga,
      novaSenha: novaSenha      
    });
    const serverURL = "http://projetimeta.duckdns.org:3006"; 
    return new Promise((resolve, reject) =>{
      this.http.post(serverURL+'/updateSenha', data, {headers: {'Content-Type': 'application/json'}})  
      .subscribe(resp =>{
        resolve(resp);
      }, (err) =>{
        resolve("errorUpdateSenha");
      });    
    });
  }

}
