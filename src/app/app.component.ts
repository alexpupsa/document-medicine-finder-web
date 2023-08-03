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

  displayedColumns: string[] = ['name', 'genericName', 'brandName', 'manufacturer', 'pharmClass'];

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.isLoading = true;
      this.errorResponse = '';

      this.fileName = file.name;
      const formData = new FormData();

      formData.append("file", file);
      const analyzeRequest = this.http.post<ApiReponse>(`${environment.apiUrl}/MedAnalyzer`, formData);

      analyzeRequest.subscribe({
        next: (data: ApiReponse) => {
          this.response = data.results.map(x => new Medicine(x));
          this.isLoading = false;
          this.updateDescription();
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
