import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-popup-myday',
  templateUrl: './popup-myday.component.html',
  styleUrls: ['./popup-myday.component.scss']
})
export class PopupMydayComponent implements OnInit {

  constructor(private datePipe: DatePipe, private dialogRefFinish: MatDialogRef<PopupMydayComponent>, private formbuilder: FormBuilder, private taskService: TaskService, private general: GeneralService) { }

  planned_date!: string;
  start_time!: string;
  end_time!: string;
  tasks!: Task[];
  addPlannedTaskForm!: FormGroup;
  newTask!: Task;
  plannedTask!: Task;

  ngOnInit(): void {

    this.newTask = new Task();

    // get all tasks from a user for dropdown
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.tasks = <Task[]>data['data'];
        // sort tasks alphabetically
        this.tasks.sort(function(a, b){
          if(a.task_name.toLowerCase() < b.task_name.toLowerCase()) {
            return -1;
          }
          if(a.task_name.toLowerCase() > b.task_name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.plannedTask = this.taskService.plannedTask;
    console.log(this.plannedTask);
    this.planned_date = this.datePipe.transform(new Date(this.plannedTask.planned_date), 'EEEE, d. MMM', 'de-AT') || '';

    this.addPlannedTaskForm = this.formbuilder.group({
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      TAID: ['', Validators.required]
    });

    this.addPlannedTaskForm.patchValue(this.plannedTask);

  }

  onAddTaskSumbmit() {
    // get values from form
    this.newTask.start_time = this.addPlannedTaskForm.value.start_time;
    this.newTask.end_time = this.addPlannedTaskForm.value.end_time;
    this.newTask.TAID = this.addPlannedTaskForm.value.TAID;
    this.newTask.planned_date = this.plannedTask.planned_date;

    this.taskService.insertPlannedTask(this.newTask).subscribe(
      (data: any = []) => {
        this.onClose();
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          this.onClose();
          return;
        }
        this.general.errorResponse(error['status']);
        this.onClose();
      });
  }

  onEditTaskSumbmit(){
    // get values from form
    this.newTask.start_time = this.addPlannedTaskForm.value.start_time;
    this.newTask.end_time = this.addPlannedTaskForm.value.end_time;
    this.newTask.TAID = this.addPlannedTaskForm.value.TAID;
    this.newTask.planned_date = this.taskService.plannedTask.planned_date;
    this.newTask.MID = this.taskService.plannedTask.MID;

    this.taskService.updatePlannedTask(this.newTask).subscribe(
      (data: any = []) => {
        //this.onClose();
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          //this.onClose();
          return;
        }
        this.general.errorResponse(error['status']);
        //this.onClose();
      });
  }

  onClose() {
    this.dialogRefFinish.close();
    window.location.reload();
  }

}
