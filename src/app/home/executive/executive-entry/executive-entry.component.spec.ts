import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveEntryComponent } from './executive-entry.component';

describe('ExecutiveEntryComponent', () => {
  let component: ExecutiveEntryComponent;
  let fixture: ComponentFixture<ExecutiveEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutiveEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
