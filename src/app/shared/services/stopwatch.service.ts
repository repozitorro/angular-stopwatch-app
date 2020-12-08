import { Injectable } from '@angular/core';
import { timer, Observable, BehaviorSubject, Subscription } from 'rxjs';
import {MainTime} from '../interfaces/mainTime.interface';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  private time$: Observable<number> = timer(0, 1000);
  private startTime: number;
  private timerTimeInMS: number;
  public subscription: Subscription;
  private timeForDisplay: MainTime = {
    h: '00',
    m: '00',
    s: '00'
  };
  public timerStream$: BehaviorSubject <MainTime> = new BehaviorSubject<MainTime>(this.timeForDisplay);

  constructor() { }
  startTimer(initialTime?: number): Observable<MainTime> {
    if (!initialTime){
      this.startTime = Date.now();
    }
    else{
      this.startTime = Date.now() - initialTime;
    }
    this.subscription = this.time$.subscribe(() => {
      this.timerTimeInMS = Date.now() - this.startTime;
      this.convertTime();
      this.timerStream$.next(this.timeForDisplay);
    });
    return this.timerStream$.asObservable();
  }
  convertTime(): void{
    const sec: number = Math.round(this.timerTimeInMS / 1000);
    const s: number = sec % 60;
    const h: number = Math.floor(sec / 60 / 60);
    const m: number = (Math.floor(sec / 60)) - (h * 60);
    if (h >= 10){
      this.timeForDisplay.h = String(h);
    }
    else { this.timeForDisplay.h = String(`0${h}`); }
    if (m >= 10){
      this.timeForDisplay.m = String(m);
    }
    else { this.timeForDisplay.m = String(`0${m}`); }
    if (s >= 10){
      this.timeForDisplay.s = String(s);
    }
    else { this.timeForDisplay.s = String(`0${s}`); }
  }
  resetTimer(): void{
    this.subscription.unsubscribe();
    this.startTimer();
  }
}
