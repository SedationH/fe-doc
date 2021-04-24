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





```js
const toString = Object.prototype.toString;

toString.call(new Date);    // [object Date]
toString.call(new String);  // [object String]
toString.call(Math);        // [object Math]

// Since JavaScript 1.8.5
toString.call(undefined);   // [object Undefined]
toString.call(null);        // [object Null]
```

还有一些比较有用的数据类型判断函数

https://zhuanlan.zhihu.com/p/129642585

- Array.isArray

- global isNaN

- Number.isNaN
- Object.is 可用于NaN

![image-20200505173853415](/Users/sedationh/Library/Application Support/typora-user-images/image-20200505173853415.png)

## Q

```js
<script>
  const toString = Object.prototype.toString
  function Foo() {}
  Foo.prototype[Symbol.toStringTag] = 'Foo'
  Foo[Symbol.hasInstance] = function (ins) {
    console.log(1)
    return false
  }

  class Array1 {
    static [Symbol.hasInstance](instance) {
      console.log(1123)
      return Array.isArray(instance)
    }
  }

  console.log(1 instanceof Array1)

  const f1 = new Foo()
  console.log(toString.call(f1))

  console.log(f1 instanceof Foo)
</script>

```

这里的 hasInstance不知道如何处理的

不l理解babel是如何处理static的

