https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness



```js
"a1" == true
```

Stirng Boolean

`ToNumber(A) === ToNumber(B)`



## <

The operands are compared using the [Abstract Relational Comparison](https://tc39.es/ecma262/#sec-abstract-relational-comparison) algorithm, which is roughly summarised below:

- First, objects are converted to primitives using `Symbol.ToPrimitive` with the `hint` parameter be `'number'`.
- If both values are strings, they are compared as strings, based on the values of the Unicode code points they contain.
- Otherwise JavaScript attempts to convert non-numeric types to numeric values:
  - Boolean values `true` and `false` are converted to 1 and 0 respectively.
  - `null` is converted to 0.
  - **`undefined` is converted to `NaN`.**
  - Strings are converted based on the values they contain, and are converted as `NaN` if they do not contain numeric values.
- If either value is `NaN`, the operator returns `false`.
- Otherwise the values are compared as numeric values.

