import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';

import { APIClient } from '../../../services/api-client.service';
import { User } from '../../../models/user.model';
import { Session } from '../../../services/session.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements AfterViewInit {
  nameValue = '';
  usernameValue = '';
  emailValue = '';
  bioValue = '';
  selectedFile: any;
  imagePreview: string;
  user: User;

  constructor(private apiClient: APIClient,
              private location: Location,
              private session: Session) {}

  ngAfterViewInit(): void {
    const userId = this.session.userId();
    this.loadUser(userId);
  }

  onSubmit() {
    const userId = this.session.userId();

    const updateClosure = (avatar?: string) => {
      this.apiClient.updateUser(userId, this.nameValue, this.usernameValue,
        this.emailValue, this.bioValue, avatar).subscribe(
          () => this.location.back(),
          (error) => window.alert(error.message)
        );
    };

    if (this.selectedFile) {
      this.apiClient.uploadImage(this.selectedFile).subscribe(
        (data: any) => updateClosure(data.filename),
        (error) => window.alert(error.message)
      );
    } else {
      updateClosure();
    }
  }

  onChange(files: any[]) {
    this.selectedFile = files[0];
    this.getImagePreview(this.selectedFile);
  }

  getImagePreview(file: File) {
    if (!file) {
      this.imagePreview = '';
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
  }

  loadUser(userId: number) {
    this.apiClient.getUser(userId).subscribe(
      (data) => {
        this.user = data;
        this.nameValue = data.name;
        this.usernameValue = data.username;
        this.emailValue = data.email;
        this.bioValue = data.bio;
      },
      (error) => console.error(`Loading user failed: ${error.message}`)
    );
  }
}
