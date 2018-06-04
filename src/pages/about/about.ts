import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
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
    private alertCtrl:AlertController,
    private dadosSensor: DadosSensorProvider,
    public navCtrl: NavController) {
      

  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.lineChart = this.getLineChart();
    }, 150);
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getLineChart(){
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
      labels: [],
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
        data:[],
        scanGaps: false,
      }
    ]
    }

    return this.getChart(this.lineCanvas.nativeElement, 'line', data);
  }

  pesquisarData(data){
    let dataA = data.split("-");
    let dataF = dataA[2]+"-"+dataA[1]+"-"+dataA[0];
     this.dadosSensor.receberDados(dataF).then((resp)=>{
      if(resp == "noexiste"){
        this.lineChart.data.labels = [];
        this.lineChart.data.datasets.forEach((dataset) => {
        dataset.data  = [];
        });
        this.lineChart.update();
        let alertCtrl = this.alertCtrl.create({
          title: 'Sem valores',
          subTitle: 'Não existe valores para a data '+dataF,
          buttons: ['OK']
        });
        alertCtrl.present();
        
      }else{
       this.dados = resp;
       let horas = [];
       let valores = [];
       for(var i = 0; i < this.dados.length; i++){
         valores[i] = this.dados[i].valor;        
       }
       for(var i = 0; i < this.dados.length; i++){
         horas[i] = this.dados[i].hora;
       }
        this.lineChart.data.labels = horas;
        this.lineChart.data.datasets.forEach((dataset) => {
        dataset.data  = valores;
        });
        this.lineChart.update();
      }
     });
    //alert(dataF);
  }

}
