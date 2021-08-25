import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpVideoDemoComponent } from './tmp-video-demo.component';

describe('TmpVideoDemoComponent', () => {
  let component: TmpVideoDemoComponent;
  let fixture: ComponentFixture<TmpVideoDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmpVideoDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpVideoDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
