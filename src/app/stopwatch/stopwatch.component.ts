import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {StopwatchService} from '../shared/services/stopwatch.service';
import {MainTime} from '../shared/interfaces/mainTime.interface';


@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {
  public isStarted = false;
  public isWait = false;
  private lastClick: number;
  private subscription: Subscription;
  public timeForDisplay: MainTime = {
    h: '00',
    m: '00',
    s: '00',
  };

  private timer$: Observable<MainTime>;

  constructor(private stopwatchService: StopwatchService) {}

  runStopwatch(): void {
    if (!this.isStarted) {
      if (!this.isWait) {
        this.timer$ = this.stopwatchService.startTimer();
      }
      else if (this.isWait) {
        const currentTime =
          (+this.timeForDisplay.h * 3600 +
            +this.timeForDisplay.m * 60 +
            +this.timeForDisplay.s) *
          1000;
        this.timer$ = this.stopwatchService.startTimer(currentTime);
      }
      this.subscription = this.stopwatchService.timerStream$.subscribe(
        (time) => {
          this.timeForDisplay = time;
        }
      );
    }
    else {
      this.stopwatchService.subscription.unsubscribe();
      this.subscription.unsubscribe();
      for (let item in this.timeForDisplay) {
        this.timeForDisplay[item] = '00';
      }
    }
    this.isStarted = !this.isStarted;
    this.isWait = false;
  }
  pauseStopwatch(event): void {
    if (this.lastClick) {
      let diff = event.timeStamp - this.lastClick;
      if (diff <= 300) {
        this.subscription.unsubscribe();
        this.stopwatchService.subscription.unsubscribe();
        this.isStarted = false;
        this.isWait = true;
      }
    }
    this.lastClick = event.timeStamp;
  }
  resetStopwatch(): void {
    this.stopwatchService.resetTimer();
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.stopwatchService.subscription.unsubscribe();
    this.subscription.unsubscribe();
  }
}
