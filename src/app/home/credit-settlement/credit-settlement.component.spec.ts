import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSettlementComponent } from './credit-settlement.component';

describe('CreditSettlementComponent', () => {
  let component: CreditSettlementComponent;
  let fixture: ComponentFixture<CreditSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
