import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from '../../services/students.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(private formbiulder: FormBuilder, private studentService: StudentsService, private router: Router) { }

  addForm!: FormGroup;

  ngOnInit(): void {
    this.addForm = this.formbiulder.group({
      //sId: [],
      fName: ['', Validators.required],
      lName: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.maxLength(30)]]

    });
  }

  onSubmit(){
    console.log(this.addForm.value);

    this.studentService.createStudent(this.addForm.value).subscribe(data => {
      this.router.navigate(['view']);
    });

  }

}
