import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  setMeta(title = '', description = '', shareImg = '', keywords = '', url = environment?.meta?.mainPage?.url) {
    let titleTag = document.querySelector('title');
    let metaDescriptionTag = document.querySelector(`meta[name="description"]`);
    let metaKeyWords = document.querySelector(`meta[name="keywords"]`);
    let ogSiteName = document.querySelector(`meta[property="og:site_name"]`);
    let ogTitle = document.querySelector(`meta[property="og:title"]`);
    let ogDescription = document.querySelector(`meta[property="og:description"]`);
    let ogImage = document.querySelector(`meta[property="og:image"]`);
    let ogUrl = document.querySelector(`meta[property="og:url"]`);

    if (title) {
      titleTag.innerText = title;
      ogSiteName.setAttribute('content', title);
      ogTitle.setAttribute('content', title);
    }
    if (description) {
      metaDescriptionTag.setAttribute('content', description);
      ogDescription.setAttribute('content', description);
    }
    if (keywords) {
      metaKeyWords.setAttribute('content', keywords);
    }
    if (shareImg) {
      ogImage.setAttribute('content', shareImg);
    }
    if (url) {
      ogUrl.setAttribute('content', url);
    }
  }
}

// <meta property="og:site_name" content="Tienda online">
// <meta property="og:title" content="Tienda online">
// <meta property="og:description" content="Tienda online, negocios B2C and C2C">
// <meta property="og:image" content="https://www.sinkoola.com/assets/images/share-img.png">
