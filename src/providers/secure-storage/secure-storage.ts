import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Injectable()
export class SecureStorageProvider {

  myStorage = null;
  user;

  constructor(
    private secureStorage: SecureStorage,
    public http: HttpClient) {

      this.secureStorage.create('storageCadastro').then((storage: SecureStorageObject) =>{
        this.myStorage = storage;
      });
  }

  cadastro(usuario, senha){
    this.secureStorage.create('storageCadastro').then((storage: SecureStorageObject) =>{
      this.myStorage = storage;
      this.user = JSON.stringify({user:usuario, senha:senha});
      console.log("data: ",JSON.stringify(this.user))

      this.myStorage.set('usuario', this.user).then(
        data =>{
          console.log("data: ",data)
        },
        error => console.log("erro secureStorage recuperar: ",error)
    
    );
  });
  }

  recuperar(){

    return new Promise((resolve, reject) =>{
      this.secureStorage.create('storageCadastro').then((storage: SecureStorageObject) =>{
        this.myStorage = storage;
        this.myStorage.get('usuario').then(
          data => {
            this.user = JSON.parse(data);
            resolve(this.user);
          },
          error => {
            resolve('noExiste');
            console.log("error secureStorage recuperar: ",error);
      });
      });
    });

  }

  remover(){
    return new Promise((resolve, reject) =>{
      this.secureStorage.create('storageCadastro').then((storage: SecureStorageObject) =>{
        this.myStorage = storage;
        this.myStorage.remove('usuario').then(
          data => {
            resolve("removido");
          },
          error => {
            console.log("erro no remover (erro no mystorage)");
            resolve("erro");
          }
        )
      });
    });
  }

}
