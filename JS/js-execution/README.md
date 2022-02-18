## 上下文对象、调用栈

### 初始化全局对象（`Global Object`）
`js`引擎 **在执行代码之前，会在堆内存中创建一个全局对象：`Global Object`。**
- 初始化的`GO`中包括`js`内置的对象，构造函数等，例：`Math、Array、Object、window、setTimeout`等
    - `GO`中的`window`指向自己，所以可以`window.window.window = window`
    
```text
// 用代码表示初始化GO
初始化的GO：
    Math、
    Array、
    Object、
    window、
    setTimeout
    ...
```
> 执行上下文栈（`Execution Context Stack`）: 用于执行 **代码的调用栈**。

#### | 全局执行上下文（`Global Execution Context`）
`js`在执行全局代码块那一刻之前，会创建全局执行上下文(`GEC`)，然后将`GEC`放入调用栈（`ECS`）中执行。
- 全局上下文包含两部分内容：
    1. `variable Object`-> **全局对象(`GO`)**：包含`js`预设的对象，以及开发者自定义的变量定义、函数的声明 **（只有声明部分，没有赋值部分）** ，变量的默认值为`undefined`，函数的默认值指向其堆内存中的地址（变量提升`Hosting`）。
    2. **可执行代码：**：代码中赋值等操作
```text
  GO：
    Math、
    Array、
    Object、
    window、
    setTimeout、
    
    name: undefined,
    foo: 001ax0
```
### 执行上下文栈/调用栈（`Execution Context Stack`）
当全局上下文准备好后，`js`引擎会将全局上下文压入调用栈中执行。

### 函数执行上下文（`Functional Execution Context`）
**只有函数执行时前的那一刻，才会创建函数上下文。**

当函数进入执行阶段时，原本不能被访问的变量对象被激活成一个活动对象，自此，我们可以访问到其中的各种属性。

- 函数执行上下文包含三部分：
    1. `variable Object`-> **活跃对象(`Activation Object`)**：包含`arguments`、变量定义、函数声明、形参
    2. **作用域链(`Scope chain`)`[[ scope ]]`**: 包含自身`VO`，与父级`VO`
    3. `this`：当函数被调用时，才会将调用者信息(`this`)存入当前执行上下文
    
```text
// 用代码来表示函数上下文层级
executionContext：{
    [variable object | activation object]：{
        arguments,
        variables: [...],
        functions: [...]
    },
    scope chain: variable object + all parents scopes
    thisValue: context object
}

```

### 新老ECMA规范于变量对象的描述对比
#### | 早期`ECMA`
> Every execution context has associated with it a variable object.
> Variables and functions declared in the source text are added as properties of the variable object.
> For function code, parameters are added as properties of the variable object.

- 每一个执行上下文都会被关联到一个变量对象。
- 源码中变量和函数的声明会被作为属性添加到变量对象中。
- 对于函数的参数，也会作为属性被添加到变量对象中。
#### | 最新`ECMA`
> Every execution context has an associated VariableEnvironment. 
> Variables and functions declared in ECMAScript code evaluated in an execution context are added as bindings in that VariableEnvironment's Environment Record. 
> For function code, parameters are also added as bindings to that Environment Record.
- 每一个执行上下文都会被关联到一个环境变量
- 在代码中变量和函数的声明都会被视为一条绑定到环境变量中的一条记录
- 对于函数代码，参数也会作为一条记录添加到环境对象中。

在新的`ECMA`规范中，将`Variable Object`称呼变为`Variable Environment `，更加严谨。


### 总结
- 什么是执行上下文？

