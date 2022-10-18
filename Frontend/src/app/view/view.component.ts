import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../students.service';
import { Students } from '../students';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public students!: Students[];

  constructor(private studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.getStudents().subscribe((data: Students[]) => {
      this.students = data;
      console.log(this.students);
    });
  }

  deleteStudent(students: Students): void{
    //console.log(students.sId);
    this.studentService.deleteStudent(students.sId).subscribe(data => {
      this.students = this.students.filter(u => u !== students);
    });
  }

}
