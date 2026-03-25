import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCompressor } from './image-compressor';

describe('ImageCompressor', () => {
  let component: ImageCompressor;
  let fixture: ComponentFixture<ImageCompressor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCompressor],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCompressor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
