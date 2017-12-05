
const COLLECTION_MARKER = '$collection';
const URL_MARKER        = '$url';
const SCOPE_MARKER      = '$scope';

const FILTER_RE = /(?!\(){([\S\s]*)}(?=\))/gi;

class ReferenceParserError extends Error {
  constructor(message) {
      super(message);
      this.name = "Reference parser error";
  }
}

class ReferenceParser {
  static parseCollectionReference(str) {

    const pathRE        = /(?!}\.)([a-zA-Z_0-9\[\]][a-zA-Z_0-9\[\]\.]*)$/gi;
    const collectionRE  = /([a-zA-Z_]+[a-zA-Z_0-9]*)(?=\?)/gi;

    const collection = str.match(collectionRE);
    if (collection == null)
      throw new ReferenceParserError('Collection or filter cannot be recognized');

    const filter = str.match(FILTER_RE);
    if (filter == null)
      throw new ReferenceParserError('Collection or filter cannot be recognized');


    const path = str.match(pathRE);

    return {
        source: 'collection',
        collection: collection[0],
        filter: filter[0],
        path: (path) ? path[0] : null
    };
  }

  static parseUrlReference(str) {

    const urlRE = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

    const url = str.match(urlRE);
    if (url == null)
      throw new ReferenceParserError('Url or filter cannot be recognized');

    const filter = str.match(FILTER_RE);
    if (filter == null)
      throw new ReferenceParserError('Url or filter cannot be recognized');

    return {
        source: 'url',
        url: url[0],
        filter: filter[0]
    };
  }

  static parseScopeReference(str) {

    str.replace(SCOPE_MARKER, '');

    const scopeRE = /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/gi;

    const scope = str.match(scopeRE);

    return {
      source: 'scope',
      scope: scope[0]
    };
  }
}

module.exports = {
  parse(str) {

    switch (str) {
      case str.contains(COLLECTION_MARKER):
        return ReferenceParser.parseCollectionReference(str);

      case str.contains(URL_MARKER):
        return ReferenceParser.parseUrlReference(str);

      case str.contains(SCOPE_MARKER):
        return ReferenceParser.parseScopeReference(str);

      default:
        throw new ReferenceParserError('Invalid data source');
    }
  }
}
