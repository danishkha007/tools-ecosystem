import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylePanel } from './style-panel';

describe('StylePanel', () => {
  let component: StylePanel;
  let fixture: ComponentFixture<StylePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(StylePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
