import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Students } from './students';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { 
  }

  getStudents(){
    return this.http.get<Students[]>('https://mt201064.students.fhstp.ac.at/Backend/list.php');
  }

  deleteStudent(Id: number){
    return this.http.delete<Students[]>('https://mt201064.students.fhstp.ac.at/Backend/delete.php?id='+ Id);
  }

  createStudent(student: Students){
    return this.http.post('https://mt201064.students.fhstp.ac.at/Backend/insert.php', student);
  }
}
