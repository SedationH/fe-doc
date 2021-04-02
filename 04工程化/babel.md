## babel的工作原理是什么

![2019-08-03-23-32-34](http://picbed.sedationh.cn/566a1ac865cfc0b1bf5511f377ff6828.png)

AST Abstract Synax Tree

1. Parse 将代码解析成抽象语法树，词法和语法分析
2. Transform 通过babel-traverse来遍历，过程中进行增删改
3. Generate 将完成步骤2的AST转化为JS，利用babel-generate

