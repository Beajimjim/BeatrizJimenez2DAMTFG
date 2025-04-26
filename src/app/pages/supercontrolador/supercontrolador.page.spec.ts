import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupercontroladorPage } from './supercontrolador.page';

describe('SupercontroladorPage', () => {
  let component: SupercontroladorPage;
  let fixture: ComponentFixture<SupercontroladorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupercontroladorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
