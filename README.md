# Express Bootstrap Pagination

[Express](http://expressjs.com/) middlware for generate standard page navigation bar styled with [Bootstrap 3](http://getbootstrap.com/).

## Installation

```bash
npm install --save express-bootstrap-pagination
```

or

```bash
yarn add express-bootstrap-pagination
```


## API

```javascript
const pagination = require( 'express-bootstrap-pagination' );
app.use( pagination );
```

Now in the Express `app.locals` added 2 functions:

* `pagination`
* `urlWithQuery`

Each function can be interpolated as string in the template engine.

### pagination( currentPage, totalPages, options )

This function have two required arguments:

* `currentPage` { number } - number of current page
* `totalPages` { number } - number of total pages

#### options

`options` { object } is optional argument.

* `round` { number } - number of pages around the current page. Default: 4
* `outer` { number } - number of outer window pages (first and last pages). Default 2
* `param` { string } - name of param for query url. Default: 'page'
* `query` { string } - additional query string to url. Optional
* `class` { string } - additional CSS class name for main pagination container. Optional
* `start` { number } - start number for query string. Default: 1. Optional

### urlWithQuery( query )

`query` { object } - object with query parameters and its values. For replace query.

Parameters with `undefined`, `null` and empty values will be removed from query.

## Example

Template engine is [pug2](https://pugjs.org/)

```jade

//- Pagination
if ( totalPages > 1 )
  !=pagination( currentPage, totalPages, { round: 2 } )

//- urlWithQuery
a( class='btn' href=urlWithQuery( { status: 'free' } ) ) Free
a( class='btn' href=urlWithQuery( { status: 'busy' } ) ) Busy
a( class='btn' href=urlWithQuery( { status: null } ) ) All

```
