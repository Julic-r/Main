import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

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
    this.http.post("http://localhost:8080/send-button", null)
      .subscribe(
        () => console.log('Send event.')
      );
  }
}
