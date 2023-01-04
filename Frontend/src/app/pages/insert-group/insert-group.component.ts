import {Component, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {VisualizationService} from "../../services/visualization/visualization.service";
import {GeneralService} from "../../services/general/general.service";
import {DatePipe} from "@angular/common";
Chart.register(...registerables);
import annotationPlugin from "chartjs-plugin-annotation";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";
import {Task} from "../../services/task/task";
import {Category} from "../../services/category/category";
import {User} from "../../services/authentication/user";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../../services/authentication/authentication.service";
Chart.register(annotationPlugin);
Chart.defaults.font.family = "'Ubuntu', sans-serif";
import {TaskService} from "../../services/task/task.service";
import {CategoryService} from "../../services/category/category.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-insert-group',
  templateUrl: './insert-group.component.html',
  styleUrls: ['./insert-group.component.scss']
})
export class InsertGroupComponent implements OnInit {

  constructor(private stress: StresstrackingService, private datePipe: DatePipe, private vizService: VisualizationService, private taskService: TaskService, private general: GeneralService, private auth: AuthenticationService, private formBuilder: FormBuilder, private catService: CategoryService) {
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
  numberDays!: number;
  numberTimers!: number;

  ngOnInit(): void {
    this.isLoading = true;
    this.userLoaded = false;
    //For error messages

    this.setBooleansFalse();
    this.getWeeklyAvg();
    this.getData();
    //this.matcher = new ErrorStateMatcher();

    // change heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {  h1[i].innerText = "Profil";}

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

        this.stress.getStresslimit().subscribe(
          (data: any = []) => {
            this.stressLimit = data['data']['stress_limit'];

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

    // get data for stacked bar chart
    this.vizService.getNumberOfDays().subscribe(
      (data: any = []) => {
        this.numberDays = data['data']['days'];
        console.log(this.numberDays);
        this.numberDays = 25;
        this.vizService.getNumberOfTimers().subscribe(
          (data: any = []) => {

            this.numberTimers = data['data']['timers'];
            console.log(this.numberTimers);

            // init bubble chart
            this.initBubbleChart();

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
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Wochentag'
              },
              min: 0
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

      if(stresslevel != undefined) {
        this.dataStress[i] = stresslevel.stresslevel;
      }
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
                xValue: 0.45,
                yValue: this.stressLimit-3.5,
                content: ['Stresslimit'],
                font: {
                  size: 12,
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

  initBubbleChart(): void {

    const size = 20;

    let daysPlanned = document.getElementById("daysPlanned")!;
    if(this.numberDays > 1) {
      daysPlanned.style.width = this.numberDays * size + 'px';
      daysPlanned.style.height = this.numberDays * size + 'px';
    } else if(this.numberDays = 1){
      daysPlanned.style.width = '25px';
      daysPlanned.style.height = '25px';
    } else {
      daysPlanned.style.backgroundColor = 'rgba(0,0,0,0)'
      daysPlanned.style.color = '#000000';
      daysPlanned.style.width = '25px';
      daysPlanned.style.height = '25px';
    }
    daysPlanned.firstChild!.textContent = this.numberDays + '';

    let timersUsed = document.getElementById("timersUsed")!;
    if(this.numberTimers > 0) {
      timersUsed.style.width = this.numberTimers * size + 'px';
      timersUsed.style.height = this.numberTimers * size + 'px';
    } else if(this.numberTimers = 1){
      timersUsed.style.width = '25px';
      timersUsed.style.height = '25px';
    } else {
      timersUsed.style.backgroundColor = 'rgba(0,0,0,0)'
      timersUsed.style.color = '#000000';
      timersUsed.style.width = '25px';
      timersUsed.style.height = '25px';
    }
    timersUsed.firstChild!.textContent = this.numberTimers + '';

    /*const bubbleChartData = {
      datasets: [
        {
          label: 'Tage geplant',
          data: [{
            x: 1,
            y: 1,
            r: 2
          }],
          backgroundColor: 'rgb(99, 76, 154)'
        },
        {
          label: 'Timer benutzt',
          data: [{
            x: 2,
            y: 1,
            r: 7
          }],
          backgroundColor: 'rgb(159, 146, 198)',
        },
      ],
    };

    var areaChart = new Chart("myAreaChart", {
      type: "bubble",
      data: bubbleChartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'In der letzten Woche hast du',
          },
        },
        scales: {
          x: {
            min: 0,
            max: 3,
            ticks: {
              display: false,
              stepSize: 1
            }
          },
          y: {
            min: 0,
            max: 2,
            ticks: {
              display: false,
              stepSize: 1
            },
          }
        }
      }
    });*/

  }

  allTasks!: Task[];
  finishedTasks!: Task[];
  allCategories!: Category[];
  allTasksLength!: number;
  allFinishedTasksLength!: number;
  allCategoriesLength = 0;

  currentUser!: User;

  weeklyAverage!: number;

  userForm!: FormGroup;
  changeUsername!: boolean;
  changeFirstname!: boolean;
  changeLastname!: boolean;
  changeStressLimit!: boolean;
  matcher!: ErrorStateMatcher;


  userLoaded!: boolean;
  isLoading!: boolean;

  faEdit = faPencil;




  ngAfterViewInit(): void {
    this.isLoading = false;
  }

  logout() {
    this.auth.logout(['Logout']).subscribe((data: any = []) => {
      this.auth.deleteToken();
      window.location.href = window.location.href;
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  changeForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      stressLimit: ['', Validators.required]
    });
    this.userForm.setValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      username: this.currentUser.username,
      stressLimit: this.currentUser.stress_limit
    });
  }

  getData() {
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allTasks = <Task[]>data['data'];
        this.allTasksLength = this.allTasks.length;
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.taskService.getFinishedTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.finishedTasks = <Task[]>data['data'];
        this.allFinishedTasksLength = this.finishedTasks.length;
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.catService.getAllCategoriesByUser().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allCategories = <Category[]>data['data'];
        this.allCategoriesLength = this.allCategories.length;
      },
      (error: any = []) => {
        if (error['status'] == 404) {
          this.allCategoriesLength = 0;
        } else {
          this.general.errorResponse(error['status']);
        }

      });

    this.auth.getUser().subscribe(
      (data: any = []) => {
        this.currentUser = <User>data['data'];

        this.changeForm();
        this.userLoaded = true;
        //this.matcher = new ErrorStateMatcher();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          this.userLoaded = true;
          return;
        }
        this.general.errorResponse(error['status']);
        this.userLoaded = true;
      });

  }

  getWeeklyAvg() {
    this.stress.getWeeklyAvg().subscribe((data: any = []) => {
      //console.log(data['data']['0']['Average']);
      this.weeklyAverage = data['data']['0']['Average'];
      if (this.weeklyAverage == 10.00) {
        this.weeklyAverage = 10;
      } else if (this.weeklyAverage == 0.00 || this.weeklyAverage == null) {
        this.weeklyAverage = 0;
      }
      //console.log(this.weeklyAverage);
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  setBooleansFalse() {
    this.changeFirstname = false;
    this.changeLastname = false;
    this.changeUsername = false;
    this.changeStressLimit = false;
  }

  onUserFormSubmit() {
    //console.log(this.userForm.value);
    this.auth.updateUser(this.userForm.value).subscribe((data: any = []) => {
      this.ngOnInit();
      this.ngAfterViewInit();
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

}
