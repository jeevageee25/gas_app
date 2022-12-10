import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviledgesComponent } from './previledges.component';

describe('PreviledgesComponent', () => {
  let component: PreviledgesComponent;
  let fixture: ComponentFixture<PreviledgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviledgesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviledgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
