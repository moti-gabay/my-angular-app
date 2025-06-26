import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-login',
  standalone:true,
  templateUrl: './login.html',
  imports: [CommonModule,FormsModule,HttpClientModule],
  providers: [CookieService]

})
export class LoginComponent {
  email = '';
  password = '';

constructor(private AuthService: AuthService) {}

  onSubmit() {
    this.AuthService.login(this.email).subscribe({
      next: () => {
        alert('התחברת בהצלחה!');
        // ניתוב לעמוד אחר
      },
      error: (err) => {
        alert('שגיאה בהתחברות');
        console.error(err);
      }
    });
  }
}
