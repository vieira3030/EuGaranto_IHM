import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistarGarantiaPage } from './registar-garantia.page';

describe('RegistarGarantiaPage', () => {
  let component: RegistarGarantiaPage;
  let fixture: ComponentFixture<RegistarGarantiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistarGarantiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
