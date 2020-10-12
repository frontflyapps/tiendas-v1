import {
  Component, OnInit, ViewEncapsulation,
  Input, Output, EventEmitter, SimpleChanges, OnChanges
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { BlogService } from '../../../services/blog/blog.service';


@Component({
  selector: 'app-list-tags-blog',
  templateUrl: './list-tags-blog.component.html',
  styleUrls: ['./list-tags-blog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListTagsBlogComponent implements OnInit, OnChanges {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() language;
  @Input() blogId;
  @Input() tags: string[] = [];
  @Output() $changeTags: EventEmitter<any> = new EventEmitter();

  constructor(private blogService: BlogService,
    private utilsService: UtilsService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.language) {
      this.language = changes.language.currentValue;
    }
    if (changes.blogId) {
      this.blogId = changes.blogId.currentValue;
    }
    if (changes.tags) {
      this.tags = changes.tags.currentValue;
      this.tags = (!this.tags) ? [] : this.tags;
      this.$changeTags.next(this.tags);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let searchValues = [];
    if (this.tags && this.tags.length) {
      searchValues = this.tags.filter(tag => (tag.trim().toLocaleLowerCase() === value.trim().toLowerCase()));
    }

    // Add our fruit
    if ((value || '').trim() && !searchValues.length && this.tags.length < 10) {
      this.tags.push(value.trim());
      if (this.blogId) {
        this.blogService.editBlog({ id: this.blogId, tags: this.tags }).subscribe((data) => {
          this.$changeTags.next(data.data.tags);
        }, error => { this.utilsService.errorHandle(error); });
      } else {
        this.$changeTags.next(this.tags);
      }


    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      if (this.blogId) {
        this.blogService.editBlog({ id: this.blogId, tags: this.tags }).subscribe((data) => {
          this.$changeTags.next(data.data.tags);
        }, error => { this.utilsService.errorHandle(error); });
      } else {
        this.$changeTags.next(this.tags);
      }

    }
  }

}
