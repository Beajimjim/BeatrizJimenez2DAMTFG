import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResumenEstimacionComponent } from './resumen-estimacion.component';

describe('ResumenEstimacionComponent', () => {
  let component: ResumenEstimacionComponent;
  let fixture: ComponentFixture<ResumenEstimacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ResumenEstimacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenEstimacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
