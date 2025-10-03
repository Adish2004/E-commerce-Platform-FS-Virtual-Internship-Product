import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ✅ Test 1: Service creation
  fit('Frontend_UserService_should_be_created', () => {
    expect(service).toBeTruthy();
  });

  // ✅ Test 2: Register user
  fit('Frontend_UserService_should_register_a_user', () => {
    const mockUser: User = { username: 'test', email: 'test@example.com', password: '123456' };

    service.register(mockUser).subscribe(response => {
      expect(response).toBe('User registered successfully!');
    });

    const req = httpMock.expectOne(service['baseUrl'] + '/register');
    expect(req.request.method).toBe('POST');
    req.flush('User registered successfully!');
  });

  // ✅ Test 3: Login user
  fit('Frontend_UserService_should_login_a_user', () => {
    const email = 'test@example.com';
    const password = '123456';

    service.login(email, password).subscribe(response => {
      expect(response).toBe('Login successful!');
    });

    const req = httpMock.expectOne(service['baseUrl'] + `/login?email=${email}&password=${password}`);
    expect(req.request.method).toBe('POST');
    req.flush('Login successful!');
  });
});
