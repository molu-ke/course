(function (root) {
    // 默认配置项
    var baseOptions = {
        // expectHTML: true,
        // modules: modules$1,
        // directives: directives$1,
        // isPreTag: isPreTag,
        isUnaryTag: isUnaryTag,
        // mustUseProp: mustUseProp,
        canBeLeftOpenTag: canBeLeftOpenTag,
        // isReservedTag: isReservedTag,
        // getTagNamespace: getTagNamespace,
        // staticKeys: genStaticKeys(modules$1)
    };

    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    function isTextTag(el) {
        return el.tag === 'script' || el.tag === 'style'
    }
    var decoder;
    var he = {
        decode: function decode(html) {
            decoder = decoder || document.createElement('div');
            decoder.innerHTML = html;
            return decoder.textContent
        }
    };
    function cached(fn) {
        var cache = Object.create(null);
        return (function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str))
        })
    }
    var decodeHTMLCached = cached(he.decode);

    // 渲染函数
    function createFunction(code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({ err: err, code: code });
            return noop
        }
    }

    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to
    }

    function createCompileToFunctionFn(compile) {
        var cache = Object.create(null);
        return function compileToFunctions(template, options, vm) {
            options = extend({}, options);
            // 渲染函数用到
            {
                try {
                    new Function('return 1');
                } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                        warn$$1(
                            'It seems you are using the standalone build of Vue.js in an ' +
                            'environment with Content Security Policy that prohibits unsafe-eval. ' +
                            'The template compiler cannot work in this environment. Consider ' +
                            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                            'templates into render functions.'
                        );
                    }
                }
            }

            // check cache
            var key = options.delimiters
                ? String(options.delimiters) + template
                : template;
            if (cache[key]) { // 缓存对象中是否有这个模板字符串的字段
                return cache[key]
            }

            // 开始去编译  且编译结果(信息)给到compiled
            var compiled = compile(template, options);

            // check compilation errors/tips
            {
                if (compiled.errors && compiled.errors.length) {
                    warn$$1(
                        "Error compiling template:\n\n" + template + "\n\n" +
                        compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
                        vm
                    );
                }
                if (compiled.tips && compiled.tips.length) {
                    compiled.tips.forEach(function (msg) { return tip(msg, vm); });
                }
            }


            var res = {};
            var fnGenErrors = [];
            // 当前模板对应的渲染函数
            res.render = createFunction(compiled.render, fnGenErrors);
            // 当前模板静态结点函数
            res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
                return createFunction(code, fnGenErrors)
            });

            // 生成渲染函数的错误 
            {
                if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                    warn$$1(
                        "Failed to generate render function:\n\n" +
                        fnGenErrors.map(function (ref) {
                            var err = ref.err;
                            var code = ref.code;

                            return ((err.toString()) + " in\n\n" + code + "\n");
                        }).join('\n'),
                        vm
                    );
                }
            }


            return (cache[key] = res)

        }
    }

    function createCompilerCreator(baseCompile) {
        return function createCompiler(baseOptions) {
            function compile(template, options) { // 编译器的入口函数
                var finalOptions = Object.create(baseOptions);
                var errors = [];
                var tips = [];
                finalOptions.warn = function (msg, tip) { //  warn("xxxxxxx",true)  收集 错误  警告信息 
                    (tip ? tips : errors).push(msg);
                };

                if (options) {
                    // 动态的绑定
                    if (options.modules) {
                        finalOptions.modules =
                            (baseOptions.modules || []).concat(options.modules);
                    }
                    // 合并指令
                    if (options.directives) {
                        finalOptions.directives = extend(
                            Object.create(baseOptions.directives),
                            options.directives
                        );
                    }
                    // 合并+整合   extend
                    for (var key in options) {
                        if (key !== 'modules' && key !== 'directives') {
                            finalOptions[key] = options[key];
                        }
                    }
                }


                // ast  render  staticRenderFns
                var compiled = baseCompile(template, finalOptions); // 真正编译器入口
                {
                    // 通过抽象语法树来检查模板中是否存在错误表达式的
                    errors.push.apply(errors, detectErrors(compiled.ast));
                }
                compiled.errors = errors;
                compiled.tips = tips;
                return compiled
            }
            return {
                compile: compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }

    var createCompiler = createCompilerCreator(function baseCompile(
        template,
        options
    ) {
        var ast = parse(template.trim(), options); // 解析模析  产出AST对象（描述对象）
        console.log(ast)
        optimize(ast, options);  // 标注静态节点
        var code = generate(ast, options); // 产出渲染函数所需的字符串
        return {
            ast: ast, // 抽象语法
            render: code.render, // 渲染函数
            staticRenderFns: code.staticRenderFns // 静态渲染函数
        }
    });



    var ref$1 = createCompiler(baseOptions);
    var compileToFunctions = ref$1.compileToFunctions;

    // 解析模块  怎么去生成AST对象的
    var no = function () {
        return false
    }

    var isUnaryTag = makeMap(
        'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
        'link,meta,param,source,track,wbr'
    );

    // 非段落式内容
    var isNonPhrasingTag = makeMap(
        'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
        'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
        'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
        'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
        'title,tr,track'
    );

    var isBuiltInTag = makeMap('slot,component', true);

    var canBeLeftOpenTag = makeMap(
        'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
    );

    function genStaticKeys$1 (keys) {
        return makeMap(
          'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
          (keys ? ',' + keys : '')
        )
      }

    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase
            ? function (val) { return map[val.toLowerCase()]; }
            : function (val) { return map[val]; }
    }

    var isPlainTextElement = makeMap('script,style,textarea', true);

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配标签的属性
    var ncname = '[a-zA-Z_][\\w\\-\\.]*'; // 识别合法的xml标签
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // 通过字符串来拼接正则模式让代码更具有复用性
    var startTagOpen = new RegExp(("^<" + qnameCapture)); // 匹配开始标签 <div></div>的话会匹配到 <div
    var startTagClose = /^\s*(\/?)>/; // 检测标签是否为单标签 。 例如：<img / > 此处需结合源码上下文分析
    var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>")); // 匹配结束标签
    var doctype = /^<!DOCTYPE [^>]+>/i; // 匹配<!DOCTYPE> 声明标签
    var comment = /^<!--/; // 匹配注释
    var conditionalComment = /^<!\[/; // 匹配条件注释

    function makeAttrsMap(attrs) {
        var map = {};
        for (var i = 0, l = attrs.length; i < l; i++) {
            if (
                "development" !== 'production' &&
                map[attrs[i].name] && !isIE && !isEdge
            ) {
                warn$2('duplicate attribute: ' + attrs[i].name);
            }
            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }


    function createASTElement(tag, attrs, parent) {
        return {
            type: 1,
            tag: tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs), // id=app ==>  {id:'app'}
            parent: parent,
            children: []
        }
    }

    var delimiters;

    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; // {{   }}
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

    // 用户自定义了纯文本插入符  [ '${' , '}' ] ==>    [ '\$\{' , '\}' ]
    var buildRegex = cached(function (delimiters) {
        var open = delimiters[0].replace(regexEscapeRE, '\\$&');
        var close = delimiters[1].replace(regexEscapeRE, '\\$&');
        return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
    });

    function parseText(text, delimiters) {
        // 动态值的捕获
        var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
        if (!tagRE.test(text)) {
            return
        }

        var tokens = [];
        var rawTokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var match, index, tokenValue;

        // 因存在索引下标，所以不会进入死循环
        while ((match = tagRE.exec(text))) {
            //   console.log('文本',text,'索引下标',tagRE.lastIndex,'匹配的值',match,lastIndex)

            index = match.index;
            // push text token  当文本是：this is code {{message}}时，index会大于lastIndex
            if (index > lastIndex) {
                // 把双花括号的前面静态文本截取出来
                rawTokens.push(tokenValue = text.slice(lastIndex, index))
                tokens.push(JSON.stringify(tokenValue));
            }
            //   tag token   处理双花括号中的过滤器 {{ | }}  先不说
            //   var exp = parseFilters(match[1].trim());
            var exp = match[1].trim();
            tokens.push(("_s(" + exp + ")"));
            rawTokens.push({
                '@binding': exp
            })

            lastIndex = index + match[0].length; // 13 + {{message}}.lenth
        }
        // 把双花括号的后面静态文本截取出来
        if (lastIndex < text.length) {
            rawTokens.push(tokenValue = text.slice(lastIndex))
            tokens.push(JSON.stringify(tokenValue));
        }
        return {
            expression: tokens.join('+'),
            tokens: rawTokens
        }
    }



    function parse(template, options) {
        // 第一次  root,currentParent  = 根节点的描述对象   stack = [根节点的描述对象]
        var currentParent, root,
            stack = [],
            inPre = false,
            inVPre = false;
        var preserveWhitespace = options.preserveWhitespace !== false;
        delimiters = options.delimiters;
        parseHTML(template, {
            // 解析开始标签调用的钩子函数
            start: function (tag, attrs, unary) {

                var element = createASTElement(tag, attrs, currentParent);

                function checkRootConstraints(el) {
                    {
                        if (el.tag === 'slot' || el.tag === 'template') {
                            warnOnce(
                                "Cannot use <" + (el.tag) + "> as component root element because it may " +
                                'contain multiple nodes.'
                            );
                        }
                        if (el.attrsMap.hasOwnProperty('v-for')) {
                            warnOnce(
                                'Cannot use v-for on stateful component root element because ' +
                                'it renders multiple elements.'
                            );
                        }
                    }
                }

                // tree management  root 存储根节点的描述对象
                if (!root) {
                    root = element;
                    checkRootConstraints(root); // 检测根节点的规范性
                } else if (!stack.length) {
                    // allow root elements with v-if, v-else-if and v-else
                    if (root.if && (element.elseif || element.else)) {
                        checkRootConstraints(element);
                        addIfCondition(root, {
                            exp: element.elseif,
                            block: element
                        });
                    } else {
                        warnOnce(
                            "Component template should contain exactly one root element. " +
                            "If you are using v-if on multiple elements, " +
                            "use v-else-if to chain them instead."
                        );
                    }
                }

                if (currentParent && !element.forbidden) { //  !element.forbidden => true
                    if (element.elseif || element.else) {
                        processIfConditions(element, currentParent);
                    } else if (element.slotScope) { // scoped slot
                        currentParent.plain = false;
                        var name = element.slotTarget || '"default"'; (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                    } else {
                        currentParent.children.push(element); // 描述html字符串的子父级关系
                        element.parent = currentParent;
                    }
                }


                if (!unary) {
                    currentParent = element;
                    stack.push(element);
                } else {
                    // endPre(element);
                }
            },
            // 解析结束标签的钩子函数
            end: function () {
                //  删除尾随空格  <div>     </div>
                var element = stack[stack.length - 1];
                var lastNode = element.children[element.children.length - 1];
                if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
                    element.children.pop();
                }
                // 修正后续解析的开始标签的父标签描述对象引用
                stack.length -= 1;
                currentParent = stack[stack.length - 1];

            },
            // 解析文本调用的钩子函数
            chars: function (text) {
                if (!currentParent) {
                    {
                        if (text === template) {
                            warnOnce(
                                'Component template requires a root element, rather than just text.'
                            );
                        } else if ((text = text.trim())) {
                            warnOnce(
                                ("text \"" + text + "\" outside root element will be ignored.")
                            );
                        }
                    }
                    return
                }
                // IE textarea placeholder bug
                if (isIE &&
                    currentParent.tag === 'textarea' &&
                    currentParent.attrsMap.placeholder === text
                ) {
                    return
                }

                var children = currentParent.children;

                text = inPre || text.trim()
                    ? isTextTag(currentParent) ? text : decodeHTMLCached(text) // 解码的操作
                    // only preserve whitespace if its not right after a starting tag
                    : preserveWhitespace && children.length ? ' ' : '';

                // {{meaaste}}
                if (text) {
                    var res;
                    // 动态文本节点
                    if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
                        children.push({
                            type: 2,
                            expression: res.expression,
                            tokens: res.tokens,
                            text: text
                        });
                    }
                    // 静态文本节点
                    else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
                        children.push({
                            type: 3,
                            text: text
                        });
                    }
                }

            },
            // 解析注释的钩子函数
            comment: function () {
                currentParent.children.push({
                    type: 3,
                    text: text,
                    isComment: true
                });
            },
        })

        return root; // 跟节点的描述对象

    }

    function parseHTML(html, options) {
        var stack = []; // 检测一个非一元标签 是否缺少闭合标签
        var expectHTML = options.expectHTML; // 编译器内置配置   布尔值   false 
        var isUnaryTag$$1 = options.isUnaryTag || no; //  检测一个标签是否为一元标签
        var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no; // 编译器内置配置  检测一个标签是否是可以省略闭合标签的非一元标签
        var index = 0; // 解析html字符串时字符流读入的位置
        var last, lastTag; // last存储还未解析的html字符串   lastTag始终存储stack栈顶的元素
        while (html) {
            last = html;
            if (!lastTag || !isPlainTextElement(lastTag)) { // 第一次进入循环   根元素的开始标签
                var textEnd = html.indexOf('<');  // 1：等于0   2：小于0(-1)   3：大于0   
                if (textEnd === 0) {
                    // End tag:
                    var endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                        var curIndex = index; // 结束标签的字符起始位置
                        advance(endTagMatch[0].length);
                        parseEndTag(endTagMatch[1], curIndex, index); // 处理标签相关的异常情况
                        continue
                    }

                    // Start tag:
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        // 先不考虑  忽略 <pre>和<textare>标签的内容中第一个换行符
                        // if (shouldIgnoreFirstNewline(lastTag, html)) {
                        //     advance(1);
                        // }
                        continue
                    }
                }

                // {{ message }}</div>
                var text = (void 0), rest = (void 0), next = (void 0);
                if (textEnd >= 0) {
                    rest = html.slice(textEnd); // 剩余需要解析的文本 </div>  
                    // 不符合标签的格式规则  当rest不是标签、注释  为了解决 a < b 这种情况
                    while (
                        !endTag.test(rest) &&
                        !startTagOpen.test(rest) &&
                        !comment.test(rest) &&
                        !conditionalComment.test(rest)
                    ) {
                        next = rest.indexOf('<', 1);
                        if (next < 0) {
                            break
                        }
                        textEnd += next;
                        rest = html.slice(textEnd);
                    }
                    text = html.substring(0, textEnd); // {{message}}
                    advance(textEnd);
                }


                if (textEnd < 0) {
                    text = html;
                    html = '';
                }

                if (options.chars && text) {
                    options.chars(text);
                }
            }
        }


        function advance(n) {
            index += n;
            html = html.substring(n);
        }

        function parseStartTag() {
            var start = html.match(startTagOpen); // 匹配开始标签
            if (start) {
                var match = {
                    tagName: start[1],
                    attrs: [],
                    start: index // 解析开始标签的字符流起始位置
                };
                advance(start[0].length);
                var end, attr; // 属性   end 分析当前标签是否一元标签
                // startTagClose  去匹配开始标签的右尖括号  >  />
                // attribute
                while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    advance(attr[0].length);
                    match.attrs.push(attr);
                }
                if (end) {
                    match.unarySlash = end[1]; //   /> =>  /  一元标签   > => ''   非一元标签
                    advance(end[0].length);
                    match.end = index;
                    return match
                }
            }
        }

        // 辅助函数
        function handleStartTag(match) {
            var tagName = match.tagName;
            var unarySlash = match.unarySlash;
            if (expectHTML) {
                // <p><h1></h1></p>   ==>    <p></p><h2></h2><p></p>
                if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                    parseEndTag(lastTag);
                }
                // 当前正在解析的标签是一个可以省略结束标签的非一元标签，并且与上一次解析到的开始标签相同
                if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
                    parseEndTag(tagName);
                }
            }

            var unary = isUnaryTag$$1(tagName) || !!unarySlash;
            var l = match.attrs.length;
            var attrs = new Array(l);

            for (var i = 0; i < l; i++) {
                var args = match.attrs[i];
                var value = args[3] || args[4] || args[5] || '';
                attrs[i] = {
                    name: args[1],
                    value: value
                };
            }

            if (!unary) { // 非一元标签
                stack.push({
                    tag: tagName,
                    lowerCasedTag: tagName.toLowerCase(),
                    attrs: attrs
                });
                lastTag = tagName;
            }
            if (options.start) {
                options.start(tagName, attrs, unary, match.start, match.end);
            }
        }

        function parseEndTag(tagName, start, end) {
            var pos, lowerCasedTagName; //  pos判断 html 字符串是否缺少结束标签    lowerCasedTagName存储 tagName 的小写版 
            if (start == null) { start = index; }
            if (end == null) { end = index; }

            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase();
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            } else {
                pos = 0;
            }
            // 当pos >= 0 就代表结束标签能在stack中找到
            if (pos >= 0) {
                for (var i = stack.length - 1; i >= pos; i--) {
                    if ((i > pos || !tagName) && options.warn) {
                        options.warn(
                            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
                        );
                    }
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }
                // 更新 stack 栈以及 lastTag
                stack.length = pos;
                lastTag = pos && stack[pos - 1].tag;

                // 找不到就代表不存在 但要特殊处理br p
                // 因为</br> 和 </p> 标签浏览器可以将其正常解析为 <br> 以及<p></p>，Vue 的 parser 与浏览器的行为是一致的
            } else if (lowerCasedTagName === 'br') {
                if (options.start) {
                    options.start(tagName, [], true, start, end);
                }
            } else if (lowerCasedTagName === 'p') {
                if (options.start) {
                    options.start(tagName, [], false, start, end);
                }
                if (options.end) {
                    options.end(tagName, start, end);
                }
            }
            // 其他情况不处理  像 <div></h2></div>
        }
    }

    var isStaticKey;
    var isPlatformReservedTag;

    var genStaticKeysCached = cached(genStaticKeys$1);

    /*
     * 永远不需要变化的DOM就是静态的
     * 重新渲染时，作为常量，无需创建新节点
     */
    function optimize(root, options) {
        if (!root) { return }
        isStaticKey = genStaticKeysCached(options.staticKeys || '');
        // 检查给定的字符是否是保留的标签。
        isPlatformReservedTag = options.isReservedTag || no;
        //  标注静态节点
        markStatic$1(root);
        // 标注静态根节点
        markStaticRoots(root, false);
    }

    function markStatic$1 (node) {
        node.static = isStatic(node);
        if (node.type === 1) {
          // do not make component slot content static. this avoids
          // 1. components not able to mutate slot nodes
          // 2. static slot content fails for hot-reloading
          if (
            !isPlatformReservedTag(node.tag) &&
            node.tag !== 'slot' &&
            node.attrsMap['inline-template'] == null
          ) {
            return
          }
          for (var i = 0, l = node.children.length; i < l; i++) {
            var child = node.children[i];
            markStatic$1(child);
            if (!child.static) {
              node.static = false;
            }
          }
          if (node.ifConditions) {
            for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
              var block = node.ifConditions[i$1].block;
              markStatic$1(block);
              if (!block.static) {
                node.static = false;
              }
            }
          }
        }
      }

    function generate() {

    }


    function isStatic (node) {
        // 节点类型为表达式，标注为非静态；普通文本为静态
        if (node.type === 2) { // expression
          return false
        }
        if (node.type === 3) { // text
          return true
        }
        return !!(node.pre || (
          !node.hasBindings && // 无动态绑定
          !node.if && !node.for && // 没有 v-if 、 v-for、v-else
          !isBuiltInTag(node.tag) && // 不是内置的标签
          isPlatformReservedTag(node.tag) && // 是平台保留标签(html和svg标签)
          !isDirectChildOfTemplateFor(node) && // 不是 template 标签的直接子元素并且没有包含在 for 循环中
          Object.keys(node).every(isStaticKey) // 结点包含的属性只能有isStaticKey中指定的几个
        ))
      }
      
      function isDirectChildOfTemplateFor (node) {
        while (node.parent) {
          node = node.parent;
          if (node.tag !== 'template') {
            return false
          }
          if (node.for) {
            return true
          }
        }
        return false
      }


    root.compileToFunctions = compileToFunctions

})(this)