import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { mapImage, mapUser } from '../shared/utils/mappers';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

@Injectable()
export class APIClient {
  private apiRoot = environment.apiRoot;

  constructor(private http: HttpClient,
              private cache: CacheService) {}

  // Private

  private url(urlPath: string) {
    return this.apiRoot + urlPath;
  }

  // Session

  loginUser(email: string, password: string) {
    const url = this.url('/sessions');
    const body = { email, password };
    return this.http.post(url, body);
  }

  logoutUser() {
    const url = this.url('/sessions');
    return this.http.delete(url);
  }

  // User

  createUser(name: string, username: string, email: string, password: string) {
    const url = this.url('/users');
    const body = { name, username, email, password };
    return this.http.post(url, body);
  }

  getUser(userId: number, clearCache = false) {
    const url = this.url(`/users/${userId}`);

    if (clearCache) {
      this.cache.delete(url);
    }

    return this.http.get(url).pipe(
      map((res: any) => mapUser(res))
    );
  }

  updateUser(userId: number, name: string, username: string,
             email: string, bio: string, avatar?: string) {
    const url = this.url(`/users/${userId}`);
    const body: any = { name, username, email, bio };

    if (avatar) {
      body.avatar = avatar;
    }

    return this.http.put(url, body);
  }

  changePassword(userId: number, oldPassword: string, password: string) {
    const url = this.url(`/users/${userId}`);
    const body = { password, oldPassword };
    return this.http.put(url, body);
  }

  // Image

  createImage(filename: string, description: string) {
    const url = this.url('/images');
    const body = { filename, description };
    return this.http.post(url, body);
  }

  getImages(url: string) {
    return this.http.get(url).pipe(
      map((res: any) => res.items.map((item) => mapImage(item)))
    );
  }

  getAllImages(page: number) {
    const url = this.url(`/images?page=${page}`);
    return this.getImages(url);
  }

  getImagesByUser(userId: number, page: number) {
    const url = this.url(`/users/${userId}/images?page=${page}`);
    return this.getImages(url);
  }

  getImagesLikedByUser(userId: number, page: number) {
    const url = this.url(`/users/${userId}/likes?page=${page}`);
    return this.getImages(url);
  }

  getImage(imageId: number) {
    const url = this.url(`/images/${imageId}`);

    return this.http.get(url).pipe(
      map((res: any) => mapImage(res))
    );
  }

  deleteImage(imageId: number) {
    const url = this.url(`/images/${imageId}`);
    return this.http.delete(url);
  }

  uploadImage(file: File) {
    const url = this.url(`/uploads`);

    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.http.post(url, formData);
  }

  likeImage(imageId: number) {
    const url = this.url(`/images/${imageId}/likes`);
    return this.http.post(url, {});
  }

  unlikeImage(imageId: number) {
    const url = this.url(`/images/${imageId}/likes`);
    return this.http.delete(url);
  }
}
