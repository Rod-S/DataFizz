
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
const objectLength = (object) => {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}



module.exports.formatDate = formatDate;
module.exports.objectLength = objectLength;
