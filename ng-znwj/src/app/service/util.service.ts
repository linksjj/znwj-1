import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {isArray, isObject} from 'util';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient,
              private translate: TranslateService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  showSuccess(message?: string, action?: string, config?: MatSnackBarConfig) {
    config = config || {duration: 3000};
    message = message || 'Toast.success';
    this.translate.get(message).subscribe(res => this.snackBar.open(res, action, config));
  }

}

export const SILK_COMPARE = (a, b) => moment(a.buildDateTime).isAfter(b.buildDateTime) ? -1 : 1;

export const VALIDATORS = {
  isEntity: (control: AbstractControl): ValidationErrors | null => {
    const value = control && control.value;
    if (value && !value.id) {
      return {isEntity: true};
    }
    return null;
  },
  isInt: (options?: { allow_leading_zeroes: boolean }) => {
    const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
    const intLeadingZeroes = /^[-+]?[0-9]+$/;
    const regex = (options && !options.allow_leading_zeroes) ? int : intLeadingZeroes;
    return (control: AbstractControl) => {
      const value = control && control.value;
      if (regex.test(value)) {
        return null;
      }
      return {isInt: true};
    };
  },
};
export const COPY = (s: string) => {
  const el = document.createElement('textarea');
  el.value = s;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
export const COPY_WITH_CTRL = (s: string, ev: MouseEvent) => {
  if (ev.ctrlKey) {
    COPY(s);
  }
};
export const upEle = (array: any[], ele: any): any[] => {
  if (!array || !ele || !isArray(array)) {
    return array;
  }
  array = [...(array || [])];
  const i = array.findIndex(it => {
    if (it === ele) {
      return true;
    }
    if (isObject(it)) {
      return (it && it.id) === ele.id;
    }
    return false;
  });
  if (i <= 0) {
    return array;
  }
  array[i] = array[i - 1];
  array[i - 1] = ele;
  return array;
};
export const downEle = (array: any[], ele: any): any[] => {
  if (!array || !ele || !isArray(array)) {
    return array;
  }
  array = [...(array || [])];
  const i = array.findIndex(it => {
    if (it === ele) {
      return true;
    }
    if (isObject(it)) {
      return (it && it.id) === ele.id;
    }
    return false;
  });
  if (i < 0 || i === (array.length - 1)) {
    return array;
  }
  array[i] = array[i + 1];
  array[i + 1] = ele;
  return array;
};
export const CHECK_Q = (sV: string, qV: string): boolean => {
  let s = sV || '';
  let q = qV || '';
  if (q) {
    s = s.toLocaleLowerCase();
    q = q.toLocaleLowerCase();
    return s.includes(q);
  }
  return true;
};

export const SEARCH_DEBOUNCE_TIME = 500;
export const PAGE_SIZE_OPTIONS = [30, 50, 100];

export const DEFAULT_COMPARE = (o1: any, o2: any): number => {
  if (o1.id === '0') {
    return -1;
  }
  if (o2.id === '0') {
    return 1;
  }
  return moment(o1.modifyDateTime).isAfter(o2.modifyDateTime) ? -1 : 1;
};
export const SORT_BY_COMPARE = (o1: any, o2: any): number => {
  if (o1 && o2) {
    return (o1 === o2 || o1.id === o2.id) ? 0 : o2.sortBy - o1.sortBy;
  }
  return o1 ? 1 : -1;
};
export const CODE_COMPARE = (o1: any, o2: any): number => {
  if (o1 && o2) {
    return (o1 === o2 || o1.id === o2.id) ? 0 : o1.code.localeCompare(o2.code);
  }
  return o1 ? 1 : -1;
};
