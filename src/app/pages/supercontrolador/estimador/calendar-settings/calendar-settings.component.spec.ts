import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalendarSettingsComponent } from './calendar-settings.component';

describe('CalendarSettingsComponent', () => {
  let component: CalendarSettingsComponent;
  let fixture: ComponentFixture<CalendarSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CalendarSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
