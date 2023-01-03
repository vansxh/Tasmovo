import {Component, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {VisualizationService} from "../../services/visualization/visualization.service";
import {GeneralService} from "../../services/general/general.service";
import {DatePipe} from "@angular/common";
Chart.register(...registerables);
import annotationPlugin from "chartjs-plugin-annotation";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";
Chart.register(annotationPlugin);
Chart.defaults.font.family = "'Ubuntu', sans-serif";

@Component({
  selector: 'app-insert-group',
  templateUrl: './insert-group.component.html',
  styleUrls: ['./insert-group.component.scss']
})
export class InsertGroupComponent implements OnInit {

  constructor(private stress: StresstrackingService, private datePipe: DatePipe, private vizService: VisualizationService, private general: GeneralService) {
  }
  taskExpenses!: Array<any>;
  days: Array<any> = [];
  labels: Array<any> = [];
  dataEasy: Array<any> = [];
  dataMedium: Array<any> = [];
  dataDiff: Array<any> = [];
  stresslevels!: Array<any>;
  dataStress: Array<any> = [];
  stressLimit!: number;

  ngOnInit(): void {

    // get all days of the last week into an array
    for (var i=6; i>=0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      this.days.push( d );
    }

    // set labels and fill data Arrays with as much 0s as there are days
    for(var i=0; i<this.days.length; i++) {
      this.labels.push(this.days[i].toLocaleString('de-at', {  weekday: 'short' }));
      this.dataEasy.push(0);
      this.dataMedium.push(0);
      this.dataDiff.push(0);
      this.dataStress.push(0);
    }

    // get data for stacked bar chart
    this.vizService.getTaskExpenses().subscribe(
      (data: any = []) => {
        this.taskExpenses = data['data'];

        // init stacked bar chart
        this.initBarChart();

      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    // get data for stacked bar chart
    this.vizService.getStresslevels().subscribe(
      (data: any = []) => {
        this.stresslevels = data['data'];

        console.log(this.stresslevels);

        this.stress.getStresslimit().subscribe(
          (data: any = []) => {
            this.stressLimit = data['data']['stress_limit'];

            console.log(this.stressLimit);

            // init area chart
            this.initAreaChart();

          },
          (error: any = []) => {
            if(error['error']['message']) {
              alert(error['error']['message']);
              return;
            }
            this.general.errorResponse(error['status']);
          });

      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

  }

  initBarChart(): void {

    // go through each day
    for(var i=0; i<this.days.length; i++) {
      let today = this.datePipe.transform(this.days[i],'yyyy-MM-dd', 'de-AT') || '';
      // look for all tasks with the same end date as the day we're looking into
      let tasks = this.taskExpenses.filter(t => t.date == today);
      // if there's tasks with the needed end date
      if(tasks.length > 0) {
        // change value in correct array (depending on expense) on correct index (i from for loop)
        tasks.forEach(t => {
          switch(t.expenseID) {
            case 1:
              this.dataEasy[i] = t.number;
              break;
            case 2:
              this.dataMedium[i] = t.number;
              break;
            case 3:
              this.dataDiff[i] = t.number;
              break;
            default:
              break;
          }
        });
      }
    }

    const barChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Schwer',
          data: this.dataDiff,
          backgroundColor: 'rgb(99, 76, 154)'
        },
        {
          label: 'Mittel',
          data: this.dataMedium,
          backgroundColor: 'rgb(159, 146, 198)',
        },
        {
          label: 'Leicht',
          data: this.dataEasy,
          backgroundColor: 'rgb(208, 199, 236)',
        },
      ]
    };

    var barChart = new Chart("myBarChart", {
        type: 'bar',
        data: barChartData,
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Deine abgeschlossenen Tasks in der letzten Woche'
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Wochentag'
              }
            },
            y: {
              ticks: {
                stepSize: 1
              },
              stacked: true,
              suggestedMax: 8,
              title: {
                display: true,
                text: 'Abgeschlossene Tasks'
              }
            }
          }
        }
      });

  }

  initAreaChart(): void {

    // go through each day
    for(var i=0; i<this.days.length; i++) {
      let today = this.datePipe.transform(this.days[i], 'yyyy-MM-dd', 'de-AT') || '';
      // look for each day's stresslevel
      let stresslevel = this.stresslevels.find(s => s.date == today);
      console.log(stresslevel);

      if(stresslevel != undefined) {
        this.dataStress[i] = stresslevel.stresslevel;
      }
      console.log(this.dataStress);
    }

    const areaChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Stress',
          data: this.dataStress,
          fill: {
            target: {value: this.stressLimit},
            above: 'rgb(208, 199, 236)',
            below: 'rgba(0,0,0,0)'
          },
          borderColor: 'rgb(99, 76, 154)',
          tension: 0.15
        },
      ]
    };

    var areaChart = new Chart("myAreaChart", {
      type: "line",
      data: areaChartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Dein täglich angesammelter Stress in der letzten Woche',
          },
          filler: {
            propagate: true
          },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                yMin: this.stressLimit,
                yMax: this.stressLimit,
                borderColor: 'rgb(48,35,91)',
                borderWidth: 3,
              },
              label1: {
                type: 'label',
                xValue: 0.3,
                yValue: this.stressLimit-1,
                content: ['Dein Stresslimit'],
                font: {
                  size: 14,
                },
                color: 'rgb(48,35,91)',
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Wochentag',
            },
          },
          y: {
            suggestedMax: this.stressLimit + 5,
            title: {
              display: true,
              text: 'Angesammelter Stress',
            }
          }
        }
      }
    });

  }

}
