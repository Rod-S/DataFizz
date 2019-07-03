const cheerio = require("cheerio");
const site = "https://www.amazon.com";
const fs = require("fs")
const rp = require("request-promise");
const request = require('request')

//start message
console.log('Executing crawler.js');

class Product {
  constructor(name, listPrice, description, productDimensions, imageUrls, weight) {
    this.name = name;
      this.listPrice = listPrice;
      this.description = description;
      this.productDimensions = productDimensions;
      this.imageUrls = imageUrls;
      this.weight = weight;
  }}

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
            var product = new Product(
              $('#ebooksProductTitle').text().trim(),
              $('.kindlePriceLabel').next().text().trim().split(' ')[0].replace('$', '')
            )
            console.log(product);
          })
  }
});
