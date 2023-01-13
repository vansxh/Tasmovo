import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from './category';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  parentCAID!: number;

  constructor(private http: HttpClient, private router: Router) {
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

  addCategory(CAID: number) {
    this.parentCAID = CAID;
    this.router.navigate(['/insert-category']);
  }

  showCategory(CAID: number) {
    this.router.navigate(['/category/' + CAID]);
  }

  showSubCategory(CAID: number) {
    this.router.navigate(['/sub-category/' + CAID]);
  }

  getAllCategoriesByUser() {
    return this.http.get<Category[]>('/Backend/routes/category/getAllCategoriesByUser.php');
  }

  getAllSubCategories(CAID: number) {
    return this.http.get<Category[]>('/Backend/routes/category/getAllSubCategories.php?CAID=' + CAID);
  }

}
