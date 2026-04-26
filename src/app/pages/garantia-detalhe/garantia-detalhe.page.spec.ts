import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GarantiaDetalhePage } from './garantia-detalhe.page';

describe('GarantiaDetalhePage', () => {
  let component: GarantiaDetalhePage;
  let fixture: ComponentFixture<GarantiaDetalhePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GarantiaDetalhePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
