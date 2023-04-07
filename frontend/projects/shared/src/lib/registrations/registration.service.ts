import {Injectable} from '@angular/core';
import {catchError, combineLatest, map, materialize, Observable, of, tap} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {RegistrationCreateEvent} from "./registration-form.component";

const LOCAL_STORAGE_KEY_REGISTRATIONS = 'ce-registrations';

interface RegistrationCoordinates {
  projectId: string;
  registrationId: string;
}

export interface RegistrationInfo {
  id: string;
  projectId: string;
  emailAddress: string;
  createdAt: Date;
}

export type LoadingStatus = 'ACTIVE' | 'SUCCESS' | 'FAILURE';

@Injectable({
  providedIn: null
})
export class RegistrationService {
  protected knownRegistrations: ReadonlyArray<RegistrationCoordinates> = [];

  protected loadRegistrations(): RegistrationCoordinates[] {
    const localStorageContent = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRATIONS) ?? JSON.stringify([]);
    return JSON.parse(localStorageContent) as RegistrationCoordinates[];
  }

  protected rememberRegistration(newCoordinates: RegistrationCoordinates): void {
    const known = this.knownRegistrations.slice();
    if (known.some(present =>
      present.projectId === newCoordinates.projectId &&
      present.registrationId === newCoordinates.registrationId)) {
      return;
    }
    known.push(newCoordinates);
    localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, JSON.stringify(known));
    this.init();
  }

  protected forgetRegistration(coordinates: RegistrationCoordinates): void {
    const known = this.knownRegistrations.filter(present =>
      !(present.projectId === coordinates.projectId && present.registrationId === coordinates.registrationId)
    );
    localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, JSON.stringify(known));
    this.init();
  }

  protected verifyKnownRegistrations(apiPrefix: string): Observable<RegistrationInfo[]> {
    return combineLatest(
      this.knownRegistrations.map(({projectId, registrationId}) => {
        return this.findRegistration(apiPrefix, projectId, registrationId).pipe(materialize());
      })
    ).pipe(
      map(results => results
        .filter(result => result.kind === 'N')
        .map(result => result.value!))
    );
  }

  protected init(): void {
    this.knownRegistrations = this.loadRegistrations();

  }

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  loadKnownRegistrations(apiPrefix: string, projectId?: string): Observable<RegistrationInfo[]> {
    if (this.knownRegistrations.length === 0) {
      console.warn('[RegistrationService] No known registrations... returning null.')
      return of([]);
    }
    console.warn(`[RegistrationService] Found known registrations.`, this.knownRegistrations);

    const queryList = this.knownRegistrations
      .filter(coordinates => !projectId || coordinates.projectId === projectId)
      .map(coordinates => this.findRegistration(apiPrefix, coordinates.projectId, coordinates.registrationId));

    if (queryList.length === 0) {
      return of([]);
    }

    return combineLatest(queryList).pipe(
      map(results => results.filter(registration => !!registration) as RegistrationInfo[]),
    );
  }

  findRegistration(
    apiPrefix: string,
    projectId: string,
    registrationId: string
  ): Observable<RegistrationInfo> {
    console.warn(`[RegistrationService] Loading registration ${registrationId} for project ${projectId}`);

    return this.httpClient
      .get<RegistrationInfo>(`${apiPrefix}/meta/projects/${projectId}/registrations/${registrationId}`)
      .pipe(
        tap(() => this.rememberRegistration({projectId, registrationId})),
        catchError((err) => {
          console.warn(`[RegistrationService] Failed to find known registration.`, err);
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case HttpStatusCode.Gone:
                this.forgetRegistration({projectId, registrationId});
            }
          }
          throw err;
        }),
      );
  }

  createRegistration(
    apiPrefix: string,
    projectId: string,
    event: RegistrationCreateEvent,
  ): Observable<RegistrationInfo> {
    return this.httpClient
      .post<RegistrationInfo>(`${apiPrefix}/meta/projects/${projectId}/registrations`, event)
      .pipe(
        tap(({projectId, id: registrationId}) => this.rememberRegistration({projectId, registrationId}))
      );
  }

}
