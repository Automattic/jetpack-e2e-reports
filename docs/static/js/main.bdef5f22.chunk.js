(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{24:function(a,n,t){},26:function(a,n,t){},31:function(a,n,t){"use strict";t.r(n);var e=t(0),r=t.n(e),s=t(5),i=t.n(s),u=(t(24),t(25),t(26),t(15)),d=t(16),p=t(19),o=t(18),c=t(37),l=t(39),b=t(38),m=t(9),_=t(2),k=function(a){Object(p.a)(t,a);var n=Object(o.a)(t);function t(a){var e;return Object(u.a)(this,t),(e=n.call(this,a)).updateSorting=function(a,n){return e.setState({sortBy:a,sortDirection:n})},e.state={sortBy:"name",sortDirection:!0},e}return Object(d.a)(t,[{key:"render",value:function(){return Object(_.jsxs)(c.a,{bordered:!0,variant:"dark",id:"reportsTable",children:[Object(_.jsx)("thead",{children:Object(_.jsx)("tr",{children:w(this.updateSorting,this.state.sortBy,this.state.sortDirection)})}),Object(_.jsx)("tbody",{children:U(this.state.sortBy,this.state.sortDirection)})]})}}]),t}(r.a.Component);function h(a,n){switch(console.log("!!!!!",a,n),a){case"name":return function(a){return m.reports.sort((function(n,t){return a?n.name-t.name:t.name-n.name}))}(n);case"lastUpdate":return function(a){return m.reports.sort((function(n,t){return a?Date.parse(n.lastUpdate)-Date.parse(t.lastUpdate):Date.parse(t.lastUpdate)-Date.parse(n.lastUpdate)}))}(n);case"statistic":return function(a){return m.reports.sort((function(n,t){return a?n.statistic.failed+n.statistic.broken-(t.statistic.failed+t.statistic.broken):t.statistic.failed+t.statistic.broken-(n.statistic.failed+n.statistic.broken)}))}(n)}}function f(a){var n,t="https://automattic.github.io/jetpack-e2e-reports/".concat(a.name,"/report/"),e="Branch: ".concat(a.name);return"string"!==typeof(n=a.name)||isNaN(n)||isNaN(parseFloat(n))||(e="PR #".concat(a.name)),Object(_.jsx)("a",{href:t,className:"App-link",target:"_blank",rel:"noreferrer",children:e})}function j(a){var n=a.total!==a.passed,t=["failed","passed","total"].map((function(n,t){var e="failed"===n?a[n]+a.broken:a[n];return Object(_.jsx)(l.a,{placement:"right",delay:{show:250,hide:400},overlay:Object(_.jsx)(b.a,{id:"tooltip-".concat(n),children:J(n)+" tests"}),children:Object(_.jsx)("span",{className:"label label-status-".concat(n),children:e})},t)}));return Object(_.jsxs)("div",{children:[Object(_.jsx)("span",{children:"Tests ".concat(n?"failed":"passed",": ")}),t]})}function U(a,n){return h(a,n).map((function(a,n){var t,e=a.lastUpdate,r=a.statistic;return Object(_.jsxs)("tr",{children:[Object(_.jsx)("td",{children:f(a)}),Object(_.jsx)("td",{children:(t=e,new Date(Date.parse(t)).toLocaleString())}),Object(_.jsx)("td",{children:j(r)})]},n)}))}function w(a,n,t){var e=Object.keys(m.reports[0]),r=t?"sort-by-asc":"sort-by-desc";return e.map((function(e,s){return Object(_.jsxs)("th",{onClick:function(){a(e,!t)},children:[e.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toUpperCase(),Object(_.jsx)("span",{className:n===e?r:""})]},s)}))}var J=function(a){return a.charAt(0).toUpperCase()+a.slice(1)};var O=function(){return Object(_.jsxs)("div",{className:"App",children:[Object(_.jsx)("header",{className:"App-header",children:"This is header"}),Object(_.jsx)("div",{className:"App-content",children:Object(_.jsx)(k,{})}),Object(_.jsx)("footer",{className:"App-footer",children:"This is footer"})]})};i.a.render(Object(_.jsx)(r.a.StrictMode,{children:Object(_.jsx)(O,{})}),document.getElementById("root"))},9:function(a){a.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Thu Jun 10 15:55:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"test-branch","pr":"0","pr_number":"0","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"916686145","run_number":"000"}},{"name":"17312","lastUpdate":"Thu Jun 10 17:29:22 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/activecampaign-js-error","pr":"17312","repository":"Automattic/jetpack","run_id":"925924761","run_number":"9673"}},{"name":"17571","lastUpdate":"Thu Jun 10 16:08:13 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/lazy-images-build-system","pr":"17571","repository":"Automattic/jetpack","run_id":"925717674","run_number":"9668"}},{"name":"18536","lastUpdate":"Mon Jun 7 21:52:22 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19374","lastUpdate":"Wed Jun 9 16:47:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19859","lastUpdate":"Thu Jun 10 19:42:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-clean","pr":"19859","repository":"Automattic/jetpack","run_id":"926253527","run_number":"9679"}},{"name":"19885","lastUpdate":"Thu Jun 10 09:08:12 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19933","lastUpdate":"Thu Jun 10 15:21:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-in-woa-with-free","pr":"19933","pr_number":"19933","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"925476539","run_number":"000"}},{"name":"19939","lastUpdate":"Thu Jun 10 11:55:30 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19959","lastUpdate":"Tue Jun 8 13:31:22 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19960","lastUpdate":"Tue Jun 8 13:26:25 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19965","lastUpdate":"Thu Jun 10 09:05:00 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19977","lastUpdate":"Wed Jun 9 05:01:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"19978","lastUpdate":"Tue Jun 8 16:37:23 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20002","lastUpdate":"Mon Jun 7 20:12:53 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20007","lastUpdate":"Wed Jun 9 04:57:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20010","lastUpdate":"Wed Jun 9 22:13:47 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20011","lastUpdate":"Tue Jun 8 12:37:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20014","lastUpdate":"Thu Jun 10 04:37:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20015","lastUpdate":"Mon Jun 7 23:35:16 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20016","lastUpdate":"Mon Jun 7 14:47:36 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20023","lastUpdate":"Wed Jun 9 08:36:24 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20024","lastUpdate":"Wed Jun 9 19:39:45 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20027","lastUpdate":"Mon Jun 7 20:06:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20030","lastUpdate":"Mon Jun 7 20:06:31 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20034","lastUpdate":"Wed Jun 9 14:40:09 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20037","lastUpdate":"Mon Jun 7 20:45:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20038","lastUpdate":"Mon Jun 7 19:43:05 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20040","lastUpdate":"Wed Jun 9 20:12:43 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20042","lastUpdate":"Tue Jun 8 17:03:08 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20044","lastUpdate":"Tue Jun 8 21:07:57 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20045","lastUpdate":"Tue Jun 8 18:47:42 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20047","lastUpdate":"Wed Jun 9 19:42:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20048","lastUpdate":"Wed Jun 9 04:35:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20049","lastUpdate":"Wed Jun 9 02:36:55 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20050","lastUpdate":"Tue Jun 8 23:28:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20052","lastUpdate":"Thu Jun 10 18:09:03 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/premium-theme-info","pr":"20052","repository":"Automattic/jetpack","run_id":"926018605","run_number":"9675"}},{"name":"20053","lastUpdate":"Thu Jun 10 01:02:21 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20056","lastUpdate":"Thu Jun 10 12:37:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20058","lastUpdate":"Thu Jun 10 14:59:14 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"n/a","pr_number":"n/a","pr_title":"n/a","run_id":"n/a","run_number":"n/a"}},{"name":"20059","lastUpdate":"Thu Jun 10 19:33:08 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/docker-to-latest-lts","pr":"20059","repository":"Automattic/jetpack","run_id":"926229586","run_number":"9677"}},{"name":"master","lastUpdate":"Thu Jun 10 16:43:16 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","repository":"Automattic/jetpack","run_id":"925820504","run_number":"9671"}}]}')}},[[31,1,2]]]);
//# sourceMappingURL=main.bdef5f22.chunk.js.map