(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{10:function(t){t.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Thu Jun 10 15:55:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"test-branch","pr":"0","pr_number":"0","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"916686145","run_number":"000"}},{"name":"19859","lastUpdate":"Thu Jun 10 19:42:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-clean","pr":"19859","repository":"Automattic/jetpack","run_id":"926253527","run_number":"9679"}},{"name":"19933","lastUpdate":"Fri Jun 11 14:30:10 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-in-woa-with-free","pr":"19933","pr_number":"19933","pr_title":"Videopress: disable uploading for Free WoA","repository":"automattic/jetpack","run_id":"925476539","run_number":"000"}},{"name":"19939","lastUpdate":"Fri Jun 11 09:59:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/support-for-multi-site-results","pr":"19939","repository":"Automattic/jetpack","run_id":"928118725","run_number":"9691"}},{"name":"20015","lastUpdate":"Fri Jun 11 12:22:07 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"20015","pr_number":"20015","pr_title":"Instant Search: drop modal animation and use a simple transition","repository":"automattic/jetpack","run_id":"916599792","run_number":"0"}},{"name":"20056","lastUpdate":"Fri Jun 11 12:45:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/show-carousel-enable-toggle","pr":"20056","pr_number":"20056","pr_title":"Image Carousel: Show carousel enable toggle in media options.","repository":"Automattic/jetpack","run_id":"928291459","run_number":"9694"}},{"name":"20060","lastUpdate":"Fri Jun 11 12:10:08 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"20060","pr_number":"20060","pr_title":"Shortcode Embeds: Fix compat with Lazy Loading","repository":"automattic/jetpack","run_id":"926339669","run_number":"0"}},{"name":"20061","lastUpdate":"Thu Jun 10 22:47:23 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/backup-plugin-release","pr":"20061","pr_number":"20061","pr_title":"Backup: test release process for Backup plugin prototype","repository":"Automattic/jetpack","run_id":"926700528","run_number":"9688"}},{"name":"20062","lastUpdate":"Fri Jun 11 12:30:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/scruffian/r227092-wpcom-1623406878","pr":"20062","pr_number":"20062","pr_title":"Inline PDFs: Fix the height to 800px to overcome theme specific CSS.","repository":"Automattic/jetpack","run_id":"928494389","run_number":"9697"}},{"name":"master","lastUpdate":"Fri Jun 11 12:38:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"928517200","run_number":"9698"}}]}')},28:function(t,e,a){},30:function(t,e,a){},38:function(t,e,a){"use strict";a.r(e);var r=a(0),n=a.n(r),s=a(6),i=a.n(s),c=(a(28),a(29),a(30),a(19)),o=a(20),p=a(23),u=a(22),d=a(44),l=a(47),b=a(45),m=a(46),j=a(17),h=a(11),k=a(10),f=a(3),_=function(t){Object(p.a)(a,t);var e=Object(u.a)(a);function a(t){var r;return Object(c.a)(this,a),(r=e.call(this,t)).updateSorting=function(t,e){return r.setState({sortBy:t,sortDirection:e})},r.state={sortBy:"lastUpdate",sortDirection:!1},r}return Object(o.a)(a,[{key:"render",value:function(){return Object(f.jsxs)(d.a,{bordered:!0,hover:!0,size:"sm",variant:"dark",id:"reportsTable",children:[Object(f.jsx)("thead",{children:Object(f.jsx)("tr",{children:v(this.updateSorting,this.state.sortBy,this.state.sortDirection)})}),Object(f.jsx)("tbody",{children:w(this.state.sortBy,this.state.sortDirection)})]})}}]),a}(n.a.Component);function O(t,e){switch(console.log("!!!!!",t,e),t){case"name":return function(t){return k.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return k.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return k.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function x(t,e,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),n=t.name,s=t.name;if(e.pr_title){var i="";e.pr?i="(#".concat(e.pr,")"):e.pr_number&&(i="(#".concat(e.pr_number,")")),s="".concat(e.pr_title," ").concat(i)}return Object(f.jsxs)("span",{children:[Object(f.jsx)(j.a,{className:a?"failed":"passed",icon:a?h.c:h.a}),"\xa0",Object(f.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",children:[s,Object(f.jsx)("br",{})]}),Object(f.jsxs)("sub",{children:["#",n," "," \u2022 ",Object(f.jsx)(j.a,{icon:h.b})," ",e.branch]})]})}function y(t){var e=["failed","passed","total"].map((function(e,a){var r="failed"===e?t[e]+t.broken:t[e];return Object(f.jsx)(l.a,{placement:"right",delay:{show:250,hide:400},overlay:Object(f.jsx)(b.a,{id:"tooltip-".concat(e),children:U(e)+" tests"}),children:Object(f.jsxs)(m.a,{className:"label label-status-".concat(e),children:[e," ",r]})},a)}));return Object(f.jsx)("div",{children:e})}function w(t,e){return O(t,e).map((function(t,e){var a,r=t.lastUpdate,n=t.statistic,s=t.metadata,i=n.total!==n.passed;return Object(f.jsxs)("tr",{children:[Object(f.jsx)("td",{children:x(t,s,i)}),Object(f.jsx)("td",{children:y(n)}),Object(f.jsx)("td",{children:(a=r,new Date(Date.parse(a)).toLocaleString())})]},e)}))}function v(t,e,a){var r=a?"sort-by-asc":"sort-by-desc";return["name","statistic","lastUpdate"].map((function(n,s){return Object(f.jsxs)("th",{onClick:function(){t(n,!a)},children:[n.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toUpperCase(),Object(f.jsx)("span",{className:e===n?r:""})]},s)}))}var U=function(t){return t.charAt(0).toUpperCase()+t.slice(1)};var g=function(){return Object(f.jsxs)("div",{className:"App",children:[Object(f.jsx)("header",{className:"App-header",children:"Jetpack E2E test reports"}),Object(f.jsx)("div",{className:"App-content",children:Object(f.jsx)(_,{})}),Object(f.jsx)("footer",{className:"App-footer",children:"\xa0"})]})};i.a.render(Object(f.jsx)(n.a.StrictMode,{children:Object(f.jsx)(g,{})}),document.getElementById("root"))}},[[38,1,2]]]);
//# sourceMappingURL=main.c3858d0b.chunk.js.map