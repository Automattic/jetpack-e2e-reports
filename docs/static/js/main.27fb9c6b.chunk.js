(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{22:function(t,e,a){},24:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var n=a(1),r=a.n(n),i=a(13),s=a.n(i),o=(a(22),a(23),a(24),a(14)),p=a(15),c=a(17),d=a(16),u=a(33),l=a(34),m=a(35),b=a(12),k=a(9),j=a(8),h=a(0),_=function(t){Object(c.a)(a,t);var e=Object(d.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).updateSorting=function(t,e){return n.setState({sortBy:t,isSortAsc:e})},n.state={sortBy:"lastUpdate",isSortAsc:!1},n}return Object(p.a)(a,[{key:"render",value:function(){return Object(h.jsxs)(u.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(h.jsxs)("thead",{children:[Object(h.jsx)("tr",{children:Object(h.jsx)("th",{colSpan:"3",children:Object(h.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(h.jsx)("tr",{children:Object(h.jsx)("th",{colSpan:"3",id:"sortButtons",children:O(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(h.jsx)("tbody",{children:x(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(r.a.Component);function f(t,e){switch(t){case"name":return function(t){return j.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return j.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return j.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function y(t,e,a){var n="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),r=t.name,i=t.name;if(e.pr_title){var s="";e.pr?s="(#".concat(e.pr,")"):e.pr_number&&(s="(#".concat(e.pr_number,")")),i="".concat(e.pr_title," ").concat(s)}var o="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(h.jsxs)("ul",{className:"list-unstyled",children:[Object(h.jsxs)("li",{children:[Object(h.jsx)(b.a,{className:a?"failed":"passed",icon:a?k.c:k.a}),"\xa0",Object(h.jsxs)("a",{href:n,className:"report-link",target:"_blank",rel:"noreferrer",children:[i,Object(h.jsx)("br",{})]})]}),Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["#",r," "," \u2022 ",Object(h.jsx)(b.a,{icon:k.b})," ",Object(h.jsx)("a",{href:o,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}function w(t){var e=["failed","passed","total"].map((function(e,a){var n="failed"===e?t[e]+t.broken:t[e];return Object(h.jsxs)(l.a,{className:"label label-status-".concat(e),children:[e," ",n]},a)}));return Object(h.jsx)("div",{children:e})}function A(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(h.jsxs)("ul",{className:"list-unstyled",children:[Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["last run id:"," ",Object(h.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}function x(t,e){return f(t,e).map((function(t,e){var a=t.statistic,n=t.metadata,r=a.total!==a.passed;return Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{children:y(t,n,r)}),Object(h.jsx)("td",{children:w(a)}),Object(h.jsx)("td",{children:A(t)})]},e)}))}function O(t,e,a){var n={name:"report id",statistic:"results",lastUpdate:"most recent"},r=a?"sort-by-asc":"sort-by-desc";return Object.keys(n).map((function(i,s){return Object(h.jsxs)(m.a,{variant:"dark",onClick:function(){t(i,!a)},children:[n[i].toUpperCase(),Object(h.jsx)("span",{className:e===i?r:""})]},s)}))}var g=function(){return Object(h.jsxs)("div",{className:"App",children:[Object(h.jsx)("header",{className:"App-header",children:"\xa0"}),Object(h.jsx)("div",{className:"App-content",children:Object(h.jsx)(_,{})}),Object(h.jsx)("footer",{className:"App-footer",children:"\xa0"})]})};s.a.render(Object(h.jsx)(r.a.StrictMode,{children:Object(h.jsx)(g,{})}),document.getElementById("root"))},8:function(t){t.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Thu Jun 10 15:55:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"test-branch","pr":"0","pr_number":"0","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"916686145","run_number":"000"}},{"name":"19818","lastUpdate":"Fri Jun 11 16:10:20 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-generate-autotagger","pr":"19818","pr_number":"19818","pr_title":"CLI - Add Autotagger to Generate","repository":"Automattic/jetpack","run_id":"929119542","run_number":"9704"}},{"name":"19859","lastUpdate":"Thu Jun 10 19:42:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-clean","pr":"19859","repository":"Automattic/jetpack","run_id":"926253527","run_number":"9679"}},{"name":"19885","lastUpdate":"Mon Jun 14 11:05:42 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/static-filters-support","pr":"19885","pr_number":"19885","pr_title":"Add support for group_id","repository":"Automattic/jetpack","run_id":"935520273","run_number":"9723"}},{"name":"19933","lastUpdate":"Fri Jun 11 14:30:10 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-in-woa-with-free","pr":"19933","pr_number":"19933","pr_title":"Videopress: disable uploading for Free WoA","repository":"automattic/jetpack","run_id":"925476539","run_number":"000"}},{"name":"19939","lastUpdate":"Mon Jun 14 11:14:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/support-for-multi-site-results","pr":"19939","pr_number":"19939","pr_title":"Instant Search: support multi site search results","repository":"Automattic/jetpack","run_id":"935536245","run_number":"9725"}},{"name":"19959","lastUpdate":"Mon Jun 14 17:45:29 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/sync-v4-endpoints","pr":"19959","pr_number":"19959","pr_title":"Duplicate Sync endpoints to v4 REST endpoints","repository":"Automattic/jetpack","run_id":"936638397","run_number":"9739"}},{"name":"19960","lastUpdate":"Mon Jun 14 19:58:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/idc-endpoint-migration","pr":"19960","pr_number":"19960","pr_title":"Migrate v4 IDC endpoints into package","repository":"Automattic/jetpack","run_id":"936978327","run_number":"9748"}},{"name":"19993","lastUpdate":"Mon Jun 14 03:40:02 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/add-csstidy-config-setting-to-preserve-leading-decimal-zero","pr":"19993","pr_number":"19993","pr_title":"CSSTidy: preserve leading decimal zeros in Gutenberg","repository":"Automattic/jetpack","run_id":"934474674","run_number":"9718"}},{"name":"20014","lastUpdate":"Mon Jun 14 03:52:36 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/disable-notifications-in-site-editor","pr":"20014","pr_number":"20014","pr_title":"Notes: Disable Admin menu in Jetpack Notifications when in Site Editor","repository":"Automattic/jetpack","run_id":"934495714","run_number":"9719"}},{"name":"20015","lastUpdate":"Mon Jun 14 04:34:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/search-modal-animation","pr":"20015","pr_number":"20015","pr_title":"Instant Search: drop modal animation and use a simple transition","repository":"Automattic/jetpack","run_id":"934564808","run_number":"9720"}},{"name":"20042","lastUpdate":"Fri Jun 11 15:54:38 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/gardening-milestone-no-due-date","pr":"20042","pr_number":"20042","pr_title":"Gardening: fallback when we cannot find any with a due date.","repository":"Automattic/jetpack","run_id":"929076338","run_number":"9702"}},{"name":"20052","lastUpdate":"Fri Jun 11 17:30:09 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/premium-theme-info","pr":"20052","pr_number":"20052","pr_title":"Plans: Remove premium theme info","repository":"Automattic/jetpack","run_id":"929307221","run_number":"9706"}},{"name":"20056","lastUpdate":"Fri Jun 11 12:45:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/show-carousel-enable-toggle","pr":"20056","pr_number":"20056","pr_title":"Image Carousel: Show carousel enable toggle in media options.","repository":"Automattic/jetpack","run_id":"928291459","run_number":"9694"}},{"name":"20060","lastUpdate":"Fri Jun 11 17:17:00 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/embeds-double-quotes","pr":"20060","pr_number":"20060","pr_title":"Shortcode Embeds: Fix compat with Lazy Loading","repository":"automattic/jetpack","run_id":"926339669","run_number":"0"}},{"name":"20061","lastUpdate":"Mon Jun 14 21:44:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/backup-plugin-release","pr":"20061","pr_number":"20061","pr_title":"Backup: test release process for Backup plugin prototype","repository":"Automattic/jetpack","run_id":"937255965","run_number":"9754"}},{"name":"20062","lastUpdate":"Fri Jun 11 12:30:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/scruffian/r227092-wpcom-1623406878","pr":"20062","pr_number":"20062","pr_title":"Inline PDFs: Fix the height to 800px to overcome theme specific CSS.","repository":"Automattic/jetpack","run_id":"928494389","run_number":"9697"}},{"name":"20064","lastUpdate":"Fri Jun 11 22:42:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/make-paypal-productid-unique","pr":"20064","pr_number":"20064","pr_title":"[Simple Payments]: Do not duplicate productId on block duplication","repository":"Automattic/jetpack","run_id":"930004128","run_number":"9711"}},{"name":"20067","lastUpdate":"Mon Jun 14 14:08:23 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/move-connection-owner-endpoint","pr":"20067","pr_number":"20067","pr_title":"Connection: Move \'connection/owner\' endpoint to Connection","repository":"Automattic/jetpack","run_id":"935973890","run_number":"9729"}},{"name":"20068","lastUpdate":"Mon Jun 14 15:06:14 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"rna/remove-in-place","pr":"20068","pr_number":"20068","pr_title":"RNA Connection: remove In-Place Connection","repository":"Automattic/jetpack","run_id":"936189859","run_number":"9734"}},{"name":"20070","lastUpdate":"Mon Jun 14 18:35:31 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/get-options-by-ids","pr":"20070","pr_number":"20070","pr_title":"Allow for options to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"936766942","run_number":"9742"}},{"name":"20071","lastUpdate":"Mon Jun 14 18:15:52 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/callables-get-objects-by-id","pr":"20071","pr_number":"20071","pr_title":"Allow for callables to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"936716183","run_number":"9740"}},{"name":"20072","lastUpdate":"Mon Jun 14 18:57:04 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/constants-get-objects-by-id","pr":"20072","pr_number":"20072","pr_title":"Allow for constants to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"936820807","run_number":"9743"}},{"name":"20073","lastUpdate":"Mon Jun 14 19:14:20 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/init_idc_sync","pr":"20073","pr_number":"20073","pr_title":"Sync: move the IDC initialization to the Sync package","repository":"Automattic/jetpack","run_id":"936865914","run_number":"9744"}},{"name":"20074","lastUpdate":"Mon Jun 14 19:23:02 2021 +0000","statistic":{"failed":0,"broken":3,"skipped":0,"passed":13,"unknown":0,"total":16},"metadata":{"branch":"add/themes-get-objects-by-id","pr":"20074","pr_number":"20074","pr_title":"Allow for theme-info to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"936883459","run_number":"9745"}},{"name":"20075","lastUpdate":"Mon Jun 14 19:47:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/updates-get-objects-by-id","pr":"20075","pr_number":"20075","pr_title":"Allow for updates to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"936955395","run_number":"9746"}},{"name":"master","lastUpdate":"Tue Jun 15 00:15:19 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"937548883","run_number":"9755"}}]}')}},[[31,1,2]]]);
//# sourceMappingURL=main.27fb9c6b.chunk.js.map