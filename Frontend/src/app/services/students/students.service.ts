import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Students} from './students';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) {
  }

  getStudents() {
    return this.http.get<Students[]>('http://flock-1902.students.fhstp.ac.at/Backend/list.php');
  }

  deleteStudent(Id: number) {
    return this.http.delete<Students[]>('http://flock-1902.students.fhstp.ac.at/Backend/delete.php?id=' + Id);
  }

  createStudent(student: Students) {
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/insert.php', student);
  }
}
