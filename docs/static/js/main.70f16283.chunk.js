(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{22:function(t,e,a){},24:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var r=a(1),n=a.n(r),s=a(13),i=a.n(s),o=(a(22),a(23),a(24),a(14)),p=a(15),c=a(17),u=a(16),d=a(33),l=a(34),m=a(35),b=a(12),k=a(9),_=a(8),j=a(0),h=function(t){Object(c.a)(a,t);var e=Object(u.a)(a);function a(t){var r;return Object(o.a)(this,a),(r=e.call(this,t)).updateSorting=function(t,e){return r.setState({sortBy:t,isSortAsc:e})},r.state={sortBy:"lastUpdate",isSortAsc:!1},r}return Object(p.a)(a,[{key:"render",value:function(){return Object(j.jsxs)(d.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(j.jsxs)("thead",{children:[Object(j.jsx)("tr",{children:Object(j.jsx)("th",{colSpan:"3",children:Object(j.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(j.jsx)("tr",{children:Object(j.jsx)("td",{colSpan:"3",id:"sortButtons",children:x(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(j.jsx)("tbody",{children:O(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(n.a.Component);function f(t,e){switch(t){case"name":return function(t){return _.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return _.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return _.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function y(t,e,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),n=t.name,s=t.name;if(e.pr_title){var i="";e.pr?i="(#".concat(e.pr,")"):e.pr_number&&(i="(#".concat(e.pr_number,")")),s="".concat(e.pr_title," ").concat(i)}var o="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(j.jsxs)("ul",{className:"list-unstyled",children:[Object(j.jsxs)("li",{children:[Object(j.jsx)(b.a,{className:a?"failed":"passed",icon:a?k.c:k.a}),"\xa0",Object(j.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",children:[s,Object(j.jsx)("br",{})]})]}),Object(j.jsx)("li",{children:Object(j.jsxs)("small",{children:["#",n," "," \u2022 ",Object(j.jsx)(b.a,{icon:k.b})," ",Object(j.jsx)("a",{href:o,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}function g(t){var e=["failed","passed","total"].map((function(e,a){var r="failed"===e?t[e]+t.broken:t[e];return Object(j.jsxs)(l.a,{className:"label label-status-".concat(e),children:[e," ",r]},a)}));return Object(j.jsx)("div",{children:e})}function A(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(j.jsxs)("ul",{className:"list-unstyled",children:[Object(j.jsx)("li",{children:Object(j.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(j.jsx)("li",{children:Object(j.jsxs)("small",{children:["last run id:"," ",Object(j.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}function O(t,e){return f(t,e).map((function(t,e){var a=t.statistic,r=t.metadata,n=a.total!==a.passed;return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:y(t,r,n)}),Object(j.jsx)("td",{children:g(a)}),Object(j.jsx)("td",{children:A(t)})]},e)}))}function x(t,e,a){var r={name:"report id",statistic:"results",lastUpdate:"most recent"},n=a?"sort-by-asc":"sort-by-desc",s=Object.keys(r).map((function(s,i){return Object(j.jsxs)(m.a,{variant:"dark",onClick:function(){t(s,!a)},children:[r[s].toUpperCase(),Object(j.jsx)("span",{className:e===s?n:""})]},i)}));return Object(j.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(j.jsxs)("div",{children:[_.reportsCount," reports"]}),Object(j.jsx)("div",{children:s})]})}var v=function(){return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsx)("header",{className:"App-header",children:"\xa0"}),Object(j.jsx)("div",{className:"App-content",children:Object(j.jsx)(h,{})}),Object(j.jsx)("footer",{className:"App-footer",children:"\xa0"})]})};i.a.render(Object(j.jsx)(n.a.StrictMode,{children:Object(j.jsx)(v,{})}),document.getElementById("root"))},8:function(t){t.exports=JSON.parse('{"reports":[{"name":"12521","lastUpdate":"Wed Jun 16 19:53:24 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/admin-page-package","pr":"12521","pr_number":"12521","pr_title":"Package: Add Admin Page Package","repository":"Automattic/jetpack","run_id":"944073936","run_number":"9842"}},{"name":"16434","lastUpdate":"Fri Jun 25 16:24:13 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"rm/deprecated-code","pr":"16434","pr_number":"16434","pr_title":"Janitorial: clean up deprecated code","repository":"Automattic/jetpack","run_id":"971987632","run_number":"10272"}},{"name":"20064","lastUpdate":"Fri Jun 11 22:42:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/make-paypal-productid-unique","pr":"20064","pr_number":"20064","pr_title":"[Simple Payments]: Do not duplicate productId on block duplication","repository":"Automattic/jetpack","run_id":"930004128","run_number":"9711"}},{"name":"20077","lastUpdate":"Thu Jun 17 02:16:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/product-cat-from-sync-block-list","pr":"20077","pr_number":"20077","pr_title":"Sync: remove product_cat from blocked taxonomies","repository":"Automattic/jetpack","run_id":"944910789","run_number":"9855"}},{"name":"20085","lastUpdate":"Mon Jun 28 15:47:57 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/babel-eslint\u2192@babel-eslint-parser","pr":"20085","pr_number":"20085","pr_title":"Update babel-eslint \u2192 @babel/eslint-parser","repository":"Automattic/jetpack","run_id":"979562593","run_number":"10348"}},{"name":"20095","lastUpdate":"Mon Jun 28 10:49:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page","pr":"20095","pr_number":"20095","pr_title":"Search: add WP-Admin page for search and instant search toggling","repository":"Automattic/jetpack","run_id":"978642342","run_number":"10317"}},{"name":"20107","lastUpdate":"Tue Jun 29 00:35:52 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"refactor/carousel-to-use-swiper","pr":"20107","pr_number":"20107","pr_title":"Refactor carousel to use swiper.js","repository":"Automattic/jetpack","run_id":"980919408","run_number":"10372"}},{"name":"20129","lastUpdate":"Wed Jun 23 12:28:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/custom-css-variable-support","pr":"20129","pr_number":"20129","pr_title":"Customizer > Custom CSS: Add support for CSS variables","repository":"Automattic/jetpack","run_id":"964247077","run_number":"10104"}},{"name":"20141","lastUpdate":"Wed Jun 23 15:40:14 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-plans-default-url","pr":"20141","pr_number":"20141","pr_title":"Masterbar: updates the default URL for Plans","repository":"Automattic/jetpack","run_id":"964860448","run_number":"10119"}},{"name":"20147","lastUpdate":"Mon Jun 28 12:29:33 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-handle-preferred-screen","pr":"20147","pr_number":"20147","pr_title":"Nav Unification: Add support for preferred view on individual screens","repository":"Automattic/jetpack","run_id":"978038496","run_number":"10310"}},{"name":"20163","lastUpdate":"Thu Jun 24 07:11:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/ashiagr/r227673-wpcom-1624515795","pr":"20163","pr_number":"20163","pr_title":"Adds Zendesk site meta info to site API for Jetpack sites","repository":"Automattic/jetpack","run_id":"967020388","run_number":"10168"}},{"name":"20167","lastUpdate":"Thu Jun 24 13:08:31 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/rna-connect-screen","pr":"20167","pr_number":"20167","pr_title":"RNA: Connection Screen","repository":"Automattic/jetpack","run_id":"967999545","run_number":"10192"}},{"name":"20168","lastUpdate":"Mon Jun 28 19:41:13 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/beta-plugin-multiple-plugins","pr":"20168","pr_number":"20168","pr_title":"Beta plugin: Support managing multiple plugins","repository":"Automattic/jetpack","run_id":"980189627","run_number":"10360"}},{"name":"20176","lastUpdate":"Thu Jun 24 21:00:08 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/blockbase-theme-live-branch","pr":"20176","pr_number":"20176","pr_title":"Add Blockbase theme to live branches userscript","repository":"Automattic/jetpack","run_id":"969319597","run_number":"10229"}},{"name":"20182","lastUpdate":"Tue Jun 29 09:28:46 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/backup-pkg-real-time-backup-endpoints","pr":"20182","pr_number":"20182","pr_title":"Backup package: Copy real-time backup endpoints from Jetpack plugin","repository":"Automattic/jetpack","run_id":"982108592","run_number":"10384"}},{"name":"20183","lastUpdate":"Mon Jun 28 17:18:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/module_info","pr":"20183","pr_number":"20183","pr_title":"Modules: Add module info to the module-headings.php file","repository":"Automattic/jetpack","run_id":"979803785","run_number":"10352"}},{"name":"20185","lastUpdate":"Mon Jun 28 17:32:41 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/get_available_modules_use_slug","pr":"20185","pr_number":"20185","pr_title":"Modules: Use the module slug in get_available_modules","repository":"Automattic/jetpack","run_id":"979830407","run_number":"10353"}},{"name":"20192","lastUpdate":"Mon Jun 28 21:15:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/site-logo-block-compatibility","pr":"20192","pr_number":"20192","pr_title":"Site Logo: update for compatibility with WP 5.8 site_logo option","repository":"Automattic/jetpack","run_id":"980435944","run_number":"10366"}},{"name":"20194","lastUpdate":"Tue Jun 29 06:38:13 2021 +0000","statistic":{"failed":0,"broken":4,"skipped":0,"passed":12,"unknown":0,"total":16},"metadata":{"branch":"add/carousel-comments-indicator","pr":"20194","pr_number":"20194","pr_title":"Carousel: Visually indicate that an image has comments ","repository":"Automattic/jetpack","run_id":"981630124","run_number":"10379"}},{"name":"20195","lastUpdate":"Mon Jun 28 07:37:26 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/enable-double-tap-zoom-in-chrome-ios","pr":"20195","pr_number":"20195","pr_title":"Carousel: Try to re-enable double tap zoom in Chrome iOS","repository":"Automattic/jetpack","run_id":"978111052","run_number":"10311"}},{"name":"20203","lastUpdate":"Mon Jun 28 15:36:30 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/broken-tools-version-compare","pr":"20203","pr_number":"20203","pr_title":"tools: Delete tools/version-compare.php","repository":"Automattic/jetpack","run_id":"979524404","run_number":"10344"}},{"name":"20205","lastUpdate":"Mon Jun 28 18:29:20 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"e2e/fix-missing-function","pr":"20205","pr_number":"20205","pr_title":"E2E tests: fix call to missing function","repository":"Automattic/jetpack","run_id":"979972514","run_number":"10358"}},{"name":"20206","lastUpdate":"Mon Jun 28 20:22:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-filter-mime-types","pr":"20206","pr_number":"20206","pr_title":"Jetpack Plan: filter video mime types","repository":"Automattic/jetpack","run_id":"980298305","run_number":"10364"}},{"name":"20207","lastUpdate":"Mon Jun 28 22:41:13 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/backup-plugin-ui","pr":"20207","pr_number":"20207","pr_title":"WIP: Adds Backup plugin components / styles for successful backup state","repository":"Automattic/jetpack","run_id":"980671838","run_number":"10369"}},{"name":"20210","lastUpdate":"Tue Jun 29 06:05:02 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/carousel-prevent-zoom-transition-slide","pr":"20210","pr_number":"20210","pr_title":"CarouselL prevent zoom transition slide","repository":"Automattic/jetpack","run_id":"981563421","run_number":"10377"}},{"name":"20211","lastUpdate":"Tue Jun 29 07:39:41 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/refactored-carousel-pagination-to-use-normal-font-weight","pr":"20211","pr_number":"20211","pr_title":"Refactored Carousel: set pagination font weight to normal","repository":"Automattic/jetpack","run_id":"981794785","run_number":"10380"}},{"name":"20212","lastUpdate":"Tue Jun 29 09:37:04 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"e2e/no-video-for-passed-tests","pr":"20212","pr_number":"20212","pr_title":"E2E tests: skip saving videos for passed tests","repository":"Automattic/jetpack","run_id":"982135080","run_number":"10385"}},{"name":"20213","lastUpdate":"Tue Jun 29 10:08:13 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/gardening-e2e-tests-label","pr":"20213","pr_number":"20213","pr_title":"Gardening: add E2E Tests label","repository":"Automattic/jetpack","run_id":"982228211","run_number":"10386"}},{"name":"master","lastUpdate":"Tue Jun 29 10:23:16 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"982271451","run_number":"10387"}}],"reportsCount":29}')}},[[31,1,2]]]);
//# sourceMappingURL=main.70f16283.chunk.js.map