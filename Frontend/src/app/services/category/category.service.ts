import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from './category';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) {
  }

  insertCategory(category: Category) {
    return this.http.post('/Backend/routes/category/insertCategory.php', category);
  }

  getCategory(CAID: number) {
    return this.http.get('/Backend/routes/category/getCategory.php?CAID=' + CAID);
  }

  updateCategory(category: Category) {
    return this.http.put('/Backend/routes/category/updateCategory.php', category);
  }

  deleteCategory(CAID: number) {
    return this.http.delete('/Backend/routes/category/deleteCategory.php?CAID=' + CAID);
  }

  getCategoriesByUser() {
    return this.http.get<Category[]>('/Backend/routes/category/getCategoriesByUser.php');
  }

  editCategory(CAID: number) {
    this.router.navigate(['/insert-category/' + CAID]);
  }

  addCategory() {
    this.router.navigate(['/insert-category']);
  }

  allCategories() {
    this.router.navigate(['/my-categories']);
  }

  showCategory(CAID: number) {
    this.router.navigate(['/category/' + CAID]);
  }

}
