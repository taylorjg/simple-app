// Source: http://country.io/names.json
import names from './countries.json'

import * as R from 'ramda'

export const countries =
  R.pipe(
    R.toPairs,
    R.map(([key, value]) => ({ name: value, code: key })),
    R.sort(R.ascend(R.prop('name')))
  )(names)

export const defaultCountry =
  countries.find(R.propEq('code', 'GB'))
