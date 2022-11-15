import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private http: HttpClient
  ) {
  }

  sendShootEvent() {
    this.http.post(environment.backendUrl + "/send-button", null)
      .subscribe(
        () => console.log('Send event.')
      );
  }
}
