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

      dadosSensor.getAlertSensor().subscribe(alert =>{
        if(alert == "alarteon"){
          let alert = alertCtrl.create({
            title: "ALERTA!!",
            subTitle: "Porta aberta!!",
            buttons: [{text: 'ok'}]
          });
          alert.present();
        }else if(alert == "alarteoff"){
          let alert = alertCtrl.create({
            title: "ALERTA!!",
            subTitle: "A porta foi fechada",
            buttons: [{text: 'ok'}]
          });
          alert.present();
        }
      });


      statusBar.styleDefault();
      splashScreen.hide();

      secureStorage.recuperar().then(res =>{
        if(res == "noExiste"){
          console.log("res ", res);
          socket.disconnect();
          this.rootPage = 'login';
        } else if(res == "Storagenulo"){
          console.log("storage nulo", res);
          socket.disconnect();
          this.rootPage = 'login';
        } else {
          this.user = res;
          autenticacaoProvider.autenticaLogin(this.user.user, this.user.senha)
          .then(resp =>{
            if(resp == "sucesso"){
              console.log("resp ", resp);
              dadosSensor.connect().then(connect => {
                if(connect == "conectado"){
                  this.rootPage = TabsPage;
                } else {
                  this.rootPage = 'login';
                  let alert = alertCtrl.create({
                    title: "Erro no socket",
                    subTitle: "Não foi possivel conectar ao socket",
                    buttons: [{text: 'ok'}]
                  });
                  alert.present();
                }
              });
            }
          });
        }
      });      
    });
  }
}
