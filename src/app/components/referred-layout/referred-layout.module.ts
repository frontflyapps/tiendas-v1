import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferredLayoutRoutingModule } from './referred-layout-routing.module';
import { ReferredLayoutComponent } from './referred-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatRippleModule } from '@angular/material/core';
import { InviteFriendComponent } from './invite-friend/invite-friend.component';
import { MyFriendsComponent } from './my-friends/my-friends.component';


@NgModule({
  declarations: [
    ReferredLayoutComponent,
    InviteFriendComponent,
    MyFriendsComponent
  ],
  imports: [
    CommonModule,
    ReferredLayoutRoutingModule,
    TranslateModule,
    FlexLayoutModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    ClipboardModule,
  ],
})
export class ReferredLayoutModule { }
