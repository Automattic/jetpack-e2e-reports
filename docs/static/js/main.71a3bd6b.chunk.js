(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{24:function(t,e,a){},26:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var s=a(0),n=a.n(s),i=a(5),d=a.n(i),o=(a(24),a(25),a(26),a(15)),p=a(16),r=a(19),l=a(18),c=a(37),u=a(39),k=a(38),b=a(9),f=a(2),m=function(t){Object(r.a)(a,t);var e=Object(l.a)(a);function a(t){var s;return Object(o.a)(this,a),(s=e.call(this,t)).updateSorting=function(t,e){return s.setState({sortBy:t,sortDirection:e})},s.state={sortBy:"name",sortDirection:!0},s}return Object(p.a)(a,[{key:"render",value:function(){return Object(f.jsxs)(c.a,{bordered:!0,variant:"dark",id:"reportsTable",children:[Object(f.jsx)("thead",{children:Object(f.jsx)("tr",{children:J(this.updateSorting,this.state.sortBy,this.state.sortDirection)})}),Object(f.jsx)("tbody",{children:w(this.state.sortBy,this.state.sortDirection)})]})}}]),a}(n.a.Component);function h(t,e){switch(console.log("!!!!!",t,e),t){case"name":return function(t){return b.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return b.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return b.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function j(t){var e,a="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),s="Branch: ".concat(t.name);return"string"!==typeof(e=t.name)||isNaN(e)||isNaN(parseFloat(e))||(s="PR #".concat(t.name)),Object(f.jsx)("a",{href:a,className:"App-link",children:s})}function U(t){var e=t.total!==t.passed,a=["failed","passed","total"].map((function(e,a){var s="failed"===e?t[e]+t.broken:t[e];return Object(f.jsx)(u.a,{placement:"right",delay:{show:250,hide:400},overlay:Object(f.jsx)(k.a,{id:"tooltip-".concat(e),children:O(e)+" tests"}),children:Object(f.jsx)("span",{className:"label label-status-".concat(e),children:s})},a)}));return Object(f.jsxs)("div",{children:[Object(f.jsx)("span",{children:"Tests ".concat(e?"failed":"passed",": ")}),a]})}function w(t,e){return h(t,e).map((function(t,e){var a,s=t.lastUpdate,n=t.statistic;return Object(f.jsxs)("tr",{children:[Object(f.jsx)("td",{children:j(t)}),Object(f.jsx)("td",{children:(a=s,new Date(Date.parse(a)).toLocaleString())}),Object(f.jsx)("td",{children:U(n)})]},e)}))}function J(t,e,a){var s=Object.keys(b.reports[0]),n=a?"sort-by-asc":"sort-by-desc";return s.map((function(s,i){return Object(f.jsxs)("th",{onClick:function(){t(s,!a)},children:[s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toUpperCase(),Object(f.jsx)("span",{className:e===s?n:""})]},i)}))}var O=function(t){return t.charAt(0).toUpperCase()+t.slice(1)};var x=function(){return Object(f.jsxs)("div",{className:"App",children:[Object(f.jsx)("header",{className:"App-header",children:"This is header"}),Object(f.jsx)("div",{className:"App-content",children:Object(f.jsx)(m,{})}),Object(f.jsx)("footer",{className:"App-footer",children:"This is footer"})]})};d.a.render(Object(f.jsx)(n.a.StrictMode,{children:Object(f.jsx)(x,{})}),document.getElementById("root"))},9:function(t){t.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Thu Jun 10 10:28:41 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"17571","lastUpdate":"","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"18536","lastUpdate":"Mon Jun 7 21:52:22 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19374","lastUpdate":"Wed Jun 9 16:47:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19859","lastUpdate":"Wed Jun 9 21:18:55 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19885","lastUpdate":"Thu Jun 10 09:08:12 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19939","lastUpdate":"Thu Jun 10 11:55:30 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19959","lastUpdate":"Tue Jun 8 13:31:22 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19960","lastUpdate":"Tue Jun 8 13:26:25 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19965","lastUpdate":"Thu Jun 10 09:05:00 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19977","lastUpdate":"Wed Jun 9 05:01:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"19978","lastUpdate":"Tue Jun 8 16:37:23 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20002","lastUpdate":"Mon Jun 7 20:12:53 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20007","lastUpdate":"Wed Jun 9 04:57:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20010","lastUpdate":"Wed Jun 9 22:13:47 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20011","lastUpdate":"Tue Jun 8 12:37:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20014","lastUpdate":"Thu Jun 10 04:37:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20015","lastUpdate":"Mon Jun 7 23:35:16 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20016","lastUpdate":"Mon Jun 7 14:47:36 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20023","lastUpdate":"Wed Jun 9 08:36:24 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20024","lastUpdate":"Wed Jun 9 19:39:45 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16}},{"name":"20027","lastUpdate":"Mon Jun 7 20:06:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20030","lastUpdate":"Mon Jun 7 20:06:31 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20034","lastUpdate":"Wed Jun 9 14:40:09 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20037","lastUpdate":"Mon Jun 7 20:45:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20038","lastUpdate":"Mon Jun 7 19:43:05 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16}},{"name":"20040","lastUpdate":"Wed Jun 9 20:12:43 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16}},{"name":"20042","lastUpdate":"Tue Jun 8 17:03:08 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20044","lastUpdate":"Tue Jun 8 21:07:57 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20045","lastUpdate":"Tue Jun 8 18:47:42 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20047","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20048","lastUpdate":"Wed Jun 9 04:35:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20049","lastUpdate":"Wed Jun 9 02:36:55 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20050","lastUpdate":"Tue Jun 8 23:28:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20052","lastUpdate":"Wed Jun 9 20:44:48 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20053","lastUpdate":"Thu Jun 10 01:02:21 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"20056","lastUpdate":"Thu Jun 10 12:37:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}},{"name":"master","lastUpdate":"Thu Jun 10 12:17:16 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16}}]}')}},[[31,1,2]]]);
//# sourceMappingURL=main.71a3bd6b.chunk.js.map