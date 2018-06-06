import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SecureStorageProvider } from '../providers/secure-storage/secure-storage';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { Socket } from 'ng-socket-io';
import { DadosSensorProvider } from '../providers/dados-sensor/dados-sensor';
import { AutenticacaoProvider } from '../providers/autenticacao/autenticacao';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  user;

  serverURL = "http://projetimeta.duckdns.org:3006";

  constructor(
    autenticacaoProvider: AutenticacaoProvider,
    dadosSensor: DadosSensorProvider,
    alertCtrl: AlertController,
    socket: Socket,
    secureStorage: SecureStorageProvider,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen) {
    platform.ready().then(() => {


      statusBar.styleDefault();
      splashScreen.hide();

      socket.disconnect();
      
      secureStorage.recuperar().then(resp =>{
        this.user = resp;
        autenticacaoProvider.autenticaLogin(this.user.user, this.user.senha).then(resp => {
          if(resp == 'sucesso'){
            console.log("resp ",resp);
          dadosSensor.connect().then(connect =>{
            if(connect == "conectado"){
             this.rootPage = TabsPage;
            }else{
            this.rootPage = 'login';
             let alert = alertCtrl.create({
               title: 'Erro de socket',
               subTitle: 'Não foi possivel conectar ao socket.',
               buttons: [{
                 text: 'ok'
               }]
             });
            alert.present();
            }
          });
          } else if (resp == 'noExiste'){
            console.log("resp ", resp);
            this.rootPage = 'login';
          } else if (resp == 'noAuth'){
            this.rootPage = 'login';
          let alert = alertCtrl.create({
            title: 'Erro de servidor',
            subTitle: 'Nao foi possivel cadastra no servidor',
            buttons: [{
              text: 'ok'
            }]
          });
          alert.present();            
          }        
        });
      });     
    });
  }
}
