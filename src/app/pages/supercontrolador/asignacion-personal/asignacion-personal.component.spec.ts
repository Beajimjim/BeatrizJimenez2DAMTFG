import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AsignacionPersonalComponent } from './asignacion-personal.component';

describe('AsignacionPersonalComponent', () => {
  let component: AsignacionPersonalComponent;
  let fixture: ComponentFixture<AsignacionPersonalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AsignacionPersonalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
