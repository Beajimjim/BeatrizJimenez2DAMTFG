import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscritorioPage } from './escritorio.page';

describe('EscritorioPage', () => {
  let component: EscritorioPage;
  let fixture: ComponentFixture<EscritorioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscritorioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
