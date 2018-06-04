import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import chartJs from 'chart.js';
import { DadosSensorProvider } from '../../providers/dados-sensor/dados-sensor';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  @ViewChild('lineCanvas') lineCanvas;
  
  lineChart: any;
  data = "";
  dados: any;

  constructor(
    private dadosSensor: DadosSensorProvider,
    public navCtrl: NavController) {

  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getLineChart(horas,valores){
    const options = {
      elements: {
        line: {
          tension: 0,
        },
        animation: {
          duration: 0,
        },
        hover: {
          animationDuration: 0,
        },
        responsiveAnimationDuration: 0,
      }
    }
    const data = {
      labels: horas,
      datasets: [{
        label: 'Temperatura por hora',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(0, 178, 255)',
        borderColor: 'rgb(0, 178, 255)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data:valores,
        scanGaps: false,
      }
    ]
    }

    return this.getChart(this.lineCanvas.nativeElement, 'line', data)
  }

  pesquisarData(data){
    // this.dadosSensor.receberDados(this.data).then((resp)=>{
    //   this.dados = resp;
    //   let horas = [];
    //   let valores = [];
    //   for(var i = 0; i < this.dados.lenght; i++){
    //     valores[i] = this.dados[i].valor;        
    //   }
    //   for(var i = 0; i < this.dados.lenght; i++){
    //     horas[i] = this.dados[i].hora;
    //   }
    //   this.getLineChart(horas, valores);
    // });
    alert(data);
  }

}
