import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DadosSensorProvider {

  constructor(public http: HttpClient,
              private socket: Socket,) {

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
    //const serverURL = "http://186.216.171.128:3006";
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
    // const serverURL = "http://186.216.171.128:3006";
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

}
