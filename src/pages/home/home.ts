import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, AlertController, Platform } from 'ionic-angular';
import chartJs from 'chart.js';
import { DadosSensorProvider } from '../../providers/dados-sensor/dados-sensor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('lineCanvas') lineCanvas;
  
  lineChart: any; 
  formHome: FormGroup;
  data = "";
  dados:any;
  array:any = [];
  tempAtual: any;
  graficoDisplay = false;

  
  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public dadosSensor: DadosSensorProvider, 
    public navCtrl: NavController) {
      this.formHome = this.formBuilder.group({
        data: ['', Validators.required]
      });
      this.pesquisaData(); 
     }

  ngAfterViewInit(){
    setTimeout(() => {
      //this.lineChart = this.getLineChart();
    }, 150)
  }

  getChart(context, chartType, data, options?) {
    
    return new chartJs(context, {
      data,
      options,
      type: chartType
    });
    
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

    return this.getChart(this.lineCanvas.nativeElement, 'line', data, options);
  }

  pesquisaData(){
    console.log(this.data);
    this.dadosSensor.receberAtual().then((resp)=>{
      this.dados = resp;
      if(resp == "noexiste"){
        this.Realtimesensor();
        let alertCtrl = this.alertCtrl.create({
          title: 'Sem valores',
          subTitle: 'Não existe valores para a data '+this.data
        });
        alertCtrl.present();
        
      }else{
        this.graficoDisplay = true;
        this.array = resp;
        console.log("array: ", this.array);
        let horas = [];
        let valores = [];
        this.tempAtual = this.dados[this.dados.length -1].valor;
        for(var i=0;i< this.dados.length; i++){
          valores[i] = this.dados[i].valor;
        }
        for(var i=0;i< this.dados.length; i++){
          horas[i] = this.dados[i].hora;
        }
        console.log(resp);
        this.lineChart = this.getLineChart(horas,valores);
        this.Realtimesensor();
        console.log("lineChart: ",this.lineChart);
      }
      
    });
  }

  Realtimesensor(){
    
    this.dadosSensor.getValores().subscribe(valores => {
      console.log("valores ",valores);
      if(this.graficoDisplay == true){
        let valor:any;
      valor = valores;
      this.tempAtual = valor.valor;
      this.lineChart.data.labels.push(valor.hora);
      this.lineChart.data.datasets.forEach((dataset) => {
        dataset.data.push(valor.valor);
      });
      this.lineChart.update();
      console.log("array++: ", this.array);
      //alert(JSON.stringify(this.array));
      }else{
        this.pesquisaData();
      }
      
    });
  }

}

