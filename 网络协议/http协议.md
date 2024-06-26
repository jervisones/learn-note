### HTTP 发展历程


HTTP-version 发展历史

* HTTP/0.9: 只支持GET方法，过时
* HTTP/1.0: RFC1945, 1996, 常见于代理服务器（例如Nginx默认配置）
* HTTP/1.1: RFC2616,1999
* http/2.0: 2015.5正式发布



1990年 HTTP/0.9 为了便于服务器和客户端处理，采用了纯文本格式，只运行使用GET请求。在响应请求之后会立即关闭连接。

1996年 HTTP/1.0 真强了 0.9 版本，引入了 HTTP Header (头部) 的概念，传输的数据不再仅限于文本，可以解析图片音乐等，增加了相应状态码和POST,HEAD 等请求方法。

1999年广泛使用 HTTP/1.1,正式标准，允许持久连接(keep-alive)，允许相应数据粉快，增加了缓存管理和控制，增加了PUT、DELETE 等新的方法。 (问题：多个请求并发怎么解决？ 管线化：同一时间对单个域名发送多个请求)

2015年HTTP/2,使用HPACK 算法压缩头部，减少数据传输量。允许服务器主动向客户端推送数据，二进制协议可发起多个请求，使用时需要对请求加密通信。（多路复用：1条TCP链接来通信数据帧）

2018年 HTTP/3 基于 UDP 的 QUIC 协议。

目前市面上HTTP/2 的使用率达到了6~7成、HTTP/3 达到百分之7左右。

### 第一章：Http/1.1协议


>HTTP 协议定义：
> 一种**无状态**、应用层的、**以请求/应答**方式运行的协议，它使用可拓展的语义和**文字描述**消息格式，与基于网络的**超文本信息**系统灵活地互动。

这里指的文本描述的意思，是协议用字符串可见字符文本作为载体（说白了就是明文）

