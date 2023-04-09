import {Injectable} from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

const LOCAL_STORAGE_KEY_PROJECTS = 'ce-projects';

export namespace Project {

  export interface Info {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    startsAt: string;
    endsAt: string;
  }

}

@Injectable({
  providedIn: null
})
export class ProjectService {
  protected _known: string[] = [];

  protected init(): void {
    const serialized = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS) ?? '[]';
    this._known = JSON.parse(serialized) as string[];
  }

  protected remember(projectId: string): void {
    if (this._known.indexOf(projectId) !== -1) {
      return;
    }
    const updated = this._known.slice().concat(projectId);
    const serialized = JSON.stringify(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, serialized);
    this.init();
  }

  protected forget(obsolete: string): void {
    if (this._known.indexOf(obsolete) === -1) {
      return;
    }
    const filtered = this._known.filter(known => known !== obsolete);
    const serialized = JSON.stringify(filtered);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, serialized);
    this.init();
  }

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  findProjectInfo(apiPrefix: string, projectId: string): Observable<Project.Info> {
    return this.httpClient.get<Project.Info>(`${apiPrefix}/meta/projects/${projectId}`)
      .pipe(
        tap(() => this.remember(projectId)),
        catchError(err => {
          this.forget(projectId);
          throw err;
        })
      );
  }
}
