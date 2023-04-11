import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenUuid',
  standalone: true,
})
export class ShortenUuidPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const UUID_REGEX = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/g;

    if(!UUID_REGEX.test(value)) {
      console.warn(`[ShortenUuidPipe] Given input does not match regular expression: "${value}"`);
      return '???';
    }
    return value.slice(0, 6);
  }

}

