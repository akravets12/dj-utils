
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
    const filter = str.match(FILTER_RE);
    const path = str.match(pathRE);

    if (!collection || !filter)
      throw new ReferenceParserError('Collection or filter cannot be recognized');

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

    if (!url)
      throw new ReferenceParserError('Url cannot be recognized');

    return {
        source: 'url',
        url: url[0]
    };
  }

  static parseScopeReference(str) {

    const scopeRE = /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/gi;

    const strSplitted = str.split(SCOPE_MARKER);
    const scope = strSplitted[1].match(scopeRE);

    if (!scope)
      throw new ReferenceParserError('Scope name cannot be specified');

    return {
      source: 'scope',
      scope: scope[0]
    };
  }
}

module.exports = {
	parse(str) {

    if (str.contains(COLLECTION_MARKER))
      return ReferenceParser.parseCollectionReference(str.replace(COLLECTION_MARKER, ''));

    if (str.contains(URL_MARKER))
      return ReferenceParser.parseUrlReference(str.replace(URL_MARKER, ''));

    if str.contains(SCOPE_MARKER))
      return ReferenceParser.parseScopeReference(str.replace(SCOPE_MARKER, ''));

    throw new ReferenceParserError('Invalid data source');

	}
}
