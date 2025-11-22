import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignInUserComponent } from './sign-in-user.component';
describe('SignInUserComponent', () => {
  let component: SignInUserComponent;
  let fixture: ComponentFixture<SignInUserComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SignInUserComponent]
}).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SignInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
