import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { map, shareReplay, tap, concatMap, finalize,} from 'rxjs/operators';

@Injectable()
export class LoadingService {

    private loadingSubject$ = new BehaviorSubject<boolean>(false);

    loading$: Observable<boolean> = this.loadingSubject$.asObservable();

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null)
        .pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(()=> this.loadingOff())
        )
    }

    loadingOn() {
        this.loadingSubject$.next(true);
    }

    loadingOff() {
        this.loadingSubject$.next(false);
    }
}