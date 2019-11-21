import {GalleryItem} from '@ngx-gallery/core';

export class DetectExceptionInfo {
  exception: string;
  exceptionImageFileNames: string[];
}

export class MesAutoExceptionInfo {
  exception: string;
  exceptionImageFileNames: string[];
}

export class Silk {
  id: string;
  code: string;
  rfidNum: number;
  lineMachineItem: number;
  spindle: number;
  lineName: string;
  batchNo: string;
  batchSpec: string;
  detectExceptionInfos: DetectExceptionInfo[];
  mesAutoExceptionInfos: MesAutoExceptionInfo[];
  eliminateHandled: boolean;
  buildDateTime: Date;
  endDateTime: Date;
  galleryItems: GalleryItem[];

  static assign(...sources: any[]): Silk {
    const result = Object.assign(new Silk(), ...sources);
    return result;
  }

  static toEntities(os: Silk[], entities?: { [id: string]: Silk }): { [id: string]: Silk } {
    return (os || []).reduce((acc, cur) => {
      acc[cur.id] = Silk.assign(cur);
      return acc;
    }, {...(entities || {})});
  }
}
