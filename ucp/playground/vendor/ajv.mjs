/*!
 * Bundled third-party libraries (MIT):
 *   ajv         - Copyright (c) 2015-2021 Evgeny Poberezkin - https://github.com/ajv-validator/ajv
 *   ajv-formats - Copyright (c) 2020 Evgeny Poberezkin - https://github.com/ajv-validator/ajv-formats
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
var $c = Object.create;
var Bs = Object.defineProperty;
var vc = Object.getOwnPropertyDescriptor;
var bc = Object.getOwnPropertyNames;
var wc = Object.getPrototypeOf,
  Ec = Object.prototype.hasOwnProperty;
var y = (t, e) => () => {
  try {
    return (e || t((e = { exports: {} }).exports, e), e.exports);
  } catch (r) {
    throw ((e = 0), r);
  }
};
var Pc = (t, e, r, n) => {
  if ((e && typeof e == 'object') || typeof e == 'function')
    for (let s of bc(e))
      !Ec.call(t, s) && s !== r && Bs(t, s, { get: () => e[s], enumerable: !(n = vc(e, s)) || n.enumerable });
  return t;
};
var Ws = (t, e, r) => (
  (r = t != null ? $c(wc(t)) : {}),
  Pc(e || !t || !t.__esModule ? Bs(r, 'default', { value: t, enumerable: !0 }) : r, t)
);
var dt = y(R => {
  'use strict';
  Object.defineProperty(R, '__esModule', { value: !0 });
  R.regexpCode =
    R.getEsmExportName =
    R.getProperty =
    R.safeStringify =
    R.stringify =
    R.strConcat =
    R.addCodeArg =
    R.str =
    R._ =
    R.nil =
    R._Code =
    R.Name =
    R.IDENTIFIER =
    R._CodeOrName =
      void 0;
  var ct = class {};
  R._CodeOrName = ct;
  R.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  var Oe = class extends ct {
    constructor(e) {
      if ((super(), !R.IDENTIFIER.test(e))) throw new Error('CodeGen: name must be a valid identifier');
      this.str = e;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  };
  R.Name = Oe;
  var Y = class extends ct {
    constructor(e) {
      (super(), (this._items = typeof e == 'string' ? [e] : e));
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1) return !1;
      let e = this._items[0];
      return e === '' || e === '""';
    }
    get str() {
      var e;
      return (e = this._str) !== null && e !== void 0 ? e : (this._str = this._items.reduce((r, n) => `${r}${n}`, ''));
    }
    get names() {
      var e;
      return (e = this._names) !== null && e !== void 0
        ? e
        : (this._names = this._items.reduce((r, n) => (n instanceof Oe && (r[n.str] = (r[n.str] || 0) + 1), r), {}));
    }
  };
  R._Code = Y;
  R.nil = new Y('');
  function Zs(t, ...e) {
    let r = [t[0]],
      n = 0;
    for (; n < e.length;) (jr(r, e[n]), r.push(t[++n]));
    return new Y(r);
  }
  R._ = Zs;
  var Sr = new Y('+');
  function Qs(t, ...e) {
    let r = [ut(t[0])],
      n = 0;
    for (; n < e.length;) (r.push(Sr), jr(r, e[n]), r.push(Sr, ut(t[++n])));
    return (Sc(r), new Y(r));
  }
  R.str = Qs;
  function jr(t, e) {
    e instanceof Y ? t.push(...e._items) : e instanceof Oe ? t.push(e) : t.push(qc(e));
  }
  R.addCodeArg = jr;
  function Sc(t) {
    let e = 1;
    for (; e < t.length - 1;) {
      if (t[e] === Sr) {
        let r = jc(t[e - 1], t[e + 1]);
        if (r !== void 0) {
          t.splice(e - 1, 3, r);
          continue;
        }
        t[e++] = '+';
      }
      e++;
    }
  }
  function jc(t, e) {
    if (e === '""') return t;
    if (t === '""') return e;
    if (typeof t == 'string')
      return e instanceof Oe || t[t.length - 1] !== '"'
        ? void 0
        : typeof e != 'string'
          ? `${t.slice(0, -1)}${e}"`
          : e[0] === '"'
            ? t.slice(0, -1) + e.slice(1)
            : void 0;
    if (typeof e == 'string' && e[0] === '"' && !(t instanceof Oe)) return `"${t}${e.slice(1)}`;
  }
  function Oc(t, e) {
    return e.emptyStr() ? t : t.emptyStr() ? e : Qs`${t}${e}`;
  }
  R.strConcat = Oc;
  function qc(t) {
    return typeof t == 'number' || typeof t == 'boolean' || t === null ? t : ut(Array.isArray(t) ? t.join(',') : t);
  }
  function Nc(t) {
    return new Y(ut(t));
  }
  R.stringify = Nc;
  function ut(t) {
    return JSON.stringify(t)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }
  R.safeStringify = ut;
  function kc(t) {
    return typeof t == 'string' && R.IDENTIFIER.test(t) ? new Y(`.${t}`) : Zs`[${t}]`;
  }
  R.getProperty = kc;
  function Rc(t) {
    if (typeof t == 'string' && R.IDENTIFIER.test(t)) return new Y(`${t}`);
    throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`);
  }
  R.getEsmExportName = Rc;
  function Ic(t) {
    return new Y(t.toString());
  }
  R.regexpCode = Ic;
});
var Nr = y(B => {
  'use strict';
  Object.defineProperty(B, '__esModule', { value: !0 });
  B.ValueScope = B.ValueScopeName = B.Scope = B.varKinds = B.UsedValueState = void 0;
  var J = dt(),
    Or = class extends Error {
      constructor(e) {
        (super(`CodeGen: "code" for ${e} not defined`), (this.value = e.value));
      }
    },
    Ft;
  (function (t) {
    ((t[(t.Started = 0)] = 'Started'), (t[(t.Completed = 1)] = 'Completed'));
  })(Ft || (B.UsedValueState = Ft = {}));
  B.varKinds = { const: new J.Name('const'), let: new J.Name('let'), var: new J.Name('var') };
  var Vt = class {
    constructor({ prefixes: e, parent: r } = {}) {
      ((this._names = {}), (this._prefixes = e), (this._parent = r));
    }
    toName(e) {
      return e instanceof J.Name ? e : this.name(e);
    }
    name(e) {
      return new J.Name(this._newName(e));
    }
    _newName(e) {
      let r = this._names[e] || this._nameGroup(e);
      return `${e}${r.index++}`;
    }
    _nameGroup(e) {
      var r, n;
      if (
        (!((n = (r = this._parent) === null || r === void 0 ? void 0 : r._prefixes) === null || n === void 0) &&
          n.has(e)) ||
        (this._prefixes && !this._prefixes.has(e))
      )
        throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);
      return (this._names[e] = { prefix: e, index: 0 });
    }
  };
  B.Scope = Vt;
  var Ut = class extends J.Name {
    constructor(e, r) {
      (super(r), (this.prefix = e));
    }
    setValue(e, { property: r, itemIndex: n }) {
      ((this.value = e), (this.scopePath = (0, J._)`.${new J.Name(r)}[${n}]`));
    }
  };
  B.ValueScopeName = Ut;
  var Tc = (0, J._)`\n`,
    qr = class extends Vt {
      constructor(e) {
        (super(e), (this._values = {}), (this._scope = e.scope), (this.opts = { ...e, _n: e.lines ? Tc : J.nil }));
      }
      get() {
        return this._scope;
      }
      name(e) {
        return new Ut(e, this._newName(e));
      }
      value(e, r) {
        var n;
        if (r.ref === void 0) throw new Error('CodeGen: ref must be passed in value');
        let s = this.toName(e),
          { prefix: a } = s,
          o = (n = r.key) !== null && n !== void 0 ? n : r.ref,
          i = this._values[a];
        if (i) {
          let d = i.get(o);
          if (d) return d;
        } else i = this._values[a] = new Map();
        i.set(o, s);
        let c = this._scope[a] || (this._scope[a] = []),
          u = c.length;
        return ((c[u] = r.ref), s.setValue(r, { property: a, itemIndex: u }), s);
      }
      getValue(e, r) {
        let n = this._values[e];
        if (n) return n.get(r);
      }
      scopeRefs(e, r = this._values) {
        return this._reduceValues(r, n => {
          if (n.scopePath === void 0) throw new Error(`CodeGen: name "${n}" has no value`);
          return (0, J._)`${e}${n.scopePath}`;
        });
      }
      scopeCode(e = this._values, r, n) {
        return this._reduceValues(
          e,
          s => {
            if (s.value === void 0) throw new Error(`CodeGen: name "${s}" has no value`);
            return s.value.code;
          },
          r,
          n
        );
      }
      _reduceValues(e, r, n = {}, s) {
        let a = J.nil;
        for (let o in e) {
          let i = e[o];
          if (!i) continue;
          let c = (n[o] = n[o] || new Map());
          i.forEach(u => {
            if (c.has(u)) return;
            c.set(u, Ft.Started);
            let d = r(u);
            if (d) {
              let l = this.opts.es5 ? B.varKinds.var : B.varKinds.const;
              a = (0, J._)`${a}${l} ${u} = ${d};${this.opts._n}`;
            } else if ((d = s?.(u))) a = (0, J._)`${a}${d}${this.opts._n}`;
            else throw new Or(u);
            c.set(u, Ft.Completed);
          });
        }
        return a;
      }
    };
  B.ValueScope = qr;
});
var w = y(S => {
  'use strict';
  Object.defineProperty(S, '__esModule', { value: !0 });
  S.or =
    S.and =
    S.not =
    S.CodeGen =
    S.operators =
    S.varKinds =
    S.ValueScopeName =
    S.ValueScope =
    S.Scope =
    S.Name =
    S.regexpCode =
    S.stringify =
    S.getProperty =
    S.nil =
    S.strConcat =
    S.str =
    S._ =
      void 0;
  var N = dt(),
    ne = Nr(),
    _e = dt();
  Object.defineProperty(S, '_', {
    enumerable: !0,
    get: function () {
      return _e._;
    },
  });
  Object.defineProperty(S, 'str', {
    enumerable: !0,
    get: function () {
      return _e.str;
    },
  });
  Object.defineProperty(S, 'strConcat', {
    enumerable: !0,
    get: function () {
      return _e.strConcat;
    },
  });
  Object.defineProperty(S, 'nil', {
    enumerable: !0,
    get: function () {
      return _e.nil;
    },
  });
  Object.defineProperty(S, 'getProperty', {
    enumerable: !0,
    get: function () {
      return _e.getProperty;
    },
  });
  Object.defineProperty(S, 'stringify', {
    enumerable: !0,
    get: function () {
      return _e.stringify;
    },
  });
  Object.defineProperty(S, 'regexpCode', {
    enumerable: !0,
    get: function () {
      return _e.regexpCode;
    },
  });
  Object.defineProperty(S, 'Name', {
    enumerable: !0,
    get: function () {
      return _e.Name;
    },
  });
  var Gt = Nr();
  Object.defineProperty(S, 'Scope', {
    enumerable: !0,
    get: function () {
      return Gt.Scope;
    },
  });
  Object.defineProperty(S, 'ValueScope', {
    enumerable: !0,
    get: function () {
      return Gt.ValueScope;
    },
  });
  Object.defineProperty(S, 'ValueScopeName', {
    enumerable: !0,
    get: function () {
      return Gt.ValueScopeName;
    },
  });
  Object.defineProperty(S, 'varKinds', {
    enumerable: !0,
    get: function () {
      return Gt.varKinds;
    },
  });
  S.operators = {
    GT: new N._Code('>'),
    GTE: new N._Code('>='),
    LT: new N._Code('<'),
    LTE: new N._Code('<='),
    EQ: new N._Code('==='),
    NEQ: new N._Code('!=='),
    NOT: new N._Code('!'),
    OR: new N._Code('||'),
    AND: new N._Code('&&'),
    ADD: new N._Code('+'),
  };
  var pe = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(e, r) {
        return this;
      }
    },
    kr = class extends pe {
      constructor(e, r, n) {
        (super(), (this.varKind = e), (this.name = r), (this.rhs = n));
      }
      render({ es5: e, _n: r }) {
        let n = e ? ne.varKinds.var : this.varKind,
          s = this.rhs === void 0 ? '' : ` = ${this.rhs}`;
        return `${n} ${this.name}${s};` + r;
      }
      optimizeNames(e, r) {
        if (e[this.name.str]) return (this.rhs && (this.rhs = Ve(this.rhs, e, r)), this);
      }
      get names() {
        return this.rhs instanceof N._CodeOrName ? this.rhs.names : {};
      }
    },
    Kt = class extends pe {
      constructor(e, r, n) {
        (super(), (this.lhs = e), (this.rhs = r), (this.sideEffects = n));
      }
      render({ _n: e }) {
        return `${this.lhs} = ${this.rhs};` + e;
      }
      optimizeNames(e, r) {
        if (!(this.lhs instanceof N.Name && !e[this.lhs.str] && !this.sideEffects))
          return ((this.rhs = Ve(this.rhs, e, r)), this);
      }
      get names() {
        let e = this.lhs instanceof N.Name ? {} : { ...this.lhs.names };
        return Ht(e, this.rhs);
      }
    },
    Rr = class extends Kt {
      constructor(e, r, n, s) {
        (super(e, n, s), (this.op = r));
      }
      render({ _n: e }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + e;
      }
    },
    Ir = class extends pe {
      constructor(e) {
        (super(), (this.label = e), (this.names = {}));
      }
      render({ _n: e }) {
        return `${this.label}:` + e;
      }
    },
    Tr = class extends pe {
      constructor(e) {
        (super(), (this.label = e), (this.names = {}));
      }
      render({ _n: e }) {
        return `break${this.label ? ` ${this.label}` : ''};` + e;
      }
    },
    Ar = class extends pe {
      constructor(e) {
        (super(), (this.error = e));
      }
      render({ _n: e }) {
        return `throw ${this.error};` + e;
      }
      get names() {
        return this.error.names;
      }
    },
    Mr = class extends pe {
      constructor(e) {
        (super(), (this.code = e));
      }
      render({ _n: e }) {
        return `${this.code};` + e;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(e, r) {
        return ((this.code = Ve(this.code, e, r)), this);
      }
      get names() {
        return this.code instanceof N._CodeOrName ? this.code.names : {};
      }
    },
    lt = class extends pe {
      constructor(e = []) {
        (super(), (this.nodes = e));
      }
      render(e) {
        return this.nodes.reduce((r, n) => r + n.render(e), '');
      }
      optimizeNodes() {
        let { nodes: e } = this,
          r = e.length;
        for (; r--;) {
          let n = e[r].optimizeNodes();
          Array.isArray(n) ? e.splice(r, 1, ...n) : n ? (e[r] = n) : e.splice(r, 1);
        }
        return e.length > 0 ? this : void 0;
      }
      optimizeNames(e, r) {
        let { nodes: n } = this,
          s = n.length;
        for (; s--;) {
          let a = n[s];
          a.optimizeNames(e, r) || (Ac(e, a.names), n.splice(s, 1));
        }
        return n.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((e, r) => ke(e, r.names), {});
      }
    },
    ye = class extends lt {
      render(e) {
        return '{' + e._n + super.render(e) + '}' + e._n;
      }
    },
    Cr = class extends lt {},
    Fe = class extends ye {};
  Fe.kind = 'else';
  var qe = class t extends ye {
    constructor(e, r) {
      (super(r), (this.condition = e));
    }
    render(e) {
      let r = `if(${this.condition})` + super.render(e);
      return (this.else && (r += 'else ' + this.else.render(e)), r);
    }
    optimizeNodes() {
      super.optimizeNodes();
      let e = this.condition;
      if (e === !0) return this.nodes;
      let r = this.else;
      if (r) {
        let n = r.optimizeNodes();
        r = this.else = Array.isArray(n) ? new Fe(n) : n;
      }
      if (r)
        return e === !1
          ? r instanceof t
            ? r
            : r.nodes
          : this.nodes.length
            ? this
            : new t(Ys(e), r instanceof t ? [r] : r.nodes);
      if (!(e === !1 || !this.nodes.length)) return this;
    }
    optimizeNames(e, r) {
      var n;
      if (
        ((this.else = (n = this.else) === null || n === void 0 ? void 0 : n.optimizeNames(e, r)),
        !!(super.optimizeNames(e, r) || this.else))
      )
        return ((this.condition = Ve(this.condition, e, r)), this);
    }
    get names() {
      let e = super.names;
      return (Ht(e, this.condition), this.else && ke(e, this.else.names), e);
    }
  };
  qe.kind = 'if';
  var Ne = class extends ye {};
  Ne.kind = 'for';
  var Dr = class extends Ne {
      constructor(e) {
        (super(), (this.iteration = e));
      }
      render(e) {
        return `for(${this.iteration})` + super.render(e);
      }
      optimizeNames(e, r) {
        if (super.optimizeNames(e, r)) return ((this.iteration = Ve(this.iteration, e, r)), this);
      }
      get names() {
        return ke(super.names, this.iteration.names);
      }
    },
    xr = class extends Ne {
      constructor(e, r, n, s) {
        (super(), (this.varKind = e), (this.name = r), (this.from = n), (this.to = s));
      }
      render(e) {
        let r = e.es5 ? ne.varKinds.var : this.varKind,
          { name: n, from: s, to: a } = this;
        return `for(${r} ${n}=${s}; ${n}<${a}; ${n}++)` + super.render(e);
      }
      get names() {
        let e = Ht(super.names, this.from);
        return Ht(e, this.to);
      }
    },
    Lt = class extends Ne {
      constructor(e, r, n, s) {
        (super(), (this.loop = e), (this.varKind = r), (this.name = n), (this.iterable = s));
      }
      render(e) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(e);
      }
      optimizeNames(e, r) {
        if (super.optimizeNames(e, r)) return ((this.iterable = Ve(this.iterable, e, r)), this);
      }
      get names() {
        return ke(super.names, this.iterable.names);
      }
    },
    ft = class extends ye {
      constructor(e, r, n) {
        (super(), (this.name = e), (this.args = r), (this.async = n));
      }
      render(e) {
        return `${this.async ? 'async ' : ''}function ${this.name}(${this.args})` + super.render(e);
      }
    };
  ft.kind = 'func';
  var mt = class extends lt {
    render(e) {
      return 'return ' + super.render(e);
    }
  };
  mt.kind = 'return';
  var zr = class extends ye {
      render(e) {
        let r = 'try' + super.render(e);
        return (this.catch && (r += this.catch.render(e)), this.finally && (r += this.finally.render(e)), r);
      }
      optimizeNodes() {
        var e, r;
        return (
          super.optimizeNodes(),
          (e = this.catch) === null || e === void 0 || e.optimizeNodes(),
          (r = this.finally) === null || r === void 0 || r.optimizeNodes(),
          this
        );
      }
      optimizeNames(e, r) {
        var n, s;
        return (
          super.optimizeNames(e, r),
          (n = this.catch) === null || n === void 0 || n.optimizeNames(e, r),
          (s = this.finally) === null || s === void 0 || s.optimizeNames(e, r),
          this
        );
      }
      get names() {
        let e = super.names;
        return (this.catch && ke(e, this.catch.names), this.finally && ke(e, this.finally.names), e);
      }
    },
    ht = class extends ye {
      constructor(e) {
        (super(), (this.error = e));
      }
      render(e) {
        return `catch(${this.error})` + super.render(e);
      }
    };
  ht.kind = 'catch';
  var pt = class extends ye {
    render(e) {
      return 'finally' + super.render(e);
    }
  };
  pt.kind = 'finally';
  var Fr = class {
    constructor(e, r = {}) {
      ((this._values = {}),
        (this._blockStarts = []),
        (this._constants = {}),
        (this.opts = {
          ...r,
          _n: r.lines
            ? `
`
            : '',
        }),
        (this._extScope = e),
        (this._scope = new ne.Scope({ parent: e })),
        (this._nodes = [new Cr()]));
    }
    toString() {
      return this._root.render(this.opts);
    }
    name(e) {
      return this._scope.name(e);
    }
    scopeName(e) {
      return this._extScope.name(e);
    }
    scopeValue(e, r) {
      let n = this._extScope.value(e, r);
      return ((this._values[n.prefix] || (this._values[n.prefix] = new Set())).add(n), n);
    }
    getScopeValue(e, r) {
      return this._extScope.getValue(e, r);
    }
    scopeRefs(e) {
      return this._extScope.scopeRefs(e, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(e, r, n, s) {
      let a = this._scope.toName(r);
      return (n !== void 0 && s && (this._constants[a.str] = n), this._leafNode(new kr(e, a, n)), a);
    }
    const(e, r, n) {
      return this._def(ne.varKinds.const, e, r, n);
    }
    let(e, r, n) {
      return this._def(ne.varKinds.let, e, r, n);
    }
    var(e, r, n) {
      return this._def(ne.varKinds.var, e, r, n);
    }
    assign(e, r, n) {
      return this._leafNode(new Kt(e, r, n));
    }
    add(e, r) {
      return this._leafNode(new Rr(e, S.operators.ADD, r));
    }
    code(e) {
      return (typeof e == 'function' ? e() : e !== N.nil && this._leafNode(new Mr(e)), this);
    }
    object(...e) {
      let r = ['{'];
      for (let [n, s] of e)
        (r.length > 1 && r.push(','), r.push(n), (n !== s || this.opts.es5) && (r.push(':'), (0, N.addCodeArg)(r, s)));
      return (r.push('}'), new N._Code(r));
    }
    if(e, r, n) {
      if ((this._blockNode(new qe(e)), r && n)) this.code(r).else().code(n).endIf();
      else if (r) this.code(r).endIf();
      else if (n) throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    elseIf(e) {
      return this._elseNode(new qe(e));
    }
    else() {
      return this._elseNode(new Fe());
    }
    endIf() {
      return this._endBlockNode(qe, Fe);
    }
    _for(e, r) {
      return (this._blockNode(e), r && this.code(r).endFor(), this);
    }
    for(e, r) {
      return this._for(new Dr(e), r);
    }
    forRange(e, r, n, s, a = this.opts.es5 ? ne.varKinds.var : ne.varKinds.let) {
      let o = this._scope.toName(e);
      return this._for(new xr(a, o, r, n), () => s(o));
    }
    forOf(e, r, n, s = ne.varKinds.const) {
      let a = this._scope.toName(e);
      if (this.opts.es5) {
        let o = r instanceof N.Name ? r : this.var('_arr', r);
        return this.forRange('_i', 0, (0, N._)`${o}.length`, i => {
          (this.var(a, (0, N._)`${o}[${i}]`), n(a));
        });
      }
      return this._for(new Lt('of', s, a, r), () => n(a));
    }
    forIn(e, r, n, s = this.opts.es5 ? ne.varKinds.var : ne.varKinds.const) {
      if (this.opts.ownProperties) return this.forOf(e, (0, N._)`Object.keys(${r})`, n);
      let a = this._scope.toName(e);
      return this._for(new Lt('in', s, a, r), () => n(a));
    }
    endFor() {
      return this._endBlockNode(Ne);
    }
    label(e) {
      return this._leafNode(new Ir(e));
    }
    break(e) {
      return this._leafNode(new Tr(e));
    }
    return(e) {
      let r = new mt();
      if ((this._blockNode(r), this.code(e), r.nodes.length !== 1))
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(mt);
    }
    try(e, r, n) {
      if (!r && !n) throw new Error('CodeGen: "try" without "catch" and "finally"');
      let s = new zr();
      if ((this._blockNode(s), this.code(e), r)) {
        let a = this.name('e');
        ((this._currNode = s.catch = new ht(a)), r(a));
      }
      return (n && ((this._currNode = s.finally = new pt()), this.code(n)), this._endBlockNode(ht, pt));
    }
    throw(e) {
      return this._leafNode(new Ar(e));
    }
    block(e, r) {
      return (this._blockStarts.push(this._nodes.length), e && this.code(e).endBlock(r), this);
    }
    endBlock(e) {
      let r = this._blockStarts.pop();
      if (r === void 0) throw new Error('CodeGen: not in self-balancing block');
      let n = this._nodes.length - r;
      if (n < 0 || (e !== void 0 && n !== e)) throw new Error(`CodeGen: wrong number of nodes: ${n} vs ${e} expected`);
      return ((this._nodes.length = r), this);
    }
    func(e, r = N.nil, n, s) {
      return (this._blockNode(new ft(e, r, n)), s && this.code(s).endFunc(), this);
    }
    endFunc() {
      return this._endBlockNode(ft);
    }
    optimize(e = 1) {
      for (; e-- > 0;) (this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants));
    }
    _leafNode(e) {
      return (this._currNode.nodes.push(e), this);
    }
    _blockNode(e) {
      (this._currNode.nodes.push(e), this._nodes.push(e));
    }
    _endBlockNode(e, r) {
      let n = this._currNode;
      if (n instanceof e || (r && n instanceof r)) return (this._nodes.pop(), this);
      throw new Error(`CodeGen: not in block "${r ? `${e.kind}/${r.kind}` : e.kind}"`);
    }
    _elseNode(e) {
      let r = this._currNode;
      if (!(r instanceof qe)) throw new Error('CodeGen: "else" without "if"');
      return ((this._currNode = r.else = e), this);
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      let e = this._nodes;
      return e[e.length - 1];
    }
    set _currNode(e) {
      let r = this._nodes;
      r[r.length - 1] = e;
    }
  };
  S.CodeGen = Fr;
  function ke(t, e) {
    for (let r in e) t[r] = (t[r] || 0) + (e[r] || 0);
    return t;
  }
  function Ht(t, e) {
    return e instanceof N._CodeOrName ? ke(t, e.names) : t;
  }
  function Ve(t, e, r) {
    if (t instanceof N.Name) return n(t);
    if (!s(t)) return t;
    return new N._Code(
      t._items.reduce(
        (a, o) => (o instanceof N.Name && (o = n(o)), o instanceof N._Code ? a.push(...o._items) : a.push(o), a),
        []
      )
    );
    function n(a) {
      let o = r[a.str];
      return o === void 0 || e[a.str] !== 1 ? a : (delete e[a.str], o);
    }
    function s(a) {
      return a instanceof N._Code && a._items.some(o => o instanceof N.Name && e[o.str] === 1 && r[o.str] !== void 0);
    }
  }
  function Ac(t, e) {
    for (let r in e) t[r] = (t[r] || 0) - (e[r] || 0);
  }
  function Ys(t) {
    return typeof t == 'boolean' || typeof t == 'number' || t === null ? !t : (0, N._)`!${Vr(t)}`;
  }
  S.not = Ys;
  var Mc = Xs(S.operators.AND);
  function Cc(...t) {
    return t.reduce(Mc);
  }
  S.and = Cc;
  var Dc = Xs(S.operators.OR);
  function xc(...t) {
    return t.reduce(Dc);
  }
  S.or = xc;
  function Xs(t) {
    return (e, r) => (e === N.nil ? r : r === N.nil ? e : (0, N._)`${Vr(e)} ${t} ${Vr(r)}`);
  }
  function Vr(t) {
    return t instanceof N.Name ? t : (0, N._)`(${t})`;
  }
});
var q = y(O => {
  'use strict';
  Object.defineProperty(O, '__esModule', { value: !0 });
  O.checkStrictMode =
    O.getErrorPath =
    O.Type =
    O.useFunc =
    O.setEvaluated =
    O.evaluatedPropsToName =
    O.mergeEvaluated =
    O.eachItem =
    O.unescapeJsonPointer =
    O.escapeJsonPointer =
    O.escapeFragment =
    O.unescapeFragment =
    O.schemaRefOrVal =
    O.schemaHasRulesButRef =
    O.schemaHasRules =
    O.checkUnknownRules =
    O.alwaysValidSchema =
    O.toHash =
      void 0;
  var A = w(),
    zc = dt();
  function Fc(t) {
    let e = {};
    for (let r of t) e[r] = !0;
    return e;
  }
  O.toHash = Fc;
  function Vc(t, e) {
    return typeof e == 'boolean' ? e : Object.keys(e).length === 0 ? !0 : (ra(t, e), !na(e, t.self.RULES.all));
  }
  O.alwaysValidSchema = Vc;
  function ra(t, e = t.schema) {
    let { opts: r, self: n } = t;
    if (!r.strictSchema || typeof e == 'boolean') return;
    let s = n.RULES.keywords;
    for (let a in e) s[a] || oa(t, `unknown keyword: "${a}"`);
  }
  O.checkUnknownRules = ra;
  function na(t, e) {
    if (typeof t == 'boolean') return !t;
    for (let r in t) if (e[r]) return !0;
    return !1;
  }
  O.schemaHasRules = na;
  function Uc(t, e) {
    if (typeof t == 'boolean') return !t;
    for (let r in t) if (r !== '$ref' && e.all[r]) return !0;
    return !1;
  }
  O.schemaHasRulesButRef = Uc;
  function Kc({ topSchemaRef: t, schemaPath: e }, r, n, s) {
    if (!s) {
      if (typeof r == 'number' || typeof r == 'boolean') return r;
      if (typeof r == 'string') return (0, A._)`${r}`;
    }
    return (0, A._)`${t}${e}${(0, A.getProperty)(n)}`;
  }
  O.schemaRefOrVal = Kc;
  function Lc(t) {
    return sa(decodeURIComponent(t));
  }
  O.unescapeFragment = Lc;
  function Hc(t) {
    return encodeURIComponent(Kr(t));
  }
  O.escapeFragment = Hc;
  function Kr(t) {
    return typeof t == 'number' ? `${t}` : t.replace(/~/g, '~0').replace(/\//g, '~1');
  }
  O.escapeJsonPointer = Kr;
  function sa(t) {
    return t.replace(/~1/g, '/').replace(/~0/g, '~');
  }
  O.unescapeJsonPointer = sa;
  function Gc(t, e) {
    if (Array.isArray(t)) for (let r of t) e(r);
    else e(t);
  }
  O.eachItem = Gc;
  function ea({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
    return (s, a, o, i) => {
      let c =
        o === void 0
          ? a
          : o instanceof A.Name
            ? (a instanceof A.Name ? t(s, a, o) : e(s, a, o), o)
            : a instanceof A.Name
              ? (e(s, o, a), a)
              : r(a, o);
      return i === A.Name && !(c instanceof A.Name) ? n(s, c) : c;
    };
  }
  O.mergeEvaluated = {
    props: ea({
      mergeNames: (t, e, r) =>
        t.if((0, A._)`${r} !== true && ${e} !== undefined`, () => {
          t.if(
            (0, A._)`${e} === true`,
            () => t.assign(r, !0),
            () => t.assign(r, (0, A._)`${r} || {}`).code((0, A._)`Object.assign(${r}, ${e})`)
          );
        }),
      mergeToName: (t, e, r) =>
        t.if((0, A._)`${r} !== true`, () => {
          e === !0 ? t.assign(r, !0) : (t.assign(r, (0, A._)`${r} || {}`), Lr(t, r, e));
        }),
      mergeValues: (t, e) => (t === !0 ? !0 : { ...t, ...e }),
      resultToName: aa,
    }),
    items: ea({
      mergeNames: (t, e, r) =>
        t.if((0, A._)`${r} !== true && ${e} !== undefined`, () =>
          t.assign(r, (0, A._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)
        ),
      mergeToName: (t, e, r) =>
        t.if((0, A._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, A._)`${r} > ${e} ? ${r} : ${e}`)),
      mergeValues: (t, e) => (t === !0 ? !0 : Math.max(t, e)),
      resultToName: (t, e) => t.var('items', e),
    }),
  };
  function aa(t, e) {
    if (e === !0) return t.var('props', !0);
    let r = t.var('props', (0, A._)`{}`);
    return (e !== void 0 && Lr(t, r, e), r);
  }
  O.evaluatedPropsToName = aa;
  function Lr(t, e, r) {
    Object.keys(r).forEach(n => t.assign((0, A._)`${e}${(0, A.getProperty)(n)}`, !0));
  }
  O.setEvaluated = Lr;
  var ta = {};
  function Jc(t, e) {
    return t.scopeValue('func', { ref: e, code: ta[e.code] || (ta[e.code] = new zc._Code(e.code)) });
  }
  O.useFunc = Jc;
  var Ur;
  (function (t) {
    ((t[(t.Num = 0)] = 'Num'), (t[(t.Str = 1)] = 'Str'));
  })(Ur || (O.Type = Ur = {}));
  function Bc(t, e, r) {
    if (t instanceof A.Name) {
      let n = e === Ur.Num;
      return r
        ? n
          ? (0, A._)`"[" + ${t} + "]"`
          : (0, A._)`"['" + ${t} + "']"`
        : n
          ? (0, A._)`"/" + ${t}`
          : (0, A._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return r ? (0, A.getProperty)(t).toString() : '/' + Kr(t);
  }
  O.getErrorPath = Bc;
  function oa(t, e, r = t.opts.strictSchema) {
    if (r) {
      if (((e = `strict mode: ${e}`), r === !0)) throw new Error(e);
      t.self.logger.warn(e);
    }
  }
  O.checkStrictMode = oa;
});
var X = y(Hr => {
  'use strict';
  Object.defineProperty(Hr, '__esModule', { value: !0 });
  var V = w(),
    Wc = {
      data: new V.Name('data'),
      valCxt: new V.Name('valCxt'),
      instancePath: new V.Name('instancePath'),
      parentData: new V.Name('parentData'),
      parentDataProperty: new V.Name('parentDataProperty'),
      rootData: new V.Name('rootData'),
      dynamicAnchors: new V.Name('dynamicAnchors'),
      vErrors: new V.Name('vErrors'),
      errors: new V.Name('errors'),
      this: new V.Name('this'),
      self: new V.Name('self'),
      scope: new V.Name('scope'),
      json: new V.Name('json'),
      jsonPos: new V.Name('jsonPos'),
      jsonLen: new V.Name('jsonLen'),
      jsonPart: new V.Name('jsonPart'),
    };
  Hr.default = Wc;
});
var yt = y(U => {
  'use strict';
  Object.defineProperty(U, '__esModule', { value: !0 });
  U.extendErrors =
    U.resetErrorsCount =
    U.reportExtraError =
    U.reportError =
    U.keyword$DataError =
    U.keywordError =
      void 0;
  var k = w(),
    Jt = q(),
    H = X();
  U.keywordError = { message: ({ keyword: t }) => (0, k.str)`must pass "${t}" keyword validation` };
  U.keyword$DataError = {
    message: ({ keyword: t, schemaType: e }) =>
      e ? (0, k.str)`"${t}" keyword must be ${e} ($data)` : (0, k.str)`"${t}" keyword is invalid ($data)`,
  };
  function Zc(t, e = U.keywordError, r, n) {
    let { it: s } = t,
      { gen: a, compositeRule: o, allErrors: i } = s,
      c = ua(t, e, r);
    (n ?? (o || i)) ? ia(a, c) : ca(s, (0, k._)`[${c}]`);
  }
  U.reportError = Zc;
  function Qc(t, e = U.keywordError, r) {
    let { it: n } = t,
      { gen: s, compositeRule: a, allErrors: o } = n,
      i = ua(t, e, r);
    (ia(s, i), a || o || ca(n, H.default.vErrors));
  }
  U.reportExtraError = Qc;
  function Yc(t, e) {
    (t.assign(H.default.errors, e),
      t.if((0, k._)`${H.default.vErrors} !== null`, () =>
        t.if(
          e,
          () => t.assign((0, k._)`${H.default.vErrors}.length`, e),
          () => t.assign(H.default.vErrors, null)
        )
      ));
  }
  U.resetErrorsCount = Yc;
  function Xc({ gen: t, keyword: e, schemaValue: r, data: n, errsCount: s, it: a }) {
    if (s === void 0) throw new Error('ajv implementation error');
    let o = t.name('err');
    t.forRange('i', s, H.default.errors, i => {
      (t.const(o, (0, k._)`${H.default.vErrors}[${i}]`),
        t.if((0, k._)`${o}.instancePath === undefined`, () =>
          t.assign((0, k._)`${o}.instancePath`, (0, k.strConcat)(H.default.instancePath, a.errorPath))
        ),
        t.assign((0, k._)`${o}.schemaPath`, (0, k.str)`${a.errSchemaPath}/${e}`),
        a.opts.verbose && (t.assign((0, k._)`${o}.schema`, r), t.assign((0, k._)`${o}.data`, n)));
    });
  }
  U.extendErrors = Xc;
  function ia(t, e) {
    let r = t.const('err', e);
    (t.if(
      (0, k._)`${H.default.vErrors} === null`,
      () => t.assign(H.default.vErrors, (0, k._)`[${r}]`),
      (0, k._)`${H.default.vErrors}.push(${r})`
    ),
      t.code((0, k._)`${H.default.errors}++`));
  }
  function ca(t, e) {
    let { gen: r, validateName: n, schemaEnv: s } = t;
    s.$async ? r.throw((0, k._)`new ${t.ValidationError}(${e})`) : (r.assign((0, k._)`${n}.errors`, e), r.return(!1));
  }
  var Re = {
    keyword: new k.Name('keyword'),
    schemaPath: new k.Name('schemaPath'),
    params: new k.Name('params'),
    propertyName: new k.Name('propertyName'),
    message: new k.Name('message'),
    schema: new k.Name('schema'),
    parentSchema: new k.Name('parentSchema'),
  };
  function ua(t, e, r) {
    let { createErrors: n } = t.it;
    return n === !1 ? (0, k._)`{}` : eu(t, e, r);
  }
  function eu(t, e, r = {}) {
    let { gen: n, it: s } = t,
      a = [tu(s, r), ru(t, r)];
    return (nu(t, e, a), n.object(...a));
  }
  function tu({ errorPath: t }, { instancePath: e }) {
    let r = e ? (0, k.str)`${t}${(0, Jt.getErrorPath)(e, Jt.Type.Str)}` : t;
    return [H.default.instancePath, (0, k.strConcat)(H.default.instancePath, r)];
  }
  function ru({ keyword: t, it: { errSchemaPath: e } }, { schemaPath: r, parentSchema: n }) {
    let s = n ? e : (0, k.str)`${e}/${t}`;
    return (r && (s = (0, k.str)`${s}${(0, Jt.getErrorPath)(r, Jt.Type.Str)}`), [Re.schemaPath, s]);
  }
  function nu(t, { params: e, message: r }, n) {
    let { keyword: s, data: a, schemaValue: o, it: i } = t,
      { opts: c, propertyName: u, topSchemaRef: d, schemaPath: l } = i;
    (n.push([Re.keyword, s], [Re.params, typeof e == 'function' ? e(t) : e || (0, k._)`{}`]),
      c.messages && n.push([Re.message, typeof r == 'function' ? r(t) : r]),
      c.verbose && n.push([Re.schema, o], [Re.parentSchema, (0, k._)`${d}${l}`], [H.default.data, a]),
      u && n.push([Re.propertyName, u]));
  }
});
var la = y(Ue => {
  'use strict';
  Object.defineProperty(Ue, '__esModule', { value: !0 });
  Ue.boolOrEmptySchema = Ue.topBoolOrEmptySchema = void 0;
  var su = yt(),
    au = w(),
    ou = X(),
    iu = { message: 'boolean schema is false' };
  function cu(t) {
    let { gen: e, schema: r, validateName: n } = t;
    r === !1
      ? da(t, !1)
      : typeof r == 'object' && r.$async === !0
        ? e.return(ou.default.data)
        : (e.assign((0, au._)`${n}.errors`, null), e.return(!0));
  }
  Ue.topBoolOrEmptySchema = cu;
  function uu(t, e) {
    let { gen: r, schema: n } = t;
    n === !1 ? (r.var(e, !1), da(t)) : r.var(e, !0);
  }
  Ue.boolOrEmptySchema = uu;
  function da(t, e) {
    let { gen: r, data: n } = t,
      s = { gen: r, keyword: 'false schema', data: n, schema: !1, schemaCode: !1, schemaValue: !1, params: {}, it: t };
    (0, su.reportError)(s, iu, void 0, e);
  }
});
var Gr = y(Ke => {
  'use strict';
  Object.defineProperty(Ke, '__esModule', { value: !0 });
  Ke.getRules = Ke.isJSONType = void 0;
  var du = ['string', 'number', 'integer', 'boolean', 'null', 'object', 'array'],
    lu = new Set(du);
  function fu(t) {
    return typeof t == 'string' && lu.has(t);
  }
  Ke.isJSONType = fu;
  function mu() {
    let t = {
      number: { type: 'number', rules: [] },
      string: { type: 'string', rules: [] },
      array: { type: 'array', rules: [] },
      object: { type: 'object', rules: [] },
    };
    return {
      types: { ...t, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
      post: { rules: [] },
      all: {},
      keywords: {},
    };
  }
  Ke.getRules = mu;
});
var Jr = y($e => {
  'use strict';
  Object.defineProperty($e, '__esModule', { value: !0 });
  $e.shouldUseRule = $e.shouldUseGroup = $e.schemaHasRulesForType = void 0;
  function hu({ schema: t, self: e }, r) {
    let n = e.RULES.types[r];
    return n && n !== !0 && fa(t, n);
  }
  $e.schemaHasRulesForType = hu;
  function fa(t, e) {
    return e.rules.some(r => ma(t, r));
  }
  $e.shouldUseGroup = fa;
  function ma(t, e) {
    var r;
    return (
      t[e.keyword] !== void 0 ||
      ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some(n => t[n] !== void 0))
    );
  }
  $e.shouldUseRule = ma;
});
var gt = y(K => {
  'use strict';
  Object.defineProperty(K, '__esModule', { value: !0 });
  K.reportTypeError =
    K.checkDataTypes =
    K.checkDataType =
    K.coerceAndCheckDataType =
    K.getJSONTypes =
    K.getSchemaTypes =
    K.DataType =
      void 0;
  var pu = Gr(),
    yu = Jr(),
    gu = yt(),
    P = w(),
    ha = q(),
    Le;
  (function (t) {
    ((t[(t.Correct = 0)] = 'Correct'), (t[(t.Wrong = 1)] = 'Wrong'));
  })(Le || (K.DataType = Le = {}));
  function _u(t) {
    let e = pa(t.type);
    if (e.includes('null')) {
      if (t.nullable === !1) throw new Error('type: null contradicts nullable: false');
    } else {
      if (!e.length && t.nullable !== void 0) throw new Error('"nullable" cannot be used without "type"');
      t.nullable === !0 && e.push('null');
    }
    return e;
  }
  K.getSchemaTypes = _u;
  function pa(t) {
    let e = Array.isArray(t) ? t : t ? [t] : [];
    if (e.every(pu.isJSONType)) return e;
    throw new Error('type must be JSONType or JSONType[]: ' + e.join(','));
  }
  K.getJSONTypes = pa;
  function $u(t, e) {
    let { gen: r, data: n, opts: s } = t,
      a = vu(e, s.coerceTypes),
      o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, yu.schemaHasRulesForType)(t, e[0]));
    if (o) {
      let i = Wr(e, n, s.strictNumbers, Le.Wrong);
      r.if(i, () => {
        a.length ? bu(t, e, a) : Zr(t);
      });
    }
    return o;
  }
  K.coerceAndCheckDataType = $u;
  var ya = new Set(['string', 'number', 'integer', 'boolean', 'null']);
  function vu(t, e) {
    return e ? t.filter(r => ya.has(r) || (e === 'array' && r === 'array')) : [];
  }
  function bu(t, e, r) {
    let { gen: n, data: s, opts: a } = t,
      o = n.let('dataType', (0, P._)`typeof ${s}`),
      i = n.let('coerced', (0, P._)`undefined`);
    (a.coerceTypes === 'array' &&
      n.if((0, P._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () =>
        n
          .assign(s, (0, P._)`${s}[0]`)
          .assign(o, (0, P._)`typeof ${s}`)
          .if(Wr(e, s, a.strictNumbers), () => n.assign(i, s))
      ),
      n.if((0, P._)`${i} !== undefined`));
    for (let u of r) (ya.has(u) || (u === 'array' && a.coerceTypes === 'array')) && c(u);
    (n.else(),
      Zr(t),
      n.endIf(),
      n.if((0, P._)`${i} !== undefined`, () => {
        (n.assign(s, i), wu(t, i));
      }));
    function c(u) {
      switch (u) {
        case 'string':
          n.elseIf((0, P._)`${o} == "number" || ${o} == "boolean"`)
            .assign(i, (0, P._)`"" + ${s}`)
            .elseIf((0, P._)`${s} === null`)
            .assign(i, (0, P._)`""`);
          return;
        case 'number':
          n.elseIf(
            (0, P._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`
          ).assign(i, (0, P._)`+${s}`);
          return;
        case 'integer':
          n.elseIf(
            (0, P._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`
          ).assign(i, (0, P._)`+${s}`);
          return;
        case 'boolean':
          n.elseIf((0, P._)`${s} === "false" || ${s} === 0 || ${s} === null`)
            .assign(i, !1)
            .elseIf((0, P._)`${s} === "true" || ${s} === 1`)
            .assign(i, !0);
          return;
        case 'null':
          (n.elseIf((0, P._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null));
          return;
        case 'array':
          n.elseIf(
            (0, P._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`
          ).assign(i, (0, P._)`[${s}]`);
      }
    }
  }
  function wu({ gen: t, parentData: e, parentDataProperty: r }, n) {
    t.if((0, P._)`${e} !== undefined`, () => t.assign((0, P._)`${e}[${r}]`, n));
  }
  function Br(t, e, r, n = Le.Correct) {
    let s = n === Le.Correct ? P.operators.EQ : P.operators.NEQ,
      a;
    switch (t) {
      case 'null':
        return (0, P._)`${e} ${s} null`;
      case 'array':
        a = (0, P._)`Array.isArray(${e})`;
        break;
      case 'object':
        a = (0, P._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
        break;
      case 'integer':
        a = o((0, P._)`!(${e} % 1) && !isNaN(${e})`);
        break;
      case 'number':
        a = o();
        break;
      default:
        return (0, P._)`typeof ${e} ${s} ${t}`;
    }
    return n === Le.Correct ? a : (0, P.not)(a);
    function o(i = P.nil) {
      return (0, P.and)((0, P._)`typeof ${e} == "number"`, i, r ? (0, P._)`isFinite(${e})` : P.nil);
    }
  }
  K.checkDataType = Br;
  function Wr(t, e, r, n) {
    if (t.length === 1) return Br(t[0], e, r, n);
    let s,
      a = (0, ha.toHash)(t);
    if (a.array && a.object) {
      let o = (0, P._)`typeof ${e} != "object"`;
      ((s = a.null ? o : (0, P._)`!${e} || ${o}`), delete a.null, delete a.array, delete a.object);
    } else s = P.nil;
    a.number && delete a.integer;
    for (let o in a) s = (0, P.and)(s, Br(o, e, r, n));
    return s;
  }
  K.checkDataTypes = Wr;
  var Eu = {
    message: ({ schema: t }) => `must be ${t}`,
    params: ({ schema: t, schemaValue: e }) => (typeof t == 'string' ? (0, P._)`{type: ${t}}` : (0, P._)`{type: ${e}}`),
  };
  function Zr(t) {
    let e = Pu(t);
    (0, gu.reportError)(e, Eu);
  }
  K.reportTypeError = Zr;
  function Pu(t) {
    let { gen: e, data: r, schema: n } = t,
      s = (0, ha.schemaRefOrVal)(t, n, 'type');
    return {
      gen: e,
      keyword: 'type',
      data: r,
      schema: n.type,
      schemaCode: s,
      schemaValue: s,
      parentSchema: n,
      params: {},
      it: t,
    };
  }
});
var _a = y(Bt => {
  'use strict';
  Object.defineProperty(Bt, '__esModule', { value: !0 });
  Bt.assignDefaults = void 0;
  var He = w(),
    Su = q();
  function ju(t, e) {
    let { properties: r, items: n } = t.schema;
    if (e === 'object' && r) for (let s in r) ga(t, s, r[s].default);
    else e === 'array' && Array.isArray(n) && n.forEach((s, a) => ga(t, a, s.default));
  }
  Bt.assignDefaults = ju;
  function ga(t, e, r) {
    let { gen: n, compositeRule: s, data: a, opts: o } = t;
    if (r === void 0) return;
    let i = (0, He._)`${a}${(0, He.getProperty)(e)}`;
    if (s) {
      (0, Su.checkStrictMode)(t, `default is ignored for: ${i}`);
      return;
    }
    let c = (0, He._)`${i} === undefined`;
    (o.useDefaults === 'empty' && (c = (0, He._)`${c} || ${i} === null || ${i} === ""`),
      n.if(c, (0, He._)`${i} = ${(0, He.stringify)(r)}`));
  }
});
var ee = y(T => {
  'use strict';
  Object.defineProperty(T, '__esModule', { value: !0 });
  T.validateUnion =
    T.validateArray =
    T.usePattern =
    T.callValidateCode =
    T.schemaProperties =
    T.allSchemaProperties =
    T.noPropertyInData =
    T.propertyInData =
    T.isOwnProperty =
    T.hasPropFunc =
    T.reportMissingProp =
    T.checkMissingProp =
    T.checkReportMissingProp =
      void 0;
  var M = w(),
    Qr = q(),
    ve = X(),
    Ou = q();
  function qu(t, e) {
    let { gen: r, data: n, it: s } = t;
    r.if(Xr(r, n, e, s.opts.ownProperties), () => {
      (t.setParams({ missingProperty: (0, M._)`${e}` }, !0), t.error());
    });
  }
  T.checkReportMissingProp = qu;
  function Nu({ gen: t, data: e, it: { opts: r } }, n, s) {
    return (0, M.or)(...n.map(a => (0, M.and)(Xr(t, e, a, r.ownProperties), (0, M._)`${s} = ${a}`)));
  }
  T.checkMissingProp = Nu;
  function ku(t, e) {
    (t.setParams({ missingProperty: e }, !0), t.error());
  }
  T.reportMissingProp = ku;
  function $a(t) {
    return t.scopeValue('func', {
      ref: Object.prototype.hasOwnProperty,
      code: (0, M._)`Object.prototype.hasOwnProperty`,
    });
  }
  T.hasPropFunc = $a;
  function Yr(t, e, r) {
    return (0, M._)`${$a(t)}.call(${e}, ${r})`;
  }
  T.isOwnProperty = Yr;
  function Ru(t, e, r, n) {
    let s = (0, M._)`${e}${(0, M.getProperty)(r)} !== undefined`;
    return n ? (0, M._)`${s} && ${Yr(t, e, r)}` : s;
  }
  T.propertyInData = Ru;
  function Xr(t, e, r, n) {
    let s = (0, M._)`${e}${(0, M.getProperty)(r)} === undefined`;
    return n ? (0, M.or)(s, (0, M.not)(Yr(t, e, r))) : s;
  }
  T.noPropertyInData = Xr;
  function va(t) {
    return t ? Object.keys(t).filter(e => e !== '__proto__') : [];
  }
  T.allSchemaProperties = va;
  function Iu(t, e) {
    return va(e).filter(r => !(0, Qr.alwaysValidSchema)(t, e[r]));
  }
  T.schemaProperties = Iu;
  function Tu(
    { schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o },
    i,
    c,
    u
  ) {
    let d = u ? (0, M._)`${t}, ${e}, ${n}${s}` : e,
      l = [
        [ve.default.instancePath, (0, M.strConcat)(ve.default.instancePath, a)],
        [ve.default.parentData, o.parentData],
        [ve.default.parentDataProperty, o.parentDataProperty],
        [ve.default.rootData, ve.default.rootData],
      ];
    o.opts.dynamicRef && l.push([ve.default.dynamicAnchors, ve.default.dynamicAnchors]);
    let p = (0, M._)`${d}, ${r.object(...l)}`;
    return c !== M.nil ? (0, M._)`${i}.call(${c}, ${p})` : (0, M._)`${i}(${p})`;
  }
  T.callValidateCode = Tu;
  var Au = (0, M._)`new RegExp`;
  function Mu({ gen: t, it: { opts: e } }, r) {
    let n = e.unicodeRegExp ? 'u' : '',
      { regExp: s } = e.code,
      a = s(r, n);
    return t.scopeValue('pattern', {
      key: a.toString(),
      ref: a,
      code: (0, M._)`${s.code === 'new RegExp' ? Au : (0, Ou.useFunc)(t, s)}(${r}, ${n})`,
    });
  }
  T.usePattern = Mu;
  function Cu(t) {
    let { gen: e, data: r, keyword: n, it: s } = t,
      a = e.name('valid');
    if (s.allErrors) {
      let i = e.let('valid', !0);
      return (o(() => e.assign(i, !1)), i);
    }
    return (e.var(a, !0), o(() => e.break()), a);
    function o(i) {
      let c = e.const('len', (0, M._)`${r}.length`);
      e.forRange('i', 0, c, u => {
        (t.subschema({ keyword: n, dataProp: u, dataPropType: Qr.Type.Num }, a), e.if((0, M.not)(a), i));
      });
    }
  }
  T.validateArray = Cu;
  function Du(t) {
    let { gen: e, schema: r, keyword: n, it: s } = t;
    if (!Array.isArray(r)) throw new Error('ajv implementation error');
    if (r.some(c => (0, Qr.alwaysValidSchema)(s, c)) && !s.opts.unevaluated) return;
    let o = e.let('valid', !1),
      i = e.name('_valid');
    (e.block(() =>
      r.forEach((c, u) => {
        let d = t.subschema({ keyword: n, schemaProp: u, compositeRule: !0 }, i);
        (e.assign(o, (0, M._)`${o} || ${i}`), t.mergeValidEvaluated(d, i) || e.if((0, M.not)(o)));
      })
    ),
      t.result(
        o,
        () => t.reset(),
        () => t.error(!0)
      ));
  }
  T.validateUnion = Du;
});
var Ea = y(ue => {
  'use strict';
  Object.defineProperty(ue, '__esModule', { value: !0 });
  ue.validateKeywordUsage = ue.validSchemaType = ue.funcKeywordCode = ue.macroKeywordCode = void 0;
  var G = w(),
    Ie = X(),
    xu = ee(),
    zu = yt();
  function Fu(t, e) {
    let { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t,
      i = e.macro.call(o.self, s, a, o),
      c = wa(r, n, i);
    o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
    let u = r.name('valid');
    (t.subschema(
      { schema: i, schemaPath: G.nil, errSchemaPath: `${o.errSchemaPath}/${n}`, topSchemaRef: c, compositeRule: !0 },
      u
    ),
      t.pass(u, () => t.error(!0)));
  }
  ue.macroKeywordCode = Fu;
  function Vu(t, e) {
    var r;
    let { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
    Ku(c, e);
    let u = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate,
      d = wa(n, s, u),
      l = n.let('valid');
    (t.block$data(l, p), t.ok((r = e.valid) !== null && r !== void 0 ? r : l));
    function p() {
      if (e.errors === !1) (f(), e.modifying && ba(t), g(() => t.error()));
      else {
        let _ = e.async ? m() : h();
        (e.modifying && ba(t), g(() => Uu(t, _)));
      }
    }
    function m() {
      let _ = n.let('ruleErrs', null);
      return (
        n.try(
          () => f((0, G._)`await `),
          v =>
            n.assign(l, !1).if(
              (0, G._)`${v} instanceof ${c.ValidationError}`,
              () => n.assign(_, (0, G._)`${v}.errors`),
              () => n.throw(v)
            )
        ),
        _
      );
    }
    function h() {
      let _ = (0, G._)`${d}.errors`;
      return (n.assign(_, null), f(G.nil), _);
    }
    function f(_ = e.async ? (0, G._)`await ` : G.nil) {
      let v = c.opts.passContext ? Ie.default.this : Ie.default.self,
        j = !(('compile' in e && !i) || e.schema === !1);
      n.assign(l, (0, G._)`${_}${(0, xu.callValidateCode)(t, d, v, j)}`, e.modifying);
    }
    function g(_) {
      var v;
      n.if((0, G.not)((v = e.valid) !== null && v !== void 0 ? v : l), _);
    }
  }
  ue.funcKeywordCode = Vu;
  function ba(t) {
    let { gen: e, data: r, it: n } = t;
    e.if(n.parentData, () => e.assign(r, (0, G._)`${n.parentData}[${n.parentDataProperty}]`));
  }
  function Uu(t, e) {
    let { gen: r } = t;
    r.if(
      (0, G._)`Array.isArray(${e})`,
      () => {
        (r
          .assign(
            Ie.default.vErrors,
            (0, G._)`${Ie.default.vErrors} === null ? ${e} : ${Ie.default.vErrors}.concat(${e})`
          )
          .assign(Ie.default.errors, (0, G._)`${Ie.default.vErrors}.length`),
          (0, zu.extendErrors)(t));
      },
      () => t.error()
    );
  }
  function Ku({ schemaEnv: t }, e) {
    if (e.async && !t.$async) throw new Error('async keyword in sync schema');
  }
  function wa(t, e, r) {
    if (r === void 0) throw new Error(`keyword "${e}" failed to compile`);
    return t.scopeValue('keyword', typeof r == 'function' ? { ref: r } : { ref: r, code: (0, G.stringify)(r) });
  }
  function Lu(t, e, r = !1) {
    return (
      !e.length ||
      e.some(n =>
        n === 'array'
          ? Array.isArray(t)
          : n === 'object'
            ? t && typeof t == 'object' && !Array.isArray(t)
            : typeof t == n || (r && typeof t > 'u')
      )
    );
  }
  ue.validSchemaType = Lu;
  function Hu({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
    if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
      throw new Error('ajv implementation error');
    let o = s.dependencies;
    if (o?.some(i => !Object.prototype.hasOwnProperty.call(t, i)))
      throw new Error(`parent schema must have dependencies of ${a}: ${o.join(',')}`);
    if (s.validateSchema && !s.validateSchema(t[a])) {
      let c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
      if (e.validateSchema === 'log') r.logger.error(c);
      else throw new Error(c);
    }
  }
  ue.validateKeywordUsage = Hu;
});
var Sa = y(be => {
  'use strict';
  Object.defineProperty(be, '__esModule', { value: !0 });
  be.extendSubschemaMode = be.extendSubschemaData = be.getSubschema = void 0;
  var de = w(),
    Pa = q();
  function Gu(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
    if (e !== void 0 && n !== void 0) throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (e !== void 0) {
      let i = t.schema[e];
      return r === void 0
        ? {
            schema: i,
            schemaPath: (0, de._)`${t.schemaPath}${(0, de.getProperty)(e)}`,
            errSchemaPath: `${t.errSchemaPath}/${e}`,
          }
        : {
            schema: i[r],
            schemaPath: (0, de._)`${t.schemaPath}${(0, de.getProperty)(e)}${(0, de.getProperty)(r)}`,
            errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Pa.escapeFragment)(r)}`,
          };
    }
    if (n !== void 0) {
      if (s === void 0 || a === void 0 || o === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return { schema: n, schemaPath: s, topSchemaRef: o, errSchemaPath: a };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  be.getSubschema = Gu;
  function Ju(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
    if (s !== void 0 && r !== void 0) throw new Error('both "data" and "dataProp" passed, only one allowed');
    let { gen: i } = e;
    if (r !== void 0) {
      let { errorPath: u, dataPathArr: d, opts: l } = e,
        p = i.let('data', (0, de._)`${e.data}${(0, de.getProperty)(r)}`, !0);
      (c(p),
        (t.errorPath = (0, de.str)`${u}${(0, Pa.getErrorPath)(r, n, l.jsPropertySyntax)}`),
        (t.parentDataProperty = (0, de._)`${r}`),
        (t.dataPathArr = [...d, t.parentDataProperty]));
    }
    if (s !== void 0) {
      let u = s instanceof de.Name ? s : i.let('data', s, !0);
      (c(u), o !== void 0 && (t.propertyName = o));
    }
    a && (t.dataTypes = a);
    function c(u) {
      ((t.data = u),
        (t.dataLevel = e.dataLevel + 1),
        (t.dataTypes = []),
        (e.definedProperties = new Set()),
        (t.parentData = e.data),
        (t.dataNames = [...e.dataNames, u]));
    }
  }
  be.extendSubschemaData = Ju;
  function Bu(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
    (n !== void 0 && (t.compositeRule = n),
      s !== void 0 && (t.createErrors = s),
      a !== void 0 && (t.allErrors = a),
      (t.jtdDiscriminator = e),
      (t.jtdMetadata = r));
  }
  be.extendSubschemaMode = Bu;
});
var en = y((d0, ja) => {
  'use strict';
  ja.exports = function t(e, r) {
    if (e === r) return !0;
    if (e && r && typeof e == 'object' && typeof r == 'object') {
      if (e.constructor !== r.constructor) return !1;
      var n, s, a;
      if (Array.isArray(e)) {
        if (((n = e.length), n != r.length)) return !1;
        for (s = n; s-- !== 0;) if (!t(e[s], r[s])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
      if (((a = Object.keys(e)), (n = a.length), n !== Object.keys(r).length)) return !1;
      for (s = n; s-- !== 0;) if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
      for (s = n; s-- !== 0;) {
        var o = a[s];
        if (!t(e[o], r[o])) return !1;
      }
      return !0;
    }
    return e !== e && r !== r;
  };
});
var qa = y((l0, Oa) => {
  'use strict';
  var we = (Oa.exports = function (t, e, r) {
    (typeof e == 'function' && ((r = e), (e = {})), (r = e.cb || r));
    var n = typeof r == 'function' ? r : r.pre || function () {},
      s = r.post || function () {};
    Wt(e, n, s, t, '', t);
  });
  we.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0,
  };
  we.arrayKeywords = { items: !0, allOf: !0, anyOf: !0, oneOf: !0 };
  we.propsKeywords = { $defs: !0, definitions: !0, properties: !0, patternProperties: !0, dependencies: !0 };
  we.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0,
  };
  function Wt(t, e, r, n, s, a, o, i, c, u) {
    if (n && typeof n == 'object' && !Array.isArray(n)) {
      e(n, s, a, o, i, c, u);
      for (var d in n) {
        var l = n[d];
        if (Array.isArray(l)) {
          if (d in we.arrayKeywords)
            for (var p = 0; p < l.length; p++) Wt(t, e, r, l[p], s + '/' + d + '/' + p, a, s, d, n, p);
        } else if (d in we.propsKeywords) {
          if (l && typeof l == 'object') for (var m in l) Wt(t, e, r, l[m], s + '/' + d + '/' + Wu(m), a, s, d, n, m);
        } else (d in we.keywords || (t.allKeys && !(d in we.skipKeywords))) && Wt(t, e, r, l, s + '/' + d, a, s, d, n);
      }
      r(n, s, a, o, i, c, u);
    }
  }
  function Wu(t) {
    return t.replace(/~/g, '~0').replace(/\//g, '~1');
  }
});
var _t = y(W => {
  'use strict';
  Object.defineProperty(W, '__esModule', { value: !0 });
  W.getSchemaRefs = W.resolveUrl = W.normalizeId = W._getFullPath = W.getFullPath = W.inlineRef = void 0;
  var Zu = q(),
    Qu = en(),
    Yu = qa(),
    Xu = new Set([
      'type',
      'format',
      'pattern',
      'maxLength',
      'minLength',
      'maxProperties',
      'minProperties',
      'maxItems',
      'minItems',
      'maximum',
      'minimum',
      'uniqueItems',
      'multipleOf',
      'required',
      'enum',
      'const',
    ]);
  function ed(t, e = !0) {
    return typeof t == 'boolean' ? !0 : e === !0 ? !tn(t) : e ? Na(t) <= e : !1;
  }
  W.inlineRef = ed;
  var td = new Set(['$ref', '$recursiveRef', '$recursiveAnchor', '$dynamicRef', '$dynamicAnchor']);
  function tn(t) {
    for (let e in t) {
      if (td.has(e)) return !0;
      let r = t[e];
      if ((Array.isArray(r) && r.some(tn)) || (typeof r == 'object' && tn(r))) return !0;
    }
    return !1;
  }
  function Na(t) {
    let e = 0;
    for (let r in t) {
      if (r === '$ref') return 1 / 0;
      if ((e++, !Xu.has(r) && (typeof t[r] == 'object' && (0, Zu.eachItem)(t[r], n => (e += Na(n))), e === 1 / 0)))
        return 1 / 0;
    }
    return e;
  }
  function ka(t, e = '', r) {
    r !== !1 && (e = Ge(e));
    let n = t.parse(e);
    return Ra(t, n);
  }
  W.getFullPath = ka;
  function Ra(t, e) {
    return t.serialize(e).split('#')[0] + '#';
  }
  W._getFullPath = Ra;
  var rd = /#\/?$/;
  function Ge(t) {
    return t ? t.replace(rd, '') : '';
  }
  W.normalizeId = Ge;
  function nd(t, e, r) {
    return ((r = Ge(r)), t.resolve(e, r));
  }
  W.resolveUrl = nd;
  var sd = /^[a-z_][-a-z0-9._]*$/i;
  function ad(t, e) {
    if (typeof t == 'boolean') return {};
    let { schemaId: r, uriResolver: n } = this.opts,
      s = Ge(t[r] || e),
      a = { '': s },
      o = ka(n, s, !1),
      i = {},
      c = new Set();
    return (
      Yu(t, { allKeys: !0 }, (l, p, m, h) => {
        if (h === void 0) return;
        let f = o + p,
          g = a[h];
        (typeof l[r] == 'string' && (g = _.call(this, l[r])),
          v.call(this, l.$anchor),
          v.call(this, l.$dynamicAnchor),
          (a[p] = g));
        function _(j) {
          let I = this.opts.uriResolver.resolve;
          if (((j = Ge(g ? I(g, j) : j)), c.has(j))) throw d(j);
          c.add(j);
          let E = this.refs[j];
          return (
            typeof E == 'string' && (E = this.refs[E]),
            typeof E == 'object'
              ? u(l, E.schema, j)
              : j !== Ge(f) && (j[0] === '#' ? (u(l, i[j], j), (i[j] = l)) : (this.refs[j] = f)),
            j
          );
        }
        function v(j) {
          if (typeof j == 'string') {
            if (!sd.test(j)) throw new Error(`invalid anchor "${j}"`);
            _.call(this, `#${j}`);
          }
        }
      }),
      i
    );
    function u(l, p, m) {
      if (p !== void 0 && !Qu(l, p)) throw d(m);
    }
    function d(l) {
      return new Error(`reference "${l}" resolves to more than one schema`);
    }
  }
  W.getSchemaRefs = ad;
});
var Je = y(Ee => {
  'use strict';
  Object.defineProperty(Ee, '__esModule', { value: !0 });
  Ee.getData = Ee.KeywordCxt = Ee.validateFunctionCode = void 0;
  var Ca = la(),
    Ia = gt(),
    nn = Jr(),
    Zt = gt(),
    od = _a(),
    vt = Ea(),
    rn = Sa(),
    $ = w(),
    b = X(),
    id = _t(),
    ge = q(),
    $t = yt();
  function cd(t) {
    if (za(t) && (Fa(t), xa(t))) {
      ld(t);
      return;
    }
    Da(t, () => (0, Ca.topBoolOrEmptySchema)(t));
  }
  Ee.validateFunctionCode = cd;
  function Da({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
    s.code.es5
      ? t.func(e, (0, $._)`${b.default.data}, ${b.default.valCxt}`, n.$async, () => {
          (t.code((0, $._)`"use strict"; ${Ta(r, s)}`), dd(t, s), t.code(a));
        })
      : t.func(e, (0, $._)`${b.default.data}, ${ud(s)}`, n.$async, () => t.code(Ta(r, s)).code(a));
  }
  function ud(t) {
    return (0,
    $._)`{${b.default.instancePath}="", ${b.default.parentData}, ${b.default.parentDataProperty}, ${b.default.rootData}=${b.default.data}${t.dynamicRef ? (0, $._)`, ${b.default.dynamicAnchors}={}` : $.nil}}={}`;
  }
  function dd(t, e) {
    t.if(
      b.default.valCxt,
      () => {
        (t.var(b.default.instancePath, (0, $._)`${b.default.valCxt}.${b.default.instancePath}`),
          t.var(b.default.parentData, (0, $._)`${b.default.valCxt}.${b.default.parentData}`),
          t.var(b.default.parentDataProperty, (0, $._)`${b.default.valCxt}.${b.default.parentDataProperty}`),
          t.var(b.default.rootData, (0, $._)`${b.default.valCxt}.${b.default.rootData}`),
          e.dynamicRef && t.var(b.default.dynamicAnchors, (0, $._)`${b.default.valCxt}.${b.default.dynamicAnchors}`));
      },
      () => {
        (t.var(b.default.instancePath, (0, $._)`""`),
          t.var(b.default.parentData, (0, $._)`undefined`),
          t.var(b.default.parentDataProperty, (0, $._)`undefined`),
          t.var(b.default.rootData, b.default.data),
          e.dynamicRef && t.var(b.default.dynamicAnchors, (0, $._)`{}`));
      }
    );
  }
  function ld(t) {
    let { schema: e, opts: r, gen: n } = t;
    Da(t, () => {
      (r.$comment && e.$comment && Ua(t),
        yd(t),
        n.let(b.default.vErrors, null),
        n.let(b.default.errors, 0),
        r.unevaluated && fd(t),
        Va(t),
        $d(t));
    });
  }
  function fd(t) {
    let { gen: e, validateName: r } = t;
    ((t.evaluated = e.const('evaluated', (0, $._)`${r}.evaluated`)),
      e.if((0, $._)`${t.evaluated}.dynamicProps`, () => e.assign((0, $._)`${t.evaluated}.props`, (0, $._)`undefined`)),
      e.if((0, $._)`${t.evaluated}.dynamicItems`, () => e.assign((0, $._)`${t.evaluated}.items`, (0, $._)`undefined`)));
  }
  function Ta(t, e) {
    let r = typeof t == 'object' && t[e.schemaId];
    return r && (e.code.source || e.code.process) ? (0, $._)`/*# sourceURL=${r} */` : $.nil;
  }
  function md(t, e) {
    if (za(t) && (Fa(t), xa(t))) {
      hd(t, e);
      return;
    }
    (0, Ca.boolOrEmptySchema)(t, e);
  }
  function xa({ schema: t, self: e }) {
    if (typeof t == 'boolean') return !t;
    for (let r in t) if (e.RULES.all[r]) return !0;
    return !1;
  }
  function za(t) {
    return typeof t.schema != 'boolean';
  }
  function hd(t, e) {
    let { schema: r, gen: n, opts: s } = t;
    (s.$comment && r.$comment && Ua(t), gd(t), _d(t));
    let a = n.const('_errs', b.default.errors);
    (Va(t, a), n.var(e, (0, $._)`${a} === ${b.default.errors}`));
  }
  function Fa(t) {
    ((0, ge.checkUnknownRules)(t), pd(t));
  }
  function Va(t, e) {
    if (t.opts.jtd) return Aa(t, [], !1, e);
    let r = (0, Ia.getSchemaTypes)(t.schema),
      n = (0, Ia.coerceAndCheckDataType)(t, r);
    Aa(t, r, !n, e);
  }
  function pd(t) {
    let { schema: e, errSchemaPath: r, opts: n, self: s } = t;
    e.$ref &&
      n.ignoreKeywordsWithRef &&
      (0, ge.schemaHasRulesButRef)(e, s.RULES) &&
      s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
  }
  function yd(t) {
    let { schema: e, opts: r } = t;
    e.default !== void 0 &&
      r.useDefaults &&
      r.strictSchema &&
      (0, ge.checkStrictMode)(t, 'default is ignored in the schema root');
  }
  function gd(t) {
    let e = t.schema[t.opts.schemaId];
    e && (t.baseId = (0, id.resolveUrl)(t.opts.uriResolver, t.baseId, e));
  }
  function _d(t) {
    if (t.schema.$async && !t.schemaEnv.$async) throw new Error('async schema in sync schema');
  }
  function Ua({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
    let a = r.$comment;
    if (s.$comment === !0) t.code((0, $._)`${b.default.self}.logger.log(${a})`);
    else if (typeof s.$comment == 'function') {
      let o = (0, $.str)`${n}/$comment`,
        i = t.scopeValue('root', { ref: e.root });
      t.code((0, $._)`${b.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
    }
  }
  function $d(t) {
    let { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
    r.$async
      ? e.if(
          (0, $._)`${b.default.errors} === 0`,
          () => e.return(b.default.data),
          () => e.throw((0, $._)`new ${s}(${b.default.vErrors})`)
        )
      : (e.assign((0, $._)`${n}.errors`, b.default.vErrors),
        a.unevaluated && vd(t),
        e.return((0, $._)`${b.default.errors} === 0`));
  }
  function vd({ gen: t, evaluated: e, props: r, items: n }) {
    (r instanceof $.Name && t.assign((0, $._)`${e}.props`, r),
      n instanceof $.Name && t.assign((0, $._)`${e}.items`, n));
  }
  function Aa(t, e, r, n) {
    let { gen: s, schema: a, data: o, allErrors: i, opts: c, self: u } = t,
      { RULES: d } = u;
    if (a.$ref && (c.ignoreKeywordsWithRef || !(0, ge.schemaHasRulesButRef)(a, d))) {
      s.block(() => La(t, '$ref', d.all.$ref.definition));
      return;
    }
    (c.jtd || bd(t, e),
      s.block(() => {
        for (let p of d.rules) l(p);
        l(d.post);
      }));
    function l(p) {
      (0, nn.shouldUseGroup)(a, p) &&
        (p.type
          ? (s.if((0, Zt.checkDataType)(p.type, o, c.strictNumbers)),
            Ma(t, p),
            e.length === 1 && e[0] === p.type && r && (s.else(), (0, Zt.reportTypeError)(t)),
            s.endIf())
          : Ma(t, p),
        i || s.if((0, $._)`${b.default.errors} === ${n || 0}`));
    }
  }
  function Ma(t, e) {
    let {
      gen: r,
      schema: n,
      opts: { useDefaults: s },
    } = t;
    (s && (0, od.assignDefaults)(t, e.type),
      r.block(() => {
        for (let a of e.rules) (0, nn.shouldUseRule)(n, a) && La(t, a.keyword, a.definition, e.type);
      }));
  }
  function bd(t, e) {
    t.schemaEnv.meta || !t.opts.strictTypes || (wd(t, e), t.opts.allowUnionTypes || Ed(t, e), Pd(t, t.dataTypes));
  }
  function wd(t, e) {
    if (e.length) {
      if (!t.dataTypes.length) {
        t.dataTypes = e;
        return;
      }
      (e.forEach(r => {
        Ka(t.dataTypes, r) || sn(t, `type "${r}" not allowed by context "${t.dataTypes.join(',')}"`);
      }),
        jd(t, e));
    }
  }
  function Ed(t, e) {
    e.length > 1 && !(e.length === 2 && e.includes('null')) && sn(t, 'use allowUnionTypes to allow union type keyword');
  }
  function Pd(t, e) {
    let r = t.self.RULES.all;
    for (let n in r) {
      let s = r[n];
      if (typeof s == 'object' && (0, nn.shouldUseRule)(t.schema, s)) {
        let { type: a } = s.definition;
        a.length && !a.some(o => Sd(e, o)) && sn(t, `missing type "${a.join(',')}" for keyword "${n}"`);
      }
    }
  }
  function Sd(t, e) {
    return t.includes(e) || (e === 'number' && t.includes('integer'));
  }
  function Ka(t, e) {
    return t.includes(e) || (e === 'integer' && t.includes('number'));
  }
  function jd(t, e) {
    let r = [];
    for (let n of t.dataTypes) Ka(e, n) ? r.push(n) : e.includes('integer') && n === 'number' && r.push('integer');
    t.dataTypes = r;
  }
  function sn(t, e) {
    let r = t.schemaEnv.baseId + t.errSchemaPath;
    ((e += ` at "${r}" (strictTypes)`), (0, ge.checkStrictMode)(t, e, t.opts.strictTypes));
  }
  var Qt = class {
    constructor(e, r, n) {
      if (
        ((0, vt.validateKeywordUsage)(e, r, n),
        (this.gen = e.gen),
        (this.allErrors = e.allErrors),
        (this.keyword = n),
        (this.data = e.data),
        (this.schema = e.schema[n]),
        (this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data),
        (this.schemaValue = (0, ge.schemaRefOrVal)(e, this.schema, n, this.$data)),
        (this.schemaType = r.schemaType),
        (this.parentSchema = e.schema),
        (this.params = {}),
        (this.it = e),
        (this.def = r),
        this.$data)
      )
        this.schemaCode = e.gen.const('vSchema', Ha(this.$data, e));
      else if (
        ((this.schemaCode = this.schemaValue), !(0, vt.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      )
        throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
      ('code' in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = e.gen.const('_errs', b.default.errors));
    }
    result(e, r, n) {
      this.failResult((0, $.not)(e), r, n);
    }
    failResult(e, r, n) {
      (this.gen.if(e),
        n ? n() : this.error(),
        r
          ? (this.gen.else(), r(), this.allErrors && this.gen.endIf())
          : this.allErrors
            ? this.gen.endIf()
            : this.gen.else());
    }
    pass(e, r) {
      this.failResult((0, $.not)(e), void 0, r);
    }
    fail(e) {
      if (e === void 0) {
        (this.error(), this.allErrors || this.gen.if(!1));
        return;
      }
      (this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else());
    }
    fail$data(e) {
      if (!this.$data) return this.fail(e);
      let { schemaCode: r } = this;
      this.fail((0, $._)`${r} !== undefined && (${(0, $.or)(this.invalid$data(), e)})`);
    }
    error(e, r, n) {
      if (r) {
        (this.setParams(r), this._error(e, n), this.setParams({}));
        return;
      }
      this._error(e, n);
    }
    _error(e, r) {
      (e ? $t.reportExtraError : $t.reportError)(this, this.def.error, r);
    }
    $dataError() {
      (0, $t.reportError)(this, this.def.$dataError || $t.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
      (0, $t.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(e) {
      this.allErrors || this.gen.if(e);
    }
    setParams(e, r) {
      r ? Object.assign(this.params, e) : (this.params = e);
    }
    block$data(e, r, n = $.nil) {
      this.gen.block(() => {
        (this.check$data(e, n), r());
      });
    }
    check$data(e = $.nil, r = $.nil) {
      if (!this.$data) return;
      let { gen: n, schemaCode: s, schemaType: a, def: o } = this;
      (n.if((0, $.or)((0, $._)`${s} === undefined`, r)),
        e !== $.nil && n.assign(e, !0),
        (a.length || o.validateSchema) &&
          (n.elseIf(this.invalid$data()), this.$dataError(), e !== $.nil && n.assign(e, !1)),
        n.else());
    }
    invalid$data() {
      let { gen: e, schemaCode: r, schemaType: n, def: s, it: a } = this;
      return (0, $.or)(o(), i());
      function o() {
        if (n.length) {
          if (!(r instanceof $.Name)) throw new Error('ajv implementation error');
          let c = Array.isArray(n) ? n : [n];
          return (0, $._)`${(0, Zt.checkDataTypes)(c, r, a.opts.strictNumbers, Zt.DataType.Wrong)}`;
        }
        return $.nil;
      }
      function i() {
        if (s.validateSchema) {
          let c = e.scopeValue('validate$data', { ref: s.validateSchema });
          return (0, $._)`!${c}(${r})`;
        }
        return $.nil;
      }
    }
    subschema(e, r) {
      let n = (0, rn.getSubschema)(this.it, e);
      ((0, rn.extendSubschemaData)(n, this.it, e), (0, rn.extendSubschemaMode)(n, e));
      let s = { ...this.it, ...n, items: void 0, props: void 0 };
      return (md(s, r), s);
    }
    mergeEvaluated(e, r) {
      let { it: n, gen: s } = this;
      n.opts.unevaluated &&
        (n.props !== !0 && e.props !== void 0 && (n.props = ge.mergeEvaluated.props(s, e.props, n.props, r)),
        n.items !== !0 && e.items !== void 0 && (n.items = ge.mergeEvaluated.items(s, e.items, n.items, r)));
    }
    mergeValidEvaluated(e, r) {
      let { it: n, gen: s } = this;
      if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
        return (s.if(r, () => this.mergeEvaluated(e, $.Name)), !0);
    }
  };
  Ee.KeywordCxt = Qt;
  function La(t, e, r, n) {
    let s = new Qt(t, r, e);
    'code' in r
      ? r.code(s, n)
      : s.$data && r.validate
        ? (0, vt.funcKeywordCode)(s, r)
        : 'macro' in r
          ? (0, vt.macroKeywordCode)(s, r)
          : (r.compile || r.validate) && (0, vt.funcKeywordCode)(s, r);
  }
  var Od = /^\/(?:[^~]|~0|~1)*$/,
    qd = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Ha(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
    let s, a;
    if (t === '') return b.default.rootData;
    if (t[0] === '/') {
      if (!Od.test(t)) throw new Error(`Invalid JSON-pointer: ${t}`);
      ((s = t), (a = b.default.rootData));
    } else {
      let u = qd.exec(t);
      if (!u) throw new Error(`Invalid JSON-pointer: ${t}`);
      let d = +u[1];
      if (((s = u[2]), s === '#')) {
        if (d >= e) throw new Error(c('property/index', d));
        return n[e - d];
      }
      if (d > e) throw new Error(c('data', d));
      if (((a = r[e - d]), !s)) return a;
    }
    let o = a,
      i = s.split('/');
    for (let u of i)
      u && ((a = (0, $._)`${a}${(0, $.getProperty)((0, ge.unescapeJsonPointer)(u))}`), (o = (0, $._)`${o} && ${a}`));
    return o;
    function c(u, d) {
      return `Cannot access ${u} ${d} levels up, current level is ${e}`;
    }
  }
  Ee.getData = Ha;
});
var bt = y(on => {
  'use strict';
  Object.defineProperty(on, '__esModule', { value: !0 });
  var an = class extends Error {
    constructor(e) {
      (super('validation failed'), (this.errors = e), (this.ajv = this.validation = !0));
    }
  };
  on.default = an;
});
var Be = y(dn => {
  'use strict';
  Object.defineProperty(dn, '__esModule', { value: !0 });
  var cn = _t(),
    un = class extends Error {
      constructor(e, r, n, s) {
        (super(s || `can't resolve reference ${n} from id ${r}`),
          (this.missingRef = (0, cn.resolveUrl)(e, r, n)),
          (this.missingSchema = (0, cn.normalizeId)((0, cn.getFullPath)(e, this.missingRef))));
      }
    };
  dn.default = un;
});
var wt = y(te => {
  'use strict';
  Object.defineProperty(te, '__esModule', { value: !0 });
  te.resolveSchema = te.getCompilingSchema = te.resolveRef = te.compileSchema = te.SchemaEnv = void 0;
  var se = w(),
    Nd = bt(),
    Te = X(),
    ae = _t(),
    Ga = q(),
    kd = Je(),
    We = class {
      constructor(e) {
        var r;
        ((this.refs = {}), (this.dynamicAnchors = {}));
        let n;
        (typeof e.schema == 'object' && (n = e.schema),
          (this.schema = e.schema),
          (this.schemaId = e.schemaId),
          (this.root = e.root || this),
          (this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, ae.normalizeId)(n?.[e.schemaId || '$id'])),
          (this.schemaPath = e.schemaPath),
          (this.localRefs = e.localRefs),
          (this.meta = e.meta),
          (this.$async = n?.$async),
          (this.refs = {}));
      }
    };
  te.SchemaEnv = We;
  function fn(t) {
    let e = Ja.call(this, t);
    if (e) return e;
    let r = (0, ae.getFullPath)(this.opts.uriResolver, t.root.baseId),
      { es5: n, lines: s } = this.opts.code,
      { ownProperties: a } = this.opts,
      o = new se.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a }),
      i;
    t.$async &&
      (i = o.scopeValue('Error', {
        ref: Nd.default,
        code: (0, se._)`require("ajv/dist/runtime/validation_error").default`,
      }));
    let c = o.scopeName('validate');
    t.validateName = c;
    let u = {
        gen: o,
        allErrors: this.opts.allErrors,
        data: Te.default.data,
        parentData: Te.default.parentData,
        parentDataProperty: Te.default.parentDataProperty,
        dataNames: [Te.default.data],
        dataPathArr: [se.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: new Set(),
        topSchemaRef: o.scopeValue(
          'schema',
          this.opts.code.source === !0 ? { ref: t.schema, code: (0, se.stringify)(t.schema) } : { ref: t.schema }
        ),
        validateName: c,
        ValidationError: i,
        schema: t.schema,
        schemaEnv: t,
        rootId: r,
        baseId: t.baseId || r,
        schemaPath: se.nil,
        errSchemaPath: t.schemaPath || (this.opts.jtd ? '' : '#'),
        errorPath: (0, se._)`""`,
        opts: this.opts,
        self: this,
      },
      d;
    try {
      (this._compilations.add(t), (0, kd.validateFunctionCode)(u), o.optimize(this.opts.code.optimize));
      let l = o.toString();
      ((d = `${o.scopeRefs(Te.default.scope)}return ${l}`),
        this.opts.code.process && (d = this.opts.code.process(d, t)));
      let m = new Function(`${Te.default.self}`, `${Te.default.scope}`, d)(this, this.scope.get());
      if (
        (this.scope.value(c, { ref: m }),
        (m.errors = null),
        (m.schema = t.schema),
        (m.schemaEnv = t),
        t.$async && (m.$async = !0),
        this.opts.code.source === !0 && (m.source = { validateName: c, validateCode: l, scopeValues: o._values }),
        this.opts.unevaluated)
      ) {
        let { props: h, items: f } = u;
        ((m.evaluated = {
          props: h instanceof se.Name ? void 0 : h,
          items: f instanceof se.Name ? void 0 : f,
          dynamicProps: h instanceof se.Name,
          dynamicItems: f instanceof se.Name,
        }),
          m.source && (m.source.evaluated = (0, se.stringify)(m.evaluated)));
      }
      return ((t.validate = m), t);
    } catch (l) {
      throw (
        delete t.validate,
        delete t.validateName,
        d && this.logger.error('Error compiling schema, function code:', d),
        l
      );
    } finally {
      this._compilations.delete(t);
    }
  }
  te.compileSchema = fn;
  function Rd(t, e, r) {
    var n;
    r = (0, ae.resolveUrl)(this.opts.uriResolver, e, r);
    let s = t.refs[r];
    if (s) return s;
    let a = Ad.call(this, t, r);
    if (a === void 0) {
      let o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r],
        { schemaId: i } = this.opts;
      o && (a = new We({ schema: o, schemaId: i, root: t, baseId: e }));
    }
    if (a !== void 0) return (t.refs[r] = Id.call(this, a));
  }
  te.resolveRef = Rd;
  function Id(t) {
    return (0, ae.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : fn.call(this, t);
  }
  function Ja(t) {
    for (let e of this._compilations) if (Td(e, t)) return e;
  }
  te.getCompilingSchema = Ja;
  function Td(t, e) {
    return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
  }
  function Ad(t, e) {
    let r;
    for (; typeof (r = this.refs[e]) == 'string';) e = r;
    return r || this.schemas[e] || Yt.call(this, t, e);
  }
  function Yt(t, e) {
    let r = this.opts.uriResolver.parse(e),
      n = (0, ae._getFullPath)(this.opts.uriResolver, r),
      s = (0, ae.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
    if (Object.keys(t.schema).length > 0 && n === s) return ln.call(this, r, t);
    let a = (0, ae.normalizeId)(n),
      o = this.refs[a] || this.schemas[a];
    if (typeof o == 'string') {
      let i = Yt.call(this, t, o);
      return typeof i?.schema != 'object' ? void 0 : ln.call(this, r, i);
    }
    if (typeof o?.schema == 'object') {
      if ((o.validate || fn.call(this, o), a === (0, ae.normalizeId)(e))) {
        let { schema: i } = o,
          { schemaId: c } = this.opts,
          u = i[c];
        return (
          u && (s = (0, ae.resolveUrl)(this.opts.uriResolver, s, u)),
          new We({ schema: i, schemaId: c, root: t, baseId: s })
        );
      }
      return ln.call(this, r, o);
    }
  }
  te.resolveSchema = Yt;
  var Md = new Set(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
  function ln(t, { baseId: e, schema: r, root: n }) {
    var s;
    if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== '/') return;
    for (let i of t.fragment.slice(1).split('/')) {
      if (typeof r == 'boolean') return;
      let c = r[(0, Ga.unescapeFragment)(i)];
      if (c === void 0) return;
      r = c;
      let u = typeof r == 'object' && r[this.opts.schemaId];
      !Md.has(i) && u && (e = (0, ae.resolveUrl)(this.opts.uriResolver, e, u));
    }
    let a;
    if (typeof r != 'boolean' && r.$ref && !(0, Ga.schemaHasRulesButRef)(r, this.RULES)) {
      let i = (0, ae.resolveUrl)(this.opts.uriResolver, e, r.$ref);
      a = Yt.call(this, n, i);
    }
    let { schemaId: o } = this.opts;
    if (((a = a || new We({ schema: r, schemaId: o, root: n, baseId: e })), a.schema !== a.root.schema)) return a;
  }
});
var Ba = y((g0, Cd) => {
  Cd.exports = {
    $id: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#',
    description: 'Meta-schema for $data reference (JSON AnySchema extension proposal)',
    type: 'object',
    required: ['$data'],
    properties: { $data: { type: 'string', anyOf: [{ format: 'relative-json-pointer' }, { format: 'json-pointer' }] } },
    additionalProperties: !1,
  };
});
var _n = y((_0, to) => {
  'use strict';
  var Dd = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu),
    hn = RegExp.prototype.test.bind(
      /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u
    ),
    Ae = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu),
    pn = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu),
    Za = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u),
    yn = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u),
    xd = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u),
    Z = new Array(256);
  {
    let t = '0123456789ABCDEF';
    for (let e = 0; e < 256; e++) Z[e] = '%' + t[e >> 4] + t[e & 15];
  }
  function L(t) {
    return t < 2048
      ? Z[192 | (t >> 6)] + Z[128 | (t & 63)]
      : t < 65536
        ? Z[224 | (t >> 12)] + Z[128 | ((t >> 6) & 63)] + Z[128 | (t & 63)]
        : Z[240 | (t >> 18)] + Z[128 | ((t >> 12) & 63)] + Z[128 | ((t >> 6) & 63)] + Z[128 | (t & 63)];
  }
  function zd(t) {
    let e = '',
      r = 0,
      n = 0;
    for (n = 0; n < t.length; n++)
      if (((r = t[n].charCodeAt(0)), r !== 48)) {
        if (!((r >= 48 && r <= 57) || (r >= 65 && r <= 70) || (r >= 97 && r <= 102))) return '';
        e += t[n];
        break;
      }
    for (n += 1; n < t.length; n++) {
      if (((r = t[n].charCodeAt(0)), !((r >= 48 && r <= 57) || (r >= 65 && r <= 70) || (r >= 97 && r <= 102))))
        return '';
      e += t[n];
    }
    return e;
  }
  var Fd = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/),
    Vd = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/),
    Ud = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/),
    Kd = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function Ld(t) {
    if (t.length === 0) return !1;
    for (let e = 0; e < t.length; e++)
      if (!Ud(t[e])) {
        if (t[e] === '%' && e + 2 < t.length && Ae(t.slice(e + 1, e + 3))) {
          e += 2;
          continue;
        }
        return !1;
      }
    return !0;
  }
  function Wa(t) {
    let e = -1,
      r = 0,
      n = -1,
      s = 0;
    for (let i = 0; i < t.length; i++)
      t[i] === '0' ? (n === -1 && (n = i), s++, s > r && ((r = s), (e = n))) : ((n = -1), (s = 0));
    if (r < 2) return t.join(':');
    let a = t.slice(0, e).join(':'),
      o = t.slice(e + r).join(':');
    return a + '::' + o;
  }
  function Hd(t) {
    let e = t.indexOf('::');
    if (e !== -1 && t.indexOf('::', e + 1) !== -1) return;
    let r = e === -1 ? t.split(':') : t.slice(0, e).split(':'),
      n = e === -1 ? [] : t.slice(e + 2).split(':');
    e !== -1 && (r.length === 1 && r[0] === '' && (r.length = 0), n.length === 1 && n[0] === '' && (n.length = 0));
    let s = r.concat(n),
      a = 0;
    for (let i = 0; i < s.length; i++) {
      let c = s[i];
      if (c === '') return;
      if (c.indexOf('.') !== -1) {
        if (i !== s.length - 1 || (e !== -1 && n.length === 0) || !hn(c)) return;
        a += 2;
        continue;
      }
      if (!Fd(c)) return;
      ((s[i] = parseInt(c, 16).toString(16)), a++);
    }
    if (e === -1) return a !== 8 ? void 0 : Wa(s);
    if (a >= 8) return;
    let o = s.slice(0, r.length);
    for (let i = a; i < 8; i++) o.push('0');
    for (let i = r.length; i < s.length; i++) o.push(s[i]);
    return Wa(o);
  }
  function mn(t) {
    let e = t[0] === '[' && t[t.length - 1] === ']';
    if ((t[0] === '[' || t[t.length - 1] === ']') && !e) return { host: t, isIPV6: !1, error: !0 };
    let n = e ? t.slice(1, -1) : t;
    if (e && Vd(n)) return ((n = n.toLowerCase()), { host: `[${n}]`, escapedHost: n, isIPV6: !1, isIPVFuture: !0 });
    if (Gd(n, ':') < 2) return { host: t, isIPV6: !1, error: e };
    let s = '',
      a = n.indexOf('%');
    if (a !== -1) {
      let i = n.slice(a, a + 3).toLowerCase() === '%25' ? 3 : 1;
      if (((s = n.slice(a + i)), !Ld(s))) return { host: t, isIPV6: !1, error: !0 };
      n = n.slice(0, a);
    }
    let o = Hd(n);
    return o === void 0
      ? { host: t, isIPV6: !1, error: !0 }
      : { host: o + (s ? '%' + s : ''), escapedHost: o + (s ? '%25' + s : ''), isIPV6: !0 };
  }
  function Gd(t, e) {
    let r = 0;
    for (let n = 0; n < t.length; n++) t[n] === e && r++;
    return r;
  }
  function Jd(t) {
    let e = t,
      r = [],
      n = -1,
      s = 0;
    for (; (s = e.length);) {
      if (s === 1) {
        if (e === '.') break;
        if (e === '/') {
          r.push('/');
          break;
        } else {
          r.push(e);
          break;
        }
      } else if (s === 2) {
        if (e[0] === '.') {
          if (e[1] === '.') break;
          if (e[1] === '/') {
            e = e.slice(2);
            continue;
          }
        } else if (e[0] === '/' && (e[1] === '.' || e[1] === '/')) {
          r.push('/');
          break;
        }
      } else if (s === 3 && e === '/..') {
        (r.length !== 0 && r.pop(), r.push('/'));
        break;
      }
      if (e[0] === '.') {
        if (e[1] === '.') {
          if (e[2] === '/') {
            e = e.slice(3);
            continue;
          }
        } else if (e[1] === '/') {
          e = e.slice(2);
          continue;
        }
      } else if (e[0] === '/' && e[1] === '.') {
        if (e[2] === '/') {
          e = e.slice(2);
          continue;
        } else if (e[2] === '.' && e[3] === '/') {
          ((e = e.slice(3)), r.length !== 0 && r.pop());
          continue;
        }
      }
      if ((n = e.indexOf('/', 1)) === -1) {
        r.push(e);
        break;
      } else (r.push(e.slice(0, n)), (e = e.slice(n)));
    }
    return r.join('');
  }
  var Bd = { '@': '%40', '/': '%2F', '?': '%3F', '#': '%23', ':': '%3A' },
    Wd = /[@/?#:]/g,
    Zd = /[@/?#]/g;
  function Qa(t, e) {
    let r = e ? Zd : Wd;
    return ((r.lastIndex = 0), t.replace(r, n => Bd[n]));
  }
  function Ya(t, e = !1) {
    if (t.indexOf('%') === -1) return t;
    let r = '';
    for (let n = 0; n < t.length; n++) {
      if (t[n] === '%' && n + 2 < t.length) {
        let s = t.slice(n + 1, n + 3);
        if (Ae(s)) {
          let a = s.toUpperCase(),
            o = String.fromCharCode(parseInt(a, 16));
          (e && pn(o) ? (r += o) : (r += '%' + a), (n += 2));
          continue;
        }
      }
      r += t[n];
    }
    return r;
  }
  function Qd(t) {
    let e = '';
    for (let r = 0; r < t.length; r++) {
      let n = t[r];
      if (n === '%' && r + 2 < t.length) {
        let s = t.slice(r + 1, r + 3);
        if (Ae(s)) {
          let a = s.toUpperCase(),
            o = String.fromCharCode(parseInt(a, 16));
          (o !== '.' && pn(o) ? (e += o) : (e += '%' + a), (r += 2));
          continue;
        }
      }
      if (Za(n)) e += n;
      else {
        let s = t.charCodeAt(r);
        if (s < 128) e += eo(s) ? n : Z[s];
        else if (s < 55296 || s > 57343) e += L(s);
        else if (s <= 56319 && r + 1 < t.length) {
          let a = t.charCodeAt(r + 1);
          a >= 56320 && a <= 57343 ? ((e += L(65536 + ((s - 55296) << 10) + (a - 56320))), r++) : (e += L(65533));
        } else e += L(65533);
      }
    }
    return e;
  }
  function Yd(t, e = !1) {
    let r = '',
      n = e && t[0] !== '/';
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (a === '%' && s + 2 < t.length) {
        let o = t.slice(s + 1, s + 3);
        if (Ae(o)) {
          ((r += '%' + o.toUpperCase()), (s += 2));
          continue;
        }
      }
      if ((a === '/' && (n = !1), Za(a) && (a !== ':' || !n))) r += a;
      else {
        let o = t.charCodeAt(s);
        if (o < 128) r += Z[o];
        else if (o < 55296 || o > 57343) r += L(o);
        else if (o <= 56319 && s + 1 < t.length) {
          let i = t.charCodeAt(s + 1);
          i >= 56320 && i <= 57343 ? ((r += L(65536 + ((o - 55296) << 10) + (i - 56320))), s++) : (r += L(65533));
        } else r += L(65533);
      }
    }
    return r;
  }
  function gn(t, e) {
    let r = '';
    for (let n = 0; n < t.length; n++) {
      let s = t[n];
      if (s === '%' && n + 2 < t.length) {
        let a = t.slice(n + 1, n + 3);
        if (Ae(a)) {
          ((r += '%' + a.toUpperCase()), (n += 2));
          continue;
        }
      }
      if (e(s)) r += s;
      else {
        let a = t.charCodeAt(n);
        if (a < 128) r += Z[a];
        else if (a < 55296 || a > 57343) r += L(a);
        else if (a <= 56319 && n + 1 < t.length) {
          let o = t.charCodeAt(n + 1);
          o >= 56320 && o <= 57343 ? ((r += L(65536 + ((a - 55296) << 10) + (o - 56320))), n++) : (r += L(65533));
        } else r += L(65533);
      }
    }
    return r;
  }
  function Xa(t) {
    return gn(t, xd);
  }
  function Xd(t) {
    return gn(t, yn);
  }
  function el(t) {
    return gn(t, yn);
  }
  function eo(t) {
    return (
      (t >= 48 && t <= 57) ||
      (t >= 65 && t <= 90) ||
      (t >= 97 && t <= 122) ||
      t === 42 ||
      t === 43 ||
      t === 45 ||
      t === 46 ||
      t === 47 ||
      t === 64 ||
      t === 95
    );
  }
  function tl(t) {
    let e = '';
    for (let r = 0; r < t.length; r++) {
      let n = t[r];
      if (n === '%' && r + 2 < t.length) {
        let s = t.slice(r + 1, r + 3);
        if (Ae(s)) {
          let a = s.toUpperCase(),
            o = String.fromCharCode(parseInt(a, 16));
          (pn(o) ? (e += o) : (e += '%' + a), (r += 2));
          continue;
        }
      }
      if (yn(n)) e += n;
      else {
        let s = t.charCodeAt(r);
        if (s < 128) e += eo(s) ? n : Z[s];
        else if (s < 55296 || s > 57343) e += L(s);
        else if (s <= 56319 && r + 1 < t.length) {
          let a = t.charCodeAt(r + 1);
          a >= 56320 && a <= 57343 ? ((e += L(65536 + ((s - 55296) << 10) + (a - 56320))), r++) : (e += L(65533));
        } else e += L(65533);
      }
    }
    return e;
  }
  function rl(t) {
    let e = '';
    for (let r = 0; r < t.length; r++) {
      if (t[r] === '%' && r + 2 < t.length) {
        let n = t.slice(r + 1, r + 3);
        if (Ae(n)) {
          ((e += '%' + n.toUpperCase()), (r += 2));
          continue;
        }
      }
      e += escape(t[r]);
    }
    return e;
  }
  function nl(t) {
    let e = [];
    if ((t.userinfo !== void 0 && (e.push(Xa(t.userinfo)), e.push('@')), t.host !== void 0)) {
      let r = t.host;
      if (!hn(r)) {
        let n = mn(r);
        (n.isIPV6 !== !0 && n.isIPVFuture !== !0 && ((r = Ya(r, !0)), (n = mn(r))),
          n.isIPV6 === !0 || n.isIPVFuture === !0 ? (r = `[${n.escapedHost}]`) : (r = Qa(r, !1)));
      }
      e.push(r);
    }
    return (
      (typeof t.port == 'number' || typeof t.port == 'string') && (e.push(':'), e.push(String(t.port))),
      e.length ? e.join('') : void 0
    );
  }
  to.exports = {
    nonSimpleDomain: Kd,
    recomposeAuthority: nl,
    reescapeHostDelimiters: Qa,
    normalizePercentEncoding: Ya,
    normalizePathEncoding: Qd,
    serializePathEncoding: Yd,
    normalizeQueryFragmentEncoding: tl,
    encodeUserinfo: Xa,
    encodeQuery: Xd,
    encodeFragment: el,
    escapePreservingEscapes: rl,
    removeDotSegments: Jd,
    isIPv4: hn,
    isUUID: Dd,
    normalizeIPv6: mn,
    stringArrayToHexStripped: zd,
  };
});
var oo = y(($0, ao) => {
  'use strict';
  var { isUUID: sl } = _n(),
    al = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu,
    ol = ['http', 'https', 'ws', 'wss', 'urn', 'urn:uuid'];
  function il(t) {
    return ol.indexOf(t) !== -1;
  }
  function $n(t) {
    return t.secure === !0
      ? !0
      : t.secure === !1
        ? !1
        : t.scheme
          ? t.scheme.length === 3 &&
            (t.scheme[0] === 'w' || t.scheme[0] === 'W') &&
            (t.scheme[1] === 's' || t.scheme[1] === 'S') &&
            (t.scheme[2] === 's' || t.scheme[2] === 'S')
          : !1;
  }
  function ro(t) {
    return (t.host || (t.error = t.error || 'HTTP URIs must have a host.'), t);
  }
  function no(t) {
    let e = String(t.scheme).toLowerCase() === 'https';
    return ((t.port === (e ? 443 : 80) || t.port === '') && (t.port = void 0), t.path || (t.path = '/'), t);
  }
  function cl(t) {
    return (
      (t.secure = $n(t)),
      (t.resourceName = (t.path || '/') + (t.query ? '?' + t.query : '')),
      (t.path = void 0),
      (t.query = void 0),
      t
    );
  }
  function ul(t) {
    if (
      ((t.port === ($n(t) ? 443 : 80) || t.port === '') && (t.port = void 0),
      typeof t.secure == 'boolean' && ((t.scheme = t.secure ? 'wss' : 'ws'), (t.secure = void 0)),
      t.resourceName)
    ) {
      let e = t.resourceName.indexOf('?'),
        r = e === -1 ? t.resourceName : t.resourceName.slice(0, e);
      ((t.path = r && r !== '/' ? r : void 0),
        (t.query = e === -1 ? void 0 : t.resourceName.slice(e + 1)),
        (t.resourceName = void 0));
    }
    return ((t.fragment = void 0), t);
  }
  function dl(t, e) {
    if (!t.path) return ((t.error = 'URN can not be parsed'), t);
    let r = t.path.match(al);
    if (r && r[0] === t.path) {
      let n = e.scheme || t.scheme || 'urn';
      ((t.nid = r[1].toLowerCase()), (t.nss = r[2]));
      let s = `${n}:${e.nid || t.nid}`,
        a = vn(s);
      ((t.path = void 0), a && (t = a.parse(t, e)));
    } else t.error = t.error || 'URN can not be parsed.';
    return t;
  }
  function ll(t, e) {
    if (t.nid === void 0) throw new Error('URN without nid cannot be serialized');
    let r = e.scheme || t.scheme || 'urn',
      n = t.nid.toLowerCase(),
      s = `${r}:${e.nid || n}`,
      a = vn(s);
    a && (t = a.serialize(t, e));
    let o = t,
      i = t.nss;
    return ((o.path = `${n || e.nid}:${i}`), (e.skipEscape = !0), o);
  }
  function fl(t, e) {
    let r = t;
    return (
      (r.uuid = r.nss),
      (r.nss = void 0),
      !e.tolerant && (!r.uuid || !sl(r.uuid)) && (r.error = r.error || 'UUID is not valid.'),
      r
    );
  }
  function ml(t) {
    let e = t;
    return ((e.nss = (t.uuid || '').toLowerCase()), e);
  }
  var so = { scheme: 'http', domainHost: !0, parse: ro, serialize: no },
    hl = { scheme: 'https', domainHost: so.domainHost, parse: ro, serialize: no },
    Xt = { scheme: 'ws', domainHost: !0, parse: cl, serialize: ul },
    pl = { scheme: 'wss', domainHost: Xt.domainHost, parse: Xt.parse, serialize: Xt.serialize },
    yl = { scheme: 'urn', parse: dl, serialize: ll, skipNormalize: !0 },
    gl = { scheme: 'urn:uuid', parse: fl, serialize: ml, skipNormalize: !0 },
    er = { http: so, https: hl, ws: Xt, wss: pl, urn: yl, 'urn:uuid': gl };
  Object.setPrototypeOf(er, null);
  function vn(t) {
    return (t && (er[t] || er[t.toLowerCase()])) || void 0;
  }
  ao.exports = { wsIsSecure: $n, SCHEMES: er, isValidSchemeName: il, getSchemeHandler: vn };
});
var bo = y((v0, nr) => {
  'use strict';
  var {
      normalizeIPv6: fo,
      removeDotSegments: Pt,
      recomposeAuthority: _l,
      normalizePercentEncoding: mo,
      normalizePathEncoding: $l,
      serializePathEncoding: io,
      normalizeQueryFragmentEncoding: co,
      encodeQuery: vl,
      encodeFragment: bl,
      reescapeHostDelimiters: wl,
      isIPv4: ho,
      nonSimpleDomain: El,
    } = _n(),
    { SCHEMES: po, getSchemeHandler: bn } = oo(),
    yo = /^[A-Za-z][A-Za-z0-9+.-]*$/u,
    go = 'URI scheme is malformed.';
  function uo(t) {
    let e = unescape(String(t));
    if (!yo.test(e)) throw new TypeError(go);
    return e;
  }
  function Pl(t, e) {
    return (typeof t == 'string' ? (t = Il(t, e)) : typeof t == 'object' && (t = rr(Me(t, e), e)), t);
  }
  function Sl(t, e, r) {
    let n = r ? Object.assign({ scheme: 'null' }, r) : { scheme: 'null' },
      {
        parsed: s,
        malformedAuthorityOrPort: a,
        malformedPercentEncoding: o,
        malformedSchemeSpecific: i,
        malformedHost: c,
        malformedScheme: u,
      } = tr(t, n),
      {
        parsed: d,
        malformedAuthorityOrPort: l,
        malformedPercentEncoding: p,
        malformedSchemeSpecific: m,
        malformedHost: h,
        malformedScheme: f,
      } = tr(e, n);
    if (a || l || o || p || i || m || c || h || u || f) throw new Error(s.error || d.error || 'URI is malformed.');
    let g = _o(s, d, n, !0),
      _ = bn((r && r.scheme) || g.scheme),
      v = g.host,
      j = v !== void 0 && v !== '' && (ho(v) || fo(v).isIPV6);
    $o(g, r || {}, _, j);
    let I = v && v.indexOf('%') !== -1 && !/\P{ASCII}/u.test(v);
    if (g.error && !I) throw new Error(g.error);
    return ((n.skipEscape = !0), Me(g, n));
  }
  function _o(t, e, r, n) {
    let s = {};
    return (
      n || ((t = rr(Me(t, r), r)), (e = rr(Me(e, r), r))),
      (r = r || {}),
      !r.tolerant && e.scheme
        ? ((s.scheme = e.scheme),
          (s.userinfo = e.userinfo),
          (s.host = e.host),
          (s.port = e.port),
          (s.path = Pt(e.path || '')),
          (s.query = e.query))
        : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0
            ? ((s.userinfo = e.userinfo),
              (s.host = e.host),
              (s.port = e.port),
              (s.path = Pt(e.path || '')),
              (s.query = e.query))
            : (e.path
                ? (e.path[0] === '/'
                    ? (s.path = Pt(e.path))
                    : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path
                        ? (s.path = '/' + e.path)
                        : t.path
                          ? (s.path = t.path.slice(0, t.path.lastIndexOf('/') + 1) + e.path)
                          : (s.path = e.path),
                      (s.path = Pt(s.path))),
                  (s.query = e.query))
                : ((s.path = t.path), e.query !== void 0 ? (s.query = e.query) : (s.query = t.query)),
              (s.userinfo = t.userinfo),
              (s.host = t.host),
              (s.port = t.port)),
          (s.scheme = t.scheme)),
      (s.fragment = e.fragment),
      s
    );
  }
  function jl(t, e, r) {
    let n = lo(t, r),
      s = lo(e, r);
    return n !== void 0 && s !== void 0 && n === s;
  }
  function Me(t, e) {
    let r = {
        host: t.host,
        scheme: t.scheme,
        userinfo: t.userinfo,
        port: t.port,
        path: t.path,
        query: t.query,
        nid: t.nid,
        nss: t.nss,
        uuid: t.uuid,
        fragment: t.fragment,
        reference: t.reference,
        resourceName: t.resourceName,
        secure: t.secure,
        error: '',
      },
      n = Object.assign({}, e),
      s = [];
    r.scheme && (r.scheme = uo(r.scheme));
    let a = bn(n.scheme || r.scheme);
    a && a.serialize && a.serialize(r, n);
    let o = r.userinfo !== void 0 || r.host !== void 0 || r.port !== void 0,
      i = !n.skipEscape && r.scheme === void 0 && !o;
    (r.path !== void 0 && (n.skipEscape ? (r.path = mo(r.path)) : (r.path = io(r.path, i))),
      n.reference !== 'suffix' && r.scheme && ((r.scheme = uo(r.scheme)), s.push(r.scheme, ':')));
    let c = _l(r);
    if (
      (c !== void 0 &&
        (n.reference !== 'suffix' && s.push('//'), s.push(c), r.path && r.path[0] !== '/' && s.push('/')),
      r.path !== void 0)
    ) {
      let u = r.path;
      (!n.absolutePath && (!a || !a.absolutePath) && (u = Pt(u)),
        i && (u = io(u, !0)),
        c === void 0 && u[0] === '/' && u[1] === '/' && (u = '/%2F' + u.slice(2)),
        s.push(u));
    }
    return (
      r.query !== void 0 && s.push('?', vl(r.query)),
      r.fragment !== void 0 && s.push('#', bl(r.fragment)),
      s.join('')
    );
  }
  var Ol =
      /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u,
    ql = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/,
    Nl = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
  function kl(t, e) {
    if (e[2] !== void 0 && t.path && t.path[0] !== '/')
      return 'URI path must start with "/" when authority is present.';
    if (typeof t.port == 'number' && (t.port < 0 || t.port > 65535)) return 'URI port is malformed.';
  }
  function Et(t) {
    if (t === void 0) return !1;
    let e = t.indexOf('%');
    for (; e !== -1;) {
      if (e + 2 >= t.length || !/^[\da-f]{2}$/iu.test(t.slice(e + 1, e + 3))) return !0;
      e = t.indexOf('%', e + 3);
    }
    return !1;
  }
  function Rl(t) {
    let e = t[4];
    return (
      Et(t[3]) ||
      (e !== void 0 && !(e[0] === '[' && e[e.length - 1] === ']') && Et(e)) ||
      Et(t[6]) ||
      Et(t[7]) ||
      Et(t[8])
    );
  }
  function $o(t, e, r, n) {
    if (
      !e.unicodeSupport &&
      (!r || !r.unicodeSupport) &&
      t.host &&
      t.host[0] !== '[' &&
      (e.domainHost || (r && r.domainHost)) &&
      n === !1 &&
      El(t.host)
    )
      try {
        t.host = new URL('http://' + t.host).hostname;
      } catch (s) {
        return ((t.error = t.error || "Host's domain name can not be converted to ASCII: " + s), !0);
      }
    return !1;
  }
  function tr(t, e) {
    let r = Object.assign({}, e),
      n = { scheme: void 0, userinfo: void 0, host: '', port: void 0, path: '', query: void 0, fragment: void 0 },
      s = !1,
      a = !1,
      o = !1,
      i = !1,
      c = !1,
      u = !1,
      d = !1;
    r.reference === 'suffix' && (r.scheme ? (t = r.scheme + ':' + t) : (t = '//' + t));
    let l = t.match(ql);
    l !== null &&
      l[1].indexOf('\\') !== -1 &&
      ((n.error = 'URI authority must not contain a literal backslash.'), (s = !0));
    let p = t.match(Nl);
    if (p !== null) {
      let h = p[1],
        f = h.replace(/[\t\n\r]/g, '');
      f.length >= 2 &&
        (f.slice(0, 2) !== '//'
          ? ((n.error = n.error || 'URI authority must not contain a literal backslash.'), (s = !0))
          : h.length !== f.length &&
            ((n.error = n.error || 'URI authority introducer must not contain whitespace.'), (s = !0)));
    }
    let m = t.match(Ol);
    if (m) {
      if (
        ((n.scheme = m[1]),
        (n.userinfo = m[3]),
        (n.host = m[4]),
        (n.port = parseInt(m[5], 10)),
        (n.path = m[6] || ''),
        (n.query = m[7]),
        (n.fragment = m[8]),
        n.scheme !== void 0)
      ) {
        let g = unescape(n.scheme);
        yo.test(g) ? (n.scheme = g.toLowerCase()) : ((n.error = n.error || go), (u = !0));
      }
      ((a = Rl(m)),
        a && (n.error = n.error || 'URI contains malformed percent-encoding.'),
        isNaN(n.port) && (n.port = m[5]));
      let h = kl(n, m);
      if ((h !== void 0 && ((n.error = n.error || h), (s = !0)), n.host))
        if (ho(n.host) === !1) {
          let _ = n.host[0] === '[' && n.host[n.host.length - 1] === ']',
            v = fo(n.host);
          ((d = v.isIPV6 || v.isIPVFuture === !0),
            (c = _ && v.error === !0),
            (n.host = d ? v.host : v.host.toLowerCase()),
            c && ((n.error = n.error || 'URI host is malformed.'), (s = !0)));
        } else d = !0;
      (n.scheme === void 0 &&
      n.userinfo === void 0 &&
      n.host === void 0 &&
      n.port === void 0 &&
      n.query === void 0 &&
      !n.path
        ? (n.reference = 'same-document')
        : n.scheme === void 0
          ? (n.reference = 'relative')
          : n.fragment === void 0
            ? (n.reference = 'absolute')
            : (n.reference = 'uri'),
        r.reference &&
          r.reference !== 'suffix' &&
          r.reference !== n.reference &&
          (n.error = n.error || 'URI is not a ' + r.reference + ' reference.'));
      let f = bn(r.scheme || n.scheme);
      if (((i = $o(n, r, f, d)), !f || (f && !f.skipNormalize))) {
        if (t.indexOf('%') !== -1 && n.host !== void 0 && !c) {
          let g = d ? n.host : mo(n.host, !0);
          n.host = wl(g, d);
        }
        (n.path && (n.path = $l(n.path)),
          n.query && (n.query = co(n.query)),
          n.fragment && (n.fragment = co(n.fragment)));
      }
      f && f.parse && (f.parse(n, r), f === po.urn && n.nid === void 0 && (o = !0));
    } else n.error = n.error || 'URI can not be parsed.';
    return {
      parsed: n,
      malformedAuthorityOrPort: s,
      malformedPercentEncoding: a,
      malformedSchemeSpecific: o,
      malformedHost: i,
      malformedScheme: u,
    };
  }
  function rr(t, e) {
    return tr(t, e).parsed;
  }
  function Il(t, e) {
    return vo(t, e).normalized;
  }
  function vo(t, e) {
    let {
      parsed: r,
      malformedAuthorityOrPort: n,
      malformedPercentEncoding: s,
      malformedSchemeSpecific: a,
      malformedHost: o,
      malformedScheme: i,
    } = tr(t, e);
    return {
      normalized: n || s || a || o || i ? t : Me(r, e),
      malformedAuthorityOrPort: n,
      malformedPercentEncoding: s,
      malformedSchemeSpecific: a,
      malformedHost: o,
      malformedScheme: i,
    };
  }
  function lo(t, e) {
    if (typeof t != 'string' && typeof t != 'object') return;
    let r;
    try {
      r = typeof t == 'string' ? t : Me(t, e);
    } catch {
      return;
    }
    let {
      normalized: n,
      malformedAuthorityOrPort: s,
      malformedPercentEncoding: a,
      malformedSchemeSpecific: o,
      malformedHost: i,
      malformedScheme: c,
    } = vo(r, e);
    return s || a || o || i || c ? void 0 : n;
  }
  var wn = { SCHEMES: po, normalize: Pl, resolve: Sl, resolveComponent: _o, equal: jl, serialize: Me, parse: rr };
  nr.exports = wn;
  nr.exports.default = wn;
  nr.exports.fastUri = wn;
});
var Eo = y(En => {
  'use strict';
  Object.defineProperty(En, '__esModule', { value: !0 });
  var wo = bo();
  wo.code = 'require("ajv/dist/runtime/uri").default';
  En.default = wo;
});
var jn = y(z => {
  'use strict';
  Object.defineProperty(z, '__esModule', { value: !0 });
  z.CodeGen = z.Name = z.nil = z.stringify = z.str = z._ = z.KeywordCxt = void 0;
  var Tl = Je();
  Object.defineProperty(z, 'KeywordCxt', {
    enumerable: !0,
    get: function () {
      return Tl.KeywordCxt;
    },
  });
  var Ze = w();
  Object.defineProperty(z, '_', {
    enumerable: !0,
    get: function () {
      return Ze._;
    },
  });
  Object.defineProperty(z, 'str', {
    enumerable: !0,
    get: function () {
      return Ze.str;
    },
  });
  Object.defineProperty(z, 'stringify', {
    enumerable: !0,
    get: function () {
      return Ze.stringify;
    },
  });
  Object.defineProperty(z, 'nil', {
    enumerable: !0,
    get: function () {
      return Ze.nil;
    },
  });
  Object.defineProperty(z, 'Name', {
    enumerable: !0,
    get: function () {
      return Ze.Name;
    },
  });
  Object.defineProperty(z, 'CodeGen', {
    enumerable: !0,
    get: function () {
      return Ze.CodeGen;
    },
  });
  var Al = bt(),
    qo = Be(),
    Ml = Gr(),
    St = wt(),
    Cl = w(),
    jt = _t(),
    sr = gt(),
    Sn = q(),
    Po = Ba(),
    Dl = Eo(),
    No = (t, e) => new RegExp(t, e);
  No.code = 'new RegExp';
  var xl = ['removeAdditional', 'useDefaults', 'coerceTypes'],
    zl = new Set([
      'validate',
      'serialize',
      'parse',
      'wrapper',
      'root',
      'schema',
      'keyword',
      'pattern',
      'formats',
      'validate$data',
      'func',
      'obj',
      'Error',
    ]),
    Fl = {
      errorDataPath: '',
      format: '`validateFormats: false` can be used instead.',
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: 'Deprecated jsPropertySyntax can be used instead.',
      extendRefs: 'Deprecated ignoreKeywordsWithRef can be used instead.',
      missingRefs: 'Pass empty schema with $id that should be ignored to ajv.addSchema.',
      processCode: 'Use option `code: {process: (code, schemaEnv: object) => string}`',
      sourceCode: 'Use option `code: {source: true}`',
      strictDefaults: 'It is default now, see option `strict`.',
      strictKeywords: 'It is default now, see option `strict`.',
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: 'Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).',
      cache: 'Map is used as cache, schema object as key.',
      serialize: 'Map is used as cache, schema object as key.',
      ajvErrors: 'It is default now.',
    },
    Vl = {
      ignoreKeywordsWithRef: '',
      jsPropertySyntax: '',
      unicode: '"minLength"/"maxLength" account for unicode characters by default.',
    },
    So = 200;
  function Ul(t) {
    var e, r, n, s, a, o, i, c, u, d, l, p, m, h, f, g, _, v, j, I, E, ce, he, wr, Er;
    let it = t.strict,
      Pr = (e = t.code) === null || e === void 0 ? void 0 : e.optimize,
      Gs = Pr === !0 || Pr === void 0 ? 1 : Pr || 0,
      Js = (n = (r = t.code) === null || r === void 0 ? void 0 : r.regExp) !== null && n !== void 0 ? n : No,
      _c = (s = t.uriResolver) !== null && s !== void 0 ? s : Dl.default;
    return {
      strictSchema: (o = (a = t.strictSchema) !== null && a !== void 0 ? a : it) !== null && o !== void 0 ? o : !0,
      strictNumbers: (c = (i = t.strictNumbers) !== null && i !== void 0 ? i : it) !== null && c !== void 0 ? c : !0,
      strictTypes: (d = (u = t.strictTypes) !== null && u !== void 0 ? u : it) !== null && d !== void 0 ? d : 'log',
      strictTuples: (p = (l = t.strictTuples) !== null && l !== void 0 ? l : it) !== null && p !== void 0 ? p : 'log',
      strictRequired: (h = (m = t.strictRequired) !== null && m !== void 0 ? m : it) !== null && h !== void 0 ? h : !1,
      code: t.code ? { ...t.code, optimize: Gs, regExp: Js } : { optimize: Gs, regExp: Js },
      loopRequired: (f = t.loopRequired) !== null && f !== void 0 ? f : So,
      loopEnum: (g = t.loopEnum) !== null && g !== void 0 ? g : So,
      meta: (_ = t.meta) !== null && _ !== void 0 ? _ : !0,
      messages: (v = t.messages) !== null && v !== void 0 ? v : !0,
      inlineRefs: (j = t.inlineRefs) !== null && j !== void 0 ? j : !0,
      schemaId: (I = t.schemaId) !== null && I !== void 0 ? I : '$id',
      addUsedSchema: (E = t.addUsedSchema) !== null && E !== void 0 ? E : !0,
      validateSchema: (ce = t.validateSchema) !== null && ce !== void 0 ? ce : !0,
      validateFormats: (he = t.validateFormats) !== null && he !== void 0 ? he : !0,
      unicodeRegExp: (wr = t.unicodeRegExp) !== null && wr !== void 0 ? wr : !0,
      int32range: (Er = t.int32range) !== null && Er !== void 0 ? Er : !0,
      uriResolver: _c,
    };
  }
  var Ot = class {
    constructor(e = {}) {
      ((this.schemas = {}),
        (this.refs = {}),
        (this.formats = Object.create(null)),
        (this._compilations = new Set()),
        (this._loading = {}),
        (this._cache = new Map()),
        (e = this.opts = { ...e, ...Ul(e) }));
      let { es5: r, lines: n } = this.opts.code;
      ((this.scope = new Cl.ValueScope({ scope: {}, prefixes: zl, es5: r, lines: n })), (this.logger = Bl(e.logger)));
      let s = e.validateFormats;
      ((e.validateFormats = !1),
        (this.RULES = (0, Ml.getRules)()),
        jo.call(this, Fl, e, 'NOT SUPPORTED'),
        jo.call(this, Vl, e, 'DEPRECATED', 'warn'),
        (this._metaOpts = Gl.call(this)),
        e.formats && Ll.call(this),
        this._addVocabularies(),
        this._addDefaultMetaSchema(),
        e.keywords && Hl.call(this, e.keywords),
        typeof e.meta == 'object' && this.addMetaSchema(e.meta),
        Kl.call(this),
        (e.validateFormats = s));
    }
    _addVocabularies() {
      this.addKeyword('$async');
    }
    _addDefaultMetaSchema() {
      let { $data: e, meta: r, schemaId: n } = this.opts,
        s = Po;
      (n === 'id' && ((s = { ...Po }), (s.id = s.$id), delete s.$id), r && e && this.addMetaSchema(s, s[n], !1));
    }
    defaultMeta() {
      let { meta: e, schemaId: r } = this.opts;
      return (this.opts.defaultMeta = typeof e == 'object' ? e[r] || e : void 0);
    }
    validate(e, r) {
      let n;
      if (typeof e == 'string') {
        if (((n = this.getSchema(e)), !n)) throw new Error(`no schema with key or ref "${e}"`);
      } else n = this.compile(e);
      let s = n(r);
      return ('$async' in n || (this.errors = n.errors), s);
    }
    compile(e, r) {
      let n = this._addSchema(e, r);
      return n.validate || this._compileSchemaEnv(n);
    }
    compileAsync(e, r) {
      if (typeof this.opts.loadSchema != 'function') throw new Error('options.loadSchema should be a function');
      let { loadSchema: n } = this.opts;
      return s.call(this, e, r);
      async function s(d, l) {
        await a.call(this, d.$schema);
        let p = this._addSchema(d, l);
        return p.validate || o.call(this, p);
      }
      async function a(d) {
        d && !this.getSchema(d) && (await s.call(this, { $ref: d }, !0));
      }
      async function o(d) {
        try {
          return this._compileSchemaEnv(d);
        } catch (l) {
          if (!(l instanceof qo.default)) throw l;
          return (i.call(this, l), await c.call(this, l.missingSchema), o.call(this, d));
        }
      }
      function i({ missingSchema: d, missingRef: l }) {
        if (this.refs[d]) throw new Error(`AnySchema ${d} is loaded but ${l} cannot be resolved`);
      }
      async function c(d) {
        let l = await u.call(this, d);
        (this.refs[d] || (await a.call(this, l.$schema)), this.refs[d] || this.addSchema(l, d, r));
      }
      async function u(d) {
        let l = this._loading[d];
        if (l) return l;
        try {
          return await (this._loading[d] = n(d));
        } finally {
          delete this._loading[d];
        }
      }
    }
    addSchema(e, r, n, s = this.opts.validateSchema) {
      if (Array.isArray(e)) {
        for (let o of e) this.addSchema(o, void 0, n, s);
        return this;
      }
      let a;
      if (typeof e == 'object') {
        let { schemaId: o } = this.opts;
        if (((a = e[o]), a !== void 0 && typeof a != 'string')) throw new Error(`schema ${o} must be string`);
      }
      return (
        (r = (0, jt.normalizeId)(r || a)),
        this._checkUnique(r),
        (this.schemas[r] = this._addSchema(e, n, r, s, !0)),
        this
      );
    }
    addMetaSchema(e, r, n = this.opts.validateSchema) {
      return (this.addSchema(e, r, !0, n), this);
    }
    validateSchema(e, r) {
      if (typeof e == 'boolean') return !0;
      let n;
      if (((n = e.$schema), n !== void 0 && typeof n != 'string')) throw new Error('$schema must be a string');
      if (((n = n || this.opts.defaultMeta || this.defaultMeta()), !n))
        return (this.logger.warn('meta-schema not available'), (this.errors = null), !0);
      let s = this.validate(n, e);
      if (!s && r) {
        let a = 'schema is invalid: ' + this.errorsText();
        if (this.opts.validateSchema === 'log') this.logger.error(a);
        else throw new Error(a);
      }
      return s;
    }
    getSchema(e) {
      let r;
      for (; typeof (r = Oo.call(this, e)) == 'string';) e = r;
      if (r === void 0) {
        let { schemaId: n } = this.opts,
          s = new St.SchemaEnv({ schema: {}, schemaId: n });
        if (((r = St.resolveSchema.call(this, s, e)), !r)) return;
        this.refs[e] = r;
      }
      return r.validate || this._compileSchemaEnv(r);
    }
    removeSchema(e) {
      if (e instanceof RegExp)
        return (this._removeAllSchemas(this.schemas, e), this._removeAllSchemas(this.refs, e), this);
      switch (typeof e) {
        case 'undefined':
          return (this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this);
        case 'string': {
          let r = Oo.call(this, e);
          return (
            typeof r == 'object' && this._cache.delete(r.schema),
            delete this.schemas[e],
            delete this.refs[e],
            this
          );
        }
        case 'object': {
          let r = e;
          this._cache.delete(r);
          let n = e[this.opts.schemaId];
          return (n && ((n = (0, jt.normalizeId)(n)), delete this.schemas[n], delete this.refs[n]), this);
        }
        default:
          throw new Error('ajv.removeSchema: invalid parameter');
      }
    }
    addVocabulary(e) {
      for (let r of e) this.addKeyword(r);
      return this;
    }
    addKeyword(e, r) {
      let n;
      if (typeof e == 'string')
        ((n = e),
          typeof r == 'object' &&
            (this.logger.warn('these parameters are deprecated, see docs for addKeyword'), (r.keyword = n)));
      else if (typeof e == 'object' && r === void 0) {
        if (((r = e), (n = r.keyword), Array.isArray(n) && !n.length))
          throw new Error('addKeywords: keyword must be string or non-empty array');
      } else throw new Error('invalid addKeywords parameters');
      if ((Zl.call(this, n, r), !r)) return ((0, Sn.eachItem)(n, a => Pn.call(this, a)), this);
      Yl.call(this, r);
      let s = { ...r, type: (0, sr.getJSONTypes)(r.type), schemaType: (0, sr.getJSONTypes)(r.schemaType) };
      return (
        (0, Sn.eachItem)(
          n,
          s.type.length === 0 ? a => Pn.call(this, a, s) : a => s.type.forEach(o => Pn.call(this, a, s, o))
        ),
        this
      );
    }
    getKeyword(e) {
      let r = this.RULES.all[e];
      return typeof r == 'object' ? r.definition : !!r;
    }
    removeKeyword(e) {
      let { RULES: r } = this;
      (delete r.keywords[e], delete r.all[e]);
      for (let n of r.rules) {
        let s = n.rules.findIndex(a => a.keyword === e);
        s >= 0 && n.rules.splice(s, 1);
      }
      return this;
    }
    addFormat(e, r) {
      return (typeof r == 'string' && (r = new RegExp(r)), (this.formats[e] = r), this);
    }
    errorsText(e = this.errors, { separator: r = ', ', dataVar: n = 'data' } = {}) {
      return !e || e.length === 0
        ? 'No errors'
        : e.map(s => `${n}${s.instancePath} ${s.message}`).reduce((s, a) => s + r + a);
    }
    $dataMetaSchema(e, r) {
      let n = this.RULES.all;
      e = JSON.parse(JSON.stringify(e));
      for (let s of r) {
        let a = s.split('/').slice(1),
          o = e;
        for (let i of a) o = o[i];
        for (let i in n) {
          let c = n[i];
          if (typeof c != 'object') continue;
          let { $data: u } = c.definition,
            d = o[i];
          u && d && (o[i] = ko(d));
        }
      }
      return e;
    }
    _removeAllSchemas(e, r) {
      for (let n in e) {
        let s = e[n];
        (!r || r.test(n)) &&
          (typeof s == 'string' ? delete e[n] : s && !s.meta && (this._cache.delete(s.schema), delete e[n]));
      }
    }
    _addSchema(e, r, n, s = this.opts.validateSchema, a = this.opts.addUsedSchema) {
      let o,
        { schemaId: i } = this.opts;
      if (typeof e == 'object') o = e[i];
      else {
        if (this.opts.jtd) throw new Error('schema must be object');
        if (typeof e != 'boolean') throw new Error('schema must be object or boolean');
      }
      let c = this._cache.get(e);
      if (c !== void 0) return c;
      n = (0, jt.normalizeId)(o || n);
      let u = jt.getSchemaRefs.call(this, e, n);
      return (
        (c = new St.SchemaEnv({ schema: e, schemaId: i, meta: r, baseId: n, localRefs: u })),
        this._cache.set(c.schema, c),
        a && !n.startsWith('#') && (n && this._checkUnique(n), (this.refs[n] = c)),
        s && this.validateSchema(e, !0),
        c
      );
    }
    _checkUnique(e) {
      if (this.schemas[e] || this.refs[e]) throw new Error(`schema with key or id "${e}" already exists`);
    }
    _compileSchemaEnv(e) {
      if ((e.meta ? this._compileMetaSchema(e) : St.compileSchema.call(this, e), !e.validate))
        throw new Error('ajv implementation error');
      return e.validate;
    }
    _compileMetaSchema(e) {
      let r = this.opts;
      this.opts = this._metaOpts;
      try {
        St.compileSchema.call(this, e);
      } finally {
        this.opts = r;
      }
    }
  };
  Ot.ValidationError = Al.default;
  Ot.MissingRefError = qo.default;
  z.default = Ot;
  function jo(t, e, r, n = 'error') {
    for (let s in t) {
      let a = s;
      a in e && this.logger[n](`${r}: option ${s}. ${t[a]}`);
    }
  }
  function Oo(t) {
    return ((t = (0, jt.normalizeId)(t)), this.schemas[t] || this.refs[t]);
  }
  function Kl() {
    let t = this.opts.schemas;
    if (t)
      if (Array.isArray(t)) this.addSchema(t);
      else for (let e in t) this.addSchema(t[e], e);
  }
  function Ll() {
    for (let t in this.opts.formats) {
      let e = this.opts.formats[t];
      e && this.addFormat(t, e);
    }
  }
  function Hl(t) {
    if (Array.isArray(t)) {
      this.addVocabulary(t);
      return;
    }
    this.logger.warn('keywords option as map is deprecated, pass array');
    for (let e in t) {
      let r = t[e];
      (r.keyword || (r.keyword = e), this.addKeyword(r));
    }
  }
  function Gl() {
    let t = { ...this.opts };
    for (let e of xl) delete t[e];
    return t;
  }
  var Jl = { log() {}, warn() {}, error() {} };
  function Bl(t) {
    if (t === !1) return Jl;
    if (t === void 0) return console;
    if (t.log && t.warn && t.error) return t;
    throw new Error('logger must implement log, warn and error methods');
  }
  var Wl = /^[a-z_$][a-z0-9_$:-]*$/i;
  function Zl(t, e) {
    let { RULES: r } = this;
    if (
      ((0, Sn.eachItem)(t, n => {
        if (r.keywords[n]) throw new Error(`Keyword ${n} is already defined`);
        if (!Wl.test(n)) throw new Error(`Keyword ${n} has invalid name`);
      }),
      !!e && e.$data && !('code' in e || 'validate' in e))
    )
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function Pn(t, e, r) {
    var n;
    let s = e?.post;
    if (r && s) throw new Error('keyword with "post" flag cannot have "type"');
    let { RULES: a } = this,
      o = s ? a.post : a.rules.find(({ type: c }) => c === r);
    if ((o || ((o = { type: r, rules: [] }), a.rules.push(o)), (a.keywords[t] = !0), !e)) return;
    let i = {
      keyword: t,
      definition: { ...e, type: (0, sr.getJSONTypes)(e.type), schemaType: (0, sr.getJSONTypes)(e.schemaType) },
    };
    (e.before ? Ql.call(this, o, i, e.before) : o.rules.push(i),
      (a.all[t] = i),
      (n = e.implements) === null || n === void 0 || n.forEach(c => this.addKeyword(c)));
  }
  function Ql(t, e, r) {
    let n = t.rules.findIndex(s => s.keyword === r);
    n >= 0 ? t.rules.splice(n, 0, e) : (t.rules.push(e), this.logger.warn(`rule ${r} is not defined`));
  }
  function Yl(t) {
    let { metaSchema: e } = t;
    e !== void 0 && (t.$data && this.opts.$data && (e = ko(e)), (t.validateSchema = this.compile(e, !0)));
  }
  var Xl = { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' };
  function ko(t) {
    return { anyOf: [t, Xl] };
  }
});
var Ro = y(On => {
  'use strict';
  Object.defineProperty(On, '__esModule', { value: !0 });
  var ef = {
    keyword: 'id',
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    },
  };
  On.default = ef;
});
var ir = y(Ce => {
  'use strict';
  Object.defineProperty(Ce, '__esModule', { value: !0 });
  Ce.callRef = Ce.getValidate = void 0;
  var tf = Be(),
    Io = ee(),
    Q = w(),
    Qe = X(),
    To = wt(),
    ar = q(),
    rf = {
      keyword: '$ref',
      schemaType: 'string',
      code(t) {
        let { gen: e, schema: r, it: n } = t,
          { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n,
          { root: u } = a;
        if ((r === '#' || r === '#/') && s === u.baseId) return l();
        let d = To.resolveRef.call(c, u, s, r);
        if (d === void 0) throw new tf.default(n.opts.uriResolver, s, r);
        if (d instanceof To.SchemaEnv) return p(d);
        return m(d);
        function l() {
          if (a === u) return or(t, o, a, a.$async);
          let h = e.scopeValue('root', { ref: u });
          return or(t, (0, Q._)`${h}.validate`, u, u.$async);
        }
        function p(h) {
          let f = Ao(t, h);
          or(t, f, h, h.$async);
        }
        function m(h) {
          let f = e.scopeValue('schema', i.code.source === !0 ? { ref: h, code: (0, Q.stringify)(h) } : { ref: h }),
            g = e.name('valid'),
            _ = t.subschema({ schema: h, dataTypes: [], schemaPath: Q.nil, topSchemaRef: f, errSchemaPath: r }, g);
          (t.mergeEvaluated(_), t.ok(g));
        }
      },
    };
  function Ao(t, e) {
    let { gen: r } = t;
    return e.validate
      ? r.scopeValue('validate', { ref: e.validate })
      : (0, Q._)`${r.scopeValue('wrapper', { ref: e })}.validate`;
  }
  Ce.getValidate = Ao;
  function or(t, e, r, n) {
    let { gen: s, it: a } = t,
      { allErrors: o, schemaEnv: i, opts: c } = a,
      u = c.passContext ? Qe.default.this : Q.nil;
    n ? d() : l();
    function d() {
      if (!i.$async) throw new Error('async schema referenced by sync schema');
      let h = s.let('valid');
      (s.try(
        () => {
          (s.code((0, Q._)`await ${(0, Io.callValidateCode)(t, e, u)}`), m(e), o || s.assign(h, !0));
        },
        f => {
          (s.if((0, Q._)`!(${f} instanceof ${a.ValidationError})`, () => s.throw(f)), p(f), o || s.assign(h, !1));
        }
      ),
        t.ok(h));
    }
    function l() {
      t.result(
        (0, Io.callValidateCode)(t, e, u),
        () => m(e),
        () => p(e)
      );
    }
    function p(h) {
      let f = (0, Q._)`${h}.errors`;
      (s.assign(
        Qe.default.vErrors,
        (0, Q._)`${Qe.default.vErrors} === null ? ${f} : ${Qe.default.vErrors}.concat(${f})`
      ),
        s.assign(Qe.default.errors, (0, Q._)`${Qe.default.vErrors}.length`));
    }
    function m(h) {
      var f;
      if (!a.opts.unevaluated) return;
      let g = (f = r?.validate) === null || f === void 0 ? void 0 : f.evaluated;
      if (a.props !== !0)
        if (g && !g.dynamicProps) g.props !== void 0 && (a.props = ar.mergeEvaluated.props(s, g.props, a.props));
        else {
          let _ = s.var('props', (0, Q._)`${h}.evaluated.props`);
          a.props = ar.mergeEvaluated.props(s, _, a.props, Q.Name);
        }
      if (a.items !== !0)
        if (g && !g.dynamicItems) g.items !== void 0 && (a.items = ar.mergeEvaluated.items(s, g.items, a.items));
        else {
          let _ = s.var('items', (0, Q._)`${h}.evaluated.items`);
          a.items = ar.mergeEvaluated.items(s, _, a.items, Q.Name);
        }
    }
  }
  Ce.callRef = or;
  Ce.default = rf;
});
var Nn = y(qn => {
  'use strict';
  Object.defineProperty(qn, '__esModule', { value: !0 });
  var nf = Ro(),
    sf = ir(),
    af = ['$schema', '$id', '$defs', '$vocabulary', { keyword: '$comment' }, 'definitions', nf.default, sf.default];
  qn.default = af;
});
var Mo = y(kn => {
  'use strict';
  Object.defineProperty(kn, '__esModule', { value: !0 });
  var cr = w(),
    Pe = cr.operators,
    ur = {
      maximum: { okStr: '<=', ok: Pe.LTE, fail: Pe.GT },
      minimum: { okStr: '>=', ok: Pe.GTE, fail: Pe.LT },
      exclusiveMaximum: { okStr: '<', ok: Pe.LT, fail: Pe.GTE },
      exclusiveMinimum: { okStr: '>', ok: Pe.GT, fail: Pe.LTE },
    },
    of = {
      message: ({ keyword: t, schemaCode: e }) => (0, cr.str)`must be ${ur[t].okStr} ${e}`,
      params: ({ keyword: t, schemaCode: e }) => (0, cr._)`{comparison: ${ur[t].okStr}, limit: ${e}}`,
    },
    cf = {
      keyword: Object.keys(ur),
      type: 'number',
      schemaType: 'number',
      $data: !0,
      error: of,
      code(t) {
        let { keyword: e, data: r, schemaCode: n } = t;
        t.fail$data((0, cr._)`${r} ${ur[e].fail} ${n} || isNaN(${r})`);
      },
    };
  kn.default = cf;
});
var Co = y(Rn => {
  'use strict';
  Object.defineProperty(Rn, '__esModule', { value: !0 });
  var qt = w(),
    uf = {
      message: ({ schemaCode: t }) => (0, qt.str)`must be multiple of ${t}`,
      params: ({ schemaCode: t }) => (0, qt._)`{multipleOf: ${t}}`,
    },
    df = {
      keyword: 'multipleOf',
      type: 'number',
      schemaType: 'number',
      $data: !0,
      error: uf,
      code(t) {
        let { gen: e, data: r, schemaCode: n, it: s } = t,
          a = s.opts.multipleOfPrecision,
          o = e.let('res'),
          i = a ? (0, qt._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, qt._)`${o} !== parseInt(${o})`;
        t.fail$data((0, qt._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
      },
    };
  Rn.default = df;
});
var xo = y(In => {
  'use strict';
  Object.defineProperty(In, '__esModule', { value: !0 });
  function Do(t) {
    let e = t.length,
      r = 0,
      n = 0,
      s;
    for (; n < e;)
      (r++,
        (s = t.charCodeAt(n++)),
        s >= 55296 && s <= 56319 && n < e && ((s = t.charCodeAt(n)), (s & 64512) === 56320 && n++));
    return r;
  }
  In.default = Do;
  Do.code = 'require("ajv/dist/runtime/ucs2length").default';
});
var zo = y(Tn => {
  'use strict';
  Object.defineProperty(Tn, '__esModule', { value: !0 });
  var De = w(),
    lf = q(),
    ff = xo(),
    mf = {
      message({ keyword: t, schemaCode: e }) {
        let r = t === 'maxLength' ? 'more' : 'fewer';
        return (0, De.str)`must NOT have ${r} than ${e} characters`;
      },
      params: ({ schemaCode: t }) => (0, De._)`{limit: ${t}}`,
    },
    hf = {
      keyword: ['maxLength', 'minLength'],
      type: 'string',
      schemaType: 'number',
      $data: !0,
      error: mf,
      code(t) {
        let { keyword: e, data: r, schemaCode: n, it: s } = t,
          a = e === 'maxLength' ? De.operators.GT : De.operators.LT,
          o = s.opts.unicode === !1 ? (0, De._)`${r}.length` : (0, De._)`${(0, lf.useFunc)(t.gen, ff.default)}(${r})`;
        t.fail$data((0, De._)`${o} ${a} ${n}`);
      },
    };
  Tn.default = hf;
});
var Fo = y(An => {
  'use strict';
  Object.defineProperty(An, '__esModule', { value: !0 });
  var pf = ee(),
    yf = q(),
    Ye = w(),
    gf = {
      message: ({ schemaCode: t }) => (0, Ye.str)`must match pattern "${t}"`,
      params: ({ schemaCode: t }) => (0, Ye._)`{pattern: ${t}}`,
    },
    _f = {
      keyword: 'pattern',
      type: 'string',
      schemaType: 'string',
      $data: !0,
      error: gf,
      code(t) {
        let { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t,
          i = o.opts.unicodeRegExp ? 'u' : '';
        if (n) {
          let { regExp: c } = o.opts.code,
            u = c.code === 'new RegExp' ? (0, Ye._)`new RegExp` : (0, yf.useFunc)(e, c),
            d = e.let('valid');
          (e.try(
            () => e.assign(d, (0, Ye._)`${u}(${a}, ${i}).test(${r})`),
            () => e.assign(d, !1)
          ),
            t.fail$data((0, Ye._)`!${d}`));
        } else {
          let c = (0, pf.usePattern)(t, s);
          t.fail$data((0, Ye._)`!${c}.test(${r})`);
        }
      },
    };
  An.default = _f;
});
var Vo = y(Mn => {
  'use strict';
  Object.defineProperty(Mn, '__esModule', { value: !0 });
  var Nt = w(),
    $f = {
      message({ keyword: t, schemaCode: e }) {
        let r = t === 'maxProperties' ? 'more' : 'fewer';
        return (0, Nt.str)`must NOT have ${r} than ${e} properties`;
      },
      params: ({ schemaCode: t }) => (0, Nt._)`{limit: ${t}}`,
    },
    vf = {
      keyword: ['maxProperties', 'minProperties'],
      type: 'object',
      schemaType: 'number',
      $data: !0,
      error: $f,
      code(t) {
        let { keyword: e, data: r, schemaCode: n } = t,
          s = e === 'maxProperties' ? Nt.operators.GT : Nt.operators.LT;
        t.fail$data((0, Nt._)`Object.keys(${r}).length ${s} ${n}`);
      },
    };
  Mn.default = vf;
});
var Uo = y(Cn => {
  'use strict';
  Object.defineProperty(Cn, '__esModule', { value: !0 });
  var kt = ee(),
    Rt = w(),
    bf = q(),
    wf = {
      message: ({ params: { missingProperty: t } }) => (0, Rt.str)`must have required property '${t}'`,
      params: ({ params: { missingProperty: t } }) => (0, Rt._)`{missingProperty: ${t}}`,
    },
    Ef = {
      keyword: 'required',
      type: 'object',
      schemaType: 'array',
      $data: !0,
      error: wf,
      code(t) {
        let { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t,
          { opts: i } = o;
        if (!a && r.length === 0) return;
        let c = r.length >= i.loopRequired;
        if ((o.allErrors ? u() : d(), i.strictRequired)) {
          let m = t.parentSchema.properties,
            { definedProperties: h } = t.it;
          for (let f of r)
            if (m?.[f] === void 0 && !h.has(f)) {
              let g = o.schemaEnv.baseId + o.errSchemaPath,
                _ = `required property "${f}" is not defined at "${g}" (strictRequired)`;
              (0, bf.checkStrictMode)(o, _, o.opts.strictRequired);
            }
        }
        function u() {
          if (c || a) t.block$data(Rt.nil, l);
          else for (let m of r) (0, kt.checkReportMissingProp)(t, m);
        }
        function d() {
          let m = e.let('missing');
          if (c || a) {
            let h = e.let('valid', !0);
            (t.block$data(h, () => p(m, h)), t.ok(h));
          } else (e.if((0, kt.checkMissingProp)(t, r, m)), (0, kt.reportMissingProp)(t, m), e.else());
        }
        function l() {
          e.forOf('prop', n, m => {
            (t.setParams({ missingProperty: m }),
              e.if((0, kt.noPropertyInData)(e, s, m, i.ownProperties), () => t.error()));
          });
        }
        function p(m, h) {
          (t.setParams({ missingProperty: m }),
            e.forOf(
              m,
              n,
              () => {
                (e.assign(h, (0, kt.propertyInData)(e, s, m, i.ownProperties)),
                  e.if((0, Rt.not)(h), () => {
                    (t.error(), e.break());
                  }));
              },
              Rt.nil
            ));
        }
      },
    };
  Cn.default = Ef;
});
var Ko = y(Dn => {
  'use strict';
  Object.defineProperty(Dn, '__esModule', { value: !0 });
  var It = w(),
    Pf = {
      message({ keyword: t, schemaCode: e }) {
        let r = t === 'maxItems' ? 'more' : 'fewer';
        return (0, It.str)`must NOT have ${r} than ${e} items`;
      },
      params: ({ schemaCode: t }) => (0, It._)`{limit: ${t}}`,
    },
    Sf = {
      keyword: ['maxItems', 'minItems'],
      type: 'array',
      schemaType: 'number',
      $data: !0,
      error: Pf,
      code(t) {
        let { keyword: e, data: r, schemaCode: n } = t,
          s = e === 'maxItems' ? It.operators.GT : It.operators.LT;
        t.fail$data((0, It._)`${r}.length ${s} ${n}`);
      },
    };
  Dn.default = Sf;
});
var dr = y(xn => {
  'use strict';
  Object.defineProperty(xn, '__esModule', { value: !0 });
  var Lo = en();
  Lo.code = 'require("ajv/dist/runtime/equal").default';
  xn.default = Lo;
});
var Ho = y(Fn => {
  'use strict';
  Object.defineProperty(Fn, '__esModule', { value: !0 });
  var zn = gt(),
    F = w(),
    jf = q(),
    Of = dr(),
    qf = {
      message: ({ params: { i: t, j: e } }) =>
        (0, F.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
      params: ({ params: { i: t, j: e } }) => (0, F._)`{i: ${t}, j: ${e}}`,
    },
    Nf = {
      keyword: 'uniqueItems',
      type: 'array',
      schemaType: 'boolean',
      $data: !0,
      error: qf,
      code(t) {
        let { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
        if (!n && !s) return;
        let c = e.let('valid'),
          u = a.items ? (0, zn.getSchemaTypes)(a.items) : [];
        (t.block$data(c, d, (0, F._)`${o} === false`), t.ok(c));
        function d() {
          let h = e.let('i', (0, F._)`${r}.length`),
            f = e.let('j');
          (t.setParams({ i: h, j: f }), e.assign(c, !0), e.if((0, F._)`${h} > 1`, () => (l() ? p : m)(h, f)));
        }
        function l() {
          return u.length > 0 && !u.some(h => h === 'object' || h === 'array');
        }
        function p(h, f) {
          let g = e.name('item'),
            _ = (0, zn.checkDataTypes)(u, g, i.opts.strictNumbers, zn.DataType.Wrong),
            v = e.const('indices', (0, F._)`{}`);
          e.for((0, F._)`;${h}--;`, () => {
            (e.let(g, (0, F._)`${r}[${h}]`),
              e.if(_, (0, F._)`continue`),
              u.length > 1 && e.if((0, F._)`typeof ${g} == "string"`, (0, F._)`${g} += "_"`),
              e
                .if((0, F._)`typeof ${v}[${g}] == "number"`, () => {
                  (e.assign(f, (0, F._)`${v}[${g}]`), t.error(), e.assign(c, !1).break());
                })
                .code((0, F._)`${v}[${g}] = ${h}`));
          });
        }
        function m(h, f) {
          let g = (0, jf.useFunc)(e, Of.default),
            _ = e.name('outer');
          e.label(_).for((0, F._)`;${h}--;`, () =>
            e.for((0, F._)`${f} = ${h}; ${f}--;`, () =>
              e.if((0, F._)`${g}(${r}[${h}], ${r}[${f}])`, () => {
                (t.error(), e.assign(c, !1).break(_));
              })
            )
          );
        }
      },
    };
  Fn.default = Nf;
});
var Go = y(Un => {
  'use strict';
  Object.defineProperty(Un, '__esModule', { value: !0 });
  var Vn = w(),
    kf = q(),
    Rf = dr(),
    If = { message: 'must be equal to constant', params: ({ schemaCode: t }) => (0, Vn._)`{allowedValue: ${t}}` },
    Tf = {
      keyword: 'const',
      $data: !0,
      error: If,
      code(t) {
        let { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
        n || (a && typeof a == 'object')
          ? t.fail$data((0, Vn._)`!${(0, kf.useFunc)(e, Rf.default)}(${r}, ${s})`)
          : t.fail((0, Vn._)`${a} !== ${r}`);
      },
    };
  Un.default = Tf;
});
var Jo = y(Kn => {
  'use strict';
  Object.defineProperty(Kn, '__esModule', { value: !0 });
  var Tt = w(),
    Af = q(),
    Mf = dr(),
    Cf = {
      message: 'must be equal to one of the allowed values',
      params: ({ schemaCode: t }) => (0, Tt._)`{allowedValues: ${t}}`,
    },
    Df = {
      keyword: 'enum',
      schemaType: 'array',
      $data: !0,
      error: Cf,
      code(t) {
        let { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
        if (!n && s.length === 0) throw new Error('enum must have non-empty array');
        let i = s.length >= o.opts.loopEnum,
          c,
          u = () => c ?? (c = (0, Af.useFunc)(e, Mf.default)),
          d;
        if (i || n) ((d = e.let('valid')), t.block$data(d, l));
        else {
          if (!Array.isArray(s)) throw new Error('ajv implementation error');
          let m = e.const('vSchema', a);
          d = (0, Tt.or)(...s.map((h, f) => p(m, f)));
        }
        t.pass(d);
        function l() {
          (e.assign(d, !1), e.forOf('v', a, m => e.if((0, Tt._)`${u()}(${r}, ${m})`, () => e.assign(d, !0).break())));
        }
        function p(m, h) {
          let f = s[h];
          return typeof f == 'object' && f !== null ? (0, Tt._)`${u()}(${r}, ${m}[${h}])` : (0, Tt._)`${r} === ${f}`;
        }
      },
    };
  Kn.default = Df;
});
var Hn = y(Ln => {
  'use strict';
  Object.defineProperty(Ln, '__esModule', { value: !0 });
  var xf = Mo(),
    zf = Co(),
    Ff = zo(),
    Vf = Fo(),
    Uf = Vo(),
    Kf = Uo(),
    Lf = Ko(),
    Hf = Ho(),
    Gf = Go(),
    Jf = Jo(),
    Bf = [
      xf.default,
      zf.default,
      Ff.default,
      Vf.default,
      Uf.default,
      Kf.default,
      Lf.default,
      Hf.default,
      { keyword: 'type', schemaType: ['string', 'array'] },
      { keyword: 'nullable', schemaType: 'boolean' },
      Gf.default,
      Jf.default,
    ];
  Ln.default = Bf;
});
var Jn = y(At => {
  'use strict';
  Object.defineProperty(At, '__esModule', { value: !0 });
  At.validateAdditionalItems = void 0;
  var xe = w(),
    Gn = q(),
    Wf = {
      message: ({ params: { len: t } }) => (0, xe.str)`must NOT have more than ${t} items`,
      params: ({ params: { len: t } }) => (0, xe._)`{limit: ${t}}`,
    },
    Zf = {
      keyword: 'additionalItems',
      type: 'array',
      schemaType: ['boolean', 'object'],
      before: 'uniqueItems',
      error: Wf,
      code(t) {
        let { parentSchema: e, it: r } = t,
          { items: n } = e;
        if (!Array.isArray(n)) {
          (0, Gn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        Bo(t, n);
      },
    };
  function Bo(t, e) {
    let { gen: r, schema: n, data: s, keyword: a, it: o } = t;
    o.items = !0;
    let i = r.const('len', (0, xe._)`${s}.length`);
    if (n === !1) (t.setParams({ len: e.length }), t.pass((0, xe._)`${i} <= ${e.length}`));
    else if (typeof n == 'object' && !(0, Gn.alwaysValidSchema)(o, n)) {
      let u = r.var('valid', (0, xe._)`${i} <= ${e.length}`);
      (r.if((0, xe.not)(u), () => c(u)), t.ok(u));
    }
    function c(u) {
      r.forRange('i', e.length, i, d => {
        (t.subschema({ keyword: a, dataProp: d, dataPropType: Gn.Type.Num }, u),
          o.allErrors || r.if((0, xe.not)(u), () => r.break()));
      });
    }
  }
  At.validateAdditionalItems = Bo;
  At.default = Zf;
});
var Bn = y(Mt => {
  'use strict';
  Object.defineProperty(Mt, '__esModule', { value: !0 });
  Mt.validateTuple = void 0;
  var Wo = w(),
    lr = q(),
    Qf = ee(),
    Yf = {
      keyword: 'items',
      type: 'array',
      schemaType: ['object', 'array', 'boolean'],
      before: 'uniqueItems',
      code(t) {
        let { schema: e, it: r } = t;
        if (Array.isArray(e)) return Zo(t, 'additionalItems', e);
        ((r.items = !0), !(0, lr.alwaysValidSchema)(r, e) && t.ok((0, Qf.validateArray)(t)));
      },
    };
  function Zo(t, e, r = t.schema) {
    let { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
    (d(s),
      i.opts.unevaluated && r.length && i.items !== !0 && (i.items = lr.mergeEvaluated.items(n, r.length, i.items)));
    let c = n.name('valid'),
      u = n.const('len', (0, Wo._)`${a}.length`);
    r.forEach((l, p) => {
      (0, lr.alwaysValidSchema)(i, l) ||
        (n.if((0, Wo._)`${u} > ${p}`, () => t.subschema({ keyword: o, schemaProp: p, dataProp: p }, c)), t.ok(c));
    });
    function d(l) {
      let { opts: p, errSchemaPath: m } = i,
        h = r.length,
        f = h === l.minItems && (h === l.maxItems || l[e] === !1);
      if (p.strictTuples && !f) {
        let g = `"${o}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${m}"`;
        (0, lr.checkStrictMode)(i, g, p.strictTuples);
      }
    }
  }
  Mt.validateTuple = Zo;
  Mt.default = Yf;
});
var Qo = y(Wn => {
  'use strict';
  Object.defineProperty(Wn, '__esModule', { value: !0 });
  var Xf = Bn(),
    em = {
      keyword: 'prefixItems',
      type: 'array',
      schemaType: ['array'],
      before: 'uniqueItems',
      code: t => (0, Xf.validateTuple)(t, 'items'),
    };
  Wn.default = em;
});
var Xo = y(Zn => {
  'use strict';
  Object.defineProperty(Zn, '__esModule', { value: !0 });
  var Yo = w(),
    tm = q(),
    rm = ee(),
    nm = Jn(),
    sm = {
      message: ({ params: { len: t } }) => (0, Yo.str)`must NOT have more than ${t} items`,
      params: ({ params: { len: t } }) => (0, Yo._)`{limit: ${t}}`,
    },
    am = {
      keyword: 'items',
      type: 'array',
      schemaType: ['object', 'boolean'],
      before: 'uniqueItems',
      error: sm,
      code(t) {
        let { schema: e, parentSchema: r, it: n } = t,
          { prefixItems: s } = r;
        ((n.items = !0),
          !(0, tm.alwaysValidSchema)(n, e) &&
            (s ? (0, nm.validateAdditionalItems)(t, s) : t.ok((0, rm.validateArray)(t))));
      },
    };
  Zn.default = am;
});
var ei = y(Qn => {
  'use strict';
  Object.defineProperty(Qn, '__esModule', { value: !0 });
  var re = w(),
    fr = q(),
    om = {
      message: ({ params: { min: t, max: e } }) =>
        e === void 0
          ? (0, re.str)`must contain at least ${t} valid item(s)`
          : (0, re.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
      params: ({ params: { min: t, max: e } }) =>
        e === void 0 ? (0, re._)`{minContains: ${t}}` : (0, re._)`{minContains: ${t}, maxContains: ${e}}`,
    },
    im = {
      keyword: 'contains',
      type: 'array',
      schemaType: ['object', 'boolean'],
      before: 'uniqueItems',
      trackErrors: !0,
      error: om,
      code(t) {
        let { gen: e, schema: r, parentSchema: n, data: s, it: a } = t,
          o,
          i,
          { minContains: c, maxContains: u } = n;
        a.opts.next ? ((o = c === void 0 ? 1 : c), (i = u)) : (o = 1);
        let d = e.const('len', (0, re._)`${s}.length`);
        if ((t.setParams({ min: o, max: i }), i === void 0 && o === 0)) {
          (0, fr.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
          return;
        }
        if (i !== void 0 && o > i) {
          ((0, fr.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail());
          return;
        }
        if ((0, fr.alwaysValidSchema)(a, r)) {
          let f = (0, re._)`${d} >= ${o}`;
          (i !== void 0 && (f = (0, re._)`${f} && ${d} <= ${i}`), t.pass(f));
          return;
        }
        a.items = !0;
        let l = e.name('valid');
        (i === void 0 && o === 1
          ? m(l, () => e.if(l, () => e.break()))
          : o === 0
            ? (e.let(l, !0), i !== void 0 && e.if((0, re._)`${s}.length > 0`, p))
            : (e.let(l, !1), p()),
          t.result(l, () => t.reset()));
        function p() {
          let f = e.name('_valid'),
            g = e.let('count', 0);
          m(f, () => e.if(f, () => h(g)));
        }
        function m(f, g) {
          e.forRange('i', 0, d, _ => {
            (t.subschema({ keyword: 'contains', dataProp: _, dataPropType: fr.Type.Num, compositeRule: !0 }, f), g());
          });
        }
        function h(f) {
          (e.code((0, re._)`${f}++`),
            i === void 0
              ? e.if((0, re._)`${f} >= ${o}`, () => e.assign(l, !0).break())
              : (e.if((0, re._)`${f} > ${i}`, () => e.assign(l, !1).break()),
                o === 1 ? e.assign(l, !0) : e.if((0, re._)`${f} >= ${o}`, () => e.assign(l, !0))));
        }
      },
    };
  Qn.default = im;
});
var mr = y(le => {
  'use strict';
  Object.defineProperty(le, '__esModule', { value: !0 });
  le.validateSchemaDeps = le.validatePropertyDeps = le.error = void 0;
  var Yn = w(),
    cm = q(),
    Ct = ee();
  le.error = {
    message: ({ params: { property: t, depsCount: e, deps: r } }) => {
      let n = e === 1 ? 'property' : 'properties';
      return (0, Yn.str)`must have ${n} ${r} when property ${t} is present`;
    },
    params: ({ params: { property: t, depsCount: e, deps: r, missingProperty: n } }) => (0, Yn._)`{property: ${t},
    missingProperty: ${n},
    depsCount: ${e},
    deps: ${r}}`,
  };
  var um = {
    keyword: 'dependencies',
    type: 'object',
    schemaType: 'object',
    error: le.error,
    code(t) {
      let [e, r] = dm(t);
      (ti(t, e), ri(t, r));
    },
  };
  function dm({ schema: t }) {
    let e = {},
      r = {};
    for (let n in t) {
      if (n === '__proto__') continue;
      let s = Array.isArray(t[n]) ? e : r;
      s[n] = t[n];
    }
    return [e, r];
  }
  function ti(t, e = t.schema) {
    let { gen: r, data: n, it: s } = t;
    if (Object.keys(e).length === 0) return;
    let a = r.let('missing');
    for (let o in e) {
      let i = e[o];
      if (i.length === 0) continue;
      let c = (0, Ct.propertyInData)(r, n, o, s.opts.ownProperties);
      (t.setParams({ property: o, depsCount: i.length, deps: i.join(', ') }),
        s.allErrors
          ? r.if(c, () => {
              for (let u of i) (0, Ct.checkReportMissingProp)(t, u);
            })
          : (r.if((0, Yn._)`${c} && (${(0, Ct.checkMissingProp)(t, i, a)})`),
            (0, Ct.reportMissingProp)(t, a),
            r.else()));
    }
  }
  le.validatePropertyDeps = ti;
  function ri(t, e = t.schema) {
    let { gen: r, data: n, keyword: s, it: a } = t,
      o = r.name('valid');
    for (let i in e)
      (0, cm.alwaysValidSchema)(a, e[i]) ||
        (r.if(
          (0, Ct.propertyInData)(r, n, i, a.opts.ownProperties),
          () => {
            let c = t.subschema({ keyword: s, schemaProp: i }, o);
            t.mergeValidEvaluated(c, o);
          },
          () => r.var(o, !0)
        ),
        t.ok(o));
  }
  le.validateSchemaDeps = ri;
  le.default = um;
});
var si = y(Xn => {
  'use strict';
  Object.defineProperty(Xn, '__esModule', { value: !0 });
  var ni = w(),
    lm = q(),
    fm = {
      message: 'property name must be valid',
      params: ({ params: t }) => (0, ni._)`{propertyName: ${t.propertyName}}`,
    },
    mm = {
      keyword: 'propertyNames',
      type: 'object',
      schemaType: ['object', 'boolean'],
      error: fm,
      code(t) {
        let { gen: e, schema: r, data: n, it: s } = t;
        if ((0, lm.alwaysValidSchema)(s, r)) return;
        let a = e.name('valid');
        (e.forIn('key', n, o => {
          (t.setParams({ propertyName: o }),
            t.subschema(
              { keyword: 'propertyNames', data: o, dataTypes: ['string'], propertyName: o, compositeRule: !0 },
              a
            ),
            e.if((0, ni.not)(a), () => {
              (t.error(!0), s.allErrors || e.break());
            }));
        }),
          t.ok(a));
      },
    };
  Xn.default = mm;
});
var ts = y(es => {
  'use strict';
  Object.defineProperty(es, '__esModule', { value: !0 });
  var hr = ee(),
    oe = w(),
    hm = X(),
    pr = q(),
    pm = {
      message: 'must NOT have additional properties',
      params: ({ params: t }) => (0, oe._)`{additionalProperty: ${t.additionalProperty}}`,
    },
    ym = {
      keyword: 'additionalProperties',
      type: ['object'],
      schemaType: ['boolean', 'object'],
      allowUndefined: !0,
      trackErrors: !0,
      error: pm,
      code(t) {
        let { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
        if (!a) throw new Error('ajv implementation error');
        let { allErrors: i, opts: c } = o;
        if (((o.props = !0), c.removeAdditional !== 'all' && (0, pr.alwaysValidSchema)(o, r))) return;
        let u = (0, hr.allSchemaProperties)(n.properties),
          d = (0, hr.allSchemaProperties)(n.patternProperties);
        (l(), t.ok((0, oe._)`${a} === ${hm.default.errors}`));
        function l() {
          e.forIn('key', s, g => {
            !u.length && !d.length ? h(g) : e.if(p(g), () => h(g));
          });
        }
        function p(g) {
          let _;
          if (u.length > 8) {
            let v = (0, pr.schemaRefOrVal)(o, n.properties, 'properties');
            _ = (0, hr.isOwnProperty)(e, v, g);
          } else u.length ? (_ = (0, oe.or)(...u.map(v => (0, oe._)`${g} === ${v}`))) : (_ = oe.nil);
          return (
            d.length && (_ = (0, oe.or)(_, ...d.map(v => (0, oe._)`${(0, hr.usePattern)(t, v)}.test(${g})`))),
            (0, oe.not)(_)
          );
        }
        function m(g) {
          e.code((0, oe._)`delete ${s}[${g}]`);
        }
        function h(g) {
          if (c.removeAdditional === 'all' || (c.removeAdditional && r === !1)) {
            m(g);
            return;
          }
          if (r === !1) {
            (t.setParams({ additionalProperty: g }), t.error(), i || e.break());
            return;
          }
          if (typeof r == 'object' && !(0, pr.alwaysValidSchema)(o, r)) {
            let _ = e.name('valid');
            c.removeAdditional === 'failing'
              ? (f(g, _, !1),
                e.if((0, oe.not)(_), () => {
                  (t.reset(), m(g));
                }))
              : (f(g, _), i || e.if((0, oe.not)(_), () => e.break()));
          }
        }
        function f(g, _, v) {
          let j = { keyword: 'additionalProperties', dataProp: g, dataPropType: pr.Type.Str };
          (v === !1 && Object.assign(j, { compositeRule: !0, createErrors: !1, allErrors: !1 }), t.subschema(j, _));
        }
      },
    };
  es.default = ym;
});
var ii = y(ns => {
  'use strict';
  Object.defineProperty(ns, '__esModule', { value: !0 });
  var gm = Je(),
    ai = ee(),
    rs = q(),
    oi = ts(),
    _m = {
      keyword: 'properties',
      type: 'object',
      schemaType: 'object',
      code(t) {
        let { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
        a.opts.removeAdditional === 'all' &&
          n.additionalProperties === void 0 &&
          oi.default.code(new gm.KeywordCxt(a, oi.default, 'additionalProperties'));
        let o = (0, ai.allSchemaProperties)(r);
        for (let l of o) a.definedProperties.add(l);
        a.opts.unevaluated &&
          o.length &&
          a.props !== !0 &&
          (a.props = rs.mergeEvaluated.props(e, (0, rs.toHash)(o), a.props));
        let i = o.filter(l => !(0, rs.alwaysValidSchema)(a, r[l]));
        if (i.length === 0) return;
        let c = e.name('valid');
        for (let l of i)
          (u(l)
            ? d(l)
            : (e.if((0, ai.propertyInData)(e, s, l, a.opts.ownProperties)),
              d(l),
              a.allErrors || e.else().var(c, !0),
              e.endIf()),
            t.it.definedProperties.add(l),
            t.ok(c));
        function u(l) {
          return a.opts.useDefaults && !a.compositeRule && r[l].default !== void 0;
        }
        function d(l) {
          t.subschema({ keyword: 'properties', schemaProp: l, dataProp: l }, c);
        }
      },
    };
  ns.default = _m;
});
var li = y(ss => {
  'use strict';
  Object.defineProperty(ss, '__esModule', { value: !0 });
  var ci = ee(),
    yr = w(),
    ui = q(),
    di = q(),
    $m = {
      keyword: 'patternProperties',
      type: 'object',
      schemaType: 'object',
      code(t) {
        let { gen: e, schema: r, data: n, parentSchema: s, it: a } = t,
          { opts: o } = a,
          i = (0, ci.allSchemaProperties)(r),
          c = i.filter(f => (0, ui.alwaysValidSchema)(a, r[f]));
        if (i.length === 0 || (c.length === i.length && (!a.opts.unevaluated || a.props === !0))) return;
        let u = o.strictSchema && !o.allowMatchingProperties && s.properties,
          d = e.name('valid');
        a.props !== !0 && !(a.props instanceof yr.Name) && (a.props = (0, di.evaluatedPropsToName)(e, a.props));
        let { props: l } = a;
        p();
        function p() {
          for (let f of i) (u && m(f), a.allErrors ? h(f) : (e.var(d, !0), h(f), e.if(d)));
        }
        function m(f) {
          for (let g in u)
            new RegExp(f).test(g) &&
              (0, ui.checkStrictMode)(a, `property ${g} matches pattern ${f} (use allowMatchingProperties)`);
        }
        function h(f) {
          e.forIn('key', n, g => {
            e.if((0, yr._)`${(0, ci.usePattern)(t, f)}.test(${g})`, () => {
              let _ = c.includes(f);
              (_ ||
                t.subschema({ keyword: 'patternProperties', schemaProp: f, dataProp: g, dataPropType: di.Type.Str }, d),
                a.opts.unevaluated && l !== !0
                  ? e.assign((0, yr._)`${l}[${g}]`, !0)
                  : !_ && !a.allErrors && e.if((0, yr.not)(d), () => e.break()));
            });
          });
        }
      },
    };
  ss.default = $m;
});
var fi = y(as => {
  'use strict';
  Object.defineProperty(as, '__esModule', { value: !0 });
  var vm = q(),
    bm = {
      keyword: 'not',
      schemaType: ['object', 'boolean'],
      trackErrors: !0,
      code(t) {
        let { gen: e, schema: r, it: n } = t;
        if ((0, vm.alwaysValidSchema)(n, r)) {
          t.fail();
          return;
        }
        let s = e.name('valid');
        (t.subschema({ keyword: 'not', compositeRule: !0, createErrors: !1, allErrors: !1 }, s),
          t.failResult(
            s,
            () => t.reset(),
            () => t.error()
          ));
      },
      error: { message: 'must NOT be valid' },
    };
  as.default = bm;
});
var mi = y(os => {
  'use strict';
  Object.defineProperty(os, '__esModule', { value: !0 });
  var wm = ee(),
    Em = {
      keyword: 'anyOf',
      schemaType: 'array',
      trackErrors: !0,
      code: wm.validateUnion,
      error: { message: 'must match a schema in anyOf' },
    };
  os.default = Em;
});
var hi = y(is => {
  'use strict';
  Object.defineProperty(is, '__esModule', { value: !0 });
  var gr = w(),
    Pm = q(),
    Sm = {
      message: 'must match exactly one schema in oneOf',
      params: ({ params: t }) => (0, gr._)`{passingSchemas: ${t.passing}}`,
    },
    jm = {
      keyword: 'oneOf',
      schemaType: 'array',
      trackErrors: !0,
      error: Sm,
      code(t) {
        let { gen: e, schema: r, parentSchema: n, it: s } = t;
        if (!Array.isArray(r)) throw new Error('ajv implementation error');
        if (s.opts.discriminator && n.discriminator) return;
        let a = r,
          o = e.let('valid', !1),
          i = e.let('passing', null),
          c = e.name('_valid');
        (t.setParams({ passing: i }),
          e.block(u),
          t.result(
            o,
            () => t.reset(),
            () => t.error(!0)
          ));
        function u() {
          a.forEach((d, l) => {
            let p;
            ((0, Pm.alwaysValidSchema)(s, d)
              ? e.var(c, !0)
              : (p = t.subschema({ keyword: 'oneOf', schemaProp: l, compositeRule: !0 }, c)),
              l > 0 &&
                e
                  .if((0, gr._)`${c} && ${o}`)
                  .assign(o, !1)
                  .assign(i, (0, gr._)`[${i}, ${l}]`)
                  .else(),
              e.if(c, () => {
                (e.assign(o, !0), e.assign(i, l), p && t.mergeEvaluated(p, gr.Name));
              }));
          });
        }
      },
    };
  is.default = jm;
});
var pi = y(cs => {
  'use strict';
  Object.defineProperty(cs, '__esModule', { value: !0 });
  var Om = q(),
    qm = {
      keyword: 'allOf',
      schemaType: 'array',
      code(t) {
        let { gen: e, schema: r, it: n } = t;
        if (!Array.isArray(r)) throw new Error('ajv implementation error');
        let s = e.name('valid');
        r.forEach((a, o) => {
          if ((0, Om.alwaysValidSchema)(n, a)) return;
          let i = t.subschema({ keyword: 'allOf', schemaProp: o }, s);
          (t.ok(s), t.mergeEvaluated(i));
        });
      },
    };
  cs.default = qm;
});
var _i = y(us => {
  'use strict';
  Object.defineProperty(us, '__esModule', { value: !0 });
  var _r = w(),
    gi = q(),
    Nm = {
      message: ({ params: t }) => (0, _r.str)`must match "${t.ifClause}" schema`,
      params: ({ params: t }) => (0, _r._)`{failingKeyword: ${t.ifClause}}`,
    },
    km = {
      keyword: 'if',
      schemaType: ['object', 'boolean'],
      trackErrors: !0,
      error: Nm,
      code(t) {
        let { gen: e, parentSchema: r, it: n } = t;
        r.then === void 0 &&
          r.else === void 0 &&
          (0, gi.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
        let s = yi(n, 'then'),
          a = yi(n, 'else');
        if (!s && !a) return;
        let o = e.let('valid', !0),
          i = e.name('_valid');
        if ((c(), t.reset(), s && a)) {
          let d = e.let('ifClause');
          (t.setParams({ ifClause: d }), e.if(i, u('then', d), u('else', d)));
        } else s ? e.if(i, u('then')) : e.if((0, _r.not)(i), u('else'));
        t.pass(o, () => t.error(!0));
        function c() {
          let d = t.subschema({ keyword: 'if', compositeRule: !0, createErrors: !1, allErrors: !1 }, i);
          t.mergeEvaluated(d);
        }
        function u(d, l) {
          return () => {
            let p = t.subschema({ keyword: d }, i);
            (e.assign(o, i),
              t.mergeValidEvaluated(p, o),
              l ? e.assign(l, (0, _r._)`${d}`) : t.setParams({ ifClause: d }));
          };
        }
      },
    };
  function yi(t, e) {
    let r = t.schema[e];
    return r !== void 0 && !(0, gi.alwaysValidSchema)(t, r);
  }
  us.default = km;
});
var $i = y(ds => {
  'use strict';
  Object.defineProperty(ds, '__esModule', { value: !0 });
  var Rm = q(),
    Im = {
      keyword: ['then', 'else'],
      schemaType: ['object', 'boolean'],
      code({ keyword: t, parentSchema: e, it: r }) {
        e.if === void 0 && (0, Rm.checkStrictMode)(r, `"${t}" without "if" is ignored`);
      },
    };
  ds.default = Im;
});
var fs = y(ls => {
  'use strict';
  Object.defineProperty(ls, '__esModule', { value: !0 });
  var Tm = Jn(),
    Am = Qo(),
    Mm = Bn(),
    Cm = Xo(),
    Dm = ei(),
    xm = mr(),
    zm = si(),
    Fm = ts(),
    Vm = ii(),
    Um = li(),
    Km = fi(),
    Lm = mi(),
    Hm = hi(),
    Gm = pi(),
    Jm = _i(),
    Bm = $i();
  function Wm(t = !1) {
    let e = [
      Km.default,
      Lm.default,
      Hm.default,
      Gm.default,
      Jm.default,
      Bm.default,
      zm.default,
      Fm.default,
      xm.default,
      Vm.default,
      Um.default,
    ];
    return (t ? e.push(Am.default, Cm.default) : e.push(Tm.default, Mm.default), e.push(Dm.default), e);
  }
  ls.default = Wm;
});
var hs = y(Dt => {
  'use strict';
  Object.defineProperty(Dt, '__esModule', { value: !0 });
  Dt.dynamicAnchor = void 0;
  var ms = w(),
    Zm = X(),
    vi = wt(),
    Qm = ir(),
    Ym = { keyword: '$dynamicAnchor', schemaType: 'string', code: t => bi(t, t.schema) };
  function bi(t, e) {
    let { gen: r, it: n } = t;
    n.schemaEnv.root.dynamicAnchors[e] = !0;
    let s = (0, ms._)`${Zm.default.dynamicAnchors}${(0, ms.getProperty)(e)}`,
      a = n.errSchemaPath === '#' ? n.validateName : Xm(t);
    r.if((0, ms._)`!${s}`, () => r.assign(s, a));
  }
  Dt.dynamicAnchor = bi;
  function Xm(t) {
    let { schemaEnv: e, schema: r, self: n } = t.it,
      { root: s, baseId: a, localRefs: o, meta: i } = e.root,
      { schemaId: c } = n.opts,
      u = new vi.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: i });
    return (vi.compileSchema.call(n, u), (0, Qm.getValidate)(t, u));
  }
  Dt.default = Ym;
});
var ps = y(xt => {
  'use strict';
  Object.defineProperty(xt, '__esModule', { value: !0 });
  xt.dynamicRef = void 0;
  var wi = w(),
    eh = X(),
    Ei = ir(),
    th = { keyword: '$dynamicRef', schemaType: 'string', code: t => Pi(t, t.schema) };
  function Pi(t, e) {
    let { gen: r, keyword: n, it: s } = t;
    if (e[0] !== '#') throw new Error(`"${n}" only supports hash fragment reference`);
    let a = e.slice(1);
    if (s.allErrors) o();
    else {
      let c = r.let('valid', !1);
      (o(c), t.ok(c));
    }
    function o(c) {
      if (s.schemaEnv.root.dynamicAnchors[a]) {
        let u = r.let('_v', (0, wi._)`${eh.default.dynamicAnchors}${(0, wi.getProperty)(a)}`);
        r.if(u, i(u, c), i(s.validateName, c));
      } else i(s.validateName, c)();
    }
    function i(c, u) {
      return u
        ? () =>
            r.block(() => {
              ((0, Ei.callRef)(t, c), r.let(u, !0));
            })
        : () => (0, Ei.callRef)(t, c);
    }
  }
  xt.dynamicRef = Pi;
  xt.default = th;
});
var Si = y(ys => {
  'use strict';
  Object.defineProperty(ys, '__esModule', { value: !0 });
  var rh = hs(),
    nh = q(),
    sh = {
      keyword: '$recursiveAnchor',
      schemaType: 'boolean',
      code(t) {
        t.schema ? (0, rh.dynamicAnchor)(t, '') : (0, nh.checkStrictMode)(t.it, '$recursiveAnchor: false is ignored');
      },
    };
  ys.default = sh;
});
var ji = y(gs => {
  'use strict';
  Object.defineProperty(gs, '__esModule', { value: !0 });
  var ah = ps(),
    oh = { keyword: '$recursiveRef', schemaType: 'string', code: t => (0, ah.dynamicRef)(t, t.schema) };
  gs.default = oh;
});
var Oi = y(_s => {
  'use strict';
  Object.defineProperty(_s, '__esModule', { value: !0 });
  var ih = hs(),
    ch = ps(),
    uh = Si(),
    dh = ji(),
    lh = [ih.default, ch.default, uh.default, dh.default];
  _s.default = lh;
});
var Ni = y($s => {
  'use strict';
  Object.defineProperty($s, '__esModule', { value: !0 });
  var qi = mr(),
    fh = {
      keyword: 'dependentRequired',
      type: 'object',
      schemaType: 'object',
      error: qi.error,
      code: t => (0, qi.validatePropertyDeps)(t),
    };
  $s.default = fh;
});
var ki = y(vs => {
  'use strict';
  Object.defineProperty(vs, '__esModule', { value: !0 });
  var mh = mr(),
    hh = {
      keyword: 'dependentSchemas',
      type: 'object',
      schemaType: 'object',
      code: t => (0, mh.validateSchemaDeps)(t),
    };
  vs.default = hh;
});
var Ri = y(bs => {
  'use strict';
  Object.defineProperty(bs, '__esModule', { value: !0 });
  var ph = q(),
    yh = {
      keyword: ['maxContains', 'minContains'],
      type: 'array',
      schemaType: 'number',
      code({ keyword: t, parentSchema: e, it: r }) {
        e.contains === void 0 && (0, ph.checkStrictMode)(r, `"${t}" without "contains" is ignored`);
      },
    };
  bs.default = yh;
});
var Ii = y(ws => {
  'use strict';
  Object.defineProperty(ws, '__esModule', { value: !0 });
  var gh = Ni(),
    _h = ki(),
    $h = Ri(),
    vh = [gh.default, _h.default, $h.default];
  ws.default = vh;
});
var Ai = y(Es => {
  'use strict';
  Object.defineProperty(Es, '__esModule', { value: !0 });
  var Se = w(),
    Ti = q(),
    bh = X(),
    wh = {
      message: 'must NOT have unevaluated properties',
      params: ({ params: t }) => (0, Se._)`{unevaluatedProperty: ${t.unevaluatedProperty}}`,
    },
    Eh = {
      keyword: 'unevaluatedProperties',
      type: 'object',
      schemaType: ['boolean', 'object'],
      trackErrors: !0,
      error: wh,
      code(t) {
        let { gen: e, schema: r, data: n, errsCount: s, it: a } = t;
        if (!s) throw new Error('ajv implementation error');
        let { allErrors: o, props: i } = a;
        (i instanceof Se.Name
          ? e.if((0, Se._)`${i} !== true`, () => e.forIn('key', n, l => e.if(u(i, l), () => c(l))))
          : i !== !0 && e.forIn('key', n, l => (i === void 0 ? c(l) : e.if(d(i, l), () => c(l)))),
          (a.props = !0),
          t.ok((0, Se._)`${s} === ${bh.default.errors}`));
        function c(l) {
          if (r === !1) {
            (t.setParams({ unevaluatedProperty: l }), t.error(), o || e.break());
            return;
          }
          if (!(0, Ti.alwaysValidSchema)(a, r)) {
            let p = e.name('valid');
            (t.subschema({ keyword: 'unevaluatedProperties', dataProp: l, dataPropType: Ti.Type.Str }, p),
              o || e.if((0, Se.not)(p), () => e.break()));
          }
        }
        function u(l, p) {
          return (0, Se._)`!${l} || !${l}[${p}]`;
        }
        function d(l, p) {
          let m = [];
          for (let h in l) l[h] === !0 && m.push((0, Se._)`${p} !== ${h}`);
          return (0, Se.and)(...m);
        }
      },
    };
  Es.default = Eh;
});
var Ci = y(Ps => {
  'use strict';
  Object.defineProperty(Ps, '__esModule', { value: !0 });
  var ze = w(),
    Mi = q(),
    Ph = {
      message: ({ params: { len: t } }) => (0, ze.str)`must NOT have more than ${t} items`,
      params: ({ params: { len: t } }) => (0, ze._)`{limit: ${t}}`,
    },
    Sh = {
      keyword: 'unevaluatedItems',
      type: 'array',
      schemaType: ['boolean', 'object'],
      error: Ph,
      code(t) {
        let { gen: e, schema: r, data: n, it: s } = t,
          a = s.items || 0;
        if (a === !0) return;
        let o = e.const('len', (0, ze._)`${n}.length`);
        if (r === !1) (t.setParams({ len: a }), t.fail((0, ze._)`${o} > ${a}`));
        else if (typeof r == 'object' && !(0, Mi.alwaysValidSchema)(s, r)) {
          let c = e.var('valid', (0, ze._)`${o} <= ${a}`);
          (e.if((0, ze.not)(c), () => i(c, a)), t.ok(c));
        }
        s.items = !0;
        function i(c, u) {
          e.forRange('i', u, o, d => {
            (t.subschema({ keyword: 'unevaluatedItems', dataProp: d, dataPropType: Mi.Type.Num }, c),
              s.allErrors || e.if((0, ze.not)(c), () => e.break()));
          });
        }
      },
    };
  Ps.default = Sh;
});
var Di = y(Ss => {
  'use strict';
  Object.defineProperty(Ss, '__esModule', { value: !0 });
  var jh = Ai(),
    Oh = Ci(),
    qh = [jh.default, Oh.default];
  Ss.default = qh;
});
var xi = y(js => {
  'use strict';
  Object.defineProperty(js, '__esModule', { value: !0 });
  var x = w(),
    Nh = {
      message: ({ schemaCode: t }) => (0, x.str)`must match format "${t}"`,
      params: ({ schemaCode: t }) => (0, x._)`{format: ${t}}`,
    },
    kh = {
      keyword: 'format',
      type: ['number', 'string'],
      schemaType: 'string',
      $data: !0,
      error: Nh,
      code(t, e) {
        let { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t,
          { opts: c, errSchemaPath: u, schemaEnv: d, self: l } = i;
        if (!c.validateFormats) return;
        s ? p() : m();
        function p() {
          let h = r.scopeValue('formats', { ref: l.formats, code: c.code.formats }),
            f = r.const('fDef', (0, x._)`${h}[${o}]`),
            g = r.let('fType'),
            _ = r.let('format');
          (r.if(
            (0, x._)`typeof ${f} == "object" && !(${f} instanceof RegExp)`,
            () => r.assign(g, (0, x._)`${f}.type || "string"`).assign(_, (0, x._)`${f}.validate`),
            () => r.assign(g, (0, x._)`"string"`).assign(_, f)
          ),
            t.fail$data((0, x.or)(v(), j())));
          function v() {
            return c.strictSchema === !1 ? x.nil : (0, x._)`${o} && !${_}`;
          }
          function j() {
            let I = d.$async ? (0, x._)`(${f}.async ? await ${_}(${n}) : ${_}(${n}))` : (0, x._)`${_}(${n})`,
              E = (0, x._)`(typeof ${_} == "function" ? ${I} : ${_}.test(${n}))`;
            return (0, x._)`${_} && ${_} !== true && ${g} === ${e} && !${E}`;
          }
        }
        function m() {
          let h = l.formats[a];
          if (!h) {
            v();
            return;
          }
          if (h === !0) return;
          let [f, g, _] = j(h);
          f === e && t.pass(I());
          function v() {
            if (c.strictSchema === !1) {
              l.logger.warn(E());
              return;
            }
            throw new Error(E());
            function E() {
              return `unknown format "${a}" ignored in schema at path "${u}"`;
            }
          }
          function j(E) {
            let ce =
                E instanceof RegExp
                  ? (0, x.regexpCode)(E)
                  : c.code.formats
                    ? (0, x._)`${c.code.formats}${(0, x.getProperty)(a)}`
                    : void 0,
              he = r.scopeValue('formats', { key: a, ref: E, code: ce });
            return typeof E == 'object' && !(E instanceof RegExp)
              ? [E.type || 'string', E.validate, (0, x._)`${he}.validate`]
              : ['string', E, he];
          }
          function I() {
            if (typeof h == 'object' && !(h instanceof RegExp) && h.async) {
              if (!d.$async) throw new Error('async format in sync schema');
              return (0, x._)`await ${_}(${n})`;
            }
            return typeof g == 'function' ? (0, x._)`${_}(${n})` : (0, x._)`${_}.test(${n})`;
          }
        }
      },
    };
  js.default = kh;
});
var qs = y(Os => {
  'use strict';
  Object.defineProperty(Os, '__esModule', { value: !0 });
  var Rh = xi(),
    Ih = [Rh.default];
  Os.default = Ih;
});
var Ns = y(Xe => {
  'use strict';
  Object.defineProperty(Xe, '__esModule', { value: !0 });
  Xe.contentVocabulary = Xe.metadataVocabulary = void 0;
  Xe.metadataVocabulary = ['title', 'description', 'default', 'deprecated', 'readOnly', 'writeOnly', 'examples'];
  Xe.contentVocabulary = ['contentMediaType', 'contentEncoding', 'contentSchema'];
});
var Fi = y(ks => {
  'use strict';
  Object.defineProperty(ks, '__esModule', { value: !0 });
  var Th = Nn(),
    Ah = Hn(),
    Mh = fs(),
    Ch = Oi(),
    Dh = Ii(),
    xh = Di(),
    zh = qs(),
    zi = Ns(),
    Fh = [
      Ch.default,
      Th.default,
      Ah.default,
      (0, Mh.default)(!0),
      zh.default,
      zi.metadataVocabulary,
      zi.contentVocabulary,
      Dh.default,
      xh.default,
    ];
  ks.default = Fh;
});
var Ui = y($r => {
  'use strict';
  Object.defineProperty($r, '__esModule', { value: !0 });
  $r.DiscrError = void 0;
  var Vi;
  (function (t) {
    ((t.Tag = 'tag'), (t.Mapping = 'mapping'));
  })(Vi || ($r.DiscrError = Vi = {}));
});
var Ts = y(Is => {
  'use strict';
  Object.defineProperty(Is, '__esModule', { value: !0 });
  var et = w(),
    Rs = Ui(),
    Ki = wt(),
    Vh = Be(),
    Uh = q(),
    Kh = {
      message: ({ params: { discrError: t, tagName: e } }) =>
        t === Rs.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
      params: ({ params: { discrError: t, tag: e, tagName: r } }) =>
        (0, et._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`,
    },
    Lh = {
      keyword: 'discriminator',
      type: 'object',
      schemaType: 'object',
      error: Kh,
      code(t) {
        let { gen: e, data: r, schema: n, parentSchema: s, it: a } = t,
          { oneOf: o } = s;
        if (!a.opts.discriminator) throw new Error('discriminator: requires discriminator option');
        let i = n.propertyName;
        if (typeof i != 'string') throw new Error('discriminator: requires propertyName');
        if (n.mapping) throw new Error('discriminator: mapping is not supported');
        if (!o) throw new Error('discriminator: requires oneOf keyword');
        let c = e.let('valid', !1),
          u = e.const('tag', (0, et._)`${r}${(0, et.getProperty)(i)}`);
        (e.if(
          (0, et._)`typeof ${u} == "string"`,
          () => d(),
          () => t.error(!1, { discrError: Rs.DiscrError.Tag, tag: u, tagName: i })
        ),
          t.ok(c));
        function d() {
          let m = p();
          e.if(!1);
          for (let h in m) (e.elseIf((0, et._)`${u} === ${h}`), e.assign(c, l(m[h])));
          (e.else(), t.error(!1, { discrError: Rs.DiscrError.Mapping, tag: u, tagName: i }), e.endIf());
        }
        function l(m) {
          let h = e.name('valid'),
            f = t.subschema({ keyword: 'oneOf', schemaProp: m }, h);
          return (t.mergeEvaluated(f, et.Name), h);
        }
        function p() {
          var m;
          let h = {},
            f = _(s),
            g = !0;
          for (let I = 0; I < o.length; I++) {
            let E = o[I];
            if (E?.$ref && !(0, Uh.schemaHasRulesButRef)(E, a.self.RULES)) {
              let he = E.$ref;
              if (
                ((E = Ki.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, he)),
                E instanceof Ki.SchemaEnv && (E = E.schema),
                E === void 0)
              )
                throw new Vh.default(a.opts.uriResolver, a.baseId, he);
            }
            let ce = (m = E?.properties) === null || m === void 0 ? void 0 : m[i];
            if (typeof ce != 'object')
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
            ((g = g && (f || _(E))), v(ce, I));
          }
          if (!g) throw new Error(`discriminator: "${i}" must be required`);
          return h;
          function _({ required: I }) {
            return Array.isArray(I) && I.includes(i);
          }
          function v(I, E) {
            if (I.const) j(I.const, E);
            else if (I.enum) for (let ce of I.enum) j(ce, E);
            else throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
          }
          function j(I, E) {
            if (typeof I != 'string' || I in h) throw new Error(`discriminator: "${i}" values must be unique strings`);
            h[I] = E;
          }
        }
      },
    };
  Is.default = Lh;
});
var Li = y((vy, Hh) => {
  Hh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/schema',
    $vocabulary: {
      'https://json-schema.org/draft/2020-12/vocab/core': !0,
      'https://json-schema.org/draft/2020-12/vocab/applicator': !0,
      'https://json-schema.org/draft/2020-12/vocab/unevaluated': !0,
      'https://json-schema.org/draft/2020-12/vocab/validation': !0,
      'https://json-schema.org/draft/2020-12/vocab/meta-data': !0,
      'https://json-schema.org/draft/2020-12/vocab/format-annotation': !0,
      'https://json-schema.org/draft/2020-12/vocab/content': !0,
    },
    $dynamicAnchor: 'meta',
    title: 'Core and Validation specifications meta-schema',
    allOf: [
      { $ref: 'meta/core' },
      { $ref: 'meta/applicator' },
      { $ref: 'meta/unevaluated' },
      { $ref: 'meta/validation' },
      { $ref: 'meta/meta-data' },
      { $ref: 'meta/format-annotation' },
      { $ref: 'meta/content' },
    ],
    type: ['object', 'boolean'],
    $comment:
      'This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.',
    properties: {
      definitions: {
        $comment: '"definitions" has been replaced by "$defs".',
        type: 'object',
        additionalProperties: { $dynamicRef: '#meta' },
        deprecated: !0,
        default: {},
      },
      dependencies: {
        $comment:
          '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
        type: 'object',
        additionalProperties: { anyOf: [{ $dynamicRef: '#meta' }, { $ref: 'meta/validation#/$defs/stringArray' }] },
        deprecated: !0,
        default: {},
      },
      $recursiveAnchor: {
        $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
        $ref: 'meta/core#/$defs/anchorString',
        deprecated: !0,
      },
      $recursiveRef: {
        $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
        $ref: 'meta/core#/$defs/uriReferenceString',
        deprecated: !0,
      },
    },
  };
});
var Hi = y((by, Gh) => {
  Gh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/applicator',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/applicator': !0 },
    $dynamicAnchor: 'meta',
    title: 'Applicator vocabulary meta-schema',
    type: ['object', 'boolean'],
    properties: {
      prefixItems: { $ref: '#/$defs/schemaArray' },
      items: { $dynamicRef: '#meta' },
      contains: { $dynamicRef: '#meta' },
      additionalProperties: { $dynamicRef: '#meta' },
      properties: { type: 'object', additionalProperties: { $dynamicRef: '#meta' }, default: {} },
      patternProperties: {
        type: 'object',
        additionalProperties: { $dynamicRef: '#meta' },
        propertyNames: { format: 'regex' },
        default: {},
      },
      dependentSchemas: { type: 'object', additionalProperties: { $dynamicRef: '#meta' }, default: {} },
      propertyNames: { $dynamicRef: '#meta' },
      if: { $dynamicRef: '#meta' },
      then: { $dynamicRef: '#meta' },
      else: { $dynamicRef: '#meta' },
      allOf: { $ref: '#/$defs/schemaArray' },
      anyOf: { $ref: '#/$defs/schemaArray' },
      oneOf: { $ref: '#/$defs/schemaArray' },
      not: { $dynamicRef: '#meta' },
    },
    $defs: { schemaArray: { type: 'array', minItems: 1, items: { $dynamicRef: '#meta' } } },
  };
});
var Gi = y((wy, Jh) => {
  Jh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/unevaluated',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/unevaluated': !0 },
    $dynamicAnchor: 'meta',
    title: 'Unevaluated applicator vocabulary meta-schema',
    type: ['object', 'boolean'],
    properties: { unevaluatedItems: { $dynamicRef: '#meta' }, unevaluatedProperties: { $dynamicRef: '#meta' } },
  };
});
var Ji = y((Ey, Bh) => {
  Bh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/content',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/content': !0 },
    $dynamicAnchor: 'meta',
    title: 'Content vocabulary meta-schema',
    type: ['object', 'boolean'],
    properties: {
      contentEncoding: { type: 'string' },
      contentMediaType: { type: 'string' },
      contentSchema: { $dynamicRef: '#meta' },
    },
  };
});
var Bi = y((Py, Wh) => {
  Wh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/core',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/core': !0 },
    $dynamicAnchor: 'meta',
    title: 'Core vocabulary meta-schema',
    type: ['object', 'boolean'],
    properties: {
      $id: { $ref: '#/$defs/uriReferenceString', $comment: 'Non-empty fragments not allowed.', pattern: '^[^#]*#?$' },
      $schema: { $ref: '#/$defs/uriString' },
      $ref: { $ref: '#/$defs/uriReferenceString' },
      $anchor: { $ref: '#/$defs/anchorString' },
      $dynamicRef: { $ref: '#/$defs/uriReferenceString' },
      $dynamicAnchor: { $ref: '#/$defs/anchorString' },
      $vocabulary: {
        type: 'object',
        propertyNames: { $ref: '#/$defs/uriString' },
        additionalProperties: { type: 'boolean' },
      },
      $comment: { type: 'string' },
      $defs: { type: 'object', additionalProperties: { $dynamicRef: '#meta' } },
    },
    $defs: {
      anchorString: { type: 'string', pattern: '^[A-Za-z_][-A-Za-z0-9._]*$' },
      uriString: { type: 'string', format: 'uri' },
      uriReferenceString: { type: 'string', format: 'uri-reference' },
    },
  };
});
var Wi = y((Sy, Zh) => {
  Zh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/format-annotation',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/format-annotation': !0 },
    $dynamicAnchor: 'meta',
    title: 'Format vocabulary meta-schema for annotation results',
    type: ['object', 'boolean'],
    properties: { format: { type: 'string' } },
  };
});
var Zi = y((jy, Qh) => {
  Qh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/meta-data',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/meta-data': !0 },
    $dynamicAnchor: 'meta',
    title: 'Meta-data vocabulary meta-schema',
    type: ['object', 'boolean'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      default: !0,
      deprecated: { type: 'boolean', default: !1 },
      readOnly: { type: 'boolean', default: !1 },
      writeOnly: { type: 'boolean', default: !1 },
      examples: { type: 'array', items: !0 },
    },
  };
});
var Qi = y((Oy, Yh) => {
  Yh.exports = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://json-schema.org/draft/2020-12/meta/validation',
    $vocabulary: { 'https://json-schema.org/draft/2020-12/vocab/validation': !0 },
    $dynamicAnchor: 'meta',
    title: 'Validation vocabulary meta-schema',
    type: ['object', 'boolean'],
    properties: {
      type: {
        anyOf: [
          { $ref: '#/$defs/simpleTypes' },
          { type: 'array', items: { $ref: '#/$defs/simpleTypes' }, minItems: 1, uniqueItems: !0 },
        ],
      },
      const: !0,
      enum: { type: 'array', items: !0 },
      multipleOf: { type: 'number', exclusiveMinimum: 0 },
      maximum: { type: 'number' },
      exclusiveMaximum: { type: 'number' },
      minimum: { type: 'number' },
      exclusiveMinimum: { type: 'number' },
      maxLength: { $ref: '#/$defs/nonNegativeInteger' },
      minLength: { $ref: '#/$defs/nonNegativeIntegerDefault0' },
      pattern: { type: 'string', format: 'regex' },
      maxItems: { $ref: '#/$defs/nonNegativeInteger' },
      minItems: { $ref: '#/$defs/nonNegativeIntegerDefault0' },
      uniqueItems: { type: 'boolean', default: !1 },
      maxContains: { $ref: '#/$defs/nonNegativeInteger' },
      minContains: { $ref: '#/$defs/nonNegativeInteger', default: 1 },
      maxProperties: { $ref: '#/$defs/nonNegativeInteger' },
      minProperties: { $ref: '#/$defs/nonNegativeIntegerDefault0' },
      required: { $ref: '#/$defs/stringArray' },
      dependentRequired: { type: 'object', additionalProperties: { $ref: '#/$defs/stringArray' } },
    },
    $defs: {
      nonNegativeInteger: { type: 'integer', minimum: 0 },
      nonNegativeIntegerDefault0: { $ref: '#/$defs/nonNegativeInteger', default: 0 },
      simpleTypes: { enum: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'] },
      stringArray: { type: 'array', items: { type: 'string' }, uniqueItems: !0, default: [] },
    },
  };
});
var Yi = y(As => {
  'use strict';
  Object.defineProperty(As, '__esModule', { value: !0 });
  var Xh = Li(),
    ep = Hi(),
    tp = Gi(),
    rp = Ji(),
    np = Bi(),
    sp = Wi(),
    ap = Zi(),
    op = Qi(),
    ip = ['/properties'];
  function cp(t) {
    return ([Xh, ep, tp, rp, np, e(this, sp), ap, e(this, op)].forEach(r => this.addMetaSchema(r, void 0, !1)), this);
    function e(r, n) {
      return t ? r.$dataMetaSchema(n, ip) : n;
    }
  }
  As.default = cp;
});
var Xi = y((C, Cs) => {
  'use strict';
  Object.defineProperty(C, '__esModule', { value: !0 });
  C.MissingRefError =
    C.ValidationError =
    C.CodeGen =
    C.Name =
    C.nil =
    C.stringify =
    C.str =
    C._ =
    C.KeywordCxt =
    C.Ajv2020 =
      void 0;
  var up = jn(),
    dp = Fi(),
    lp = Ts(),
    fp = Yi(),
    Ms = 'https://json-schema.org/draft/2020-12/schema',
    tt = class extends up.default {
      constructor(e = {}) {
        super({ ...e, dynamicRef: !0, next: !0, unevaluated: !0 });
      }
      _addVocabularies() {
        (super._addVocabularies(),
          dp.default.forEach(e => this.addVocabulary(e)),
          this.opts.discriminator && this.addKeyword(lp.default));
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        let { $data: e, meta: r } = this.opts;
        r && (fp.default.call(this, e), (this.refs['http://json-schema.org/schema'] = Ms));
      }
      defaultMeta() {
        return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(Ms) ? Ms : void 0));
      }
    };
  C.Ajv2020 = tt;
  Cs.exports = C = tt;
  Cs.exports.Ajv2020 = tt;
  Object.defineProperty(C, '__esModule', { value: !0 });
  C.default = tt;
  var mp = Je();
  Object.defineProperty(C, 'KeywordCxt', {
    enumerable: !0,
    get: function () {
      return mp.KeywordCxt;
    },
  });
  var rt = w();
  Object.defineProperty(C, '_', {
    enumerable: !0,
    get: function () {
      return rt._;
    },
  });
  Object.defineProperty(C, 'str', {
    enumerable: !0,
    get: function () {
      return rt.str;
    },
  });
  Object.defineProperty(C, 'stringify', {
    enumerable: !0,
    get: function () {
      return rt.stringify;
    },
  });
  Object.defineProperty(C, 'nil', {
    enumerable: !0,
    get: function () {
      return rt.nil;
    },
  });
  Object.defineProperty(C, 'Name', {
    enumerable: !0,
    get: function () {
      return rt.Name;
    },
  });
  Object.defineProperty(C, 'CodeGen', {
    enumerable: !0,
    get: function () {
      return rt.CodeGen;
    },
  });
  var hp = bt();
  Object.defineProperty(C, 'ValidationError', {
    enumerable: !0,
    get: function () {
      return hp.default;
    },
  });
  var pp = Be();
  Object.defineProperty(C, 'MissingRefError', {
    enumerable: !0,
    get: function () {
      return pp.default;
    },
  });
});
var ic = y(me => {
  'use strict';
  Object.defineProperty(me, '__esModule', { value: !0 });
  me.formatNames = me.fastFormats = me.fullFormats = void 0;
  function fe(t, e) {
    return { validate: t, compare: e };
  }
  me.fullFormats = {
    date: fe(nc, Fs),
    time: fe(xs(!0), Vs),
    'date-time': fe(ec(!0), ac),
    'iso-time': fe(xs(), sc),
    'iso-date-time': fe(ec(), oc),
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: bp,
    'uri-reference':
      /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    'uri-template':
      /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email:
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: qp,
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    'json-pointer': /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    'json-pointer-uri-fragment': /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    'relative-json-pointer': /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    byte: wp,
    int32: { type: 'number', validate: Sp },
    int64: { type: 'number', validate: jp },
    float: { type: 'number', validate: rc },
    double: { type: 'number', validate: rc },
    password: !0,
    binary: !0,
  };
  me.fastFormats = {
    ...me.fullFormats,
    date: fe(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, Fs),
    time: fe(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, Vs),
    'date-time': fe(
      /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
      ac
    ),
    'iso-time': fe(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, sc),
    'iso-date-time': fe(
      /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
      oc
    ),
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    'uri-reference': /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    email:
      /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  };
  me.formatNames = Object.keys(me.fullFormats);
  function yp(t) {
    return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
  }
  var gp = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
    _p = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function nc(t) {
    let e = gp.exec(t);
    if (!e) return !1;
    let r = +e[1],
      n = +e[2],
      s = +e[3];
    return n >= 1 && n <= 12 && s >= 1 && s <= (n === 2 && yp(r) ? 29 : _p[n]);
  }
  function Fs(t, e) {
    if (t && e) return t > e ? 1 : t < e ? -1 : 0;
  }
  var Ds = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function xs(t) {
    return function (r) {
      let n = Ds.exec(r);
      if (!n) return !1;
      let s = +n[1],
        a = +n[2],
        o = +n[3],
        i = n[4],
        c = n[5] === '-' ? -1 : 1,
        u = +(n[6] || 0),
        d = +(n[7] || 0);
      if (u > 23 || d > 59 || (t && !i)) return !1;
      if (s <= 23 && a <= 59 && o < 60) return !0;
      let l = a - d * c,
        p = s - u * c - (l < 0 ? 1 : 0);
      return (p === 23 || p === -1) && (l === 59 || l === -1) && o < 61;
    };
  }
  function Vs(t, e) {
    if (!(t && e)) return;
    let r = new Date('2020-01-01T' + t).valueOf(),
      n = new Date('2020-01-01T' + e).valueOf();
    if (r && n) return r - n;
  }
  function sc(t, e) {
    if (!(t && e)) return;
    let r = Ds.exec(t),
      n = Ds.exec(e);
    if (r && n) return ((t = r[1] + r[2] + r[3]), (e = n[1] + n[2] + n[3]), t > e ? 1 : t < e ? -1 : 0);
  }
  var zs = /t|\s/i;
  function ec(t) {
    let e = xs(t);
    return function (n) {
      let s = n.split(zs);
      return s.length === 2 && nc(s[0]) && e(s[1]);
    };
  }
  function ac(t, e) {
    if (!(t && e)) return;
    let r = new Date(t).valueOf(),
      n = new Date(e).valueOf();
    if (r && n) return r - n;
  }
  function oc(t, e) {
    if (!(t && e)) return;
    let [r, n] = t.split(zs),
      [s, a] = e.split(zs),
      o = Fs(r, s);
    if (o !== void 0) return o || Vs(n, a);
  }
  var $p = /\/|:/,
    vp =
      /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function bp(t) {
    return $p.test(t) && vp.test(t);
  }
  var tc = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function wp(t) {
    return ((tc.lastIndex = 0), tc.test(t));
  }
  var Ep = -(2 ** 31),
    Pp = 2 ** 31 - 1;
  function Sp(t) {
    return Number.isInteger(t) && t <= Pp && t >= Ep;
  }
  function jp(t) {
    return Number.isInteger(t);
  }
  function rc() {
    return !0;
  }
  var Op = /[^\\]\\Z/;
  function qp(t) {
    if (Op.test(t)) return !1;
    try {
      return (new RegExp(t), !0);
    } catch {
      return !1;
    }
  }
});
var uc = y(Us => {
  'use strict';
  Object.defineProperty(Us, '__esModule', { value: !0 });
  var Np = Nn(),
    kp = Hn(),
    Rp = fs(),
    Ip = qs(),
    cc = Ns(),
    Tp = [Np.default, kp.default, (0, Rp.default)(), Ip.default, cc.metadataVocabulary, cc.contentVocabulary];
  Us.default = Tp;
});
var dc = y((Ry, Ap) => {
  Ap.exports = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://json-schema.org/draft-07/schema#',
    title: 'Core schema meta-schema',
    definitions: {
      schemaArray: { type: 'array', minItems: 1, items: { $ref: '#' } },
      nonNegativeInteger: { type: 'integer', minimum: 0 },
      nonNegativeIntegerDefault0: { allOf: [{ $ref: '#/definitions/nonNegativeInteger' }, { default: 0 }] },
      simpleTypes: { enum: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'] },
      stringArray: { type: 'array', items: { type: 'string' }, uniqueItems: !0, default: [] },
    },
    type: ['object', 'boolean'],
    properties: {
      $id: { type: 'string', format: 'uri-reference' },
      $schema: { type: 'string', format: 'uri' },
      $ref: { type: 'string', format: 'uri-reference' },
      $comment: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      default: !0,
      readOnly: { type: 'boolean', default: !1 },
      examples: { type: 'array', items: !0 },
      multipleOf: { type: 'number', exclusiveMinimum: 0 },
      maximum: { type: 'number' },
      exclusiveMaximum: { type: 'number' },
      minimum: { type: 'number' },
      exclusiveMinimum: { type: 'number' },
      maxLength: { $ref: '#/definitions/nonNegativeInteger' },
      minLength: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
      pattern: { type: 'string', format: 'regex' },
      additionalItems: { $ref: '#' },
      items: { anyOf: [{ $ref: '#' }, { $ref: '#/definitions/schemaArray' }], default: !0 },
      maxItems: { $ref: '#/definitions/nonNegativeInteger' },
      minItems: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
      uniqueItems: { type: 'boolean', default: !1 },
      contains: { $ref: '#' },
      maxProperties: { $ref: '#/definitions/nonNegativeInteger' },
      minProperties: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
      required: { $ref: '#/definitions/stringArray' },
      additionalProperties: { $ref: '#' },
      definitions: { type: 'object', additionalProperties: { $ref: '#' }, default: {} },
      properties: { type: 'object', additionalProperties: { $ref: '#' }, default: {} },
      patternProperties: {
        type: 'object',
        additionalProperties: { $ref: '#' },
        propertyNames: { format: 'regex' },
        default: {},
      },
      dependencies: {
        type: 'object',
        additionalProperties: { anyOf: [{ $ref: '#' }, { $ref: '#/definitions/stringArray' }] },
      },
      propertyNames: { $ref: '#' },
      const: !0,
      enum: { type: 'array', items: !0, minItems: 1, uniqueItems: !0 },
      type: {
        anyOf: [
          { $ref: '#/definitions/simpleTypes' },
          { type: 'array', items: { $ref: '#/definitions/simpleTypes' }, minItems: 1, uniqueItems: !0 },
        ],
      },
      format: { type: 'string' },
      contentMediaType: { type: 'string' },
      contentEncoding: { type: 'string' },
      if: { $ref: '#' },
      then: { $ref: '#' },
      else: { $ref: '#' },
      allOf: { $ref: '#/definitions/schemaArray' },
      anyOf: { $ref: '#/definitions/schemaArray' },
      oneOf: { $ref: '#/definitions/schemaArray' },
      not: { $ref: '#' },
    },
    default: !0,
  };
});
var fc = y((D, Ks) => {
  'use strict';
  Object.defineProperty(D, '__esModule', { value: !0 });
  D.MissingRefError =
    D.ValidationError =
    D.CodeGen =
    D.Name =
    D.nil =
    D.stringify =
    D.str =
    D._ =
    D.KeywordCxt =
    D.Ajv =
      void 0;
  var Mp = jn(),
    Cp = uc(),
    Dp = Ts(),
    lc = dc(),
    xp = ['/properties'],
    vr = 'http://json-schema.org/draft-07/schema',
    nt = class extends Mp.default {
      _addVocabularies() {
        (super._addVocabularies(),
          Cp.default.forEach(e => this.addVocabulary(e)),
          this.opts.discriminator && this.addKeyword(Dp.default));
      }
      _addDefaultMetaSchema() {
        if ((super._addDefaultMetaSchema(), !this.opts.meta)) return;
        let e = this.opts.$data ? this.$dataMetaSchema(lc, xp) : lc;
        (this.addMetaSchema(e, vr, !1), (this.refs['http://json-schema.org/schema'] = vr));
      }
      defaultMeta() {
        return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(vr) ? vr : void 0));
      }
    };
  D.Ajv = nt;
  Ks.exports = D = nt;
  Ks.exports.Ajv = nt;
  Object.defineProperty(D, '__esModule', { value: !0 });
  D.default = nt;
  var zp = Je();
  Object.defineProperty(D, 'KeywordCxt', {
    enumerable: !0,
    get: function () {
      return zp.KeywordCxt;
    },
  });
  var st = w();
  Object.defineProperty(D, '_', {
    enumerable: !0,
    get: function () {
      return st._;
    },
  });
  Object.defineProperty(D, 'str', {
    enumerable: !0,
    get: function () {
      return st.str;
    },
  });
  Object.defineProperty(D, 'stringify', {
    enumerable: !0,
    get: function () {
      return st.stringify;
    },
  });
  Object.defineProperty(D, 'nil', {
    enumerable: !0,
    get: function () {
      return st.nil;
    },
  });
  Object.defineProperty(D, 'Name', {
    enumerable: !0,
    get: function () {
      return st.Name;
    },
  });
  Object.defineProperty(D, 'CodeGen', {
    enumerable: !0,
    get: function () {
      return st.CodeGen;
    },
  });
  var Fp = bt();
  Object.defineProperty(D, 'ValidationError', {
    enumerable: !0,
    get: function () {
      return Fp.default;
    },
  });
  var Vp = Be();
  Object.defineProperty(D, 'MissingRefError', {
    enumerable: !0,
    get: function () {
      return Vp.default;
    },
  });
});
var mc = y(at => {
  'use strict';
  Object.defineProperty(at, '__esModule', { value: !0 });
  at.formatLimitDefinition = void 0;
  var Up = fc(),
    ie = w(),
    je = ie.operators,
    br = {
      formatMaximum: { okStr: '<=', ok: je.LTE, fail: je.GT },
      formatMinimum: { okStr: '>=', ok: je.GTE, fail: je.LT },
      formatExclusiveMaximum: { okStr: '<', ok: je.LT, fail: je.GTE },
      formatExclusiveMinimum: { okStr: '>', ok: je.GT, fail: je.LTE },
    },
    Kp = {
      message: ({ keyword: t, schemaCode: e }) => (0, ie.str)`should be ${br[t].okStr} ${e}`,
      params: ({ keyword: t, schemaCode: e }) => (0, ie._)`{comparison: ${br[t].okStr}, limit: ${e}}`,
    };
  at.formatLimitDefinition = {
    keyword: Object.keys(br),
    type: 'string',
    schemaType: 'string',
    $data: !0,
    error: Kp,
    code(t) {
      let { gen: e, data: r, schemaCode: n, keyword: s, it: a } = t,
        { opts: o, self: i } = a;
      if (!o.validateFormats) return;
      let c = new Up.KeywordCxt(a, i.RULES.all.format.definition, 'format');
      c.$data ? u() : d();
      function u() {
        let p = e.scopeValue('formats', { ref: i.formats, code: o.code.formats }),
          m = e.const('fmt', (0, ie._)`${p}[${c.schemaCode}]`);
        t.fail$data(
          (0, ie.or)(
            (0, ie._)`typeof ${m} != "object"`,
            (0, ie._)`${m} instanceof RegExp`,
            (0, ie._)`typeof ${m}.compare != "function"`,
            l(m)
          )
        );
      }
      function d() {
        let p = c.schema,
          m = i.formats[p];
        if (!m || m === !0) return;
        if (typeof m != 'object' || m instanceof RegExp || typeof m.compare != 'function')
          throw new Error(`"${s}": format "${p}" does not define "compare" function`);
        let h = e.scopeValue('formats', {
          key: p,
          ref: m,
          code: o.code.formats ? (0, ie._)`${o.code.formats}${(0, ie.getProperty)(p)}` : void 0,
        });
        t.fail$data(l(h));
      }
      function l(p) {
        return (0, ie._)`${p}.compare(${r}, ${n}) ${br[s].fail} 0`;
      }
    },
    dependencies: ['format'],
  };
  var Lp = t => (t.addKeyword(at.formatLimitDefinition), t);
  at.default = Lp;
});
var gc = y((zt, yc) => {
  'use strict';
  Object.defineProperty(zt, '__esModule', { value: !0 });
  var ot = ic(),
    Hp = mc(),
    Ls = w(),
    hc = new Ls.Name('fullFormats'),
    Gp = new Ls.Name('fastFormats'),
    Hs = (t, e = { keywords: !0 }) => {
      if (Array.isArray(e)) return (pc(t, e, ot.fullFormats, hc), t);
      let [r, n] = e.mode === 'fast' ? [ot.fastFormats, Gp] : [ot.fullFormats, hc],
        s = e.formats || ot.formatNames;
      return (pc(t, s, r, n), e.keywords && (0, Hp.default)(t), t);
    };
  Hs.get = (t, e = 'full') => {
    let n = (e === 'fast' ? ot.fastFormats : ot.fullFormats)[t];
    if (!n) throw new Error(`Unknown format "${t}"`);
    return n;
  };
  function pc(t, e, r, n) {
    var s, a;
    ((s = (a = t.opts.code).formats) !== null && s !== void 0) ||
      (a.formats = (0, Ls._)`require("ajv-formats/dist/formats").${n}`);
    for (let o of e) t.addFormat(o, r[o]);
  }
  yc.exports = zt = Hs;
  Object.defineProperty(zt, '__esModule', { value: !0 });
  zt.default = Hs;
});
var Jp = Ws(Xi(), 1),
  Bp = Ws(gc(), 1);
var export_Ajv2020 = Jp.default;
var export_addFormats = Bp.default;
export { export_Ajv2020 as Ajv2020, export_addFormats as addFormats };
