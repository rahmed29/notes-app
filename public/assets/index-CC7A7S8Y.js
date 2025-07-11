(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
  new MutationObserver((i) => {
    for (const a of i)
      if (a.type === "childList")
        for (const s of a.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && r(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const a = {};
    return (
      i.integrity && (a.integrity = i.integrity),
      i.referrerPolicy && (a.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (a.credentials = "include")
        : i.crossOrigin === "anonymous"
          ? (a.credentials = "omit")
          : (a.credentials = "same-origin"),
      a
    );
  }
  function r(i) {
    if (i.ep) return;
    i.ep = !0;
    const a = n(i);
    fetch(i.href, a);
  }
})();
var un = "top",
  On = "bottom",
  Bn = "right",
  cn = "left",
  m0 = "auto",
  Ta = [un, On, Bn, cn],
  Li = "start",
  ma = "end",
  tf = "clippingParents",
  bc = "viewport",
  Gi = "popper",
  nf = "reference",
  tl = Ta.reduce(function (t, e) {
    return t.concat([e + "-" + Li, e + "-" + ma]);
  }, []),
  yc = [].concat(Ta, [m0]).reduce(function (t, e) {
    return t.concat([e, e + "-" + Li, e + "-" + ma]);
  }, []),
  rf = "beforeRead",
  af = "read",
  sf = "afterRead",
  of = "beforeMain",
  lf = "main",
  uf = "afterMain",
  cf = "beforeWrite",
  df = "write",
  hf = "afterWrite",
  ff = [rf, af, sf, of, lf, uf, cf, df, hf];
function rr(t) {
  return t ? (t.nodeName || "").toLowerCase() : null;
}
function bn(t) {
  if (t == null) return window;
  if (t.toString() !== "[object Window]") {
    var e = t.ownerDocument;
    return (e && e.defaultView) || window;
  }
  return t;
}
function hi(t) {
  var e = bn(t).Element;
  return t instanceof e || t instanceof Element;
}
function Nn(t) {
  var e = bn(t).HTMLElement;
  return t instanceof e || t instanceof HTMLElement;
}
function p0(t) {
  if (typeof ShadowRoot > "u") return !1;
  var e = bn(t).ShadowRoot;
  return t instanceof e || t instanceof ShadowRoot;
}
function mf(t) {
  var e = t.state;
  Object.keys(e.elements).forEach(function (n) {
    var r = e.styles[n] || {},
      i = e.attributes[n] || {},
      a = e.elements[n];
    !Nn(a) ||
      !rr(a) ||
      (Object.assign(a.style, r),
      Object.keys(i).forEach(function (s) {
        var o = i[s];
        o === !1 ? a.removeAttribute(s) : a.setAttribute(s, o === !0 ? "" : o);
      }));
  });
}
function pf(t) {
  var e = t.state,
    n = {
      popper: {
        position: e.options.strategy,
        left: "0",
        top: "0",
        margin: "0",
      },
      arrow: { position: "absolute" },
      reference: {},
    };
  return (
    Object.assign(e.elements.popper.style, n.popper),
    (e.styles = n),
    e.elements.arrow && Object.assign(e.elements.arrow.style, n.arrow),
    function () {
      Object.keys(e.elements).forEach(function (r) {
        var i = e.elements[r],
          a = e.attributes[r] || {},
          s = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : n[r]),
          o = s.reduce(function (l, u) {
            return ((l[u] = ""), l);
          }, {});
        !Nn(i) ||
          !rr(i) ||
          (Object.assign(i.style, o),
          Object.keys(a).forEach(function (l) {
            i.removeAttribute(l);
          }));
      });
    }
  );
}
const wc = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: mf,
  effect: pf,
  requires: ["computeStyles"],
};
function tr(t) {
  return t.split("-")[0];
}
var ui = Math.max,
  As = Math.min,
  Mi = Math.round;
function Go() {
  var t = navigator.userAgentData;
  return t != null && t.brands && Array.isArray(t.brands)
    ? t.brands
        .map(function (e) {
          return e.brand + "/" + e.version;
        })
        .join(" ")
    : navigator.userAgent;
}
function xc() {
  return !/^((?!chrome|android).)*safari/i.test(Go());
}
function zi(t, e, n) {
  (e === void 0 && (e = !1), n === void 0 && (n = !1));
  var r = t.getBoundingClientRect(),
    i = 1,
    a = 1;
  e &&
    Nn(t) &&
    ((i = (t.offsetWidth > 0 && Mi(r.width) / t.offsetWidth) || 1),
    (a = (t.offsetHeight > 0 && Mi(r.height) / t.offsetHeight) || 1));
  var s = hi(t) ? bn(t) : window,
    o = s.visualViewport,
    l = !xc() && n,
    u = (r.left + (l && o ? o.offsetLeft : 0)) / i,
    h = (r.top + (l && o ? o.offsetTop : 0)) / a,
    d = r.width / i,
    p = r.height / a;
  return {
    width: d,
    height: p,
    top: h,
    right: u + d,
    bottom: h + p,
    left: u,
    x: u,
    y: h,
  };
}
function g0(t) {
  var e = zi(t),
    n = t.offsetWidth,
    r = t.offsetHeight;
  return (
    Math.abs(e.width - n) <= 1 && (n = e.width),
    Math.abs(e.height - r) <= 1 && (r = e.height),
    { x: t.offsetLeft, y: t.offsetTop, width: n, height: r }
  );
}
function kc(t, e) {
  var n = e.getRootNode && e.getRootNode();
  if (t.contains(e)) return !0;
  if (n && p0(n)) {
    var r = e;
    do {
      if (r && t.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Sr(t) {
  return bn(t).getComputedStyle(t);
}
function gf(t) {
  return ["table", "td", "th"].indexOf(rr(t)) >= 0;
}
function Jr(t) {
  return ((hi(t) ? t.ownerDocument : t.document) || window.document)
    .documentElement;
}
function js(t) {
  return rr(t) === "html"
    ? t
    : t.assignedSlot || t.parentNode || (p0(t) ? t.host : null) || Jr(t);
}
function nl(t) {
  return !Nn(t) || Sr(t).position === "fixed" ? null : t.offsetParent;
}
function vf(t) {
  var e = /firefox/i.test(Go()),
    n = /Trident/i.test(Go());
  if (n && Nn(t)) {
    var r = Sr(t);
    if (r.position === "fixed") return null;
  }
  var i = js(t);
  for (p0(i) && (i = i.host); Nn(i) && ["html", "body"].indexOf(rr(i)) < 0; ) {
    var a = Sr(i);
    if (
      a.transform !== "none" ||
      a.perspective !== "none" ||
      a.contain === "paint" ||
      ["transform", "perspective"].indexOf(a.willChange) !== -1 ||
      (e && a.willChange === "filter") ||
      (e && a.filter && a.filter !== "none")
    )
      return i;
    i = i.parentNode;
  }
  return null;
}
function Ea(t) {
  for (var e = bn(t), n = nl(t); n && gf(n) && Sr(n).position === "static"; )
    n = nl(n);
  return n &&
    (rr(n) === "html" || (rr(n) === "body" && Sr(n).position === "static"))
    ? e
    : n || vf(t) || e;
}
function v0(t) {
  return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
}
function sa(t, e, n) {
  return ui(t, As(e, n));
}
function bf(t, e, n) {
  var r = sa(t, e, n);
  return r > n ? n : r;
}
function Sc() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function Ac(t) {
  return Object.assign({}, Sc(), t);
}
function Tc(t, e) {
  return e.reduce(function (n, r) {
    return ((n[r] = t), n);
  }, {});
}
var yf = function (e, n) {
  return (
    (e =
      typeof e == "function"
        ? e(Object.assign({}, n.rects, { placement: n.placement }))
        : e),
    Ac(typeof e != "number" ? e : Tc(e, Ta))
  );
};
function wf(t) {
  var e,
    n = t.state,
    r = t.name,
    i = t.options,
    a = n.elements.arrow,
    s = n.modifiersData.popperOffsets,
    o = tr(n.placement),
    l = v0(o),
    u = [cn, Bn].indexOf(o) >= 0,
    h = u ? "height" : "width";
  if (!(!a || !s)) {
    var d = yf(i.padding, n),
      p = g0(a),
      m = l === "y" ? un : cn,
      y = l === "y" ? On : Bn,
      S =
        n.rects.reference[h] + n.rects.reference[l] - s[l] - n.rects.popper[h],
      A = s[l] - n.rects.reference[l],
      C = Ea(a),
      b = C ? (l === "y" ? C.clientHeight || 0 : C.clientWidth || 0) : 0,
      T = S / 2 - A / 2,
      v = d[m],
      E = b - p[h] - d[y],
      x = b / 2 - p[h] / 2 + T,
      _ = sa(v, x, E),
      j = l;
    n.modifiersData[r] = ((e = {}), (e[j] = _), (e.centerOffset = _ - x), e);
  }
}
function xf(t) {
  var e = t.state,
    n = t.options,
    r = n.element,
    i = r === void 0 ? "[data-popper-arrow]" : r;
  i != null &&
    ((typeof i == "string" && ((i = e.elements.popper.querySelector(i)), !i)) ||
      (kc(e.elements.popper, i) && (e.elements.arrow = i)));
}
const kf = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: wf,
  effect: xf,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function Di(t) {
  return t.split("-")[1];
}
var Sf = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function Af(t, e) {
  var n = t.x,
    r = t.y,
    i = e.devicePixelRatio || 1;
  return { x: Mi(n * i) / i || 0, y: Mi(r * i) / i || 0 };
}
function rl(t) {
  var e,
    n = t.popper,
    r = t.popperRect,
    i = t.placement,
    a = t.variation,
    s = t.offsets,
    o = t.position,
    l = t.gpuAcceleration,
    u = t.adaptive,
    h = t.roundOffsets,
    d = t.isFixed,
    p = s.x,
    m = p === void 0 ? 0 : p,
    y = s.y,
    S = y === void 0 ? 0 : y,
    A = typeof h == "function" ? h({ x: m, y: S }) : { x: m, y: S };
  ((m = A.x), (S = A.y));
  var C = s.hasOwnProperty("x"),
    b = s.hasOwnProperty("y"),
    T = cn,
    v = un,
    E = window;
  if (u) {
    var x = Ea(n),
      _ = "clientHeight",
      j = "clientWidth";
    if (
      (x === bn(n) &&
        ((x = Jr(n)),
        Sr(x).position !== "static" &&
          o === "absolute" &&
          ((_ = "scrollHeight"), (j = "scrollWidth"))),
      (x = x),
      i === un || ((i === cn || i === Bn) && a === ma))
    ) {
      v = On;
      var F = d && x === E && E.visualViewport ? E.visualViewport.height : x[_];
      ((S -= F - r.height), (S *= l ? 1 : -1));
    }
    if (i === cn || ((i === un || i === On) && a === ma)) {
      T = Bn;
      var O = d && x === E && E.visualViewport ? E.visualViewport.width : x[j];
      ((m -= O - r.width), (m *= l ? 1 : -1));
    }
  }
  var $ = Object.assign({ position: o }, u && Sf),
    G = h === !0 ? Af({ x: m, y: S }, bn(n)) : { x: m, y: S };
  if (((m = G.x), (S = G.y), l)) {
    var K;
    return Object.assign(
      {},
      $,
      ((K = {}),
      (K[v] = b ? "0" : ""),
      (K[T] = C ? "0" : ""),
      (K.transform =
        (E.devicePixelRatio || 1) <= 1
          ? "translate(" + m + "px, " + S + "px)"
          : "translate3d(" + m + "px, " + S + "px, 0)"),
      K),
    );
  }
  return Object.assign(
    {},
    $,
    ((e = {}),
    (e[v] = b ? S + "px" : ""),
    (e[T] = C ? m + "px" : ""),
    (e.transform = ""),
    e),
  );
}
function Tf(t) {
  var e = t.state,
    n = t.options,
    r = n.gpuAcceleration,
    i = r === void 0 ? !0 : r,
    a = n.adaptive,
    s = a === void 0 ? !0 : a,
    o = n.roundOffsets,
    l = o === void 0 ? !0 : o,
    u = {
      placement: tr(e.placement),
      variation: Di(e.placement),
      popper: e.elements.popper,
      popperRect: e.rects.popper,
      gpuAcceleration: i,
      isFixed: e.options.strategy === "fixed",
    };
  (e.modifiersData.popperOffsets != null &&
    (e.styles.popper = Object.assign(
      {},
      e.styles.popper,
      rl(
        Object.assign({}, u, {
          offsets: e.modifiersData.popperOffsets,
          position: e.options.strategy,
          adaptive: s,
          roundOffsets: l,
        }),
      ),
    )),
    e.modifiersData.arrow != null &&
      (e.styles.arrow = Object.assign(
        {},
        e.styles.arrow,
        rl(
          Object.assign({}, u, {
            offsets: e.modifiersData.arrow,
            position: "absolute",
            adaptive: !1,
            roundOffsets: l,
          }),
        ),
      )),
    (e.attributes.popper = Object.assign({}, e.attributes.popper, {
      "data-popper-placement": e.placement,
    })));
}
const Ef = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Tf,
  data: {},
};
var qa = { passive: !0 };
function Cf(t) {
  var e = t.state,
    n = t.instance,
    r = t.options,
    i = r.scroll,
    a = i === void 0 ? !0 : i,
    s = r.resize,
    o = s === void 0 ? !0 : s,
    l = bn(e.elements.popper),
    u = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return (
    a &&
      u.forEach(function (h) {
        h.addEventListener("scroll", n.update, qa);
      }),
    o && l.addEventListener("resize", n.update, qa),
    function () {
      (a &&
        u.forEach(function (h) {
          h.removeEventListener("scroll", n.update, qa);
        }),
        o && l.removeEventListener("resize", n.update, qa));
    }
  );
}
const Lf = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect: Cf,
  data: {},
};
var Mf = { left: "right", right: "left", bottom: "top", top: "bottom" };
function us(t) {
  return t.replace(/left|right|bottom|top/g, function (e) {
    return Mf[e];
  });
}
var zf = { start: "end", end: "start" };
function il(t) {
  return t.replace(/start|end/g, function (e) {
    return zf[e];
  });
}
function b0(t) {
  var e = bn(t),
    n = e.pageXOffset,
    r = e.pageYOffset;
  return { scrollLeft: n, scrollTop: r };
}
function y0(t) {
  return zi(Jr(t)).left + b0(t).scrollLeft;
}
function Df(t, e) {
  var n = bn(t),
    r = Jr(t),
    i = n.visualViewport,
    a = r.clientWidth,
    s = r.clientHeight,
    o = 0,
    l = 0;
  if (i) {
    ((a = i.width), (s = i.height));
    var u = xc();
    (u || (!u && e === "fixed")) && ((o = i.offsetLeft), (l = i.offsetTop));
  }
  return { width: a, height: s, x: o + y0(t), y: l };
}
function If(t) {
  var e,
    n = Jr(t),
    r = b0(t),
    i = (e = t.ownerDocument) == null ? void 0 : e.body,
    a = ui(
      n.scrollWidth,
      n.clientWidth,
      i ? i.scrollWidth : 0,
      i ? i.clientWidth : 0,
    ),
    s = ui(
      n.scrollHeight,
      n.clientHeight,
      i ? i.scrollHeight : 0,
      i ? i.clientHeight : 0,
    ),
    o = -r.scrollLeft + y0(t),
    l = -r.scrollTop;
  return (
    Sr(i || n).direction === "rtl" &&
      (o += ui(n.clientWidth, i ? i.clientWidth : 0) - a),
    { width: a, height: s, x: o, y: l }
  );
}
function w0(t) {
  var e = Sr(t),
    n = e.overflow,
    r = e.overflowX,
    i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + i + r);
}
function Ec(t) {
  return ["html", "body", "#document"].indexOf(rr(t)) >= 0
    ? t.ownerDocument.body
    : Nn(t) && w0(t)
      ? t
      : Ec(js(t));
}
function oa(t, e) {
  var n;
  e === void 0 && (e = []);
  var r = Ec(t),
    i = r === ((n = t.ownerDocument) == null ? void 0 : n.body),
    a = bn(r),
    s = i ? [a].concat(a.visualViewport || [], w0(r) ? r : []) : r,
    o = e.concat(s);
  return i ? o : o.concat(oa(js(s)));
}
function Yo(t) {
  return Object.assign({}, t, {
    left: t.x,
    top: t.y,
    right: t.x + t.width,
    bottom: t.y + t.height,
  });
}
function Nf(t, e) {
  var n = zi(t, !1, e === "fixed");
  return (
    (n.top = n.top + t.clientTop),
    (n.left = n.left + t.clientLeft),
    (n.bottom = n.top + t.clientHeight),
    (n.right = n.left + t.clientWidth),
    (n.width = t.clientWidth),
    (n.height = t.clientHeight),
    (n.x = n.left),
    (n.y = n.top),
    n
  );
}
function al(t, e, n) {
  return e === bc ? Yo(Df(t, n)) : hi(e) ? Nf(e, n) : Yo(If(Jr(t)));
}
function Ff(t) {
  var e = oa(js(t)),
    n = ["absolute", "fixed"].indexOf(Sr(t).position) >= 0,
    r = n && Nn(t) ? Ea(t) : t;
  return hi(r)
    ? e.filter(function (i) {
        return hi(i) && kc(i, r) && rr(i) !== "body";
      })
    : [];
}
function _f(t, e, n, r) {
  var i = e === "clippingParents" ? Ff(t) : [].concat(e),
    a = [].concat(i, [n]),
    s = a[0],
    o = a.reduce(
      function (l, u) {
        var h = al(t, u, r);
        return (
          (l.top = ui(h.top, l.top)),
          (l.right = As(h.right, l.right)),
          (l.bottom = As(h.bottom, l.bottom)),
          (l.left = ui(h.left, l.left)),
          l
        );
      },
      al(t, s, r),
    );
  return (
    (o.width = o.right - o.left),
    (o.height = o.bottom - o.top),
    (o.x = o.left),
    (o.y = o.top),
    o
  );
}
function Cc(t) {
  var e = t.reference,
    n = t.element,
    r = t.placement,
    i = r ? tr(r) : null,
    a = r ? Di(r) : null,
    s = e.x + e.width / 2 - n.width / 2,
    o = e.y + e.height / 2 - n.height / 2,
    l;
  switch (i) {
    case un:
      l = { x: s, y: e.y - n.height };
      break;
    case On:
      l = { x: s, y: e.y + e.height };
      break;
    case Bn:
      l = { x: e.x + e.width, y: o };
      break;
    case cn:
      l = { x: e.x - n.width, y: o };
      break;
    default:
      l = { x: e.x, y: e.y };
  }
  var u = i ? v0(i) : null;
  if (u != null) {
    var h = u === "y" ? "height" : "width";
    switch (a) {
      case Li:
        l[u] = l[u] - (e[h] / 2 - n[h] / 2);
        break;
      case ma:
        l[u] = l[u] + (e[h] / 2 - n[h] / 2);
        break;
    }
  }
  return l;
}
function pa(t, e) {
  e === void 0 && (e = {});
  var n = e,
    r = n.placement,
    i = r === void 0 ? t.placement : r,
    a = n.strategy,
    s = a === void 0 ? t.strategy : a,
    o = n.boundary,
    l = o === void 0 ? tf : o,
    u = n.rootBoundary,
    h = u === void 0 ? bc : u,
    d = n.elementContext,
    p = d === void 0 ? Gi : d,
    m = n.altBoundary,
    y = m === void 0 ? !1 : m,
    S = n.padding,
    A = S === void 0 ? 0 : S,
    C = Ac(typeof A != "number" ? A : Tc(A, Ta)),
    b = p === Gi ? nf : Gi,
    T = t.rects.popper,
    v = t.elements[y ? b : p],
    E = _f(hi(v) ? v : v.contextElement || Jr(t.elements.popper), l, h, s),
    x = zi(t.elements.reference),
    _ = Cc({ reference: x, element: T, placement: i }),
    j = Yo(Object.assign({}, T, _)),
    F = p === Gi ? j : x,
    O = {
      top: E.top - F.top + C.top,
      bottom: F.bottom - E.bottom + C.bottom,
      left: E.left - F.left + C.left,
      right: F.right - E.right + C.right,
    },
    $ = t.modifiersData.offset;
  if (p === Gi && $) {
    var G = $[i];
    Object.keys(O).forEach(function (K) {
      var le = [Bn, On].indexOf(K) >= 0 ? 1 : -1,
        R = [un, On].indexOf(K) >= 0 ? "y" : "x";
      O[K] += G[R] * le;
    });
  }
  return O;
}
function Of(t, e) {
  e === void 0 && (e = {});
  var n = e,
    r = n.placement,
    i = n.boundary,
    a = n.rootBoundary,
    s = n.padding,
    o = n.flipVariations,
    l = n.allowedAutoPlacements,
    u = l === void 0 ? yc : l,
    h = Di(r),
    d = h
      ? o
        ? tl
        : tl.filter(function (y) {
            return Di(y) === h;
          })
      : Ta,
    p = d.filter(function (y) {
      return u.indexOf(y) >= 0;
    });
  p.length === 0 && (p = d);
  var m = p.reduce(function (y, S) {
    return (
      (y[S] = pa(t, { placement: S, boundary: i, rootBoundary: a, padding: s })[
        tr(S)
      ]),
      y
    );
  }, {});
  return Object.keys(m).sort(function (y, S) {
    return m[y] - m[S];
  });
}
function Bf(t) {
  if (tr(t) === m0) return [];
  var e = us(t);
  return [il(t), e, il(e)];
}
function Rf(t) {
  var e = t.state,
    n = t.options,
    r = t.name;
  if (!e.modifiersData[r]._skip) {
    for (
      var i = n.mainAxis,
        a = i === void 0 ? !0 : i,
        s = n.altAxis,
        o = s === void 0 ? !0 : s,
        l = n.fallbackPlacements,
        u = n.padding,
        h = n.boundary,
        d = n.rootBoundary,
        p = n.altBoundary,
        m = n.flipVariations,
        y = m === void 0 ? !0 : m,
        S = n.allowedAutoPlacements,
        A = e.options.placement,
        C = tr(A),
        b = C === A,
        T = l || (b || !y ? [us(A)] : Bf(A)),
        v = [A].concat(T).reduce(function (De, ke) {
          return De.concat(
            tr(ke) === m0
              ? Of(e, {
                  placement: ke,
                  boundary: h,
                  rootBoundary: d,
                  padding: u,
                  flipVariations: y,
                  allowedAutoPlacements: S,
                })
              : ke,
          );
        }, []),
        E = e.rects.reference,
        x = e.rects.popper,
        _ = new Map(),
        j = !0,
        F = v[0],
        O = 0;
      O < v.length;
      O++
    ) {
      var $ = v[O],
        G = tr($),
        K = Di($) === Li,
        le = [un, On].indexOf(G) >= 0,
        R = le ? "width" : "height",
        he = pa(e, {
          placement: $,
          boundary: h,
          rootBoundary: d,
          altBoundary: p,
          padding: u,
        }),
        ee = le ? (K ? Bn : cn) : K ? On : un;
      E[R] > x[R] && (ee = us(ee));
      var Z = us(ee),
        fe = [];
      if (
        (a && fe.push(he[G] <= 0),
        o && fe.push(he[ee] <= 0, he[Z] <= 0),
        fe.every(function (De) {
          return De;
        }))
      ) {
        ((F = $), (j = !1));
        break;
      }
      _.set($, fe);
    }
    if (j)
      for (
        var M = y ? 3 : 1,
          ne = function (ke) {
            var Ce = v.find(function (Ue) {
              var Fe = _.get(Ue);
              if (Fe)
                return Fe.slice(0, ke).every(function (We) {
                  return We;
                });
            });
            if (Ce) return ((F = Ce), "break");
          },
          xe = M;
        xe > 0;
        xe--
      ) {
        var z = ne(xe);
        if (z === "break") break;
      }
    e.placement !== F &&
      ((e.modifiersData[r]._skip = !0), (e.placement = F), (e.reset = !0));
  }
}
const Pf = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Rf,
  requiresIfExists: ["offset"],
  data: { _skip: !1 },
};
function sl(t, e, n) {
  return (
    n === void 0 && (n = { x: 0, y: 0 }),
    {
      top: t.top - e.height - n.y,
      right: t.right - e.width + n.x,
      bottom: t.bottom - e.height + n.y,
      left: t.left - e.width - n.x,
    }
  );
}
function ol(t) {
  return [un, Bn, On, cn].some(function (e) {
    return t[e] >= 0;
  });
}
function Hf(t) {
  var e = t.state,
    n = t.name,
    r = e.rects.reference,
    i = e.rects.popper,
    a = e.modifiersData.preventOverflow,
    s = pa(e, { elementContext: "reference" }),
    o = pa(e, { altBoundary: !0 }),
    l = sl(s, r),
    u = sl(o, i, a),
    h = ol(l),
    d = ol(u);
  ((e.modifiersData[n] = {
    referenceClippingOffsets: l,
    popperEscapeOffsets: u,
    isReferenceHidden: h,
    hasPopperEscaped: d,
  }),
    (e.attributes.popper = Object.assign({}, e.attributes.popper, {
      "data-popper-reference-hidden": h,
      "data-popper-escaped": d,
    })));
}
const qf = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Hf,
};
function Uf(t, e, n) {
  var r = tr(t),
    i = [cn, un].indexOf(r) >= 0 ? -1 : 1,
    a = typeof n == "function" ? n(Object.assign({}, e, { placement: t })) : n,
    s = a[0],
    o = a[1];
  return (
    (s = s || 0),
    (o = (o || 0) * i),
    [cn, Bn].indexOf(r) >= 0 ? { x: o, y: s } : { x: s, y: o }
  );
}
function $f(t) {
  var e = t.state,
    n = t.options,
    r = t.name,
    i = n.offset,
    a = i === void 0 ? [0, 0] : i,
    s = yc.reduce(function (h, d) {
      return ((h[d] = Uf(d, e.rects, a)), h);
    }, {}),
    o = s[e.placement],
    l = o.x,
    u = o.y;
  (e.modifiersData.popperOffsets != null &&
    ((e.modifiersData.popperOffsets.x += l),
    (e.modifiersData.popperOffsets.y += u)),
    (e.modifiersData[r] = s));
}
const Vf = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: $f,
};
function jf(t) {
  var e = t.state,
    n = t.name;
  e.modifiersData[n] = Cc({
    reference: e.rects.reference,
    element: e.rects.popper,
    placement: e.placement,
  });
}
const Wf = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: jf,
  data: {},
};
function Gf(t) {
  return t === "x" ? "y" : "x";
}
function Yf(t) {
  var e = t.state,
    n = t.options,
    r = t.name,
    i = n.mainAxis,
    a = i === void 0 ? !0 : i,
    s = n.altAxis,
    o = s === void 0 ? !1 : s,
    l = n.boundary,
    u = n.rootBoundary,
    h = n.altBoundary,
    d = n.padding,
    p = n.tether,
    m = p === void 0 ? !0 : p,
    y = n.tetherOffset,
    S = y === void 0 ? 0 : y,
    A = pa(e, { boundary: l, rootBoundary: u, padding: d, altBoundary: h }),
    C = tr(e.placement),
    b = Di(e.placement),
    T = !b,
    v = v0(C),
    E = Gf(v),
    x = e.modifiersData.popperOffsets,
    _ = e.rects.reference,
    j = e.rects.popper,
    F =
      typeof S == "function"
        ? S(Object.assign({}, e.rects, { placement: e.placement }))
        : S,
    O =
      typeof F == "number"
        ? { mainAxis: F, altAxis: F }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, F),
    $ = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null,
    G = { x: 0, y: 0 };
  if (x) {
    if (a) {
      var K,
        le = v === "y" ? un : cn,
        R = v === "y" ? On : Bn,
        he = v === "y" ? "height" : "width",
        ee = x[v],
        Z = ee + A[le],
        fe = ee - A[R],
        M = m ? -j[he] / 2 : 0,
        ne = b === Li ? _[he] : j[he],
        xe = b === Li ? -j[he] : -_[he],
        z = e.elements.arrow,
        De = m && z ? g0(z) : { width: 0, height: 0 },
        ke = e.modifiersData["arrow#persistent"]
          ? e.modifiersData["arrow#persistent"].padding
          : Sc(),
        Ce = ke[le],
        Ue = ke[R],
        Fe = sa(0, _[he], De[he]),
        We = T
          ? _[he] / 2 - M - Fe - Ce - O.mainAxis
          : ne - Fe - Ce - O.mainAxis,
        je = T
          ? -_[he] / 2 + M + Fe + Ue + O.mainAxis
          : xe + Fe + Ue + O.mainAxis,
        lt = e.elements.arrow && Ea(e.elements.arrow),
        Et = lt ? (v === "y" ? lt.clientTop || 0 : lt.clientLeft || 0) : 0,
        ht = (K = $ == null ? void 0 : $[v]) != null ? K : 0,
        wt = ee + We - ht - Et,
        ut = ee + je - ht,
        _t = sa(m ? As(Z, wt) : Z, ee, m ? ui(fe, ut) : fe);
      ((x[v] = _t), (G[v] = _t - ee));
    }
    if (o) {
      var ft,
        mt = v === "x" ? un : cn,
        xt = v === "x" ? On : Bn,
        Mt = x[E],
        Dt = E === "y" ? "height" : "width",
        xn = Mt + A[mt],
        Ot = Mt - A[xt],
        Bt = [un, cn].indexOf(C) !== -1,
        Rt = (ft = $ == null ? void 0 : $[E]) != null ? ft : 0,
        Pt = Bt ? xn : Mt - _[Dt] - j[Dt] - Rt + O.altAxis,
        Ht = Bt ? Mt + _[Dt] + j[Dt] - Rt - O.altAxis : Ot,
        kn = m && Bt ? bf(Pt, Mt, Ht) : sa(m ? Pt : xn, Mt, m ? Ht : Ot);
      ((x[E] = kn), (G[E] = kn - Mt));
    }
    e.modifiersData[r] = G;
  }
}
const Xf = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Yf,
  requiresIfExists: ["offset"],
};
function Kf(t) {
  return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
}
function Qf(t) {
  return t === bn(t) || !Nn(t) ? b0(t) : Kf(t);
}
function Zf(t) {
  var e = t.getBoundingClientRect(),
    n = Mi(e.width) / t.offsetWidth || 1,
    r = Mi(e.height) / t.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function Jf(t, e, n) {
  n === void 0 && (n = !1);
  var r = Nn(e),
    i = Nn(e) && Zf(e),
    a = Jr(e),
    s = zi(t, i, n),
    o = { scrollLeft: 0, scrollTop: 0 },
    l = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((rr(e) !== "body" || w0(a)) && (o = Qf(e)),
      Nn(e)
        ? ((l = zi(e, !0)), (l.x += e.clientLeft), (l.y += e.clientTop))
        : a && (l.x = y0(a))),
    {
      x: s.left + o.scrollLeft - l.x,
      y: s.top + o.scrollTop - l.y,
      width: s.width,
      height: s.height,
    }
  );
}
function e1(t) {
  var e = new Map(),
    n = new Set(),
    r = [];
  t.forEach(function (a) {
    e.set(a.name, a);
  });
  function i(a) {
    n.add(a.name);
    var s = [].concat(a.requires || [], a.requiresIfExists || []);
    (s.forEach(function (o) {
      if (!n.has(o)) {
        var l = e.get(o);
        l && i(l);
      }
    }),
      r.push(a));
  }
  return (
    t.forEach(function (a) {
      n.has(a.name) || i(a);
    }),
    r
  );
}
function t1(t) {
  var e = e1(t);
  return ff.reduce(function (n, r) {
    return n.concat(
      e.filter(function (i) {
        return i.phase === r;
      }),
    );
  }, []);
}
function n1(t) {
  var e;
  return function () {
    return (
      e ||
        (e = new Promise(function (n) {
          Promise.resolve().then(function () {
            ((e = void 0), n(t()));
          });
        })),
      e
    );
  };
}
function r1(t) {
  var e = t.reduce(function (n, r) {
    var i = n[r.name];
    return (
      (n[r.name] = i
        ? Object.assign({}, i, r, {
            options: Object.assign({}, i.options, r.options),
            data: Object.assign({}, i.data, r.data),
          })
        : r),
      n
    );
  }, {});
  return Object.keys(e).map(function (n) {
    return e[n];
  });
}
var ll = { placement: "bottom", modifiers: [], strategy: "absolute" };
function ul() {
  for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
    e[n] = arguments[n];
  return !e.some(function (r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function i1(t) {
  t === void 0 && (t = {});
  var e = t,
    n = e.defaultModifiers,
    r = n === void 0 ? [] : n,
    i = e.defaultOptions,
    a = i === void 0 ? ll : i;
  return function (o, l, u) {
    u === void 0 && (u = a);
    var h = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, ll, a),
        modifiersData: {},
        elements: { reference: o, popper: l },
        attributes: {},
        styles: {},
      },
      d = [],
      p = !1,
      m = {
        state: h,
        setOptions: function (C) {
          var b = typeof C == "function" ? C(h.options) : C;
          (S(),
            (h.options = Object.assign({}, a, h.options, b)),
            (h.scrollParents = {
              reference: hi(o)
                ? oa(o)
                : o.contextElement
                  ? oa(o.contextElement)
                  : [],
              popper: oa(l),
            }));
          var T = t1(r1([].concat(r, h.options.modifiers)));
          return (
            (h.orderedModifiers = T.filter(function (v) {
              return v.enabled;
            })),
            y(),
            m.update()
          );
        },
        forceUpdate: function () {
          if (!p) {
            var C = h.elements,
              b = C.reference,
              T = C.popper;
            if (ul(b, T)) {
              ((h.rects = {
                reference: Jf(b, Ea(T), h.options.strategy === "fixed"),
                popper: g0(T),
              }),
                (h.reset = !1),
                (h.placement = h.options.placement),
                h.orderedModifiers.forEach(function (O) {
                  return (h.modifiersData[O.name] = Object.assign({}, O.data));
                }));
              for (var v = 0; v < h.orderedModifiers.length; v++) {
                if (h.reset === !0) {
                  ((h.reset = !1), (v = -1));
                  continue;
                }
                var E = h.orderedModifiers[v],
                  x = E.fn,
                  _ = E.options,
                  j = _ === void 0 ? {} : _,
                  F = E.name;
                typeof x == "function" &&
                  (h = x({ state: h, options: j, name: F, instance: m }) || h);
              }
            }
          }
        },
        update: n1(function () {
          return new Promise(function (A) {
            (m.forceUpdate(), A(h));
          });
        }),
        destroy: function () {
          (S(), (p = !0));
        },
      };
    if (!ul(o, l)) return m;
    m.setOptions(u).then(function (A) {
      !p && u.onFirstUpdate && u.onFirstUpdate(A);
    });
    function y() {
      h.orderedModifiers.forEach(function (A) {
        var C = A.name,
          b = A.options,
          T = b === void 0 ? {} : b,
          v = A.effect;
        if (typeof v == "function") {
          var E = v({ state: h, name: C, instance: m, options: T }),
            x = function () {};
          d.push(E || x);
        }
      });
    }
    function S() {
      (d.forEach(function (A) {
        return A();
      }),
        (d = []));
    }
    return m;
  };
}
var a1 = [Lf, Wf, Ef, wc, Vf, Pf, Xf, kf, qf],
  s1 = i1({ defaultModifiers: a1 }),
  o1 = "tippy-box",
  Lc = "tippy-content",
  l1 = "tippy-backdrop",
  Mc = "tippy-arrow",
  zc = "tippy-svg-arrow",
  oi = { passive: !0, capture: !0 },
  Dc = function () {
    return document.body;
  };
function ho(t, e, n) {
  if (Array.isArray(t)) {
    var r = t[e];
    return r ?? (Array.isArray(n) ? n[e] : n);
  }
  return t;
}
function x0(t, e) {
  var n = {}.toString.call(t);
  return n.indexOf("[object") === 0 && n.indexOf(e + "]") > -1;
}
function Ic(t, e) {
  return typeof t == "function" ? t.apply(void 0, e) : t;
}
function cl(t, e) {
  if (e === 0) return t;
  var n;
  return function (r) {
    (clearTimeout(n),
      (n = setTimeout(function () {
        t(r);
      }, e)));
  };
}
function u1(t) {
  return t.split(/\s+/).filter(Boolean);
}
function yi(t) {
  return [].concat(t);
}
function dl(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function c1(t) {
  return t.filter(function (e, n) {
    return t.indexOf(e) === n;
  });
}
function d1(t) {
  return t.split("-")[0];
}
function Ts(t) {
  return [].slice.call(t);
}
function hl(t) {
  return Object.keys(t).reduce(function (e, n) {
    return (t[n] !== void 0 && (e[n] = t[n]), e);
  }, {});
}
function la() {
  return document.createElement("div");
}
function Ws(t) {
  return ["Element", "Fragment"].some(function (e) {
    return x0(t, e);
  });
}
function h1(t) {
  return x0(t, "NodeList");
}
function f1(t) {
  return x0(t, "MouseEvent");
}
function m1(t) {
  return !!(t && t._tippy && t._tippy.reference === t);
}
function p1(t) {
  return Ws(t)
    ? [t]
    : h1(t)
      ? Ts(t)
      : Array.isArray(t)
        ? t
        : Ts(document.querySelectorAll(t));
}
function fo(t, e) {
  t.forEach(function (n) {
    n && (n.style.transitionDuration = e + "ms");
  });
}
function fl(t, e) {
  t.forEach(function (n) {
    n && n.setAttribute("data-state", e);
  });
}
function g1(t) {
  var e,
    n = yi(t),
    r = n[0];
  return r != null && (e = r.ownerDocument) != null && e.body
    ? r.ownerDocument
    : document;
}
function v1(t, e) {
  var n = e.clientX,
    r = e.clientY;
  return t.every(function (i) {
    var a = i.popperRect,
      s = i.popperState,
      o = i.props,
      l = o.interactiveBorder,
      u = d1(s.placement),
      h = s.modifiersData.offset;
    if (!h) return !0;
    var d = u === "bottom" ? h.top.y : 0,
      p = u === "top" ? h.bottom.y : 0,
      m = u === "right" ? h.left.x : 0,
      y = u === "left" ? h.right.x : 0,
      S = a.top - r + d > l,
      A = r - a.bottom - p > l,
      C = a.left - n + m > l,
      b = n - a.right - y > l;
    return S || A || C || b;
  });
}
function mo(t, e, n) {
  var r = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function (i) {
    t[r](i, n);
  });
}
function ml(t, e) {
  for (var n = e; n; ) {
    var r;
    if (t.contains(n)) return !0;
    n =
      n.getRootNode == null || (r = n.getRootNode()) == null ? void 0 : r.host;
  }
  return !1;
}
var Qn = { isTouch: !1 },
  pl = 0;
function b1() {
  Qn.isTouch ||
    ((Qn.isTouch = !0),
    window.performance && document.addEventListener("mousemove", Nc));
}
function Nc() {
  var t = performance.now();
  (t - pl < 20 &&
    ((Qn.isTouch = !1), document.removeEventListener("mousemove", Nc)),
    (pl = t));
}
function y1() {
  var t = document.activeElement;
  if (m1(t)) {
    var e = t._tippy;
    t.blur && !e.state.isVisible && t.blur();
  }
}
function w1() {
  (document.addEventListener("touchstart", b1, oi),
    window.addEventListener("blur", y1));
}
var x1 = typeof window < "u" && typeof document < "u",
  k1 = x1 ? !!window.msCrypto : !1,
  S1 = { animateFill: !1, followCursor: !1, inlinePositioning: !1, sticky: !1 },
  A1 = {
    allowHTML: !1,
    animation: "fade",
    arrow: !0,
    content: "",
    inertia: !1,
    maxWidth: 350,
    role: "tooltip",
    theme: "",
    zIndex: 9999,
  },
  Vn = Object.assign(
    {
      appendTo: Dc,
      aria: { content: "auto", expanded: "auto" },
      delay: 0,
      duration: [300, 250],
      getReferenceClientRect: null,
      hideOnClick: !0,
      ignoreAttributes: !1,
      interactive: !1,
      interactiveBorder: 2,
      interactiveDebounce: 0,
      moveTransition: "",
      offset: [0, 10],
      onAfterUpdate: function () {},
      onBeforeUpdate: function () {},
      onCreate: function () {},
      onDestroy: function () {},
      onHidden: function () {},
      onHide: function () {},
      onMount: function () {},
      onShow: function () {},
      onShown: function () {},
      onTrigger: function () {},
      onUntrigger: function () {},
      onClickOutside: function () {},
      placement: "top",
      plugins: [],
      popperOptions: {},
      render: null,
      showOnCreate: !1,
      touch: !0,
      trigger: "mouseenter focus",
      triggerTarget: null,
    },
    S1,
    A1,
  ),
  T1 = Object.keys(Vn),
  E1 = function (e) {
    var n = Object.keys(e);
    n.forEach(function (r) {
      Vn[r] = e[r];
    });
  };
function Fc(t) {
  var e = t.plugins || [],
    n = e.reduce(function (r, i) {
      var a = i.name,
        s = i.defaultValue;
      if (a) {
        var o;
        r[a] = t[a] !== void 0 ? t[a] : (o = Vn[a]) != null ? o : s;
      }
      return r;
    }, {});
  return Object.assign({}, t, n);
}
function C1(t, e) {
  var n = e ? Object.keys(Fc(Object.assign({}, Vn, { plugins: e }))) : T1,
    r = n.reduce(function (i, a) {
      var s = (t.getAttribute("data-tippy-" + a) || "").trim();
      if (!s) return i;
      if (a === "content") i[a] = s;
      else
        try {
          i[a] = JSON.parse(s);
        } catch {
          i[a] = s;
        }
      return i;
    }, {});
  return r;
}
function gl(t, e) {
  var n = Object.assign(
    {},
    e,
    { content: Ic(e.content, [t]) },
    e.ignoreAttributes ? {} : C1(t, e.plugins),
  );
  return (
    (n.aria = Object.assign({}, Vn.aria, n.aria)),
    (n.aria = {
      expanded: n.aria.expanded === "auto" ? e.interactive : n.aria.expanded,
      content:
        n.aria.content === "auto"
          ? e.interactive
            ? null
            : "describedby"
          : n.aria.content,
    }),
    n
  );
}
var L1 = function () {
  return "innerHTML";
};
function Xo(t, e) {
  t[L1()] = e;
}
function vl(t) {
  var e = la();
  return (
    t === !0
      ? (e.className = Mc)
      : ((e.className = zc), Ws(t) ? e.appendChild(t) : Xo(e, t)),
    e
  );
}
function bl(t, e) {
  Ws(e.content)
    ? (Xo(t, ""), t.appendChild(e.content))
    : typeof e.content != "function" &&
      (e.allowHTML ? Xo(t, e.content) : (t.textContent = e.content));
}
function Ko(t) {
  var e = t.firstElementChild,
    n = Ts(e.children);
  return {
    box: e,
    content: n.find(function (r) {
      return r.classList.contains(Lc);
    }),
    arrow: n.find(function (r) {
      return r.classList.contains(Mc) || r.classList.contains(zc);
    }),
    backdrop: n.find(function (r) {
      return r.classList.contains(l1);
    }),
  };
}
function _c(t) {
  var e = la(),
    n = la();
  ((n.className = o1),
    n.setAttribute("data-state", "hidden"),
    n.setAttribute("tabindex", "-1"));
  var r = la();
  ((r.className = Lc),
    r.setAttribute("data-state", "hidden"),
    bl(r, t.props),
    e.appendChild(n),
    n.appendChild(r),
    i(t.props, t.props));
  function i(a, s) {
    var o = Ko(e),
      l = o.box,
      u = o.content,
      h = o.arrow;
    (s.theme
      ? l.setAttribute("data-theme", s.theme)
      : l.removeAttribute("data-theme"),
      typeof s.animation == "string"
        ? l.setAttribute("data-animation", s.animation)
        : l.removeAttribute("data-animation"),
      s.inertia
        ? l.setAttribute("data-inertia", "")
        : l.removeAttribute("data-inertia"),
      (l.style.maxWidth =
        typeof s.maxWidth == "number" ? s.maxWidth + "px" : s.maxWidth),
      s.role ? l.setAttribute("role", s.role) : l.removeAttribute("role"),
      (a.content !== s.content || a.allowHTML !== s.allowHTML) &&
        bl(u, t.props),
      s.arrow
        ? h
          ? a.arrow !== s.arrow &&
            (l.removeChild(h), l.appendChild(vl(s.arrow)))
          : l.appendChild(vl(s.arrow))
        : h && l.removeChild(h));
  }
  return { popper: e, onUpdate: i };
}
_c.$$tippy = !0;
var M1 = 1,
  Ua = [],
  po = [];
function z1(t, e) {
  var n = gl(t, Object.assign({}, Vn, Fc(hl(e)))),
    r,
    i,
    a,
    s = !1,
    o = !1,
    l = !1,
    u = !1,
    h,
    d,
    p,
    m = [],
    y = cl(wt, n.interactiveDebounce),
    S,
    A = M1++,
    C = null,
    b = c1(n.plugins),
    T = {
      isEnabled: !0,
      isVisible: !1,
      isDestroyed: !1,
      isMounted: !1,
      isShown: !1,
    },
    v = {
      id: A,
      reference: t,
      popper: la(),
      popperInstance: C,
      props: n,
      state: T,
      plugins: b,
      clearDelayTimeouts: Pt,
      setProps: Ht,
      setContent: kn,
      show: cr,
      hide: Hn,
      hideWithInteractivity: dr,
      enable: Bt,
      disable: Rt,
      unmount: Sn,
      destroy: An,
    };
  if (!n.render) return v;
  var E = n.render(v),
    x = E.popper,
    _ = E.onUpdate;
  (x.setAttribute("data-tippy-root", ""),
    (x.id = "tippy-" + v.id),
    (v.popper = x),
    (t._tippy = v),
    (x._tippy = v));
  var j = b.map(function (Y) {
      return Y.fn(v);
    }),
    F = t.hasAttribute("aria-expanded");
  return (
    lt(),
    M(),
    ee(),
    Z("onCreate", [v]),
    n.showOnCreate && xn(),
    x.addEventListener("mouseenter", function () {
      v.props.interactive && v.state.isVisible && v.clearDelayTimeouts();
    }),
    x.addEventListener("mouseleave", function () {
      v.props.interactive &&
        v.props.trigger.indexOf("mouseenter") >= 0 &&
        le().addEventListener("mousemove", y);
    }),
    v
  );
  function O() {
    var Y = v.props.touch;
    return Array.isArray(Y) ? Y : [Y, 0];
  }
  function $() {
    return O()[0] === "hold";
  }
  function G() {
    var Y;
    return !!((Y = v.props.render) != null && Y.$$tippy);
  }
  function K() {
    return S || t;
  }
  function le() {
    var Y = K().parentNode;
    return Y ? g1(Y) : document;
  }
  function R() {
    return Ko(x);
  }
  function he(Y) {
    return (v.state.isMounted && !v.state.isVisible) ||
      Qn.isTouch ||
      (h && h.type === "focus")
      ? 0
      : ho(v.props.delay, Y ? 0 : 1, Vn.delay);
  }
  function ee(Y) {
    (Y === void 0 && (Y = !1),
      (x.style.pointerEvents = v.props.interactive && !Y ? "" : "none"),
      (x.style.zIndex = "" + v.props.zIndex));
  }
  function Z(Y, pe, Te) {
    if (
      (Te === void 0 && (Te = !0),
      j.forEach(function (Oe) {
        Oe[Y] && Oe[Y].apply(Oe, pe);
      }),
      Te)
    ) {
      var Re;
      (Re = v.props)[Y].apply(Re, pe);
    }
  }
  function fe() {
    var Y = v.props.aria;
    if (Y.content) {
      var pe = "aria-" + Y.content,
        Te = x.id,
        Re = yi(v.props.triggerTarget || t);
      Re.forEach(function (Oe) {
        var it = Oe.getAttribute(pe);
        if (v.state.isVisible) Oe.setAttribute(pe, it ? it + " " + Te : Te);
        else {
          var Ke = it && it.replace(Te, "").trim();
          Ke ? Oe.setAttribute(pe, Ke) : Oe.removeAttribute(pe);
        }
      });
    }
  }
  function M() {
    if (!(F || !v.props.aria.expanded)) {
      var Y = yi(v.props.triggerTarget || t);
      Y.forEach(function (pe) {
        v.props.interactive
          ? pe.setAttribute(
              "aria-expanded",
              v.state.isVisible && pe === K() ? "true" : "false",
            )
          : pe.removeAttribute("aria-expanded");
      });
    }
  }
  function ne() {
    (le().removeEventListener("mousemove", y),
      (Ua = Ua.filter(function (Y) {
        return Y !== y;
      })));
  }
  function xe(Y) {
    if (!(Qn.isTouch && (l || Y.type === "mousedown"))) {
      var pe = (Y.composedPath && Y.composedPath()[0]) || Y.target;
      if (!(v.props.interactive && ml(x, pe))) {
        if (
          yi(v.props.triggerTarget || t).some(function (Te) {
            return ml(Te, pe);
          })
        ) {
          if (
            Qn.isTouch ||
            (v.state.isVisible && v.props.trigger.indexOf("click") >= 0)
          )
            return;
        } else Z("onClickOutside", [v, Y]);
        v.props.hideOnClick === !0 &&
          (v.clearDelayTimeouts(),
          v.hide(),
          (o = !0),
          setTimeout(function () {
            o = !1;
          }),
          v.state.isMounted || Ce());
      }
    }
  }
  function z() {
    l = !0;
  }
  function De() {
    l = !1;
  }
  function ke() {
    var Y = le();
    (Y.addEventListener("mousedown", xe, !0),
      Y.addEventListener("touchend", xe, oi),
      Y.addEventListener("touchstart", De, oi),
      Y.addEventListener("touchmove", z, oi));
  }
  function Ce() {
    var Y = le();
    (Y.removeEventListener("mousedown", xe, !0),
      Y.removeEventListener("touchend", xe, oi),
      Y.removeEventListener("touchstart", De, oi),
      Y.removeEventListener("touchmove", z, oi));
  }
  function Ue(Y, pe) {
    We(Y, function () {
      !v.state.isVisible && x.parentNode && x.parentNode.contains(x) && pe();
    });
  }
  function Fe(Y, pe) {
    We(Y, pe);
  }
  function We(Y, pe) {
    var Te = R().box;
    function Re(Oe) {
      Oe.target === Te && (mo(Te, "remove", Re), pe());
    }
    if (Y === 0) return pe();
    (mo(Te, "remove", d), mo(Te, "add", Re), (d = Re));
  }
  function je(Y, pe, Te) {
    Te === void 0 && (Te = !1);
    var Re = yi(v.props.triggerTarget || t);
    Re.forEach(function (Oe) {
      (Oe.addEventListener(Y, pe, Te),
        m.push({ node: Oe, eventType: Y, handler: pe, options: Te }));
    });
  }
  function lt() {
    ($() &&
      (je("touchstart", ht, { passive: !0 }),
      je("touchend", ut, { passive: !0 })),
      u1(v.props.trigger).forEach(function (Y) {
        if (Y !== "manual")
          switch ((je(Y, ht), Y)) {
            case "mouseenter":
              je("mouseleave", ut);
              break;
            case "focus":
              je(k1 ? "focusout" : "blur", _t);
              break;
            case "focusin":
              je("focusout", _t);
              break;
          }
      }));
  }
  function Et() {
    (m.forEach(function (Y) {
      var pe = Y.node,
        Te = Y.eventType,
        Re = Y.handler,
        Oe = Y.options;
      pe.removeEventListener(Te, Re, Oe);
    }),
      (m = []));
  }
  function ht(Y) {
    var pe,
      Te = !1;
    if (!(!v.state.isEnabled || ft(Y) || o)) {
      var Re = ((pe = h) == null ? void 0 : pe.type) === "focus";
      ((h = Y),
        (S = Y.currentTarget),
        M(),
        !v.state.isVisible &&
          f1(Y) &&
          Ua.forEach(function (Oe) {
            return Oe(Y);
          }),
        Y.type === "click" &&
        (v.props.trigger.indexOf("mouseenter") < 0 || s) &&
        v.props.hideOnClick !== !1 &&
        v.state.isVisible
          ? (Te = !0)
          : xn(Y),
        Y.type === "click" && (s = !Te),
        Te && !Re && Ot(Y));
    }
  }
  function wt(Y) {
    var pe = Y.target,
      Te = K().contains(pe) || x.contains(pe);
    if (!(Y.type === "mousemove" && Te)) {
      var Re = Dt()
        .concat(x)
        .map(function (Oe) {
          var it,
            Ke = Oe._tippy,
            fn = (it = Ke.popperInstance) == null ? void 0 : it.state;
          return fn
            ? {
                popperRect: Oe.getBoundingClientRect(),
                popperState: fn,
                props: n,
              }
            : null;
        })
        .filter(Boolean);
      v1(Re, Y) && (ne(), Ot(Y));
    }
  }
  function ut(Y) {
    var pe = ft(Y) || (v.props.trigger.indexOf("click") >= 0 && s);
    if (!pe) {
      if (v.props.interactive) {
        v.hideWithInteractivity(Y);
        return;
      }
      Ot(Y);
    }
  }
  function _t(Y) {
    (v.props.trigger.indexOf("focusin") < 0 && Y.target !== K()) ||
      (v.props.interactive && Y.relatedTarget && x.contains(Y.relatedTarget)) ||
      Ot(Y);
  }
  function ft(Y) {
    return Qn.isTouch ? $() !== Y.type.indexOf("touch") >= 0 : !1;
  }
  function mt() {
    xt();
    var Y = v.props,
      pe = Y.popperOptions,
      Te = Y.placement,
      Re = Y.offset,
      Oe = Y.getReferenceClientRect,
      it = Y.moveTransition,
      Ke = G() ? Ko(x).arrow : null,
      fn = Oe
        ? {
            getBoundingClientRect: Oe,
            contextElement: Oe.contextElement || K(),
          }
        : t,
      Tn = {
        name: "$$tippy",
        enabled: !0,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: function (Q) {
          var ge = Q.state;
          if (G()) {
            var ct = R(),
              kt = ct.box;
            (["placement", "reference-hidden", "escaped"].forEach(
              function (pt) {
                pt === "placement"
                  ? kt.setAttribute("data-placement", ge.placement)
                  : ge.attributes.popper["data-popper-" + pt]
                    ? kt.setAttribute("data-" + pt, "")
                    : kt.removeAttribute("data-" + pt);
              },
            ),
              (ge.attributes.popper = {}));
          }
        },
      },
      nn = [
        { name: "offset", options: { offset: Re } },
        {
          name: "preventOverflow",
          options: { padding: { top: 2, bottom: 2, left: 5, right: 5 } },
        },
        { name: "flip", options: { padding: 5 } },
        { name: "computeStyles", options: { adaptive: !it } },
        Tn,
      ];
    (G() &&
      Ke &&
      nn.push({ name: "arrow", options: { element: Ke, padding: 3 } }),
      nn.push.apply(nn, (pe == null ? void 0 : pe.modifiers) || []),
      (v.popperInstance = s1(
        fn,
        x,
        Object.assign({}, pe, {
          placement: Te,
          onFirstUpdate: p,
          modifiers: nn,
        }),
      )));
  }
  function xt() {
    v.popperInstance && (v.popperInstance.destroy(), (v.popperInstance = null));
  }
  function Mt() {
    var Y = v.props.appendTo,
      pe,
      Te = K();
    ((v.props.interactive && Y === Dc) || Y === "parent"
      ? (pe = Te.parentNode)
      : (pe = Ic(Y, [Te])),
      pe.contains(x) || pe.appendChild(x),
      (v.state.isMounted = !0),
      mt());
  }
  function Dt() {
    return Ts(x.querySelectorAll("[data-tippy-root]"));
  }
  function xn(Y) {
    (v.clearDelayTimeouts(), Y && Z("onTrigger", [v, Y]), ke());
    var pe = he(!0),
      Te = O(),
      Re = Te[0],
      Oe = Te[1];
    (Qn.isTouch && Re === "hold" && Oe && (pe = Oe),
      pe
        ? (r = setTimeout(function () {
            v.show();
          }, pe))
        : v.show());
  }
  function Ot(Y) {
    if (
      (v.clearDelayTimeouts(), Z("onUntrigger", [v, Y]), !v.state.isVisible)
    ) {
      Ce();
      return;
    }
    if (
      !(
        v.props.trigger.indexOf("mouseenter") >= 0 &&
        v.props.trigger.indexOf("click") >= 0 &&
        ["mouseleave", "mousemove"].indexOf(Y.type) >= 0 &&
        s
      )
    ) {
      var pe = he(!1);
      pe
        ? (i = setTimeout(function () {
            v.state.isVisible && v.hide();
          }, pe))
        : (a = requestAnimationFrame(function () {
            v.hide();
          }));
    }
  }
  function Bt() {
    v.state.isEnabled = !0;
  }
  function Rt() {
    (v.hide(), (v.state.isEnabled = !1));
  }
  function Pt() {
    (clearTimeout(r), clearTimeout(i), cancelAnimationFrame(a));
  }
  function Ht(Y) {
    if (!v.state.isDestroyed) {
      (Z("onBeforeUpdate", [v, Y]), Et());
      var pe = v.props,
        Te = gl(t, Object.assign({}, pe, hl(Y), { ignoreAttributes: !0 }));
      ((v.props = Te),
        lt(),
        pe.interactiveDebounce !== Te.interactiveDebounce &&
          (ne(), (y = cl(wt, Te.interactiveDebounce))),
        pe.triggerTarget && !Te.triggerTarget
          ? yi(pe.triggerTarget).forEach(function (Re) {
              Re.removeAttribute("aria-expanded");
            })
          : Te.triggerTarget && t.removeAttribute("aria-expanded"),
        M(),
        ee(),
        _ && _(pe, Te),
        v.popperInstance &&
          (mt(),
          Dt().forEach(function (Re) {
            requestAnimationFrame(Re._tippy.popperInstance.forceUpdate);
          })),
        Z("onAfterUpdate", [v, Y]));
    }
  }
  function kn(Y) {
    v.setProps({ content: Y });
  }
  function cr() {
    var Y = v.state.isVisible,
      pe = v.state.isDestroyed,
      Te = !v.state.isEnabled,
      Re = Qn.isTouch && !v.props.touch,
      Oe = ho(v.props.duration, 0, Vn.duration);
    if (
      !(Y || pe || Te || Re) &&
      !K().hasAttribute("disabled") &&
      (Z("onShow", [v], !1), v.props.onShow(v) !== !1)
    ) {
      if (
        ((v.state.isVisible = !0),
        G() && (x.style.visibility = "visible"),
        ee(),
        ke(),
        v.state.isMounted || (x.style.transition = "none"),
        G())
      ) {
        var it = R(),
          Ke = it.box,
          fn = it.content;
        fo([Ke, fn], 0);
      }
      ((p = function () {
        var nn;
        if (!(!v.state.isVisible || u)) {
          if (
            ((u = !0),
            x.offsetHeight,
            (x.style.transition = v.props.moveTransition),
            G() && v.props.animation)
          ) {
            var hr = R(),
              Q = hr.box,
              ge = hr.content;
            (fo([Q, ge], Oe), fl([Q, ge], "visible"));
          }
          (fe(),
            M(),
            dl(po, v),
            (nn = v.popperInstance) == null || nn.forceUpdate(),
            Z("onMount", [v]),
            v.props.animation &&
              G() &&
              Fe(Oe, function () {
                ((v.state.isShown = !0), Z("onShown", [v]));
              }));
        }
      }),
        Mt());
    }
  }
  function Hn() {
    var Y = !v.state.isVisible,
      pe = v.state.isDestroyed,
      Te = !v.state.isEnabled,
      Re = ho(v.props.duration, 1, Vn.duration);
    if (!(Y || pe || Te) && (Z("onHide", [v], !1), v.props.onHide(v) !== !1)) {
      if (
        ((v.state.isVisible = !1),
        (v.state.isShown = !1),
        (u = !1),
        (s = !1),
        G() && (x.style.visibility = "hidden"),
        ne(),
        Ce(),
        ee(!0),
        G())
      ) {
        var Oe = R(),
          it = Oe.box,
          Ke = Oe.content;
        v.props.animation && (fo([it, Ke], Re), fl([it, Ke], "hidden"));
      }
      (fe(), M(), v.props.animation ? G() && Ue(Re, v.unmount) : v.unmount());
    }
  }
  function dr(Y) {
    (le().addEventListener("mousemove", y), dl(Ua, y), y(Y));
  }
  function Sn() {
    (v.state.isVisible && v.hide(),
      v.state.isMounted &&
        (xt(),
        Dt().forEach(function (Y) {
          Y._tippy.unmount();
        }),
        x.parentNode && x.parentNode.removeChild(x),
        (po = po.filter(function (Y) {
          return Y !== v;
        })),
        (v.state.isMounted = !1),
        Z("onHidden", [v])));
  }
  function An() {
    v.state.isDestroyed ||
      (v.clearDelayTimeouts(),
      v.unmount(),
      Et(),
      delete t._tippy,
      (v.state.isDestroyed = !0),
      Z("onDestroy", [v]));
  }
}
function Mn(t, e) {
  e === void 0 && (e = {});
  var n = Vn.plugins.concat(e.plugins || []);
  w1();
  var r = Object.assign({}, e, { plugins: n }),
    i = p1(t),
    a = i.reduce(function (s, o) {
      var l = o && z1(o, r);
      return (l && s.push(l), s);
    }, []);
  return Ws(t) ? a[0] : a;
}
Mn.defaultProps = Vn;
Mn.setDefaultProps = E1;
Mn.currentInput = Qn;
Object.assign({}, wc, {
  effect: function (e) {
    var n = e.state,
      r = {
        popper: {
          position: n.options.strategy,
          left: "0",
          top: "0",
          margin: "0",
        },
        arrow: { position: "absolute" },
        reference: {},
      };
    (Object.assign(n.elements.popper.style, r.popper),
      (n.styles = r),
      n.elements.arrow && Object.assign(n.elements.arrow.style, r.arrow));
  },
});
Mn.setDefaultProps({ render: _c });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var Ln =
    function () {
      return (
        (Ln =
          Object.assign ||
          function (e) {
            for (var n, r = 1, i = arguments.length; r < i; r++) {
              n = arguments[r];
              for (var a in n)
                Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
            }
            return e;
          }),
        Ln.apply(this, arguments)
      );
    },
  D1 = (function () {
    function t(e) {
      ((this.options = e), (this.listeners = {}));
    }
    return (
      (t.prototype.on = function (e, n) {
        var r = this.listeners[e] || [];
        this.listeners[e] = r.concat([n]);
      }),
      (t.prototype.triggerEvent = function (e, n) {
        var r = this,
          i = this.listeners[e] || [];
        i.forEach(function (a) {
          return a({ target: r, event: n });
        });
      }),
      t
    );
  })(),
  Ii;
(function (t) {
  ((t[(t.Add = 0)] = "Add"), (t[(t.Remove = 1)] = "Remove"));
})(Ii || (Ii = {}));
var I1 = (function () {
    function t() {
      this.notifications = [];
    }
    return (
      (t.prototype.push = function (e) {
        (this.notifications.push(e),
          this.updateFn(e, Ii.Add, this.notifications));
      }),
      (t.prototype.splice = function (e, n) {
        var r = this.notifications.splice(e, n)[0];
        return (this.updateFn(r, Ii.Remove, this.notifications), r);
      }),
      (t.prototype.indexOf = function (e) {
        return this.notifications.indexOf(e);
      }),
      (t.prototype.onUpdate = function (e) {
        this.updateFn = e;
      }),
      t
    );
  })(),
  _r;
(function (t) {
  ((t.Dismiss = "dismiss"), (t.Click = "click"));
})(_r || (_r = {}));
var yl = {
    types: [
      {
        type: "success",
        className: "notyf__toast--success",
        backgroundColor: "#3dc763",
        icon: { className: "notyf__icon--success", tagName: "i" },
      },
      {
        type: "error",
        className: "notyf__toast--error",
        backgroundColor: "#ed3d3d",
        icon: { className: "notyf__icon--error", tagName: "i" },
      },
    ],
    duration: 2e3,
    ripple: !0,
    position: { x: "right", y: "bottom" },
    dismissible: !1,
  },
  N1 = (function () {
    function t() {
      ((this.notifications = []),
        (this.events = {}),
        (this.X_POSITION_FLEX_MAP = {
          left: "flex-start",
          center: "center",
          right: "flex-end",
        }),
        (this.Y_POSITION_FLEX_MAP = {
          top: "flex-start",
          center: "center",
          bottom: "flex-end",
        }));
      var e = document.createDocumentFragment(),
        n = this._createHTMLElement({ tagName: "div", className: "notyf" });
      (e.appendChild(n),
        document.body.appendChild(e),
        (this.container = n),
        (this.animationEndEventName = this._getAnimationEndEventName()),
        this._createA11yContainer());
    }
    return (
      (t.prototype.on = function (e, n) {
        var r;
        this.events = Ln(Ln({}, this.events), ((r = {}), (r[e] = n), r));
      }),
      (t.prototype.update = function (e, n) {
        n === Ii.Add
          ? this.addNotification(e)
          : n === Ii.Remove && this.removeNotification(e);
      }),
      (t.prototype.removeNotification = function (e) {
        var n = this,
          r = this._popRenderedNotification(e),
          i;
        if (r) {
          ((i = r.node), i.classList.add("notyf__toast--disappear"));
          var a;
          i.addEventListener(
            this.animationEndEventName,
            (a = function (s) {
              s.target === i &&
                (i.removeEventListener(n.animationEndEventName, a),
                n.container.removeChild(i));
            }),
          );
        }
      }),
      (t.prototype.addNotification = function (e) {
        var n = this._renderNotification(e);
        (this.notifications.push({ notification: e, node: n }),
          this._announce(e.options.message || "Notification"));
      }),
      (t.prototype._renderNotification = function (e) {
        var n,
          r = this._buildNotificationCard(e),
          i = e.options.className;
        return (
          i && (n = r.classList).add.apply(n, i.split(" ")),
          this.container.appendChild(r),
          r
        );
      }),
      (t.prototype._popRenderedNotification = function (e) {
        for (var n = -1, r = 0; r < this.notifications.length && n < 0; r++)
          this.notifications[r].notification === e && (n = r);
        if (n !== -1) return this.notifications.splice(n, 1)[0];
      }),
      (t.prototype.getXPosition = function (e) {
        var n;
        return (
          ((n = e == null ? void 0 : e.position) === null || n === void 0
            ? void 0
            : n.x) || "right"
        );
      }),
      (t.prototype.getYPosition = function (e) {
        var n;
        return (
          ((n = e == null ? void 0 : e.position) === null || n === void 0
            ? void 0
            : n.y) || "bottom"
        );
      }),
      (t.prototype.adjustContainerAlignment = function (e) {
        var n = this.X_POSITION_FLEX_MAP[this.getXPosition(e)],
          r = this.Y_POSITION_FLEX_MAP[this.getYPosition(e)],
          i = this.container.style;
        (i.setProperty("justify-content", r), i.setProperty("align-items", n));
      }),
      (t.prototype._buildNotificationCard = function (e) {
        var n = this,
          r = e.options,
          i = r.icon;
        this.adjustContainerAlignment(r);
        var a = this._createHTMLElement({
            tagName: "div",
            className: "notyf__toast",
          }),
          s = this._createHTMLElement({
            tagName: "div",
            className: "notyf__ripple",
          }),
          o = this._createHTMLElement({
            tagName: "div",
            className: "notyf__wrapper",
          }),
          l = this._createHTMLElement({
            tagName: "div",
            className: "notyf__message",
          });
        l.innerHTML = r.message || "";
        var u = r.background || r.backgroundColor;
        if (i) {
          var h = this._createHTMLElement({
            tagName: "div",
            className: "notyf__icon",
          });
          if (
            ((typeof i == "string" || i instanceof String) &&
              (h.innerHTML = new String(i).valueOf()),
            typeof i == "object")
          ) {
            var d = i.tagName,
              p = d === void 0 ? "i" : d,
              m = i.className,
              y = i.text,
              S = i.color,
              A = S === void 0 ? u : S,
              C = this._createHTMLElement({
                tagName: p,
                className: m,
                text: y,
              });
            (A && (C.style.color = A), h.appendChild(C));
          }
          o.appendChild(h);
        }
        if (
          (o.appendChild(l),
          a.appendChild(o),
          u &&
            (r.ripple
              ? ((s.style.background = u), a.appendChild(s))
              : (a.style.background = u)),
          r.dismissible)
        ) {
          var b = this._createHTMLElement({
              tagName: "div",
              className: "notyf__dismiss",
            }),
            T = this._createHTMLElement({
              tagName: "button",
              className: "notyf__dismiss-btn",
            });
          (b.appendChild(T),
            o.appendChild(b),
            a.classList.add("notyf__toast--dismissible"),
            T.addEventListener("click", function (E) {
              var x, _;
              ((_ = (x = n.events)[_r.Dismiss]) === null ||
                _ === void 0 ||
                _.call(x, { target: e, event: E }),
                E.stopPropagation());
            }));
        }
        a.addEventListener("click", function (E) {
          var x, _;
          return (_ = (x = n.events)[_r.Click]) === null || _ === void 0
            ? void 0
            : _.call(x, { target: e, event: E });
        });
        var v = this.getYPosition(r) === "top" ? "upper" : "lower";
        return (a.classList.add("notyf__toast--" + v), a);
      }),
      (t.prototype._createHTMLElement = function (e) {
        var n = e.tagName,
          r = e.className,
          i = e.text,
          a = document.createElement(n);
        return (r && (a.className = r), (a.textContent = i || null), a);
      }),
      (t.prototype._createA11yContainer = function () {
        var e = this._createHTMLElement({
          tagName: "div",
          className: "notyf-announcer",
        });
        (e.setAttribute("aria-atomic", "true"),
          e.setAttribute("aria-live", "polite"),
          (e.style.border = "0"),
          (e.style.clip = "rect(0 0 0 0)"),
          (e.style.height = "1px"),
          (e.style.margin = "-1px"),
          (e.style.overflow = "hidden"),
          (e.style.padding = "0"),
          (e.style.position = "absolute"),
          (e.style.width = "1px"),
          (e.style.outline = "0"),
          document.body.appendChild(e),
          (this.a11yContainer = e));
      }),
      (t.prototype._announce = function (e) {
        var n = this;
        ((this.a11yContainer.textContent = ""),
          setTimeout(function () {
            n.a11yContainer.textContent = e;
          }, 100));
      }),
      (t.prototype._getAnimationEndEventName = function () {
        var e = document.createElement("_fake"),
          n = {
            MozTransition: "animationend",
            OTransition: "oAnimationEnd",
            WebkitTransition: "webkitAnimationEnd",
            transition: "animationend",
          },
          r;
        for (r in n) if (e.style[r] !== void 0) return n[r];
        return "animationend";
      }),
      t
    );
  })(),
  F1 = (function () {
    function t(e) {
      var n = this;
      ((this.dismiss = this._removeNotification),
        (this.notifications = new I1()),
        (this.view = new N1()));
      var r = this.registerTypes(e);
      ((this.options = Ln(Ln({}, yl), e)),
        (this.options.types = r),
        this.notifications.onUpdate(function (i, a) {
          return n.view.update(i, a);
        }),
        this.view.on(_r.Dismiss, function (i) {
          var a = i.target,
            s = i.event;
          (n._removeNotification(a), a.triggerEvent(_r.Dismiss, s));
        }),
        this.view.on(_r.Click, function (i) {
          var a = i.target,
            s = i.event;
          return a.triggerEvent(_r.Click, s);
        }));
    }
    return (
      (t.prototype.error = function (e) {
        var n = this.normalizeOptions("error", e);
        return this.open(n);
      }),
      (t.prototype.success = function (e) {
        var n = this.normalizeOptions("success", e);
        return this.open(n);
      }),
      (t.prototype.open = function (e) {
        var n =
            this.options.types.find(function (a) {
              var s = a.type;
              return s === e.type;
            }) || {},
          r = Ln(Ln({}, n), e);
        this.assignProps(["ripple", "position", "dismissible"], r);
        var i = new D1(r);
        return (this._pushNotification(i), i);
      }),
      (t.prototype.dismissAll = function () {
        for (; this.notifications.splice(0, 1); );
      }),
      (t.prototype.assignProps = function (e, n) {
        var r = this;
        e.forEach(function (i) {
          n[i] = n[i] == null ? r.options[i] : n[i];
        });
      }),
      (t.prototype._pushNotification = function (e) {
        var n = this;
        this.notifications.push(e);
        var r =
          e.options.duration !== void 0
            ? e.options.duration
            : this.options.duration;
        r &&
          setTimeout(function () {
            return n._removeNotification(e);
          }, r);
      }),
      (t.prototype._removeNotification = function (e) {
        var n = this.notifications.indexOf(e);
        n !== -1 && this.notifications.splice(n, 1);
      }),
      (t.prototype.normalizeOptions = function (e, n) {
        var r = { type: e };
        return (
          typeof n == "string"
            ? (r.message = n)
            : typeof n == "object" && (r = Ln(Ln({}, r), n)),
          r
        );
      }),
      (t.prototype.registerTypes = function (e) {
        var n = ((e && e.types) || []).slice(),
          r = yl.types.map(function (i) {
            var a = -1;
            n.forEach(function (o, l) {
              o.type === i.type && (a = l);
            });
            var s = a !== -1 ? n.splice(a, 1)[0] : {};
            return Ln(Ln({}, i), s);
          });
        return r.concat(n);
      }),
      t
    );
  })(),
  wl = Oc;
function Oc() {
  var t = [].slice.call(arguments),
    e = !1;
  typeof t[0] == "boolean" && (e = t.shift());
  var n = t[0];
  if (xl(n)) throw new Error("extendee must be an object");
  for (var r = t.slice(1), i = r.length, a = 0; a < i; a++) {
    var s = r[a];
    for (var o in s)
      if (Object.prototype.hasOwnProperty.call(s, o)) {
        var l = s[o];
        if (e && _1(l)) {
          var u = Array.isArray(l) ? [] : {};
          n[o] = Oc(
            !0,
            Object.prototype.hasOwnProperty.call(n, o) && !xl(n[o]) ? n[o] : u,
            l,
          );
        } else n[o] = l;
      }
  }
  return n;
}
function _1(t) {
  return Array.isArray(t) || {}.toString.call(t) == "[object Object]";
}
function xl(t) {
  return !t || (typeof t != "object" && typeof t != "function");
}
function O1(t) {
  return t && t.__esModule ? t.default : t;
}
class kl {
  on(e, n) {
    return (
      (this._callbacks = this._callbacks || {}),
      this._callbacks[e] || (this._callbacks[e] = []),
      this._callbacks[e].push(n),
      this
    );
  }
  emit(e, ...n) {
    this._callbacks = this._callbacks || {};
    let r = this._callbacks[e];
    if (r) for (let i of r) i.apply(this, n);
    return (
      this.element &&
        this.element.dispatchEvent(
          this.makeEvent("dropzone:" + e, { args: n }),
        ),
      this
    );
  }
  makeEvent(e, n) {
    let r = { bubbles: !0, cancelable: !0, detail: n };
    if (typeof window.CustomEvent == "function") return new CustomEvent(e, r);
    var i = document.createEvent("CustomEvent");
    return (i.initCustomEvent(e, r.bubbles, r.cancelable, r.detail), i);
  }
  off(e, n) {
    if (!this._callbacks || arguments.length === 0)
      return ((this._callbacks = {}), this);
    let r = this._callbacks[e];
    if (!r) return this;
    if (arguments.length === 1) return (delete this._callbacks[e], this);
    for (let i = 0; i < r.length; i++)
      if (r[i] === n) {
        r.splice(i, 1);
        break;
      }
    return this;
  }
}
var Bc = {};
Bc = `<div class="dz-preview dz-file-preview">
  <div class="dz-image"><img data-dz-thumbnail=""></div>
  <div class="dz-details">
    <div class="dz-size"><span data-dz-size=""></span></div>
    <div class="dz-filename"><span data-dz-name=""></span></div>
  </div>
  <div class="dz-progress">
    <span class="dz-upload" data-dz-uploadprogress=""></span>
  </div>
  <div class="dz-error-message"><span data-dz-errormessage=""></span></div>
  <div class="dz-success-mark">
    <svg width="54" height="54" viewBox="0 0 54 54" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.2071 29.7929L14.2929 25.7071C14.6834 25.3166 15.3166 25.3166 15.7071 25.7071L21.2929 31.2929C21.6834 31.6834 22.3166 31.6834 22.7071 31.2929L38.2929 15.7071C38.6834 15.3166 39.3166 15.3166 39.7071 15.7071L43.7929 19.7929C44.1834 20.1834 44.1834 20.8166 43.7929 21.2071L22.7071 42.2929C22.3166 42.6834 21.6834 42.6834 21.2929 42.2929L10.2071 31.2071C9.81658 30.8166 9.81658 30.1834 10.2071 29.7929Z"></path>
    </svg>
  </div>
  <div class="dz-error-mark">
    <svg width="54" height="54" viewBox="0 0 54 54" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.2929 20.2929L19.2071 13.2071C18.8166 12.8166 18.1834 12.8166 17.7929 13.2071L13.2071 17.7929C12.8166 18.1834 12.8166 18.8166 13.2071 19.2071L20.2929 26.2929C20.6834 26.6834 20.6834 27.3166 20.2929 27.7071L13.2071 34.7929C12.8166 35.1834 12.8166 35.8166 13.2071 36.2071L17.7929 40.7929C18.1834 41.1834 18.8166 41.1834 19.2071 40.7929L26.2929 33.7071C26.6834 33.3166 27.3166 33.3166 27.7071 33.7071L34.7929 40.7929C35.1834 41.1834 35.8166 41.1834 36.2071 40.7929L40.7929 36.2071C41.1834 35.8166 41.1834 35.1834 40.7929 34.7929L33.7071 27.7071C33.3166 27.3166 33.3166 26.6834 33.7071 26.2929L40.7929 19.2071C41.1834 18.8166 41.1834 18.1834 40.7929 17.7929L36.2071 13.2071C35.8166 12.8166 35.1834 12.8166 34.7929 13.2071L27.7071 20.2929C27.3166 20.6834 26.6834 20.6834 26.2929 20.2929Z"></path>
    </svg>
  </div>
</div>
`;
let B1 = {
  url: null,
  method: "post",
  withCredentials: !1,
  timeout: null,
  parallelUploads: 2,
  uploadMultiple: !1,
  chunking: !1,
  forceChunking: !1,
  chunkSize: 2097152,
  parallelChunkUploads: !1,
  retryChunks: !1,
  retryChunksLimit: 3,
  maxFilesize: 256,
  paramName: "file",
  createImageThumbnails: !0,
  maxThumbnailFilesize: 10,
  thumbnailWidth: 120,
  thumbnailHeight: 120,
  thumbnailMethod: "crop",
  resizeWidth: null,
  resizeHeight: null,
  resizeMimeType: null,
  resizeQuality: 0.8,
  resizeMethod: "contain",
  filesizeBase: 1e3,
  maxFiles: null,
  headers: null,
  defaultHeaders: !0,
  clickable: !0,
  ignoreHiddenFiles: !0,
  acceptedFiles: null,
  acceptedMimeTypes: null,
  autoProcessQueue: !0,
  autoQueue: !0,
  addRemoveLinks: !1,
  previewsContainer: null,
  disablePreviews: !1,
  hiddenInputContainer: "body",
  capture: null,
  renameFilename: null,
  renameFile: null,
  forceFallback: !1,
  dictDefaultMessage: "Drop files here to upload",
  dictFallbackMessage:
    "Your browser does not support drag'n'drop file uploads.",
  dictFallbackText:
    "Please use the fallback form below to upload your files like in the olden days.",
  dictFileTooBig:
    "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
  dictInvalidFileType: "You can't upload files of this type.",
  dictResponseError: "Server responded with {{statusCode}} code.",
  dictCancelUpload: "Cancel upload",
  dictUploadCanceled: "Upload canceled.",
  dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
  dictRemoveFile: "Remove file",
  dictRemoveFileConfirmation: null,
  dictMaxFilesExceeded: "You can not upload any more files.",
  dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },
  init() {},
  params(t, e, n) {
    if (n)
      return {
        dzuuid: n.file.upload.uuid,
        dzchunkindex: n.index,
        dztotalfilesize: n.file.size,
        dzchunksize: this.options.chunkSize,
        dztotalchunkcount: n.file.upload.totalChunkCount,
        dzchunkbyteoffset: n.index * this.options.chunkSize,
      };
  },
  accept(t, e) {
    return e();
  },
  chunksUploaded: function (t, e) {
    e();
  },
  binaryBody: !1,
  fallback() {
    let t;
    this.element.className = `${this.element.className} dz-browser-not-supported`;
    for (let n of this.element.getElementsByTagName("div"))
      if (/(^| )dz-message($| )/.test(n.className)) {
        ((t = n), (n.className = "dz-message"));
        break;
      }
    t ||
      ((t = de.createElement('<div class="dz-message"><span></span></div>')),
      this.element.appendChild(t));
    let e = t.getElementsByTagName("span")[0];
    return (
      e &&
        (e.textContent != null
          ? (e.textContent = this.options.dictFallbackMessage)
          : e.innerText != null &&
            (e.innerText = this.options.dictFallbackMessage)),
      this.element.appendChild(this.getFallbackForm())
    );
  },
  resize(t, e, n, r) {
    let i = { srcX: 0, srcY: 0, srcWidth: t.width, srcHeight: t.height },
      a = t.width / t.height;
    (e == null && n == null
      ? ((e = i.srcWidth), (n = i.srcHeight))
      : e == null
        ? (e = n * a)
        : n == null && (n = e / a),
      (e = Math.min(e, i.srcWidth)),
      (n = Math.min(n, i.srcHeight)));
    let s = e / n;
    if (i.srcWidth > e || i.srcHeight > n)
      if (r === "crop")
        a > s
          ? ((i.srcHeight = t.height), (i.srcWidth = i.srcHeight * s))
          : ((i.srcWidth = t.width), (i.srcHeight = i.srcWidth / s));
      else if (r === "contain") a > s ? (n = e / a) : (e = n * a);
      else throw new Error(`Unknown resizeMethod '${r}'`);
    return (
      (i.srcX = (t.width - i.srcWidth) / 2),
      (i.srcY = (t.height - i.srcHeight) / 2),
      (i.trgWidth = e),
      (i.trgHeight = n),
      i
    );
  },
  transformFile(t, e) {
    return (this.options.resizeWidth || this.options.resizeHeight) &&
      t.type.match(/image.*/)
      ? this.resizeImage(
          t,
          this.options.resizeWidth,
          this.options.resizeHeight,
          this.options.resizeMethod,
          e,
        )
      : e(t);
  },
  previewTemplate: O1(Bc),
  drop(t) {
    return this.element.classList.remove("dz-drag-hover");
  },
  dragstart(t) {},
  dragend(t) {
    return this.element.classList.remove("dz-drag-hover");
  },
  dragenter(t) {
    return this.element.classList.add("dz-drag-hover");
  },
  dragover(t) {
    return this.element.classList.add("dz-drag-hover");
  },
  dragleave(t) {
    return this.element.classList.remove("dz-drag-hover");
  },
  paste(t) {},
  reset() {
    return this.element.classList.remove("dz-started");
  },
  addedfile(t) {
    if (
      (this.element === this.previewsContainer &&
        this.element.classList.add("dz-started"),
      this.previewsContainer && !this.options.disablePreviews)
    ) {
      ((t.previewElement = de.createElement(
        this.options.previewTemplate.trim(),
      )),
        (t.previewTemplate = t.previewElement),
        this.previewsContainer.appendChild(t.previewElement));
      for (var e of t.previewElement.querySelectorAll("[data-dz-name]"))
        e.textContent = t.name;
      for (e of t.previewElement.querySelectorAll("[data-dz-size]"))
        e.innerHTML = this.filesize(t.size);
      this.options.addRemoveLinks &&
        ((t._removeLink = de.createElement(
          `<a class="dz-remove" href="javascript:undefined;" data-dz-remove>${this.options.dictRemoveFile}</a>`,
        )),
        t.previewElement.appendChild(t._removeLink));
      let n = (r) => (
        r.preventDefault(),
        r.stopPropagation(),
        t.status === de.UPLOADING
          ? de.confirm(this.options.dictCancelUploadConfirmation, () =>
              this.removeFile(t),
            )
          : this.options.dictRemoveFileConfirmation
            ? de.confirm(this.options.dictRemoveFileConfirmation, () =>
                this.removeFile(t),
              )
            : this.removeFile(t)
      );
      for (let r of t.previewElement.querySelectorAll("[data-dz-remove]"))
        r.addEventListener("click", n);
    }
  },
  removedfile(t) {
    return (
      t.previewElement != null &&
        t.previewElement.parentNode != null &&
        t.previewElement.parentNode.removeChild(t.previewElement),
      this._updateMaxFilesReachedClass()
    );
  },
  thumbnail(t, e) {
    if (t.previewElement) {
      t.previewElement.classList.remove("dz-file-preview");
      for (let n of t.previewElement.querySelectorAll("[data-dz-thumbnail]"))
        ((n.alt = t.name), (n.src = e));
      return setTimeout(
        () => t.previewElement.classList.add("dz-image-preview"),
        1,
      );
    }
  },
  error(t, e) {
    if (t.previewElement) {
      (t.previewElement.classList.add("dz-error"),
        typeof e != "string" && e.error && (e = e.error));
      for (let n of t.previewElement.querySelectorAll("[data-dz-errormessage]"))
        n.textContent = e;
    }
  },
  errormultiple() {},
  processing(t) {
    if (
      t.previewElement &&
      (t.previewElement.classList.add("dz-processing"), t._removeLink)
    )
      return (t._removeLink.innerHTML = this.options.dictCancelUpload);
  },
  processingmultiple() {},
  uploadprogress(t, e, n) {
    if (t.previewElement)
      for (let r of t.previewElement.querySelectorAll(
        "[data-dz-uploadprogress]",
      ))
        r.nodeName === "PROGRESS" ? (r.value = e) : (r.style.width = `${e}%`);
  },
  totaluploadprogress() {},
  sending() {},
  sendingmultiple() {},
  success(t) {
    if (t.previewElement) return t.previewElement.classList.add("dz-success");
  },
  successmultiple() {},
  canceled(t) {
    return this.emit("error", t, this.options.dictUploadCanceled);
  },
  canceledmultiple() {},
  complete(t) {
    if (
      (t._removeLink && (t._removeLink.innerHTML = this.options.dictRemoveFile),
      t.previewElement)
    )
      return t.previewElement.classList.add("dz-complete");
  },
  completemultiple() {},
  maxfilesexceeded() {},
  maxfilesreached() {},
  queuecomplete() {},
  addedfiles() {},
};
var R1 = B1;
class de extends kl {
  static initClass() {
    ((this.prototype.Emitter = kl),
      (this.prototype.events = [
        "drop",
        "dragstart",
        "dragend",
        "dragenter",
        "dragover",
        "dragleave",
        "addedfile",
        "addedfiles",
        "removedfile",
        "thumbnail",
        "error",
        "errormultiple",
        "processing",
        "processingmultiple",
        "uploadprogress",
        "totaluploadprogress",
        "sending",
        "sendingmultiple",
        "success",
        "successmultiple",
        "canceled",
        "canceledmultiple",
        "complete",
        "completemultiple",
        "reset",
        "maxfilesexceeded",
        "maxfilesreached",
        "queuecomplete",
      ]),
      (this.prototype._thumbnailQueue = []),
      (this.prototype._processingThumbnail = !1));
  }
  getAcceptedFiles() {
    return this.files.filter((e) => e.accepted).map((e) => e);
  }
  getRejectedFiles() {
    return this.files.filter((e) => !e.accepted).map((e) => e);
  }
  getFilesWithStatus(e) {
    return this.files.filter((n) => n.status === e).map((n) => n);
  }
  getQueuedFiles() {
    return this.getFilesWithStatus(de.QUEUED);
  }
  getUploadingFiles() {
    return this.getFilesWithStatus(de.UPLOADING);
  }
  getAddedFiles() {
    return this.getFilesWithStatus(de.ADDED);
  }
  getActiveFiles() {
    return this.files
      .filter((e) => e.status === de.UPLOADING || e.status === de.QUEUED)
      .map((e) => e);
  }
  init() {
    if (
      (this.element.tagName === "form" &&
        this.element.setAttribute("enctype", "multipart/form-data"),
      this.element.classList.contains("dropzone") &&
        !this.element.querySelector(".dz-message") &&
        this.element.appendChild(
          de.createElement(
            `<div class="dz-default dz-message"><button class="dz-button" type="button">${this.options.dictDefaultMessage}</button></div>`,
          ),
        ),
      this.clickableElements.length)
    ) {
      let r = () => {
        (this.hiddenFileInput &&
          this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),
          (this.hiddenFileInput = document.createElement("input")),
          this.hiddenFileInput.setAttribute("type", "file"),
          (this.options.maxFiles === null || this.options.maxFiles > 1) &&
            this.hiddenFileInput.setAttribute("multiple", "multiple"),
          (this.hiddenFileInput.className = "dz-hidden-input"),
          this.options.acceptedFiles !== null &&
            this.hiddenFileInput.setAttribute(
              "accept",
              this.options.acceptedFiles,
            ),
          this.options.capture !== null &&
            this.hiddenFileInput.setAttribute("capture", this.options.capture),
          this.hiddenFileInput.setAttribute("tabindex", "-1"),
          (this.hiddenFileInput.style.visibility = "hidden"),
          (this.hiddenFileInput.style.position = "absolute"),
          (this.hiddenFileInput.style.top = "0"),
          (this.hiddenFileInput.style.left = "0"),
          (this.hiddenFileInput.style.height = "0"),
          (this.hiddenFileInput.style.width = "0"),
          de
            .getElement(
              this.options.hiddenInputContainer,
              "hiddenInputContainer",
            )
            .appendChild(this.hiddenFileInput),
          this.hiddenFileInput.addEventListener("change", () => {
            let { files: i } = this.hiddenFileInput;
            if (i.length) for (let a of i) this.addFile(a);
            (this.emit("addedfiles", i), r());
          }));
      };
      r();
    }
    this.URL = window.URL !== null ? window.URL : window.webkitURL;
    for (let r of this.events) this.on(r, this.options[r]);
    (this.on("uploadprogress", () => this.updateTotalUploadProgress()),
      this.on("removedfile", () => this.updateTotalUploadProgress()),
      this.on("canceled", (r) => this.emit("complete", r)),
      this.on("complete", (r) => {
        if (
          this.getAddedFiles().length === 0 &&
          this.getUploadingFiles().length === 0 &&
          this.getQueuedFiles().length === 0
        )
          return setTimeout(() => this.emit("queuecomplete"), 0);
      }));
    const e = function (r) {
      if (r.dataTransfer.types) {
        for (var i = 0; i < r.dataTransfer.types.length; i++)
          if (r.dataTransfer.types[i] === "Files") return !0;
      }
      return !1;
    };
    let n = function (r) {
      if (e(r))
        return (
          r.stopPropagation(),
          r.preventDefault ? r.preventDefault() : (r.returnValue = !1)
        );
    };
    return (
      (this.listeners = [
        {
          element: this.element,
          events: {
            dragstart: (r) => this.emit("dragstart", r),
            dragenter: (r) => (n(r), this.emit("dragenter", r)),
            dragover: (r) => {
              let i;
              try {
                i = r.dataTransfer.effectAllowed;
              } catch {}
              return (
                (r.dataTransfer.dropEffect =
                  i === "move" || i === "linkMove" ? "move" : "copy"),
                n(r),
                this.emit("dragover", r)
              );
            },
            dragleave: (r) => this.emit("dragleave", r),
            drop: (r) => (n(r), this.drop(r)),
            dragend: (r) => this.emit("dragend", r),
          },
        },
      ]),
      this.clickableElements.forEach((r) =>
        this.listeners.push({
          element: r,
          events: {
            click: (i) => (
              (r !== this.element ||
                i.target === this.element ||
                de.elementInside(
                  i.target,
                  this.element.querySelector(".dz-message"),
                )) &&
                this.hiddenFileInput.click(),
              !0
            ),
          },
        }),
      ),
      this.enable(),
      this.options.init.call(this)
    );
  }
  destroy() {
    return (
      this.disable(),
      this.removeAllFiles(!0),
      this.hiddenFileInput != null &&
        this.hiddenFileInput.parentNode &&
        (this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),
        (this.hiddenFileInput = null)),
      delete this.element.dropzone,
      de.instances.splice(de.instances.indexOf(this), 1)
    );
  }
  updateTotalUploadProgress() {
    let e,
      n = 0,
      r = 0;
    if (this.getActiveFiles().length) {
      for (let a of this.getActiveFiles())
        ((n += a.upload.bytesSent), (r += a.upload.total));
      e = (100 * n) / r;
    } else e = 100;
    return this.emit("totaluploadprogress", e, r, n);
  }
  _getParamName(e) {
    return typeof this.options.paramName == "function"
      ? this.options.paramName(e)
      : `${this.options.paramName}${this.options.uploadMultiple ? `[${e}]` : ""}`;
  }
  _renameFile(e) {
    return typeof this.options.renameFile != "function"
      ? e.name
      : this.options.renameFile(e);
  }
  getFallbackForm() {
    let e, n;
    if ((e = this.getExistingFallback())) return e;
    let r = '<div class="dz-fallback">';
    (this.options.dictFallbackText &&
      (r += `<p>${this.options.dictFallbackText}</p>`),
      (r += `<input type="file" name="${this._getParamName(0)}" ${this.options.uploadMultiple ? 'multiple="multiple"' : void 0} /><input type="submit" value="Upload!"></div>`));
    let i = de.createElement(r);
    return (
      this.element.tagName !== "FORM"
        ? ((n = de.createElement(
            `<form action="${this.options.url}" enctype="multipart/form-data" method="${this.options.method}"></form>`,
          )),
          n.appendChild(i))
        : (this.element.setAttribute("enctype", "multipart/form-data"),
          this.element.setAttribute("method", this.options.method)),
      n ?? i
    );
  }
  getExistingFallback() {
    let e = function (r) {
      for (let i of r) if (/(^| )fallback($| )/.test(i.className)) return i;
    };
    for (let r of ["div", "form"]) {
      var n;
      if ((n = e(this.element.getElementsByTagName(r)))) return n;
    }
  }
  setupEventListeners() {
    return this.listeners.map((e) =>
      (() => {
        let n = [];
        for (let r in e.events) {
          let i = e.events[r];
          n.push(e.element.addEventListener(r, i, !1));
        }
        return n;
      })(),
    );
  }
  removeEventListeners() {
    return this.listeners.map((e) =>
      (() => {
        let n = [];
        for (let r in e.events) {
          let i = e.events[r];
          n.push(e.element.removeEventListener(r, i, !1));
        }
        return n;
      })(),
    );
  }
  disable() {
    return (
      this.clickableElements.forEach((e) => e.classList.remove("dz-clickable")),
      this.removeEventListeners(),
      (this.disabled = !0),
      this.files.map((e) => this.cancelUpload(e))
    );
  }
  enable() {
    return (
      delete this.disabled,
      this.clickableElements.forEach((e) => e.classList.add("dz-clickable")),
      this.setupEventListeners()
    );
  }
  filesize(e) {
    let n = 0,
      r = "b";
    if (e > 0) {
      let i = ["tb", "gb", "mb", "kb", "b"];
      for (let a = 0; a < i.length; a++) {
        let s = i[a],
          o = Math.pow(this.options.filesizeBase, 4 - a) / 10;
        if (e >= o) {
          ((n = e / Math.pow(this.options.filesizeBase, 4 - a)), (r = s));
          break;
        }
      }
      n = Math.round(10 * n) / 10;
    }
    return `<strong>${n}</strong> ${this.options.dictFileSizeUnits[r]}`;
  }
  _updateMaxFilesReachedClass() {
    return this.options.maxFiles != null &&
      this.getAcceptedFiles().length >= this.options.maxFiles
      ? (this.getAcceptedFiles().length === this.options.maxFiles &&
          this.emit("maxfilesreached", this.files),
        this.element.classList.add("dz-max-files-reached"))
      : this.element.classList.remove("dz-max-files-reached");
  }
  drop(e) {
    if (!e.dataTransfer) return;
    this.emit("drop", e);
    let n = [];
    for (let r = 0; r < e.dataTransfer.files.length; r++)
      n[r] = e.dataTransfer.files[r];
    if (n.length) {
      let { items: r } = e.dataTransfer;
      r && r.length && r[0].webkitGetAsEntry != null
        ? this._addFilesFromItems(r)
        : this.handleFiles(n);
    }
    this.emit("addedfiles", n);
  }
  paste(e) {
    if ($1(e != null ? e.clipboardData : void 0, (r) => r.items) == null)
      return;
    this.emit("paste", e);
    let { items: n } = e.clipboardData;
    if (n.length) return this._addFilesFromItems(n);
  }
  handleFiles(e) {
    for (let n of e) this.addFile(n);
  }
  _addFilesFromItems(e) {
    return (() => {
      let n = [];
      for (let i of e) {
        var r;
        i.webkitGetAsEntry != null && (r = i.webkitGetAsEntry())
          ? r.isFile
            ? n.push(this.addFile(i.getAsFile()))
            : r.isDirectory
              ? n.push(this._addFilesFromDirectory(r, r.name))
              : n.push(void 0)
          : i.getAsFile != null && (i.kind == null || i.kind === "file")
            ? n.push(this.addFile(i.getAsFile()))
            : n.push(void 0);
      }
      return n;
    })();
  }
  _addFilesFromDirectory(e, n) {
    let r = e.createReader(),
      i = (s) => V1(console, "log", (o) => o.log(s));
    var a = () =>
      r.readEntries((s) => {
        if (s.length > 0) {
          for (let o of s)
            o.isFile
              ? o.file((l) => {
                  if (
                    !(
                      this.options.ignoreHiddenFiles &&
                      l.name.substring(0, 1) === "."
                    )
                  )
                    return ((l.fullPath = `${n}/${l.name}`), this.addFile(l));
                })
              : o.isDirectory &&
                this._addFilesFromDirectory(o, `${n}/${o.name}`);
          a();
        }
        return null;
      }, i);
    return a();
  }
  accept(e, n) {
    this.options.maxFilesize && e.size > this.options.maxFilesize * 1048576
      ? n(
          this.options.dictFileTooBig
            .replace("{{filesize}}", Math.round(e.size / 1024 / 10.24) / 100)
            .replace("{{maxFilesize}}", this.options.maxFilesize),
        )
      : de.isValidFile(e, this.options.acceptedFiles)
        ? this.options.maxFiles != null &&
          this.getAcceptedFiles().length >= this.options.maxFiles
          ? (n(
              this.options.dictMaxFilesExceeded.replace(
                "{{maxFiles}}",
                this.options.maxFiles,
              ),
            ),
            this.emit("maxfilesexceeded", e))
          : this.options.accept.call(this, e, n)
        : n(this.options.dictInvalidFileType);
  }
  addFile(e) {
    ((e.upload = {
      uuid: de.uuidv4(),
      progress: 0,
      total: e.size,
      bytesSent: 0,
      filename: this._renameFile(e),
    }),
      this.files.push(e),
      (e.status = de.ADDED),
      this.emit("addedfile", e),
      this._enqueueThumbnail(e),
      this.accept(e, (n) => {
        (n
          ? ((e.accepted = !1), this._errorProcessing([e], n))
          : ((e.accepted = !0), this.options.autoQueue && this.enqueueFile(e)),
          this._updateMaxFilesReachedClass());
      }));
  }
  enqueueFiles(e) {
    for (let n of e) this.enqueueFile(n);
    return null;
  }
  enqueueFile(e) {
    if (e.status === de.ADDED && e.accepted === !0) {
      if (((e.status = de.QUEUED), this.options.autoProcessQueue))
        return setTimeout(() => this.processQueue(), 0);
    } else
      throw new Error(
        "This file can't be queued because it has already been processed or was rejected.",
      );
  }
  _enqueueThumbnail(e) {
    if (
      this.options.createImageThumbnails &&
      e.type.match(/image.*/) &&
      e.size <= this.options.maxThumbnailFilesize * 1048576
    )
      return (
        this._thumbnailQueue.push(e),
        setTimeout(() => this._processThumbnailQueue(), 0)
      );
  }
  _processThumbnailQueue() {
    if (this._processingThumbnail || this._thumbnailQueue.length === 0) return;
    this._processingThumbnail = !0;
    let e = this._thumbnailQueue.shift();
    return this.createThumbnail(
      e,
      this.options.thumbnailWidth,
      this.options.thumbnailHeight,
      this.options.thumbnailMethod,
      !0,
      (n) => (
        this.emit("thumbnail", e, n),
        (this._processingThumbnail = !1),
        this._processThumbnailQueue()
      ),
    );
  }
  removeFile(e) {
    if (
      (e.status === de.UPLOADING && this.cancelUpload(e),
      (this.files = P1(this.files, e)),
      this.emit("removedfile", e),
      this.files.length === 0)
    )
      return this.emit("reset");
  }
  removeAllFiles(e) {
    e == null && (e = !1);
    for (let n of this.files.slice())
      (n.status !== de.UPLOADING || e) && this.removeFile(n);
    return null;
  }
  resizeImage(e, n, r, i, a) {
    return this.createThumbnail(e, n, r, i, !0, (s, o) => {
      if (o == null) return a(e);
      {
        let { resizeMimeType: l } = this.options;
        l == null && (l = e.type);
        let u = o.toDataURL(l, this.options.resizeQuality);
        return (
          (l === "image/jpeg" || l === "image/jpg") &&
            (u = Rc.restore(e.dataURL, u)),
          a(de.dataURItoBlob(u))
        );
      }
    });
  }
  createThumbnail(e, n, r, i, a, s) {
    let o = new FileReader();
    ((o.onload = () => {
      if (((e.dataURL = o.result), e.type === "image/svg+xml")) {
        s != null && s(o.result);
        return;
      }
      this.createThumbnailFromUrl(e, n, r, i, a, s);
    }),
      o.readAsDataURL(e));
  }
  displayExistingFile(e, n, r, i, a = !0) {
    if ((this.emit("addedfile", e), this.emit("complete", e), !a))
      (this.emit("thumbnail", e, n), r && r());
    else {
      let s = (o) => {
        (this.emit("thumbnail", e, o), r && r());
      };
      ((e.dataURL = n),
        this.createThumbnailFromUrl(
          e,
          this.options.thumbnailWidth,
          this.options.thumbnailHeight,
          this.options.thumbnailMethod,
          this.options.fixOrientation,
          s,
          i,
        ));
    }
  }
  createThumbnailFromUrl(e, n, r, i, a, s, o) {
    let l = document.createElement("img");
    return (
      o && (l.crossOrigin = o),
      (a =
        getComputedStyle(document.body).imageOrientation == "from-image"
          ? !1
          : a),
      (l.onload = () => {
        let u = (h) => h(1);
        return (
          typeof EXIF < "u" &&
            EXIF !== null &&
            a &&
            (u = (h) =>
              EXIF.getData(l, function () {
                return h(EXIF.getTag(this, "Orientation"));
              })),
          u((h) => {
            ((e.width = l.width), (e.height = l.height));
            let d = this.options.resize.call(this, e, n, r, i),
              p = document.createElement("canvas"),
              m = p.getContext("2d");
            switch (
              ((p.width = d.trgWidth),
              (p.height = d.trgHeight),
              h > 4 && ((p.width = d.trgHeight), (p.height = d.trgWidth)),
              h)
            ) {
              case 2:
                (m.translate(p.width, 0), m.scale(-1, 1));
                break;
              case 3:
                (m.translate(p.width, p.height), m.rotate(Math.PI));
                break;
              case 4:
                (m.translate(0, p.height), m.scale(1, -1));
                break;
              case 5:
                (m.rotate(0.5 * Math.PI), m.scale(1, -1));
                break;
              case 6:
                (m.rotate(0.5 * Math.PI), m.translate(0, -p.width));
                break;
              case 7:
                (m.rotate(0.5 * Math.PI),
                  m.translate(p.height, -p.width),
                  m.scale(-1, 1));
                break;
              case 8:
                (m.rotate(-0.5 * Math.PI), m.translate(-p.height, 0));
                break;
            }
            U1(
              m,
              l,
              d.srcX != null ? d.srcX : 0,
              d.srcY != null ? d.srcY : 0,
              d.srcWidth,
              d.srcHeight,
              d.trgX != null ? d.trgX : 0,
              d.trgY != null ? d.trgY : 0,
              d.trgWidth,
              d.trgHeight,
            );
            let y = p.toDataURL("image/png");
            if (s != null) return s(y, p);
          })
        );
      }),
      s != null && (l.onerror = s),
      (l.src = e.dataURL)
    );
  }
  processQueue() {
    let { parallelUploads: e } = this.options,
      n = this.getUploadingFiles().length,
      r = n;
    if (n >= e) return;
    let i = this.getQueuedFiles();
    if (i.length > 0) {
      if (this.options.uploadMultiple)
        return this.processFiles(i.slice(0, e - n));
      for (; r < e; ) {
        if (!i.length) return;
        (this.processFile(i.shift()), r++);
      }
    }
  }
  processFile(e) {
    return this.processFiles([e]);
  }
  processFiles(e) {
    for (let n of e)
      ((n.processing = !0),
        (n.status = de.UPLOADING),
        this.emit("processing", n));
    return (
      this.options.uploadMultiple && this.emit("processingmultiple", e),
      this.uploadFiles(e)
    );
  }
  _getFilesWithXhr(e) {
    return this.files.filter((n) => n.xhr === e).map((n) => n);
  }
  cancelUpload(e) {
    if (e.status === de.UPLOADING) {
      let n = this._getFilesWithXhr(e.xhr);
      for (let r of n) r.status = de.CANCELED;
      typeof e.xhr < "u" && e.xhr.abort();
      for (let r of n) this.emit("canceled", r);
      this.options.uploadMultiple && this.emit("canceledmultiple", n);
    } else
      (e.status === de.ADDED || e.status === de.QUEUED) &&
        ((e.status = de.CANCELED),
        this.emit("canceled", e),
        this.options.uploadMultiple && this.emit("canceledmultiple", [e]));
    if (this.options.autoProcessQueue) return this.processQueue();
  }
  resolveOption(e, ...n) {
    return typeof e == "function" ? e.apply(this, n) : e;
  }
  uploadFile(e) {
    return this.uploadFiles([e]);
  }
  uploadFiles(e) {
    this._transformFiles(e, (n) => {
      if (this.options.chunking) {
        let r = n[0];
        ((e[0].upload.chunked =
          this.options.chunking &&
          (this.options.forceChunking || r.size > this.options.chunkSize)),
          (e[0].upload.totalChunkCount = Math.ceil(
            r.size / this.options.chunkSize,
          )));
      }
      if (e[0].upload.chunked) {
        let r = e[0],
          i = n[0];
        r.upload.chunks = [];
        let a = () => {
          let s = 0;
          for (; r.upload.chunks[s] !== void 0; ) s++;
          if (s >= r.upload.totalChunkCount) return;
          let o = s * this.options.chunkSize,
            l = Math.min(o + this.options.chunkSize, i.size),
            u = {
              name: this._getParamName(0),
              data: i.webkitSlice ? i.webkitSlice(o, l) : i.slice(o, l),
              filename: r.upload.filename,
              chunkIndex: s,
            };
          ((r.upload.chunks[s] = {
            file: r,
            index: s,
            dataBlock: u,
            status: de.UPLOADING,
            progress: 0,
            retries: 0,
          }),
            this._uploadData(e, [u]));
        };
        if (
          ((r.upload.finishedChunkUpload = (s, o) => {
            let l = !0;
            ((s.status = de.SUCCESS),
              (s.dataBlock = null),
              (s.response = s.xhr.responseText),
              (s.responseHeaders = s.xhr.getAllResponseHeaders()),
              (s.xhr = null));
            for (let u = 0; u < r.upload.totalChunkCount; u++) {
              if (r.upload.chunks[u] === void 0) return a();
              r.upload.chunks[u].status !== de.SUCCESS && (l = !1);
            }
            l &&
              this.options.chunksUploaded(r, () => {
                this._finished(e, o, null);
              });
          }),
          this.options.parallelChunkUploads)
        )
          for (let s = 0; s < r.upload.totalChunkCount; s++) a();
        else a();
      } else {
        let r = [];
        for (let i = 0; i < e.length; i++)
          r[i] = {
            name: this._getParamName(i),
            data: n[i],
            filename: e[i].upload.filename,
          };
        this._uploadData(e, r);
      }
    });
  }
  _getChunk(e, n) {
    for (let r = 0; r < e.upload.totalChunkCount; r++)
      if (e.upload.chunks[r] !== void 0 && e.upload.chunks[r].xhr === n)
        return e.upload.chunks[r];
  }
  _uploadData(e, n) {
    let r = new XMLHttpRequest();
    for (let u of e) u.xhr = r;
    e[0].upload.chunked && (e[0].upload.chunks[n[0].chunkIndex].xhr = r);
    let i = this.resolveOption(this.options.method, e, n),
      a = this.resolveOption(this.options.url, e, n);
    (r.open(i, a, !0),
      this.resolveOption(this.options.timeout, e) &&
        (r.timeout = this.resolveOption(this.options.timeout, e)),
      (r.withCredentials = !!this.options.withCredentials),
      (r.onload = (u) => {
        this._finishedUploading(e, r, u);
      }),
      (r.ontimeout = () => {
        this._handleUploadError(
          e,
          r,
          `Request timedout after ${this.options.timeout / 1e3} seconds`,
        );
      }),
      (r.onerror = () => {
        this._handleUploadError(e, r);
      }));
    let o = r.upload != null ? r.upload : r;
    o.onprogress = (u) => this._updateFilesUploadProgress(e, r, u);
    let l = this.options.defaultHeaders
      ? {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          "X-Requested-With": "XMLHttpRequest",
        }
      : {};
    (this.options.binaryBody && (l["Content-Type"] = e[0].type),
      this.options.headers && wl(l, this.options.headers));
    for (let u in l) {
      let h = l[u];
      h && r.setRequestHeader(u, h);
    }
    if (this.options.binaryBody) {
      for (let u of e) this.emit("sending", u, r);
      (this.options.uploadMultiple && this.emit("sendingmultiple", e, r),
        this.submitRequest(r, null, e));
    } else {
      let u = new FormData();
      if (this.options.params) {
        let h = this.options.params;
        typeof h == "function" &&
          (h = h.call(
            this,
            e,
            r,
            e[0].upload.chunked ? this._getChunk(e[0], r) : null,
          ));
        for (let d in h) {
          let p = h[d];
          if (Array.isArray(p))
            for (let m = 0; m < p.length; m++) u.append(d, p[m]);
          else u.append(d, p);
        }
      }
      for (let h of e) this.emit("sending", h, r, u);
      (this.options.uploadMultiple && this.emit("sendingmultiple", e, r, u),
        this._addFormElementData(u));
      for (let h = 0; h < n.length; h++) {
        let d = n[h];
        u.append(d.name, d.data, d.filename);
      }
      this.submitRequest(r, u, e);
    }
  }
  _transformFiles(e, n) {
    let r = [],
      i = 0;
    for (let a = 0; a < e.length; a++)
      this.options.transformFile.call(this, e[a], (s) => {
        ((r[a] = s), ++i === e.length && n(r));
      });
  }
  _addFormElementData(e) {
    if (this.element.tagName === "FORM")
      for (let n of this.element.querySelectorAll(
        "input, textarea, select, button",
      )) {
        let r = n.getAttribute("name"),
          i = n.getAttribute("type");
        if ((i && (i = i.toLowerCase()), !(typeof r > "u" || r === null)))
          if (n.tagName === "SELECT" && n.hasAttribute("multiple"))
            for (let a of n.options) a.selected && e.append(r, a.value);
          else
            (!i || (i !== "checkbox" && i !== "radio") || n.checked) &&
              e.append(r, n.value);
      }
  }
  _updateFilesUploadProgress(e, n, r) {
    if (e[0].upload.chunked) {
      let i = e[0],
        a = this._getChunk(i, n);
      (r
        ? ((a.progress = (100 * r.loaded) / r.total),
          (a.total = r.total),
          (a.bytesSent = r.loaded))
        : ((a.progress = 100), (a.bytesSent = a.total)),
        (i.upload.progress = 0),
        (i.upload.total = 0),
        (i.upload.bytesSent = 0));
      for (let s = 0; s < i.upload.totalChunkCount; s++)
        i.upload.chunks[s] &&
          typeof i.upload.chunks[s].progress < "u" &&
          ((i.upload.progress += i.upload.chunks[s].progress),
          (i.upload.total += i.upload.chunks[s].total),
          (i.upload.bytesSent += i.upload.chunks[s].bytesSent));
      ((i.upload.progress = i.upload.progress / i.upload.totalChunkCount),
        this.emit("uploadprogress", i, i.upload.progress, i.upload.bytesSent));
    } else
      for (let i of e)
        (i.upload.total &&
          i.upload.bytesSent &&
          i.upload.bytesSent == i.upload.total) ||
          (r
            ? ((i.upload.progress = (100 * r.loaded) / r.total),
              (i.upload.total = r.total),
              (i.upload.bytesSent = r.loaded))
            : ((i.upload.progress = 100),
              (i.upload.bytesSent = i.upload.total)),
          this.emit(
            "uploadprogress",
            i,
            i.upload.progress,
            i.upload.bytesSent,
          ));
  }
  _finishedUploading(e, n, r) {
    let i;
    if (e[0].status !== de.CANCELED && n.readyState === 4) {
      if (
        n.responseType !== "arraybuffer" &&
        n.responseType !== "blob" &&
        ((i = n.responseText),
        n.getResponseHeader("content-type") &&
          ~n.getResponseHeader("content-type").indexOf("application/json"))
      )
        try {
          i = JSON.parse(i);
        } catch (a) {
          ((r = a), (i = "Invalid JSON response from server."));
        }
      (this._updateFilesUploadProgress(e, n),
        200 <= n.status && n.status < 300
          ? e[0].upload.chunked
            ? e[0].upload.finishedChunkUpload(this._getChunk(e[0], n), i)
            : this._finished(e, i, r)
          : this._handleUploadError(e, n, i));
    }
  }
  _handleUploadError(e, n, r) {
    if (e[0].status !== de.CANCELED) {
      if (e[0].upload.chunked && this.options.retryChunks) {
        let i = this._getChunk(e[0], n);
        if (i.retries++ < this.options.retryChunksLimit) {
          this._uploadData(e, [i.dataBlock]);
          return;
        } else console.warn("Retried this chunk too often. Giving up.");
      }
      this._errorProcessing(
        e,
        r || this.options.dictResponseError.replace("{{statusCode}}", n.status),
        n,
      );
    }
  }
  submitRequest(e, n, r) {
    if (e.readyState != 1) {
      console.warn(
        "Cannot send this request because the XMLHttpRequest.readyState is not OPENED.",
      );
      return;
    }
    if (this.options.binaryBody)
      if (r[0].upload.chunked) {
        const i = this._getChunk(r[0], e);
        e.send(i.dataBlock.data);
      } else e.send(r[0]);
    else e.send(n);
  }
  _finished(e, n, r) {
    for (let i of e)
      ((i.status = de.SUCCESS),
        this.emit("success", i, n, r),
        this.emit("complete", i));
    if (
      (this.options.uploadMultiple &&
        (this.emit("successmultiple", e, n, r),
        this.emit("completemultiple", e)),
      this.options.autoProcessQueue)
    )
      return this.processQueue();
  }
  _errorProcessing(e, n, r) {
    for (let i of e)
      ((i.status = de.ERROR),
        this.emit("error", i, n, r),
        this.emit("complete", i));
    if (
      (this.options.uploadMultiple &&
        (this.emit("errormultiple", e, n, r), this.emit("completemultiple", e)),
      this.options.autoProcessQueue)
    )
      return this.processQueue();
  }
  static uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (e) {
        let n = (Math.random() * 16) | 0;
        return (e === "x" ? n : (n & 3) | 8).toString(16);
      },
    );
  }
  constructor(e, n) {
    super();
    let r, i;
    if (
      ((this.element = e),
      (this.clickableElements = []),
      (this.listeners = []),
      (this.files = []),
      typeof this.element == "string" &&
        (this.element = document.querySelector(this.element)),
      !this.element || this.element.nodeType == null)
    )
      throw new Error("Invalid dropzone element.");
    if (this.element.dropzone) throw new Error("Dropzone already attached.");
    (de.instances.push(this), (this.element.dropzone = this));
    let a = (i = de.optionsForElement(this.element)) != null ? i : {};
    if (
      ((this.options = wl(!0, {}, R1, a, n ?? {})),
      (this.options.previewTemplate = this.options.previewTemplate.replace(
        /\n*/g,
        "",
      )),
      this.options.forceFallback || !de.isBrowserSupported())
    )
      return this.options.fallback.call(this);
    if (
      (this.options.url == null &&
        (this.options.url = this.element.getAttribute("action")),
      !this.options.url)
    )
      throw new Error("No URL provided.");
    if (this.options.acceptedFiles && this.options.acceptedMimeTypes)
      throw new Error(
        "You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.",
      );
    if (this.options.uploadMultiple && this.options.chunking)
      throw new Error("You cannot set both: uploadMultiple and chunking.");
    if (this.options.binaryBody && this.options.uploadMultiple)
      throw new Error("You cannot set both: binaryBody and uploadMultiple.");
    (this.options.acceptedMimeTypes &&
      ((this.options.acceptedFiles = this.options.acceptedMimeTypes),
      delete this.options.acceptedMimeTypes),
      this.options.renameFilename != null &&
        (this.options.renameFile = (s) =>
          this.options.renameFilename.call(this, s.name, s)),
      typeof this.options.method == "string" &&
        (this.options.method = this.options.method.toUpperCase()),
      (r = this.getExistingFallback()) &&
        r.parentNode &&
        r.parentNode.removeChild(r),
      this.options.previewsContainer !== !1 &&
        (this.options.previewsContainer
          ? (this.previewsContainer = de.getElement(
              this.options.previewsContainer,
              "previewsContainer",
            ))
          : (this.previewsContainer = this.element)),
      this.options.clickable &&
        (this.options.clickable === !0
          ? (this.clickableElements = [this.element])
          : (this.clickableElements = de.getElements(
              this.options.clickable,
              "clickable",
            ))),
      this.init());
  }
}
de.initClass();
de.options = {};
de.optionsForElement = function (t) {
  if (t.getAttribute("id")) return de.options[H1(t.getAttribute("id"))];
};
de.instances = [];
de.forElement = function (t) {
  if (
    (typeof t == "string" && (t = document.querySelector(t)),
    (t != null ? t.dropzone : void 0) == null)
  )
    throw new Error(
      "No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.",
    );
  return t.dropzone;
};
de.discover = function () {
  let t;
  if (document.querySelectorAll) t = document.querySelectorAll(".dropzone");
  else {
    t = [];
    let e = (n) =>
      (() => {
        let r = [];
        for (let i of n)
          /(^| )dropzone($| )/.test(i.className)
            ? r.push(t.push(i))
            : r.push(void 0);
        return r;
      })();
    (e(document.getElementsByTagName("div")),
      e(document.getElementsByTagName("form")));
  }
  return (() => {
    let e = [];
    for (let n of t)
      de.optionsForElement(n) !== !1 ? e.push(new de(n)) : e.push(void 0);
    return e;
  })();
};
de.blockedBrowsers = [/opera.*(Macintosh|Windows Phone).*version\/12/i];
de.isBrowserSupported = function () {
  let t = !0;
  if (
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob &&
    window.FormData &&
    document.querySelector
  )
    if (!("classList" in document.createElement("a"))) t = !1;
    else {
      de.blacklistedBrowsers !== void 0 &&
        (de.blockedBrowsers = de.blacklistedBrowsers);
      for (let e of de.blockedBrowsers)
        if (e.test(navigator.userAgent)) {
          t = !1;
          continue;
        }
    }
  else t = !1;
  return t;
};
de.dataURItoBlob = function (t) {
  let e = atob(t.split(",")[1]),
    n = t.split(",")[0].split(":")[1].split(";")[0],
    r = new ArrayBuffer(e.length),
    i = new Uint8Array(r);
  for (let a = 0, s = e.length, o = 0 <= s; o ? a <= s : a >= s; o ? a++ : a--)
    i[a] = e.charCodeAt(a);
  return new Blob([r], { type: n });
};
const P1 = (t, e) => t.filter((n) => n !== e).map((n) => n),
  H1 = (t) => t.replace(/[\-_](\w)/g, (e) => e.charAt(1).toUpperCase());
de.createElement = function (t) {
  let e = document.createElement("div");
  return ((e.innerHTML = t), e.childNodes[0]);
};
de.elementInside = function (t, e) {
  if (t === e) return !0;
  for (; (t = t.parentNode); ) if (t === e) return !0;
  return !1;
};
de.getElement = function (t, e) {
  let n;
  if (
    (typeof t == "string"
      ? (n = document.querySelector(t))
      : t.nodeType != null && (n = t),
    n == null)
  )
    throw new Error(
      `Invalid \`${e}\` option provided. Please provide a CSS selector or a plain HTML element.`,
    );
  return n;
};
de.getElements = function (t, e) {
  let n, r;
  if (t instanceof Array) {
    r = [];
    try {
      for (n of t) r.push(this.getElement(n, e));
    } catch {
      r = null;
    }
  } else if (typeof t == "string") {
    r = [];
    for (n of document.querySelectorAll(t)) r.push(n);
  } else t.nodeType != null && (r = [t]);
  if (r == null || !r.length)
    throw new Error(
      `Invalid \`${e}\` option provided. Please provide a CSS selector, a plain HTML element or a list of those.`,
    );
  return r;
};
de.confirm = function (t, e, n) {
  if (window.confirm(t)) return e();
  if (n != null) return n();
};
de.isValidFile = function (t, e) {
  if (!e) return !0;
  e = e.split(",");
  let n = t.type,
    r = n.replace(/\/.*$/, "");
  for (let i of e)
    if (((i = i.trim()), i.charAt(0) === ".")) {
      if (
        t.name
          .toLowerCase()
          .indexOf(i.toLowerCase(), t.name.length - i.length) !== -1
      )
        return !0;
    } else if (/\/\*$/.test(i)) {
      if (r === i.replace(/\/.*$/, "")) return !0;
    } else if (n === i) return !0;
  return !1;
};
typeof jQuery < "u" &&
  jQuery !== null &&
  (jQuery.fn.dropzone = function (t) {
    return this.each(function () {
      return new de(this, t);
    });
  });
de.ADDED = "added";
de.QUEUED = "queued";
de.ACCEPTED = de.QUEUED;
de.UPLOADING = "uploading";
de.PROCESSING = de.UPLOADING;
de.CANCELED = "canceled";
de.ERROR = "error";
de.SUCCESS = "success";
let q1 = function (t) {
  t.naturalWidth;
  let e = t.naturalHeight,
    n = document.createElement("canvas");
  ((n.width = 1), (n.height = e));
  let r = n.getContext("2d");
  r.drawImage(t, 0, 0);
  let { data: i } = r.getImageData(1, 0, 1, e),
    a = 0,
    s = e,
    o = e;
  for (; o > a; )
    (i[(o - 1) * 4 + 3] === 0 ? (s = o) : (a = o), (o = (s + a) >> 1));
  let l = o / e;
  return l === 0 ? 1 : l;
};
var U1 = function (t, e, n, r, i, a, s, o, l, u) {
  let h = q1(e);
  return t.drawImage(e, n, r, i, a, s, o, l, u / h);
};
class Rc {
  static initClass() {
    this.KEY_STR =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  }
  static encode64(e) {
    let n = "",
      r,
      i,
      a = "",
      s,
      o,
      l,
      u = "",
      h = 0;
    for (
      ;
      (r = e[h++]),
        (i = e[h++]),
        (a = e[h++]),
        (s = r >> 2),
        (o = ((r & 3) << 4) | (i >> 4)),
        (l = ((i & 15) << 2) | (a >> 6)),
        (u = a & 63),
        isNaN(i) ? (l = u = 64) : isNaN(a) && (u = 64),
        (n =
          n +
          this.KEY_STR.charAt(s) +
          this.KEY_STR.charAt(o) +
          this.KEY_STR.charAt(l) +
          this.KEY_STR.charAt(u)),
        (r = i = a = ""),
        (s = o = l = u = ""),
        h < e.length;

    );
    return n;
  }
  static restore(e, n) {
    if (!e.match("data:image/jpeg;base64,")) return n;
    let r = this.decode64(e.replace("data:image/jpeg;base64,", "")),
      i = this.slice2Segments(r),
      a = this.exifManipulation(n, i);
    return `data:image/jpeg;base64,${this.encode64(a)}`;
  }
  static exifManipulation(e, n) {
    let r = this.getExifArray(n),
      i = this.insertExif(e, r);
    return new Uint8Array(i);
  }
  static getExifArray(e) {
    let n,
      r = 0;
    for (; r < e.length; ) {
      if (((n = e[r]), (n[0] === 255) & (n[1] === 225))) return n;
      r++;
    }
    return [];
  }
  static insertExif(e, n) {
    let r = e.replace("data:image/jpeg;base64,", ""),
      i = this.decode64(r),
      a = i.indexOf(255, 3),
      s = i.slice(0, a),
      o = i.slice(a),
      l = s;
    return ((l = l.concat(n)), (l = l.concat(o)), l);
  }
  static slice2Segments(e) {
    let n = 0,
      r = [];
    for (;;) {
      var i;
      if ((e[n] === 255) & (e[n + 1] === 218)) break;
      if ((e[n] === 255) & (e[n + 1] === 216)) n += 2;
      else {
        i = e[n + 2] * 256 + e[n + 3];
        let a = n + i + 2,
          s = e.slice(n, a);
        (r.push(s), (n = a));
      }
      if (n > e.length) break;
    }
    return r;
  }
  static decode64(e) {
    let n,
      r,
      i = "",
      a,
      s,
      o,
      l = "",
      u = 0,
      h = [];
    for (
      /[^A-Za-z0-9\+\/\=]/g.exec(e) &&
        console.warn(`There were invalid base64 characters in the input text.
Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='
Expect errors in decoding.`),
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      (a = this.KEY_STR.indexOf(e.charAt(u++))),
        (s = this.KEY_STR.indexOf(e.charAt(u++))),
        (o = this.KEY_STR.indexOf(e.charAt(u++))),
        (l = this.KEY_STR.indexOf(e.charAt(u++))),
        (n = (a << 2) | (s >> 4)),
        (r = ((s & 15) << 4) | (o >> 2)),
        (i = ((o & 3) << 6) | l),
        h.push(n),
        o !== 64 && h.push(r),
        l !== 64 && h.push(i),
        (n = r = i = ""),
        (a = s = o = l = ""),
        u < e.length;

    );
    return h;
  }
}
Rc.initClass();
function $1(t, e) {
  return typeof t < "u" && t !== null ? e(t) : void 0;
}
function V1(t, e, n) {
  if (typeof t < "u" && t !== null && typeof t[e] == "function") return n(t, e);
}
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */ const {
  entries: Pc,
  setPrototypeOf: Sl,
  isFrozen: j1,
  getPrototypeOf: W1,
  getOwnPropertyDescriptor: G1,
} = Object;
let { freeze: Jt, seal: Rn, create: Hc } = Object,
  { apply: Qo, construct: Zo } = typeof Reflect < "u" && Reflect;
Jt ||
  (Jt = function (e) {
    return e;
  });
Rn ||
  (Rn = function (e) {
    return e;
  });
Qo ||
  (Qo = function (e, n, r) {
    return e.apply(n, r);
  });
Zo ||
  (Zo = function (e, n) {
    return new e(...n);
  });
const $a = en(Array.prototype.forEach),
  Y1 = en(Array.prototype.lastIndexOf),
  Al = en(Array.prototype.pop),
  Yi = en(Array.prototype.push),
  X1 = en(Array.prototype.splice),
  cs = en(String.prototype.toLowerCase),
  go = en(String.prototype.toString),
  Tl = en(String.prototype.match),
  Xi = en(String.prototype.replace),
  K1 = en(String.prototype.indexOf),
  Q1 = en(String.prototype.trim),
  Un = en(Object.prototype.hasOwnProperty),
  Gt = en(RegExp.prototype.test),
  Ki = Z1(TypeError);
function en(t) {
  return function (e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (
      var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1;
      i < n;
      i++
    )
      r[i - 1] = arguments[i];
    return Qo(t, e, r);
  };
}
function Z1(t) {
  return function () {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return Zo(t, n);
  };
}
function qe(t, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : cs;
  Sl && Sl(t, null);
  let r = e.length;
  for (; r--; ) {
    let i = e[r];
    if (typeof i == "string") {
      const a = n(i);
      a !== i && (j1(e) || (e[r] = a), (i = a));
    }
    t[i] = !0;
  }
  return t;
}
function J1(t) {
  for (let e = 0; e < t.length; e++) Un(t, e) || (t[e] = null);
  return t;
}
function mr(t) {
  const e = Hc(null);
  for (const [n, r] of Pc(t))
    Un(t, n) &&
      (Array.isArray(r)
        ? (e[n] = J1(r))
        : r && typeof r == "object" && r.constructor === Object
          ? (e[n] = mr(r))
          : (e[n] = r));
  return e;
}
function Qi(t, e) {
  for (; t !== null; ) {
    const r = G1(t, e);
    if (r) {
      if (r.get) return en(r.get);
      if (typeof r.value == "function") return en(r.value);
    }
    t = W1(t);
  }
  function n() {
    return null;
  }
  return n;
}
const El = Jt([
    "a",
    "abbr",
    "acronym",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "content",
    "data",
    "datalist",
    "dd",
    "decorator",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "element",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meter",
    "nav",
    "nobr",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "section",
    "select",
    "shadow",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
  ]),
  vo = Jt([
    "svg",
    "a",
    "altglyph",
    "altglyphdef",
    "altglyphitem",
    "animatecolor",
    "animatemotion",
    "animatetransform",
    "circle",
    "clippath",
    "defs",
    "desc",
    "ellipse",
    "filter",
    "font",
    "g",
    "glyph",
    "glyphref",
    "hkern",
    "image",
    "line",
    "lineargradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialgradient",
    "rect",
    "stop",
    "style",
    "switch",
    "symbol",
    "text",
    "textpath",
    "title",
    "tref",
    "tspan",
    "view",
    "vkern",
  ]),
  bo = Jt([
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
  ]),
  em = Jt([
    "animate",
    "color-profile",
    "cursor",
    "discard",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignobject",
    "hatch",
    "hatchpath",
    "mesh",
    "meshgradient",
    "meshpatch",
    "meshrow",
    "missing-glyph",
    "script",
    "set",
    "solidcolor",
    "unknown",
    "use",
  ]),
  yo = Jt([
    "math",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mglyph",
    "mi",
    "mlabeledtr",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mspace",
    "msqrt",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "mprescripts",
  ]),
  tm = Jt([
    "maction",
    "maligngroup",
    "malignmark",
    "mlongdiv",
    "mscarries",
    "mscarry",
    "msgroup",
    "mstack",
    "msline",
    "msrow",
    "semantics",
    "annotation",
    "annotation-xml",
    "mprescripts",
    "none",
  ]),
  Cl = Jt(["#text"]),
  Ll = Jt([
    "accept",
    "action",
    "align",
    "alt",
    "autocapitalize",
    "autocomplete",
    "autopictureinpicture",
    "autoplay",
    "background",
    "bgcolor",
    "border",
    "capture",
    "cellpadding",
    "cellspacing",
    "checked",
    "cite",
    "class",
    "clear",
    "color",
    "cols",
    "colspan",
    "controls",
    "controlslist",
    "coords",
    "crossorigin",
    "datetime",
    "decoding",
    "default",
    "dir",
    "disabled",
    "disablepictureinpicture",
    "disableremoteplayback",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "face",
    "for",
    "headers",
    "height",
    "hidden",
    "high",
    "href",
    "hreflang",
    "id",
    "inputmode",
    "integrity",
    "ismap",
    "kind",
    "label",
    "lang",
    "list",
    "loading",
    "loop",
    "low",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "minlength",
    "multiple",
    "muted",
    "name",
    "nonce",
    "noshade",
    "novalidate",
    "nowrap",
    "open",
    "optimum",
    "pattern",
    "placeholder",
    "playsinline",
    "popover",
    "popovertarget",
    "popovertargetaction",
    "poster",
    "preload",
    "pubdate",
    "radiogroup",
    "readonly",
    "rel",
    "required",
    "rev",
    "reversed",
    "role",
    "rows",
    "rowspan",
    "spellcheck",
    "scope",
    "selected",
    "shape",
    "size",
    "sizes",
    "span",
    "srclang",
    "start",
    "src",
    "srcset",
    "step",
    "style",
    "summary",
    "tabindex",
    "title",
    "translate",
    "type",
    "usemap",
    "valign",
    "value",
    "width",
    "wrap",
    "xmlns",
    "slot",
  ]),
  wo = Jt([
    "accent-height",
    "accumulate",
    "additive",
    "alignment-baseline",
    "amplitude",
    "ascent",
    "attributename",
    "attributetype",
    "azimuth",
    "basefrequency",
    "baseline-shift",
    "begin",
    "bias",
    "by",
    "class",
    "clip",
    "clippathunits",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "cx",
    "cy",
    "d",
    "dx",
    "dy",
    "diffuseconstant",
    "direction",
    "display",
    "divisor",
    "dur",
    "edgemode",
    "elevation",
    "end",
    "exponent",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterunits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "fx",
    "fy",
    "g1",
    "g2",
    "glyph-name",
    "glyphref",
    "gradientunits",
    "gradienttransform",
    "height",
    "href",
    "id",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kerning",
    "keypoints",
    "keysplines",
    "keytimes",
    "lang",
    "lengthadjust",
    "letter-spacing",
    "kernelmatrix",
    "kernelunitlength",
    "lighting-color",
    "local",
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerheight",
    "markerunits",
    "markerwidth",
    "maskcontentunits",
    "maskunits",
    "max",
    "mask",
    "media",
    "method",
    "mode",
    "min",
    "name",
    "numoctaves",
    "offset",
    "operator",
    "opacity",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "paint-order",
    "path",
    "pathlength",
    "patterncontentunits",
    "patterntransform",
    "patternunits",
    "points",
    "preservealpha",
    "preserveaspectratio",
    "primitiveunits",
    "r",
    "rx",
    "ry",
    "radius",
    "refx",
    "refy",
    "repeatcount",
    "repeatdur",
    "restart",
    "result",
    "rotate",
    "scale",
    "seed",
    "shape-rendering",
    "slope",
    "specularconstant",
    "specularexponent",
    "spreadmethod",
    "startoffset",
    "stddeviation",
    "stitchtiles",
    "stop-color",
    "stop-opacity",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke",
    "stroke-width",
    "style",
    "surfacescale",
    "systemlanguage",
    "tabindex",
    "tablevalues",
    "targetx",
    "targety",
    "transform",
    "transform-origin",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "textlength",
    "type",
    "u1",
    "u2",
    "unicode",
    "values",
    "viewbox",
    "visibility",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "width",
    "word-spacing",
    "wrap",
    "writing-mode",
    "xchannelselector",
    "ychannelselector",
    "x",
    "x1",
    "x2",
    "xmlns",
    "y",
    "y1",
    "y2",
    "z",
    "zoomandpan",
  ]),
  Ml = Jt([
    "accent",
    "accentunder",
    "align",
    "bevelled",
    "close",
    "columnsalign",
    "columnlines",
    "columnspan",
    "denomalign",
    "depth",
    "dir",
    "display",
    "displaystyle",
    "encoding",
    "fence",
    "frame",
    "height",
    "href",
    "id",
    "largeop",
    "length",
    "linethickness",
    "lspace",
    "lquote",
    "mathbackground",
    "mathcolor",
    "mathsize",
    "mathvariant",
    "maxsize",
    "minsize",
    "movablelimits",
    "notation",
    "numalign",
    "open",
    "rowalign",
    "rowlines",
    "rowspacing",
    "rowspan",
    "rspace",
    "rquote",
    "scriptlevel",
    "scriptminsize",
    "scriptsizemultiplier",
    "selection",
    "separator",
    "separators",
    "stretchy",
    "subscriptshift",
    "supscriptshift",
    "symmetric",
    "voffset",
    "width",
    "xmlns",
  ]),
  Va = Jt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
  nm = Rn(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
  rm = Rn(/<%[\w\W]*|[\w\W]*%>/gm),
  im = Rn(/\$\{[\w\W]*/gm),
  am = Rn(/^data-[\-\w.\u00B7-\uFFFF]+$/),
  sm = Rn(/^aria-[\-\w]+$/),
  qc = Rn(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ),
  om = Rn(/^(?:\w+script|data):/i),
  lm = Rn(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
  Uc = Rn(/^html$/i),
  um = Rn(/^[a-z][.\w]*(-[.\w]+)+$/i);
var zl = Object.freeze({
  __proto__: null,
  ARIA_ATTR: sm,
  ATTR_WHITESPACE: lm,
  CUSTOM_ELEMENT: um,
  DATA_ATTR: am,
  DOCTYPE_NAME: Uc,
  ERB_EXPR: rm,
  IS_ALLOWED_URI: qc,
  IS_SCRIPT_OR_DATA: om,
  MUSTACHE_EXPR: nm,
  TMPLIT_EXPR: im,
});
const Zi = {
    element: 1,
    text: 3,
    progressingInstruction: 7,
    comment: 8,
    document: 9,
  },
  cm = function () {
    return typeof window > "u" ? null : window;
  },
  dm = function (e, n) {
    if (typeof e != "object" || typeof e.createPolicy != "function")
      return null;
    let r = null;
    const i = "data-tt-policy-suffix";
    n && n.hasAttribute(i) && (r = n.getAttribute(i));
    const a = "dompurify" + (r ? "#" + r : "");
    try {
      return e.createPolicy(a, {
        createHTML(s) {
          return s;
        },
        createScriptURL(s) {
          return s;
        },
      });
    } catch {
      return (
        console.warn("TrustedTypes policy " + a + " could not be created."),
        null
      );
    }
  },
  Dl = function () {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: [],
    };
  };
function $c() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : cm();
  const e = (Ae) => $c(Ae);
  if (
    ((e.version = "3.2.6"),
    (e.removed = []),
    !t || !t.document || t.document.nodeType !== Zi.document || !t.Element)
  )
    return ((e.isSupported = !1), e);
  let { document: n } = t;
  const r = n,
    i = r.currentScript,
    {
      DocumentFragment: a,
      HTMLTemplateElement: s,
      Node: o,
      Element: l,
      NodeFilter: u,
      NamedNodeMap: h = t.NamedNodeMap || t.MozNamedAttrMap,
      HTMLFormElement: d,
      DOMParser: p,
      trustedTypes: m,
    } = t,
    y = l.prototype,
    S = Qi(y, "cloneNode"),
    A = Qi(y, "remove"),
    C = Qi(y, "nextSibling"),
    b = Qi(y, "childNodes"),
    T = Qi(y, "parentNode");
  if (typeof s == "function") {
    const Ae = n.createElement("template");
    Ae.content && Ae.content.ownerDocument && (n = Ae.content.ownerDocument);
  }
  let v,
    E = "";
  const {
      implementation: x,
      createNodeIterator: _,
      createDocumentFragment: j,
      getElementsByTagName: F,
    } = n,
    { importNode: O } = r;
  let $ = Dl();
  e.isSupported =
    typeof Pc == "function" &&
    typeof T == "function" &&
    x &&
    x.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: G,
    ERB_EXPR: K,
    TMPLIT_EXPR: le,
    DATA_ATTR: R,
    ARIA_ATTR: he,
    IS_SCRIPT_OR_DATA: ee,
    ATTR_WHITESPACE: Z,
    CUSTOM_ELEMENT: fe,
  } = zl;
  let { IS_ALLOWED_URI: M } = zl,
    ne = null;
  const xe = qe({}, [...El, ...vo, ...bo, ...yo, ...Cl]);
  let z = null;
  const De = qe({}, [...Ll, ...wo, ...Ml, ...Va]);
  let ke = Object.seal(
      Hc(null, {
        tagNameCheck: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: null,
        },
        attributeNameCheck: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: null,
        },
        allowCustomizedBuiltInElements: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: !1,
        },
      }),
    ),
    Ce = null,
    Ue = null,
    Fe = !0,
    We = !0,
    je = !1,
    lt = !0,
    Et = !1,
    ht = !0,
    wt = !1,
    ut = !1,
    _t = !1,
    ft = !1,
    mt = !1,
    xt = !1,
    Mt = !0,
    Dt = !1;
  const xn = "user-content-";
  let Ot = !0,
    Bt = !1,
    Rt = {},
    Pt = null;
  const Ht = qe({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp",
  ]);
  let kn = null;
  const cr = qe({}, ["audio", "video", "img", "source", "image", "track"]);
  let Hn = null;
  const dr = qe({}, [
      "alt",
      "class",
      "for",
      "id",
      "label",
      "name",
      "pattern",
      "placeholder",
      "role",
      "summary",
      "title",
      "value",
      "style",
      "xmlns",
    ]),
    Sn = "http://www.w3.org/1998/Math/MathML",
    An = "http://www.w3.org/2000/svg",
    Y = "http://www.w3.org/1999/xhtml";
  let pe = Y,
    Te = !1,
    Re = null;
  const Oe = qe({}, [Sn, An, Y], go);
  let it = qe({}, ["mi", "mo", "mn", "ms", "mtext"]),
    Ke = qe({}, ["annotation-xml"]);
  const fn = qe({}, ["title", "style", "font", "a", "script"]);
  let Tn = null;
  const nn = ["application/xhtml+xml", "text/html"],
    hr = "text/html";
  let Q = null,
    ge = null;
  const ct = n.createElement("form"),
    kt = function (H) {
      return H instanceof RegExp || H instanceof Function;
    },
    pt = function () {
      let H =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (!(ge && ge === H)) {
        if (
          ((!H || typeof H != "object") && (H = {}),
          (H = mr(H)),
          (Tn =
            nn.indexOf(H.PARSER_MEDIA_TYPE) === -1 ? hr : H.PARSER_MEDIA_TYPE),
          (Q = Tn === "application/xhtml+xml" ? go : cs),
          (ne = Un(H, "ALLOWED_TAGS") ? qe({}, H.ALLOWED_TAGS, Q) : xe),
          (z = Un(H, "ALLOWED_ATTR") ? qe({}, H.ALLOWED_ATTR, Q) : De),
          (Re = Un(H, "ALLOWED_NAMESPACES")
            ? qe({}, H.ALLOWED_NAMESPACES, go)
            : Oe),
          (Hn = Un(H, "ADD_URI_SAFE_ATTR")
            ? qe(mr(dr), H.ADD_URI_SAFE_ATTR, Q)
            : dr),
          (kn = Un(H, "ADD_DATA_URI_TAGS")
            ? qe(mr(cr), H.ADD_DATA_URI_TAGS, Q)
            : cr),
          (Pt = Un(H, "FORBID_CONTENTS") ? qe({}, H.FORBID_CONTENTS, Q) : Ht),
          (Ce = Un(H, "FORBID_TAGS") ? qe({}, H.FORBID_TAGS, Q) : mr({})),
          (Ue = Un(H, "FORBID_ATTR") ? qe({}, H.FORBID_ATTR, Q) : mr({})),
          (Rt = Un(H, "USE_PROFILES") ? H.USE_PROFILES : !1),
          (Fe = H.ALLOW_ARIA_ATTR !== !1),
          (We = H.ALLOW_DATA_ATTR !== !1),
          (je = H.ALLOW_UNKNOWN_PROTOCOLS || !1),
          (lt = H.ALLOW_SELF_CLOSE_IN_ATTR !== !1),
          (Et = H.SAFE_FOR_TEMPLATES || !1),
          (ht = H.SAFE_FOR_XML !== !1),
          (wt = H.WHOLE_DOCUMENT || !1),
          (ft = H.RETURN_DOM || !1),
          (mt = H.RETURN_DOM_FRAGMENT || !1),
          (xt = H.RETURN_TRUSTED_TYPE || !1),
          (_t = H.FORCE_BODY || !1),
          (Mt = H.SANITIZE_DOM !== !1),
          (Dt = H.SANITIZE_NAMED_PROPS || !1),
          (Ot = H.KEEP_CONTENT !== !1),
          (Bt = H.IN_PLACE || !1),
          (M = H.ALLOWED_URI_REGEXP || qc),
          (pe = H.NAMESPACE || Y),
          (it = H.MATHML_TEXT_INTEGRATION_POINTS || it),
          (Ke = H.HTML_INTEGRATION_POINTS || Ke),
          (ke = H.CUSTOM_ELEMENT_HANDLING || {}),
          H.CUSTOM_ELEMENT_HANDLING &&
            kt(H.CUSTOM_ELEMENT_HANDLING.tagNameCheck) &&
            (ke.tagNameCheck = H.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
          H.CUSTOM_ELEMENT_HANDLING &&
            kt(H.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) &&
            (ke.attributeNameCheck =
              H.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
          H.CUSTOM_ELEMENT_HANDLING &&
            typeof H.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements ==
              "boolean" &&
            (ke.allowCustomizedBuiltInElements =
              H.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
          Et && (We = !1),
          mt && (ft = !0),
          Rt &&
            ((ne = qe({}, Cl)),
            (z = []),
            Rt.html === !0 && (qe(ne, El), qe(z, Ll)),
            Rt.svg === !0 && (qe(ne, vo), qe(z, wo), qe(z, Va)),
            Rt.svgFilters === !0 && (qe(ne, bo), qe(z, wo), qe(z, Va)),
            Rt.mathMl === !0 && (qe(ne, yo), qe(z, Ml), qe(z, Va))),
          H.ADD_TAGS && (ne === xe && (ne = mr(ne)), qe(ne, H.ADD_TAGS, Q)),
          H.ADD_ATTR && (z === De && (z = mr(z)), qe(z, H.ADD_ATTR, Q)),
          H.ADD_URI_SAFE_ATTR && qe(Hn, H.ADD_URI_SAFE_ATTR, Q),
          H.FORBID_CONTENTS &&
            (Pt === Ht && (Pt = mr(Pt)), qe(Pt, H.FORBID_CONTENTS, Q)),
          Ot && (ne["#text"] = !0),
          wt && qe(ne, ["html", "head", "body"]),
          ne.table && (qe(ne, ["tbody"]), delete Ce.tbody),
          H.TRUSTED_TYPES_POLICY)
        ) {
          if (typeof H.TRUSTED_TYPES_POLICY.createHTML != "function")
            throw Ki(
              'TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.',
            );
          if (typeof H.TRUSTED_TYPES_POLICY.createScriptURL != "function")
            throw Ki(
              'TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.',
            );
          ((v = H.TRUSTED_TYPES_POLICY), (E = v.createHTML("")));
        } else
          (v === void 0 && (v = dm(m, i)),
            v !== null && typeof E == "string" && (E = v.createHTML("")));
        (Jt && Jt(H), (ge = H));
      }
    },
    rn = qe({}, [...vo, ...bo, ...em]),
    jt = qe({}, [...yo, ...tm]),
    pi = function (H) {
      let ie = T(H);
      (!ie || !ie.tagName) && (ie = { namespaceURI: pe, tagName: "template" });
      const we = cs(H.tagName),
        Je = cs(ie.tagName);
      return Re[H.namespaceURI]
        ? H.namespaceURI === An
          ? ie.namespaceURI === Y
            ? we === "svg"
            : ie.namespaceURI === Sn
              ? we === "svg" && (Je === "annotation-xml" || it[Je])
              : !!rn[we]
          : H.namespaceURI === Sn
            ? ie.namespaceURI === Y
              ? we === "math"
              : ie.namespaceURI === An
                ? we === "math" && Ke[Je]
                : !!jt[we]
            : H.namespaceURI === Y
              ? (ie.namespaceURI === An && !Ke[Je]) ||
                (ie.namespaceURI === Sn && !it[Je])
                ? !1
                : !jt[we] && (fn[we] || !rn[we])
              : !!(Tn === "application/xhtml+xml" && Re[H.namespaceURI])
        : !1;
    },
    Wt = function (H) {
      Yi(e.removed, { element: H });
      try {
        T(H).removeChild(H);
      } catch {
        A(H);
      }
    },
    En = function (H, ie) {
      try {
        Yi(e.removed, { attribute: ie.getAttributeNode(H), from: ie });
      } catch {
        Yi(e.removed, { attribute: null, from: ie });
      }
      if ((ie.removeAttribute(H), H === "is"))
        if (ft || mt)
          try {
            Wt(ie);
          } catch {}
        else
          try {
            ie.setAttribute(H, "");
          } catch {}
    },
    Ia = function (H) {
      let ie = null,
        we = null;
      if (_t) H = "<remove></remove>" + H;
      else {
        const nt = Tl(H, /^[\r\n\t ]+/);
        we = nt && nt[0];
      }
      Tn === "application/xhtml+xml" &&
        pe === Y &&
        (H =
          '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' +
          H +
          "</body></html>");
      const Je = v ? v.createHTML(H) : H;
      if (pe === Y)
        try {
          ie = new p().parseFromString(Je, Tn);
        } catch {}
      if (!ie || !ie.documentElement) {
        ie = x.createDocument(pe, "template", null);
        try {
          ie.documentElement.innerHTML = Te ? E : Je;
        } catch {}
      }
      const Ct = ie.body || ie.documentElement;
      return (
        H &&
          we &&
          Ct.insertBefore(n.createTextNode(we), Ct.childNodes[0] || null),
        pe === Y
          ? F.call(ie, wt ? "html" : "body")[0]
          : wt
            ? ie.documentElement
            : Ct
      );
    },
    Na = function (H) {
      return _.call(
        H.ownerDocument || H,
        H,
        u.SHOW_ELEMENT |
          u.SHOW_COMMENT |
          u.SHOW_TEXT |
          u.SHOW_PROCESSING_INSTRUCTION |
          u.SHOW_CDATA_SECTION,
        null,
      );
    },
    ji = function (H) {
      return (
        H instanceof d &&
        (typeof H.nodeName != "string" ||
          typeof H.textContent != "string" ||
          typeof H.removeChild != "function" ||
          !(H.attributes instanceof h) ||
          typeof H.removeAttribute != "function" ||
          typeof H.setAttribute != "function" ||
          typeof H.namespaceURI != "string" ||
          typeof H.insertBefore != "function" ||
          typeof H.hasChildNodes != "function")
      );
    },
    Fa = function (H) {
      return typeof o == "function" && H instanceof o;
    };
  function qn(Ae, H, ie) {
    $a(Ae, (we) => {
      we.call(e, H, ie, ge);
    });
  }
  const _a = function (H) {
      let ie = null;
      if ((qn($.beforeSanitizeElements, H, null), ji(H))) return (Wt(H), !0);
      const we = Q(H.nodeName);
      if (
        (qn($.uponSanitizeElement, H, { tagName: we, allowedTags: ne }),
        (ht &&
          H.hasChildNodes() &&
          !Fa(H.firstElementChild) &&
          Gt(/<[/\w!]/g, H.innerHTML) &&
          Gt(/<[/\w!]/g, H.textContent)) ||
          H.nodeType === Zi.progressingInstruction ||
          (ht && H.nodeType === Zi.comment && Gt(/<[/\w]/g, H.data)))
      )
        return (Wt(H), !0);
      if (!ne[we] || Ce[we]) {
        if (
          !Ce[we] &&
          Ba(we) &&
          ((ke.tagNameCheck instanceof RegExp && Gt(ke.tagNameCheck, we)) ||
            (ke.tagNameCheck instanceof Function && ke.tagNameCheck(we)))
        )
          return !1;
        if (Ot && !Pt[we]) {
          const Je = T(H) || H.parentNode,
            Ct = b(H) || H.childNodes;
          if (Ct && Je) {
            const nt = Ct.length;
            for (let It = nt - 1; It >= 0; --It) {
              const qt = S(Ct[It], !0);
              ((qt.__removalCount = (H.__removalCount || 0) + 1),
                Je.insertBefore(qt, C(H)));
            }
          }
        }
        return (Wt(H), !0);
      }
      return (H instanceof l && !pi(H)) ||
        ((we === "noscript" || we === "noembed" || we === "noframes") &&
          Gt(/<\/no(script|embed|frames)/i, H.innerHTML))
        ? (Wt(H), !0)
        : (Et &&
            H.nodeType === Zi.text &&
            ((ie = H.textContent),
            $a([G, K, le], (Je) => {
              ie = Xi(ie, Je, " ");
            }),
            H.textContent !== ie &&
              (Yi(e.removed, { element: H.cloneNode() }),
              (H.textContent = ie))),
          qn($.afterSanitizeElements, H, null),
          !1);
    },
    Oa = function (H, ie, we) {
      if (Mt && (ie === "id" || ie === "name") && (we in n || we in ct))
        return !1;
      if (!(We && !Ue[ie] && Gt(R, ie))) {
        if (!(Fe && Gt(he, ie))) {
          if (!z[ie] || Ue[ie]) {
            if (
              !(
                (Ba(H) &&
                  ((ke.tagNameCheck instanceof RegExp &&
                    Gt(ke.tagNameCheck, H)) ||
                    (ke.tagNameCheck instanceof Function &&
                      ke.tagNameCheck(H))) &&
                  ((ke.attributeNameCheck instanceof RegExp &&
                    Gt(ke.attributeNameCheck, ie)) ||
                    (ke.attributeNameCheck instanceof Function &&
                      ke.attributeNameCheck(ie)))) ||
                (ie === "is" &&
                  ke.allowCustomizedBuiltInElements &&
                  ((ke.tagNameCheck instanceof RegExp &&
                    Gt(ke.tagNameCheck, we)) ||
                    (ke.tagNameCheck instanceof Function &&
                      ke.tagNameCheck(we))))
              )
            )
              return !1;
          } else if (!Hn[ie]) {
            if (!Gt(M, Xi(we, Z, ""))) {
              if (
                !(
                  (ie === "src" || ie === "xlink:href" || ie === "href") &&
                  H !== "script" &&
                  K1(we, "data:") === 0 &&
                  kn[H]
                )
              ) {
                if (!(je && !Gt(ee, Xi(we, Z, "")))) {
                  if (we) return !1;
                }
              }
            }
          }
        }
      }
      return !0;
    },
    Ba = function (H) {
      return H !== "annotation-xml" && Tl(H, fe);
    },
    Ra = function (H) {
      qn($.beforeSanitizeAttributes, H, null);
      const { attributes: ie } = H;
      if (!ie || ji(H)) return;
      const we = {
        attrName: "",
        attrValue: "",
        keepAttr: !0,
        allowedAttributes: z,
        forceKeepAttr: void 0,
      };
      let Je = ie.length;
      for (; Je--; ) {
        const Ct = ie[Je],
          { name: nt, namespaceURI: It, value: qt } = Ct,
          ri = Q(nt),
          Lr = qt;
        let St = nt === "value" ? Lr : Q1(Lr);
        if (
          ((we.attrName = ri),
          (we.attrValue = St),
          (we.keepAttr = !0),
          (we.forceKeepAttr = void 0),
          qn($.uponSanitizeAttribute, H, we),
          (St = we.attrValue),
          Dt && (ri === "id" || ri === "name") && (En(nt, H), (St = xn + St)),
          ht && Gt(/((--!?|])>)|<\/(style|title)/i, St))
        ) {
          En(nt, H);
          continue;
        }
        if (we.forceKeepAttr) continue;
        if (!we.keepAttr) {
          En(nt, H);
          continue;
        }
        if (!lt && Gt(/\/>/i, St)) {
          En(nt, H);
          continue;
        }
        Et &&
          $a([G, K, le], (Ha) => {
            St = Xi(St, Ha, " ");
          });
        const Pa = Q(H.nodeName);
        if (!Oa(Pa, ri, St)) {
          En(nt, H);
          continue;
        }
        if (
          v &&
          typeof m == "object" &&
          typeof m.getAttributeType == "function" &&
          !It
        )
          switch (m.getAttributeType(Pa, ri)) {
            case "TrustedHTML": {
              St = v.createHTML(St);
              break;
            }
            case "TrustedScriptURL": {
              St = v.createScriptURL(St);
              break;
            }
          }
        if (St !== Lr)
          try {
            (It ? H.setAttributeNS(It, nt, St) : H.setAttribute(nt, St),
              ji(H) ? Wt(H) : Al(e.removed));
          } catch {
            En(nt, H);
          }
      }
      qn($.afterSanitizeAttributes, H, null);
    },
    oo = function Ae(H) {
      let ie = null;
      const we = Na(H);
      for (qn($.beforeSanitizeShadowDOM, H, null); (ie = we.nextNode()); )
        (qn($.uponSanitizeShadowNode, ie, null),
          _a(ie),
          Ra(ie),
          ie.content instanceof a && Ae(ie.content));
      qn($.afterSanitizeShadowDOM, H, null);
    };
  return (
    (e.sanitize = function (Ae) {
      let H =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        ie = null,
        we = null,
        Je = null,
        Ct = null;
      if (((Te = !Ae), Te && (Ae = "<!-->"), typeof Ae != "string" && !Fa(Ae)))
        if (typeof Ae.toString == "function") {
          if (((Ae = Ae.toString()), typeof Ae != "string"))
            throw Ki("dirty is not a string, aborting");
        } else throw Ki("toString is not a function");
      if (!e.isSupported) return Ae;
      if (
        (ut || pt(H), (e.removed = []), typeof Ae == "string" && (Bt = !1), Bt)
      ) {
        if (Ae.nodeName) {
          const qt = Q(Ae.nodeName);
          if (!ne[qt] || Ce[qt])
            throw Ki("root node is forbidden and cannot be sanitized in-place");
        }
      } else if (Ae instanceof o)
        ((ie = Ia("<!---->")),
          (we = ie.ownerDocument.importNode(Ae, !0)),
          (we.nodeType === Zi.element && we.nodeName === "BODY") ||
          we.nodeName === "HTML"
            ? (ie = we)
            : ie.appendChild(we));
      else {
        if (!ft && !Et && !wt && Ae.indexOf("<") === -1)
          return v && xt ? v.createHTML(Ae) : Ae;
        if (((ie = Ia(Ae)), !ie)) return ft ? null : xt ? E : "";
      }
      ie && _t && Wt(ie.firstChild);
      const nt = Na(Bt ? Ae : ie);
      for (; (Je = nt.nextNode()); )
        (_a(Je), Ra(Je), Je.content instanceof a && oo(Je.content));
      if (Bt) return Ae;
      if (ft) {
        if (mt)
          for (Ct = j.call(ie.ownerDocument); ie.firstChild; )
            Ct.appendChild(ie.firstChild);
        else Ct = ie;
        return (
          (z.shadowroot || z.shadowrootmode) && (Ct = O.call(r, Ct, !0)),
          Ct
        );
      }
      let It = wt ? ie.outerHTML : ie.innerHTML;
      return (
        wt &&
          ne["!doctype"] &&
          ie.ownerDocument &&
          ie.ownerDocument.doctype &&
          ie.ownerDocument.doctype.name &&
          Gt(Uc, ie.ownerDocument.doctype.name) &&
          (It =
            "<!DOCTYPE " +
            ie.ownerDocument.doctype.name +
            `>
` +
            It),
        Et &&
          $a([G, K, le], (qt) => {
            It = Xi(It, qt, " ");
          }),
        v && xt ? v.createHTML(It) : It
      );
    }),
    (e.setConfig = function () {
      let Ae =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      (pt(Ae), (ut = !0));
    }),
    (e.clearConfig = function () {
      ((ge = null), (ut = !1));
    }),
    (e.isValidAttribute = function (Ae, H, ie) {
      ge || pt({});
      const we = Q(Ae),
        Je = Q(H);
      return Oa(we, Je, ie);
    }),
    (e.addHook = function (Ae, H) {
      typeof H == "function" && Yi($[Ae], H);
    }),
    (e.removeHook = function (Ae, H) {
      if (H !== void 0) {
        const ie = Y1($[Ae], H);
        return ie === -1 ? void 0 : X1($[Ae], ie, 1)[0];
      }
      return Al($[Ae]);
    }),
    (e.removeHooks = function (Ae) {
      $[Ae] = [];
    }),
    (e.removeAllHooks = function () {
      $ = Dl();
    }),
    e
  );
}
var hm = $c();
let Ie;
function fm(t) {
  let e = [
    {
      name: "scrollDown",
      bindKey: { win: "down", mac: "down" },
      exec: () => {
        (document
          .querySelector(".ace_text-input")
          .scrollIntoView({ block: "center" }),
          Ie.navigateDown(1));
      },
      passEvent: !0,
    },
    {
      name: "scrollUp",
      bindKey: { win: "up", mac: "up" },
      exec: () => {
        (document
          .querySelector(".ace_text-input")
          .scrollIntoView({ block: "center" }),
          Ie.navigateUp(1));
      },
      passEvent: !0,
    },
  ];
  const n = ["*", "~", "_", "="];
  ((Ie = ace.edit("editor")),
    Ie.setOptions({ maxLines: 1 / 0 }),
    Ie.on("change", t),
    Ie.renderer.setShowGutter(!1),
    e.forEach((r) => {
      Ie.commands.addCommand(r);
    }),
    Ie.commands.bindKey("F1", null),
    Ie.commands.bindKey("ctrl+,", null),
    Ie.commands.bindKey("ctrl+/", null),
    Ie.commands.bindKey("ctrl+l", null),
    Ie.commands.bindKey("ctrl+e", null),
    Ie.setOption("showPrintMargin", !1),
    n.forEach((r) => {
      Ie.commands.addCommand({
        name: r,
        bindKey: { win: r, mac: r },
        exec: function (i) {
          var a = i.getSelectedText(),
            s = i.getSelectionRange();
          if (a) {
            i.insert(r + a + r);
            var o = s.start,
              l = i.getSelectionRange().end;
            i.getSelection().setRange({ start: o, end: l });
          } else i.insert(r);
        },
      });
    }));
}
let Vc,
  Vr,
  $t,
  Xn,
  ua,
  ds,
  jn,
  hs,
  fs,
  jc,
  Wc,
  Es,
  wi,
  jr,
  Jn,
  Wr,
  Gr,
  Ni,
  Gs,
  Hr,
  Gc,
  ms,
  Cs,
  Fr,
  ps,
  Yr,
  ga,
  Yc;
function mm() {
  ((Vc = document.getElementById("notesTextArea")),
    (Vr = document.getElementById("notesPreviewArea")),
    ($t = document.getElementById("mainContainer")),
    (Xn = document.getElementById("notesAreaContainer")),
    (ua = document.getElementById("topLeftPageNumbers")),
    (ds = document.getElementById("areNotesSavedIcon")),
    (jn = document.getElementById("listOfBooks")),
    (hs = document.getElementById("listContainer")),
    (fs = document.getElementById("wikipediaBrainAnimation")),
    (jc = document.getElementById("bottomLeftGeneralInfo")),
    (Wc = document.getElementById("generalInfoPageNumber")),
    (Es = document.getElementById("yourUploads")),
    (wi = document.getElementById("morePages")),
    (jr = document.getElementById("toolBar")),
    (Jn = document.getElementById("icon8")),
    (Wr = document.getElementById("border")),
    (Gr = document.getElementById("stickyNotesTextArea")),
    (Ni = document.getElementById("stickyNotes")),
    (Gs = document.getElementById("workspace")),
    (Hr = document.getElementById("tabs")),
    (Gc = document.getElementById("flashcardsPrac")),
    document.getElementById("myForm"),
    document.getElementById("letterCount"),
    document.getElementById("wordCount"),
    (ms = document.getElementById("generalInfoViewMode")),
    (Cs = document.getElementById("fill")),
    (Fr = document.getElementById("brDots")),
    (ps = document.getElementById("yellowButtons")),
    (Yr = document.getElementById("bottomRightTools")),
    (ga = document.getElementById("searchBar")),
    (Yc = document.getElementById("vaultDetails")));
}
var va = (t, e) => (t.innerHTML = DOMPurify.sanitize(e)),
  Ls = (t, e, n = 0.75) =>
    va(
      t,
      t.innerHTML + `<span style = 'font-size: ${n}em'>&nbsp;&nbsp;${e}</span`,
    ),
  rt = (t) => document.getElementById(t),
  pm = () => Wr.classList.add("shine-effect"),
  gm = () => Wr.classList.remove("shine-effect");
function qi(t) {
  const e = [];
  return (
    Array.isArray(t) || (t = [t]),
    t.forEach((n) => {
      try {
        n.remove();
      } catch {
        e.push(n);
      }
    }),
    e
  );
}
const vm = {
    name: "chrome",
    theme_type: "light",
    body: "#e7e7e7",
    mainAccent: "#0a84ff",
    accentFont: "white",
    notesBackground: "white",
    notesColor: "black",
    code: "#e7e7e7",
    codeBackground: "white",
    codeColor: "black",
    highlight: "rgb(255, 239, 149)",
    highlightColor: "black",
    selection: "#b5d5ff",
    quizletPurple: "rgb(94, 94, 245)",
    quizletFont: "white",
    quizletPurpleAccents: "rgb(74, 74, 245)",
    miscButtons: "#e7e7e7",
    buttonsColor: "black",
    buttonBorder: "#cacaca",
    popupHeader: "rgba(53, 154, 255, 0.7)",
    popupExit: "rgb(209, 44, 35)",
    contextMenu: "rgb(72, 72, 74)",
    contextMenuColor: "white",
    contextMenuBorder: "#555",
    destructive: "rgb(255, 69, 58)",
    sideBar: "rgb(44, 44, 46)",
    sidebarAccents: "rgb(72, 72, 74)",
    searchAndUpload: "black",
    searchAndUploadColor: "white",
    listBackground: "rgb(28, 28, 30)",
    listColor: "white",
    droppedFolders: "rgb(54, 54, 56)",
    icons: "#8692a8",
    iconsColor: "white",
    tabColor: "black",
  },
  bm = {
    name: "katzenmilch",
    theme_type: "light",
    body: "#e1e1e1",
    mainAccent: "#ab91c8",
    accentFont: "white",
    notesBackground: "#f2f2f3",
    notesColor: "#333333",
    code: "white",
    highlight: "palegoldenrod",
    highlightColor: "#333333",
    selection: "#cdb2ea",
    quizletPurple: "rgb(94, 94, 245)",
    quizletFont: "white",
    quizletPurpleAccents: "rgb(74, 74, 245)",
    miscButtons: "#e4e3e3",
    buttonsColor: "#333333",
    buttonBorder: "#cccaca",
    popupHeader: "rgba(241, 241, 241, 0.7)",
    popupExit: "#ff0000",
    contextMenu: "#ffffff",
    contextMenuColor: "#333333",
    contextMenuBorder: "#dfdfdf",
    destructive: "#ff0000",
    sideBar: "#e1e1e1",
    sidebarAccents: "#cccccc",
    searchAndUpload: "#333333",
    searchAndUploadColor: "#f1f1f1",
    listBackground: "#ffffff",
    listColor: "#333333",
    droppedFolders: "#f1f1f1",
    icons: "#666666",
    iconsColor: "white",
    tabColor: "#black",
  },
  ym = {
    name: "xcode",
    theme_type: "light",
    body: "#F5F5F5",
    mainAccent: "#007ACC",
    accentFont: "white",
    notesBackground: "#ffffff",
    notesColor: "#333333",
    code: "#f3f3f3",
    codeBackground: "#fafafa",
    highlight: "#FFF89A",
    highlightColor: "#000000",
    selection: "#B5D5FF",
    quizletPurple: "rgb(94, 94, 245)",
    quizletFont: "white",
    quizletPurpleAccents: "rgb(74, 74, 245)",
    miscButtons: "#F1F1F1",
    buttonsColor: "black",
    buttonBorder: "#CCCCCC",
    popupHeader: "rgba(0, 122, 204, 0.8)",
    popupExit: "#FF3B30",
    contextMenu: "#E5E5E5",
    contextMenuColor: "#333333",
    contextMenuBorder: "#CCCCCC",
    destructive: "#FF453A",
    sideBar: "#F5F5F5",
    sidebarAccents: "#E5E5E5",
    searchAndUpload: "#333333",
    searchAndUploadColor: "#FFFFFF",
    listBackground: "#FFFFFF",
    listColor: "#333333",
    droppedFolders: "#DADADA",
    icons: "#B0B0B0",
    iconsColor: "#FFFFFF",
    tabColor: "black",
  },
  wm = {
    name: "solarized_light",
    theme_type: "light",
    body: "#eee8d5",
    mainAccent: "#b58900",
    accentFont: "white",
    notesBackground: "#fdf6e3",
    notesColor: "#586e75",
    code: "#eee8d5",
    codeBackground: "#fdf6e3",
    highlight: "#e6d190",
    highlightColor: "#425459",
    selection: "#e6e5d5",
    quizletPurple: "#268bd2",
    quizletFont: "white",
    quizletPurpleAccents: "#10639e",
    miscButtons: "#eee8d5",
    buttonsColor: "black",
    buttonBorder: "#ceccc4",
    popupHeader: "rgba(253, 246, 227, 0.7)",
    popupExit: "#dc322f",
    contextMenu: "#eee8d5",
    contextMenuColor: "black",
    contextMenuBorder: "#ceccc4",
    destructive: "#dc322f",
    sideBar: "#eee8d5",
    sidebarAccents: "#93a1a1",
    searchAndUpload: "#268bd2",
    searchAndUploadColor: "white",
    listBackground: "#fdf6e3",
    listColor: "#586e75",
    droppedFolders: "#eee8d5",
    icons: "#268bd2",
    iconsColor: "white",
    tabColor: "black",
  },
  xm = {
    name: "solarized_dark",
    theme_type: "dark",
    body: "#1a414b",
    mainAccent: "#b58900",
    accentFont: "white",
    notesBackground: "#002b36",
    notesColor: "#839496",
    code: "#073642",
    codeBackground: "#002b36",
    highlight: "#5b4f29",
    highlightColor: "lightgray",
    selection: "#1a414b",
    quizletPurple: "#268bd2",
    quizletFont: "white",
    quizletPurpleAccents: "#10639e",
    miscButtons: "#0c4857",
    buttonsColor: "white",
    buttonBorder: "#395557",
    popupHeader: "rgba(0, 43, 54, 0.7)",
    popupExit: "#bf4240",
    contextMenu: "#002b36",
    contextMenuColor: "white",
    contextMenuBorder: "#1a414b",
    destructive: "#dc322f",
    sideBar: "#1a414b",
    sidebarAccents: "#586e75",
    searchAndUpload: "#268bd2",
    searchAndUploadColor: "white",
    listBackground: "#073642",
    listColor: "#839496",
    droppedFolders: "#002b36",
    icons: "#268bd2",
    iconsColor: "white",
    tabColor: "white",
  },
  km = {
    name: "clouds_midnight",
    theme_type: "dark",
    body: "#1f1f1f",
    mainAccent: "#ffb454",
    accentFont: "#191919",
    notesBackground: "#191919",
    notesColor: "#929292",
    code: "#27292c",
    codeBackground: "#1d1f21",
    codeColor: "#c3c6c4",
    highlight: "rgb(94, 69, 38)",
    highlightColor: "#ccc",
    selection: "#3c3f41",
    quizletPurple: "#857da9",
    quizletFont: "gainsboro",
    quizletPurpleAccents: "#615986",
    miscButtons: "#27292c",
    buttonsColor: "#d1d1d1",
    buttonBorder: "#373737",
    popupHeader: "rgba(39, 41, 44, 0.7)",
    popupExit: "#ff4b4b",
    contextMenu: "#27292c",
    contextMenuColor: "#d1d1d1",
    contextMenuBorder: "#373737",
    destructive: "#ff4b4b",
    sideBar: "#1f1f1f",
    sidebarAccents: "#5f5a60",
    searchAndUpload: "#857da9",
    searchAndUploadColor: "#191919",
    listBackground: "#27292c",
    listColor: "#d1d1d1",
    droppedFolders: "#191919",
    icons: "#45474b",
    iconsColor: "#d1d1d1",
    tabColor: "#d1d1d1",
  },
  Sm = {
    name: "tomorrow_night",
    theme_type: "dark",
    body: "#282a2e",
    mainAccent: "#81a2be",
    accentFont: "black",
    notesBackground: "#1d1f21",
    notesColor: "#c5c8c6",
    code: "#2d2d2d",
    highlight: "#373b41",
    highlightColor: "#c5c8c6",
    selection: "#373b41",
    quizletPurple: "#857da9",
    quizletFont: "gainsboro",
    quizletPurpleAccents: "#615986",
    miscButtons: "#282a2e",
    buttonsColor: "#c5c8c6",
    buttonBorder: "#373b41",
    popupHeader: "rgba(129, 162, 190, 0.7)",
    popupExit: "#cc6666",
    contextMenu: "#282a2e",
    contextMenuColor: "#c5c8c6",
    contextMenuBorder: "#373b41",
    destructive: "#a54242",
    sideBar: "#282a2e",
    sidebarAccents: "#373b41",
    searchAndUpload: "#0f1213",
    searchAndUploadColor: "#c5c8c6",
    listBackground: "#1d1f21",
    listColor: "#c5c8c6",
    droppedFolders: "#373b41",
    icons: "#5b5b5b",
    iconsColor: "#c5c8c6",
    tabColor: "#c5c8c6",
  },
  Am = {
    name: "gruvbox",
    theme_type: "dark",
    body: "#282828",
    mainAccent: "#fabd2f",
    accentFont: "#282828",
    notesBackground: "#1d2021",
    notesColor: "#ebdbb2",
    code: "#282828",
    codeBackground: "#1d2021",
    highlight: "#66501f",
    highlightColor: "#ebdbb2",
    selection: "#8d5332",
    quizletPurple: "#d3869b",
    quizletFont: "#ebdbb2",
    quizletPurpleAccents: "#b16286",
    miscButtons: "#3c3836",
    buttonsColor: "#ebdbb2",
    buttonBorder: "#4e423c",
    popupHeader: "rgba(60, 56, 54, 0.7)",
    popupExit: "#fb4934",
    contextMenu: "#3c3836",
    contextMenuColor: "#ebdbb2",
    contextMenuBorder: "#4e423c",
    destructive: "#fb4934",
    sideBar: "#504945",
    sidebarAccents: "#928374",
    searchAndUpload: "#d3869b",
    searchAndUploadColor: "#282828",
    listBackground: "#3c3836",
    listColor: "#ebdbb2",
    droppedFolders: "#282828",
    icons: "#574e46",
    iconsColor: "#ebdbb2",
    tabColor: "#ebdbb2",
  },
  Tm = {
    name: "mono_industrial",
    theme_type: "dark",
    body: "#2b3a33",
    mainAccent: "#ffc600",
    accentFont: "black",
    notesBackground: "#222c28",
    notesColor: "#ffffff",
    code: "#3f4f48",
    codeBackground: "#2a2d2a",
    codeColor: "rgb(104, 125, 104)",
    highlight: "#788467",
    highlightColor: "#ffffff",
    selection: "#4e5753",
    quizletPurple: "#eecd5b",
    quizletFont: "black",
    quizletPurpleAccents: "#dfae44",
    miscButtons: "#3d4c42",
    buttonsColor: "#ffffff",
    buttonBorder: "#4f5b50",
    popupHeader: "rgba(255, 198, 0, 0.7)",
    popupExit: "#ff5f00",
    contextMenu: "#3d4c42",
    contextMenuColor: "#ffffff",
    contextMenuBorder: "#4f5b50",
    destructive: "#ff5f00",
    sideBar: "#2b3a33",
    sidebarAccents: "#3d4c42",
    searchAndUpload: "#3a6453",
    searchAndUploadColor: "#ffffff",
    listBackground: "#222c28",
    listColor: "#ffffff",
    droppedFolders: "#3d4c42",
    icons: "#909e93",
    iconsColor: "#ffffff",
    tabColor: "white",
  },
  Em = {
    name: "cloud_editor_dark",
    theme_type: "dark",
    body: "#444444",
    mainAccent: "#9e93e8",
    accentFont: "#282828",
    notesBackground: "#282c34",
    notesColor: "#c8c8c8",
    code: "#1b212c",
    codeBackground: "#282c34",
    codeColor: "rgb(153, 159, 171)",
    highlight: "#3d566a",
    highlightColor: "#d7d7d7",
    selection: "#4376bd",
    quizletPurple: "#9e93e8",
    quizletFont: "#282828",
    quizletPurpleAccents: "#8b7dcc",
    miscButtons: "#333333",
    buttonsColor: "#c8c8c8",
    buttonBorder: "#444",
    popupHeader: "rgba(51, 51, 51, 0.7)",
    popupExit: "#ff6c60",
    contextMenu: "#333333",
    contextMenuColor: "#c8c8c8",
    contextMenuBorder: "#444",
    destructive: "#ff6c60",
    sideBar: "#242424",
    sidebarAccents: "#444444",
    searchAndUpload: "#9e93e8",
    searchAndUploadColor: "#282828",
    listBackground: "#333333",
    listColor: "#c8c8c8",
    droppedFolders: "#242424",
    icons: "#7fc7ff",
    iconsColor: "#282828",
    tabColor: "#dcdfe4",
  },
  Cm = {
    name: "pastel_on_dark",
    theme_type: "dark",
    body: "#1c1919",
    mainAccent: "#cda869",
    accentFont: "black",
    notesBackground: "#2c2828",
    notesColor: "#c6c6c6",
    code: "#3c3c3c",
    codeBackground: "#322d29",
    codeColor: "rgb(131, 116, 105)",
    highlight: "#917950",
    highlightColor: "#ccc8c8",
    selection: "#4f4f4f",
    quizletPurple: "#8f9d6a",
    quizletFont: "#2c2828",
    quizletPurpleAccents: "#738052",
    miscButtons: "#3c3c3c",
    buttonsColor: "#c6c6c6",
    buttonBorder: "#4a4a4a",
    popupHeader: "rgba(134, 138, 209, 0.7)",
    popupExit: "#cf6a4c",
    contextMenu: "#3c3c3c",
    contextMenuColor: "#c6c6c6",
    contextMenuBorder: "#4a4949",
    destructive: "#cf6a4c",
    sideBar: "#1c1919",
    sidebarAccents: "#4f4f4f",
    searchAndUpload: "#7587a6",
    searchAndUploadColor: "#2c2c2c",
    listBackground: "#282524",
    listColor: "#c6c6c6",
    droppedFolders: "#1c1919",
    icons: "#9b859d",
    iconsColor: "black",
    tabColor: "#c6c6c6",
  },
  Lm = {
    name: "nord_dark",
    theme_type: "dark",
    body: "#22262e",
    mainAccent: "#a3be8c",
    accentFont: "#2e2e2e",
    notesBackground: "#2e3440",
    notesColor: "#d8dee9",
    code: "#3b4252",
    codeBackground: "#2e3440",
    highlight: "rgb(111, 98, 71)",
    highlightColor: "#f0f0f0",
    selection: "#434c5e",
    quizletPurple: "#81a1c1",
    quizletFont: "#1b1f27",
    quizletPurpleAccents: "#88c0d0",
    miscButtons: "#3b4252",
    buttonsColor: "#d8dee9",
    buttonBorder: "#535c71",
    popupHeader: "rgba(59, 66, 82, 0.7)",
    popupExit: "#bf616a",
    contextMenu: "#3b4252",
    contextMenuColor: "#d8dee9",
    contextMenuBorder: "#485268",
    destructive: "#bf616a",
    sideBar: "#22262e",
    sidebarAccents: "#333a47",
    searchAndUpload: "#88c0d0",
    searchAndUploadColor: "#2e3440",
    listBackground: "#3b4252",
    listColor: "#d8dee9",
    droppedFolders: "#2e3440",
    icons: "#81a1c1",
    iconsColor: "#1b1f27",
    tabColor: "#d8dee9",
  },
  Mm = {
    name: "tomorrow_night_eighties",
    theme_type: "dark",
    body: "#393939",
    mainAccent: "#6699cc",
    accentFont: "#2d2d2d",
    notesBackground: "#2d2d2d",
    notesColor: "#cccccc",
    code: "#393939",
    codeBackground: "#2d2d2d",
    highlight: "#3a4d60",
    highlightColor: "#d5d5d5",
    selection: "#515151",
    quizletPurple: "#cc99cc",
    quizletFont: "#2d2d2d",
    quizletPurpleAccents: "#a366a3",
    miscButtons: "#393939",
    buttonsColor: "#cccccc",
    buttonBorder: "#444",
    popupHeader: "rgba(57, 57, 57, 0.7)",
    popupExit: "#f2777a",
    contextMenu: "#393939",
    contextMenuColor: "#cccccc",
    contextMenuBorder: "#444",
    destructive: "#f2777a",
    sideBar: "#2a2a2a",
    sidebarAccents: "#515151",
    searchAndUpload: "#cc99cc",
    searchAndUploadColor: "#2d2d2d",
    listBackground: "#393939",
    listColor: "#cccccc",
    droppedFolders: "#2d2d2d",
    icons: "#f99157",
    iconsColor: "#2d2d2d",
    tabColor: "#cccccc",
  },
  zm = {
    name: "terminal",
    theme_type: "dark",
    hidden: !0,
    body: "#262d35",
    mainAccent: "#0a84ff",
    accentFont: "white",
    notesBackground: "black",
    notesColor: "#bbbbbb",
    code: "#262d35",
    codeBackground: "#1d1f21",
    codeColor: "#c5c8c6",
    highlight: "#eaee9b",
    highlightColor: "black",
    selection: "#b5d5ff",
    quizletPurple: "rgb(94, 94, 245)",
    quizletFont: "white",
    quizletPurpleAccents: "rgb(74, 74, 245)",
    miscButtons: "#e7e7e7",
    buttonsColor: "black",
    buttonBorder: "#cacaca",
    popupHeader: "rgba(53, 154, 255, 0.7)",
    popupExit: "rgb(209, 44, 35)",
    contextMenu: "rgb(72, 72, 74)",
    contextMenuColor: "white",
    contextMenuBorder: "#555",
    destructive: "rgb(255, 69, 58)",
    sideBar: "rgb(44, 44, 46)",
    sidebarAccents: "rgb(72, 72, 74)",
    searchAndUpload: "black",
    searchAndUploadColor: "white",
    listBackground: "rgb(28, 28, 30)",
    listColor: "white",
    droppedFolders: "rgb(54, 54, 56)",
    icons: "#8692a8",
    iconsColor: "white",
    tabColor: "black",
  },
  Ms = [vm, bm, ym, wm, xm, km, Sm, Am, Tm, Em, Cm, Lm, Mm, zm];
let Or;
function Qe(t, e) {
  (Or === void 0 && (Or = JSON.parse(localStorage.getItem("$settings")) || {}),
    (Or[t] = e),
    localStorage.setItem("$settings", JSON.stringify(Or)));
}
function yt(t, e = null) {
  return (
    Or === void 0 && (Or = JSON.parse(localStorage.getItem("$settings")) || {}),
    Or[t] !== void 0 ? Or[t] : e
  );
}
let qr = null;
const Dm = {
  chrome: "vs",
  gruvbox: "gruvbox-dark",
  katzenmilch: "ghcolors",
  clouds_midnight: "atom-dark",
  solarized_light: "solarizedlight",
  solarized_dark: "solarized-dark-atom",
  pastel_on_dark: "duotone-earth",
  monokai: "okaidia",
  dracula: "dracula",
  github_dark: "github-dark",
  cobalt: "z-touch",
  twilight: "twilight",
  tomorrow_night_eighties: "tomorrow",
  cloud_editor_dark: "one-dark",
  nord_dark: "nord",
  tomorrow_night: "tomorrow",
  xcode: "one-light",
  mono_industrial: "duotone-forest",
  terminal: "atom-dark",
};
function zs(t) {
  if (network.isOffline) return;
  qi([rt("notes_prism_theme")]);
  const e = Ms.find((r) => r.name === t) || Ms.find((r) => r.name === "chrome");
  ((qr = e),
    Qe("theme", t),
    notes_global_theme.replace(`
    :root {
      --quizlet-purple: ${e.quizletPurple};
      --quizlet-purple-accents: ${e.quizletPurpleAccents};
      --quizlet-font: ${e.quizletFont};
      --main-accent: ${e.mainAccent};
      --accent-font: ${e.accentFont};
      --body: ${e.body};
      --notes-background: ${e.notesBackground};
      --notes-color: ${e.notesColor};
      --code: ${e.code};
      --codeBackground: ${e.codeBackground || e.code};
      --codeColor: ${e.codeColor || e.notesColor};
      --misc-buttons: ${e.miscButtons};
      --buttons-color: ${e.buttonsColor};
      --context-menu: ${e.contextMenu};
      --context-menu-color: ${e.contextMenuColor};
      --sidebar-accents: ${e.sidebarAccents};
      --side-bar: ${e.sideBar};
      --list-background: ${e.listBackground};
      --searchAndUpload: ${e.searchAndUpload};
      --searchAndUpload-color: ${e.searchAndUploadColor};
      --list-color: ${e.listColor};
      --icons: ${e.icons};
      --icons-color: ${e.iconsColor};
      --tab-color: ${e.tabColor};
      --dropped-folders: ${e.droppedFolders};
      --destructive: ${e.destructive};
      --popup-header: ${e.popupHeader};
      --popup-exit: ${e.popupExit};
      --highlight: ${e.highlight};
      --highlight-color: ${e.highlightColor};
      --selection: ${e.selection};
      --context-menu-border: ${e.contextMenuBorder};
      --button-border: ${e.buttonBorder || "rgba(0, 0, 0, 25)"};
      --icons-border: ${e.iconsBorder || "rgba(0, 0, 0, 25)"};
      --floating-bs: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  `));
  const n = document.createElement("style");
  ((n.id = "notes_prism_theme"),
    (n.innerText = `@import url("/assets/prism-all-themes/prism-${Dm[t] || "solarizedlight"}.css");`),
    document.head.appendChild(n),
    Ie.setTheme(`ace/theme/${t}`));
}
let ba = !1,
  vr = null;
function ci(t, e) {
  ((t.innerText = "Confirm"),
    t.classList.remove("ios"),
    t.classList.add("rios"),
    t.addEventListener(
      "click",
      (n) => {
        (n.stopImmediatePropagation(), e(), ye());
      },
      { once: !0 },
    ));
}
function ye() {
  ((ba = !1),
    qi([vr]),
    (vr = null),
    document.body.classList.remove("cmOpen"),
    $t.removeEventListener("click", ye),
    $t.removeEventListener("contextmenu", ye),
    jr.removeEventListener("click", ye),
    jr.removeEventListener("contextmenu", ye),
    Yr.removeEventListener("click", ye),
    Yr.removeEventListener("contextmenu", ye));
}
function Im(t) {
  ((t.id = "contextMenu"),
    ye(),
    t.firstChild &&
      ($t.after(t),
      (vr = t),
      $t.addEventListener("click", ye, { once: !0 }),
      $t.addEventListener("contextmenu", ye, { once: !0 }),
      jr.addEventListener("click", ye, { once: !0 }),
      jr.addEventListener("contextmenu", ye, { once: !0 }),
      Yr.addEventListener("click", ye, { once: !0 }),
      Yr.addEventListener("contextmenu", ye, { once: !0 })));
}
function Nm() {
  ba = !0;
}
function Fm(t, e, n, r) {
  ba && ((ba = !1), Kt(t, e, n, r));
}
function Kt(t, e, n, r) {
  let i = document.activeElement;
  if (ba) return;
  (n === "resample" && vr && (n = [vr.style.left, vr.style.top]),
    t.preventDefault(),
    t.stopPropagation(),
    ye(),
    document.body.classList.add("cmOpen"));
  const a = document.createElement("div");
  if (
    (a.addEventListener("keydown", (s) => {
      s.key === "Escape" && (i.focus(), ye());
    }),
    a.addEventListener("contextmenu", (s) => s.preventDefault()),
    (a.id = "contextMenu"),
    (a.tabIndex = 0),
    !t.clientX && !t.clientY)
  ) {
    const s = t.target.getBoundingClientRect();
    ((a.style.left = `${s.left}px`), (a.style.top = `${s.top}px`));
  } else
    n && n.length == 2
      ? ((a.style.left = n[0]), (a.style.top = n[1]))
      : ((a.style.left = `${t.clientX}px`), (a.style.top = `${t.clientY}px`));
  if (
    (e.forEach((s) => {
      if (s) {
        if (s.spacer) {
          const l = document.createElement("div");
          (l.classList.add("spacer"), a.appendChild(l));
          return;
        }
        const o = document.createElement("button");
        (r && (o.style.animation = "none"),
          o.classList.add("contextMenuItem"),
          (o.innerText = s.text),
          s.children
            ? o.addEventListener("click", () => Kt(t, s.children, "resample"))
            : s.populator
              ? o.addEventListener("click", async (l) => {
                  Nm();
                  const u = await s.populator(s.props, l.currentTarget, l);
                  Fm(l, u, "resample");
                })
              : o.addEventListener("click", function (l) {
                  s.click(s.props, l.currentTarget, l);
                }),
          s.appearance
            ? s.appearance.split(" ").forEach((l) => o.classList.add(l))
            : o.classList.add("ios"),
          a.appendChild(o));
      }
    }),
    a.firstChild)
  ) {
    (r && (a.style.animation = "none"), $t.after(a), (vr = a), a.focus());
    const s = parseInt(a.style.top);
    (s + a.scrollHeight >= window.innerHeight &&
      (s - a.scrollHeight >= 0
        ? ((a.style.marginTop = `-${a.scrollHeight}px`),
          (a.style.transformOrigin = "bottom"))
        : s < window.innerHeight / 2
          ? ((a.style.marginTop = "0px"),
            (a.style.height = `${window.innerHeight - s - 10}px`))
          : ((a.style.height = `${s - 10}px`),
            (a.style.marginTop = `-${s - 5}px`),
            (a.style.transformOrigin = "bottom"))),
      parseInt(a.style.left) + a.scrollWidth >= window.innerWidth &&
        (a.style.marginLeft = `-${a.scrollWidth}px`),
      $t.addEventListener("click", ye, { once: !0 }),
      $t.addEventListener("contextmenu", ye, { once: !0 }),
      jr.addEventListener("click", ye, { once: !0 }),
      jr.addEventListener("contextmenu", ye, { once: !0 }),
      Yr.addEventListener("click", ye, { once: !0 }),
      Yr.addEventListener("contextmenu", ye, { once: !0 }));
  }
}
function Il(t) {
  vr.firstChild.scroll({ top: vr.firstChild.scrollTop + t.deltaY });
}
const yn = new Map();
let Wn, Fi;
function _m(t) {
  Wn = t;
}
function Om(t) {
  Fi = t;
}
function et(t = new Error("Network Error")) {
  return {
    ok: !1,
    status: -1,
    statusText: t.message || "Network Error",
    json: async () => ({ error: t.message }),
    text: async () => t.message,
    blob: async () => new Blob([t.message], { type: "text/plain" }),
  };
}
class Bm {
  async snippets() {
    try {
      return await fetch("/api/get/snippets", { cache: "no-store" });
    } catch {
      return et();
    }
  }
  async tagged(e) {
    try {
      return await fetch(`/api/get/tagged/${e}`, { cache: "no-store" });
    } catch (n) {
      return et(n);
    }
  }
  async tags() {
    try {
      return await fetch("/api/get/tags/", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async list() {
    try {
      return await fetch("/api/get/list", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async imageList() {
    try {
      return await fetch("/api/get/image-list", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async notebooks(e) {
    try {
      return await fetch(`/api/get/notebooks/${e}`, { cache: "no-store" });
    } catch (n) {
      return et(n);
    }
  }
  async family(e) {
    try {
      return await fetch(`/api/get/family/${e}`, { cache: "no-store" });
    } catch (n) {
      return et(n);
    }
  }
  async flashcards() {
    try {
      return await fetch("/api/get/flashcards", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async users() {
    try {
      return await fetch("/api/get/users", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async published() {
    try {
      return await fetch("/api/get/published", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async fdg() {
    try {
      return await fetch("/api/get/fdg", { cache: "no-store" });
    } catch (e) {
      return et(e);
    }
  }
  async fuzzy(e) {
    try {
      return await fetch(`/api/get/fuzzy/${e}`, { cache: "no-store" });
    } catch (n) {
      return et(n);
    }
  }
  async export(e) {
    try {
      return await fetch(`/api/export/${e}`, { cache: "no-store" });
    } catch (n) {
      return et(n);
    }
  }
}
class Rm {
  async changeSpace(e) {
    try {
      return await fetch(`/api/change-space/${e}`, { method: "PATCH" });
    } catch (n) {
      return et(n);
    }
  }
  async nest(e, n) {
    try {
      return await fetch(`/api/nest/${e}/${n}`, { method: "PATCH" });
    } catch (r) {
      return et(r);
    }
  }
  async relinquish(e, n) {
    try {
      return await fetch(`/api/relinquish/${e}/${n}`, { method: "PATCH" });
    } catch (r) {
      return et(r);
    }
  }
  async rename(e, n) {
    try {
      return await fetch(`/api/rename/${e}/${n}`, { method: "PATCH" });
    } catch (r) {
      return et(r);
    }
  }
  async publish(e) {
    try {
      return await fetch(`/api/publish/${e}`, { method: "PATCH" });
    } catch (n) {
      return et(n);
    }
  }
  async unpublish(e) {
    try {
      return await fetch(`/api/unpublish/${e}`, { method: "PATCH" });
    } catch (n) {
      return et(n);
    }
  }
}
class Pm {
  async saveNotebooks(e, n) {
    try {
      return await fetch(`/api/save/notebooks/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n),
      });
    } catch (r) {
      return et(r);
    }
  }
}
class Hm {
  async notebooks(e) {
    try {
      return await fetch(`/api/delete/notebooks/${e}`, { method: "DELETE" });
    } catch (n) {
      return et(n);
    }
  }
  async images(e) {
    try {
      return await fetch(`/api/delete/images/${e}`, { method: "DELETE" });
    } catch (n) {
      return et(n);
    }
  }
}
class qm {
  async saveImages(e) {
    try {
      return await fetch("/api/save/images", { method: "POST", body: e });
    } catch (n) {
      return et(n);
    }
  }
  async chatgpt(e) {
    try {
      return await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
    } catch (n) {
      return et(n);
    }
  }
  async ollama(e) {
    try {
      return await fetch("/api/ollama", {
        method: "POST",
        hedaers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
    } catch (n) {
      return et(n);
    }
  }
  async query() {
    try {
      return await fetch("/api/query", { method: "POST" });
    } catch (e) {
      return et(e);
    }
  }
}
class Um {
  constructor() {
    ((this.get = new Bm()),
      (this.patch = new Rm()),
      (this.put = new Pm()),
      (this.del = new Hm()),
      (this.post = new qm()));
  }
}
let Xe = new Um();
async function Xc() {
  if (network.isOffline) return;
  (await Xe.put.saveNotebooks("sticky__notes", { content: [Gr.value] })).ok ||
    notyf.error("An error occurred when saving the sticky note");
}
function Kc() {
  (Ni.classList.remove("gone"),
    Ni.classList.add("snOpen"),
    $t.addEventListener("click", Ys, { once: !0 }),
    Gr.focus(),
    (Fr.style.display = "none"));
}
function Ys() {
  (Ni.classList.remove("snOpen"),
    Ni.addEventListener("click", Kc, { once: !0 }),
    $t.removeEventListener("click", Ys),
    (Fr.style.display = "flex"));
}
async function $m() {
  const t = await Xe.get.notebooks("sticky__notes");
  if (t.ok) {
    let e = await t.json();
    Gr.value = e.data.content[0];
  } else
    t.status === 404
      ? (Gr.value = "")
      : notyf.error("An error occurred when loading your sticky note");
}
let Qc, Zc;
function Vm(t) {
  Qc = t;
}
function jm(t) {
  Zc = t;
}
let Jc = [];
function ed(t) {
  t.key === "Escape" && (t.preventDefault(), Br());
}
const Jo = [];
function Xs(
  { closers: t = [], noAnimation: e = !1 } = { closers: [], noAnimation: !1 },
) {
  (Br(), Qc());
  for (const l of document.querySelectorAll("*"))
    (Jo.push({ tabIndex: l.tabIndex, ref: l }), (l.tabIndex = -1));
  Jc = t;
  const n = document.createElement("div");
  (e && (n.style.animation = "none"), (n.id = "popupModal"));
  const r = document.createElement("div");
  (r.addEventListener("click", (l) => {
    (ye(), Ys(), l.stopPropagation());
  }),
    n.appendChild(r),
    (r.id = "bookDiffPopup"));
  const i = document.createElement("div");
  i.id = "bookDiffHeader";
  const a = document.createElement("button");
  a.id = "bookDiffExitContainer";
  const s = document.createElement("div");
  ((s.id = "bookDiffExit"),
    a.appendChild(s),
    i.appendChild(a),
    r.appendChild(i));
  const o = document.createElement("div");
  return (
    (o.id = "bookDiffContent"),
    r.appendChild(o),
    n.addEventListener("click", Br),
    a.addEventListener("click", Br, { once: !0 }),
    Ie.session.on("change", Br),
    $t.after(n),
    document.addEventListener("keydown", ed),
    o.focus(),
    o
  );
}
function Br() {
  for (const { tabIndex: t, ref: e } of Jo) e.tabIndex = t;
  ((Jo.length = 0),
    qi([rt("popupModal")]),
    ye(),
    document.removeEventListener("keydown", ed));
  for (const t of Jc) t();
  Ie.session.off("change", Br);
}
let I = null;
function Nl(t) {
  I = t;
}
let td, gs, nd, rd;
function Wm() {
  ((td = Mn([Jn], {
    animation: "shift-toward-subtle",
    arrow: !1,
    content:
      "<div id = 'brain' style = 'width: auto;'>Info on highlighted text will appear here</div>",
    interactive: !0,
    allowHTML: !0,
    maxWidth: "500px",
    placement: "bottom-end",
  })[0]),
    (gs = Mn("#areNotesSavedIcon", {
      animation: "shift-toward-subtle",
      arrow: !1,
      content: "Notes are saved",
      placement: "bottom-end",
    })[0]),
    (rd = Mn("#generalInfoViewMode", {
      animation: "shift-toward-subtle",
      arrow: !1,
      content: yt("viewPref", "?"),
      placement: "top",
    })[0]),
    (nd = Mn("#generalInfoPageNumber", {
      animation: "shift-toward-subtle",
      arrow: !1,
      content: "Loading",
      placement: "top",
    })[0]),
    [
      { name: "#icon1", content: "Save (Ctrl + S)" },
      { name: "#icon2", content: "Notebook" },
      { name: "#icon3", content: "Delete" },
      { name: "#icon4", content: "Insert File" },
      { name: "#icon5", content: "Switch View (Ctrl + E)" },
      { name: "#icon6", content: "Prev Page" },
      { name: "#icon7", content: "Next Page" },
      { name: "#wordCount", content: "Word Count" },
      { name: "#letterCount", content: "Character Count" },
      { name: "#openCommandPal", content: "Command Palette" },
      { name: "#autoSaveSpinner", content: "Auto Saving is on" },
      { name: "#goHome", content: "Quick Access" },
      { name: "#newPage", content: "New Page" },
      {
        name: "#vaultDetails",
        content:
          "This notebook will be encrypted with your pass-word before being sent to the server. Unsaved changes will <b>NOT</b> be saved locally.",
      },
    ].forEach((e) =>
      Mn(e.name, {
        arrow: !1,
        allowHTML: !0,
        animation: "shift-toward-subtle",
        content: e.content,
        placement: "bottom",
      }),
    ));
}
var Fl = 11;
function Gm(t, e) {
  var n = e.attributes,
    r,
    i,
    a,
    s,
    o;
  if (!(e.nodeType === Fl || t.nodeType === Fl)) {
    for (var l = n.length - 1; l >= 0; l--)
      ((r = n[l]),
        (i = r.name),
        (a = r.namespaceURI),
        (s = r.value),
        a
          ? ((i = r.localName || i),
            (o = t.getAttributeNS(a, i)),
            o !== s &&
              (r.prefix === "xmlns" && (i = r.name), t.setAttributeNS(a, i, s)))
          : ((o = t.getAttribute(i)), o !== s && t.setAttribute(i, s)));
    for (var u = t.attributes, h = u.length - 1; h >= 0; h--)
      ((r = u[h]),
        (i = r.name),
        (a = r.namespaceURI),
        a
          ? ((i = r.localName || i),
            e.hasAttributeNS(a, i) || t.removeAttributeNS(a, i))
          : e.hasAttribute(i) || t.removeAttribute(i));
  }
}
var ja,
  Ym = "http://www.w3.org/1999/xhtml",
  dn = typeof document > "u" ? void 0 : document,
  Xm = !!dn && "content" in dn.createElement("template"),
  Km = !!dn && dn.createRange && "createContextualFragment" in dn.createRange();
function Qm(t) {
  var e = dn.createElement("template");
  return ((e.innerHTML = t), e.content.childNodes[0]);
}
function Zm(t) {
  ja || ((ja = dn.createRange()), ja.selectNode(dn.body));
  var e = ja.createContextualFragment(t);
  return e.childNodes[0];
}
function Jm(t) {
  var e = dn.createElement("body");
  return ((e.innerHTML = t), e.childNodes[0]);
}
function ep(t) {
  return ((t = t.trim()), Xm ? Qm(t) : Km ? Zm(t) : Jm(t));
}
function Wa(t, e) {
  var n = t.nodeName,
    r = e.nodeName,
    i,
    a;
  return n === r
    ? !0
    : ((i = n.charCodeAt(0)),
      (a = r.charCodeAt(0)),
      i <= 90 && a >= 97
        ? n === r.toUpperCase()
        : a <= 90 && i >= 97
          ? r === n.toUpperCase()
          : !1);
}
function tp(t, e) {
  return !e || e === Ym ? dn.createElement(t) : dn.createElementNS(e, t);
}
function np(t, e) {
  for (var n = t.firstChild; n; ) {
    var r = n.nextSibling;
    (e.appendChild(n), (n = r));
  }
  return e;
}
function xo(t, e, n) {
  t[n] !== e[n] &&
    ((t[n] = e[n]), t[n] ? t.setAttribute(n, "") : t.removeAttribute(n));
}
var _l = {
    OPTION: function (t, e) {
      var n = t.parentNode;
      if (n) {
        var r = n.nodeName.toUpperCase();
        (r === "OPTGROUP" &&
          ((n = n.parentNode), (r = n && n.nodeName.toUpperCase())),
          r === "SELECT" &&
            !n.hasAttribute("multiple") &&
            (t.hasAttribute("selected") &&
              !e.selected &&
              (t.setAttribute("selected", "selected"),
              t.removeAttribute("selected")),
            (n.selectedIndex = -1)));
      }
      xo(t, e, "selected");
    },
    INPUT: function (t, e) {
      (xo(t, e, "checked"),
        xo(t, e, "disabled"),
        t.value !== e.value && (t.value = e.value),
        e.hasAttribute("value") || t.removeAttribute("value"));
    },
    TEXTAREA: function (t, e) {
      var n = e.value;
      t.value !== n && (t.value = n);
      var r = t.firstChild;
      if (r) {
        var i = r.nodeValue;
        if (i == n || (!n && i == t.placeholder)) return;
        r.nodeValue = n;
      }
    },
    SELECT: function (t, e) {
      if (!e.hasAttribute("multiple")) {
        for (var n = -1, r = 0, i = t.firstChild, a, s; i; )
          if (((s = i.nodeName && i.nodeName.toUpperCase()), s === "OPTGROUP"))
            ((a = i), (i = a.firstChild));
          else {
            if (s === "OPTION") {
              if (i.hasAttribute("selected")) {
                n = r;
                break;
              }
              r++;
            }
            ((i = i.nextSibling), !i && a && ((i = a.nextSibling), (a = null)));
          }
        t.selectedIndex = n;
      }
    },
  },
  Ji = 1,
  Ol = 11,
  Bl = 3,
  Rl = 8;
function Mr() {}
function rp(t) {
  if (t) return (t.getAttribute && t.getAttribute("id")) || t.id;
}
function ip(t) {
  return function (n, r, i) {
    if ((i || (i = {}), typeof r == "string"))
      if (
        n.nodeName === "#document" ||
        n.nodeName === "HTML" ||
        n.nodeName === "BODY"
      ) {
        var a = r;
        ((r = dn.createElement("html")), (r.innerHTML = a));
      } else r = ep(r);
    else r.nodeType === Ol && (r = r.firstElementChild);
    var s = i.getNodeKey || rp,
      o = i.onBeforeNodeAdded || Mr,
      l = i.onNodeAdded || Mr,
      u = i.onBeforeElUpdated || Mr,
      h = i.onElUpdated || Mr,
      d = i.onBeforeNodeDiscarded || Mr,
      p = i.onNodeDiscarded || Mr,
      m = i.onBeforeElChildrenUpdated || Mr,
      y = i.skipFromChildren || Mr,
      S =
        i.addChild ||
        function (ee, Z) {
          return ee.appendChild(Z);
        },
      A = i.childrenOnly === !0,
      C = Object.create(null),
      b = [];
    function T(ee) {
      b.push(ee);
    }
    function v(ee, Z) {
      if (ee.nodeType === Ji)
        for (var fe = ee.firstChild; fe; ) {
          var M = void 0;
          (Z && (M = s(fe)) ? T(M) : (p(fe), fe.firstChild && v(fe, Z)),
            (fe = fe.nextSibling));
        }
    }
    function E(ee, Z, fe) {
      d(ee) !== !1 && (Z && Z.removeChild(ee), p(ee), v(ee, fe));
    }
    function x(ee) {
      if (ee.nodeType === Ji || ee.nodeType === Ol)
        for (var Z = ee.firstChild; Z; ) {
          var fe = s(Z);
          (fe && (C[fe] = Z), x(Z), (Z = Z.nextSibling));
        }
    }
    x(n);
    function _(ee) {
      l(ee);
      for (var Z = ee.firstChild; Z; ) {
        var fe = Z.nextSibling,
          M = s(Z);
        if (M) {
          var ne = C[M];
          ne && Wa(Z, ne) ? (Z.parentNode.replaceChild(ne, Z), F(ne, Z)) : _(Z);
        } else _(Z);
        Z = fe;
      }
    }
    function j(ee, Z, fe) {
      for (; Z; ) {
        var M = Z.nextSibling;
        ((fe = s(Z)) ? T(fe) : E(Z, ee, !0), (Z = M));
      }
    }
    function F(ee, Z, fe) {
      var M = s(Z);
      if ((M && delete C[M], !fe)) {
        var ne = u(ee, Z);
        if (
          ne === !1 ||
          (ne instanceof HTMLElement && ((ee = ne), x(ee)),
          t(ee, Z),
          h(ee),
          m(ee, Z) === !1)
        )
          return;
      }
      ee.nodeName !== "TEXTAREA" ? O(ee, Z) : _l.TEXTAREA(ee, Z);
    }
    function O(ee, Z) {
      var fe = y(ee, Z),
        M = Z.firstChild,
        ne = ee.firstChild,
        xe,
        z,
        De,
        ke,
        Ce;
      e: for (; M; ) {
        for (ke = M.nextSibling, xe = s(M); !fe && ne; ) {
          if (((De = ne.nextSibling), M.isSameNode && M.isSameNode(ne))) {
            ((M = ke), (ne = De));
            continue e;
          }
          z = s(ne);
          var Ue = ne.nodeType,
            Fe = void 0;
          if (
            (Ue === M.nodeType &&
              (Ue === Ji
                ? (xe
                    ? xe !== z &&
                      ((Ce = C[xe])
                        ? De === Ce
                          ? (Fe = !1)
                          : (ee.insertBefore(Ce, ne),
                            z ? T(z) : E(ne, ee, !0),
                            (ne = Ce),
                            (z = s(ne)))
                        : (Fe = !1))
                    : z && (Fe = !1),
                  (Fe = Fe !== !1 && Wa(ne, M)),
                  Fe && F(ne, M))
                : (Ue === Bl || Ue == Rl) &&
                  ((Fe = !0),
                  ne.nodeValue !== M.nodeValue &&
                    (ne.nodeValue = M.nodeValue))),
            Fe)
          ) {
            ((M = ke), (ne = De));
            continue e;
          }
          (z ? T(z) : E(ne, ee, !0), (ne = De));
        }
        if (xe && (Ce = C[xe]) && Wa(Ce, M)) (fe || S(ee, Ce), F(Ce, M));
        else {
          var We = o(M);
          We !== !1 &&
            (We && (M = We),
            M.actualize && (M = M.actualize(ee.ownerDocument || dn)),
            S(ee, M),
            _(M));
        }
        ((M = ke), (ne = De));
      }
      j(ee, ne, z);
      var je = _l[ee.nodeName];
      je && je(ee, Z);
    }
    var $ = n,
      G = $.nodeType,
      K = r.nodeType;
    if (!A) {
      if (G === Ji)
        K === Ji
          ? Wa(n, r) || (p(n), ($ = np(n, tp(r.nodeName, r.namespaceURI))))
          : ($ = r);
      else if (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.nodeValue !== r.nodeValue && ($.nodeValue = r.nodeValue),
            $
          );
        $ = r;
      }
    }
    if ($ === r) p(n);
    else {
      if (r.isSameNode && r.isSameNode($)) return;
      if ((F($, r, A), b))
        for (var le = 0, R = b.length; le < R; le++) {
          var he = C[b[le]];
          he && E(he, he.parentNode, !1);
        }
    }
    return (
      !A &&
        $ !== n &&
        n.parentNode &&
        ($.actualize && ($ = $.actualize(n.ownerDocument || dn)),
        n.parentNode.replaceChild($, n)),
      $
    );
  };
}
var ap = ip(Gm);
const Pl = document.createElement("i");
function Ds(t) {
  const e = "&" + t + ";";
  Pl.innerHTML = e;
  const n = Pl.textContent;
  return (n.charCodeAt(n.length - 1) === 59 && t !== "semi") || n === e
    ? !1
    : n;
}
function Vt(t, e, n, r) {
  const i = t.length;
  let a = 0,
    s;
  if (
    (e < 0 ? (e = -e > i ? 0 : i + e) : (e = e > i ? i : e),
    (n = n > 0 ? n : 0),
    r.length < 1e4)
  )
    ((s = Array.from(r)), s.unshift(e, n), t.splice(...s));
  else
    for (n && t.splice(e, n); a < r.length; )
      ((s = r.slice(a, a + 1e4)),
        s.unshift(e, 0),
        t.splice(...s),
        (a += 1e4),
        (e += 1e4));
}
function Ut(t, e) {
  return t.length > 0 ? (Vt(t, t.length, 0, e), t) : e;
}
const e0 = {}.hasOwnProperty;
function id(t) {
  const e = {};
  let n = -1;
  for (; ++n < t.length; ) sp(e, t[n]);
  return e;
}
function sp(t, e) {
  let n;
  for (n in e) {
    const i = (e0.call(t, n) ? t[n] : void 0) || (t[n] = {}),
      a = e[n];
    let s;
    if (a)
      for (s in a) {
        e0.call(i, s) || (i[s] = []);
        const o = a[s];
        op(i[s], Array.isArray(o) ? o : o ? [o] : []);
      }
  }
}
function op(t, e) {
  let n = -1;
  const r = [];
  for (; ++n < e.length; ) (e[n].add === "after" ? t : r).push(e[n]);
  Vt(t, 0, 0, r);
}
function ad(t) {
  const e = {};
  let n = -1;
  for (; ++n < t.length; ) lp(e, t[n]);
  return e;
}
function lp(t, e) {
  let n;
  for (n in e) {
    const i = (e0.call(t, n) ? t[n] : void 0) || (t[n] = {}),
      a = e[n];
    let s;
    if (a) for (s in a) i[s] = a[s];
  }
}
function up(t, e) {
  const n = Number.parseInt(t, e);
  return n < 9 ||
    n === 11 ||
    (n > 13 && n < 32) ||
    (n > 126 && n < 160) ||
    (n > 55295 && n < 57344) ||
    (n > 64975 && n < 65008) ||
    (n & 65535) === 65535 ||
    (n & 65535) === 65534 ||
    n > 1114111
    ? "�"
    : String.fromCodePoint(n);
}
const cp = { '"': "quot", "&": "amp", "<": "lt", ">": "gt" };
function sd(t) {
  return t.replace(/["&<>]/g, e);
  function e(n) {
    return "&" + cp[n] + ";";
  }
}
function ir(t) {
  return t
    .replace(/[\t\n\r ]+/g, " ")
    .replace(/^ | $/g, "")
    .toLowerCase()
    .toUpperCase();
}
const Nt = ei(/[A-Za-z]/),
  zt = ei(/[\dA-Za-z]/),
  dp = ei(/[#-'*+\--9=?A-Z^-~]/);
function Is(t) {
  return t !== null && (t < 32 || t === 127);
}
const t0 = ei(/\d/),
  hp = ei(/[\dA-Fa-f]/),
  fp = ei(/[!-/:-@[-`{-~]/);
function ve(t) {
  return t !== null && t < -2;
}
function $e(t) {
  return t !== null && (t < 0 || t === 32);
}
function Be(t) {
  return t === -2 || t === -1 || t === 32;
}
const k0 = ei(new RegExp("\\p{P}|\\p{S}", "u")),
  _i = ei(/\s/);
function ei(t) {
  return e;
  function e(n) {
    return n !== null && n > -1 && t.test(String.fromCharCode(n));
  }
}
function li(t, e) {
  const n = sd(mp(t || ""));
  if (!e) return n;
  const r = n.indexOf(":"),
    i = n.indexOf("?"),
    a = n.indexOf("#"),
    s = n.indexOf("/");
  return r < 0 ||
    (s > -1 && r > s) ||
    (i > -1 && r > i) ||
    (a > -1 && r > a) ||
    e.test(n.slice(0, r))
    ? n
    : "";
}
function mp(t) {
  const e = [];
  let n = -1,
    r = 0,
    i = 0;
  for (; ++n < t.length; ) {
    const a = t.charCodeAt(n);
    let s = "";
    if (a === 37 && zt(t.charCodeAt(n + 1)) && zt(t.charCodeAt(n + 2))) i = 2;
    else if (a < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a)) ||
        (s = String.fromCharCode(a));
    else if (a > 55295 && a < 57344) {
      const o = t.charCodeAt(n + 1);
      a < 56320 && o > 56319 && o < 57344
        ? ((s = String.fromCharCode(a, o)), (i = 1))
        : (s = "�");
    } else s = String.fromCharCode(a);
    (s &&
      (e.push(t.slice(r, n), encodeURIComponent(s)), (r = n + i + 1), (s = "")),
      i && ((n += i), (i = 0)));
  }
  return e.join("") + t.slice(r);
}
const Hl = {}.hasOwnProperty,
  ql = /^(https?|ircs?|mailto|xmpp)$/i,
  pp = /^https?$/i;
function gp(t) {
  const e = t || {};
  let n = !0;
  const r = {},
    i = [[]],
    a = [],
    s = [],
    l = ad([
      {
        enter: {
          blockQuote: R,
          codeFenced: fe,
          codeFencedFenceInfo: A,
          codeFencedFenceMeta: A,
          codeIndented: xe,
          codeText: Te,
          content: Mt,
          definition: wt,
          definitionDestinationString: _t,
          definitionLabelString: A,
          definitionTitleString: A,
          emphasis: Y,
          htmlFlow: dr,
          htmlText: An,
          image: De,
          label: A,
          link: ke,
          listItemMarker: $,
          listItemValue: O,
          listOrdered: j,
          listUnordered: F,
          paragraph: ee,
          reference: A,
          resource: We,
          resourceDestinationString: je,
          resourceTitleString: A,
          setextHeading: xn,
          strong: pe,
        },
        exit: {
          atxHeading: Bt,
          atxHeadingSequence: Dt,
          autolinkEmail: hr,
          autolinkProtocol: nn,
          blockQuote: he,
          characterEscapeValue: Ht,
          characterReferenceMarkerHexadecimal: fn,
          characterReferenceMarkerNumeric: fn,
          characterReferenceValue: Tn,
          codeFenced: z,
          codeFencedFence: ne,
          codeFencedFenceInfo: M,
          codeFencedFenceMeta: _,
          codeFlowValue: cr,
          codeIndented: z,
          codeText: Re,
          codeTextData: Ht,
          data: Ht,
          definition: xt,
          definitionDestinationString: ft,
          definitionLabelString: ut,
          definitionTitleString: mt,
          emphasis: Oe,
          hardBreakEscape: Hn,
          hardBreakTrailing: Hn,
          htmlFlow: Sn,
          htmlFlowData: Ht,
          htmlText: Sn,
          htmlTextData: Ht,
          image: ht,
          label: Ue,
          labelText: Ce,
          lineEnding: kn,
          link: ht,
          listOrdered: G,
          listUnordered: K,
          paragraph: Z,
          reference: _,
          referenceString: Fe,
          resource: _,
          resourceDestinationString: lt,
          resourceTitleString: Et,
          setextHeading: Pt,
          setextHeadingLineSequence: Rt,
          setextHeadingText: Ot,
          strong: it,
          thematicBreak: Ke,
        },
      },
      ...(e.htmlExtensions || []),
    ]),
    u = { definitions: r, tightStack: s },
    h = {
      buffer: A,
      encode: x,
      getData: S,
      lineEndingIfNeeded: E,
      options: e,
      raw: T,
      resume: C,
      setData: y,
      tag: b,
    };
  let d = e.defaultLineEnding;
  return p;
  function p(Q) {
    let ge = -1,
      ct = 0;
    const kt = [];
    let pt = [],
      rn = [];
    for (; ++ge < Q.length; )
      (!d &&
        (Q[ge][1].type === "lineEnding" ||
          Q[ge][1].type === "lineEndingBlank") &&
        (d = Q[ge][2].sliceSerialize(Q[ge][1])),
        (Q[ge][1].type === "listOrdered" ||
          Q[ge][1].type === "listUnordered") &&
          (Q[ge][0] === "enter" ? kt.push(ge) : m(Q.slice(kt.pop(), ge))),
        Q[ge][1].type === "definition" &&
          (Q[ge][0] === "enter"
            ? ((rn = Ut(rn, Q.slice(ct, ge))), (ct = ge))
            : ((pt = Ut(pt, Q.slice(ct, ge + 1))), (ct = ge + 1))));
    ((pt = Ut(pt, rn)), (pt = Ut(pt, Q.slice(ct))), (ge = -1));
    const jt = pt;
    for (l.enter.null && l.enter.null.call(h); ++ge < Q.length; ) {
      const pi = l[jt[ge][0]],
        Wt = jt[ge][1].type,
        En = pi[Wt];
      Hl.call(pi, Wt) &&
        En &&
        En.call({ sliceSerialize: jt[ge][2].sliceSerialize, ...h }, jt[ge][1]);
    }
    return (l.exit.null && l.exit.null.call(h), i[0].join(""));
  }
  function m(Q) {
    const ge = Q.length;
    let ct = 0,
      kt = 0,
      pt = !1,
      rn;
    for (; ++ct < ge; ) {
      const jt = Q[ct];
      if (jt[1]._container) ((rn = void 0), jt[0] === "enter" ? kt++ : kt--);
      else
        switch (jt[1].type) {
          case "listItemPrefix": {
            jt[0] === "exit" && (rn = !0);
            break;
          }
          case "linePrefix":
            break;
          case "lineEndingBlank": {
            jt[0] === "enter" && !kt && (rn ? (rn = void 0) : (pt = !0));
            break;
          }
          default:
            rn = void 0;
        }
    }
    Q[0][1]._loose = pt;
  }
  function y(Q, ge) {
    u[Q] = ge;
  }
  function S(Q) {
    return u[Q];
  }
  function A() {
    i.push([]);
  }
  function C() {
    return i.pop().join("");
  }
  function b(Q) {
    n && (y("lastWasTag", !0), i[i.length - 1].push(Q));
  }
  function T(Q) {
    (y("lastWasTag"), i[i.length - 1].push(Q));
  }
  function v() {
    T(
      d ||
        `
`,
    );
  }
  function E() {
    const Q = i[i.length - 1],
      ge = Q[Q.length - 1],
      ct = ge ? ge.charCodeAt(ge.length - 1) : null;
    ct === 10 || ct === 13 || ct === null || v();
  }
  function x(Q) {
    return S("ignoreEncode") ? Q : sd(Q);
  }
  function _() {
    C();
  }
  function j(Q) {
    (s.push(!Q._loose), E(), b("<ol"), y("expectFirstItem", !0));
  }
  function F(Q) {
    (s.push(!Q._loose), E(), b("<ul"), y("expectFirstItem", !0));
  }
  function O(Q) {
    if (S("expectFirstItem")) {
      const ge = Number.parseInt(this.sliceSerialize(Q), 10);
      ge !== 1 && b(' start="' + x(String(ge)) + '"');
    }
  }
  function $() {
    (S("expectFirstItem") ? b(">") : le(),
      E(),
      b("<li>"),
      y("expectFirstItem"),
      y("lastWasTag"));
  }
  function G() {
    (le(), s.pop(), v(), b("</ol>"));
  }
  function K() {
    (le(), s.pop(), v(), b("</ul>"));
  }
  function le() {
    (S("lastWasTag") && !S("slurpAllLineEndings") && E(),
      b("</li>"),
      y("slurpAllLineEndings"));
  }
  function R() {
    (s.push(!1), E(), b("<blockquote>"));
  }
  function he() {
    (s.pop(), E(), b("</blockquote>"), y("slurpAllLineEndings"));
  }
  function ee() {
    (s[s.length - 1] || (E(), b("<p>")), y("slurpAllLineEndings"));
  }
  function Z() {
    s[s.length - 1] ? y("slurpAllLineEndings", !0) : b("</p>");
  }
  function fe() {
    (E(), b("<pre><code"), y("fencesCount", 0));
  }
  function M() {
    const Q = C();
    b(' class="language-' + Q + '"');
  }
  function ne() {
    const Q = S("fencesCount") || 0;
    (Q || (b(">"), y("slurpOneLineEnding", !0)), y("fencesCount", Q + 1));
  }
  function xe() {
    (E(), b("<pre><code>"));
  }
  function z() {
    const Q = S("fencesCount");
    (Q !== void 0 &&
      Q < 2 &&
      u.tightStack.length > 0 &&
      !S("lastWasTag") &&
      v(),
      S("flowCodeSeenData") && E(),
      b("</code></pre>"),
      Q !== void 0 && Q < 2 && E(),
      y("flowCodeSeenData"),
      y("fencesCount"),
      y("slurpOneLineEnding"));
  }
  function De() {
    (a.push({ image: !0 }), (n = void 0));
  }
  function ke() {
    a.push({});
  }
  function Ce(Q) {
    a[a.length - 1].labelId = this.sliceSerialize(Q);
  }
  function Ue() {
    a[a.length - 1].label = C();
  }
  function Fe(Q) {
    a[a.length - 1].referenceId = this.sliceSerialize(Q);
  }
  function We() {
    (A(), (a[a.length - 1].destination = ""));
  }
  function je() {
    (A(), y("ignoreEncode", !0));
  }
  function lt() {
    ((a[a.length - 1].destination = C()), y("ignoreEncode"));
  }
  function Et() {
    a[a.length - 1].title = C();
  }
  function ht() {
    let Q = a.length - 1;
    const ge = a[Q],
      ct = ge.referenceId || ge.labelId,
      kt = ge.destination === void 0 ? r[ir(ct)] : ge;
    for (n = !0; Q--; )
      if (a[Q].image) {
        n = void 0;
        break;
      }
    (ge.image
      ? (b(
          '<img src="' +
            li(kt.destination, e.allowDangerousProtocol ? void 0 : pp) +
            '" alt="',
        ),
        T(ge.label),
        b('"'))
      : b(
          '<a href="' +
            li(kt.destination, e.allowDangerousProtocol ? void 0 : ql) +
            '"',
        ),
      b(kt.title ? ' title="' + kt.title + '"' : ""),
      ge.image ? b(" />") : (b(">"), T(ge.label), b("</a>")),
      a.pop());
  }
  function wt() {
    (A(), a.push({}));
  }
  function ut(Q) {
    (C(), (a[a.length - 1].labelId = this.sliceSerialize(Q)));
  }
  function _t() {
    (A(), y("ignoreEncode", !0));
  }
  function ft() {
    ((a[a.length - 1].destination = C()), y("ignoreEncode"));
  }
  function mt() {
    a[a.length - 1].title = C();
  }
  function xt() {
    const Q = a[a.length - 1],
      ge = ir(Q.labelId);
    (C(), Hl.call(r, ge) || (r[ge] = a[a.length - 1]), a.pop());
  }
  function Mt() {
    y("slurpAllLineEndings", !0);
  }
  function Dt(Q) {
    S("headingRank") ||
      (y("headingRank", this.sliceSerialize(Q).length),
      E(),
      b("<h" + S("headingRank") + ">"));
  }
  function xn() {
    (A(), y("slurpAllLineEndings"));
  }
  function Ot() {
    y("slurpAllLineEndings", !0);
  }
  function Bt() {
    (b("</h" + S("headingRank") + ">"), y("headingRank"));
  }
  function Rt(Q) {
    y("headingRank", this.sliceSerialize(Q).charCodeAt(0) === 61 ? 1 : 2);
  }
  function Pt() {
    const Q = C();
    (E(),
      b("<h" + S("headingRank") + ">"),
      T(Q),
      b("</h" + S("headingRank") + ">"),
      y("slurpAllLineEndings"),
      y("headingRank"));
  }
  function Ht(Q) {
    T(x(this.sliceSerialize(Q)));
  }
  function kn(Q) {
    if (!S("slurpAllLineEndings")) {
      if (S("slurpOneLineEnding")) {
        y("slurpOneLineEnding");
        return;
      }
      if (S("inCodeText")) {
        T(" ");
        return;
      }
      T(x(this.sliceSerialize(Q)));
    }
  }
  function cr(Q) {
    (T(x(this.sliceSerialize(Q))), y("flowCodeSeenData", !0));
  }
  function Hn() {
    b("<br />");
  }
  function dr() {
    (E(), An());
  }
  function Sn() {
    y("ignoreEncode");
  }
  function An() {
    e.allowDangerousHtml && y("ignoreEncode", !0);
  }
  function Y() {
    b("<em>");
  }
  function pe() {
    b("<strong>");
  }
  function Te() {
    (y("inCodeText", !0), b("<code>"));
  }
  function Re() {
    (y("inCodeText"), b("</code>"));
  }
  function Oe() {
    b("</em>");
  }
  function it() {
    b("</strong>");
  }
  function Ke() {
    (E(), b("<hr />"));
  }
  function fn(Q) {
    y("characterReferenceType", Q.type);
  }
  function Tn(Q) {
    const ge = this.sliceSerialize(Q),
      ct = S("characterReferenceType")
        ? up(
            ge,
            S("characterReferenceType") === "characterReferenceMarkerNumeric"
              ? 10
              : 16,
          )
        : Ds(ge);
    (T(x(ct)), y("characterReferenceType"));
  }
  function nn(Q) {
    const ge = this.sliceSerialize(Q);
    (b('<a href="' + li(ge, e.allowDangerousProtocol ? void 0 : ql) + '">'),
      T(x(ge)),
      b("</a>"));
  }
  function hr(Q) {
    const ge = this.sliceSerialize(Q);
    (b('<a href="' + li("mailto:" + ge) + '">'), T(x(ge)), b("</a>"));
  }
}
function Ne(t, e, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let a = 0;
  return s;
  function s(l) {
    return Be(l) ? (t.enter(n), o(l)) : e(l);
  }
  function o(l) {
    return Be(l) && a++ < i ? (t.consume(l), o) : (t.exit(n), e(l));
  }
}
const vp = { tokenize: bp };
function bp(t) {
  const e = t.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return e;
  function r(o) {
    if (o === null) {
      t.consume(o);
      return;
    }
    return (
      t.enter("lineEnding"),
      t.consume(o),
      t.exit("lineEnding"),
      Ne(t, e, "linePrefix")
    );
  }
  function i(o) {
    return (t.enter("paragraph"), a(o));
  }
  function a(o) {
    const l = t.enter("chunkText", { contentType: "text", previous: n });
    return (n && (n.next = l), (n = l), s(o));
  }
  function s(o) {
    if (o === null) {
      (t.exit("chunkText"), t.exit("paragraph"), t.consume(o));
      return;
    }
    return ve(o) ? (t.consume(o), t.exit("chunkText"), a) : (t.consume(o), s);
  }
}
const yp = { tokenize: wp },
  Ul = { tokenize: xp };
function wp(t) {
  const e = this,
    n = [];
  let r = 0,
    i,
    a,
    s;
  return o;
  function o(T) {
    if (r < n.length) {
      const v = n[r];
      return ((e.containerState = v[1]), t.attempt(v[0].continuation, l, u)(T));
    }
    return u(T);
  }
  function l(T) {
    if ((r++, e.containerState._closeFlow)) {
      ((e.containerState._closeFlow = void 0), i && b());
      const v = e.events.length;
      let E = v,
        x;
      for (; E--; )
        if (e.events[E][0] === "exit" && e.events[E][1].type === "chunkFlow") {
          x = e.events[E][1].end;
          break;
        }
      C(r);
      let _ = v;
      for (; _ < e.events.length; ) ((e.events[_][1].end = { ...x }), _++);
      return (
        Vt(e.events, E + 1, 0, e.events.slice(v)),
        (e.events.length = _),
        u(T)
      );
    }
    return o(T);
  }
  function u(T) {
    if (r === n.length) {
      if (!i) return p(T);
      if (i.currentConstruct && i.currentConstruct.concrete) return y(T);
      e.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return ((e.containerState = {}), t.check(Ul, h, d)(T));
  }
  function h(T) {
    return (i && b(), C(r), p(T));
  }
  function d(T) {
    return (
      (e.parser.lazy[e.now().line] = r !== n.length),
      (s = e.now().offset),
      y(T)
    );
  }
  function p(T) {
    return ((e.containerState = {}), t.attempt(Ul, m, y)(T));
  }
  function m(T) {
    return (r++, n.push([e.currentConstruct, e.containerState]), p(T));
  }
  function y(T) {
    if (T === null) {
      (i && b(), C(0), t.consume(T));
      return;
    }
    return (
      (i = i || e.parser.flow(e.now())),
      t.enter("chunkFlow", { _tokenizer: i, contentType: "flow", previous: a }),
      S(T)
    );
  }
  function S(T) {
    if (T === null) {
      (A(t.exit("chunkFlow"), !0), C(0), t.consume(T));
      return;
    }
    return ve(T)
      ? (t.consume(T),
        A(t.exit("chunkFlow")),
        (r = 0),
        (e.interrupt = void 0),
        o)
      : (t.consume(T), S);
  }
  function A(T, v) {
    const E = e.sliceStream(T);
    if (
      (v && E.push(null),
      (T.previous = a),
      a && (a.next = T),
      (a = T),
      i.defineSkip(T.start),
      i.write(E),
      e.parser.lazy[T.start.line])
    ) {
      let x = i.events.length;
      for (; x--; )
        if (
          i.events[x][1].start.offset < s &&
          (!i.events[x][1].end || i.events[x][1].end.offset > s)
        )
          return;
      const _ = e.events.length;
      let j = _,
        F,
        O;
      for (; j--; )
        if (e.events[j][0] === "exit" && e.events[j][1].type === "chunkFlow") {
          if (F) {
            O = e.events[j][1].end;
            break;
          }
          F = !0;
        }
      for (C(r), x = _; x < e.events.length; )
        ((e.events[x][1].end = { ...O }), x++);
      (Vt(e.events, j + 1, 0, e.events.slice(_)), (e.events.length = x));
    }
  }
  function C(T) {
    let v = n.length;
    for (; v-- > T; ) {
      const E = n[v];
      ((e.containerState = E[1]), E[0].exit.call(e, t));
    }
    n.length = T;
  }
  function b() {
    (i.write([null]),
      (a = void 0),
      (i = void 0),
      (e.containerState._closeFlow = void 0));
  }
}
function xp(t, e, n) {
  return Ne(
    t,
    t.attempt(this.parser.constructs.document, e, n),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
  );
}
function Oi(t) {
  if (t === null || $e(t) || _i(t)) return 1;
  if (k0(t)) return 2;
}
function Ca(t, e, n) {
  const r = [];
  let i = -1;
  for (; ++i < t.length; ) {
    const a = t[i].resolveAll;
    a && !r.includes(a) && ((e = a(e, n)), r.push(a));
  }
  return e;
}
const n0 = { name: "attention", resolveAll: kp, tokenize: Sp };
function kp(t, e) {
  let n = -1,
    r,
    i,
    a,
    s,
    o,
    l,
    u,
    h;
  for (; ++n < t.length; )
    if (
      t[n][0] === "enter" &&
      t[n][1].type === "attentionSequence" &&
      t[n][1]._close
    ) {
      for (r = n; r--; )
        if (
          t[r][0] === "exit" &&
          t[r][1].type === "attentionSequence" &&
          t[r][1]._open &&
          e.sliceSerialize(t[r][1]).charCodeAt(0) ===
            e.sliceSerialize(t[n][1]).charCodeAt(0)
        ) {
          if (
            (t[r][1]._close || t[n][1]._open) &&
            (t[n][1].end.offset - t[n][1].start.offset) % 3 &&
            !(
              (t[r][1].end.offset -
                t[r][1].start.offset +
                t[n][1].end.offset -
                t[n][1].start.offset) %
              3
            )
          )
            continue;
          l =
            t[r][1].end.offset - t[r][1].start.offset > 1 &&
            t[n][1].end.offset - t[n][1].start.offset > 1
              ? 2
              : 1;
          const d = { ...t[r][1].end },
            p = { ...t[n][1].start };
          ($l(d, -l),
            $l(p, l),
            (s = {
              type: l > 1 ? "strongSequence" : "emphasisSequence",
              start: d,
              end: { ...t[r][1].end },
            }),
            (o = {
              type: l > 1 ? "strongSequence" : "emphasisSequence",
              start: { ...t[n][1].start },
              end: p,
            }),
            (a = {
              type: l > 1 ? "strongText" : "emphasisText",
              start: { ...t[r][1].end },
              end: { ...t[n][1].start },
            }),
            (i = {
              type: l > 1 ? "strong" : "emphasis",
              start: { ...s.start },
              end: { ...o.end },
            }),
            (t[r][1].end = { ...s.start }),
            (t[n][1].start = { ...o.end }),
            (u = []),
            t[r][1].end.offset - t[r][1].start.offset &&
              (u = Ut(u, [
                ["enter", t[r][1], e],
                ["exit", t[r][1], e],
              ])),
            (u = Ut(u, [
              ["enter", i, e],
              ["enter", s, e],
              ["exit", s, e],
              ["enter", a, e],
            ])),
            (u = Ut(
              u,
              Ca(e.parser.constructs.insideSpan.null, t.slice(r + 1, n), e),
            )),
            (u = Ut(u, [
              ["exit", a, e],
              ["enter", o, e],
              ["exit", o, e],
              ["exit", i, e],
            ])),
            t[n][1].end.offset - t[n][1].start.offset
              ? ((h = 2),
                (u = Ut(u, [
                  ["enter", t[n][1], e],
                  ["exit", t[n][1], e],
                ])))
              : (h = 0),
            Vt(t, r - 1, n - r + 3, u),
            (n = r + u.length - h - 2));
          break;
        }
    }
  for (n = -1; ++n < t.length; )
    t[n][1].type === "attentionSequence" && (t[n][1].type = "data");
  return t;
}
function Sp(t, e) {
  const n = this.parser.constructs.attentionMarkers.null,
    r = this.previous,
    i = Oi(r);
  let a;
  return s;
  function s(l) {
    return ((a = l), t.enter("attentionSequence"), o(l));
  }
  function o(l) {
    if (l === a) return (t.consume(l), o);
    const u = t.exit("attentionSequence"),
      h = Oi(l),
      d = !h || (h === 2 && i) || n.includes(l),
      p = !i || (i === 2 && h) || n.includes(r);
    return (
      (u._open = !!(a === 42 ? d : d && (i || !p))),
      (u._close = !!(a === 42 ? p : p && (h || !d))),
      e(l)
    );
  }
}
function $l(t, e) {
  ((t.column += e), (t.offset += e), (t._bufferIndex += e));
}
const Ap = { name: "autolink", tokenize: Tp };
function Tp(t, e, n) {
  let r = 0;
  return i;
  function i(m) {
    return (
      t.enter("autolink"),
      t.enter("autolinkMarker"),
      t.consume(m),
      t.exit("autolinkMarker"),
      t.enter("autolinkProtocol"),
      a
    );
  }
  function a(m) {
    return Nt(m) ? (t.consume(m), s) : m === 64 ? n(m) : u(m);
  }
  function s(m) {
    return m === 43 || m === 45 || m === 46 || zt(m) ? ((r = 1), o(m)) : u(m);
  }
  function o(m) {
    return m === 58
      ? (t.consume(m), (r = 0), l)
      : (m === 43 || m === 45 || m === 46 || zt(m)) && r++ < 32
        ? (t.consume(m), o)
        : ((r = 0), u(m));
  }
  function l(m) {
    return m === 62
      ? (t.exit("autolinkProtocol"),
        t.enter("autolinkMarker"),
        t.consume(m),
        t.exit("autolinkMarker"),
        t.exit("autolink"),
        e)
      : m === null || m === 32 || m === 60 || Is(m)
        ? n(m)
        : (t.consume(m), l);
  }
  function u(m) {
    return m === 64 ? (t.consume(m), h) : dp(m) ? (t.consume(m), u) : n(m);
  }
  function h(m) {
    return zt(m) ? d(m) : n(m);
  }
  function d(m) {
    return m === 46
      ? (t.consume(m), (r = 0), h)
      : m === 62
        ? ((t.exit("autolinkProtocol").type = "autolinkEmail"),
          t.enter("autolinkMarker"),
          t.consume(m),
          t.exit("autolinkMarker"),
          t.exit("autolink"),
          e)
        : p(m);
  }
  function p(m) {
    if ((m === 45 || zt(m)) && r++ < 63) {
      const y = m === 45 ? p : d;
      return (t.consume(m), y);
    }
    return n(m);
  }
}
const La = { partial: !0, tokenize: Ep };
function Ep(t, e, n) {
  return r;
  function r(a) {
    return Be(a) ? Ne(t, i, "linePrefix")(a) : i(a);
  }
  function i(a) {
    return a === null || ve(a) ? e(a) : n(a);
  }
}
const od = {
  continuation: { tokenize: Lp },
  exit: Mp,
  name: "blockQuote",
  tokenize: Cp,
};
function Cp(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    if (s === 62) {
      const o = r.containerState;
      return (
        o.open || (t.enter("blockQuote", { _container: !0 }), (o.open = !0)),
        t.enter("blockQuotePrefix"),
        t.enter("blockQuoteMarker"),
        t.consume(s),
        t.exit("blockQuoteMarker"),
        a
      );
    }
    return n(s);
  }
  function a(s) {
    return Be(s)
      ? (t.enter("blockQuotePrefixWhitespace"),
        t.consume(s),
        t.exit("blockQuotePrefixWhitespace"),
        t.exit("blockQuotePrefix"),
        e)
      : (t.exit("blockQuotePrefix"), e(s));
  }
}
function Lp(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return Be(s)
      ? Ne(
          t,
          a,
          "linePrefix",
          r.parser.constructs.disable.null.includes("codeIndented")
            ? void 0
            : 4,
        )(s)
      : a(s);
  }
  function a(s) {
    return t.attempt(od, e, n)(s);
  }
}
function Mp(t) {
  t.exit("blockQuote");
}
const ld = { name: "characterEscape", tokenize: zp };
function zp(t, e, n) {
  return r;
  function r(a) {
    return (
      t.enter("characterEscape"),
      t.enter("escapeMarker"),
      t.consume(a),
      t.exit("escapeMarker"),
      i
    );
  }
  function i(a) {
    return fp(a)
      ? (t.enter("characterEscapeValue"),
        t.consume(a),
        t.exit("characterEscapeValue"),
        t.exit("characterEscape"),
        e)
      : n(a);
  }
}
const ud = { name: "characterReference", tokenize: Dp };
function Dp(t, e, n) {
  const r = this;
  let i = 0,
    a,
    s;
  return o;
  function o(d) {
    return (
      t.enter("characterReference"),
      t.enter("characterReferenceMarker"),
      t.consume(d),
      t.exit("characterReferenceMarker"),
      l
    );
  }
  function l(d) {
    return d === 35
      ? (t.enter("characterReferenceMarkerNumeric"),
        t.consume(d),
        t.exit("characterReferenceMarkerNumeric"),
        u)
      : (t.enter("characterReferenceValue"), (a = 31), (s = zt), h(d));
  }
  function u(d) {
    return d === 88 || d === 120
      ? (t.enter("characterReferenceMarkerHexadecimal"),
        t.consume(d),
        t.exit("characterReferenceMarkerHexadecimal"),
        t.enter("characterReferenceValue"),
        (a = 6),
        (s = hp),
        h)
      : (t.enter("characterReferenceValue"), (a = 7), (s = t0), h(d));
  }
  function h(d) {
    if (d === 59 && i) {
      const p = t.exit("characterReferenceValue");
      return s === zt && !Ds(r.sliceSerialize(p))
        ? n(d)
        : (t.enter("characterReferenceMarker"),
          t.consume(d),
          t.exit("characterReferenceMarker"),
          t.exit("characterReference"),
          e);
    }
    return s(d) && i++ < a ? (t.consume(d), h) : n(d);
  }
}
const Vl = { partial: !0, tokenize: Np },
  jl = { concrete: !0, name: "codeFenced", tokenize: Ip };
function Ip(t, e, n) {
  const r = this,
    i = { partial: !0, tokenize: E };
  let a = 0,
    s = 0,
    o;
  return l;
  function l(x) {
    return u(x);
  }
  function u(x) {
    const _ = r.events[r.events.length - 1];
    return (
      (a =
        _ && _[1].type === "linePrefix"
          ? _[2].sliceSerialize(_[1], !0).length
          : 0),
      (o = x),
      t.enter("codeFenced"),
      t.enter("codeFencedFence"),
      t.enter("codeFencedFenceSequence"),
      h(x)
    );
  }
  function h(x) {
    return x === o
      ? (s++, t.consume(x), h)
      : s < 3
        ? n(x)
        : (t.exit("codeFencedFenceSequence"),
          Be(x) ? Ne(t, d, "whitespace")(x) : d(x));
  }
  function d(x) {
    return x === null || ve(x)
      ? (t.exit("codeFencedFence"), r.interrupt ? e(x) : t.check(Vl, S, v)(x))
      : (t.enter("codeFencedFenceInfo"),
        t.enter("chunkString", { contentType: "string" }),
        p(x));
  }
  function p(x) {
    return x === null || ve(x)
      ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), d(x))
      : Be(x)
        ? (t.exit("chunkString"),
          t.exit("codeFencedFenceInfo"),
          Ne(t, m, "whitespace")(x))
        : x === 96 && x === o
          ? n(x)
          : (t.consume(x), p);
  }
  function m(x) {
    return x === null || ve(x)
      ? d(x)
      : (t.enter("codeFencedFenceMeta"),
        t.enter("chunkString", { contentType: "string" }),
        y(x));
  }
  function y(x) {
    return x === null || ve(x)
      ? (t.exit("chunkString"), t.exit("codeFencedFenceMeta"), d(x))
      : x === 96 && x === o
        ? n(x)
        : (t.consume(x), y);
  }
  function S(x) {
    return t.attempt(i, v, A)(x);
  }
  function A(x) {
    return (t.enter("lineEnding"), t.consume(x), t.exit("lineEnding"), C);
  }
  function C(x) {
    return a > 0 && Be(x) ? Ne(t, b, "linePrefix", a + 1)(x) : b(x);
  }
  function b(x) {
    return x === null || ve(x)
      ? t.check(Vl, S, v)(x)
      : (t.enter("codeFlowValue"), T(x));
  }
  function T(x) {
    return x === null || ve(x)
      ? (t.exit("codeFlowValue"), b(x))
      : (t.consume(x), T);
  }
  function v(x) {
    return (t.exit("codeFenced"), e(x));
  }
  function E(x, _, j) {
    let F = 0;
    return O;
    function O(R) {
      return (x.enter("lineEnding"), x.consume(R), x.exit("lineEnding"), $);
    }
    function $(R) {
      return (
        x.enter("codeFencedFence"),
        Be(R)
          ? Ne(
              x,
              G,
              "linePrefix",
              r.parser.constructs.disable.null.includes("codeIndented")
                ? void 0
                : 4,
            )(R)
          : G(R)
      );
    }
    function G(R) {
      return R === o ? (x.enter("codeFencedFenceSequence"), K(R)) : j(R);
    }
    function K(R) {
      return R === o
        ? (F++, x.consume(R), K)
        : F >= s
          ? (x.exit("codeFencedFenceSequence"),
            Be(R) ? Ne(x, le, "whitespace")(R) : le(R))
          : j(R);
    }
    function le(R) {
      return R === null || ve(R) ? (x.exit("codeFencedFence"), _(R)) : j(R);
    }
  }
}
function Np(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return s === null
      ? n(s)
      : (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), a);
  }
  function a(s) {
    return r.parser.lazy[r.now().line] ? n(s) : e(s);
  }
}
const ko = { name: "codeIndented", tokenize: _p },
  Fp = { partial: !0, tokenize: Op };
function _p(t, e, n) {
  const r = this;
  return i;
  function i(u) {
    return (t.enter("codeIndented"), Ne(t, a, "linePrefix", 5)(u));
  }
  function a(u) {
    const h = r.events[r.events.length - 1];
    return h &&
      h[1].type === "linePrefix" &&
      h[2].sliceSerialize(h[1], !0).length >= 4
      ? s(u)
      : n(u);
  }
  function s(u) {
    return u === null
      ? l(u)
      : ve(u)
        ? t.attempt(Fp, s, l)(u)
        : (t.enter("codeFlowValue"), o(u));
  }
  function o(u) {
    return u === null || ve(u)
      ? (t.exit("codeFlowValue"), s(u))
      : (t.consume(u), o);
  }
  function l(u) {
    return (t.exit("codeIndented"), e(u));
  }
}
function Op(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return r.parser.lazy[r.now().line]
      ? n(s)
      : ve(s)
        ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), i)
        : Ne(t, a, "linePrefix", 5)(s);
  }
  function a(s) {
    const o = r.events[r.events.length - 1];
    return o &&
      o[1].type === "linePrefix" &&
      o[2].sliceSerialize(o[1], !0).length >= 4
      ? e(s)
      : ve(s)
        ? i(s)
        : n(s);
  }
}
const Bp = { name: "codeText", previous: Pp, resolve: Rp, tokenize: Hp };
function Rp(t) {
  let e = t.length - 4,
    n = 3,
    r,
    i;
  if (
    (t[n][1].type === "lineEnding" || t[n][1].type === "space") &&
    (t[e][1].type === "lineEnding" || t[e][1].type === "space")
  ) {
    for (r = n; ++r < e; )
      if (t[r][1].type === "codeTextData") {
        ((t[n][1].type = "codeTextPadding"),
          (t[e][1].type = "codeTextPadding"),
          (n += 2),
          (e -= 2));
        break;
      }
  }
  for (r = n - 1, e++; ++r <= e; )
    i === void 0
      ? r !== e && t[r][1].type !== "lineEnding" && (i = r)
      : (r === e || t[r][1].type === "lineEnding") &&
        ((t[i][1].type = "codeTextData"),
        r !== i + 2 &&
          ((t[i][1].end = t[r - 1][1].end),
          t.splice(i + 2, r - i - 2),
          (e -= r - i - 2),
          (r = i + 2)),
        (i = void 0));
  return t;
}
function Pp(t) {
  return (
    t !== 96 ||
    this.events[this.events.length - 1][1].type === "characterEscape"
  );
}
function Hp(t, e, n) {
  let r = 0,
    i,
    a;
  return s;
  function s(d) {
    return (t.enter("codeText"), t.enter("codeTextSequence"), o(d));
  }
  function o(d) {
    return d === 96
      ? (t.consume(d), r++, o)
      : (t.exit("codeTextSequence"), l(d));
  }
  function l(d) {
    return d === null
      ? n(d)
      : d === 32
        ? (t.enter("space"), t.consume(d), t.exit("space"), l)
        : d === 96
          ? ((a = t.enter("codeTextSequence")), (i = 0), h(d))
          : ve(d)
            ? (t.enter("lineEnding"), t.consume(d), t.exit("lineEnding"), l)
            : (t.enter("codeTextData"), u(d));
  }
  function u(d) {
    return d === null || d === 32 || d === 96 || ve(d)
      ? (t.exit("codeTextData"), l(d))
      : (t.consume(d), u);
  }
  function h(d) {
    return d === 96
      ? (t.consume(d), i++, h)
      : i === r
        ? (t.exit("codeTextSequence"), t.exit("codeText"), e(d))
        : ((a.type = "codeTextData"), u(d));
  }
}
class qp {
  constructor(e) {
    ((this.left = e ? [...e] : []), (this.right = []));
  }
  get(e) {
    if (e < 0 || e >= this.left.length + this.right.length)
      throw new RangeError(
        "Cannot access index `" +
          e +
          "` in a splice buffer of size `" +
          (this.left.length + this.right.length) +
          "`",
      );
    return e < this.left.length
      ? this.left[e]
      : this.right[this.right.length - e + this.left.length - 1];
  }
  get length() {
    return this.left.length + this.right.length;
  }
  shift() {
    return (this.setCursor(0), this.right.pop());
  }
  slice(e, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length
      ? this.left.slice(e, r)
      : e > this.left.length
        ? this.right
            .slice(
              this.right.length - r + this.left.length,
              this.right.length - e + this.left.length,
            )
            .reverse()
        : this.left
            .slice(e)
            .concat(
              this.right
                .slice(this.right.length - r + this.left.length)
                .reverse(),
            );
  }
  splice(e, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(e));
    const a = this.right.splice(
      this.right.length - i,
      Number.POSITIVE_INFINITY,
    );
    return (r && ea(this.left, r), a.reverse());
  }
  pop() {
    return (this.setCursor(Number.POSITIVE_INFINITY), this.left.pop());
  }
  push(e) {
    (this.setCursor(Number.POSITIVE_INFINITY), this.left.push(e));
  }
  pushMany(e) {
    (this.setCursor(Number.POSITIVE_INFINITY), ea(this.left, e));
  }
  unshift(e) {
    (this.setCursor(0), this.right.push(e));
  }
  unshiftMany(e) {
    (this.setCursor(0), ea(this.right, e.reverse()));
  }
  setCursor(e) {
    if (
      !(
        e === this.left.length ||
        (e > this.left.length && this.right.length === 0) ||
        (e < 0 && this.left.length === 0)
      )
    )
      if (e < this.left.length) {
        const n = this.left.splice(e, Number.POSITIVE_INFINITY);
        ea(this.right, n.reverse());
      } else {
        const n = this.right.splice(
          this.left.length + this.right.length - e,
          Number.POSITIVE_INFINITY,
        );
        ea(this.left, n.reverse());
      }
  }
}
function ea(t, e) {
  let n = 0;
  if (e.length < 1e4) t.push(...e);
  else for (; n < e.length; ) (t.push(...e.slice(n, n + 1e4)), (n += 1e4));
}
function cd(t) {
  const e = {};
  let n = -1,
    r,
    i,
    a,
    s,
    o,
    l,
    u;
  const h = new qp(t);
  for (; ++n < h.length; ) {
    for (; n in e; ) n = e[n];
    if (
      ((r = h.get(n)),
      n &&
        r[1].type === "chunkFlow" &&
        h.get(n - 1)[1].type === "listItemPrefix" &&
        ((l = r[1]._tokenizer.events),
        (a = 0),
        a < l.length && l[a][1].type === "lineEndingBlank" && (a += 2),
        a < l.length && l[a][1].type === "content"))
    )
      for (; ++a < l.length && l[a][1].type !== "content"; )
        l[a][1].type === "chunkText" &&
          ((l[a][1]._isInFirstContentOfListItem = !0), a++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(e, Up(h, n)), (n = e[n]), (u = !0));
    else if (r[1]._container) {
      for (a = n, i = void 0; a--; )
        if (
          ((s = h.get(a)),
          s[1].type === "lineEnding" || s[1].type === "lineEndingBlank")
        )
          s[0] === "enter" &&
            (i && (h.get(i)[1].type = "lineEndingBlank"),
            (s[1].type = "lineEnding"),
            (i = a));
        else if (
          !(s[1].type === "linePrefix" || s[1].type === "listItemIndent")
        )
          break;
      i &&
        ((r[1].end = { ...h.get(i)[1].start }),
        (o = h.slice(i, n)),
        o.unshift(r),
        h.splice(i, n - i + 1, o));
    }
  }
  return (Vt(t, 0, Number.POSITIVE_INFINITY, h.slice(0)), !u);
}
function Up(t, e) {
  const n = t.get(e)[1],
    r = t.get(e)[2];
  let i = e - 1;
  const a = [];
  let s = n._tokenizer;
  s ||
    ((s = r.parser[n.contentType](n.start)),
    n._contentTypeTextTrailing && (s._contentTypeTextTrailing = !0));
  const o = s.events,
    l = [],
    u = {};
  let h,
    d,
    p = -1,
    m = n,
    y = 0,
    S = 0;
  const A = [S];
  for (; m; ) {
    for (; t.get(++i)[1] !== m; );
    (a.push(i),
      m._tokenizer ||
        ((h = r.sliceStream(m)),
        m.next || h.push(null),
        d && s.defineSkip(m.start),
        m._isInFirstContentOfListItem &&
          (s._gfmTasklistFirstContentOfListItem = !0),
        s.write(h),
        m._isInFirstContentOfListItem &&
          (s._gfmTasklistFirstContentOfListItem = void 0)),
      (d = m),
      (m = m.next));
  }
  for (m = n; ++p < o.length; )
    o[p][0] === "exit" &&
      o[p - 1][0] === "enter" &&
      o[p][1].type === o[p - 1][1].type &&
      o[p][1].start.line !== o[p][1].end.line &&
      ((S = p + 1),
      A.push(S),
      (m._tokenizer = void 0),
      (m.previous = void 0),
      (m = m.next));
  for (
    s.events = [],
      m ? ((m._tokenizer = void 0), (m.previous = void 0)) : A.pop(),
      p = A.length;
    p--;

  ) {
    const C = o.slice(A[p], A[p + 1]),
      b = a.pop();
    (l.push([b, b + C.length - 1]), t.splice(b, 2, C));
  }
  for (l.reverse(), p = -1; ++p < l.length; )
    ((u[y + l[p][0]] = y + l[p][1]), (y += l[p][1] - l[p][0] - 1));
  return u;
}
const $p = { resolve: jp, tokenize: Wp },
  Vp = { partial: !0, tokenize: Gp };
function jp(t) {
  return (cd(t), t);
}
function Wp(t, e) {
  let n;
  return r;
  function r(o) {
    return (
      t.enter("content"),
      (n = t.enter("chunkContent", { contentType: "content" })),
      i(o)
    );
  }
  function i(o) {
    return o === null ? a(o) : ve(o) ? t.check(Vp, s, a)(o) : (t.consume(o), i);
  }
  function a(o) {
    return (t.exit("chunkContent"), t.exit("content"), e(o));
  }
  function s(o) {
    return (
      t.consume(o),
      t.exit("chunkContent"),
      (n.next = t.enter("chunkContent", {
        contentType: "content",
        previous: n,
      })),
      (n = n.next),
      i
    );
  }
}
function Gp(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return (
      t.exit("chunkContent"),
      t.enter("lineEnding"),
      t.consume(s),
      t.exit("lineEnding"),
      Ne(t, a, "linePrefix")
    );
  }
  function a(s) {
    if (s === null || ve(s)) return n(s);
    const o = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") &&
      o &&
      o[1].type === "linePrefix" &&
      o[2].sliceSerialize(o[1], !0).length >= 4
      ? e(s)
      : t.interrupt(r.parser.constructs.flow, n, e)(s);
  }
}
function dd(t, e, n, r, i, a, s, o, l) {
  const u = l || Number.POSITIVE_INFINITY;
  let h = 0;
  return d;
  function d(C) {
    return C === 60
      ? (t.enter(r), t.enter(i), t.enter(a), t.consume(C), t.exit(a), p)
      : C === null || C === 32 || C === 41 || Is(C)
        ? n(C)
        : (t.enter(r),
          t.enter(s),
          t.enter(o),
          t.enter("chunkString", { contentType: "string" }),
          S(C));
  }
  function p(C) {
    return C === 62
      ? (t.enter(a), t.consume(C), t.exit(a), t.exit(i), t.exit(r), e)
      : (t.enter(o), t.enter("chunkString", { contentType: "string" }), m(C));
  }
  function m(C) {
    return C === 62
      ? (t.exit("chunkString"), t.exit(o), p(C))
      : C === null || C === 60 || ve(C)
        ? n(C)
        : (t.consume(C), C === 92 ? y : m);
  }
  function y(C) {
    return C === 60 || C === 62 || C === 92 ? (t.consume(C), m) : m(C);
  }
  function S(C) {
    return !h && (C === null || C === 41 || $e(C))
      ? (t.exit("chunkString"), t.exit(o), t.exit(s), t.exit(r), e(C))
      : h < u && C === 40
        ? (t.consume(C), h++, S)
        : C === 41
          ? (t.consume(C), h--, S)
          : C === null || C === 32 || C === 40 || Is(C)
            ? n(C)
            : (t.consume(C), C === 92 ? A : S);
  }
  function A(C) {
    return C === 40 || C === 41 || C === 92 ? (t.consume(C), S) : S(C);
  }
}
function hd(t, e, n, r, i, a) {
  const s = this;
  let o = 0,
    l;
  return u;
  function u(m) {
    return (t.enter(r), t.enter(i), t.consume(m), t.exit(i), t.enter(a), h);
  }
  function h(m) {
    return o > 999 ||
      m === null ||
      m === 91 ||
      (m === 93 && !l) ||
      (m === 94 && !o && "_hiddenFootnoteSupport" in s.parser.constructs)
      ? n(m)
      : m === 93
        ? (t.exit(a), t.enter(i), t.consume(m), t.exit(i), t.exit(r), e)
        : ve(m)
          ? (t.enter("lineEnding"), t.consume(m), t.exit("lineEnding"), h)
          : (t.enter("chunkString", { contentType: "string" }), d(m));
  }
  function d(m) {
    return m === null || m === 91 || m === 93 || ve(m) || o++ > 999
      ? (t.exit("chunkString"), h(m))
      : (t.consume(m), l || (l = !Be(m)), m === 92 ? p : d);
  }
  function p(m) {
    return m === 91 || m === 92 || m === 93 ? (t.consume(m), o++, d) : d(m);
  }
}
function fd(t, e, n, r, i, a) {
  let s;
  return o;
  function o(p) {
    return p === 34 || p === 39 || p === 40
      ? (t.enter(r),
        t.enter(i),
        t.consume(p),
        t.exit(i),
        (s = p === 40 ? 41 : p),
        l)
      : n(p);
  }
  function l(p) {
    return p === s
      ? (t.enter(i), t.consume(p), t.exit(i), t.exit(r), e)
      : (t.enter(a), u(p));
  }
  function u(p) {
    return p === s
      ? (t.exit(a), l(s))
      : p === null
        ? n(p)
        : ve(p)
          ? (t.enter("lineEnding"),
            t.consume(p),
            t.exit("lineEnding"),
            Ne(t, u, "linePrefix"))
          : (t.enter("chunkString", { contentType: "string" }), h(p));
  }
  function h(p) {
    return p === s || p === null || ve(p)
      ? (t.exit("chunkString"), u(p))
      : (t.consume(p), p === 92 ? d : h);
  }
  function d(p) {
    return p === s || p === 92 ? (t.consume(p), h) : h(p);
  }
}
function br(t, e) {
  let n;
  return r;
  function r(i) {
    return ve(i)
      ? (t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), (n = !0), r)
      : Be(i)
        ? Ne(t, r, n ? "linePrefix" : "lineSuffix")(i)
        : e(i);
  }
}
const Yp = { name: "definition", tokenize: Kp },
  Xp = { partial: !0, tokenize: Qp };
function Kp(t, e, n) {
  const r = this;
  let i;
  return a;
  function a(m) {
    return (t.enter("definition"), s(m));
  }
  function s(m) {
    return hd.call(
      r,
      t,
      o,
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString",
    )(m);
  }
  function o(m) {
    return (
      (i = ir(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))),
      m === 58
        ? (t.enter("definitionMarker"),
          t.consume(m),
          t.exit("definitionMarker"),
          l)
        : n(m)
    );
  }
  function l(m) {
    return $e(m) ? br(t, u)(m) : u(m);
  }
  function u(m) {
    return dd(
      t,
      h,
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString",
    )(m);
  }
  function h(m) {
    return t.attempt(Xp, d, d)(m);
  }
  function d(m) {
    return Be(m) ? Ne(t, p, "whitespace")(m) : p(m);
  }
  function p(m) {
    return m === null || ve(m)
      ? (t.exit("definition"), r.parser.defined.push(i), e(m))
      : n(m);
  }
}
function Qp(t, e, n) {
  return r;
  function r(o) {
    return $e(o) ? br(t, i)(o) : n(o);
  }
  function i(o) {
    return fd(
      t,
      a,
      n,
      "definitionTitle",
      "definitionTitleMarker",
      "definitionTitleString",
    )(o);
  }
  function a(o) {
    return Be(o) ? Ne(t, s, "whitespace")(o) : s(o);
  }
  function s(o) {
    return o === null || ve(o) ? e(o) : n(o);
  }
}
const Zp = { name: "hardBreakEscape", tokenize: Jp };
function Jp(t, e, n) {
  return r;
  function r(a) {
    return (t.enter("hardBreakEscape"), t.consume(a), i);
  }
  function i(a) {
    return ve(a) ? (t.exit("hardBreakEscape"), e(a)) : n(a);
  }
}
const e4 = { name: "headingAtx", resolve: t4, tokenize: n4 };
function t4(t, e) {
  let n = t.length - 2,
    r = 3,
    i,
    a;
  return (
    t[r][1].type === "whitespace" && (r += 2),
    n - 2 > r && t[n][1].type === "whitespace" && (n -= 2),
    t[n][1].type === "atxHeadingSequence" &&
      (r === n - 1 || (n - 4 > r && t[n - 2][1].type === "whitespace")) &&
      (n -= r + 1 === n ? 2 : 4),
    n > r &&
      ((i = { type: "atxHeadingText", start: t[r][1].start, end: t[n][1].end }),
      (a = {
        type: "chunkText",
        start: t[r][1].start,
        end: t[n][1].end,
        contentType: "text",
      }),
      Vt(t, r, n - r + 1, [
        ["enter", i, e],
        ["enter", a, e],
        ["exit", a, e],
        ["exit", i, e],
      ])),
    t
  );
}
function n4(t, e, n) {
  let r = 0;
  return i;
  function i(h) {
    return (t.enter("atxHeading"), a(h));
  }
  function a(h) {
    return (t.enter("atxHeadingSequence"), s(h));
  }
  function s(h) {
    return h === 35 && r++ < 6
      ? (t.consume(h), s)
      : h === null || $e(h)
        ? (t.exit("atxHeadingSequence"), o(h))
        : n(h);
  }
  function o(h) {
    return h === 35
      ? (t.enter("atxHeadingSequence"), l(h))
      : h === null || ve(h)
        ? (t.exit("atxHeading"), e(h))
        : Be(h)
          ? Ne(t, o, "whitespace")(h)
          : (t.enter("atxHeadingText"), u(h));
  }
  function l(h) {
    return h === 35 ? (t.consume(h), l) : (t.exit("atxHeadingSequence"), o(h));
  }
  function u(h) {
    return h === null || h === 35 || $e(h)
      ? (t.exit("atxHeadingText"), o(h))
      : (t.consume(h), u);
  }
}
const r4 = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul",
  ],
  Wl = ["pre", "script", "style", "textarea"],
  i4 = { concrete: !0, name: "htmlFlow", resolveTo: o4, tokenize: l4 },
  a4 = { partial: !0, tokenize: c4 },
  s4 = { partial: !0, tokenize: u4 };
function o4(t) {
  let e = t.length;
  for (; e-- && !(t[e][0] === "enter" && t[e][1].type === "htmlFlow"); );
  return (
    e > 1 &&
      t[e - 2][1].type === "linePrefix" &&
      ((t[e][1].start = t[e - 2][1].start),
      (t[e + 1][1].start = t[e - 2][1].start),
      t.splice(e - 2, 2)),
    t
  );
}
function l4(t, e, n) {
  const r = this;
  let i, a, s, o, l;
  return u;
  function u(z) {
    return h(z);
  }
  function h(z) {
    return (t.enter("htmlFlow"), t.enter("htmlFlowData"), t.consume(z), d);
  }
  function d(z) {
    return z === 33
      ? (t.consume(z), p)
      : z === 47
        ? (t.consume(z), (a = !0), S)
        : z === 63
          ? (t.consume(z), (i = 3), r.interrupt ? e : M)
          : Nt(z)
            ? (t.consume(z), (s = String.fromCharCode(z)), A)
            : n(z);
  }
  function p(z) {
    return z === 45
      ? (t.consume(z), (i = 2), m)
      : z === 91
        ? (t.consume(z), (i = 5), (o = 0), y)
        : Nt(z)
          ? (t.consume(z), (i = 4), r.interrupt ? e : M)
          : n(z);
  }
  function m(z) {
    return z === 45 ? (t.consume(z), r.interrupt ? e : M) : n(z);
  }
  function y(z) {
    const De = "CDATA[";
    return z === De.charCodeAt(o++)
      ? (t.consume(z), o === De.length ? (r.interrupt ? e : G) : y)
      : n(z);
  }
  function S(z) {
    return Nt(z) ? (t.consume(z), (s = String.fromCharCode(z)), A) : n(z);
  }
  function A(z) {
    if (z === null || z === 47 || z === 62 || $e(z)) {
      const De = z === 47,
        ke = s.toLowerCase();
      return !De && !a && Wl.includes(ke)
        ? ((i = 1), r.interrupt ? e(z) : G(z))
        : r4.includes(s.toLowerCase())
          ? ((i = 6), De ? (t.consume(z), C) : r.interrupt ? e(z) : G(z))
          : ((i = 7),
            r.interrupt && !r.parser.lazy[r.now().line]
              ? n(z)
              : a
                ? b(z)
                : T(z));
    }
    return z === 45 || zt(z)
      ? (t.consume(z), (s += String.fromCharCode(z)), A)
      : n(z);
  }
  function C(z) {
    return z === 62 ? (t.consume(z), r.interrupt ? e : G) : n(z);
  }
  function b(z) {
    return Be(z) ? (t.consume(z), b) : O(z);
  }
  function T(z) {
    return z === 47
      ? (t.consume(z), O)
      : z === 58 || z === 95 || Nt(z)
        ? (t.consume(z), v)
        : Be(z)
          ? (t.consume(z), T)
          : O(z);
  }
  function v(z) {
    return z === 45 || z === 46 || z === 58 || z === 95 || zt(z)
      ? (t.consume(z), v)
      : E(z);
  }
  function E(z) {
    return z === 61 ? (t.consume(z), x) : Be(z) ? (t.consume(z), E) : T(z);
  }
  function x(z) {
    return z === null || z === 60 || z === 61 || z === 62 || z === 96
      ? n(z)
      : z === 34 || z === 39
        ? (t.consume(z), (l = z), _)
        : Be(z)
          ? (t.consume(z), x)
          : j(z);
  }
  function _(z) {
    return z === l
      ? (t.consume(z), (l = null), F)
      : z === null || ve(z)
        ? n(z)
        : (t.consume(z), _);
  }
  function j(z) {
    return z === null ||
      z === 34 ||
      z === 39 ||
      z === 47 ||
      z === 60 ||
      z === 61 ||
      z === 62 ||
      z === 96 ||
      $e(z)
      ? E(z)
      : (t.consume(z), j);
  }
  function F(z) {
    return z === 47 || z === 62 || Be(z) ? T(z) : n(z);
  }
  function O(z) {
    return z === 62 ? (t.consume(z), $) : n(z);
  }
  function $(z) {
    return z === null || ve(z) ? G(z) : Be(z) ? (t.consume(z), $) : n(z);
  }
  function G(z) {
    return z === 45 && i === 2
      ? (t.consume(z), he)
      : z === 60 && i === 1
        ? (t.consume(z), ee)
        : z === 62 && i === 4
          ? (t.consume(z), ne)
          : z === 63 && i === 3
            ? (t.consume(z), M)
            : z === 93 && i === 5
              ? (t.consume(z), fe)
              : ve(z) && (i === 6 || i === 7)
                ? (t.exit("htmlFlowData"), t.check(a4, xe, K)(z))
                : z === null || ve(z)
                  ? (t.exit("htmlFlowData"), K(z))
                  : (t.consume(z), G);
  }
  function K(z) {
    return t.check(s4, le, xe)(z);
  }
  function le(z) {
    return (t.enter("lineEnding"), t.consume(z), t.exit("lineEnding"), R);
  }
  function R(z) {
    return z === null || ve(z) ? K(z) : (t.enter("htmlFlowData"), G(z));
  }
  function he(z) {
    return z === 45 ? (t.consume(z), M) : G(z);
  }
  function ee(z) {
    return z === 47 ? (t.consume(z), (s = ""), Z) : G(z);
  }
  function Z(z) {
    if (z === 62) {
      const De = s.toLowerCase();
      return Wl.includes(De) ? (t.consume(z), ne) : G(z);
    }
    return Nt(z) && s.length < 8
      ? (t.consume(z), (s += String.fromCharCode(z)), Z)
      : G(z);
  }
  function fe(z) {
    return z === 93 ? (t.consume(z), M) : G(z);
  }
  function M(z) {
    return z === 62
      ? (t.consume(z), ne)
      : z === 45 && i === 2
        ? (t.consume(z), M)
        : G(z);
  }
  function ne(z) {
    return z === null || ve(z)
      ? (t.exit("htmlFlowData"), xe(z))
      : (t.consume(z), ne);
  }
  function xe(z) {
    return (t.exit("htmlFlow"), e(z));
  }
}
function u4(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return ve(s)
      ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), a)
      : n(s);
  }
  function a(s) {
    return r.parser.lazy[r.now().line] ? n(s) : e(s);
  }
}
function c4(t, e, n) {
  return r;
  function r(i) {
    return (
      t.enter("lineEnding"),
      t.consume(i),
      t.exit("lineEnding"),
      t.attempt(La, e, n)
    );
  }
}
const d4 = { name: "htmlText", tokenize: h4 };
function h4(t, e, n) {
  const r = this;
  let i, a, s;
  return o;
  function o(M) {
    return (t.enter("htmlText"), t.enter("htmlTextData"), t.consume(M), l);
  }
  function l(M) {
    return M === 33
      ? (t.consume(M), u)
      : M === 47
        ? (t.consume(M), E)
        : M === 63
          ? (t.consume(M), T)
          : Nt(M)
            ? (t.consume(M), j)
            : n(M);
  }
  function u(M) {
    return M === 45
      ? (t.consume(M), h)
      : M === 91
        ? (t.consume(M), (a = 0), y)
        : Nt(M)
          ? (t.consume(M), b)
          : n(M);
  }
  function h(M) {
    return M === 45 ? (t.consume(M), m) : n(M);
  }
  function d(M) {
    return M === null
      ? n(M)
      : M === 45
        ? (t.consume(M), p)
        : ve(M)
          ? ((s = d), ee(M))
          : (t.consume(M), d);
  }
  function p(M) {
    return M === 45 ? (t.consume(M), m) : d(M);
  }
  function m(M) {
    return M === 62 ? he(M) : M === 45 ? p(M) : d(M);
  }
  function y(M) {
    const ne = "CDATA[";
    return M === ne.charCodeAt(a++)
      ? (t.consume(M), a === ne.length ? S : y)
      : n(M);
  }
  function S(M) {
    return M === null
      ? n(M)
      : M === 93
        ? (t.consume(M), A)
        : ve(M)
          ? ((s = S), ee(M))
          : (t.consume(M), S);
  }
  function A(M) {
    return M === 93 ? (t.consume(M), C) : S(M);
  }
  function C(M) {
    return M === 62 ? he(M) : M === 93 ? (t.consume(M), C) : S(M);
  }
  function b(M) {
    return M === null || M === 62
      ? he(M)
      : ve(M)
        ? ((s = b), ee(M))
        : (t.consume(M), b);
  }
  function T(M) {
    return M === null
      ? n(M)
      : M === 63
        ? (t.consume(M), v)
        : ve(M)
          ? ((s = T), ee(M))
          : (t.consume(M), T);
  }
  function v(M) {
    return M === 62 ? he(M) : T(M);
  }
  function E(M) {
    return Nt(M) ? (t.consume(M), x) : n(M);
  }
  function x(M) {
    return M === 45 || zt(M) ? (t.consume(M), x) : _(M);
  }
  function _(M) {
    return ve(M) ? ((s = _), ee(M)) : Be(M) ? (t.consume(M), _) : he(M);
  }
  function j(M) {
    return M === 45 || zt(M)
      ? (t.consume(M), j)
      : M === 47 || M === 62 || $e(M)
        ? F(M)
        : n(M);
  }
  function F(M) {
    return M === 47
      ? (t.consume(M), he)
      : M === 58 || M === 95 || Nt(M)
        ? (t.consume(M), O)
        : ve(M)
          ? ((s = F), ee(M))
          : Be(M)
            ? (t.consume(M), F)
            : he(M);
  }
  function O(M) {
    return M === 45 || M === 46 || M === 58 || M === 95 || zt(M)
      ? (t.consume(M), O)
      : $(M);
  }
  function $(M) {
    return M === 61
      ? (t.consume(M), G)
      : ve(M)
        ? ((s = $), ee(M))
        : Be(M)
          ? (t.consume(M), $)
          : F(M);
  }
  function G(M) {
    return M === null || M === 60 || M === 61 || M === 62 || M === 96
      ? n(M)
      : M === 34 || M === 39
        ? (t.consume(M), (i = M), K)
        : ve(M)
          ? ((s = G), ee(M))
          : Be(M)
            ? (t.consume(M), G)
            : (t.consume(M), le);
  }
  function K(M) {
    return M === i
      ? (t.consume(M), (i = void 0), R)
      : M === null
        ? n(M)
        : ve(M)
          ? ((s = K), ee(M))
          : (t.consume(M), K);
  }
  function le(M) {
    return M === null ||
      M === 34 ||
      M === 39 ||
      M === 60 ||
      M === 61 ||
      M === 96
      ? n(M)
      : M === 47 || M === 62 || $e(M)
        ? F(M)
        : (t.consume(M), le);
  }
  function R(M) {
    return M === 47 || M === 62 || $e(M) ? F(M) : n(M);
  }
  function he(M) {
    return M === 62
      ? (t.consume(M), t.exit("htmlTextData"), t.exit("htmlText"), e)
      : n(M);
  }
  function ee(M) {
    return (
      t.exit("htmlTextData"),
      t.enter("lineEnding"),
      t.consume(M),
      t.exit("lineEnding"),
      Z
    );
  }
  function Z(M) {
    return Be(M)
      ? Ne(
          t,
          fe,
          "linePrefix",
          r.parser.constructs.disable.null.includes("codeIndented")
            ? void 0
            : 4,
        )(M)
      : fe(M);
  }
  function fe(M) {
    return (t.enter("htmlTextData"), s(M));
  }
}
const S0 = { name: "labelEnd", resolveAll: g4, resolveTo: v4, tokenize: b4 },
  f4 = { tokenize: y4 },
  m4 = { tokenize: w4 },
  p4 = { tokenize: x4 };
function g4(t) {
  let e = -1;
  const n = [];
  for (; ++e < t.length; ) {
    const r = t[e][1];
    if (
      (n.push(t[e]),
      r.type === "labelImage" ||
        r.type === "labelLink" ||
        r.type === "labelEnd")
    ) {
      const i = r.type === "labelImage" ? 4 : 2;
      ((r.type = "data"), (e += i));
    }
  }
  return (t.length !== n.length && Vt(t, 0, t.length, n), t);
}
function v4(t, e) {
  let n = t.length,
    r = 0,
    i,
    a,
    s,
    o;
  for (; n--; )
    if (((i = t[n][1]), a)) {
      if (i.type === "link" || (i.type === "labelLink" && i._inactive)) break;
      t[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (s) {
      if (
        t[n][0] === "enter" &&
        (i.type === "labelImage" || i.type === "labelLink") &&
        !i._balanced &&
        ((a = n), i.type !== "labelLink")
      ) {
        r = 2;
        break;
      }
    } else i.type === "labelEnd" && (s = n);
  const l = {
      type: t[a][1].type === "labelLink" ? "link" : "image",
      start: { ...t[a][1].start },
      end: { ...t[t.length - 1][1].end },
    },
    u = { type: "label", start: { ...t[a][1].start }, end: { ...t[s][1].end } },
    h = {
      type: "labelText",
      start: { ...t[a + r + 2][1].end },
      end: { ...t[s - 2][1].start },
    };
  return (
    (o = [
      ["enter", l, e],
      ["enter", u, e],
    ]),
    (o = Ut(o, t.slice(a + 1, a + r + 3))),
    (o = Ut(o, [["enter", h, e]])),
    (o = Ut(
      o,
      Ca(e.parser.constructs.insideSpan.null, t.slice(a + r + 4, s - 3), e),
    )),
    (o = Ut(o, [["exit", h, e], t[s - 2], t[s - 1], ["exit", u, e]])),
    (o = Ut(o, t.slice(s + 1))),
    (o = Ut(o, [["exit", l, e]])),
    Vt(t, a, t.length, o),
    t
  );
}
function b4(t, e, n) {
  const r = this;
  let i = r.events.length,
    a,
    s;
  for (; i--; )
    if (
      (r.events[i][1].type === "labelImage" ||
        r.events[i][1].type === "labelLink") &&
      !r.events[i][1]._balanced
    ) {
      a = r.events[i][1];
      break;
    }
  return o;
  function o(p) {
    return a
      ? a._inactive
        ? d(p)
        : ((s = r.parser.defined.includes(
            ir(r.sliceSerialize({ start: a.end, end: r.now() })),
          )),
          t.enter("labelEnd"),
          t.enter("labelMarker"),
          t.consume(p),
          t.exit("labelMarker"),
          t.exit("labelEnd"),
          l)
      : n(p);
  }
  function l(p) {
    return p === 40
      ? t.attempt(f4, h, s ? h : d)(p)
      : p === 91
        ? t.attempt(m4, h, s ? u : d)(p)
        : s
          ? h(p)
          : d(p);
  }
  function u(p) {
    return t.attempt(p4, h, d)(p);
  }
  function h(p) {
    return e(p);
  }
  function d(p) {
    return ((a._balanced = !0), n(p));
  }
}
function y4(t, e, n) {
  return r;
  function r(d) {
    return (
      t.enter("resource"),
      t.enter("resourceMarker"),
      t.consume(d),
      t.exit("resourceMarker"),
      i
    );
  }
  function i(d) {
    return $e(d) ? br(t, a)(d) : a(d);
  }
  function a(d) {
    return d === 41
      ? h(d)
      : dd(
          t,
          s,
          o,
          "resourceDestination",
          "resourceDestinationLiteral",
          "resourceDestinationLiteralMarker",
          "resourceDestinationRaw",
          "resourceDestinationString",
          32,
        )(d);
  }
  function s(d) {
    return $e(d) ? br(t, l)(d) : h(d);
  }
  function o(d) {
    return n(d);
  }
  function l(d) {
    return d === 34 || d === 39 || d === 40
      ? fd(
          t,
          u,
          n,
          "resourceTitle",
          "resourceTitleMarker",
          "resourceTitleString",
        )(d)
      : h(d);
  }
  function u(d) {
    return $e(d) ? br(t, h)(d) : h(d);
  }
  function h(d) {
    return d === 41
      ? (t.enter("resourceMarker"),
        t.consume(d),
        t.exit("resourceMarker"),
        t.exit("resource"),
        e)
      : n(d);
  }
}
function w4(t, e, n) {
  const r = this;
  return i;
  function i(o) {
    return hd.call(
      r,
      t,
      a,
      s,
      "reference",
      "referenceMarker",
      "referenceString",
    )(o);
  }
  function a(o) {
    return r.parser.defined.includes(
      ir(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)),
    )
      ? e(o)
      : n(o);
  }
  function s(o) {
    return n(o);
  }
}
function x4(t, e, n) {
  return r;
  function r(a) {
    return (
      t.enter("reference"),
      t.enter("referenceMarker"),
      t.consume(a),
      t.exit("referenceMarker"),
      i
    );
  }
  function i(a) {
    return a === 93
      ? (t.enter("referenceMarker"),
        t.consume(a),
        t.exit("referenceMarker"),
        t.exit("reference"),
        e)
      : n(a);
  }
}
const k4 = { name: "labelStartImage", resolveAll: S0.resolveAll, tokenize: S4 };
function S4(t, e, n) {
  const r = this;
  return i;
  function i(o) {
    return (
      t.enter("labelImage"),
      t.enter("labelImageMarker"),
      t.consume(o),
      t.exit("labelImageMarker"),
      a
    );
  }
  function a(o) {
    return o === 91
      ? (t.enter("labelMarker"),
        t.consume(o),
        t.exit("labelMarker"),
        t.exit("labelImage"),
        s)
      : n(o);
  }
  function s(o) {
    return o === 94 && "_hiddenFootnoteSupport" in r.parser.constructs
      ? n(o)
      : e(o);
  }
}
const A4 = { name: "labelStartLink", resolveAll: S0.resolveAll, tokenize: T4 };
function T4(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return (
      t.enter("labelLink"),
      t.enter("labelMarker"),
      t.consume(s),
      t.exit("labelMarker"),
      t.exit("labelLink"),
      a
    );
  }
  function a(s) {
    return s === 94 && "_hiddenFootnoteSupport" in r.parser.constructs
      ? n(s)
      : e(s);
  }
}
const So = { name: "lineEnding", tokenize: E4 };
function E4(t, e) {
  return n;
  function n(r) {
    return (
      t.enter("lineEnding"),
      t.consume(r),
      t.exit("lineEnding"),
      Ne(t, e, "linePrefix")
    );
  }
}
const vs = { name: "thematicBreak", tokenize: C4 };
function C4(t, e, n) {
  let r = 0,
    i;
  return a;
  function a(u) {
    return (t.enter("thematicBreak"), s(u));
  }
  function s(u) {
    return ((i = u), o(u));
  }
  function o(u) {
    return u === i
      ? (t.enter("thematicBreakSequence"), l(u))
      : r >= 3 && (u === null || ve(u))
        ? (t.exit("thematicBreak"), e(u))
        : n(u);
  }
  function l(u) {
    return u === i
      ? (t.consume(u), r++, l)
      : (t.exit("thematicBreakSequence"),
        Be(u) ? Ne(t, o, "whitespace")(u) : o(u));
  }
}
const an = {
    continuation: { tokenize: D4 },
    exit: N4,
    name: "list",
    tokenize: z4,
  },
  L4 = { partial: !0, tokenize: F4 },
  M4 = { partial: !0, tokenize: I4 };
function z4(t, e, n) {
  const r = this,
    i = r.events[r.events.length - 1];
  let a =
      i && i[1].type === "linePrefix"
        ? i[2].sliceSerialize(i[1], !0).length
        : 0,
    s = 0;
  return o;
  function o(m) {
    const y =
      r.containerState.type ||
      (m === 42 || m === 43 || m === 45 ? "listUnordered" : "listOrdered");
    if (
      y === "listUnordered"
        ? !r.containerState.marker || m === r.containerState.marker
        : t0(m)
    ) {
      if (
        (r.containerState.type ||
          ((r.containerState.type = y), t.enter(y, { _container: !0 })),
        y === "listUnordered")
      )
        return (
          t.enter("listItemPrefix"),
          m === 42 || m === 45 ? t.check(vs, n, u)(m) : u(m)
        );
      if (!r.interrupt || m === 49)
        return (t.enter("listItemPrefix"), t.enter("listItemValue"), l(m));
    }
    return n(m);
  }
  function l(m) {
    return t0(m) && ++s < 10
      ? (t.consume(m), l)
      : (!r.interrupt || s < 2) &&
          (r.containerState.marker
            ? m === r.containerState.marker
            : m === 41 || m === 46)
        ? (t.exit("listItemValue"), u(m))
        : n(m);
  }
  function u(m) {
    return (
      t.enter("listItemMarker"),
      t.consume(m),
      t.exit("listItemMarker"),
      (r.containerState.marker = r.containerState.marker || m),
      t.check(La, r.interrupt ? n : h, t.attempt(L4, p, d))
    );
  }
  function h(m) {
    return ((r.containerState.initialBlankLine = !0), a++, p(m));
  }
  function d(m) {
    return Be(m)
      ? (t.enter("listItemPrefixWhitespace"),
        t.consume(m),
        t.exit("listItemPrefixWhitespace"),
        p)
      : n(m);
  }
  function p(m) {
    return (
      (r.containerState.size =
        a + r.sliceSerialize(t.exit("listItemPrefix"), !0).length),
      e(m)
    );
  }
}
function D4(t, e, n) {
  const r = this;
  return ((r.containerState._closeFlow = void 0), t.check(La, i, a));
  function i(o) {
    return (
      (r.containerState.furtherBlankLines =
        r.containerState.furtherBlankLines ||
        r.containerState.initialBlankLine),
      Ne(t, e, "listItemIndent", r.containerState.size + 1)(o)
    );
  }
  function a(o) {
    return r.containerState.furtherBlankLines || !Be(o)
      ? ((r.containerState.furtherBlankLines = void 0),
        (r.containerState.initialBlankLine = void 0),
        s(o))
      : ((r.containerState.furtherBlankLines = void 0),
        (r.containerState.initialBlankLine = void 0),
        t.attempt(M4, e, s)(o));
  }
  function s(o) {
    return (
      (r.containerState._closeFlow = !0),
      (r.interrupt = void 0),
      Ne(
        t,
        t.attempt(an, e, n),
        "linePrefix",
        r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
      )(o)
    );
  }
}
function I4(t, e, n) {
  const r = this;
  return Ne(t, i, "listItemIndent", r.containerState.size + 1);
  function i(a) {
    const s = r.events[r.events.length - 1];
    return s &&
      s[1].type === "listItemIndent" &&
      s[2].sliceSerialize(s[1], !0).length === r.containerState.size
      ? e(a)
      : n(a);
  }
}
function N4(t) {
  t.exit(this.containerState.type);
}
function F4(t, e, n) {
  const r = this;
  return Ne(
    t,
    i,
    "listItemPrefixWhitespace",
    r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5,
  );
  function i(a) {
    const s = r.events[r.events.length - 1];
    return !Be(a) && s && s[1].type === "listItemPrefixWhitespace"
      ? e(a)
      : n(a);
  }
}
const Gl = { name: "setextUnderline", resolveTo: _4, tokenize: O4 };
function _4(t, e) {
  let n = t.length,
    r,
    i,
    a;
  for (; n--; )
    if (t[n][0] === "enter") {
      if (t[n][1].type === "content") {
        r = n;
        break;
      }
      t[n][1].type === "paragraph" && (i = n);
    } else
      (t[n][1].type === "content" && t.splice(n, 1),
        !a && t[n][1].type === "definition" && (a = n));
  const s = {
    type: "setextHeading",
    start: { ...t[r][1].start },
    end: { ...t[t.length - 1][1].end },
  };
  return (
    (t[i][1].type = "setextHeadingText"),
    a
      ? (t.splice(i, 0, ["enter", s, e]),
        t.splice(a + 1, 0, ["exit", t[r][1], e]),
        (t[r][1].end = { ...t[a][1].end }))
      : (t[r][1] = s),
    t.push(["exit", s, e]),
    t
  );
}
function O4(t, e, n) {
  const r = this;
  let i;
  return a;
  function a(u) {
    let h = r.events.length,
      d;
    for (; h--; )
      if (
        r.events[h][1].type !== "lineEnding" &&
        r.events[h][1].type !== "linePrefix" &&
        r.events[h][1].type !== "content"
      ) {
        d = r.events[h][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || d)
      ? (t.enter("setextHeadingLine"), (i = u), s(u))
      : n(u);
  }
  function s(u) {
    return (t.enter("setextHeadingLineSequence"), o(u));
  }
  function o(u) {
    return u === i
      ? (t.consume(u), o)
      : (t.exit("setextHeadingLineSequence"),
        Be(u) ? Ne(t, l, "lineSuffix")(u) : l(u));
  }
  function l(u) {
    return u === null || ve(u) ? (t.exit("setextHeadingLine"), e(u)) : n(u);
  }
}
const B4 = { tokenize: R4 };
function R4(t) {
  const e = this,
    n = t.attempt(
      La,
      r,
      t.attempt(
        this.parser.constructs.flowInitial,
        i,
        Ne(
          t,
          t.attempt(this.parser.constructs.flow, i, t.attempt($p, i)),
          "linePrefix",
        ),
      ),
    );
  return n;
  function r(a) {
    if (a === null) {
      t.consume(a);
      return;
    }
    return (
      t.enter("lineEndingBlank"),
      t.consume(a),
      t.exit("lineEndingBlank"),
      (e.currentConstruct = void 0),
      n
    );
  }
  function i(a) {
    if (a === null) {
      t.consume(a);
      return;
    }
    return (
      t.enter("lineEnding"),
      t.consume(a),
      t.exit("lineEnding"),
      (e.currentConstruct = void 0),
      n
    );
  }
}
const P4 = { resolveAll: pd() },
  H4 = md("string"),
  q4 = md("text");
function md(t) {
  return { resolveAll: pd(t === "text" ? U4 : void 0), tokenize: e };
  function e(n) {
    const r = this,
      i = this.parser.constructs[t],
      a = n.attempt(i, s, o);
    return s;
    function s(h) {
      return u(h) ? a(h) : o(h);
    }
    function o(h) {
      if (h === null) {
        n.consume(h);
        return;
      }
      return (n.enter("data"), n.consume(h), l);
    }
    function l(h) {
      return u(h) ? (n.exit("data"), a(h)) : (n.consume(h), l);
    }
    function u(h) {
      if (h === null) return !0;
      const d = i[h];
      let p = -1;
      if (d)
        for (; ++p < d.length; ) {
          const m = d[p];
          if (!m.previous || m.previous.call(r, r.previous)) return !0;
        }
      return !1;
    }
  }
}
function pd(t) {
  return e;
  function e(n, r) {
    let i = -1,
      a;
    for (; ++i <= n.length; )
      a === void 0
        ? n[i] && n[i][1].type === "data" && ((a = i), i++)
        : (!n[i] || n[i][1].type !== "data") &&
          (i !== a + 2 &&
            ((n[a][1].end = n[i - 1][1].end),
            n.splice(a + 2, i - a - 2),
            (i = a + 2)),
          (a = void 0));
    return t ? t(n, r) : n;
  }
}
function U4(t, e) {
  let n = 0;
  for (; ++n <= t.length; )
    if (
      (n === t.length || t[n][1].type === "lineEnding") &&
      t[n - 1][1].type === "data"
    ) {
      const r = t[n - 1][1],
        i = e.sliceStream(r);
      let a = i.length,
        s = -1,
        o = 0,
        l;
      for (; a--; ) {
        const u = i[a];
        if (typeof u == "string") {
          for (s = u.length; u.charCodeAt(s - 1) === 32; ) (o++, s--);
          if (s) break;
          s = -1;
        } else if (u === -2) ((l = !0), o++);
        else if (u !== -1) {
          a++;
          break;
        }
      }
      if ((e._contentTypeTextTrailing && n === t.length && (o = 0), o)) {
        const u = {
          type:
            n === t.length || l || o < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: a ? s : r.start._bufferIndex + s,
            _index: r.start._index + a,
            line: r.end.line,
            column: r.end.column - o,
            offset: r.end.offset - o,
          },
          end: { ...r.end },
        };
        ((r.end = { ...u.start }),
          r.start.offset === r.end.offset
            ? Object.assign(r, u)
            : (t.splice(n, 0, ["enter", u, e], ["exit", u, e]), (n += 2)));
      }
      n++;
    }
  return t;
}
const $4 = {
    42: an,
    43: an,
    45: an,
    48: an,
    49: an,
    50: an,
    51: an,
    52: an,
    53: an,
    54: an,
    55: an,
    56: an,
    57: an,
    62: od,
  },
  V4 = { 91: Yp },
  j4 = { [-2]: ko, [-1]: ko, 32: ko },
  W4 = {
    35: e4,
    42: vs,
    45: [Gl, vs],
    60: i4,
    61: Gl,
    95: vs,
    96: jl,
    126: jl,
  },
  G4 = { 38: ud, 92: ld },
  Y4 = {
    [-5]: So,
    [-4]: So,
    [-3]: So,
    33: k4,
    38: ud,
    42: n0,
    60: [Ap, d4],
    91: A4,
    92: [Zp, ld],
    93: S0,
    95: n0,
    96: Bp,
  },
  X4 = { null: [n0, P4] },
  K4 = { null: [42, 95] },
  Q4 = { null: [] },
  Z4 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        attentionMarkers: K4,
        contentInitial: V4,
        disable: Q4,
        document: $4,
        flow: W4,
        flowInitial: j4,
        insideSpan: X4,
        string: G4,
        text: Y4,
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
function J4(t, e, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: (n && n.line) || 1,
    column: (n && n.column) || 1,
    offset: (n && n.offset) || 0,
  };
  const i = {},
    a = [];
  let s = [],
    o = [];
  const l = {
      attempt: _(E),
      check: _(x),
      consume: b,
      enter: T,
      exit: v,
      interrupt: _(x, { interrupt: !0 }),
    },
    u = {
      code: null,
      containerState: {},
      defineSkip: S,
      events: [],
      now: y,
      parser: t,
      previous: null,
      sliceSerialize: p,
      sliceStream: m,
      write: d,
    };
  let h = e.tokenize.call(u, l);
  return (e.resolveAll && a.push(e), u);
  function d($) {
    return (
      (s = Ut(s, $)),
      A(),
      s[s.length - 1] !== null
        ? []
        : (j(e, 0), (u.events = Ca(a, u.events, u)), u.events)
    );
  }
  function p($, G) {
    return tg(m($), G);
  }
  function m($) {
    return eg(s, $);
  }
  function y() {
    const { _bufferIndex: $, _index: G, line: K, column: le, offset: R } = r;
    return { _bufferIndex: $, _index: G, line: K, column: le, offset: R };
  }
  function S($) {
    ((i[$.line] = $.column), O());
  }
  function A() {
    let $;
    for (; r._index < s.length; ) {
      const G = s[r._index];
      if (typeof G == "string")
        for (
          $ = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0);
          r._index === $ && r._bufferIndex < G.length;

        )
          C(G.charCodeAt(r._bufferIndex));
      else C(G);
    }
  }
  function C($) {
    h = h($);
  }
  function b($) {
    (ve($)
      ? (r.line++, (r.column = 1), (r.offset += $ === -3 ? 2 : 1), O())
      : $ !== -1 && (r.column++, r.offset++),
      r._bufferIndex < 0
        ? r._index++
        : (r._bufferIndex++,
          r._bufferIndex === s[r._index].length &&
            ((r._bufferIndex = -1), r._index++)),
      (u.previous = $));
  }
  function T($, G) {
    const K = G || {};
    return (
      (K.type = $),
      (K.start = y()),
      u.events.push(["enter", K, u]),
      o.push(K),
      K
    );
  }
  function v($) {
    const G = o.pop();
    return ((G.end = y()), u.events.push(["exit", G, u]), G);
  }
  function E($, G) {
    j($, G.from);
  }
  function x($, G) {
    G.restore();
  }
  function _($, G) {
    return K;
    function K(le, R, he) {
      let ee, Z, fe, M;
      return Array.isArray(le) ? xe(le) : "tokenize" in le ? xe([le]) : ne(le);
      function ne(Ce) {
        return Ue;
        function Ue(Fe) {
          const We = Fe !== null && Ce[Fe],
            je = Fe !== null && Ce.null,
            lt = [
              ...(Array.isArray(We) ? We : We ? [We] : []),
              ...(Array.isArray(je) ? je : je ? [je] : []),
            ];
          return xe(lt)(Fe);
        }
      }
      function xe(Ce) {
        return ((ee = Ce), (Z = 0), Ce.length === 0 ? he : z(Ce[Z]));
      }
      function z(Ce) {
        return Ue;
        function Ue(Fe) {
          return (
            (M = F()),
            (fe = Ce),
            Ce.partial || (u.currentConstruct = Ce),
            Ce.name && u.parser.constructs.disable.null.includes(Ce.name)
              ? ke()
              : Ce.tokenize.call(
                  G ? Object.assign(Object.create(u), G) : u,
                  l,
                  De,
                  ke,
                )(Fe)
          );
        }
      }
      function De(Ce) {
        return ($(fe, M), R);
      }
      function ke(Ce) {
        return (M.restore(), ++Z < ee.length ? z(ee[Z]) : he);
      }
    }
  }
  function j($, G) {
    ($.resolveAll && !a.includes($) && a.push($),
      $.resolve &&
        Vt(u.events, G, u.events.length - G, $.resolve(u.events.slice(G), u)),
      $.resolveTo && (u.events = $.resolveTo(u.events, u)));
  }
  function F() {
    const $ = y(),
      G = u.previous,
      K = u.currentConstruct,
      le = u.events.length,
      R = Array.from(o);
    return { from: le, restore: he };
    function he() {
      ((r = $),
        (u.previous = G),
        (u.currentConstruct = K),
        (u.events.length = le),
        (o = R),
        O());
    }
  }
  function O() {
    r.line in i &&
      r.column < 2 &&
      ((r.column = i[r.line]), (r.offset += i[r.line] - 1));
  }
}
function eg(t, e) {
  const n = e.start._index,
    r = e.start._bufferIndex,
    i = e.end._index,
    a = e.end._bufferIndex;
  let s;
  if (n === i) s = [t[n].slice(r, a)];
  else {
    if (((s = t.slice(n, i)), r > -1)) {
      const o = s[0];
      typeof o == "string" ? (s[0] = o.slice(r)) : s.shift();
    }
    a > 0 && s.push(t[i].slice(0, a));
  }
  return s;
}
function tg(t, e) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < t.length; ) {
    const a = t[n];
    let s;
    if (typeof a == "string") s = a;
    else
      switch (a) {
        case -5: {
          s = "\r";
          break;
        }
        case -4: {
          s = `
`;
          break;
        }
        case -3: {
          s = `\r
`;
          break;
        }
        case -2: {
          s = e ? " " : "	";
          break;
        }
        case -1: {
          if (!e && i) continue;
          s = " ";
          break;
        }
        default:
          s = String.fromCharCode(a);
      }
    ((i = a === -2), r.push(s));
  }
  return r.join("");
}
function ng(t) {
  const r = {
    constructs: id([Z4, ...((t || {}).extensions || [])]),
    content: i(vp),
    defined: [],
    document: i(yp),
    flow: i(B4),
    lazy: {},
    string: i(H4),
    text: i(q4),
  };
  return r;
  function i(a) {
    return s;
    function s(o) {
      return J4(r, a, o);
    }
  }
}
function rg(t) {
  for (; !cd(t); );
  return t;
}
const Yl = /[\0\t\n\r]/g;
function ig() {
  let t = 1,
    e = "",
    n = !0,
    r;
  return i;
  function i(a, s, o) {
    const l = [];
    let u, h, d, p, m;
    for (
      a =
        e +
        (typeof a == "string"
          ? a.toString()
          : new TextDecoder(s || void 0).decode(a)),
        d = 0,
        e = "",
        n && (a.charCodeAt(0) === 65279 && d++, (n = void 0));
      d < a.length;

    ) {
      if (
        ((Yl.lastIndex = d),
        (u = Yl.exec(a)),
        (p = u && u.index !== void 0 ? u.index : a.length),
        (m = a.charCodeAt(p)),
        !u)
      ) {
        e = a.slice(d);
        break;
      }
      if (m === 10 && d === p && r) (l.push(-3), (r = void 0));
      else
        switch (
          (r && (l.push(-5), (r = void 0)),
          d < p && (l.push(a.slice(d, p)), (t += p - d)),
          m)
        ) {
          case 0: {
            (l.push(65533), t++);
            break;
          }
          case 9: {
            for (h = Math.ceil(t / 4) * 4, l.push(-2); t++ < h; ) l.push(-1);
            break;
          }
          case 10: {
            (l.push(-4), (t = 1));
            break;
          }
          default:
            ((r = !0), (t = 1));
        }
      d = p + 1;
    }
    return (o && (r && l.push(-5), e && l.push(e), l.push(null)), l);
  }
}
function Xl(t, e, n) {
  return (
    typeof e != "string" && ((n = e), (e = void 0)),
    gp(n)(
      rg(
        ng(n)
          .document()
          .write(ig()(t, e, !0)),
      ),
    )
  );
}
const ag = { tokenize: sg, concrete: !0, name: "mathFlow" },
  Kl = { tokenize: og, partial: !0 };
function sg(t, e, n) {
  const r = this,
    i = r.events[r.events.length - 1],
    a =
      i && i[1].type === "linePrefix"
        ? i[2].sliceSerialize(i[1], !0).length
        : 0;
  let s = 0;
  return o;
  function o(b) {
    return (
      t.enter("mathFlow"),
      t.enter("mathFlowFence"),
      t.enter("mathFlowFenceSequence"),
      l(b)
    );
  }
  function l(b) {
    return b === 36
      ? (t.consume(b), s++, l)
      : s < 2
        ? n(b)
        : (t.exit("mathFlowFenceSequence"), Ne(t, u, "whitespace")(b));
  }
  function u(b) {
    return b === null || ve(b)
      ? d(b)
      : (t.enter("mathFlowFenceMeta"),
        t.enter("chunkString", { contentType: "string" }),
        h(b));
  }
  function h(b) {
    return b === null || ve(b)
      ? (t.exit("chunkString"), t.exit("mathFlowFenceMeta"), d(b))
      : b === 36
        ? n(b)
        : (t.consume(b), h);
  }
  function d(b) {
    return (
      t.exit("mathFlowFence"),
      r.interrupt ? e(b) : t.attempt(Kl, p, A)(b)
    );
  }
  function p(b) {
    return t.attempt({ tokenize: C, partial: !0 }, A, m)(b);
  }
  function m(b) {
    return (a ? Ne(t, y, "linePrefix", a + 1) : y)(b);
  }
  function y(b) {
    return b === null
      ? A(b)
      : ve(b)
        ? t.attempt(Kl, p, A)(b)
        : (t.enter("mathFlowValue"), S(b));
  }
  function S(b) {
    return b === null || ve(b)
      ? (t.exit("mathFlowValue"), y(b))
      : (t.consume(b), S);
  }
  function A(b) {
    return (t.exit("mathFlow"), e(b));
  }
  function C(b, T, v) {
    let E = 0;
    return Ne(
      b,
      x,
      "linePrefix",
      r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
    );
    function x(F) {
      return (b.enter("mathFlowFence"), b.enter("mathFlowFenceSequence"), _(F));
    }
    function _(F) {
      return F === 36
        ? (E++, b.consume(F), _)
        : E < s
          ? v(F)
          : (b.exit("mathFlowFenceSequence"), Ne(b, j, "whitespace")(F));
    }
    function j(F) {
      return F === null || ve(F) ? (b.exit("mathFlowFence"), T(F)) : v(F);
    }
  }
}
function og(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return s === null
      ? e(s)
      : (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), a);
  }
  function a(s) {
    return r.parser.lazy[r.now().line] ? n(s) : e(s);
  }
}
function lg(t) {
  let n = {}.singleDollarTextMath;
  return (
    n == null && (n = !0),
    { tokenize: r, resolve: ug, previous: cg, name: "mathText" }
  );
  function r(i, a, s) {
    let o = 0,
      l,
      u;
    return h;
    function h(S) {
      return (i.enter("mathText"), i.enter("mathTextSequence"), d(S));
    }
    function d(S) {
      return S === 36
        ? (i.consume(S), o++, d)
        : o < 2 && !n
          ? s(S)
          : (i.exit("mathTextSequence"), p(S));
    }
    function p(S) {
      return S === null
        ? s(S)
        : S === 36
          ? ((u = i.enter("mathTextSequence")), (l = 0), y(S))
          : S === 32
            ? (i.enter("space"), i.consume(S), i.exit("space"), p)
            : ve(S)
              ? (i.enter("lineEnding"), i.consume(S), i.exit("lineEnding"), p)
              : (i.enter("mathTextData"), m(S));
    }
    function m(S) {
      return S === null || S === 32 || S === 36 || ve(S)
        ? (i.exit("mathTextData"), p(S))
        : (i.consume(S), m);
    }
    function y(S) {
      return S === 36
        ? (i.consume(S), l++, y)
        : l === o
          ? (i.exit("mathTextSequence"), i.exit("mathText"), a(S))
          : ((u.type = "mathTextData"), m(S));
    }
  }
}
function ug(t) {
  let e = t.length - 4,
    n = 3,
    r,
    i;
  if (
    (t[n][1].type === "lineEnding" || t[n][1].type === "space") &&
    (t[e][1].type === "lineEnding" || t[e][1].type === "space")
  ) {
    for (r = n; ++r < e; )
      if (t[r][1].type === "mathTextData") {
        ((t[e][1].type = "mathTextPadding"),
          (t[n][1].type = "mathTextPadding"),
          (n += 2),
          (e -= 2));
        break;
      }
  }
  for (r = n - 1, e++; ++r <= e; )
    i === void 0
      ? r !== e && t[r][1].type !== "lineEnding" && (i = r)
      : (r === e || t[r][1].type === "lineEnding") &&
        ((t[i][1].type = "mathTextData"),
        r !== i + 2 &&
          ((t[i][1].end = t[r - 1][1].end),
          t.splice(i + 2, r - i - 2),
          (e -= r - i - 2),
          (r = i + 2)),
        (i = void 0));
  return t;
}
function cg(t) {
  return (
    t !== 36 ||
    this.events[this.events.length - 1][1].type === "characterEscape"
  );
}
function dg(t) {
  return { flow: { 36: ag }, text: { 36: lg() } };
}
class mn {
  constructor(e, n, r) {
    ((this.lexer = void 0),
      (this.start = void 0),
      (this.end = void 0),
      (this.lexer = e),
      (this.start = n),
      (this.end = r));
  }
  static range(e, n) {
    return n
      ? !e || !e.loc || !n.loc || e.loc.lexer !== n.loc.lexer
        ? null
        : new mn(e.loc.lexer, e.loc.start, n.loc.end)
      : e && e.loc;
  }
}
class Fn {
  constructor(e, n) {
    ((this.text = void 0),
      (this.loc = void 0),
      (this.noexpand = void 0),
      (this.treatAsRelax = void 0),
      (this.text = e),
      (this.loc = n));
  }
  range(e, n) {
    return new Fn(n, mn.range(this, e));
  }
}
class ae {
  constructor(e, n) {
    ((this.name = void 0),
      (this.position = void 0),
      (this.length = void 0),
      (this.rawMessage = void 0));
    var r = "KaTeX parse error: " + e,
      i,
      a,
      s = n && n.loc;
    if (s && s.start <= s.end) {
      var o = s.lexer.input;
      ((i = s.start),
        (a = s.end),
        i === o.length
          ? (r += " at end of input: ")
          : (r += " at position " + (i + 1) + ": "));
      var l = o.slice(i, a).replace(/[^]/g, "$&̲"),
        u;
      i > 15 ? (u = "…" + o.slice(i - 15, i)) : (u = o.slice(0, i));
      var h;
      (a + 15 < o.length ? (h = o.slice(a, a + 15) + "…") : (h = o.slice(a)),
        (r += u + l + h));
    }
    var d = new Error(r);
    return (
      (d.name = "ParseError"),
      (d.__proto__ = ae.prototype),
      (d.position = i),
      i != null && a != null && (d.length = a - i),
      (d.rawMessage = e),
      d
    );
  }
}
ae.prototype.__proto__ = Error.prototype;
var hg = function (e, n) {
    return e.indexOf(n) !== -1;
  },
  fg = function (e, n) {
    return e === void 0 ? n : e;
  },
  mg = /([A-Z])/g,
  pg = function (e) {
    return e.replace(mg, "-$1").toLowerCase();
  },
  gg = { "&": "&amp;", ">": "&gt;", "<": "&lt;", '"': "&quot;", "'": "&#x27;" },
  vg = /[&><"']/g;
function bg(t) {
  return String(t).replace(vg, (e) => gg[e]);
}
var gd = function t(e) {
    return e.type === "ordgroup" || e.type === "color"
      ? e.body.length === 1
        ? t(e.body[0])
        : e
      : e.type === "font"
        ? t(e.body)
        : e;
  },
  yg = function (e) {
    var n = gd(e);
    return n.type === "mathord" || n.type === "textord" || n.type === "atom";
  },
  wg = function (e) {
    if (!e) throw new Error("Expected non-null, but got " + String(e));
    return e;
  },
  xg = function (e) {
    var n = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(e);
    return n
      ? n[2] !== ":" || !/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(n[1])
        ? null
        : n[1].toLowerCase()
      : "_relative";
  },
  Ee = {
    contains: hg,
    deflt: fg,
    escape: bg,
    hyphenate: pg,
    getBaseElem: gd,
    isCharacterBox: yg,
    protocolFromUrl: xg,
  },
  Ao = {
    displayMode: {
      type: "boolean",
      description:
        "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
      cli: "-d, --display-mode",
    },
    output: {
      type: { enum: ["htmlAndMathml", "html", "mathml"] },
      description: "Determines the markup language of the output.",
      cli: "-F, --format <type>",
    },
    leqno: {
      type: "boolean",
      description: "Render display math in leqno style (left-justified tags).",
    },
    fleqn: { type: "boolean", description: "Render display math flush left." },
    throwOnError: {
      type: "boolean",
      default: !0,
      cli: "-t, --no-throw-on-error",
      cliDescription:
        "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error.",
    },
    errorColor: {
      type: "string",
      default: "#cc0000",
      cli: "-c, --error-color <color>",
      cliDescription:
        "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
      cliProcessor: (t) => "#" + t,
    },
    macros: {
      type: "object",
      cli: "-m, --macro <def>",
      cliDescription:
        "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
      cliDefault: [],
      cliProcessor: (t, e) => (e.push(t), e),
    },
    minRuleThickness: {
      type: "number",
      description:
        "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
      processor: (t) => Math.max(0, t),
      cli: "--min-rule-thickness <size>",
      cliProcessor: parseFloat,
    },
    colorIsTextColor: {
      type: "boolean",
      description:
        "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
      cli: "-b, --color-is-text-color",
    },
    strict: {
      type: [{ enum: ["warn", "ignore", "error"] }, "boolean", "function"],
      description:
        "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
      cli: "-S, --strict",
      cliDefault: !1,
    },
    trust: {
      type: ["boolean", "function"],
      description: "Trust the input, enabling all HTML features such as \\url.",
      cli: "-T, --trust",
    },
    maxSize: {
      type: "number",
      default: 1 / 0,
      description:
        "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
      processor: (t) => Math.max(0, t),
      cli: "-s, --max-size <n>",
      cliProcessor: parseInt,
    },
    maxExpand: {
      type: "number",
      default: 1e3,
      description:
        "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
      processor: (t) => Math.max(0, t),
      cli: "-e, --max-expand <n>",
      cliProcessor: (t) => (t === "Infinity" ? 1 / 0 : parseInt(t)),
    },
    globalGroup: { type: "boolean", cli: !1 },
  };
function kg(t) {
  if (t.default) return t.default;
  var e = t.type,
    n = Array.isArray(e) ? e[0] : e;
  if (typeof n != "string") return n.enum[0];
  switch (n) {
    case "boolean":
      return !1;
    case "string":
      return "";
    case "number":
      return 0;
    case "object":
      return {};
  }
}
class Sg {
  constructor(e) {
    ((this.displayMode = void 0),
      (this.output = void 0),
      (this.leqno = void 0),
      (this.fleqn = void 0),
      (this.throwOnError = void 0),
      (this.errorColor = void 0),
      (this.macros = void 0),
      (this.minRuleThickness = void 0),
      (this.colorIsTextColor = void 0),
      (this.strict = void 0),
      (this.trust = void 0),
      (this.maxSize = void 0),
      (this.maxExpand = void 0),
      (this.globalGroup = void 0),
      (e = e || {}));
    for (var n in Ao)
      if (Ao.hasOwnProperty(n)) {
        var r = Ao[n];
        this[n] =
          e[n] !== void 0 ? (r.processor ? r.processor(e[n]) : e[n]) : kg(r);
      }
  }
  reportNonstrict(e, n, r) {
    var i = this.strict;
    if ((typeof i == "function" && (i = i(e, n, r)), !(!i || i === "ignore"))) {
      if (i === !0 || i === "error")
        throw new ae(
          "LaTeX-incompatible input and strict mode is set to 'error': " +
            (n + " [" + e + "]"),
          r,
        );
      i === "warn"
        ? typeof console < "u" &&
          console.warn(
            "LaTeX-incompatible input and strict mode is set to 'warn': " +
              (n + " [" + e + "]"),
          )
        : typeof console < "u" &&
          console.warn(
            "LaTeX-incompatible input and strict mode is set to " +
              ("unrecognized '" + i + "': " + n + " [" + e + "]"),
          );
    }
  }
  useStrictBehavior(e, n, r) {
    var i = this.strict;
    if (typeof i == "function")
      try {
        i = i(e, n, r);
      } catch {
        i = "error";
      }
    return !i || i === "ignore"
      ? !1
      : i === !0 || i === "error"
        ? !0
        : i === "warn"
          ? (typeof console < "u" &&
              console.warn(
                "LaTeX-incompatible input and strict mode is set to 'warn': " +
                  (n + " [" + e + "]"),
              ),
            !1)
          : (typeof console < "u" &&
              console.warn(
                "LaTeX-incompatible input and strict mode is set to " +
                  ("unrecognized '" + i + "': " + n + " [" + e + "]"),
              ),
            !1);
  }
  isTrusted(e) {
    if (e.url && !e.protocol) {
      var n = Ee.protocolFromUrl(e.url);
      if (n == null) return !1;
      e.protocol = n;
    }
    var r = typeof this.trust == "function" ? this.trust(e) : this.trust;
    return !!r;
  }
}
class zr {
  constructor(e, n, r) {
    ((this.id = void 0),
      (this.size = void 0),
      (this.cramped = void 0),
      (this.id = e),
      (this.size = n),
      (this.cramped = r));
  }
  sup() {
    return Zn[Ag[this.id]];
  }
  sub() {
    return Zn[Tg[this.id]];
  }
  fracNum() {
    return Zn[Eg[this.id]];
  }
  fracDen() {
    return Zn[Cg[this.id]];
  }
  cramp() {
    return Zn[Lg[this.id]];
  }
  text() {
    return Zn[Mg[this.id]];
  }
  isTight() {
    return this.size >= 2;
  }
}
var A0 = 0,
  Ns = 1,
  Ei = 2,
  xr = 3,
  ya = 4,
  zn = 5,
  Bi = 6,
  Qt = 7,
  Zn = [
    new zr(A0, 0, !1),
    new zr(Ns, 0, !0),
    new zr(Ei, 1, !1),
    new zr(xr, 1, !0),
    new zr(ya, 2, !1),
    new zr(zn, 2, !0),
    new zr(Bi, 3, !1),
    new zr(Qt, 3, !0),
  ],
  Ag = [ya, zn, ya, zn, Bi, Qt, Bi, Qt],
  Tg = [zn, zn, zn, zn, Qt, Qt, Qt, Qt],
  Eg = [Ei, xr, ya, zn, Bi, Qt, Bi, Qt],
  Cg = [xr, xr, zn, zn, Qt, Qt, Qt, Qt],
  Lg = [Ns, Ns, xr, xr, zn, zn, Qt, Qt],
  Mg = [A0, Ns, Ei, xr, Ei, xr, Ei, xr],
  Me = { DISPLAY: Zn[A0], TEXT: Zn[Ei], SCRIPT: Zn[ya], SCRIPTSCRIPT: Zn[Bi] },
  r0 = [
    {
      name: "latin",
      blocks: [
        [256, 591],
        [768, 879],
      ],
    },
    { name: "cyrillic", blocks: [[1024, 1279]] },
    { name: "armenian", blocks: [[1328, 1423]] },
    { name: "brahmic", blocks: [[2304, 4255]] },
    { name: "georgian", blocks: [[4256, 4351]] },
    {
      name: "cjk",
      blocks: [
        [12288, 12543],
        [19968, 40879],
        [65280, 65376],
      ],
    },
    { name: "hangul", blocks: [[44032, 55215]] },
  ];
function zg(t) {
  for (var e = 0; e < r0.length; e++)
    for (var n = r0[e], r = 0; r < n.blocks.length; r++) {
      var i = n.blocks[r];
      if (t >= i[0] && t <= i[1]) return n.name;
    }
  return null;
}
var bs = [];
r0.forEach((t) => t.blocks.forEach((e) => bs.push(...e)));
function vd(t) {
  for (var e = 0; e < bs.length; e += 2)
    if (t >= bs[e] && t <= bs[e + 1]) return !0;
  return !1;
}
var gi = 80,
  Dg = function (e, n) {
    return (
      "M95," +
      (622 + e + n) +
      `
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l` +
      e / 2.075 +
      " -" +
      e +
      `
c5.3,-9.3,12,-14,20,-14
H400000v` +
      (40 + e) +
      `H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M` +
      (834 + e) +
      " " +
      n +
      "h400000v" +
      (40 + e) +
      "h-400000z"
    );
  },
  Ig = function (e, n) {
    return (
      "M263," +
      (601 + e + n) +
      `c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l` +
      e / 2.084 +
      " -" +
      e +
      `
c4.7,-7.3,11,-11,19,-11
H40000v` +
      (40 + e) +
      `H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M` +
      (1001 + e) +
      " " +
      n +
      "h400000v" +
      (40 + e) +
      "h-400000z"
    );
  },
  Ng = function (e, n) {
    return (
      "M983 " +
      (10 + e + n) +
      `
l` +
      e / 3.13 +
      " -" +
      e +
      `
c4,-6.7,10,-10,18,-10 H400000v` +
      (40 + e) +
      `
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M` +
      (1001 + e) +
      " " +
      n +
      "h400000v" +
      (40 + e) +
      "h-400000z"
    );
  },
  Fg = function (e, n) {
    return (
      "M424," +
      (2398 + e + n) +
      `
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l` +
      e / 4.223 +
      " -" +
      e +
      `c4,-6.7,10,-10,18,-10 H400000
v` +
      (40 + e) +
      `H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M` +
      (1001 + e) +
      " " +
      n +
      `
h400000v` +
      (40 + e) +
      "h-400000z"
    );
  },
  _g = function (e, n) {
    return (
      "M473," +
      (2713 + e + n) +
      `
c339.3,-1799.3,509.3,-2700,510,-2702 l` +
      e / 5.298 +
      " -" +
      e +
      `
c3.3,-7.3,9.3,-11,18,-11 H400000v` +
      (40 + e) +
      `H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM` +
      (1001 + e) +
      " " +
      n +
      "h400000v" +
      (40 + e) +
      "H1017.7z"
    );
  },
  Og = function (e) {
    var n = e / 2;
    return (
      "M400000 " + e + " H0 L" + n + " 0 l65 45 L145 " + (e - 80) + " H400000z"
    );
  },
  Bg = function (e, n, r) {
    var i = r - 54 - n - e;
    return (
      "M702 " +
      (e + n) +
      "H400000" +
      (40 + e) +
      `
H742v` +
      i +
      `l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 ` +
      n +
      "H400000v" +
      (40 + e) +
      "H742z"
    );
  },
  Rg = function (e, n, r) {
    n = 1e3 * n;
    var i = "";
    switch (e) {
      case "sqrtMain":
        i = Dg(n, gi);
        break;
      case "sqrtSize1":
        i = Ig(n, gi);
        break;
      case "sqrtSize2":
        i = Ng(n, gi);
        break;
      case "sqrtSize3":
        i = Fg(n, gi);
        break;
      case "sqrtSize4":
        i = _g(n, gi);
        break;
      case "sqrtTall":
        i = Bg(n, gi, r);
    }
    return i;
  },
  Pg = function (e, n) {
    switch (e) {
      case "⎜":
        return "M291 0 H417 V" + n + " H291z M291 0 H417 V" + n + " H291z";
      case "∣":
        return "M145 0 H188 V" + n + " H145z M145 0 H188 V" + n + " H145z";
      case "∥":
        return (
          "M145 0 H188 V" +
          n +
          " H145z M145 0 H188 V" +
          n +
          " H145z" +
          ("M367 0 H410 V" + n + " H367z M367 0 H410 V" + n + " H367z")
        );
      case "⎟":
        return "M457 0 H583 V" + n + " H457z M457 0 H583 V" + n + " H457z";
      case "⎢":
        return "M319 0 H403 V" + n + " H319z M319 0 H403 V" + n + " H319z";
      case "⎥":
        return "M263 0 H347 V" + n + " H263z M263 0 H347 V" + n + " H263z";
      case "⎪":
        return "M384 0 H504 V" + n + " H384z M384 0 H504 V" + n + " H384z";
      case "⏐":
        return "M312 0 H355 V" + n + " H312z M312 0 H355 V" + n + " H312z";
      case "‖":
        return (
          "M257 0 H300 V" +
          n +
          " H257z M257 0 H300 V" +
          n +
          " H257z" +
          ("M478 0 H521 V" + n + " H478z M478 0 H521 V" + n + " H478z")
        );
      default:
        return "";
    }
  },
  Ql = {
    doubleleftarrow: `M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,
    doublerightarrow: `M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,
    leftarrow: `M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,
    leftbrace: `M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,
    leftbraceunder: `M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,
    leftgroup: `M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,
    leftgroupunder: `M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,
    leftharpoon: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,
    leftharpoonplus: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,
    leftharpoondown: `M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,
    leftharpoondownplus: `M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,
    lefthook: `M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,
    leftlinesegment: `M40 281 V428 H0 V94 H40 V241 H400000 v40z
M40 281 V428 H0 V94 H40 V241 H400000 v40z`,
    leftmapsto: `M40 281 V448H0V74H40V241H400000v40z
M40 281 V448H0V74H40V241H400000v40z`,
    leftToFrom: `M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,
    longequal: `M0 50 h400000 v40H0z m0 194h40000v40H0z
M0 50 h400000 v40H0z m0 194h40000v40H0z`,
    midbrace: `M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,
    midbraceunder: `M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,
    oiintSize1: `M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,
    oiintSize2: `M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,
    oiiintSize1: `M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,
    oiiintSize2: `M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,
    rightarrow: `M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,
    rightbrace: `M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,
    rightbraceunder: `M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,
    rightgroup: `M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,
    rightgroupunder: `M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,
    rightharpoon: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,
    rightharpoonplus: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,
    rightharpoondown: `M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,
    rightharpoondownplus: `M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,
    righthook: `M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,
    rightlinesegment: `M399960 241 V94 h40 V428 h-40 V281 H0 v-40z
M399960 241 V94 h40 V428 h-40 V281 H0 v-40z`,
    rightToFrom: `M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,
    twoheadleftarrow: `M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,
    twoheadrightarrow: `M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,
    tilde1: `M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,
    tilde2: `M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,
    tilde3: `M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,
    tilde4: `M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,
    vec: `M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,
    widehat1: `M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,
    widehat2: `M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
    widehat3: `M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
    widehat4: `M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
    widecheck1: `M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,
    widecheck2: `M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
    widecheck3: `M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
    widecheck4: `M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
    baraboveleftarrow: `M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,
    rightarrowabovebar: `M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,
    baraboveshortleftharpoon: `M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,
    rightharpoonaboveshortbar: `M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,
    shortbaraboveleftharpoon: `M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,
    shortrightharpoonabovebar: `M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`,
  },
  Hg = function (e, n) {
    switch (e) {
      case "lbrack":
        return (
          "M403 1759 V84 H666 V0 H319 V1759 v" +
          n +
          ` v1759 h347 v-84
H403z M403 1759 V0 H319 V1759 v` +
          n +
          " v1759 h84z"
        );
      case "rbrack":
        return (
          "M347 1759 V0 H0 V84 H263 V1759 v" +
          n +
          ` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v` +
          n +
          " v1759 h84z"
        );
      case "vert":
        return (
          "M145 15 v585 v" +
          n +
          ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` +
          -n +
          ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` +
          n +
          " v585 h43z"
        );
      case "doublevert":
        return (
          "M145 15 v585 v" +
          n +
          ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` +
          -n +
          ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` +
          n +
          ` v585 h43z
M367 15 v585 v` +
          n +
          ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` +
          -n +
          ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v` +
          n +
          " v585 h43z"
        );
      case "lfloor":
        return (
          "M319 602 V0 H403 V602 v" +
          n +
          ` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v` +
          n +
          " v1715 H319z"
        );
      case "rfloor":
        return (
          "M319 602 V0 H403 V602 v" +
          n +
          ` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v` +
          n +
          " v1715 H319z"
        );
      case "lceil":
        return (
          "M403 1759 V84 H666 V0 H319 V1759 v" +
          n +
          ` v602 h84z
M403 1759 V0 H319 V1759 v` +
          n +
          " v602 h84z"
        );
      case "rceil":
        return (
          "M347 1759 V0 H0 V84 H263 V1759 v" +
          n +
          ` v602 h84z
M347 1759 V0 h-84 V1759 v` +
          n +
          " v602 h84z"
        );
      case "lparen":
        return (
          `M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,` +
          (n + 84) +
          `c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-` +
          (n + 92) +
          `c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`
        );
      case "rparen":
        return (
          `M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,` +
          (n + 9) +
          `
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-` +
          (n + 144) +
          `c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`
        );
      default:
        throw new Error("Unknown stretchy delimiter.");
    }
  };
class Ma {
  constructor(e) {
    ((this.children = void 0),
      (this.classes = void 0),
      (this.height = void 0),
      (this.depth = void 0),
      (this.maxFontSize = void 0),
      (this.style = void 0),
      (this.children = e),
      (this.classes = []),
      (this.height = 0),
      (this.depth = 0),
      (this.maxFontSize = 0),
      (this.style = {}));
  }
  hasClass(e) {
    return Ee.contains(this.classes, e);
  }
  toNode() {
    for (
      var e = document.createDocumentFragment(), n = 0;
      n < this.children.length;
      n++
    )
      e.appendChild(this.children[n].toNode());
    return e;
  }
  toMarkup() {
    for (var e = "", n = 0; n < this.children.length; n++)
      e += this.children[n].toMarkup();
    return e;
  }
  toText() {
    var e = (n) => n.toText();
    return this.children.map(e).join("");
  }
}
var yr = {
    "AMS-Regular": {
      32: [0, 0, 0, 0, 0.25],
      65: [0, 0.68889, 0, 0, 0.72222],
      66: [0, 0.68889, 0, 0, 0.66667],
      67: [0, 0.68889, 0, 0, 0.72222],
      68: [0, 0.68889, 0, 0, 0.72222],
      69: [0, 0.68889, 0, 0, 0.66667],
      70: [0, 0.68889, 0, 0, 0.61111],
      71: [0, 0.68889, 0, 0, 0.77778],
      72: [0, 0.68889, 0, 0, 0.77778],
      73: [0, 0.68889, 0, 0, 0.38889],
      74: [0.16667, 0.68889, 0, 0, 0.5],
      75: [0, 0.68889, 0, 0, 0.77778],
      76: [0, 0.68889, 0, 0, 0.66667],
      77: [0, 0.68889, 0, 0, 0.94445],
      78: [0, 0.68889, 0, 0, 0.72222],
      79: [0.16667, 0.68889, 0, 0, 0.77778],
      80: [0, 0.68889, 0, 0, 0.61111],
      81: [0.16667, 0.68889, 0, 0, 0.77778],
      82: [0, 0.68889, 0, 0, 0.72222],
      83: [0, 0.68889, 0, 0, 0.55556],
      84: [0, 0.68889, 0, 0, 0.66667],
      85: [0, 0.68889, 0, 0, 0.72222],
      86: [0, 0.68889, 0, 0, 0.72222],
      87: [0, 0.68889, 0, 0, 1],
      88: [0, 0.68889, 0, 0, 0.72222],
      89: [0, 0.68889, 0, 0, 0.72222],
      90: [0, 0.68889, 0, 0, 0.66667],
      107: [0, 0.68889, 0, 0, 0.55556],
      160: [0, 0, 0, 0, 0.25],
      165: [0, 0.675, 0.025, 0, 0.75],
      174: [0.15559, 0.69224, 0, 0, 0.94666],
      240: [0, 0.68889, 0, 0, 0.55556],
      295: [0, 0.68889, 0, 0, 0.54028],
      710: [0, 0.825, 0, 0, 2.33334],
      732: [0, 0.9, 0, 0, 2.33334],
      770: [0, 0.825, 0, 0, 2.33334],
      771: [0, 0.9, 0, 0, 2.33334],
      989: [0.08167, 0.58167, 0, 0, 0.77778],
      1008: [0, 0.43056, 0.04028, 0, 0.66667],
      8245: [0, 0.54986, 0, 0, 0.275],
      8463: [0, 0.68889, 0, 0, 0.54028],
      8487: [0, 0.68889, 0, 0, 0.72222],
      8498: [0, 0.68889, 0, 0, 0.55556],
      8502: [0, 0.68889, 0, 0, 0.66667],
      8503: [0, 0.68889, 0, 0, 0.44445],
      8504: [0, 0.68889, 0, 0, 0.66667],
      8513: [0, 0.68889, 0, 0, 0.63889],
      8592: [-0.03598, 0.46402, 0, 0, 0.5],
      8594: [-0.03598, 0.46402, 0, 0, 0.5],
      8602: [-0.13313, 0.36687, 0, 0, 1],
      8603: [-0.13313, 0.36687, 0, 0, 1],
      8606: [0.01354, 0.52239, 0, 0, 1],
      8608: [0.01354, 0.52239, 0, 0, 1],
      8610: [0.01354, 0.52239, 0, 0, 1.11111],
      8611: [0.01354, 0.52239, 0, 0, 1.11111],
      8619: [0, 0.54986, 0, 0, 1],
      8620: [0, 0.54986, 0, 0, 1],
      8621: [-0.13313, 0.37788, 0, 0, 1.38889],
      8622: [-0.13313, 0.36687, 0, 0, 1],
      8624: [0, 0.69224, 0, 0, 0.5],
      8625: [0, 0.69224, 0, 0, 0.5],
      8630: [0, 0.43056, 0, 0, 1],
      8631: [0, 0.43056, 0, 0, 1],
      8634: [0.08198, 0.58198, 0, 0, 0.77778],
      8635: [0.08198, 0.58198, 0, 0, 0.77778],
      8638: [0.19444, 0.69224, 0, 0, 0.41667],
      8639: [0.19444, 0.69224, 0, 0, 0.41667],
      8642: [0.19444, 0.69224, 0, 0, 0.41667],
      8643: [0.19444, 0.69224, 0, 0, 0.41667],
      8644: [0.1808, 0.675, 0, 0, 1],
      8646: [0.1808, 0.675, 0, 0, 1],
      8647: [0.1808, 0.675, 0, 0, 1],
      8648: [0.19444, 0.69224, 0, 0, 0.83334],
      8649: [0.1808, 0.675, 0, 0, 1],
      8650: [0.19444, 0.69224, 0, 0, 0.83334],
      8651: [0.01354, 0.52239, 0, 0, 1],
      8652: [0.01354, 0.52239, 0, 0, 1],
      8653: [-0.13313, 0.36687, 0, 0, 1],
      8654: [-0.13313, 0.36687, 0, 0, 1],
      8655: [-0.13313, 0.36687, 0, 0, 1],
      8666: [0.13667, 0.63667, 0, 0, 1],
      8667: [0.13667, 0.63667, 0, 0, 1],
      8669: [-0.13313, 0.37788, 0, 0, 1],
      8672: [-0.064, 0.437, 0, 0, 1.334],
      8674: [-0.064, 0.437, 0, 0, 1.334],
      8705: [0, 0.825, 0, 0, 0.5],
      8708: [0, 0.68889, 0, 0, 0.55556],
      8709: [0.08167, 0.58167, 0, 0, 0.77778],
      8717: [0, 0.43056, 0, 0, 0.42917],
      8722: [-0.03598, 0.46402, 0, 0, 0.5],
      8724: [0.08198, 0.69224, 0, 0, 0.77778],
      8726: [0.08167, 0.58167, 0, 0, 0.77778],
      8733: [0, 0.69224, 0, 0, 0.77778],
      8736: [0, 0.69224, 0, 0, 0.72222],
      8737: [0, 0.69224, 0, 0, 0.72222],
      8738: [0.03517, 0.52239, 0, 0, 0.72222],
      8739: [0.08167, 0.58167, 0, 0, 0.22222],
      8740: [0.25142, 0.74111, 0, 0, 0.27778],
      8741: [0.08167, 0.58167, 0, 0, 0.38889],
      8742: [0.25142, 0.74111, 0, 0, 0.5],
      8756: [0, 0.69224, 0, 0, 0.66667],
      8757: [0, 0.69224, 0, 0, 0.66667],
      8764: [-0.13313, 0.36687, 0, 0, 0.77778],
      8765: [-0.13313, 0.37788, 0, 0, 0.77778],
      8769: [-0.13313, 0.36687, 0, 0, 0.77778],
      8770: [-0.03625, 0.46375, 0, 0, 0.77778],
      8774: [0.30274, 0.79383, 0, 0, 0.77778],
      8776: [-0.01688, 0.48312, 0, 0, 0.77778],
      8778: [0.08167, 0.58167, 0, 0, 0.77778],
      8782: [0.06062, 0.54986, 0, 0, 0.77778],
      8783: [0.06062, 0.54986, 0, 0, 0.77778],
      8785: [0.08198, 0.58198, 0, 0, 0.77778],
      8786: [0.08198, 0.58198, 0, 0, 0.77778],
      8787: [0.08198, 0.58198, 0, 0, 0.77778],
      8790: [0, 0.69224, 0, 0, 0.77778],
      8791: [0.22958, 0.72958, 0, 0, 0.77778],
      8796: [0.08198, 0.91667, 0, 0, 0.77778],
      8806: [0.25583, 0.75583, 0, 0, 0.77778],
      8807: [0.25583, 0.75583, 0, 0, 0.77778],
      8808: [0.25142, 0.75726, 0, 0, 0.77778],
      8809: [0.25142, 0.75726, 0, 0, 0.77778],
      8812: [0.25583, 0.75583, 0, 0, 0.5],
      8814: [0.20576, 0.70576, 0, 0, 0.77778],
      8815: [0.20576, 0.70576, 0, 0, 0.77778],
      8816: [0.30274, 0.79383, 0, 0, 0.77778],
      8817: [0.30274, 0.79383, 0, 0, 0.77778],
      8818: [0.22958, 0.72958, 0, 0, 0.77778],
      8819: [0.22958, 0.72958, 0, 0, 0.77778],
      8822: [0.1808, 0.675, 0, 0, 0.77778],
      8823: [0.1808, 0.675, 0, 0, 0.77778],
      8828: [0.13667, 0.63667, 0, 0, 0.77778],
      8829: [0.13667, 0.63667, 0, 0, 0.77778],
      8830: [0.22958, 0.72958, 0, 0, 0.77778],
      8831: [0.22958, 0.72958, 0, 0, 0.77778],
      8832: [0.20576, 0.70576, 0, 0, 0.77778],
      8833: [0.20576, 0.70576, 0, 0, 0.77778],
      8840: [0.30274, 0.79383, 0, 0, 0.77778],
      8841: [0.30274, 0.79383, 0, 0, 0.77778],
      8842: [0.13597, 0.63597, 0, 0, 0.77778],
      8843: [0.13597, 0.63597, 0, 0, 0.77778],
      8847: [0.03517, 0.54986, 0, 0, 0.77778],
      8848: [0.03517, 0.54986, 0, 0, 0.77778],
      8858: [0.08198, 0.58198, 0, 0, 0.77778],
      8859: [0.08198, 0.58198, 0, 0, 0.77778],
      8861: [0.08198, 0.58198, 0, 0, 0.77778],
      8862: [0, 0.675, 0, 0, 0.77778],
      8863: [0, 0.675, 0, 0, 0.77778],
      8864: [0, 0.675, 0, 0, 0.77778],
      8865: [0, 0.675, 0, 0, 0.77778],
      8872: [0, 0.69224, 0, 0, 0.61111],
      8873: [0, 0.69224, 0, 0, 0.72222],
      8874: [0, 0.69224, 0, 0, 0.88889],
      8876: [0, 0.68889, 0, 0, 0.61111],
      8877: [0, 0.68889, 0, 0, 0.61111],
      8878: [0, 0.68889, 0, 0, 0.72222],
      8879: [0, 0.68889, 0, 0, 0.72222],
      8882: [0.03517, 0.54986, 0, 0, 0.77778],
      8883: [0.03517, 0.54986, 0, 0, 0.77778],
      8884: [0.13667, 0.63667, 0, 0, 0.77778],
      8885: [0.13667, 0.63667, 0, 0, 0.77778],
      8888: [0, 0.54986, 0, 0, 1.11111],
      8890: [0.19444, 0.43056, 0, 0, 0.55556],
      8891: [0.19444, 0.69224, 0, 0, 0.61111],
      8892: [0.19444, 0.69224, 0, 0, 0.61111],
      8901: [0, 0.54986, 0, 0, 0.27778],
      8903: [0.08167, 0.58167, 0, 0, 0.77778],
      8905: [0.08167, 0.58167, 0, 0, 0.77778],
      8906: [0.08167, 0.58167, 0, 0, 0.77778],
      8907: [0, 0.69224, 0, 0, 0.77778],
      8908: [0, 0.69224, 0, 0, 0.77778],
      8909: [-0.03598, 0.46402, 0, 0, 0.77778],
      8910: [0, 0.54986, 0, 0, 0.76042],
      8911: [0, 0.54986, 0, 0, 0.76042],
      8912: [0.03517, 0.54986, 0, 0, 0.77778],
      8913: [0.03517, 0.54986, 0, 0, 0.77778],
      8914: [0, 0.54986, 0, 0, 0.66667],
      8915: [0, 0.54986, 0, 0, 0.66667],
      8916: [0, 0.69224, 0, 0, 0.66667],
      8918: [0.0391, 0.5391, 0, 0, 0.77778],
      8919: [0.0391, 0.5391, 0, 0, 0.77778],
      8920: [0.03517, 0.54986, 0, 0, 1.33334],
      8921: [0.03517, 0.54986, 0, 0, 1.33334],
      8922: [0.38569, 0.88569, 0, 0, 0.77778],
      8923: [0.38569, 0.88569, 0, 0, 0.77778],
      8926: [0.13667, 0.63667, 0, 0, 0.77778],
      8927: [0.13667, 0.63667, 0, 0, 0.77778],
      8928: [0.30274, 0.79383, 0, 0, 0.77778],
      8929: [0.30274, 0.79383, 0, 0, 0.77778],
      8934: [0.23222, 0.74111, 0, 0, 0.77778],
      8935: [0.23222, 0.74111, 0, 0, 0.77778],
      8936: [0.23222, 0.74111, 0, 0, 0.77778],
      8937: [0.23222, 0.74111, 0, 0, 0.77778],
      8938: [0.20576, 0.70576, 0, 0, 0.77778],
      8939: [0.20576, 0.70576, 0, 0, 0.77778],
      8940: [0.30274, 0.79383, 0, 0, 0.77778],
      8941: [0.30274, 0.79383, 0, 0, 0.77778],
      8994: [0.19444, 0.69224, 0, 0, 0.77778],
      8995: [0.19444, 0.69224, 0, 0, 0.77778],
      9416: [0.15559, 0.69224, 0, 0, 0.90222],
      9484: [0, 0.69224, 0, 0, 0.5],
      9488: [0, 0.69224, 0, 0, 0.5],
      9492: [0, 0.37788, 0, 0, 0.5],
      9496: [0, 0.37788, 0, 0, 0.5],
      9585: [0.19444, 0.68889, 0, 0, 0.88889],
      9586: [0.19444, 0.74111, 0, 0, 0.88889],
      9632: [0, 0.675, 0, 0, 0.77778],
      9633: [0, 0.675, 0, 0, 0.77778],
      9650: [0, 0.54986, 0, 0, 0.72222],
      9651: [0, 0.54986, 0, 0, 0.72222],
      9654: [0.03517, 0.54986, 0, 0, 0.77778],
      9660: [0, 0.54986, 0, 0, 0.72222],
      9661: [0, 0.54986, 0, 0, 0.72222],
      9664: [0.03517, 0.54986, 0, 0, 0.77778],
      9674: [0.11111, 0.69224, 0, 0, 0.66667],
      9733: [0.19444, 0.69224, 0, 0, 0.94445],
      10003: [0, 0.69224, 0, 0, 0.83334],
      10016: [0, 0.69224, 0, 0, 0.83334],
      10731: [0.11111, 0.69224, 0, 0, 0.66667],
      10846: [0.19444, 0.75583, 0, 0, 0.61111],
      10877: [0.13667, 0.63667, 0, 0, 0.77778],
      10878: [0.13667, 0.63667, 0, 0, 0.77778],
      10885: [0.25583, 0.75583, 0, 0, 0.77778],
      10886: [0.25583, 0.75583, 0, 0, 0.77778],
      10887: [0.13597, 0.63597, 0, 0, 0.77778],
      10888: [0.13597, 0.63597, 0, 0, 0.77778],
      10889: [0.26167, 0.75726, 0, 0, 0.77778],
      10890: [0.26167, 0.75726, 0, 0, 0.77778],
      10891: [0.48256, 0.98256, 0, 0, 0.77778],
      10892: [0.48256, 0.98256, 0, 0, 0.77778],
      10901: [0.13667, 0.63667, 0, 0, 0.77778],
      10902: [0.13667, 0.63667, 0, 0, 0.77778],
      10933: [0.25142, 0.75726, 0, 0, 0.77778],
      10934: [0.25142, 0.75726, 0, 0, 0.77778],
      10935: [0.26167, 0.75726, 0, 0, 0.77778],
      10936: [0.26167, 0.75726, 0, 0, 0.77778],
      10937: [0.26167, 0.75726, 0, 0, 0.77778],
      10938: [0.26167, 0.75726, 0, 0, 0.77778],
      10949: [0.25583, 0.75583, 0, 0, 0.77778],
      10950: [0.25583, 0.75583, 0, 0, 0.77778],
      10955: [0.28481, 0.79383, 0, 0, 0.77778],
      10956: [0.28481, 0.79383, 0, 0, 0.77778],
      57350: [0.08167, 0.58167, 0, 0, 0.22222],
      57351: [0.08167, 0.58167, 0, 0, 0.38889],
      57352: [0.08167, 0.58167, 0, 0, 0.77778],
      57353: [0, 0.43056, 0.04028, 0, 0.66667],
      57356: [0.25142, 0.75726, 0, 0, 0.77778],
      57357: [0.25142, 0.75726, 0, 0, 0.77778],
      57358: [0.41951, 0.91951, 0, 0, 0.77778],
      57359: [0.30274, 0.79383, 0, 0, 0.77778],
      57360: [0.30274, 0.79383, 0, 0, 0.77778],
      57361: [0.41951, 0.91951, 0, 0, 0.77778],
      57366: [0.25142, 0.75726, 0, 0, 0.77778],
      57367: [0.25142, 0.75726, 0, 0, 0.77778],
      57368: [0.25142, 0.75726, 0, 0, 0.77778],
      57369: [0.25142, 0.75726, 0, 0, 0.77778],
      57370: [0.13597, 0.63597, 0, 0, 0.77778],
      57371: [0.13597, 0.63597, 0, 0, 0.77778],
    },
    "Caligraphic-Regular": {
      32: [0, 0, 0, 0, 0.25],
      65: [0, 0.68333, 0, 0.19445, 0.79847],
      66: [0, 0.68333, 0.03041, 0.13889, 0.65681],
      67: [0, 0.68333, 0.05834, 0.13889, 0.52653],
      68: [0, 0.68333, 0.02778, 0.08334, 0.77139],
      69: [0, 0.68333, 0.08944, 0.11111, 0.52778],
      70: [0, 0.68333, 0.09931, 0.11111, 0.71875],
      71: [0.09722, 0.68333, 0.0593, 0.11111, 0.59487],
      72: [0, 0.68333, 0.00965, 0.11111, 0.84452],
      73: [0, 0.68333, 0.07382, 0, 0.54452],
      74: [0.09722, 0.68333, 0.18472, 0.16667, 0.67778],
      75: [0, 0.68333, 0.01445, 0.05556, 0.76195],
      76: [0, 0.68333, 0, 0.13889, 0.68972],
      77: [0, 0.68333, 0, 0.13889, 1.2009],
      78: [0, 0.68333, 0.14736, 0.08334, 0.82049],
      79: [0, 0.68333, 0.02778, 0.11111, 0.79611],
      80: [0, 0.68333, 0.08222, 0.08334, 0.69556],
      81: [0.09722, 0.68333, 0, 0.11111, 0.81667],
      82: [0, 0.68333, 0, 0.08334, 0.8475],
      83: [0, 0.68333, 0.075, 0.13889, 0.60556],
      84: [0, 0.68333, 0.25417, 0, 0.54464],
      85: [0, 0.68333, 0.09931, 0.08334, 0.62583],
      86: [0, 0.68333, 0.08222, 0, 0.61278],
      87: [0, 0.68333, 0.08222, 0.08334, 0.98778],
      88: [0, 0.68333, 0.14643, 0.13889, 0.7133],
      89: [0.09722, 0.68333, 0.08222, 0.08334, 0.66834],
      90: [0, 0.68333, 0.07944, 0.13889, 0.72473],
      160: [0, 0, 0, 0, 0.25],
    },
    "Fraktur-Regular": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69141, 0, 0, 0.29574],
      34: [0, 0.69141, 0, 0, 0.21471],
      38: [0, 0.69141, 0, 0, 0.73786],
      39: [0, 0.69141, 0, 0, 0.21201],
      40: [0.24982, 0.74947, 0, 0, 0.38865],
      41: [0.24982, 0.74947, 0, 0, 0.38865],
      42: [0, 0.62119, 0, 0, 0.27764],
      43: [0.08319, 0.58283, 0, 0, 0.75623],
      44: [0, 0.10803, 0, 0, 0.27764],
      45: [0.08319, 0.58283, 0, 0, 0.75623],
      46: [0, 0.10803, 0, 0, 0.27764],
      47: [0.24982, 0.74947, 0, 0, 0.50181],
      48: [0, 0.47534, 0, 0, 0.50181],
      49: [0, 0.47534, 0, 0, 0.50181],
      50: [0, 0.47534, 0, 0, 0.50181],
      51: [0.18906, 0.47534, 0, 0, 0.50181],
      52: [0.18906, 0.47534, 0, 0, 0.50181],
      53: [0.18906, 0.47534, 0, 0, 0.50181],
      54: [0, 0.69141, 0, 0, 0.50181],
      55: [0.18906, 0.47534, 0, 0, 0.50181],
      56: [0, 0.69141, 0, 0, 0.50181],
      57: [0.18906, 0.47534, 0, 0, 0.50181],
      58: [0, 0.47534, 0, 0, 0.21606],
      59: [0.12604, 0.47534, 0, 0, 0.21606],
      61: [-0.13099, 0.36866, 0, 0, 0.75623],
      63: [0, 0.69141, 0, 0, 0.36245],
      65: [0, 0.69141, 0, 0, 0.7176],
      66: [0, 0.69141, 0, 0, 0.88397],
      67: [0, 0.69141, 0, 0, 0.61254],
      68: [0, 0.69141, 0, 0, 0.83158],
      69: [0, 0.69141, 0, 0, 0.66278],
      70: [0.12604, 0.69141, 0, 0, 0.61119],
      71: [0, 0.69141, 0, 0, 0.78539],
      72: [0.06302, 0.69141, 0, 0, 0.7203],
      73: [0, 0.69141, 0, 0, 0.55448],
      74: [0.12604, 0.69141, 0, 0, 0.55231],
      75: [0, 0.69141, 0, 0, 0.66845],
      76: [0, 0.69141, 0, 0, 0.66602],
      77: [0, 0.69141, 0, 0, 1.04953],
      78: [0, 0.69141, 0, 0, 0.83212],
      79: [0, 0.69141, 0, 0, 0.82699],
      80: [0.18906, 0.69141, 0, 0, 0.82753],
      81: [0.03781, 0.69141, 0, 0, 0.82699],
      82: [0, 0.69141, 0, 0, 0.82807],
      83: [0, 0.69141, 0, 0, 0.82861],
      84: [0, 0.69141, 0, 0, 0.66899],
      85: [0, 0.69141, 0, 0, 0.64576],
      86: [0, 0.69141, 0, 0, 0.83131],
      87: [0, 0.69141, 0, 0, 1.04602],
      88: [0, 0.69141, 0, 0, 0.71922],
      89: [0.18906, 0.69141, 0, 0, 0.83293],
      90: [0.12604, 0.69141, 0, 0, 0.60201],
      91: [0.24982, 0.74947, 0, 0, 0.27764],
      93: [0.24982, 0.74947, 0, 0, 0.27764],
      94: [0, 0.69141, 0, 0, 0.49965],
      97: [0, 0.47534, 0, 0, 0.50046],
      98: [0, 0.69141, 0, 0, 0.51315],
      99: [0, 0.47534, 0, 0, 0.38946],
      100: [0, 0.62119, 0, 0, 0.49857],
      101: [0, 0.47534, 0, 0, 0.40053],
      102: [0.18906, 0.69141, 0, 0, 0.32626],
      103: [0.18906, 0.47534, 0, 0, 0.5037],
      104: [0.18906, 0.69141, 0, 0, 0.52126],
      105: [0, 0.69141, 0, 0, 0.27899],
      106: [0, 0.69141, 0, 0, 0.28088],
      107: [0, 0.69141, 0, 0, 0.38946],
      108: [0, 0.69141, 0, 0, 0.27953],
      109: [0, 0.47534, 0, 0, 0.76676],
      110: [0, 0.47534, 0, 0, 0.52666],
      111: [0, 0.47534, 0, 0, 0.48885],
      112: [0.18906, 0.52396, 0, 0, 0.50046],
      113: [0.18906, 0.47534, 0, 0, 0.48912],
      114: [0, 0.47534, 0, 0, 0.38919],
      115: [0, 0.47534, 0, 0, 0.44266],
      116: [0, 0.62119, 0, 0, 0.33301],
      117: [0, 0.47534, 0, 0, 0.5172],
      118: [0, 0.52396, 0, 0, 0.5118],
      119: [0, 0.52396, 0, 0, 0.77351],
      120: [0.18906, 0.47534, 0, 0, 0.38865],
      121: [0.18906, 0.47534, 0, 0, 0.49884],
      122: [0.18906, 0.47534, 0, 0, 0.39054],
      160: [0, 0, 0, 0, 0.25],
      8216: [0, 0.69141, 0, 0, 0.21471],
      8217: [0, 0.69141, 0, 0, 0.21471],
      58112: [0, 0.62119, 0, 0, 0.49749],
      58113: [0, 0.62119, 0, 0, 0.4983],
      58114: [0.18906, 0.69141, 0, 0, 0.33328],
      58115: [0.18906, 0.69141, 0, 0, 0.32923],
      58116: [0.18906, 0.47534, 0, 0, 0.50343],
      58117: [0, 0.69141, 0, 0, 0.33301],
      58118: [0, 0.62119, 0, 0, 0.33409],
      58119: [0, 0.47534, 0, 0, 0.50073],
    },
    "Main-Bold": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0, 0, 0.35],
      34: [0, 0.69444, 0, 0, 0.60278],
      35: [0.19444, 0.69444, 0, 0, 0.95833],
      36: [0.05556, 0.75, 0, 0, 0.575],
      37: [0.05556, 0.75, 0, 0, 0.95833],
      38: [0, 0.69444, 0, 0, 0.89444],
      39: [0, 0.69444, 0, 0, 0.31944],
      40: [0.25, 0.75, 0, 0, 0.44722],
      41: [0.25, 0.75, 0, 0, 0.44722],
      42: [0, 0.75, 0, 0, 0.575],
      43: [0.13333, 0.63333, 0, 0, 0.89444],
      44: [0.19444, 0.15556, 0, 0, 0.31944],
      45: [0, 0.44444, 0, 0, 0.38333],
      46: [0, 0.15556, 0, 0, 0.31944],
      47: [0.25, 0.75, 0, 0, 0.575],
      48: [0, 0.64444, 0, 0, 0.575],
      49: [0, 0.64444, 0, 0, 0.575],
      50: [0, 0.64444, 0, 0, 0.575],
      51: [0, 0.64444, 0, 0, 0.575],
      52: [0, 0.64444, 0, 0, 0.575],
      53: [0, 0.64444, 0, 0, 0.575],
      54: [0, 0.64444, 0, 0, 0.575],
      55: [0, 0.64444, 0, 0, 0.575],
      56: [0, 0.64444, 0, 0, 0.575],
      57: [0, 0.64444, 0, 0, 0.575],
      58: [0, 0.44444, 0, 0, 0.31944],
      59: [0.19444, 0.44444, 0, 0, 0.31944],
      60: [0.08556, 0.58556, 0, 0, 0.89444],
      61: [-0.10889, 0.39111, 0, 0, 0.89444],
      62: [0.08556, 0.58556, 0, 0, 0.89444],
      63: [0, 0.69444, 0, 0, 0.54305],
      64: [0, 0.69444, 0, 0, 0.89444],
      65: [0, 0.68611, 0, 0, 0.86944],
      66: [0, 0.68611, 0, 0, 0.81805],
      67: [0, 0.68611, 0, 0, 0.83055],
      68: [0, 0.68611, 0, 0, 0.88194],
      69: [0, 0.68611, 0, 0, 0.75555],
      70: [0, 0.68611, 0, 0, 0.72361],
      71: [0, 0.68611, 0, 0, 0.90416],
      72: [0, 0.68611, 0, 0, 0.9],
      73: [0, 0.68611, 0, 0, 0.43611],
      74: [0, 0.68611, 0, 0, 0.59444],
      75: [0, 0.68611, 0, 0, 0.90138],
      76: [0, 0.68611, 0, 0, 0.69166],
      77: [0, 0.68611, 0, 0, 1.09166],
      78: [0, 0.68611, 0, 0, 0.9],
      79: [0, 0.68611, 0, 0, 0.86388],
      80: [0, 0.68611, 0, 0, 0.78611],
      81: [0.19444, 0.68611, 0, 0, 0.86388],
      82: [0, 0.68611, 0, 0, 0.8625],
      83: [0, 0.68611, 0, 0, 0.63889],
      84: [0, 0.68611, 0, 0, 0.8],
      85: [0, 0.68611, 0, 0, 0.88472],
      86: [0, 0.68611, 0.01597, 0, 0.86944],
      87: [0, 0.68611, 0.01597, 0, 1.18888],
      88: [0, 0.68611, 0, 0, 0.86944],
      89: [0, 0.68611, 0.02875, 0, 0.86944],
      90: [0, 0.68611, 0, 0, 0.70277],
      91: [0.25, 0.75, 0, 0, 0.31944],
      92: [0.25, 0.75, 0, 0, 0.575],
      93: [0.25, 0.75, 0, 0, 0.31944],
      94: [0, 0.69444, 0, 0, 0.575],
      95: [0.31, 0.13444, 0.03194, 0, 0.575],
      97: [0, 0.44444, 0, 0, 0.55902],
      98: [0, 0.69444, 0, 0, 0.63889],
      99: [0, 0.44444, 0, 0, 0.51111],
      100: [0, 0.69444, 0, 0, 0.63889],
      101: [0, 0.44444, 0, 0, 0.52708],
      102: [0, 0.69444, 0.10903, 0, 0.35139],
      103: [0.19444, 0.44444, 0.01597, 0, 0.575],
      104: [0, 0.69444, 0, 0, 0.63889],
      105: [0, 0.69444, 0, 0, 0.31944],
      106: [0.19444, 0.69444, 0, 0, 0.35139],
      107: [0, 0.69444, 0, 0, 0.60694],
      108: [0, 0.69444, 0, 0, 0.31944],
      109: [0, 0.44444, 0, 0, 0.95833],
      110: [0, 0.44444, 0, 0, 0.63889],
      111: [0, 0.44444, 0, 0, 0.575],
      112: [0.19444, 0.44444, 0, 0, 0.63889],
      113: [0.19444, 0.44444, 0, 0, 0.60694],
      114: [0, 0.44444, 0, 0, 0.47361],
      115: [0, 0.44444, 0, 0, 0.45361],
      116: [0, 0.63492, 0, 0, 0.44722],
      117: [0, 0.44444, 0, 0, 0.63889],
      118: [0, 0.44444, 0.01597, 0, 0.60694],
      119: [0, 0.44444, 0.01597, 0, 0.83055],
      120: [0, 0.44444, 0, 0, 0.60694],
      121: [0.19444, 0.44444, 0.01597, 0, 0.60694],
      122: [0, 0.44444, 0, 0, 0.51111],
      123: [0.25, 0.75, 0, 0, 0.575],
      124: [0.25, 0.75, 0, 0, 0.31944],
      125: [0.25, 0.75, 0, 0, 0.575],
      126: [0.35, 0.34444, 0, 0, 0.575],
      160: [0, 0, 0, 0, 0.25],
      163: [0, 0.69444, 0, 0, 0.86853],
      168: [0, 0.69444, 0, 0, 0.575],
      172: [0, 0.44444, 0, 0, 0.76666],
      176: [0, 0.69444, 0, 0, 0.86944],
      177: [0.13333, 0.63333, 0, 0, 0.89444],
      184: [0.17014, 0, 0, 0, 0.51111],
      198: [0, 0.68611, 0, 0, 1.04166],
      215: [0.13333, 0.63333, 0, 0, 0.89444],
      216: [0.04861, 0.73472, 0, 0, 0.89444],
      223: [0, 0.69444, 0, 0, 0.59722],
      230: [0, 0.44444, 0, 0, 0.83055],
      247: [0.13333, 0.63333, 0, 0, 0.89444],
      248: [0.09722, 0.54167, 0, 0, 0.575],
      305: [0, 0.44444, 0, 0, 0.31944],
      338: [0, 0.68611, 0, 0, 1.16944],
      339: [0, 0.44444, 0, 0, 0.89444],
      567: [0.19444, 0.44444, 0, 0, 0.35139],
      710: [0, 0.69444, 0, 0, 0.575],
      711: [0, 0.63194, 0, 0, 0.575],
      713: [0, 0.59611, 0, 0, 0.575],
      714: [0, 0.69444, 0, 0, 0.575],
      715: [0, 0.69444, 0, 0, 0.575],
      728: [0, 0.69444, 0, 0, 0.575],
      729: [0, 0.69444, 0, 0, 0.31944],
      730: [0, 0.69444, 0, 0, 0.86944],
      732: [0, 0.69444, 0, 0, 0.575],
      733: [0, 0.69444, 0, 0, 0.575],
      915: [0, 0.68611, 0, 0, 0.69166],
      916: [0, 0.68611, 0, 0, 0.95833],
      920: [0, 0.68611, 0, 0, 0.89444],
      923: [0, 0.68611, 0, 0, 0.80555],
      926: [0, 0.68611, 0, 0, 0.76666],
      928: [0, 0.68611, 0, 0, 0.9],
      931: [0, 0.68611, 0, 0, 0.83055],
      933: [0, 0.68611, 0, 0, 0.89444],
      934: [0, 0.68611, 0, 0, 0.83055],
      936: [0, 0.68611, 0, 0, 0.89444],
      937: [0, 0.68611, 0, 0, 0.83055],
      8211: [0, 0.44444, 0.03194, 0, 0.575],
      8212: [0, 0.44444, 0.03194, 0, 1.14999],
      8216: [0, 0.69444, 0, 0, 0.31944],
      8217: [0, 0.69444, 0, 0, 0.31944],
      8220: [0, 0.69444, 0, 0, 0.60278],
      8221: [0, 0.69444, 0, 0, 0.60278],
      8224: [0.19444, 0.69444, 0, 0, 0.51111],
      8225: [0.19444, 0.69444, 0, 0, 0.51111],
      8242: [0, 0.55556, 0, 0, 0.34444],
      8407: [0, 0.72444, 0.15486, 0, 0.575],
      8463: [0, 0.69444, 0, 0, 0.66759],
      8465: [0, 0.69444, 0, 0, 0.83055],
      8467: [0, 0.69444, 0, 0, 0.47361],
      8472: [0.19444, 0.44444, 0, 0, 0.74027],
      8476: [0, 0.69444, 0, 0, 0.83055],
      8501: [0, 0.69444, 0, 0, 0.70277],
      8592: [-0.10889, 0.39111, 0, 0, 1.14999],
      8593: [0.19444, 0.69444, 0, 0, 0.575],
      8594: [-0.10889, 0.39111, 0, 0, 1.14999],
      8595: [0.19444, 0.69444, 0, 0, 0.575],
      8596: [-0.10889, 0.39111, 0, 0, 1.14999],
      8597: [0.25, 0.75, 0, 0, 0.575],
      8598: [0.19444, 0.69444, 0, 0, 1.14999],
      8599: [0.19444, 0.69444, 0, 0, 1.14999],
      8600: [0.19444, 0.69444, 0, 0, 1.14999],
      8601: [0.19444, 0.69444, 0, 0, 1.14999],
      8636: [-0.10889, 0.39111, 0, 0, 1.14999],
      8637: [-0.10889, 0.39111, 0, 0, 1.14999],
      8640: [-0.10889, 0.39111, 0, 0, 1.14999],
      8641: [-0.10889, 0.39111, 0, 0, 1.14999],
      8656: [-0.10889, 0.39111, 0, 0, 1.14999],
      8657: [0.19444, 0.69444, 0, 0, 0.70277],
      8658: [-0.10889, 0.39111, 0, 0, 1.14999],
      8659: [0.19444, 0.69444, 0, 0, 0.70277],
      8660: [-0.10889, 0.39111, 0, 0, 1.14999],
      8661: [0.25, 0.75, 0, 0, 0.70277],
      8704: [0, 0.69444, 0, 0, 0.63889],
      8706: [0, 0.69444, 0.06389, 0, 0.62847],
      8707: [0, 0.69444, 0, 0, 0.63889],
      8709: [0.05556, 0.75, 0, 0, 0.575],
      8711: [0, 0.68611, 0, 0, 0.95833],
      8712: [0.08556, 0.58556, 0, 0, 0.76666],
      8715: [0.08556, 0.58556, 0, 0, 0.76666],
      8722: [0.13333, 0.63333, 0, 0, 0.89444],
      8723: [0.13333, 0.63333, 0, 0, 0.89444],
      8725: [0.25, 0.75, 0, 0, 0.575],
      8726: [0.25, 0.75, 0, 0, 0.575],
      8727: [-0.02778, 0.47222, 0, 0, 0.575],
      8728: [-0.02639, 0.47361, 0, 0, 0.575],
      8729: [-0.02639, 0.47361, 0, 0, 0.575],
      8730: [0.18, 0.82, 0, 0, 0.95833],
      8733: [0, 0.44444, 0, 0, 0.89444],
      8734: [0, 0.44444, 0, 0, 1.14999],
      8736: [0, 0.69224, 0, 0, 0.72222],
      8739: [0.25, 0.75, 0, 0, 0.31944],
      8741: [0.25, 0.75, 0, 0, 0.575],
      8743: [0, 0.55556, 0, 0, 0.76666],
      8744: [0, 0.55556, 0, 0, 0.76666],
      8745: [0, 0.55556, 0, 0, 0.76666],
      8746: [0, 0.55556, 0, 0, 0.76666],
      8747: [0.19444, 0.69444, 0.12778, 0, 0.56875],
      8764: [-0.10889, 0.39111, 0, 0, 0.89444],
      8768: [0.19444, 0.69444, 0, 0, 0.31944],
      8771: [0.00222, 0.50222, 0, 0, 0.89444],
      8773: [0.027, 0.638, 0, 0, 0.894],
      8776: [0.02444, 0.52444, 0, 0, 0.89444],
      8781: [0.00222, 0.50222, 0, 0, 0.89444],
      8801: [0.00222, 0.50222, 0, 0, 0.89444],
      8804: [0.19667, 0.69667, 0, 0, 0.89444],
      8805: [0.19667, 0.69667, 0, 0, 0.89444],
      8810: [0.08556, 0.58556, 0, 0, 1.14999],
      8811: [0.08556, 0.58556, 0, 0, 1.14999],
      8826: [0.08556, 0.58556, 0, 0, 0.89444],
      8827: [0.08556, 0.58556, 0, 0, 0.89444],
      8834: [0.08556, 0.58556, 0, 0, 0.89444],
      8835: [0.08556, 0.58556, 0, 0, 0.89444],
      8838: [0.19667, 0.69667, 0, 0, 0.89444],
      8839: [0.19667, 0.69667, 0, 0, 0.89444],
      8846: [0, 0.55556, 0, 0, 0.76666],
      8849: [0.19667, 0.69667, 0, 0, 0.89444],
      8850: [0.19667, 0.69667, 0, 0, 0.89444],
      8851: [0, 0.55556, 0, 0, 0.76666],
      8852: [0, 0.55556, 0, 0, 0.76666],
      8853: [0.13333, 0.63333, 0, 0, 0.89444],
      8854: [0.13333, 0.63333, 0, 0, 0.89444],
      8855: [0.13333, 0.63333, 0, 0, 0.89444],
      8856: [0.13333, 0.63333, 0, 0, 0.89444],
      8857: [0.13333, 0.63333, 0, 0, 0.89444],
      8866: [0, 0.69444, 0, 0, 0.70277],
      8867: [0, 0.69444, 0, 0, 0.70277],
      8868: [0, 0.69444, 0, 0, 0.89444],
      8869: [0, 0.69444, 0, 0, 0.89444],
      8900: [-0.02639, 0.47361, 0, 0, 0.575],
      8901: [-0.02639, 0.47361, 0, 0, 0.31944],
      8902: [-0.02778, 0.47222, 0, 0, 0.575],
      8968: [0.25, 0.75, 0, 0, 0.51111],
      8969: [0.25, 0.75, 0, 0, 0.51111],
      8970: [0.25, 0.75, 0, 0, 0.51111],
      8971: [0.25, 0.75, 0, 0, 0.51111],
      8994: [-0.13889, 0.36111, 0, 0, 1.14999],
      8995: [-0.13889, 0.36111, 0, 0, 1.14999],
      9651: [0.19444, 0.69444, 0, 0, 1.02222],
      9657: [-0.02778, 0.47222, 0, 0, 0.575],
      9661: [0.19444, 0.69444, 0, 0, 1.02222],
      9667: [-0.02778, 0.47222, 0, 0, 0.575],
      9711: [0.19444, 0.69444, 0, 0, 1.14999],
      9824: [0.12963, 0.69444, 0, 0, 0.89444],
      9825: [0.12963, 0.69444, 0, 0, 0.89444],
      9826: [0.12963, 0.69444, 0, 0, 0.89444],
      9827: [0.12963, 0.69444, 0, 0, 0.89444],
      9837: [0, 0.75, 0, 0, 0.44722],
      9838: [0.19444, 0.69444, 0, 0, 0.44722],
      9839: [0.19444, 0.69444, 0, 0, 0.44722],
      10216: [0.25, 0.75, 0, 0, 0.44722],
      10217: [0.25, 0.75, 0, 0, 0.44722],
      10815: [0, 0.68611, 0, 0, 0.9],
      10927: [0.19667, 0.69667, 0, 0, 0.89444],
      10928: [0.19667, 0.69667, 0, 0, 0.89444],
      57376: [0.19444, 0.69444, 0, 0, 0],
    },
    "Main-BoldItalic": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0.11417, 0, 0.38611],
      34: [0, 0.69444, 0.07939, 0, 0.62055],
      35: [0.19444, 0.69444, 0.06833, 0, 0.94444],
      37: [0.05556, 0.75, 0.12861, 0, 0.94444],
      38: [0, 0.69444, 0.08528, 0, 0.88555],
      39: [0, 0.69444, 0.12945, 0, 0.35555],
      40: [0.25, 0.75, 0.15806, 0, 0.47333],
      41: [0.25, 0.75, 0.03306, 0, 0.47333],
      42: [0, 0.75, 0.14333, 0, 0.59111],
      43: [0.10333, 0.60333, 0.03306, 0, 0.88555],
      44: [0.19444, 0.14722, 0, 0, 0.35555],
      45: [0, 0.44444, 0.02611, 0, 0.41444],
      46: [0, 0.14722, 0, 0, 0.35555],
      47: [0.25, 0.75, 0.15806, 0, 0.59111],
      48: [0, 0.64444, 0.13167, 0, 0.59111],
      49: [0, 0.64444, 0.13167, 0, 0.59111],
      50: [0, 0.64444, 0.13167, 0, 0.59111],
      51: [0, 0.64444, 0.13167, 0, 0.59111],
      52: [0.19444, 0.64444, 0.13167, 0, 0.59111],
      53: [0, 0.64444, 0.13167, 0, 0.59111],
      54: [0, 0.64444, 0.13167, 0, 0.59111],
      55: [0.19444, 0.64444, 0.13167, 0, 0.59111],
      56: [0, 0.64444, 0.13167, 0, 0.59111],
      57: [0, 0.64444, 0.13167, 0, 0.59111],
      58: [0, 0.44444, 0.06695, 0, 0.35555],
      59: [0.19444, 0.44444, 0.06695, 0, 0.35555],
      61: [-0.10889, 0.39111, 0.06833, 0, 0.88555],
      63: [0, 0.69444, 0.11472, 0, 0.59111],
      64: [0, 0.69444, 0.09208, 0, 0.88555],
      65: [0, 0.68611, 0, 0, 0.86555],
      66: [0, 0.68611, 0.0992, 0, 0.81666],
      67: [0, 0.68611, 0.14208, 0, 0.82666],
      68: [0, 0.68611, 0.09062, 0, 0.87555],
      69: [0, 0.68611, 0.11431, 0, 0.75666],
      70: [0, 0.68611, 0.12903, 0, 0.72722],
      71: [0, 0.68611, 0.07347, 0, 0.89527],
      72: [0, 0.68611, 0.17208, 0, 0.8961],
      73: [0, 0.68611, 0.15681, 0, 0.47166],
      74: [0, 0.68611, 0.145, 0, 0.61055],
      75: [0, 0.68611, 0.14208, 0, 0.89499],
      76: [0, 0.68611, 0, 0, 0.69777],
      77: [0, 0.68611, 0.17208, 0, 1.07277],
      78: [0, 0.68611, 0.17208, 0, 0.8961],
      79: [0, 0.68611, 0.09062, 0, 0.85499],
      80: [0, 0.68611, 0.0992, 0, 0.78721],
      81: [0.19444, 0.68611, 0.09062, 0, 0.85499],
      82: [0, 0.68611, 0.02559, 0, 0.85944],
      83: [0, 0.68611, 0.11264, 0, 0.64999],
      84: [0, 0.68611, 0.12903, 0, 0.7961],
      85: [0, 0.68611, 0.17208, 0, 0.88083],
      86: [0, 0.68611, 0.18625, 0, 0.86555],
      87: [0, 0.68611, 0.18625, 0, 1.15999],
      88: [0, 0.68611, 0.15681, 0, 0.86555],
      89: [0, 0.68611, 0.19803, 0, 0.86555],
      90: [0, 0.68611, 0.14208, 0, 0.70888],
      91: [0.25, 0.75, 0.1875, 0, 0.35611],
      93: [0.25, 0.75, 0.09972, 0, 0.35611],
      94: [0, 0.69444, 0.06709, 0, 0.59111],
      95: [0.31, 0.13444, 0.09811, 0, 0.59111],
      97: [0, 0.44444, 0.09426, 0, 0.59111],
      98: [0, 0.69444, 0.07861, 0, 0.53222],
      99: [0, 0.44444, 0.05222, 0, 0.53222],
      100: [0, 0.69444, 0.10861, 0, 0.59111],
      101: [0, 0.44444, 0.085, 0, 0.53222],
      102: [0.19444, 0.69444, 0.21778, 0, 0.4],
      103: [0.19444, 0.44444, 0.105, 0, 0.53222],
      104: [0, 0.69444, 0.09426, 0, 0.59111],
      105: [0, 0.69326, 0.11387, 0, 0.35555],
      106: [0.19444, 0.69326, 0.1672, 0, 0.35555],
      107: [0, 0.69444, 0.11111, 0, 0.53222],
      108: [0, 0.69444, 0.10861, 0, 0.29666],
      109: [0, 0.44444, 0.09426, 0, 0.94444],
      110: [0, 0.44444, 0.09426, 0, 0.64999],
      111: [0, 0.44444, 0.07861, 0, 0.59111],
      112: [0.19444, 0.44444, 0.07861, 0, 0.59111],
      113: [0.19444, 0.44444, 0.105, 0, 0.53222],
      114: [0, 0.44444, 0.11111, 0, 0.50167],
      115: [0, 0.44444, 0.08167, 0, 0.48694],
      116: [0, 0.63492, 0.09639, 0, 0.385],
      117: [0, 0.44444, 0.09426, 0, 0.62055],
      118: [0, 0.44444, 0.11111, 0, 0.53222],
      119: [0, 0.44444, 0.11111, 0, 0.76777],
      120: [0, 0.44444, 0.12583, 0, 0.56055],
      121: [0.19444, 0.44444, 0.105, 0, 0.56166],
      122: [0, 0.44444, 0.13889, 0, 0.49055],
      126: [0.35, 0.34444, 0.11472, 0, 0.59111],
      160: [0, 0, 0, 0, 0.25],
      168: [0, 0.69444, 0.11473, 0, 0.59111],
      176: [0, 0.69444, 0, 0, 0.94888],
      184: [0.17014, 0, 0, 0, 0.53222],
      198: [0, 0.68611, 0.11431, 0, 1.02277],
      216: [0.04861, 0.73472, 0.09062, 0, 0.88555],
      223: [0.19444, 0.69444, 0.09736, 0, 0.665],
      230: [0, 0.44444, 0.085, 0, 0.82666],
      248: [0.09722, 0.54167, 0.09458, 0, 0.59111],
      305: [0, 0.44444, 0.09426, 0, 0.35555],
      338: [0, 0.68611, 0.11431, 0, 1.14054],
      339: [0, 0.44444, 0.085, 0, 0.82666],
      567: [0.19444, 0.44444, 0.04611, 0, 0.385],
      710: [0, 0.69444, 0.06709, 0, 0.59111],
      711: [0, 0.63194, 0.08271, 0, 0.59111],
      713: [0, 0.59444, 0.10444, 0, 0.59111],
      714: [0, 0.69444, 0.08528, 0, 0.59111],
      715: [0, 0.69444, 0, 0, 0.59111],
      728: [0, 0.69444, 0.10333, 0, 0.59111],
      729: [0, 0.69444, 0.12945, 0, 0.35555],
      730: [0, 0.69444, 0, 0, 0.94888],
      732: [0, 0.69444, 0.11472, 0, 0.59111],
      733: [0, 0.69444, 0.11472, 0, 0.59111],
      915: [0, 0.68611, 0.12903, 0, 0.69777],
      916: [0, 0.68611, 0, 0, 0.94444],
      920: [0, 0.68611, 0.09062, 0, 0.88555],
      923: [0, 0.68611, 0, 0, 0.80666],
      926: [0, 0.68611, 0.15092, 0, 0.76777],
      928: [0, 0.68611, 0.17208, 0, 0.8961],
      931: [0, 0.68611, 0.11431, 0, 0.82666],
      933: [0, 0.68611, 0.10778, 0, 0.88555],
      934: [0, 0.68611, 0.05632, 0, 0.82666],
      936: [0, 0.68611, 0.10778, 0, 0.88555],
      937: [0, 0.68611, 0.0992, 0, 0.82666],
      8211: [0, 0.44444, 0.09811, 0, 0.59111],
      8212: [0, 0.44444, 0.09811, 0, 1.18221],
      8216: [0, 0.69444, 0.12945, 0, 0.35555],
      8217: [0, 0.69444, 0.12945, 0, 0.35555],
      8220: [0, 0.69444, 0.16772, 0, 0.62055],
      8221: [0, 0.69444, 0.07939, 0, 0.62055],
    },
    "Main-Italic": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0.12417, 0, 0.30667],
      34: [0, 0.69444, 0.06961, 0, 0.51444],
      35: [0.19444, 0.69444, 0.06616, 0, 0.81777],
      37: [0.05556, 0.75, 0.13639, 0, 0.81777],
      38: [0, 0.69444, 0.09694, 0, 0.76666],
      39: [0, 0.69444, 0.12417, 0, 0.30667],
      40: [0.25, 0.75, 0.16194, 0, 0.40889],
      41: [0.25, 0.75, 0.03694, 0, 0.40889],
      42: [0, 0.75, 0.14917, 0, 0.51111],
      43: [0.05667, 0.56167, 0.03694, 0, 0.76666],
      44: [0.19444, 0.10556, 0, 0, 0.30667],
      45: [0, 0.43056, 0.02826, 0, 0.35778],
      46: [0, 0.10556, 0, 0, 0.30667],
      47: [0.25, 0.75, 0.16194, 0, 0.51111],
      48: [0, 0.64444, 0.13556, 0, 0.51111],
      49: [0, 0.64444, 0.13556, 0, 0.51111],
      50: [0, 0.64444, 0.13556, 0, 0.51111],
      51: [0, 0.64444, 0.13556, 0, 0.51111],
      52: [0.19444, 0.64444, 0.13556, 0, 0.51111],
      53: [0, 0.64444, 0.13556, 0, 0.51111],
      54: [0, 0.64444, 0.13556, 0, 0.51111],
      55: [0.19444, 0.64444, 0.13556, 0, 0.51111],
      56: [0, 0.64444, 0.13556, 0, 0.51111],
      57: [0, 0.64444, 0.13556, 0, 0.51111],
      58: [0, 0.43056, 0.0582, 0, 0.30667],
      59: [0.19444, 0.43056, 0.0582, 0, 0.30667],
      61: [-0.13313, 0.36687, 0.06616, 0, 0.76666],
      63: [0, 0.69444, 0.1225, 0, 0.51111],
      64: [0, 0.69444, 0.09597, 0, 0.76666],
      65: [0, 0.68333, 0, 0, 0.74333],
      66: [0, 0.68333, 0.10257, 0, 0.70389],
      67: [0, 0.68333, 0.14528, 0, 0.71555],
      68: [0, 0.68333, 0.09403, 0, 0.755],
      69: [0, 0.68333, 0.12028, 0, 0.67833],
      70: [0, 0.68333, 0.13305, 0, 0.65277],
      71: [0, 0.68333, 0.08722, 0, 0.77361],
      72: [0, 0.68333, 0.16389, 0, 0.74333],
      73: [0, 0.68333, 0.15806, 0, 0.38555],
      74: [0, 0.68333, 0.14028, 0, 0.525],
      75: [0, 0.68333, 0.14528, 0, 0.76888],
      76: [0, 0.68333, 0, 0, 0.62722],
      77: [0, 0.68333, 0.16389, 0, 0.89666],
      78: [0, 0.68333, 0.16389, 0, 0.74333],
      79: [0, 0.68333, 0.09403, 0, 0.76666],
      80: [0, 0.68333, 0.10257, 0, 0.67833],
      81: [0.19444, 0.68333, 0.09403, 0, 0.76666],
      82: [0, 0.68333, 0.03868, 0, 0.72944],
      83: [0, 0.68333, 0.11972, 0, 0.56222],
      84: [0, 0.68333, 0.13305, 0, 0.71555],
      85: [0, 0.68333, 0.16389, 0, 0.74333],
      86: [0, 0.68333, 0.18361, 0, 0.74333],
      87: [0, 0.68333, 0.18361, 0, 0.99888],
      88: [0, 0.68333, 0.15806, 0, 0.74333],
      89: [0, 0.68333, 0.19383, 0, 0.74333],
      90: [0, 0.68333, 0.14528, 0, 0.61333],
      91: [0.25, 0.75, 0.1875, 0, 0.30667],
      93: [0.25, 0.75, 0.10528, 0, 0.30667],
      94: [0, 0.69444, 0.06646, 0, 0.51111],
      95: [0.31, 0.12056, 0.09208, 0, 0.51111],
      97: [0, 0.43056, 0.07671, 0, 0.51111],
      98: [0, 0.69444, 0.06312, 0, 0.46],
      99: [0, 0.43056, 0.05653, 0, 0.46],
      100: [0, 0.69444, 0.10333, 0, 0.51111],
      101: [0, 0.43056, 0.07514, 0, 0.46],
      102: [0.19444, 0.69444, 0.21194, 0, 0.30667],
      103: [0.19444, 0.43056, 0.08847, 0, 0.46],
      104: [0, 0.69444, 0.07671, 0, 0.51111],
      105: [0, 0.65536, 0.1019, 0, 0.30667],
      106: [0.19444, 0.65536, 0.14467, 0, 0.30667],
      107: [0, 0.69444, 0.10764, 0, 0.46],
      108: [0, 0.69444, 0.10333, 0, 0.25555],
      109: [0, 0.43056, 0.07671, 0, 0.81777],
      110: [0, 0.43056, 0.07671, 0, 0.56222],
      111: [0, 0.43056, 0.06312, 0, 0.51111],
      112: [0.19444, 0.43056, 0.06312, 0, 0.51111],
      113: [0.19444, 0.43056, 0.08847, 0, 0.46],
      114: [0, 0.43056, 0.10764, 0, 0.42166],
      115: [0, 0.43056, 0.08208, 0, 0.40889],
      116: [0, 0.61508, 0.09486, 0, 0.33222],
      117: [0, 0.43056, 0.07671, 0, 0.53666],
      118: [0, 0.43056, 0.10764, 0, 0.46],
      119: [0, 0.43056, 0.10764, 0, 0.66444],
      120: [0, 0.43056, 0.12042, 0, 0.46389],
      121: [0.19444, 0.43056, 0.08847, 0, 0.48555],
      122: [0, 0.43056, 0.12292, 0, 0.40889],
      126: [0.35, 0.31786, 0.11585, 0, 0.51111],
      160: [0, 0, 0, 0, 0.25],
      168: [0, 0.66786, 0.10474, 0, 0.51111],
      176: [0, 0.69444, 0, 0, 0.83129],
      184: [0.17014, 0, 0, 0, 0.46],
      198: [0, 0.68333, 0.12028, 0, 0.88277],
      216: [0.04861, 0.73194, 0.09403, 0, 0.76666],
      223: [0.19444, 0.69444, 0.10514, 0, 0.53666],
      230: [0, 0.43056, 0.07514, 0, 0.71555],
      248: [0.09722, 0.52778, 0.09194, 0, 0.51111],
      338: [0, 0.68333, 0.12028, 0, 0.98499],
      339: [0, 0.43056, 0.07514, 0, 0.71555],
      710: [0, 0.69444, 0.06646, 0, 0.51111],
      711: [0, 0.62847, 0.08295, 0, 0.51111],
      713: [0, 0.56167, 0.10333, 0, 0.51111],
      714: [0, 0.69444, 0.09694, 0, 0.51111],
      715: [0, 0.69444, 0, 0, 0.51111],
      728: [0, 0.69444, 0.10806, 0, 0.51111],
      729: [0, 0.66786, 0.11752, 0, 0.30667],
      730: [0, 0.69444, 0, 0, 0.83129],
      732: [0, 0.66786, 0.11585, 0, 0.51111],
      733: [0, 0.69444, 0.1225, 0, 0.51111],
      915: [0, 0.68333, 0.13305, 0, 0.62722],
      916: [0, 0.68333, 0, 0, 0.81777],
      920: [0, 0.68333, 0.09403, 0, 0.76666],
      923: [0, 0.68333, 0, 0, 0.69222],
      926: [0, 0.68333, 0.15294, 0, 0.66444],
      928: [0, 0.68333, 0.16389, 0, 0.74333],
      931: [0, 0.68333, 0.12028, 0, 0.71555],
      933: [0, 0.68333, 0.11111, 0, 0.76666],
      934: [0, 0.68333, 0.05986, 0, 0.71555],
      936: [0, 0.68333, 0.11111, 0, 0.76666],
      937: [0, 0.68333, 0.10257, 0, 0.71555],
      8211: [0, 0.43056, 0.09208, 0, 0.51111],
      8212: [0, 0.43056, 0.09208, 0, 1.02222],
      8216: [0, 0.69444, 0.12417, 0, 0.30667],
      8217: [0, 0.69444, 0.12417, 0, 0.30667],
      8220: [0, 0.69444, 0.1685, 0, 0.51444],
      8221: [0, 0.69444, 0.06961, 0, 0.51444],
      8463: [0, 0.68889, 0, 0, 0.54028],
    },
    "Main-Regular": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0, 0, 0.27778],
      34: [0, 0.69444, 0, 0, 0.5],
      35: [0.19444, 0.69444, 0, 0, 0.83334],
      36: [0.05556, 0.75, 0, 0, 0.5],
      37: [0.05556, 0.75, 0, 0, 0.83334],
      38: [0, 0.69444, 0, 0, 0.77778],
      39: [0, 0.69444, 0, 0, 0.27778],
      40: [0.25, 0.75, 0, 0, 0.38889],
      41: [0.25, 0.75, 0, 0, 0.38889],
      42: [0, 0.75, 0, 0, 0.5],
      43: [0.08333, 0.58333, 0, 0, 0.77778],
      44: [0.19444, 0.10556, 0, 0, 0.27778],
      45: [0, 0.43056, 0, 0, 0.33333],
      46: [0, 0.10556, 0, 0, 0.27778],
      47: [0.25, 0.75, 0, 0, 0.5],
      48: [0, 0.64444, 0, 0, 0.5],
      49: [0, 0.64444, 0, 0, 0.5],
      50: [0, 0.64444, 0, 0, 0.5],
      51: [0, 0.64444, 0, 0, 0.5],
      52: [0, 0.64444, 0, 0, 0.5],
      53: [0, 0.64444, 0, 0, 0.5],
      54: [0, 0.64444, 0, 0, 0.5],
      55: [0, 0.64444, 0, 0, 0.5],
      56: [0, 0.64444, 0, 0, 0.5],
      57: [0, 0.64444, 0, 0, 0.5],
      58: [0, 0.43056, 0, 0, 0.27778],
      59: [0.19444, 0.43056, 0, 0, 0.27778],
      60: [0.0391, 0.5391, 0, 0, 0.77778],
      61: [-0.13313, 0.36687, 0, 0, 0.77778],
      62: [0.0391, 0.5391, 0, 0, 0.77778],
      63: [0, 0.69444, 0, 0, 0.47222],
      64: [0, 0.69444, 0, 0, 0.77778],
      65: [0, 0.68333, 0, 0, 0.75],
      66: [0, 0.68333, 0, 0, 0.70834],
      67: [0, 0.68333, 0, 0, 0.72222],
      68: [0, 0.68333, 0, 0, 0.76389],
      69: [0, 0.68333, 0, 0, 0.68056],
      70: [0, 0.68333, 0, 0, 0.65278],
      71: [0, 0.68333, 0, 0, 0.78472],
      72: [0, 0.68333, 0, 0, 0.75],
      73: [0, 0.68333, 0, 0, 0.36111],
      74: [0, 0.68333, 0, 0, 0.51389],
      75: [0, 0.68333, 0, 0, 0.77778],
      76: [0, 0.68333, 0, 0, 0.625],
      77: [0, 0.68333, 0, 0, 0.91667],
      78: [0, 0.68333, 0, 0, 0.75],
      79: [0, 0.68333, 0, 0, 0.77778],
      80: [0, 0.68333, 0, 0, 0.68056],
      81: [0.19444, 0.68333, 0, 0, 0.77778],
      82: [0, 0.68333, 0, 0, 0.73611],
      83: [0, 0.68333, 0, 0, 0.55556],
      84: [0, 0.68333, 0, 0, 0.72222],
      85: [0, 0.68333, 0, 0, 0.75],
      86: [0, 0.68333, 0.01389, 0, 0.75],
      87: [0, 0.68333, 0.01389, 0, 1.02778],
      88: [0, 0.68333, 0, 0, 0.75],
      89: [0, 0.68333, 0.025, 0, 0.75],
      90: [0, 0.68333, 0, 0, 0.61111],
      91: [0.25, 0.75, 0, 0, 0.27778],
      92: [0.25, 0.75, 0, 0, 0.5],
      93: [0.25, 0.75, 0, 0, 0.27778],
      94: [0, 0.69444, 0, 0, 0.5],
      95: [0.31, 0.12056, 0.02778, 0, 0.5],
      97: [0, 0.43056, 0, 0, 0.5],
      98: [0, 0.69444, 0, 0, 0.55556],
      99: [0, 0.43056, 0, 0, 0.44445],
      100: [0, 0.69444, 0, 0, 0.55556],
      101: [0, 0.43056, 0, 0, 0.44445],
      102: [0, 0.69444, 0.07778, 0, 0.30556],
      103: [0.19444, 0.43056, 0.01389, 0, 0.5],
      104: [0, 0.69444, 0, 0, 0.55556],
      105: [0, 0.66786, 0, 0, 0.27778],
      106: [0.19444, 0.66786, 0, 0, 0.30556],
      107: [0, 0.69444, 0, 0, 0.52778],
      108: [0, 0.69444, 0, 0, 0.27778],
      109: [0, 0.43056, 0, 0, 0.83334],
      110: [0, 0.43056, 0, 0, 0.55556],
      111: [0, 0.43056, 0, 0, 0.5],
      112: [0.19444, 0.43056, 0, 0, 0.55556],
      113: [0.19444, 0.43056, 0, 0, 0.52778],
      114: [0, 0.43056, 0, 0, 0.39167],
      115: [0, 0.43056, 0, 0, 0.39445],
      116: [0, 0.61508, 0, 0, 0.38889],
      117: [0, 0.43056, 0, 0, 0.55556],
      118: [0, 0.43056, 0.01389, 0, 0.52778],
      119: [0, 0.43056, 0.01389, 0, 0.72222],
      120: [0, 0.43056, 0, 0, 0.52778],
      121: [0.19444, 0.43056, 0.01389, 0, 0.52778],
      122: [0, 0.43056, 0, 0, 0.44445],
      123: [0.25, 0.75, 0, 0, 0.5],
      124: [0.25, 0.75, 0, 0, 0.27778],
      125: [0.25, 0.75, 0, 0, 0.5],
      126: [0.35, 0.31786, 0, 0, 0.5],
      160: [0, 0, 0, 0, 0.25],
      163: [0, 0.69444, 0, 0, 0.76909],
      167: [0.19444, 0.69444, 0, 0, 0.44445],
      168: [0, 0.66786, 0, 0, 0.5],
      172: [0, 0.43056, 0, 0, 0.66667],
      176: [0, 0.69444, 0, 0, 0.75],
      177: [0.08333, 0.58333, 0, 0, 0.77778],
      182: [0.19444, 0.69444, 0, 0, 0.61111],
      184: [0.17014, 0, 0, 0, 0.44445],
      198: [0, 0.68333, 0, 0, 0.90278],
      215: [0.08333, 0.58333, 0, 0, 0.77778],
      216: [0.04861, 0.73194, 0, 0, 0.77778],
      223: [0, 0.69444, 0, 0, 0.5],
      230: [0, 0.43056, 0, 0, 0.72222],
      247: [0.08333, 0.58333, 0, 0, 0.77778],
      248: [0.09722, 0.52778, 0, 0, 0.5],
      305: [0, 0.43056, 0, 0, 0.27778],
      338: [0, 0.68333, 0, 0, 1.01389],
      339: [0, 0.43056, 0, 0, 0.77778],
      567: [0.19444, 0.43056, 0, 0, 0.30556],
      710: [0, 0.69444, 0, 0, 0.5],
      711: [0, 0.62847, 0, 0, 0.5],
      713: [0, 0.56778, 0, 0, 0.5],
      714: [0, 0.69444, 0, 0, 0.5],
      715: [0, 0.69444, 0, 0, 0.5],
      728: [0, 0.69444, 0, 0, 0.5],
      729: [0, 0.66786, 0, 0, 0.27778],
      730: [0, 0.69444, 0, 0, 0.75],
      732: [0, 0.66786, 0, 0, 0.5],
      733: [0, 0.69444, 0, 0, 0.5],
      915: [0, 0.68333, 0, 0, 0.625],
      916: [0, 0.68333, 0, 0, 0.83334],
      920: [0, 0.68333, 0, 0, 0.77778],
      923: [0, 0.68333, 0, 0, 0.69445],
      926: [0, 0.68333, 0, 0, 0.66667],
      928: [0, 0.68333, 0, 0, 0.75],
      931: [0, 0.68333, 0, 0, 0.72222],
      933: [0, 0.68333, 0, 0, 0.77778],
      934: [0, 0.68333, 0, 0, 0.72222],
      936: [0, 0.68333, 0, 0, 0.77778],
      937: [0, 0.68333, 0, 0, 0.72222],
      8211: [0, 0.43056, 0.02778, 0, 0.5],
      8212: [0, 0.43056, 0.02778, 0, 1],
      8216: [0, 0.69444, 0, 0, 0.27778],
      8217: [0, 0.69444, 0, 0, 0.27778],
      8220: [0, 0.69444, 0, 0, 0.5],
      8221: [0, 0.69444, 0, 0, 0.5],
      8224: [0.19444, 0.69444, 0, 0, 0.44445],
      8225: [0.19444, 0.69444, 0, 0, 0.44445],
      8230: [0, 0.123, 0, 0, 1.172],
      8242: [0, 0.55556, 0, 0, 0.275],
      8407: [0, 0.71444, 0.15382, 0, 0.5],
      8463: [0, 0.68889, 0, 0, 0.54028],
      8465: [0, 0.69444, 0, 0, 0.72222],
      8467: [0, 0.69444, 0, 0.11111, 0.41667],
      8472: [0.19444, 0.43056, 0, 0.11111, 0.63646],
      8476: [0, 0.69444, 0, 0, 0.72222],
      8501: [0, 0.69444, 0, 0, 0.61111],
      8592: [-0.13313, 0.36687, 0, 0, 1],
      8593: [0.19444, 0.69444, 0, 0, 0.5],
      8594: [-0.13313, 0.36687, 0, 0, 1],
      8595: [0.19444, 0.69444, 0, 0, 0.5],
      8596: [-0.13313, 0.36687, 0, 0, 1],
      8597: [0.25, 0.75, 0, 0, 0.5],
      8598: [0.19444, 0.69444, 0, 0, 1],
      8599: [0.19444, 0.69444, 0, 0, 1],
      8600: [0.19444, 0.69444, 0, 0, 1],
      8601: [0.19444, 0.69444, 0, 0, 1],
      8614: [0.011, 0.511, 0, 0, 1],
      8617: [0.011, 0.511, 0, 0, 1.126],
      8618: [0.011, 0.511, 0, 0, 1.126],
      8636: [-0.13313, 0.36687, 0, 0, 1],
      8637: [-0.13313, 0.36687, 0, 0, 1],
      8640: [-0.13313, 0.36687, 0, 0, 1],
      8641: [-0.13313, 0.36687, 0, 0, 1],
      8652: [0.011, 0.671, 0, 0, 1],
      8656: [-0.13313, 0.36687, 0, 0, 1],
      8657: [0.19444, 0.69444, 0, 0, 0.61111],
      8658: [-0.13313, 0.36687, 0, 0, 1],
      8659: [0.19444, 0.69444, 0, 0, 0.61111],
      8660: [-0.13313, 0.36687, 0, 0, 1],
      8661: [0.25, 0.75, 0, 0, 0.61111],
      8704: [0, 0.69444, 0, 0, 0.55556],
      8706: [0, 0.69444, 0.05556, 0.08334, 0.5309],
      8707: [0, 0.69444, 0, 0, 0.55556],
      8709: [0.05556, 0.75, 0, 0, 0.5],
      8711: [0, 0.68333, 0, 0, 0.83334],
      8712: [0.0391, 0.5391, 0, 0, 0.66667],
      8715: [0.0391, 0.5391, 0, 0, 0.66667],
      8722: [0.08333, 0.58333, 0, 0, 0.77778],
      8723: [0.08333, 0.58333, 0, 0, 0.77778],
      8725: [0.25, 0.75, 0, 0, 0.5],
      8726: [0.25, 0.75, 0, 0, 0.5],
      8727: [-0.03472, 0.46528, 0, 0, 0.5],
      8728: [-0.05555, 0.44445, 0, 0, 0.5],
      8729: [-0.05555, 0.44445, 0, 0, 0.5],
      8730: [0.2, 0.8, 0, 0, 0.83334],
      8733: [0, 0.43056, 0, 0, 0.77778],
      8734: [0, 0.43056, 0, 0, 1],
      8736: [0, 0.69224, 0, 0, 0.72222],
      8739: [0.25, 0.75, 0, 0, 0.27778],
      8741: [0.25, 0.75, 0, 0, 0.5],
      8743: [0, 0.55556, 0, 0, 0.66667],
      8744: [0, 0.55556, 0, 0, 0.66667],
      8745: [0, 0.55556, 0, 0, 0.66667],
      8746: [0, 0.55556, 0, 0, 0.66667],
      8747: [0.19444, 0.69444, 0.11111, 0, 0.41667],
      8764: [-0.13313, 0.36687, 0, 0, 0.77778],
      8768: [0.19444, 0.69444, 0, 0, 0.27778],
      8771: [-0.03625, 0.46375, 0, 0, 0.77778],
      8773: [-0.022, 0.589, 0, 0, 0.778],
      8776: [-0.01688, 0.48312, 0, 0, 0.77778],
      8781: [-0.03625, 0.46375, 0, 0, 0.77778],
      8784: [-0.133, 0.673, 0, 0, 0.778],
      8801: [-0.03625, 0.46375, 0, 0, 0.77778],
      8804: [0.13597, 0.63597, 0, 0, 0.77778],
      8805: [0.13597, 0.63597, 0, 0, 0.77778],
      8810: [0.0391, 0.5391, 0, 0, 1],
      8811: [0.0391, 0.5391, 0, 0, 1],
      8826: [0.0391, 0.5391, 0, 0, 0.77778],
      8827: [0.0391, 0.5391, 0, 0, 0.77778],
      8834: [0.0391, 0.5391, 0, 0, 0.77778],
      8835: [0.0391, 0.5391, 0, 0, 0.77778],
      8838: [0.13597, 0.63597, 0, 0, 0.77778],
      8839: [0.13597, 0.63597, 0, 0, 0.77778],
      8846: [0, 0.55556, 0, 0, 0.66667],
      8849: [0.13597, 0.63597, 0, 0, 0.77778],
      8850: [0.13597, 0.63597, 0, 0, 0.77778],
      8851: [0, 0.55556, 0, 0, 0.66667],
      8852: [0, 0.55556, 0, 0, 0.66667],
      8853: [0.08333, 0.58333, 0, 0, 0.77778],
      8854: [0.08333, 0.58333, 0, 0, 0.77778],
      8855: [0.08333, 0.58333, 0, 0, 0.77778],
      8856: [0.08333, 0.58333, 0, 0, 0.77778],
      8857: [0.08333, 0.58333, 0, 0, 0.77778],
      8866: [0, 0.69444, 0, 0, 0.61111],
      8867: [0, 0.69444, 0, 0, 0.61111],
      8868: [0, 0.69444, 0, 0, 0.77778],
      8869: [0, 0.69444, 0, 0, 0.77778],
      8872: [0.249, 0.75, 0, 0, 0.867],
      8900: [-0.05555, 0.44445, 0, 0, 0.5],
      8901: [-0.05555, 0.44445, 0, 0, 0.27778],
      8902: [-0.03472, 0.46528, 0, 0, 0.5],
      8904: [0.005, 0.505, 0, 0, 0.9],
      8942: [0.03, 0.903, 0, 0, 0.278],
      8943: [-0.19, 0.313, 0, 0, 1.172],
      8945: [-0.1, 0.823, 0, 0, 1.282],
      8968: [0.25, 0.75, 0, 0, 0.44445],
      8969: [0.25, 0.75, 0, 0, 0.44445],
      8970: [0.25, 0.75, 0, 0, 0.44445],
      8971: [0.25, 0.75, 0, 0, 0.44445],
      8994: [-0.14236, 0.35764, 0, 0, 1],
      8995: [-0.14236, 0.35764, 0, 0, 1],
      9136: [0.244, 0.744, 0, 0, 0.412],
      9137: [0.244, 0.745, 0, 0, 0.412],
      9651: [0.19444, 0.69444, 0, 0, 0.88889],
      9657: [-0.03472, 0.46528, 0, 0, 0.5],
      9661: [0.19444, 0.69444, 0, 0, 0.88889],
      9667: [-0.03472, 0.46528, 0, 0, 0.5],
      9711: [0.19444, 0.69444, 0, 0, 1],
      9824: [0.12963, 0.69444, 0, 0, 0.77778],
      9825: [0.12963, 0.69444, 0, 0, 0.77778],
      9826: [0.12963, 0.69444, 0, 0, 0.77778],
      9827: [0.12963, 0.69444, 0, 0, 0.77778],
      9837: [0, 0.75, 0, 0, 0.38889],
      9838: [0.19444, 0.69444, 0, 0, 0.38889],
      9839: [0.19444, 0.69444, 0, 0, 0.38889],
      10216: [0.25, 0.75, 0, 0, 0.38889],
      10217: [0.25, 0.75, 0, 0, 0.38889],
      10222: [0.244, 0.744, 0, 0, 0.412],
      10223: [0.244, 0.745, 0, 0, 0.412],
      10229: [0.011, 0.511, 0, 0, 1.609],
      10230: [0.011, 0.511, 0, 0, 1.638],
      10231: [0.011, 0.511, 0, 0, 1.859],
      10232: [0.024, 0.525, 0, 0, 1.609],
      10233: [0.024, 0.525, 0, 0, 1.638],
      10234: [0.024, 0.525, 0, 0, 1.858],
      10236: [0.011, 0.511, 0, 0, 1.638],
      10815: [0, 0.68333, 0, 0, 0.75],
      10927: [0.13597, 0.63597, 0, 0, 0.77778],
      10928: [0.13597, 0.63597, 0, 0, 0.77778],
      57376: [0.19444, 0.69444, 0, 0, 0],
    },
    "Math-BoldItalic": {
      32: [0, 0, 0, 0, 0.25],
      48: [0, 0.44444, 0, 0, 0.575],
      49: [0, 0.44444, 0, 0, 0.575],
      50: [0, 0.44444, 0, 0, 0.575],
      51: [0.19444, 0.44444, 0, 0, 0.575],
      52: [0.19444, 0.44444, 0, 0, 0.575],
      53: [0.19444, 0.44444, 0, 0, 0.575],
      54: [0, 0.64444, 0, 0, 0.575],
      55: [0.19444, 0.44444, 0, 0, 0.575],
      56: [0, 0.64444, 0, 0, 0.575],
      57: [0.19444, 0.44444, 0, 0, 0.575],
      65: [0, 0.68611, 0, 0, 0.86944],
      66: [0, 0.68611, 0.04835, 0, 0.8664],
      67: [0, 0.68611, 0.06979, 0, 0.81694],
      68: [0, 0.68611, 0.03194, 0, 0.93812],
      69: [0, 0.68611, 0.05451, 0, 0.81007],
      70: [0, 0.68611, 0.15972, 0, 0.68889],
      71: [0, 0.68611, 0, 0, 0.88673],
      72: [0, 0.68611, 0.08229, 0, 0.98229],
      73: [0, 0.68611, 0.07778, 0, 0.51111],
      74: [0, 0.68611, 0.10069, 0, 0.63125],
      75: [0, 0.68611, 0.06979, 0, 0.97118],
      76: [0, 0.68611, 0, 0, 0.75555],
      77: [0, 0.68611, 0.11424, 0, 1.14201],
      78: [0, 0.68611, 0.11424, 0, 0.95034],
      79: [0, 0.68611, 0.03194, 0, 0.83666],
      80: [0, 0.68611, 0.15972, 0, 0.72309],
      81: [0.19444, 0.68611, 0, 0, 0.86861],
      82: [0, 0.68611, 0.00421, 0, 0.87235],
      83: [0, 0.68611, 0.05382, 0, 0.69271],
      84: [0, 0.68611, 0.15972, 0, 0.63663],
      85: [0, 0.68611, 0.11424, 0, 0.80027],
      86: [0, 0.68611, 0.25555, 0, 0.67778],
      87: [0, 0.68611, 0.15972, 0, 1.09305],
      88: [0, 0.68611, 0.07778, 0, 0.94722],
      89: [0, 0.68611, 0.25555, 0, 0.67458],
      90: [0, 0.68611, 0.06979, 0, 0.77257],
      97: [0, 0.44444, 0, 0, 0.63287],
      98: [0, 0.69444, 0, 0, 0.52083],
      99: [0, 0.44444, 0, 0, 0.51342],
      100: [0, 0.69444, 0, 0, 0.60972],
      101: [0, 0.44444, 0, 0, 0.55361],
      102: [0.19444, 0.69444, 0.11042, 0, 0.56806],
      103: [0.19444, 0.44444, 0.03704, 0, 0.5449],
      104: [0, 0.69444, 0, 0, 0.66759],
      105: [0, 0.69326, 0, 0, 0.4048],
      106: [0.19444, 0.69326, 0.0622, 0, 0.47083],
      107: [0, 0.69444, 0.01852, 0, 0.6037],
      108: [0, 0.69444, 0.0088, 0, 0.34815],
      109: [0, 0.44444, 0, 0, 1.0324],
      110: [0, 0.44444, 0, 0, 0.71296],
      111: [0, 0.44444, 0, 0, 0.58472],
      112: [0.19444, 0.44444, 0, 0, 0.60092],
      113: [0.19444, 0.44444, 0.03704, 0, 0.54213],
      114: [0, 0.44444, 0.03194, 0, 0.5287],
      115: [0, 0.44444, 0, 0, 0.53125],
      116: [0, 0.63492, 0, 0, 0.41528],
      117: [0, 0.44444, 0, 0, 0.68102],
      118: [0, 0.44444, 0.03704, 0, 0.56666],
      119: [0, 0.44444, 0.02778, 0, 0.83148],
      120: [0, 0.44444, 0, 0, 0.65903],
      121: [0.19444, 0.44444, 0.03704, 0, 0.59028],
      122: [0, 0.44444, 0.04213, 0, 0.55509],
      160: [0, 0, 0, 0, 0.25],
      915: [0, 0.68611, 0.15972, 0, 0.65694],
      916: [0, 0.68611, 0, 0, 0.95833],
      920: [0, 0.68611, 0.03194, 0, 0.86722],
      923: [0, 0.68611, 0, 0, 0.80555],
      926: [0, 0.68611, 0.07458, 0, 0.84125],
      928: [0, 0.68611, 0.08229, 0, 0.98229],
      931: [0, 0.68611, 0.05451, 0, 0.88507],
      933: [0, 0.68611, 0.15972, 0, 0.67083],
      934: [0, 0.68611, 0, 0, 0.76666],
      936: [0, 0.68611, 0.11653, 0, 0.71402],
      937: [0, 0.68611, 0.04835, 0, 0.8789],
      945: [0, 0.44444, 0, 0, 0.76064],
      946: [0.19444, 0.69444, 0.03403, 0, 0.65972],
      947: [0.19444, 0.44444, 0.06389, 0, 0.59003],
      948: [0, 0.69444, 0.03819, 0, 0.52222],
      949: [0, 0.44444, 0, 0, 0.52882],
      950: [0.19444, 0.69444, 0.06215, 0, 0.50833],
      951: [0.19444, 0.44444, 0.03704, 0, 0.6],
      952: [0, 0.69444, 0.03194, 0, 0.5618],
      953: [0, 0.44444, 0, 0, 0.41204],
      954: [0, 0.44444, 0, 0, 0.66759],
      955: [0, 0.69444, 0, 0, 0.67083],
      956: [0.19444, 0.44444, 0, 0, 0.70787],
      957: [0, 0.44444, 0.06898, 0, 0.57685],
      958: [0.19444, 0.69444, 0.03021, 0, 0.50833],
      959: [0, 0.44444, 0, 0, 0.58472],
      960: [0, 0.44444, 0.03704, 0, 0.68241],
      961: [0.19444, 0.44444, 0, 0, 0.6118],
      962: [0.09722, 0.44444, 0.07917, 0, 0.42361],
      963: [0, 0.44444, 0.03704, 0, 0.68588],
      964: [0, 0.44444, 0.13472, 0, 0.52083],
      965: [0, 0.44444, 0.03704, 0, 0.63055],
      966: [0.19444, 0.44444, 0, 0, 0.74722],
      967: [0.19444, 0.44444, 0, 0, 0.71805],
      968: [0.19444, 0.69444, 0.03704, 0, 0.75833],
      969: [0, 0.44444, 0.03704, 0, 0.71782],
      977: [0, 0.69444, 0, 0, 0.69155],
      981: [0.19444, 0.69444, 0, 0, 0.7125],
      982: [0, 0.44444, 0.03194, 0, 0.975],
      1009: [0.19444, 0.44444, 0, 0, 0.6118],
      1013: [0, 0.44444, 0, 0, 0.48333],
      57649: [0, 0.44444, 0, 0, 0.39352],
      57911: [0.19444, 0.44444, 0, 0, 0.43889],
    },
    "Math-Italic": {
      32: [0, 0, 0, 0, 0.25],
      48: [0, 0.43056, 0, 0, 0.5],
      49: [0, 0.43056, 0, 0, 0.5],
      50: [0, 0.43056, 0, 0, 0.5],
      51: [0.19444, 0.43056, 0, 0, 0.5],
      52: [0.19444, 0.43056, 0, 0, 0.5],
      53: [0.19444, 0.43056, 0, 0, 0.5],
      54: [0, 0.64444, 0, 0, 0.5],
      55: [0.19444, 0.43056, 0, 0, 0.5],
      56: [0, 0.64444, 0, 0, 0.5],
      57: [0.19444, 0.43056, 0, 0, 0.5],
      65: [0, 0.68333, 0, 0.13889, 0.75],
      66: [0, 0.68333, 0.05017, 0.08334, 0.75851],
      67: [0, 0.68333, 0.07153, 0.08334, 0.71472],
      68: [0, 0.68333, 0.02778, 0.05556, 0.82792],
      69: [0, 0.68333, 0.05764, 0.08334, 0.7382],
      70: [0, 0.68333, 0.13889, 0.08334, 0.64306],
      71: [0, 0.68333, 0, 0.08334, 0.78625],
      72: [0, 0.68333, 0.08125, 0.05556, 0.83125],
      73: [0, 0.68333, 0.07847, 0.11111, 0.43958],
      74: [0, 0.68333, 0.09618, 0.16667, 0.55451],
      75: [0, 0.68333, 0.07153, 0.05556, 0.84931],
      76: [0, 0.68333, 0, 0.02778, 0.68056],
      77: [0, 0.68333, 0.10903, 0.08334, 0.97014],
      78: [0, 0.68333, 0.10903, 0.08334, 0.80347],
      79: [0, 0.68333, 0.02778, 0.08334, 0.76278],
      80: [0, 0.68333, 0.13889, 0.08334, 0.64201],
      81: [0.19444, 0.68333, 0, 0.08334, 0.79056],
      82: [0, 0.68333, 0.00773, 0.08334, 0.75929],
      83: [0, 0.68333, 0.05764, 0.08334, 0.6132],
      84: [0, 0.68333, 0.13889, 0.08334, 0.58438],
      85: [0, 0.68333, 0.10903, 0.02778, 0.68278],
      86: [0, 0.68333, 0.22222, 0, 0.58333],
      87: [0, 0.68333, 0.13889, 0, 0.94445],
      88: [0, 0.68333, 0.07847, 0.08334, 0.82847],
      89: [0, 0.68333, 0.22222, 0, 0.58056],
      90: [0, 0.68333, 0.07153, 0.08334, 0.68264],
      97: [0, 0.43056, 0, 0, 0.52859],
      98: [0, 0.69444, 0, 0, 0.42917],
      99: [0, 0.43056, 0, 0.05556, 0.43276],
      100: [0, 0.69444, 0, 0.16667, 0.52049],
      101: [0, 0.43056, 0, 0.05556, 0.46563],
      102: [0.19444, 0.69444, 0.10764, 0.16667, 0.48959],
      103: [0.19444, 0.43056, 0.03588, 0.02778, 0.47697],
      104: [0, 0.69444, 0, 0, 0.57616],
      105: [0, 0.65952, 0, 0, 0.34451],
      106: [0.19444, 0.65952, 0.05724, 0, 0.41181],
      107: [0, 0.69444, 0.03148, 0, 0.5206],
      108: [0, 0.69444, 0.01968, 0.08334, 0.29838],
      109: [0, 0.43056, 0, 0, 0.87801],
      110: [0, 0.43056, 0, 0, 0.60023],
      111: [0, 0.43056, 0, 0.05556, 0.48472],
      112: [0.19444, 0.43056, 0, 0.08334, 0.50313],
      113: [0.19444, 0.43056, 0.03588, 0.08334, 0.44641],
      114: [0, 0.43056, 0.02778, 0.05556, 0.45116],
      115: [0, 0.43056, 0, 0.05556, 0.46875],
      116: [0, 0.61508, 0, 0.08334, 0.36111],
      117: [0, 0.43056, 0, 0.02778, 0.57246],
      118: [0, 0.43056, 0.03588, 0.02778, 0.48472],
      119: [0, 0.43056, 0.02691, 0.08334, 0.71592],
      120: [0, 0.43056, 0, 0.02778, 0.57153],
      121: [0.19444, 0.43056, 0.03588, 0.05556, 0.49028],
      122: [0, 0.43056, 0.04398, 0.05556, 0.46505],
      160: [0, 0, 0, 0, 0.25],
      915: [0, 0.68333, 0.13889, 0.08334, 0.61528],
      916: [0, 0.68333, 0, 0.16667, 0.83334],
      920: [0, 0.68333, 0.02778, 0.08334, 0.76278],
      923: [0, 0.68333, 0, 0.16667, 0.69445],
      926: [0, 0.68333, 0.07569, 0.08334, 0.74236],
      928: [0, 0.68333, 0.08125, 0.05556, 0.83125],
      931: [0, 0.68333, 0.05764, 0.08334, 0.77986],
      933: [0, 0.68333, 0.13889, 0.05556, 0.58333],
      934: [0, 0.68333, 0, 0.08334, 0.66667],
      936: [0, 0.68333, 0.11, 0.05556, 0.61222],
      937: [0, 0.68333, 0.05017, 0.08334, 0.7724],
      945: [0, 0.43056, 0.0037, 0.02778, 0.6397],
      946: [0.19444, 0.69444, 0.05278, 0.08334, 0.56563],
      947: [0.19444, 0.43056, 0.05556, 0, 0.51773],
      948: [0, 0.69444, 0.03785, 0.05556, 0.44444],
      949: [0, 0.43056, 0, 0.08334, 0.46632],
      950: [0.19444, 0.69444, 0.07378, 0.08334, 0.4375],
      951: [0.19444, 0.43056, 0.03588, 0.05556, 0.49653],
      952: [0, 0.69444, 0.02778, 0.08334, 0.46944],
      953: [0, 0.43056, 0, 0.05556, 0.35394],
      954: [0, 0.43056, 0, 0, 0.57616],
      955: [0, 0.69444, 0, 0, 0.58334],
      956: [0.19444, 0.43056, 0, 0.02778, 0.60255],
      957: [0, 0.43056, 0.06366, 0.02778, 0.49398],
      958: [0.19444, 0.69444, 0.04601, 0.11111, 0.4375],
      959: [0, 0.43056, 0, 0.05556, 0.48472],
      960: [0, 0.43056, 0.03588, 0, 0.57003],
      961: [0.19444, 0.43056, 0, 0.08334, 0.51702],
      962: [0.09722, 0.43056, 0.07986, 0.08334, 0.36285],
      963: [0, 0.43056, 0.03588, 0, 0.57141],
      964: [0, 0.43056, 0.1132, 0.02778, 0.43715],
      965: [0, 0.43056, 0.03588, 0.02778, 0.54028],
      966: [0.19444, 0.43056, 0, 0.08334, 0.65417],
      967: [0.19444, 0.43056, 0, 0.05556, 0.62569],
      968: [0.19444, 0.69444, 0.03588, 0.11111, 0.65139],
      969: [0, 0.43056, 0.03588, 0, 0.62245],
      977: [0, 0.69444, 0, 0.08334, 0.59144],
      981: [0.19444, 0.69444, 0, 0.08334, 0.59583],
      982: [0, 0.43056, 0.02778, 0, 0.82813],
      1009: [0.19444, 0.43056, 0, 0.08334, 0.51702],
      1013: [0, 0.43056, 0, 0.05556, 0.4059],
      57649: [0, 0.43056, 0, 0.02778, 0.32246],
      57911: [0.19444, 0.43056, 0, 0.08334, 0.38403],
    },
    "SansSerif-Bold": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0, 0, 0.36667],
      34: [0, 0.69444, 0, 0, 0.55834],
      35: [0.19444, 0.69444, 0, 0, 0.91667],
      36: [0.05556, 0.75, 0, 0, 0.55],
      37: [0.05556, 0.75, 0, 0, 1.02912],
      38: [0, 0.69444, 0, 0, 0.83056],
      39: [0, 0.69444, 0, 0, 0.30556],
      40: [0.25, 0.75, 0, 0, 0.42778],
      41: [0.25, 0.75, 0, 0, 0.42778],
      42: [0, 0.75, 0, 0, 0.55],
      43: [0.11667, 0.61667, 0, 0, 0.85556],
      44: [0.10556, 0.13056, 0, 0, 0.30556],
      45: [0, 0.45833, 0, 0, 0.36667],
      46: [0, 0.13056, 0, 0, 0.30556],
      47: [0.25, 0.75, 0, 0, 0.55],
      48: [0, 0.69444, 0, 0, 0.55],
      49: [0, 0.69444, 0, 0, 0.55],
      50: [0, 0.69444, 0, 0, 0.55],
      51: [0, 0.69444, 0, 0, 0.55],
      52: [0, 0.69444, 0, 0, 0.55],
      53: [0, 0.69444, 0, 0, 0.55],
      54: [0, 0.69444, 0, 0, 0.55],
      55: [0, 0.69444, 0, 0, 0.55],
      56: [0, 0.69444, 0, 0, 0.55],
      57: [0, 0.69444, 0, 0, 0.55],
      58: [0, 0.45833, 0, 0, 0.30556],
      59: [0.10556, 0.45833, 0, 0, 0.30556],
      61: [-0.09375, 0.40625, 0, 0, 0.85556],
      63: [0, 0.69444, 0, 0, 0.51945],
      64: [0, 0.69444, 0, 0, 0.73334],
      65: [0, 0.69444, 0, 0, 0.73334],
      66: [0, 0.69444, 0, 0, 0.73334],
      67: [0, 0.69444, 0, 0, 0.70278],
      68: [0, 0.69444, 0, 0, 0.79445],
      69: [0, 0.69444, 0, 0, 0.64167],
      70: [0, 0.69444, 0, 0, 0.61111],
      71: [0, 0.69444, 0, 0, 0.73334],
      72: [0, 0.69444, 0, 0, 0.79445],
      73: [0, 0.69444, 0, 0, 0.33056],
      74: [0, 0.69444, 0, 0, 0.51945],
      75: [0, 0.69444, 0, 0, 0.76389],
      76: [0, 0.69444, 0, 0, 0.58056],
      77: [0, 0.69444, 0, 0, 0.97778],
      78: [0, 0.69444, 0, 0, 0.79445],
      79: [0, 0.69444, 0, 0, 0.79445],
      80: [0, 0.69444, 0, 0, 0.70278],
      81: [0.10556, 0.69444, 0, 0, 0.79445],
      82: [0, 0.69444, 0, 0, 0.70278],
      83: [0, 0.69444, 0, 0, 0.61111],
      84: [0, 0.69444, 0, 0, 0.73334],
      85: [0, 0.69444, 0, 0, 0.76389],
      86: [0, 0.69444, 0.01528, 0, 0.73334],
      87: [0, 0.69444, 0.01528, 0, 1.03889],
      88: [0, 0.69444, 0, 0, 0.73334],
      89: [0, 0.69444, 0.0275, 0, 0.73334],
      90: [0, 0.69444, 0, 0, 0.67223],
      91: [0.25, 0.75, 0, 0, 0.34306],
      93: [0.25, 0.75, 0, 0, 0.34306],
      94: [0, 0.69444, 0, 0, 0.55],
      95: [0.35, 0.10833, 0.03056, 0, 0.55],
      97: [0, 0.45833, 0, 0, 0.525],
      98: [0, 0.69444, 0, 0, 0.56111],
      99: [0, 0.45833, 0, 0, 0.48889],
      100: [0, 0.69444, 0, 0, 0.56111],
      101: [0, 0.45833, 0, 0, 0.51111],
      102: [0, 0.69444, 0.07639, 0, 0.33611],
      103: [0.19444, 0.45833, 0.01528, 0, 0.55],
      104: [0, 0.69444, 0, 0, 0.56111],
      105: [0, 0.69444, 0, 0, 0.25556],
      106: [0.19444, 0.69444, 0, 0, 0.28611],
      107: [0, 0.69444, 0, 0, 0.53056],
      108: [0, 0.69444, 0, 0, 0.25556],
      109: [0, 0.45833, 0, 0, 0.86667],
      110: [0, 0.45833, 0, 0, 0.56111],
      111: [0, 0.45833, 0, 0, 0.55],
      112: [0.19444, 0.45833, 0, 0, 0.56111],
      113: [0.19444, 0.45833, 0, 0, 0.56111],
      114: [0, 0.45833, 0.01528, 0, 0.37222],
      115: [0, 0.45833, 0, 0, 0.42167],
      116: [0, 0.58929, 0, 0, 0.40417],
      117: [0, 0.45833, 0, 0, 0.56111],
      118: [0, 0.45833, 0.01528, 0, 0.5],
      119: [0, 0.45833, 0.01528, 0, 0.74445],
      120: [0, 0.45833, 0, 0, 0.5],
      121: [0.19444, 0.45833, 0.01528, 0, 0.5],
      122: [0, 0.45833, 0, 0, 0.47639],
      126: [0.35, 0.34444, 0, 0, 0.55],
      160: [0, 0, 0, 0, 0.25],
      168: [0, 0.69444, 0, 0, 0.55],
      176: [0, 0.69444, 0, 0, 0.73334],
      180: [0, 0.69444, 0, 0, 0.55],
      184: [0.17014, 0, 0, 0, 0.48889],
      305: [0, 0.45833, 0, 0, 0.25556],
      567: [0.19444, 0.45833, 0, 0, 0.28611],
      710: [0, 0.69444, 0, 0, 0.55],
      711: [0, 0.63542, 0, 0, 0.55],
      713: [0, 0.63778, 0, 0, 0.55],
      728: [0, 0.69444, 0, 0, 0.55],
      729: [0, 0.69444, 0, 0, 0.30556],
      730: [0, 0.69444, 0, 0, 0.73334],
      732: [0, 0.69444, 0, 0, 0.55],
      733: [0, 0.69444, 0, 0, 0.55],
      915: [0, 0.69444, 0, 0, 0.58056],
      916: [0, 0.69444, 0, 0, 0.91667],
      920: [0, 0.69444, 0, 0, 0.85556],
      923: [0, 0.69444, 0, 0, 0.67223],
      926: [0, 0.69444, 0, 0, 0.73334],
      928: [0, 0.69444, 0, 0, 0.79445],
      931: [0, 0.69444, 0, 0, 0.79445],
      933: [0, 0.69444, 0, 0, 0.85556],
      934: [0, 0.69444, 0, 0, 0.79445],
      936: [0, 0.69444, 0, 0, 0.85556],
      937: [0, 0.69444, 0, 0, 0.79445],
      8211: [0, 0.45833, 0.03056, 0, 0.55],
      8212: [0, 0.45833, 0.03056, 0, 1.10001],
      8216: [0, 0.69444, 0, 0, 0.30556],
      8217: [0, 0.69444, 0, 0, 0.30556],
      8220: [0, 0.69444, 0, 0, 0.55834],
      8221: [0, 0.69444, 0, 0, 0.55834],
    },
    "SansSerif-Italic": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0.05733, 0, 0.31945],
      34: [0, 0.69444, 0.00316, 0, 0.5],
      35: [0.19444, 0.69444, 0.05087, 0, 0.83334],
      36: [0.05556, 0.75, 0.11156, 0, 0.5],
      37: [0.05556, 0.75, 0.03126, 0, 0.83334],
      38: [0, 0.69444, 0.03058, 0, 0.75834],
      39: [0, 0.69444, 0.07816, 0, 0.27778],
      40: [0.25, 0.75, 0.13164, 0, 0.38889],
      41: [0.25, 0.75, 0.02536, 0, 0.38889],
      42: [0, 0.75, 0.11775, 0, 0.5],
      43: [0.08333, 0.58333, 0.02536, 0, 0.77778],
      44: [0.125, 0.08333, 0, 0, 0.27778],
      45: [0, 0.44444, 0.01946, 0, 0.33333],
      46: [0, 0.08333, 0, 0, 0.27778],
      47: [0.25, 0.75, 0.13164, 0, 0.5],
      48: [0, 0.65556, 0.11156, 0, 0.5],
      49: [0, 0.65556, 0.11156, 0, 0.5],
      50: [0, 0.65556, 0.11156, 0, 0.5],
      51: [0, 0.65556, 0.11156, 0, 0.5],
      52: [0, 0.65556, 0.11156, 0, 0.5],
      53: [0, 0.65556, 0.11156, 0, 0.5],
      54: [0, 0.65556, 0.11156, 0, 0.5],
      55: [0, 0.65556, 0.11156, 0, 0.5],
      56: [0, 0.65556, 0.11156, 0, 0.5],
      57: [0, 0.65556, 0.11156, 0, 0.5],
      58: [0, 0.44444, 0.02502, 0, 0.27778],
      59: [0.125, 0.44444, 0.02502, 0, 0.27778],
      61: [-0.13, 0.37, 0.05087, 0, 0.77778],
      63: [0, 0.69444, 0.11809, 0, 0.47222],
      64: [0, 0.69444, 0.07555, 0, 0.66667],
      65: [0, 0.69444, 0, 0, 0.66667],
      66: [0, 0.69444, 0.08293, 0, 0.66667],
      67: [0, 0.69444, 0.11983, 0, 0.63889],
      68: [0, 0.69444, 0.07555, 0, 0.72223],
      69: [0, 0.69444, 0.11983, 0, 0.59722],
      70: [0, 0.69444, 0.13372, 0, 0.56945],
      71: [0, 0.69444, 0.11983, 0, 0.66667],
      72: [0, 0.69444, 0.08094, 0, 0.70834],
      73: [0, 0.69444, 0.13372, 0, 0.27778],
      74: [0, 0.69444, 0.08094, 0, 0.47222],
      75: [0, 0.69444, 0.11983, 0, 0.69445],
      76: [0, 0.69444, 0, 0, 0.54167],
      77: [0, 0.69444, 0.08094, 0, 0.875],
      78: [0, 0.69444, 0.08094, 0, 0.70834],
      79: [0, 0.69444, 0.07555, 0, 0.73611],
      80: [0, 0.69444, 0.08293, 0, 0.63889],
      81: [0.125, 0.69444, 0.07555, 0, 0.73611],
      82: [0, 0.69444, 0.08293, 0, 0.64584],
      83: [0, 0.69444, 0.09205, 0, 0.55556],
      84: [0, 0.69444, 0.13372, 0, 0.68056],
      85: [0, 0.69444, 0.08094, 0, 0.6875],
      86: [0, 0.69444, 0.1615, 0, 0.66667],
      87: [0, 0.69444, 0.1615, 0, 0.94445],
      88: [0, 0.69444, 0.13372, 0, 0.66667],
      89: [0, 0.69444, 0.17261, 0, 0.66667],
      90: [0, 0.69444, 0.11983, 0, 0.61111],
      91: [0.25, 0.75, 0.15942, 0, 0.28889],
      93: [0.25, 0.75, 0.08719, 0, 0.28889],
      94: [0, 0.69444, 0.0799, 0, 0.5],
      95: [0.35, 0.09444, 0.08616, 0, 0.5],
      97: [0, 0.44444, 0.00981, 0, 0.48056],
      98: [0, 0.69444, 0.03057, 0, 0.51667],
      99: [0, 0.44444, 0.08336, 0, 0.44445],
      100: [0, 0.69444, 0.09483, 0, 0.51667],
      101: [0, 0.44444, 0.06778, 0, 0.44445],
      102: [0, 0.69444, 0.21705, 0, 0.30556],
      103: [0.19444, 0.44444, 0.10836, 0, 0.5],
      104: [0, 0.69444, 0.01778, 0, 0.51667],
      105: [0, 0.67937, 0.09718, 0, 0.23889],
      106: [0.19444, 0.67937, 0.09162, 0, 0.26667],
      107: [0, 0.69444, 0.08336, 0, 0.48889],
      108: [0, 0.69444, 0.09483, 0, 0.23889],
      109: [0, 0.44444, 0.01778, 0, 0.79445],
      110: [0, 0.44444, 0.01778, 0, 0.51667],
      111: [0, 0.44444, 0.06613, 0, 0.5],
      112: [0.19444, 0.44444, 0.0389, 0, 0.51667],
      113: [0.19444, 0.44444, 0.04169, 0, 0.51667],
      114: [0, 0.44444, 0.10836, 0, 0.34167],
      115: [0, 0.44444, 0.0778, 0, 0.38333],
      116: [0, 0.57143, 0.07225, 0, 0.36111],
      117: [0, 0.44444, 0.04169, 0, 0.51667],
      118: [0, 0.44444, 0.10836, 0, 0.46111],
      119: [0, 0.44444, 0.10836, 0, 0.68334],
      120: [0, 0.44444, 0.09169, 0, 0.46111],
      121: [0.19444, 0.44444, 0.10836, 0, 0.46111],
      122: [0, 0.44444, 0.08752, 0, 0.43472],
      126: [0.35, 0.32659, 0.08826, 0, 0.5],
      160: [0, 0, 0, 0, 0.25],
      168: [0, 0.67937, 0.06385, 0, 0.5],
      176: [0, 0.69444, 0, 0, 0.73752],
      184: [0.17014, 0, 0, 0, 0.44445],
      305: [0, 0.44444, 0.04169, 0, 0.23889],
      567: [0.19444, 0.44444, 0.04169, 0, 0.26667],
      710: [0, 0.69444, 0.0799, 0, 0.5],
      711: [0, 0.63194, 0.08432, 0, 0.5],
      713: [0, 0.60889, 0.08776, 0, 0.5],
      714: [0, 0.69444, 0.09205, 0, 0.5],
      715: [0, 0.69444, 0, 0, 0.5],
      728: [0, 0.69444, 0.09483, 0, 0.5],
      729: [0, 0.67937, 0.07774, 0, 0.27778],
      730: [0, 0.69444, 0, 0, 0.73752],
      732: [0, 0.67659, 0.08826, 0, 0.5],
      733: [0, 0.69444, 0.09205, 0, 0.5],
      915: [0, 0.69444, 0.13372, 0, 0.54167],
      916: [0, 0.69444, 0, 0, 0.83334],
      920: [0, 0.69444, 0.07555, 0, 0.77778],
      923: [0, 0.69444, 0, 0, 0.61111],
      926: [0, 0.69444, 0.12816, 0, 0.66667],
      928: [0, 0.69444, 0.08094, 0, 0.70834],
      931: [0, 0.69444, 0.11983, 0, 0.72222],
      933: [0, 0.69444, 0.09031, 0, 0.77778],
      934: [0, 0.69444, 0.04603, 0, 0.72222],
      936: [0, 0.69444, 0.09031, 0, 0.77778],
      937: [0, 0.69444, 0.08293, 0, 0.72222],
      8211: [0, 0.44444, 0.08616, 0, 0.5],
      8212: [0, 0.44444, 0.08616, 0, 1],
      8216: [0, 0.69444, 0.07816, 0, 0.27778],
      8217: [0, 0.69444, 0.07816, 0, 0.27778],
      8220: [0, 0.69444, 0.14205, 0, 0.5],
      8221: [0, 0.69444, 0.00316, 0, 0.5],
    },
    "SansSerif-Regular": {
      32: [0, 0, 0, 0, 0.25],
      33: [0, 0.69444, 0, 0, 0.31945],
      34: [0, 0.69444, 0, 0, 0.5],
      35: [0.19444, 0.69444, 0, 0, 0.83334],
      36: [0.05556, 0.75, 0, 0, 0.5],
      37: [0.05556, 0.75, 0, 0, 0.83334],
      38: [0, 0.69444, 0, 0, 0.75834],
      39: [0, 0.69444, 0, 0, 0.27778],
      40: [0.25, 0.75, 0, 0, 0.38889],
      41: [0.25, 0.75, 0, 0, 0.38889],
      42: [0, 0.75, 0, 0, 0.5],
      43: [0.08333, 0.58333, 0, 0, 0.77778],
      44: [0.125, 0.08333, 0, 0, 0.27778],
      45: [0, 0.44444, 0, 0, 0.33333],
      46: [0, 0.08333, 0, 0, 0.27778],
      47: [0.25, 0.75, 0, 0, 0.5],
      48: [0, 0.65556, 0, 0, 0.5],
      49: [0, 0.65556, 0, 0, 0.5],
      50: [0, 0.65556, 0, 0, 0.5],
      51: [0, 0.65556, 0, 0, 0.5],
      52: [0, 0.65556, 0, 0, 0.5],
      53: [0, 0.65556, 0, 0, 0.5],
      54: [0, 0.65556, 0, 0, 0.5],
      55: [0, 0.65556, 0, 0, 0.5],
      56: [0, 0.65556, 0, 0, 0.5],
      57: [0, 0.65556, 0, 0, 0.5],
      58: [0, 0.44444, 0, 0, 0.27778],
      59: [0.125, 0.44444, 0, 0, 0.27778],
      61: [-0.13, 0.37, 0, 0, 0.77778],
      63: [0, 0.69444, 0, 0, 0.47222],
      64: [0, 0.69444, 0, 0, 0.66667],
      65: [0, 0.69444, 0, 0, 0.66667],
      66: [0, 0.69444, 0, 0, 0.66667],
      67: [0, 0.69444, 0, 0, 0.63889],
      68: [0, 0.69444, 0, 0, 0.72223],
      69: [0, 0.69444, 0, 0, 0.59722],
      70: [0, 0.69444, 0, 0, 0.56945],
      71: [0, 0.69444, 0, 0, 0.66667],
      72: [0, 0.69444, 0, 0, 0.70834],
      73: [0, 0.69444, 0, 0, 0.27778],
      74: [0, 0.69444, 0, 0, 0.47222],
      75: [0, 0.69444, 0, 0, 0.69445],
      76: [0, 0.69444, 0, 0, 0.54167],
      77: [0, 0.69444, 0, 0, 0.875],
      78: [0, 0.69444, 0, 0, 0.70834],
      79: [0, 0.69444, 0, 0, 0.73611],
      80: [0, 0.69444, 0, 0, 0.63889],
      81: [0.125, 0.69444, 0, 0, 0.73611],
      82: [0, 0.69444, 0, 0, 0.64584],
      83: [0, 0.69444, 0, 0, 0.55556],
      84: [0, 0.69444, 0, 0, 0.68056],
      85: [0, 0.69444, 0, 0, 0.6875],
      86: [0, 0.69444, 0.01389, 0, 0.66667],
      87: [0, 0.69444, 0.01389, 0, 0.94445],
      88: [0, 0.69444, 0, 0, 0.66667],
      89: [0, 0.69444, 0.025, 0, 0.66667],
      90: [0, 0.69444, 0, 0, 0.61111],
      91: [0.25, 0.75, 0, 0, 0.28889],
      93: [0.25, 0.75, 0, 0, 0.28889],
      94: [0, 0.69444, 0, 0, 0.5],
      95: [0.35, 0.09444, 0.02778, 0, 0.5],
      97: [0, 0.44444, 0, 0, 0.48056],
      98: [0, 0.69444, 0, 0, 0.51667],
      99: [0, 0.44444, 0, 0, 0.44445],
      100: [0, 0.69444, 0, 0, 0.51667],
      101: [0, 0.44444, 0, 0, 0.44445],
      102: [0, 0.69444, 0.06944, 0, 0.30556],
      103: [0.19444, 0.44444, 0.01389, 0, 0.5],
      104: [0, 0.69444, 0, 0, 0.51667],
      105: [0, 0.67937, 0, 0, 0.23889],
      106: [0.19444, 0.67937, 0, 0, 0.26667],
      107: [0, 0.69444, 0, 0, 0.48889],
      108: [0, 0.69444, 0, 0, 0.23889],
      109: [0, 0.44444, 0, 0, 0.79445],
      110: [0, 0.44444, 0, 0, 0.51667],
      111: [0, 0.44444, 0, 0, 0.5],
      112: [0.19444, 0.44444, 0, 0, 0.51667],
      113: [0.19444, 0.44444, 0, 0, 0.51667],
      114: [0, 0.44444, 0.01389, 0, 0.34167],
      115: [0, 0.44444, 0, 0, 0.38333],
      116: [0, 0.57143, 0, 0, 0.36111],
      117: [0, 0.44444, 0, 0, 0.51667],
      118: [0, 0.44444, 0.01389, 0, 0.46111],
      119: [0, 0.44444, 0.01389, 0, 0.68334],
      120: [0, 0.44444, 0, 0, 0.46111],
      121: [0.19444, 0.44444, 0.01389, 0, 0.46111],
      122: [0, 0.44444, 0, 0, 0.43472],
      126: [0.35, 0.32659, 0, 0, 0.5],
      160: [0, 0, 0, 0, 0.25],
      168: [0, 0.67937, 0, 0, 0.5],
      176: [0, 0.69444, 0, 0, 0.66667],
      184: [0.17014, 0, 0, 0, 0.44445],
      305: [0, 0.44444, 0, 0, 0.23889],
      567: [0.19444, 0.44444, 0, 0, 0.26667],
      710: [0, 0.69444, 0, 0, 0.5],
      711: [0, 0.63194, 0, 0, 0.5],
      713: [0, 0.60889, 0, 0, 0.5],
      714: [0, 0.69444, 0, 0, 0.5],
      715: [0, 0.69444, 0, 0, 0.5],
      728: [0, 0.69444, 0, 0, 0.5],
      729: [0, 0.67937, 0, 0, 0.27778],
      730: [0, 0.69444, 0, 0, 0.66667],
      732: [0, 0.67659, 0, 0, 0.5],
      733: [0, 0.69444, 0, 0, 0.5],
      915: [0, 0.69444, 0, 0, 0.54167],
      916: [0, 0.69444, 0, 0, 0.83334],
      920: [0, 0.69444, 0, 0, 0.77778],
      923: [0, 0.69444, 0, 0, 0.61111],
      926: [0, 0.69444, 0, 0, 0.66667],
      928: [0, 0.69444, 0, 0, 0.70834],
      931: [0, 0.69444, 0, 0, 0.72222],
      933: [0, 0.69444, 0, 0, 0.77778],
      934: [0, 0.69444, 0, 0, 0.72222],
      936: [0, 0.69444, 0, 0, 0.77778],
      937: [0, 0.69444, 0, 0, 0.72222],
      8211: [0, 0.44444, 0.02778, 0, 0.5],
      8212: [0, 0.44444, 0.02778, 0, 1],
      8216: [0, 0.69444, 0, 0, 0.27778],
      8217: [0, 0.69444, 0, 0, 0.27778],
      8220: [0, 0.69444, 0, 0, 0.5],
      8221: [0, 0.69444, 0, 0, 0.5],
    },
    "Script-Regular": {
      32: [0, 0, 0, 0, 0.25],
      65: [0, 0.7, 0.22925, 0, 0.80253],
      66: [0, 0.7, 0.04087, 0, 0.90757],
      67: [0, 0.7, 0.1689, 0, 0.66619],
      68: [0, 0.7, 0.09371, 0, 0.77443],
      69: [0, 0.7, 0.18583, 0, 0.56162],
      70: [0, 0.7, 0.13634, 0, 0.89544],
      71: [0, 0.7, 0.17322, 0, 0.60961],
      72: [0, 0.7, 0.29694, 0, 0.96919],
      73: [0, 0.7, 0.19189, 0, 0.80907],
      74: [0.27778, 0.7, 0.19189, 0, 1.05159],
      75: [0, 0.7, 0.31259, 0, 0.91364],
      76: [0, 0.7, 0.19189, 0, 0.87373],
      77: [0, 0.7, 0.15981, 0, 1.08031],
      78: [0, 0.7, 0.3525, 0, 0.9015],
      79: [0, 0.7, 0.08078, 0, 0.73787],
      80: [0, 0.7, 0.08078, 0, 1.01262],
      81: [0, 0.7, 0.03305, 0, 0.88282],
      82: [0, 0.7, 0.06259, 0, 0.85],
      83: [0, 0.7, 0.19189, 0, 0.86767],
      84: [0, 0.7, 0.29087, 0, 0.74697],
      85: [0, 0.7, 0.25815, 0, 0.79996],
      86: [0, 0.7, 0.27523, 0, 0.62204],
      87: [0, 0.7, 0.27523, 0, 0.80532],
      88: [0, 0.7, 0.26006, 0, 0.94445],
      89: [0, 0.7, 0.2939, 0, 0.70961],
      90: [0, 0.7, 0.24037, 0, 0.8212],
      160: [0, 0, 0, 0, 0.25],
    },
    "Size1-Regular": {
      32: [0, 0, 0, 0, 0.25],
      40: [0.35001, 0.85, 0, 0, 0.45834],
      41: [0.35001, 0.85, 0, 0, 0.45834],
      47: [0.35001, 0.85, 0, 0, 0.57778],
      91: [0.35001, 0.85, 0, 0, 0.41667],
      92: [0.35001, 0.85, 0, 0, 0.57778],
      93: [0.35001, 0.85, 0, 0, 0.41667],
      123: [0.35001, 0.85, 0, 0, 0.58334],
      125: [0.35001, 0.85, 0, 0, 0.58334],
      160: [0, 0, 0, 0, 0.25],
      710: [0, 0.72222, 0, 0, 0.55556],
      732: [0, 0.72222, 0, 0, 0.55556],
      770: [0, 0.72222, 0, 0, 0.55556],
      771: [0, 0.72222, 0, 0, 0.55556],
      8214: [-99e-5, 0.601, 0, 0, 0.77778],
      8593: [1e-5, 0.6, 0, 0, 0.66667],
      8595: [1e-5, 0.6, 0, 0, 0.66667],
      8657: [1e-5, 0.6, 0, 0, 0.77778],
      8659: [1e-5, 0.6, 0, 0, 0.77778],
      8719: [0.25001, 0.75, 0, 0, 0.94445],
      8720: [0.25001, 0.75, 0, 0, 0.94445],
      8721: [0.25001, 0.75, 0, 0, 1.05556],
      8730: [0.35001, 0.85, 0, 0, 1],
      8739: [-0.00599, 0.606, 0, 0, 0.33333],
      8741: [-0.00599, 0.606, 0, 0, 0.55556],
      8747: [0.30612, 0.805, 0.19445, 0, 0.47222],
      8748: [0.306, 0.805, 0.19445, 0, 0.47222],
      8749: [0.306, 0.805, 0.19445, 0, 0.47222],
      8750: [0.30612, 0.805, 0.19445, 0, 0.47222],
      8896: [0.25001, 0.75, 0, 0, 0.83334],
      8897: [0.25001, 0.75, 0, 0, 0.83334],
      8898: [0.25001, 0.75, 0, 0, 0.83334],
      8899: [0.25001, 0.75, 0, 0, 0.83334],
      8968: [0.35001, 0.85, 0, 0, 0.47222],
      8969: [0.35001, 0.85, 0, 0, 0.47222],
      8970: [0.35001, 0.85, 0, 0, 0.47222],
      8971: [0.35001, 0.85, 0, 0, 0.47222],
      9168: [-99e-5, 0.601, 0, 0, 0.66667],
      10216: [0.35001, 0.85, 0, 0, 0.47222],
      10217: [0.35001, 0.85, 0, 0, 0.47222],
      10752: [0.25001, 0.75, 0, 0, 1.11111],
      10753: [0.25001, 0.75, 0, 0, 1.11111],
      10754: [0.25001, 0.75, 0, 0, 1.11111],
      10756: [0.25001, 0.75, 0, 0, 0.83334],
      10758: [0.25001, 0.75, 0, 0, 0.83334],
    },
    "Size2-Regular": {
      32: [0, 0, 0, 0, 0.25],
      40: [0.65002, 1.15, 0, 0, 0.59722],
      41: [0.65002, 1.15, 0, 0, 0.59722],
      47: [0.65002, 1.15, 0, 0, 0.81111],
      91: [0.65002, 1.15, 0, 0, 0.47222],
      92: [0.65002, 1.15, 0, 0, 0.81111],
      93: [0.65002, 1.15, 0, 0, 0.47222],
      123: [0.65002, 1.15, 0, 0, 0.66667],
      125: [0.65002, 1.15, 0, 0, 0.66667],
      160: [0, 0, 0, 0, 0.25],
      710: [0, 0.75, 0, 0, 1],
      732: [0, 0.75, 0, 0, 1],
      770: [0, 0.75, 0, 0, 1],
      771: [0, 0.75, 0, 0, 1],
      8719: [0.55001, 1.05, 0, 0, 1.27778],
      8720: [0.55001, 1.05, 0, 0, 1.27778],
      8721: [0.55001, 1.05, 0, 0, 1.44445],
      8730: [0.65002, 1.15, 0, 0, 1],
      8747: [0.86225, 1.36, 0.44445, 0, 0.55556],
      8748: [0.862, 1.36, 0.44445, 0, 0.55556],
      8749: [0.862, 1.36, 0.44445, 0, 0.55556],
      8750: [0.86225, 1.36, 0.44445, 0, 0.55556],
      8896: [0.55001, 1.05, 0, 0, 1.11111],
      8897: [0.55001, 1.05, 0, 0, 1.11111],
      8898: [0.55001, 1.05, 0, 0, 1.11111],
      8899: [0.55001, 1.05, 0, 0, 1.11111],
      8968: [0.65002, 1.15, 0, 0, 0.52778],
      8969: [0.65002, 1.15, 0, 0, 0.52778],
      8970: [0.65002, 1.15, 0, 0, 0.52778],
      8971: [0.65002, 1.15, 0, 0, 0.52778],
      10216: [0.65002, 1.15, 0, 0, 0.61111],
      10217: [0.65002, 1.15, 0, 0, 0.61111],
      10752: [0.55001, 1.05, 0, 0, 1.51112],
      10753: [0.55001, 1.05, 0, 0, 1.51112],
      10754: [0.55001, 1.05, 0, 0, 1.51112],
      10756: [0.55001, 1.05, 0, 0, 1.11111],
      10758: [0.55001, 1.05, 0, 0, 1.11111],
    },
    "Size3-Regular": {
      32: [0, 0, 0, 0, 0.25],
      40: [0.95003, 1.45, 0, 0, 0.73611],
      41: [0.95003, 1.45, 0, 0, 0.73611],
      47: [0.95003, 1.45, 0, 0, 1.04445],
      91: [0.95003, 1.45, 0, 0, 0.52778],
      92: [0.95003, 1.45, 0, 0, 1.04445],
      93: [0.95003, 1.45, 0, 0, 0.52778],
      123: [0.95003, 1.45, 0, 0, 0.75],
      125: [0.95003, 1.45, 0, 0, 0.75],
      160: [0, 0, 0, 0, 0.25],
      710: [0, 0.75, 0, 0, 1.44445],
      732: [0, 0.75, 0, 0, 1.44445],
      770: [0, 0.75, 0, 0, 1.44445],
      771: [0, 0.75, 0, 0, 1.44445],
      8730: [0.95003, 1.45, 0, 0, 1],
      8968: [0.95003, 1.45, 0, 0, 0.58334],
      8969: [0.95003, 1.45, 0, 0, 0.58334],
      8970: [0.95003, 1.45, 0, 0, 0.58334],
      8971: [0.95003, 1.45, 0, 0, 0.58334],
      10216: [0.95003, 1.45, 0, 0, 0.75],
      10217: [0.95003, 1.45, 0, 0, 0.75],
    },
    "Size4-Regular": {
      32: [0, 0, 0, 0, 0.25],
      40: [1.25003, 1.75, 0, 0, 0.79167],
      41: [1.25003, 1.75, 0, 0, 0.79167],
      47: [1.25003, 1.75, 0, 0, 1.27778],
      91: [1.25003, 1.75, 0, 0, 0.58334],
      92: [1.25003, 1.75, 0, 0, 1.27778],
      93: [1.25003, 1.75, 0, 0, 0.58334],
      123: [1.25003, 1.75, 0, 0, 0.80556],
      125: [1.25003, 1.75, 0, 0, 0.80556],
      160: [0, 0, 0, 0, 0.25],
      710: [0, 0.825, 0, 0, 1.8889],
      732: [0, 0.825, 0, 0, 1.8889],
      770: [0, 0.825, 0, 0, 1.8889],
      771: [0, 0.825, 0, 0, 1.8889],
      8730: [1.25003, 1.75, 0, 0, 1],
      8968: [1.25003, 1.75, 0, 0, 0.63889],
      8969: [1.25003, 1.75, 0, 0, 0.63889],
      8970: [1.25003, 1.75, 0, 0, 0.63889],
      8971: [1.25003, 1.75, 0, 0, 0.63889],
      9115: [0.64502, 1.155, 0, 0, 0.875],
      9116: [1e-5, 0.6, 0, 0, 0.875],
      9117: [0.64502, 1.155, 0, 0, 0.875],
      9118: [0.64502, 1.155, 0, 0, 0.875],
      9119: [1e-5, 0.6, 0, 0, 0.875],
      9120: [0.64502, 1.155, 0, 0, 0.875],
      9121: [0.64502, 1.155, 0, 0, 0.66667],
      9122: [-99e-5, 0.601, 0, 0, 0.66667],
      9123: [0.64502, 1.155, 0, 0, 0.66667],
      9124: [0.64502, 1.155, 0, 0, 0.66667],
      9125: [-99e-5, 0.601, 0, 0, 0.66667],
      9126: [0.64502, 1.155, 0, 0, 0.66667],
      9127: [1e-5, 0.9, 0, 0, 0.88889],
      9128: [0.65002, 1.15, 0, 0, 0.88889],
      9129: [0.90001, 0, 0, 0, 0.88889],
      9130: [0, 0.3, 0, 0, 0.88889],
      9131: [1e-5, 0.9, 0, 0, 0.88889],
      9132: [0.65002, 1.15, 0, 0, 0.88889],
      9133: [0.90001, 0, 0, 0, 0.88889],
      9143: [0.88502, 0.915, 0, 0, 1.05556],
      10216: [1.25003, 1.75, 0, 0, 0.80556],
      10217: [1.25003, 1.75, 0, 0, 0.80556],
      57344: [-0.00499, 0.605, 0, 0, 1.05556],
      57345: [-0.00499, 0.605, 0, 0, 1.05556],
      57680: [0, 0.12, 0, 0, 0.45],
      57681: [0, 0.12, 0, 0, 0.45],
      57682: [0, 0.12, 0, 0, 0.45],
      57683: [0, 0.12, 0, 0, 0.45],
    },
    "Typewriter-Regular": {
      32: [0, 0, 0, 0, 0.525],
      33: [0, 0.61111, 0, 0, 0.525],
      34: [0, 0.61111, 0, 0, 0.525],
      35: [0, 0.61111, 0, 0, 0.525],
      36: [0.08333, 0.69444, 0, 0, 0.525],
      37: [0.08333, 0.69444, 0, 0, 0.525],
      38: [0, 0.61111, 0, 0, 0.525],
      39: [0, 0.61111, 0, 0, 0.525],
      40: [0.08333, 0.69444, 0, 0, 0.525],
      41: [0.08333, 0.69444, 0, 0, 0.525],
      42: [0, 0.52083, 0, 0, 0.525],
      43: [-0.08056, 0.53055, 0, 0, 0.525],
      44: [0.13889, 0.125, 0, 0, 0.525],
      45: [-0.08056, 0.53055, 0, 0, 0.525],
      46: [0, 0.125, 0, 0, 0.525],
      47: [0.08333, 0.69444, 0, 0, 0.525],
      48: [0, 0.61111, 0, 0, 0.525],
      49: [0, 0.61111, 0, 0, 0.525],
      50: [0, 0.61111, 0, 0, 0.525],
      51: [0, 0.61111, 0, 0, 0.525],
      52: [0, 0.61111, 0, 0, 0.525],
      53: [0, 0.61111, 0, 0, 0.525],
      54: [0, 0.61111, 0, 0, 0.525],
      55: [0, 0.61111, 0, 0, 0.525],
      56: [0, 0.61111, 0, 0, 0.525],
      57: [0, 0.61111, 0, 0, 0.525],
      58: [0, 0.43056, 0, 0, 0.525],
      59: [0.13889, 0.43056, 0, 0, 0.525],
      60: [-0.05556, 0.55556, 0, 0, 0.525],
      61: [-0.19549, 0.41562, 0, 0, 0.525],
      62: [-0.05556, 0.55556, 0, 0, 0.525],
      63: [0, 0.61111, 0, 0, 0.525],
      64: [0, 0.61111, 0, 0, 0.525],
      65: [0, 0.61111, 0, 0, 0.525],
      66: [0, 0.61111, 0, 0, 0.525],
      67: [0, 0.61111, 0, 0, 0.525],
      68: [0, 0.61111, 0, 0, 0.525],
      69: [0, 0.61111, 0, 0, 0.525],
      70: [0, 0.61111, 0, 0, 0.525],
      71: [0, 0.61111, 0, 0, 0.525],
      72: [0, 0.61111, 0, 0, 0.525],
      73: [0, 0.61111, 0, 0, 0.525],
      74: [0, 0.61111, 0, 0, 0.525],
      75: [0, 0.61111, 0, 0, 0.525],
      76: [0, 0.61111, 0, 0, 0.525],
      77: [0, 0.61111, 0, 0, 0.525],
      78: [0, 0.61111, 0, 0, 0.525],
      79: [0, 0.61111, 0, 0, 0.525],
      80: [0, 0.61111, 0, 0, 0.525],
      81: [0.13889, 0.61111, 0, 0, 0.525],
      82: [0, 0.61111, 0, 0, 0.525],
      83: [0, 0.61111, 0, 0, 0.525],
      84: [0, 0.61111, 0, 0, 0.525],
      85: [0, 0.61111, 0, 0, 0.525],
      86: [0, 0.61111, 0, 0, 0.525],
      87: [0, 0.61111, 0, 0, 0.525],
      88: [0, 0.61111, 0, 0, 0.525],
      89: [0, 0.61111, 0, 0, 0.525],
      90: [0, 0.61111, 0, 0, 0.525],
      91: [0.08333, 0.69444, 0, 0, 0.525],
      92: [0.08333, 0.69444, 0, 0, 0.525],
      93: [0.08333, 0.69444, 0, 0, 0.525],
      94: [0, 0.61111, 0, 0, 0.525],
      95: [0.09514, 0, 0, 0, 0.525],
      96: [0, 0.61111, 0, 0, 0.525],
      97: [0, 0.43056, 0, 0, 0.525],
      98: [0, 0.61111, 0, 0, 0.525],
      99: [0, 0.43056, 0, 0, 0.525],
      100: [0, 0.61111, 0, 0, 0.525],
      101: [0, 0.43056, 0, 0, 0.525],
      102: [0, 0.61111, 0, 0, 0.525],
      103: [0.22222, 0.43056, 0, 0, 0.525],
      104: [0, 0.61111, 0, 0, 0.525],
      105: [0, 0.61111, 0, 0, 0.525],
      106: [0.22222, 0.61111, 0, 0, 0.525],
      107: [0, 0.61111, 0, 0, 0.525],
      108: [0, 0.61111, 0, 0, 0.525],
      109: [0, 0.43056, 0, 0, 0.525],
      110: [0, 0.43056, 0, 0, 0.525],
      111: [0, 0.43056, 0, 0, 0.525],
      112: [0.22222, 0.43056, 0, 0, 0.525],
      113: [0.22222, 0.43056, 0, 0, 0.525],
      114: [0, 0.43056, 0, 0, 0.525],
      115: [0, 0.43056, 0, 0, 0.525],
      116: [0, 0.55358, 0, 0, 0.525],
      117: [0, 0.43056, 0, 0, 0.525],
      118: [0, 0.43056, 0, 0, 0.525],
      119: [0, 0.43056, 0, 0, 0.525],
      120: [0, 0.43056, 0, 0, 0.525],
      121: [0.22222, 0.43056, 0, 0, 0.525],
      122: [0, 0.43056, 0, 0, 0.525],
      123: [0.08333, 0.69444, 0, 0, 0.525],
      124: [0.08333, 0.69444, 0, 0, 0.525],
      125: [0.08333, 0.69444, 0, 0, 0.525],
      126: [0, 0.61111, 0, 0, 0.525],
      127: [0, 0.61111, 0, 0, 0.525],
      160: [0, 0, 0, 0, 0.525],
      176: [0, 0.61111, 0, 0, 0.525],
      184: [0.19445, 0, 0, 0, 0.525],
      305: [0, 0.43056, 0, 0, 0.525],
      567: [0.22222, 0.43056, 0, 0, 0.525],
      711: [0, 0.56597, 0, 0, 0.525],
      713: [0, 0.56555, 0, 0, 0.525],
      714: [0, 0.61111, 0, 0, 0.525],
      715: [0, 0.61111, 0, 0, 0.525],
      728: [0, 0.61111, 0, 0, 0.525],
      730: [0, 0.61111, 0, 0, 0.525],
      770: [0, 0.61111, 0, 0, 0.525],
      771: [0, 0.61111, 0, 0, 0.525],
      776: [0, 0.61111, 0, 0, 0.525],
      915: [0, 0.61111, 0, 0, 0.525],
      916: [0, 0.61111, 0, 0, 0.525],
      920: [0, 0.61111, 0, 0, 0.525],
      923: [0, 0.61111, 0, 0, 0.525],
      926: [0, 0.61111, 0, 0, 0.525],
      928: [0, 0.61111, 0, 0, 0.525],
      931: [0, 0.61111, 0, 0, 0.525],
      933: [0, 0.61111, 0, 0, 0.525],
      934: [0, 0.61111, 0, 0, 0.525],
      936: [0, 0.61111, 0, 0, 0.525],
      937: [0, 0.61111, 0, 0, 0.525],
      8216: [0, 0.61111, 0, 0, 0.525],
      8217: [0, 0.61111, 0, 0, 0.525],
      8242: [0, 0.61111, 0, 0, 0.525],
      9251: [0.11111, 0.21944, 0, 0, 0.525],
    },
  },
  Ga = {
    slant: [0.25, 0.25, 0.25],
    space: [0, 0, 0],
    stretch: [0, 0, 0],
    shrink: [0, 0, 0],
    xHeight: [0.431, 0.431, 0.431],
    quad: [1, 1.171, 1.472],
    extraSpace: [0, 0, 0],
    num1: [0.677, 0.732, 0.925],
    num2: [0.394, 0.384, 0.387],
    num3: [0.444, 0.471, 0.504],
    denom1: [0.686, 0.752, 1.025],
    denom2: [0.345, 0.344, 0.532],
    sup1: [0.413, 0.503, 0.504],
    sup2: [0.363, 0.431, 0.404],
    sup3: [0.289, 0.286, 0.294],
    sub1: [0.15, 0.143, 0.2],
    sub2: [0.247, 0.286, 0.4],
    supDrop: [0.386, 0.353, 0.494],
    subDrop: [0.05, 0.071, 0.1],
    delim1: [2.39, 1.7, 1.98],
    delim2: [1.01, 1.157, 1.42],
    axisHeight: [0.25, 0.25, 0.25],
    defaultRuleThickness: [0.04, 0.049, 0.049],
    bigOpSpacing1: [0.111, 0.111, 0.111],
    bigOpSpacing2: [0.166, 0.166, 0.166],
    bigOpSpacing3: [0.2, 0.2, 0.2],
    bigOpSpacing4: [0.6, 0.611, 0.611],
    bigOpSpacing5: [0.1, 0.143, 0.143],
    sqrtRuleThickness: [0.04, 0.04, 0.04],
    ptPerEm: [10, 10, 10],
    doubleRuleSep: [0.2, 0.2, 0.2],
    arrayRuleWidth: [0.04, 0.04, 0.04],
    fboxsep: [0.3, 0.3, 0.3],
    fboxrule: [0.04, 0.04, 0.04],
  },
  Zl = {
    Å: "A",
    Ð: "D",
    Þ: "o",
    å: "a",
    ð: "d",
    þ: "o",
    А: "A",
    Б: "B",
    В: "B",
    Г: "F",
    Д: "A",
    Е: "E",
    Ж: "K",
    З: "3",
    И: "N",
    Й: "N",
    К: "K",
    Л: "N",
    М: "M",
    Н: "H",
    О: "O",
    П: "N",
    Р: "P",
    С: "C",
    Т: "T",
    У: "y",
    Ф: "O",
    Х: "X",
    Ц: "U",
    Ч: "h",
    Ш: "W",
    Щ: "W",
    Ъ: "B",
    Ы: "X",
    Ь: "B",
    Э: "3",
    Ю: "X",
    Я: "R",
    а: "a",
    б: "b",
    в: "a",
    г: "r",
    д: "y",
    е: "e",
    ж: "m",
    з: "e",
    и: "n",
    й: "n",
    к: "n",
    л: "n",
    м: "m",
    н: "n",
    о: "o",
    п: "n",
    р: "p",
    с: "c",
    т: "o",
    у: "y",
    ф: "b",
    х: "x",
    ц: "n",
    ч: "n",
    ш: "w",
    щ: "w",
    ъ: "a",
    ы: "m",
    ь: "a",
    э: "e",
    ю: "m",
    я: "r",
  };
function T0(t, e, n) {
  if (!yr[e]) throw new Error("Font metrics not found for font: " + e + ".");
  var r = t.charCodeAt(0),
    i = yr[e][r];
  if (
    (!i && t[0] in Zl && ((r = Zl[t[0]].charCodeAt(0)), (i = yr[e][r])),
    !i && n === "text" && vd(r) && (i = yr[e][77]),
    i)
  )
    return { depth: i[0], height: i[1], italic: i[2], skew: i[3], width: i[4] };
}
var To = {};
function qg(t) {
  var e;
  if ((t >= 5 ? (e = 0) : t >= 3 ? (e = 1) : (e = 2), !To[e])) {
    var n = (To[e] = { cssEmPerMu: Ga.quad[e] / 18 });
    for (var r in Ga) Ga.hasOwnProperty(r) && (n[r] = Ga[r][e]);
  }
  return To[e];
}
var Ug = [
    [1, 1, 1],
    [2, 1, 1],
    [3, 1, 1],
    [4, 2, 1],
    [5, 2, 1],
    [6, 3, 1],
    [7, 4, 2],
    [8, 6, 3],
    [9, 7, 6],
    [10, 8, 7],
    [11, 10, 9],
  ],
  Jl = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.44, 1.728, 2.074, 2.488],
  eu = function (e, n) {
    return n.size < 2 ? e : Ug[e - 1][n.size - 1];
  };
class pr {
  constructor(e) {
    ((this.style = void 0),
      (this.color = void 0),
      (this.size = void 0),
      (this.textSize = void 0),
      (this.phantom = void 0),
      (this.font = void 0),
      (this.fontFamily = void 0),
      (this.fontWeight = void 0),
      (this.fontShape = void 0),
      (this.sizeMultiplier = void 0),
      (this.maxSize = void 0),
      (this.minRuleThickness = void 0),
      (this._fontMetrics = void 0),
      (this.style = e.style),
      (this.color = e.color),
      (this.size = e.size || pr.BASESIZE),
      (this.textSize = e.textSize || this.size),
      (this.phantom = !!e.phantom),
      (this.font = e.font || ""),
      (this.fontFamily = e.fontFamily || ""),
      (this.fontWeight = e.fontWeight || ""),
      (this.fontShape = e.fontShape || ""),
      (this.sizeMultiplier = Jl[this.size - 1]),
      (this.maxSize = e.maxSize),
      (this.minRuleThickness = e.minRuleThickness),
      (this._fontMetrics = void 0));
  }
  extend(e) {
    var n = {
      style: this.style,
      size: this.size,
      textSize: this.textSize,
      color: this.color,
      phantom: this.phantom,
      font: this.font,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      fontShape: this.fontShape,
      maxSize: this.maxSize,
      minRuleThickness: this.minRuleThickness,
    };
    for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
    return new pr(n);
  }
  havingStyle(e) {
    return this.style === e
      ? this
      : this.extend({ style: e, size: eu(this.textSize, e) });
  }
  havingCrampedStyle() {
    return this.havingStyle(this.style.cramp());
  }
  havingSize(e) {
    return this.size === e && this.textSize === e
      ? this
      : this.extend({
          style: this.style.text(),
          size: e,
          textSize: e,
          sizeMultiplier: Jl[e - 1],
        });
  }
  havingBaseStyle(e) {
    e = e || this.style.text();
    var n = eu(pr.BASESIZE, e);
    return this.size === n && this.textSize === pr.BASESIZE && this.style === e
      ? this
      : this.extend({ style: e, size: n });
  }
  havingBaseSizing() {
    var e;
    switch (this.style.id) {
      case 4:
      case 5:
        e = 3;
        break;
      case 6:
      case 7:
        e = 1;
        break;
      default:
        e = 6;
    }
    return this.extend({ style: this.style.text(), size: e });
  }
  withColor(e) {
    return this.extend({ color: e });
  }
  withPhantom() {
    return this.extend({ phantom: !0 });
  }
  withFont(e) {
    return this.extend({ font: e });
  }
  withTextFontFamily(e) {
    return this.extend({ fontFamily: e, font: "" });
  }
  withTextFontWeight(e) {
    return this.extend({ fontWeight: e, font: "" });
  }
  withTextFontShape(e) {
    return this.extend({ fontShape: e, font: "" });
  }
  sizingClasses(e) {
    return e.size !== this.size
      ? ["sizing", "reset-size" + e.size, "size" + this.size]
      : [];
  }
  baseSizingClasses() {
    return this.size !== pr.BASESIZE
      ? ["sizing", "reset-size" + this.size, "size" + pr.BASESIZE]
      : [];
  }
  fontMetrics() {
    return (
      this._fontMetrics || (this._fontMetrics = qg(this.size)),
      this._fontMetrics
    );
  }
  getColor() {
    return this.phantom ? "transparent" : this.color;
  }
}
pr.BASESIZE = 6;
var i0 = {
    pt: 1,
    mm: 7227 / 2540,
    cm: 7227 / 254,
    in: 72.27,
    bp: 803 / 800,
    pc: 12,
    dd: 1238 / 1157,
    cc: 14856 / 1157,
    nd: 685 / 642,
    nc: 1370 / 107,
    sp: 1 / 65536,
    px: 803 / 800,
  },
  $g = { ex: !0, em: !0, mu: !0 },
  bd = function (e) {
    return (
      typeof e != "string" && (e = e.unit),
      e in i0 || e in $g || e === "ex"
    );
  },
  ot = function (e, n) {
    var r;
    if (e.unit in i0)
      r = i0[e.unit] / n.fontMetrics().ptPerEm / n.sizeMultiplier;
    else if (e.unit === "mu") r = n.fontMetrics().cssEmPerMu;
    else {
      var i;
      if (
        (n.style.isTight() ? (i = n.havingStyle(n.style.text())) : (i = n),
        e.unit === "ex")
      )
        r = i.fontMetrics().xHeight;
      else if (e.unit === "em") r = i.fontMetrics().quad;
      else throw new ae("Invalid unit: '" + e.unit + "'");
      i !== n && (r *= i.sizeMultiplier / n.sizeMultiplier);
    }
    return Math.min(e.number * r, n.maxSize);
  },
  ce = function (e) {
    return +e.toFixed(4) + "em";
  },
  Xr = function (e) {
    return e.filter((n) => n).join(" ");
  },
  yd = function (e, n, r) {
    if (
      ((this.classes = e || []),
      (this.attributes = {}),
      (this.height = 0),
      (this.depth = 0),
      (this.maxFontSize = 0),
      (this.style = r || {}),
      n)
    ) {
      n.style.isTight() && this.classes.push("mtight");
      var i = n.getColor();
      i && (this.style.color = i);
    }
  },
  wd = function (e) {
    var n = document.createElement(e);
    n.className = Xr(this.classes);
    for (var r in this.style)
      this.style.hasOwnProperty(r) && (n.style[r] = this.style[r]);
    for (var i in this.attributes)
      this.attributes.hasOwnProperty(i) &&
        n.setAttribute(i, this.attributes[i]);
    for (var a = 0; a < this.children.length; a++)
      n.appendChild(this.children[a].toNode());
    return n;
  },
  Vg = /[\s"'>/=\x00-\x1f]/,
  xd = function (e) {
    var n = "<" + e;
    this.classes.length &&
      (n += ' class="' + Ee.escape(Xr(this.classes)) + '"');
    var r = "";
    for (var i in this.style)
      this.style.hasOwnProperty(i) &&
        (r += Ee.hyphenate(i) + ":" + this.style[i] + ";");
    r && (n += ' style="' + Ee.escape(r) + '"');
    for (var a in this.attributes)
      if (this.attributes.hasOwnProperty(a)) {
        if (Vg.test(a)) throw new ae("Invalid attribute name '" + a + "'");
        n += " " + a + '="' + Ee.escape(this.attributes[a]) + '"';
      }
    n += ">";
    for (var s = 0; s < this.children.length; s++)
      n += this.children[s].toMarkup();
    return ((n += "</" + e + ">"), n);
  };
class Ks {
  constructor(e, n, r, i) {
    ((this.children = void 0),
      (this.attributes = void 0),
      (this.classes = void 0),
      (this.height = void 0),
      (this.depth = void 0),
      (this.width = void 0),
      (this.maxFontSize = void 0),
      (this.style = void 0),
      yd.call(this, e, r, i),
      (this.children = n || []));
  }
  setAttribute(e, n) {
    this.attributes[e] = n;
  }
  hasClass(e) {
    return Ee.contains(this.classes, e);
  }
  toNode() {
    return wd.call(this, "span");
  }
  toMarkup() {
    return xd.call(this, "span");
  }
}
class kd {
  constructor(e, n, r, i) {
    ((this.children = void 0),
      (this.attributes = void 0),
      (this.classes = void 0),
      (this.height = void 0),
      (this.depth = void 0),
      (this.maxFontSize = void 0),
      (this.style = void 0),
      yd.call(this, n, i),
      (this.children = r || []),
      this.setAttribute("href", e));
  }
  setAttribute(e, n) {
    this.attributes[e] = n;
  }
  hasClass(e) {
    return Ee.contains(this.classes, e);
  }
  toNode() {
    return wd.call(this, "a");
  }
  toMarkup() {
    return xd.call(this, "a");
  }
}
class jg {
  constructor(e, n, r) {
    ((this.src = void 0),
      (this.alt = void 0),
      (this.classes = void 0),
      (this.height = void 0),
      (this.depth = void 0),
      (this.maxFontSize = void 0),
      (this.style = void 0),
      (this.alt = n),
      (this.src = e),
      (this.classes = ["mord"]),
      (this.style = r));
  }
  hasClass(e) {
    return Ee.contains(this.classes, e);
  }
  toNode() {
    var e = document.createElement("img");
    ((e.src = this.src), (e.alt = this.alt), (e.className = "mord"));
    for (var n in this.style)
      this.style.hasOwnProperty(n) && (e.style[n] = this.style[n]);
    return e;
  }
  toMarkup() {
    var e =
        '<img src="' +
        Ee.escape(this.src) +
        '"' +
        (' alt="' + Ee.escape(this.alt) + '"'),
      n = "";
    for (var r in this.style)
      this.style.hasOwnProperty(r) &&
        (n += Ee.hyphenate(r) + ":" + this.style[r] + ";");
    return (n && (e += ' style="' + Ee.escape(n) + '"'), (e += "'/>"), e);
  }
}
var Wg = { î: "ı̂", ï: "ı̈", í: "ı́", ì: "ı̀" };
class Gn {
  constructor(e, n, r, i, a, s, o, l) {
    ((this.text = void 0),
      (this.height = void 0),
      (this.depth = void 0),
      (this.italic = void 0),
      (this.skew = void 0),
      (this.width = void 0),
      (this.maxFontSize = void 0),
      (this.classes = void 0),
      (this.style = void 0),
      (this.text = e),
      (this.height = n || 0),
      (this.depth = r || 0),
      (this.italic = i || 0),
      (this.skew = a || 0),
      (this.width = s || 0),
      (this.classes = o || []),
      (this.style = l || {}),
      (this.maxFontSize = 0));
    var u = zg(this.text.charCodeAt(0));
    (u && this.classes.push(u + "_fallback"),
      /[îïíì]/.test(this.text) && (this.text = Wg[this.text]));
  }
  hasClass(e) {
    return Ee.contains(this.classes, e);
  }
  toNode() {
    var e = document.createTextNode(this.text),
      n = null;
    (this.italic > 0 &&
      ((n = document.createElement("span")),
      (n.style.marginRight = ce(this.italic))),
      this.classes.length > 0 &&
        ((n = n || document.createElement("span")),
        (n.className = Xr(this.classes))));
    for (var r in this.style)
      this.style.hasOwnProperty(r) &&
        ((n = n || document.createElement("span")),
        (n.style[r] = this.style[r]));
    return n ? (n.appendChild(e), n) : e;
  }
  toMarkup() {
    var e = !1,
      n = "<span";
    this.classes.length &&
      ((e = !0),
      (n += ' class="'),
      (n += Ee.escape(Xr(this.classes))),
      (n += '"'));
    var r = "";
    this.italic > 0 && (r += "margin-right:" + this.italic + "em;");
    for (var i in this.style)
      this.style.hasOwnProperty(i) &&
        (r += Ee.hyphenate(i) + ":" + this.style[i] + ";");
    r && ((e = !0), (n += ' style="' + Ee.escape(r) + '"'));
    var a = Ee.escape(this.text);
    return e ? ((n += ">"), (n += a), (n += "</span>"), n) : a;
  }
}
class Kr {
  constructor(e, n) {
    ((this.children = void 0),
      (this.attributes = void 0),
      (this.children = e || []),
      (this.attributes = n || {}));
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg",
      n = document.createElementNS(e, "svg");
    for (var r in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, r) &&
        n.setAttribute(r, this.attributes[r]);
    for (var i = 0; i < this.children.length; i++)
      n.appendChild(this.children[i].toNode());
    return n;
  }
  toMarkup() {
    var e = '<svg xmlns="http://www.w3.org/2000/svg"';
    for (var n in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, n) &&
        (e += " " + n + '="' + Ee.escape(this.attributes[n]) + '"');
    e += ">";
    for (var r = 0; r < this.children.length; r++)
      e += this.children[r].toMarkup();
    return ((e += "</svg>"), e);
  }
}
class fi {
  constructor(e, n) {
    ((this.pathName = void 0),
      (this.alternate = void 0),
      (this.pathName = e),
      (this.alternate = n));
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg",
      n = document.createElementNS(e, "path");
    return (
      this.alternate
        ? n.setAttribute("d", this.alternate)
        : n.setAttribute("d", Ql[this.pathName]),
      n
    );
  }
  toMarkup() {
    return this.alternate
      ? '<path d="' + Ee.escape(this.alternate) + '"/>'
      : '<path d="' + Ee.escape(Ql[this.pathName]) + '"/>';
  }
}
class tu {
  constructor(e) {
    ((this.attributes = void 0), (this.attributes = e || {}));
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg",
      n = document.createElementNS(e, "line");
    for (var r in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, r) &&
        n.setAttribute(r, this.attributes[r]);
    return n;
  }
  toMarkup() {
    var e = "<line";
    for (var n in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, n) &&
        (e += " " + n + '="' + Ee.escape(this.attributes[n]) + '"');
    return ((e += "/>"), e);
  }
}
function nu(t) {
  if (t instanceof Gn) return t;
  throw new Error("Expected symbolNode but got " + String(t) + ".");
}
function Gg(t) {
  if (t instanceof Ks) return t;
  throw new Error("Expected span<HtmlDomNode> but got " + String(t) + ".");
}
var Yg = { bin: 1, close: 1, inner: 1, open: 1, punct: 1, rel: 1 },
  Xg = { "accent-token": 1, mathord: 1, "op-token": 1, spacing: 1, textord: 1 },
  tt = { math: {}, text: {} };
function c(t, e, n, r, i, a) {
  ((tt[t][i] = { font: e, group: n, replace: r }),
    a && r && (tt[t][r] = tt[t][i]));
}
var f = "math",
  J = "text",
  g = "main",
  D = "ams",
  at = "accent-token",
  be = "bin",
  tn = "close",
  Ui = "inner",
  Le = "mathord",
  Tt = "op-token",
  wn = "open",
  Qs = "punct",
  N = "rel",
  Er = "spacing",
  P = "textord";
c(f, g, N, "≡", "\\equiv", !0);
c(f, g, N, "≺", "\\prec", !0);
c(f, g, N, "≻", "\\succ", !0);
c(f, g, N, "∼", "\\sim", !0);
c(f, g, N, "⊥", "\\perp");
c(f, g, N, "⪯", "\\preceq", !0);
c(f, g, N, "⪰", "\\succeq", !0);
c(f, g, N, "≃", "\\simeq", !0);
c(f, g, N, "∣", "\\mid", !0);
c(f, g, N, "≪", "\\ll", !0);
c(f, g, N, "≫", "\\gg", !0);
c(f, g, N, "≍", "\\asymp", !0);
c(f, g, N, "∥", "\\parallel");
c(f, g, N, "⋈", "\\bowtie", !0);
c(f, g, N, "⌣", "\\smile", !0);
c(f, g, N, "⊑", "\\sqsubseteq", !0);
c(f, g, N, "⊒", "\\sqsupseteq", !0);
c(f, g, N, "≐", "\\doteq", !0);
c(f, g, N, "⌢", "\\frown", !0);
c(f, g, N, "∋", "\\ni", !0);
c(f, g, N, "∝", "\\propto", !0);
c(f, g, N, "⊢", "\\vdash", !0);
c(f, g, N, "⊣", "\\dashv", !0);
c(f, g, N, "∋", "\\owns");
c(f, g, Qs, ".", "\\ldotp");
c(f, g, Qs, "⋅", "\\cdotp");
c(f, g, P, "#", "\\#");
c(J, g, P, "#", "\\#");
c(f, g, P, "&", "\\&");
c(J, g, P, "&", "\\&");
c(f, g, P, "ℵ", "\\aleph", !0);
c(f, g, P, "∀", "\\forall", !0);
c(f, g, P, "ℏ", "\\hbar", !0);
c(f, g, P, "∃", "\\exists", !0);
c(f, g, P, "∇", "\\nabla", !0);
c(f, g, P, "♭", "\\flat", !0);
c(f, g, P, "ℓ", "\\ell", !0);
c(f, g, P, "♮", "\\natural", !0);
c(f, g, P, "♣", "\\clubsuit", !0);
c(f, g, P, "℘", "\\wp", !0);
c(f, g, P, "♯", "\\sharp", !0);
c(f, g, P, "♢", "\\diamondsuit", !0);
c(f, g, P, "ℜ", "\\Re", !0);
c(f, g, P, "♡", "\\heartsuit", !0);
c(f, g, P, "ℑ", "\\Im", !0);
c(f, g, P, "♠", "\\spadesuit", !0);
c(f, g, P, "§", "\\S", !0);
c(J, g, P, "§", "\\S");
c(f, g, P, "¶", "\\P", !0);
c(J, g, P, "¶", "\\P");
c(f, g, P, "†", "\\dag");
c(J, g, P, "†", "\\dag");
c(J, g, P, "†", "\\textdagger");
c(f, g, P, "‡", "\\ddag");
c(J, g, P, "‡", "\\ddag");
c(J, g, P, "‡", "\\textdaggerdbl");
c(f, g, tn, "⎱", "\\rmoustache", !0);
c(f, g, wn, "⎰", "\\lmoustache", !0);
c(f, g, tn, "⟯", "\\rgroup", !0);
c(f, g, wn, "⟮", "\\lgroup", !0);
c(f, g, be, "∓", "\\mp", !0);
c(f, g, be, "⊖", "\\ominus", !0);
c(f, g, be, "⊎", "\\uplus", !0);
c(f, g, be, "⊓", "\\sqcap", !0);
c(f, g, be, "∗", "\\ast");
c(f, g, be, "⊔", "\\sqcup", !0);
c(f, g, be, "◯", "\\bigcirc", !0);
c(f, g, be, "∙", "\\bullet", !0);
c(f, g, be, "‡", "\\ddagger");
c(f, g, be, "≀", "\\wr", !0);
c(f, g, be, "⨿", "\\amalg");
c(f, g, be, "&", "\\And");
c(f, g, N, "⟵", "\\longleftarrow", !0);
c(f, g, N, "⇐", "\\Leftarrow", !0);
c(f, g, N, "⟸", "\\Longleftarrow", !0);
c(f, g, N, "⟶", "\\longrightarrow", !0);
c(f, g, N, "⇒", "\\Rightarrow", !0);
c(f, g, N, "⟹", "\\Longrightarrow", !0);
c(f, g, N, "↔", "\\leftrightarrow", !0);
c(f, g, N, "⟷", "\\longleftrightarrow", !0);
c(f, g, N, "⇔", "\\Leftrightarrow", !0);
c(f, g, N, "⟺", "\\Longleftrightarrow", !0);
c(f, g, N, "↦", "\\mapsto", !0);
c(f, g, N, "⟼", "\\longmapsto", !0);
c(f, g, N, "↗", "\\nearrow", !0);
c(f, g, N, "↩", "\\hookleftarrow", !0);
c(f, g, N, "↪", "\\hookrightarrow", !0);
c(f, g, N, "↘", "\\searrow", !0);
c(f, g, N, "↼", "\\leftharpoonup", !0);
c(f, g, N, "⇀", "\\rightharpoonup", !0);
c(f, g, N, "↙", "\\swarrow", !0);
c(f, g, N, "↽", "\\leftharpoondown", !0);
c(f, g, N, "⇁", "\\rightharpoondown", !0);
c(f, g, N, "↖", "\\nwarrow", !0);
c(f, g, N, "⇌", "\\rightleftharpoons", !0);
c(f, D, N, "≮", "\\nless", !0);
c(f, D, N, "", "\\@nleqslant");
c(f, D, N, "", "\\@nleqq");
c(f, D, N, "⪇", "\\lneq", !0);
c(f, D, N, "≨", "\\lneqq", !0);
c(f, D, N, "", "\\@lvertneqq");
c(f, D, N, "⋦", "\\lnsim", !0);
c(f, D, N, "⪉", "\\lnapprox", !0);
c(f, D, N, "⊀", "\\nprec", !0);
c(f, D, N, "⋠", "\\npreceq", !0);
c(f, D, N, "⋨", "\\precnsim", !0);
c(f, D, N, "⪹", "\\precnapprox", !0);
c(f, D, N, "≁", "\\nsim", !0);
c(f, D, N, "", "\\@nshortmid");
c(f, D, N, "∤", "\\nmid", !0);
c(f, D, N, "⊬", "\\nvdash", !0);
c(f, D, N, "⊭", "\\nvDash", !0);
c(f, D, N, "⋪", "\\ntriangleleft");
c(f, D, N, "⋬", "\\ntrianglelefteq", !0);
c(f, D, N, "⊊", "\\subsetneq", !0);
c(f, D, N, "", "\\@varsubsetneq");
c(f, D, N, "⫋", "\\subsetneqq", !0);
c(f, D, N, "", "\\@varsubsetneqq");
c(f, D, N, "≯", "\\ngtr", !0);
c(f, D, N, "", "\\@ngeqslant");
c(f, D, N, "", "\\@ngeqq");
c(f, D, N, "⪈", "\\gneq", !0);
c(f, D, N, "≩", "\\gneqq", !0);
c(f, D, N, "", "\\@gvertneqq");
c(f, D, N, "⋧", "\\gnsim", !0);
c(f, D, N, "⪊", "\\gnapprox", !0);
c(f, D, N, "⊁", "\\nsucc", !0);
c(f, D, N, "⋡", "\\nsucceq", !0);
c(f, D, N, "⋩", "\\succnsim", !0);
c(f, D, N, "⪺", "\\succnapprox", !0);
c(f, D, N, "≆", "\\ncong", !0);
c(f, D, N, "", "\\@nshortparallel");
c(f, D, N, "∦", "\\nparallel", !0);
c(f, D, N, "⊯", "\\nVDash", !0);
c(f, D, N, "⋫", "\\ntriangleright");
c(f, D, N, "⋭", "\\ntrianglerighteq", !0);
c(f, D, N, "", "\\@nsupseteqq");
c(f, D, N, "⊋", "\\supsetneq", !0);
c(f, D, N, "", "\\@varsupsetneq");
c(f, D, N, "⫌", "\\supsetneqq", !0);
c(f, D, N, "", "\\@varsupsetneqq");
c(f, D, N, "⊮", "\\nVdash", !0);
c(f, D, N, "⪵", "\\precneqq", !0);
c(f, D, N, "⪶", "\\succneqq", !0);
c(f, D, N, "", "\\@nsubseteqq");
c(f, D, be, "⊴", "\\unlhd");
c(f, D, be, "⊵", "\\unrhd");
c(f, D, N, "↚", "\\nleftarrow", !0);
c(f, D, N, "↛", "\\nrightarrow", !0);
c(f, D, N, "⇍", "\\nLeftarrow", !0);
c(f, D, N, "⇏", "\\nRightarrow", !0);
c(f, D, N, "↮", "\\nleftrightarrow", !0);
c(f, D, N, "⇎", "\\nLeftrightarrow", !0);
c(f, D, N, "△", "\\vartriangle");
c(f, D, P, "ℏ", "\\hslash");
c(f, D, P, "▽", "\\triangledown");
c(f, D, P, "◊", "\\lozenge");
c(f, D, P, "Ⓢ", "\\circledS");
c(f, D, P, "®", "\\circledR");
c(J, D, P, "®", "\\circledR");
c(f, D, P, "∡", "\\measuredangle", !0);
c(f, D, P, "∄", "\\nexists");
c(f, D, P, "℧", "\\mho");
c(f, D, P, "Ⅎ", "\\Finv", !0);
c(f, D, P, "⅁", "\\Game", !0);
c(f, D, P, "‵", "\\backprime");
c(f, D, P, "▲", "\\blacktriangle");
c(f, D, P, "▼", "\\blacktriangledown");
c(f, D, P, "■", "\\blacksquare");
c(f, D, P, "⧫", "\\blacklozenge");
c(f, D, P, "★", "\\bigstar");
c(f, D, P, "∢", "\\sphericalangle", !0);
c(f, D, P, "∁", "\\complement", !0);
c(f, D, P, "ð", "\\eth", !0);
c(J, g, P, "ð", "ð");
c(f, D, P, "╱", "\\diagup");
c(f, D, P, "╲", "\\diagdown");
c(f, D, P, "□", "\\square");
c(f, D, P, "□", "\\Box");
c(f, D, P, "◊", "\\Diamond");
c(f, D, P, "¥", "\\yen", !0);
c(J, D, P, "¥", "\\yen", !0);
c(f, D, P, "✓", "\\checkmark", !0);
c(J, D, P, "✓", "\\checkmark");
c(f, D, P, "ℶ", "\\beth", !0);
c(f, D, P, "ℸ", "\\daleth", !0);
c(f, D, P, "ℷ", "\\gimel", !0);
c(f, D, P, "ϝ", "\\digamma", !0);
c(f, D, P, "ϰ", "\\varkappa");
c(f, D, wn, "┌", "\\@ulcorner", !0);
c(f, D, tn, "┐", "\\@urcorner", !0);
c(f, D, wn, "└", "\\@llcorner", !0);
c(f, D, tn, "┘", "\\@lrcorner", !0);
c(f, D, N, "≦", "\\leqq", !0);
c(f, D, N, "⩽", "\\leqslant", !0);
c(f, D, N, "⪕", "\\eqslantless", !0);
c(f, D, N, "≲", "\\lesssim", !0);
c(f, D, N, "⪅", "\\lessapprox", !0);
c(f, D, N, "≊", "\\approxeq", !0);
c(f, D, be, "⋖", "\\lessdot");
c(f, D, N, "⋘", "\\lll", !0);
c(f, D, N, "≶", "\\lessgtr", !0);
c(f, D, N, "⋚", "\\lesseqgtr", !0);
c(f, D, N, "⪋", "\\lesseqqgtr", !0);
c(f, D, N, "≑", "\\doteqdot");
c(f, D, N, "≓", "\\risingdotseq", !0);
c(f, D, N, "≒", "\\fallingdotseq", !0);
c(f, D, N, "∽", "\\backsim", !0);
c(f, D, N, "⋍", "\\backsimeq", !0);
c(f, D, N, "⫅", "\\subseteqq", !0);
c(f, D, N, "⋐", "\\Subset", !0);
c(f, D, N, "⊏", "\\sqsubset", !0);
c(f, D, N, "≼", "\\preccurlyeq", !0);
c(f, D, N, "⋞", "\\curlyeqprec", !0);
c(f, D, N, "≾", "\\precsim", !0);
c(f, D, N, "⪷", "\\precapprox", !0);
c(f, D, N, "⊲", "\\vartriangleleft");
c(f, D, N, "⊴", "\\trianglelefteq");
c(f, D, N, "⊨", "\\vDash", !0);
c(f, D, N, "⊪", "\\Vvdash", !0);
c(f, D, N, "⌣", "\\smallsmile");
c(f, D, N, "⌢", "\\smallfrown");
c(f, D, N, "≏", "\\bumpeq", !0);
c(f, D, N, "≎", "\\Bumpeq", !0);
c(f, D, N, "≧", "\\geqq", !0);
c(f, D, N, "⩾", "\\geqslant", !0);
c(f, D, N, "⪖", "\\eqslantgtr", !0);
c(f, D, N, "≳", "\\gtrsim", !0);
c(f, D, N, "⪆", "\\gtrapprox", !0);
c(f, D, be, "⋗", "\\gtrdot");
c(f, D, N, "⋙", "\\ggg", !0);
c(f, D, N, "≷", "\\gtrless", !0);
c(f, D, N, "⋛", "\\gtreqless", !0);
c(f, D, N, "⪌", "\\gtreqqless", !0);
c(f, D, N, "≖", "\\eqcirc", !0);
c(f, D, N, "≗", "\\circeq", !0);
c(f, D, N, "≜", "\\triangleq", !0);
c(f, D, N, "∼", "\\thicksim");
c(f, D, N, "≈", "\\thickapprox");
c(f, D, N, "⫆", "\\supseteqq", !0);
c(f, D, N, "⋑", "\\Supset", !0);
c(f, D, N, "⊐", "\\sqsupset", !0);
c(f, D, N, "≽", "\\succcurlyeq", !0);
c(f, D, N, "⋟", "\\curlyeqsucc", !0);
c(f, D, N, "≿", "\\succsim", !0);
c(f, D, N, "⪸", "\\succapprox", !0);
c(f, D, N, "⊳", "\\vartriangleright");
c(f, D, N, "⊵", "\\trianglerighteq");
c(f, D, N, "⊩", "\\Vdash", !0);
c(f, D, N, "∣", "\\shortmid");
c(f, D, N, "∥", "\\shortparallel");
c(f, D, N, "≬", "\\between", !0);
c(f, D, N, "⋔", "\\pitchfork", !0);
c(f, D, N, "∝", "\\varpropto");
c(f, D, N, "◀", "\\blacktriangleleft");
c(f, D, N, "∴", "\\therefore", !0);
c(f, D, N, "∍", "\\backepsilon");
c(f, D, N, "▶", "\\blacktriangleright");
c(f, D, N, "∵", "\\because", !0);
c(f, D, N, "⋘", "\\llless");
c(f, D, N, "⋙", "\\gggtr");
c(f, D, be, "⊲", "\\lhd");
c(f, D, be, "⊳", "\\rhd");
c(f, D, N, "≂", "\\eqsim", !0);
c(f, g, N, "⋈", "\\Join");
c(f, D, N, "≑", "\\Doteq", !0);
c(f, D, be, "∔", "\\dotplus", !0);
c(f, D, be, "∖", "\\smallsetminus");
c(f, D, be, "⋒", "\\Cap", !0);
c(f, D, be, "⋓", "\\Cup", !0);
c(f, D, be, "⩞", "\\doublebarwedge", !0);
c(f, D, be, "⊟", "\\boxminus", !0);
c(f, D, be, "⊞", "\\boxplus", !0);
c(f, D, be, "⋇", "\\divideontimes", !0);
c(f, D, be, "⋉", "\\ltimes", !0);
c(f, D, be, "⋊", "\\rtimes", !0);
c(f, D, be, "⋋", "\\leftthreetimes", !0);
c(f, D, be, "⋌", "\\rightthreetimes", !0);
c(f, D, be, "⋏", "\\curlywedge", !0);
c(f, D, be, "⋎", "\\curlyvee", !0);
c(f, D, be, "⊝", "\\circleddash", !0);
c(f, D, be, "⊛", "\\circledast", !0);
c(f, D, be, "⋅", "\\centerdot");
c(f, D, be, "⊺", "\\intercal", !0);
c(f, D, be, "⋒", "\\doublecap");
c(f, D, be, "⋓", "\\doublecup");
c(f, D, be, "⊠", "\\boxtimes", !0);
c(f, D, N, "⇢", "\\dashrightarrow", !0);
c(f, D, N, "⇠", "\\dashleftarrow", !0);
c(f, D, N, "⇇", "\\leftleftarrows", !0);
c(f, D, N, "⇆", "\\leftrightarrows", !0);
c(f, D, N, "⇚", "\\Lleftarrow", !0);
c(f, D, N, "↞", "\\twoheadleftarrow", !0);
c(f, D, N, "↢", "\\leftarrowtail", !0);
c(f, D, N, "↫", "\\looparrowleft", !0);
c(f, D, N, "⇋", "\\leftrightharpoons", !0);
c(f, D, N, "↶", "\\curvearrowleft", !0);
c(f, D, N, "↺", "\\circlearrowleft", !0);
c(f, D, N, "↰", "\\Lsh", !0);
c(f, D, N, "⇈", "\\upuparrows", !0);
c(f, D, N, "↿", "\\upharpoonleft", !0);
c(f, D, N, "⇃", "\\downharpoonleft", !0);
c(f, g, N, "⊶", "\\origof", !0);
c(f, g, N, "⊷", "\\imageof", !0);
c(f, D, N, "⊸", "\\multimap", !0);
c(f, D, N, "↭", "\\leftrightsquigarrow", !0);
c(f, D, N, "⇉", "\\rightrightarrows", !0);
c(f, D, N, "⇄", "\\rightleftarrows", !0);
c(f, D, N, "↠", "\\twoheadrightarrow", !0);
c(f, D, N, "↣", "\\rightarrowtail", !0);
c(f, D, N, "↬", "\\looparrowright", !0);
c(f, D, N, "↷", "\\curvearrowright", !0);
c(f, D, N, "↻", "\\circlearrowright", !0);
c(f, D, N, "↱", "\\Rsh", !0);
c(f, D, N, "⇊", "\\downdownarrows", !0);
c(f, D, N, "↾", "\\upharpoonright", !0);
c(f, D, N, "⇂", "\\downharpoonright", !0);
c(f, D, N, "⇝", "\\rightsquigarrow", !0);
c(f, D, N, "⇝", "\\leadsto");
c(f, D, N, "⇛", "\\Rrightarrow", !0);
c(f, D, N, "↾", "\\restriction");
c(f, g, P, "‘", "`");
c(f, g, P, "$", "\\$");
c(J, g, P, "$", "\\$");
c(J, g, P, "$", "\\textdollar");
c(f, g, P, "%", "\\%");
c(J, g, P, "%", "\\%");
c(f, g, P, "_", "\\_");
c(J, g, P, "_", "\\_");
c(J, g, P, "_", "\\textunderscore");
c(f, g, P, "∠", "\\angle", !0);
c(f, g, P, "∞", "\\infty", !0);
c(f, g, P, "′", "\\prime");
c(f, g, P, "△", "\\triangle");
c(f, g, P, "Γ", "\\Gamma", !0);
c(f, g, P, "Δ", "\\Delta", !0);
c(f, g, P, "Θ", "\\Theta", !0);
c(f, g, P, "Λ", "\\Lambda", !0);
c(f, g, P, "Ξ", "\\Xi", !0);
c(f, g, P, "Π", "\\Pi", !0);
c(f, g, P, "Σ", "\\Sigma", !0);
c(f, g, P, "Υ", "\\Upsilon", !0);
c(f, g, P, "Φ", "\\Phi", !0);
c(f, g, P, "Ψ", "\\Psi", !0);
c(f, g, P, "Ω", "\\Omega", !0);
c(f, g, P, "A", "Α");
c(f, g, P, "B", "Β");
c(f, g, P, "E", "Ε");
c(f, g, P, "Z", "Ζ");
c(f, g, P, "H", "Η");
c(f, g, P, "I", "Ι");
c(f, g, P, "K", "Κ");
c(f, g, P, "M", "Μ");
c(f, g, P, "N", "Ν");
c(f, g, P, "O", "Ο");
c(f, g, P, "P", "Ρ");
c(f, g, P, "T", "Τ");
c(f, g, P, "X", "Χ");
c(f, g, P, "¬", "\\neg", !0);
c(f, g, P, "¬", "\\lnot");
c(f, g, P, "⊤", "\\top");
c(f, g, P, "⊥", "\\bot");
c(f, g, P, "∅", "\\emptyset");
c(f, D, P, "∅", "\\varnothing");
c(f, g, Le, "α", "\\alpha", !0);
c(f, g, Le, "β", "\\beta", !0);
c(f, g, Le, "γ", "\\gamma", !0);
c(f, g, Le, "δ", "\\delta", !0);
c(f, g, Le, "ϵ", "\\epsilon", !0);
c(f, g, Le, "ζ", "\\zeta", !0);
c(f, g, Le, "η", "\\eta", !0);
c(f, g, Le, "θ", "\\theta", !0);
c(f, g, Le, "ι", "\\iota", !0);
c(f, g, Le, "κ", "\\kappa", !0);
c(f, g, Le, "λ", "\\lambda", !0);
c(f, g, Le, "μ", "\\mu", !0);
c(f, g, Le, "ν", "\\nu", !0);
c(f, g, Le, "ξ", "\\xi", !0);
c(f, g, Le, "ο", "\\omicron", !0);
c(f, g, Le, "π", "\\pi", !0);
c(f, g, Le, "ρ", "\\rho", !0);
c(f, g, Le, "σ", "\\sigma", !0);
c(f, g, Le, "τ", "\\tau", !0);
c(f, g, Le, "υ", "\\upsilon", !0);
c(f, g, Le, "ϕ", "\\phi", !0);
c(f, g, Le, "χ", "\\chi", !0);
c(f, g, Le, "ψ", "\\psi", !0);
c(f, g, Le, "ω", "\\omega", !0);
c(f, g, Le, "ε", "\\varepsilon", !0);
c(f, g, Le, "ϑ", "\\vartheta", !0);
c(f, g, Le, "ϖ", "\\varpi", !0);
c(f, g, Le, "ϱ", "\\varrho", !0);
c(f, g, Le, "ς", "\\varsigma", !0);
c(f, g, Le, "φ", "\\varphi", !0);
c(f, g, be, "∗", "*", !0);
c(f, g, be, "+", "+");
c(f, g, be, "−", "-", !0);
c(f, g, be, "⋅", "\\cdot", !0);
c(f, g, be, "∘", "\\circ", !0);
c(f, g, be, "÷", "\\div", !0);
c(f, g, be, "±", "\\pm", !0);
c(f, g, be, "×", "\\times", !0);
c(f, g, be, "∩", "\\cap", !0);
c(f, g, be, "∪", "\\cup", !0);
c(f, g, be, "∖", "\\setminus", !0);
c(f, g, be, "∧", "\\land");
c(f, g, be, "∨", "\\lor");
c(f, g, be, "∧", "\\wedge", !0);
c(f, g, be, "∨", "\\vee", !0);
c(f, g, P, "√", "\\surd");
c(f, g, wn, "⟨", "\\langle", !0);
c(f, g, wn, "∣", "\\lvert");
c(f, g, wn, "∥", "\\lVert");
c(f, g, tn, "?", "?");
c(f, g, tn, "!", "!");
c(f, g, tn, "⟩", "\\rangle", !0);
c(f, g, tn, "∣", "\\rvert");
c(f, g, tn, "∥", "\\rVert");
c(f, g, N, "=", "=");
c(f, g, N, ":", ":");
c(f, g, N, "≈", "\\approx", !0);
c(f, g, N, "≅", "\\cong", !0);
c(f, g, N, "≥", "\\ge");
c(f, g, N, "≥", "\\geq", !0);
c(f, g, N, "←", "\\gets");
c(f, g, N, ">", "\\gt", !0);
c(f, g, N, "∈", "\\in", !0);
c(f, g, N, "", "\\@not");
c(f, g, N, "⊂", "\\subset", !0);
c(f, g, N, "⊃", "\\supset", !0);
c(f, g, N, "⊆", "\\subseteq", !0);
c(f, g, N, "⊇", "\\supseteq", !0);
c(f, D, N, "⊈", "\\nsubseteq", !0);
c(f, D, N, "⊉", "\\nsupseteq", !0);
c(f, g, N, "⊨", "\\models");
c(f, g, N, "←", "\\leftarrow", !0);
c(f, g, N, "≤", "\\le");
c(f, g, N, "≤", "\\leq", !0);
c(f, g, N, "<", "\\lt", !0);
c(f, g, N, "→", "\\rightarrow", !0);
c(f, g, N, "→", "\\to");
c(f, D, N, "≱", "\\ngeq", !0);
c(f, D, N, "≰", "\\nleq", !0);
c(f, g, Er, " ", "\\ ");
c(f, g, Er, " ", "\\space");
c(f, g, Er, " ", "\\nobreakspace");
c(J, g, Er, " ", "\\ ");
c(J, g, Er, " ", " ");
c(J, g, Er, " ", "\\space");
c(J, g, Er, " ", "\\nobreakspace");
c(f, g, Er, null, "\\nobreak");
c(f, g, Er, null, "\\allowbreak");
c(f, g, Qs, ",", ",");
c(f, g, Qs, ";", ";");
c(f, D, be, "⊼", "\\barwedge", !0);
c(f, D, be, "⊻", "\\veebar", !0);
c(f, g, be, "⊙", "\\odot", !0);
c(f, g, be, "⊕", "\\oplus", !0);
c(f, g, be, "⊗", "\\otimes", !0);
c(f, g, P, "∂", "\\partial", !0);
c(f, g, be, "⊘", "\\oslash", !0);
c(f, D, be, "⊚", "\\circledcirc", !0);
c(f, D, be, "⊡", "\\boxdot", !0);
c(f, g, be, "△", "\\bigtriangleup");
c(f, g, be, "▽", "\\bigtriangledown");
c(f, g, be, "†", "\\dagger");
c(f, g, be, "⋄", "\\diamond");
c(f, g, be, "⋆", "\\star");
c(f, g, be, "◃", "\\triangleleft");
c(f, g, be, "▹", "\\triangleright");
c(f, g, wn, "{", "\\{");
c(J, g, P, "{", "\\{");
c(J, g, P, "{", "\\textbraceleft");
c(f, g, tn, "}", "\\}");
c(J, g, P, "}", "\\}");
c(J, g, P, "}", "\\textbraceright");
c(f, g, wn, "{", "\\lbrace");
c(f, g, tn, "}", "\\rbrace");
c(f, g, wn, "[", "\\lbrack", !0);
c(J, g, P, "[", "\\lbrack", !0);
c(f, g, tn, "]", "\\rbrack", !0);
c(J, g, P, "]", "\\rbrack", !0);
c(f, g, wn, "(", "\\lparen", !0);
c(f, g, tn, ")", "\\rparen", !0);
c(J, g, P, "<", "\\textless", !0);
c(J, g, P, ">", "\\textgreater", !0);
c(f, g, wn, "⌊", "\\lfloor", !0);
c(f, g, tn, "⌋", "\\rfloor", !0);
c(f, g, wn, "⌈", "\\lceil", !0);
c(f, g, tn, "⌉", "\\rceil", !0);
c(f, g, P, "\\", "\\backslash");
c(f, g, P, "∣", "|");
c(f, g, P, "∣", "\\vert");
c(J, g, P, "|", "\\textbar", !0);
c(f, g, P, "∥", "\\|");
c(f, g, P, "∥", "\\Vert");
c(J, g, P, "∥", "\\textbardbl");
c(J, g, P, "~", "\\textasciitilde");
c(J, g, P, "\\", "\\textbackslash");
c(J, g, P, "^", "\\textasciicircum");
c(f, g, N, "↑", "\\uparrow", !0);
c(f, g, N, "⇑", "\\Uparrow", !0);
c(f, g, N, "↓", "\\downarrow", !0);
c(f, g, N, "⇓", "\\Downarrow", !0);
c(f, g, N, "↕", "\\updownarrow", !0);
c(f, g, N, "⇕", "\\Updownarrow", !0);
c(f, g, Tt, "∐", "\\coprod");
c(f, g, Tt, "⋁", "\\bigvee");
c(f, g, Tt, "⋀", "\\bigwedge");
c(f, g, Tt, "⨄", "\\biguplus");
c(f, g, Tt, "⋂", "\\bigcap");
c(f, g, Tt, "⋃", "\\bigcup");
c(f, g, Tt, "∫", "\\int");
c(f, g, Tt, "∫", "\\intop");
c(f, g, Tt, "∬", "\\iint");
c(f, g, Tt, "∭", "\\iiint");
c(f, g, Tt, "∏", "\\prod");
c(f, g, Tt, "∑", "\\sum");
c(f, g, Tt, "⨂", "\\bigotimes");
c(f, g, Tt, "⨁", "\\bigoplus");
c(f, g, Tt, "⨀", "\\bigodot");
c(f, g, Tt, "∮", "\\oint");
c(f, g, Tt, "∯", "\\oiint");
c(f, g, Tt, "∰", "\\oiiint");
c(f, g, Tt, "⨆", "\\bigsqcup");
c(f, g, Tt, "∫", "\\smallint");
c(J, g, Ui, "…", "\\textellipsis");
c(f, g, Ui, "…", "\\mathellipsis");
c(J, g, Ui, "…", "\\ldots", !0);
c(f, g, Ui, "…", "\\ldots", !0);
c(f, g, Ui, "⋯", "\\@cdots", !0);
c(f, g, Ui, "⋱", "\\ddots", !0);
c(f, g, P, "⋮", "\\varvdots");
c(J, g, P, "⋮", "\\varvdots");
c(f, g, at, "ˊ", "\\acute");
c(f, g, at, "ˋ", "\\grave");
c(f, g, at, "¨", "\\ddot");
c(f, g, at, "~", "\\tilde");
c(f, g, at, "ˉ", "\\bar");
c(f, g, at, "˘", "\\breve");
c(f, g, at, "ˇ", "\\check");
c(f, g, at, "^", "\\hat");
c(f, g, at, "⃗", "\\vec");
c(f, g, at, "˙", "\\dot");
c(f, g, at, "˚", "\\mathring");
c(f, g, Le, "", "\\@imath");
c(f, g, Le, "", "\\@jmath");
c(f, g, P, "ı", "ı");
c(f, g, P, "ȷ", "ȷ");
c(J, g, P, "ı", "\\i", !0);
c(J, g, P, "ȷ", "\\j", !0);
c(J, g, P, "ß", "\\ss", !0);
c(J, g, P, "æ", "\\ae", !0);
c(J, g, P, "œ", "\\oe", !0);
c(J, g, P, "ø", "\\o", !0);
c(J, g, P, "Æ", "\\AE", !0);
c(J, g, P, "Œ", "\\OE", !0);
c(J, g, P, "Ø", "\\O", !0);
c(J, g, at, "ˊ", "\\'");
c(J, g, at, "ˋ", "\\`");
c(J, g, at, "ˆ", "\\^");
c(J, g, at, "˜", "\\~");
c(J, g, at, "ˉ", "\\=");
c(J, g, at, "˘", "\\u");
c(J, g, at, "˙", "\\.");
c(J, g, at, "¸", "\\c");
c(J, g, at, "˚", "\\r");
c(J, g, at, "ˇ", "\\v");
c(J, g, at, "¨", '\\"');
c(J, g, at, "˝", "\\H");
c(J, g, at, "◯", "\\textcircled");
var Sd = { "--": !0, "---": !0, "``": !0, "''": !0 };
c(J, g, P, "–", "--", !0);
c(J, g, P, "–", "\\textendash");
c(J, g, P, "—", "---", !0);
c(J, g, P, "—", "\\textemdash");
c(J, g, P, "‘", "`", !0);
c(J, g, P, "‘", "\\textquoteleft");
c(J, g, P, "’", "'", !0);
c(J, g, P, "’", "\\textquoteright");
c(J, g, P, "“", "``", !0);
c(J, g, P, "“", "\\textquotedblleft");
c(J, g, P, "”", "''", !0);
c(J, g, P, "”", "\\textquotedblright");
c(f, g, P, "°", "\\degree", !0);
c(J, g, P, "°", "\\degree");
c(J, g, P, "°", "\\textdegree", !0);
c(f, g, P, "£", "\\pounds");
c(f, g, P, "£", "\\mathsterling", !0);
c(J, g, P, "£", "\\pounds");
c(J, g, P, "£", "\\textsterling", !0);
c(f, D, P, "✠", "\\maltese");
c(J, D, P, "✠", "\\maltese");
var ru = '0123456789/@."';
for (var Eo = 0; Eo < ru.length; Eo++) {
  var iu = ru.charAt(Eo);
  c(f, g, P, iu, iu);
}
var au = '0123456789!@*()-=+";:?/.,';
for (var Co = 0; Co < au.length; Co++) {
  var su = au.charAt(Co);
  c(J, g, P, su, su);
}
var Fs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (var Lo = 0; Lo < Fs.length; Lo++) {
  var Ya = Fs.charAt(Lo);
  (c(f, g, Le, Ya, Ya), c(J, g, P, Ya, Ya));
}
c(f, D, P, "C", "ℂ");
c(J, D, P, "C", "ℂ");
c(f, D, P, "H", "ℍ");
c(J, D, P, "H", "ℍ");
c(f, D, P, "N", "ℕ");
c(J, D, P, "N", "ℕ");
c(f, D, P, "P", "ℙ");
c(J, D, P, "P", "ℙ");
c(f, D, P, "Q", "ℚ");
c(J, D, P, "Q", "ℚ");
c(f, D, P, "R", "ℝ");
c(J, D, P, "R", "ℝ");
c(f, D, P, "Z", "ℤ");
c(J, D, P, "Z", "ℤ");
c(f, g, Le, "h", "ℎ");
c(J, g, Le, "h", "ℎ");
var ze = "";
for (var Yt = 0; Yt < Fs.length; Yt++) {
  var dt = Fs.charAt(Yt);
  ((ze = String.fromCharCode(55349, 56320 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56372 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56424 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56580 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56684 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56736 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56788 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56840 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    (ze = String.fromCharCode(55349, 56944 + Yt)),
    c(f, g, Le, dt, ze),
    c(J, g, P, dt, ze),
    Yt < 26 &&
      ((ze = String.fromCharCode(55349, 56632 + Yt)),
      c(f, g, Le, dt, ze),
      c(J, g, P, dt, ze),
      (ze = String.fromCharCode(55349, 56476 + Yt)),
      c(f, g, Le, dt, ze),
      c(J, g, P, dt, ze)));
}
ze = "𝕜";
c(f, g, Le, "k", ze);
c(J, g, P, "k", ze);
for (var ii = 0; ii < 10; ii++) {
  var Dr = ii.toString();
  ((ze = String.fromCharCode(55349, 57294 + ii)),
    c(f, g, Le, Dr, ze),
    c(J, g, P, Dr, ze),
    (ze = String.fromCharCode(55349, 57314 + ii)),
    c(f, g, Le, Dr, ze),
    c(J, g, P, Dr, ze),
    (ze = String.fromCharCode(55349, 57324 + ii)),
    c(f, g, Le, Dr, ze),
    c(J, g, P, Dr, ze),
    (ze = String.fromCharCode(55349, 57334 + ii)),
    c(f, g, Le, Dr, ze),
    c(J, g, P, Dr, ze));
}
var a0 = "ÐÞþ";
for (var Mo = 0; Mo < a0.length; Mo++) {
  var Xa = a0.charAt(Mo);
  (c(f, g, Le, Xa, Xa), c(J, g, P, Xa, Xa));
}
var Ka = [
    ["mathbf", "textbf", "Main-Bold"],
    ["mathbf", "textbf", "Main-Bold"],
    ["mathnormal", "textit", "Math-Italic"],
    ["mathnormal", "textit", "Math-Italic"],
    ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
    ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
    ["mathscr", "textscr", "Script-Regular"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["mathfrak", "textfrak", "Fraktur-Regular"],
    ["mathfrak", "textfrak", "Fraktur-Regular"],
    ["mathbb", "textbb", "AMS-Regular"],
    ["mathbb", "textbb", "AMS-Regular"],
    ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
    ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
    ["mathsf", "textsf", "SansSerif-Regular"],
    ["mathsf", "textsf", "SansSerif-Regular"],
    ["mathboldsf", "textboldsf", "SansSerif-Bold"],
    ["mathboldsf", "textboldsf", "SansSerif-Bold"],
    ["mathitsf", "textitsf", "SansSerif-Italic"],
    ["mathitsf", "textitsf", "SansSerif-Italic"],
    ["", "", ""],
    ["", "", ""],
    ["mathtt", "texttt", "Typewriter-Regular"],
    ["mathtt", "texttt", "Typewriter-Regular"],
  ],
  ou = [
    ["mathbf", "textbf", "Main-Bold"],
    ["", "", ""],
    ["mathsf", "textsf", "SansSerif-Regular"],
    ["mathboldsf", "textboldsf", "SansSerif-Bold"],
    ["mathtt", "texttt", "Typewriter-Regular"],
  ],
  Kg = function (e, n) {
    var r = e.charCodeAt(0),
      i = e.charCodeAt(1),
      a = (r - 55296) * 1024 + (i - 56320) + 65536,
      s = n === "math" ? 0 : 1;
    if (119808 <= a && a < 120484) {
      var o = Math.floor((a - 119808) / 26);
      return [Ka[o][2], Ka[o][s]];
    } else if (120782 <= a && a <= 120831) {
      var l = Math.floor((a - 120782) / 10);
      return [ou[l][2], ou[l][s]];
    } else {
      if (a === 120485 || a === 120486) return [Ka[0][2], Ka[0][s]];
      if (120486 < a && a < 120782) return ["", ""];
      throw new ae("Unsupported character: " + e);
    }
  },
  Zs = function (e, n, r) {
    return (
      tt[r][e] && tt[r][e].replace && (e = tt[r][e].replace),
      { value: e, metrics: T0(e, n, r) }
    );
  },
  $n = function (e, n, r, i, a) {
    var s = Zs(e, n, r),
      o = s.metrics;
    e = s.value;
    var l;
    if (o) {
      var u = o.italic;
      ((r === "text" || (i && i.font === "mathit")) && (u = 0),
        (l = new Gn(e, o.height, o.depth, u, o.skew, o.width, a)));
    } else
      (typeof console < "u" &&
        console.warn(
          "No character metrics " +
            ("for '" + e + "' in style '" + n + "' and mode '" + r + "'"),
        ),
        (l = new Gn(e, 0, 0, 0, 0, 0, a)));
    if (i) {
      ((l.maxFontSize = i.sizeMultiplier),
        i.style.isTight() && l.classes.push("mtight"));
      var h = i.getColor();
      h && (l.style.color = h);
    }
    return l;
  },
  Qg = function (e, n, r, i) {
    return (
      i === void 0 && (i = []),
      r.font === "boldsymbol" && Zs(e, "Main-Bold", n).metrics
        ? $n(e, "Main-Bold", n, r, i.concat(["mathbf"]))
        : e === "\\" || tt[n][e].font === "main"
          ? $n(e, "Main-Regular", n, r, i)
          : $n(e, "AMS-Regular", n, r, i.concat(["amsrm"]))
    );
  },
  Zg = function (e, n, r, i, a) {
    return a !== "textord" && Zs(e, "Math-BoldItalic", n).metrics
      ? { fontName: "Math-BoldItalic", fontClass: "boldsymbol" }
      : { fontName: "Main-Bold", fontClass: "mathbf" };
  },
  Jg = function (e, n, r) {
    var i = e.mode,
      a = e.text,
      s = ["mord"],
      o = i === "math" || (i === "text" && n.font),
      l = o ? n.font : n.fontFamily,
      u = "",
      h = "";
    if ((a.charCodeAt(0) === 55349 && ([u, h] = Kg(a, i)), u.length > 0))
      return $n(a, u, i, n, s.concat(h));
    if (l) {
      var d, p;
      if (l === "boldsymbol") {
        var m = Zg(a, i, n, s, r);
        ((d = m.fontName), (p = [m.fontClass]));
      } else
        o
          ? ((d = Ed[l].fontName), (p = [l]))
          : ((d = Qa(l, n.fontWeight, n.fontShape)),
            (p = [l, n.fontWeight, n.fontShape]));
      if (Zs(a, d, i).metrics) return $n(a, d, i, n, s.concat(p));
      if (Sd.hasOwnProperty(a) && d.slice(0, 10) === "Typewriter") {
        for (var y = [], S = 0; S < a.length; S++)
          y.push($n(a[S], d, i, n, s.concat(p)));
        return Td(y);
      }
    }
    if (r === "mathord")
      return $n(a, "Math-Italic", i, n, s.concat(["mathnormal"]));
    if (r === "textord") {
      var A = tt[i][a] && tt[i][a].font;
      if (A === "ams") {
        var C = Qa("amsrm", n.fontWeight, n.fontShape);
        return $n(a, C, i, n, s.concat("amsrm", n.fontWeight, n.fontShape));
      } else if (A === "main" || !A) {
        var b = Qa("textrm", n.fontWeight, n.fontShape);
        return $n(a, b, i, n, s.concat(n.fontWeight, n.fontShape));
      } else {
        var T = Qa(A, n.fontWeight, n.fontShape);
        return $n(a, T, i, n, s.concat(T, n.fontWeight, n.fontShape));
      }
    } else throw new Error("unexpected type: " + r + " in makeOrd");
  },
  e2 = (t, e) => {
    if (
      Xr(t.classes) !== Xr(e.classes) ||
      t.skew !== e.skew ||
      t.maxFontSize !== e.maxFontSize
    )
      return !1;
    if (t.classes.length === 1) {
      var n = t.classes[0];
      if (n === "mbin" || n === "mord") return !1;
    }
    for (var r in t.style)
      if (t.style.hasOwnProperty(r) && t.style[r] !== e.style[r]) return !1;
    for (var i in e.style)
      if (e.style.hasOwnProperty(i) && t.style[i] !== e.style[i]) return !1;
    return !0;
  },
  t2 = (t) => {
    for (var e = 0; e < t.length - 1; e++) {
      var n = t[e],
        r = t[e + 1];
      n instanceof Gn &&
        r instanceof Gn &&
        e2(n, r) &&
        ((n.text += r.text),
        (n.height = Math.max(n.height, r.height)),
        (n.depth = Math.max(n.depth, r.depth)),
        (n.italic = r.italic),
        t.splice(e + 1, 1),
        e--);
    }
    return t;
  },
  E0 = function (e) {
    for (var n = 0, r = 0, i = 0, a = 0; a < e.children.length; a++) {
      var s = e.children[a];
      (s.height > n && (n = s.height),
        s.depth > r && (r = s.depth),
        s.maxFontSize > i && (i = s.maxFontSize));
    }
    ((e.height = n), (e.depth = r), (e.maxFontSize = i));
  },
  sn = function (e, n, r, i) {
    var a = new Ks(e, n, r, i);
    return (E0(a), a);
  },
  Ad = (t, e, n, r) => new Ks(t, e, n, r),
  n2 = function (e, n, r) {
    var i = sn([e], [], n);
    return (
      (i.height = Math.max(
        r || n.fontMetrics().defaultRuleThickness,
        n.minRuleThickness,
      )),
      (i.style.borderBottomWidth = ce(i.height)),
      (i.maxFontSize = 1),
      i
    );
  },
  r2 = function (e, n, r, i) {
    var a = new kd(e, n, r, i);
    return (E0(a), a);
  },
  Td = function (e) {
    var n = new Ma(e);
    return (E0(n), n);
  },
  i2 = function (e, n) {
    return e instanceof Ma ? sn([], [e], n) : e;
  },
  a2 = function (e) {
    if (e.positionType === "individualShift") {
      for (
        var n = e.children,
          r = [n[0]],
          i = -n[0].shift - n[0].elem.depth,
          a = i,
          s = 1;
        s < n.length;
        s++
      ) {
        var o = -n[s].shift - a - n[s].elem.depth,
          l = o - (n[s - 1].elem.height + n[s - 1].elem.depth);
        ((a = a + o), r.push({ type: "kern", size: l }), r.push(n[s]));
      }
      return { children: r, depth: i };
    }
    var u;
    if (e.positionType === "top") {
      for (var h = e.positionData, d = 0; d < e.children.length; d++) {
        var p = e.children[d];
        h -= p.type === "kern" ? p.size : p.elem.height + p.elem.depth;
      }
      u = h;
    } else if (e.positionType === "bottom") u = -e.positionData;
    else {
      var m = e.children[0];
      if (m.type !== "elem")
        throw new Error('First child must have type "elem".');
      if (e.positionType === "shift") u = -m.elem.depth - e.positionData;
      else if (e.positionType === "firstBaseline") u = -m.elem.depth;
      else throw new Error("Invalid positionType " + e.positionType + ".");
    }
    return { children: e.children, depth: u };
  },
  s2 = function (e, n) {
    for (
      var { children: r, depth: i } = a2(e), a = 0, s = 0;
      s < r.length;
      s++
    ) {
      var o = r[s];
      if (o.type === "elem") {
        var l = o.elem;
        a = Math.max(a, l.maxFontSize, l.height);
      }
    }
    a += 2;
    var u = sn(["pstrut"], []);
    u.style.height = ce(a);
    for (var h = [], d = i, p = i, m = i, y = 0; y < r.length; y++) {
      var S = r[y];
      if (S.type === "kern") m += S.size;
      else {
        var A = S.elem,
          C = S.wrapperClasses || [],
          b = S.wrapperStyle || {},
          T = sn(C, [u, A], void 0, b);
        ((T.style.top = ce(-a - m - A.depth)),
          S.marginLeft && (T.style.marginLeft = S.marginLeft),
          S.marginRight && (T.style.marginRight = S.marginRight),
          h.push(T),
          (m += A.height + A.depth));
      }
      ((d = Math.min(d, m)), (p = Math.max(p, m)));
    }
    var v = sn(["vlist"], h);
    v.style.height = ce(p);
    var E;
    if (d < 0) {
      var x = sn([], []),
        _ = sn(["vlist"], [x]);
      _.style.height = ce(-d);
      var j = sn(["vlist-s"], [new Gn("​")]);
      E = [sn(["vlist-r"], [v, j]), sn(["vlist-r"], [_])];
    } else E = [sn(["vlist-r"], [v])];
    var F = sn(["vlist-t"], E);
    return (
      E.length === 2 && F.classes.push("vlist-t2"),
      (F.height = p),
      (F.depth = -d),
      F
    );
  },
  o2 = (t, e) => {
    var n = sn(["mspace"], [], e),
      r = ot(t, e);
    return ((n.style.marginRight = ce(r)), n);
  },
  Qa = function (e, n, r) {
    var i = "";
    switch (e) {
      case "amsrm":
        i = "AMS";
        break;
      case "textrm":
        i = "Main";
        break;
      case "textsf":
        i = "SansSerif";
        break;
      case "texttt":
        i = "Typewriter";
        break;
      default:
        i = e;
    }
    var a;
    return (
      n === "textbf" && r === "textit"
        ? (a = "BoldItalic")
        : n === "textbf"
          ? (a = "Bold")
          : n === "textit"
            ? (a = "Italic")
            : (a = "Regular"),
      i + "-" + a
    );
  },
  Ed = {
    mathbf: { variant: "bold", fontName: "Main-Bold" },
    mathrm: { variant: "normal", fontName: "Main-Regular" },
    textit: { variant: "italic", fontName: "Main-Italic" },
    mathit: { variant: "italic", fontName: "Main-Italic" },
    mathnormal: { variant: "italic", fontName: "Math-Italic" },
    mathsfit: { variant: "sans-serif-italic", fontName: "SansSerif-Italic" },
    mathbb: { variant: "double-struck", fontName: "AMS-Regular" },
    mathcal: { variant: "script", fontName: "Caligraphic-Regular" },
    mathfrak: { variant: "fraktur", fontName: "Fraktur-Regular" },
    mathscr: { variant: "script", fontName: "Script-Regular" },
    mathsf: { variant: "sans-serif", fontName: "SansSerif-Regular" },
    mathtt: { variant: "monospace", fontName: "Typewriter-Regular" },
  },
  Cd = {
    vec: ["vec", 0.471, 0.714],
    oiintSize1: ["oiintSize1", 0.957, 0.499],
    oiintSize2: ["oiintSize2", 1.472, 0.659],
    oiiintSize1: ["oiiintSize1", 1.304, 0.499],
    oiiintSize2: ["oiiintSize2", 1.98, 0.659],
  },
  l2 = function (e, n) {
    var [r, i, a] = Cd[e],
      s = new fi(r),
      o = new Kr([s], {
        width: ce(i),
        height: ce(a),
        style: "width:" + ce(i),
        viewBox: "0 0 " + 1e3 * i + " " + 1e3 * a,
        preserveAspectRatio: "xMinYMin",
      }),
      l = Ad(["overlay"], [o], n);
    return (
      (l.height = a),
      (l.style.height = ce(a)),
      (l.style.width = ce(i)),
      l
    );
  },
  W = {
    fontMap: Ed,
    makeSymbol: $n,
    mathsym: Qg,
    makeSpan: sn,
    makeSvgSpan: Ad,
    makeLineSpan: n2,
    makeAnchor: r2,
    makeFragment: Td,
    wrapFragment: i2,
    makeVList: s2,
    makeOrd: Jg,
    makeGlue: o2,
    staticSvg: l2,
    svgData: Cd,
    tryCombineChars: t2,
  },
  st = { number: 3, unit: "mu" },
  ai = { number: 4, unit: "mu" },
  fr = { number: 5, unit: "mu" },
  u2 = {
    mord: { mop: st, mbin: ai, mrel: fr, minner: st },
    mop: { mord: st, mop: st, mrel: fr, minner: st },
    mbin: { mord: ai, mop: ai, mopen: ai, minner: ai },
    mrel: { mord: fr, mop: fr, mopen: fr, minner: fr },
    mopen: {},
    mclose: { mop: st, mbin: ai, mrel: fr, minner: st },
    mpunct: {
      mord: st,
      mop: st,
      mrel: fr,
      mopen: st,
      mclose: st,
      mpunct: st,
      minner: st,
    },
    minner: {
      mord: st,
      mop: st,
      mbin: ai,
      mrel: fr,
      mopen: st,
      mpunct: st,
      minner: st,
    },
  },
  c2 = {
    mord: { mop: st },
    mop: { mord: st, mop: st },
    mbin: {},
    mrel: {},
    mopen: {},
    mclose: { mop: st },
    mpunct: {},
    minner: { mop: st },
  },
  Ld = {},
  _s = {},
  Os = {};
function me(t) {
  for (
    var {
        type: e,
        names: n,
        props: r,
        handler: i,
        htmlBuilder: a,
        mathmlBuilder: s,
      } = t,
      o = {
        type: e,
        numArgs: r.numArgs,
        argTypes: r.argTypes,
        allowedInArgument: !!r.allowedInArgument,
        allowedInText: !!r.allowedInText,
        allowedInMath: r.allowedInMath === void 0 ? !0 : r.allowedInMath,
        numOptionalArgs: r.numOptionalArgs || 0,
        infix: !!r.infix,
        primitive: !!r.primitive,
        handler: i,
      },
      l = 0;
    l < n.length;
    ++l
  )
    Ld[n[l]] = o;
  e && (a && (_s[e] = a), s && (Os[e] = s));
}
function mi(t) {
  var { type: e, htmlBuilder: n, mathmlBuilder: r } = t;
  me({
    type: e,
    names: [],
    props: { numArgs: 0 },
    handler() {
      throw new Error("Should never be called.");
    },
    htmlBuilder: n,
    mathmlBuilder: r,
  });
}
var Bs = function (e) {
    return e.type === "ordgroup" && e.body.length === 1 ? e.body[0] : e;
  },
  bt = function (e) {
    return e.type === "ordgroup" ? e.body : [e];
  },
  Ar = W.makeSpan,
  d2 = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"],
  h2 = ["rightmost", "mrel", "mclose", "mpunct"],
  f2 = {
    display: Me.DISPLAY,
    text: Me.TEXT,
    script: Me.SCRIPT,
    scriptscript: Me.SCRIPTSCRIPT,
  },
  m2 = {
    mord: "mord",
    mop: "mop",
    mbin: "mbin",
    mrel: "mrel",
    mopen: "mopen",
    mclose: "mclose",
    mpunct: "mpunct",
    minner: "minner",
  },
  Lt = function (e, n, r, i) {
    i === void 0 && (i = [null, null]);
    for (var a = [], s = 0; s < e.length; s++) {
      var o = Ve(e[s], n);
      if (o instanceof Ma) {
        var l = o.children;
        a.push(...l);
      } else a.push(o);
    }
    if ((W.tryCombineChars(a), !r)) return a;
    var u = n;
    if (e.length === 1) {
      var h = e[0];
      h.type === "sizing"
        ? (u = n.havingSize(h.size))
        : h.type === "styling" && (u = n.havingStyle(f2[h.style]));
    }
    var d = Ar([i[0] || "leftmost"], [], n),
      p = Ar([i[1] || "rightmost"], [], n),
      m = r === "root";
    return (
      lu(
        a,
        (y, S) => {
          var A = S.classes[0],
            C = y.classes[0];
          A === "mbin" && Ee.contains(h2, C)
            ? (S.classes[0] = "mord")
            : C === "mbin" && Ee.contains(d2, A) && (y.classes[0] = "mord");
        },
        { node: d },
        p,
        m,
      ),
      lu(
        a,
        (y, S) => {
          var A = s0(S),
            C = s0(y),
            b = A && C ? (y.hasClass("mtight") ? c2[A][C] : u2[A][C]) : null;
          if (b) return W.makeGlue(b, u);
        },
        { node: d },
        p,
        m,
      ),
      a
    );
  },
  lu = function t(e, n, r, i, a) {
    i && e.push(i);
    for (var s = 0; s < e.length; s++) {
      var o = e[s],
        l = Md(o);
      if (l) {
        t(l.children, n, r, null, a);
        continue;
      }
      var u = !o.hasClass("mspace");
      if (u) {
        var h = n(o, r.node);
        h && (r.insertAfter ? r.insertAfter(h) : (e.unshift(h), s++));
      }
      (u
        ? (r.node = o)
        : a && o.hasClass("newline") && (r.node = Ar(["leftmost"])),
        (r.insertAfter = ((d) => (p) => {
          (e.splice(d + 1, 0, p), s++);
        })(s)));
    }
    i && e.pop();
  },
  Md = function (e) {
    return e instanceof Ma ||
      e instanceof kd ||
      (e instanceof Ks && e.hasClass("enclosing"))
      ? e
      : null;
  },
  p2 = function t(e, n) {
    var r = Md(e);
    if (r) {
      var i = r.children;
      if (i.length) {
        if (n === "right") return t(i[i.length - 1], "right");
        if (n === "left") return t(i[0], "left");
      }
    }
    return e;
  },
  s0 = function (e, n) {
    return e ? (n && (e = p2(e, n)), m2[e.classes[0]] || null) : null;
  },
  wa = function (e, n) {
    var r = ["nulldelimiter"].concat(e.baseSizingClasses());
    return Ar(n.concat(r));
  },
  Ve = function (e, n, r) {
    if (!e) return Ar();
    if (_s[e.type]) {
      var i = _s[e.type](e, n);
      if (r && n.size !== r.size) {
        i = Ar(n.sizingClasses(r), [i], n);
        var a = n.sizeMultiplier / r.sizeMultiplier;
        ((i.height *= a), (i.depth *= a));
      }
      return i;
    } else throw new ae("Got group of unknown type: '" + e.type + "'");
  };
function Za(t, e) {
  var n = Ar(["base"], t, e),
    r = Ar(["strut"]);
  return (
    (r.style.height = ce(n.height + n.depth)),
    n.depth && (r.style.verticalAlign = ce(-n.depth)),
    n.children.unshift(r),
    n
  );
}
function uu(t, e) {
  var n = null;
  t.length === 1 && t[0].type === "tag" && ((n = t[0].tag), (t = t[0].body));
  var r = Lt(t, e, "root"),
    i;
  r.length === 2 && r[1].hasClass("tag") && (i = r.pop());
  for (var a = [], s = [], o = 0; o < r.length; o++)
    if (
      (s.push(r[o]),
      r[o].hasClass("mbin") ||
        r[o].hasClass("mrel") ||
        r[o].hasClass("allowbreak"))
    ) {
      for (
        var l = !1;
        o < r.length - 1 &&
        r[o + 1].hasClass("mspace") &&
        !r[o + 1].hasClass("newline");

      )
        (o++, s.push(r[o]), r[o].hasClass("nobreak") && (l = !0));
      l || (a.push(Za(s, e)), (s = []));
    } else
      r[o].hasClass("newline") &&
        (s.pop(), s.length > 0 && (a.push(Za(s, e)), (s = [])), a.push(r[o]));
  s.length > 0 && a.push(Za(s, e));
  var u;
  n
    ? ((u = Za(Lt(n, e, !0))), (u.classes = ["tag"]), a.push(u))
    : i && a.push(i);
  var h = Ar(["katex-html"], a);
  if ((h.setAttribute("aria-hidden", "true"), u)) {
    var d = u.children[0];
    ((d.style.height = ce(h.height + h.depth)),
      h.depth && (d.style.verticalAlign = ce(-h.depth)));
  }
  return h;
}
function zd(t) {
  return new Ma(t);
}
class pn {
  constructor(e, n, r) {
    ((this.type = void 0),
      (this.attributes = void 0),
      (this.children = void 0),
      (this.classes = void 0),
      (this.type = e),
      (this.attributes = {}),
      (this.children = n || []),
      (this.classes = r || []));
  }
  setAttribute(e, n) {
    this.attributes[e] = n;
  }
  getAttribute(e) {
    return this.attributes[e];
  }
  toNode() {
    var e = document.createElementNS(
      "http://www.w3.org/1998/Math/MathML",
      this.type,
    );
    for (var n in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, n) &&
        e.setAttribute(n, this.attributes[n]);
    this.classes.length > 0 && (e.className = Xr(this.classes));
    for (var r = 0; r < this.children.length; r++)
      if (
        this.children[r] instanceof er &&
        this.children[r + 1] instanceof er
      ) {
        for (
          var i = this.children[r].toText() + this.children[++r].toText();
          this.children[r + 1] instanceof er;

        )
          i += this.children[++r].toText();
        e.appendChild(new er(i).toNode());
      } else e.appendChild(this.children[r].toNode());
    return e;
  }
  toMarkup() {
    var e = "<" + this.type;
    for (var n in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, n) &&
        ((e += " " + n + '="'),
        (e += Ee.escape(this.attributes[n])),
        (e += '"'));
    (this.classes.length > 0 &&
      (e += ' class ="' + Ee.escape(Xr(this.classes)) + '"'),
      (e += ">"));
    for (var r = 0; r < this.children.length; r++)
      e += this.children[r].toMarkup();
    return ((e += "</" + this.type + ">"), e);
  }
  toText() {
    return this.children.map((e) => e.toText()).join("");
  }
}
class er {
  constructor(e) {
    ((this.text = void 0), (this.text = e));
  }
  toNode() {
    return document.createTextNode(this.text);
  }
  toMarkup() {
    return Ee.escape(this.toText());
  }
  toText() {
    return this.text;
  }
}
class g2 {
  constructor(e) {
    ((this.width = void 0),
      (this.character = void 0),
      (this.width = e),
      e >= 0.05555 && e <= 0.05556
        ? (this.character = " ")
        : e >= 0.1666 && e <= 0.1667
          ? (this.character = " ")
          : e >= 0.2222 && e <= 0.2223
            ? (this.character = " ")
            : e >= 0.2777 && e <= 0.2778
              ? (this.character = "  ")
              : e >= -0.05556 && e <= -0.05555
                ? (this.character = " ⁣")
                : e >= -0.1667 && e <= -0.1666
                  ? (this.character = " ⁣")
                  : e >= -0.2223 && e <= -0.2222
                    ? (this.character = " ⁣")
                    : e >= -0.2778 && e <= -0.2777
                      ? (this.character = " ⁣")
                      : (this.character = null));
  }
  toNode() {
    if (this.character) return document.createTextNode(this.character);
    var e = document.createElementNS(
      "http://www.w3.org/1998/Math/MathML",
      "mspace",
    );
    return (e.setAttribute("width", ce(this.width)), e);
  }
  toMarkup() {
    return this.character
      ? "<mtext>" + this.character + "</mtext>"
      : '<mspace width="' + ce(this.width) + '"/>';
  }
  toText() {
    return this.character ? this.character : " ";
  }
}
var re = { MathNode: pn, TextNode: er, SpaceNode: g2, newDocumentFragment: zd },
  Pn = function (e, n, r) {
    return (
      tt[n][e] &&
        tt[n][e].replace &&
        e.charCodeAt(0) !== 55349 &&
        !(
          Sd.hasOwnProperty(e) &&
          r &&
          ((r.fontFamily && r.fontFamily.slice(4, 6) === "tt") ||
            (r.font && r.font.slice(4, 6) === "tt"))
        ) &&
        (e = tt[n][e].replace),
      new re.TextNode(e)
    );
  },
  C0 = function (e) {
    return e.length === 1 ? e[0] : new re.MathNode("mrow", e);
  },
  L0 = function (e, n) {
    if (n.fontFamily === "texttt") return "monospace";
    if (n.fontFamily === "textsf")
      return n.fontShape === "textit" && n.fontWeight === "textbf"
        ? "sans-serif-bold-italic"
        : n.fontShape === "textit"
          ? "sans-serif-italic"
          : n.fontWeight === "textbf"
            ? "bold-sans-serif"
            : "sans-serif";
    if (n.fontShape === "textit" && n.fontWeight === "textbf")
      return "bold-italic";
    if (n.fontShape === "textit") return "italic";
    if (n.fontWeight === "textbf") return "bold";
    var r = n.font;
    if (!r || r === "mathnormal") return null;
    var i = e.mode;
    if (r === "mathit") return "italic";
    if (r === "boldsymbol")
      return e.type === "textord" ? "bold" : "bold-italic";
    if (r === "mathbf") return "bold";
    if (r === "mathbb") return "double-struck";
    if (r === "mathsfit") return "sans-serif-italic";
    if (r === "mathfrak") return "fraktur";
    if (r === "mathscr" || r === "mathcal") return "script";
    if (r === "mathsf") return "sans-serif";
    if (r === "mathtt") return "monospace";
    var a = e.text;
    if (Ee.contains(["\\imath", "\\jmath"], a)) return null;
    tt[i][a] && tt[i][a].replace && (a = tt[i][a].replace);
    var s = W.fontMap[r].fontName;
    return T0(a, s, i) ? W.fontMap[r].variant : null;
  };
function zo(t) {
  if (!t) return !1;
  if (t.type === "mi" && t.children.length === 1) {
    var e = t.children[0];
    return e instanceof er && e.text === ".";
  } else if (
    t.type === "mo" &&
    t.children.length === 1 &&
    t.getAttribute("separator") === "true" &&
    t.getAttribute("lspace") === "0em" &&
    t.getAttribute("rspace") === "0em"
  ) {
    var n = t.children[0];
    return n instanceof er && n.text === ",";
  } else return !1;
}
var hn = function (e, n, r) {
    if (e.length === 1) {
      var i = Ze(e[0], n);
      return (
        r &&
          i instanceof pn &&
          i.type === "mo" &&
          (i.setAttribute("lspace", "0em"), i.setAttribute("rspace", "0em")),
        [i]
      );
    }
    for (var a = [], s, o = 0; o < e.length; o++) {
      var l = Ze(e[o], n);
      if (l instanceof pn && s instanceof pn) {
        if (
          l.type === "mtext" &&
          s.type === "mtext" &&
          l.getAttribute("mathvariant") === s.getAttribute("mathvariant")
        ) {
          s.children.push(...l.children);
          continue;
        } else if (l.type === "mn" && s.type === "mn") {
          s.children.push(...l.children);
          continue;
        } else if (zo(l) && s.type === "mn") {
          s.children.push(...l.children);
          continue;
        } else if (l.type === "mn" && zo(s))
          ((l.children = [...s.children, ...l.children]), a.pop());
        else if (
          (l.type === "msup" || l.type === "msub") &&
          l.children.length >= 1 &&
          (s.type === "mn" || zo(s))
        ) {
          var u = l.children[0];
          u instanceof pn &&
            u.type === "mn" &&
            ((u.children = [...s.children, ...u.children]), a.pop());
        } else if (s.type === "mi" && s.children.length === 1) {
          var h = s.children[0];
          if (
            h instanceof er &&
            h.text === "̸" &&
            (l.type === "mo" || l.type === "mi" || l.type === "mn")
          ) {
            var d = l.children[0];
            d instanceof er &&
              d.text.length > 0 &&
              ((d.text = d.text.slice(0, 1) + "̸" + d.text.slice(1)), a.pop());
          }
        }
      }
      (a.push(l), (s = l));
    }
    return a;
  },
  Qr = function (e, n, r) {
    return C0(hn(e, n, r));
  },
  Ze = function (e, n) {
    if (!e) return new re.MathNode("mrow");
    if (Os[e.type]) {
      var r = Os[e.type](e, n);
      return r;
    } else throw new ae("Got group of unknown type: '" + e.type + "'");
  };
function cu(t, e, n, r, i) {
  var a = hn(t, n),
    s;
  a.length === 1 &&
  a[0] instanceof pn &&
  Ee.contains(["mrow", "mtable"], a[0].type)
    ? (s = a[0])
    : (s = new re.MathNode("mrow", a));
  var o = new re.MathNode("annotation", [new re.TextNode(e)]);
  o.setAttribute("encoding", "application/x-tex");
  var l = new re.MathNode("semantics", [s, o]),
    u = new re.MathNode("math", [l]);
  (u.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML"),
    r && u.setAttribute("display", "block"));
  var h = i ? "katex" : "katex-mathml";
  return W.makeSpan([h], [u]);
}
var v2 = function (e) {
    return new pr({
      style: e.displayMode ? Me.DISPLAY : Me.TEXT,
      maxSize: e.maxSize,
      minRuleThickness: e.minRuleThickness,
    });
  },
  b2 = function (e, n) {
    if (n.displayMode) {
      var r = ["katex-display"];
      (n.leqno && r.push("leqno"),
        n.fleqn && r.push("fleqn"),
        (e = W.makeSpan(r, [e])));
    }
    return e;
  },
  y2 = function (e, n, r) {
    var i = v2(r),
      a;
    if (r.output === "mathml") return cu(e, n, i, r.displayMode, !0);
    if (r.output === "html") {
      var s = uu(e, i);
      a = W.makeSpan(["katex"], [s]);
    } else {
      var o = cu(e, n, i, r.displayMode, !1),
        l = uu(e, i);
      a = W.makeSpan(["katex"], [o, l]);
    }
    return b2(a, r);
  },
  w2 = {
    widehat: "^",
    widecheck: "ˇ",
    widetilde: "~",
    utilde: "~",
    overleftarrow: "←",
    underleftarrow: "←",
    xleftarrow: "←",
    overrightarrow: "→",
    underrightarrow: "→",
    xrightarrow: "→",
    underbrace: "⏟",
    overbrace: "⏞",
    overgroup: "⏠",
    undergroup: "⏡",
    overleftrightarrow: "↔",
    underleftrightarrow: "↔",
    xleftrightarrow: "↔",
    Overrightarrow: "⇒",
    xRightarrow: "⇒",
    overleftharpoon: "↼",
    xleftharpoonup: "↼",
    overrightharpoon: "⇀",
    xrightharpoonup: "⇀",
    xLeftarrow: "⇐",
    xLeftrightarrow: "⇔",
    xhookleftarrow: "↩",
    xhookrightarrow: "↪",
    xmapsto: "↦",
    xrightharpoondown: "⇁",
    xleftharpoondown: "↽",
    xrightleftharpoons: "⇌",
    xleftrightharpoons: "⇋",
    xtwoheadleftarrow: "↞",
    xtwoheadrightarrow: "↠",
    xlongequal: "=",
    xtofrom: "⇄",
    xrightleftarrows: "⇄",
    xrightequilibrium: "⇌",
    xleftequilibrium: "⇋",
    "\\cdrightarrow": "→",
    "\\cdleftarrow": "←",
    "\\cdlongequal": "=",
  },
  x2 = function (e) {
    var n = new re.MathNode("mo", [new re.TextNode(w2[e.replace(/^\\/, "")])]);
    return (n.setAttribute("stretchy", "true"), n);
  },
  k2 = {
    overrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
    overleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
    underrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
    underleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
    xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
    "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
    xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
    "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
    Overrightarrow: [["doublerightarrow"], 0.888, 560, "xMaxYMin"],
    xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
    xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
    overleftharpoon: [["leftharpoon"], 0.888, 522, "xMinYMin"],
    xleftharpoonup: [["leftharpoon"], 0.888, 522, "xMinYMin"],
    xleftharpoondown: [["leftharpoondown"], 0.888, 522, "xMinYMin"],
    overrightharpoon: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
    xrightharpoonup: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
    xrightharpoondown: [["rightharpoondown"], 0.888, 522, "xMaxYMin"],
    xlongequal: [["longequal"], 0.888, 334, "xMinYMin"],
    "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
    xtwoheadleftarrow: [["twoheadleftarrow"], 0.888, 334, "xMinYMin"],
    xtwoheadrightarrow: [["twoheadrightarrow"], 0.888, 334, "xMaxYMin"],
    overleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
    overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
    underbrace: [
      ["leftbraceunder", "midbraceunder", "rightbraceunder"],
      1.6,
      548,
    ],
    underleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
    xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
    xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
    xrightleftharpoons: [
      ["leftharpoondownplus", "rightharpoonplus"],
      1.75,
      716,
    ],
    xleftrightharpoons: [
      ["leftharpoonplus", "rightharpoondownplus"],
      1.75,
      716,
    ],
    xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
    xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
    overlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
    underlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
    overgroup: [["leftgroup", "rightgroup"], 0.888, 342],
    undergroup: [["leftgroupunder", "rightgroupunder"], 0.888, 342],
    xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
    xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
    xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
    xrightequilibrium: [
      ["baraboveshortleftharpoon", "rightharpoonaboveshortbar"],
      1.75,
      716,
    ],
    xleftequilibrium: [
      ["shortbaraboveleftharpoon", "shortrightharpoonabovebar"],
      1.75,
      716,
    ],
  },
  S2 = function (e) {
    return e.type === "ordgroup" ? e.body.length : 1;
  },
  A2 = function (e, n) {
    function r() {
      var o = 4e5,
        l = e.label.slice(1);
      if (Ee.contains(["widehat", "widecheck", "widetilde", "utilde"], l)) {
        var u = e,
          h = S2(u.base),
          d,
          p,
          m;
        if (h > 5)
          l === "widehat" || l === "widecheck"
            ? ((d = 420), (o = 2364), (m = 0.42), (p = l + "4"))
            : ((d = 312), (o = 2340), (m = 0.34), (p = "tilde4"));
        else {
          var y = [1, 1, 2, 2, 3, 3][h];
          l === "widehat" || l === "widecheck"
            ? ((o = [0, 1062, 2364, 2364, 2364][y]),
              (d = [0, 239, 300, 360, 420][y]),
              (m = [0, 0.24, 0.3, 0.3, 0.36, 0.42][y]),
              (p = l + y))
            : ((o = [0, 600, 1033, 2339, 2340][y]),
              (d = [0, 260, 286, 306, 312][y]),
              (m = [0, 0.26, 0.286, 0.3, 0.306, 0.34][y]),
              (p = "tilde" + y));
        }
        var S = new fi(p),
          A = new Kr([S], {
            width: "100%",
            height: ce(m),
            viewBox: "0 0 " + o + " " + d,
            preserveAspectRatio: "none",
          });
        return { span: W.makeSvgSpan([], [A], n), minWidth: 0, height: m };
      } else {
        var C = [],
          b = k2[l],
          [T, v, E] = b,
          x = E / 1e3,
          _ = T.length,
          j,
          F;
        if (_ === 1) {
          var O = b[3];
          ((j = ["hide-tail"]), (F = [O]));
        } else if (_ === 2)
          ((j = ["halfarrow-left", "halfarrow-right"]),
            (F = ["xMinYMin", "xMaxYMin"]));
        else if (_ === 3)
          ((j = ["brace-left", "brace-center", "brace-right"]),
            (F = ["xMinYMin", "xMidYMin", "xMaxYMin"]));
        else
          throw new Error(
            `Correct katexImagesData or update code here to support
                    ` +
              _ +
              " children.",
          );
        for (var $ = 0; $ < _; $++) {
          var G = new fi(T[$]),
            K = new Kr([G], {
              width: "400em",
              height: ce(x),
              viewBox: "0 0 " + o + " " + E,
              preserveAspectRatio: F[$] + " slice",
            }),
            le = W.makeSvgSpan([j[$]], [K], n);
          if (_ === 1) return { span: le, minWidth: v, height: x };
          ((le.style.height = ce(x)), C.push(le));
        }
        return { span: W.makeSpan(["stretchy"], C, n), minWidth: v, height: x };
      }
    }
    var { span: i, minWidth: a, height: s } = r();
    return (
      (i.height = s),
      (i.style.height = ce(s)),
      a > 0 && (i.style.minWidth = ce(a)),
      i
    );
  },
  T2 = function (e, n, r, i, a) {
    var s,
      o = e.height + e.depth + r + i;
    if (/fbox|color|angl/.test(n)) {
      if (((s = W.makeSpan(["stretchy", n], [], a)), n === "fbox")) {
        var l = a.color && a.getColor();
        l && (s.style.borderColor = l);
      }
    } else {
      var u = [];
      (/^[bx]cancel$/.test(n) &&
        u.push(
          new tu({
            x1: "0",
            y1: "0",
            x2: "100%",
            y2: "100%",
            "stroke-width": "0.046em",
          }),
        ),
        /^x?cancel$/.test(n) &&
          u.push(
            new tu({
              x1: "0",
              y1: "100%",
              x2: "100%",
              y2: "0",
              "stroke-width": "0.046em",
            }),
          ));
      var h = new Kr(u, { width: "100%", height: ce(o) });
      s = W.makeSvgSpan([], [h], a);
    }
    return ((s.height = o), (s.style.height = ce(o)), s);
  },
  Tr = { encloseSpan: T2, mathMLnode: x2, svgSpan: A2 };
function _e(t, e) {
  if (!t || t.type !== e)
    throw new Error(
      "Expected node of type " +
        e +
        ", but got " +
        (t ? "node of type " + t.type : String(t)),
    );
  return t;
}
function M0(t) {
  var e = Js(t);
  if (!e)
    throw new Error(
      "Expected node of symbol group type, but got " +
        (t ? "node of type " + t.type : String(t)),
    );
  return e;
}
function Js(t) {
  return t && (t.type === "atom" || Xg.hasOwnProperty(t.type)) ? t : null;
}
var z0 = (t, e) => {
    var n, r, i;
    t && t.type === "supsub"
      ? ((r = _e(t.base, "accent")),
        (n = r.base),
        (t.base = n),
        (i = Gg(Ve(t, e))),
        (t.base = r))
      : ((r = _e(t, "accent")), (n = r.base));
    var a = Ve(n, e.havingCrampedStyle()),
      s = r.isShifty && Ee.isCharacterBox(n),
      o = 0;
    if (s) {
      var l = Ee.getBaseElem(n),
        u = Ve(l, e.havingCrampedStyle());
      o = nu(u).skew;
    }
    var h = r.label === "\\c",
      d = h ? a.height + a.depth : Math.min(a.height, e.fontMetrics().xHeight),
      p;
    if (r.isStretchy)
      ((p = Tr.svgSpan(r, e)),
        (p = W.makeVList(
          {
            positionType: "firstBaseline",
            children: [
              { type: "elem", elem: a },
              {
                type: "elem",
                elem: p,
                wrapperClasses: ["svg-align"],
                wrapperStyle:
                  o > 0
                    ? {
                        width: "calc(100% - " + ce(2 * o) + ")",
                        marginLeft: ce(2 * o),
                      }
                    : void 0,
              },
            ],
          },
          e,
        )));
    else {
      var m, y;
      (r.label === "\\vec"
        ? ((m = W.staticSvg("vec", e)), (y = W.svgData.vec[1]))
        : ((m = W.makeOrd({ mode: r.mode, text: r.label }, e, "textord")),
          (m = nu(m)),
          (m.italic = 0),
          (y = m.width),
          h && (d += m.depth)),
        (p = W.makeSpan(["accent-body"], [m])));
      var S = r.label === "\\textcircled";
      S && (p.classes.push("accent-full"), (d = a.height));
      var A = o;
      (S || (A -= y / 2),
        (p.style.left = ce(A)),
        r.label === "\\textcircled" && (p.style.top = ".2em"),
        (p = W.makeVList(
          {
            positionType: "firstBaseline",
            children: [
              { type: "elem", elem: a },
              { type: "kern", size: -d },
              { type: "elem", elem: p },
            ],
          },
          e,
        )));
    }
    var C = W.makeSpan(["mord", "accent"], [p], e);
    return i
      ? ((i.children[0] = C),
        (i.height = Math.max(C.height, i.height)),
        (i.classes[0] = "mord"),
        i)
      : C;
  },
  Dd = (t, e) => {
    var n = t.isStretchy
        ? Tr.mathMLnode(t.label)
        : new re.MathNode("mo", [Pn(t.label, t.mode)]),
      r = new re.MathNode("mover", [Ze(t.base, e), n]);
    return (r.setAttribute("accent", "true"), r);
  },
  E2 = new RegExp(
    [
      "\\acute",
      "\\grave",
      "\\ddot",
      "\\tilde",
      "\\bar",
      "\\breve",
      "\\check",
      "\\hat",
      "\\vec",
      "\\dot",
      "\\mathring",
    ]
      .map((t) => "\\" + t)
      .join("|"),
  );
me({
  type: "accent",
  names: [
    "\\acute",
    "\\grave",
    "\\ddot",
    "\\tilde",
    "\\bar",
    "\\breve",
    "\\check",
    "\\hat",
    "\\vec",
    "\\dot",
    "\\mathring",
    "\\widecheck",
    "\\widehat",
    "\\widetilde",
    "\\overrightarrow",
    "\\overleftarrow",
    "\\Overrightarrow",
    "\\overleftrightarrow",
    "\\overgroup",
    "\\overlinesegment",
    "\\overleftharpoon",
    "\\overrightharpoon",
  ],
  props: { numArgs: 1 },
  handler: (t, e) => {
    var n = Bs(e[0]),
      r = !E2.test(t.funcName),
      i =
        !r ||
        t.funcName === "\\widehat" ||
        t.funcName === "\\widetilde" ||
        t.funcName === "\\widecheck";
    return {
      type: "accent",
      mode: t.parser.mode,
      label: t.funcName,
      isStretchy: r,
      isShifty: i,
      base: n,
    };
  },
  htmlBuilder: z0,
  mathmlBuilder: Dd,
});
me({
  type: "accent",
  names: [
    "\\'",
    "\\`",
    "\\^",
    "\\~",
    "\\=",
    "\\u",
    "\\.",
    '\\"',
    "\\c",
    "\\r",
    "\\H",
    "\\v",
    "\\textcircled",
  ],
  props: {
    numArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    argTypes: ["primitive"],
  },
  handler: (t, e) => {
    var n = e[0],
      r = t.parser.mode;
    return (
      r === "math" &&
        (t.parser.settings.reportNonstrict(
          "mathVsTextAccents",
          "LaTeX's accent " + t.funcName + " works only in text mode",
        ),
        (r = "text")),
      {
        type: "accent",
        mode: r,
        label: t.funcName,
        isStretchy: !1,
        isShifty: !0,
        base: n,
      }
    );
  },
  htmlBuilder: z0,
  mathmlBuilder: Dd,
});
me({
  type: "accentUnder",
  names: [
    "\\underleftarrow",
    "\\underrightarrow",
    "\\underleftrightarrow",
    "\\undergroup",
    "\\underlinesegment",
    "\\utilde",
  ],
  props: { numArgs: 1 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = e[0];
    return { type: "accentUnder", mode: n.mode, label: r, base: i };
  },
  htmlBuilder: (t, e) => {
    var n = Ve(t.base, e),
      r = Tr.svgSpan(t, e),
      i = t.label === "\\utilde" ? 0.12 : 0,
      a = W.makeVList(
        {
          positionType: "top",
          positionData: n.height,
          children: [
            { type: "elem", elem: r, wrapperClasses: ["svg-align"] },
            { type: "kern", size: i },
            { type: "elem", elem: n },
          ],
        },
        e,
      );
    return W.makeSpan(["mord", "accentunder"], [a], e);
  },
  mathmlBuilder: (t, e) => {
    var n = Tr.mathMLnode(t.label),
      r = new re.MathNode("munder", [Ze(t.base, e), n]);
    return (r.setAttribute("accentunder", "true"), r);
  },
});
var Ja = (t) => {
  var e = new re.MathNode("mpadded", t ? [t] : []);
  return (
    e.setAttribute("width", "+0.6em"),
    e.setAttribute("lspace", "0.3em"),
    e
  );
};
me({
  type: "xArrow",
  names: [
    "\\xleftarrow",
    "\\xrightarrow",
    "\\xLeftarrow",
    "\\xRightarrow",
    "\\xleftrightarrow",
    "\\xLeftrightarrow",
    "\\xhookleftarrow",
    "\\xhookrightarrow",
    "\\xmapsto",
    "\\xrightharpoondown",
    "\\xrightharpoonup",
    "\\xleftharpoondown",
    "\\xleftharpoonup",
    "\\xrightleftharpoons",
    "\\xleftrightharpoons",
    "\\xlongequal",
    "\\xtwoheadrightarrow",
    "\\xtwoheadleftarrow",
    "\\xtofrom",
    "\\xrightleftarrows",
    "\\xrightequilibrium",
    "\\xleftequilibrium",
    "\\\\cdrightarrow",
    "\\\\cdleftarrow",
    "\\\\cdlongequal",
  ],
  props: { numArgs: 1, numOptionalArgs: 1 },
  handler(t, e, n) {
    var { parser: r, funcName: i } = t;
    return { type: "xArrow", mode: r.mode, label: i, body: e[0], below: n[0] };
  },
  htmlBuilder(t, e) {
    var n = e.style,
      r = e.havingStyle(n.sup()),
      i = W.wrapFragment(Ve(t.body, r, e), e),
      a = t.label.slice(0, 2) === "\\x" ? "x" : "cd";
    i.classes.push(a + "-arrow-pad");
    var s;
    t.below &&
      ((r = e.havingStyle(n.sub())),
      (s = W.wrapFragment(Ve(t.below, r, e), e)),
      s.classes.push(a + "-arrow-pad"));
    var o = Tr.svgSpan(t, e),
      l = -e.fontMetrics().axisHeight + 0.5 * o.height,
      u = -e.fontMetrics().axisHeight - 0.5 * o.height - 0.111;
    (i.depth > 0.25 || t.label === "\\xleftequilibrium") && (u -= i.depth);
    var h;
    if (s) {
      var d = -e.fontMetrics().axisHeight + s.height + 0.5 * o.height + 0.111;
      h = W.makeVList(
        {
          positionType: "individualShift",
          children: [
            { type: "elem", elem: i, shift: u },
            { type: "elem", elem: o, shift: l },
            { type: "elem", elem: s, shift: d },
          ],
        },
        e,
      );
    } else
      h = W.makeVList(
        {
          positionType: "individualShift",
          children: [
            { type: "elem", elem: i, shift: u },
            { type: "elem", elem: o, shift: l },
          ],
        },
        e,
      );
    return (
      h.children[0].children[0].children[1].classes.push("svg-align"),
      W.makeSpan(["mrel", "x-arrow"], [h], e)
    );
  },
  mathmlBuilder(t, e) {
    var n = Tr.mathMLnode(t.label);
    n.setAttribute("minsize", t.label.charAt(0) === "x" ? "1.75em" : "3.0em");
    var r;
    if (t.body) {
      var i = Ja(Ze(t.body, e));
      if (t.below) {
        var a = Ja(Ze(t.below, e));
        r = new re.MathNode("munderover", [n, a, i]);
      } else r = new re.MathNode("mover", [n, i]);
    } else if (t.below) {
      var s = Ja(Ze(t.below, e));
      r = new re.MathNode("munder", [n, s]);
    } else ((r = Ja()), (r = new re.MathNode("mover", [n, r])));
    return r;
  },
});
var C2 = W.makeSpan;
function Id(t, e) {
  var n = Lt(t.body, e, !0);
  return C2([t.mclass], n, e);
}
function Nd(t, e) {
  var n,
    r = hn(t.body, e);
  return (
    t.mclass === "minner"
      ? (n = new re.MathNode("mpadded", r))
      : t.mclass === "mord"
        ? t.isCharacterBox
          ? ((n = r[0]), (n.type = "mi"))
          : (n = new re.MathNode("mi", r))
        : (t.isCharacterBox
            ? ((n = r[0]), (n.type = "mo"))
            : (n = new re.MathNode("mo", r)),
          t.mclass === "mbin"
            ? ((n.attributes.lspace = "0.22em"),
              (n.attributes.rspace = "0.22em"))
            : t.mclass === "mpunct"
              ? ((n.attributes.lspace = "0em"),
                (n.attributes.rspace = "0.17em"))
              : t.mclass === "mopen" || t.mclass === "mclose"
                ? ((n.attributes.lspace = "0em"), (n.attributes.rspace = "0em"))
                : t.mclass === "minner" &&
                  ((n.attributes.lspace = "0.0556em"),
                  (n.attributes.width = "+0.1111em"))),
    n
  );
}
me({
  type: "mclass",
  names: [
    "\\mathord",
    "\\mathbin",
    "\\mathrel",
    "\\mathopen",
    "\\mathclose",
    "\\mathpunct",
    "\\mathinner",
  ],
  props: { numArgs: 1, primitive: !0 },
  handler(t, e) {
    var { parser: n, funcName: r } = t,
      i = e[0];
    return {
      type: "mclass",
      mode: n.mode,
      mclass: "m" + r.slice(5),
      body: bt(i),
      isCharacterBox: Ee.isCharacterBox(i),
    };
  },
  htmlBuilder: Id,
  mathmlBuilder: Nd,
});
var eo = (t) => {
  var e = t.type === "ordgroup" && t.body.length ? t.body[0] : t;
  return e.type === "atom" && (e.family === "bin" || e.family === "rel")
    ? "m" + e.family
    : "mord";
};
me({
  type: "mclass",
  names: ["\\@binrel"],
  props: { numArgs: 2 },
  handler(t, e) {
    var { parser: n } = t;
    return {
      type: "mclass",
      mode: n.mode,
      mclass: eo(e[0]),
      body: bt(e[1]),
      isCharacterBox: Ee.isCharacterBox(e[1]),
    };
  },
});
me({
  type: "mclass",
  names: ["\\stackrel", "\\overset", "\\underset"],
  props: { numArgs: 2 },
  handler(t, e) {
    var { parser: n, funcName: r } = t,
      i = e[1],
      a = e[0],
      s;
    r !== "\\stackrel" ? (s = eo(i)) : (s = "mrel");
    var o = {
        type: "op",
        mode: i.mode,
        limits: !0,
        alwaysHandleSupSub: !0,
        parentIsSupSub: !1,
        symbol: !1,
        suppressBaseShift: r !== "\\stackrel",
        body: bt(i),
      },
      l = {
        type: "supsub",
        mode: a.mode,
        base: o,
        sup: r === "\\underset" ? null : a,
        sub: r === "\\underset" ? a : null,
      };
    return {
      type: "mclass",
      mode: n.mode,
      mclass: s,
      body: [l],
      isCharacterBox: Ee.isCharacterBox(l),
    };
  },
  htmlBuilder: Id,
  mathmlBuilder: Nd,
});
me({
  type: "pmb",
  names: ["\\pmb"],
  props: { numArgs: 1, allowedInText: !0 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "pmb", mode: n.mode, mclass: eo(e[0]), body: bt(e[0]) };
  },
  htmlBuilder(t, e) {
    var n = Lt(t.body, e, !0),
      r = W.makeSpan([t.mclass], n, e);
    return ((r.style.textShadow = "0.02em 0.01em 0.04px"), r);
  },
  mathmlBuilder(t, e) {
    var n = hn(t.body, e),
      r = new re.MathNode("mstyle", n);
    return (r.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px"), r);
  },
});
var L2 = {
    ">": "\\\\cdrightarrow",
    "<": "\\\\cdleftarrow",
    "=": "\\\\cdlongequal",
    A: "\\uparrow",
    V: "\\downarrow",
    "|": "\\Vert",
    ".": "no arrow",
  },
  du = () => ({ type: "styling", body: [], mode: "math", style: "display" }),
  hu = (t) => t.type === "textord" && t.text === "@",
  M2 = (t, e) => (t.type === "mathord" || t.type === "atom") && t.text === e;
function z2(t, e, n) {
  var r = L2[t];
  switch (r) {
    case "\\\\cdrightarrow":
    case "\\\\cdleftarrow":
      return n.callFunction(r, [e[0]], [e[1]]);
    case "\\uparrow":
    case "\\downarrow": {
      var i = n.callFunction("\\\\cdleft", [e[0]], []),
        a = { type: "atom", text: r, mode: "math", family: "rel" },
        s = n.callFunction("\\Big", [a], []),
        o = n.callFunction("\\\\cdright", [e[1]], []),
        l = { type: "ordgroup", mode: "math", body: [i, s, o] };
      return n.callFunction("\\\\cdparent", [l], []);
    }
    case "\\\\cdlongequal":
      return n.callFunction("\\\\cdlongequal", [], []);
    case "\\Vert": {
      var u = { type: "textord", text: "\\Vert", mode: "math" };
      return n.callFunction("\\Big", [u], []);
    }
    default:
      return { type: "textord", text: " ", mode: "math" };
  }
}
function D2(t) {
  var e = [];
  for (
    t.gullet.beginGroup(),
      t.gullet.macros.set("\\cr", "\\\\\\relax"),
      t.gullet.beginGroup();
    ;

  ) {
    (e.push(t.parseExpression(!1, "\\\\")),
      t.gullet.endGroup(),
      t.gullet.beginGroup());
    var n = t.fetch().text;
    if (n === "&" || n === "\\\\") t.consume();
    else if (n === "\\end") {
      e[e.length - 1].length === 0 && e.pop();
      break;
    } else throw new ae("Expected \\\\ or \\cr or \\end", t.nextToken);
  }
  for (var r = [], i = [r], a = 0; a < e.length; a++) {
    for (var s = e[a], o = du(), l = 0; l < s.length; l++)
      if (!hu(s[l])) o.body.push(s[l]);
      else {
        (r.push(o), (l += 1));
        var u = M0(s[l]).text,
          h = new Array(2);
        if (
          ((h[0] = { type: "ordgroup", mode: "math", body: [] }),
          (h[1] = { type: "ordgroup", mode: "math", body: [] }),
          !("=|.".indexOf(u) > -1))
        )
          if ("<>AV".indexOf(u) > -1)
            for (var d = 0; d < 2; d++) {
              for (var p = !0, m = l + 1; m < s.length; m++) {
                if (M2(s[m], u)) {
                  ((p = !1), (l = m));
                  break;
                }
                if (hu(s[m]))
                  throw new ae(
                    "Missing a " + u + " character to complete a CD arrow.",
                    s[m],
                  );
                h[d].body.push(s[m]);
              }
              if (p)
                throw new ae(
                  "Missing a " + u + " character to complete a CD arrow.",
                  s[l],
                );
            }
          else throw new ae('Expected one of "<>AV=|." after @', s[l]);
        var y = z2(u, h, t),
          S = { type: "styling", body: [y], mode: "math", style: "display" };
        (r.push(S), (o = du()));
      }
    (a % 2 === 0 ? r.push(o) : r.shift(), (r = []), i.push(r));
  }
  (t.gullet.endGroup(), t.gullet.endGroup());
  var A = new Array(i[0].length).fill({
    type: "align",
    align: "c",
    pregap: 0.25,
    postgap: 0.25,
  });
  return {
    type: "array",
    mode: "math",
    body: i,
    arraystretch: 1,
    addJot: !0,
    rowGaps: [null],
    cols: A,
    colSeparationType: "CD",
    hLinesBeforeRow: new Array(i.length + 1).fill([]),
  };
}
me({
  type: "cdlabel",
  names: ["\\\\cdleft", "\\\\cdright"],
  props: { numArgs: 1 },
  handler(t, e) {
    var { parser: n, funcName: r } = t;
    return { type: "cdlabel", mode: n.mode, side: r.slice(4), label: e[0] };
  },
  htmlBuilder(t, e) {
    var n = e.havingStyle(e.style.sup()),
      r = W.wrapFragment(Ve(t.label, n, e), e);
    return (
      r.classes.push("cd-label-" + t.side),
      (r.style.bottom = ce(0.8 - r.depth)),
      (r.height = 0),
      (r.depth = 0),
      r
    );
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mrow", [Ze(t.label, e)]);
    return (
      (n = new re.MathNode("mpadded", [n])),
      n.setAttribute("width", "0"),
      t.side === "left" && n.setAttribute("lspace", "-1width"),
      n.setAttribute("voffset", "0.7em"),
      (n = new re.MathNode("mstyle", [n])),
      n.setAttribute("displaystyle", "false"),
      n.setAttribute("scriptlevel", "1"),
      n
    );
  },
});
me({
  type: "cdlabelparent",
  names: ["\\\\cdparent"],
  props: { numArgs: 1 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "cdlabelparent", mode: n.mode, fragment: e[0] };
  },
  htmlBuilder(t, e) {
    var n = W.wrapFragment(Ve(t.fragment, e), e);
    return (n.classes.push("cd-vert-arrow"), n);
  },
  mathmlBuilder(t, e) {
    return new re.MathNode("mrow", [Ze(t.fragment, e)]);
  },
});
me({
  type: "textord",
  names: ["\\@char"],
  props: { numArgs: 1, allowedInText: !0 },
  handler(t, e) {
    for (
      var { parser: n } = t,
        r = _e(e[0], "ordgroup"),
        i = r.body,
        a = "",
        s = 0;
      s < i.length;
      s++
    ) {
      var o = _e(i[s], "textord");
      a += o.text;
    }
    var l = parseInt(a),
      u;
    if (isNaN(l)) throw new ae("\\@char has non-numeric argument " + a);
    if (l < 0 || l >= 1114111)
      throw new ae("\\@char with invalid code point " + a);
    return (
      l <= 65535
        ? (u = String.fromCharCode(l))
        : ((l -= 65536),
          (u = String.fromCharCode((l >> 10) + 55296, (l & 1023) + 56320))),
      { type: "textord", mode: n.mode, text: u }
    );
  },
});
var Fd = (t, e) => {
    var n = Lt(t.body, e.withColor(t.color), !1);
    return W.makeFragment(n);
  },
  _d = (t, e) => {
    var n = hn(t.body, e.withColor(t.color)),
      r = new re.MathNode("mstyle", n);
    return (r.setAttribute("mathcolor", t.color), r);
  };
me({
  type: "color",
  names: ["\\textcolor"],
  props: { numArgs: 2, allowedInText: !0, argTypes: ["color", "original"] },
  handler(t, e) {
    var { parser: n } = t,
      r = _e(e[0], "color-token").color,
      i = e[1];
    return { type: "color", mode: n.mode, color: r, body: bt(i) };
  },
  htmlBuilder: Fd,
  mathmlBuilder: _d,
});
me({
  type: "color",
  names: ["\\color"],
  props: { numArgs: 1, allowedInText: !0, argTypes: ["color"] },
  handler(t, e) {
    var { parser: n, breakOnTokenText: r } = t,
      i = _e(e[0], "color-token").color;
    n.gullet.macros.set("\\current@color", i);
    var a = n.parseExpression(!0, r);
    return { type: "color", mode: n.mode, color: i, body: a };
  },
  htmlBuilder: Fd,
  mathmlBuilder: _d,
});
me({
  type: "cr",
  names: ["\\\\"],
  props: { numArgs: 0, numOptionalArgs: 0, allowedInText: !0 },
  handler(t, e, n) {
    var { parser: r } = t,
      i = r.gullet.future().text === "[" ? r.parseSizeGroup(!0) : null,
      a =
        !r.settings.displayMode ||
        !r.settings.useStrictBehavior(
          "newLineInDisplayMode",
          "In LaTeX, \\\\ or \\newline does nothing in display mode",
        );
    return {
      type: "cr",
      mode: r.mode,
      newLine: a,
      size: i && _e(i, "size").value,
    };
  },
  htmlBuilder(t, e) {
    var n = W.makeSpan(["mspace"], [], e);
    return (
      t.newLine &&
        (n.classes.push("newline"),
        t.size && (n.style.marginTop = ce(ot(t.size, e)))),
      n
    );
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mspace");
    return (
      t.newLine &&
        (n.setAttribute("linebreak", "newline"),
        t.size && n.setAttribute("height", ce(ot(t.size, e)))),
      n
    );
  },
});
var o0 = {
    "\\global": "\\global",
    "\\long": "\\\\globallong",
    "\\\\globallong": "\\\\globallong",
    "\\def": "\\gdef",
    "\\gdef": "\\gdef",
    "\\edef": "\\xdef",
    "\\xdef": "\\xdef",
    "\\let": "\\\\globallet",
    "\\futurelet": "\\\\globalfuture",
  },
  Od = (t) => {
    var e = t.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(e))
      throw new ae("Expected a control sequence", t);
    return e;
  },
  I2 = (t) => {
    var e = t.gullet.popToken();
    return (
      e.text === "=" &&
        ((e = t.gullet.popToken()),
        e.text === " " && (e = t.gullet.popToken())),
      e
    );
  },
  Bd = (t, e, n, r) => {
    var i = t.gullet.macros.get(n.text);
    (i == null &&
      ((n.noexpand = !0),
      (i = {
        tokens: [n],
        numArgs: 0,
        unexpandable: !t.gullet.isExpandable(n.text),
      })),
      t.gullet.macros.set(e, i, r));
  };
me({
  type: "internal",
  names: ["\\global", "\\long", "\\\\globallong"],
  props: { numArgs: 0, allowedInText: !0 },
  handler(t) {
    var { parser: e, funcName: n } = t;
    e.consumeSpaces();
    var r = e.fetch();
    if (o0[r.text])
      return (
        (n === "\\global" || n === "\\\\globallong") && (r.text = o0[r.text]),
        _e(e.parseFunction(), "internal")
      );
    throw new ae("Invalid token after macro prefix", r);
  },
});
me({
  type: "internal",
  names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
  props: { numArgs: 0, allowedInText: !0, primitive: !0 },
  handler(t) {
    var { parser: e, funcName: n } = t,
      r = e.gullet.popToken(),
      i = r.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(i))
      throw new ae("Expected a control sequence", r);
    for (var a = 0, s, o = [[]]; e.gullet.future().text !== "{"; )
      if (((r = e.gullet.popToken()), r.text === "#")) {
        if (e.gullet.future().text === "{") {
          ((s = e.gullet.future()), o[a].push("{"));
          break;
        }
        if (((r = e.gullet.popToken()), !/^[1-9]$/.test(r.text)))
          throw new ae('Invalid argument number "' + r.text + '"');
        if (parseInt(r.text) !== a + 1)
          throw new ae('Argument number "' + r.text + '" out of order');
        (a++, o.push([]));
      } else {
        if (r.text === "EOF") throw new ae("Expected a macro definition");
        o[a].push(r.text);
      }
    var { tokens: l } = e.gullet.consumeArg();
    return (
      s && l.unshift(s),
      (n === "\\edef" || n === "\\xdef") &&
        ((l = e.gullet.expandTokens(l)), l.reverse()),
      e.gullet.macros.set(
        i,
        { tokens: l, numArgs: a, delimiters: o },
        n === o0[n],
      ),
      { type: "internal", mode: e.mode }
    );
  },
});
me({
  type: "internal",
  names: ["\\let", "\\\\globallet"],
  props: { numArgs: 0, allowedInText: !0, primitive: !0 },
  handler(t) {
    var { parser: e, funcName: n } = t,
      r = Od(e.gullet.popToken());
    e.gullet.consumeSpaces();
    var i = I2(e);
    return (
      Bd(e, r, i, n === "\\\\globallet"),
      { type: "internal", mode: e.mode }
    );
  },
});
me({
  type: "internal",
  names: ["\\futurelet", "\\\\globalfuture"],
  props: { numArgs: 0, allowedInText: !0, primitive: !0 },
  handler(t) {
    var { parser: e, funcName: n } = t,
      r = Od(e.gullet.popToken()),
      i = e.gullet.popToken(),
      a = e.gullet.popToken();
    return (
      Bd(e, r, a, n === "\\\\globalfuture"),
      e.gullet.pushToken(a),
      e.gullet.pushToken(i),
      { type: "internal", mode: e.mode }
    );
  },
});
var aa = function (e, n, r) {
    var i = tt.math[e] && tt.math[e].replace,
      a = T0(i || e, n, r);
    if (!a)
      throw new Error("Unsupported symbol " + e + " and font size " + n + ".");
    return a;
  },
  D0 = function (e, n, r, i) {
    var a = r.havingBaseStyle(n),
      s = W.makeSpan(i.concat(a.sizingClasses(r)), [e], r),
      o = a.sizeMultiplier / r.sizeMultiplier;
    return (
      (s.height *= o),
      (s.depth *= o),
      (s.maxFontSize = a.sizeMultiplier),
      s
    );
  },
  Rd = function (e, n, r) {
    var i = n.havingBaseStyle(r),
      a =
        (1 - n.sizeMultiplier / i.sizeMultiplier) * n.fontMetrics().axisHeight;
    (e.classes.push("delimcenter"),
      (e.style.top = ce(a)),
      (e.height -= a),
      (e.depth += a));
  },
  N2 = function (e, n, r, i, a, s) {
    var o = W.makeSymbol(e, "Main-Regular", a, i),
      l = D0(o, n, i, s);
    return (r && Rd(l, i, n), l);
  },
  F2 = function (e, n, r, i) {
    return W.makeSymbol(e, "Size" + n + "-Regular", r, i);
  },
  Pd = function (e, n, r, i, a, s) {
    var o = F2(e, n, a, i),
      l = D0(W.makeSpan(["delimsizing", "size" + n], [o], i), Me.TEXT, i, s);
    return (r && Rd(l, i, Me.TEXT), l);
  },
  Do = function (e, n, r) {
    var i;
    n === "Size1-Regular" ? (i = "delim-size1") : (i = "delim-size4");
    var a = W.makeSpan(
      ["delimsizinginner", i],
      [W.makeSpan([], [W.makeSymbol(e, n, r)])],
    );
    return { type: "elem", elem: a };
  },
  Io = function (e, n, r) {
    var i = yr["Size4-Regular"][e.charCodeAt(0)]
        ? yr["Size4-Regular"][e.charCodeAt(0)][4]
        : yr["Size1-Regular"][e.charCodeAt(0)][4],
      a = new fi("inner", Pg(e, Math.round(1e3 * n))),
      s = new Kr([a], {
        width: ce(i),
        height: ce(n),
        style: "width:" + ce(i),
        viewBox: "0 0 " + 1e3 * i + " " + Math.round(1e3 * n),
        preserveAspectRatio: "xMinYMin",
      }),
      o = W.makeSvgSpan([], [s], r);
    return (
      (o.height = n),
      (o.style.height = ce(n)),
      (o.style.width = ce(i)),
      { type: "elem", elem: o }
    );
  },
  l0 = 0.008,
  es = { type: "kern", size: -1 * l0 },
  _2 = ["|", "\\lvert", "\\rvert", "\\vert"],
  O2 = ["\\|", "\\lVert", "\\rVert", "\\Vert"],
  Hd = function (e, n, r, i, a, s) {
    var o,
      l,
      u,
      h,
      d = "",
      p = 0;
    ((o = u = h = e), (l = null));
    var m = "Size1-Regular";
    e === "\\uparrow"
      ? (u = h = "⏐")
      : e === "\\Uparrow"
        ? (u = h = "‖")
        : e === "\\downarrow"
          ? (o = u = "⏐")
          : e === "\\Downarrow"
            ? (o = u = "‖")
            : e === "\\updownarrow"
              ? ((o = "\\uparrow"), (u = "⏐"), (h = "\\downarrow"))
              : e === "\\Updownarrow"
                ? ((o = "\\Uparrow"), (u = "‖"), (h = "\\Downarrow"))
                : Ee.contains(_2, e)
                  ? ((u = "∣"), (d = "vert"), (p = 333))
                  : Ee.contains(O2, e)
                    ? ((u = "∥"), (d = "doublevert"), (p = 556))
                    : e === "[" || e === "\\lbrack"
                      ? ((o = "⎡"),
                        (u = "⎢"),
                        (h = "⎣"),
                        (m = "Size4-Regular"),
                        (d = "lbrack"),
                        (p = 667))
                      : e === "]" || e === "\\rbrack"
                        ? ((o = "⎤"),
                          (u = "⎥"),
                          (h = "⎦"),
                          (m = "Size4-Regular"),
                          (d = "rbrack"),
                          (p = 667))
                        : e === "\\lfloor" || e === "⌊"
                          ? ((u = o = "⎢"),
                            (h = "⎣"),
                            (m = "Size4-Regular"),
                            (d = "lfloor"),
                            (p = 667))
                          : e === "\\lceil" || e === "⌈"
                            ? ((o = "⎡"),
                              (u = h = "⎢"),
                              (m = "Size4-Regular"),
                              (d = "lceil"),
                              (p = 667))
                            : e === "\\rfloor" || e === "⌋"
                              ? ((u = o = "⎥"),
                                (h = "⎦"),
                                (m = "Size4-Regular"),
                                (d = "rfloor"),
                                (p = 667))
                              : e === "\\rceil" || e === "⌉"
                                ? ((o = "⎤"),
                                  (u = h = "⎥"),
                                  (m = "Size4-Regular"),
                                  (d = "rceil"),
                                  (p = 667))
                                : e === "(" || e === "\\lparen"
                                  ? ((o = "⎛"),
                                    (u = "⎜"),
                                    (h = "⎝"),
                                    (m = "Size4-Regular"),
                                    (d = "lparen"),
                                    (p = 875))
                                  : e === ")" || e === "\\rparen"
                                    ? ((o = "⎞"),
                                      (u = "⎟"),
                                      (h = "⎠"),
                                      (m = "Size4-Regular"),
                                      (d = "rparen"),
                                      (p = 875))
                                    : e === "\\{" || e === "\\lbrace"
                                      ? ((o = "⎧"),
                                        (l = "⎨"),
                                        (h = "⎩"),
                                        (u = "⎪"),
                                        (m = "Size4-Regular"))
                                      : e === "\\}" || e === "\\rbrace"
                                        ? ((o = "⎫"),
                                          (l = "⎬"),
                                          (h = "⎭"),
                                          (u = "⎪"),
                                          (m = "Size4-Regular"))
                                        : e === "\\lgroup" || e === "⟮"
                                          ? ((o = "⎧"),
                                            (h = "⎩"),
                                            (u = "⎪"),
                                            (m = "Size4-Regular"))
                                          : e === "\\rgroup" || e === "⟯"
                                            ? ((o = "⎫"),
                                              (h = "⎭"),
                                              (u = "⎪"),
                                              (m = "Size4-Regular"))
                                            : e === "\\lmoustache" || e === "⎰"
                                              ? ((o = "⎧"),
                                                (h = "⎭"),
                                                (u = "⎪"),
                                                (m = "Size4-Regular"))
                                              : (e === "\\rmoustache" ||
                                                  e === "⎱") &&
                                                ((o = "⎫"),
                                                (h = "⎩"),
                                                (u = "⎪"),
                                                (m = "Size4-Regular"));
    var y = aa(o, m, a),
      S = y.height + y.depth,
      A = aa(u, m, a),
      C = A.height + A.depth,
      b = aa(h, m, a),
      T = b.height + b.depth,
      v = 0,
      E = 1;
    if (l !== null) {
      var x = aa(l, m, a);
      ((v = x.height + x.depth), (E = 2));
    }
    var _ = S + T + v,
      j = Math.max(0, Math.ceil((n - _) / (E * C))),
      F = _ + j * E * C,
      O = i.fontMetrics().axisHeight;
    r && (O *= i.sizeMultiplier);
    var $ = F / 2 - O,
      G = [];
    if (d.length > 0) {
      var K = F - S - T,
        le = Math.round(F * 1e3),
        R = Hg(d, Math.round(K * 1e3)),
        he = new fi(d, R),
        ee = (p / 1e3).toFixed(3) + "em",
        Z = (le / 1e3).toFixed(3) + "em",
        fe = new Kr([he], {
          width: ee,
          height: Z,
          viewBox: "0 0 " + p + " " + le,
        }),
        M = W.makeSvgSpan([], [fe], i);
      ((M.height = le / 1e3),
        (M.style.width = ee),
        (M.style.height = Z),
        G.push({ type: "elem", elem: M }));
    } else {
      if ((G.push(Do(h, m, a)), G.push(es), l === null)) {
        var ne = F - S - T + 2 * l0;
        G.push(Io(u, ne, i));
      } else {
        var xe = (F - S - T - v) / 2 + 2 * l0;
        (G.push(Io(u, xe, i)),
          G.push(es),
          G.push(Do(l, m, a)),
          G.push(es),
          G.push(Io(u, xe, i)));
      }
      (G.push(es), G.push(Do(o, m, a)));
    }
    var z = i.havingBaseStyle(Me.TEXT),
      De = W.makeVList(
        { positionType: "bottom", positionData: $, children: G },
        z,
      );
    return D0(W.makeSpan(["delimsizing", "mult"], [De], z), Me.TEXT, i, s);
  },
  No = 80,
  Fo = 0.08,
  _o = function (e, n, r, i, a) {
    var s = Rg(e, i, r),
      o = new fi(e, s),
      l = new Kr([o], {
        width: "400em",
        height: ce(n),
        viewBox: "0 0 400000 " + r,
        preserveAspectRatio: "xMinYMin slice",
      });
    return W.makeSvgSpan(["hide-tail"], [l], a);
  },
  B2 = function (e, n) {
    var r = n.havingBaseSizing(),
      i = Vd("\\surd", e * r.sizeMultiplier, $d, r),
      a = r.sizeMultiplier,
      s = Math.max(0, n.minRuleThickness - n.fontMetrics().sqrtRuleThickness),
      o,
      l = 0,
      u = 0,
      h = 0,
      d;
    return (
      i.type === "small"
        ? ((h = 1e3 + 1e3 * s + No),
          e < 1 ? (a = 1) : e < 1.4 && (a = 0.7),
          (l = (1 + s + Fo) / a),
          (u = (1 + s) / a),
          (o = _o("sqrtMain", l, h, s, n)),
          (o.style.minWidth = "0.853em"),
          (d = 0.833 / a))
        : i.type === "large"
          ? ((h = (1e3 + No) * ca[i.size]),
            (u = (ca[i.size] + s) / a),
            (l = (ca[i.size] + s + Fo) / a),
            (o = _o("sqrtSize" + i.size, l, h, s, n)),
            (o.style.minWidth = "1.02em"),
            (d = 1 / a))
          : ((l = e + s + Fo),
            (u = e + s),
            (h = Math.floor(1e3 * e + s) + No),
            (o = _o("sqrtTall", l, h, s, n)),
            (o.style.minWidth = "0.742em"),
            (d = 1.056)),
      (o.height = u),
      (o.style.height = ce(l)),
      {
        span: o,
        advanceWidth: d,
        ruleWidth: (n.fontMetrics().sqrtRuleThickness + s) * a,
      }
    );
  },
  qd = [
    "(",
    "\\lparen",
    ")",
    "\\rparen",
    "[",
    "\\lbrack",
    "]",
    "\\rbrack",
    "\\{",
    "\\lbrace",
    "\\}",
    "\\rbrace",
    "\\lfloor",
    "\\rfloor",
    "⌊",
    "⌋",
    "\\lceil",
    "\\rceil",
    "⌈",
    "⌉",
    "\\surd",
  ],
  R2 = [
    "\\uparrow",
    "\\downarrow",
    "\\updownarrow",
    "\\Uparrow",
    "\\Downarrow",
    "\\Updownarrow",
    "|",
    "\\|",
    "\\vert",
    "\\Vert",
    "\\lvert",
    "\\rvert",
    "\\lVert",
    "\\rVert",
    "\\lgroup",
    "\\rgroup",
    "⟮",
    "⟯",
    "\\lmoustache",
    "\\rmoustache",
    "⎰",
    "⎱",
  ],
  Ud = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"],
  ca = [0, 1.2, 1.8, 2.4, 3],
  P2 = function (e, n, r, i, a) {
    if (
      (e === "<" || e === "\\lt" || e === "⟨"
        ? (e = "\\langle")
        : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle"),
      Ee.contains(qd, e) || Ee.contains(Ud, e))
    )
      return Pd(e, n, !1, r, i, a);
    if (Ee.contains(R2, e)) return Hd(e, ca[n], !1, r, i, a);
    throw new ae("Illegal delimiter: '" + e + "'");
  },
  H2 = [
    { type: "small", style: Me.SCRIPTSCRIPT },
    { type: "small", style: Me.SCRIPT },
    { type: "small", style: Me.TEXT },
    { type: "large", size: 1 },
    { type: "large", size: 2 },
    { type: "large", size: 3 },
    { type: "large", size: 4 },
  ],
  q2 = [
    { type: "small", style: Me.SCRIPTSCRIPT },
    { type: "small", style: Me.SCRIPT },
    { type: "small", style: Me.TEXT },
    { type: "stack" },
  ],
  $d = [
    { type: "small", style: Me.SCRIPTSCRIPT },
    { type: "small", style: Me.SCRIPT },
    { type: "small", style: Me.TEXT },
    { type: "large", size: 1 },
    { type: "large", size: 2 },
    { type: "large", size: 3 },
    { type: "large", size: 4 },
    { type: "stack" },
  ],
  U2 = function (e) {
    if (e.type === "small") return "Main-Regular";
    if (e.type === "large") return "Size" + e.size + "-Regular";
    if (e.type === "stack") return "Size4-Regular";
    throw new Error("Add support for delim type '" + e.type + "' here.");
  },
  Vd = function (e, n, r, i) {
    for (
      var a = Math.min(2, 3 - i.style.size), s = a;
      s < r.length && r[s].type !== "stack";
      s++
    ) {
      var o = aa(e, U2(r[s]), "math"),
        l = o.height + o.depth;
      if (r[s].type === "small") {
        var u = i.havingBaseStyle(r[s].style);
        l *= u.sizeMultiplier;
      }
      if (l > n) return r[s];
    }
    return r[r.length - 1];
  },
  jd = function (e, n, r, i, a, s) {
    e === "<" || e === "\\lt" || e === "⟨"
      ? (e = "\\langle")
      : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle");
    var o;
    Ee.contains(Ud, e) ? (o = H2) : Ee.contains(qd, e) ? (o = $d) : (o = q2);
    var l = Vd(e, n, o, i);
    return l.type === "small"
      ? N2(e, l.style, r, i, a, s)
      : l.type === "large"
        ? Pd(e, l.size, r, i, a, s)
        : Hd(e, n, r, i, a, s);
  },
  $2 = function (e, n, r, i, a, s) {
    var o = i.fontMetrics().axisHeight * i.sizeMultiplier,
      l = 901,
      u = 5 / i.fontMetrics().ptPerEm,
      h = Math.max(n - o, r + o),
      d = Math.max((h / 500) * l, 2 * h - u);
    return jd(e, d, !0, i, a, s);
  },
  kr = {
    sqrtImage: B2,
    sizedDelim: P2,
    sizeToMaxHeight: ca,
    customSizedDelim: jd,
    leftRightDelim: $2,
  },
  fu = {
    "\\bigl": { mclass: "mopen", size: 1 },
    "\\Bigl": { mclass: "mopen", size: 2 },
    "\\biggl": { mclass: "mopen", size: 3 },
    "\\Biggl": { mclass: "mopen", size: 4 },
    "\\bigr": { mclass: "mclose", size: 1 },
    "\\Bigr": { mclass: "mclose", size: 2 },
    "\\biggr": { mclass: "mclose", size: 3 },
    "\\Biggr": { mclass: "mclose", size: 4 },
    "\\bigm": { mclass: "mrel", size: 1 },
    "\\Bigm": { mclass: "mrel", size: 2 },
    "\\biggm": { mclass: "mrel", size: 3 },
    "\\Biggm": { mclass: "mrel", size: 4 },
    "\\big": { mclass: "mord", size: 1 },
    "\\Big": { mclass: "mord", size: 2 },
    "\\bigg": { mclass: "mord", size: 3 },
    "\\Bigg": { mclass: "mord", size: 4 },
  },
  V2 = [
    "(",
    "\\lparen",
    ")",
    "\\rparen",
    "[",
    "\\lbrack",
    "]",
    "\\rbrack",
    "\\{",
    "\\lbrace",
    "\\}",
    "\\rbrace",
    "\\lfloor",
    "\\rfloor",
    "⌊",
    "⌋",
    "\\lceil",
    "\\rceil",
    "⌈",
    "⌉",
    "<",
    ">",
    "\\langle",
    "⟨",
    "\\rangle",
    "⟩",
    "\\lt",
    "\\gt",
    "\\lvert",
    "\\rvert",
    "\\lVert",
    "\\rVert",
    "\\lgroup",
    "\\rgroup",
    "⟮",
    "⟯",
    "\\lmoustache",
    "\\rmoustache",
    "⎰",
    "⎱",
    "/",
    "\\backslash",
    "|",
    "\\vert",
    "\\|",
    "\\Vert",
    "\\uparrow",
    "\\Uparrow",
    "\\downarrow",
    "\\Downarrow",
    "\\updownarrow",
    "\\Updownarrow",
    ".",
  ];
function to(t, e) {
  var n = Js(t);
  if (n && Ee.contains(V2, n.text)) return n;
  throw n
    ? new ae("Invalid delimiter '" + n.text + "' after '" + e.funcName + "'", t)
    : new ae("Invalid delimiter type '" + t.type + "'", t);
}
me({
  type: "delimsizing",
  names: [
    "\\bigl",
    "\\Bigl",
    "\\biggl",
    "\\Biggl",
    "\\bigr",
    "\\Bigr",
    "\\biggr",
    "\\Biggr",
    "\\bigm",
    "\\Bigm",
    "\\biggm",
    "\\Biggm",
    "\\big",
    "\\Big",
    "\\bigg",
    "\\Bigg",
  ],
  props: { numArgs: 1, argTypes: ["primitive"] },
  handler: (t, e) => {
    var n = to(e[0], t);
    return {
      type: "delimsizing",
      mode: t.parser.mode,
      size: fu[t.funcName].size,
      mclass: fu[t.funcName].mclass,
      delim: n.text,
    };
  },
  htmlBuilder: (t, e) =>
    t.delim === "."
      ? W.makeSpan([t.mclass])
      : kr.sizedDelim(t.delim, t.size, e, t.mode, [t.mclass]),
  mathmlBuilder: (t) => {
    var e = [];
    t.delim !== "." && e.push(Pn(t.delim, t.mode));
    var n = new re.MathNode("mo", e);
    (t.mclass === "mopen" || t.mclass === "mclose"
      ? n.setAttribute("fence", "true")
      : n.setAttribute("fence", "false"),
      n.setAttribute("stretchy", "true"));
    var r = ce(kr.sizeToMaxHeight[t.size]);
    return (n.setAttribute("minsize", r), n.setAttribute("maxsize", r), n);
  },
});
function mu(t) {
  if (!t.body)
    throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
}
me({
  type: "leftright-right",
  names: ["\\right"],
  props: { numArgs: 1, primitive: !0 },
  handler: (t, e) => {
    var n = t.parser.gullet.macros.get("\\current@color");
    if (n && typeof n != "string")
      throw new ae("\\current@color set to non-string in \\right");
    return {
      type: "leftright-right",
      mode: t.parser.mode,
      delim: to(e[0], t).text,
      color: n,
    };
  },
});
me({
  type: "leftright",
  names: ["\\left"],
  props: { numArgs: 1, primitive: !0 },
  handler: (t, e) => {
    var n = to(e[0], t),
      r = t.parser;
    ++r.leftrightDepth;
    var i = r.parseExpression(!1);
    (--r.leftrightDepth, r.expect("\\right", !1));
    var a = _e(r.parseFunction(), "leftright-right");
    return {
      type: "leftright",
      mode: r.mode,
      body: i,
      left: n.text,
      right: a.delim,
      rightColor: a.color,
    };
  },
  htmlBuilder: (t, e) => {
    mu(t);
    for (
      var n = Lt(t.body, e, !0, ["mopen", "mclose"]),
        r = 0,
        i = 0,
        a = !1,
        s = 0;
      s < n.length;
      s++
    )
      n[s].isMiddle
        ? (a = !0)
        : ((r = Math.max(n[s].height, r)), (i = Math.max(n[s].depth, i)));
    ((r *= e.sizeMultiplier), (i *= e.sizeMultiplier));
    var o;
    if (
      (t.left === "."
        ? (o = wa(e, ["mopen"]))
        : (o = kr.leftRightDelim(t.left, r, i, e, t.mode, ["mopen"])),
      n.unshift(o),
      a)
    )
      for (var l = 1; l < n.length; l++) {
        var u = n[l],
          h = u.isMiddle;
        h && (n[l] = kr.leftRightDelim(h.delim, r, i, h.options, t.mode, []));
      }
    var d;
    if (t.right === ".") d = wa(e, ["mclose"]);
    else {
      var p = t.rightColor ? e.withColor(t.rightColor) : e;
      d = kr.leftRightDelim(t.right, r, i, p, t.mode, ["mclose"]);
    }
    return (n.push(d), W.makeSpan(["minner"], n, e));
  },
  mathmlBuilder: (t, e) => {
    mu(t);
    var n = hn(t.body, e);
    if (t.left !== ".") {
      var r = new re.MathNode("mo", [Pn(t.left, t.mode)]);
      (r.setAttribute("fence", "true"), n.unshift(r));
    }
    if (t.right !== ".") {
      var i = new re.MathNode("mo", [Pn(t.right, t.mode)]);
      (i.setAttribute("fence", "true"),
        t.rightColor && i.setAttribute("mathcolor", t.rightColor),
        n.push(i));
    }
    return C0(n);
  },
});
me({
  type: "middle",
  names: ["\\middle"],
  props: { numArgs: 1, primitive: !0 },
  handler: (t, e) => {
    var n = to(e[0], t);
    if (!t.parser.leftrightDepth)
      throw new ae("\\middle without preceding \\left", n);
    return { type: "middle", mode: t.parser.mode, delim: n.text };
  },
  htmlBuilder: (t, e) => {
    var n;
    if (t.delim === ".") n = wa(e, []);
    else {
      n = kr.sizedDelim(t.delim, 1, e, t.mode, []);
      var r = { delim: t.delim, options: e };
      n.isMiddle = r;
    }
    return n;
  },
  mathmlBuilder: (t, e) => {
    var n =
        t.delim === "\\vert" || t.delim === "|"
          ? Pn("|", "text")
          : Pn(t.delim, t.mode),
      r = new re.MathNode("mo", [n]);
    return (
      r.setAttribute("fence", "true"),
      r.setAttribute("lspace", "0.05em"),
      r.setAttribute("rspace", "0.05em"),
      r
    );
  },
});
var I0 = (t, e) => {
    var n = W.wrapFragment(Ve(t.body, e), e),
      r = t.label.slice(1),
      i = e.sizeMultiplier,
      a,
      s = 0,
      o = Ee.isCharacterBox(t.body);
    if (r === "sout")
      ((a = W.makeSpan(["stretchy", "sout"])),
        (a.height = e.fontMetrics().defaultRuleThickness / i),
        (s = -0.5 * e.fontMetrics().xHeight));
    else if (r === "phase") {
      var l = ot({ number: 0.6, unit: "pt" }, e),
        u = ot({ number: 0.35, unit: "ex" }, e),
        h = e.havingBaseSizing();
      i = i / h.sizeMultiplier;
      var d = n.height + n.depth + l + u;
      n.style.paddingLeft = ce(d / 2 + l);
      var p = Math.floor(1e3 * d * i),
        m = Og(p),
        y = new Kr([new fi("phase", m)], {
          width: "400em",
          height: ce(p / 1e3),
          viewBox: "0 0 400000 " + p,
          preserveAspectRatio: "xMinYMin slice",
        });
      ((a = W.makeSvgSpan(["hide-tail"], [y], e)),
        (a.style.height = ce(d)),
        (s = n.depth + l + u));
    } else {
      /cancel/.test(r)
        ? o || n.classes.push("cancel-pad")
        : r === "angl"
          ? n.classes.push("anglpad")
          : n.classes.push("boxpad");
      var S = 0,
        A = 0,
        C = 0;
      (/box/.test(r)
        ? ((C = Math.max(e.fontMetrics().fboxrule, e.minRuleThickness)),
          (S = e.fontMetrics().fboxsep + (r === "colorbox" ? 0 : C)),
          (A = S))
        : r === "angl"
          ? ((C = Math.max(
              e.fontMetrics().defaultRuleThickness,
              e.minRuleThickness,
            )),
            (S = 4 * C),
            (A = Math.max(0, 0.25 - n.depth)))
          : ((S = o ? 0.2 : 0), (A = S)),
        (a = Tr.encloseSpan(n, r, S, A, e)),
        /fbox|boxed|fcolorbox/.test(r)
          ? ((a.style.borderStyle = "solid"), (a.style.borderWidth = ce(C)))
          : r === "angl" &&
            C !== 0.049 &&
            ((a.style.borderTopWidth = ce(C)),
            (a.style.borderRightWidth = ce(C))),
        (s = n.depth + A),
        t.backgroundColor &&
          ((a.style.backgroundColor = t.backgroundColor),
          t.borderColor && (a.style.borderColor = t.borderColor)));
    }
    var b;
    if (t.backgroundColor)
      b = W.makeVList(
        {
          positionType: "individualShift",
          children: [
            { type: "elem", elem: a, shift: s },
            { type: "elem", elem: n, shift: 0 },
          ],
        },
        e,
      );
    else {
      var T = /cancel|phase/.test(r) ? ["svg-align"] : [];
      b = W.makeVList(
        {
          positionType: "individualShift",
          children: [
            { type: "elem", elem: n, shift: 0 },
            { type: "elem", elem: a, shift: s, wrapperClasses: T },
          ],
        },
        e,
      );
    }
    return (
      /cancel/.test(r) && ((b.height = n.height), (b.depth = n.depth)),
      /cancel/.test(r) && !o
        ? W.makeSpan(["mord", "cancel-lap"], [b], e)
        : W.makeSpan(["mord"], [b], e)
    );
  },
  N0 = (t, e) => {
    var n = 0,
      r = new re.MathNode(
        t.label.indexOf("colorbox") > -1 ? "mpadded" : "menclose",
        [Ze(t.body, e)],
      );
    switch (t.label) {
      case "\\cancel":
        r.setAttribute("notation", "updiagonalstrike");
        break;
      case "\\bcancel":
        r.setAttribute("notation", "downdiagonalstrike");
        break;
      case "\\phase":
        r.setAttribute("notation", "phasorangle");
        break;
      case "\\sout":
        r.setAttribute("notation", "horizontalstrike");
        break;
      case "\\fbox":
        r.setAttribute("notation", "box");
        break;
      case "\\angl":
        r.setAttribute("notation", "actuarial");
        break;
      case "\\fcolorbox":
      case "\\colorbox":
        if (
          ((n = e.fontMetrics().fboxsep * e.fontMetrics().ptPerEm),
          r.setAttribute("width", "+" + 2 * n + "pt"),
          r.setAttribute("height", "+" + 2 * n + "pt"),
          r.setAttribute("lspace", n + "pt"),
          r.setAttribute("voffset", n + "pt"),
          t.label === "\\fcolorbox")
        ) {
          var i = Math.max(e.fontMetrics().fboxrule, e.minRuleThickness);
          r.setAttribute(
            "style",
            "border: " + i + "em solid " + String(t.borderColor),
          );
        }
        break;
      case "\\xcancel":
        r.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
        break;
    }
    return (
      t.backgroundColor && r.setAttribute("mathbackground", t.backgroundColor),
      r
    );
  };
me({
  type: "enclose",
  names: ["\\colorbox"],
  props: { numArgs: 2, allowedInText: !0, argTypes: ["color", "text"] },
  handler(t, e, n) {
    var { parser: r, funcName: i } = t,
      a = _e(e[0], "color-token").color,
      s = e[1];
    return {
      type: "enclose",
      mode: r.mode,
      label: i,
      backgroundColor: a,
      body: s,
    };
  },
  htmlBuilder: I0,
  mathmlBuilder: N0,
});
me({
  type: "enclose",
  names: ["\\fcolorbox"],
  props: {
    numArgs: 3,
    allowedInText: !0,
    argTypes: ["color", "color", "text"],
  },
  handler(t, e, n) {
    var { parser: r, funcName: i } = t,
      a = _e(e[0], "color-token").color,
      s = _e(e[1], "color-token").color,
      o = e[2];
    return {
      type: "enclose",
      mode: r.mode,
      label: i,
      backgroundColor: s,
      borderColor: a,
      body: o,
    };
  },
  htmlBuilder: I0,
  mathmlBuilder: N0,
});
me({
  type: "enclose",
  names: ["\\fbox"],
  props: { numArgs: 1, argTypes: ["hbox"], allowedInText: !0 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "enclose", mode: n.mode, label: "\\fbox", body: e[0] };
  },
});
me({
  type: "enclose",
  names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\phase"],
  props: { numArgs: 1 },
  handler(t, e) {
    var { parser: n, funcName: r } = t,
      i = e[0];
    return { type: "enclose", mode: n.mode, label: r, body: i };
  },
  htmlBuilder: I0,
  mathmlBuilder: N0,
});
me({
  type: "enclose",
  names: ["\\angl"],
  props: { numArgs: 1, argTypes: ["hbox"], allowedInText: !1 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "enclose", mode: n.mode, label: "\\angl", body: e[0] };
  },
});
var Wd = {};
function sr(t) {
  for (
    var {
        type: e,
        names: n,
        props: r,
        handler: i,
        htmlBuilder: a,
        mathmlBuilder: s,
      } = t,
      o = {
        type: e,
        numArgs: r.numArgs || 0,
        allowedInText: !1,
        numOptionalArgs: 0,
        handler: i,
      },
      l = 0;
    l < n.length;
    ++l
  )
    Wd[n[l]] = o;
  (a && (_s[e] = a), s && (Os[e] = s));
}
var Gd = {};
function w(t, e) {
  Gd[t] = e;
}
function pu(t) {
  var e = [];
  t.consumeSpaces();
  var n = t.fetch().text;
  for (
    n === "\\relax" && (t.consume(), t.consumeSpaces(), (n = t.fetch().text));
    n === "\\hline" || n === "\\hdashline";

  )
    (t.consume(),
      e.push(n === "\\hdashline"),
      t.consumeSpaces(),
      (n = t.fetch().text));
  return e;
}
var no = (t) => {
  var e = t.parser.settings;
  if (!e.displayMode)
    throw new ae("{" + t.envName + "} can be used only in display mode.");
};
function F0(t) {
  if (t.indexOf("ed") === -1) return t.indexOf("*") === -1;
}
function ti(t, e, n) {
  var {
    hskipBeforeAndAfter: r,
    addJot: i,
    cols: a,
    arraystretch: s,
    colSeparationType: o,
    autoTag: l,
    singleRow: u,
    emptySingleRow: h,
    maxNumCols: d,
    leqno: p,
  } = e;
  if (
    (t.gullet.beginGroup(), u || t.gullet.macros.set("\\cr", "\\\\\\relax"), !s)
  ) {
    var m = t.gullet.expandMacroAsText("\\arraystretch");
    if (m == null) s = 1;
    else if (((s = parseFloat(m)), !s || s < 0))
      throw new ae("Invalid \\arraystretch: " + m);
  }
  t.gullet.beginGroup();
  var y = [],
    S = [y],
    A = [],
    C = [],
    b = l != null ? [] : void 0;
  function T() {
    l && t.gullet.macros.set("\\@eqnsw", "1", !0);
  }
  function v() {
    b &&
      (t.gullet.macros.get("\\df@tag")
        ? (b.push(t.subparse([new Fn("\\df@tag")])),
          t.gullet.macros.set("\\df@tag", void 0, !0))
        : b.push(!!l && t.gullet.macros.get("\\@eqnsw") === "1"));
  }
  for (T(), C.push(pu(t)); ; ) {
    var E = t.parseExpression(!1, u ? "\\end" : "\\\\");
    (t.gullet.endGroup(),
      t.gullet.beginGroup(),
      (E = { type: "ordgroup", mode: t.mode, body: E }),
      n && (E = { type: "styling", mode: t.mode, style: n, body: [E] }),
      y.push(E));
    var x = t.fetch().text;
    if (x === "&") {
      if (d && y.length === d) {
        if (u || o) throw new ae("Too many tab characters: &", t.nextToken);
        t.settings.reportNonstrict(
          "textEnv",
          "Too few columns specified in the {array} column argument.",
        );
      }
      t.consume();
    } else if (x === "\\end") {
      (v(),
        y.length === 1 &&
          E.type === "styling" &&
          E.body[0].body.length === 0 &&
          (S.length > 1 || !h) &&
          S.pop(),
        C.length < S.length + 1 && C.push([]));
      break;
    } else if (x === "\\\\") {
      t.consume();
      var _ = void 0;
      (t.gullet.future().text !== " " && (_ = t.parseSizeGroup(!0)),
        A.push(_ ? _.value : null),
        v(),
        C.push(pu(t)),
        (y = []),
        S.push(y),
        T());
    } else throw new ae("Expected & or \\\\ or \\cr or \\end", t.nextToken);
  }
  return (
    t.gullet.endGroup(),
    t.gullet.endGroup(),
    {
      type: "array",
      mode: t.mode,
      addJot: i,
      arraystretch: s,
      body: S,
      cols: a,
      rowGaps: A,
      hskipBeforeAndAfter: r,
      hLinesBeforeRow: C,
      colSeparationType: o,
      tags: b,
      leqno: p,
    }
  );
}
function _0(t) {
  return t.slice(0, 1) === "d" ? "display" : "text";
}
var or = function (e, n) {
    var r,
      i,
      a = e.body.length,
      s = e.hLinesBeforeRow,
      o = 0,
      l = new Array(a),
      u = [],
      h = Math.max(n.fontMetrics().arrayRuleWidth, n.minRuleThickness),
      d = 1 / n.fontMetrics().ptPerEm,
      p = 5 * d;
    if (e.colSeparationType && e.colSeparationType === "small") {
      var m = n.havingStyle(Me.SCRIPT).sizeMultiplier;
      p = 0.2778 * (m / n.sizeMultiplier);
    }
    var y =
        e.colSeparationType === "CD"
          ? ot({ number: 3, unit: "ex" }, n)
          : 12 * d,
      S = 3 * d,
      A = e.arraystretch * y,
      C = 0.7 * A,
      b = 0.3 * A,
      T = 0;
    function v(mt) {
      for (var xt = 0; xt < mt.length; ++xt)
        (xt > 0 && (T += 0.25), u.push({ pos: T, isDashed: mt[xt] }));
    }
    for (v(s[0]), r = 0; r < e.body.length; ++r) {
      var E = e.body[r],
        x = C,
        _ = b;
      o < E.length && (o = E.length);
      var j = new Array(E.length);
      for (i = 0; i < E.length; ++i) {
        var F = Ve(E[i], n);
        (_ < F.depth && (_ = F.depth),
          x < F.height && (x = F.height),
          (j[i] = F));
      }
      var O = e.rowGaps[r],
        $ = 0;
      (O && (($ = ot(O, n)), $ > 0 && (($ += b), _ < $ && (_ = $), ($ = 0))),
        e.addJot && (_ += S),
        (j.height = x),
        (j.depth = _),
        (T += x),
        (j.pos = T),
        (T += _ + $),
        (l[r] = j),
        v(s[r + 1]));
    }
    var G = T / 2 + n.fontMetrics().axisHeight,
      K = e.cols || [],
      le = [],
      R,
      he,
      ee = [];
    if (e.tags && e.tags.some((mt) => mt))
      for (r = 0; r < a; ++r) {
        var Z = l[r],
          fe = Z.pos - G,
          M = e.tags[r],
          ne = void 0;
        (M === !0
          ? (ne = W.makeSpan(["eqn-num"], [], n))
          : M === !1
            ? (ne = W.makeSpan([], [], n))
            : (ne = W.makeSpan([], Lt(M, n, !0), n)),
          (ne.depth = Z.depth),
          (ne.height = Z.height),
          ee.push({ type: "elem", elem: ne, shift: fe }));
      }
    for (i = 0, he = 0; i < o || he < K.length; ++i, ++he) {
      for (var xe = K[he] || {}, z = !0; xe.type === "separator"; ) {
        if (
          (z ||
            ((R = W.makeSpan(["arraycolsep"], [])),
            (R.style.width = ce(n.fontMetrics().doubleRuleSep)),
            le.push(R)),
          xe.separator === "|" || xe.separator === ":")
        ) {
          var De = xe.separator === "|" ? "solid" : "dashed",
            ke = W.makeSpan(["vertical-separator"], [], n);
          ((ke.style.height = ce(T)),
            (ke.style.borderRightWidth = ce(h)),
            (ke.style.borderRightStyle = De),
            (ke.style.margin = "0 " + ce(-h / 2)));
          var Ce = T - G;
          (Ce && (ke.style.verticalAlign = ce(-Ce)), le.push(ke));
        } else throw new ae("Invalid separator type: " + xe.separator);
        (he++, (xe = K[he] || {}), (z = !1));
      }
      if (!(i >= o)) {
        var Ue = void 0;
        (i > 0 || e.hskipBeforeAndAfter) &&
          ((Ue = Ee.deflt(xe.pregap, p)),
          Ue !== 0 &&
            ((R = W.makeSpan(["arraycolsep"], [])),
            (R.style.width = ce(Ue)),
            le.push(R)));
        var Fe = [];
        for (r = 0; r < a; ++r) {
          var We = l[r],
            je = We[i];
          if (je) {
            var lt = We.pos - G;
            ((je.depth = We.depth),
              (je.height = We.height),
              Fe.push({ type: "elem", elem: je, shift: lt }));
          }
        }
        ((Fe = W.makeVList(
          { positionType: "individualShift", children: Fe },
          n,
        )),
          (Fe = W.makeSpan(["col-align-" + (xe.align || "c")], [Fe])),
          le.push(Fe),
          (i < o - 1 || e.hskipBeforeAndAfter) &&
            ((Ue = Ee.deflt(xe.postgap, p)),
            Ue !== 0 &&
              ((R = W.makeSpan(["arraycolsep"], [])),
              (R.style.width = ce(Ue)),
              le.push(R))));
      }
    }
    if (((l = W.makeSpan(["mtable"], le)), u.length > 0)) {
      for (
        var Et = W.makeLineSpan("hline", n, h),
          ht = W.makeLineSpan("hdashline", n, h),
          wt = [{ type: "elem", elem: l, shift: 0 }];
        u.length > 0;

      ) {
        var ut = u.pop(),
          _t = ut.pos - G;
        ut.isDashed
          ? wt.push({ type: "elem", elem: ht, shift: _t })
          : wt.push({ type: "elem", elem: Et, shift: _t });
      }
      l = W.makeVList({ positionType: "individualShift", children: wt }, n);
    }
    if (ee.length === 0) return W.makeSpan(["mord"], [l], n);
    var ft = W.makeVList({ positionType: "individualShift", children: ee }, n);
    return ((ft = W.makeSpan(["tag"], [ft], n)), W.makeFragment([l, ft]));
  },
  j2 = { c: "center ", l: "left ", r: "right " },
  lr = function (e, n) {
    for (
      var r = [],
        i = new re.MathNode("mtd", [], ["mtr-glue"]),
        a = new re.MathNode("mtd", [], ["mml-eqn-num"]),
        s = 0;
      s < e.body.length;
      s++
    ) {
      for (var o = e.body[s], l = [], u = 0; u < o.length; u++)
        l.push(new re.MathNode("mtd", [Ze(o[u], n)]));
      (e.tags &&
        e.tags[s] &&
        (l.unshift(i), l.push(i), e.leqno ? l.unshift(a) : l.push(a)),
        r.push(new re.MathNode("mtr", l)));
    }
    var h = new re.MathNode("mtable", r),
      d =
        e.arraystretch === 0.5
          ? 0.1
          : 0.16 + e.arraystretch - 1 + (e.addJot ? 0.09 : 0);
    h.setAttribute("rowspacing", ce(d));
    var p = "",
      m = "";
    if (e.cols && e.cols.length > 0) {
      var y = e.cols,
        S = "",
        A = !1,
        C = 0,
        b = y.length;
      (y[0].type === "separator" && ((p += "top "), (C = 1)),
        y[y.length - 1].type === "separator" && ((p += "bottom "), (b -= 1)));
      for (var T = C; T < b; T++)
        y[T].type === "align"
          ? ((m += j2[y[T].align]), A && (S += "none "), (A = !0))
          : y[T].type === "separator" &&
            A &&
            ((S += y[T].separator === "|" ? "solid " : "dashed "), (A = !1));
      (h.setAttribute("columnalign", m.trim()),
        /[sd]/.test(S) && h.setAttribute("columnlines", S.trim()));
    }
    if (e.colSeparationType === "align") {
      for (var v = e.cols || [], E = "", x = 1; x < v.length; x++)
        E += x % 2 ? "0em " : "1em ";
      h.setAttribute("columnspacing", E.trim());
    } else
      e.colSeparationType === "alignat" || e.colSeparationType === "gather"
        ? h.setAttribute("columnspacing", "0em")
        : e.colSeparationType === "small"
          ? h.setAttribute("columnspacing", "0.2778em")
          : e.colSeparationType === "CD"
            ? h.setAttribute("columnspacing", "0.5em")
            : h.setAttribute("columnspacing", "1em");
    var _ = "",
      j = e.hLinesBeforeRow;
    ((p += j[0].length > 0 ? "left " : ""),
      (p += j[j.length - 1].length > 0 ? "right " : ""));
    for (var F = 1; F < j.length - 1; F++)
      _ += j[F].length === 0 ? "none " : j[F][0] ? "dashed " : "solid ";
    return (
      /[sd]/.test(_) && h.setAttribute("rowlines", _.trim()),
      p !== "" &&
        ((h = new re.MathNode("menclose", [h])),
        h.setAttribute("notation", p.trim())),
      e.arraystretch &&
        e.arraystretch < 1 &&
        ((h = new re.MathNode("mstyle", [h])),
        h.setAttribute("scriptlevel", "1")),
      h
    );
  },
  Yd = function (e, n) {
    e.envName.indexOf("ed") === -1 && no(e);
    var r = [],
      i = e.envName.indexOf("at") > -1 ? "alignat" : "align",
      a = e.envName === "split",
      s = ti(
        e.parser,
        {
          cols: r,
          addJot: !0,
          autoTag: a ? void 0 : F0(e.envName),
          emptySingleRow: !0,
          colSeparationType: i,
          maxNumCols: a ? 2 : void 0,
          leqno: e.parser.settings.leqno,
        },
        "display",
      ),
      o,
      l = 0,
      u = { type: "ordgroup", mode: e.mode, body: [] };
    if (n[0] && n[0].type === "ordgroup") {
      for (var h = "", d = 0; d < n[0].body.length; d++) {
        var p = _e(n[0].body[d], "textord");
        h += p.text;
      }
      ((o = Number(h)), (l = o * 2));
    }
    var m = !l;
    s.body.forEach(function (C) {
      for (var b = 1; b < C.length; b += 2) {
        var T = _e(C[b], "styling"),
          v = _e(T.body[0], "ordgroup");
        v.body.unshift(u);
      }
      if (m) l < C.length && (l = C.length);
      else {
        var E = C.length / 2;
        if (o < E)
          throw new ae(
            "Too many math in a row: " + ("expected " + o + ", but got " + E),
            C[0],
          );
      }
    });
    for (var y = 0; y < l; ++y) {
      var S = "r",
        A = 0;
      (y % 2 === 1 ? (S = "l") : y > 0 && m && (A = 1),
        (r[y] = { type: "align", align: S, pregap: A, postgap: 0 }));
    }
    return ((s.colSeparationType = m ? "align" : "alignat"), s);
  };
sr({
  type: "array",
  names: ["array", "darray"],
  props: { numArgs: 1 },
  handler(t, e) {
    var n = Js(e[0]),
      r = n ? [e[0]] : _e(e[0], "ordgroup").body,
      i = r.map(function (s) {
        var o = M0(s),
          l = o.text;
        if ("lcr".indexOf(l) !== -1) return { type: "align", align: l };
        if (l === "|") return { type: "separator", separator: "|" };
        if (l === ":") return { type: "separator", separator: ":" };
        throw new ae("Unknown column alignment: " + l, s);
      }),
      a = { cols: i, hskipBeforeAndAfter: !0, maxNumCols: i.length };
    return ti(t.parser, a, _0(t.envName));
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: [
    "matrix",
    "pmatrix",
    "bmatrix",
    "Bmatrix",
    "vmatrix",
    "Vmatrix",
    "matrix*",
    "pmatrix*",
    "bmatrix*",
    "Bmatrix*",
    "vmatrix*",
    "Vmatrix*",
  ],
  props: { numArgs: 0 },
  handler(t) {
    var e = {
        matrix: null,
        pmatrix: ["(", ")"],
        bmatrix: ["[", "]"],
        Bmatrix: ["\\{", "\\}"],
        vmatrix: ["|", "|"],
        Vmatrix: ["\\Vert", "\\Vert"],
      }[t.envName.replace("*", "")],
      n = "c",
      r = { hskipBeforeAndAfter: !1, cols: [{ type: "align", align: n }] };
    if (t.envName.charAt(t.envName.length - 1) === "*") {
      var i = t.parser;
      if ((i.consumeSpaces(), i.fetch().text === "[")) {
        if (
          (i.consume(),
          i.consumeSpaces(),
          (n = i.fetch().text),
          "lcr".indexOf(n) === -1)
        )
          throw new ae("Expected l or c or r", i.nextToken);
        (i.consume(),
          i.consumeSpaces(),
          i.expect("]"),
          i.consume(),
          (r.cols = [{ type: "align", align: n }]));
      }
    }
    var a = ti(t.parser, r, _0(t.envName)),
      s = Math.max(0, ...a.body.map((o) => o.length));
    return (
      (a.cols = new Array(s).fill({ type: "align", align: n })),
      e
        ? {
            type: "leftright",
            mode: t.mode,
            body: [a],
            left: e[0],
            right: e[1],
            rightColor: void 0,
          }
        : a
    );
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["smallmatrix"],
  props: { numArgs: 0 },
  handler(t) {
    var e = { arraystretch: 0.5 },
      n = ti(t.parser, e, "script");
    return ((n.colSeparationType = "small"), n);
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["subarray"],
  props: { numArgs: 1 },
  handler(t, e) {
    var n = Js(e[0]),
      r = n ? [e[0]] : _e(e[0], "ordgroup").body,
      i = r.map(function (s) {
        var o = M0(s),
          l = o.text;
        if ("lc".indexOf(l) !== -1) return { type: "align", align: l };
        throw new ae("Unknown column alignment: " + l, s);
      });
    if (i.length > 1) throw new ae("{subarray} can contain only one column");
    var a = { cols: i, hskipBeforeAndAfter: !1, arraystretch: 0.5 };
    if (
      ((a = ti(t.parser, a, "script")),
      a.body.length > 0 && a.body[0].length > 1)
    )
      throw new ae("{subarray} can contain only one column");
    return a;
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["cases", "dcases", "rcases", "drcases"],
  props: { numArgs: 0 },
  handler(t) {
    var e = {
        arraystretch: 1.2,
        cols: [
          { type: "align", align: "l", pregap: 0, postgap: 1 },
          { type: "align", align: "l", pregap: 0, postgap: 0 },
        ],
      },
      n = ti(t.parser, e, _0(t.envName));
    return {
      type: "leftright",
      mode: t.mode,
      body: [n],
      left: t.envName.indexOf("r") > -1 ? "." : "\\{",
      right: t.envName.indexOf("r") > -1 ? "\\}" : ".",
      rightColor: void 0,
    };
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["align", "align*", "aligned", "split"],
  props: { numArgs: 0 },
  handler: Yd,
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["gathered", "gather", "gather*"],
  props: { numArgs: 0 },
  handler(t) {
    Ee.contains(["gather", "gather*"], t.envName) && no(t);
    var e = {
      cols: [{ type: "align", align: "c" }],
      addJot: !0,
      colSeparationType: "gather",
      autoTag: F0(t.envName),
      emptySingleRow: !0,
      leqno: t.parser.settings.leqno,
    };
    return ti(t.parser, e, "display");
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["alignat", "alignat*", "alignedat"],
  props: { numArgs: 1 },
  handler: Yd,
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["equation", "equation*"],
  props: { numArgs: 0 },
  handler(t) {
    no(t);
    var e = {
      autoTag: F0(t.envName),
      emptySingleRow: !0,
      singleRow: !0,
      maxNumCols: 1,
      leqno: t.parser.settings.leqno,
    };
    return ti(t.parser, e, "display");
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
sr({
  type: "array",
  names: ["CD"],
  props: { numArgs: 0 },
  handler(t) {
    return (no(t), D2(t.parser));
  },
  htmlBuilder: or,
  mathmlBuilder: lr,
});
w("\\nonumber", "\\gdef\\@eqnsw{0}");
w("\\notag", "\\nonumber");
me({
  type: "text",
  names: ["\\hline", "\\hdashline"],
  props: { numArgs: 0, allowedInText: !0, allowedInMath: !0 },
  handler(t, e) {
    throw new ae(t.funcName + " valid only within array environment");
  },
});
var gu = Wd;
me({
  type: "environment",
  names: ["\\begin", "\\end"],
  props: { numArgs: 1, argTypes: ["text"] },
  handler(t, e) {
    var { parser: n, funcName: r } = t,
      i = e[0];
    if (i.type !== "ordgroup") throw new ae("Invalid environment name", i);
    for (var a = "", s = 0; s < i.body.length; ++s)
      a += _e(i.body[s], "textord").text;
    if (r === "\\begin") {
      if (!gu.hasOwnProperty(a)) throw new ae("No such environment: " + a, i);
      var o = gu[a],
        { args: l, optArgs: u } = n.parseArguments("\\begin{" + a + "}", o),
        h = { mode: n.mode, envName: a, parser: n },
        d = o.handler(h, l, u);
      n.expect("\\end", !1);
      var p = n.nextToken,
        m = _e(n.parseFunction(), "environment");
      if (m.name !== a)
        throw new ae(
          "Mismatch: \\begin{" + a + "} matched by \\end{" + m.name + "}",
          p,
        );
      return d;
    }
    return { type: "environment", mode: n.mode, name: a, nameGroup: i };
  },
});
var Xd = (t, e) => {
    var n = t.font,
      r = e.withFont(n);
    return Ve(t.body, r);
  },
  Kd = (t, e) => {
    var n = t.font,
      r = e.withFont(n);
    return Ze(t.body, r);
  },
  vu = {
    "\\Bbb": "\\mathbb",
    "\\bold": "\\mathbf",
    "\\frak": "\\mathfrak",
    "\\bm": "\\boldsymbol",
  };
me({
  type: "font",
  names: [
    "\\mathrm",
    "\\mathit",
    "\\mathbf",
    "\\mathnormal",
    "\\mathsfit",
    "\\mathbb",
    "\\mathcal",
    "\\mathfrak",
    "\\mathscr",
    "\\mathsf",
    "\\mathtt",
    "\\Bbb",
    "\\bold",
    "\\frak",
  ],
  props: { numArgs: 1, allowedInArgument: !0 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = Bs(e[0]),
      a = r;
    return (
      a in vu && (a = vu[a]),
      { type: "font", mode: n.mode, font: a.slice(1), body: i }
    );
  },
  htmlBuilder: Xd,
  mathmlBuilder: Kd,
});
me({
  type: "mclass",
  names: ["\\boldsymbol", "\\bm"],
  props: { numArgs: 1 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = e[0],
      i = Ee.isCharacterBox(r);
    return {
      type: "mclass",
      mode: n.mode,
      mclass: eo(r),
      body: [{ type: "font", mode: n.mode, font: "boldsymbol", body: r }],
      isCharacterBox: i,
    };
  },
});
me({
  type: "font",
  names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
  props: { numArgs: 0, allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n, funcName: r, breakOnTokenText: i } = t,
      { mode: a } = n,
      s = n.parseExpression(!0, i),
      o = "math" + r.slice(1);
    return {
      type: "font",
      mode: a,
      font: o,
      body: { type: "ordgroup", mode: n.mode, body: s },
    };
  },
  htmlBuilder: Xd,
  mathmlBuilder: Kd,
});
var Qd = (t, e) => {
    var n = e;
    return (
      t === "display"
        ? (n = n.id >= Me.SCRIPT.id ? n.text() : Me.DISPLAY)
        : t === "text" && n.size === Me.DISPLAY.size
          ? (n = Me.TEXT)
          : t === "script"
            ? (n = Me.SCRIPT)
            : t === "scriptscript" && (n = Me.SCRIPTSCRIPT),
      n
    );
  },
  O0 = (t, e) => {
    var n = Qd(t.size, e.style),
      r = n.fracNum(),
      i = n.fracDen(),
      a;
    a = e.havingStyle(r);
    var s = Ve(t.numer, a, e);
    if (t.continued) {
      var o = 8.5 / e.fontMetrics().ptPerEm,
        l = 3.5 / e.fontMetrics().ptPerEm;
      ((s.height = s.height < o ? o : s.height),
        (s.depth = s.depth < l ? l : s.depth));
    }
    a = e.havingStyle(i);
    var u = Ve(t.denom, a, e),
      h,
      d,
      p;
    t.hasBarLine
      ? (t.barSize
          ? ((d = ot(t.barSize, e)), (h = W.makeLineSpan("frac-line", e, d)))
          : (h = W.makeLineSpan("frac-line", e)),
        (d = h.height),
        (p = h.height))
      : ((h = null), (d = 0), (p = e.fontMetrics().defaultRuleThickness));
    var m, y, S;
    n.size === Me.DISPLAY.size || t.size === "display"
      ? ((m = e.fontMetrics().num1),
        d > 0 ? (y = 3 * p) : (y = 7 * p),
        (S = e.fontMetrics().denom1))
      : (d > 0
          ? ((m = e.fontMetrics().num2), (y = p))
          : ((m = e.fontMetrics().num3), (y = 3 * p)),
        (S = e.fontMetrics().denom2));
    var A;
    if (h) {
      var b = e.fontMetrics().axisHeight;
      (m - s.depth - (b + 0.5 * d) < y &&
        (m += y - (m - s.depth - (b + 0.5 * d))),
        b - 0.5 * d - (u.height - S) < y &&
          (S += y - (b - 0.5 * d - (u.height - S))));
      var T = -(b - 0.5 * d);
      A = W.makeVList(
        {
          positionType: "individualShift",
          children: [
            { type: "elem", elem: u, shift: S },
            { type: "elem", elem: h, shift: T },
            { type: "elem", elem: s, shift: -m },
          ],
        },
        e,
      );
    } else {
      var C = m - s.depth - (u.height - S);
      (C < y && ((m += 0.5 * (y - C)), (S += 0.5 * (y - C))),
        (A = W.makeVList(
          {
            positionType: "individualShift",
            children: [
              { type: "elem", elem: u, shift: S },
              { type: "elem", elem: s, shift: -m },
            ],
          },
          e,
        )));
    }
    ((a = e.havingStyle(n)),
      (A.height *= a.sizeMultiplier / e.sizeMultiplier),
      (A.depth *= a.sizeMultiplier / e.sizeMultiplier));
    var v;
    n.size === Me.DISPLAY.size
      ? (v = e.fontMetrics().delim1)
      : n.size === Me.SCRIPTSCRIPT.size
        ? (v = e.havingStyle(Me.SCRIPT).fontMetrics().delim2)
        : (v = e.fontMetrics().delim2);
    var E, x;
    return (
      t.leftDelim == null
        ? (E = wa(e, ["mopen"]))
        : (E = kr.customSizedDelim(
            t.leftDelim,
            v,
            !0,
            e.havingStyle(n),
            t.mode,
            ["mopen"],
          )),
      t.continued
        ? (x = W.makeSpan([]))
        : t.rightDelim == null
          ? (x = wa(e, ["mclose"]))
          : (x = kr.customSizedDelim(
              t.rightDelim,
              v,
              !0,
              e.havingStyle(n),
              t.mode,
              ["mclose"],
            )),
      W.makeSpan(
        ["mord"].concat(a.sizingClasses(e)),
        [E, W.makeSpan(["mfrac"], [A]), x],
        e,
      )
    );
  },
  B0 = (t, e) => {
    var n = new re.MathNode("mfrac", [Ze(t.numer, e), Ze(t.denom, e)]);
    if (!t.hasBarLine) n.setAttribute("linethickness", "0px");
    else if (t.barSize) {
      var r = ot(t.barSize, e);
      n.setAttribute("linethickness", ce(r));
    }
    var i = Qd(t.size, e.style);
    if (i.size !== e.style.size) {
      n = new re.MathNode("mstyle", [n]);
      var a = i.size === Me.DISPLAY.size ? "true" : "false";
      (n.setAttribute("displaystyle", a), n.setAttribute("scriptlevel", "0"));
    }
    if (t.leftDelim != null || t.rightDelim != null) {
      var s = [];
      if (t.leftDelim != null) {
        var o = new re.MathNode("mo", [
          new re.TextNode(t.leftDelim.replace("\\", "")),
        ]);
        (o.setAttribute("fence", "true"), s.push(o));
      }
      if ((s.push(n), t.rightDelim != null)) {
        var l = new re.MathNode("mo", [
          new re.TextNode(t.rightDelim.replace("\\", "")),
        ]);
        (l.setAttribute("fence", "true"), s.push(l));
      }
      return C0(s);
    }
    return n;
  };
me({
  type: "genfrac",
  names: [
    "\\dfrac",
    "\\frac",
    "\\tfrac",
    "\\dbinom",
    "\\binom",
    "\\tbinom",
    "\\\\atopfrac",
    "\\\\bracefrac",
    "\\\\brackfrac",
  ],
  props: { numArgs: 2, allowedInArgument: !0 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = e[0],
      a = e[1],
      s,
      o = null,
      l = null,
      u = "auto";
    switch (r) {
      case "\\dfrac":
      case "\\frac":
      case "\\tfrac":
        s = !0;
        break;
      case "\\\\atopfrac":
        s = !1;
        break;
      case "\\dbinom":
      case "\\binom":
      case "\\tbinom":
        ((s = !1), (o = "("), (l = ")"));
        break;
      case "\\\\bracefrac":
        ((s = !1), (o = "\\{"), (l = "\\}"));
        break;
      case "\\\\brackfrac":
        ((s = !1), (o = "["), (l = "]"));
        break;
      default:
        throw new Error("Unrecognized genfrac command");
    }
    switch (r) {
      case "\\dfrac":
      case "\\dbinom":
        u = "display";
        break;
      case "\\tfrac":
      case "\\tbinom":
        u = "text";
        break;
    }
    return {
      type: "genfrac",
      mode: n.mode,
      continued: !1,
      numer: i,
      denom: a,
      hasBarLine: s,
      leftDelim: o,
      rightDelim: l,
      size: u,
      barSize: null,
    };
  },
  htmlBuilder: O0,
  mathmlBuilder: B0,
});
me({
  type: "genfrac",
  names: ["\\cfrac"],
  props: { numArgs: 2 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = e[0],
      a = e[1];
    return {
      type: "genfrac",
      mode: n.mode,
      continued: !0,
      numer: i,
      denom: a,
      hasBarLine: !0,
      leftDelim: null,
      rightDelim: null,
      size: "display",
      barSize: null,
    };
  },
});
me({
  type: "infix",
  names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
  props: { numArgs: 0, infix: !0 },
  handler(t) {
    var { parser: e, funcName: n, token: r } = t,
      i;
    switch (n) {
      case "\\over":
        i = "\\frac";
        break;
      case "\\choose":
        i = "\\binom";
        break;
      case "\\atop":
        i = "\\\\atopfrac";
        break;
      case "\\brace":
        i = "\\\\bracefrac";
        break;
      case "\\brack":
        i = "\\\\brackfrac";
        break;
      default:
        throw new Error("Unrecognized infix genfrac command");
    }
    return { type: "infix", mode: e.mode, replaceWith: i, token: r };
  },
});
var bu = ["display", "text", "script", "scriptscript"],
  yu = function (e) {
    var n = null;
    return (e.length > 0 && ((n = e), (n = n === "." ? null : n)), n);
  };
me({
  type: "genfrac",
  names: ["\\genfrac"],
  props: {
    numArgs: 6,
    allowedInArgument: !0,
    argTypes: ["math", "math", "size", "text", "math", "math"],
  },
  handler(t, e) {
    var { parser: n } = t,
      r = e[4],
      i = e[5],
      a = Bs(e[0]),
      s = a.type === "atom" && a.family === "open" ? yu(a.text) : null,
      o = Bs(e[1]),
      l = o.type === "atom" && o.family === "close" ? yu(o.text) : null,
      u = _e(e[2], "size"),
      h,
      d = null;
    u.isBlank ? (h = !0) : ((d = u.value), (h = d.number > 0));
    var p = "auto",
      m = e[3];
    if (m.type === "ordgroup") {
      if (m.body.length > 0) {
        var y = _e(m.body[0], "textord");
        p = bu[Number(y.text)];
      }
    } else ((m = _e(m, "textord")), (p = bu[Number(m.text)]));
    return {
      type: "genfrac",
      mode: n.mode,
      numer: r,
      denom: i,
      continued: !1,
      hasBarLine: h,
      barSize: d,
      leftDelim: s,
      rightDelim: l,
      size: p,
    };
  },
  htmlBuilder: O0,
  mathmlBuilder: B0,
});
me({
  type: "infix",
  names: ["\\above"],
  props: { numArgs: 1, argTypes: ["size"], infix: !0 },
  handler(t, e) {
    var { parser: n, funcName: r, token: i } = t;
    return {
      type: "infix",
      mode: n.mode,
      replaceWith: "\\\\abovefrac",
      size: _e(e[0], "size").value,
      token: i,
    };
  },
});
me({
  type: "genfrac",
  names: ["\\\\abovefrac"],
  props: { numArgs: 3, argTypes: ["math", "size", "math"] },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = e[0],
      a = wg(_e(e[1], "infix").size),
      s = e[2],
      o = a.number > 0;
    return {
      type: "genfrac",
      mode: n.mode,
      numer: i,
      denom: s,
      continued: !1,
      hasBarLine: o,
      barSize: a,
      leftDelim: null,
      rightDelim: null,
      size: "auto",
    };
  },
  htmlBuilder: O0,
  mathmlBuilder: B0,
});
var Zd = (t, e) => {
    var n = e.style,
      r,
      i;
    t.type === "supsub"
      ? ((r = t.sup
          ? Ve(t.sup, e.havingStyle(n.sup()), e)
          : Ve(t.sub, e.havingStyle(n.sub()), e)),
        (i = _e(t.base, "horizBrace")))
      : (i = _e(t, "horizBrace"));
    var a = Ve(i.base, e.havingBaseStyle(Me.DISPLAY)),
      s = Tr.svgSpan(i, e),
      o;
    if (
      (i.isOver
        ? ((o = W.makeVList(
            {
              positionType: "firstBaseline",
              children: [
                { type: "elem", elem: a },
                { type: "kern", size: 0.1 },
                { type: "elem", elem: s },
              ],
            },
            e,
          )),
          o.children[0].children[0].children[1].classes.push("svg-align"))
        : ((o = W.makeVList(
            {
              positionType: "bottom",
              positionData: a.depth + 0.1 + s.height,
              children: [
                { type: "elem", elem: s },
                { type: "kern", size: 0.1 },
                { type: "elem", elem: a },
              ],
            },
            e,
          )),
          o.children[0].children[0].children[0].classes.push("svg-align")),
      r)
    ) {
      var l = W.makeSpan(["mord", i.isOver ? "mover" : "munder"], [o], e);
      i.isOver
        ? (o = W.makeVList(
            {
              positionType: "firstBaseline",
              children: [
                { type: "elem", elem: l },
                { type: "kern", size: 0.2 },
                { type: "elem", elem: r },
              ],
            },
            e,
          ))
        : (o = W.makeVList(
            {
              positionType: "bottom",
              positionData: l.depth + 0.2 + r.height + r.depth,
              children: [
                { type: "elem", elem: r },
                { type: "kern", size: 0.2 },
                { type: "elem", elem: l },
              ],
            },
            e,
          ));
    }
    return W.makeSpan(["mord", i.isOver ? "mover" : "munder"], [o], e);
  },
  W2 = (t, e) => {
    var n = Tr.mathMLnode(t.label);
    return new re.MathNode(t.isOver ? "mover" : "munder", [Ze(t.base, e), n]);
  };
me({
  type: "horizBrace",
  names: ["\\overbrace", "\\underbrace"],
  props: { numArgs: 1 },
  handler(t, e) {
    var { parser: n, funcName: r } = t;
    return {
      type: "horizBrace",
      mode: n.mode,
      label: r,
      isOver: /^\\over/.test(r),
      base: e[0],
    };
  },
  htmlBuilder: Zd,
  mathmlBuilder: W2,
});
me({
  type: "href",
  names: ["\\href"],
  props: { numArgs: 2, argTypes: ["url", "original"], allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = e[1],
      i = _e(e[0], "url").url;
    return n.settings.isTrusted({ command: "\\href", url: i })
      ? { type: "href", mode: n.mode, href: i, body: bt(r) }
      : n.formatUnsupportedCmd("\\href");
  },
  htmlBuilder: (t, e) => {
    var n = Lt(t.body, e, !1);
    return W.makeAnchor(t.href, [], n, e);
  },
  mathmlBuilder: (t, e) => {
    var n = Qr(t.body, e);
    return (
      n instanceof pn || (n = new pn("mrow", [n])),
      n.setAttribute("href", t.href),
      n
    );
  },
});
me({
  type: "href",
  names: ["\\url"],
  props: { numArgs: 1, argTypes: ["url"], allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = _e(e[0], "url").url;
    if (!n.settings.isTrusted({ command: "\\url", url: r }))
      return n.formatUnsupportedCmd("\\url");
    for (var i = [], a = 0; a < r.length; a++) {
      var s = r[a];
      (s === "~" && (s = "\\textasciitilde"),
        i.push({ type: "textord", mode: "text", text: s }));
    }
    var o = { type: "text", mode: n.mode, font: "\\texttt", body: i };
    return { type: "href", mode: n.mode, href: r, body: bt(o) };
  },
});
me({
  type: "hbox",
  names: ["\\hbox"],
  props: { numArgs: 1, argTypes: ["text"], allowedInText: !0, primitive: !0 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "hbox", mode: n.mode, body: bt(e[0]) };
  },
  htmlBuilder(t, e) {
    var n = Lt(t.body, e, !1);
    return W.makeFragment(n);
  },
  mathmlBuilder(t, e) {
    return new re.MathNode("mrow", hn(t.body, e));
  },
});
me({
  type: "html",
  names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
  props: { numArgs: 2, argTypes: ["raw", "original"], allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n, funcName: r, token: i } = t,
      a = _e(e[0], "raw").string,
      s = e[1];
    n.settings.strict &&
      n.settings.reportNonstrict(
        "htmlExtension",
        "HTML extension is disabled on strict mode",
      );
    var o,
      l = {};
    switch (r) {
      case "\\htmlClass":
        ((l.class = a), (o = { command: "\\htmlClass", class: a }));
        break;
      case "\\htmlId":
        ((l.id = a), (o = { command: "\\htmlId", id: a }));
        break;
      case "\\htmlStyle":
        ((l.style = a), (o = { command: "\\htmlStyle", style: a }));
        break;
      case "\\htmlData": {
        for (var u = a.split(","), h = 0; h < u.length; h++) {
          var d = u[h].split("=");
          if (d.length !== 2)
            throw new ae("Error parsing key-value for \\htmlData");
          l["data-" + d[0].trim()] = d[1].trim();
        }
        o = { command: "\\htmlData", attributes: l };
        break;
      }
      default:
        throw new Error("Unrecognized html command");
    }
    return n.settings.isTrusted(o)
      ? { type: "html", mode: n.mode, attributes: l, body: bt(s) }
      : n.formatUnsupportedCmd(r);
  },
  htmlBuilder: (t, e) => {
    var n = Lt(t.body, e, !1),
      r = ["enclosing"];
    t.attributes.class && r.push(...t.attributes.class.trim().split(/\s+/));
    var i = W.makeSpan(r, n, e);
    for (var a in t.attributes)
      a !== "class" &&
        t.attributes.hasOwnProperty(a) &&
        i.setAttribute(a, t.attributes[a]);
    return i;
  },
  mathmlBuilder: (t, e) => Qr(t.body, e),
});
me({
  type: "htmlmathml",
  names: ["\\html@mathml"],
  props: { numArgs: 2, allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n } = t;
    return {
      type: "htmlmathml",
      mode: n.mode,
      html: bt(e[0]),
      mathml: bt(e[1]),
    };
  },
  htmlBuilder: (t, e) => {
    var n = Lt(t.html, e, !1);
    return W.makeFragment(n);
  },
  mathmlBuilder: (t, e) => Qr(t.mathml, e),
});
var Oo = function (e) {
  if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e)) return { number: +e, unit: "bp" };
  var n = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);
  if (!n) throw new ae("Invalid size: '" + e + "' in \\includegraphics");
  var r = { number: +(n[1] + n[2]), unit: n[3] };
  if (!bd(r))
    throw new ae("Invalid unit: '" + r.unit + "' in \\includegraphics.");
  return r;
};
me({
  type: "includegraphics",
  names: ["\\includegraphics"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    argTypes: ["raw", "url"],
    allowedInText: !1,
  },
  handler: (t, e, n) => {
    var { parser: r } = t,
      i = { number: 0, unit: "em" },
      a = { number: 0.9, unit: "em" },
      s = { number: 0, unit: "em" },
      o = "";
    if (n[0])
      for (
        var l = _e(n[0], "raw").string, u = l.split(","), h = 0;
        h < u.length;
        h++
      ) {
        var d = u[h].split("=");
        if (d.length === 2) {
          var p = d[1].trim();
          switch (d[0].trim()) {
            case "alt":
              o = p;
              break;
            case "width":
              i = Oo(p);
              break;
            case "height":
              a = Oo(p);
              break;
            case "totalheight":
              s = Oo(p);
              break;
            default:
              throw new ae("Invalid key: '" + d[0] + "' in \\includegraphics.");
          }
        }
      }
    var m = _e(e[0], "url").url;
    return (
      o === "" &&
        ((o = m),
        (o = o.replace(/^.*[\\/]/, "")),
        (o = o.substring(0, o.lastIndexOf(".")))),
      r.settings.isTrusted({ command: "\\includegraphics", url: m })
        ? {
            type: "includegraphics",
            mode: r.mode,
            alt: o,
            width: i,
            height: a,
            totalheight: s,
            src: m,
          }
        : r.formatUnsupportedCmd("\\includegraphics")
    );
  },
  htmlBuilder: (t, e) => {
    var n = ot(t.height, e),
      r = 0;
    t.totalheight.number > 0 && (r = ot(t.totalheight, e) - n);
    var i = 0;
    t.width.number > 0 && (i = ot(t.width, e));
    var a = { height: ce(n + r) };
    (i > 0 && (a.width = ce(i)), r > 0 && (a.verticalAlign = ce(-r)));
    var s = new jg(t.src, t.alt, a);
    return ((s.height = n), (s.depth = r), s);
  },
  mathmlBuilder: (t, e) => {
    var n = new re.MathNode("mglyph", []);
    n.setAttribute("alt", t.alt);
    var r = ot(t.height, e),
      i = 0;
    if (
      (t.totalheight.number > 0 &&
        ((i = ot(t.totalheight, e) - r), n.setAttribute("valign", ce(-i))),
      n.setAttribute("height", ce(r + i)),
      t.width.number > 0)
    ) {
      var a = ot(t.width, e);
      n.setAttribute("width", ce(a));
    }
    return (n.setAttribute("src", t.src), n);
  },
});
me({
  type: "kern",
  names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
  props: { numArgs: 1, argTypes: ["size"], primitive: !0, allowedInText: !0 },
  handler(t, e) {
    var { parser: n, funcName: r } = t,
      i = _e(e[0], "size");
    if (n.settings.strict) {
      var a = r[1] === "m",
        s = i.value.unit === "mu";
      a
        ? (s ||
            n.settings.reportNonstrict(
              "mathVsTextUnits",
              "LaTeX's " +
                r +
                " supports only mu units, " +
                ("not " + i.value.unit + " units"),
            ),
          n.mode !== "math" &&
            n.settings.reportNonstrict(
              "mathVsTextUnits",
              "LaTeX's " + r + " works only in math mode",
            ))
        : s &&
          n.settings.reportNonstrict(
            "mathVsTextUnits",
            "LaTeX's " + r + " doesn't support mu units",
          );
    }
    return { type: "kern", mode: n.mode, dimension: i.value };
  },
  htmlBuilder(t, e) {
    return W.makeGlue(t.dimension, e);
  },
  mathmlBuilder(t, e) {
    var n = ot(t.dimension, e);
    return new re.SpaceNode(n);
  },
});
me({
  type: "lap",
  names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
  props: { numArgs: 1, allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = e[0];
    return { type: "lap", mode: n.mode, alignment: r.slice(5), body: i };
  },
  htmlBuilder: (t, e) => {
    var n;
    t.alignment === "clap"
      ? ((n = W.makeSpan([], [Ve(t.body, e)])),
        (n = W.makeSpan(["inner"], [n], e)))
      : (n = W.makeSpan(["inner"], [Ve(t.body, e)]));
    var r = W.makeSpan(["fix"], []),
      i = W.makeSpan([t.alignment], [n, r], e),
      a = W.makeSpan(["strut"]);
    return (
      (a.style.height = ce(i.height + i.depth)),
      i.depth && (a.style.verticalAlign = ce(-i.depth)),
      i.children.unshift(a),
      (i = W.makeSpan(["thinbox"], [i], e)),
      W.makeSpan(["mord", "vbox"], [i], e)
    );
  },
  mathmlBuilder: (t, e) => {
    var n = new re.MathNode("mpadded", [Ze(t.body, e)]);
    if (t.alignment !== "rlap") {
      var r = t.alignment === "llap" ? "-1" : "-0.5";
      n.setAttribute("lspace", r + "width");
    }
    return (n.setAttribute("width", "0px"), n);
  },
});
me({
  type: "styling",
  names: ["\\(", "$"],
  props: { numArgs: 0, allowedInText: !0, allowedInMath: !1 },
  handler(t, e) {
    var { funcName: n, parser: r } = t,
      i = r.mode;
    r.switchMode("math");
    var a = n === "\\(" ? "\\)" : "$",
      s = r.parseExpression(!1, a);
    return (
      r.expect(a),
      r.switchMode(i),
      { type: "styling", mode: r.mode, style: "text", body: s }
    );
  },
});
me({
  type: "text",
  names: ["\\)", "\\]"],
  props: { numArgs: 0, allowedInText: !0, allowedInMath: !1 },
  handler(t, e) {
    throw new ae("Mismatched " + t.funcName);
  },
});
var wu = (t, e) => {
  switch (e.style.size) {
    case Me.DISPLAY.size:
      return t.display;
    case Me.TEXT.size:
      return t.text;
    case Me.SCRIPT.size:
      return t.script;
    case Me.SCRIPTSCRIPT.size:
      return t.scriptscript;
    default:
      return t.text;
  }
};
me({
  type: "mathchoice",
  names: ["\\mathchoice"],
  props: { numArgs: 4, primitive: !0 },
  handler: (t, e) => {
    var { parser: n } = t;
    return {
      type: "mathchoice",
      mode: n.mode,
      display: bt(e[0]),
      text: bt(e[1]),
      script: bt(e[2]),
      scriptscript: bt(e[3]),
    };
  },
  htmlBuilder: (t, e) => {
    var n = wu(t, e),
      r = Lt(n, e, !1);
    return W.makeFragment(r);
  },
  mathmlBuilder: (t, e) => {
    var n = wu(t, e);
    return Qr(n, e);
  },
});
var Jd = (t, e, n, r, i, a, s) => {
    t = W.makeSpan([], [t]);
    var o = n && Ee.isCharacterBox(n),
      l,
      u;
    if (e) {
      var h = Ve(e, r.havingStyle(i.sup()), r);
      u = {
        elem: h,
        kern: Math.max(
          r.fontMetrics().bigOpSpacing1,
          r.fontMetrics().bigOpSpacing3 - h.depth,
        ),
      };
    }
    if (n) {
      var d = Ve(n, r.havingStyle(i.sub()), r);
      l = {
        elem: d,
        kern: Math.max(
          r.fontMetrics().bigOpSpacing2,
          r.fontMetrics().bigOpSpacing4 - d.height,
        ),
      };
    }
    var p;
    if (u && l) {
      var m =
        r.fontMetrics().bigOpSpacing5 +
        l.elem.height +
        l.elem.depth +
        l.kern +
        t.depth +
        s;
      p = W.makeVList(
        {
          positionType: "bottom",
          positionData: m,
          children: [
            { type: "kern", size: r.fontMetrics().bigOpSpacing5 },
            { type: "elem", elem: l.elem, marginLeft: ce(-a) },
            { type: "kern", size: l.kern },
            { type: "elem", elem: t },
            { type: "kern", size: u.kern },
            { type: "elem", elem: u.elem, marginLeft: ce(a) },
            { type: "kern", size: r.fontMetrics().bigOpSpacing5 },
          ],
        },
        r,
      );
    } else if (l) {
      var y = t.height - s;
      p = W.makeVList(
        {
          positionType: "top",
          positionData: y,
          children: [
            { type: "kern", size: r.fontMetrics().bigOpSpacing5 },
            { type: "elem", elem: l.elem, marginLeft: ce(-a) },
            { type: "kern", size: l.kern },
            { type: "elem", elem: t },
          ],
        },
        r,
      );
    } else if (u) {
      var S = t.depth + s;
      p = W.makeVList(
        {
          positionType: "bottom",
          positionData: S,
          children: [
            { type: "elem", elem: t },
            { type: "kern", size: u.kern },
            { type: "elem", elem: u.elem, marginLeft: ce(a) },
            { type: "kern", size: r.fontMetrics().bigOpSpacing5 },
          ],
        },
        r,
      );
    } else return t;
    var A = [p];
    if (l && a !== 0 && !o) {
      var C = W.makeSpan(["mspace"], [], r);
      ((C.style.marginRight = ce(a)), A.unshift(C));
    }
    return W.makeSpan(["mop", "op-limits"], A, r);
  },
  eh = ["\\smallint"],
  $i = (t, e) => {
    var n,
      r,
      i = !1,
      a;
    t.type === "supsub"
      ? ((n = t.sup), (r = t.sub), (a = _e(t.base, "op")), (i = !0))
      : (a = _e(t, "op"));
    var s = e.style,
      o = !1;
    s.size === Me.DISPLAY.size &&
      a.symbol &&
      !Ee.contains(eh, a.name) &&
      (o = !0);
    var l;
    if (a.symbol) {
      var u = o ? "Size2-Regular" : "Size1-Regular",
        h = "";
      if (
        ((a.name === "\\oiint" || a.name === "\\oiiint") &&
          ((h = a.name.slice(1)),
          (a.name = h === "oiint" ? "\\iint" : "\\iiint")),
        (l = W.makeSymbol(a.name, u, "math", e, [
          "mop",
          "op-symbol",
          o ? "large-op" : "small-op",
        ])),
        h.length > 0)
      ) {
        var d = l.italic,
          p = W.staticSvg(h + "Size" + (o ? "2" : "1"), e);
        ((l = W.makeVList(
          {
            positionType: "individualShift",
            children: [
              { type: "elem", elem: l, shift: 0 },
              { type: "elem", elem: p, shift: o ? 0.08 : 0 },
            ],
          },
          e,
        )),
          (a.name = "\\" + h),
          l.classes.unshift("mop"),
          (l.italic = d));
      }
    } else if (a.body) {
      var m = Lt(a.body, e, !0);
      m.length === 1 && m[0] instanceof Gn
        ? ((l = m[0]), (l.classes[0] = "mop"))
        : (l = W.makeSpan(["mop"], m, e));
    } else {
      for (var y = [], S = 1; S < a.name.length; S++)
        y.push(W.mathsym(a.name[S], a.mode, e));
      l = W.makeSpan(["mop"], y, e);
    }
    var A = 0,
      C = 0;
    return (
      (l instanceof Gn || a.name === "\\oiint" || a.name === "\\oiiint") &&
        !a.suppressBaseShift &&
        ((A = (l.height - l.depth) / 2 - e.fontMetrics().axisHeight),
        (C = l.italic)),
      i
        ? Jd(l, n, r, e, s, C, A)
        : (A && ((l.style.position = "relative"), (l.style.top = ce(A))), l)
    );
  },
  za = (t, e) => {
    var n;
    if (t.symbol)
      ((n = new pn("mo", [Pn(t.name, t.mode)])),
        Ee.contains(eh, t.name) && n.setAttribute("largeop", "false"));
    else if (t.body) n = new pn("mo", hn(t.body, e));
    else {
      n = new pn("mi", [new er(t.name.slice(1))]);
      var r = new pn("mo", [Pn("⁡", "text")]);
      t.parentIsSupSub ? (n = new pn("mrow", [n, r])) : (n = zd([n, r]));
    }
    return n;
  },
  G2 = {
    "∏": "\\prod",
    "∐": "\\coprod",
    "∑": "\\sum",
    "⋀": "\\bigwedge",
    "⋁": "\\bigvee",
    "⋂": "\\bigcap",
    "⋃": "\\bigcup",
    "⨀": "\\bigodot",
    "⨁": "\\bigoplus",
    "⨂": "\\bigotimes",
    "⨄": "\\biguplus",
    "⨆": "\\bigsqcup",
  };
me({
  type: "op",
  names: [
    "\\coprod",
    "\\bigvee",
    "\\bigwedge",
    "\\biguplus",
    "\\bigcap",
    "\\bigcup",
    "\\intop",
    "\\prod",
    "\\sum",
    "\\bigotimes",
    "\\bigoplus",
    "\\bigodot",
    "\\bigsqcup",
    "\\smallint",
    "∏",
    "∐",
    "∑",
    "⋀",
    "⋁",
    "⋂",
    "⋃",
    "⨀",
    "⨁",
    "⨂",
    "⨄",
    "⨆",
  ],
  props: { numArgs: 0 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = r;
    return (
      i.length === 1 && (i = G2[i]),
      {
        type: "op",
        mode: n.mode,
        limits: !0,
        parentIsSupSub: !1,
        symbol: !0,
        name: i,
      }
    );
  },
  htmlBuilder: $i,
  mathmlBuilder: za,
});
me({
  type: "op",
  names: ["\\mathop"],
  props: { numArgs: 1, primitive: !0 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = e[0];
    return {
      type: "op",
      mode: n.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      body: bt(r),
    };
  },
  htmlBuilder: $i,
  mathmlBuilder: za,
});
var Y2 = {
  "∫": "\\int",
  "∬": "\\iint",
  "∭": "\\iiint",
  "∮": "\\oint",
  "∯": "\\oiint",
  "∰": "\\oiiint",
};
me({
  type: "op",
  names: [
    "\\arcsin",
    "\\arccos",
    "\\arctan",
    "\\arctg",
    "\\arcctg",
    "\\arg",
    "\\ch",
    "\\cos",
    "\\cosec",
    "\\cosh",
    "\\cot",
    "\\cotg",
    "\\coth",
    "\\csc",
    "\\ctg",
    "\\cth",
    "\\deg",
    "\\dim",
    "\\exp",
    "\\hom",
    "\\ker",
    "\\lg",
    "\\ln",
    "\\log",
    "\\sec",
    "\\sin",
    "\\sinh",
    "\\sh",
    "\\tan",
    "\\tanh",
    "\\tg",
    "\\th",
  ],
  props: { numArgs: 0 },
  handler(t) {
    var { parser: e, funcName: n } = t;
    return {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      name: n,
    };
  },
  htmlBuilder: $i,
  mathmlBuilder: za,
});
me({
  type: "op",
  names: [
    "\\det",
    "\\gcd",
    "\\inf",
    "\\lim",
    "\\max",
    "\\min",
    "\\Pr",
    "\\sup",
  ],
  props: { numArgs: 0 },
  handler(t) {
    var { parser: e, funcName: n } = t;
    return {
      type: "op",
      mode: e.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !1,
      name: n,
    };
  },
  htmlBuilder: $i,
  mathmlBuilder: za,
});
me({
  type: "op",
  names: [
    "\\int",
    "\\iint",
    "\\iiint",
    "\\oint",
    "\\oiint",
    "\\oiiint",
    "∫",
    "∬",
    "∭",
    "∮",
    "∯",
    "∰",
  ],
  props: { numArgs: 0 },
  handler(t) {
    var { parser: e, funcName: n } = t,
      r = n;
    return (
      r.length === 1 && (r = Y2[r]),
      {
        type: "op",
        mode: e.mode,
        limits: !1,
        parentIsSupSub: !1,
        symbol: !0,
        name: r,
      }
    );
  },
  htmlBuilder: $i,
  mathmlBuilder: za,
});
var th = (t, e) => {
    var n,
      r,
      i = !1,
      a;
    t.type === "supsub"
      ? ((n = t.sup), (r = t.sub), (a = _e(t.base, "operatorname")), (i = !0))
      : (a = _e(t, "operatorname"));
    var s;
    if (a.body.length > 0) {
      for (
        var o = a.body.map((d) => {
            var p = d.text;
            return typeof p == "string"
              ? { type: "textord", mode: d.mode, text: p }
              : d;
          }),
          l = Lt(o, e.withFont("mathrm"), !0),
          u = 0;
        u < l.length;
        u++
      ) {
        var h = l[u];
        h instanceof Gn &&
          (h.text = h.text.replace(/\u2212/, "-").replace(/\u2217/, "*"));
      }
      s = W.makeSpan(["mop"], l, e);
    } else s = W.makeSpan(["mop"], [], e);
    return i ? Jd(s, n, r, e, e.style, 0, 0) : s;
  },
  X2 = (t, e) => {
    for (
      var n = hn(t.body, e.withFont("mathrm")), r = !0, i = 0;
      i < n.length;
      i++
    ) {
      var a = n[i];
      if (!(a instanceof re.SpaceNode))
        if (a instanceof re.MathNode)
          switch (a.type) {
            case "mi":
            case "mn":
            case "ms":
            case "mspace":
            case "mtext":
              break;
            case "mo": {
              var s = a.children[0];
              a.children.length === 1 && s instanceof re.TextNode
                ? (s.text = s.text
                    .replace(/\u2212/, "-")
                    .replace(/\u2217/, "*"))
                : (r = !1);
              break;
            }
            default:
              r = !1;
          }
        else r = !1;
    }
    if (r) {
      var o = n.map((h) => h.toText()).join("");
      n = [new re.TextNode(o)];
    }
    var l = new re.MathNode("mi", n);
    l.setAttribute("mathvariant", "normal");
    var u = new re.MathNode("mo", [Pn("⁡", "text")]);
    return t.parentIsSupSub
      ? new re.MathNode("mrow", [l, u])
      : re.newDocumentFragment([l, u]);
  };
me({
  type: "operatorname",
  names: ["\\operatorname@", "\\operatornamewithlimits"],
  props: { numArgs: 1 },
  handler: (t, e) => {
    var { parser: n, funcName: r } = t,
      i = e[0];
    return {
      type: "operatorname",
      mode: n.mode,
      body: bt(i),
      alwaysHandleSupSub: r === "\\operatornamewithlimits",
      limits: !1,
      parentIsSupSub: !1,
    };
  },
  htmlBuilder: th,
  mathmlBuilder: X2,
});
w("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
mi({
  type: "ordgroup",
  htmlBuilder(t, e) {
    return t.semisimple
      ? W.makeFragment(Lt(t.body, e, !1))
      : W.makeSpan(["mord"], Lt(t.body, e, !0), e);
  },
  mathmlBuilder(t, e) {
    return Qr(t.body, e, !0);
  },
});
me({
  type: "overline",
  names: ["\\overline"],
  props: { numArgs: 1 },
  handler(t, e) {
    var { parser: n } = t,
      r = e[0];
    return { type: "overline", mode: n.mode, body: r };
  },
  htmlBuilder(t, e) {
    var n = Ve(t.body, e.havingCrampedStyle()),
      r = W.makeLineSpan("overline-line", e),
      i = e.fontMetrics().defaultRuleThickness,
      a = W.makeVList(
        {
          positionType: "firstBaseline",
          children: [
            { type: "elem", elem: n },
            { type: "kern", size: 3 * i },
            { type: "elem", elem: r },
            { type: "kern", size: i },
          ],
        },
        e,
      );
    return W.makeSpan(["mord", "overline"], [a], e);
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mo", [new re.TextNode("‾")]);
    n.setAttribute("stretchy", "true");
    var r = new re.MathNode("mover", [Ze(t.body, e), n]);
    return (r.setAttribute("accent", "true"), r);
  },
});
me({
  type: "phantom",
  names: ["\\phantom"],
  props: { numArgs: 1, allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = e[0];
    return { type: "phantom", mode: n.mode, body: bt(r) };
  },
  htmlBuilder: (t, e) => {
    var n = Lt(t.body, e.withPhantom(), !1);
    return W.makeFragment(n);
  },
  mathmlBuilder: (t, e) => {
    var n = hn(t.body, e);
    return new re.MathNode("mphantom", n);
  },
});
me({
  type: "hphantom",
  names: ["\\hphantom"],
  props: { numArgs: 1, allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = e[0];
    return { type: "hphantom", mode: n.mode, body: r };
  },
  htmlBuilder: (t, e) => {
    var n = W.makeSpan([], [Ve(t.body, e.withPhantom())]);
    if (((n.height = 0), (n.depth = 0), n.children))
      for (var r = 0; r < n.children.length; r++)
        ((n.children[r].height = 0), (n.children[r].depth = 0));
    return (
      (n = W.makeVList(
        {
          positionType: "firstBaseline",
          children: [{ type: "elem", elem: n }],
        },
        e,
      )),
      W.makeSpan(["mord"], [n], e)
    );
  },
  mathmlBuilder: (t, e) => {
    var n = hn(bt(t.body), e),
      r = new re.MathNode("mphantom", n),
      i = new re.MathNode("mpadded", [r]);
    return (i.setAttribute("height", "0px"), i.setAttribute("depth", "0px"), i);
  },
});
me({
  type: "vphantom",
  names: ["\\vphantom"],
  props: { numArgs: 1, allowedInText: !0 },
  handler: (t, e) => {
    var { parser: n } = t,
      r = e[0];
    return { type: "vphantom", mode: n.mode, body: r };
  },
  htmlBuilder: (t, e) => {
    var n = W.makeSpan(["inner"], [Ve(t.body, e.withPhantom())]),
      r = W.makeSpan(["fix"], []);
    return W.makeSpan(["mord", "rlap"], [n, r], e);
  },
  mathmlBuilder: (t, e) => {
    var n = hn(bt(t.body), e),
      r = new re.MathNode("mphantom", n),
      i = new re.MathNode("mpadded", [r]);
    return (i.setAttribute("width", "0px"), i);
  },
});
me({
  type: "raisebox",
  names: ["\\raisebox"],
  props: { numArgs: 2, argTypes: ["size", "hbox"], allowedInText: !0 },
  handler(t, e) {
    var { parser: n } = t,
      r = _e(e[0], "size").value,
      i = e[1];
    return { type: "raisebox", mode: n.mode, dy: r, body: i };
  },
  htmlBuilder(t, e) {
    var n = Ve(t.body, e),
      r = ot(t.dy, e);
    return W.makeVList(
      {
        positionType: "shift",
        positionData: -r,
        children: [{ type: "elem", elem: n }],
      },
      e,
    );
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mpadded", [Ze(t.body, e)]),
      r = t.dy.number + t.dy.unit;
    return (n.setAttribute("voffset", r), n);
  },
});
me({
  type: "internal",
  names: ["\\relax"],
  props: { numArgs: 0, allowedInText: !0, allowedInArgument: !0 },
  handler(t) {
    var { parser: e } = t;
    return { type: "internal", mode: e.mode };
  },
});
me({
  type: "rule",
  names: ["\\rule"],
  props: {
    numArgs: 2,
    numOptionalArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    argTypes: ["size", "size", "size"],
  },
  handler(t, e, n) {
    var { parser: r } = t,
      i = n[0],
      a = _e(e[0], "size"),
      s = _e(e[1], "size");
    return {
      type: "rule",
      mode: r.mode,
      shift: i && _e(i, "size").value,
      width: a.value,
      height: s.value,
    };
  },
  htmlBuilder(t, e) {
    var n = W.makeSpan(["mord", "rule"], [], e),
      r = ot(t.width, e),
      i = ot(t.height, e),
      a = t.shift ? ot(t.shift, e) : 0;
    return (
      (n.style.borderRightWidth = ce(r)),
      (n.style.borderTopWidth = ce(i)),
      (n.style.bottom = ce(a)),
      (n.width = r),
      (n.height = i + a),
      (n.depth = -a),
      (n.maxFontSize = i * 1.125 * e.sizeMultiplier),
      n
    );
  },
  mathmlBuilder(t, e) {
    var n = ot(t.width, e),
      r = ot(t.height, e),
      i = t.shift ? ot(t.shift, e) : 0,
      a = (e.color && e.getColor()) || "black",
      s = new re.MathNode("mspace");
    (s.setAttribute("mathbackground", a),
      s.setAttribute("width", ce(n)),
      s.setAttribute("height", ce(r)));
    var o = new re.MathNode("mpadded", [s]);
    return (
      i >= 0
        ? o.setAttribute("height", ce(i))
        : (o.setAttribute("height", ce(i)), o.setAttribute("depth", ce(-i))),
      o.setAttribute("voffset", ce(i)),
      o
    );
  },
});
function nh(t, e, n) {
  for (
    var r = Lt(t, e, !1), i = e.sizeMultiplier / n.sizeMultiplier, a = 0;
    a < r.length;
    a++
  ) {
    var s = r[a].classes.indexOf("sizing");
    (s < 0
      ? Array.prototype.push.apply(r[a].classes, e.sizingClasses(n))
      : r[a].classes[s + 1] === "reset-size" + e.size &&
        (r[a].classes[s + 1] = "reset-size" + n.size),
      (r[a].height *= i),
      (r[a].depth *= i));
  }
  return W.makeFragment(r);
}
var xu = [
    "\\tiny",
    "\\sixptsize",
    "\\scriptsize",
    "\\footnotesize",
    "\\small",
    "\\normalsize",
    "\\large",
    "\\Large",
    "\\LARGE",
    "\\huge",
    "\\Huge",
  ],
  K2 = (t, e) => {
    var n = e.havingSize(t.size);
    return nh(t.body, n, e);
  };
me({
  type: "sizing",
  names: xu,
  props: { numArgs: 0, allowedInText: !0 },
  handler: (t, e) => {
    var { breakOnTokenText: n, funcName: r, parser: i } = t,
      a = i.parseExpression(!1, n);
    return { type: "sizing", mode: i.mode, size: xu.indexOf(r) + 1, body: a };
  },
  htmlBuilder: K2,
  mathmlBuilder: (t, e) => {
    var n = e.havingSize(t.size),
      r = hn(t.body, n),
      i = new re.MathNode("mstyle", r);
    return (i.setAttribute("mathsize", ce(n.sizeMultiplier)), i);
  },
});
me({
  type: "smash",
  names: ["\\smash"],
  props: { numArgs: 1, numOptionalArgs: 1, allowedInText: !0 },
  handler: (t, e, n) => {
    var { parser: r } = t,
      i = !1,
      a = !1,
      s = n[0] && _e(n[0], "ordgroup");
    if (s)
      for (var o = "", l = 0; l < s.body.length; ++l) {
        var u = s.body[l];
        if (((o = u.text), o === "t")) i = !0;
        else if (o === "b") a = !0;
        else {
          ((i = !1), (a = !1));
          break;
        }
      }
    else ((i = !0), (a = !0));
    var h = e[0];
    return {
      type: "smash",
      mode: r.mode,
      body: h,
      smashHeight: i,
      smashDepth: a,
    };
  },
  htmlBuilder: (t, e) => {
    var n = W.makeSpan([], [Ve(t.body, e)]);
    if (!t.smashHeight && !t.smashDepth) return n;
    if (t.smashHeight && ((n.height = 0), n.children))
      for (var r = 0; r < n.children.length; r++) n.children[r].height = 0;
    if (t.smashDepth && ((n.depth = 0), n.children))
      for (var i = 0; i < n.children.length; i++) n.children[i].depth = 0;
    var a = W.makeVList(
      { positionType: "firstBaseline", children: [{ type: "elem", elem: n }] },
      e,
    );
    return W.makeSpan(["mord"], [a], e);
  },
  mathmlBuilder: (t, e) => {
    var n = new re.MathNode("mpadded", [Ze(t.body, e)]);
    return (
      t.smashHeight && n.setAttribute("height", "0px"),
      t.smashDepth && n.setAttribute("depth", "0px"),
      n
    );
  },
});
me({
  type: "sqrt",
  names: ["\\sqrt"],
  props: { numArgs: 1, numOptionalArgs: 1 },
  handler(t, e, n) {
    var { parser: r } = t,
      i = n[0],
      a = e[0];
    return { type: "sqrt", mode: r.mode, body: a, index: i };
  },
  htmlBuilder(t, e) {
    var n = Ve(t.body, e.havingCrampedStyle());
    (n.height === 0 && (n.height = e.fontMetrics().xHeight),
      (n = W.wrapFragment(n, e)));
    var r = e.fontMetrics(),
      i = r.defaultRuleThickness,
      a = i;
    e.style.id < Me.TEXT.id && (a = e.fontMetrics().xHeight);
    var s = i + a / 4,
      o = n.height + n.depth + s + i,
      { span: l, ruleWidth: u, advanceWidth: h } = kr.sqrtImage(o, e),
      d = l.height - u;
    d > n.height + n.depth + s && (s = (s + d - n.height - n.depth) / 2);
    var p = l.height - n.height - s - u;
    n.style.paddingLeft = ce(h);
    var m = W.makeVList(
      {
        positionType: "firstBaseline",
        children: [
          { type: "elem", elem: n, wrapperClasses: ["svg-align"] },
          { type: "kern", size: -(n.height + p) },
          { type: "elem", elem: l },
          { type: "kern", size: u },
        ],
      },
      e,
    );
    if (t.index) {
      var y = e.havingStyle(Me.SCRIPTSCRIPT),
        S = Ve(t.index, y, e),
        A = 0.6 * (m.height - m.depth),
        C = W.makeVList(
          {
            positionType: "shift",
            positionData: -A,
            children: [{ type: "elem", elem: S }],
          },
          e,
        ),
        b = W.makeSpan(["root"], [C]);
      return W.makeSpan(["mord", "sqrt"], [b, m], e);
    } else return W.makeSpan(["mord", "sqrt"], [m], e);
  },
  mathmlBuilder(t, e) {
    var { body: n, index: r } = t;
    return r
      ? new re.MathNode("mroot", [Ze(n, e), Ze(r, e)])
      : new re.MathNode("msqrt", [Ze(n, e)]);
  },
});
var ku = {
  display: Me.DISPLAY,
  text: Me.TEXT,
  script: Me.SCRIPT,
  scriptscript: Me.SCRIPTSCRIPT,
};
me({
  type: "styling",
  names: [
    "\\displaystyle",
    "\\textstyle",
    "\\scriptstyle",
    "\\scriptscriptstyle",
  ],
  props: { numArgs: 0, allowedInText: !0, primitive: !0 },
  handler(t, e) {
    var { breakOnTokenText: n, funcName: r, parser: i } = t,
      a = i.parseExpression(!0, n),
      s = r.slice(1, r.length - 5);
    return { type: "styling", mode: i.mode, style: s, body: a };
  },
  htmlBuilder(t, e) {
    var n = ku[t.style],
      r = e.havingStyle(n).withFont("");
    return nh(t.body, r, e);
  },
  mathmlBuilder(t, e) {
    var n = ku[t.style],
      r = e.havingStyle(n),
      i = hn(t.body, r),
      a = new re.MathNode("mstyle", i),
      s = {
        display: ["0", "true"],
        text: ["0", "false"],
        script: ["1", "false"],
        scriptscript: ["2", "false"],
      },
      o = s[t.style];
    return (
      a.setAttribute("scriptlevel", o[0]),
      a.setAttribute("displaystyle", o[1]),
      a
    );
  },
});
var Q2 = function (e, n) {
  var r = e.base;
  if (r)
    if (r.type === "op") {
      var i =
        r.limits && (n.style.size === Me.DISPLAY.size || r.alwaysHandleSupSub);
      return i ? $i : null;
    } else if (r.type === "operatorname") {
      var a =
        r.alwaysHandleSupSub && (n.style.size === Me.DISPLAY.size || r.limits);
      return a ? th : null;
    } else {
      if (r.type === "accent") return Ee.isCharacterBox(r.base) ? z0 : null;
      if (r.type === "horizBrace") {
        var s = !e.sub;
        return s === r.isOver ? Zd : null;
      } else return null;
    }
  else return null;
};
mi({
  type: "supsub",
  htmlBuilder(t, e) {
    var n = Q2(t, e);
    if (n) return n(t, e);
    var { base: r, sup: i, sub: a } = t,
      s = Ve(r, e),
      o,
      l,
      u = e.fontMetrics(),
      h = 0,
      d = 0,
      p = r && Ee.isCharacterBox(r);
    if (i) {
      var m = e.havingStyle(e.style.sup());
      ((o = Ve(i, m, e)),
        p ||
          (h =
            s.height -
            (m.fontMetrics().supDrop * m.sizeMultiplier) / e.sizeMultiplier));
    }
    if (a) {
      var y = e.havingStyle(e.style.sub());
      ((l = Ve(a, y, e)),
        p ||
          (d =
            s.depth +
            (y.fontMetrics().subDrop * y.sizeMultiplier) / e.sizeMultiplier));
    }
    var S;
    e.style === Me.DISPLAY
      ? (S = u.sup1)
      : e.style.cramped
        ? (S = u.sup3)
        : (S = u.sup2);
    var A = e.sizeMultiplier,
      C = ce(0.5 / u.ptPerEm / A),
      b = null;
    if (l) {
      var T =
        t.base &&
        t.base.type === "op" &&
        t.base.name &&
        (t.base.name === "\\oiint" || t.base.name === "\\oiiint");
      (s instanceof Gn || T) && (b = ce(-s.italic));
    }
    var v;
    if (o && l) {
      ((h = Math.max(h, S, o.depth + 0.25 * u.xHeight)),
        (d = Math.max(d, u.sub2)));
      var E = u.defaultRuleThickness,
        x = 4 * E;
      if (h - o.depth - (l.height - d) < x) {
        d = x - (h - o.depth) + l.height;
        var _ = 0.8 * u.xHeight - (h - o.depth);
        _ > 0 && ((h += _), (d -= _));
      }
      var j = [
        { type: "elem", elem: l, shift: d, marginRight: C, marginLeft: b },
        { type: "elem", elem: o, shift: -h, marginRight: C },
      ];
      v = W.makeVList({ positionType: "individualShift", children: j }, e);
    } else if (l) {
      d = Math.max(d, u.sub1, l.height - 0.8 * u.xHeight);
      var F = [{ type: "elem", elem: l, marginLeft: b, marginRight: C }];
      v = W.makeVList(
        { positionType: "shift", positionData: d, children: F },
        e,
      );
    } else if (o)
      ((h = Math.max(h, S, o.depth + 0.25 * u.xHeight)),
        (v = W.makeVList(
          {
            positionType: "shift",
            positionData: -h,
            children: [{ type: "elem", elem: o, marginRight: C }],
          },
          e,
        )));
    else throw new Error("supsub must have either sup or sub.");
    var O = s0(s, "right") || "mord";
    return W.makeSpan([O], [s, W.makeSpan(["msupsub"], [v])], e);
  },
  mathmlBuilder(t, e) {
    var n = !1,
      r,
      i;
    (t.base &&
      t.base.type === "horizBrace" &&
      ((i = !!t.sup), i === t.base.isOver && ((n = !0), (r = t.base.isOver))),
      t.base &&
        (t.base.type === "op" || t.base.type === "operatorname") &&
        (t.base.parentIsSupSub = !0));
    var a = [Ze(t.base, e)];
    (t.sub && a.push(Ze(t.sub, e)), t.sup && a.push(Ze(t.sup, e)));
    var s;
    if (n) s = r ? "mover" : "munder";
    else if (t.sub)
      if (t.sup) {
        var u = t.base;
        (u && u.type === "op" && u.limits && e.style === Me.DISPLAY) ||
        (u &&
          u.type === "operatorname" &&
          u.alwaysHandleSupSub &&
          (e.style === Me.DISPLAY || u.limits))
          ? (s = "munderover")
          : (s = "msubsup");
      } else {
        var l = t.base;
        (l &&
          l.type === "op" &&
          l.limits &&
          (e.style === Me.DISPLAY || l.alwaysHandleSupSub)) ||
        (l &&
          l.type === "operatorname" &&
          l.alwaysHandleSupSub &&
          (l.limits || e.style === Me.DISPLAY))
          ? (s = "munder")
          : (s = "msub");
      }
    else {
      var o = t.base;
      (o &&
        o.type === "op" &&
        o.limits &&
        (e.style === Me.DISPLAY || o.alwaysHandleSupSub)) ||
      (o &&
        o.type === "operatorname" &&
        o.alwaysHandleSupSub &&
        (o.limits || e.style === Me.DISPLAY))
        ? (s = "mover")
        : (s = "msup");
    }
    return new re.MathNode(s, a);
  },
});
mi({
  type: "atom",
  htmlBuilder(t, e) {
    return W.mathsym(t.text, t.mode, e, ["m" + t.family]);
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mo", [Pn(t.text, t.mode)]);
    if (t.family === "bin") {
      var r = L0(t, e);
      r === "bold-italic" && n.setAttribute("mathvariant", r);
    } else
      t.family === "punct"
        ? n.setAttribute("separator", "true")
        : (t.family === "open" || t.family === "close") &&
          n.setAttribute("stretchy", "false");
    return n;
  },
});
var rh = { mi: "italic", mn: "normal", mtext: "normal" };
mi({
  type: "mathord",
  htmlBuilder(t, e) {
    return W.makeOrd(t, e, "mathord");
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mi", [Pn(t.text, t.mode, e)]),
      r = L0(t, e) || "italic";
    return (r !== rh[n.type] && n.setAttribute("mathvariant", r), n);
  },
});
mi({
  type: "textord",
  htmlBuilder(t, e) {
    return W.makeOrd(t, e, "textord");
  },
  mathmlBuilder(t, e) {
    var n = Pn(t.text, t.mode, e),
      r = L0(t, e) || "normal",
      i;
    return (
      t.mode === "text"
        ? (i = new re.MathNode("mtext", [n]))
        : /[0-9]/.test(t.text)
          ? (i = new re.MathNode("mn", [n]))
          : t.text === "\\prime"
            ? (i = new re.MathNode("mo", [n]))
            : (i = new re.MathNode("mi", [n])),
      r !== rh[i.type] && i.setAttribute("mathvariant", r),
      i
    );
  },
});
var Bo = { "\\nobreak": "nobreak", "\\allowbreak": "allowbreak" },
  Ro = {
    " ": {},
    "\\ ": {},
    "~": { className: "nobreak" },
    "\\space": {},
    "\\nobreakspace": { className: "nobreak" },
  };
mi({
  type: "spacing",
  htmlBuilder(t, e) {
    if (Ro.hasOwnProperty(t.text)) {
      var n = Ro[t.text].className || "";
      if (t.mode === "text") {
        var r = W.makeOrd(t, e, "textord");
        return (r.classes.push(n), r);
      } else
        return W.makeSpan(["mspace", n], [W.mathsym(t.text, t.mode, e)], e);
    } else {
      if (Bo.hasOwnProperty(t.text))
        return W.makeSpan(["mspace", Bo[t.text]], [], e);
      throw new ae('Unknown type of space "' + t.text + '"');
    }
  },
  mathmlBuilder(t, e) {
    var n;
    if (Ro.hasOwnProperty(t.text))
      n = new re.MathNode("mtext", [new re.TextNode(" ")]);
    else {
      if (Bo.hasOwnProperty(t.text)) return new re.MathNode("mspace");
      throw new ae('Unknown type of space "' + t.text + '"');
    }
    return n;
  },
});
var Su = () => {
  var t = new re.MathNode("mtd", []);
  return (t.setAttribute("width", "50%"), t);
};
mi({
  type: "tag",
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mtable", [
      new re.MathNode("mtr", [
        Su(),
        new re.MathNode("mtd", [Qr(t.body, e)]),
        Su(),
        new re.MathNode("mtd", [Qr(t.tag, e)]),
      ]),
    ]);
    return (n.setAttribute("width", "100%"), n);
  },
});
var Au = {
    "\\text": void 0,
    "\\textrm": "textrm",
    "\\textsf": "textsf",
    "\\texttt": "texttt",
    "\\textnormal": "textrm",
  },
  Tu = { "\\textbf": "textbf", "\\textmd": "textmd" },
  Z2 = { "\\textit": "textit", "\\textup": "textup" },
  Eu = (t, e) => {
    var n = t.font;
    if (n) {
      if (Au[n]) return e.withTextFontFamily(Au[n]);
      if (Tu[n]) return e.withTextFontWeight(Tu[n]);
      if (n === "\\emph")
        return e.fontShape === "textit"
          ? e.withTextFontShape("textup")
          : e.withTextFontShape("textit");
    } else return e;
    return e.withTextFontShape(Z2[n]);
  };
me({
  type: "text",
  names: [
    "\\text",
    "\\textrm",
    "\\textsf",
    "\\texttt",
    "\\textnormal",
    "\\textbf",
    "\\textmd",
    "\\textit",
    "\\textup",
    "\\emph",
  ],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInArgument: !0,
    allowedInText: !0,
  },
  handler(t, e) {
    var { parser: n, funcName: r } = t,
      i = e[0];
    return { type: "text", mode: n.mode, body: bt(i), font: r };
  },
  htmlBuilder(t, e) {
    var n = Eu(t, e),
      r = Lt(t.body, n, !0);
    return W.makeSpan(["mord", "text"], r, n);
  },
  mathmlBuilder(t, e) {
    var n = Eu(t, e);
    return Qr(t.body, n);
  },
});
me({
  type: "underline",
  names: ["\\underline"],
  props: { numArgs: 1, allowedInText: !0 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "underline", mode: n.mode, body: e[0] };
  },
  htmlBuilder(t, e) {
    var n = Ve(t.body, e),
      r = W.makeLineSpan("underline-line", e),
      i = e.fontMetrics().defaultRuleThickness,
      a = W.makeVList(
        {
          positionType: "top",
          positionData: n.height,
          children: [
            { type: "kern", size: i },
            { type: "elem", elem: r },
            { type: "kern", size: 3 * i },
            { type: "elem", elem: n },
          ],
        },
        e,
      );
    return W.makeSpan(["mord", "underline"], [a], e);
  },
  mathmlBuilder(t, e) {
    var n = new re.MathNode("mo", [new re.TextNode("‾")]);
    n.setAttribute("stretchy", "true");
    var r = new re.MathNode("munder", [Ze(t.body, e), n]);
    return (r.setAttribute("accentunder", "true"), r);
  },
});
me({
  type: "vcenter",
  names: ["\\vcenter"],
  props: { numArgs: 1, argTypes: ["original"], allowedInText: !1 },
  handler(t, e) {
    var { parser: n } = t;
    return { type: "vcenter", mode: n.mode, body: e[0] };
  },
  htmlBuilder(t, e) {
    var n = Ve(t.body, e),
      r = e.fontMetrics().axisHeight,
      i = 0.5 * (n.height - r - (n.depth + r));
    return W.makeVList(
      {
        positionType: "shift",
        positionData: i,
        children: [{ type: "elem", elem: n }],
      },
      e,
    );
  },
  mathmlBuilder(t, e) {
    return new re.MathNode("mpadded", [Ze(t.body, e)], ["vcenter"]);
  },
});
me({
  type: "verb",
  names: ["\\verb"],
  props: { numArgs: 0, allowedInText: !0 },
  handler(t, e, n) {
    throw new ae("\\verb ended by end of line instead of matching delimiter");
  },
  htmlBuilder(t, e) {
    for (
      var n = Cu(t), r = [], i = e.havingStyle(e.style.text()), a = 0;
      a < n.length;
      a++
    ) {
      var s = n[a];
      (s === "~" && (s = "\\textasciitilde"),
        r.push(
          W.makeSymbol(s, "Typewriter-Regular", t.mode, i, ["mord", "texttt"]),
        ));
    }
    return W.makeSpan(
      ["mord", "text"].concat(i.sizingClasses(e)),
      W.tryCombineChars(r),
      i,
    );
  },
  mathmlBuilder(t, e) {
    var n = new re.TextNode(Cu(t)),
      r = new re.MathNode("mtext", [n]);
    return (r.setAttribute("mathvariant", "monospace"), r);
  },
});
var Cu = (t) => t.body.replace(/ /g, t.star ? "␣" : " "),
  Rr = Ld,
  ih = `[ \r
	]`,
  J2 = "\\\\[a-zA-Z@]+",
  e5 = "\\\\[^\uD800-\uDFFF]",
  t5 = "(" + J2 + ")" + ih + "*",
  n5 = `\\\\(
|[ \r	]+
?)[ \r	]*`,
  u0 = "[̀-ͯ]",
  r5 = new RegExp(u0 + "+$"),
  i5 =
    "(" +
    ih +
    "+)|" +
    (n5 + "|") +
    "([!-\\[\\]-‧‪-퟿豈-￿]" +
    (u0 + "*") +
    "|[\uD800-\uDBFF][\uDC00-\uDFFF]" +
    (u0 + "*") +
    "|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" +
    ("|" + t5) +
    ("|" + e5 + ")");
class Lu {
  constructor(e, n) {
    ((this.input = void 0),
      (this.settings = void 0),
      (this.tokenRegex = void 0),
      (this.catcodes = void 0),
      (this.input = e),
      (this.settings = n),
      (this.tokenRegex = new RegExp(i5, "g")),
      (this.catcodes = { "%": 14, "~": 13 }));
  }
  setCatcode(e, n) {
    this.catcodes[e] = n;
  }
  lex() {
    var e = this.input,
      n = this.tokenRegex.lastIndex;
    if (n === e.length) return new Fn("EOF", new mn(this, n, n));
    var r = this.tokenRegex.exec(e);
    if (r === null || r.index !== n)
      throw new ae(
        "Unexpected character: '" + e[n] + "'",
        new Fn(e[n], new mn(this, n, n + 1)),
      );
    var i = r[6] || r[3] || (r[2] ? "\\ " : " ");
    if (this.catcodes[i] === 14) {
      var a = e.indexOf(
        `
`,
        this.tokenRegex.lastIndex,
      );
      return (
        a === -1
          ? ((this.tokenRegex.lastIndex = e.length),
            this.settings.reportNonstrict(
              "commentAtEnd",
              "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)",
            ))
          : (this.tokenRegex.lastIndex = a + 1),
        this.lex()
      );
    }
    return new Fn(i, new mn(this, n, this.tokenRegex.lastIndex));
  }
}
class a5 {
  constructor(e, n) {
    (e === void 0 && (e = {}),
      n === void 0 && (n = {}),
      (this.current = void 0),
      (this.builtins = void 0),
      (this.undefStack = void 0),
      (this.current = n),
      (this.builtins = e),
      (this.undefStack = []));
  }
  beginGroup() {
    this.undefStack.push({});
  }
  endGroup() {
    if (this.undefStack.length === 0)
      throw new ae(
        "Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug",
      );
    var e = this.undefStack.pop();
    for (var n in e)
      e.hasOwnProperty(n) &&
        (e[n] == null ? delete this.current[n] : (this.current[n] = e[n]));
  }
  endGroups() {
    for (; this.undefStack.length > 0; ) this.endGroup();
  }
  has(e) {
    return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e);
  }
  get(e) {
    return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e];
  }
  set(e, n, r) {
    if ((r === void 0 && (r = !1), r)) {
      for (var i = 0; i < this.undefStack.length; i++)
        delete this.undefStack[i][e];
      this.undefStack.length > 0 &&
        (this.undefStack[this.undefStack.length - 1][e] = n);
    } else {
      var a = this.undefStack[this.undefStack.length - 1];
      a && !a.hasOwnProperty(e) && (a[e] = this.current[e]);
    }
    n == null ? delete this.current[e] : (this.current[e] = n);
  }
}
var s5 = Gd;
w("\\noexpand", function (t) {
  var e = t.popToken();
  return (
    t.isExpandable(e.text) && ((e.noexpand = !0), (e.treatAsRelax = !0)),
    { tokens: [e], numArgs: 0 }
  );
});
w("\\expandafter", function (t) {
  var e = t.popToken();
  return (t.expandOnce(!0), { tokens: [e], numArgs: 0 });
});
w("\\@firstoftwo", function (t) {
  var e = t.consumeArgs(2);
  return { tokens: e[0], numArgs: 0 };
});
w("\\@secondoftwo", function (t) {
  var e = t.consumeArgs(2);
  return { tokens: e[1], numArgs: 0 };
});
w("\\@ifnextchar", function (t) {
  var e = t.consumeArgs(3);
  t.consumeSpaces();
  var n = t.future();
  return e[0].length === 1 && e[0][0].text === n.text
    ? { tokens: e[1], numArgs: 0 }
    : { tokens: e[2], numArgs: 0 };
});
w("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
w("\\TextOrMath", function (t) {
  var e = t.consumeArgs(2);
  return t.mode === "text"
    ? { tokens: e[0], numArgs: 0 }
    : { tokens: e[1], numArgs: 0 };
});
var Mu = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15,
};
w("\\char", function (t) {
  var e = t.popToken(),
    n,
    r = "";
  if (e.text === "'") ((n = 8), (e = t.popToken()));
  else if (e.text === '"') ((n = 16), (e = t.popToken()));
  else if (e.text === "`")
    if (((e = t.popToken()), e.text[0] === "\\")) r = e.text.charCodeAt(1);
    else {
      if (e.text === "EOF") throw new ae("\\char` missing argument");
      r = e.text.charCodeAt(0);
    }
  else n = 10;
  if (n) {
    if (((r = Mu[e.text]), r == null || r >= n))
      throw new ae("Invalid base-" + n + " digit " + e.text);
    for (var i; (i = Mu[t.future().text]) != null && i < n; )
      ((r *= n), (r += i), t.popToken());
  }
  return "\\@char{" + r + "}";
});
var R0 = (t, e, n, r) => {
  var i = t.consumeArg().tokens;
  if (i.length !== 1)
    throw new ae("\\newcommand's first argument must be a macro name");
  var a = i[0].text,
    s = t.isDefined(a);
  if (s && !e)
    throw new ae(
      "\\newcommand{" +
        a +
        "} attempting to redefine " +
        (a + "; use \\renewcommand"),
    );
  if (!s && !n)
    throw new ae(
      "\\renewcommand{" +
        a +
        "} when command " +
        a +
        " does not yet exist; use \\newcommand",
    );
  var o = 0;
  if (((i = t.consumeArg().tokens), i.length === 1 && i[0].text === "[")) {
    for (
      var l = "", u = t.expandNextToken();
      u.text !== "]" && u.text !== "EOF";

    )
      ((l += u.text), (u = t.expandNextToken()));
    if (!l.match(/^\s*[0-9]+\s*$/))
      throw new ae("Invalid number of arguments: " + l);
    ((o = parseInt(l)), (i = t.consumeArg().tokens));
  }
  return ((s && r) || t.macros.set(a, { tokens: i, numArgs: o }), "");
};
w("\\newcommand", (t) => R0(t, !1, !0, !1));
w("\\renewcommand", (t) => R0(t, !0, !1, !1));
w("\\providecommand", (t) => R0(t, !0, !0, !0));
w("\\message", (t) => {
  var e = t.consumeArgs(1)[0];
  return (
    console.log(
      e
        .reverse()
        .map((n) => n.text)
        .join(""),
    ),
    ""
  );
});
w("\\errmessage", (t) => {
  var e = t.consumeArgs(1)[0];
  return (
    console.error(
      e
        .reverse()
        .map((n) => n.text)
        .join(""),
    ),
    ""
  );
});
w("\\show", (t) => {
  var e = t.popToken(),
    n = e.text;
  return (console.log(e, t.macros.get(n), Rr[n], tt.math[n], tt.text[n]), "");
});
w("\\bgroup", "{");
w("\\egroup", "}");
w("~", "\\nobreakspace");
w("\\lq", "`");
w("\\rq", "'");
w("\\aa", "\\r a");
w("\\AA", "\\r A");
w("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}");
w("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
w(
  "\\textregistered",
  "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}",
);
w("ℬ", "\\mathscr{B}");
w("ℰ", "\\mathscr{E}");
w("ℱ", "\\mathscr{F}");
w("ℋ", "\\mathscr{H}");
w("ℐ", "\\mathscr{I}");
w("ℒ", "\\mathscr{L}");
w("ℳ", "\\mathscr{M}");
w("ℛ", "\\mathscr{R}");
w("ℭ", "\\mathfrak{C}");
w("ℌ", "\\mathfrak{H}");
w("ℨ", "\\mathfrak{Z}");
w("\\Bbbk", "\\Bbb{k}");
w("·", "\\cdotp");
w("\\llap", "\\mathllap{\\textrm{#1}}");
w("\\rlap", "\\mathrlap{\\textrm{#1}}");
w("\\clap", "\\mathclap{\\textrm{#1}}");
w("\\mathstrut", "\\vphantom{(}");
w("\\underbar", "\\underline{\\text{#1}}");
w("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}}{\\char"338}');
w("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");
w("\\ne", "\\neq");
w("≠", "\\neq");
w(
  "\\notin",
  "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}",
);
w("∉", "\\notin");
w(
  "≘",
  "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}",
);
w("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");
w("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");
w("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");
w(
  "≝",
  "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}",
);
w("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");
w("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");
w("⟂", "\\perp");
w("‼", "\\mathclose{!\\mkern-0.8mu!}");
w("∌", "\\notni");
w("⌜", "\\ulcorner");
w("⌝", "\\urcorner");
w("⌞", "\\llcorner");
w("⌟", "\\lrcorner");
w("©", "\\copyright");
w("®", "\\textregistered");
w("️", "\\textregistered");
w("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');
w("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');
w("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');
w("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');
w("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
w("⋮", "\\vdots");
w("\\varGamma", "\\mathit{\\Gamma}");
w("\\varDelta", "\\mathit{\\Delta}");
w("\\varTheta", "\\mathit{\\Theta}");
w("\\varLambda", "\\mathit{\\Lambda}");
w("\\varXi", "\\mathit{\\Xi}");
w("\\varPi", "\\mathit{\\Pi}");
w("\\varSigma", "\\mathit{\\Sigma}");
w("\\varUpsilon", "\\mathit{\\Upsilon}");
w("\\varPhi", "\\mathit{\\Phi}");
w("\\varPsi", "\\mathit{\\Psi}");
w("\\varOmega", "\\mathit{\\Omega}");
w("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
w(
  "\\colon",
  "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax",
);
w("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
w("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
w("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
w("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
w("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
w("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
var zu = {
  ",": "\\dotsc",
  "\\not": "\\dotsb",
  "+": "\\dotsb",
  "=": "\\dotsb",
  "<": "\\dotsb",
  ">": "\\dotsb",
  "-": "\\dotsb",
  "*": "\\dotsb",
  ":": "\\dotsb",
  "\\DOTSB": "\\dotsb",
  "\\coprod": "\\dotsb",
  "\\bigvee": "\\dotsb",
  "\\bigwedge": "\\dotsb",
  "\\biguplus": "\\dotsb",
  "\\bigcap": "\\dotsb",
  "\\bigcup": "\\dotsb",
  "\\prod": "\\dotsb",
  "\\sum": "\\dotsb",
  "\\bigotimes": "\\dotsb",
  "\\bigoplus": "\\dotsb",
  "\\bigodot": "\\dotsb",
  "\\bigsqcup": "\\dotsb",
  "\\And": "\\dotsb",
  "\\longrightarrow": "\\dotsb",
  "\\Longrightarrow": "\\dotsb",
  "\\longleftarrow": "\\dotsb",
  "\\Longleftarrow": "\\dotsb",
  "\\longleftrightarrow": "\\dotsb",
  "\\Longleftrightarrow": "\\dotsb",
  "\\mapsto": "\\dotsb",
  "\\longmapsto": "\\dotsb",
  "\\hookrightarrow": "\\dotsb",
  "\\doteq": "\\dotsb",
  "\\mathbin": "\\dotsb",
  "\\mathrel": "\\dotsb",
  "\\relbar": "\\dotsb",
  "\\Relbar": "\\dotsb",
  "\\xrightarrow": "\\dotsb",
  "\\xleftarrow": "\\dotsb",
  "\\DOTSI": "\\dotsi",
  "\\int": "\\dotsi",
  "\\oint": "\\dotsi",
  "\\iint": "\\dotsi",
  "\\iiint": "\\dotsi",
  "\\iiiint": "\\dotsi",
  "\\idotsint": "\\dotsi",
  "\\DOTSX": "\\dotsx",
};
w("\\dots", function (t) {
  var e = "\\dotso",
    n = t.expandAfterFuture().text;
  return (
    n in zu
      ? (e = zu[n])
      : (n.slice(0, 4) === "\\not" ||
          (n in tt.math && Ee.contains(["bin", "rel"], tt.math[n].group))) &&
        (e = "\\dotsb"),
    e
  );
});
var P0 = {
  ")": !0,
  "]": !0,
  "\\rbrack": !0,
  "\\}": !0,
  "\\rbrace": !0,
  "\\rangle": !0,
  "\\rceil": !0,
  "\\rfloor": !0,
  "\\rgroup": !0,
  "\\rmoustache": !0,
  "\\right": !0,
  "\\bigr": !0,
  "\\biggr": !0,
  "\\Bigr": !0,
  "\\Biggr": !0,
  $: !0,
  ";": !0,
  ".": !0,
  ",": !0,
};
w("\\dotso", function (t) {
  var e = t.future().text;
  return e in P0 ? "\\ldots\\," : "\\ldots";
});
w("\\dotsc", function (t) {
  var e = t.future().text;
  return e in P0 && e !== "," ? "\\ldots\\," : "\\ldots";
});
w("\\cdots", function (t) {
  var e = t.future().text;
  return e in P0 ? "\\@cdots\\," : "\\@cdots";
});
w("\\dotsb", "\\cdots");
w("\\dotsm", "\\cdots");
w("\\dotsi", "\\!\\cdots");
w("\\dotsx", "\\ldots\\,");
w("\\DOTSI", "\\relax");
w("\\DOTSB", "\\relax");
w("\\DOTSX", "\\relax");
w("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
w("\\,", "\\tmspace+{3mu}{.1667em}");
w("\\thinspace", "\\,");
w("\\>", "\\mskip{4mu}");
w("\\:", "\\tmspace+{4mu}{.2222em}");
w("\\medspace", "\\:");
w("\\;", "\\tmspace+{5mu}{.2777em}");
w("\\thickspace", "\\;");
w("\\!", "\\tmspace-{3mu}{.1667em}");
w("\\negthinspace", "\\!");
w("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
w("\\negthickspace", "\\tmspace-{5mu}{.277em}");
w("\\enspace", "\\kern.5em ");
w("\\enskip", "\\hskip.5em\\relax");
w("\\quad", "\\hskip1em\\relax");
w("\\qquad", "\\hskip2em\\relax");
w("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
w("\\tag@paren", "\\tag@literal{({#1})}");
w("\\tag@literal", (t) => {
  if (t.macros.get("\\df@tag")) throw new ae("Multiple \\tag");
  return "\\gdef\\df@tag{\\text{#1}}";
});
w(
  "\\bmod",
  "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}",
);
w(
  "\\pod",
  "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)",
);
w("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
w(
  "\\mod",
  "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1",
);
w("\\newline", "\\\\\\relax");
w(
  "\\TeX",
  "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}",
);
var ah = ce(yr["Main-Regular"][84][1] - 0.7 * yr["Main-Regular"][65][1]);
w(
  "\\LaTeX",
  "\\textrm{\\html@mathml{" +
    ("L\\kern-.36em\\raisebox{" + ah + "}{\\scriptstyle A}") +
    "\\kern-.15em\\TeX}{LaTeX}}",
);
w(
  "\\KaTeX",
  "\\textrm{\\html@mathml{" +
    ("K\\kern-.17em\\raisebox{" + ah + "}{\\scriptstyle A}") +
    "\\kern-.15em\\TeX}{KaTeX}}",
);
w("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
w("\\@hspace", "\\hskip #1\\relax");
w("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
w("\\ordinarycolon", ":");
w("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
w(
  "\\dblcolon",
  '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}',
);
w(
  "\\coloneqq",
  '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}',
);
w(
  "\\Coloneqq",
  '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}',
);
w(
  "\\coloneq",
  '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}',
);
w(
  "\\Coloneq",
  '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}',
);
w(
  "\\eqqcolon",
  '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}',
);
w(
  "\\Eqqcolon",
  '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}',
);
w(
  "\\eqcolon",
  '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}',
);
w(
  "\\Eqcolon",
  '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}',
);
w(
  "\\colonapprox",
  '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}',
);
w(
  "\\Colonapprox",
  '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}',
);
w(
  "\\colonsim",
  '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}',
);
w(
  "\\Colonsim",
  '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}',
);
w("∷", "\\dblcolon");
w("∹", "\\eqcolon");
w("≔", "\\coloneqq");
w("≕", "\\eqqcolon");
w("⩴", "\\Coloneqq");
w("\\ratio", "\\vcentcolon");
w("\\coloncolon", "\\dblcolon");
w("\\colonequals", "\\coloneqq");
w("\\coloncolonequals", "\\Coloneqq");
w("\\equalscolon", "\\eqqcolon");
w("\\equalscoloncolon", "\\Eqqcolon");
w("\\colonminus", "\\coloneq");
w("\\coloncolonminus", "\\Coloneq");
w("\\minuscolon", "\\eqcolon");
w("\\minuscoloncolon", "\\Eqcolon");
w("\\coloncolonapprox", "\\Colonapprox");
w("\\coloncolonsim", "\\Colonsim");
w("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
w("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
w("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
w(
  "\\approxcoloncolon",
  "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}",
);
w("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");
w("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
w("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
w("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
w("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
w("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
w("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
w("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
w("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
w("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}");
w("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}");
w("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}");
w("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}");
w("\\nleqq", "\\html@mathml{\\@nleqq}{≰}");
w("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}");
w("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}");
w("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}");
w("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}");
w("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}");
w("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}");
w("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}");
w("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}");
w("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}");
w("\\imath", "\\html@mathml{\\@imath}{ı}");
w("\\jmath", "\\html@mathml{\\@jmath}{ȷ}");
w(
  "\\llbracket",
  "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}",
);
w(
  "\\rrbracket",
  "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}",
);
w("⟦", "\\llbracket");
w("⟧", "\\rrbracket");
w(
  "\\lBrace",
  "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}",
);
w(
  "\\rBrace",
  "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}",
);
w("⦃", "\\lBrace");
w("⦄", "\\rBrace");
w(
  "\\minuso",
  "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}",
);
w("⦵", "\\minuso");
w("\\darr", "\\downarrow");
w("\\dArr", "\\Downarrow");
w("\\Darr", "\\Downarrow");
w("\\lang", "\\langle");
w("\\rang", "\\rangle");
w("\\uarr", "\\uparrow");
w("\\uArr", "\\Uparrow");
w("\\Uarr", "\\Uparrow");
w("\\N", "\\mathbb{N}");
w("\\R", "\\mathbb{R}");
w("\\Z", "\\mathbb{Z}");
w("\\alef", "\\aleph");
w("\\alefsym", "\\aleph");
w("\\Alpha", "\\mathrm{A}");
w("\\Beta", "\\mathrm{B}");
w("\\bull", "\\bullet");
w("\\Chi", "\\mathrm{X}");
w("\\clubs", "\\clubsuit");
w("\\cnums", "\\mathbb{C}");
w("\\Complex", "\\mathbb{C}");
w("\\Dagger", "\\ddagger");
w("\\diamonds", "\\diamondsuit");
w("\\empty", "\\emptyset");
w("\\Epsilon", "\\mathrm{E}");
w("\\Eta", "\\mathrm{H}");
w("\\exist", "\\exists");
w("\\harr", "\\leftrightarrow");
w("\\hArr", "\\Leftrightarrow");
w("\\Harr", "\\Leftrightarrow");
w("\\hearts", "\\heartsuit");
w("\\image", "\\Im");
w("\\infin", "\\infty");
w("\\Iota", "\\mathrm{I}");
w("\\isin", "\\in");
w("\\Kappa", "\\mathrm{K}");
w("\\larr", "\\leftarrow");
w("\\lArr", "\\Leftarrow");
w("\\Larr", "\\Leftarrow");
w("\\lrarr", "\\leftrightarrow");
w("\\lrArr", "\\Leftrightarrow");
w("\\Lrarr", "\\Leftrightarrow");
w("\\Mu", "\\mathrm{M}");
w("\\natnums", "\\mathbb{N}");
w("\\Nu", "\\mathrm{N}");
w("\\Omicron", "\\mathrm{O}");
w("\\plusmn", "\\pm");
w("\\rarr", "\\rightarrow");
w("\\rArr", "\\Rightarrow");
w("\\Rarr", "\\Rightarrow");
w("\\real", "\\Re");
w("\\reals", "\\mathbb{R}");
w("\\Reals", "\\mathbb{R}");
w("\\Rho", "\\mathrm{P}");
w("\\sdot", "\\cdot");
w("\\sect", "\\S");
w("\\spades", "\\spadesuit");
w("\\sub", "\\subset");
w("\\sube", "\\subseteq");
w("\\supe", "\\supseteq");
w("\\Tau", "\\mathrm{T}");
w("\\thetasym", "\\vartheta");
w("\\weierp", "\\wp");
w("\\Zeta", "\\mathrm{Z}");
w("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
w("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
w("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
w("\\bra", "\\mathinner{\\langle{#1}|}");
w("\\ket", "\\mathinner{|{#1}\\rangle}");
w("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
w("\\Bra", "\\left\\langle#1\\right|");
w("\\Ket", "\\left|#1\\right\\rangle");
var sh = (t) => (e) => {
  var n = e.consumeArg().tokens,
    r = e.consumeArg().tokens,
    i = e.consumeArg().tokens,
    a = e.consumeArg().tokens,
    s = e.macros.get("|"),
    o = e.macros.get("\\|");
  e.macros.beginGroup();
  var l = (d) => (p) => {
    t && (p.macros.set("|", s), i.length && p.macros.set("\\|", o));
    var m = d;
    if (!d && i.length) {
      var y = p.future();
      y.text === "|" && (p.popToken(), (m = !0));
    }
    return { tokens: m ? i : r, numArgs: 0 };
  };
  (e.macros.set("|", l(!1)), i.length && e.macros.set("\\|", l(!0)));
  var u = e.consumeArg().tokens,
    h = e.expandTokens([...a, ...u, ...n]);
  return (e.macros.endGroup(), { tokens: h.reverse(), numArgs: 0 });
};
w("\\bra@ket", sh(!1));
w("\\bra@set", sh(!0));
w(
  "\\Braket",
  "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}",
);
w(
  "\\Set",
  "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}",
);
w("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
w("\\angln", "{\\angl n}");
w("\\blue", "\\textcolor{##6495ed}{#1}");
w("\\orange", "\\textcolor{##ffa500}{#1}");
w("\\pink", "\\textcolor{##ff00af}{#1}");
w("\\red", "\\textcolor{##df0030}{#1}");
w("\\green", "\\textcolor{##28ae7b}{#1}");
w("\\gray", "\\textcolor{gray}{#1}");
w("\\purple", "\\textcolor{##9d38bd}{#1}");
w("\\blueA", "\\textcolor{##ccfaff}{#1}");
w("\\blueB", "\\textcolor{##80f6ff}{#1}");
w("\\blueC", "\\textcolor{##63d9ea}{#1}");
w("\\blueD", "\\textcolor{##11accd}{#1}");
w("\\blueE", "\\textcolor{##0c7f99}{#1}");
w("\\tealA", "\\textcolor{##94fff5}{#1}");
w("\\tealB", "\\textcolor{##26edd5}{#1}");
w("\\tealC", "\\textcolor{##01d1c1}{#1}");
w("\\tealD", "\\textcolor{##01a995}{#1}");
w("\\tealE", "\\textcolor{##208170}{#1}");
w("\\greenA", "\\textcolor{##b6ffb0}{#1}");
w("\\greenB", "\\textcolor{##8af281}{#1}");
w("\\greenC", "\\textcolor{##74cf70}{#1}");
w("\\greenD", "\\textcolor{##1fab54}{#1}");
w("\\greenE", "\\textcolor{##0d923f}{#1}");
w("\\goldA", "\\textcolor{##ffd0a9}{#1}");
w("\\goldB", "\\textcolor{##ffbb71}{#1}");
w("\\goldC", "\\textcolor{##ff9c39}{#1}");
w("\\goldD", "\\textcolor{##e07d10}{#1}");
w("\\goldE", "\\textcolor{##a75a05}{#1}");
w("\\redA", "\\textcolor{##fca9a9}{#1}");
w("\\redB", "\\textcolor{##ff8482}{#1}");
w("\\redC", "\\textcolor{##f9685d}{#1}");
w("\\redD", "\\textcolor{##e84d39}{#1}");
w("\\redE", "\\textcolor{##bc2612}{#1}");
w("\\maroonA", "\\textcolor{##ffbde0}{#1}");
w("\\maroonB", "\\textcolor{##ff92c6}{#1}");
w("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
w("\\maroonD", "\\textcolor{##ca337c}{#1}");
w("\\maroonE", "\\textcolor{##9e034e}{#1}");
w("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
w("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
w("\\purpleC", "\\textcolor{##aa87ff}{#1}");
w("\\purpleD", "\\textcolor{##7854ab}{#1}");
w("\\purpleE", "\\textcolor{##543b78}{#1}");
w("\\mintA", "\\textcolor{##f5f9e8}{#1}");
w("\\mintB", "\\textcolor{##edf2df}{#1}");
w("\\mintC", "\\textcolor{##e0e5cc}{#1}");
w("\\grayA", "\\textcolor{##f6f7f7}{#1}");
w("\\grayB", "\\textcolor{##f0f1f2}{#1}");
w("\\grayC", "\\textcolor{##e3e5e6}{#1}");
w("\\grayD", "\\textcolor{##d6d8da}{#1}");
w("\\grayE", "\\textcolor{##babec2}{#1}");
w("\\grayF", "\\textcolor{##888d93}{#1}");
w("\\grayG", "\\textcolor{##626569}{#1}");
w("\\grayH", "\\textcolor{##3b3e40}{#1}");
w("\\grayI", "\\textcolor{##21242c}{#1}");
w("\\kaBlue", "\\textcolor{##314453}{#1}");
w("\\kaGreen", "\\textcolor{##71B307}{#1}");
var oh = { "^": !0, _: !0, "\\limits": !0, "\\nolimits": !0 };
class o5 {
  constructor(e, n, r) {
    ((this.settings = void 0),
      (this.expansionCount = void 0),
      (this.lexer = void 0),
      (this.macros = void 0),
      (this.stack = void 0),
      (this.mode = void 0),
      (this.settings = n),
      (this.expansionCount = 0),
      this.feed(e),
      (this.macros = new a5(s5, n.macros)),
      (this.mode = r),
      (this.stack = []));
  }
  feed(e) {
    this.lexer = new Lu(e, this.settings);
  }
  switchMode(e) {
    this.mode = e;
  }
  beginGroup() {
    this.macros.beginGroup();
  }
  endGroup() {
    this.macros.endGroup();
  }
  endGroups() {
    this.macros.endGroups();
  }
  future() {
    return (
      this.stack.length === 0 && this.pushToken(this.lexer.lex()),
      this.stack[this.stack.length - 1]
    );
  }
  popToken() {
    return (this.future(), this.stack.pop());
  }
  pushToken(e) {
    this.stack.push(e);
  }
  pushTokens(e) {
    this.stack.push(...e);
  }
  scanArgument(e) {
    var n, r, i;
    if (e) {
      if ((this.consumeSpaces(), this.future().text !== "[")) return null;
      ((n = this.popToken()), ({ tokens: i, end: r } = this.consumeArg(["]"])));
    } else ({ tokens: i, start: n, end: r } = this.consumeArg());
    return (
      this.pushToken(new Fn("EOF", r.loc)),
      this.pushTokens(i),
      n.range(r, "")
    );
  }
  consumeSpaces() {
    for (;;) {
      var e = this.future();
      if (e.text === " ") this.stack.pop();
      else break;
    }
  }
  consumeArg(e) {
    var n = [],
      r = e && e.length > 0;
    r || this.consumeSpaces();
    var i = this.future(),
      a,
      s = 0,
      o = 0;
    do {
      if (((a = this.popToken()), n.push(a), a.text === "{")) ++s;
      else if (a.text === "}") {
        if ((--s, s === -1)) throw new ae("Extra }", a);
      } else if (a.text === "EOF")
        throw new ae(
          "Unexpected end of input in a macro argument, expected '" +
            (e && r ? e[o] : "}") +
            "'",
          a,
        );
      if (e && r)
        if ((s === 0 || (s === 1 && e[o] === "{")) && a.text === e[o]) {
          if ((++o, o === e.length)) {
            n.splice(-o, o);
            break;
          }
        } else o = 0;
    } while (s !== 0 || r);
    return (
      i.text === "{" && n[n.length - 1].text === "}" && (n.pop(), n.shift()),
      n.reverse(),
      { tokens: n, start: i, end: a }
    );
  }
  consumeArgs(e, n) {
    if (n) {
      if (n.length !== e + 1)
        throw new ae(
          "The length of delimiters doesn't match the number of args!",
        );
      for (var r = n[0], i = 0; i < r.length; i++) {
        var a = this.popToken();
        if (r[i] !== a.text)
          throw new ae("Use of the macro doesn't match its definition", a);
      }
    }
    for (var s = [], o = 0; o < e; o++)
      s.push(this.consumeArg(n && n[o + 1]).tokens);
    return s;
  }
  countExpansion(e) {
    if (
      ((this.expansionCount += e),
      this.expansionCount > this.settings.maxExpand)
    )
      throw new ae(
        "Too many expansions: infinite loop or need to increase maxExpand setting",
      );
  }
  expandOnce(e) {
    var n = this.popToken(),
      r = n.text,
      i = n.noexpand ? null : this._getExpansion(r);
    if (i == null || (e && i.unexpandable)) {
      if (e && i == null && r[0] === "\\" && !this.isDefined(r))
        throw new ae("Undefined control sequence: " + r);
      return (this.pushToken(n), !1);
    }
    this.countExpansion(1);
    var a = i.tokens,
      s = this.consumeArgs(i.numArgs, i.delimiters);
    if (i.numArgs) {
      a = a.slice();
      for (var o = a.length - 1; o >= 0; --o) {
        var l = a[o];
        if (l.text === "#") {
          if (o === 0)
            throw new ae("Incomplete placeholder at end of macro body", l);
          if (((l = a[--o]), l.text === "#")) a.splice(o + 1, 1);
          else if (/^[1-9]$/.test(l.text)) a.splice(o, 2, ...s[+l.text - 1]);
          else throw new ae("Not a valid argument number", l);
        }
      }
    }
    return (this.pushTokens(a), a.length);
  }
  expandAfterFuture() {
    return (this.expandOnce(), this.future());
  }
  expandNextToken() {
    for (;;)
      if (this.expandOnce() === !1) {
        var e = this.stack.pop();
        return (e.treatAsRelax && (e.text = "\\relax"), e);
      }
    throw new Error();
  }
  expandMacro(e) {
    return this.macros.has(e) ? this.expandTokens([new Fn(e)]) : void 0;
  }
  expandTokens(e) {
    var n = [],
      r = this.stack.length;
    for (this.pushTokens(e); this.stack.length > r; )
      if (this.expandOnce(!0) === !1) {
        var i = this.stack.pop();
        (i.treatAsRelax && ((i.noexpand = !1), (i.treatAsRelax = !1)),
          n.push(i));
      }
    return (this.countExpansion(n.length), n);
  }
  expandMacroAsText(e) {
    var n = this.expandMacro(e);
    return n && n.map((r) => r.text).join("");
  }
  _getExpansion(e) {
    var n = this.macros.get(e);
    if (n == null) return n;
    if (e.length === 1) {
      var r = this.lexer.catcodes[e];
      if (r != null && r !== 13) return;
    }
    var i = typeof n == "function" ? n(this) : n;
    if (typeof i == "string") {
      var a = 0;
      if (i.indexOf("#") !== -1)
        for (var s = i.replace(/##/g, ""); s.indexOf("#" + (a + 1)) !== -1; )
          ++a;
      for (
        var o = new Lu(i, this.settings), l = [], u = o.lex();
        u.text !== "EOF";

      )
        (l.push(u), (u = o.lex()));
      l.reverse();
      var h = { tokens: l, numArgs: a };
      return h;
    }
    return i;
  }
  isDefined(e) {
    return (
      this.macros.has(e) ||
      Rr.hasOwnProperty(e) ||
      tt.math.hasOwnProperty(e) ||
      tt.text.hasOwnProperty(e) ||
      oh.hasOwnProperty(e)
    );
  }
  isExpandable(e) {
    var n = this.macros.get(e);
    return n != null
      ? typeof n == "string" || typeof n == "function" || !n.unexpandable
      : Rr.hasOwnProperty(e) && !Rr[e].primitive;
  }
}
var Du = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,
  ts = Object.freeze({
    "₊": "+",
    "₋": "-",
    "₌": "=",
    "₍": "(",
    "₎": ")",
    "₀": "0",
    "₁": "1",
    "₂": "2",
    "₃": "3",
    "₄": "4",
    "₅": "5",
    "₆": "6",
    "₇": "7",
    "₈": "8",
    "₉": "9",
    ₐ: "a",
    ₑ: "e",
    ₕ: "h",
    ᵢ: "i",
    ⱼ: "j",
    ₖ: "k",
    ₗ: "l",
    ₘ: "m",
    ₙ: "n",
    ₒ: "o",
    ₚ: "p",
    ᵣ: "r",
    ₛ: "s",
    ₜ: "t",
    ᵤ: "u",
    ᵥ: "v",
    ₓ: "x",
    ᵦ: "β",
    ᵧ: "γ",
    ᵨ: "ρ",
    ᵩ: "ϕ",
    ᵪ: "χ",
    "⁺": "+",
    "⁻": "-",
    "⁼": "=",
    "⁽": "(",
    "⁾": ")",
    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9",
    ᴬ: "A",
    ᴮ: "B",
    ᴰ: "D",
    ᴱ: "E",
    ᴳ: "G",
    ᴴ: "H",
    ᴵ: "I",
    ᴶ: "J",
    ᴷ: "K",
    ᴸ: "L",
    ᴹ: "M",
    ᴺ: "N",
    ᴼ: "O",
    ᴾ: "P",
    ᴿ: "R",
    ᵀ: "T",
    ᵁ: "U",
    ⱽ: "V",
    ᵂ: "W",
    ᵃ: "a",
    ᵇ: "b",
    ᶜ: "c",
    ᵈ: "d",
    ᵉ: "e",
    ᶠ: "f",
    ᵍ: "g",
    ʰ: "h",
    ⁱ: "i",
    ʲ: "j",
    ᵏ: "k",
    ˡ: "l",
    ᵐ: "m",
    ⁿ: "n",
    ᵒ: "o",
    ᵖ: "p",
    ʳ: "r",
    ˢ: "s",
    ᵗ: "t",
    ᵘ: "u",
    ᵛ: "v",
    ʷ: "w",
    ˣ: "x",
    ʸ: "y",
    ᶻ: "z",
    ᵝ: "β",
    ᵞ: "γ",
    ᵟ: "δ",
    ᵠ: "ϕ",
    ᵡ: "χ",
    ᶿ: "θ",
  }),
  Po = {
    "́": { text: "\\'", math: "\\acute" },
    "̀": { text: "\\`", math: "\\grave" },
    "̈": { text: '\\"', math: "\\ddot" },
    "̃": { text: "\\~", math: "\\tilde" },
    "̄": { text: "\\=", math: "\\bar" },
    "̆": { text: "\\u", math: "\\breve" },
    "̌": { text: "\\v", math: "\\check" },
    "̂": { text: "\\^", math: "\\hat" },
    "̇": { text: "\\.", math: "\\dot" },
    "̊": { text: "\\r", math: "\\mathring" },
    "̋": { text: "\\H" },
    "̧": { text: "\\c" },
  },
  Iu = {
    á: "á",
    à: "à",
    ä: "ä",
    ǟ: "ǟ",
    ã: "ã",
    ā: "ā",
    ă: "ă",
    ắ: "ắ",
    ằ: "ằ",
    ẵ: "ẵ",
    ǎ: "ǎ",
    â: "â",
    ấ: "ấ",
    ầ: "ầ",
    ẫ: "ẫ",
    ȧ: "ȧ",
    ǡ: "ǡ",
    å: "å",
    ǻ: "ǻ",
    ḃ: "ḃ",
    ć: "ć",
    ḉ: "ḉ",
    č: "č",
    ĉ: "ĉ",
    ċ: "ċ",
    ç: "ç",
    ď: "ď",
    ḋ: "ḋ",
    ḑ: "ḑ",
    é: "é",
    è: "è",
    ë: "ë",
    ẽ: "ẽ",
    ē: "ē",
    ḗ: "ḗ",
    ḕ: "ḕ",
    ĕ: "ĕ",
    ḝ: "ḝ",
    ě: "ě",
    ê: "ê",
    ế: "ế",
    ề: "ề",
    ễ: "ễ",
    ė: "ė",
    ȩ: "ȩ",
    ḟ: "ḟ",
    ǵ: "ǵ",
    ḡ: "ḡ",
    ğ: "ğ",
    ǧ: "ǧ",
    ĝ: "ĝ",
    ġ: "ġ",
    ģ: "ģ",
    ḧ: "ḧ",
    ȟ: "ȟ",
    ĥ: "ĥ",
    ḣ: "ḣ",
    ḩ: "ḩ",
    í: "í",
    ì: "ì",
    ï: "ï",
    ḯ: "ḯ",
    ĩ: "ĩ",
    ī: "ī",
    ĭ: "ĭ",
    ǐ: "ǐ",
    î: "î",
    ǰ: "ǰ",
    ĵ: "ĵ",
    ḱ: "ḱ",
    ǩ: "ǩ",
    ķ: "ķ",
    ĺ: "ĺ",
    ľ: "ľ",
    ļ: "ļ",
    ḿ: "ḿ",
    ṁ: "ṁ",
    ń: "ń",
    ǹ: "ǹ",
    ñ: "ñ",
    ň: "ň",
    ṅ: "ṅ",
    ņ: "ņ",
    ó: "ó",
    ò: "ò",
    ö: "ö",
    ȫ: "ȫ",
    õ: "õ",
    ṍ: "ṍ",
    ṏ: "ṏ",
    ȭ: "ȭ",
    ō: "ō",
    ṓ: "ṓ",
    ṑ: "ṑ",
    ŏ: "ŏ",
    ǒ: "ǒ",
    ô: "ô",
    ố: "ố",
    ồ: "ồ",
    ỗ: "ỗ",
    ȯ: "ȯ",
    ȱ: "ȱ",
    ő: "ő",
    ṕ: "ṕ",
    ṗ: "ṗ",
    ŕ: "ŕ",
    ř: "ř",
    ṙ: "ṙ",
    ŗ: "ŗ",
    ś: "ś",
    ṥ: "ṥ",
    š: "š",
    ṧ: "ṧ",
    ŝ: "ŝ",
    ṡ: "ṡ",
    ş: "ş",
    ẗ: "ẗ",
    ť: "ť",
    ṫ: "ṫ",
    ţ: "ţ",
    ú: "ú",
    ù: "ù",
    ü: "ü",
    ǘ: "ǘ",
    ǜ: "ǜ",
    ǖ: "ǖ",
    ǚ: "ǚ",
    ũ: "ũ",
    ṹ: "ṹ",
    ū: "ū",
    ṻ: "ṻ",
    ŭ: "ŭ",
    ǔ: "ǔ",
    û: "û",
    ů: "ů",
    ű: "ű",
    ṽ: "ṽ",
    ẃ: "ẃ",
    ẁ: "ẁ",
    ẅ: "ẅ",
    ŵ: "ŵ",
    ẇ: "ẇ",
    ẘ: "ẘ",
    ẍ: "ẍ",
    ẋ: "ẋ",
    ý: "ý",
    ỳ: "ỳ",
    ÿ: "ÿ",
    ỹ: "ỹ",
    ȳ: "ȳ",
    ŷ: "ŷ",
    ẏ: "ẏ",
    ẙ: "ẙ",
    ź: "ź",
    ž: "ž",
    ẑ: "ẑ",
    ż: "ż",
    Á: "Á",
    À: "À",
    Ä: "Ä",
    Ǟ: "Ǟ",
    Ã: "Ã",
    Ā: "Ā",
    Ă: "Ă",
    Ắ: "Ắ",
    Ằ: "Ằ",
    Ẵ: "Ẵ",
    Ǎ: "Ǎ",
    Â: "Â",
    Ấ: "Ấ",
    Ầ: "Ầ",
    Ẫ: "Ẫ",
    Ȧ: "Ȧ",
    Ǡ: "Ǡ",
    Å: "Å",
    Ǻ: "Ǻ",
    Ḃ: "Ḃ",
    Ć: "Ć",
    Ḉ: "Ḉ",
    Č: "Č",
    Ĉ: "Ĉ",
    Ċ: "Ċ",
    Ç: "Ç",
    Ď: "Ď",
    Ḋ: "Ḋ",
    Ḑ: "Ḑ",
    É: "É",
    È: "È",
    Ë: "Ë",
    Ẽ: "Ẽ",
    Ē: "Ē",
    Ḗ: "Ḗ",
    Ḕ: "Ḕ",
    Ĕ: "Ĕ",
    Ḝ: "Ḝ",
    Ě: "Ě",
    Ê: "Ê",
    Ế: "Ế",
    Ề: "Ề",
    Ễ: "Ễ",
    Ė: "Ė",
    Ȩ: "Ȩ",
    Ḟ: "Ḟ",
    Ǵ: "Ǵ",
    Ḡ: "Ḡ",
    Ğ: "Ğ",
    Ǧ: "Ǧ",
    Ĝ: "Ĝ",
    Ġ: "Ġ",
    Ģ: "Ģ",
    Ḧ: "Ḧ",
    Ȟ: "Ȟ",
    Ĥ: "Ĥ",
    Ḣ: "Ḣ",
    Ḩ: "Ḩ",
    Í: "Í",
    Ì: "Ì",
    Ï: "Ï",
    Ḯ: "Ḯ",
    Ĩ: "Ĩ",
    Ī: "Ī",
    Ĭ: "Ĭ",
    Ǐ: "Ǐ",
    Î: "Î",
    İ: "İ",
    Ĵ: "Ĵ",
    Ḱ: "Ḱ",
    Ǩ: "Ǩ",
    Ķ: "Ķ",
    Ĺ: "Ĺ",
    Ľ: "Ľ",
    Ļ: "Ļ",
    Ḿ: "Ḿ",
    Ṁ: "Ṁ",
    Ń: "Ń",
    Ǹ: "Ǹ",
    Ñ: "Ñ",
    Ň: "Ň",
    Ṅ: "Ṅ",
    Ņ: "Ņ",
    Ó: "Ó",
    Ò: "Ò",
    Ö: "Ö",
    Ȫ: "Ȫ",
    Õ: "Õ",
    Ṍ: "Ṍ",
    Ṏ: "Ṏ",
    Ȭ: "Ȭ",
    Ō: "Ō",
    Ṓ: "Ṓ",
    Ṑ: "Ṑ",
    Ŏ: "Ŏ",
    Ǒ: "Ǒ",
    Ô: "Ô",
    Ố: "Ố",
    Ồ: "Ồ",
    Ỗ: "Ỗ",
    Ȯ: "Ȯ",
    Ȱ: "Ȱ",
    Ő: "Ő",
    Ṕ: "Ṕ",
    Ṗ: "Ṗ",
    Ŕ: "Ŕ",
    Ř: "Ř",
    Ṙ: "Ṙ",
    Ŗ: "Ŗ",
    Ś: "Ś",
    Ṥ: "Ṥ",
    Š: "Š",
    Ṧ: "Ṧ",
    Ŝ: "Ŝ",
    Ṡ: "Ṡ",
    Ş: "Ş",
    Ť: "Ť",
    Ṫ: "Ṫ",
    Ţ: "Ţ",
    Ú: "Ú",
    Ù: "Ù",
    Ü: "Ü",
    Ǘ: "Ǘ",
    Ǜ: "Ǜ",
    Ǖ: "Ǖ",
    Ǚ: "Ǚ",
    Ũ: "Ũ",
    Ṹ: "Ṹ",
    Ū: "Ū",
    Ṻ: "Ṻ",
    Ŭ: "Ŭ",
    Ǔ: "Ǔ",
    Û: "Û",
    Ů: "Ů",
    Ű: "Ű",
    Ṽ: "Ṽ",
    Ẃ: "Ẃ",
    Ẁ: "Ẁ",
    Ẅ: "Ẅ",
    Ŵ: "Ŵ",
    Ẇ: "Ẇ",
    Ẍ: "Ẍ",
    Ẋ: "Ẋ",
    Ý: "Ý",
    Ỳ: "Ỳ",
    Ÿ: "Ÿ",
    Ỹ: "Ỹ",
    Ȳ: "Ȳ",
    Ŷ: "Ŷ",
    Ẏ: "Ẏ",
    Ź: "Ź",
    Ž: "Ž",
    Ẑ: "Ẑ",
    Ż: "Ż",
    ά: "ά",
    ὰ: "ὰ",
    ᾱ: "ᾱ",
    ᾰ: "ᾰ",
    έ: "έ",
    ὲ: "ὲ",
    ή: "ή",
    ὴ: "ὴ",
    ί: "ί",
    ὶ: "ὶ",
    ϊ: "ϊ",
    ΐ: "ΐ",
    ῒ: "ῒ",
    ῑ: "ῑ",
    ῐ: "ῐ",
    ό: "ό",
    ὸ: "ὸ",
    ύ: "ύ",
    ὺ: "ὺ",
    ϋ: "ϋ",
    ΰ: "ΰ",
    ῢ: "ῢ",
    ῡ: "ῡ",
    ῠ: "ῠ",
    ώ: "ώ",
    ὼ: "ὼ",
    Ύ: "Ύ",
    Ὺ: "Ὺ",
    Ϋ: "Ϋ",
    Ῡ: "Ῡ",
    Ῠ: "Ῠ",
    Ώ: "Ώ",
    Ὼ: "Ὼ",
  };
class ro {
  constructor(e, n) {
    ((this.mode = void 0),
      (this.gullet = void 0),
      (this.settings = void 0),
      (this.leftrightDepth = void 0),
      (this.nextToken = void 0),
      (this.mode = "math"),
      (this.gullet = new o5(e, n, this.mode)),
      (this.settings = n),
      (this.leftrightDepth = 0));
  }
  expect(e, n) {
    if ((n === void 0 && (n = !0), this.fetch().text !== e))
      throw new ae(
        "Expected '" + e + "', got '" + this.fetch().text + "'",
        this.fetch(),
      );
    n && this.consume();
  }
  consume() {
    this.nextToken = null;
  }
  fetch() {
    return (
      this.nextToken == null &&
        (this.nextToken = this.gullet.expandNextToken()),
      this.nextToken
    );
  }
  switchMode(e) {
    ((this.mode = e), this.gullet.switchMode(e));
  }
  parse() {
    (this.settings.globalGroup || this.gullet.beginGroup(),
      this.settings.colorIsTextColor &&
        this.gullet.macros.set("\\color", "\\textcolor"));
    try {
      var e = this.parseExpression(!1);
      return (
        this.expect("EOF"),
        this.settings.globalGroup || this.gullet.endGroup(),
        e
      );
    } finally {
      this.gullet.endGroups();
    }
  }
  subparse(e) {
    var n = this.nextToken;
    (this.consume(),
      this.gullet.pushToken(new Fn("}")),
      this.gullet.pushTokens(e));
    var r = this.parseExpression(!1);
    return (this.expect("}"), (this.nextToken = n), r);
  }
  parseExpression(e, n) {
    for (var r = []; ; ) {
      this.mode === "math" && this.consumeSpaces();
      var i = this.fetch();
      if (
        ro.endOfExpression.indexOf(i.text) !== -1 ||
        (n && i.text === n) ||
        (e && Rr[i.text] && Rr[i.text].infix)
      )
        break;
      var a = this.parseAtom(n);
      if (a) {
        if (a.type === "internal") continue;
      } else break;
      r.push(a);
    }
    return (
      this.mode === "text" && this.formLigatures(r),
      this.handleInfixNodes(r)
    );
  }
  handleInfixNodes(e) {
    for (var n = -1, r, i = 0; i < e.length; i++)
      if (e[i].type === "infix") {
        if (n !== -1)
          throw new ae("only one infix operator per group", e[i].token);
        ((n = i), (r = e[i].replaceWith));
      }
    if (n !== -1 && r) {
      var a,
        s,
        o = e.slice(0, n),
        l = e.slice(n + 1);
      (o.length === 1 && o[0].type === "ordgroup"
        ? (a = o[0])
        : (a = { type: "ordgroup", mode: this.mode, body: o }),
        l.length === 1 && l[0].type === "ordgroup"
          ? (s = l[0])
          : (s = { type: "ordgroup", mode: this.mode, body: l }));
      var u;
      return (
        r === "\\\\abovefrac"
          ? (u = this.callFunction(r, [a, e[n], s], []))
          : (u = this.callFunction(r, [a, s], [])),
        [u]
      );
    } else return e;
  }
  handleSupSubscript(e) {
    var n = this.fetch(),
      r = n.text;
    (this.consume(), this.consumeSpaces());
    var i;
    do {
      var a;
      i = this.parseGroup(e);
    } while (((a = i) == null ? void 0 : a.type) === "internal");
    if (!i) throw new ae("Expected group after '" + r + "'", n);
    return i;
  }
  formatUnsupportedCmd(e) {
    for (var n = [], r = 0; r < e.length; r++)
      n.push({ type: "textord", mode: "text", text: e[r] });
    var i = { type: "text", mode: this.mode, body: n },
      a = {
        type: "color",
        mode: this.mode,
        color: this.settings.errorColor,
        body: [i],
      };
    return a;
  }
  parseAtom(e) {
    var n = this.parseGroup("atom", e);
    if ((n == null ? void 0 : n.type) === "internal" || this.mode === "text")
      return n;
    for (var r, i; ; ) {
      this.consumeSpaces();
      var a = this.fetch();
      if (a.text === "\\limits" || a.text === "\\nolimits") {
        if (n && n.type === "op") {
          var s = a.text === "\\limits";
          ((n.limits = s), (n.alwaysHandleSupSub = !0));
        } else if (n && n.type === "operatorname")
          n.alwaysHandleSupSub && (n.limits = a.text === "\\limits");
        else throw new ae("Limit controls must follow a math operator", a);
        this.consume();
      } else if (a.text === "^") {
        if (r) throw new ae("Double superscript", a);
        r = this.handleSupSubscript("superscript");
      } else if (a.text === "_") {
        if (i) throw new ae("Double subscript", a);
        i = this.handleSupSubscript("subscript");
      } else if (a.text === "'") {
        if (r) throw new ae("Double superscript", a);
        var o = { type: "textord", mode: this.mode, text: "\\prime" },
          l = [o];
        for (this.consume(); this.fetch().text === "'"; )
          (l.push(o), this.consume());
        (this.fetch().text === "^" &&
          l.push(this.handleSupSubscript("superscript")),
          (r = { type: "ordgroup", mode: this.mode, body: l }));
      } else if (ts[a.text]) {
        var u = Du.test(a.text),
          h = [];
        for (h.push(new Fn(ts[a.text])), this.consume(); ; ) {
          var d = this.fetch().text;
          if (!ts[d] || Du.test(d) !== u) break;
          (h.unshift(new Fn(ts[d])), this.consume());
        }
        var p = this.subparse(h);
        u
          ? (i = { type: "ordgroup", mode: "math", body: p })
          : (r = { type: "ordgroup", mode: "math", body: p });
      } else break;
    }
    return r || i
      ? { type: "supsub", mode: this.mode, base: n, sup: r, sub: i }
      : n;
  }
  parseFunction(e, n) {
    var r = this.fetch(),
      i = r.text,
      a = Rr[i];
    if (!a) return null;
    if ((this.consume(), n && n !== "atom" && !a.allowedInArgument))
      throw new ae(
        "Got function '" + i + "' with no arguments" + (n ? " as " + n : ""),
        r,
      );
    if (this.mode === "text" && !a.allowedInText)
      throw new ae("Can't use function '" + i + "' in text mode", r);
    if (this.mode === "math" && a.allowedInMath === !1)
      throw new ae("Can't use function '" + i + "' in math mode", r);
    var { args: s, optArgs: o } = this.parseArguments(i, a);
    return this.callFunction(i, s, o, r, e);
  }
  callFunction(e, n, r, i, a) {
    var s = { funcName: e, parser: this, token: i, breakOnTokenText: a },
      o = Rr[e];
    if (o && o.handler) return o.handler(s, n, r);
    throw new ae("No function handler for " + e);
  }
  parseArguments(e, n) {
    var r = n.numArgs + n.numOptionalArgs;
    if (r === 0) return { args: [], optArgs: [] };
    for (var i = [], a = [], s = 0; s < r; s++) {
      var o = n.argTypes && n.argTypes[s],
        l = s < n.numOptionalArgs;
      ((n.primitive && o == null) ||
        (n.type === "sqrt" && s === 1 && a[0] == null)) &&
        (o = "primitive");
      var u = this.parseGroupOfType("argument to '" + e + "'", o, l);
      if (l) a.push(u);
      else if (u != null) i.push(u);
      else throw new ae("Null argument, please report this as a bug");
    }
    return { args: i, optArgs: a };
  }
  parseGroupOfType(e, n, r) {
    switch (n) {
      case "color":
        return this.parseColorGroup(r);
      case "size":
        return this.parseSizeGroup(r);
      case "url":
        return this.parseUrlGroup(r);
      case "math":
      case "text":
        return this.parseArgumentGroup(r, n);
      case "hbox": {
        var i = this.parseArgumentGroup(r, "text");
        return i != null
          ? { type: "styling", mode: i.mode, body: [i], style: "text" }
          : null;
      }
      case "raw": {
        var a = this.parseStringGroup("raw", r);
        return a != null ? { type: "raw", mode: "text", string: a.text } : null;
      }
      case "primitive": {
        if (r) throw new ae("A primitive argument cannot be optional");
        var s = this.parseGroup(e);
        if (s == null) throw new ae("Expected group as " + e, this.fetch());
        return s;
      }
      case "original":
      case null:
      case void 0:
        return this.parseArgumentGroup(r);
      default:
        throw new ae("Unknown group type as " + e, this.fetch());
    }
  }
  consumeSpaces() {
    for (; this.fetch().text === " "; ) this.consume();
  }
  parseStringGroup(e, n) {
    var r = this.gullet.scanArgument(n);
    if (r == null) return null;
    for (var i = "", a; (a = this.fetch()).text !== "EOF"; )
      ((i += a.text), this.consume());
    return (this.consume(), (r.text = i), r);
  }
  parseRegexGroup(e, n) {
    for (
      var r = this.fetch(), i = r, a = "", s;
      (s = this.fetch()).text !== "EOF" && e.test(a + s.text);

    )
      ((i = s), (a += i.text), this.consume());
    if (a === "") throw new ae("Invalid " + n + ": '" + r.text + "'", r);
    return r.range(i, a);
  }
  parseColorGroup(e) {
    var n = this.parseStringGroup("color", e);
    if (n == null) return null;
    var r = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i.exec(n.text);
    if (!r) throw new ae("Invalid color: '" + n.text + "'", n);
    var i = r[0];
    return (
      /^[0-9a-f]{6}$/i.test(i) && (i = "#" + i),
      { type: "color-token", mode: this.mode, color: i }
    );
  }
  parseSizeGroup(e) {
    var n,
      r = !1;
    if (
      (this.gullet.consumeSpaces(),
      !e && this.gullet.future().text !== "{"
        ? (n = this.parseRegexGroup(
            /^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,
            "size",
          ))
        : (n = this.parseStringGroup("size", e)),
      !n)
    )
      return null;
    !e && n.text.length === 0 && ((n.text = "0pt"), (r = !0));
    var i = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(n.text);
    if (!i) throw new ae("Invalid size: '" + n.text + "'", n);
    var a = { number: +(i[1] + i[2]), unit: i[3] };
    if (!bd(a)) throw new ae("Invalid unit: '" + a.unit + "'", n);
    return { type: "size", mode: this.mode, value: a, isBlank: r };
  }
  parseUrlGroup(e) {
    (this.gullet.lexer.setCatcode("%", 13),
      this.gullet.lexer.setCatcode("~", 12));
    var n = this.parseStringGroup("url", e);
    if (
      (this.gullet.lexer.setCatcode("%", 14),
      this.gullet.lexer.setCatcode("~", 13),
      n == null)
    )
      return null;
    var r = n.text.replace(/\\([#$%&~_^{}])/g, "$1");
    return { type: "url", mode: this.mode, url: r };
  }
  parseArgumentGroup(e, n) {
    var r = this.gullet.scanArgument(e);
    if (r == null) return null;
    var i = this.mode;
    (n && this.switchMode(n), this.gullet.beginGroup());
    var a = this.parseExpression(!1, "EOF");
    (this.expect("EOF"), this.gullet.endGroup());
    var s = { type: "ordgroup", mode: this.mode, loc: r.loc, body: a };
    return (n && this.switchMode(i), s);
  }
  parseGroup(e, n) {
    var r = this.fetch(),
      i = r.text,
      a;
    if (i === "{" || i === "\\begingroup") {
      this.consume();
      var s = i === "{" ? "}" : "\\endgroup";
      this.gullet.beginGroup();
      var o = this.parseExpression(!1, s),
        l = this.fetch();
      (this.expect(s),
        this.gullet.endGroup(),
        (a = {
          type: "ordgroup",
          mode: this.mode,
          loc: mn.range(r, l),
          body: o,
          semisimple: i === "\\begingroup" || void 0,
        }));
    } else if (
      ((a = this.parseFunction(n, e) || this.parseSymbol()),
      a == null && i[0] === "\\" && !oh.hasOwnProperty(i))
    ) {
      if (this.settings.throwOnError)
        throw new ae("Undefined control sequence: " + i, r);
      ((a = this.formatUnsupportedCmd(i)), this.consume());
    }
    return a;
  }
  formLigatures(e) {
    for (var n = e.length - 1, r = 0; r < n; ++r) {
      var i = e[r],
        a = i.text;
      (a === "-" &&
        e[r + 1].text === "-" &&
        (r + 1 < n && e[r + 2].text === "-"
          ? (e.splice(r, 3, {
              type: "textord",
              mode: "text",
              loc: mn.range(i, e[r + 2]),
              text: "---",
            }),
            (n -= 2))
          : (e.splice(r, 2, {
              type: "textord",
              mode: "text",
              loc: mn.range(i, e[r + 1]),
              text: "--",
            }),
            (n -= 1))),
        (a === "'" || a === "`") &&
          e[r + 1].text === a &&
          (e.splice(r, 2, {
            type: "textord",
            mode: "text",
            loc: mn.range(i, e[r + 1]),
            text: a + a,
          }),
          (n -= 1)));
    }
  }
  parseSymbol() {
    var e = this.fetch(),
      n = e.text;
    if (/^\\verb[^a-zA-Z]/.test(n)) {
      this.consume();
      var r = n.slice(5),
        i = r.charAt(0) === "*";
      if ((i && (r = r.slice(1)), r.length < 2 || r.charAt(0) !== r.slice(-1)))
        throw new ae(`\\verb assertion failed --
                    please report what input caused this bug`);
      return (
        (r = r.slice(1, -1)),
        { type: "verb", mode: "text", body: r, star: i }
      );
    }
    Iu.hasOwnProperty(n[0]) &&
      !tt[this.mode][n[0]] &&
      (this.settings.strict &&
        this.mode === "math" &&
        this.settings.reportNonstrict(
          "unicodeTextInMathMode",
          'Accented Unicode text character "' + n[0] + '" used in math mode',
          e,
        ),
      (n = Iu[n[0]] + n.slice(1)));
    var a = r5.exec(n);
    a &&
      ((n = n.substring(0, a.index)),
      n === "i" ? (n = "ı") : n === "j" && (n = "ȷ"));
    var s;
    if (tt[this.mode][n]) {
      this.settings.strict &&
        this.mode === "math" &&
        a0.indexOf(n) >= 0 &&
        this.settings.reportNonstrict(
          "unicodeTextInMathMode",
          'Latin-1/Unicode text character "' + n[0] + '" used in math mode',
          e,
        );
      var o = tt[this.mode][n].group,
        l = mn.range(e),
        u;
      if (Yg.hasOwnProperty(o)) {
        var h = o;
        u = { type: "atom", mode: this.mode, family: h, loc: l, text: n };
      } else u = { type: o, mode: this.mode, loc: l, text: n };
      s = u;
    } else if (n.charCodeAt(0) >= 128)
      (this.settings.strict &&
        (vd(n.charCodeAt(0))
          ? this.mode === "math" &&
            this.settings.reportNonstrict(
              "unicodeTextInMathMode",
              'Unicode text character "' + n[0] + '" used in math mode',
              e,
            )
          : this.settings.reportNonstrict(
              "unknownSymbol",
              'Unrecognized Unicode character "' +
                n[0] +
                '"' +
                (" (" + n.charCodeAt(0) + ")"),
              e,
            )),
        (s = { type: "textord", mode: "text", loc: mn.range(e), text: n }));
    else return null;
    if ((this.consume(), a))
      for (var d = 0; d < a[0].length; d++) {
        var p = a[0][d];
        if (!Po[p]) throw new ae("Unknown accent ' " + p + "'", e);
        var m = Po[p][this.mode] || Po[p].text;
        if (!m)
          throw new ae(
            "Accent " + p + " unsupported in " + this.mode + " mode",
            e,
          );
        s = {
          type: "accent",
          mode: this.mode,
          loc: mn.range(e),
          label: m,
          isStretchy: !1,
          isShifty: !0,
          base: s,
        };
      }
    return s;
  }
}
ro.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"];
var l5 = function (e, n) {
  if (!(typeof e == "string" || e instanceof String))
    throw new TypeError("KaTeX can only parse string typed expression");
  var r = new ro(e, n);
  delete r.gullet.macros.current["\\df@tag"];
  var i = r.parse();
  if (
    (delete r.gullet.macros.current["\\current@color"],
    delete r.gullet.macros.current["\\color"],
    r.gullet.macros.get("\\df@tag"))
  ) {
    if (!n.displayMode) throw new ae("\\tag works only in display equations");
    i = [
      {
        type: "tag",
        mode: "text",
        body: i,
        tag: r.subparse([new Fn("\\df@tag")]),
      },
    ];
  }
  return i;
};
typeof document < "u" &&
  document.compatMode !== "CSS1Compat" &&
  typeof console < "u" &&
  console.warn(
    "Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.",
  );
var u5 = function (e, n) {
    var r = d5(e, n).toMarkup();
    return r;
  },
  c5 = function (e, n, r) {
    if (r.throwOnError || !(e instanceof ae)) throw e;
    var i = W.makeSpan(["katex-error"], [new Gn(n)]);
    return (
      i.setAttribute("title", e.toString()),
      i.setAttribute("style", "color:" + r.errorColor),
      i
    );
  },
  d5 = function (e, n) {
    var r = new Sg(n);
    try {
      var i = l5(e, r);
      return y2(i, e, r);
    } catch (a) {
      return c5(a, e, r);
    }
  },
  h5 = { renderToString: u5 };
const f5 = h5.renderToString;
function m5(t) {
  return {
    enter: {
      mathFlow() {
        (this.lineEndingIfNeeded(),
          this.tag('<div class="math math-display">'));
      },
      mathFlowFenceMeta() {
        this.buffer();
      },
      mathText() {
        (this.tag('<span class="math math-inline">'), this.buffer());
      },
    },
    exit: {
      mathFlow() {
        const n = this.resume();
        (this.tag(e(n.replace(/(?:\r?\n|\r)$/, ""), !0)),
          this.tag("</div>"),
          this.setData("mathFlowOpen"),
          this.setData("slurpOneLineEnding"));
      },
      mathFlowFence() {
        this.getData("mathFlowOpen") ||
          (this.setData("mathFlowOpen", !0),
          this.setData("slurpOneLineEnding", !0),
          this.buffer());
      },
      mathFlowFenceMeta() {
        this.resume();
      },
      mathFlowValue(n) {
        this.raw(this.sliceSerialize(n));
      },
      mathText() {
        const n = this.resume();
        (this.tag(e(n, !1)), this.tag("</span>"));
      },
      mathTextData(n) {
        this.raw(this.sliceSerialize(n));
      },
    },
  };
  function e(n, r) {
    return f5(n, { ...t, displayMode: r });
  }
}
const p5 = { tokenize: x5, partial: !0 },
  lh = { tokenize: k5, partial: !0 },
  uh = { tokenize: S5, partial: !0 },
  ch = { tokenize: A5, partial: !0 },
  g5 = { tokenize: T5, partial: !0 },
  dh = { name: "wwwAutolink", tokenize: y5, previous: fh },
  hh = { name: "protocolAutolink", tokenize: w5, previous: mh },
  Cr = { name: "emailAutolink", tokenize: b5, previous: ph },
  ur = {};
function v5() {
  return { text: ur };
}
let si = 48;
for (; si < 123; )
  ((ur[si] = Cr), si++, si === 58 ? (si = 65) : si === 91 && (si = 97));
ur[43] = Cr;
ur[45] = Cr;
ur[46] = Cr;
ur[95] = Cr;
ur[72] = [Cr, hh];
ur[104] = [Cr, hh];
ur[87] = [Cr, dh];
ur[119] = [Cr, dh];
function b5(t, e, n) {
  const r = this;
  let i, a;
  return s;
  function s(d) {
    return !c0(d) || !ph.call(r, r.previous) || H0(r.events)
      ? n(d)
      : (t.enter("literalAutolink"), t.enter("literalAutolinkEmail"), o(d));
  }
  function o(d) {
    return c0(d) ? (t.consume(d), o) : d === 64 ? (t.consume(d), l) : n(d);
  }
  function l(d) {
    return d === 46
      ? t.check(g5, h, u)(d)
      : d === 45 || d === 95 || zt(d)
        ? ((a = !0), t.consume(d), l)
        : h(d);
  }
  function u(d) {
    return (t.consume(d), (i = !0), l);
  }
  function h(d) {
    return a && i && Nt(r.previous)
      ? (t.exit("literalAutolinkEmail"), t.exit("literalAutolink"), e(d))
      : n(d);
  }
}
function y5(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return (s !== 87 && s !== 119) || !fh.call(r, r.previous) || H0(r.events)
      ? n(s)
      : (t.enter("literalAutolink"),
        t.enter("literalAutolinkWww"),
        t.check(p5, t.attempt(lh, t.attempt(uh, a), n), n)(s));
  }
  function a(s) {
    return (t.exit("literalAutolinkWww"), t.exit("literalAutolink"), e(s));
  }
}
function w5(t, e, n) {
  const r = this;
  let i = "",
    a = !1;
  return s;
  function s(d) {
    return (d === 72 || d === 104) && mh.call(r, r.previous) && !H0(r.events)
      ? (t.enter("literalAutolink"),
        t.enter("literalAutolinkHttp"),
        (i += String.fromCodePoint(d)),
        t.consume(d),
        o)
      : n(d);
  }
  function o(d) {
    if (Nt(d) && i.length < 5)
      return ((i += String.fromCodePoint(d)), t.consume(d), o);
    if (d === 58) {
      const p = i.toLowerCase();
      if (p === "http" || p === "https") return (t.consume(d), l);
    }
    return n(d);
  }
  function l(d) {
    return d === 47 ? (t.consume(d), a ? u : ((a = !0), l)) : n(d);
  }
  function u(d) {
    return d === null || Is(d) || $e(d) || _i(d) || k0(d)
      ? n(d)
      : t.attempt(lh, t.attempt(uh, h), n)(d);
  }
  function h(d) {
    return (t.exit("literalAutolinkHttp"), t.exit("literalAutolink"), e(d));
  }
}
function x5(t, e, n) {
  let r = 0;
  return i;
  function i(s) {
    return (s === 87 || s === 119) && r < 3
      ? (r++, t.consume(s), i)
      : s === 46 && r === 3
        ? (t.consume(s), a)
        : n(s);
  }
  function a(s) {
    return s === null ? n(s) : e(s);
  }
}
function k5(t, e, n) {
  let r, i, a;
  return s;
  function s(u) {
    return u === 46 || u === 95
      ? t.check(ch, l, o)(u)
      : u === null || $e(u) || _i(u) || (u !== 45 && k0(u))
        ? l(u)
        : ((a = !0), t.consume(u), s);
  }
  function o(u) {
    return (u === 95 ? (r = !0) : ((i = r), (r = void 0)), t.consume(u), s);
  }
  function l(u) {
    return i || r || !a ? n(u) : e(u);
  }
}
function S5(t, e) {
  let n = 0,
    r = 0;
  return i;
  function i(s) {
    return s === 40
      ? (n++, t.consume(s), i)
      : s === 41 && r < n
        ? a(s)
        : s === 33 ||
            s === 34 ||
            s === 38 ||
            s === 39 ||
            s === 41 ||
            s === 42 ||
            s === 44 ||
            s === 46 ||
            s === 58 ||
            s === 59 ||
            s === 60 ||
            s === 63 ||
            s === 93 ||
            s === 95 ||
            s === 126
          ? t.check(ch, e, a)(s)
          : s === null || $e(s) || _i(s)
            ? e(s)
            : (t.consume(s), i);
  }
  function a(s) {
    return (s === 41 && r++, t.consume(s), i);
  }
}
function A5(t, e, n) {
  return r;
  function r(o) {
    return o === 33 ||
      o === 34 ||
      o === 39 ||
      o === 41 ||
      o === 42 ||
      o === 44 ||
      o === 46 ||
      o === 58 ||
      o === 59 ||
      o === 63 ||
      o === 95 ||
      o === 126
      ? (t.consume(o), r)
      : o === 38
        ? (t.consume(o), a)
        : o === 93
          ? (t.consume(o), i)
          : o === 60 || o === null || $e(o) || _i(o)
            ? e(o)
            : n(o);
  }
  function i(o) {
    return o === null || o === 40 || o === 91 || $e(o) || _i(o) ? e(o) : r(o);
  }
  function a(o) {
    return Nt(o) ? s(o) : n(o);
  }
  function s(o) {
    return o === 59 ? (t.consume(o), r) : Nt(o) ? (t.consume(o), s) : n(o);
  }
}
function T5(t, e, n) {
  return r;
  function r(a) {
    return (t.consume(a), i);
  }
  function i(a) {
    return zt(a) ? n(a) : e(a);
  }
}
function fh(t) {
  return (
    t === null ||
    t === 40 ||
    t === 42 ||
    t === 95 ||
    t === 91 ||
    t === 93 ||
    t === 126 ||
    $e(t)
  );
}
function mh(t) {
  return !Nt(t);
}
function ph(t) {
  return !(t === 47 || c0(t));
}
function c0(t) {
  return t === 43 || t === 45 || t === 46 || t === 95 || zt(t);
}
function H0(t) {
  let e = t.length,
    n = !1;
  for (; e--; ) {
    const r = t[e][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return (
    t.length > 0 &&
      !n &&
      (t[t.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0),
    n
  );
}
function E5() {
  return {
    exit: {
      literalAutolinkEmail: L5,
      literalAutolinkHttp: M5,
      literalAutolinkWww: C5,
    },
  };
}
function C5(t) {
  q0.call(this, t, "http://");
}
function L5(t) {
  q0.call(this, t, "mailto:");
}
function M5(t) {
  q0.call(this, t);
}
function q0(t, e) {
  const n = this.sliceSerialize(t);
  (this.tag('<a href="' + li((e || "") + n) + '">'),
    this.raw(this.encode(n)),
    this.tag("</a>"));
}
const z5 = { tokenize: R5, partial: !0 };
function D5() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: _5,
        continuation: { tokenize: O5 },
        exit: B5,
      },
    },
    text: {
      91: { name: "gfmFootnoteCall", tokenize: F5 },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: I5,
        resolveTo: N5,
      },
    },
  };
}
function I5(t, e, n) {
  const r = this;
  let i = r.events.length;
  const a = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let s;
  for (; i--; ) {
    const l = r.events[i][1];
    if (l.type === "labelImage") {
      s = l;
      break;
    }
    if (
      l.type === "gfmFootnoteCall" ||
      l.type === "labelLink" ||
      l.type === "label" ||
      l.type === "image" ||
      l.type === "link"
    )
      break;
  }
  return o;
  function o(l) {
    if (!s || !s._balanced) return n(l);
    const u = ir(r.sliceSerialize({ start: s.end, end: r.now() }));
    return u.codePointAt(0) !== 94 || !a.includes(u.slice(1))
      ? n(l)
      : (t.enter("gfmFootnoteCallLabelMarker"),
        t.consume(l),
        t.exit("gfmFootnoteCallLabelMarker"),
        e(l));
  }
}
function N5(t, e) {
  let n = t.length;
  for (; n--; )
    if (t[n][1].type === "labelImage" && t[n][0] === "enter") {
      t[n][1];
      break;
    }
  ((t[n + 1][1].type = "data"),
    (t[n + 3][1].type = "gfmFootnoteCallLabelMarker"));
  const r = {
      type: "gfmFootnoteCall",
      start: Object.assign({}, t[n + 3][1].start),
      end: Object.assign({}, t[t.length - 1][1].end),
    },
    i = {
      type: "gfmFootnoteCallMarker",
      start: Object.assign({}, t[n + 3][1].end),
      end: Object.assign({}, t[n + 3][1].end),
    };
  (i.end.column++, i.end.offset++, i.end._bufferIndex++);
  const a = {
      type: "gfmFootnoteCallString",
      start: Object.assign({}, i.end),
      end: Object.assign({}, t[t.length - 1][1].start),
    },
    s = {
      type: "chunkString",
      contentType: "string",
      start: Object.assign({}, a.start),
      end: Object.assign({}, a.end),
    },
    o = [
      t[n + 1],
      t[n + 2],
      ["enter", r, e],
      t[n + 3],
      t[n + 4],
      ["enter", i, e],
      ["exit", i, e],
      ["enter", a, e],
      ["enter", s, e],
      ["exit", s, e],
      ["exit", a, e],
      t[t.length - 2],
      t[t.length - 1],
      ["exit", r, e],
    ];
  return (t.splice(n, t.length - n + 1, ...o), t);
}
function F5(t, e, n) {
  const r = this,
    i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let a = 0,
    s;
  return o;
  function o(d) {
    return (
      t.enter("gfmFootnoteCall"),
      t.enter("gfmFootnoteCallLabelMarker"),
      t.consume(d),
      t.exit("gfmFootnoteCallLabelMarker"),
      l
    );
  }
  function l(d) {
    return d !== 94
      ? n(d)
      : (t.enter("gfmFootnoteCallMarker"),
        t.consume(d),
        t.exit("gfmFootnoteCallMarker"),
        t.enter("gfmFootnoteCallString"),
        (t.enter("chunkString").contentType = "string"),
        u);
  }
  function u(d) {
    if (a > 999 || (d === 93 && !s) || d === null || d === 91 || $e(d))
      return n(d);
    if (d === 93) {
      t.exit("chunkString");
      const p = t.exit("gfmFootnoteCallString");
      return i.includes(ir(r.sliceSerialize(p)))
        ? (t.enter("gfmFootnoteCallLabelMarker"),
          t.consume(d),
          t.exit("gfmFootnoteCallLabelMarker"),
          t.exit("gfmFootnoteCall"),
          e)
        : n(d);
    }
    return ($e(d) || (s = !0), a++, t.consume(d), d === 92 ? h : u);
  }
  function h(d) {
    return d === 91 || d === 92 || d === 93 ? (t.consume(d), a++, u) : u(d);
  }
}
function _5(t, e, n) {
  const r = this,
    i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let a,
    s = 0,
    o;
  return l;
  function l(y) {
    return (
      (t.enter("gfmFootnoteDefinition")._container = !0),
      t.enter("gfmFootnoteDefinitionLabel"),
      t.enter("gfmFootnoteDefinitionLabelMarker"),
      t.consume(y),
      t.exit("gfmFootnoteDefinitionLabelMarker"),
      u
    );
  }
  function u(y) {
    return y === 94
      ? (t.enter("gfmFootnoteDefinitionMarker"),
        t.consume(y),
        t.exit("gfmFootnoteDefinitionMarker"),
        t.enter("gfmFootnoteDefinitionLabelString"),
        (t.enter("chunkString").contentType = "string"),
        h)
      : n(y);
  }
  function h(y) {
    if (s > 999 || (y === 93 && !o) || y === null || y === 91 || $e(y))
      return n(y);
    if (y === 93) {
      t.exit("chunkString");
      const S = t.exit("gfmFootnoteDefinitionLabelString");
      return (
        (a = ir(r.sliceSerialize(S))),
        t.enter("gfmFootnoteDefinitionLabelMarker"),
        t.consume(y),
        t.exit("gfmFootnoteDefinitionLabelMarker"),
        t.exit("gfmFootnoteDefinitionLabel"),
        p
      );
    }
    return ($e(y) || (o = !0), s++, t.consume(y), y === 92 ? d : h);
  }
  function d(y) {
    return y === 91 || y === 92 || y === 93 ? (t.consume(y), s++, h) : h(y);
  }
  function p(y) {
    return y === 58
      ? (t.enter("definitionMarker"),
        t.consume(y),
        t.exit("definitionMarker"),
        i.includes(a) || i.push(a),
        Ne(t, m, "gfmFootnoteDefinitionWhitespace"))
      : n(y);
  }
  function m(y) {
    return e(y);
  }
}
function O5(t, e, n) {
  return t.check(La, e, t.attempt(z5, e, n));
}
function B5(t) {
  t.exit("gfmFootnoteDefinition");
}
function R5(t, e, n) {
  const r = this;
  return Ne(t, i, "gfmFootnoteDefinitionIndent", 5);
  function i(a) {
    const s = r.events[r.events.length - 1];
    return s &&
      s[1].type === "gfmFootnoteDefinitionIndent" &&
      s[2].sliceSerialize(s[1], !0).length === 4
      ? e(a)
      : n(a);
  }
}
const P5 = {}.hasOwnProperty,
  H5 = {};
function q5(t, e) {
  return "Back to reference " + (t + 1) + (e > 1 ? "-" + e : "");
}
function U5(t) {
  const e = H5,
    n = e.label || "Footnotes",
    r = e.labelTagName || "h2",
    i =
      e.labelAttributes === null || e.labelAttributes === void 0
        ? 'class="sr-only"'
        : e.labelAttributes,
    a = e.backLabel || q5,
    s =
      e.clobberPrefix === null || e.clobberPrefix === void 0
        ? "user-content-"
        : e.clobberPrefix;
  return {
    enter: {
      gfmFootnoteDefinition() {
        this.getData("tightStack").push(!1);
      },
      gfmFootnoteDefinitionLabelString() {
        this.buffer();
      },
      gfmFootnoteCallString() {
        this.buffer();
      },
    },
    exit: {
      gfmFootnoteDefinition() {
        let o = this.getData("gfmFootnoteDefinitions");
        const l = this.getData("gfmFootnoteDefinitionStack"),
          u = this.getData("tightStack"),
          h = l.pop(),
          d = this.resume();
        (o || this.setData("gfmFootnoteDefinitions", (o = {})),
          P5.call(o, h) || (o[h] = d),
          u.pop(),
          this.setData("slurpOneLineEnding", !0),
          this.setData("lastWasTag"));
      },
      gfmFootnoteDefinitionLabelString(o) {
        let l = this.getData("gfmFootnoteDefinitionStack");
        (l || this.setData("gfmFootnoteDefinitionStack", (l = [])),
          l.push(ir(this.sliceSerialize(o))),
          this.resume(),
          this.buffer());
      },
      gfmFootnoteCallString(o) {
        let l = this.getData("gfmFootnoteCallOrder"),
          u = this.getData("gfmFootnoteCallCounts");
        const h = ir(this.sliceSerialize(o));
        let d;
        (this.resume(),
          l || this.setData("gfmFootnoteCallOrder", (l = [])),
          u || this.setData("gfmFootnoteCallCounts", (u = {})));
        const p = l.indexOf(h),
          m = li(h.toLowerCase());
        p === -1
          ? (l.push(h), (u[h] = 1), (d = l.length))
          : (u[h]++, (d = p + 1));
        const y = u[h];
        this.tag(
          '<sup><a href="#' +
            s +
            "fn-" +
            m +
            '" id="' +
            s +
            "fnref-" +
            m +
            (y > 1 ? "-" + y : "") +
            '" data-footnote-ref="" aria-describedby="footnote-label">' +
            String(d) +
            "</a></sup>",
        );
      },
      null() {
        const o = this.getData("gfmFootnoteCallOrder") || [],
          l = this.getData("gfmFootnoteCallCounts") || {},
          u = this.getData("gfmFootnoteDefinitions") || {};
        let h = -1;
        for (
          o.length > 0 &&
          (this.lineEndingIfNeeded(),
          this.tag(
            '<section data-footnotes="" class="footnotes"><' +
              r +
              ' id="footnote-label"' +
              (i ? " " + i : "") +
              ">",
          ),
          this.raw(this.encode(n)),
          this.tag("</" + r + ">"),
          this.lineEndingIfNeeded(),
          this.tag("<ol>"));
          ++h < o.length;

        ) {
          const d = o[h],
            p = li(d.toLowerCase());
          let m = 0;
          const y = [];
          for (; ++m <= l[d]; )
            y.push(
              '<a href="#' +
                s +
                "fnref-" +
                p +
                (m > 1 ? "-" + m : "") +
                '" data-footnote-backref="" aria-label="' +
                this.encode(typeof a == "string" ? a : a(h, m)) +
                '" class="data-footnote-backref">↩' +
                (m > 1 ? "<sup>" + m + "</sup>" : "") +
                "</a>",
            );
          const S = y.join(" ");
          let A = !1;
          (this.lineEndingIfNeeded(),
            this.tag('<li id="' + s + "fn-" + p + '">'),
            this.lineEndingIfNeeded(),
            this.tag(
              u[d].replace(/<\/p>(?:\r?\n|\r)?$/, function (C) {
                return ((A = !0), " " + S + C);
              }),
            ),
            A || (this.lineEndingIfNeeded(), this.tag(S)),
            this.lineEndingIfNeeded(),
            this.tag("</li>"));
        }
        o.length > 0 &&
          (this.lineEndingIfNeeded(),
          this.tag("</ol>"),
          this.lineEndingIfNeeded(),
          this.tag("</section>"));
      },
    },
  };
}
function $5() {
  return {
    enter: {
      strikethrough() {
        this.tag("<del>");
      },
    },
    exit: {
      strikethrough() {
        this.tag("</del>");
      },
    },
  };
}
function V5(t) {
  let n = {}.singleTilde;
  const r = { name: "strikethrough", tokenize: a, resolveAll: i };
  return (
    n == null && (n = !0),
    {
      text: { 126: r },
      insideSpan: { null: [r] },
      attentionMarkers: { null: [126] },
    }
  );
  function i(s, o) {
    let l = -1;
    for (; ++l < s.length; )
      if (
        s[l][0] === "enter" &&
        s[l][1].type === "strikethroughSequenceTemporary" &&
        s[l][1]._close
      ) {
        let u = l;
        for (; u--; )
          if (
            s[u][0] === "exit" &&
            s[u][1].type === "strikethroughSequenceTemporary" &&
            s[u][1]._open &&
            s[l][1].end.offset - s[l][1].start.offset ===
              s[u][1].end.offset - s[u][1].start.offset
          ) {
            ((s[l][1].type = "strikethroughSequence"),
              (s[u][1].type = "strikethroughSequence"));
            const h = {
                type: "strikethrough",
                start: Object.assign({}, s[u][1].start),
                end: Object.assign({}, s[l][1].end),
              },
              d = {
                type: "strikethroughText",
                start: Object.assign({}, s[u][1].end),
                end: Object.assign({}, s[l][1].start),
              },
              p = [
                ["enter", h, o],
                ["enter", s[u][1], o],
                ["exit", s[u][1], o],
                ["enter", d, o],
              ],
              m = o.parser.constructs.insideSpan.null;
            (m && Vt(p, p.length, 0, Ca(m, s.slice(u + 1, l), o)),
              Vt(p, p.length, 0, [
                ["exit", d, o],
                ["enter", s[l][1], o],
                ["exit", s[l][1], o],
                ["exit", h, o],
              ]),
              Vt(s, u - 1, l - u + 3, p),
              (l = u + p.length - 2));
            break;
          }
      }
    for (l = -1; ++l < s.length; )
      s[l][1].type === "strikethroughSequenceTemporary" &&
        (s[l][1].type = "data");
    return s;
  }
  function a(s, o, l) {
    const u = this.previous,
      h = this.events;
    let d = 0;
    return p;
    function p(y) {
      return u === 126 && h[h.length - 1][1].type !== "characterEscape"
        ? l(y)
        : (s.enter("strikethroughSequenceTemporary"), m(y));
    }
    function m(y) {
      const S = Oi(u);
      if (y === 126) return d > 1 ? l(y) : (s.consume(y), d++, m);
      if (d < 2 && !n) return l(y);
      const A = s.exit("strikethroughSequenceTemporary"),
        C = Oi(y);
      return (
        (A._open = !C || (C === 2 && !!S)),
        (A._close = !S || (S === 2 && !!C)),
        o(y)
      );
    }
  }
}
const Ho = {
  none: "",
  left: ' align="left"',
  right: ' align="right"',
  center: ' align="center"',
};
function j5() {
  return {
    enter: {
      table(t) {
        const e = t._align;
        (this.lineEndingIfNeeded(),
          this.tag("<table>"),
          this.setData("tableAlign", e));
      },
      tableBody() {
        this.tag("<tbody>");
      },
      tableData() {
        const t = this.getData("tableAlign"),
          e = this.getData("tableColumn"),
          n = Ho[t[e]];
        n === void 0
          ? this.buffer()
          : (this.lineEndingIfNeeded(), this.tag("<td" + n + ">"));
      },
      tableHead() {
        (this.lineEndingIfNeeded(), this.tag("<thead>"));
      },
      tableHeader() {
        const t = this.getData("tableAlign"),
          e = this.getData("tableColumn"),
          n = Ho[t[e]];
        (this.lineEndingIfNeeded(), this.tag("<th" + n + ">"));
      },
      tableRow() {
        (this.setData("tableColumn", 0),
          this.lineEndingIfNeeded(),
          this.tag("<tr>"));
      },
    },
    exit: {
      codeTextData(t) {
        let e = this.sliceSerialize(t);
        (this.getData("tableAlign") && (e = e.replace(/\\([\\|])/g, W5)),
          this.raw(this.encode(e)));
      },
      table() {
        (this.setData("tableAlign"),
          this.setData("slurpAllLineEndings"),
          this.lineEndingIfNeeded(),
          this.tag("</table>"));
      },
      tableBody() {
        (this.lineEndingIfNeeded(), this.tag("</tbody>"));
      },
      tableData() {
        const t = this.getData("tableAlign"),
          e = this.getData("tableColumn");
        e in t
          ? (this.tag("</td>"), this.setData("tableColumn", e + 1))
          : this.resume();
      },
      tableHead() {
        (this.lineEndingIfNeeded(), this.tag("</thead>"));
      },
      tableHeader() {
        const t = this.getData("tableColumn");
        (this.tag("</th>"), this.setData("tableColumn", t + 1));
      },
      tableRow() {
        const t = this.getData("tableAlign");
        let e = this.getData("tableColumn");
        for (; e < t.length; )
          (this.lineEndingIfNeeded(),
            this.tag("<td" + Ho[t[e]] + "></td>"),
            e++);
        (this.setData("tableColumn", e),
          this.lineEndingIfNeeded(),
          this.tag("</tr>"));
      },
    },
  };
}
function W5(t, e) {
  return e === "|" ? e : t;
}
class G5 {
  constructor() {
    this.map = [];
  }
  add(e, n, r) {
    Y5(this, e, n, r);
  }
  consume(e) {
    if (
      (this.map.sort(function (a, s) {
        return a[0] - s[0];
      }),
      this.map.length === 0)
    )
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      ((n -= 1),
        r.push(e.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]),
        (e.length = this.map[n][0]));
    (r.push(e.slice()), (e.length = 0));
    let i = r.pop();
    for (; i; ) {
      for (const a of i) e.push(a);
      i = r.pop();
    }
    this.map.length = 0;
  }
}
function Y5(t, e, n, r) {
  let i = 0;
  if (!(n === 0 && r.length === 0)) {
    for (; i < t.map.length; ) {
      if (t.map[i][0] === e) {
        ((t.map[i][1] += n), t.map[i][2].push(...r));
        return;
      }
      i += 1;
    }
    t.map.push([e, n, r]);
  }
}
function X5(t, e) {
  let n = !1;
  const r = [];
  for (; e < t.length; ) {
    const i = t[e];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" &&
          r.push(t[e + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (t[e - 1][1].type === "tableDelimiterMarker") {
          const a = r.length - 1;
          r[a] = r[a] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow") break;
    } else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    e += 1;
  }
  return r;
}
function K5() {
  return { flow: { null: { name: "table", tokenize: Q5, resolveAll: Z5 } } };
}
function Q5(t, e, n) {
  const r = this;
  let i = 0,
    a = 0,
    s;
  return o;
  function o(O) {
    let $ = r.events.length - 1;
    for (; $ > -1; ) {
      const le = r.events[$][1].type;
      if (le === "lineEnding" || le === "linePrefix") $--;
      else break;
    }
    const G = $ > -1 ? r.events[$][1].type : null,
      K = G === "tableHead" || G === "tableRow" ? x : l;
    return K === x && r.parser.lazy[r.now().line] ? n(O) : K(O);
  }
  function l(O) {
    return (t.enter("tableHead"), t.enter("tableRow"), u(O));
  }
  function u(O) {
    return (O === 124 || ((s = !0), (a += 1)), h(O));
  }
  function h(O) {
    return O === null
      ? n(O)
      : ve(O)
        ? a > 1
          ? ((a = 0),
            (r.interrupt = !0),
            t.exit("tableRow"),
            t.enter("lineEnding"),
            t.consume(O),
            t.exit("lineEnding"),
            m)
          : n(O)
        : Be(O)
          ? Ne(t, h, "whitespace")(O)
          : ((a += 1),
            s && ((s = !1), (i += 1)),
            O === 124
              ? (t.enter("tableCellDivider"),
                t.consume(O),
                t.exit("tableCellDivider"),
                (s = !0),
                h)
              : (t.enter("data"), d(O)));
  }
  function d(O) {
    return O === null || O === 124 || $e(O)
      ? (t.exit("data"), h(O))
      : (t.consume(O), O === 92 ? p : d);
  }
  function p(O) {
    return O === 92 || O === 124 ? (t.consume(O), d) : d(O);
  }
  function m(O) {
    return (
      (r.interrupt = !1),
      r.parser.lazy[r.now().line]
        ? n(O)
        : (t.enter("tableDelimiterRow"),
          (s = !1),
          Be(O)
            ? Ne(
                t,
                y,
                "linePrefix",
                r.parser.constructs.disable.null.includes("codeIndented")
                  ? void 0
                  : 4,
              )(O)
            : y(O))
    );
  }
  function y(O) {
    return O === 45 || O === 58
      ? A(O)
      : O === 124
        ? ((s = !0),
          t.enter("tableCellDivider"),
          t.consume(O),
          t.exit("tableCellDivider"),
          S)
        : E(O);
  }
  function S(O) {
    return Be(O) ? Ne(t, A, "whitespace")(O) : A(O);
  }
  function A(O) {
    return O === 58
      ? ((a += 1),
        (s = !0),
        t.enter("tableDelimiterMarker"),
        t.consume(O),
        t.exit("tableDelimiterMarker"),
        C)
      : O === 45
        ? ((a += 1), C(O))
        : O === null || ve(O)
          ? v(O)
          : E(O);
  }
  function C(O) {
    return O === 45 ? (t.enter("tableDelimiterFiller"), b(O)) : E(O);
  }
  function b(O) {
    return O === 45
      ? (t.consume(O), b)
      : O === 58
        ? ((s = !0),
          t.exit("tableDelimiterFiller"),
          t.enter("tableDelimiterMarker"),
          t.consume(O),
          t.exit("tableDelimiterMarker"),
          T)
        : (t.exit("tableDelimiterFiller"), T(O));
  }
  function T(O) {
    return Be(O) ? Ne(t, v, "whitespace")(O) : v(O);
  }
  function v(O) {
    return O === 124
      ? y(O)
      : O === null || ve(O)
        ? !s || i !== a
          ? E(O)
          : (t.exit("tableDelimiterRow"), t.exit("tableHead"), e(O))
        : E(O);
  }
  function E(O) {
    return n(O);
  }
  function x(O) {
    return (t.enter("tableRow"), _(O));
  }
  function _(O) {
    return O === 124
      ? (t.enter("tableCellDivider"),
        t.consume(O),
        t.exit("tableCellDivider"),
        _)
      : O === null || ve(O)
        ? (t.exit("tableRow"), e(O))
        : Be(O)
          ? Ne(t, _, "whitespace")(O)
          : (t.enter("data"), j(O));
  }
  function j(O) {
    return O === null || O === 124 || $e(O)
      ? (t.exit("data"), _(O))
      : (t.consume(O), O === 92 ? F : j);
  }
  function F(O) {
    return O === 92 || O === 124 ? (t.consume(O), j) : j(O);
  }
}
function Z5(t, e) {
  let n = -1,
    r = !0,
    i = 0,
    a = [0, 0, 0, 0],
    s = [0, 0, 0, 0],
    o = !1,
    l = 0,
    u,
    h,
    d;
  const p = new G5();
  for (; ++n < t.length; ) {
    const m = t[n],
      y = m[1];
    m[0] === "enter"
      ? y.type === "tableHead"
        ? ((o = !1),
          l !== 0 && (Nu(p, e, l, u, h), (h = void 0), (l = 0)),
          (u = {
            type: "table",
            start: Object.assign({}, y.start),
            end: Object.assign({}, y.end),
          }),
          p.add(n, 0, [["enter", u, e]]))
        : y.type === "tableRow" || y.type === "tableDelimiterRow"
          ? ((r = !0),
            (d = void 0),
            (a = [0, 0, 0, 0]),
            (s = [0, n + 1, 0, 0]),
            o &&
              ((o = !1),
              (h = {
                type: "tableBody",
                start: Object.assign({}, y.start),
                end: Object.assign({}, y.end),
              }),
              p.add(n, 0, [["enter", h, e]])),
            (i = y.type === "tableDelimiterRow" ? 2 : h ? 3 : 1))
          : i &&
              (y.type === "data" ||
                y.type === "tableDelimiterMarker" ||
                y.type === "tableDelimiterFiller")
            ? ((r = !1),
              s[2] === 0 &&
                (a[1] !== 0 &&
                  ((s[0] = s[1]),
                  (d = ns(p, e, a, i, void 0, d)),
                  (a = [0, 0, 0, 0])),
                (s[2] = n)))
            : y.type === "tableCellDivider" &&
              (r
                ? (r = !1)
                : (a[1] !== 0 &&
                    ((s[0] = s[1]), (d = ns(p, e, a, i, void 0, d))),
                  (a = s),
                  (s = [a[1], n, 0, 0])))
      : y.type === "tableHead"
        ? ((o = !0), (l = n))
        : y.type === "tableRow" || y.type === "tableDelimiterRow"
          ? ((l = n),
            a[1] !== 0
              ? ((s[0] = s[1]), (d = ns(p, e, a, i, n, d)))
              : s[1] !== 0 && (d = ns(p, e, s, i, n, d)),
            (i = 0))
          : i &&
            (y.type === "data" ||
              y.type === "tableDelimiterMarker" ||
              y.type === "tableDelimiterFiller") &&
            (s[3] = n);
  }
  for (
    l !== 0 && Nu(p, e, l, u, h), p.consume(e.events), n = -1;
    ++n < e.events.length;

  ) {
    const m = e.events[n];
    m[0] === "enter" &&
      m[1].type === "table" &&
      (m[1]._align = X5(e.events, n));
  }
  return t;
}
function ns(t, e, n, r, i, a) {
  const s = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData",
    o = "tableContent";
  n[0] !== 0 &&
    ((a.end = Object.assign({}, xi(e.events, n[0]))),
    t.add(n[0], 0, [["exit", a, e]]));
  const l = xi(e.events, n[1]);
  if (
    ((a = { type: s, start: Object.assign({}, l), end: Object.assign({}, l) }),
    t.add(n[1], 0, [["enter", a, e]]),
    n[2] !== 0)
  ) {
    const u = xi(e.events, n[2]),
      h = xi(e.events, n[3]),
      d = { type: o, start: Object.assign({}, u), end: Object.assign({}, h) };
    if ((t.add(n[2], 0, [["enter", d, e]]), r !== 2)) {
      const p = e.events[n[2]],
        m = e.events[n[3]];
      if (
        ((p[1].end = Object.assign({}, m[1].end)),
        (p[1].type = "chunkText"),
        (p[1].contentType = "text"),
        n[3] > n[2] + 1)
      ) {
        const y = n[2] + 1,
          S = n[3] - n[2] - 1;
        t.add(y, S, []);
      }
    }
    t.add(n[3] + 1, 0, [["exit", d, e]]);
  }
  return (
    i !== void 0 &&
      ((a.end = Object.assign({}, xi(e.events, i))),
      t.add(i, 0, [["exit", a, e]]),
      (a = void 0)),
    a
  );
}
function Nu(t, e, n, r, i) {
  const a = [],
    s = xi(e.events, n);
  (i && ((i.end = Object.assign({}, s)), a.push(["exit", i, e])),
    (r.end = Object.assign({}, s)),
    a.push(["exit", r, e]),
    t.add(n + 1, 0, a));
}
function xi(t, e) {
  const n = t[e],
    r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const gh =
    /<(\/?)(iframe|noembed|noframes|plaintext|script|style|title|textarea|xmp)(?=[\t\n\f\r />])/gi,
  J5 = new RegExp("^" + gh.source, "i");
function e3() {
  return {
    exit: {
      htmlFlowData(t) {
        Fu.call(this, t, gh);
      },
      htmlTextData(t) {
        Fu.call(this, t, J5);
      },
    },
  };
}
function Fu(t, e) {
  let n = this.sliceSerialize(t);
  (this.options.allowDangerousHtml && (n = n.replace(e, "&lt;$1$2")),
    this.raw(this.encode(n)));
}
function t3() {
  return {
    enter: {
      taskListCheck() {
        this.tag('<input type="checkbox" disabled="" ');
      },
    },
    exit: {
      taskListCheck() {
        this.tag("/>");
      },
      taskListCheckValueChecked() {
        this.tag('checked="" ');
      },
    },
  };
}
const n3 = { name: "tasklistCheck", tokenize: i3 };
function r3() {
  return { text: { 91: n3 } };
}
function i3(t, e, n) {
  const r = this;
  return i;
  function i(l) {
    return r.previous !== null || !r._gfmTasklistFirstContentOfListItem
      ? n(l)
      : (t.enter("taskListCheck"),
        t.enter("taskListCheckMarker"),
        t.consume(l),
        t.exit("taskListCheckMarker"),
        a);
  }
  function a(l) {
    return $e(l)
      ? (t.enter("taskListCheckValueUnchecked"),
        t.consume(l),
        t.exit("taskListCheckValueUnchecked"),
        s)
      : l === 88 || l === 120
        ? (t.enter("taskListCheckValueChecked"),
          t.consume(l),
          t.exit("taskListCheckValueChecked"),
          s)
        : n(l);
  }
  function s(l) {
    return l === 93
      ? (t.enter("taskListCheckMarker"),
        t.consume(l),
        t.exit("taskListCheckMarker"),
        t.exit("taskListCheck"),
        o)
      : n(l);
  }
  function o(l) {
    return ve(l) ? e(l) : Be(l) ? t.check({ tokenize: a3 }, e, n)(l) : n(l);
  }
}
function a3(t, e, n) {
  return Ne(t, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : e(i);
  }
}
function _u(t) {
  return id([v5(), D5(), V5(), K5(), r3()]);
}
function Ou(t) {
  return ad([E5(), U5(), $5(), j5(), e3(), t3()]);
}
function Bu() {
  return {
    enter: {
      marked() {
        this.tag("<mark>");
      },
    },
    exit: {
      marked() {
        this.tag("</mark>");
      },
    },
  };
}
const rs = { equalsTo: 61 },
  Ru = { attentionSideAfter: 2 },
  Pu = { data: "data", characterEscape: "characterEscape" };
function Hu(t) {
  let n = {}.singleTilde;
  const r = { tokenize: a, resolveAll: i };
  return (
    n == null && (n = !1),
    {
      text: { [rs.equalsTo]: r },
      insideSpan: { null: [r] },
      attentionMarkers: { null: [rs.equalsTo] },
    }
  );
  function i(s, o) {
    let l = -1;
    for (; ++l < s.length; )
      if (
        s[l][0] === "enter" &&
        s[l][1].type === "markedSequenceTemporary" &&
        s[l][1]._close
      ) {
        let u = l;
        for (; u--; )
          if (
            s[u][0] === "exit" &&
            s[u][1].type === "markedSequenceTemporary" &&
            s[u][1]._open &&
            s[l][1].end.offset - s[l][1].start.offset ===
              s[u][1].end.offset - s[u][1].start.offset
          ) {
            ((s[l][1].type = "markedSequence"),
              (s[u][1].type = "markedSequence"));
            const h = {
                type: "marked",
                start: Object.assign({}, s[u][1].start),
                end: Object.assign({}, s[l][1].end),
              },
              d = {
                type: "markedText",
                start: Object.assign({}, s[u][1].end),
                end: Object.assign({}, s[l][1].start),
              },
              p = [
                ["enter", h, o],
                ["enter", s[u][1], o],
                ["exit", s[u][1], o],
                ["enter", d, o],
              ],
              m = o.parser.constructs.insideSpan.null;
            (m && Vt(p, p.length, 0, Ca(m, s.slice(u + 1, l), o)),
              Vt(p, p.length, 0, [
                ["exit", d, o],
                ["enter", s[l][1], o],
                ["exit", s[l][1], o],
                ["exit", h, o],
              ]),
              Vt(s, u - 1, l - u + 3, p),
              (l = u + p.length - 2));
            break;
          }
      }
    for (l = -1; ++l < s.length; )
      s[l][1].type === "markedSequenceTemporary" && (s[l][1].type = Pu.data);
    return s;
  }
  function a(s, o, l) {
    const u = this.previous,
      h = this.events;
    let d = 0;
    return p;
    function p(y) {
      return u === rs.equalsTo && h[h.length - 1][1].type !== Pu.characterEscape
        ? l(y)
        : (s.enter("markedSequenceTemporary"), m(y));
    }
    function m(y) {
      const S = Oi(u);
      if (y === rs.equalsTo) return d > 1 ? l(y) : (s.consume(y), d++, m);
      if (d < 2 && !n) return l(y);
      const A = s.exit("markedSequenceTemporary"),
        C = Oi(y);
      return (
        (A._open = !C || (C === Ru.attentionSideAfter && !!S)),
        (A._close = !S || (S === Ru.attentionSideAfter && !!C)),
        o(y)
      );
    }
  }
}
function U0(t, e, n, r, i, a, s, o, l, u, h, d, p, m, y) {
  let S, A;
  return C;
  function C(R) {
    return (t.enter(r), t.enter(i), t.consume(R), t.exit(i), b);
  }
  function b(R) {
    return R === 35
      ? ((S = s), T(R))
      : R === 46
        ? ((S = o), T(R))
        : R === 58 || R === 95 || Nt(R)
          ? (t.enter(a), t.enter(l), t.consume(R), x)
          : y && Be(R)
            ? Ne(t, b, "whitespace")(R)
            : !y && $e(R)
              ? br(t, b)(R)
              : le(R);
  }
  function T(R) {
    const he = S + "Marker";
    return (t.enter(a), t.enter(S), t.enter(he), t.consume(R), t.exit(he), v);
  }
  function v(R) {
    if (
      R === null ||
      R === 34 ||
      R === 35 ||
      R === 39 ||
      R === 46 ||
      R === 60 ||
      R === 61 ||
      R === 62 ||
      R === 96 ||
      R === 125 ||
      $e(R)
    )
      return n(R);
    const he = S + "Value";
    return (t.enter(he), t.consume(R), E);
  }
  function E(R) {
    if (
      R === null ||
      R === 34 ||
      R === 39 ||
      R === 60 ||
      R === 61 ||
      R === 62 ||
      R === 96
    )
      return n(R);
    if (R === 35 || R === 46 || R === 125 || $e(R)) {
      const he = S + "Value";
      return (t.exit(he), t.exit(S), t.exit(a), b(R));
    }
    return (t.consume(R), E);
  }
  function x(R) {
    return R === 45 || R === 46 || R === 58 || R === 95 || zt(R)
      ? (t.consume(R), x)
      : (t.exit(l),
        y && Be(R)
          ? Ne(t, _, "whitespace")(R)
          : !y && $e(R)
            ? br(t, _)(R)
            : _(R));
  }
  function _(R) {
    return R === 61
      ? (t.enter(u), t.consume(R), t.exit(u), j)
      : (t.exit(a), b(R));
  }
  function j(R) {
    return R === null ||
      R === 60 ||
      R === 61 ||
      R === 62 ||
      R === 96 ||
      R === 125 ||
      (y && ve(R))
      ? n(R)
      : R === 34 || R === 39
        ? (t.enter(h), t.enter(p), t.consume(R), t.exit(p), (A = R), O)
        : y && Be(R)
          ? Ne(t, j, "whitespace")(R)
          : !y && $e(R)
            ? br(t, j)(R)
            : (t.enter(d), t.enter(m), t.consume(R), (A = void 0), F);
  }
  function F(R) {
    return R === null ||
      R === 34 ||
      R === 39 ||
      R === 60 ||
      R === 61 ||
      R === 62 ||
      R === 96
      ? n(R)
      : R === 125 || $e(R)
        ? (t.exit(m), t.exit(d), t.exit(a), b(R))
        : (t.consume(R), F);
  }
  function O(R) {
    return R === A
      ? (t.enter(p), t.consume(R), t.exit(p), t.exit(h), t.exit(a), K)
      : (t.enter(d), $(R));
  }
  function $(R) {
    return R === A
      ? (t.exit(d), O(R))
      : R === null
        ? n(R)
        : ve(R)
          ? y
            ? n(R)
            : br(t, $)(R)
          : (t.enter(m), t.consume(R), G);
  }
  function G(R) {
    return R === A || R === null || ve(R)
      ? (t.exit(m), $(R))
      : (t.consume(R), G);
  }
  function K(R) {
    return R === 125 || $e(R) ? b(R) : le(R);
  }
  function le(R) {
    return R === 125
      ? (t.enter(i), t.consume(R), t.exit(i), t.exit(r), e)
      : n(R);
  }
}
function $0(t, e, n, r, i, a, s) {
  let o = 0,
    l = 0,
    u;
  return h;
  function h(A) {
    return (t.enter(r), t.enter(i), t.consume(A), t.exit(i), d);
  }
  function d(A) {
    return A === 93
      ? (t.enter(i), t.consume(A), t.exit(i), t.exit(r), e)
      : (t.enter(a), p(A));
  }
  function p(A) {
    if (A === 93 && !l) return S(A);
    const C = t.enter("chunkText", { contentType: "text", previous: u });
    return (u && (u.next = C), (u = C), m(A));
  }
  function m(A) {
    return A === null || o > 999 || (A === 91 && ++l > 32)
      ? n(A)
      : A === 93 && !l--
        ? (t.exit("chunkText"), S(A))
        : ve(A)
          ? s
            ? n(A)
            : (t.consume(A), t.exit("chunkText"), p)
          : (t.consume(A), A === 92 ? y : m);
  }
  function y(A) {
    return A === 91 || A === 92 || A === 93 ? (t.consume(A), o++, m) : m(A);
  }
  function S(A) {
    return (t.exit(a), t.enter(i), t.consume(A), t.exit(i), t.exit(r), e);
  }
}
function V0(t, e, n, r) {
  const i = this;
  return a;
  function a(o) {
    return Nt(o) ? (t.enter(r), t.consume(o), s) : n(o);
  }
  function s(o) {
    return o === 45 || o === 95 || zt(o)
      ? (t.consume(o), s)
      : (t.exit(r), i.previous === 45 || i.previous === 95 ? n(o) : e(o));
  }
}
const s3 = { tokenize: u3, concrete: !0 },
  o3 = { tokenize: c3, partial: !0 },
  l3 = { tokenize: d3, partial: !0 },
  is = { tokenize: h3, partial: !0 };
function u3(t, e, n) {
  const r = this,
    i = r.events[r.events.length - 1],
    a =
      i && i[1].type === "linePrefix"
        ? i[2].sliceSerialize(i[1], !0).length
        : 0;
  let s = 0,
    o;
  return l;
  function l(F) {
    return (
      t.enter("directiveContainer"),
      t.enter("directiveContainerFence"),
      t.enter("directiveContainerSequence"),
      u(F)
    );
  }
  function u(F) {
    return F === 58
      ? (t.consume(F), s++, u)
      : s < 3
        ? n(F)
        : (t.exit("directiveContainerSequence"),
          V0.call(r, t, h, n, "directiveContainerName")(F));
  }
  function h(F) {
    return F === 91 ? t.attempt(o3, d, d)(F) : d(F);
  }
  function d(F) {
    return F === 123 ? t.attempt(l3, p, p)(F) : p(F);
  }
  function p(F) {
    return Ne(t, m, "whitespace")(F);
  }
  function m(F) {
    return (
      t.exit("directiveContainerFence"),
      F === null
        ? _(F)
        : ve(F)
          ? r.interrupt
            ? e(F)
            : t.attempt(is, y, _)(F)
          : n(F)
    );
  }
  function y(F) {
    return F === null
      ? _(F)
      : ve(F)
        ? t.check(is, T, _)(F)
        : (t.enter("directiveContainerContent"), S(F));
  }
  function S(F) {
    return t.attempt(
      { tokenize: j, partial: !0 },
      x,
      a ? Ne(t, A, "linePrefix", a + 1) : A,
    )(F);
  }
  function A(F) {
    return F === null ? x(F) : ve(F) ? t.check(is, b, x)(F) : b(F);
  }
  function C(F) {
    if (F === null) {
      const O = t.exit("chunkDocument");
      return ((r.parser.lazy[O.start.line] = !1), x(F));
    }
    return ve(F) ? t.check(is, v, E)(F) : (t.consume(F), C);
  }
  function b(F) {
    const O = t.enter("chunkDocument", {
      contentType: "document",
      previous: o,
    });
    return (o && (o.next = O), (o = O), C(F));
  }
  function T(F) {
    return (t.enter("directiveContainerContent"), S(F));
  }
  function v(F) {
    t.consume(F);
    const O = t.exit("chunkDocument");
    return ((r.parser.lazy[O.start.line] = !1), S);
  }
  function E(F) {
    const O = t.exit("chunkDocument");
    return ((r.parser.lazy[O.start.line] = !1), x(F));
  }
  function x(F) {
    return (t.exit("directiveContainerContent"), _(F));
  }
  function _(F) {
    return (t.exit("directiveContainer"), e(F));
  }
  function j(F, O, $) {
    let G = 0;
    return Ne(
      F,
      K,
      "linePrefix",
      r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
    );
    function K(he) {
      return (
        F.enter("directiveContainerFence"),
        F.enter("directiveContainerSequence"),
        le(he)
      );
    }
    function le(he) {
      return he === 58
        ? (F.consume(he), G++, le)
        : G < s
          ? $(he)
          : (F.exit("directiveContainerSequence"), Ne(F, R, "whitespace")(he));
    }
    function R(he) {
      return he === null || ve(he)
        ? (F.exit("directiveContainerFence"), O(he))
        : $(he);
    }
  }
}
function c3(t, e, n) {
  return $0(
    t,
    e,
    n,
    "directiveContainerLabel",
    "directiveContainerLabelMarker",
    "directiveContainerLabelString",
    !0,
  );
}
function d3(t, e, n) {
  return U0(
    t,
    e,
    n,
    "directiveContainerAttributes",
    "directiveContainerAttributesMarker",
    "directiveContainerAttribute",
    "directiveContainerAttributeId",
    "directiveContainerAttributeClass",
    "directiveContainerAttributeName",
    "directiveContainerAttributeInitializerMarker",
    "directiveContainerAttributeValueLiteral",
    "directiveContainerAttributeValue",
    "directiveContainerAttributeValueMarker",
    "directiveContainerAttributeValueData",
    !0,
  );
}
function h3(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), a);
  }
  function a(s) {
    return r.parser.lazy[r.now().line] ? n(s) : e(s);
  }
}
const f3 = { tokenize: g3 },
  m3 = { tokenize: v3, partial: !0 },
  p3 = { tokenize: b3, partial: !0 };
function g3(t, e, n) {
  const r = this;
  return i;
  function i(h) {
    return (
      t.enter("directiveLeaf"),
      t.enter("directiveLeafSequence"),
      t.consume(h),
      a
    );
  }
  function a(h) {
    return h === 58
      ? (t.consume(h),
        t.exit("directiveLeafSequence"),
        V0.call(r, t, s, n, "directiveLeafName"))
      : n(h);
  }
  function s(h) {
    return h === 91 ? t.attempt(m3, o, o)(h) : o(h);
  }
  function o(h) {
    return h === 123 ? t.attempt(p3, l, l)(h) : l(h);
  }
  function l(h) {
    return Ne(t, u, "whitespace")(h);
  }
  function u(h) {
    return h === null || ve(h) ? (t.exit("directiveLeaf"), e(h)) : n(h);
  }
}
function v3(t, e, n) {
  return $0(
    t,
    e,
    n,
    "directiveLeafLabel",
    "directiveLeafLabelMarker",
    "directiveLeafLabelString",
    !0,
  );
}
function b3(t, e, n) {
  return U0(
    t,
    e,
    n,
    "directiveLeafAttributes",
    "directiveLeafAttributesMarker",
    "directiveLeafAttribute",
    "directiveLeafAttributeId",
    "directiveLeafAttributeClass",
    "directiveLeafAttributeName",
    "directiveLeafAttributeInitializerMarker",
    "directiveLeafAttributeValueLiteral",
    "directiveLeafAttributeValue",
    "directiveLeafAttributeValueMarker",
    "directiveLeafAttributeValueData",
    !0,
  );
}
const y3 = { tokenize: S3, previous: k3 },
  w3 = { tokenize: A3, partial: !0 },
  x3 = { tokenize: T3, partial: !0 };
function k3(t) {
  return (
    t !== 58 ||
    this.events[this.events.length - 1][1].type === "characterEscape"
  );
}
function S3(t, e, n) {
  const r = this;
  return i;
  function i(l) {
    return (
      t.enter("directiveText"),
      t.enter("directiveTextMarker"),
      t.consume(l),
      t.exit("directiveTextMarker"),
      V0.call(r, t, a, n, "directiveTextName")
    );
  }
  function a(l) {
    return l === 58 ? n(l) : l === 91 ? t.attempt(w3, s, s)(l) : s(l);
  }
  function s(l) {
    return l === 123 ? t.attempt(x3, o, o)(l) : o(l);
  }
  function o(l) {
    return (t.exit("directiveText"), e(l));
  }
}
function A3(t, e, n) {
  return $0(
    t,
    e,
    n,
    "directiveTextLabel",
    "directiveTextLabelMarker",
    "directiveTextLabelString",
  );
}
function T3(t, e, n) {
  return U0(
    t,
    e,
    n,
    "directiveTextAttributes",
    "directiveTextAttributesMarker",
    "directiveTextAttribute",
    "directiveTextAttributeId",
    "directiveTextAttributeClass",
    "directiveTextAttributeName",
    "directiveTextAttributeInitializerMarker",
    "directiveTextAttributeValueLiteral",
    "directiveTextAttributeValue",
    "directiveTextAttributeValueMarker",
    "directiveTextAttributeValueData",
  );
}
function qu() {
  return { text: { 58: y3 }, flow: { 58: [s3, f3] } };
}
const E3 = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml",
  ],
  Uu = {
    0: "�",
    128: "€",
    130: "‚",
    131: "ƒ",
    132: "„",
    133: "…",
    134: "†",
    135: "‡",
    136: "ˆ",
    137: "‰",
    138: "Š",
    139: "‹",
    140: "Œ",
    142: "Ž",
    145: "‘",
    146: "’",
    147: "“",
    148: "”",
    149: "•",
    150: "–",
    151: "—",
    152: "˜",
    153: "™",
    154: "š",
    155: "›",
    156: "œ",
    158: "ž",
    159: "Ÿ",
  };
function vh(t) {
  const e = typeof t == "string" ? t.charCodeAt(0) : t;
  return e >= 48 && e <= 57;
}
function C3(t) {
  const e = typeof t == "string" ? t.charCodeAt(0) : t;
  return (e >= 97 && e <= 102) || (e >= 65 && e <= 70) || (e >= 48 && e <= 57);
}
function L3(t) {
  const e = typeof t == "string" ? t.charCodeAt(0) : t;
  return (e >= 97 && e <= 122) || (e >= 65 && e <= 90);
}
function $u(t) {
  return L3(t) || vh(t);
}
const M3 = [
  "",
  "Named character references must be terminated by a semicolon",
  "Numeric character references must be terminated by a semicolon",
  "Named character references cannot be empty",
  "Numeric character references cannot be empty",
  "Named character references must be known",
  "Numeric character references cannot be disallowed",
  "Numeric character references cannot be outside the permissible Unicode range",
];
function qo(t, e) {
  const n = e || {},
    r =
      typeof n.additional == "string"
        ? n.additional.charCodeAt(0)
        : n.additional,
    i = [];
  let a = 0,
    s = -1,
    o = "",
    l,
    u;
  n.position &&
    ("start" in n.position || "indent" in n.position
      ? ((u = n.position.indent), (l = n.position.start))
      : (l = n.position));
  let h = (l ? l.line : 0) || 1,
    d = (l ? l.column : 0) || 1,
    p = y(),
    m;
  for (a--; ++a <= t.length; )
    if (
      (m === 10 && (d = (u ? u[s] : 0) || 1), (m = t.charCodeAt(a)), m === 38)
    ) {
      const C = t.charCodeAt(a + 1);
      if (
        C === 9 ||
        C === 10 ||
        C === 12 ||
        C === 32 ||
        C === 38 ||
        C === 60 ||
        Number.isNaN(C) ||
        (r && C === r)
      ) {
        ((o += String.fromCharCode(m)), d++);
        continue;
      }
      const b = a + 1;
      let T = b,
        v = b,
        E;
      if (C === 35) {
        v = ++T;
        const K = t.charCodeAt(v);
        K === 88 || K === 120
          ? ((E = "hexadecimal"), (v = ++T))
          : (E = "decimal");
      } else E = "named";
      let x = "",
        _ = "",
        j = "";
      const F = E === "named" ? $u : E === "decimal" ? vh : C3;
      for (v--; ++v <= t.length; ) {
        const K = t.charCodeAt(v);
        if (!F(K)) break;
        ((j += String.fromCharCode(K)),
          E === "named" && E3.includes(j) && ((x = j), (_ = Ds(j))));
      }
      let O = t.charCodeAt(v) === 59;
      if (O) {
        v++;
        const K = E === "named" ? Ds(j) : !1;
        K && ((x = j), (_ = K));
      }
      let $ = 1 + v - b,
        G = "";
      if (!(!O && n.nonTerminated === !1))
        if (!j) E !== "named" && S(4, $);
        else if (E === "named") {
          if (O && !_) S(5, 1);
          else if (
            (x !== j && ((v = T + x.length), ($ = 1 + v - T), (O = !1)), !O)
          ) {
            const K = x ? 1 : 3;
            if (n.attribute) {
              const le = t.charCodeAt(v);
              le === 61 ? (S(K, $), (_ = "")) : $u(le) ? (_ = "") : S(K, $);
            } else S(K, $);
          }
          G = _;
        } else {
          O || S(2, $);
          let K = Number.parseInt(j, E === "hexadecimal" ? 16 : 10);
          if (z3(K)) (S(7, $), (G = "�"));
          else if (K in Uu) (S(6, $), (G = Uu[K]));
          else {
            let le = "";
            (D3(K) && S(6, $),
              K > 65535 &&
                ((K -= 65536),
                (le += String.fromCharCode((K >>> 10) | 55296)),
                (K = 56320 | (K & 1023))),
              (G = le + String.fromCharCode(K)));
          }
        }
      if (G) {
        (A(), (p = y()), (a = v - 1), (d += v - b + 1), i.push(G));
        const K = y();
        (K.offset++,
          n.reference &&
            n.reference.call(
              n.referenceContext || void 0,
              G,
              { start: p, end: K },
              t.slice(b - 1, v),
            ),
          (p = K));
      } else ((j = t.slice(b - 1, v)), (o += j), (d += j.length), (a = v - 1));
    } else
      (m === 10 && (h++, s++, (d = 0)),
        Number.isNaN(m) ? A() : ((o += String.fromCharCode(m)), d++));
  return i.join("");
  function y() {
    return { line: h, column: d, offset: a + ((l ? l.offset : 0) || 0) };
  }
  function S(C, b) {
    let T;
    n.warning &&
      ((T = y()),
      (T.column += b),
      (T.offset += b),
      n.warning.call(n.warningContext || void 0, M3[C], T, C));
  }
  function A() {
    o &&
      (i.push(o),
      n.text && n.text.call(n.textContext || void 0, o, { start: p, end: y() }),
      (o = ""));
  }
}
function z3(t) {
  return (t >= 55296 && t <= 57343) || t > 1114111;
}
function D3(t) {
  return (
    (t >= 1 && t <= 8) ||
    t === 11 ||
    (t >= 13 && t <= 31) ||
    (t >= 127 && t <= 159) ||
    (t >= 64976 && t <= 65007) ||
    (t & 65535) === 65535 ||
    (t & 65535) === 65534
  );
}
const Vu = {}.hasOwnProperty;
function ju(t) {
  const e = t || {};
  return {
    enter: {
      directiveContainer() {
        n.call(this, "containerDirective");
      },
      directiveContainerAttributes: s,
      directiveContainerLabel: i,
      directiveContainerContent() {
        this.buffer();
      },
      directiveLeaf() {
        n.call(this, "leafDirective");
      },
      directiveLeafAttributes: s,
      directiveLeafLabel: i,
      directiveText() {
        n.call(this, "textDirective");
      },
      directiveTextAttributes: s,
      directiveTextLabel: i,
    },
    exit: {
      directiveContainer: y,
      directiveContainerAttributeClassValue: l,
      directiveContainerAttributeIdValue: o,
      directiveContainerAttributeName: u,
      directiveContainerAttributeValue: h,
      directiveContainerAttributes: d,
      directiveContainerContent: p,
      directiveContainerFence: m,
      directiveContainerLabel: a,
      directiveContainerName: r,
      directiveLeaf: y,
      directiveLeafAttributeClassValue: l,
      directiveLeafAttributeIdValue: o,
      directiveLeafAttributeName: u,
      directiveLeafAttributeValue: h,
      directiveLeafAttributes: d,
      directiveLeafLabel: a,
      directiveLeafName: r,
      directiveText: y,
      directiveTextAttributeClassValue: l,
      directiveTextAttributeIdValue: o,
      directiveTextAttributeName: u,
      directiveTextAttributeValue: h,
      directiveTextAttributes: d,
      directiveTextLabel: a,
      directiveTextName: r,
    },
  };
  function n(S) {
    let A = this.getData("directiveStack");
    (A || this.setData("directiveStack", (A = [])),
      A.push({ type: S, name: "" }));
  }
  function r(S) {
    const A = this.getData("directiveStack");
    A[A.length - 1].name = this.sliceSerialize(S);
  }
  function i() {
    this.buffer();
  }
  function a() {
    const S = this.resume(),
      A = this.getData("directiveStack");
    A[A.length - 1].label = S;
  }
  function s() {
    (this.buffer(), this.setData("directiveAttributes", []));
  }
  function o(S) {
    this.getData("directiveAttributes").push([
      "id",
      qo(this.sliceSerialize(S), { attribute: !0 }),
    ]);
  }
  function l(S) {
    this.getData("directiveAttributes").push([
      "class",
      qo(this.sliceSerialize(S), { attribute: !0 }),
    ]);
  }
  function u(S) {
    this.getData("directiveAttributes").push([this.sliceSerialize(S), ""]);
  }
  function h(S) {
    const A = this.getData("directiveAttributes");
    A[A.length - 1][1] = qo(this.sliceSerialize(S), { attribute: !0 });
  }
  function d() {
    const S = this.getData("directiveStack"),
      A = this.getData("directiveAttributes"),
      C = {};
    let b = -1;
    for (; ++b < A.length; ) {
      const T = A[b];
      T[0] === "class" && C.class ? (C.class += " " + T[1]) : (C[T[0]] = T[1]);
    }
    (this.resume(),
      this.setData("directiveAttributes"),
      (S[S.length - 1].attributes = C));
  }
  function p() {
    const S = this.resume(),
      A = this.getData("directiveStack");
    A[A.length - 1].content = S;
  }
  function m() {
    const S = this.getData("directiveStack"),
      A = S[S.length - 1];
    (A._fenceCount || (A._fenceCount = 0),
      A._fenceCount++,
      A._fenceCount === 1 && this.setData("slurpOneLineEnding", !0));
  }
  function y() {
    const A = this.getData("directiveStack").pop();
    let C, b;
    (Vu.call(e, A.name) && ((b = e[A.name].call(this, A)), (C = b !== !1)),
      !C && Vu.call(e, "*") && ((b = e["*"].call(this, A)), (C = b !== !1)),
      !C &&
        A.type !== "textDirective" &&
        this.setData("slurpOneLineEnding", !0));
  }
}
function I3(t) {
  const e = { name: void 0, page: void 0, title: void 0 },
    n = /([^:|]+)(?::(\d+))?(?:\|(.+))?/,
    r = t.match(n);
  return (
    r &&
      ((e.name = r[1] || void 0),
      (e.page = parseInt(r[2]) || void 0),
      (e.title = r[3] || void 0)),
    e
  );
}
function Wu(t) {
  if (t.type !== "textDirective" || !t.label) return !1;
  (this.tag(
    `<button class = "sanctaTag" data-bookname = "Tag-Viewer" data-props = "${t.label}">`,
  ),
    this.raw(t.label),
    this.tag("</button>"));
}
function Gu(t) {
  if (t.type !== "textDirective" || !t.label) return !1;
  const { name: e, page: n, title: r } = I3(t.label);
  if (!e) return !1;
  this.tag(
    `<button class="reference" data-bookname="${e}" data-page="${n ? n - 1 : 0}">`,
  );
  let i;
  (r ? (i = r) : n ? (i = `${e} pg. ${n}`) : (i = e),
    this.raw(i || ""),
    this.tag("</button>"));
}
function Yu(t) {
  if (t.type !== "textDirective") return !1;
  this.tag(
    `<iframe class = 'directiveFrame' src = '/api/get/fdg#${qr.notesColor}-${qr.body}-${qr.mainAccent}'></iframe>`,
  );
}
let ta = {};
function Zr(t, { includeMath: e = !0, includeDirs: n = !0 } = {}) {
  if (ta[`${t}${e}${n}`]) return ta[`${t}${e}${n}`];
  let r;
  try {
    r = Xl(t, {
      extensions: [_u(), Hu(), e ? dg() : null, n ? qu() : null],
      htmlExtensions: [
        Ou(),
        Bu(),
        e ? m5() : null,
        n ? ju({ ref: Gu, fdg: Yu, tag: Wu }) : null,
      ],
    });
  } catch (i) {
    ((r = Xl(t, {
      extensions: [_u(), Hu(), n ? qu() : null],
      htmlExtensions: [
        Ou(),
        Bu(),
        n ? ju({ ref: Gu, fdg: Yu, tag: Wu }) : null,
      ],
    })),
      (r = `<div class = 'previewErr'><b>Error:</b> ${i}</div>${r}`));
  }
  return (
    Object.keys(ta).length > 99 && (ta = {}),
    (t.includes(":fdg") && t.length < 25) || (ta[`${t}${e}${n}`] = r),
    r
  );
}
function bh(t, e, n = 10) {
  return (
    (t = t.filter((r) => r !== e)),
    t.unshift(e),
    t.length > n && t.pop(),
    t
  );
}
function N3(t) {
  return new Promise((e) => setTimeout(e, t));
}
function F3(t) {
  switch (((t = parseInt(t)), t)) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${t}th`;
  }
}
function ys(
  {
    delay: t = 300,
    condition: e = !1,
    beforeTimeout: n = () => {},
    callback: r = () => {},
    afterTimeout: i = () => {},
    fallbackCondition: a = !1,
    fallback: s = () => {},
  } = {
    delay: 300,
    condition: !1,
    beforeTimeout: () => {},
    callback: () => {},
    afterTimeout: () => {},
    fallbackCondition: !1,
    fallback: () => {},
  },
) {
  e
    ? (n(),
      setTimeout(() => {
        (r(), i());
      }, t))
    : a && s();
}
function Da(t) {
  return t.split(".").pop() === "pdf" ? "[PDF]" : "![]";
}
function _3(t, e) {
  let n = 0;
  for (let r = 0, i = Math.max(t.length, e.length); r < i; r++) {
    const a = t[r] ? t[r].length : 0,
      s = e[r] ? e[r].length : 0;
    n += Math.abs(a - s);
  }
  return n;
}
function yh(t, e) {
  return (
    Array.isArray(t) &&
    Array.isArray(e) &&
    t.length === e.length &&
    t.every((n, r) => n === e[r])
  );
}
async function O3() {
  if (Ft(I.name)) notyf.error("Reserved notebooks are read only");
  else {
    const t = new FormData(myForm),
      e = await Xe.post.saveImages(t);
    if (e.ok) {
      const n = await e.json();
      (Ie.insert(`${Da(n.image)}(${n.image})`), da(), ar(), Ie.focus());
    } else notyf.error("An error occurred when saving an image");
  }
}
async function B3(t) {
  const e = await Xe.del.images(t);
  e.ok
    ? ar()
    : e.status === 403
      ? notyf.error("You don't own this image")
      : notyf.error("An error occurred when deleting an image");
}
let wh,
  ni = !1,
  xh = !1;
function j0() {
  ((ni = !0),
    Qe("autosave", !0),
    (rt("autoSaveSpinner").style.display = "inline-block"));
}
function W0() {
  ((ni = !1),
    Qe("autosave", !1),
    (rt("autoSaveSpinner").style.display = "none"));
}
function R3() {
  ni ? W0() : j0();
}
function Xu(t, e) {
  ((xh = t), (wh = e));
}
function Ri(t) {
  const e = t
      .split(
        `
`,
      )
      .filter((r) => r !== ""),
    n = kh(e[0]);
  return n.substring(0, 3) === "// " ? n.substring(3) : n || "";
}
function kh(t, e) {
  ((e = e || {}),
    (e.listUnicodeChar = e.hasOwnProperty("listUnicodeChar")
      ? e.listUnicodeChar
      : !1),
    (e.stripListLeaders = e.hasOwnProperty("stripListLeaders")
      ? e.stripListLeaders
      : !0),
    (e.gfm = e.hasOwnProperty("gfm") ? e.gfm : !0),
    (e.useImgAltText = e.hasOwnProperty("useImgAltText")
      ? e.useImgAltText
      : !0),
    (e.abbr = e.hasOwnProperty("abbr") ? e.abbr : !1),
    (e.replaceLinksWithURL = e.hasOwnProperty("replaceLinksWithURL")
      ? e.replaceLinksWithURL
      : !1),
    (e.htmlTagsToSkip = e.hasOwnProperty("htmlTagsToSkip")
      ? e.htmlTagsToSkip
      : []));
  var n = t || "";
  n = n.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*/gm, "");
  try {
    (e.stripListLeaders &&
      (e.listUnicodeChar
        ? (n = n.replace(
            /^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,
            e.listUnicodeChar + " $1",
          ))
        : (n = n.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1"))),
      e.gfm &&
        (n = n
          .replace(
            /\n={2,}/g,
            `
`,
          )
          .replace(/~{3}.*\n/g, "")
          .replace(/~~/g, "")
          .replace(/`{3}.*\n/g, "")),
      e.abbr && (n = n.replace(/\*\[.*\]:.*\n/, "")),
      (n = n.replace(/<[^>]*>/g, "")));
    var r = new RegExp("<[^>]*>", "g");
    if (e.htmlTagsToSkip.length > 0) {
      var i = "(?!" + e.htmlTagsToSkip.join("|") + ")";
      r = new RegExp("<" + i + "[^>]*>", "ig");
    }
    n = n
      .replace(r, "")
      .replace(/^[=\-]{2,}\s*$/g, "")
      .replace(/\[\^.+?\](\: .*?$)?/g, "")
      .replace(/\s{0,2}\[.*?\]: .*?$/g, "")
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, e.useImgAltText ? "$1" : "")
      .replace(
        /\[([^\]]*?)\][\[\(].*?[\]\)]/g,
        e.replaceLinksWithURL ? "$2" : "$1",
      )
      .replace(/^(\n)?\s{0,3}>\s?/gm, "$1")
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "")
      .replace(
        /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
        "$1$3$4$6",
      )
      .replace(/([\*]+)(\S)(.*?\S)??\1/g, "$2$3")
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5")
      .replace(/(`{3,})(.*?)\1/gm, "$2")
      .replace(/`(.+?)`/g, "$1")
      .replace(/~(.*?)~/g, "$1");
  } catch (a) {
    return (console.error(a), t);
  }
  return n;
}
var Si =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function Sh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
function as(t) {
  throw new Error(
    'Could not dynamically require "' +
      t +
      '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.',
  );
}
var Uo = { exports: {} };
/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/ var Ku;
function P3() {
  return (
    Ku ||
      ((Ku = 1),
      (function (t, e) {
        (function (n) {
          t.exports = n();
        })(function () {
          return (function n(r, i, a) {
            function s(u, h) {
              if (!i[u]) {
                if (!r[u]) {
                  var d = typeof as == "function" && as;
                  if (!h && d) return d(u, !0);
                  if (o) return o(u, !0);
                  var p = new Error("Cannot find module '" + u + "'");
                  throw ((p.code = "MODULE_NOT_FOUND"), p);
                }
                var m = (i[u] = { exports: {} });
                r[u][0].call(
                  m.exports,
                  function (y) {
                    var S = r[u][1][y];
                    return s(S || y);
                  },
                  m,
                  m.exports,
                  n,
                  r,
                  i,
                  a,
                );
              }
              return i[u].exports;
            }
            for (
              var o = typeof as == "function" && as, l = 0;
              l < a.length;
              l++
            )
              s(a[l]);
            return s;
          })(
            {
              1: [
                function (n, r, i) {
                  (function (a) {
                    var s = a.MutationObserver || a.WebKitMutationObserver,
                      o;
                    if (s) {
                      var l = 0,
                        u = new s(y),
                        h = a.document.createTextNode("");
                      (u.observe(h, { characterData: !0 }),
                        (o = function () {
                          h.data = l = ++l % 2;
                        }));
                    } else if (
                      !a.setImmediate &&
                      typeof a.MessageChannel < "u"
                    ) {
                      var d = new a.MessageChannel();
                      ((d.port1.onmessage = y),
                        (o = function () {
                          d.port2.postMessage(0);
                        }));
                    } else
                      "document" in a &&
                      "onreadystatechange" in a.document.createElement("script")
                        ? (o = function () {
                            var A = a.document.createElement("script");
                            ((A.onreadystatechange = function () {
                              (y(),
                                (A.onreadystatechange = null),
                                A.parentNode.removeChild(A),
                                (A = null));
                            }),
                              a.document.documentElement.appendChild(A));
                          })
                        : (o = function () {
                            setTimeout(y, 0);
                          });
                    var p,
                      m = [];
                    function y() {
                      p = !0;
                      for (var A, C, b = m.length; b; ) {
                        for (C = m, m = [], A = -1; ++A < b; ) C[A]();
                        b = m.length;
                      }
                      p = !1;
                    }
                    r.exports = S;
                    function S(A) {
                      m.push(A) === 1 && !p && o();
                    }
                  }).call(
                    this,
                    typeof Si < "u"
                      ? Si
                      : typeof self < "u"
                        ? self
                        : typeof window < "u"
                          ? window
                          : {},
                  );
                },
                {},
              ],
              2: [
                function (n, r, i) {
                  var a = n(1);
                  function s() {}
                  var o = {},
                    l = ["REJECTED"],
                    u = ["FULFILLED"],
                    h = ["PENDING"];
                  r.exports = d;
                  function d(E) {
                    if (typeof E != "function")
                      throw new TypeError("resolver must be a function");
                    ((this.state = h),
                      (this.queue = []),
                      (this.outcome = void 0),
                      E !== s && S(this, E));
                  }
                  ((d.prototype.catch = function (E) {
                    return this.then(null, E);
                  }),
                    (d.prototype.then = function (E, x) {
                      if (
                        (typeof E != "function" && this.state === u) ||
                        (typeof x != "function" && this.state === l)
                      )
                        return this;
                      var _ = new this.constructor(s);
                      if (this.state !== h) {
                        var j = this.state === u ? E : x;
                        m(_, j, this.outcome);
                      } else this.queue.push(new p(_, E, x));
                      return _;
                    }));
                  function p(E, x, _) {
                    ((this.promise = E),
                      typeof x == "function" &&
                        ((this.onFulfilled = x),
                        (this.callFulfilled = this.otherCallFulfilled)),
                      typeof _ == "function" &&
                        ((this.onRejected = _),
                        (this.callRejected = this.otherCallRejected)));
                  }
                  ((p.prototype.callFulfilled = function (E) {
                    o.resolve(this.promise, E);
                  }),
                    (p.prototype.otherCallFulfilled = function (E) {
                      m(this.promise, this.onFulfilled, E);
                    }),
                    (p.prototype.callRejected = function (E) {
                      o.reject(this.promise, E);
                    }),
                    (p.prototype.otherCallRejected = function (E) {
                      m(this.promise, this.onRejected, E);
                    }));
                  function m(E, x, _) {
                    a(function () {
                      var j;
                      try {
                        j = x(_);
                      } catch (F) {
                        return o.reject(E, F);
                      }
                      j === E
                        ? o.reject(
                            E,
                            new TypeError("Cannot resolve promise with itself"),
                          )
                        : o.resolve(E, j);
                    });
                  }
                  ((o.resolve = function (E, x) {
                    var _ = A(y, x);
                    if (_.status === "error") return o.reject(E, _.value);
                    var j = _.value;
                    if (j) S(E, j);
                    else {
                      ((E.state = u), (E.outcome = x));
                      for (var F = -1, O = E.queue.length; ++F < O; )
                        E.queue[F].callFulfilled(x);
                    }
                    return E;
                  }),
                    (o.reject = function (E, x) {
                      ((E.state = l), (E.outcome = x));
                      for (var _ = -1, j = E.queue.length; ++_ < j; )
                        E.queue[_].callRejected(x);
                      return E;
                    }));
                  function y(E) {
                    var x = E && E.then;
                    if (
                      E &&
                      (typeof E == "object" || typeof E == "function") &&
                      typeof x == "function"
                    )
                      return function () {
                        x.apply(E, arguments);
                      };
                  }
                  function S(E, x) {
                    var _ = !1;
                    function j(G) {
                      _ || ((_ = !0), o.reject(E, G));
                    }
                    function F(G) {
                      _ || ((_ = !0), o.resolve(E, G));
                    }
                    function O() {
                      x(F, j);
                    }
                    var $ = A(O);
                    $.status === "error" && j($.value);
                  }
                  function A(E, x) {
                    var _ = {};
                    try {
                      ((_.value = E(x)), (_.status = "success"));
                    } catch (j) {
                      ((_.status = "error"), (_.value = j));
                    }
                    return _;
                  }
                  d.resolve = C;
                  function C(E) {
                    return E instanceof this ? E : o.resolve(new this(s), E);
                  }
                  d.reject = b;
                  function b(E) {
                    var x = new this(s);
                    return o.reject(x, E);
                  }
                  d.all = T;
                  function T(E) {
                    var x = this;
                    if (Object.prototype.toString.call(E) !== "[object Array]")
                      return this.reject(new TypeError("must be an array"));
                    var _ = E.length,
                      j = !1;
                    if (!_) return this.resolve([]);
                    for (
                      var F = new Array(_), O = 0, $ = -1, G = new this(s);
                      ++$ < _;

                    )
                      K(E[$], $);
                    return G;
                    function K(le, R) {
                      x.resolve(le).then(he, function (ee) {
                        j || ((j = !0), o.reject(G, ee));
                      });
                      function he(ee) {
                        ((F[R] = ee),
                          ++O === _ && !j && ((j = !0), o.resolve(G, F)));
                      }
                    }
                  }
                  d.race = v;
                  function v(E) {
                    var x = this;
                    if (Object.prototype.toString.call(E) !== "[object Array]")
                      return this.reject(new TypeError("must be an array"));
                    var _ = E.length,
                      j = !1;
                    if (!_) return this.resolve([]);
                    for (var F = -1, O = new this(s); ++F < _; ) $(E[F]);
                    return O;
                    function $(G) {
                      x.resolve(G).then(
                        function (K) {
                          j || ((j = !0), o.resolve(O, K));
                        },
                        function (K) {
                          j || ((j = !0), o.reject(O, K));
                        },
                      );
                    }
                  }
                },
                { 1: 1 },
              ],
              3: [
                function (n, r, i) {
                  (function (a) {
                    typeof a.Promise != "function" && (a.Promise = n(2));
                  }).call(
                    this,
                    typeof Si < "u"
                      ? Si
                      : typeof self < "u"
                        ? self
                        : typeof window < "u"
                          ? window
                          : {},
                  );
                },
                { 2: 2 },
              ],
              4: [
                function (n, r, i) {
                  var a =
                    typeof Symbol == "function" &&
                    typeof Symbol.iterator == "symbol"
                      ? function (k) {
                          return typeof k;
                        }
                      : function (k) {
                          return k &&
                            typeof Symbol == "function" &&
                            k.constructor === Symbol &&
                            k !== Symbol.prototype
                            ? "symbol"
                            : typeof k;
                        };
                  function s(k, B) {
                    if (!(k instanceof B))
                      throw new TypeError("Cannot call a class as a function");
                  }
                  function o() {
                    try {
                      if (typeof indexedDB < "u") return indexedDB;
                      if (typeof webkitIndexedDB < "u") return webkitIndexedDB;
                      if (typeof mozIndexedDB < "u") return mozIndexedDB;
                      if (typeof OIndexedDB < "u") return OIndexedDB;
                      if (typeof msIndexedDB < "u") return msIndexedDB;
                    } catch {
                      return;
                    }
                  }
                  var l = o();
                  function u() {
                    try {
                      if (!l || !l.open) return !1;
                      var k =
                          typeof openDatabase < "u" &&
                          /(Safari|iPhone|iPad|iPod)/.test(
                            navigator.userAgent,
                          ) &&
                          !/Chrome/.test(navigator.userAgent) &&
                          !/BlackBerry/.test(navigator.platform),
                        B =
                          typeof fetch == "function" &&
                          fetch.toString().indexOf("[native code") !== -1;
                      return (
                        (!k || B) &&
                        typeof indexedDB < "u" &&
                        typeof IDBKeyRange < "u"
                      );
                    } catch {
                      return !1;
                    }
                  }
                  function h(k, B) {
                    ((k = k || []), (B = B || {}));
                    try {
                      return new Blob(k, B);
                    } catch (q) {
                      if (q.name !== "TypeError") throw q;
                      for (
                        var L =
                            typeof BlobBuilder < "u"
                              ? BlobBuilder
                              : typeof MSBlobBuilder < "u"
                                ? MSBlobBuilder
                                : typeof MozBlobBuilder < "u"
                                  ? MozBlobBuilder
                                  : WebKitBlobBuilder,
                          U = new L(),
                          V = 0;
                        V < k.length;
                        V += 1
                      )
                        U.append(k[V]);
                      return U.getBlob(B.type);
                    }
                  }
                  typeof Promise > "u" && n(3);
                  var d = Promise;
                  function p(k, B) {
                    B &&
                      k.then(
                        function (L) {
                          B(null, L);
                        },
                        function (L) {
                          B(L);
                        },
                      );
                  }
                  function m(k, B, L) {
                    (typeof B == "function" && k.then(B),
                      typeof L == "function" && k.catch(L));
                  }
                  function y(k) {
                    return (
                      typeof k != "string" &&
                        (console.warn(
                          k + " used as a key, but it is not a string.",
                        ),
                        (k = String(k))),
                      k
                    );
                  }
                  function S() {
                    if (
                      arguments.length &&
                      typeof arguments[arguments.length - 1] == "function"
                    )
                      return arguments[arguments.length - 1];
                  }
                  var A = "local-forage-detect-blob-support",
                    C = void 0,
                    b = {},
                    T = Object.prototype.toString,
                    v = "readonly",
                    E = "readwrite";
                  function x(k) {
                    for (
                      var B = k.length,
                        L = new ArrayBuffer(B),
                        U = new Uint8Array(L),
                        V = 0;
                      V < B;
                      V++
                    )
                      U[V] = k.charCodeAt(V);
                    return L;
                  }
                  function _(k) {
                    return new d(function (B) {
                      var L = k.transaction(A, E),
                        U = h([""]);
                      (L.objectStore(A).put(U, "key"),
                        (L.onabort = function (V) {
                          (V.preventDefault(), V.stopPropagation(), B(!1));
                        }),
                        (L.oncomplete = function () {
                          var V = navigator.userAgent.match(/Chrome\/(\d+)/),
                            q = navigator.userAgent.match(/Edge\//);
                          B(q || !V || parseInt(V[1], 10) >= 43);
                        }));
                    }).catch(function () {
                      return !1;
                    });
                  }
                  function j(k) {
                    return typeof C == "boolean"
                      ? d.resolve(C)
                      : _(k).then(function (B) {
                          return ((C = B), C);
                        });
                  }
                  function F(k) {
                    var B = b[k.name],
                      L = {};
                    ((L.promise = new d(function (U, V) {
                      ((L.resolve = U), (L.reject = V));
                    })),
                      B.deferredOperations.push(L),
                      B.dbReady
                        ? (B.dbReady = B.dbReady.then(function () {
                            return L.promise;
                          }))
                        : (B.dbReady = L.promise));
                  }
                  function O(k) {
                    var B = b[k.name],
                      L = B.deferredOperations.pop();
                    if (L) return (L.resolve(), L.promise);
                  }
                  function $(k, B) {
                    var L = b[k.name],
                      U = L.deferredOperations.pop();
                    if (U) return (U.reject(B), U.promise);
                  }
                  function G(k, B) {
                    return new d(function (L, U) {
                      if (((b[k.name] = b[k.name] || xe()), k.db))
                        if (B) (F(k), k.db.close());
                        else return L(k.db);
                      var V = [k.name];
                      B && V.push(k.version);
                      var q = l.open.apply(l, V);
                      (B &&
                        (q.onupgradeneeded = function (X) {
                          var te = q.result;
                          try {
                            (te.createObjectStore(k.storeName),
                              X.oldVersion <= 1 && te.createObjectStore(A));
                          } catch (se) {
                            if (se.name === "ConstraintError")
                              console.warn(
                                'The database "' +
                                  k.name +
                                  '" has been upgraded from version ' +
                                  X.oldVersion +
                                  " to version " +
                                  X.newVersion +
                                  ', but the storage "' +
                                  k.storeName +
                                  '" already exists.',
                              );
                            else throw se;
                          }
                        }),
                        (q.onerror = function (X) {
                          (X.preventDefault(), U(q.error));
                        }),
                        (q.onsuccess = function () {
                          var X = q.result;
                          ((X.onversionchange = function (te) {
                            te.target.close();
                          }),
                            L(X),
                            O(k));
                        }));
                    });
                  }
                  function K(k) {
                    return G(k, !1);
                  }
                  function le(k) {
                    return G(k, !0);
                  }
                  function R(k, B) {
                    if (!k.db) return !0;
                    var L = !k.db.objectStoreNames.contains(k.storeName),
                      U = k.version < k.db.version,
                      V = k.version > k.db.version;
                    if (
                      (U &&
                        (k.version !== B &&
                          console.warn(
                            'The database "' +
                              k.name +
                              `" can't be downgraded from version ` +
                              k.db.version +
                              " to version " +
                              k.version +
                              ".",
                          ),
                        (k.version = k.db.version)),
                      V || L)
                    ) {
                      if (L) {
                        var q = k.db.version + 1;
                        q > k.version && (k.version = q);
                      }
                      return !0;
                    }
                    return !1;
                  }
                  function he(k) {
                    return new d(function (B, L) {
                      var U = new FileReader();
                      ((U.onerror = L),
                        (U.onloadend = function (V) {
                          var q = btoa(V.target.result || "");
                          B({
                            __local_forage_encoded_blob: !0,
                            data: q,
                            type: k.type,
                          });
                        }),
                        U.readAsBinaryString(k));
                    });
                  }
                  function ee(k) {
                    var B = x(atob(k.data));
                    return h([B], { type: k.type });
                  }
                  function Z(k) {
                    return k && k.__local_forage_encoded_blob;
                  }
                  function fe(k) {
                    var B = this,
                      L = B._initReady().then(function () {
                        var U = b[B._dbInfo.name];
                        if (U && U.dbReady) return U.dbReady;
                      });
                    return (m(L, k, k), L);
                  }
                  function M(k) {
                    F(k);
                    for (
                      var B = b[k.name], L = B.forages, U = 0;
                      U < L.length;
                      U++
                    ) {
                      var V = L[U];
                      V._dbInfo.db &&
                        (V._dbInfo.db.close(), (V._dbInfo.db = null));
                    }
                    return (
                      (k.db = null),
                      K(k)
                        .then(function (q) {
                          return ((k.db = q), R(k) ? le(k) : q);
                        })
                        .then(function (q) {
                          k.db = B.db = q;
                          for (var X = 0; X < L.length; X++)
                            L[X]._dbInfo.db = q;
                        })
                        .catch(function (q) {
                          throw ($(k, q), q);
                        })
                    );
                  }
                  function ne(k, B, L, U) {
                    U === void 0 && (U = 1);
                    try {
                      var V = k.db.transaction(k.storeName, B);
                      L(null, V);
                    } catch (q) {
                      if (
                        U > 0 &&
                        (!k.db ||
                          q.name === "InvalidStateError" ||
                          q.name === "NotFoundError")
                      )
                        return d
                          .resolve()
                          .then(function () {
                            if (
                              !k.db ||
                              (q.name === "NotFoundError" &&
                                !k.db.objectStoreNames.contains(k.storeName) &&
                                k.version <= k.db.version)
                            )
                              return (
                                k.db && (k.version = k.db.version + 1),
                                le(k)
                              );
                          })
                          .then(function () {
                            return M(k).then(function () {
                              ne(k, B, L, U - 1);
                            });
                          })
                          .catch(L);
                      L(q);
                    }
                  }
                  function xe() {
                    return {
                      forages: [],
                      db: null,
                      dbReady: null,
                      deferredOperations: [],
                    };
                  }
                  function z(k) {
                    var B = this,
                      L = { db: null };
                    if (k) for (var U in k) L[U] = k[U];
                    var V = b[L.name];
                    (V || ((V = xe()), (b[L.name] = V)),
                      V.forages.push(B),
                      B._initReady ||
                        ((B._initReady = B.ready), (B.ready = fe)));
                    var q = [];
                    function X() {
                      return d.resolve();
                    }
                    for (var te = 0; te < V.forages.length; te++) {
                      var se = V.forages[te];
                      se !== B && q.push(se._initReady().catch(X));
                    }
                    var oe = V.forages.slice(0);
                    return d
                      .all(q)
                      .then(function () {
                        return ((L.db = V.db), K(L));
                      })
                      .then(function (ue) {
                        return (
                          (L.db = ue),
                          R(L, B._defaultConfig.version) ? le(L) : ue
                        );
                      })
                      .then(function (ue) {
                        ((L.db = V.db = ue), (B._dbInfo = L));
                        for (var Se = 0; Se < oe.length; Se++) {
                          var He = oe[Se];
                          He !== B &&
                            ((He._dbInfo.db = L.db),
                            (He._dbInfo.version = L.version));
                        }
                      });
                  }
                  function De(k, B) {
                    var L = this;
                    k = y(k);
                    var U = new d(function (V, q) {
                      L.ready()
                        .then(function () {
                          ne(L._dbInfo, v, function (X, te) {
                            if (X) return q(X);
                            try {
                              var se = te.objectStore(L._dbInfo.storeName),
                                oe = se.get(k);
                              ((oe.onsuccess = function () {
                                var ue = oe.result;
                                (ue === void 0 && (ue = null),
                                  Z(ue) && (ue = ee(ue)),
                                  V(ue));
                              }),
                                (oe.onerror = function () {
                                  q(oe.error);
                                }));
                            } catch (ue) {
                              q(ue);
                            }
                          });
                        })
                        .catch(q);
                    });
                    return (p(U, B), U);
                  }
                  function ke(k, B) {
                    var L = this,
                      U = new d(function (V, q) {
                        L.ready()
                          .then(function () {
                            ne(L._dbInfo, v, function (X, te) {
                              if (X) return q(X);
                              try {
                                var se = te.objectStore(L._dbInfo.storeName),
                                  oe = se.openCursor(),
                                  ue = 1;
                                ((oe.onsuccess = function () {
                                  var Se = oe.result;
                                  if (Se) {
                                    var He = Se.value;
                                    Z(He) && (He = ee(He));
                                    var Ge = k(He, Se.key, ue++);
                                    Ge !== void 0 ? V(Ge) : Se.continue();
                                  } else V();
                                }),
                                  (oe.onerror = function () {
                                    q(oe.error);
                                  }));
                              } catch (Se) {
                                q(Se);
                              }
                            });
                          })
                          .catch(q);
                      });
                    return (p(U, B), U);
                  }
                  function Ce(k, B, L) {
                    var U = this;
                    k = y(k);
                    var V = new d(function (q, X) {
                      var te;
                      U.ready()
                        .then(function () {
                          return (
                            (te = U._dbInfo),
                            T.call(B) === "[object Blob]"
                              ? j(te.db).then(function (se) {
                                  return se ? B : he(B);
                                })
                              : B
                          );
                        })
                        .then(function (se) {
                          ne(U._dbInfo, E, function (oe, ue) {
                            if (oe) return X(oe);
                            try {
                              var Se = ue.objectStore(U._dbInfo.storeName);
                              se === null && (se = void 0);
                              var He = Se.put(se, k);
                              ((ue.oncomplete = function () {
                                (se === void 0 && (se = null), q(se));
                              }),
                                (ue.onabort = ue.onerror =
                                  function () {
                                    var Ge = He.error
                                      ? He.error
                                      : He.transaction.error;
                                    X(Ge);
                                  }));
                            } catch (Ge) {
                              X(Ge);
                            }
                          });
                        })
                        .catch(X);
                    });
                    return (p(V, L), V);
                  }
                  function Ue(k, B) {
                    var L = this;
                    k = y(k);
                    var U = new d(function (V, q) {
                      L.ready()
                        .then(function () {
                          ne(L._dbInfo, E, function (X, te) {
                            if (X) return q(X);
                            try {
                              var se = te.objectStore(L._dbInfo.storeName),
                                oe = se.delete(k);
                              ((te.oncomplete = function () {
                                V();
                              }),
                                (te.onerror = function () {
                                  q(oe.error);
                                }),
                                (te.onabort = function () {
                                  var ue = oe.error
                                    ? oe.error
                                    : oe.transaction.error;
                                  q(ue);
                                }));
                            } catch (ue) {
                              q(ue);
                            }
                          });
                        })
                        .catch(q);
                    });
                    return (p(U, B), U);
                  }
                  function Fe(k) {
                    var B = this,
                      L = new d(function (U, V) {
                        B.ready()
                          .then(function () {
                            ne(B._dbInfo, E, function (q, X) {
                              if (q) return V(q);
                              try {
                                var te = X.objectStore(B._dbInfo.storeName),
                                  se = te.clear();
                                ((X.oncomplete = function () {
                                  U();
                                }),
                                  (X.onabort = X.onerror =
                                    function () {
                                      var oe = se.error
                                        ? se.error
                                        : se.transaction.error;
                                      V(oe);
                                    }));
                              } catch (oe) {
                                V(oe);
                              }
                            });
                          })
                          .catch(V);
                      });
                    return (p(L, k), L);
                  }
                  function We(k) {
                    var B = this,
                      L = new d(function (U, V) {
                        B.ready()
                          .then(function () {
                            ne(B._dbInfo, v, function (q, X) {
                              if (q) return V(q);
                              try {
                                var te = X.objectStore(B._dbInfo.storeName),
                                  se = te.count();
                                ((se.onsuccess = function () {
                                  U(se.result);
                                }),
                                  (se.onerror = function () {
                                    V(se.error);
                                  }));
                              } catch (oe) {
                                V(oe);
                              }
                            });
                          })
                          .catch(V);
                      });
                    return (p(L, k), L);
                  }
                  function je(k, B) {
                    var L = this,
                      U = new d(function (V, q) {
                        if (k < 0) {
                          V(null);
                          return;
                        }
                        L.ready()
                          .then(function () {
                            ne(L._dbInfo, v, function (X, te) {
                              if (X) return q(X);
                              try {
                                var se = te.objectStore(L._dbInfo.storeName),
                                  oe = !1,
                                  ue = se.openKeyCursor();
                                ((ue.onsuccess = function () {
                                  var Se = ue.result;
                                  if (!Se) {
                                    V(null);
                                    return;
                                  }
                                  k === 0 || oe
                                    ? V(Se.key)
                                    : ((oe = !0), Se.advance(k));
                                }),
                                  (ue.onerror = function () {
                                    q(ue.error);
                                  }));
                              } catch (Se) {
                                q(Se);
                              }
                            });
                          })
                          .catch(q);
                      });
                    return (p(U, B), U);
                  }
                  function lt(k) {
                    var B = this,
                      L = new d(function (U, V) {
                        B.ready()
                          .then(function () {
                            ne(B._dbInfo, v, function (q, X) {
                              if (q) return V(q);
                              try {
                                var te = X.objectStore(B._dbInfo.storeName),
                                  se = te.openKeyCursor(),
                                  oe = [];
                                ((se.onsuccess = function () {
                                  var ue = se.result;
                                  if (!ue) {
                                    U(oe);
                                    return;
                                  }
                                  (oe.push(ue.key), ue.continue());
                                }),
                                  (se.onerror = function () {
                                    V(se.error);
                                  }));
                              } catch (ue) {
                                V(ue);
                              }
                            });
                          })
                          .catch(V);
                      });
                    return (p(L, k), L);
                  }
                  function Et(k, B) {
                    B = S.apply(this, arguments);
                    var L = this.config();
                    ((k = (typeof k != "function" && k) || {}),
                      k.name ||
                        ((k.name = k.name || L.name),
                        (k.storeName = k.storeName || L.storeName)));
                    var U = this,
                      V;
                    if (!k.name) V = d.reject("Invalid arguments");
                    else {
                      var q = k.name === L.name && U._dbInfo.db,
                        X = q
                          ? d.resolve(U._dbInfo.db)
                          : K(k).then(function (te) {
                              var se = b[k.name],
                                oe = se.forages;
                              se.db = te;
                              for (var ue = 0; ue < oe.length; ue++)
                                oe[ue]._dbInfo.db = te;
                              return te;
                            });
                      k.storeName
                        ? (V = X.then(function (te) {
                            if (te.objectStoreNames.contains(k.storeName)) {
                              var se = te.version + 1;
                              F(k);
                              var oe = b[k.name],
                                ue = oe.forages;
                              te.close();
                              for (var Se = 0; Se < ue.length; Se++) {
                                var He = ue[Se];
                                ((He._dbInfo.db = null),
                                  (He._dbInfo.version = se));
                              }
                              var Ge = new d(function (Ye, At) {
                                var gt = l.open(k.name, se);
                                ((gt.onerror = function (Cn) {
                                  var Wi = gt.result;
                                  (Wi.close(), At(Cn));
                                }),
                                  (gt.onupgradeneeded = function () {
                                    var Cn = gt.result;
                                    Cn.deleteObjectStore(k.storeName);
                                  }),
                                  (gt.onsuccess = function () {
                                    var Cn = gt.result;
                                    (Cn.close(), Ye(Cn));
                                  }));
                              });
                              return Ge.then(function (Ye) {
                                oe.db = Ye;
                                for (var At = 0; At < ue.length; At++) {
                                  var gt = ue[At];
                                  ((gt._dbInfo.db = Ye), O(gt._dbInfo));
                                }
                              }).catch(function (Ye) {
                                throw (
                                  ($(k, Ye) || d.resolve()).catch(
                                    function () {},
                                  ),
                                  Ye
                                );
                              });
                            }
                          }))
                        : (V = X.then(function (te) {
                            F(k);
                            var se = b[k.name],
                              oe = se.forages;
                            te.close();
                            for (var ue = 0; ue < oe.length; ue++) {
                              var Se = oe[ue];
                              Se._dbInfo.db = null;
                            }
                            var He = new d(function (Ge, Ye) {
                              var At = l.deleteDatabase(k.name);
                              ((At.onerror = function () {
                                var gt = At.result;
                                (gt && gt.close(), Ye(At.error));
                              }),
                                (At.onblocked = function () {
                                  console.warn(
                                    'dropInstance blocked for database "' +
                                      k.name +
                                      '" until all open connections are closed',
                                  );
                                }),
                                (At.onsuccess = function () {
                                  var gt = At.result;
                                  (gt && gt.close(), Ge(gt));
                                }));
                            });
                            return He.then(function (Ge) {
                              se.db = Ge;
                              for (var Ye = 0; Ye < oe.length; Ye++) {
                                var At = oe[Ye];
                                O(At._dbInfo);
                              }
                            }).catch(function (Ge) {
                              throw (
                                ($(k, Ge) || d.resolve()).catch(function () {}),
                                Ge
                              );
                            });
                          }));
                    }
                    return (p(V, B), V);
                  }
                  var ht = {
                    _driver: "asyncStorage",
                    _initStorage: z,
                    _support: u(),
                    iterate: ke,
                    getItem: De,
                    setItem: Ce,
                    removeItem: Ue,
                    clear: Fe,
                    length: We,
                    key: je,
                    keys: lt,
                    dropInstance: Et,
                  };
                  function wt() {
                    return typeof openDatabase == "function";
                  }
                  var ut =
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                    _t = "~~local_forage_type~",
                    ft = /^~~local_forage_type~([^~]+)~/,
                    mt = "__lfsc__:",
                    xt = mt.length,
                    Mt = "arbf",
                    Dt = "blob",
                    xn = "si08",
                    Ot = "ui08",
                    Bt = "uic8",
                    Rt = "si16",
                    Pt = "si32",
                    Ht = "ur16",
                    kn = "ui32",
                    cr = "fl32",
                    Hn = "fl64",
                    dr = xt + Mt.length,
                    Sn = Object.prototype.toString;
                  function An(k) {
                    var B = k.length * 0.75,
                      L = k.length,
                      U,
                      V = 0,
                      q,
                      X,
                      te,
                      se;
                    k[k.length - 1] === "=" &&
                      (B--, k[k.length - 2] === "=" && B--);
                    var oe = new ArrayBuffer(B),
                      ue = new Uint8Array(oe);
                    for (U = 0; U < L; U += 4)
                      ((q = ut.indexOf(k[U])),
                        (X = ut.indexOf(k[U + 1])),
                        (te = ut.indexOf(k[U + 2])),
                        (se = ut.indexOf(k[U + 3])),
                        (ue[V++] = (q << 2) | (X >> 4)),
                        (ue[V++] = ((X & 15) << 4) | (te >> 2)),
                        (ue[V++] = ((te & 3) << 6) | (se & 63)));
                    return oe;
                  }
                  function Y(k) {
                    var B = new Uint8Array(k),
                      L = "",
                      U;
                    for (U = 0; U < B.length; U += 3)
                      ((L += ut[B[U] >> 2]),
                        (L += ut[((B[U] & 3) << 4) | (B[U + 1] >> 4)]),
                        (L += ut[((B[U + 1] & 15) << 2) | (B[U + 2] >> 6)]),
                        (L += ut[B[U + 2] & 63]));
                    return (
                      B.length % 3 === 2
                        ? (L = L.substring(0, L.length - 1) + "=")
                        : B.length % 3 === 1 &&
                          (L = L.substring(0, L.length - 2) + "=="),
                      L
                    );
                  }
                  function pe(k, B) {
                    var L = "";
                    if (
                      (k && (L = Sn.call(k)),
                      k &&
                        (L === "[object ArrayBuffer]" ||
                          (k.buffer &&
                            Sn.call(k.buffer) === "[object ArrayBuffer]")))
                    ) {
                      var U,
                        V = mt;
                      (k instanceof ArrayBuffer
                        ? ((U = k), (V += Mt))
                        : ((U = k.buffer),
                          L === "[object Int8Array]"
                            ? (V += xn)
                            : L === "[object Uint8Array]"
                              ? (V += Ot)
                              : L === "[object Uint8ClampedArray]"
                                ? (V += Bt)
                                : L === "[object Int16Array]"
                                  ? (V += Rt)
                                  : L === "[object Uint16Array]"
                                    ? (V += Ht)
                                    : L === "[object Int32Array]"
                                      ? (V += Pt)
                                      : L === "[object Uint32Array]"
                                        ? (V += kn)
                                        : L === "[object Float32Array]"
                                          ? (V += cr)
                                          : L === "[object Float64Array]"
                                            ? (V += Hn)
                                            : B(
                                                new Error(
                                                  "Failed to get type for BinaryArray",
                                                ),
                                              )),
                        B(V + Y(U)));
                    } else if (L === "[object Blob]") {
                      var q = new FileReader();
                      ((q.onload = function () {
                        var X = _t + k.type + "~" + Y(this.result);
                        B(mt + Dt + X);
                      }),
                        q.readAsArrayBuffer(k));
                    } else
                      try {
                        B(JSON.stringify(k));
                      } catch (X) {
                        (console.error(
                          "Couldn't convert value into a JSON string: ",
                          k,
                        ),
                          B(null, X));
                      }
                  }
                  function Te(k) {
                    if (k.substring(0, xt) !== mt) return JSON.parse(k);
                    var B = k.substring(dr),
                      L = k.substring(xt, dr),
                      U;
                    if (L === Dt && ft.test(B)) {
                      var V = B.match(ft);
                      ((U = V[1]), (B = B.substring(V[0].length)));
                    }
                    var q = An(B);
                    switch (L) {
                      case Mt:
                        return q;
                      case Dt:
                        return h([q], { type: U });
                      case xn:
                        return new Int8Array(q);
                      case Ot:
                        return new Uint8Array(q);
                      case Bt:
                        return new Uint8ClampedArray(q);
                      case Rt:
                        return new Int16Array(q);
                      case Ht:
                        return new Uint16Array(q);
                      case Pt:
                        return new Int32Array(q);
                      case kn:
                        return new Uint32Array(q);
                      case cr:
                        return new Float32Array(q);
                      case Hn:
                        return new Float64Array(q);
                      default:
                        throw new Error("Unkown type: " + L);
                    }
                  }
                  var Re = {
                    serialize: pe,
                    deserialize: Te,
                    stringToBuffer: An,
                    bufferToString: Y,
                  };
                  function Oe(k, B, L, U) {
                    k.executeSql(
                      "CREATE TABLE IF NOT EXISTS " +
                        B.storeName +
                        " (id INTEGER PRIMARY KEY, key unique, value)",
                      [],
                      L,
                      U,
                    );
                  }
                  function it(k) {
                    var B = this,
                      L = { db: null };
                    if (k)
                      for (var U in k)
                        L[U] = typeof k[U] != "string" ? k[U].toString() : k[U];
                    var V = new d(function (q, X) {
                      try {
                        L.db = openDatabase(
                          L.name,
                          String(L.version),
                          L.description,
                          L.size,
                        );
                      } catch (te) {
                        return X(te);
                      }
                      L.db.transaction(function (te) {
                        Oe(
                          te,
                          L,
                          function () {
                            ((B._dbInfo = L), q());
                          },
                          function (se, oe) {
                            X(oe);
                          },
                        );
                      }, X);
                    });
                    return ((L.serializer = Re), V);
                  }
                  function Ke(k, B, L, U, V, q) {
                    k.executeSql(
                      L,
                      U,
                      V,
                      function (X, te) {
                        te.code === te.SYNTAX_ERR
                          ? X.executeSql(
                              "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
                              [B.storeName],
                              function (se, oe) {
                                oe.rows.length
                                  ? q(se, te)
                                  : Oe(
                                      se,
                                      B,
                                      function () {
                                        se.executeSql(L, U, V, q);
                                      },
                                      q,
                                    );
                              },
                              q,
                            )
                          : q(X, te);
                      },
                      q,
                    );
                  }
                  function fn(k, B) {
                    var L = this;
                    k = y(k);
                    var U = new d(function (V, q) {
                      L.ready()
                        .then(function () {
                          var X = L._dbInfo;
                          X.db.transaction(function (te) {
                            Ke(
                              te,
                              X,
                              "SELECT * FROM " +
                                X.storeName +
                                " WHERE key = ? LIMIT 1",
                              [k],
                              function (se, oe) {
                                var ue = oe.rows.length
                                  ? oe.rows.item(0).value
                                  : null;
                                (ue && (ue = X.serializer.deserialize(ue)),
                                  V(ue));
                              },
                              function (se, oe) {
                                q(oe);
                              },
                            );
                          });
                        })
                        .catch(q);
                    });
                    return (p(U, B), U);
                  }
                  function Tn(k, B) {
                    var L = this,
                      U = new d(function (V, q) {
                        L.ready()
                          .then(function () {
                            var X = L._dbInfo;
                            X.db.transaction(function (te) {
                              Ke(
                                te,
                                X,
                                "SELECT * FROM " + X.storeName,
                                [],
                                function (se, oe) {
                                  for (
                                    var ue = oe.rows, Se = ue.length, He = 0;
                                    He < Se;
                                    He++
                                  ) {
                                    var Ge = ue.item(He),
                                      Ye = Ge.value;
                                    if (
                                      (Ye &&
                                        (Ye = X.serializer.deserialize(Ye)),
                                      (Ye = k(Ye, Ge.key, He + 1)),
                                      Ye !== void 0)
                                    ) {
                                      V(Ye);
                                      return;
                                    }
                                  }
                                  V();
                                },
                                function (se, oe) {
                                  q(oe);
                                },
                              );
                            });
                          })
                          .catch(q);
                      });
                    return (p(U, B), U);
                  }
                  function nn(k, B, L, U) {
                    var V = this;
                    k = y(k);
                    var q = new d(function (X, te) {
                      V.ready()
                        .then(function () {
                          B === void 0 && (B = null);
                          var se = B,
                            oe = V._dbInfo;
                          oe.serializer.serialize(B, function (ue, Se) {
                            Se
                              ? te(Se)
                              : oe.db.transaction(
                                  function (He) {
                                    Ke(
                                      He,
                                      oe,
                                      "INSERT OR REPLACE INTO " +
                                        oe.storeName +
                                        " (key, value) VALUES (?, ?)",
                                      [k, ue],
                                      function () {
                                        X(se);
                                      },
                                      function (Ge, Ye) {
                                        te(Ye);
                                      },
                                    );
                                  },
                                  function (He) {
                                    if (He.code === He.QUOTA_ERR) {
                                      if (U > 0) {
                                        X(nn.apply(V, [k, se, L, U - 1]));
                                        return;
                                      }
                                      te(He);
                                    }
                                  },
                                );
                          });
                        })
                        .catch(te);
                    });
                    return (p(q, L), q);
                  }
                  function hr(k, B, L) {
                    return nn.apply(this, [k, B, L, 1]);
                  }
                  function Q(k, B) {
                    var L = this;
                    k = y(k);
                    var U = new d(function (V, q) {
                      L.ready()
                        .then(function () {
                          var X = L._dbInfo;
                          X.db.transaction(function (te) {
                            Ke(
                              te,
                              X,
                              "DELETE FROM " + X.storeName + " WHERE key = ?",
                              [k],
                              function () {
                                V();
                              },
                              function (se, oe) {
                                q(oe);
                              },
                            );
                          });
                        })
                        .catch(q);
                    });
                    return (p(U, B), U);
                  }
                  function ge(k) {
                    var B = this,
                      L = new d(function (U, V) {
                        B.ready()
                          .then(function () {
                            var q = B._dbInfo;
                            q.db.transaction(function (X) {
                              Ke(
                                X,
                                q,
                                "DELETE FROM " + q.storeName,
                                [],
                                function () {
                                  U();
                                },
                                function (te, se) {
                                  V(se);
                                },
                              );
                            });
                          })
                          .catch(V);
                      });
                    return (p(L, k), L);
                  }
                  function ct(k) {
                    var B = this,
                      L = new d(function (U, V) {
                        B.ready()
                          .then(function () {
                            var q = B._dbInfo;
                            q.db.transaction(function (X) {
                              Ke(
                                X,
                                q,
                                "SELECT COUNT(key) as c FROM " + q.storeName,
                                [],
                                function (te, se) {
                                  var oe = se.rows.item(0).c;
                                  U(oe);
                                },
                                function (te, se) {
                                  V(se);
                                },
                              );
                            });
                          })
                          .catch(V);
                      });
                    return (p(L, k), L);
                  }
                  function kt(k, B) {
                    var L = this,
                      U = new d(function (V, q) {
                        L.ready()
                          .then(function () {
                            var X = L._dbInfo;
                            X.db.transaction(function (te) {
                              Ke(
                                te,
                                X,
                                "SELECT key FROM " +
                                  X.storeName +
                                  " WHERE id = ? LIMIT 1",
                                [k + 1],
                                function (se, oe) {
                                  var ue = oe.rows.length
                                    ? oe.rows.item(0).key
                                    : null;
                                  V(ue);
                                },
                                function (se, oe) {
                                  q(oe);
                                },
                              );
                            });
                          })
                          .catch(q);
                      });
                    return (p(U, B), U);
                  }
                  function pt(k) {
                    var B = this,
                      L = new d(function (U, V) {
                        B.ready()
                          .then(function () {
                            var q = B._dbInfo;
                            q.db.transaction(function (X) {
                              Ke(
                                X,
                                q,
                                "SELECT key FROM " + q.storeName,
                                [],
                                function (te, se) {
                                  for (
                                    var oe = [], ue = 0;
                                    ue < se.rows.length;
                                    ue++
                                  )
                                    oe.push(se.rows.item(ue).key);
                                  U(oe);
                                },
                                function (te, se) {
                                  V(se);
                                },
                              );
                            });
                          })
                          .catch(V);
                      });
                    return (p(L, k), L);
                  }
                  function rn(k) {
                    return new d(function (B, L) {
                      k.transaction(
                        function (U) {
                          U.executeSql(
                            "SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",
                            [],
                            function (V, q) {
                              for (var X = [], te = 0; te < q.rows.length; te++)
                                X.push(q.rows.item(te).name);
                              B({ db: k, storeNames: X });
                            },
                            function (V, q) {
                              L(q);
                            },
                          );
                        },
                        function (U) {
                          L(U);
                        },
                      );
                    });
                  }
                  function jt(k, B) {
                    B = S.apply(this, arguments);
                    var L = this.config();
                    ((k = (typeof k != "function" && k) || {}),
                      k.name ||
                        ((k.name = k.name || L.name),
                        (k.storeName = k.storeName || L.storeName)));
                    var U = this,
                      V;
                    return (
                      k.name
                        ? (V = new d(function (q) {
                            var X;
                            (k.name === L.name
                              ? (X = U._dbInfo.db)
                              : (X = openDatabase(k.name, "", "", 0)),
                              k.storeName
                                ? q({ db: X, storeNames: [k.storeName] })
                                : q(rn(X)));
                          }).then(function (q) {
                            return new d(function (X, te) {
                              q.db.transaction(
                                function (se) {
                                  function oe(Ge) {
                                    return new d(function (Ye, At) {
                                      se.executeSql(
                                        "DROP TABLE IF EXISTS " + Ge,
                                        [],
                                        function () {
                                          Ye();
                                        },
                                        function (gt, Cn) {
                                          At(Cn);
                                        },
                                      );
                                    });
                                  }
                                  for (
                                    var ue = [],
                                      Se = 0,
                                      He = q.storeNames.length;
                                    Se < He;
                                    Se++
                                  )
                                    ue.push(oe(q.storeNames[Se]));
                                  d.all(ue)
                                    .then(function () {
                                      X();
                                    })
                                    .catch(function (Ge) {
                                      te(Ge);
                                    });
                                },
                                function (se) {
                                  te(se);
                                },
                              );
                            });
                          }))
                        : (V = d.reject("Invalid arguments")),
                      p(V, B),
                      V
                    );
                  }
                  var pi = {
                    _driver: "webSQLStorage",
                    _initStorage: it,
                    _support: wt(),
                    iterate: Tn,
                    getItem: fn,
                    setItem: hr,
                    removeItem: Q,
                    clear: ge,
                    length: ct,
                    key: kt,
                    keys: pt,
                    dropInstance: jt,
                  };
                  function Wt() {
                    try {
                      return (
                        typeof localStorage < "u" &&
                        "setItem" in localStorage &&
                        !!localStorage.setItem
                      );
                    } catch {
                      return !1;
                    }
                  }
                  function En(k, B) {
                    var L = k.name + "/";
                    return (
                      k.storeName !== B.storeName && (L += k.storeName + "/"),
                      L
                    );
                  }
                  function Ia() {
                    var k = "_localforage_support_test";
                    try {
                      return (
                        localStorage.setItem(k, !0),
                        localStorage.removeItem(k),
                        !1
                      );
                    } catch {
                      return !0;
                    }
                  }
                  function Na() {
                    return !Ia() || localStorage.length > 0;
                  }
                  function ji(k) {
                    var B = this,
                      L = {};
                    if (k) for (var U in k) L[U] = k[U];
                    return (
                      (L.keyPrefix = En(k, B._defaultConfig)),
                      Na()
                        ? ((B._dbInfo = L), (L.serializer = Re), d.resolve())
                        : d.reject()
                    );
                  }
                  function Fa(k) {
                    var B = this,
                      L = B.ready().then(function () {
                        for (
                          var U = B._dbInfo.keyPrefix,
                            V = localStorage.length - 1;
                          V >= 0;
                          V--
                        ) {
                          var q = localStorage.key(V);
                          q.indexOf(U) === 0 && localStorage.removeItem(q);
                        }
                      });
                    return (p(L, k), L);
                  }
                  function qn(k, B) {
                    var L = this;
                    k = y(k);
                    var U = L.ready().then(function () {
                      var V = L._dbInfo,
                        q = localStorage.getItem(V.keyPrefix + k);
                      return (q && (q = V.serializer.deserialize(q)), q);
                    });
                    return (p(U, B), U);
                  }
                  function _a(k, B) {
                    var L = this,
                      U = L.ready().then(function () {
                        for (
                          var V = L._dbInfo,
                            q = V.keyPrefix,
                            X = q.length,
                            te = localStorage.length,
                            se = 1,
                            oe = 0;
                          oe < te;
                          oe++
                        ) {
                          var ue = localStorage.key(oe);
                          if (ue.indexOf(q) === 0) {
                            var Se = localStorage.getItem(ue);
                            if (
                              (Se && (Se = V.serializer.deserialize(Se)),
                              (Se = k(Se, ue.substring(X), se++)),
                              Se !== void 0)
                            )
                              return Se;
                          }
                        }
                      });
                    return (p(U, B), U);
                  }
                  function Oa(k, B) {
                    var L = this,
                      U = L.ready().then(function () {
                        var V = L._dbInfo,
                          q;
                        try {
                          q = localStorage.key(k);
                        } catch {
                          q = null;
                        }
                        return (q && (q = q.substring(V.keyPrefix.length)), q);
                      });
                    return (p(U, B), U);
                  }
                  function Ba(k) {
                    var B = this,
                      L = B.ready().then(function () {
                        for (
                          var U = B._dbInfo,
                            V = localStorage.length,
                            q = [],
                            X = 0;
                          X < V;
                          X++
                        ) {
                          var te = localStorage.key(X);
                          te.indexOf(U.keyPrefix) === 0 &&
                            q.push(te.substring(U.keyPrefix.length));
                        }
                        return q;
                      });
                    return (p(L, k), L);
                  }
                  function Ra(k) {
                    var B = this,
                      L = B.keys().then(function (U) {
                        return U.length;
                      });
                    return (p(L, k), L);
                  }
                  function oo(k, B) {
                    var L = this;
                    k = y(k);
                    var U = L.ready().then(function () {
                      var V = L._dbInfo;
                      localStorage.removeItem(V.keyPrefix + k);
                    });
                    return (p(U, B), U);
                  }
                  function Ae(k, B, L) {
                    var U = this;
                    k = y(k);
                    var V = U.ready().then(function () {
                      B === void 0 && (B = null);
                      var q = B;
                      return new d(function (X, te) {
                        var se = U._dbInfo;
                        se.serializer.serialize(B, function (oe, ue) {
                          if (ue) te(ue);
                          else
                            try {
                              (localStorage.setItem(se.keyPrefix + k, oe),
                                X(q));
                            } catch (Se) {
                              ((Se.name === "QuotaExceededError" ||
                                Se.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
                                te(Se),
                                te(Se));
                            }
                        });
                      });
                    });
                    return (p(V, L), V);
                  }
                  function H(k, B) {
                    if (
                      ((B = S.apply(this, arguments)),
                      (k = (typeof k != "function" && k) || {}),
                      !k.name)
                    ) {
                      var L = this.config();
                      ((k.name = k.name || L.name),
                        (k.storeName = k.storeName || L.storeName));
                    }
                    var U = this,
                      V;
                    return (
                      k.name
                        ? (V = new d(function (q) {
                            k.storeName
                              ? q(En(k, U._defaultConfig))
                              : q(k.name + "/");
                          }).then(function (q) {
                            for (var X = localStorage.length - 1; X >= 0; X--) {
                              var te = localStorage.key(X);
                              te.indexOf(q) === 0 &&
                                localStorage.removeItem(te);
                            }
                          }))
                        : (V = d.reject("Invalid arguments")),
                      p(V, B),
                      V
                    );
                  }
                  var ie = {
                      _driver: "localStorageWrapper",
                      _initStorage: ji,
                      _support: Wt(),
                      iterate: _a,
                      getItem: qn,
                      setItem: Ae,
                      removeItem: oo,
                      clear: Fa,
                      length: Ra,
                      key: Oa,
                      keys: Ba,
                      dropInstance: H,
                    },
                    we = function (B, L) {
                      return (
                        B === L ||
                        (typeof B == "number" &&
                          typeof L == "number" &&
                          isNaN(B) &&
                          isNaN(L))
                      );
                    },
                    Je = function (B, L) {
                      for (var U = B.length, V = 0; V < U; ) {
                        if (we(B[V], L)) return !0;
                        V++;
                      }
                      return !1;
                    },
                    Ct =
                      Array.isArray ||
                      function (k) {
                        return (
                          Object.prototype.toString.call(k) === "[object Array]"
                        );
                      },
                    nt = {},
                    It = {},
                    qt = { INDEXEDDB: ht, WEBSQL: pi, LOCALSTORAGE: ie },
                    ri = [
                      qt.INDEXEDDB._driver,
                      qt.WEBSQL._driver,
                      qt.LOCALSTORAGE._driver,
                    ],
                    Lr = ["dropInstance"],
                    St = [
                      "clear",
                      "getItem",
                      "iterate",
                      "key",
                      "keys",
                      "length",
                      "removeItem",
                      "setItem",
                    ].concat(Lr),
                    Pa = {
                      description: "",
                      driver: ri.slice(),
                      name: "localforage",
                      size: 4980736,
                      storeName: "keyvaluepairs",
                      version: 1,
                    };
                  function Ha(k, B) {
                    k[B] = function () {
                      var L = arguments;
                      return k.ready().then(function () {
                        return k[B].apply(k, L);
                      });
                    };
                  }
                  function lo() {
                    for (var k = 1; k < arguments.length; k++) {
                      var B = arguments[k];
                      if (B)
                        for (var L in B)
                          B.hasOwnProperty(L) &&
                            (Ct(B[L])
                              ? (arguments[0][L] = B[L].slice())
                              : (arguments[0][L] = B[L]));
                    }
                    return arguments[0];
                  }
                  var Kh = (function () {
                      function k(B) {
                        s(this, k);
                        for (var L in qt)
                          if (qt.hasOwnProperty(L)) {
                            var U = qt[L],
                              V = U._driver;
                            ((this[L] = V), nt[V] || this.defineDriver(U));
                          }
                        ((this._defaultConfig = lo({}, Pa)),
                          (this._config = lo({}, this._defaultConfig, B)),
                          (this._driverSet = null),
                          (this._initDriver = null),
                          (this._ready = !1),
                          (this._dbInfo = null),
                          this._wrapLibraryMethodsWithReady(),
                          this.setDriver(this._config.driver).catch(
                            function () {},
                          ));
                      }
                      return (
                        (k.prototype.config = function (L) {
                          if (
                            (typeof L > "u" ? "undefined" : a(L)) === "object"
                          ) {
                            if (this._ready)
                              return new Error(
                                "Can't call config() after localforage has been used.",
                              );
                            for (var U in L) {
                              if (
                                (U === "storeName" &&
                                  (L[U] = L[U].replace(/\W/g, "_")),
                                U === "version" && typeof L[U] != "number")
                              )
                                return new Error(
                                  "Database version must be a number.",
                                );
                              this._config[U] = L[U];
                            }
                            return "driver" in L && L.driver
                              ? this.setDriver(this._config.driver)
                              : !0;
                          } else
                            return typeof L == "string"
                              ? this._config[L]
                              : this._config;
                        }),
                        (k.prototype.defineDriver = function (L, U, V) {
                          var q = new d(function (X, te) {
                            try {
                              var se = L._driver,
                                oe = new Error(
                                  "Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver",
                                );
                              if (!L._driver) {
                                te(oe);
                                return;
                              }
                              for (
                                var ue = St.concat("_initStorage"),
                                  Se = 0,
                                  He = ue.length;
                                Se < He;
                                Se++
                              ) {
                                var Ge = ue[Se],
                                  Ye = !Je(Lr, Ge);
                                if (
                                  (Ye || L[Ge]) &&
                                  typeof L[Ge] != "function"
                                ) {
                                  te(oe);
                                  return;
                                }
                              }
                              var At = function () {
                                for (
                                  var Wi = function (Jh) {
                                      return function () {
                                        var ef = new Error(
                                            "Method " +
                                              Jh +
                                              " is not implemented by the current driver",
                                          ),
                                          el = d.reject(ef);
                                        return (
                                          p(
                                            el,
                                            arguments[arguments.length - 1],
                                          ),
                                          el
                                        );
                                      };
                                    },
                                    uo = 0,
                                    Zh = Lr.length;
                                  uo < Zh;
                                  uo++
                                ) {
                                  var co = Lr[uo];
                                  L[co] || (L[co] = Wi(co));
                                }
                              };
                              At();
                              var gt = function (Wi) {
                                (nt[se] &&
                                  console.info(
                                    "Redefining LocalForage driver: " + se,
                                  ),
                                  (nt[se] = L),
                                  (It[se] = Wi),
                                  X());
                              };
                              "_support" in L
                                ? L._support && typeof L._support == "function"
                                  ? L._support().then(gt, te)
                                  : gt(!!L._support)
                                : gt(!0);
                            } catch (Cn) {
                              te(Cn);
                            }
                          });
                          return (m(q, U, V), q);
                        }),
                        (k.prototype.driver = function () {
                          return this._driver || null;
                        }),
                        (k.prototype.getDriver = function (L, U, V) {
                          var q = nt[L]
                            ? d.resolve(nt[L])
                            : d.reject(new Error("Driver not found."));
                          return (m(q, U, V), q);
                        }),
                        (k.prototype.getSerializer = function (L) {
                          var U = d.resolve(Re);
                          return (m(U, L), U);
                        }),
                        (k.prototype.ready = function (L) {
                          var U = this,
                            V = U._driverSet.then(function () {
                              return (
                                U._ready === null &&
                                  (U._ready = U._initDriver()),
                                U._ready
                              );
                            });
                          return (m(V, L, L), V);
                        }),
                        (k.prototype.setDriver = function (L, U, V) {
                          var q = this;
                          Ct(L) || (L = [L]);
                          var X = this._getSupportedDrivers(L);
                          function te() {
                            q._config.driver = q.driver();
                          }
                          function se(Se) {
                            return (
                              q._extend(Se),
                              te(),
                              (q._ready = q._initStorage(q._config)),
                              q._ready
                            );
                          }
                          function oe(Se) {
                            return function () {
                              var He = 0;
                              function Ge() {
                                for (; He < Se.length; ) {
                                  var Ye = Se[He];
                                  return (
                                    He++,
                                    (q._dbInfo = null),
                                    (q._ready = null),
                                    q.getDriver(Ye).then(se).catch(Ge)
                                  );
                                }
                                te();
                                var At = new Error(
                                  "No available storage method found.",
                                );
                                return (
                                  (q._driverSet = d.reject(At)),
                                  q._driverSet
                                );
                              }
                              return Ge();
                            };
                          }
                          var ue =
                            this._driverSet !== null
                              ? this._driverSet.catch(function () {
                                  return d.resolve();
                                })
                              : d.resolve();
                          return (
                            (this._driverSet = ue
                              .then(function () {
                                var Se = X[0];
                                return (
                                  (q._dbInfo = null),
                                  (q._ready = null),
                                  q.getDriver(Se).then(function (He) {
                                    ((q._driver = He._driver),
                                      te(),
                                      q._wrapLibraryMethodsWithReady(),
                                      (q._initDriver = oe(X)));
                                  })
                                );
                              })
                              .catch(function () {
                                te();
                                var Se = new Error(
                                  "No available storage method found.",
                                );
                                return (
                                  (q._driverSet = d.reject(Se)),
                                  q._driverSet
                                );
                              })),
                            m(this._driverSet, U, V),
                            this._driverSet
                          );
                        }),
                        (k.prototype.supports = function (L) {
                          return !!It[L];
                        }),
                        (k.prototype._extend = function (L) {
                          lo(this, L);
                        }),
                        (k.prototype._getSupportedDrivers = function (L) {
                          for (var U = [], V = 0, q = L.length; V < q; V++) {
                            var X = L[V];
                            this.supports(X) && U.push(X);
                          }
                          return U;
                        }),
                        (k.prototype._wrapLibraryMethodsWithReady =
                          function () {
                            for (var L = 0, U = St.length; L < U; L++)
                              Ha(this, St[L]);
                          }),
                        (k.prototype.createInstance = function (L) {
                          return new k(L);
                        }),
                        k
                      );
                    })(),
                    Qh = new Kh();
                  r.exports = Qh;
                },
                { 3: 3 },
              ],
            },
            {},
            [4],
          )(4);
        });
      })(Uo)),
    Uo.exports
  );
}
var H3 = P3();
const Yn = Sh(H3);
let ws = [!1, 0],
  Ah = !1;
function Qu(t, e) {
  ws = [t, e];
}
function Zu(t) {
  Ah = t;
}
var $o = { exports: {} },
  Ju;
function q3() {
  return (
    Ju ||
      ((Ju = 1),
      (function (t) {
        var e =
          typeof window < "u"
            ? window
            : typeof WorkerGlobalScope < "u" &&
                self instanceof WorkerGlobalScope
              ? self
              : {};
        /**
         * Prism: Lightweight, robust, elegant syntax highlighting
         *
         * @license MIT <https://opensource.org/licenses/MIT>
         * @author Lea Verou <https://lea.verou.me>
         * @namespace
         * @public
         */ var n = (function (r) {
          var i = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
            a = 0,
            s = {},
            o = {
              manual: r.Prism && r.Prism.manual,
              disableWorkerMessageHandler:
                r.Prism && r.Prism.disableWorkerMessageHandler,
              util: {
                encode: function b(T) {
                  return T instanceof l
                    ? new l(T.type, b(T.content), T.alias)
                    : Array.isArray(T)
                      ? T.map(b)
                      : T.replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/\u00a0/g, " ");
                },
                type: function (b) {
                  return Object.prototype.toString.call(b).slice(8, -1);
                },
                objId: function (b) {
                  return (
                    b.__id || Object.defineProperty(b, "__id", { value: ++a }),
                    b.__id
                  );
                },
                clone: function b(T, v) {
                  v = v || {};
                  var E, x;
                  switch (o.util.type(T)) {
                    case "Object":
                      if (((x = o.util.objId(T)), v[x])) return v[x];
                      ((E = {}), (v[x] = E));
                      for (var _ in T)
                        T.hasOwnProperty(_) && (E[_] = b(T[_], v));
                      return E;
                    case "Array":
                      return (
                        (x = o.util.objId(T)),
                        v[x]
                          ? v[x]
                          : ((E = []),
                            (v[x] = E),
                            T.forEach(function (j, F) {
                              E[F] = b(j, v);
                            }),
                            E)
                      );
                    default:
                      return T;
                  }
                },
                getLanguage: function (b) {
                  for (; b; ) {
                    var T = i.exec(b.className);
                    if (T) return T[1].toLowerCase();
                    b = b.parentElement;
                  }
                  return "none";
                },
                setLanguage: function (b, T) {
                  ((b.className = b.className.replace(RegExp(i, "gi"), "")),
                    b.classList.add("language-" + T));
                },
                currentScript: function () {
                  if (typeof document > "u") return null;
                  if (
                    document.currentScript &&
                    document.currentScript.tagName === "SCRIPT"
                  )
                    return document.currentScript;
                  try {
                    throw new Error();
                  } catch (E) {
                    var b = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(
                      E.stack,
                    ) || [])[1];
                    if (b) {
                      var T = document.getElementsByTagName("script");
                      for (var v in T) if (T[v].src == b) return T[v];
                    }
                    return null;
                  }
                },
                isActive: function (b, T, v) {
                  for (var E = "no-" + T; b; ) {
                    var x = b.classList;
                    if (x.contains(T)) return !0;
                    if (x.contains(E)) return !1;
                    b = b.parentElement;
                  }
                  return !!v;
                },
              },
              languages: {
                plain: s,
                plaintext: s,
                text: s,
                txt: s,
                extend: function (b, T) {
                  var v = o.util.clone(o.languages[b]);
                  for (var E in T) v[E] = T[E];
                  return v;
                },
                insertBefore: function (b, T, v, E) {
                  E = E || o.languages;
                  var x = E[b],
                    _ = {};
                  for (var j in x)
                    if (x.hasOwnProperty(j)) {
                      if (j == T)
                        for (var F in v) v.hasOwnProperty(F) && (_[F] = v[F]);
                      v.hasOwnProperty(j) || (_[j] = x[j]);
                    }
                  var O = E[b];
                  return (
                    (E[b] = _),
                    o.languages.DFS(o.languages, function ($, G) {
                      G === O && $ != b && (this[$] = _);
                    }),
                    _
                  );
                },
                DFS: function b(T, v, E, x) {
                  x = x || {};
                  var _ = o.util.objId;
                  for (var j in T)
                    if (T.hasOwnProperty(j)) {
                      v.call(T, j, T[j], E || j);
                      var F = T[j],
                        O = o.util.type(F);
                      O === "Object" && !x[_(F)]
                        ? ((x[_(F)] = !0), b(F, v, null, x))
                        : O === "Array" &&
                          !x[_(F)] &&
                          ((x[_(F)] = !0), b(F, v, j, x));
                    }
                },
              },
              plugins: {},
              highlightAll: function (b, T) {
                o.highlightAllUnder(document, b, T);
              },
              highlightAllUnder: function (b, T, v) {
                var E = {
                  callback: v,
                  container: b,
                  selector:
                    'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
                };
                (o.hooks.run("before-highlightall", E),
                  (E.elements = Array.prototype.slice.apply(
                    E.container.querySelectorAll(E.selector),
                  )),
                  o.hooks.run("before-all-elements-highlight", E));
                for (var x = 0, _; (_ = E.elements[x++]); )
                  o.highlightElement(_, T === !0, E.callback);
              },
              highlightElement: function (b, T, v) {
                var E = o.util.getLanguage(b),
                  x = o.languages[E];
                o.util.setLanguage(b, E);
                var _ = b.parentElement;
                _ &&
                  _.nodeName.toLowerCase() === "pre" &&
                  o.util.setLanguage(_, E);
                var j = b.textContent,
                  F = { element: b, language: E, grammar: x, code: j };
                function O(G) {
                  ((F.highlightedCode = G),
                    o.hooks.run("before-insert", F),
                    (F.element.innerHTML = F.highlightedCode),
                    o.hooks.run("after-highlight", F),
                    o.hooks.run("complete", F),
                    v && v.call(F.element));
                }
                if (
                  (o.hooks.run("before-sanity-check", F),
                  (_ = F.element.parentElement),
                  _ &&
                    _.nodeName.toLowerCase() === "pre" &&
                    !_.hasAttribute("tabindex") &&
                    _.setAttribute("tabindex", "0"),
                  !F.code)
                ) {
                  (o.hooks.run("complete", F), v && v.call(F.element));
                  return;
                }
                if ((o.hooks.run("before-highlight", F), !F.grammar)) {
                  O(o.util.encode(F.code));
                  return;
                }
                if (T && r.Worker) {
                  var $ = new Worker(o.filename);
                  (($.onmessage = function (G) {
                    O(G.data);
                  }),
                    $.postMessage(
                      JSON.stringify({
                        language: F.language,
                        code: F.code,
                        immediateClose: !0,
                      }),
                    ));
                } else O(o.highlight(F.code, F.grammar, F.language));
              },
              highlight: function (b, T, v) {
                var E = { code: b, grammar: T, language: v };
                if ((o.hooks.run("before-tokenize", E), !E.grammar))
                  throw new Error(
                    'The language "' + E.language + '" has no grammar.',
                  );
                return (
                  (E.tokens = o.tokenize(E.code, E.grammar)),
                  o.hooks.run("after-tokenize", E),
                  l.stringify(o.util.encode(E.tokens), E.language)
                );
              },
              tokenize: function (b, T) {
                var v = T.rest;
                if (v) {
                  for (var E in v) T[E] = v[E];
                  delete T.rest;
                }
                var x = new d();
                return (p(x, x.head, b), h(b, x, T, x.head, 0), y(x));
              },
              hooks: {
                all: {},
                add: function (b, T) {
                  var v = o.hooks.all;
                  ((v[b] = v[b] || []), v[b].push(T));
                },
                run: function (b, T) {
                  var v = o.hooks.all[b];
                  if (!(!v || !v.length))
                    for (var E = 0, x; (x = v[E++]); ) x(T);
                },
              },
              Token: l,
            };
          r.Prism = o;
          function l(b, T, v, E) {
            ((this.type = b),
              (this.content = T),
              (this.alias = v),
              (this.length = (E || "").length | 0));
          }
          l.stringify = function b(T, v) {
            if (typeof T == "string") return T;
            if (Array.isArray(T)) {
              var E = "";
              return (
                T.forEach(function (O) {
                  E += b(O, v);
                }),
                E
              );
            }
            var x = {
                type: T.type,
                content: b(T.content, v),
                tag: "span",
                classes: ["token", T.type],
                attributes: {},
                language: v,
              },
              _ = T.alias;
            (_ &&
              (Array.isArray(_)
                ? Array.prototype.push.apply(x.classes, _)
                : x.classes.push(_)),
              o.hooks.run("wrap", x));
            var j = "";
            for (var F in x.attributes)
              j +=
                " " +
                F +
                '="' +
                (x.attributes[F] || "").replace(/"/g, "&quot;") +
                '"';
            return (
              "<" +
              x.tag +
              ' class="' +
              x.classes.join(" ") +
              '"' +
              j +
              ">" +
              x.content +
              "</" +
              x.tag +
              ">"
            );
          };
          function u(b, T, v, E) {
            b.lastIndex = T;
            var x = b.exec(v);
            if (x && E && x[1]) {
              var _ = x[1].length;
              ((x.index += _), (x[0] = x[0].slice(_)));
            }
            return x;
          }
          function h(b, T, v, E, x, _) {
            for (var j in v)
              if (!(!v.hasOwnProperty(j) || !v[j])) {
                var F = v[j];
                F = Array.isArray(F) ? F : [F];
                for (var O = 0; O < F.length; ++O) {
                  if (_ && _.cause == j + "," + O) return;
                  var $ = F[O],
                    G = $.inside,
                    K = !!$.lookbehind,
                    le = !!$.greedy,
                    R = $.alias;
                  if (le && !$.pattern.global) {
                    var he = $.pattern.toString().match(/[imsuy]*$/)[0];
                    $.pattern = RegExp($.pattern.source, he + "g");
                  }
                  for (
                    var ee = $.pattern || $, Z = E.next, fe = x;
                    Z !== T.tail && !(_ && fe >= _.reach);
                    fe += Z.value.length, Z = Z.next
                  ) {
                    var M = Z.value;
                    if (T.length > b.length) return;
                    if (!(M instanceof l)) {
                      var ne = 1,
                        xe;
                      if (le) {
                        if (
                          ((xe = u(ee, fe, b, K)), !xe || xe.index >= b.length)
                        )
                          break;
                        var Ce = xe.index,
                          z = xe.index + xe[0].length,
                          De = fe;
                        for (De += Z.value.length; Ce >= De; )
                          ((Z = Z.next), (De += Z.value.length));
                        if (
                          ((De -= Z.value.length),
                          (fe = De),
                          Z.value instanceof l)
                        )
                          continue;
                        for (
                          var ke = Z;
                          ke !== T.tail &&
                          (De < z || typeof ke.value == "string");
                          ke = ke.next
                        )
                          (ne++, (De += ke.value.length));
                        (ne--, (M = b.slice(fe, De)), (xe.index -= fe));
                      } else if (((xe = u(ee, 0, M, K)), !xe)) continue;
                      var Ce = xe.index,
                        Ue = xe[0],
                        Fe = M.slice(0, Ce),
                        We = M.slice(Ce + Ue.length),
                        je = fe + M.length;
                      _ && je > _.reach && (_.reach = je);
                      var lt = Z.prev;
                      (Fe && ((lt = p(T, lt, Fe)), (fe += Fe.length)),
                        m(T, lt, ne));
                      var Et = new l(j, G ? o.tokenize(Ue, G) : Ue, R, Ue);
                      if (((Z = p(T, lt, Et)), We && p(T, Z, We), ne > 1)) {
                        var ht = { cause: j + "," + O, reach: je };
                        (h(b, T, v, Z.prev, fe, ht),
                          _ && ht.reach > _.reach && (_.reach = ht.reach));
                      }
                    }
                  }
                }
              }
          }
          function d() {
            var b = { value: null, prev: null, next: null },
              T = { value: null, prev: b, next: null };
            ((b.next = T), (this.head = b), (this.tail = T), (this.length = 0));
          }
          function p(b, T, v) {
            var E = T.next,
              x = { value: v, prev: T, next: E };
            return ((T.next = x), (E.prev = x), b.length++, x);
          }
          function m(b, T, v) {
            for (var E = T.next, x = 0; x < v && E !== b.tail; x++) E = E.next;
            ((T.next = E), (E.prev = T), (b.length -= x));
          }
          function y(b) {
            for (var T = [], v = b.head.next; v !== b.tail; )
              (T.push(v.value), (v = v.next));
            return T;
          }
          if (!r.document)
            return (
              r.addEventListener &&
                (o.disableWorkerMessageHandler ||
                  r.addEventListener(
                    "message",
                    function (b) {
                      var T = JSON.parse(b.data),
                        v = T.language,
                        E = T.code,
                        x = T.immediateClose;
                      (r.postMessage(o.highlight(E, o.languages[v], v)),
                        x && r.close());
                    },
                    !1,
                  )),
              o
            );
          var S = o.util.currentScript();
          S &&
            ((o.filename = S.src),
            S.hasAttribute("data-manual") && (o.manual = !0));
          function A() {
            o.manual || o.highlightAll();
          }
          if (!o.manual) {
            var C = document.readyState;
            C === "loading" || (C === "interactive" && S && S.defer)
              ? document.addEventListener("DOMContentLoaded", A)
              : window.requestAnimationFrame
                ? window.requestAnimationFrame(A)
                : window.setTimeout(A, 16);
          }
          return o;
        })(e);
        (t.exports && (t.exports = n),
          typeof Si < "u" && (Si.Prism = n),
          (n.languages.markup = {
            comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
            prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
            doctype: {
              pattern:
                /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
              greedy: !0,
              inside: {
                "internal-subset": {
                  pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                  lookbehind: !0,
                  greedy: !0,
                  inside: null,
                },
                string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
                punctuation: /^<!|>$|[[\]]/,
                "doctype-tag": /^DOCTYPE/i,
                name: /[^\s<>'"]+/,
              },
            },
            cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
            tag: {
              pattern:
                /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
              greedy: !0,
              inside: {
                tag: {
                  pattern: /^<\/?[^\s>\/]+/,
                  inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
                },
                "special-attr": [],
                "attr-value": {
                  pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                  inside: {
                    punctuation: [
                      { pattern: /^=/, alias: "attr-equals" },
                      { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
                    ],
                  },
                },
                punctuation: /\/?>/,
                "attr-name": {
                  pattern: /[^\s>\/]+/,
                  inside: { namespace: /^[^\s>\/:]+:/ },
                },
              },
            },
            entity: [
              { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
              /&#x?[\da-f]{1,8};/i,
            ],
          }),
          (n.languages.markup.tag.inside["attr-value"].inside.entity =
            n.languages.markup.entity),
          (n.languages.markup.doctype.inside["internal-subset"].inside =
            n.languages.markup),
          n.hooks.add("wrap", function (r) {
            r.type === "entity" &&
              (r.attributes.title = r.content.replace(/&amp;/, "&"));
          }),
          Object.defineProperty(n.languages.markup.tag, "addInlined", {
            value: function (i, a) {
              var s = {};
              ((s["language-" + a] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: !0,
                inside: n.languages[a],
              }),
                (s.cdata = /^<!\[CDATA\[|\]\]>$/i));
              var o = {
                "included-cdata": {
                  pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                  inside: s,
                },
              };
              o["language-" + a] = {
                pattern: /[\s\S]+/,
                inside: n.languages[a],
              };
              var l = {};
              ((l[i] = {
                pattern: RegExp(
                  /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                    /__/g,
                    function () {
                      return i;
                    },
                  ),
                  "i",
                ),
                lookbehind: !0,
                greedy: !0,
                inside: o,
              }),
                n.languages.insertBefore("markup", "cdata", l));
            },
          }),
          Object.defineProperty(n.languages.markup.tag, "addAttribute", {
            value: function (r, i) {
              n.languages.markup.tag.inside["special-attr"].push({
                pattern: RegExp(
                  /(^|["'\s])/.source +
                    "(?:" +
                    r +
                    ")" +
                    /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                  "i",
                ),
                lookbehind: !0,
                inside: {
                  "attr-name": /^[^\s=]+/,
                  "attr-value": {
                    pattern: /=[\s\S]+/,
                    inside: {
                      value: {
                        pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                        lookbehind: !0,
                        alias: [i, "language-" + i],
                        inside: n.languages[i],
                      },
                      punctuation: [
                        { pattern: /^=/, alias: "attr-equals" },
                        /"|'/,
                      ],
                    },
                  },
                },
              });
            },
          }),
          (n.languages.html = n.languages.markup),
          (n.languages.mathml = n.languages.markup),
          (n.languages.svg = n.languages.markup),
          (n.languages.xml = n.languages.extend("markup", {})),
          (n.languages.ssml = n.languages.xml),
          (n.languages.atom = n.languages.xml),
          (n.languages.rss = n.languages.xml),
          (function (r) {
            var i =
              /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
            ((r.languages.css = {
              comment: /\/\*[\s\S]*?\*\//,
              atrule: {
                pattern: RegExp(
                  "@[\\w-](?:" +
                    /[^;{\s"']|\s+(?!\s)/.source +
                    "|" +
                    i.source +
                    ")*?" +
                    /(?:;|(?=\s*\{))/.source,
                ),
                inside: {
                  rule: /^@[\w-]+/,
                  "selector-function-argument": {
                    pattern:
                      /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                    lookbehind: !0,
                    alias: "selector",
                  },
                  keyword: {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: !0,
                  },
                },
              },
              url: {
                pattern: RegExp(
                  "\\burl\\((?:" +
                    i.source +
                    "|" +
                    /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
                    ")\\)",
                  "i",
                ),
                greedy: !0,
                inside: {
                  function: /^url/i,
                  punctuation: /^\(|\)$/,
                  string: {
                    pattern: RegExp("^" + i.source + "$"),
                    alias: "url",
                  },
                },
              },
              selector: {
                pattern: RegExp(
                  `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` +
                    i.source +
                    ")*(?=\\s*\\{)",
                ),
                lookbehind: !0,
              },
              string: { pattern: i, greedy: !0 },
              property: {
                pattern:
                  /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                lookbehind: !0,
              },
              important: /!important\b/i,
              function: {
                pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
                lookbehind: !0,
              },
              punctuation: /[(){};:,]/,
            }),
              (r.languages.css.atrule.inside.rest = r.languages.css));
            var a = r.languages.markup;
            a &&
              (a.tag.addInlined("style", "css"),
              a.tag.addAttribute("style", "css"));
          })(n),
          (n.languages.clike = {
            comment: [
              {
                pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                lookbehind: !0,
                greedy: !0,
              },
              { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
            ],
            string: {
              pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
              greedy: !0,
            },
            "class-name": {
              pattern:
                /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
              lookbehind: !0,
              inside: { punctuation: /[.\\]/ },
            },
            keyword:
              /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
            boolean: /\b(?:false|true)\b/,
            function: /\b\w+(?=\()/,
            number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
            operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
            punctuation: /[{}[\];(),.:]/,
          }),
          (n.languages.javascript = n.languages.extend("clike", {
            "class-name": [
              n.languages.clike["class-name"],
              {
                pattern:
                  /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
                lookbehind: !0,
              },
            ],
            keyword: [
              { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
              {
                pattern:
                  /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: !0,
              },
            ],
            function:
              /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
            number: {
              pattern: RegExp(
                /(^|[^\w$])/.source +
                  "(?:" +
                  (/NaN|Infinity/.source +
                    "|" +
                    /0[bB][01]+(?:_[01]+)*n?/.source +
                    "|" +
                    /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                    "|" +
                    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                    "|" +
                    /\d+(?:_\d+)*n/.source +
                    "|" +
                    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                      .source) +
                  ")" +
                  /(?![\w$])/.source,
              ),
              lookbehind: !0,
            },
            operator:
              /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
          })),
          (n.languages.javascript["class-name"][0].pattern =
            /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
          n.languages.insertBefore("javascript", "keyword", {
            regex: {
              pattern: RegExp(
                /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/
                  .source +
                  /\//.source +
                  "(?:" +
                  /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/
                    .source +
                  "|" +
                  /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                    .source +
                  ")" +
                  /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/
                    .source,
              ),
              lookbehind: !0,
              greedy: !0,
              inside: {
                "regex-source": {
                  pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                  lookbehind: !0,
                  alias: "language-regex",
                  inside: n.languages.regex,
                },
                "regex-delimiter": /^\/|\/$/,
                "regex-flags": /^[a-z]+$/,
              },
            },
            "function-variable": {
              pattern:
                /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
              alias: "function",
            },
            parameter: [
              {
                pattern:
                  /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                lookbehind: !0,
                inside: n.languages.javascript,
              },
              {
                pattern:
                  /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                lookbehind: !0,
                inside: n.languages.javascript,
              },
              {
                pattern:
                  /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                lookbehind: !0,
                inside: n.languages.javascript,
              },
              {
                pattern:
                  /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                lookbehind: !0,
                inside: n.languages.javascript,
              },
            ],
            constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
          }),
          n.languages.insertBefore("javascript", "string", {
            hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
            "template-string": {
              pattern:
                /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
              greedy: !0,
              inside: {
                "template-punctuation": { pattern: /^`|`$/, alias: "string" },
                interpolation: {
                  pattern:
                    /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                  lookbehind: !0,
                  inside: {
                    "interpolation-punctuation": {
                      pattern: /^\$\{|\}$/,
                      alias: "punctuation",
                    },
                    rest: n.languages.javascript,
                  },
                },
                string: /[\s\S]+/,
              },
            },
            "string-property": {
              pattern:
                /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
              lookbehind: !0,
              greedy: !0,
              alias: "property",
            },
          }),
          n.languages.insertBefore("javascript", "operator", {
            "literal-property": {
              pattern:
                /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
              lookbehind: !0,
              alias: "property",
            },
          }),
          n.languages.markup &&
            (n.languages.markup.tag.addInlined("script", "javascript"),
            n.languages.markup.tag.addAttribute(
              /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
                .source,
              "javascript",
            )),
          (n.languages.js = n.languages.javascript),
          (function () {
            if (typeof n > "u" || typeof document > "u") return;
            Element.prototype.matches ||
              (Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                Element.prototype.webkitMatchesSelector);
            var r = "Loading…",
              i = function (S, A) {
                return "✖ Error " + S + " while fetching file: " + A;
              },
              a = "✖ Error: File does not exist or is empty",
              s = {
                js: "javascript",
                py: "python",
                rb: "ruby",
                ps1: "powershell",
                psm1: "powershell",
                sh: "bash",
                bat: "batch",
                h: "c",
                tex: "latex",
              },
              o = "data-src-status",
              l = "loading",
              u = "loaded",
              h = "failed",
              d =
                "pre[data-src]:not([" +
                o +
                '="' +
                u +
                '"]):not([' +
                o +
                '="' +
                l +
                '"])';
            function p(S, A, C) {
              var b = new XMLHttpRequest();
              (b.open("GET", S, !0),
                (b.onreadystatechange = function () {
                  b.readyState == 4 &&
                    (b.status < 400 && b.responseText
                      ? A(b.responseText)
                      : b.status >= 400
                        ? C(i(b.status, b.statusText))
                        : C(a));
                }),
                b.send(null));
            }
            function m(S) {
              var A = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(S || "");
              if (A) {
                var C = Number(A[1]),
                  b = A[2],
                  T = A[3];
                return b ? (T ? [C, Number(T)] : [C, void 0]) : [C, C];
              }
            }
            (n.hooks.add("before-highlightall", function (S) {
              S.selector += ", " + d;
            }),
              n.hooks.add("before-sanity-check", function (S) {
                var A = S.element;
                if (A.matches(d)) {
                  ((S.code = ""), A.setAttribute(o, l));
                  var C = A.appendChild(document.createElement("CODE"));
                  C.textContent = r;
                  var b = A.getAttribute("data-src"),
                    T = S.language;
                  if (T === "none") {
                    var v = (/\.(\w+)$/.exec(b) || [, "none"])[1];
                    T = s[v] || v;
                  }
                  (n.util.setLanguage(C, T), n.util.setLanguage(A, T));
                  var E = n.plugins.autoloader;
                  (E && E.loadLanguages(T),
                    p(
                      b,
                      function (x) {
                        A.setAttribute(o, u);
                        var _ = m(A.getAttribute("data-range"));
                        if (_) {
                          var j = x.split(/\r\n?|\n/g),
                            F = _[0],
                            O = _[1] == null ? j.length : _[1];
                          (F < 0 && (F += j.length),
                            (F = Math.max(0, Math.min(F - 1, j.length))),
                            O < 0 && (O += j.length),
                            (O = Math.max(0, Math.min(O, j.length))),
                            (x = j.slice(F, O).join(`
`)),
                            A.hasAttribute("data-start") ||
                              A.setAttribute("data-start", String(F + 1)));
                        }
                        ((C.textContent = x), n.highlightElement(C));
                      },
                      function (x) {
                        (A.setAttribute(o, h), (C.textContent = x));
                      },
                    ));
                }
              }),
              (n.plugins.fileHighlight = {
                highlight: function (A) {
                  for (
                    var C = (A || document).querySelectorAll(d), b = 0, T;
                    (T = C[b++]);

                  )
                    n.highlightElement(T);
                },
              }));
            var y = !1;
            n.fileHighlight = function () {
              (y ||
                (console.warn(
                  "Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.",
                ),
                (y = !0)),
                n.plugins.fileHighlight.highlight.apply(this, arguments));
            };
          })());
      })($o)),
    $o.exports
  );
}
var U3 = q3();
const $3 = Sh(U3);
var ec = {},
  tc;
function V3() {
  return (
    tc ||
      ((tc = 1),
      (function (t) {
        var e =
            /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
          n = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,
          r = {
            pattern: RegExp(
              /(^|[^\w.])/.source + n + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source,
            ),
            lookbehind: !0,
            inside: {
              namespace: {
                pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
                inside: { punctuation: /\./ },
              },
              punctuation: /\./,
            },
          };
        ((t.languages.java = t.languages.extend("clike", {
          string: {
            pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
            lookbehind: !0,
            greedy: !0,
          },
          "class-name": [
            r,
            {
              pattern: RegExp(
                /(^|[^\w.])/.source +
                  n +
                  /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/
                    .source,
              ),
              lookbehind: !0,
              inside: r.inside,
            },
            {
              pattern: RegExp(
                /(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/
                  .source +
                  n +
                  /[A-Z]\w*\b/.source,
              ),
              lookbehind: !0,
              inside: r.inside,
            },
          ],
          keyword: e,
          function: [
            t.languages.clike.function,
            { pattern: /(::\s*)[a-z_]\w*/, lookbehind: !0 },
          ],
          number:
            /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
          operator: {
            pattern:
              /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
            lookbehind: !0,
          },
          constant: /\b[A-Z][A-Z_\d]+\b/,
        })),
          t.languages.insertBefore("java", "string", {
            "triple-quoted-string": {
              pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
              greedy: !0,
              alias: "string",
            },
            char: { pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/, greedy: !0 },
          }),
          t.languages.insertBefore("java", "class-name", {
            annotation: {
              pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
              lookbehind: !0,
              alias: "punctuation",
            },
            generics: {
              pattern:
                /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
              inside: {
                "class-name": r,
                keyword: e,
                punctuation: /[<>(),.:]/,
                operator: /[?&|]/,
              },
            },
            import: [
              {
                pattern: RegExp(
                  /(\bimport\s+)/.source + n + /(?:[A-Z]\w*|\*)(?=\s*;)/.source,
                ),
                lookbehind: !0,
                inside: {
                  namespace: r.inside.namespace,
                  punctuation: /\./,
                  operator: /\*/,
                  "class-name": /\w+/,
                },
              },
              {
                pattern: RegExp(
                  /(\bimport\s+static\s+)/.source +
                    n +
                    /(?:\w+|\*)(?=\s*;)/.source,
                ),
                lookbehind: !0,
                alias: "static",
                inside: {
                  namespace: r.inside.namespace,
                  static: /\b\w+$/,
                  punctuation: /\./,
                  operator: /\*/,
                  "class-name": /\w+/,
                },
              },
            ],
            namespace: {
              pattern: RegExp(
                /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(
                  /<keyword>/g,
                  function () {
                    return e.source;
                  },
                ),
              ),
              lookbehind: !0,
              inside: { punctuation: /\./ },
            },
          }));
      })(Prism)),
    ec
  );
}
V3();
var nc = {},
  rc;
function j3() {
  return (
    rc ||
      ((rc = 1),
      (Prism.languages.python = {
        comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0, greedy: !0 },
        "string-interpolation": {
          pattern:
            /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
          greedy: !0,
          inside: {
            interpolation: {
              pattern:
                /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
              lookbehind: !0,
              inside: {
                "format-spec": {
                  pattern: /(:)[^:(){}]+(?=\}$)/,
                  lookbehind: !0,
                },
                "conversion-option": {
                  pattern: /![sra](?=[:}]$)/,
                  alias: "punctuation",
                },
                rest: null,
              },
            },
            string: /[\s\S]+/,
          },
        },
        "triple-quoted-string": {
          pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
          greedy: !0,
          alias: "string",
        },
        string: {
          pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
          greedy: !0,
        },
        function: {
          pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
          lookbehind: !0,
        },
        "class-name": { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
        decorator: {
          pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
          lookbehind: !0,
          alias: ["annotation", "punctuation"],
          inside: { punctuation: /\./ },
        },
        keyword:
          /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
        builtin:
          /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
        boolean: /\b(?:False|None|True)\b/,
        number:
          /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
        operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
        punctuation: /[{}[\];(),.:]/,
      }),
      (Prism.languages.python[
        "string-interpolation"
      ].inside.interpolation.inside.rest = Prism.languages.python),
      (Prism.languages.py = Prism.languages.python)),
    nc
  );
}
j3();
Prism.languages.c = Prism.languages.extend("clike", {
  comment: {
    pattern:
      /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: !0,
  },
  string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
  "class-name": {
    pattern:
      /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: !0,
  },
  keyword:
    /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number:
    /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
});
Prism.languages.insertBefore("c", "string", {
  char: { pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/, greedy: !0 },
});
Prism.languages.insertBefore("c", "string", {
  macro: {
    pattern:
      /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: !0,
    greedy: !0,
    alias: "property",
    inside: {
      string: [
        { pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 },
        Prism.languages.c.string,
      ],
      char: Prism.languages.c.char,
      comment: Prism.languages.c.comment,
      "macro-name": [
        { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
        {
          pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
          lookbehind: !0,
          alias: "function",
        },
      ],
      directive: { pattern: /^(#\s*)[a-z]+/, lookbehind: !0, alias: "keyword" },
      "directive-hash": /^#/,
      punctuation: /##|\\(?=[\r\n])/,
      expression: { pattern: /\S[\s\S]*/, inside: Prism.languages.c },
    },
  },
});
Prism.languages.insertBefore("c", "function", {
  constant:
    /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
});
delete Prism.languages.c.boolean;
var ic = {},
  ac;
function W3() {
  return (
    ac ||
      ((ac = 1),
      (function (t) {
        var e =
            /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
          n = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(
            /<keyword>/g,
            function () {
              return e.source;
            },
          );
        ((t.languages.cpp = t.languages.extend("c", {
          "class-name": [
            {
              pattern: RegExp(
                /(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(
                  /<keyword>/g,
                  function () {
                    return e.source;
                  },
                ),
              ),
              lookbehind: !0,
            },
            /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
            /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
            /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/,
          ],
          keyword: e,
          number: {
            pattern:
              /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
            greedy: !0,
          },
          operator:
            />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
          boolean: /\b(?:false|true)\b/,
        })),
          t.languages.insertBefore("cpp", "string", {
            module: {
              pattern: RegExp(
                /(\b(?:import|module)\s+)/.source +
                  "(?:" +
                  /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source +
                  "|" +
                  /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(
                    /<mod-name>/g,
                    function () {
                      return n;
                    },
                  ) +
                  ")",
              ),
              lookbehind: !0,
              greedy: !0,
              inside: {
                string: /^[<"][\s\S]+/,
                operator: /:/,
                punctuation: /\./,
              },
            },
            "raw-string": {
              pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
              alias: "string",
              greedy: !0,
            },
          }),
          t.languages.insertBefore("cpp", "keyword", {
            "generic-function": {
              pattern:
                /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
              inside: {
                function: /^\w+/,
                generic: {
                  pattern: /<[\s\S]+/,
                  alias: "class-name",
                  inside: t.languages.cpp,
                },
              },
            },
          }),
          t.languages.insertBefore("cpp", "operator", {
            "double-colon": { pattern: /::/, alias: "punctuation" },
          }),
          t.languages.insertBefore("cpp", "class-name", {
            "base-clause": {
              pattern:
                /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
              lookbehind: !0,
              greedy: !0,
              inside: t.languages.extend("cpp", {}),
            },
          }),
          t.languages.insertBefore(
            "inside",
            "double-colon",
            { "class-name": /\b[a-z_]\w*\b(?!\s*::)/i },
            t.languages.cpp["base-clause"],
          ));
      })(Prism)),
    ic
  );
}
W3();
var sc = {},
  oc;
function G3() {
  return (
    oc ||
      ((oc = 1),
      (function (t) {
        function e(fe, M) {
          return fe.replace(/<<(\d+)>>/g, function (ne, xe) {
            return "(?:" + M[+xe] + ")";
          });
        }
        function n(fe, M, ne) {
          return RegExp(e(fe, M), "");
        }
        function r(fe, M) {
          for (var ne = 0; ne < M; ne++)
            fe = fe.replace(/<<self>>/g, function () {
              return "(?:" + fe + ")";
            });
          return fe.replace(/<<self>>/g, "[^\\s\\S]");
        }
        var i = {
          type: "bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",
          typeDeclaration: "class enum interface record struct",
          contextual:
            "add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",
          other:
            "abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield",
        };
        function a(fe) {
          return "\\b(?:" + fe.trim().replace(/ /g, "|") + ")\\b";
        }
        var s = a(i.typeDeclaration),
          o = RegExp(
            a(
              i.type +
                " " +
                i.typeDeclaration +
                " " +
                i.contextual +
                " " +
                i.other,
            ),
          ),
          l = a(i.typeDeclaration + " " + i.contextual + " " + i.other),
          u = a(i.type + " " + i.typeDeclaration + " " + i.other),
          h = r(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2),
          d = r(/\((?:[^()]|<<self>>)*\)/.source, 2),
          p = /@?\b[A-Za-z_]\w*\b/.source,
          m = e(/<<0>>(?:\s*<<1>>)?/.source, [p, h]),
          y = e(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [l, m]),
          S = /\[\s*(?:,\s*)*\]/.source,
          A = e(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [y, S]),
          C = e(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [h, d, S]),
          b = e(/\(<<0>>+(?:,<<0>>+)+\)/.source, [C]),
          T = e(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [
            b,
            y,
            S,
          ]),
          v = { keyword: o, punctuation: /[<>()?,.:[\]]/ },
          E = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source,
          x = /"(?:\\.|[^\\"\r\n])*"/.source,
          _ = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;
        ((t.languages.csharp = t.languages.extend("clike", {
          string: [
            {
              pattern: n(/(^|[^$\\])<<0>>/.source, [_]),
              lookbehind: !0,
              greedy: !0,
            },
            {
              pattern: n(/(^|[^@$\\])<<0>>/.source, [x]),
              lookbehind: !0,
              greedy: !0,
            },
          ],
          "class-name": [
            {
              pattern: n(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [y]),
              lookbehind: !0,
              inside: v,
            },
            {
              pattern: n(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [
                p,
                T,
              ]),
              lookbehind: !0,
              inside: v,
            },
            {
              pattern: n(/(\busing\s+)<<0>>(?=\s*=)/.source, [p]),
              lookbehind: !0,
            },
            {
              pattern: n(/(\b<<0>>\s+)<<1>>/.source, [s, m]),
              lookbehind: !0,
              inside: v,
            },
            {
              pattern: n(/(\bcatch\s*\(\s*)<<0>>/.source, [y]),
              lookbehind: !0,
              inside: v,
            },
            { pattern: n(/(\bwhere\s+)<<0>>/.source, [p]), lookbehind: !0 },
            {
              pattern: n(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [A]),
              lookbehind: !0,
              inside: v,
            },
            {
              pattern: n(
                /\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/
                  .source,
                [T, u, p],
              ),
              inside: v,
            },
          ],
          keyword: o,
          number:
            /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
          operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
          punctuation: /\?\.?|::|[{}[\];(),.:]/,
        })),
          t.languages.insertBefore("csharp", "number", {
            range: { pattern: /\.\./, alias: "operator" },
          }),
          t.languages.insertBefore("csharp", "punctuation", {
            "named-parameter": {
              pattern: n(/([(,]\s*)<<0>>(?=\s*:)/.source, [p]),
              lookbehind: !0,
              alias: "punctuation",
            },
          }),
          t.languages.insertBefore("csharp", "class-name", {
            namespace: {
              pattern: n(
                /(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/
                  .source,
                [p],
              ),
              lookbehind: !0,
              inside: { punctuation: /\./ },
            },
            "type-expression": {
              pattern: n(
                /(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/
                  .source,
                [d],
              ),
              lookbehind: !0,
              alias: "class-name",
              inside: v,
            },
            "return-type": {
              pattern: n(
                /<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/
                  .source,
                [T, y],
              ),
              inside: v,
              alias: "class-name",
            },
            "constructor-invocation": {
              pattern: n(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [T]),
              lookbehind: !0,
              inside: v,
              alias: "class-name",
            },
            "generic-method": {
              pattern: n(/<<0>>\s*<<1>>(?=\s*\()/.source, [p, h]),
              inside: {
                function: n(/^<<0>>/.source, [p]),
                generic: { pattern: RegExp(h), alias: "class-name", inside: v },
              },
            },
            "type-list": {
              pattern: n(
                /\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/
                  .source,
                [s, m, p, T, o.source, d, /\bnew\s*\(\s*\)/.source],
              ),
              lookbehind: !0,
              inside: {
                "record-arguments": {
                  pattern: n(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [m, d]),
                  lookbehind: !0,
                  greedy: !0,
                  inside: t.languages.csharp,
                },
                keyword: o,
                "class-name": { pattern: RegExp(T), greedy: !0, inside: v },
                punctuation: /[,()]/,
              },
            },
            preprocessor: {
              pattern: /(^[\t ]*)#.*/m,
              lookbehind: !0,
              alias: "property",
              inside: {
                directive: {
                  pattern:
                    /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
                  lookbehind: !0,
                  alias: "keyword",
                },
              },
            },
          }));
        var j = x + "|" + E,
          F = e(
            /\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/
              .source,
            [j],
          ),
          O = r(e(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [F]), 2),
          $ =
            /\b(?:assembly|event|field|method|module|param|property|return|type)\b/
              .source,
          G = e(/<<0>>(?:\s*\(<<1>>*\))?/.source, [y, O]);
        t.languages.insertBefore("csharp", "class-name", {
          attribute: {
            pattern: n(
              /((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/
                .source,
              [$, G],
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              target: {
                pattern: n(/^<<0>>(?=\s*:)/.source, [$]),
                alias: "keyword",
              },
              "attribute-arguments": {
                pattern: n(/\(<<0>>*\)/.source, [O]),
                inside: t.languages.csharp,
              },
              "class-name": {
                pattern: RegExp(y),
                inside: { punctuation: /\./ },
              },
              punctuation: /[:,]/,
            },
          },
        });
        var K = /:[^}\r\n]+/.source,
          le = r(e(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [F]), 2),
          R = e(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [le, K]),
          he = r(
            e(
              /[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/
                .source,
              [j],
            ),
            2,
          ),
          ee = e(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [he, K]);
        function Z(fe, M) {
          return {
            interpolation: {
              pattern: n(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [fe]),
              lookbehind: !0,
              inside: {
                "format-string": {
                  pattern: n(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [
                    M,
                    K,
                  ]),
                  lookbehind: !0,
                  inside: { punctuation: /^:/ },
                },
                punctuation: /^\{|\}$/,
                expression: {
                  pattern: /[\s\S]+/,
                  alias: "language-csharp",
                  inside: t.languages.csharp,
                },
              },
            },
            string: /[\s\S]+/,
          };
        }
        (t.languages.insertBefore("csharp", "string", {
          "interpolation-string": [
            {
              pattern: n(
                /(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/
                  .source,
                [R],
              ),
              lookbehind: !0,
              greedy: !0,
              inside: Z(R, le),
            },
            {
              pattern: n(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [
                ee,
              ]),
              lookbehind: !0,
              greedy: !0,
              inside: Z(ee, he),
            },
          ],
          char: { pattern: RegExp(E), greedy: !0 },
        }),
          (t.languages.dotnet = t.languages.cs = t.languages.csharp));
      })(Prism)),
    sc
  );
}
G3();
(function (t) {
  var e =
      "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
    n = {
      pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
      lookbehind: !0,
      alias: "punctuation",
      inside: null,
    },
    r = {
      bash: n,
      environment: { pattern: RegExp("\\$" + e), alias: "constant" },
      variable: [
        {
          pattern: /\$?\(\([\s\S]+?\)\)/,
          greedy: !0,
          inside: {
            variable: [
              { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
              /^\$\(\(/,
            ],
            number:
              /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
            operator:
              /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
            punctuation: /\(\(?|\)\)?|,|;/,
          },
        },
        {
          pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
          greedy: !0,
          inside: { variable: /^\$\(|^`|\)$|`$/ },
        },
        {
          pattern: /\$\{[^}]+\}/,
          greedy: !0,
          inside: {
            operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
            punctuation: /[\[\]]/,
            environment: {
              pattern: RegExp("(\\{)" + e),
              lookbehind: !0,
              alias: "constant",
            },
          },
        },
        /\$(?:\w+|[#?*!@$])/,
      ],
      entity:
        /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
    };
  ((t.languages.bash = {
    shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
    comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
    "function-name": [
      {
        pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
        lookbehind: !0,
        alias: "function",
      },
      { pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: "function" },
    ],
    "for-or-select": {
      pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
      alias: "variable",
      lookbehind: !0,
    },
    "assign-left": {
      pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
      inside: {
        environment: {
          pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + e),
          lookbehind: !0,
          alias: "constant",
        },
      },
      alias: "variable",
      lookbehind: !0,
    },
    parameter: {
      pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
      alias: "variable",
      lookbehind: !0,
    },
    string: [
      {
        pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
        lookbehind: !0,
        greedy: !0,
        inside: r,
      },
      {
        pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
        lookbehind: !0,
        greedy: !0,
        inside: { bash: n },
      },
      {
        pattern:
          /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
        lookbehind: !0,
        greedy: !0,
        inside: r,
      },
      { pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
      {
        pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
        greedy: !0,
        inside: { entity: r.entity },
      },
    ],
    environment: { pattern: RegExp("\\$?" + e), alias: "constant" },
    variable: r.variable,
    function: {
      pattern:
        /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
      lookbehind: !0,
    },
    keyword: {
      pattern:
        /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
      lookbehind: !0,
    },
    builtin: {
      pattern:
        /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
      lookbehind: !0,
      alias: "class-name",
    },
    boolean: {
      pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
      lookbehind: !0,
    },
    "file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
    operator: {
      pattern:
        /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
      inside: { "file-descriptor": { pattern: /^\d/, alias: "important" } },
    },
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
    number: { pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/, lookbehind: !0 },
  }),
    (n.inside = t.languages.bash));
  for (
    var i = [
        "comment",
        "function-name",
        "for-or-select",
        "assign-left",
        "parameter",
        "string",
        "environment",
        "function",
        "keyword",
        "builtin",
        "boolean",
        "file-descriptor",
        "operator",
        "punctuation",
        "number",
      ],
      a = r.variable[1].inside,
      s = 0;
    s < i.length;
    s++
  )
    a[i[s]] = t.languages.bash[i[s]];
  ((t.languages.sh = t.languages.bash), (t.languages.shell = t.languages.bash));
})(Prism);
let Kn = null;
const vi = [],
  Ir = [];
function lc() {
  ln(this.getAttribute("data-page"));
}
function uc(t, e = I.pgN) {
  if (Ft(I.name)) {
    notyf.error("This notebook is read only");
    return;
  }
  const n = [],
    r = [];
  if (t === "->")
    for (let i = 0; i < I.content.length; i++)
      (i === e + 1 && (n.push(""), r.push("")),
        n.push(I.content[i]),
        r.push(I.aceSessions[i]));
  else if (t === "<-")
    for (let i = 0; i < I.content.length; i++)
      (i === e && (n.push(""), r.push("")),
        n.push(I.content[i]),
        r.push(I.aceSessions[i]));
  ((I.content = n),
    (I.aceSessions = r),
    vn(),
    t === "->" ? ln(e + 1) : t === "<-" && ln(e));
}
function ln(t) {
  ((t < 0 || parseInt(t) === NaN) && (t = 0),
    t < I.pgN
      ? Pi({ direction: "<-", amount: I.pgN - t })
      : t > I.pgN &&
        Pi({ direction: "->", amount: t - I.pgN, shouldCreateNewPage: !0 }));
}
function Pi({
  direction: t,
  amount: e,
  shouldCreateNewPage: n = !1,
  event: r,
} = {}) {
  I.content &&
    (t === "<-" && I.pgN > 0
      ? ((I.pgN -= e), vn())
      : t === "->" &&
        (I.pgN + e >= I.content.length && n && !Ft(I.name)
          ? (I.content.push(""), (I.pgN += e), vn(), ni && Hi(I.name, !0))
          : I.pgN + e >= I.content.length && !n && r && !Ft(I.name)
            ? Kt(
                r,
                [
                  {
                    text: "New Page",
                    click: () => {
                      (ln(I.content.length), ye());
                    },
                  },
                ],
                [`${r.clientX - 160}px`, "75px"],
              )
            : I.pgN + e >= I.content.length || ((I.pgN += e), vn())));
}
function vn(t = !0) {
  if (I.aceSessions[I.pgN]) Ie.setSession(I.aceSessions[I.pgN]);
  else {
    const e = ace.createEditSession(I.content[I.pgN]);
    (Ie.setSession(e),
      Ie.session.setUseWrapMode(!0),
      Ie.session.setMode("ace/mode/markdown"),
      (I.aceSessions[I.pgN] = e),
      Ie.setSession(I.aceSessions[I.pgN]));
  }
  (history.state === null
    ? window.history.replaceState(
        { sancta: !0, note: I.name, page: I.pgN },
        null,
        `/${I.name}?${I.pgN + 1}`,
      )
    : history.state.sancta && history.state.note !== I.name
      ? window.history.pushState(
          { sancta: !0, note: I.name, page: I.pgN },
          null,
          `/${I.name}?${I.pgN + 1}`,
        )
      : history.state.sancta &&
        history.state.note === I.name &&
        window.history.replaceState(
          { sancta: !0, note: I.name, page: I.pgN },
          null,
          `/${I.name}?${I.pgN + 1}`,
        ),
    da(),
    Y3(),
    t && Ie.focus());
}
async function da() {
  const t = Ie.getValue();
  (t.length > 4e3 ? Qu(!0, t.length) : Qu(!1, 0), (I.content[I.pgN] = t));
  const e = Wn.find((r) => r.name === I.name);
  (e && (e.excerpt = I.content.map((r) => Ri(r))),
    !Ft(I.name) &&
      !I.isEncrypted &&
      Yn.setItem(I.name, { content: I.content, timestamp: Date.now() }),
    Th(),
    Kn && (Kn.destroy(), (Kn = null)),
    Ir.forEach((r) => {
      r.element.removeEventListener(r.type, r.listener);
    }),
    (Ir.length = 0));
  const n = document.createElement("div");
  ((n.innerHTML = Zr(t)),
    (n.id = "fill"),
    ap(Cs, n),
    Eh(Cs),
    (letterCount.innerText = Ie.getValue()
      .replace(/\s+/g, "")
      .length.toString()
      .padStart(5, "0")),
    (wordCount.innerText = notesPreviewArea.innerText
      .split(/\s+/)
      .filter((r) => r !== "")
      .length.toString()
      .padStart(5, "0")));
}
async function Th() {
  return new Promise((t) => {
    (Ft(I.name)
      ? (Ai(I.name, I.name), (areNotesSavedIcon.style.filter = "grayscale(1)"))
      : I.saved
        ? yh(I.content, I.dbSave)
          ? (Ai(I.name, I.name),
            gs.setContent(
              `Notes were saved at ${new Date(I.date).toLocaleString()}`,
            ),
            (areNotesSavedIcon.style.filter = "none"))
          : (ni || Ai(I.name, `* ${I.name}`),
            gs.setContent(
              `Notes shown differ from saved notes by ${_3(I.content, I.dbSave)} chars`,
            ),
            (areNotesSavedIcon.style.filter = "grayscale(1)"))
        : (Ai(I.name, `* ${I.name}`),
          gs.setContent("Notes are not saved"),
          (areNotesSavedIcon.style.filter = "hue-rotate(270deg)")),
      t());
  });
}
function Eh(t, e = !0) {
  if (
    (t.firstChild &&
      t.firstChild.tagName === "P" &&
      t.firstChild.innerText.substring(0, 3) === "// " &&
      t.firstChild.classList.add("firstLineComment"),
    $3.highlightAllUnder(t),
    e)
  ) {
    for (const n of t.getElementsByClassName("reference"))
      (n.addEventListener(window.isOnMobile ? "dblclick" : "click", wr),
        Ir.push({
          element: n,
          type: window.isOnMobile ? "dblclick" : "click",
          listener: wr,
        }),
        n.addEventListener("mouseover", os),
        Ir.push({ element: n, type: "mouseover", listener: os }),
        n.addEventListener("focus", os),
        Ir.push({ element: n, type: "focus", listener: os }));
    for (const n of t.getElementsByClassName("sanctaTag"))
      (n.addEventListener("click", wr),
        Ir.push({ element: n, type: "click", listener: wr }));
    for (const n of t.getElementsByTagName("img"))
      (n.addEventListener("contextmenu", ss),
        Ir.push({ element: n, type: "contextmenu", listener: ss }));
    for (const n of t.getElementsByTagName("a"))
      (n.setAttribute("target", "_blank"),
        n.setAttribute("rel", "noopener noreferrer"),
        Da(n.href) === "[PDF]" &&
          (n.addEventListener("contextmenu", ss),
          Ir.push({ element: n, type: "contextmenu", listener: ss })));
  }
}
function Y3() {
  for (
    vi.forEach((n) => {
      n.element.removeEventListener(n.type, n.listener);
    }),
      vi.length = 0;
    ua.firstChild;

  )
    ua.firstChild.remove();
  ((Wc.innerText = I.pgN + 1), nd.setContent(`Page ${I.pgN + 1}`));
  const t = Math.min(I.content.length, 9);
  for (let n = 0, r = t; n < r; n++) {
    const i = document.createElement("div");
    ((i.id = `whereTo${n}`),
      i.classList.add("whereTo"),
      i.setAttribute("data-bookname", I.name),
      i.setAttribute("data-page", n),
      i.addEventListener("mouseover", ka),
      vi.push({ element: i, type: "mouseover", listener: ka }),
      i.addEventListener("mouseleave", ye),
      vi.push({ element: i, type: "mouseleave", listener: ye }),
      i.addEventListener("click", lc),
      vi.push({ element: i, type: "click", listener: lc }),
      i.addEventListener("wheel", Il),
      vi.push({ element: i, type: "wheel", listener: Il }),
      (i.innerText = n + 1),
      ua.appendChild(i));
  }
  (I.content.length > 9
    ? ((wi.style.display = "inline"),
      wi.setAttribute("data-page", I.content.length - 1))
    : (wi.style.display = "none"),
    wi.classList.remove("currPage"),
    (rt(`whereTo${I.pgN}`) || wi).classList.add("currPage"));
}
function ss(t) {
  Kt(t, [
    navigator.clipboard
      ? {
          props: this.src || this.href,
          text: "Copy Link",
          click: (e) => {
            (navigator.clipboard.writeText(e), ye());
          },
        }
      : null,
    {
      props: this.src || this.href,
      text: "Open File",
      click: (e) => {
        (window.open(e, "_blank"), ye());
      },
    },
    Fi.includes(
      (this.src || this.href).substring(
        (this.src || this.href).indexOf("/uploads/") + 9,
      ),
    )
      ? {
          props: (this.src || this.href).substring(
            (this.src || this.href).indexOf("/uploads/") + 9,
          ),
          text: "Delete File",
          click: (e, n) => ci(n, () => B3(e)),
        }
      : null,
  ]);
}
async function os() {
  (Kn && (Kn.destroy(), (Kn = null)),
    ye(),
    (Kn = Mn([this], {
      theme: qr.theme_type,
      animation: "shift-toward-subtle",
      content: "Loading...",
      allowHTML: !0,
      interactive: !0,
      arrow: !1,
      placement: "bottom",
    })[0]));
  try {
    const t = Zr(
      (await _n(this.getAttribute("data-bookname"), "content"))[
        parseInt(this.getAttribute("data-page"))
      ],
    );
    (Kn.setContent(`<div class = 'pagePreviewContainer'>${t}</div>`),
      Kn.show());
  } catch {
    Kn.destroy();
  }
}
function X3(t, e) {
  let n = null;
  const r = window.Diff.diffChars(t, e),
    i = document.createDocumentFragment();
  function a(s, o, l, u) {
    return (
      (n = document.createElement("span")),
      (n.style.background = o),
      (n.style.color = l),
      u ? (n.innerHTML = s) : (n.innerText = s),
      n
    );
  }
  return !t && !e
    ? (i.appendChild(a("<i><b>Empty Page</b></i>", "rgba(0,0,0,0)", "", !0)), i)
    : (r.forEach((s) => {
        const [o, l] = s.added
          ? ["#33ff96", "black"]
          : s.removed
            ? ["#ff5e5e", "black"]
            : ["rgba(0,0,0,0)", ""];
        i.appendChild(a(s.value, o, l));
      }),
      i);
}
function G0(t = I.content, e = I.dbSave) {
  const n = Xs(),
    r = Math.max(e.length, t.length),
    i = r === e.length ? e : t,
    [a, s] = r === e.length ? ["#ff5e5e", "black"] : ["#33ff96", "black"];
  for (let o = 0, l = r; o < l; o++) {
    const u = document.createElement("pre"),
      h = document.createElement("h2");
    ((h.innerHTML = `Page ${o + 1}`),
      o === 0 &&
        Ls(
          h,
          "Local notebook <span style = 'background: #33ff96; color: black;'>&nbsp;includes&nbsp;</span> or <span style = 'background: #ff5e5e; color: black;'>&nbsp;excludes&nbsp;</span>",
          0.6,
        ),
      h.addEventListener("click", h.scrollIntoView),
      h.addEventListener("contextmenu", (d) => {
        Kt(d, [
          {
            text: `Go to Page ${o + 1}`,
            click: () => {
              (ln(o), Br(), ye());
            },
          },
        ]);
      }),
      u.appendChild(h),
      u.classList.add("pageDiff"));
    try {
      u.appendChild(X3(e[o], t[o]));
    } catch (d) {
      console.log(d);
      const p = document.createDocumentFragment(),
        m = document.createElement("span");
      ((m.style.background = a),
        (m.style.color = s),
        i[o]
          ? (m.innerText = i[o])
          : (m.innerHTML = "<i><b>Empty Page</b></i>"),
        p.appendChild(m),
        u.appendChild(p));
    }
    n.appendChild(u);
  }
}
let vt,
  xa = !1;
function K3() {
  xa = !0;
}
function Q3(t, e, n, r = !0) {
  xa && ((xa = !1), Vi(t, e, n, r));
}
function Ch(t) {
  t.key === "Enter" && vt
    ? (t.preventDefault(), vt.click())
    : t.key === "Escape"
      ? di()
      : (t.key === "ArrowUp" || (t.key === "Tab" && t.shiftKey)) &&
          vt &&
          vt.previousElementSibling
        ? (t.preventDefault(),
          t.stopImmediatePropagation(),
          vt.classList.remove("selected"),
          (vt = vt.previousElementSibling),
          vt.classList.add("selected"),
          vt.scrollIntoView({ block: "center" }))
        : (t.key === "ArrowDown" || (t.key === "Tab" && !t.shiftKey)) &&
            vt &&
            vt.nextElementSibling
          ? (t.preventDefault(),
            t.stopImmediatePropagation(),
            vt.classList.remove("selected"),
            (vt = vt.nextElementSibling),
            vt.classList.add("selected"),
            vt.scrollIntoView({ block: "center" }))
          : (t.key === "Tab" || t.key === "ArrowUp" || t.key === "ArrowDown") &&
            t.preventDefault();
}
function di() {
  ((xa = !1),
    qi([rt("paletteContainer")]),
    (vt = null),
    document.removeEventListener("keydown", Ch));
}
function cc(t, e) {
  const n = [],
    r = [];
  for (const i of t)
    i.name.toLowerCase().includes(e.toLowerCase())
      ? n.push(i)
      : i.searchTerm &&
        i.searchTerm.toLowerCase().includes(e.toLowerCase()) &&
        r.push(i);
  return n.concat(r);
}
async function xs(t, e, n) {
  for (; n.firstChild; ) n.firstChild.remove();
  for (const r of e) {
    const i = document.createElement("div");
    if (
      (r.populator
        ? i.addEventListener("click", async () => {
            K3();
            const a = await r.populator();
            a
              ? Q3(
                  "Search...",
                  (s, o, l, u) => {
                    l(r.populatorV ?? t, u(a, o), s);
                  },
                  (s) => {
                    xs(r.populatorV ?? t, a, s);
                  },
                )
              : di();
          })
        : r.children
          ? i.addEventListener("click", () => {
              Vi(
                "Search...",
                (a, s, o, l) => {
                  o(t, l(r.children, s), a);
                },
                (a, s) => {
                  s(t, r.children, a);
                },
              );
            })
          : i.addEventListener("click", () => {
              (di(), r.handler && r.handler());
            }),
      i.classList.add("item"),
      t === 1)
    ) {
      const a = document.createElement("span");
      ((a.innerText = r.name),
        i.appendChild(a),
        r.info &&
          Ls(
            a,
            `<mark style = 'padding: 3px; border-radius: 3px; background'>${r.info}</mark>`,
            0.8,
          ));
    } else {
      const a = document.createElement("h3");
      (va(a, r.icon), i.appendChild(a));
      const s = document.createElement("div");
      (s.classList.add("finder"),
        va(s, r.name),
        r.info && Ls(i, r.info, 0.5),
        i.appendChild(s));
    }
    n.appendChild(i);
  }
}
function Vi(t, e, n, r = !0) {
  if (xa) return;
  function i() {
    !o.firstChild && r
      ? ((o.innerHTML = "&nbsp;<br>&nbsp;&nbsp;No results<br>&nbsp;"),
        (vt = null))
      : o.firstChild &&
        ((vt = o.firstChild), vt && vt.classList.add("selected"));
  }
  (Zc(), di());
  const a = document.createElement("div");
  ((a.id = "paletteContainer"),
    a.addEventListener("click", di),
    Ie.session.on("change", di));
  const s = document.createElement("div");
  (s.addEventListener("click", (u) => u.stopPropagation()),
    s.classList.add("powerSearch"));
  const o = document.createElement("div");
  (o.classList.add("results"), n && (n(o, xs, cc), i()));
  const l = document.createElement("input");
  ((l.autocomplete = "off"),
    (l.placeholder = t),
    l.addEventListener("input", () => {
      if (!l.value) {
        if (n) (n(o, xs), i());
        else for (; o.firstChild; ) o.firstChild.remove();
        return;
      }
      (e(o, l.value, xs, cc), i());
    }),
    document.addEventListener("keydown", Ch),
    s.appendChild(l),
    s.appendChild(o),
    a.appendChild(s),
    $t.after(a),
    l.focus());
}
let Zt = [];
function Y0(t) {
  (Zt.unshift(t), Zt.length > 10 && Zt.pop());
}
function Lh(t, e, n) {
  notyf.success(`AI ${t} available in your notification palette`);
  const r = Date.now();
  Y0({
    name: `${e} - AI ${t} from ${new Date().toLocaleTimeString()} available`,
    icon: "✨",
    id: r,
    children: [
      { name: `View ${t}`, icon: "?", handler: n },
      {
        name: "Clear Notification",
        icon: "?",
        handler: () => {
          Zt = Zt.filter((i) => i.id !== r);
        },
      },
    ],
  });
}
async function Z3(t) {
  if (!(await Yn.getItem(t))) return;
  const e = Date.now();
  Y0({
    name: `${t} - Book was deleted at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} but is still available in local storage`,
    icon: "💡",
    id: e,
    children: [
      {
        name: "View Notebook",
        icon: "?",
        handler: async () => {
          await Pe(t);
        },
      },
      {
        name: "Remove from Local Storage",
        icon: "?",
        handler: async () => {
          (await Yn.removeItem(t), (Zt = Zt.filter((n) => n.id !== e)));
        },
      },
      {
        name: "Clear Notification",
        icon: "?",
        handler: () => {
          Zt = Zt.filter((n) => n.id !== e);
        },
      },
    ],
  });
}
function io(t, { content: e, aceSessions: n }) {
  const r = Date.now();
  Y0({
    name: `${t} - A state from ${new Date().toLocaleTimeString()} is available to recover`,
    icon: "&#8617;",
    id: r,
    children: [
      {
        name: "Restore State",
        icon: "?",
        handler: async () => {
          (await Pe(t, { state: { content: e, aceSessions: n } }),
            (Zt = Zt.filter((i) => i.id !== r)));
        },
      },
      {
        name: "Compare to Current State",
        icon: "?",
        handler: async () => {
          G0(await _n(t, "content"), e);
        },
      },
      {
        name: "Clear Notification",
        icon: "?",
        handler: () => {
          Zt = Zt.filter((i) => i.id !== r);
        },
      },
    ],
  });
}
function Mh() {
  Vi(
    "Search notifications...",
    (t, e, n, r) => {
      n(2, r(Zt, e), t);
    },
    (t, e) => {
      e(2, Zt, t);
    },
  );
}
const Xt = new Set(yt("workspace", [])),
  gr = new Map();
async function zh(t, e) {
  I && I.name === t ? await Dn(t, e) : yn.get(t) && yn.delete(t);
}
async function Dn(t, e = { switchAsFallBack: !1 }) {
  if (!network.isOffline)
    try {
      await gr.get(t).close(e);
    } catch (n) {
      (e.switchAsFallBack && Pe(t), console.log(n));
    }
}
function Ai(t, e, n = !1) {
  try {
    gr.get(t).editText(e, n);
  } catch (r) {
    console.log(r);
  }
}
function Rs(t) {
  (ye(),
    (this.className.includes("tabExit") ? 1 : t.button) === 1 &&
      (t.stopPropagation(),
      t.preventDefault(),
      Dn(this.getAttribute("data-bookname"))));
}
class J3 {
  constructor(e, n, r) {
    ((this.name = e),
      (this.tabRef = n),
      (this.tippy = r),
      (this.alteredText = !1));
  }
  async close(
    {
      refresh: e = !1,
      goto: n = void 0,
      page: r = void 0,
      props: i = void 0,
      saveState: a = !1,
      state: s = null,
    } = {
      refresh: !1,
      goto: void 0,
      page: void 0,
      props: void 0,
      saveState: !1,
      state: null,
    },
  ) {
    (Xt.delete(this.name),
      Qe("workspace", Array.from(Xt)),
      gr.delete(this.name));
    const o = yn.get(this.name),
      l = o ? o.pgN : 0;
    let u = o
      ? { content: [...o.content], aceSessions: [...o.aceSessions] }
      : null;
    (yn.delete(this.name),
      this.tippy.destroy(),
      this.tabRef.removeEventListener("click", wr),
      this.tabRef.removeEventListener("mouseup", Rs),
      this.tabRef.children[1].removeEventListener("click", Rs),
      this.tabRef.remove(),
      !Xt.size && !e
        ? await Pe("home")
        : I &&
          this.name === I.name &&
          !e &&
          (await Pe(Array.from(Xt)[Array.from(Xt).length - 1])),
      e &&
        (await Pe(n || this.name, {
          refresher: e,
          page: r !== void 0 ? r : l,
          props: i,
          state: s,
        }),
        u && a && io(this.name, u)));
  }
  editText(e, n = !1) {
    (!this.alteredText || n) &&
      ((this.alteredText = n),
      (this.tabRef.firstChild.innerText = e),
      this.tippy.setContent(e),
      (document.title = e));
  }
  select() {
    (this.tabRef.classList.add("openTab"),
      gr.forEach((e, n) => {
        n != this.name && e.tabRef.classList.remove("openTab");
      }));
  }
}
function ao(t, e = !1) {
  if (gr.get(t) && e) {
    gr.get(t).select();
    return;
  } else if (gr.get(t)) return;
  function n(s, o) {
    o
      ? s.addEventListener("click", Rs)
      : (s.addEventListener("click", wr), s.addEventListener("mouseup", Rs));
  }
  const r = document.createElement("button");
  r.tabIndex = 0;
  const i = document.createElement("span");
  (i.classList.add("tabName"), (i.innerText = t), r.appendChild(i));
  const a = document.createElement("button");
  (a.setAttribute("data-bookname", t),
    a.classList.add("tabExit"),
    (a.innerText = "+"),
    n(a, !0),
    r.appendChild(a),
    r.classList.add("tab"),
    (r.id = `book__${t}`),
    r.setAttribute("data-bookname", t),
    n(r, !1),
    gr.set(
      t,
      new J3(
        t,
        r,
        Mn([r], {
          theme: "dark",
          animation: "shift-toward-subtle",
          placement: "bottom-end",
          content: t,
          arrow: !1,
        })[0],
      ),
    ),
    e && gr.get(t).select(),
    Hr.prepend(r),
    Xt.add(t),
    Qe("workspace", Array.from(Xt)));
}
function wr(t) {
  (window.isOnMobile && t.stopPropagation(),
    this.hasAttribute("data-page")
      ? Pe(this.getAttribute("data-bookname"), {
          page: parseInt(this.getAttribute("data-page")),
          props: this.getAttribute("data-props"),
        })
      : Pe(this.getAttribute("data-bookname"), {
          props: this.getAttribute("data-props"),
        }));
}
let ks;
function ev(t) {
  ks = t;
}
async function tv() {
  ((await Xe.patch.publish(I.name)).ok
    ? notyf.success("Notebook published")
    : notyf.error("There was an error publishing the notebook"),
    (I.isPublic = !0));
}
async function nv() {
  ((await Xe.patch.unpublish(I.name)).ok
    ? notyf.success("Notebook unpublished")
    : notyf.error("There was an error unpublishing the notebook"),
    (I.isPublic = !1));
}
let na;
async function rv(t) {
  if (!t && !na)
    return `# 🏷️ Tag Viewer

---

`;
  (t && Qe("recents_tags", bh(yt("recents_tags", []), t)),
    Ai("Tag-Viewer", `Tag: #${t || na}`, !0));
  let e = `# 🏷️ Tag Viewer

---

:tag[${t || na || ""}]

`;
  const n = await Xe.get.tagged(t || na);
  if (!n.ok) return ((e += "An error occurred when retrieving tags."), e);
  const i = (await n.json()).data.map((a) => `- :ref[${a.name}:${a.page}]`);
  return (
    (e += i.join(`
`)),
    t && (na = t),
    e
  );
}
function ha(t, e) {
  (Array.isArray(e) || (e = [e]),
    (Ps.find((r) => r.data.name === t).data.content = e));
  const n = yn.get(t);
  n && ((n.content = e), (n.aceSessions = []));
}
function Ft(t) {
  return Ps.some((e) => e.data.name === t);
}
const Ps = [
    {
      data: {
        name: "home",
        content: [
          `# 🏠 Welcome Home!

Use the __tree list__, the __toolbar__, the :ref[Note-Map], or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!`,
        ],
        reservedData: {
          beforeOpen: () => {
            ha(
              "home",
              `# 🏠 Welcome Home!

Use the __tree list__, the __toolbar__, the :ref[Note-Map], or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!

## Recent Notes

` +
                (yt("recents", []).map((t) => `- :ref[${t}]`).join(`
`) || "- N/A") +
                `

## Recent Tags

` +
                (yt("recents_tags", []).map((t) => `- :tag[${t}]`).join(`
`) ||
                  `- N/A
`),
            );
          },
        },
      },
    },
    {
      data: {
        name: "mobile_home",
        content: [
          `# 🏠 Welcome Home!

### ⚠️ WIP

This is the **mobile version**. Notes are read only as of right now!

Tap the button in the **bottom-right** corner to access the :ref[Note-Map] at any time and move between notebooks!

---

![](/assets/wip.jpg)`,
        ],
      },
    },
    {
      data: {
        name: "sticky__notes",
        content: [
          `# Sorry!

This notebook is reserved for storing your scratch pad content`,
        ],
      },
    },
    {
      data: {
        name: "flash__cards",
        content: [
          `# Sorry!

This notebook is reserved for storing your flashcard data.`,
        ],
      },
    },
    {
      data: {
        name: "AI-Summary",
        content: [
          `# Sorry!

This notebook is reserved for displaying AI Summaries.`,
        ],
      },
    },
    {
      data: {
        name: "Your-Uploads",
        content: [
          `# Sorry

This notebook name is reserved for previewing uploaded images.`,
        ],
        reservedData: {
          reservedButPageNavAllowed: !0,
          beforeOpen: () => {
            ha(
              "Your-Uploads",
              Fi.length
                ? Fi.map((t) => `${Da(t)}(/uploads/${t})`)
                : ["# Uploaded images and PDFs will appear in this notebook!"],
            );
          },
        },
      },
    },
    {
      data: {
        name: "Note-Map",
        content: [
          `# Note-Map

:fdg[]`,
        ],
      },
    },
    {
      data: {
        name: "__god",
        content: [
          `# Sorry!

This notebook is reserved for storing important information!`,
        ],
      },
    },
    {
      data: {
        name: "Tag-Viewer",
        content: [
          `# 🏷️ Tag Viewer

---

`,
        ],
        reservedData: {
          afterOpen: async (t) => {
            const e = await rv(t);
            (ha("Tag-Viewer", e), vn(!1));
          },
        },
      },
    },
    {
      data: {
        name: "Public-Notebook",
        content: [
          `# Sorry!

This notebook is reserved for viewing public notebooks.`,
        ],
        reservedData: {
          reservedButPageNavAllowed: !0,
          afterOpen: () => {
            ks && Ai("Public-Notebook", `${ks[0]} (${ks[1]})`, !0);
          },
        },
      },
    },
  ],
  ls = { parents: [], children: [], content: [""], _data: null };
async function _n(t, e) {
  if (Ft(t))
    return e === "_data"
      ? Ps.find((r) => r.data.name === t).data
      : Ps.find((r) => r.data.name === t).data[e] || ls[e];
  if (Wn && (e === "parents" || e === "children")) {
    const r = Wn.find((i) => i.name === t);
    return r ? r[e] : ls[e];
  } else if (yn.get(t) && (e !== "parents" || e !== "children")) {
    const r = { data: yn.get(t) };
    return e === "_data" ? r.data : r.data[e];
  }
  const n = await Xe.get.notebooks(t);
  if (n.ok) {
    let r = await n.json();
    return e === "_data" ? r.data : r.data[e];
  } else
    return (
      n.status === 404 ||
        notyf.error(`There was an error retrieving content for ${t}`),
      ls[e]
    );
}
async function Dh(t) {
  const e = await Xe.get.family(t);
  return e.ok ? (await e.json()).data : [];
}
async function iv(t, e) {
  if (network.isOffline) return;
  const n = await Xe.get.notebooks(e);
  n.status === 404 && e && t && !Ft(t)
    ? (await Xe.put.saveNotebooks(e, { content: [""] })).ok
      ? (await Yn.setItem(e, { content: [""], timestamp: Date.now() }),
        await Dn(e, { refresh: !0, saveState: !0, switchAsFallBack: !0 }),
        X0(e, t))
      : notyf.error("An error occurred when saving a notebook")
    : n.ok
      ? notyf.error("A notebook with that name already exists")
      : Ft(t)
        ? notyf.error("That notebook name is reserved")
        : notyf.error("An error occurred");
}
async function av(t, e) {
  if (network.isOffline) return;
  if ((await Xe.get.notebooks(t)).status === 404 && t && e) {
    if (yn.get(e) && yn.get(e).isEncrypted) {
      notyf.error("Encrypted notebooks can't be copied");
      return;
    }
    const r = await _n(e, "content");
    (await Xe.put.saveNotebooks(t, { content: r })).ok
      ? (await Yn.setItem(t, { content: r, timestamp: Date.now() }),
        ar(),
        Dn(t, { refresh: !0, saveState: !0, switchAsFallBack: !0 }))
      : notyf.error("An error occurred when saving a notebook");
  } else notyf.error("Something went wrong");
}
async function X0(t, e) {
  network.isOffline ||
    (t && e && !Ft(t)
      ? (await Xe.patch.nest(t, e)).ok
        ? (yn.get(t), ar())
        : notyf.error("An error occurred when nesting a notebook")
      : notyf.error("Something went wrong"));
}
async function Ih(t, e) {
  network.isOffline ||
    (t && e
      ? (await Xe.patch.relinquish(t, e)).ok
        ? (lv(t, e), ar())
        : notyf.error("An error occurred when relinquishing a notebook")
      : notyf.error("Something went wrong"));
}
function Pr(t, e) {
  (Vi(
    {
      open: "Enter a book name",
      child: "Enter a name for the child",
      copy: "Enter a name for the copy",
      rename: "Enter a new name",
    }[e],
    (r, i, a) => {
      a(
        2,
        [
          {
            name: i,
            icon: "📖",
            handler: () => {
              switch (e) {
                case "open":
                  Pe(i);
                  break;
                case "child":
                  iv(t, i);
                  break;
                case "copy":
                  av(i, t);
                  break;
                case "rename":
                  bv(t, i);
                  break;
              }
            },
          },
        ],
        r,
      );
    },
    null,
    !1,
  ),
    ye());
}
function d0(t, e) {
  Kt(
    t,
    [
      e
        ? { text: "Open Notebook", click: () => Pr(I.name, "open") }
        : {
            props: this.getAttribute("data-bookname"),
            text: "Open Notebook",
            click: (n) => {
              (Pe(n), ye());
            },
          },
      e
        ? null
        : {
            props: this.getAttribute("data-bookname"),
            text: "Open in Background",
            click: (n) => {
              (ao(n, !1), ye());
            },
          },
      e
        ? null
        : {
            props: this.getAttribute("data-bookname"),
            text: "Open & Close Current Tab",
            click: (n) => {
              (Dn(I.name, { refresh: !0, goto: n, page: 0 }), ye());
            },
          },
      { spacer: !0 },
      {
        props: e ? I.name : this.getAttribute("data-bookname"),
        text: "Rename Notebook",
        click: (n) => Pr(n, "rename"),
      },
      {
        props: e ? I.name : this.getAttribute("data-bookname"),
        text: "Copy Notebook",
        click: (n) => Pr(n, "copy"),
      },
      e
        ? null
        : {
            props: e ? void 0 : this.getAttribute("data-bookname"),
            text: "Delete Notebook",
            click: (n, r) => ci(r, () => Q0(e ? I.name : n)),
          },
      { spacer: !0 },
      {
        props: e ? void 0 : this.getAttribute("data-bookname"),
        text: "Nest Notebook",
        populator: async (n) => {
          const r = e ? I.name : n,
            i = await Dh(r);
          return Wn.reduce(
            (a, s) => (
              s.name !== r &&
                !i.includes(s.name) &&
                a.push({
                  text: s.name,
                  click: () => {
                    (X0(r, s.name), ye());
                  },
                }),
              a
            ),
            [],
          );
        },
      },
      {
        props: e ? "" : this.getAttribute("data-bookname"),
        text: "Relinquish Notebook",
        populator: async function (n) {
          const r = e ? I.name : n;
          return (await _n(r, "parents")).map((i) => ({
            text: i,
            click: () => {
              (Ih(r, i), ye());
            },
          }));
        },
      },
      {
        props: e ? I.name : this.getAttribute("data-bookname"),
        text: "Create Child",
        click: (n) => Pr(n, "child"),
      },
      { spacer: !0 },
      {
        props: e ? I.name : this.getAttribute("data-bookname"),
        text: "Force Update",
        click: (n, r) =>
          ci(r, () => {
            K0(n);
          }),
      },
    ],
    e ? [`${t.clientX - 160}px`, "75px"] : null,
  );
}
const Ti = [],
  h0 = [];
let Ss;
const on = yt("fileStructure", []),
  dc = { name: "$root", children: [], excerpt: [], parents: [] };
function sv(t, e) {
  (on.forEach((n) => {
    (n.name === t && (n.name = e), n.parentName === t && (n.parentName = e));
  }),
    Qe("fileStructure", on));
}
function ov(t) {
  const e = on.findIndex((n) => n.name === t || n.parentName === t);
  (e !== -1 && on.splice(e, 1), Qe("fileStructure", on));
}
function lv(t, e) {
  const n = on.findIndex((r) => r.name === t && r.parentName === e);
  (n !== -1 && on.splice(n, 1), Qe("fileStructure", on));
}
async function Nh(t) {
  const e = I.content.reduce((n, r, i) => {
    if (i >= 9) {
      const a = i === I.pgN ? "currPage" : "random";
      n.push({
        text: `Page ${i}`,
        click: (s, o, l) => {
          (ln(i), Nh(l));
        },
        appearance: a,
      });
    }
    return n;
  }, []);
  Kt(t, e, ["21px", `${ua.scrollHeight + 5}px`], !0);
}
function hc(t) {
  if ((t.stopPropagation(), ye(), this.hasAttribute("data-down"))) {
    const e = on.findIndex(
      (n) =>
        n.name === this.parentNode.getAttribute("data-bookname") &&
        n.parentName === this.getAttribute("data-parent"),
    );
    (e !== -1 && on.splice(e, 1),
      (this.nextElementSibling.style.display = "none"),
      this.classList.remove("down"),
      this.removeAttribute("data-down"));
  } else
    (on.find(
      (e) =>
        e.name === this.parentNode.getAttribute("data-bookname") &&
        e.parentName === this.getAttribute("data-parent"),
    ) ||
      on.push({
        name: this.parentNode.getAttribute("data-bookname"),
        parentName: this.getAttribute("data-parent"),
      }),
      (this.nextElementSibling.style.display = "flex"),
      this.classList.add("down"),
      this.setAttribute("data-down", ""));
  Qe("fileStructure", on);
}
async function fa(t, e = !1) {
  if (f0 && !e) return;
  (Ti.forEach((i) => {
    i.element.removeEventListener(i.type, i.listener);
  }),
    (Ti.length = 0),
    (Ss = new Set()));
  const n = t || Wn;
  dc.children = n.map((i) => i.name);
  const r = Fh(dc, n).childNodes[1];
  for (r.classList.add("gigaFolder"); hs.firstChild; ) hs.firstChild.remove();
  (hs.appendChild(r),
    r.firstChild ||
      (r.classList.add("emptyTree"),
      va(r, "<span class = 'leaves'>🍃</span><span>No results</span>")),
    t ||
      (h0.forEach((i) => {
        i.element.removeEventListener(i.type, i.listener);
      }),
      (h0.length = 0),
      uv(),
      (ga.value = "")),
    Ss.forEach(() => {
      for (const i of r.childNodes)
        if (Ss.has(i.firstChild.getAttribute("data-bookname"))) {
          i.remove();
          break;
        }
    }));
}
async function ar(t = !0) {
  if (!t) fa(Wn);
  else {
    const e = await Xe.get.list();
    if (!e.ok && !Wn) {
      (notyf.error("An error occurred when creating the list"), fa());
      return;
    }
    const n = await e.json();
    (_m(n.data), fa());
  }
}
function Fh(t, e, n = "$root") {
  t.parents.length > 0 && Ss.add(t.name);
  const r = document.createElement("div");
  (r.setAttribute("data-bookname", t.name), r.classList.add("item"));
  const i = document.createElement("button");
  (i.setAttribute("data-bookname", t.name),
    i.setAttribute("data-parent", n),
    i.classList.add("folderName"),
    i.addEventListener("contextmenu", d0),
    Ti.push({ element: i, type: "contextmenu", listener: d0 }),
    i.addEventListener("click", hc),
    Ti.push({ element: i, type: "click", listener: hc }),
    (i.innerText = t.name),
    r.appendChild(i));
  const a = document.createElement("ul");
  r.appendChild(a);
  for (let s = 0, o = t.excerpt.length; s < o; s++) {
    const l = document.createElement("li"),
      u = document.createElement("button");
    (u.classList.add("listPage"),
      u.setAttribute("data-page", s),
      u.setAttribute("data-bookname", t.name),
      u.addEventListener("click", wr),
      Ti.push({ element: u, type: "click", listener: wr }),
      t.isEncrypted
        ? (u.innerHTML = "<i>Encrypted</i>")
        : t.excerpt[s]
          ? (u.innerText = t.excerpt[s])
          : (u.innerHTML = "<i>No title</i>"),
      u.addEventListener("contextmenu", ka),
      Ti.push({ element: u, type: "contextmenu", listener: ka }),
      l.appendChild(u),
      a.appendChild(l));
  }
  return (
    t.children.length > 0 &&
      t.children.forEach((s) => {
        const o = document.createElement("li");
        (o.appendChild(
          Fh(
            e.find((l) => l.name === s),
            e,
            t.name,
          ),
        ),
          a.prepend(o));
      }),
    on.find((s) => s.name === t.name && s.parentName === n) &&
      (i.setAttribute("data-down", ""),
      (a.style.display = "flex"),
      i.classList.add("down")),
    r.appendChild(a),
    r
  );
}
function fc(t) {
  ka(
    t,
    `${Da(this.getAttribute("data-href"))}(${this.getAttribute("data-href")})`,
  );
}
async function uv() {
  const t = await Xe.get.imageList();
  if (!t.ok) {
    notyf.error("An error occurred when creating the image-list");
    return;
  }
  const e = await t.json();
  Om(e.data);
  const n = Es.nextSibling.nextSibling;
  for (Es.setAttribute("data-children", Fi.length); n.firstChild; )
    n.firstChild.remove();
  (Fi.map((r, i) => {
    const a = document.createElement("button");
    (a.classList.add("listPage"),
      a.addEventListener("contextmenu", fc),
      h0.push({ element: a, type: "contextmenu", listener: fc }),
      a.setAttribute("data-href", `/uploads/${r}`),
      a.setAttribute("data-bookname", "Your-Uploads"),
      a.setAttribute("data-page", i),
      (a.innerText = r),
      a.addEventListener("click", wr));
    const s = document.createElement("li");
    (s.appendChild(a), n.appendChild(s));
  }),
    zh("Your-Uploads", { refresh: !0 }));
}
let f0 = !1;
async function cv(t) {
  if (t) {
    const e = await Xe.get.fuzzy(t);
    if (e.ok) {
      const r = (await e.json()).data.map((i) => ({
        name: i.item.name,
        excerpt: i.item.content.map((a) => Ri(a)),
        children: [],
        parents: [],
      }));
      (fa(r, !0), (f0 = !0));
    }
  } else ((f0 = !1), fa(Wn));
}
async function ka(t, e, n) {
  (t.preventDefault(), t.stopPropagation());
  const r =
      t.currentTarget.id.substring(0, 7) === "whereTo"
        ? 30
        : parseInt(jn.style.width) + 30,
    i = t.currentTarget.getAttribute("data-page"),
    a = document.createElement("div");
  (a.classList.add("listPreview"),
    (a.style.left = `${r}px`),
    (a.style.top =
      t.clientY + 340 <= window.innerHeight
        ? `${t.clientY}px`
        : "calc(100vh - 340px)"));
  const s = document.createElement("div");
  (s.classList.add("pagePreviewContainer"),
    e && n
      ? va(s, e)
      : e && !n
        ? (s.innerHTML = Zr(e))
        : (s.innerHTML = Zr(
            (
              await _n(t.currentTarget.getAttribute("data-bookname"), "content")
            )[i],
          )),
    a.appendChild(s),
    Eh(s, !1),
    Im(a));
}
function dv(t, e) {
  return "Encrypted notebooks are gone";
}
function hv(t, e) {
  return "Encrypted notebooks are gone";
}
function fv(t, e) {
  return !0;
}
let gn = [];
function Sa(t) {
  gn = t;
}
function mv(t) {
  gn = gn.filter((e) => e.subject !== t);
}
function pv(t, e) {
  gn = gn.map((n) => (n.subject === t && (n.subject = e), n));
}
async function gv() {
  const t = await Xe.get.flashcards();
  if (t.ok) {
    let e = await t.json();
    Sa(e.data);
  } else
    t.status === 404
      ? Sa([])
      : notyf.error("An error occurred when loading your flashcards");
}
async function nr() {
  if (network.isOffline) return;
  (Sa(
    gn.filter(
      (e) =>
        e.front &&
        e.front !==
          `
` &&
        e.back &&
        e.back !==
          `
`,
    ),
  ),
    (
      await Xe.put.saveNotebooks("flash__cards", {
        content: [JSON.stringify(gn)],
      })
    ).ok || notyf.error("An error occurred when saving the flashcards"));
}
const _h = /^(?!api$)(?!uploads$)(?!assets$)[a-zA-Z0-9-_~.]+$/,
  vv = ["sticky__notes", "flash__cards", "user__config", "snippets", "__god"];
let ra = !1;
async function Pe(
  t,
  { page: e = void 0, refresher: n = !1, props: r = "", state: i = null } = {
    page: void 0,
    refresher: !1,
    props: "",
    state: null,
  },
) {
  if (
    ra ||
    (typeof e != "number" && !isNaN(parseInt(e))
      ? (e = parseInt(e))
      : typeof e != "number" && (e = void 0),
    r && !Array.isArray(r) ? (r = [r]) : r || (r = []),
    n && Nl(null),
    I && t === I.name && e === I.pgN)
  )
    return;
  if (!_h.test(t)) {
    (notyf.error("Invalid note name"), I || Pe("home"));
    return;
  }
  if (I && I.name === t && e !== void 0) {
    ln(e);
    return;
  }
  if (Xt.size === 1 && Xt.has("home") && t !== "home" && !n) {
    Dn("home", { refresh: !0, goto: t, page: e, props: r });
    return;
  }
  if (network.isOffline) return;
  ra = !0;
  let a;
  ((a = (await _n(t, "_data")) || {
    name: t,
    content: [""],
    children: [],
    parents: [],
    saved: !1,
    isEncrypted: !1,
    isPublic: !1,
  }),
    a.reservedData &&
      a.reservedData.beforeOpen &&
      !Array.isArray(a.reservedData.beforeOpen) &&
      (a.reservedData.beforeOpen = [a.reservedData.beforeOpen]),
    a.reservedData &&
      a.reservedData.afterOpen &&
      !Array.isArray(a.reservedData.afterOpen) &&
      (a.reservedData.afterOpen = [a.reservedData.afterOpen]));
  try {
    if (a.isEncrypted && a.password === void 0) {
      if (
        ((a.password =
          prompt(`Enter your password for notebook: ${t}`) || void 0),
        a.password == null)
      ) {
        ((ra = !1), Pe("home"));
        return;
      }
      fv(a.content[0], a.password) &&
        ((a.content = a.content.map((l) => hv(l, a.password))),
        document.body.classList.add("isEncrypted"));
    } else
      a.isEncrypted
        ? document.body.classList.add("isEncrypted")
        : document.body.classList.remove("isEncrypted");
  } catch {
    ((ra = !1),
      Pe("home"),
      notyf.error("Something went wrong. Try again in a second"));
    return;
  }
  if (a.reservedData && a.reservedData.beforeOpen)
    for (const l of a.reservedData.beforeOpen) l(...r);
  (Ft(t) || Qe("recents", bh(yt("recents", []), t)),
    Nl({}),
    (I.name = t.replaceAll("/", "")),
    (I.isEncrypted = a.isEncrypted || !1),
    a.saved === void 0 || a.saved ? (I.saved = !0) : (I.saved = !1));
  let s = await Yn.getItem(t),
    o;
  if (I.isEncrypted) o = a.content;
  else if (!I.isEncrypted && s && I.saved) {
    if (s.timestamp > a.date) o = s.content;
    else if (((o = a.content), !yh(s.content, a.content))) {
      const l = { content: [...s.content], aceSessions: [] };
      io(t, l);
    }
  } else s ? (o = s.content) : (o = a.content);
  if (
    (e === void 0 && a.pgN !== void 0
      ? (e = a.pgN)
      : e !== void 0 && (e >= o.length || e < 0)
        ? (e = a.content.length - 1)
        : e === void 0 && (e = 0),
    (I.content = o),
    (I.aceSessions = a.aceSessions || []),
    i)
  )
    for (const [l, u] of Object.entries(i)) I[l] = u;
  if (
    ((I.pgN = e),
    (I.password = I.isEncrypted ? a.password : void 0),
    (I.dbSave = a.dbSave || [...a.content]),
    (I.date = a.date),
    (I.reservedData = a.reservedData || null),
    (I.isPublic = a.isPublic || !1),
    ao(I.name, !0),
    Ft(I.name)
      ? ((document.getElementById("newPage").style.display = "none"),
        toolBar.classList.add("homeToolBar"),
        I.reservedData && I.reservedData.reservedButPageNavAllowed
          ? toolBar.classList.remove("pageNavDisabled")
          : toolBar.classList.add("pageNavDisabled"),
        (I.readOnly = !0),
        Ie.setReadOnly(!0))
      : ((document.getElementById("newPage").style.display = "inline"),
        toolBar.classList.remove("pageNavDisabled"),
        toolBar.classList.remove("homeToolBar"),
        (I.readOnly = !1),
        Ie.setReadOnly(!1)),
    yn.set(I.name, I),
    vn(...r),
    a.reservedData && a.reservedData.afterOpen)
  )
    for (const l of a.reservedData.afterOpen) l(...r);
  ra = !1;
}
async function K0(t = I.name) {
  const e = yn.get(t);
  (e && e.isEncrypted) ||
    (await Yn.removeItem(t),
    await zh(t, { refresh: !0, saveState: !0 }),
    notyf.success(`Local data for ${t} has been deleted`));
}
function Oh(t = I.pgN) {
  if (!Ft(I.name)) {
    if (I.content.length > 1) {
      if (!I.isEncrypted) {
        const n = I.content[t],
          r = { content: [...I.content], aceSessions: [...I.aceSessions] };
        n && io(I.name, r);
      }
      (I.aceSessions.splice(t, 1), I.content.splice(t, 1));
      let e;
      (t === I.content.length ? (e = t - 1) : t === 0 ? (e = 0) : (e = t),
        (I.pgN = e),
        vn());
    } else (Ie.setValue(""), vn());
    ni && Hi(I.name, !0);
  }
}
async function Hi(t, e = !1) {
  if (network.isOffline) return;
  if (!_h.test(t) || Ft(t)) {
    notyf.error("Something went wrong");
    return;
  }
  const n = Date.now(),
    r = yn.get(t);
  if (r) {
    let s = function (u) {
      const h = [],
        d = [];
      for (let p = 0; p < u.content.length; p++)
        u.content[p] && (h.push(u.content[p]), d.push(u.aceSessions[p]));
      (h.length || h.push(""), (u.content = h), (u.aceSessions = d));
    };
    var i = s;
    const a = { content: [...r.content], aceSessions: [...r.aceSessions] };
    (e || s(r),
      r.isEncrypted ||
        (await Yn.setItem(r.name, { content: I.content, timestamp: n })));
    const o = await Xe.put.saveNotebooks(r.name, {
        content: r.isEncrypted
          ? r.content.map((u) => dv(u, r.password))
          : r.content,
        isEncrypted: r.isEncrypted,
        timestamp: n,
      }),
      l = I.saved;
    (o.ok
      ? (r.name === I.name
          ? (e ||
              (areNotesSavedIcon.classList.add("saved"),
              r.pgN > r.content.length - 1 ? ln(r.content.length - 1) : vn(!1)),
            (r.dbSave = [...r.content]),
            (r.saved = !0),
            (r.date = n),
            Th())
          : ((r.dbSave = [...r.content]), (r.saved = !0), (r.date = n)),
        e || notyf.success("Notebook was saved"),
        !r.isEncrypted && a.content.length !== r.content.length && io(t, a))
      : notyf.error("An error occurred when saving a notebook"),
      ar(!l));
  }
}
async function Q0(t) {
  if (network.isOffline) return;
  const e = await Xe.del.notebooks(t);
  e.ok
    ? (notyf.success("Notebook has been deleted from the database"),
      Dn(t),
      mv(t),
      ov(t),
      ar(),
      Z3(t))
    : e.status === 404
      ? notyf.error("This notebook is not saved to the database")
      : notyf.error("An error occurred when deleting a notebook");
}
async function bv(t, e) {
  if (network.isOffline) return;
  const n = await _n(t, "_data");
  if (!n) {
    notyf.error("Notebook not found");
    return;
  }
  if (n.isEncrypted) {
    notyf.error("Encrypted notebooks can't be renamed");
    return;
  }
  const r = await Xe.patch.rename(t, e);
  if (r.ok) {
    (await Yn.setItem(e, { content: n.content, timestamp: Date.now() }),
      await Yn.removeItem(t),
      sv(t, e));
    let i = yt("recents", []);
    ((i = i.map((a) => (a === t ? e : a))),
      Qe("recents", i),
      n.aceSessions || (n.aceSessions = []),
      n.dbSave || (n.dbSave = [...n.content]),
      n.saved === void 0 && (n.saved = !0),
      pv(t, e),
      await Dn(t, {
        refresh: !0,
        goto: e,
        state: {
          name: e,
          content: [...n.content],
          aceSessions: [...n.aceSessions],
          dbSave: [...n.dbSave],
          saved: n.saved,
          isEncrypted: n.isEncrypted,
          date: n.date,
        },
      }),
      ar());
  } else {
    const i = await r.json();
    notyf.error(i.error || "An error occurred");
  }
}
function mc(t) {
  (Wr.classList.add("currPage"),
    (document.body.style.cursor = "w-resize"),
    t.clientX <= 600 &&
      t.clientX >= 200 &&
      ((jn.style.width = `${t.clientX - 16}px`),
      (Gs.style.width = `calc(100% - 25px - ${t.clientX - 16}px)`)));
}
function Z0() {
  ((jn.style.display = "none"),
    (Wr.style.display = "none"),
    (Hr.style.padding = "5px"),
    (Gs.style.width = "calc(100% - 20px"),
    jn.removeAttribute("data-shown"),
    Qe("listShown", !1));
}
function J0() {
  ((jn.style.display = "flex"),
    (Wr.style.display = "inline"),
    (Hr.style.padding = "5px 5px 5px 0"),
    (Gs.style.width = `calc(100% - 25px - ${yt("listSize", "300px")})`),
    jn.setAttribute("data-shown", ""),
    Qe("listShown", !0));
}
var Bh = () => (jn.hasAttribute("data-shown") ? Z0() : J0());
function yv() {
  (Array.from(Xt).forEach((t) => ao(t)),
    (jn.style.width = yt("listSize", "350px")),
    yt("listShown") === !1 ? Z0() : J0());
}
let Hs = !1;
async function Rh(t, e, n) {
  if (network.isOffline) return;
  if (I.isEncrypted)
    return (
      notyf.error("AI Features are unavailable on encrypted notebooks"),
      null
    );
  ((Hs = !0), pm());
  const r = await Xe.post[n]({ content: t, prompt: e });
  return ((Hs = !1), gm(), r.ok ? (await r.json()).data : 0);
}
async function qs(t = "chatgpt") {
  if (network.isOffline) return;
  if (I.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return;
  }
  const e = I.name,
    n = I.pgN + 1,
    r = await Rh(
      I.content[I.pgN || 0],
      "Summarize the given content. Surround any tex expressions with dollar signs",
      t,
    );
  r !== 0
    ? (ha("AI-Summary", [
        `# ✨ AI Summary (:ref[${e}:${n}])

${r.replaceAll(
  "<br>",
  `
`,
)}`,
      ]),
      Lh("Summary", e, async () => {
        await Pe("AI-Summary");
      }))
    : notyf.error("A summary could not be generated");
}
function wv() {
  Jn.hasAttribute("data-disabled") && so();
}
function so() {
  (Jn.classList.toggle("grayscale"),
    Jn.hasAttribute("data-disabled")
      ? Jn.removeAttribute("data-disabled")
      : Jn.setAttribute("data-disabled", ""));
}
async function xv(t) {
  let e = window.getSelection().toString();
  if (
    !(
      e.includes(`
`) || !e.length
    ) &&
    !Jn.hasAttribute("data-disabled") &&
    !I.isEncrypted
  ) {
    let n = e.trim().replace(/ /g, "_").toLowerCase();
    document.body.style.cursor = "wait";
    try {
      const r = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${n}?redirect=true`,
        { cache: "default" },
      );
      if (r.ok) {
        const i = await r.json();
        let a = `<b>${e.trim()}</b>:<br>${DOMPurify.sanitize(i.extract_html)}<a href = 'https://en.wikipedia.org/wiki/${n}' target = '_blank'>Learn More</a>`;
        (td.setContent(`<div id = 'brain'>${a}</div>`), Us(t, "🧠"));
      }
      document.body.style.cursor = "inherit";
    } catch {
      document.body.style.cursor = "inherit";
    }
  }
}
function Us(t, e) {
  if (!t.clientY || !t.clientX) return;
  ((fs.style.top = `${t.clientY}px`), (fs.style.left = `${t.clientX}px`));
  const n = document.createElement("p");
  ((n.innerHTML = e),
    fs.appendChild(n),
    n.classList.add("wikipediaBrainAnimation"),
    n.addEventListener("animationend", n.remove, { once: !0 }));
}
let Ur = [];
function Ph() {
  if (Ur.length === 0) {
    (document.body.classList.remove("alerted"), qi([rt("fcAlert")]));
    return;
  }
  const t = Ur[Ur.length - 1];
  if (rt("fcAlert")) {
    ((rt("fcAlert").innerText = t.text),
      (rt("fcAlert").style.backgroundColor = t.color));
    return;
  }
  const e = document.createElement("div");
  ((e.id = "fcAlert"),
    (e.innerText = t.text),
    (e.style.backgroundColor = t.color),
    document.body.classList.add("alerted"),
    mainContainer.after(e));
}
function Hh(t, e, n = qr ? qr.destructive : "red") {
  Ur.find((r) => r.id === t) || (Ur.push({ id: t, text: e, color: n }), Ph());
}
function qh(t) {
  (t ? (Ur = Ur.filter((e) => e.id !== t)) : Ur.pop(), Ph());
}
let Ci = null;
function kv() {
  Ci && (Ci(new Error("Exited")), (Ci = null));
}
async function Sv() {
  if (network.isOffline) return;
  if (I.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return;
  }
  Vs();
  const t = I.name;
  let e = [],
    n = await Rh(
      I.content[I.pgN || 0],
      "Create flashcards from this note. Use GitHub flavored markdown to create a table of 2 columns, one column being terms and the other being definitions. Do not use any HTML tags.",
      "chatgpt",
    );
  if (n === 0) return notyf.error("Flashcards could not be generated");
  const r = document.createElement("div");
  r.innerHTML = Zr(n, { includeDirs: !1 });
  let i = 1;
  if (r.getElementsByTagName("table")[0]) {
    for (const a of r.getElementsByTagName("table")[0].rows)
      a.children[0].innerText &&
        a.children[0].innerText &&
        e.push({
          subject: t,
          front: a.children[0].innerText.replaceAll(
            "<br>",
            `
`,
          ),
          back: a.children[1].innerText.replaceAll(
            "<br>",
            `
`,
          ),
          id: Date.now() + i++,
          ai_generated: !0,
          learning: "unattempted",
        });
    Lh("Flashcards", t, async () => {
      try {
        ((e = await Vh(e)), Sa(gn.concat(e)), nr(), In(!0, [t]));
      } catch (a) {
        a.message === "Unsaved" && In(!0, [t]);
      }
    });
  } else
    (I.isEncrypted || notyf.error("Flashcards could not be generated"), Vs());
}
let ki, Vo;
function Uh(t) {
  t.target.id !== "fill" &&
    t.target.id !== "notesPreviewArea" &&
    (Vo && Vo.classList.remove("fcSelection"),
    t.target.classList.add("fcSelection"),
    (Vo = t.target));
}
function $h(t) {
  t.target.id !== "fill" &&
    t.target.id !== "notesPreviewArea" &&
    (ki.children[1].innerText = t.target.innerText);
}
function $s() {
  if (!I.saved) {
    notyf.error("Flashcards can only be created for saved notebooks");
    return;
  }
  (Vs(),
    document.body.classList.add("flashcardMode"),
    Z0(),
    wv(),
    Jn.classList.add("grayscale"));
  const t = document.createElement("div");
  ((t.id = "fcArea"), t.addEventListener("click", ye));
  const e = document.createElement("div");
  e.classList.add("fcButtons");
  const n = document.createElement("button");
  ((n.innerHTML = "✨ Generate Cards"),
    Ls(n, I.isEncrypted ? "Unavailable" : "ChatGPT"),
    n.addEventListener("click", Sv),
    (Hs || I.isEncrypted) && n.classList.add("unavailable"),
    e.appendChild(n),
    t.appendChild(e));
  const r = document.createElement("div");
  r.classList.add("cardContainer");
  const i = document.createElement("div");
  (i.classList.add("cardHeader"), (i.innerText = "Front"), r.appendChild(i));
  const a = document.createElement("div");
  (a.classList.add("currCard"),
    (a.contentEditable = !0),
    (a.spellcheck = !1),
    a.addEventListener("focus", () => {
      (ye(),
        ki.classList.remove("currCard"),
        a.parentElement.classList.add("currCard"),
        (ki = a.parentElement));
    }),
    r.appendChild(a));
  const s = document.createElement("div");
  s.classList.add("cardContainer");
  const o = document.createElement("div");
  (o.classList.add("cardHeader"), (o.innerText = "Back"), s.appendChild(o));
  const l = document.createElement("div");
  ((l.contentEditable = !0),
    (l.spellcheck = !1),
    l.addEventListener("focus", () => {
      (ye(),
        ki.classList.remove("currCard"),
        l.parentElement.classList.add("currCard"),
        (ki = l.parentElement));
    }),
    l.classList.add("cardBack"),
    s.appendChild(l),
    (ki = a),
    a.classList.add("cardFront"));
  const u = document.createElement("div");
  u.classList.add("fcButtons");
  const h = document.createElement("button");
  ((h.innerText = "💾 Save"),
    h.addEventListener(
      "click",
      (p) => {
        a.innerText && l.innerText
          ? (gn.push({
              subject: I.name,
              front: a.innerText,
              back: l.innerText,
              id: Date.now(),
              ai_generated: !1,
              learning: "unattempted",
            }),
            Us(p, "✔️"),
            $s(),
            nr())
          : (notyf.error("Both sides of flashcard must be populated"), $s());
      },
      { once: !0 },
    ));
  const d = document.createElement("button");
  ((d.innerText = "❌ Exit"),
    d.addEventListener("click", () => Vs(), { once: !0 }),
    u.appendChild(h),
    u.appendChild(d),
    t.appendChild(r),
    t.appendChild(s),
    t.appendChild(u),
    $t.after(t),
    Vr.addEventListener("click", $h),
    Vr.addEventListener("mouseover", Uh),
    a.focus(),
    Hh(
      "flashcard",
      `You are in flashcard mode, click some text to add it to the focused side of the flashcard.${I.isEncrypted ? " Flashcards are NOT encrypted!" : ""}`,
      qr.quizletPurpleAccents,
    ));
}
function Vs() {
  for (const t of document.getElementsByClassName("fcSelection"))
    t.classList.remove("fcSelection");
  (Vr.removeEventListener("click", $h),
    Vr.removeEventListener("mouseover", Uh),
    document.body.classList.remove("flashcardMode"),
    ye(),
    so(),
    J0(),
    qi([rt("fcArea")]),
    qh("flashcard"));
}
let ia = null;
function In(t, e) {
  !e && !ia ? ((ia = [I.name]), (e = ia)) : e ? (ia = e) : (e = ia);
  const n = Xs({ noAnimation: t }),
    r = gn.reduce(
      (h, d) => {
        if (!e.includes(d.subject)) return h;
        switch (d.learning) {
          case "unattempted":
            h[0].push(d);
            break;
          case "know":
            h[1].push(d);
            break;
          case "dontKnow":
            h[2].push(d);
            break;
        }
        return h;
      },
      [[], [], []],
    );
  let i = r.reduce((h, d) => ((h = h.concat(d)), h), []);
  const a = document.createElement("div");
  a.classList.add("extra");
  const s = document.createElement("button");
  (s.classList.add("reset"),
    (s.innerText = "📝 Edit"),
    s.addEventListener(
      "click",
      () => {
        pc(i);
      },
      { once: !0 },
    ),
    a.appendChild(s));
  const o = document.createElement("button");
  (o.classList.add("reset"),
    (o.innerText = "🔁 Reset All"),
    o.addEventListener("click", (h) => {
      Kt(h, [
        {
          text: "Confirm",
          click: () => {
            ((i = i.map((d) => {
              if (e.includes(d.subject))
                return ((d.learning = "unattempted"), d);
            })),
              nr(),
              In(!0));
          },
          appearance: "rios",
        },
      ]);
    }));
  const l = document.createElement("button");
  (l.classList.add("reset"),
    (l.innerText = "🗂️ Practice All"),
    l.addEventListener(
      "click",
      () => {
        Nr([i.shift()], i);
      },
      { once: !0 },
    ),
    a.appendChild(o),
    a.appendChild(l));
  const u = document.createElement("button");
  (u.classList.add("reset"),
    (u.id = "decks"),
    (u.innerText = u.innerText =
      e.length > 1 ? `🎴 ${e[0]} (+${e.length - 1})` : `🎴 ${e[0]}`),
    u.addEventListener("click", (h) => {
      const d = new Set(gn.map((p) => p.subject));
      Kt(
        h,
        Array.from(d).map((p) => ({
          text: ` ${p}`,
          click: () => {
            (e.includes(p) && e.length > 1
              ? (e = e.filter((m) => m !== p))
              : e.includes(p) || e.push(p),
              In(!0, e));
          },
          appearance: e.includes(p)
            ? "selected radioItem ios"
            : "radioItem ios",
        })),
        [
          `${h.target.getBoundingClientRect().left - 100}px`,
          `${h.target.getBoundingClientRect().top + 35}px`,
        ],
      );
    }),
    a.appendChild(u),
    n.appendChild(a),
    r.map((h, d) => {
      const p = document.createElement("div"),
        m = document.createElement("div");
      m.classList.add("fcGroupInfo");
      const y = document.createElement("span"),
        S = ["Unattempted - ", "Know - ", "Don't Know - "];
      ((y.innerText = "0"), (m.innerText = S[d]), m.appendChild(y));
      const A = document.createElement("div");
      (A.addEventListener("wheel", (C) => {
        (C.preventDefault(), A.scroll({ left: A.scrollLeft + C.deltaY }));
      }),
        A.classList.add("fcCardList"),
        h.forEach((C) => {
          y.innerText = parseInt(y.innerText) + 1;
          const b = document.createElement("button");
          ((b.tabIndex = 0),
            b.addEventListener(
              "click",
              () =>
                Nr(
                  h.splice(
                    h.findIndex((T) => T.id === C.id),
                    1,
                  ),
                  h,
                ),
              { once: !0 },
            ),
            b.addEventListener("contextmenu", (T) => {
              Kt(T, [
                {
                  text: "Edit Card",
                  click: () => {
                    (pc([C]), ye());
                  },
                },
                {
                  props: C.id,
                  text: "Reset Card",
                  click: (v) => {
                    ((gn.find((E) => E.id == v).learning = "unattempted"),
                      nr(),
                      ye(),
                      In(!0));
                  },
                },
                {
                  props: C.id,
                  text: "Delete Card",
                  click: (v, E) => {
                    ci(E, () => {
                      (Sa(gn.filter((x) => x.id != v)), nr(), ye(), In(!0));
                    });
                  },
                },
              ]);
            }),
            b.classList.add("cardFront"),
            (b.innerHTML = Zr(C.front, { includeDirs: !1 })),
            A.appendChild(b));
        }),
        A.firstChild
          ? A.classList.remove("grid")
          : (A.classList.add("grid"),
            (A.innerHTML = "<i>Flashcards will appear here.</i>")),
        p.appendChild(m),
        p.appendChild(A),
        p.classList.add("fcGroup"),
        n.appendChild(p));
    }));
}
function Av(t) {
  const e = [...t];
  let n = t.length;
  for (; n != 0; ) {
    let r = Math.floor(Math.random() * n);
    (n--, ([e[n], e[r]] = [e[r], e[n]]));
  }
  return e;
}
async function pc(t) {
  try {
    const e = await Vh(t);
    for (let n = 0, r = t.length; n < r; n++)
      ((t[n].front = e[n].front), (t[n].back = e[n].back));
    (nr(), In(!0));
  } catch (e) {
    e.message === "Unsaved" && In(!0);
  }
  console.log("exited edit cards");
}
function Vh(t) {
  if (t.length === 0) return;
  const e = Xs({ noAnimation: !0, closers: [kv] }),
    n = document.createElement("h2");
  ((n.innerText = "Flashcard Editor"), e.appendChild(n));
  const r = JSON.parse(JSON.stringify(t));
  return new Promise((i, a) => {
    ((Ci = a),
      r.map((u, h) => {
        const d = document.createElement("div");
        (d.setAttribute("data-order", h + 1), d.classList.add("editableCard"));
        const p = document.createElement("div");
        p.classList.add("cardContainer");
        const m = document.createElement("div");
        (m.classList.add("cardHeader"),
          (m.innerText = "Front"),
          p.appendChild(m));
        const y = document.createElement("div");
        (y.addEventListener("input", () => {
          u.front = y.innerText;
        }),
          (y.innerText = u.front),
          y.classList.add("cardFront"),
          (y.contentEditable = !0),
          (y.spellcheck = !1),
          p.appendChild(y));
        const S = document.createElement("div");
        S.classList.add("cardContainer");
        const A = document.createElement("div");
        (A.classList.add("cardHeader"),
          (A.innerText = "Back"),
          S.appendChild(A));
        const C = document.createElement("div");
        (C.addEventListener("input", () => {
          u.back = C.innerText;
        }),
          (C.innerText = u.back),
          C.classList.add("cardBack"),
          (C.contentEditable = !0),
          (C.spellcheck = !1),
          S.appendChild(C));
        const b = document.createElement("button");
        (b.classList.add("deleteCard"),
          (b.innerText = "❌"),
          b.addEventListener("click", () => {
            ((u.front = ""), (u.back = ""), b.parentElement.remove(), ye());
          }),
          d.appendChild(p),
          d.appendChild(S),
          d.appendChild(b),
          e.appendChild(d));
      }));
    const s = document.createElement("div");
    s.classList.add("fcButtons");
    const o = document.createElement("button");
    ((o.innerText = "💾 Save"),
      o.addEventListener(
        "click",
        () => {
          (i(r), (Ci = null));
        },
        { once: !0 },
      ),
      s.appendChild(o));
    const l = document.createElement("button");
    ((l.innerText = "❌ Exit"),
      l.addEventListener(
        "click",
        () => {
          Ci(new Error("Unsaved"));
        },
        { once: !0 },
      ),
      s.appendChild(l),
      e.appendChild(s),
      e.children[1].firstChild.focus());
  });
}
function Nr(t, e) {
  const n = Xs({ noAnimation: !0 });
  if (!t[0]) {
    In(!0);
    return;
  }
  const r = t[0],
    i = document.createElement("div");
  (i.classList.add("studyContainer"), n.appendChild(i));
  const a = document.createElement("div");
  (a.classList.add("studyingOptions"), i.appendChild(a));
  const s = document.createElement("button");
  (s.classList.add("reset"),
    (s.innerText = "❌ Exit"),
    s.addEventListener("click", () => In(!0)),
    a.appendChild(s));
  const o = document.createElement("button");
  (o.classList.add("reset"),
    (o.innerText = "🔁 Reset Card"),
    o.addEventListener("click", () => {
      ((r.learning = "unattempted"), nr(), Nr(t, e));
    }),
    a.appendChild(o));
  const l = document.createElement("button");
  (l.classList.add("reset"),
    (l.innerText = "⏪ Back"),
    (l.style.opacity = ".5"),
    t.length > 1 &&
      (l.addEventListener("click", () => {
        (e.push(t.shift()), Nr(t, e));
      }),
      (l.style.opacity = "1")),
    a.appendChild(l));
  const u = document.createElement("button");
  (u.classList.add("reset"),
    (u.innerText = "⏩ Skip"),
    u.addEventListener("click", () => Nr([e.shift(), ...t], e)),
    a.appendChild(u));
  const h = document.createElement("button");
  (h.classList.add("reset"),
    (h.innerText = "🔀 Shuffle"),
    h.addEventListener("click", () => {
      const T = Av([t.shift(), ...e]);
      (notyf.success("Cards were shuffled"), Nr([T.shift(), ...t], T));
    }),
    a.appendChild(h));
  const d = document.createElement("span");
  if (
    ((d.style.fontFamily = "monospace"),
    (d.innerText = `${t.length}/${e.length + t.length}`),
    a.appendChild(d),
    r.ai_generated)
  ) {
    const T = document.createElement("div");
    ((T.innerText = "🤖"), a.appendChild(T));
  }
  const p = document.createElement("button");
  (p.classList.add("glowing-border"),
    p.classList.add("quizlet"),
    p.addEventListener("click", () => {
      p.classList.toggle("quizletActive");
    }));
  const m = document.createElement("div");
  (m.classList.add("qContent"), p.appendChild(m));
  const y = document.createElement("div");
  (y.classList.add("qFront"),
    (y.innerHTML = Zr(r.front, { includeDirs: !1 })),
    i.appendChild(y));
  const S = document.createElement("div");
  (S.classList.add("qBack"),
    (S.innerHTML = Zr(r.back, { includeDirs: !1 })),
    i.appendChild(S),
    m.appendChild(y),
    m.appendChild(S),
    i.appendChild(p));
  const A = document.createElement("div");
  A.classList.add("fcButtons");
  const C = document.createElement("button");
  ((C.innerText = "✅ Know"),
    r.learning === "know" &&
      ((C.style.background = "lightgreen"), (C.style.color = "black")),
    C.addEventListener("click", (T) => {
      ((r.learning = "know"), Us(T, "😊"), nr(), Nr([e.shift(), ...t], e));
    }));
  const b = document.createElement("button");
  (b.addEventListener("click", (T) => {
    ((r.learning = "dontKnow"), Us(T, "😔"), nr(), Nr([e.shift(), ...t], e));
  }),
    (b.innerText = "❌ Don't Know"),
    r.learning === "dontKnow" &&
      ((b.style.background = "lightcoral"), (b.style.color = "black")),
    A.appendChild(C),
    A.appendChild(b),
    i.appendChild(A));
}
function Tv() {
  switch (yt("viewPref")) {
    case "split":
      Qe("viewPref", "write");
      break;
    case "write":
      Qe("viewPref", "read");
      break;
    default:
      Qe("viewPref", "split");
      break;
  }
  $r(yt("viewPref"));
}
function $r(t) {
  switch (t) {
    case "read":
      ((ms.innerText = "R"),
        Ie.setReadOnly(!0),
        Xn.classList.add("readMode"),
        Xn.classList.remove("writeMode"),
        Xn.classList.remove("splitMode"),
        Qe("viewPref", "read"));
      break;
    case "write":
      ((ms.innerText = "W"),
        Ie.setReadOnly(I.readOnly),
        Xn.classList.remove("readMode"),
        Xn.classList.add("writeMode"),
        Xn.classList.remove("splitMode"),
        Qe("viewPref", "write"));
      break;
    default:
      ((ms.innerText = "S"),
        Ie.setReadOnly(I.readOnly),
        Xn.classList.remove("readMode"),
        Xn.classList.remove("writeMode"),
        Xn.classList.add("splitMode"),
        Qe("viewPref", "split"));
  }
  ((Vr.scrollTop = 0),
    (Vc.scrollTop = 0),
    Ie.focus(),
    rd.setContent(`View Mode: ${t}`));
}
function jh() {
  Gh(Gr.value);
}
async function Wh(t) {
  for (
    t = t.split(`
`),
      t[0] && t[0].substring(0, 3) === "// " && t.shift();
    t[0] !== void 0 && t[0] === "";

  )
    t.shift();
  t = t.join(`
`);
  let e = [0, 0];
  ((t = t
    .replaceAll("{{page}}", I.pgN + 1)
    .replaceAll("{{pg}", I.pgN + 1)
    .replaceAll("{{title}}", I.name)
    .replaceAll("{{today}}", new Date().toLocaleDateString())
    .replaceAll("{{pagenth}}", I.pgN + 1)
    .replaceAll("{{pgnth}}", F3(I.pgN + 1))
    .replaceAll(
      "{{pages}}",
      I.content.map((n, r) => `- :ref[${I.name}:${r + 1}|${Ri(n)}]`).join(`
`),
    )
    .replaceAll(
      "{{children}}",
      (await _n(I.name, "children")).map((n) => `- :ref[${n}]`).join(`
`),
    )
    .replaceAll(
      "{{parents}}",
      (await _n(I.name, "parents")).map((n) => `- :ref[${n}]`).join(`
`),
    )),
    (t = t
      .split(
        `
`,
      )
      .map((n, r) =>
        n.includes("{{^}}")
          ? ((e = [r + 1, n.indexOf("{{^}}")]), n.replaceAll("{{^}}", ""))
          : n,
      ).join(`
`)),
    Gh(t, e));
}
async function Gh(t, e) {
  if (Ft(I.name)) notyf.error("This notebook is read only");
  else {
    const { row: n, column: r } = Ie.getCursorPosition();
    (Ie.insert(t),
      Ie.focus(),
      e && e.length === 2 && Ie.gotoLine(e[0] + n, e[1] + r));
  }
}
function Ev() {
  (Hr.addEventListener("wheel", (t) => {
    (t.preventDefault(), Hr.scroll({ left: Hr.scrollLeft + t.deltaY }));
  }),
    rt("icon1").addEventListener("click", () => {
      I.readOnly || Hi(I.name);
    }),
    rt("icon2").addEventListener("click", (t) => d0(t, !0)),
    rt("icon3").addEventListener("click", (t) => {
      I.readOnly ||
        Kt(
          t,
          [
            I.saved
              ? {
                  icon: "delete",
                  text: "Delete Notebook",
                  click: (e, n) => ci(n, () => Q0(I.name)),
                }
              : null,
            {
              icon: "drive_file_move",
              text: "Delete This Page",
              click: (e, n) => ci(n, Oh),
            },
          ],
          [`${t.clientX - 160}px`, "75px"],
        );
    }),
    rt("getFile1").addEventListener("change", () => {
      I.readOnly || O3();
    }),
    rt("icon5").addEventListener("click", (t) =>
      Kt(
        t,
        [
          {
            text: "Split",
            click: () => {
              (Qe("viewPref", "split"), $r("split"), ye());
            },
          },
          {
            text: "Read",
            click: () => {
              (Qe("viewPref", "read"), $r("read"), ye());
            },
          },
          {
            text: "Write",
            click: () => {
              (Qe("viewPref", "write"), $r("write"), ye());
            },
          },
          { spacer: !0 },
          {
            text: "Change Theme",
            children: Ms.map((e) =>
              e.hidden
                ? null
                : {
                    text: e.name
                      .split("_")
                      .map(
                        (n) => n.substring(0, 1).toUpperCase() + n.substring(1),
                      )
                      .join(" "),
                    click: () => zs(e.name),
                  },
            ),
          },
        ],
        [`${t.clientX - 160}px`, "75px"],
      ),
    ),
    rt("icon6").addEventListener("click", () => {
      Pi({ direction: "<-", amount: 1 });
    }),
    rt("icon7").addEventListener("click", (t) => {
      Pi({ direction: "->", amount: 1, event: t });
    }),
    Jn.addEventListener("click", (t) =>
      Kt(
        t,
        [
          { text: "Toggle Wiki Search", click: () => so() },
          {
            text: "Create Flashcards",
            click: () => {
              ($s(), ye());
            },
          },
          {
            text: "AI Summary",
            children: [
              {
                text: "ChatGPT",
                click: () => {
                  (ye(), qs("chatgpt"));
                },
              },
              {
                text: "Ollama",
                click: () => {
                  (ye(), qs("ollama"));
                },
              },
            ],
            appearance: Hs || I.isEncrypted ? "unavailable" : "ios",
          },
          { spacer: !0 },
          {
            text: "Insert Scratch Pad",
            click: () => {
              (jh(), ye());
            },
          },
          {
            text: "Insert Snippet",
            populator: async (e) => {
              const n = await Xe.get.snippets();
              return n.ok
                ? (await n.json()).data.map((i) => ({
                    text: Ri(i),
                    click: () => {
                      (Wh(i), ye());
                    },
                  }))
                : [{ text: "An error occurred", appearance: "unavailable" }];
            },
          },
        ],
        [`${t.clientX - 160}px`, "75px"],
      ),
    ),
    ds.addEventListener("animationend", () => ds.classList.remove("saved")),
    ds.addEventListener("click", (t) => {
      I.readOnly ||
        Kt(
          t,
          [
            {
              text: "More Details",
              click: () => {
                (G0(), ye());
              },
            },
            {
              text: ni ? "Disable Auto Save" : "Enable Auto Save",
              click: () => {
                (R3(), ye());
              },
            },
            { text: "Force Update", click: (e, n) => ci(n, K0) },
            {
              text: I.isPublic ? "Make Private" : "Make Public",
              click: () => {
                (I.isPublic ? nv(I.name) : tv(I.name), ye());
              },
            },
          ],
          [`${t.clientX - 160}px`, "75px"],
        );
    }),
    jr.addEventListener("contextmenu", (t) => t.preventDefault()));
}
function Cv() {
  (rt("leftMostSideBar").addEventListener("contextmenu", (t) =>
    t.preventDefault(),
  ),
    rt("sideBarRetractList").addEventListener("click", Bh),
    rt("newPage").addEventListener("click", () => ln(I.content.length)),
    morePages.addEventListener("click", (t) => Nh(t)),
    rt("goHome").addEventListener("click", (t) => {
      Kt(t, [
        {
          text: "Recent Notes",
          populator: () => {
            const e = yt("recents", []).map((n) => ({
              text: n,
              click: async () => {
                (await Pe(n), ye());
              },
            }));
            return (
              e.push({ spacer: !0 }),
              e.push({
                text: "Clear List",
                click: async () => {
                  (Qe("recents", []),
                    I.name === "home" && (I.reservedData.beforeOpen[0](), vn()),
                    ye());
                },
                appearance: "rios",
              }),
              e
            );
          },
        },
        {
          text: "Recent Tags",
          populator: () => {
            const e = yt("recents_tags", []).map((n) => ({
              text: n,
              click: async () => {
                (await Pe("Tag-Viewer", { props: n }), ye());
              },
            }));
            return (
              e.push({ spacer: !0 }),
              e.push({
                text: "Clear List",
                click: async () => {
                  (Qe("recents_tags", []),
                    I.name === "home" && (I.reservedData.beforeOpen[0](), vn()),
                    ye());
                },
                appearance: "rios",
              }),
              e
            );
          },
        },
        { spacer: !0 },
        {
          text: "Note Map",
          click: async () => {
            (await Pe("Note-Map"), ye());
          },
        },
        {
          text: "Snippets",
          click: async () => {
            (await Pe("snippets"), ye());
          },
        },
        {
          text: "Home",
          click: async () => {
            (await Pe("home"), ye());
          },
        },
      ]);
    }),
    jn.addEventListener("contextmenu", (t) => t.preventDefault()),
    ga.addEventListener("input", () => {
      ys({ delay: 100, condition: !0, callback: () => cv(ga.value) });
    }),
    Es.addEventListener("click", function () {
      this.parentNode.classList.toggle("down");
    }),
    Wr.addEventListener("mousedown", () => {
      (ye(),
        ($t.style.userSelect = "none"),
        document.addEventListener("mousemove", mc),
        document.addEventListener(
          "mouseup",
          () => {
            (Qe("listSize", jn.style.width),
              Wr.classList.remove("currPage"),
              (document.body.style.cursor = "inherit"),
              ($t.style.userSelect = "inherit"),
              document.removeEventListener("mousemove", mc));
          },
          { once: !0 },
        ));
    }));
}
function Yh(t = !1) {
  if (!t) return;
  function e(n, r) {
    const i = 30 - r.length,
      a = n.toLowerCase().indexOf(r.toLowerCase());
    if (a === -1) return null;
    const s = Math.max(0, a - i),
      o = Math.min(n.length, a + r.length + i),
      l = n.substring(s, a),
      u = n.substring(a + r.length, o),
      h = n.substring(a, a + r.length);
    return `<span class = 'leftFade'>${l}</span><mark>${h}</mark><span class = 'rightFade'>${u}</span>`;
  }
  Vi(
    "Search for text within this notebook...",
    (n, r, i) => {
      const a = I.content.reduce((s, o, l) => {
        let u = e(o, r);
        return (
          u &&
            s.push({
              name: u,
              icon: `Page ${l + 1}`,
              handler: () => {
                (ln(l), Lv(kh(r)));
              },
            }),
          s
        );
      }, []);
      i(2, a, n);
    },
    null,
    !1,
  );
}
function Lv(t) {
  (Ie.gotoLine(0, 0), Ie.find(t), Ie.focus());
  for (const e of Cs.children)
    if (e.textContent.toLowerCase().includes(t.toLowerCase())) {
      (e.classList.add("normalFlash"),
        setTimeout(() => {
          e.classList.remove("normalFlash");
        }, 1e3),
        e.scrollIntoView({ block: "center" }));
      break;
    }
}
function gc() {
  Vi(
    "Search for commands...",
    (t, e, n, r) => {
      n(1, r(vc, e), t);
    },
    (t, e) => {
      e(1, vc, t);
    },
  );
}
const vc = [
  {
    name: "Clear Local Storage",
    searchTerm: "reset local storage update delete",
    children: [
      {
        name: "Confirm",
        handler: async () => {
          (await Yn.clear(), window.location.reload());
        },
      },
    ],
  },
  {
    name: "Open Notification Palette",
    searchTerm: "ai summary notifs ai flashcards restore state revert",
    handler: Mh,
  },
  { name: "Search for Text", searchTerm: "find text", handler: () => Yh(!0) },
  {
    name: "List Users",
    searchTerm: "user list show users find users",
    populatorV: 0,
    populator: async () => {
      const t = await Xe.get.users();
      return t.ok
        ? (await t.json()).data.map((n) => ({
            name: n.settings.nickname
              ? `${n.settings.nickname} (${n.email})`
              : n.email,
            icon: n.settings.pfp
              ? `<img src="${n.settings.pfp}" style="width: 2em; height: 2em; border-radius: 50%; object-fit: cover;">`
              : "?",
            handler: () => {
              console.log("Nothing here yet");
            },
          }))
        : [{ name: tags.statusText, info: tags.status }];
    },
  },
  {
    name: "New Page",
    searchTerm: "create page",
    handler: () => ln(I.content.length),
  },
  {
    name: "Insert Page After Current Page",
    searchTerm: "create page",
    handler: () => uc("->"),
  },
  {
    name: "Insert Page Before Current Page",
    searchTerm: "create page",
    handler: () => uc("<-"),
  },
  {
    name: "Go to Page",
    searchTerm: "switch pages jump to pages",
    populator: () =>
      I.content.map((t, e) => ({
        name: Ri(t),
        searchTerm: `${(e + 1).toString()} ${e === I.content.length - 1 ? "last" : ""}`,
        handler: () => ln(e),
      })),
  },
  {
    name: "Previous Page",
    searchTerm: "back pages prev pages",
    handler: () => ln(I.pgN - 1),
  },
  {
    name: "Find by Tag",
    searchTerm: "tag search tags filter by tag",
    populator: async () => {
      const t = await Xe.get.tags();
      return t.ok
        ? (await t.json()).data.map((n) => ({
            name: `${n}`,
            handler: () => Pe("Tag-Viewer", { props: n }),
          }))
        : [{ name: t.statusText, info: t.status }];
    },
  },
  {
    name: "Next Page",
    searchTerm: "forward pages",
    handler: () => ln(I.pgN + 1),
  },
  {
    name: "Open Recent Notebook",
    searchTerm: "open notebooks switch notebooks open recents",
    populator: () =>
      yt("recents", []).map((t) => ({ name: `${t}`, handler: () => Pe(t) })),
  },
  {
    name: "Open All Recent Notebooks",
    searchTerm: "open notebooks switch notebooks open recents",
    handler: async () => {
      await Pe(yt("recents", []).shift());
      for (const t of yt("recents", [])) ao(t);
    },
  },
  {
    name: "Clear Recent Notebooks List",
    searchTerm: "clear recents clear all",
    handler: () => {
      (Qe("recents", []),
        I.name === "home" && (I.reservedData.beforeOpen[0](), vn()));
    },
  },
  {
    name: "Clear Recent Tags List",
    searchTerm: "clear recents clear all",
    handler: () => {
      (Qe("recents_tags", []),
        I.name === "home" && (I.reservedData.beforeOpen[0](), vn()));
    },
  },
  {
    name: "View Public Notebooks",
    searchTerm:
      "open public notebooks open shared notebooks view shared notebooks",
    populator: async () => {
      const t = await Xe.get.published();
      return t.ok
        ? (await t.json()).data.map((r) => ({
            name: `${r.name} (${r.user})`,
            handler: async () => {
              (ha("Public-Notebook", r.content),
                ev([r.name, r.user]),
                await Dn("Public-Notebook", {
                  refresh: !0,
                  switchAsFallBack: !0,
                }));
            },
            info:
              Date.now() - r.date < 1e3 * 60 * 60 * 24 * 2
                ? "Updated Recently"
                : "",
          }))
        : [{ name: tags.statusText, info: tags.status }];
    },
  },
  {
    name: "Open Saved Notebook",
    searchTerm: "open notebooks switch notebooks view saved notebooks",
    populator: async () =>
      Wn.map((t) => ({
        name: `${t.name}`,
        handler: () => Pe(t.name),
        info:
          Date.now() - t.date < 1e3 * 60 * 60 * 24 * 2
            ? "Updated Recently"
            : "",
      })),
  },
  { name: "Copy Notebook", handler: () => Pr(I.name, "copy") },
  {
    name: "Create Child Notebook",
    searchTerm: "make child notebooks",
    handler: () => Pr(I.name, "child"),
  },
  {
    name: "View Parent Notebooks",
    searchTerm:
      "view parents go to parent notebook open parents open parent notebooks",
    populator: async () =>
      (await _n(I.name, "parents")).map((e) => ({
        name: `${e}`,
        handler: () => Pe(e),
      })),
  },
  {
    name: "View Child Notebooks",
    searchTerm:
      "view children go to child notebook open children open child notebooks",
    populator: async () =>
      (await _n(I.name, "children")).map((e) => ({
        name: `${e}`,
        handler: () => Pe(e),
      })),
  },
  {
    name: "Rename Notebook",
    searchTerm: "edit",
    handler: () => Pr(I.name, "rename"),
  },
  {
    name: "Open Notebook",
    searchTerm: "open notebooks",
    handler: () => Pr(I.name, "open"),
  },
  {
    name: "Close Current Tab",
    searchTerm: "close tab close this tab",
    handler: () => Dn(I.name),
  },
  {
    name: "Close a Tab",
    populator: () =>
      Array.from(Xt)
        .reverse()
        .map((t) => ({ name: `${t}`, handler: () => Dn(t) })),
  },
  {
    name: "Close All Tabs",
    handler: async () => {
      for (const t of Array.from(Xt)) await Dn(t);
    },
  },
  {
    name: "Go to Tab",
    searchTerm: "switch tabs",
    populator: () =>
      Array.from(Xt)
        .reverse()
        .map((t) => ({ name: `${t}`, handler: () => Pe(t) })),
  },
  {
    name: "Previous Tab",
    searchTerm: "back tabs prev tabs",
    handler: () => {
      const t = Array.from(Xt),
        e = t.indexOf(I.name);
      e === t.length - 1 ? Pe(t[0]) : Pe(t[e + 1]);
    },
  },
  {
    name: "Next Tab",
    searchTerm: "next tabs",
    handler: () => {
      const t = Array.from(Xt).reverse(),
        e = t.indexOf(I.name);
      e === t.length - 1 ? Pe(t[0]) : Pe(t[e + 1]);
    },
  },
  { name: "Save Notebook", handler: () => Hi(I.name) },
  {
    name: "Insert File",
    searchTerm: "upload image upload file insert image insert pdf",
    handler: () => rt("getFile1").click(),
  },
  {
    name: "Nest Notebook",
    searchTerm: "child",
    populator: async () => {
      const t = await Dh(I.name);
      return Wn.reduce(
        (e, n) => (
          n.name !== I.name &&
            !t.includes(n.name) &&
            e.push({ name: `${n.name}`, handler: () => X0(I.name, n.name) }),
          e
        ),
        [],
      );
    },
  },
  {
    name: "Relinquish Notebook",
    searchTerm: "unnest",
    populator: async () =>
      (await _n(I.name, "parents")).map((t) => ({
        name: `${t}`,
        handler: () => Ih(I.name, t),
      })),
  },
  {
    name: "Compare Local Notes to Database",
    searchTerm: "db diff",
    handler: G0,
  },
  {
    name: "AI Summary",
    searchTerm: "chatgpt ollama",
    children: [
      { name: "ChatGPT", handler: () => qs("chatgpt") },
      { name: "Ollama", handler: () => qs("ollama") },
    ],
  },
  { name: "Create Flashcards", searchTerm: "flashcard mode", handler: $s },
  {
    name: "Delete This Page",
    searchTerm: "trash remove page delete page",
    children: [{ name: "Confirm", handler: Oh }],
  },
  {
    name: "Delete Notebook",
    searchTerm: "trash remove",
    children: [{ name: "Confirm", handler: () => Q0(I.name) }],
  },
  {
    name: "Download All Notebooks",
    info: ".zip",
    searchTerm: "export zip",
    handler: () => window.open("/api/export?downloadAll=true"),
  },
  {
    name: "Download Current Notebook",
    info: ".zip",
    searchTerm: "export zip",
    handler: () => {
      !vv.includes(I.name) && !Ft(I.name)
        ? window.open(`/api/export?name=${I.name}`)
        : notyf.error("This notebook cannot be downloaded");
    },
  },
  {
    name: "Force Update Notebook",
    searchTerm: "local storage",
    children: [{ name: "Confirm", handler: K0 }],
  },
  {
    name: "View Uploaded Images",
    searchTerm: "uploads",
    handler: () => Pe("Your-Uploads"),
  },
  { name: "Go Home", handler: () => Pe("home") },
  {
    name: "View Note Map",
    searchTerm:
      "view graph view note graph view notemap note-map open note map open notemap",
    handler: () => Pe("Note-Map"),
  },
  {
    name: "Edit User Settings",
    searchTerm: "open user config open config edit config edit user config",
    handler: () => Pe("user__config"),
  },
  {
    name: "Edit Snippets",
    searchTerm:
      "edit templates open snippets create templates create snippets make templates make snippets",
    handler: () => Pe("snippets"),
  },
  {
    name: "Practice Flashcards",
    searchTerm: "quizlet open flashcards",
    handler: () => In(!0, [I.name]),
  },
  {
    name: "Insert Scratch Pad Content",
    searchTerm:
      "import sticky note content import scratch pad content import scratchpad content insert scratchpad content insert sticky note content",
    handler: jh,
  },
  {
    name: "Insert Snippet",
    searchTerm: "insert template insert snippets",
    populator: async () => {
      const t = await Xe.get.snippets();
      return t.ok
        ? (await t.json()).data.map((n) => ({
            name: Ri(n),
            handler: () => Wh(n),
          }))
        : [{ name: tags.statusText, info: tags.status }];
    },
  },
  {
    name: "Toggle Vim Mode",
    handler: () => {
      notesTextArea.hasAttribute("data-vim")
        ? (Ie.setKeyboardHandler("ace/keyboard/vscode"),
          notesTextArea.removeAttribute("data-vim"))
        : (Ie.setKeyboardHandler("ace/keyboard/vim"),
          notesTextArea.setAttribute("data-vim", ""));
    },
  },
  {
    name: "Change Theme",
    searchTerm: "dark light color scheme set theme",
    children: Ms.map((t) => ({
      name: t.name
        .split("_")
        .map((e) => e.substring(0, 1).toUpperCase() + e.substring(1))
        .join(" "),
      searchTerm: t.theme_type,
      handler: () => zs(t.name),
    })),
  },
  {
    name: "Switch View",
    searchTerm: "edit split read write",
    children: [
      {
        name: "Split",
        handler: () => {
          $r("split");
        },
      },
      {
        name: "Read",
        handler: () => {
          $r("read");
        },
      },
      {
        name: "Write",
        handler: () => {
          $r("write");
        },
      },
    ],
  },
  { name: "Toggle Wikipedia Search", handler: so },
  { name: "Toggle List", searchTerm: "hide tree show tree", handler: Bh },
  { name: "Enable Auto Save", searchTerm: "autosave", handler: j0 },
  { name: "Disable Auto Save", searchTerm: "autosave", handler: W0 },
].sort((t, e) => t.name.localeCompare(e.name));
let Aa = { isOffline: !1 };
function Mv() {
  Aa.isOffline ||
    ((Aa.isOffline = !0),
    Hh(
      "network",
      "Your device (or the server) is offline. Changes will be saved locally. Some features may not work.",
    ));
}
function zv() {
  Aa.isOffline && ((Aa.isOffline = !1), Xc(), nr(), qh("network"));
}
let Dv = [],
  jo = 0;
async function Iv() {
  for (window.network = Aa; ; ) {
    await N3(2e3);
    try {
      if ((await fetch("/assets/ping", { cache: "no-store" }), jo++, jo > 5)) {
        for (let t of Dv) t.poller();
        jo = 0;
      }
      zv();
    } catch {
      Mv();
    }
  }
}
window.switchNoteWrapper = (t) => Pe(t);
window.DOMPurify = hm;
document.getElementById("root").innerHTML = `
<!-- Not visible (for the most part) -->
    <div id="loading">
      <div id="progBarContainer">
        <div id="progBar"></div>
      </div>
    </div>
    <div id="wikipediaBrainAnimation"></div>
    <div id="vaultDetails">🔐</div>
    <!---->

    <!-- Fixed position, Note-Map button for mobile interface -->
    <div id = "mobileAction">
      <img src = "/assets/circle-scatter-haikei(1).png">
    </div>

    <div id="mainContainer">
      <div id="leftMostSideBar">
        <div id="topLeftPageNumbers"></div>
        <div class="whereTo" id="morePages" data-vis="hidden">...</div>
        <div class="whereTo" id="newPage">+</div>
        <div id="sideBarRetractList"></div>
        <a id="goHome" class="whereTo">⚡</a>
      </div>
      <div id="listOfBooks">
        <div id="searchItem">
          <input placeholder="Search..." id="searchBar" />
        </div>
        <div id="listContainer"></div>
        <div class="itemUpload">
          <button id="yourUploads" class="folderName">Your Uploads</button>
          <ul id="uploads"></ul>
        </div>
      </div>
      <div id="border"></div>

      <!-- Fixed position -->
      <div id="bottomLeftGeneralInfo">
        <span id="generalInfoPageNumber"></span>
        <span id="generalInfoViewMode"></span>
        <span id="letterCount">00000</span>
        <span id="wordCount">00000</span>
        <span id="spacer">|</span>
        <button id="openCommandPal">>_</button>
        <span id="autoSaveSpinner" class = "loader"></span>
      </div>
      <!---->

      <div id="workspace">
        <div id="tabs"></div>
        <div id="notesAreaContainer">
          <div id="notesTextArea" class="syncscroll" name="myElements">
            <pre id="editor"></pre>
          </div>
          <div id="notesPreviewArea" class="syncscroll" name="myElements">
            <div id="fill"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed position -->
    <div id="toolBar">
      <div id="icons">
        <button id="icon1">
          <img
            alt="save notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/floppy_disk_3d.png"
          />
        </button>
        <button id="icon2">
          <img
            alt="manage notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/open_book_3d.png"
          />
        </button>
        <button id="icon3">
          <img
            alt="delete notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/wastebasket_3d.png"
          />
        </button>
        <button id="icon4">
          <label for="getFile1" id="labelForImage">
            <img
              alt="insert file icon"
              draggable="false"
              class="emoji"
              src="/assets/icons/framed_picture_3d.png"
            />
          </label>
          <form id="myForm">
            <input
              id="getFile1"
              type="file"
              name="avatar"
              style="display: none"
            />
          </form>
        </button>
        <button id="icon5">
          <img
            alt="switch view icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/eye_3d.png"
          />
        </button>
        <button id="icon6">
          <img
            alt="previous page icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/left_arrow_3d.png"
          />
        </button>
        <button id="icon7">
          <img
            alt="next page icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/right_arrow_3d.png"
          />
        </button>
        <button id="icon8">
          <img
            alt="brain icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/brain_3d.png"
          />
        </button>
        <button id="areNotesSavedIcon">
          <img
            alt="save status icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/recycling_symbol_3d.png"
          />
        </button>
      </div>
    </div>
    <!---->

    <!-- Fixed position -->
    <div id="bottomRightTools">
      <div id="brDots">
        <button class="dot currPage"></button>
        <button class="dot"></button>
      </div>

      <div id="yellowButtons">
        <div id="flashcardsPrac">
          <button id="flashcardsPracEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/card_index_3d.png"
            />
          </button>
        </div>

        <div id="stickyNotes" class="gone" data-text="">
          <textarea id="stickyNotesTextArea" autocomplete="off" spellcheck="false"></textarea>
          <button id="stickyNotesEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/memo_3d.png"
            />
          </button>
        </div>
      </div>
    </div>
    <!---->
`;
const Xh = new F1({ position: { y: "top", x: "center" }, dismissible: !0 });
window.notyf = Xh;
location.pathname === "/" && location.replace("/home");
mm();
let bi = document.getElementById("progBar"),
  Wo = !1;
async function Nv() {
  (rt("loading").addEventListener(
    "animationend",
    function () {
      this.remove();
    },
    { once: !0 },
  ),
    Iv(),
    Wm(),
    fm((e) => {
      (ys({
        delay: ws[1] / 50,
        condition: ws[0] && !Ah,
        beforeTimeout: () => Zu(!0),
        callback: da,
        afterTimeout: () => Zu(!1),
        fallbackCondition: !ws[0],
        fallback: da,
      }),
        ys({
          condition: ni && !xh,
          beforeTimeout: () => Xu(!0, I.name),
          callback: () => {
            I.name === wh && !Ft(I.name) && Hi(I.name, !0);
          },
          afterTimeout: () => Xu(!1),
        }));
    }),
    await ar(),
    (bi.style.width = "80px"),
    navigator.userAgent.includes("iPhone")
      ? ((window.isOnMobile = !0),
        document.body.classList.add("mobile"),
        document.body.addEventListener("dblclick", function (e) {
          const n = window.innerWidth;
          e.clientX < n / 2
            ? Pi({ direction: "<-", amount: 1 })
            : Pi({ direction: "->", amount: 1 });
        }),
        zs("terminal"))
      : zs(yt("theme", "chrome")),
    yv(),
    await gv(),
    (bi.style.width = "160px"),
    await $m(),
    (bi.style.width = "240px"),
    await Pe(location.pathname.substring(1), {
      page: parseInt(location.search.substring(1) || 1) - 1,
    }),
    (bi.style.width = "320px"),
    yt("autosave", !0) ? j0() : W0(),
    $r(yt("viewPref", "read")),
    navigator.userAgent.includes("iPhone") ||
      Vr.addEventListener("click", (e) => xv(e)),
    Yr.addEventListener("contextmenu", (e) => e.preventDefault()),
    document.getElementById("openCommandPal").addEventListener("click", () => {
      (ye(), gc());
    }),
    Hr.addEventListener("contextmenu", (e) => e.preventDefault()),
    Ev(),
    Cv(),
    document
      .getElementById("mobileAction")
      .addEventListener("click", async () => {
        (await Pe("Note-Map"), (Vr.scrollTop = 0));
      }),
    Ni.addEventListener("click", Kc, { once: !0 }),
    Gr.addEventListener("input", () => {
      ys({
        condition: !Wo,
        beforeTimeout: () => (Wo = !0),
        callback: Xc,
        afterTimeout: () => (Wo = !1),
      });
    }),
    Gr.addEventListener("keydown", (e) => {
      e.key === "Escape" && (e.preventDefault(), Ys());
    }),
    Gc.addEventListener("click", () => {
      In(!1, [I.name]);
    }));
  for (let e = 0, n = Fr.children.length; e < n; e++) {
    const r = ["Flashcards", "Scratch Pad"];
    (Mn([Fr.children[e]], {
      animation: "shift-toward-subtle",
      arrow: !1,
      content: r[e],
      placement: "left",
    }),
      Fr.children[e].addEventListener("click", function () {
        for (let i = 0, a = ps.children.length; i < a; i++)
          (ps.children[i].classList.add("gone"),
            Fr.children[i].classList.remove("currPage"));
        (ps.children[e].classList.remove("gone"),
          Fr.children[e].classList.add("currPage"));
      }));
  }
  (document.addEventListener("keydown", (e) => {
    if (e.ctrlKey)
      switch (e.key.toLowerCase()) {
        case "s":
          (e.preventDefault(), Hi(I.name));
          break;
        case "e":
          (e.preventDefault(), Tv());
          break;
        case " ":
          (e.preventDefault(), gc());
          break;
        case "f":
          (Yh(e.shiftKey), e.preventDefault());
          break;
        case ",":
          (e.preventDefault(), Mh());
          break;
        case "/":
          (e.preventDefault(), ga.focus());
          break;
        case ".":
          (e.preventDefault(), Ie.focus());
          break;
      }
  }),
    new de(document.body, {
      url: "/api/save/images",
      paramName: "avatar",
      clickable: !1,
      acceptedFiles:
        "image/jpeg,image/png,image/gif,image/webp,application/pdf",
      error: () => Xh.error("An error occurred when saving an image"),
      success: (e, n) => {
        (e.previewElement.remove(),
          Ie.insert(`${Da(n.image)}(${n.image})`),
          da(),
          ar());
      },
    }),
    new ResizeObserver(() => {
      jc.style.left = Yc.style.left =
        workspace.getBoundingClientRect().left + "px";
    }).observe(workspace),
    Vm(di),
    jm(Br),
    (bi.style.width = "420px"),
    rt("loading").classList.add("loaded"),
    (bi = null),
    window.addEventListener("popstate", (e) => {
      e.state && e.state.sancta && Pe(e.state.note, { page: e.state.page });
    }));
}
Nv();
