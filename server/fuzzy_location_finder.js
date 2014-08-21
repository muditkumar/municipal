/**
 * Finds a location in the 'Locations' collection, given an approximate search
 * string.
 * @constructor
 */
FuzzyLocationFinder = function () {
};

/**
 * Finds a location in the 'Locations' collection, given an approximate search
 * string.
 * @param searchStr - The search string.
 * @returns {Location} the best matched location, or null if no match found.
 */
FuzzyLocationFinder.prototype.findLocation = function (searchStr) {
  var locations = Locations.find({}, { name: true });

  // Explanation of params:
  // Search the 'locations' cursor for objects ...
  // ... whose 'hashtag' field is similar to ...
  // ... searchStr ...
  // ... within some Levenshtein distance (-1 => auto-infer best distance) ...
  // ... ignoring case.
  var match = mostSimilarString(locations, 'hashtag', searchStr, -1, false);

  if (match) {
    return Locations.findOne({ hashtag: match });
  } else {
    return null;
  }
};
