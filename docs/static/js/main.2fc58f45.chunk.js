(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{16:function(t,e,a){},18:function(t,e,a){},20:function(t,e,a){"use strict";a.r(e);var s=a(1),n=a.n(s),d=a(5),i=a.n(d),p=(a(16),a(17),a(18),a(6)),o=a(7),l=a(11),r=a(10),c=a(22),k=a(4),u=a(0);function b(t){var e,a="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),s="Branch: ".concat(t.name);return"string"!==typeof(e=t.name)||isNaN(e)||isNaN(parseFloat(e))||(s="PR #".concat(t.name)),Object(u.jsx)("a",{href:a,className:"App-link",children:s})}function f(t,e){return function(t){return k.reports.sort((function(e,a){return e[t]>a[t]?-1:e[t]<a[t]?1:0}))}(t).map((function(t,e){var a=t.lastUpdate,s=t.statistic;return Object(u.jsxs)("tr",{children:[Object(u.jsx)("td",{children:b(t)}),Object(u.jsx)("td",{children:a}),Object(u.jsxs)("td",{children:[Object(u.jsx)("span",{className:"label label-status-failed",children:s.failed})," ",Object(u.jsx)("span",{className:"label label-status-passed",children:s.passed})," ",Object(u.jsx)("span",{className:"label label-status-total",children:s.total})]})]},e)}))}function m(t,e,a){var s=Object.keys(k.reports[0]),n=a?"sort-by-asc":"sort-by-desc";return s.map((function(s,d){return Object(u.jsxs)("th",{onClick:function(){t(s,!a)},children:[s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toUpperCase(),Object(u.jsx)("span",{className:e===s?n:""})]},d)}))}var j=function(t){Object(l.a)(a,t);var e=Object(r.a)(a);function a(t){var s;return Object(p.a)(this,a),(s=e.call(this,t)).updateSorting=function(t,e){return s.setState({sortBy:t,sortDirection:e})},s.state={sortBy:"name",sortDirection:!0},s}return Object(o.a)(a,[{key:"render",value:function(){return Object(u.jsxs)(c.a,{bordered:!0,variant:"dark",id:"reportsTable",children:[Object(u.jsx)("thead",{children:Object(u.jsx)("tr",{children:m(this.updateSorting,this.state.sortBy,this.state.sortDirection)})}),Object(u.jsx)("tbody",{children:f(this.state.sortingColName)})]})}}]),a}(n.a.Component);var h=function(){return Object(u.jsxs)("div",{className:"App",children:[Object(u.jsx)("header",{className:"App-header",children:"This is header"}),Object(u.jsx)("div",{className:"App-content",children:Object(u.jsx)(j,{})}),Object(u.jsx)("footer",{className:"App-footer",children:"This is footer"})]})};i.a.render(Object(u.jsx)(n.a.StrictMode,{children:Object(u.jsx)(h,{})}),document.getElementById("root"))},4:function(t){t.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"18536","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19374","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19859","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19885","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19939","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19959","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19960","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19965","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19977","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19978","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20002","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20007","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20010","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20011","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20014","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20015","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20016","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20023","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20024","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16}},{"name":"20027","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20030","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20034","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20037","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20038","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16}},{"name":"20040","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16}},{"name":"20042","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20044","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20045","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20047","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20048","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20049","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20050","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"master","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}}]}')}},[[20,1,2]]]);
//# sourceMappingURL=main.2fc58f45.chunk.js.map