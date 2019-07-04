const cheerio = require("cheerio");
const site = "https://www.amazon.com";
const fs = require("fs")
const rp = require("request-promise");
const {KindleBook, AudibleBook, HardcoverBook, PaperbackBook, GeneralProduct} = require("./classes.js");
//const AudibleBook = require("./classes.js").AudibleBook;
//const HardcoverBook = require("./classes.js").HardcoverBook;
//const PaperbackBook = require("./classes.js").PaperbackBook;
//const GeneralProduct = require("./classes.js").GeneralProduct;

//start message
console.log('Executing crawler.js');

//Define object classes - 4 main product types within Amazon book category

//initial rp options
let options = {
  method: 'GET',
  uri: site + "/b/ref=usbk_surl_books/?node=283155",
  gzip: true,
  decodeEntities: true,
  transform: function (body) {
        return cheerio.load(body);
    }
}

//Begin scraping https://www.amazon.com/b/ref=usbk_surl_books/?node=283155, load html through cheerio


rp(options).then(
   function($) {
    var productUrls = [];
    var kindleBooks = [];
    var audibleBooks = [];
    var hardcoverBooks = [];
    var paperbackBooks = [];
    //push all product urls on page into products array
    $('.a-link-normal').each(function(i, elem){
      var hrefSubstring = $(elem).attr('href').split('/');
      if ( (hrefSubstring[1] + '/' + hrefSubstring[2]) == 'gp/product') {
          productUrls.push(site + "/" + hrefSubstring[1] + '/' + hrefSubstring[2] + '/' + hrefSubstring[3])
      }
    })
    console.log(productUrls);
    //iterate over each product in products
    for (let i=0;i < productUrls.length; i++) {
      //options.uri = products[i];
      options = {
        method: 'GET',
        uri: productUrls[i],
        gzip: true,
        decodeEntities: true,
        transform: function (body) {
          return cheerio.load(body);
        }
      }
      rp(options).then(
        function($) {
          //if kindleBook, create kindle object
          if ($('#ebooksProductTitle').next().has('Kindle')) {
            var kindleBook = new KindleBook(
              $('#ebooksProductTitle').text().trim(),
              $('.kindlePriceLabel').next().text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              $('#ebooksImgBlkFront').attr('src')
            )
            //if audibleBook, create audible object
          } if ($('#title').find("Audible")) {
            var audibleBook = new AudibleBook(
              $('#productTitle').text().trim(),
              $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              //Buffer.from($('.feature').find('img').attr('src').replace('\n|data:image/jpeg;base64,|\n\n\n\n\n\n\n\n', ''), 'base64').toString('utf8')
            )
            //if hardcoverBook, create hardcover object
          } if ($('#productTitle').find("span:contains('Hardcover')")) {
            var hardcoverBook = new HardcoverBook(
              $('#productTitle').text().trim(),
              $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              //imgUrl not displaying properly
              //Buffer.from($('#img-canvas>img').attr('src').replace('\ndata:image/jpeg;base64,', ''), 'base64').toString('utf8')
            )
          } if ($('#productTitle').find("span:contains('Paperback')")) {
            var paperbackBook = new PaperbackBook(
              $('#productTitle').text().trim(),
              $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
              //description selector broken
              $('#iframeContent').text(),
              //imgUrl not displaying properly
              //Buffer.from($('#img-canvas>img').attr('src').replace('\ndata:image/jpeg;base64,', ''), 'base64').toString('utf8')
            )
          }
          if(kindleBook) {
            console.log(kindleBook);
          }
          if (audibleBook) {
            console.log(audibleBook);
          }
          if (hardcoverBook) {
            console.log(hardcoverBook);
          }
          if (paperbackBook) {
            console.log(paperbackBook);
          }
      })
    }

});

/*
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
*/
