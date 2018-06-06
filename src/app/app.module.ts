import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DadosSensorProvider } from '../providers/dados-sensor/dados-sensor';
import { SocketIoConfig, SocketIoModule } from 'ng-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { AutenticacaoProvider } from '../providers/autenticacao/autenticacao';
import { SecureStorage } from '@ionic-native/secure-storage';
import { SecureStorageProvider } from '../providers/secure-storage/secure-storage';
import { UpdateDadosProvider } from '../providers/update-dados/update-dados';

const config: SocketIoConfig = { 
  url: 'http://projetimeta.duckdns.org:3006',
  options: {}
}; 

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SecureStorage,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DadosSensorProvider,
    AutenticacaoProvider,
    SecureStorageProvider,
    UpdateDadosProvider
  ]
})
export class AppModule {}
