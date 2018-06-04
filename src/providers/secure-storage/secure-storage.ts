import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { AutenticacaoProvider } from '../autenticacao/autenticacao';



@Injectable()
export class SecureStorageProvider {
  
  myStorage = null;
  user;
  
  constructor(
    private autenticaLogin: AutenticacaoProvider,
    private secureStorage: SecureStorage,
    public http: HttpClient) {

      this.secureStorage.create('storageCadastro').then((storage: SecureStorageObject) =>{
        this.myStorage = storage;
      });
  } 

  cadastro(usuario, senha){   
      this.user = JSON.stringify({user:usuario, senha:senha});
      console.log("data: ",JSON.stringify(this.user)) 

      this.myStorage.set('usuario', this.user).then(
        data =>{
          console.log("data: ",data)  
        },
        error => console.log("erro secureStorage recuperar: ",error)
      );
  }

  recuperar(){    

    return new Promise((resolve, reject) =>{
      if(this.myStorage != null){
        this.myStorage.get('usuario').then(
          data => {
            this.user = JSON.parse(data);
            console.log(this.user);
            this.autenticaLogin.autenticaLogin(this.user.user, this.user.senha).then(resp =>{
              if(resp == 'sucesso'){
                resolve("existe");
              } else if(resp == 'noExiste'){
                resolve('noExiste');
              }else if(resp == 'erroAuth'){
                resolve('erroAuth');
              }
            });                        
          },
          error => {
            resolve('noExiste')
            console.log("error secureStorage recuperar: ",error);
      });
      }
      else {
        resolve('Storage nulo');                                                                
      }
    });

  }

  remover(){
    return new Promise((resolve, reject) =>{
      if(this.myStorage != null){
        this.myStorage.remove('usuario').then(
          data => {
            resolve("removido");
          },
          error => {
            console.log("erro no remover (erro no mystorage)");
            resolve("erro");
          }
        )
      } else {
        console.log("erro no remover(storage nulo)");
        resolve('Storage nulo');
      }
    });
  }

}
