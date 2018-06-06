import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutenticacaoProvider } from '../../providers/autenticacao/autenticacao';
import SHA_256 from 'sha256';
import { SecureStorageProvider } from '../../providers/secure-storage/secure-storage';
import { TabsPage } from '../tabs/tabs';

@IonicPage({
  name: 'cadastro'
})
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  formCadastro: FormGroup;

  nomeUsuario = "";
  senha = "";
 
  constructor(
    private storageProvider: SecureStorageProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public autenticacao: AutenticacaoProvider,
    private formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      this.formCadastro = this.formBuilder.group({
        nomeUsuario: ['', Validators.required],
        senha: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  validarCadastro(){
    let senhaCriptografada = SHA_256(this.senha);
    this.autenticacao.autenticaCadastro(this.nomeUsuario, senhaCriptografada)
    .then((results)=>{
      if(results == 'sucesso'){ 
        //console.log('registro inseridos');
        let toast = this.toastCtrl.create({
          message: 'Cadastrado com sucesso',
          duration: 2500,
          position: 'bottom'
        });
        toast.present();

        this.storageProvider.cadastro(this.nomeUsuario, senhaCriptografada);

        this.navCtrl.setRoot(TabsPage);

      }  else if(results == 'existe'){
        //console.log('usuario ja existe');
        let alert = this.alertCtrl.create({
          title: 'Usuário existente',
          subTitle: 'Esse usuário já está cadastrado',
          buttons: [{
            text: 'ok'
          }]
        });
        alert.present();
      }else if(results == 'erroCad'){
        let alert = this.alertCtrl.create({
          title: 'Erro de servidor',
          subTitle: 'Nao foi possivel cadastra no servidor',
          buttons: [{
            text: 'ok'
          }]
        });
        alert.present();
      }
    }, (err)=>{
      console.log(err);
    });
  }

  loginPage(){
    this.navCtrl.push('login');
  }

  recuperaStorage(){
    this.storageProvider.recuperar();
  }

}
