import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  intermediateCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;


  constructor(private coursesService: CoursesService, 
              private loadingService: LoadingService) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses(){
    // this.loadingService.loadingOn();
    let courses$ = this.coursesService.loadAllCourses()
                    .pipe(
                      map(res => res.sort(sortCoursesBySeqNo))
                      // finalize(()=> this.loadingService.loadingOff())
                    );
    const loadCourses$= this.loadingService.showLoaderUntilCompleted(courses$);
    this.beginnerCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category === 'BEGINNER')));
    this.intermediateCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category === 'INTERMEDIATE')));
    this.advancedCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category === 'ADVANCED')));
  }
}




