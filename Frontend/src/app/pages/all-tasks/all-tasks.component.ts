import {Component, OnInit} from '@angular/core';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.scss']
})
export class AllTasksComponent implements OnInit {

  constructor(private taskService: TaskService, private general: GeneralService, private dialog: MatDialog) {
  }

  public allTasks!: Task[];
  loadAllTasks = 10;
  loadFinishedTasks = 10;

  ngOnInit(): void {
    // modify heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {
      h1[i].innerText = "Alle Tasks";
    }

    this.getTasksAll();
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  }

  getTasksAll() {
    // get  all tasks
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  detailsTask(task: Task): void {
    this.taskService.detailsTask(task.TAID);
  }

  finishTask(task: Task): void {
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  scrollToNotDone() {
    const id = 'notDone-container';
    const yOffset = -200;
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  scrollToDone() {
    const id = 'done-container';
    const yOffset = -200;
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  checkWindowSize() {
    const progressbar = document.getElementById("progressbar-head")!;
    if (window.innerWidth <= 768) {
      progressbar.classList.add("top-fixed");
    } else {
      progressbar.classList.remove("top-fixed");
    }
  }

  changeDay(day: number) {
    // get buttons for changing between days
    const notDone = document.getElementById('notDone-btn');
    const done = document.getElementById('done-btn');
    // if today was clicked
    if (day === 1) {
      if (notDone && done) {
        notDone.classList.remove('btn-outline-primary');
        notDone.classList.remove('btn-light');
        notDone.classList.add('btn-primary');
        done.classList.remove('btn-primary');
        done.classList.add('btn-outline-primary');
        done.classList.add('btn-light');
      }
      // if tomorrow was clicked
    } else if (day === 2) {
      if (notDone && done) {
        notDone.classList.remove('btn-primary');
        notDone.classList.add('btn-outline-primary');
        notDone.classList.add('btn-light');
        done.classList.remove('btn-outline-primary');
        done.classList.remove('btn-light');
        done.classList.add('btn-primary');
      }
    }
  }
}
