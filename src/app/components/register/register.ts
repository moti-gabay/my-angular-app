import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone:true,
  templateUrl: './register.html',
  imports: [CommonModule,FormsModule,HttpClientModule],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const data = { name: this.name, email: this.email, password: this.password };
    this.http.post('http://localhost:5000/auth/register', data)
      .subscribe({
        next: (res) => {
          alert('נרשמת בהצלחה!');
          // ניתן לעשות ניתוב לדף התחברות
        },
        error: (err) => {
          alert('שגיאה בהרשמה');
        }
      });
  }
}
