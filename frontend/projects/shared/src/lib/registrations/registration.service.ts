import {Injectable} from '@angular/core';
import {catchError, combineLatest, map, Observable, of, startWith, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
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

  protected init(): void {
    this.knownRegistrations = this.loadRegistrations();
  }

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  loadKnownRegistrations(apiPrefix: string, projectId?: string): Observable<RegistrationInfo[] | null> {
    if(this.knownRegistrations.length === 0) {
      console.warn('No known registrations... returning null.')
      return of(null);
    }
    console.warn(`[RegistrationService] Found known registrations.`, this.knownRegistrations);

    return combineLatest(
      this.knownRegistrations
        .filter(coordinates => !projectId || coordinates.projectId === projectId)
        .map(coordinates => {
          console.warn(coordinates);
          if (!projectId) {
            return of(null);
          }
          if (coordinates.projectId !== projectId) {
            return of(null);
          }
          return this.findRegistration(apiPrefix, coordinates.projectId, coordinates.registrationId)
            .pipe(catchError(() => of(null)))
        })
    ).pipe(
      map(results => {
        if(!results) {
          return null;
        }
        return results.filter(registration => !!registration) as RegistrationInfo[];
      }),
    );
  }

  findRegistration(
    apiPrefix: string,
    projectId: string,
    registrationId: string
  ): Observable<RegistrationInfo> {
    return this.httpClient
      .get<RegistrationInfo>(`${apiPrefix}/meta/projects/${projectId}/registrations/${registrationId}`)
      .pipe(tap(found => this.rememberRegistration(
        {projectId: found.projectId, registrationId: found.id}
      )));
  }

  createRegistration(
    apiPrefix: string,
    projectId: string,
    event: RegistrationCreateEvent,
  ): Observable<RegistrationInfo> {
    return this.httpClient
      .post<RegistrationInfo>(`${apiPrefix}/meta/projects/${projectId}/registrations`, event)
      .pipe(tap(created => this.rememberRegistration(
        {projectId: created.projectId, registrationId: created.id}
      )));
  }

}