[RFC-7230](https://tools.ietf.org/html/rfc7230)


- 基于tcp传输层，半双工通信，请求应答模式的纯文本协议。 http 默认是无状态的(默认tcp不能在没有应答完成后复用tcp通道继续发送信息）。这时候就出现了cookie

- tcp 的规范 就是固定的组成结构
    - 请求行 响应行 
        主要的目的就是描述我要做什么事，服务端告诉客户端ok
    - 请求头 响应头
        描述我们的传输的数据内容，自定义我们的header(http中自己的规范)
    - 请求体 响应体
        两者的数据


#### 概念补充：
1. 单工数据传输
只支持数据在一个方向上传输。在同一时间只有一方能接受或发送信息，不能实现双向通信，ex：电视，广播。

2. 半双工数据传输
允许数据在两个方向上传输,但是,在某一时刻,只允许数据在一个方向上传输,它实际上是一种切换方向的单工通信；在同一时间只可以有一方接受或发送信息，可以实现双向通信。ex：对讲机。

3. 全双工数据通信允许数据同时在两个方向上传输,因此,全双工通信是两个单工通信方式的结合,它要求发送设备和接收设备都有独立的接收和发送能力；在同一时间可以同时接受和发送信息，实现双向通信，ex：电话通信。

##### HTTP 协议格式

基于[ABNF语法](https://www.ietf.org/rfc/rfc5234.txt)定义的HTTP消息格式
>巴科斯范式的英文缩写为 BNF，它是以美国人巴科斯 (Backus) 和丹麦人诺尔 (Naur) 的名字命名的一种形式化的语法表示方法，用来
描述语法的一种形式体系，是一种典型的元语言。又称巴科斯 - 诺尔形式 (Backus-Naur form)。它不仅能严格地表示语法规则，而
且所描述的语法是与上下文无关的。它具有语法简单，表示明确，便于语法分析和编译的特点。

ABNF(扩充巴克斯-淖尔范式)操作符

* 空白字符： 用来分隔定义中的各个元素
    * method SP request-target SP HTTP-version CRLF

* 选择/: 表示多个规则都是可供选择的规则
    * start-line = request-line / status-line

* 值范围 %c##-##:
    * OCTAL = "0"/"1"/"2"/"3"/"4"/"5"/"6"/"7" 与 OCTAL = %x30-37 等价

* 序列组合(): 将规则组合起来，视为单个元素
* 不定量重复m*n:
    * *元素表示零个或更多元素： *(header-field CRLF)
    * 1* 元素表示一个或更多元素， 2*4表示两个至四个元素

* 可选序列[]:
    * [ Message-body ]



##### HTTP 协议解决了什么问题？

> Web's major goal was to be a shared information space through which **people and machines** could communicate. —— Tim Berners Lee

解决WWW信息交互必须面对的需求：
* 低门槛
* 可扩展性：巨大的用户群体，超长的寿命
* 分布式系统下的Hypermedia:大粒度数据的网络传输
* Internet规模
    * 无法控制的scalability(可伸缩性)
        * 不可预测的负载、非法格式的数据、恶意消息
        * 客户端不能保持所有服务器信息，服务器不能保持多个请求间的状态信息
    * 独立的组件部署：新老组件并存
向前兼容：自1993年起HTTP0.9\1.0 (1996)已经被广泛使用



##### 评估Web架构的7大关键属性

**七大关键属性**

1. 性能 Performance：影响高可用的关键因素。
    * 网络性能 Network Performance
        * Throughput 吞吐量： 小于带宽 bandwidth
        * Overhead 开销： 首次开销，每次开销（keep-alive tcp 握手、sockets 等）

    * 用户感知到的性能 User-perceived Performance
        * Latency 延迟： 发起请求到接受到响应的时间
        * Completion 完成时间： 完成一个应用动作所花费的时间

    * 网络效率 Network Efficiency
        * 重用缓存、减少交互次数(图片合成、雪碧图)、数据传输距离更近(建立CDN)、COD(按需代码)

2. 可伸缩性 Scalability：支持部署可以互相交互的大量组件。
3. 简单性 Simplicity：易理解、易实现、易验证。
4. 可见性 Visiable：对两个组件间的交互进行监视或者仲裁的能力。如缓存、分层设计等。
5. 可移植性 Portability：在不同的环境下运行的能力。
6. 可靠性 Reliability：出现部分故障时，对整体影响的程度。
7. 可修改性 Modifiability：对系统作出修改的难易程度，由可进化性、可定制性、可扩展性、可配置性、可重用性构成。
    * 可进化性 Evolvability: 一个组件独立上级而不影响其他组件
    * 可扩展性 Extensibility: 想系统添加功能，而不会影响到系统的其他部分
    * 可定制性 Customizability: 临时性、定制型地更改某一要素来提供服务，不对常规客户产生影响
    * 可配置性 Configurability:应用部署后可通过修改配置提供新的功能
    * 可重用性 Resusabilit:组件可以不做修改在其他应用中使用 


##### 从五种架构风格推导出HTTP的REST架构


2021/3/5 08 | 从五种架构风格推导出HTTP的REST架构
https://time.geekbang.org/course/detail/100026801-93593 1/1
1. 数据流风格 Data-flow Styles
优点：简单性、可进化性、可扩展性、可配置性、可重用性
2. 复制风格 Replication Styles
优点：用户可察觉的性能、可伸缩性，网络效率、可靠性也可以提到提升
3. 分层风格 Hierarchical Styles
优点：简单性、可进化性、可伸缩性
4. 移动代码风格 Mobile Code Styles
优点：可移植性、可扩展性、网络效率
5. 点对点风格 Peer-to-Peer Styles
优点：可进化性、可重用性、可扩展性、可配置性



##### HTTP 的请求行

request-line = method SP request-target Sp HTTP-version CRLF 

常用四种格式
**origin-form:**
* = absolute-pash[ "?" query]
* 向origin server（实际产生相应内容的服务器） 发起请求，path为空时必须传递/

**absolute-form:**
* 仅用于向正向代理proxy 发起请求时，详见正向代理与隧道

**authority-form:**
* 仅用与CONNECT方法，例如CONNECT www.example.com:80 HTTP/1.1

**asterisk-form:**
*仅用于OPTIONS方法


##### 常见方法

* GET: 主要的获取信息方法，大量的性能优化都针对该方法，幂等方法
* HEAD: 类似GET方法，但服务器不发生BODY,用以花去HEAD元数据，幂等方法
* POST：常用于提交HTML FORM表单、新增资源等
* PUT：更新资源，待条件时是幂等方法
* DELETE: 删除资源，幂等方法
* CONNECT: 建立tunnel隧道
* OPTIONS: 显示服务器对访问资源支持的方法，幂等方法（主要用于跨域访问监测）
* TRACE: 回显服务器收到的请求，用于定位问题。有安全风险（2007年时 nginx0.5.17对此方法不再支持）


##### 插播一条面试题：GET 和 POST 有什么区别？

GET没有POST安全、GET请求时URL的长度是有限制的、GET没有body而POST有body等等。这些都是针对浏览器中的要求， 在使用HTTP作为接口进行传输时，就没有这么多条条框框了，此时GET和POST只是HTTP协议中的两种请求方式，而HTTP协议是基于TCP/IP的应用层协议， 无论GET还是POST，用的都是同一个传输层协议，所以在传输上没有区别。

##### 我们前面说，无论是GET请求还是POST请求，其本质都是不安全的，为什么这样说呢？

如果仅仅从 `GET` 请求的参数在地址栏是可见的，POST是不可见的，那就太肤浅了。 由于HTTP自己本身是一个明文协议，每个HTTP请求和返回的数据在网络上都是明文传播，无论是`url`、`header`还是`body`。 只要在网络节点捉包，就能获取完整的数据报文，要防止泄密的唯一手段就是使用`HTTPS`（用`SSL/TLS`协议协商出的密钥加密明文`HTTP`数据）。

##### 为什么在浏览器中GET请求方式的url长度有限制呢？

因为浏览器要对 `url` 进行解析，而解析的时候就要分配内存。对于一个字节流的解析，必须分配 `buffer` 来保存所有要存储的数据。而 `url` 这种东西必须当作一个整体看待，无法一块一块处理，于是就处理一个请求时必须分配一整块足够大的内存。如果 `url` 太长，而并发又很高，就容易挤爆服务器的内存。

##### POST是发送两个请求吗？ 上面提到POST请求可以被分为“请求头”和“请求体”两个部分，那这两部分是一起发送出去呢？还是先发“请求头”，再发“请求体”呢？

在 `HTTP` 协议中并没有明确说明 `POST` 会产生两个数据包。之所以会发两个数据包，则是出于以下考虑：如果服务器先收到“请求头”，则会对其进行校验，如果校验通过，则回复客户端“100 - Continue”，客户端再把”请求体“发给服务器。如果请求被拒了，服务器就回复个400之类的错误，这个交互就终止了。这样做的优点是可以避免浪费带宽传输请求体，但是代价就是会多一次`Round Trip`。如果刚好请求体的数据也不多，那么一次性全部发给服务器可能反而更好。所以说，这和POST完全没有关系，只是基于两端的一种优化手段罢了。

##### POST 和 PUT 请求有什么区别？

在 HTTP 中，POST 和 PUT 请求虽然都可以用于向服务器发送数据，但在使用场景、语义和行为方面有一些不同。

###### *POST 请求*:

1. POST 请求通常用于向服务器发送数据，创建新的子资源或触发一些服务器端的操作。
2. POST 请求的 URL 地址一般对应于一个集合或资源的父级路径。
3. POST 请求可以多次向同一 URL 发送数据，创建多个新的子资源，每次都会得到不同的结果。
    .e.g: 发送 POST /articles 请求可以创建一篇新文章，而 POST /users 可以创建一个新用户。

###### *PUT 请求*:

1. PUT 请求一般用于更新或取代指定资源的内容，要求客户端提供完整的新资源表示。
2. PUT 请求的 URL 地址通常指向一个具体的资源。
3. PUT 请求对同一 URL 多次发送数据，每次发送的内容应该是相同的，因为其主要目的是完整替换资源内容。`
.e.g: 发送 PUT /articles/1 请求可以更新 ID 为 1 的文章的内容，而 PUT /users/123 可以更新 ID 为 123 的用户信息。

总结：POST 和 PUT 请求的主要区别在于它们的语义和行为。POST 一般用于创建新资源或触发服务器端操作，而 PUT 一般用于更新或取代现有资源的内容。

##### 是否和幂等有关？我指的是，POST 是有副作用的函数，而 PUT 是纯函数？

这是一个非常有意思的比喻。在一定程度上可以把 POST 和 PUT 请求与函数式编程中的有副作用函数和纯函数相比较。
在函数式编程中，一个有副作用的函数（函数内部状态发生变化）会导致函数外部状态或数据发生变化。类比到 HTTP 请求中，POST 请求通常会改变服务器端的状态，比如创建新资源、提交数据等。因此，将 POST 请求比作有副作用函数是合理的。
纯函数的特点是不修改外部状态，且对同样的输入始终返回相同的输出。这与 PUT 请求的语义是一致的。PUT 请求用于完整替换资源内容，通常只影响单个资源，因此比较像一个纯函数。
然而，这个比喻并不是绝对准确的，因为 HTTP 请求涉及到客户端和服务器端之间的交互，而函数式编程则侧重于程序中函数的纯函数和有副作用函数的区分。HTTP 请求的目的是交换数据，通常会改变系统的状态，因此这种比喻仅从某种程度上进行了类比。


用于文档管理的WEBDAV方法（RFC2518)

* PROPFIND: 从Web资源中检索以XML格式存储的属性。它也被重载，以允许一个检索远程系统的整合结构（也叫目录层次结构）
* PROPPATCH: 在单个原子性活动中更改和删除资源的多个属性
* MKCOL：创建集合或者目录
* COPY: 将资源从一个URI复制到另一个URI
* MOVE: 将资源从一个URI移动到另一个UIR
* LOCK: 锁定一个资源。WebDAV 支持共享锁和互斥锁
* UNLOCK：接触资源的锁定


##### 请求头和响应头

- 核心在于内容协商
- http 实现长连接、会默认在请求的时候增加 connection:keep-alive, connection:close 复用 tcp 通道传递数据
（必须在一次请求应答之后才能复用） ...这也就是http1.1 中的队头阻塞
- 多个请求要发送怎么办？

###### 管线化（Pipelining）方式传递数据

- chrome 针对每个域名分配6 个 tcp 通道 (域名分片，但是域名不宜过多，会导致dns解析大量域名) 问题在于虽然请求是并发的，但是管道内的应答依旧是顺序的（管道的特点是先发送的先回来）出现管道响应阻塞。



HTTP管线化是将多个HTTP要求（request）整批提交的技术，而在传送过程中不需先等待服务端的回应。管线化机制须通过永久连接（persistent connection）完成，仅HTTP/1.1支持此技术（HTTP/1.0不支持），并且只有GET和HEAD要求可以进行管线化，而POST则有所限制。此外，初次创建连接时也不应启动管线机制，因为对方（服务器）不一定支持HTTP/1.1版本的协议。

浏览器将HTTP要求大批提交可大幅缩短页面的加载时间，特别是在传输延迟（lag/latency）较高的情况下（如卫星连接）。此技术之关键在于多个HTTP的要求消息可以同时塞入一个TCP分组中，所以只提交一个分组即可同时发出多个要求，借此可减少网络上多余的分组并降低线路负载。

###### 使用 cookie 识别用户身份

在客户端增加cookie字段，服务端set-cookie 每次请求的时候会自动携带 cookie (cookie不要过大)

#### [缓存](./http缓存.md)
