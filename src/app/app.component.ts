import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiReponse } from 'src/model/apiResponse';
import { Medicine } from 'src/model/medicine';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'document-medicine-finder-web';

  fileName = '';
  isLoading = false;
  response: Medicine[] = [];
  errorResponse = '';
  isEmptyResponse = false;

  displayedColumns: string[] = ['name', 'genericName', 'brandName', 'manufacturer', 'pharmClass'];

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {

    let file: File;
    if (event.target) {
      file = event.target.files[0];
    } else {
      file = event;
    }

    if (file) {

      this.isLoading = true;
      this.isEmptyResponse = false;
      this.errorResponse = '';

      this.fileName = file.name;
      const formData = new FormData();

      formData.append("file", file);
      const analyzeRequest = this.http.post<ApiReponse>(`${environment.apiUrl}/MedAnalyzer`, formData);

      analyzeRequest.subscribe({
        next: (data: ApiReponse) => {
          if (data.results.length > 0) {
            this.response = data.results.map(x => new Medicine(x));
            this.updateDescription();
          } else {
            this.response = [];
            this.isEmptyResponse = true;
          }
          this.isLoading = false;
        },
        error: (e) => {
          this.errorResponse = "Error processing PDF";
          this.isLoading = false;
        }
      });
    }
  }

  updateDescription() {
    for (const item of this.response) {
      this.fetchDataForItem(item).subscribe();
    }
  }

  fetchDataForItem(item: Medicine): Observable<any> {
    return this.http.get<any>(`https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:${item.name}`).pipe(
      map((response: any) => {
        if (response.results) {
          var result = response.results[0];
          if (result.openfda) {
            item.genericName = result.openfda.generic_name;
            item.brandName = result.openfda.brand_name;
            item.manufacturer = result.openfda.manufacturer_name;
            item.pharmClass = result.openfda.pharm_class_epc;
          }
        }
        return item;
      })
    );
  }
}
