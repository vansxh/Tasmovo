import { Pipe, PipeTransform } from '@angular/core';
import {Category} from "../services/category/category";

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(categories: Category[]): Category[] {
    if(categories) {
      return categories.filter(category => {
        return category.parent_categoryID === null;
      });
    } else return [];
  }

}
