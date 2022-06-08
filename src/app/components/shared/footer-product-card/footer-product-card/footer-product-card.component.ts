import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { CartService } from '../../services/cart.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-footer-product-card',
  templateUrl: './footer-product-card.component.html',
  styleUrls: ['./footer-product-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterProductCardComponent {

  public imageUrl = environment.apiUrl;

  @Input() Products: any[] = [];

  @Input() language = 'es';

  constructor(
    public cdr: ChangeDetectorRef,
    public currencyService: CurrencyService,
    public cartService: CartService,
    public utilsService: UtilsService
  ) {
  }
}
