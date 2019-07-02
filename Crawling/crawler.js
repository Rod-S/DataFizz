const cheerio = require("cheerio");
const site = "https://www.amazon.com";
const fs = require("fs")
const request = require("request");

//start message
console.log('Executing crawler.js');

//Begin scraping https://www.amazon.com/b/ref=usbk_surl_books/?node=283155, load html through cheerio
request({
  method: 'GET',
  uri: site + "/b/ref=usbk_surl_books/?node=283155",
  gzip: true
}, function(error, response, html) {
    var products = [];
    var $ = cheerio.load(html);
    //push all product urls on page into products array
    $('.a-link-normal').each(function(i, elem){
      var hrefSubstring = $(elem).attr('href').split('/');
      if ( (hrefSubstring[1] + '/' + hrefSubstring[2]) == 'gp/product') {
        if () {
          products.push(site + "/" + hrefSubstring[1] + '/' + hrefSubstring[2] + '/' + hrefSubstring[3])
        }
      }
    });
    console.log(products);
    return products;
});
