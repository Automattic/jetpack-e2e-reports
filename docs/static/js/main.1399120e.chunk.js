(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{22:function(t,e,a){},24:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var r=a(1),n=a.n(r),s=a(13),i=a.n(s),o=(a(22),a(23),a(24),a(14)),c=a(15),p=a(17),d=a(16),u=a(33),l=a(34),m=a(35),b=a(12),k=a(9),j=a(8),h=a(0),_=function(t){Object(p.a)(a,t);var e=Object(d.a)(a);function a(t){var r;return Object(o.a)(this,a),(r=e.call(this,t)).updateSorting=function(t,e){return r.setState({sortBy:t,isSortAsc:e})},r.state={sortBy:"lastUpdate",isSortAsc:!1},r}return Object(c.a)(a,[{key:"render",value:function(){return Object(h.jsxs)(u.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(h.jsxs)("thead",{children:[Object(h.jsx)("tr",{children:Object(h.jsx)("th",{colSpan:"3",children:Object(h.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(h.jsx)("tr",{children:Object(h.jsx)("td",{colSpan:"3",id:"sortButtons",children:A(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(h.jsx)("tbody",{children:g(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(n.a.Component);function f(t,e){switch(t){case"name":return function(t){return j.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return j.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return j.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function O(t,e,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),n=t.name,s=t.name;if(e.pr_title){var i="";e.pr?i="(#".concat(e.pr,")"):e.pr_number&&(i="(#".concat(e.pr_number,")")),s="".concat(e.pr_title," ").concat(i)}var o="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(h.jsxs)("ul",{className:"list-unstyled",children:[Object(h.jsxs)("li",{children:[Object(h.jsx)(b.a,{className:a?"failed":"passed",icon:a?k.c:k.a}),"\xa0",Object(h.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",children:[s,Object(h.jsx)("br",{})]})]}),Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["#",n," "," \u2022 ",Object(h.jsx)(b.a,{icon:k.b})," ",Object(h.jsx)("a",{href:o,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}function y(t){var e=["failed","passed","total"].map((function(e,a){var r="failed"===e?t[e]+t.broken:t[e];return Object(h.jsxs)(l.a,{className:"label label-status-".concat(e),children:[e," ",r]},a)}));return Object(h.jsx)("div",{children:e})}function x(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(h.jsxs)("ul",{className:"list-unstyled",children:[Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["last run id:"," ",Object(h.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}function g(t,e){return f(t,e).map((function(t,e){var a=t.statistic,r=t.metadata,n=a.total!==a.passed;return Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{children:O(t,r,n)}),Object(h.jsx)("td",{children:y(a)}),Object(h.jsx)("td",{children:x(t)})]},e)}))}function A(t,e,a){var r={name:"report id",statistic:"results",lastUpdate:"most recent"},n=a?"sort-by-asc":"sort-by-desc",s=Object.keys(r).map((function(s,i){return Object(h.jsxs)(m.a,{variant:"dark",onClick:function(){t(s,!a)},children:[r[s].toUpperCase(),Object(h.jsx)("span",{className:e===s?n:""})]},i)}));return Object(h.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(h.jsxs)("div",{children:[j.reportsCount," reports"]}),Object(h.jsx)("div",{children:s})]})}var v=function(){return Object(h.jsxs)("div",{className:"App",children:[Object(h.jsx)("header",{className:"App-header",children:"\xa0"}),Object(h.jsx)("div",{className:"App-content",children:Object(h.jsx)(_,{})}),Object(h.jsx)("footer",{className:"App-footer",children:"\xa0"})]})};i.a.render(Object(h.jsx)(n.a.StrictMode,{children:Object(h.jsx)(v,{})}),document.getElementById("root"))},8:function(t){t.exports=JSON.parse('{"reports":[{"name":"12521","lastUpdate":"Wed Jun 16 19:53:24 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/admin-page-package","pr":"12521","pr_number":"12521","pr_title":"Package: Add Admin Page Package","repository":"Automattic/jetpack","run_id":"944073936","run_number":"9842"}},{"name":"16434","lastUpdate":"Fri Jun 25 16:24:13 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"rm/deprecated-code","pr":"16434","pr_number":"16434","pr_title":"Janitorial: clean up deprecated code","repository":"Automattic/jetpack","run_id":"971987632","run_number":"10272"}},{"name":"20064","lastUpdate":"Fri Jun 11 22:42:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/make-paypal-productid-unique","pr":"20064","pr_number":"20064","pr_title":"[Simple Payments]: Do not duplicate productId on block duplication","repository":"Automattic/jetpack","run_id":"930004128","run_number":"9711"}},{"name":"20095","lastUpdate":"Mon Jun 28 10:49:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page","pr":"20095","pr_number":"20095","pr_title":"Search: add WP-Admin page for search and instant search toggling","repository":"Automattic/jetpack","run_id":"978642342","run_number":"10317"}},{"name":"20129","lastUpdate":"Wed Jun 23 12:28:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/custom-css-variable-support","pr":"20129","pr_number":"20129","pr_title":"Customizer > Custom CSS: Add support for CSS variables","repository":"Automattic/jetpack","run_id":"964247077","run_number":"10104"}},{"name":"20141","lastUpdate":"Wed Jun 23 15:40:14 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-plans-default-url","pr":"20141","pr_number":"20141","pr_title":"Masterbar: updates the default URL for Plans","repository":"Automattic/jetpack","run_id":"964860448","run_number":"10119"}},{"name":"20163","lastUpdate":"Thu Jun 24 07:11:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/ashiagr/r227673-wpcom-1624515795","pr":"20163","pr_number":"20163","pr_title":"Adds Zendesk site meta info to site API for Jetpack sites","repository":"Automattic/jetpack","run_id":"967020388","run_number":"10168"}},{"name":"20167","lastUpdate":"Thu Jun 24 13:08:31 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/rna-connect-screen","pr":"20167","pr_number":"20167","pr_title":"RNA: Connection Screen","repository":"Automattic/jetpack","run_id":"967999545","run_number":"10192"}},{"name":"20168","lastUpdate":"Tue Jun 29 15:45:18 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/beta-plugin-multiple-plugins","pr":"20168","pr_number":"20168","pr_title":"Beta plugin: Support managing multiple plugins","repository":"Automattic/jetpack","run_id":"983246227","run_number":"10402"}},{"name":"20176","lastUpdate":"Thu Jun 24 21:00:08 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/blockbase-theme-live-branch","pr":"20176","pr_number":"20176","pr_title":"Add Blockbase theme to live branches userscript","repository":"Automattic/jetpack","run_id":"969319597","run_number":"10229"}},{"name":"20183","lastUpdate":"Mon Jun 28 17:18:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/module_info","pr":"20183","pr_number":"20183","pr_title":"Modules: Add module info to the module-headings.php file","repository":"Automattic/jetpack","run_id":"979803785","run_number":"10352"}},{"name":"20185","lastUpdate":"Mon Jun 28 17:32:41 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/get_available_modules_use_slug","pr":"20185","pr_number":"20185","pr_title":"Modules: Use the module slug in get_available_modules","repository":"Automattic/jetpack","run_id":"979830407","run_number":"10353"}},{"name":"20192","lastUpdate":"Mon Jun 28 21:15:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/site-logo-block-compatibility","pr":"20192","pr_number":"20192","pr_title":"Site Logo: update for compatibility with WP 5.8 site_logo option","repository":"Automattic/jetpack","run_id":"980435944","run_number":"10366"}},{"name":"20194","lastUpdate":"Tue Jun 29 06:38:13 2021 +0000","statistic":{"failed":0,"broken":4,"skipped":0,"passed":12,"unknown":0,"total":16},"metadata":{"branch":"add/carousel-comments-indicator","pr":"20194","pr_number":"20194","pr_title":"Carousel: Visually indicate that an image has comments ","repository":"Automattic/jetpack","run_id":"981630124","run_number":"10379"}},{"name":"20195","lastUpdate":"Mon Jun 28 07:37:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/enable-double-tap-zoom-in-chrome-ios","pr":"20195","pr_number":"20195","pr_title":"Carousel: Try to re-enable double tap zoom in Chrome iOS","repository":"Automattic/jetpack","run_id":"978111052","run_number":"10311"}},{"name":"20206","lastUpdate":"Mon Jun 28 20:22:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-filter-mime-types","pr":"20206","pr_number":"20206","pr_title":"Jetpack Plan: filter video mime types","repository":"Automattic/jetpack","run_id":"980298305","run_number":"10364"}},{"name":"20207","lastUpdate":"Mon Jun 28 22:41:13 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/backup-plugin-ui","pr":"20207","pr_number":"20207","pr_title":"WIP: Adds Backup plugin components / styles for successful backup state","repository":"Automattic/jetpack","run_id":"980671838","run_number":"10369"}},{"name":"20210","lastUpdate":"Tue Jun 29 06:05:02 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/carousel-prevent-zoom-transition-slide","pr":"20210","pr_number":"20210","pr_title":"CarouselL prevent zoom transition slide","repository":"Automattic/jetpack","run_id":"981563421","run_number":"10377"}},{"name":"20211","lastUpdate":"Tue Jun 29 07:39:41 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/refactored-carousel-pagination-to-use-normal-font-weight","pr":"20211","pr_number":"20211","pr_title":"Refactored Carousel: set pagination font weight to normal","repository":"Automattic/jetpack","run_id":"981794785","run_number":"10380"}},{"name":"master","lastUpdate":"Tue Jun 29 16:19:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"983222183","run_number":"10401"}}],"reportsCount":20}')}},[[31,1,2]]]);
//# sourceMappingURL=main.1399120e.chunk.js.map