import {Injectable} from '@angular/core';
import {catchError, combineLatest, map, materialize, Observable, of, take, tap} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {RegistrationCreateEvent} from "./registration-form.component";

const LOCAL_STORAGE_KEY_REGISTRATIONS = 'ce-registrations';

export namespace Registration {

  export interface Coordinates {
    projectId: string;
    registrationId: string;
  }

  export function toCoordinates(source: Info): Coordinates {
    return {projectId: source.projectId, registrationId: source.id};
  }

  export interface Info {
    id: string;
    projectId: string;
    emailAddress: string;
    createdAt: Date;
  }

}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  protected _known: ReadonlyArray<Registration.Coordinates> = [];

  protected load(): Registration.Coordinates[] {
    const localStorageContent = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRATIONS) ?? '[]';
    return JSON.parse(localStorageContent) as Registration.Coordinates[];
  }

  protected remember(newCoordinates: Registration.Coordinates): void {
    if (this._known.some(present =>
      present.projectId === newCoordinates.projectId &&
      present.registrationId === newCoordinates.registrationId)) {
      return;
    }
    const updated = this._known.slice().concat(newCoordinates);
    const serialized = JSON.stringify(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, serialized);
    this.init();
  }

  protected forget(obsolete: Registration.Coordinates): void {
    const filtered = this._known.filter(present =>
      !(present.projectId === obsolete.projectId && present.registrationId === obsolete.registrationId)
    );
    const serialized = JSON.stringify(filtered);
    localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, serialized);
    this.init();
  }

  protected verifyKnown(apiPrefix: string): Observable<Registration.Info[]> {
    return combineLatest(
      this._known.map(({projectId, registrationId}) => {
        return this.findInfo(apiPrefix, projectId, registrationId).pipe(materialize());
      })
    ).pipe(
      map(results => results
        .filter(result => result.kind === 'N')
        .map(result => result.value!))
    );
  }

  protected init(): void {
    this._known = this.load();
  }

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  loadKnown(apiPrefix: string, projectId?: string): Observable<Registration.Info[]> {
    if (this._known.length === 0) {
      console.warn('[RegistrationService] No known registrations.')
      return of([]);
    }
    console.warn(`[RegistrationService] Found known registrations.`, this._known);

    const queryList = this._known
      .filter(coordinates => !projectId || coordinates.projectId === projectId)
      .map(coordinates => this.findInfo(apiPrefix, coordinates.projectId, coordinates.registrationId)
        .pipe(
          materialize(),
          // necessary to prevent emissions on complete
          take(1)
        )
      );

    if (queryList.length === 0) {
      return of([]);
    }

    return combineLatest(queryList).pipe(
      map(result => result.filter(response => response.kind === 'N')),
      map(result => result.map(response => response.value!))
    );
  }

  findInfo(
    apiPrefix: string,
    projectId: string,
    registrationId: string
  ): Observable<Registration.Info> {
    console.warn(`[RegistrationService] Loading registration ${registrationId} for project ${projectId}`);

    return this.httpClient
      .get<Registration.Info>(`${apiPrefix}/meta/projects/${projectId}/registrations/${registrationId}`)
      .pipe(
        tap(() => this.remember({projectId, registrationId})),
        catchError((err) => {
          console.warn(`[RegistrationService] Failed to find registration.`, err);
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case HttpStatusCode.Gone:
                this.forget({projectId, registrationId});
            }
          }
          throw err;
        }),
      );
  }

  create(
    apiPrefix: string,
    projectId: string,
    event: RegistrationCreateEvent,
  ): Observable<Registration.Info> {
    return this.httpClient
      .post<Registration.Info>(`${apiPrefix}/meta/projects/${projectId}/registrations`, event)
      .pipe(
        tap(({projectId, id: registrationId}) => this.remember({projectId, registrationId}))
      );
  }

}
