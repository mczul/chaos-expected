import {Injectable} from '@angular/core';
import {catchError, combineLatest, map, materialize, Observable, of, tap} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";

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
  providedIn: 'root'
})
export class ProjectService {
  protected _known: ReadonlyArray<string> = [];

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

  loadKnown(apiPrefix: string): Observable<Project.Info[]> {
    if (this._known.length === 0) {
      console.warn('[ProjectService] No known projects.')
      return of([]);
    }
    console.warn(`[ProjectService] Found known projects.`, this._known);

    return combineLatest(this._known.map(knownId => this.findInfo(apiPrefix, knownId).pipe(materialize()))).pipe(
      map(result => result.filter(response => response.kind === 'N')),
      map(result => result.map(response => response.value!))
    );
  }

  findInfo(apiPrefix: string, projectId: string): Observable<Project.Info> {
    return this.httpClient.get<Project.Info>(`${apiPrefix}/meta/projects/${projectId}`)
      .pipe(
        tap(() => this.remember(projectId)),
        catchError(err => {
          console.warn(`[ProjectService] Failed to find project.`, err);
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case HttpStatusCode.Gone:
                this.forget(projectId);
                break;
            }
          }
          throw err;
        })
      );
  }
}
