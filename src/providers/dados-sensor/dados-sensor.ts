import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class DadosSensorProvider {

  constructor(public http: HttpClient,
              private socket: Socket) {

  }

  connect(){
    return new Promise((resolve, reject)=>{
      if(this.socket.connect()){
        resolve("conectado");
      }else{
        console.log("erro no connect");
        reject("erro na conexão");
      }
    });
  }

  disconnect(){
    return new Promise((resolve, reject)=>{
      if(this.socket.disconnect()){
        resolve("desconectado");
      }else{
        console.log("erro no disconnet");
        resolve("erro");
      }
    });
  }

  receberDados(data){ 
    const serverURL = "http://projetimeta.duckdns.org:3006";
    return new Promise((resolve, reject)=>{
      this.http.get(serverURL+'/receberionic?data='+data+'&atual=false').subscribe((res)=>{
        resolve(res);
      },
    (err)=>{
      console.log("erro no receberDados");
      reject(err); 
    });
    });  
  }

  receberAtual(){
    const serverURL = "http://projetimeta.duckdns.org:3006";
    return new Promise((resolve, reject)=>{
      this.http.get(serverURL+'/receberionic?atual=true').subscribe((res)=>{
        resolve(res);
      }, 
    (err)=>{
      console.log("erro no receberAtual");
      reject(err);
    });
    });
  }

  getValores() {
    let observable = new Observable(observer => {
      this.socket.on('valores', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getAlertSensor() {
    let observable = new Observable(observer => {
      this.socket.on('alert', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  
  getStatusSensor() {
    let observable = new Observable(observer => {
      this.socket.on('status', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  receberStatus(){ 
    const serverURL = "http://projetimeta.duckdns.org:3006";
    return new Promise((resolve, reject)=>{
      this.http.get(serverURL+'/receberstatus').subscribe((res)=>{
        resolve(res);
      },
    (err)=>{
      console.log("erro no receberStatus");
      resolve(err); 
    });
    });  
  }

  EnviarStatus(status){ 
    const serverURL = "http://projetimeta.duckdns.org:3006";
    return new Promise((resolve, reject)=>{
      this.http.get(serverURL+'/statusalarme?status='+ status).subscribe((res)=>{
        resolve(res);
      },
    (err)=>{
      console.log("erro no EnviarStatus");
      resolve(err); 
    });
    });  
  }

}
