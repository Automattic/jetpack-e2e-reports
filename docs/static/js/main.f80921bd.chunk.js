(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{22:function(t,e,a){},24:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var r=a(1),n=a.n(r),s=a(13),i=a.n(s),c=(a(22),a(23),a(24),a(14)),o=a(15),p=a(17),d=a(16),u=a(33),l=a(34),m=a(35),b=a(12),j=a(9),h=a(8),k=a(0),f=function(t){Object(p.a)(a,t);var e=Object(d.a)(a);function a(t){var r;return Object(c.a)(this,a),(r=e.call(this,t)).updateSorting=function(t,e){return r.setState({sortBy:t,isSortAsc:e})},r.state={sortBy:"lastUpdate",isSortAsc:!1},r}return Object(o.a)(a,[{key:"render",value:function(){return Object(k.jsxs)(u.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(k.jsxs)("thead",{children:[Object(k.jsx)("tr",{children:Object(k.jsx)("th",{colSpan:"3",children:Object(k.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(k.jsx)("tr",{children:Object(k.jsx)("th",{colSpan:"3",id:"sortButtons",children:w(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(k.jsx)("tbody",{children:g(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(n.a.Component);function _(t,e){switch(t){case"name":return function(t){return h.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return h.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return h.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function x(t,e,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),n=t.name,s=t.name;if(e.pr_title){var i="";e.pr?i="(#".concat(e.pr,")"):e.pr_number&&(i="(#".concat(e.pr_number,")")),s="".concat(e.pr_title," ").concat(i)}var c="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(k.jsxs)("ul",{className:"list-unstyled",children:[Object(k.jsxs)("li",{children:[Object(k.jsx)(b.a,{className:a?"failed":"passed",icon:a?j.c:j.a}),"\xa0",Object(k.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",children:[s,Object(k.jsx)("br",{})]})]}),Object(k.jsx)("li",{children:Object(k.jsxs)("small",{children:["#",n," "," \u2022 ",Object(k.jsx)(b.a,{icon:j.b})," ",Object(k.jsx)("a",{href:c,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}function O(t){var e=["failed","passed","total"].map((function(e,a){var r="failed"===e?t[e]+t.broken:t[e];return Object(k.jsxs)(l.a,{className:"label label-status-".concat(e),children:[e," ",r]},a)}));return Object(k.jsx)("div",{children:e})}function y(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(k.jsxs)("ul",{className:"list-unstyled",children:[Object(k.jsx)("li",{children:Object(k.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(k.jsx)("li",{children:Object(k.jsxs)("small",{children:["last run id:"," ",Object(k.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}function g(t,e){return _(t,e).map((function(t,e){var a=t.statistic,r=t.metadata,n=a.total!==a.passed;return Object(k.jsxs)("tr",{children:[Object(k.jsx)("td",{children:x(t,r,n)}),Object(k.jsx)("td",{children:O(a)}),Object(k.jsx)("td",{children:y(t)})]},e)}))}function w(t,e,a){var r={name:"report id",statistic:"results",lastUpdate:"most recent"},n=a?"sort-by-asc":"sort-by-desc";return Object.keys(r).map((function(s,i){return Object(k.jsxs)(m.a,{variant:"dark",onClick:function(){t(s,!a)},children:[r[s].toUpperCase(),Object(k.jsx)("span",{className:e===s?n:""})]},i)}))}var v=function(){return Object(k.jsxs)("div",{className:"App",children:[Object(k.jsx)("header",{className:"App-header",children:"\xa0"}),Object(k.jsx)("div",{className:"App-content",children:Object(k.jsx)(f,{})}),Object(k.jsx)("footer",{className:"App-footer",children:"\xa0"})]})};i.a.render(Object(k.jsx)(n.a.StrictMode,{children:Object(k.jsx)(v,{})}),document.getElementById("root"))},8:function(t){t.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Thu Jun 10 15:55:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"test-branch","pr":"0","pr_number":"0","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"916686145","run_number":"000"}},{"name":"19818","lastUpdate":"Fri Jun 11 16:10:20 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-generate-autotagger","pr":"19818","pr_number":"19818","pr_title":"CLI - Add Autotagger to Generate","repository":"Automattic/jetpack","run_id":"929119542","run_number":"9704"}},{"name":"19859","lastUpdate":"Thu Jun 10 19:42:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-clean","pr":"19859","repository":"Automattic/jetpack","run_id":"926253527","run_number":"9679"}},{"name":"19933","lastUpdate":"Fri Jun 11 14:30:10 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-in-woa-with-free","pr":"19933","pr_number":"19933","pr_title":"Videopress: disable uploading for Free WoA","repository":"automattic/jetpack","run_id":"925476539","run_number":"000"}},{"name":"19939","lastUpdate":"Fri Jun 11 09:59:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/support-for-multi-site-results","pr":"19939","repository":"Automattic/jetpack","run_id":"928118725","run_number":"9691"}},{"name":"19959","lastUpdate":"Fri Jun 11 12:58:04 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"update/sync-v4-endpoints","pr":"19959","pr_number":"19959","pr_title":"Duplicate Sync endpoints to v4 REST endpoints","repository":"Automattic/jetpack","run_id":"928568640","run_number":"9699"}},{"name":"20015","lastUpdate":"Fri Jun 11 17:17:00 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/search-modal-animation","pr":"20015","pr_number":"20015","pr_title":"Instant Search: drop modal animation and use a simple transition","repository":"automattic/jetpack","run_id":"916599792","run_number":"0"}},{"name":"20042","lastUpdate":"Fri Jun 11 15:54:38 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/gardening-milestone-no-due-date","pr":"20042","pr_number":"20042","pr_title":"Gardening: fallback when we cannot find any with a due date.","repository":"Automattic/jetpack","run_id":"929076338","run_number":"9702"}},{"name":"20052","lastUpdate":"Fri Jun 11 17:30:09 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/premium-theme-info","pr":"20052","pr_number":"20052","pr_title":"Plans: Remove premium theme info","repository":"Automattic/jetpack","run_id":"929307221","run_number":"9706"}},{"name":"20056","lastUpdate":"Fri Jun 11 12:45:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/show-carousel-enable-toggle","pr":"20056","pr_number":"20056","pr_title":"Image Carousel: Show carousel enable toggle in media options.","repository":"Automattic/jetpack","run_id":"928291459","run_number":"9694"}},{"name":"20060","lastUpdate":"Fri Jun 11 17:17:00 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/embeds-double-quotes","pr":"20060","pr_number":"20060","pr_title":"Shortcode Embeds: Fix compat with Lazy Loading","repository":"automattic/jetpack","run_id":"926339669","run_number":"0"}},{"name":"20061","lastUpdate":"Fri Jun 11 21:24:51 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/backup-plugin-release","pr":"20061","pr_number":"20061","pr_title":"Backup: test release process for Backup plugin prototype","repository":"Automattic/jetpack","run_id":"929848697","run_number":"9710"}},{"name":"20062","lastUpdate":"Fri Jun 11 12:30:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/scruffian/r227092-wpcom-1623406878","pr":"20062","pr_number":"20062","pr_title":"Inline PDFs: Fix the height to 800px to overcome theme specific CSS.","repository":"Automattic/jetpack","run_id":"928494389","run_number":"9697"}},{"name":"20064","lastUpdate":"Fri Jun 11 22:42:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/make-paypal-productid-unique","pr":"20064","pr_number":"20064","pr_title":"[Simple Payments]: Do not duplicate productId on block duplication","repository":"Automattic/jetpack","run_id":"930004128","run_number":"9711"}},{"name":"master","lastUpdate":"Sun Jun 13 00:11:25 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"932142994","run_number":"9714"}}]}')}},[[31,1,2]]]);
//# sourceMappingURL=main.f80921bd.chunk.js.map