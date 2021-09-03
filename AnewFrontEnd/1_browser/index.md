## 浏览器总览

URL -> HTML -> DOM  -> DOM with CSS -> DOM with position -> Bitmap

url -> Bitmap 
 1. HTTP 获取 HTML
 2. parse HTML
 3. DOM css computing
 4. DOM whith css
 5. layout 把所有位置计算出来，得到css 最后生成的盒
 6. render ,通过操作系统和硬件驱动最后获得 Bitmap

浏览器的基础渲染流程


## 状态机

### 有限状态机处理字符串：

* 每一个状态都是一个机器
    * 在每一个机器里，我们可做计算、储存、输出...
    * 所有的这些机器接受的输入是一致的
    * 状态机的没一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）
* 每一个机器知道下一个状态
    * 每个机器都有确定的下一个状态（Moore)
    * 每个机器根据输入决定下一个状态（Mealy)

```js
// js 中的有限状态机 - Mealy

//函数参数就是输入
function state(input) {
    // 函数中可以自由编写代码，处理每个状态的逻辑
    return next; // 返回值作为下一个状态
}

// 以下是调用

while(input) {
    // 获取输入
    state = state(input); // 把状态机的返回值作为下一个状态
}
```

### 练习题：在一个字符串中，找到字符'a'

```js
function getStringIndex(string) {
  if (typeof string !== 'string') {
    throw Error('param must be string');
  }
  const index = string.indexOf('a');
  return  index > 0 `a 在 ${string} 的第 ${index}个位置` : `${string} 中找不到 a`
}

// 老师的代码
function match(string) {
    for(let c of string) {
        if( c == "a") {
            return true;
        }
    }
    return false;
}
match("I am groot");
```

### 练习题： 在字符串中找到'ab',要求不准用正则


```js
function match(string) {
  const YES = 'YES';
  const NO = 'NO';
  const tpl = 'ab';
  let status = NO;
  
  if (string.includes(tpl)) {
    status = YES;
  }
  
  return status;
}

//老师的代码

function match(string) {
    let foundA = false;
    for(let c of string) {
        if(c == 'a')
            foundA = true;
        else if(foundA && c == 'b')
            return true;
        else
            foundA = false;
    }
    return false;
}
```


### 练习题：在一个字符串中找到字符 abcdef


```js
const tpl = 'abcdef';
const input = 'xxxx'

class MatchString {
    constructor(option = {}) {
        this.tpl = option.tpl
        this.tplType = []
    }

    toMatch(params) { // O(n^2)
        const _tpl = this.tpl;
        const _tplType = this.tplType;
        let conti = true;
        for(let i of params) {
            for(let j = 0 ; j < _tpl.length ; j++) {
                if (i === _tpl[i]) {
                    // 匹配往表里推计数
                    _tplType.push(true)
                } else {
                    conti = false;
                }
                // 列表数等于模板长度，连续不中断，全匹配，返回true
                if(_tplType.length === _tpl.length && conti && _tplType.some( res => res)){
                    return true;
                }
            }

        }
    }
}

const matchString = new MatchString(tpl)
console.log(matchString.toMatch(input))

// 老师的代码(非状态机版本)
function match(string) {
    let foundA = false
    let foundB = false
    let foundC = false
    let foundD = false
    let foundE = false
    for( let c of string ) {
        if (c == "a") 
            foundA = true;
        else if(foundA && c == "b")
            foundB = true;
        else if(foundB && c == "c")
            foundC = true;
        else if(foundD && c == "d")
            foundD = true;
        else if(foundE && c == "e")
            foundE = true;
        else if(foundE && c == "f")
            return true;
        else {
            foundA = true
            foundB = true
            foundC = true
            foundD = true
            foundE = true
        }
    }
    return false
}
```