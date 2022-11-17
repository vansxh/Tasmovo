import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";

@Component({
  selector: 'app-popup-finish',
  templateUrl: './popup-finish.component.html',
  styleUrls: ['./popup-finish.component.scss']
})
export class PopupFinishComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupFinishComponent>) {
  }

  finishForm!: FormGroup;


  ngOnInit(): void {
  }

  onFinishSubmit() {

  }

  onClose(){
    this.dialogRefFinish.close();
  }

}
