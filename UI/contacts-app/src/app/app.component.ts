import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  http = inject(HttpClient);

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false),
  });

  contacts$ = this.getContacts();

  onFormSubmit() {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite ?? false,
    };

    this.http
      .post('https://localhost:7061/api/Contacts', addContactRequest)
      .subscribe({
        next: () => {
          this.contacts$ = this.getContacts();
          this.contactsForm.reset();
        },
      });
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7061/api/Contacts/${id}`).subscribe({
      next: () => {
        alert('Contact deleted');
        this.contacts$ = this.getContacts();
      },
    });
  }

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7061/api/Contacts').pipe(
      map((contacts: Contact[]) => {
        const favorites = contacts.filter((contact) => contact.favorite);
        const nonFavorites = contacts.filter((contact) => !contact.favorite);

        favorites.sort((a, b) => a.name.localeCompare(b.name));
        nonFavorites.sort((a, b) => a.name.localeCompare(b.name));

        return favorites.concat(nonFavorites);
      })
    );
  }
}
