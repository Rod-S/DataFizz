const cheerio = require("cheerio");
const site = "https://www.amazon.com";
const fs = require("fs")
const rp = require("request-promise");

//start message
console.log('Executing crawler.js');

//Define object classes - 4 main product types within Amazon book category
class KindleBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class AudibleBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class HardcoverBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class SoftcoverBook {
  constructor(name, listPrice, description, productDimensions, imageUrls, weight) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageUrls = imageUrls;
    this.weight = weight;
  }
}

class GeneralProduct {
  constructor(name, listPrice, description, productDimensions, imageUrls, weight) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageUrls = imageUrls;
    this.weight = weight;
  }
}

//initial rp options
let options = {
  method: 'GET',
  uri: site + "/b/ref=usbk_surl_books/?node=283155",
  gzip: true,
  transform: function (body) {
        return cheerio.load(body);
    }
}

//Begin scraping https://www.amazon.com/b/ref=usbk_surl_books/?node=283155, load html through cheerio
rp(options).then(
   function($) {
    var products = [];
    var kindleBooks = [];
    var audibleBooks = [];
    var hardcoverBooks = [];
    var paperbackBooks = [];
    //push all product urls on page into products array
    $('.a-link-normal').each(function(i, elem){
      var hrefSubstring = $(elem).attr('href').split('/');
      if ( (hrefSubstring[1] + '/' + hrefSubstring[2]) == 'gp/product') {
          products.push(site + "/" + hrefSubstring[1] + '/' + hrefSubstring[2] + '/' + hrefSubstring[3])
      }
    })
    console.log(products);
    //iterate over each product in products
    for (let i=0;i < products.length; i++) {
      //options.uri = products[i];
      options = {
        method: 'GET',
        uri: products[i],
        gzip: true,
        transform: function (body) {
              return cheerio.load(body);
        }
      }
      rp(options).then(
        function($) {
          //if kindleBook, create kindle object
          if ($('#ebooksProductTitle').length) {
            var kindleBook = new KindleBook(
              $('#ebooksProductTitle').text().trim(),
              $('.kindlePriceLabel').next().text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              $('#ebooks-img-canvas>img').attr('src')
            )
            //if audibleBook, create audible object
          } else if ($('#productTitle').length) {
            var audibleBook = new AudibleBook(
              $('#productTitle').text().trim(),
              $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              $('#main-image').attr('src')
            )
            //if hardcoverBook, create hardcover object
          } if ($('#dp.book').length) {
            var hardcoverBook = new HardcoverBook(
              $('#productTitle').text().trim(),
              $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              //imgUrl not displaying properly
              document.atob($('#img-canvas>img').attr('src'))

            )
          }
          if(kindleBook) {
          console.log(kindleBook);
        } if (audibleBook) {
          console.log(audibleBook);
        } if (hardcoverBook) {
          console.log(hardcoverBook);
        }
      })
    }
});
