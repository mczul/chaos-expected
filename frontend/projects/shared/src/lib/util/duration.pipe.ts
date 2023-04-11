import {Pipe, PipeTransform} from '@angular/core';
import {formatDistance, parseISO} from "date-fns";
import {de} from "date-fns/locale";

export interface Auditable {
  startsAt: string;
  endsAt: string;
}

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(value: Auditable, ...args: unknown[]): string {
    return formatDistance(parseISO(value.startsAt), parseISO(value.endsAt), {locale: de});
  }

}
