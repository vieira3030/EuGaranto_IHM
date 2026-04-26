import { TestBed } from '@angular/core/testing';

import { Garantias } from './garantias';

describe('Garantias', () => {
  let service: Garantias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Garantias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
