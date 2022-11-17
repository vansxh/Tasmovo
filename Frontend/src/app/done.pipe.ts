import { Pipe, PipeTransform } from '@angular/core';
import { Task } from "./services/task/task";

@Pipe({
  name: 'done'
})

// pipe for only getting tasks that are DONE
export class DonePipe implements PipeTransform {

  transform(tasks: Task[]): Task[] {
    if(tasks) {
      return tasks.filter(task => {
        return task.statusID == 2;
      });
    } else return [];
  }

}
