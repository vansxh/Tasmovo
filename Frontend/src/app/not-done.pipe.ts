import { Pipe, PipeTransform } from '@angular/core';
import { Task } from "./services/task/task";

@Pipe({
  name: 'notDone'
})

// pipe for only getting tasks that are NOT DONE
export class NotDonePipe implements PipeTransform {

  transform(tasks: Task[]): Task[] {
    if(tasks) {
      return tasks.filter(task => {
        return task.statusID == 1;
      });
    } else return [];
  }

}
