import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Category } from './category';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) { }

  insertCategory(category: Category, userID: string){
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/routes/category/insertCategory.php', {category, userID});
  }

  getCategory(CAID: number) {
    return this.http.get('http://flock-1902.students.fhstp.ac.at/Backend/routes/category/getCategory.php?CAID='+ CAID);
  }

  updateCategory(category: Category, userID: string) {
    return this.http.put('http://flock-1902.students.fhstp.ac.at/Backend/routes/category/updateCategory.php', {category, userID});
  }

  deleteCategory(CAID: number){
    return this.http.delete('http://flock-1902.students.fhstp.ac.at/Backend/routes/category/deleteCategory.php?CAID='+ CAID);
  }

  getCategoriesByUser(userID: string){
    return this.http.get<Category[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/category/getCategoriesByUser.php?userID='+ userID);
  }

  editCategory(CAID: number){
    this.router.navigate(['/insert-category/' + CAID]);
  }

  addCategory(){
    this.router.navigate(['/insert-category']);
  }

  allCategories() {
    this.router.navigate(['/my-categories']);
  }

}
