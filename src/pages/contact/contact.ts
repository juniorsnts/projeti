import { Component } from '@angular/core';
import { NavController, App, AlertController, ToastController } from 'ionic-angular';
import { SecureStorageProvider } from '../../providers/secure-storage/secure-storage';
import { DadosSensorProvider } from '../../providers/dados-sensor/dados-sensor';
import { LoginPage } from '../login/login';
import { UpdateDadosProvider } from '../../providers/update-dados/update-dados';
import SHA_256 from 'sha256';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  dadosStorage;
  dadosStorageSenha;
  sensor;
  estado;

  constructor(
    private toastCtrl: ToastController,
    private background: BackgroundMode,
    private toast: ToastController,
    private updateProvider: UpdateDadosProvider,
    private alertCtrl: AlertController,
    private app: App,
    private dadosSensor: DadosSensorProvider,
    private secureStorage: SecureStorageProvider,
    public navCtrl: NavController) {

      this.estado = "aberta";

      this.dadosSensor.receberStatus().then(resp =>{
          this.sensor = resp;
      });

      this.dadosSensor.getStatusSensor().subscribe(resp =>{
          this.sensor = resp;
      });


  }

  statuSsensor(sensor){

      console.log("Status sensor" + sensor);
      this.dadosSensor.EnviarStatus(this.sensor).then(resp =>{
        if(resp == true){
          let toast = this.toastCtrl.create({
            message: 'Sensor ativado Com sucesso.',
            duration: 2000,
            position: 'bottom'
          });        
          toast.present();
        }else if(resp == false){
          let toast = this.toastCtrl.create({
            message: 'Sensor desativado Com sucesso.',
            duration: 2000,
            position: 'bottom'
          });        
          toast.present();
        }else{
          let alert = this.alertCtrl.create({
            subTitle: 'Erro na comunicação com o Sensor.',
            buttons: [{
              text: 'ok',
            }]
          });  
          alert.present(); 
        }
        
        
      });
  }


  logout(){
    this.secureStorage.remover().then(resp =>{
      if(resp == "removido" ){
        this.dadosSensor.disconnect().then(resp=>{
          if(resp == "desconectado"){
            this.background.disable();
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
                this.secureStorage.remover();
                this.secureStorage.cadastro(data.nomeUsuario, this.dadosStorage.senha);
                console.log(data.nomeUsuario, this.dadosStorage.senha);
                let toast = this.toast.create({
                  message: 'Usuario atualizado com sucesso',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present();
              } else if(resp == 'erroUpdate') {
                let alert = this.alertCtrl.create({
                  message: 'erro nos dados',
                  buttons: [{text: 'ok'}]
                });
                alert.present();
              } else {
                let alert = this.alertCtrl.create({
                  message: 'erro inesperado',
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
    let alert4 = this.alertCtrl.create({
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
        let senhaNovaCript = SHA_256(data.novaSenha);
        let senhaAntigaCript = SHA_256(data.senhaAntiga);  
        console.log(senhaNovaCript);
        console.log(senhaAntigaCript);      
        this.secureStorage.recuperar().then(resp =>{
          this.dadosStorageSenha = resp;
          if(senhaNovaCript == this.dadosStorageSenha.senha){
            console.log('Essa ja é sua senha atual');
          } else if(senhaNovaCript != this.dadosStorageSenha.senha){
            this.updateProvider.updateSenha(this.dadosStorageSenha.user, senhaAntigaCript, senhaNovaCript)
            .then(resp =>{
              console.log(resp);
              if(resp == 'updateSenha'){
                this.secureStorage.remover();
                this.secureStorage.cadastro(this.dadosStorageSenha.user, senhaNovaCript);
                let toast = this.toast.create({
                  message: 'Senha atualizada com sucesso',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present();
              } else if(resp == 'erroUpdateSenha'){
                let alert2 = this.alertCtrl.create({
                  subTitle: 'Ocorreu um erro nos dados do updateSenha',
                  buttons: [('ok')]
                });
                alert2.present();
              } else {
                let alert3 = this.alertCtrl.create({
                  subTitle: 'Ocorreu um erro inesperado no updateSenha',
                  buttons: [('ok')]
                });
                alert3.present();
              }          
            });
          }
        });
      }
    },{
      text: 'cancelar'
    }]
    });
    alert4.present();
  }
}
