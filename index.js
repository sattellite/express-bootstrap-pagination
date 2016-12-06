const qs = require( 'querystring' );

module.exports = ( req, res, next ) => {
  res.locals.pagination = pagination.bind( null, req.path, req.query );
  res.locals.urlWithQuery = relativePath.bind( null, req.path, req.query );
  next();
};

Array.intrange = function( start, end, step ) {
  const A = [];
  A[ 0 ] = start;
  step = step || 1;
  while ( start + step <= end ) {
    A[ A.length ] = start += step;
  }
  return A;
};

function pagination( path, pathquery, actual, count, opts ) {
  const withQuery = relativePath.bind( null, path, pathquery );
  if ( count <= 1 ) {
    return '';
  }
  if ( ! opts ) {
    opts = Object.create( null );
  }
  const round = opts.round || 4;
  const param = opts.param || 'page';
  let className = opts.class || '';

  const outer = opts.outer || 2;
  const query = opts.query || '';
  const start = opts.start || 1;

  // "+" в начале - хак для приведения к инту
  const current = Array.intrange( +actual - +round, +actual + +round );
  const first = Array.intrange( +start, +start + +outer - 1 );
  const tail = Array.intrange( +count - +outer + 1, +count );
  const ret = [];
  let last;

  const tempArr = [ ...current, ...first, ...tail ].sort( ( a, b ) => a - b );
  for ( let i = 0, len = tempArr.length; i < len; i++ ) {
    const number = tempArr[ i ];
    if ( ( last && last == number && start > 0 ) || ( last && last == number && start == 0 ) ) {
      continue;
    }
    if ( ( number <= 0 && start > 0 ) || ( number < 0 && start == 0 ) ) {
      continue;
    }
    if ( ( number > count && start > 0 ) || ( number >= count && start == 0 ) ) {
      break;
    }
    if ( last && last + 1 != number ) {
      ret.push( '..' );
    }
    ret.push( number );
    last = number;
  }
  let html = `<ul class="pagination ${className}">`;

  if ( actual == start ) {
    html += '<li class="disabled"><a href="#" >&laquo;</a></li>';
  } else {
    html += `<li><a href="${ withQuery( { [ param ] : actual - 1 } ) + query }" >&laquo;</a></li>`;
  }

  let lastNum = -1;
  for ( let i = 0, len = ret.length; i < len; i++ ) {
    const number = ret[ i ];
    const showNumber = ( start > 0 ) ? number : ( number.match( /\d+/ ) ? number + 1 : number );
    if ( number == '..' && lastNum < actual ) {
      const offset = Math.ceil( ( actual - round ) / 2 ) + 1;
      html += `<li><a href="${ withQuery( { [ param ]: start == 0 ? offset + 1 : offset } ) + query }" >&hellip;</a></li>`;
    } else if ( number == '..' && lastNum > actual ) {
      const back = count - outer + 1;
      const forw = round + actual;
      const offset = Math.ceil( ( ( back - forw ) / 2 ) + forw );
      html += `<li><a href="${ withQuery( { [ param ]: start == 0 ? offset + 1 : offset } ) + query }" >&hellip;</a></li>`;
    } else if ( number == actual ) {
      html += `<li class="active"><span>${ showNumber }</span></li>`;
    } else {
      html += `<li><a href="${ withQuery( { [ param ]: number } ) + query }">${ showNumber }</a></li>`;
    }
    lastNum = number;
  }

  if ( actual == count ) {
    html += '<li class="disabled"><a href="#" >&raquo;</a></li>';
  } else {
    html += `<li><a href="${ withQuery( { [ param ] : actual + 1 } ) + query }" >&raquo;</a></li>`;
  }
  html += '</ul>';

  return html;
}

function relativePath( path, pathquery, query ) {
  const newQuery = Object.assign( {}, pathquery, query );
  Object.keys( newQuery ).map( key => {
    // Remove undefined or empty
    if ( ! newQuery[ key ] || newQuery[ key ] === '' ) {
      delete newQuery[ key ];
    }
  } );
  return path + ( ( Object.keys( newQuery ).length > 0 ) ? '?' + qs.stringify( newQuery ) : '' );
}
