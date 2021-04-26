## Video

###  [How does HTTPS work? What's a CA? What's a self-signed Certificate?](https://www.youtube.com/watch?v=T4Df5_cojAs)

![image-20210426110106182](http://picbed.sedationh.cn/image-20210426110106182.png)



![image-20210426110135072](http://picbed.sedationh.cn/image-20210426110135072.png)

 

### [How HTTPS Works (...and SSL/TLS too)](https://www.youtube.com/watch?v=10aVMoalON8)

![image-20210426161926884](http://picbed.sedationh.cn/image-20210426161926884.png)



## Some Article about TSL(SSL)

https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/



https://juejin.cn/post/6870112924627632136#heading-1 (Recommended)



https://blog.csdn.net/freekiteyu/article/details/76423436

![劫持](http://picbed.sedationh.cn/a1da1f5acbfd6882536bd212428343ba.png)



## 用自己的话谈谈HTTPS

### Name

HTTP Hypertext Transfer protocol

HTTPS HTTP secure

secure是如何实现的呢？

在原有HTTP的基础上 加一层TSL (Transfer Security Layer)

![layers](http://picbed.sedationh.cn/52390b39d4d6105914273a8fadbd737f.png)



### TSL 解决了什么问题？

1. 解决明文传输的加密问题
2. 确认信息源的可信
3. 确认信息不被篡改 伪造 ->  Integrity



> - **Encryption:** hides the data being transferred from third parties.
> - **Authentication:** ensures that the parties exchanging information are who they claim to be.
> - **Integrity:** verifies that the data has not been forged or tampered with.



### How TSL solve these problems && the process of execution ?

先说过程

通过三次握手🤝建立TCP链接，还要经历TLS的两个关键步骤

1. 证书合法性验证
2. 数据加密传输



1保证了信息源的可信 其实信息源是可信的 -> 信息 就不会背篡改和伪造了

这个话题涉及中间人攻击

![劫持](http://picbed.sedationh.cn/a1da1f5acbfd6882536bd212428343ba-20210426170414880.png)

how？

引入CA(Certificate Autority) 公认的可信第三方

涉及的相关概念

- 属于谁
- 数字签名
- public key

2保证HTTP报文中的数据

how？

加密

- 对称加密

一个加密key

通过这一个key就可以decode && encode

- 非对称加密

这里主要是用于处理session key的传输，就是上面对称加密所用到的key

逻辑就是decode 需要 public key && private key

private key 仅仅保存在 server上

加密仅仅需要public key