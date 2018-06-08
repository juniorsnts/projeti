import { Component } from '@angular/core';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SecureStorageProvider } from '../providers/secure-storage/secure-storage';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { Socket } from 'ng-socket-io';
import { DadosSensorProvider } from '../providers/dados-sensor/dados-sensor';
import { AutenticacaoProvider } from '../providers/autenticacao/autenticacao';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AudioProvider } from '../providers/audio/audio';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  user;

  //serverURL = "http://projetimeta.duckdns.org:3006";
  serverURL = "http://10.0.0.2:3000";

  constructor(
    toastCtrl: ToastController,
    audio: AudioProvider,
    background: BackgroundMode,
    autenticacaoProvider: AutenticacaoProvider,
    dadosSensor: DadosSensorProvider,
    alertCtrl: AlertController,
    socket: Socket,
    secureStorage: SecureStorageProvider,
    localNotification: LocalNotifications,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen) {
      


      platform.ready().then(() => {

        audio.preload('alarme', 'assets/audio/audio1.mp3');
              
      dadosSensor.getAlertSensor().subscribe(alert =>{
        if(alert == "alarteon"){
          let alert = alertCtrl.create({
            title: "ALERTA!!",
            subTitle: "Porta aberta!!",
            buttons: [{text: 'ok'}]
          });

          if(background.wakeUp()){
            alert.present();
            setTimeout(()=>{
              alert.dismiss().then(()=>{
                audio.stop("alarme");
              });;
            }, 3000);
          }

          audio.play("alarme");

          localNotification.schedule({
            title: 'Parece que alguem abriu a porta',
            text: 'SEGURANÇA VIOLADA'
          });

        }else if(alert == "alarteoff"){

          let alert = alertCtrl.create({
            title: "ALERTA!!",
            subTitle: "A porta foi fechada",
            buttons: [{text: 'ok'}]
          });
          //if(background.wakeUp()){
            alert.present();
            setTimeout(()=>{
              alert.dismiss().then(()=>{
                audio.stop("alarme");
              });
            },3000);           
          //}
          localNotification.schedule({
            title: 'Parece que alguem fechou a porta',
            text: 'A PORTA FOI FECHADA' 
          });
        }
      });


      statusBar.styleDefault();
      splashScreen.hide();

      secureStorage.recuperar().then(res =>{
        if(res == "noExiste"){
          let toast = toastCtrl.create({
            message: 'noExiste',
            duration: 2000,
            position: 'bottom'
          });        
          toast.present();
          console.log("res ", res);
          this.rootPage = 'login';
        } else if(res == "Storagenulo"){
          let toast = toastCtrl.create({
            message: 'Storagenulo',
            duration: 2000,
            position: 'bottom'
          });        
          toast.present();
          console.log("storage nulo", res);
          this.rootPage = 'login';
        } else {
          this.user = res;
          autenticacaoProvider.autenticaLogin(this.user.user, this.user.senha)
          .then(resp =>{
            if(resp == "sucesso"){
              console.log("resp ", resp);
              dadosSensor.connect().then(connect => {
                if(connect == "conectado"){
                  background.enable();
                  background.setDefaults({
                    silent: false,
                    title: 'Estou ativado',
                    text: 'Oi, irei te notificar quando algo acontecer',
                    hidden: false
                  });               
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
            }else{
              let alert = alertCtrl.create({
                title: "Erro de comunicação com o servidor",
                subTitle: "Não foi possivel conectar ao servidor.",
                buttons: [{text: 'ok'}]
              });
              alert.present();
              this.rootPage = 'login';
            }
          });
        }
      });      
    });
  }
}
