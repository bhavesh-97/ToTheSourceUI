import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Common {

    public static compareValues(key: string | number, order = 'asc') {
        return function innerSort(a: { [x: string]: any; hasOwnProperty: (arg0: string | number) => any; }, b: { [x: string]: any; hasOwnProperty: (arg0: string | number) => any; }) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }
            const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }
    public static arrayToStringWithComma<T>(arr: T[] | null | undefined,key: keyof T,dbType: 'INTEGER' | 'STRING' | 'NUMBER' | 'BOOLEAN' = 'STRING'
  ): string {
    if (!arr || arr.length === 0) {
      return dbType === 'STRING' ? "''" : 'NULL';
    }

    if (dbType === 'INTEGER' || dbType === 'NUMBER') {
      return arr
        .map(item => {
          const val = item[key];
          if (val === null || val === undefined) return 'NULL';
          const num = Number(val);
          return isNaN(num) ? 'NULL' : String(num);
        })
        .join(', ');
    }

    if (dbType === 'BOOLEAN') {
      return arr
        .map(item => {
          const val = item[key];
          if (val === null || val === undefined) return 'NULL';
          return val ? '1' : '0';
        })
        .join(', ');
    }

    // Default: STRING
    return arr
      .map(item => {
        const val = item[key];
        if (val === null || val === undefined) return 'NULL';
        return `'${String(val).replace(/'/g, "''")}'`; // Escape ' → ''
      })
      .join(', ');
  }

  /** Single value → formatted string (for single param) */
  public static singleToString(value: any,dbType: 'INTEGER' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' = 'STRING'): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }

    switch (dbType) {
      case 'INTEGER':
      case 'NUMBER':
        const num = Number(value);
        return isNaN(num) ? 'NULL' : String(num);

      case 'BOOLEAN':
        return value ? '1' : '0';

      case 'DATE':
        return `'${new Date(value).toISOString().slice(0, 19).replace('T', ' ')}'`;

      case 'STRING':
      default:
        return `'${String(value).replace(/'/g, "''")}'`;
    }
  }
  /** Convert array → @-separated string (e.g., for stored procedures) */
  public static arrayToStringWithAtTheRate<T>(arr: T[] | null | undefined,key: keyof T,dbType: 'INTEGER' | 'STRING' | 'NUMBER' = 'STRING'): string {
    if (!arr || arr.length === 0) {
      return '';
    }

    if (dbType === 'INTEGER' || dbType === 'NUMBER') {
      return arr
        .map(item => {
          const val = item[key];
          const num = Number(val);
          return isNaN(num) ? '0' : String(num);
        })
        .join('@');
    }
    return arr
      .map(item => String(item[key] ?? ''))
      .join('@');
  }
    public static CheckNullOrUndefined(value: string | null): boolean {
        return typeof value === "undefined" || value == '' || value == null
    }
    public static getFormattedDate(input: string) {
        try {
            if (input) {
                const newdate = new Date(input);
                return newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate();
            }
            else { return ''; }
        }
        catch (e) { return ''; }
    }

    public static secondsToHHMMSS(totalSeconds: any): string {
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds % 3600 / 60) % 60;

        // if you want strings with leading zeroes:
        let min = String(minutes).padStart(2, "0");
        let hr = String(hours).padStart(2, "0");
        return (hr + ":" + min + ":00");
    }


    public static durationToSeconds(hms: string): number {
        var a = hms.split(':');
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        return seconds;
    }
}
