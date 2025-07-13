import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchRegisterModalComponent } from './match-register-modal.component';

describe('MatchRegisterModalComponent', () => {
  let component: MatchRegisterModalComponent;
  let fixture: ComponentFixture<MatchRegisterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchRegisterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchRegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
