import { Albums } from './Albums';
import { Users } from './Users';

export interface Photos {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface FullPhotos extends Photos {
  album ?: Albums,
  user ?: Users,
}
