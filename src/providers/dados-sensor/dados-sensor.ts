import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DadosSensorProvider {

  constructor(public http: HttpClient,
              private socket: Socket,) {

  }

  receberDados(data){ 
    const serverURL = "http://localhost:3000";
    return new Promise((resolve, reject)=>{
      this.http.get(serverURL+'/receberionic?data='+data+'&atual=false').subscribe((res)=>{
        resolve(res);
      },
    (err)=>{
      reject(err); 
    });
    });  
  }

  receberAtual(){
    const serverURL = "http://localhost:3000";
    return new Promise((resolve, reject)=>{
      this.http.get(serverURL+'/receberionic?atual=true').subscribe((res)=>{
        resolve(res);
      }, 
    (err)=>{
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
