import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AutenticacaoProvider } from '../../providers/autenticacao/autenticacao';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import SHA_256 from 'SHA256';
import { HomePage } from '../home/home';
import { Observable } from 'rxjs/Observable';
import { TabsPage } from '../tabs/tabs';
import { DadosSensorProvider } from '../../providers/dados-sensor/dados-sensor';
import { SecureStorageProvider } from '../../providers/secure-storage/secure-storage';
@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  nomeUsuario = "";
  senha = "";

  formLogin: FormGroup;

  constructor(
    private storageProvider: SecureStorageProvider,
    private dadosSensor: DadosSensorProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private autenticacao: AutenticacaoProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
 
      this.formLogin = this.formBuilder.group({
        nomeUsuario: ['', Validators.required],
        senha: ['', Validators.required]
      });
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  validarLogin(){
    let senhaCriptografada = SHA_256(this.senha);

     this.autenticacao.autenticaLogin(this.nomeUsuario, senhaCriptografada).then((resp)=>{
       if(resp == 'sucesso'){
         // console.log('usuario autenticado');
         let toast = this.toastCtrl.create({
           message: 'BEM VINDO',
           duration: 2000,
           position: 'bottom'
         });
         this.storageProvider.cadastro(this.nomeUsuario, senhaCriptografada);
         toast.present();
         this.dadosSensor.connect().then(connect =>{
           if(connect == "conectado"){
            this.navCtrl.setRoot(TabsPage);

           }else{
            let alert = this.alertCtrl.create({
              title: 'Erro de socket',
              subTitle: 'Não foi possivel conectar ao socket.',
              buttons: [{
                text: 'ok'
              }]
            });
           alert.present();
           }
         });
       } else if(resp == 'noExiste'){
         // console.log('Nome de Usuario ou senha incorreta');
         let alert = this.alertCtrl.create({
           title: 'Dados inválidos',
           subTitle: 'Nome de usuário ou senha incorretos',
           buttons: [{
             text: 'ok'
           }]
         });
        alert.present();
       } else if(resp == 'erroAuth'){
         let alert = this.alertCtrl.create({
           title: 'Erro no servidor',
           subTitle: 'Nao foi possivel fazer a autenticacao no servidor',
           buttons: [{
             text: 'ok'
           }]
         });
         alert.present();
       }
     });
  }

  cadastroPage(){
    this.navCtrl.push('cadastro');
  }

}
