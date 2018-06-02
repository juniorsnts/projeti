import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AutenticacaoProvider } from '../../providers/autenticacao/autenticacao';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import SHA_256 from 'SHA256';
import { HomePage } from '../home/home';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { TabsPage } from '../tabs/tabs';
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
    private socket: Socket,
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
      this.socket.connect();
      
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
           duration: 3000,
           position: 'bottom'
         });
         toast.present();
         this.navCtrl.setRoot(TabsPage);
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
       }
     });
  }

  cadastroPage(){
    this.navCtrl.push('cadastro');
  }

}
