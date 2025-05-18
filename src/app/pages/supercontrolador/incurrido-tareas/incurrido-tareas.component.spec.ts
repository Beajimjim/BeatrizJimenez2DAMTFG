import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncurridoTareasComponent } from './incurrido-tareas.component';

describe('IncurridoTareasComponent', () => {
  let component: IncurridoTareasComponent;
  let fixture: ComponentFixture<IncurridoTareasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IncurridoTareasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncurridoTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
