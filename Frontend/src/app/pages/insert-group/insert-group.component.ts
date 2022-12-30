import {Component, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {VisualizationService} from "../../services/visualization/visualization.service";
import {GeneralService} from "../../services/general/general.service";
Chart.register(...registerables);

@Component({
  selector: 'app-insert-group',
  templateUrl: './insert-group.component.html',
  styleUrls: ['./insert-group.component.scss']
})
export class InsertGroupComponent implements OnInit {

  constructor(private vizService: VisualizationService, private general: GeneralService) {
  }
  taskExpenses!: Array<any>;
  vizData: Array<any> = [];

  ngOnInit(): void {

    this.vizService.getTaskExpenses().subscribe(
      (data: any = []) => {
        this.taskExpenses = data['data'];
        console.log(this.taskExpenses);
        this.vizData = [];
        for (let i = 0; i < this.taskExpenses.length; i++) {
          this.vizData.push(this.taskExpenses[i]['number']);
        }
        console.log(this.vizData);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue'],
        datasets: [{
          label: '# of Votes',
          data: ["1", "2"],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
