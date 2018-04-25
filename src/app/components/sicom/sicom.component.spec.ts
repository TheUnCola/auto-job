import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SicomComponent } from './sicom.component';

describe('SicomComponent', () => {
  let component: SicomComponent;
  let fixture: ComponentFixture<SicomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SicomComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SicomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
