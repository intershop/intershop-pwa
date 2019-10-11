import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Contact } from 'ish-core/models/contact/contact.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { ContactService } from './contact.service';

describe('Contact Service', () => {
  let contactService: ContactService;
  let apiService: ApiService;

  const subject = ['Return', 'Order Request'];

  const subjectData = { elements: [subject] };

  const contactData: Contact = {
    comment: 'Where is my order?',
    email: 'p.miller@test.intershop.de',
    name: 'Patricia Miller',
    phone: '12345',
    subject: 'Order Request',
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    contactService = new ContactService(instance(apiService));
  });

  it("should get all available subjects when 'getContactSubjects' is called", done => {
    when(apiService.get(`contact`)).thenReturn(of(subjectData));

    contactService.getContactSubjects().subscribe(() => {
      verify(apiService.get(`contact`)).once();
      done();
    });
  });

  it("should create a contact request when 'createContactRequest' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({ test: 'test' }));

    contactService.createContactRequest(contactData).subscribe(() => {
      verify(apiService.post(`contact`, anything(), anything())).once();
      done();
    });
  });
});
