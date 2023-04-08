import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export namespace Project {

  export interface Info {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    startsAt: Date;
    endsAt: Date;
  }

}

@Injectable({
  providedIn: null
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  findProjectInfo(apiPrefix: string, projectId: string): Observable<Project.Info> {
    return this.httpClient.get<Project.Info>(`${apiPrefix}/meta/projects/${projectId}`);
  }
}
