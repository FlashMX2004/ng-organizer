import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Task {
    id?: string
    title: string
    date?: string
}

// Response from Firebase after http GET method
interface DBTasksCollection { [id: string]: Task; }
// Response from Firebase after http POST method
interface POSTResponse { name: string }

@Injectable({providedIn: 'root'})
export class TasksService {
    // URL to database
    static dburl = environment.nosqlConnectionString;
    
    constructor(private http: HttpClient) { }
    
    //
    // Load function using http GET method to get tasks list of some date
    //
    load(date: moment.Moment): Observable<Task[]> {
        // Url of nosql document
        // IMPORTANT: Don't forget write .json to the end of URL!
        const url: string = `${TasksService.dburl}/${date.format(environment.dbDateFormat)}.json`;

        return this.http.get<DBTasksCollection>(url)
                        .pipe(
                            map(tasks => {
                                if (!tasks) {
                                    return [];
                                } else {
                                    return Object.keys(tasks).map<Task>(key => ({...tasks[key], id: key}))
                                }
                            })
                        )
    }

    //
    // Create function using http POST method to send task to server
    //
    create(task: Task): Observable<Task> {
        // Url of nosql document
        // IMPORTANT: Don't forget write .json to the end of URL!
        const url = `${TasksService.dburl}/${task.date}.json`;

        return this.http.post<POSTResponse>(url, task)
                        .pipe(
                            map(response => {
                                return {...task, id: response.name};
                            })
                        );
    }

    //
    //
    //
    remove(task: Task): Observable<void> {
        // Url of nosql document
        // IMPORTANT: Don't forget write .json to the end of URL!
        const url = `${TasksService.dburl}/${task.date}/${task.id}.json`
        return this.http.delete<void>(url);
    }
}