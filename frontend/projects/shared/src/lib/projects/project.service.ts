import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
}

@Injectable({
  providedIn: null
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  findProjectInfo(apiPrefix: string, projectId: string): Observable<ProjectInfo> {
    return this.httpClient.get<ProjectInfo>(`${apiPrefix}/meta/projects/${projectId}`);
  }
}
