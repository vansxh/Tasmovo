import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
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
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private datePipe: DatePipe, private vizService: VisualizationService, private auth: AuthenticationService, private taskService: TaskService, private general: GeneralService, private catService: CategoryService, private formBuilder: FormBuilder, private stress: StresstrackingService) {
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

  ngOnInit(): void {
    this.isLoading = true;
    this.userLoaded = false;

    this.setBooleansFalse();
    this.getWeeklyAvg();
    this.getData();
    this.loadVisualizations();

    // modify heading
    let h1 = document.getElementsByTagName("h1");
    if (window.innerWidth <= 768) {
      for (let i = 0; i < h1.length; i++) {
        h1[i].innerText = "";
      }
    } else {
      for (let i = 0; i < h1.length; i++) {
        h1[i].innerText = 'Profil';
      }
    }
  }

  loadVisualizations() {
    // get all days of the last week into an array
    for (let i = 6; i >= 0; i--) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      this.days.push(d);
    }

    // set labels and fill data arrays with as much 0s as there are days
    for (let j = 0; j < this.days.length; j++) {
      this.labels.push(this.days[j].toLocaleString('de-at', {weekday: 'short'}));
      this.dataEasy.push(0);
      this.dataMedium.push(0);
      this.dataDiff.push(0);
      this.dataStress.push(0);
    }

    // get data for stacked bar chart
    this.vizService.getTaskExpenses().subscribe(
      (data: any = []) => {
        this.taskExpenses = data['data'];
        let _me=this;
        // init stacked bar chart
        setTimeout(function (){
          _me.initBarChart("myBarChartMobile");
          _me.initBarChart("myBarChartDesktop");
        },1000);
      },
      (error: any = []) => {
        if (error['error']['message']) {
          //alert(error['error']['message']);
          this.taskExpenses = [{
            date: "",
            expenseID: 0,
            number: 0
          }];
          let _me=this;
          // init stacked bar chart
          setTimeout(function (){
            _me.initBarChart("myBarChartMobile");
            _me.initBarChart("myBarChartDesktop");
          },1000);
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

            let _me=this;
            // init area chart
            setTimeout(function (){
              _me.initAreaChart("myAreaChartMobile");
              _me.initAreaChart("myAreaChartDesktop");
            },1000);

          },
          (error: any = []) => {
            if (error['error']['message']) {
              alert(error['error']['message']);
              return;
            }
            this.general.errorResponse(error['status']);
          });
      },
      (error: any = []) => {
        if (error['error']['message']) {
          this.stresslevels = [{
            date: "",
            stresslevel: 0
          }];

          this.stress.getStresslimit().subscribe(
            (data: any = []) => {
              this.stressLimit = data['data']['stress_limit'];

              let _me=this;
              // init area chart
              setTimeout(function (){
                _me.initAreaChart("myAreaChartMobile");
                _me.initAreaChart("myAreaChartDesktop");
              },1000);

            },
            (error: any = []) => {
              if (error['error']['message']) {
                alert(error['error']['message']);
                return;
              }
              this.general.errorResponse(error['status']);
            });
          return;
        }
        this.general.errorResponse(error['status']);
      });

    // get data for stacked bar chart
    this.vizService.getNumberOfDays().subscribe(
      (data: any = []) => {
        this.numberDays = data['data']['days'];

        this.vizService.getNumberOfTimers().subscribe(
          (data: any = []) => {
            this.numberTimers = data['data']['timers'];
            // init bubble chart
            this.initBubbleChart();
          },
          (error: any = []) => {
            if (error['error']['message']) {
              alert(error['error']['message']);
              return;
            }
            this.general.errorResponse(error['status']);
          });
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

  }

  initBarChart(canvas: string): void {
    // go through each day
    for (let i = 0; i < this.days.length; i++) {
      let today = this.datePipe.transform(this.days[i], 'yyyy-MM-dd', 'de-AT') || '';
      // look for all tasks with the same end date as the day we're looking into
      let tasks = this.taskExpenses.filter(t => t.date == today);
      // if there's tasks with the needed end date
      if (tasks.length > 0) {
        // change value in correct array (depending on expense) on correct index (i from for loop)
        tasks.forEach(t => {
          switch (t.expenseID) {
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

    const barChart = new Chart(canvas, {
      type: 'bar',
      data: barChartData,
      options: {
        plugins: {},
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

  initAreaChart(canvas: string): void {
    // go through each day
    for (let i = 0; i < this.days.length; i++) {
      let today = this.datePipe.transform(this.days[i], 'yyyy-MM-dd', 'de-AT') || '';
      // look for each day's stresslevel
      let stresslevel = this.stresslevels.find(s => s.date == today);

      if (stresslevel != undefined) {
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

    const areaChart = new Chart(canvas, {
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
                yValue: this.stressLimit - 3.5,
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
    // define value for multiplying to get size
    const size = 20;

    // get divs for web and mobile
    let daysPlanned = document.querySelectorAll<HTMLElement>(".daysPlanned")!;
    daysPlanned.forEach((d: HTMLElement) => {
      if (this.numberDays > 1) {
        if (this.numberDays * size >= 220) {
          // max size
          d.style.width = '220px';
          d.style.height = '220px';
        } else {
          // normal calculation
          d.style.width = this.numberDays * size + 'px';
          d.style.height = this.numberDays * size + 'px';
        }
      } else if (this.numberDays == 1) {
        // min size
        d.style.width = '25px';
        d.style.height = '25px';
      } else {
        // if 0
        d.style.backgroundColor = 'rgba(0,0,0,0)'
        d.style.color = '#000000';
        d.style.width = '25px';
        d.style.height = '25px';
      }
      d.firstChild!.textContent = this.numberDays + '';
    });

    let timersUsed = document.querySelectorAll<HTMLElement>(".timersUsed")!;
    timersUsed.forEach((t: HTMLElement) => {
      if (this.numberTimers > 0) {
        if (this.numberDays * size >= 220) {
          t.style.width = '220px';
          t.style.height = '220px';
        } else {
          t.style.width = this.numberTimers * size + 'px';
          t.style.height = this.numberTimers * size + 'px';
        }
      } else if (this.numberTimers == 1) {
        t.style.width = '25px';
        t.style.height = '25px';
      } else {
        t.style.backgroundColor = 'rgba(0,0,0,0)'
        t.style.color = '#000000';
        t.style.width = '25px';
        t.style.height = '25px';
      }
      t.firstChild!.textContent = this.numberTimers + '';
    });
  }

  ngAfterViewInit(): void {
    this.isLoading = false;
  }

  logout() {
    this.auth.logout(['Logout']).subscribe((data: any = []) => {
      this.auth.deleteToken();
      window.location.reload();
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
      firstName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z\'\-]+$')]],
      lastName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z\'\-]+$')]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), this.usernameValidator, Validators.pattern('^[a-z0-9]+$')]],
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
        if (error['status'] == 404) {
          this.allTasksLength = 0;
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
        if (error['status'] == 404) {
          this.allFinishedTasksLength = 0;
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
      this.weeklyAverage = data['data']['0']['Average'];
      if (this.weeklyAverage == 10.00) {
        this.weeklyAverage = 10;
      } else if (this.weeklyAverage == 0.00 || this.weeklyAverage == null) {
        this.weeklyAverage = 0;
      }
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
    this.auth.updateUser(this.userForm.value).subscribe((data: any = []) => {
      window.location.reload();
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  // @ts-ignore
  usernameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { invalidUsername: true };
    }
  }


}
