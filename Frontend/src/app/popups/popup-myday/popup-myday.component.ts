import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PopupFinishComponent} from "../popup-finish/popup-finish.component";

@Component({
  selector: 'app-popup-myday',
  templateUrl: './popup-myday.component.html',
  styleUrls: ['./popup-myday.component.scss']
})
export class PopupMydayComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private taskService: TaskService, private general: GeneralService) { }

  planned_date!: string;
  start_time!: string;
  end_time!: string;
  tasks!: Task[];
  addTaskForm!: FormGroup;

  ngOnInit(): void {

    // get all tasks from a user for dropdown
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get categories from data
        this.tasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    console.log(this.taskService.addDailyTask);

    this.planned_date = this.taskService.addDailyTask.planned_date;

    this.addTaskForm = this.formbuilder.group({
      start_time: [this.taskService.addDailyTask.start_time, Validators.required],
      end_time: [this.taskService.addDailyTask.end_time, Validators.required],
      taskID: ['']
    });

  }

}
