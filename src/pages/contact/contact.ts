import { Component } from '@angular/core';
import { NavController, App, AlertController, ToastController } from 'ionic-angular';
import { SecureStorageProvider } from '../../providers/secure-storage/secure-storage';
import { DadosSensorProvider } from '../../providers/dados-sensor/dados-sensor';
import { LoginPage } from '../login/login';
import { SecureStorage } from '@ionic-native/secure-storage';
import { UpdateDadosProvider } from '../../providers/update-dados/update-dados';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  dadosStorage;
  dadosStorageSenha;
  dados = [];

  constructor(
    private toast: ToastController,
    private updateProvider: UpdateDadosProvider,
    private alertCtrl: AlertController,
    private app: App,
    private dadosSensor: DadosSensorProvider,
    private secureStorage: SecureStorageProvider,
    public navCtrl: NavController) {

      this.dados = [{
        user: 'teste'
      }];

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

  updateUsuario(){
    let alert = this.alertCtrl.create({
      subTitle: 'Mudar nome de usuario',
      inputs: [{
        placeholder: 'Digite o novo nome',
        name: 'nomeUsuario'
      }],
      buttons: [{
        text: 'ok',
        handler: data =>{
          console.log(data.nomeUsuario);
          this.secureStorage.recuperar().then(resp =>{
            this.dadosStorage = resp;
            this.updateProvider.updateUsuario(this.dadosStorage.user, data.nomeUsuario, this.dadosStorage.senha)
            .then(res => {
              if(res == 'updateUsuario'){
                let toast = this.toast.create({
                  message: 'Usuario atualizado com sucesso',
                  duration: 2000,
                  position: 'bottom'
                });
              } else {
                let alert = this.alertCtrl.create({
                  message: 'erro nos dados',
                  buttons: [{text: 'ok'}]
                });
                alert.present();
              }
            });
          });
        }
      },{
        text: 'cancelar'
      }]
    });  
    alert.present();              
  }
  updateSenha(){
    let alert = this.alertCtrl.create({
      subTitle: 'Trocar senha de usuario',
      inputs: [{
        placeholder: 'Digite a nova senha',
        name: 'novaSenha',
        type: 'password'
      }, 
    {
      placeholder: 'Digite a senha antiga',
      name: 'senhaAntiga',
      type: 'password'
    }],
    buttons: [{
      text: 'ok',
      handler: data =>{
        console.log(data.novaSenha);
        console.log(data.senhaAntiga);
        this.secureStorage.recuperar().then(resp =>{
          this.dadosStorageSenha = resp;
          this.updateProvider.updateSenha(this.dadosStorage.user, data.senhaAntiga, data.novaSenha)
          .then(res =>{
            if(res == 'updateSenha'){
              console.log('senha atualizada');
            } else if(res == 'erroUpdateSenha'){
              console.log('senha incorreta');
            }
          });          
        });
      }
    },{
      text: 'cancelar'
    }]
    });
    alert.present();
  }
}
