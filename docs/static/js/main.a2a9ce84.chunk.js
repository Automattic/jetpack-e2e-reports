(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{22:function(t,e,a){},24:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var r=a(1),n=a.n(r),s=a(13),i=a.n(s),o=(a(22),a(23),a(24),a(14)),p=a(15),c=a(17),d=a(16),u=a(33),l=a(34),m=a(35),b=a(12),k=a(9),h=a(8),_=a(0),j=function(t){Object(c.a)(a,t);var e=Object(d.a)(a);function a(t){var r;return Object(o.a)(this,a),(r=e.call(this,t)).updateSorting=function(t,e){return r.setState({sortBy:t,isSortAsc:e})},r.state={sortBy:"lastUpdate",isSortAsc:!1},r}return Object(p.a)(a,[{key:"render",value:function(){return Object(_.jsxs)(u.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(_.jsxs)("thead",{children:[Object(_.jsx)("tr",{children:Object(_.jsx)("th",{colSpan:"3",children:Object(_.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(_.jsx)("tr",{children:Object(_.jsx)("td",{colSpan:"3",id:"sortButtons",children:O(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(_.jsx)("tbody",{children:A(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(n.a.Component);function f(t,e){switch(t){case"name":return function(t){return h.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return h.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return h.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function g(t,e,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),n=t.name,s=t.name;if(e.pr_title){var i="";e.pr?i="(#".concat(e.pr,")"):e.pr_number&&(i="(#".concat(e.pr_number,")")),s="".concat(e.pr_title," ").concat(i)}var o="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(_.jsxs)("ul",{className:"list-unstyled",children:[Object(_.jsxs)("li",{children:[Object(_.jsx)(b.a,{className:a?"failed":"passed",icon:a?k.c:k.a}),"\xa0",Object(_.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",children:[s,Object(_.jsx)("br",{})]})]}),Object(_.jsx)("li",{children:Object(_.jsxs)("small",{children:["#",n," "," \u2022 ",Object(_.jsx)(b.a,{icon:k.b})," ",Object(_.jsx)("a",{href:o,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}function y(t){var e=["failed","passed","total"].map((function(e,a){var r="failed"===e?t[e]+t.broken:t[e];return Object(_.jsxs)(l.a,{className:"label label-status-".concat(e),children:[e," ",r]},a)}));return Object(_.jsx)("div",{children:e})}function x(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(_.jsxs)("ul",{className:"list-unstyled",children:[Object(_.jsx)("li",{children:Object(_.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(_.jsx)("li",{children:Object(_.jsxs)("small",{children:["last run id:"," ",Object(_.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}function A(t,e){return f(t,e).map((function(t,e){var a=t.statistic,r=t.metadata,n=a.total!==a.passed;return Object(_.jsxs)("tr",{children:[Object(_.jsx)("td",{children:g(t,r,n)}),Object(_.jsx)("td",{children:y(a)}),Object(_.jsx)("td",{children:x(t)})]},e)}))}function O(t,e,a){var r={name:"report id",statistic:"results",lastUpdate:"most recent"},n=a?"sort-by-asc":"sort-by-desc",s=Object.keys(r).map((function(s,i){return Object(_.jsxs)(m.a,{variant:"dark",onClick:function(){t(s,!a)},children:[r[s].toUpperCase(),Object(_.jsx)("span",{className:e===s?n:""})]},i)}));return Object(_.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(_.jsxs)("div",{children:[h.reportsCount," reports"]}),Object(_.jsx)("div",{children:s})]})}var v=function(){return Object(_.jsxs)("div",{className:"App",children:[Object(_.jsx)("header",{className:"App-header",children:"\xa0"}),Object(_.jsx)("div",{className:"App-content",children:Object(_.jsx)(j,{})}),Object(_.jsx)("footer",{className:"App-footer",children:Object(_.jsxs)("div",{children:[Object(_.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/",rel:"noreferrer",children:"Code"})," \u2022 ",Object(_.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/actions",rel:"noreferrer",children:"Actions"})]})})]})};i.a.render(Object(_.jsx)(n.a.StrictMode,{children:Object(_.jsx)(v,{})}),document.getElementById("root"))},8:function(t){t.exports=JSON.parse('{"reports":[{"name":"12521","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/admin-page-package","pr":"12521","pr_number":"12521","pr_title":"Package: Add Admin Page Package","repository":"Automattic/jetpack","run_id":"944073936","run_number":"9842"}},{"name":"16434","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"rm/deprecated-code","pr":"16434","pr_number":"16434","pr_title":"Janitorial: clean up deprecated code","repository":"Automattic/jetpack","run_id":"971987632","run_number":"10272"}},{"name":"19373","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"renovate/pin-dependencies","pr":"19373","pr_number":"19373","pr_title":"Pin dependencies","repository":"Automattic/jetpack","run_id":"988571962","run_number":"10509"}},{"name":"20064","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/make-paypal-productid-unique","pr":"20064","pr_number":"20064","pr_title":"[Simple Payments]: Do not duplicate productId on block duplication","repository":"Automattic/jetpack","run_id":"930004128","run_number":"9711"}},{"name":"20095","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page","pr":"20095","pr_number":"20095","pr_title":"Search: add WP-Admin page for search and instant search toggling","repository":"Automattic/jetpack","run_id":"978642342","run_number":"10317"}},{"name":"20129","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/custom-css-variable-support","pr":"20129","pr_number":"20129","pr_title":"Customizer > Custom CSS: Add support for CSS variables","repository":"Automattic/jetpack","run_id":"964247077","run_number":"10104"}},{"name":"20141","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-plans-default-url","pr":"20141","pr_number":"20141","pr_title":"Masterbar: updates the default URL for Plans","repository":"Automattic/jetpack","run_id":"964860448","run_number":"10119"}},{"name":"20167","lastUpdate":"Fri Jul 2 12:33:48 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/rna-connect-screen","pr_number":"20167","pr_title":"RNA: Connection Screen","repository":"automattic/jetpack","run_id":"993459720","run_number":"000","updated_on":"2021-07-02T12:33:47+0000"}},{"name":"20168","lastUpdate":"Thu Jul 1 19:31:29 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/beta-plugin-multiple-plugins","pr_number":"20168","pr_title":"Beta plugin: Support managing multiple plugins","repository":"Automattic/jetpack","run_id":"991250191","run_number":"10530"}},{"name":"20176","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/blockbase-theme-live-branch","pr":"20176","pr_number":"20176","pr_title":"Add Blockbase theme to live branches userscript","repository":"Automattic/jetpack","run_id":"969319597","run_number":"10229"}},{"name":"20183","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/module_info","pr":"20183","pr_number":"20183","pr_title":"Modules: Add module info to the module-headings.php file","repository":"Automattic/jetpack","run_id":"979803785","run_number":"10352"}},{"name":"20185","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"update/get_available_modules_use_slug","pr":"20185","pr_number":"20185","pr_title":"Modules: Use the module slug in get_available_modules","repository":"Automattic/jetpack","run_id":"986637723","run_number":"10456"}},{"name":"20195","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/enable-double-tap-zoom-in-chrome-ios","pr":"20195","pr_number":"20195","pr_title":"Carousel: Try to re-enable double tap zoom in Chrome iOS","repository":"Automattic/jetpack","run_id":"978111052","run_number":"10311"}},{"name":"20206","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-filter-mime-types","pr":"20206","pr_number":"20206","pr_title":"Jetpack Plan: filter video mime types","repository":"Automattic/jetpack","run_id":"984389499","run_number":"10420"}},{"name":"20207","lastUpdate":"Thu Jul 1 18:37:11 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/backup-plugin-ui","pr_number":"20207","pr_title":"Adds Backup plugin components / styles for successful backup state","repository":"Automattic/jetpack","run_id":"991113961","run_number":"10529"}},{"name":"20224","lastUpdate":"Fri Jul 2 02:15:54 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page-toggles","pr_number":"20224","pr_title":"Search: add search setting page with only toggles","repository":"Automattic/jetpack","run_id":"992140717","run_number":"10551"}},{"name":"20226","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/docker-migrate-to-mariadb","pr":"20226","pr_number":"20226","pr_title":"Docker: Migrate from MySQL to MariaDB to allow for better Apple M1 compatibility","repository":"Automattic/jetpack","run_id":"985180097","run_number":"10439"}},{"name":"20227","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/carousel-toggle-bottom-bar-on-zoom","pr":"20227","pr_number":"20227","pr_title":"Carousel: hide carousel controls onZoom","repository":"Automattic/jetpack","run_id":"989053767","run_number":"10513"}},{"name":"20228","lastUpdate":"Thu Jul 1 20:47:46 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/nav-unification-store-preferred-view","pr":"20228","pr_number":"20228","pr_title":" Nav Unification: Store preferred view on page switch","repository":"Automattic/jetpack","run_id":"986203859","run_number":"10454"}},{"name":"20231","lastUpdate":"Fri Jul 2 12:07:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"test/test-pr","pr_number":"20231","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"986899084","run_number":"000","updated_on":"2021-07-02T12:07:15+0000"}},{"name":"20236","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/carousel-error-handling-for-swiper","pr":"20236","pr_number":"20236","pr_title":"[Carousel]: Handle error if swiper fails to load","repository":"Automattic/jetpack","run_id":"987834220","run_number":"10471"}},{"name":"20238","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"renovate/octokit-rest-18.x","pr":"20238","pr_number":"20238","pr_title":"Update dependency @octokit/rest to v18.6.6","repository":"Automattic/jetpack","run_id":"988228863","run_number":"10481"}},{"name":"20239","lastUpdate":"Fri Jul 2 04:27:00 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/block-tests-against-gutenberg-versions","pr_number":"20239","pr_title":"Add ability to run block tests against specific Gutenberg versions","repository":"Automattic/jetpack","run_id":"992397538","run_number":"10555"}},{"name":"20241","lastUpdate":"Thu Jul 1 20:47:18 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"renovate/testing-library-react-hooks-4.x","pr":"20241","pr_number":"20241","pr_title":"Update dependency @testing-library/react-hooks to v4.0.1","repository":"Automattic/jetpack","run_id":"988500015","run_number":"10493"}},{"name":"20247","lastUpdate":"Thu Jul 1 21:33:36 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/carousel-light-small-screens","pr_number":"20247","pr_title":"Fix/carousel light small screens","repository":"Automattic/jetpack","run_id":"991565505","run_number":"10538"}},{"name":"20248","lastUpdate":"Thu Jul 1 21:58:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/better-carousel-upscaling","pr_number":"20248","pr_title":"Carousel: Only upscale images if they are less than 1k px.","repository":"Automattic/jetpack","run_id":"991621366","run_number":"10542"}},{"name":"20252","lastUpdate":"Fri Jul 2 02:24:01 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page-footer","pr_number":"20252","pr_title":"Search: Add search admin page footer","repository":"Automattic/jetpack","run_id":"992155965","run_number":"10552"}},{"name":"20253","lastUpdate":"Fri Jul 2 02:59:48 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page-buttons","pr_number":"20253","pr_title":"Search: Add search admin page buttons for search/widget settings","repository":"Automattic/jetpack","run_id":"992230767","run_number":"10553"}},{"name":"20254","lastUpdate":"Fri Jul 2 04:50:51 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"fix/instant-search-breadcrumb","pr_number":"20254","pr_title":"Instant Search: fix visual glitch on breadcrumb in Firefox","repository":"Automattic/jetpack","run_id":"992433041","run_number":"10557"}},{"name":"20255","lastUpdate":"Fri Jul 2 08:32:04 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/widget-visibility","pr_number":"20255","pr_title":"Widget visiblity: Load conditions for gutenberg widgets","repository":"Automattic/jetpack","run_id":"992927297","run_number":"10559"}},{"name":"master","lastUpdate":"Fri Jul 2 12:11:44 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"993499799","run_number":"10561","updated_on":"2021-07-02T12:11:43+0000"}}],"reportsCount":31}')}},[[31,1,2]]]);
//# sourceMappingURL=main.a2a9ce84.chunk.js.map