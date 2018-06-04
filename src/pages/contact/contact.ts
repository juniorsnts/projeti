import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { SecureStorageProvider } from '../../providers/secure-storage/secure-storage';
import { DadosSensorProvider } from '../../providers/dados-sensor/dados-sensor';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(
    private app: App,
    private dadosSensor: DadosSensorProvider,
    private secureStorage: SecureStorageProvider,
    public navCtrl: NavController) {

  }


  logout(){
    this.secureStorage.remover().then(resp =>{
      if(resp == "removido" ){
        this.dadosSensor.disconnect().then(resp=>{
          if(resp == "desconectado"){
              this.navCtrl.setRoot('login');
              this.app.getRootNav().setRoot('login');
          }else{
            console.log("Erro para desconectar");
          }
        })
      }else if(resp == "erro"){
        console.log("Erro no secureStorage");
      }else if(resp == "Storage nulo"){
        console.log("Estorage nulo");
      }
    });


  }
}
