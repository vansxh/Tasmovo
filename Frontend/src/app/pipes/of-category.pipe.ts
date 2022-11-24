import { Pipe, PipeTransform } from '@angular/core';
import {Task} from "../services/task/task";

@Pipe({
  name: 'ofCategory'
})
export class OfCategoryPipe implements PipeTransform {

  transform(tasks: Task[], category: number): Task[] {
    if(tasks) {
      return tasks.filter(task => {
        return task.categoryID == category;
      });
    } else return [];
  }

}
