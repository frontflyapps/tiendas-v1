import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProductService } from '../../../../shared/services/product.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-list-tags-product',
  templateUrl: './list-tags-product.component.html',
  styleUrls: ['./list-tags-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListTagsProductComponent implements OnInit, OnChanges {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() language;
  @Input() productId;
  @Input() tags: string[] = [];
  @Output() $changeTags: EventEmitter<any> = new EventEmitter();

  constructor(private productService: ProductService, private utilsService: UtilsService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.language) {
      this.language = changes.language.currentValue;
    }
    if (changes.productId) {
      this.productId = changes.productId.currentValue;
    }
    if (changes.tags) {
      this.tags = changes.tags.currentValue;
      this.tags = !this.tags ? [] : this.tags;
      this.$changeTags.next(this.tags);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let searchValues = [];
    if (this.tags && this.tags.length) {
      searchValues = this.tags.filter((tag) => tag.trim().toLocaleLowerCase() === value.trim().toLowerCase());
    }

    // Add our fruit
    if ((value || '').trim() && !searchValues.length && this.tags.length < 10) {
      this.tags.push(value.trim());
      if (this.productId) {
        this.productService.editProduct({ id: this.productId, tags: this.tags }).subscribe(
          (data) => {
            this.$changeTags.next(data.data.tags);
          },
          (error) => {
            this.utilsService.errorHandle(error);
          },
        );
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
      if (this.productId) {
        this.productService.editProduct({ id: this.productId, tags: this.tags }).subscribe(
          (data) => {
            this.$changeTags.next(data.data.tags);
          },
          (error) => {
            this.utilsService.errorHandle(error);
          },
        );
      }
    }
  }
}
