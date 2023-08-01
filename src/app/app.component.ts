import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiReponse } from 'src/model/apiResponse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'document-medicine-finder-web';

  fileName = '';
  isLoading = false;
  response: ApiReponse = new ApiReponse();
  errorResponse = '';

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.isLoading = true;
      this.errorResponse = '';

      this.fileName = file.name;
      const formData = new FormData();

      formData.append("file", file);
      const upload$ = this.http.post<ApiReponse>(`${environment.apiUrl}/MedAnalyzer`, formData);

      upload$.subscribe({
        next: (data: ApiReponse) => {
          this.response = data;
          this.isLoading = false;
        },
        error: (e) => {
          this.errorResponse = "Error processing PDF";
          this.isLoading = false;
        }
      })
    }
  }
}
