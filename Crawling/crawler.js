//import dependencies/modules
const fs = require("fs");
const cheerio = require("cheerio");
const rp = require("request-promise");
const {KindleBook, AudibleBook, HardcoverBook, PaperbackBook, NoCategory} = require("./classes.js");

//declare arrays
var productURLs = [];
var totalProducts = [];

//crawler entry point domain
const site = "https://www.amazon.com";

//initial request options
let options = {
  method: 'GET',
  uri: site,
  gzip: true,
  decodeEntities: true,
  transform: function (body) {
        return cheerio.load(body);
    }
}

//create data folder if it does not exist
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
  console.log('./data subdirectory successfully created.')
}

//date format for JSON file
const formatDate = () => {
  var date = new Date(),
      month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

//Find total number of objects in object collection
function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

//npm start message
console.log('Executing crawler.js');

//Begin scraping https://www.amazon.com/
rp(options).then(
  function($) {
    console.log("Crawling https://www.amazon.com")
    booksURL = '/books';
    options.uri = site + booksURL;
    //navigate to books category https://www.amazon.com/books
    rp(options).then(
       function($) {
         console.log("Crawling /books route.")
        //push all product urls on page into products array
        $('.a-link-normal').each(function(i, elem){
          var hrefSubstring = $(elem).attr('href').split('/');
          if ((hrefSubstring[1] + '/' + hrefSubstring[2]) == 'gp/product') {
            if (hrefSubstring[3] != "B00NB86OYE") {
              productURLs.push(site + "/" + hrefSubstring[1] + '/' + hrefSubstring[2] + '/' + hrefSubstring[3])
            }
          }
        })
        console.log(productURLs);
        console.log('Processing URLs...Please wait.')
        //iterate over each productURL in productURLs array
        for (let productURL of productURLs) {
          options.uri = productURL
          //retrieve within individual book pages
          rp(options).then(
            function($) {
              //if Kindle Book, create kindleBook object
              if ($('.a-button-selected > span:nth-child(1):contains(Kindle)').text().trim().length) {
                var kindleBook = new KindleBook(
                  null,
                  $('#ebooksProductTitle').text().trim(),
                  parseFloat($('.kindlePriceLabel').next().text().trim().split(' ')[0].replace('$', '')),
                  //description selector broken
                  $('#iframeContent').text(),
                  $('#ebooksImgBlkFront').attr('src'),
                  productURL
                )
                //if Audible Book, create audibleBook object
              } if ($('#title > span:contains(Audible Audiobook)').text().trim().length) {
                  var audibleBook = new AudibleBook(
                    null,
                    $('#productTitle').text().trim(),
                    parseFloat($('#audible_buybox_accordion > div:nth-child(6) > div > div.a-accordion-row-a11y > a > h5 > div > div.a-column.a-span4.a-text-right.a-span-last > span').text().trim().split(' ')[0].replace('$', '')),
                    $('#iframeContent').text(),
                    $('#main-image').attr('src'),
                    productURL
                  )
                //if Hardcover Book, create hardcoverBook object
              } if ($('#title > span:contains(Hardcover)').text().trim() == 'Hardcover') {
                  var hardcoverBook = new HardcoverBook(
                    null,
                    $('#productTitle').text().trim(),
                    parseFloat($('span.a-size-medium.a-color-price.offer-price.a-text-normal').text().trim().split(' ')[0].replace('$', '')),
                    $('#iframeContent').text(),
                    $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Dimensions:)").text().trim().replace('Product Dimensions: \n    \n    ', '').replace('\n', ''),
                    $('.a-spacing-micro > img').attr('src'),
                    $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Shipping Weight:)").text().trim().replace('Shipping Weight: ', '').replace(' (View shipping rates and policies)', ''),
                    productURL
                  )
                //if Paperback Book, create paperbackBook object
              } if ($('#title > span:contains(Paperback)').text().trim() == 'Paperback') {
                var paperbackBook = new PaperbackBook(
                  null,
                  $('#productTitle').text().trim(),
                  parseFloat($('#buyNewSection > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text().trim().split(' ')[0].replace('$', '')),
                  $('#iframeContent').text(),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Dimensions:)").text().trim().replace('Product Dimensions: \n    \n    ', '').replace('\n', ''),
                  $('.a-spacing-micro > img').attr('src'),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Shipping Weight:)").text().trim().replace('Shipping Weight: ', '').replace(' (View shipping rates and policies)', ''),
                  productURL
                )
              }
              //push to arrays
              if (kindleBook) {
                kindleBook['type'] = 'kindle_book';
                kindleBooks.push(kindleBook);
                totalProducts.push(kindleBook);
              } if (audibleBook) {
                audibleBook['type'] = 'audible_book';
                audibleBooks.push(audibleBook);
                totalProducts.push(audibleBook);
              } if (hardcoverBook) {
                hardcoverBook['type'] = 'hardcover_book';
                hardcoverBooks.push(hardcoverBook);
                totalProducts.push(hardcoverBook);
              } if (paperbackBook) {
                paperbackBook['type'] = 'paperback_book';
                paperbackBooks.push(paperbackBook);
                totalProducts.push(paperbackBook);
              } if (!kindleBook && !audibleBook && !hardcoverBook && !paperbackBook) {
                noCategory = new NoCategory(
                  null,
                  $('#productTitle').text().trim(),
                  parseFloat($('span.a-size-medium.a-color-price.offer-price.a-text-normal').text().trim().split(' ')[0].replace('$', '')),
                  'description',
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Dimensions:)").text().trim().replace('Product Dimensions: \n    \n    ', '').replace('\n', ''),
                  $('.a-spacing-micro > img').attr('src'),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Shipping Weight:)").text().trim().replace('Shipping Weight: ', '').replace(' (View shipping rates and policies)', ''),
                  productURL
                )
                noCategory['type'] = $('#title > span:nth-child(2)').text() || 'other';
                totalProducts.push(noCategory);
              }
            }
          ).then((result)=> {
              if (totalProducts.length == productURLs.length) {
                const jsonFileName = `./data/${formatDate()}.json`;
                const stream = fs.createWriteStream((jsonFileName));
                totalBooksData = Object.assign({}, totalProducts);
                for (var i = 0; i < ObjectLength(totalBooksData); i++) {
                  totalBooksData[i].id = i;
                }
                allBooksJSON = JSON.stringify(totalBooksData);
                stream.write(allBooksJSON);
                console.log('Data successfully written to JSON file.');
              }
            })

        }
    })
  }
)
