import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolCard } from './tool-card';

describe('ToolCard', () => {
  let component: ToolCard;
  let fixture: ComponentFixture<ToolCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
