import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {CategoryService} from "../../services/category/category.service";

@Component({
  selector: 'app-popup-add',
  templateUrl: './popup-add.component.html',
  styleUrls: ['./popup-add.component.scss']
})

export class PopupAddComponent implements OnInit {

  constructor(private catService: CategoryService , private dialogRefFinish: MatDialogRef<PopupAddComponent>, private taskService: TaskService, private formBuilder: FormBuilder, private general: GeneralService) {
  }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRefFinish.close();
  }

  addCategory(): void {
    this.catService.addCategory(0);
  }
}
