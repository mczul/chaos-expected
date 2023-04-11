import { Pipe, PipeTransform } from '@angular/core';
import {formatDistanceToNow, parseISO} from "date-fns";
import {de} from "date-fns/locale";

@Pipe({
  name: 'distanceToNow',
  standalone: true
})
export class DistanceToNowPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return formatDistanceToNow(parseISO(value), {locale: de, addSuffix: true});
  }

}
