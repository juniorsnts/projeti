import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UpdateDadosProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UpdateDadosProvider Provider');
  }

  //serverURL = "http://projetimeta.duckdns.org:3006";
  serverURL = "http://10.0.0.2:3000";


  updateUsuario(antigoNome, novoNome, senha){  
    let data = JSON.stringify({
      antigoNome: antigoNome,
      novoNome: novoNome,
      senha: senha
    });
    return new Promise((resolve, reject)=>{
      this.http.post(this.serverURL+"/updateUsuario", data, {headers: {'Content-Type': 'application/json'}})
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
    return new Promise((resolve, reject) =>{
      this.http.post(this.serverURL+'/updateSenha', data, {headers: {'Content-Type': 'application/json'}})  
      .subscribe(resp =>{
        resolve(resp);
      }, (err) =>{
        resolve("errorUpdateSenha");
      });    
    });
  }

}
