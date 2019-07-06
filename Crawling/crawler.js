//import dependencies/modules
const cheerio = require("cheerio");
const rp = require("request-promise");
const request = require('request');
const {KindleBook, AudibleBook, HardcoverBook, PaperbackBook, GeneralProduct} = require("./classes.js");

//declare arrays
var productUrls = [];
var kindleBooks = [];
var audibleBooks = [];
var hardcoverBooks = [];
var paperbackBooks = [];
var totalProducts = [];

//crawler entry point domain
const site = "https://www.amazon.com";

//initial rp options
let options = {
  method: 'GET',
  uri: site,
  gzip: true,
  decodeEntities: true,
  transform: function (body) {
        return cheerio.load(body);
    }
}

//npm start message
console.log('Executing crawler.js');

//Begin scraping https://www.amazon.com/
rp(options).then(
  function($) {
    console.log("Crawling https://www.amazon.com")
    booksUrl = '/books';
    options.uri = site + booksUrl;
    //navigate to books category
    rp(options).then(
       function($) {
         console.log("Crawling /books route.")
        //push all product urls on page into products array
        $('.a-link-normal').each(function(i, elem){
          var hrefSubstring = $(elem).attr('href').split('/');
          if ((hrefSubstring[1] + '/' + hrefSubstring[2]) == 'gp/product') {
            productUrls.push(site + "/" + hrefSubstring[1] + '/' + hrefSubstring[2] + '/' + hrefSubstring[3])
          }
        })
        console.log(productUrls);
        console.log('Processing Urls...Please wait.')
        //iterate over each url in productUrls array
        for (let productUrl of productUrls) {
          options.uri = productUrl
          //navigate within individual book pages
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
              } else if ($('#title').find("Audible")) {
                var audibleBook = new AudibleBook(
                  $('#productTitle').text().trim(),
                  $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
                  //description selector broken
                  $('#iframeContent').text(),
                  //Buffer.from($('.feature').find('img').attr('src').replace('\n|data:image/jpeg;base64,|\n\n\n\n\n\n\n\n', ''), 'base64').toString('utf8')
                )
                //if hardcoverBook, create hardcover object
              } else if ($('#productTitle').find("span:contains('Hardcover')")) {
                var hardcoverBook = new HardcoverBook(
                  $('#productTitle').text().trim(),
                  $('.a-color-price').text().trim().split(' ')[0].replace('$', ''),
                  //description selector broken
                  $('#iframeContent').text(),
                  //imgUrl not displaying properly
                  //Buffer.from($('#img-canvas>img').attr('src').replace('\ndata:image/jpeg;base64,', ''), 'base64').toString('utf8')
                )
              } else if ($('#productTitle').find("span:contains('Paperback')")) {
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
                //console.log(kindleBook);
                kindleBooks.push(kindleBook);
                totalProducts.push(kindleBook);
              } else if (audibleBook) {
                console.log(audibleBook);
                audibleBooks.push(kindleBook);
                totalProducts.push(audibleBook);
              } else if (hardcoverBook) {
                console.log(hardcoverBook);
                hardcoverBook.push(hardcoverBook);
                totalProducts.push(hardcoverBook);
              } else if (paperbackBook) {
                console.log(paperbackBook);
                hardcoverBook.push(hardcoverBook);
                totalProducts.push(paperbackBook);
              }
            }).then((result)=> {
              if (totalProducts.length == productUrls.length) {
                console.log(totalProducts);
                console.log('Completed Crawl.');
              }
            })
        }
    })
  }
)

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
