(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{22:function(t,e,a){},24:function(t,e,a){},31:function(t,e,a){"use strict";a.r(e);var n=a(1),r=a.n(n),i=a(13),s=a.n(i),p=(a(22),a(23),a(24),a(14)),o=a(15),d=a(17),u=a(16),c=a(33),l=a(34),m=a(35),b=a(12),k=a(9),_=a(8),h=a(0),f=function(t){Object(d.a)(a,t);var e=Object(u.a)(a);function a(t){var n;return Object(p.a)(this,a),(n=e.call(this,t)).updateSorting=function(t,e){return n.setState({sortBy:t,isSortAsc:e})},n.state={sortBy:"lastUpdate",isSortAsc:!1},n}return Object(o.a)(a,[{key:"render",value:function(){return Object(h.jsxs)(c.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(h.jsxs)("thead",{children:[Object(h.jsx)("tr",{children:Object(h.jsx)("th",{colSpan:"3",children:Object(h.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(h.jsx)("tr",{children:Object(h.jsx)("td",{colSpan:"3",id:"sortButtons",children:U(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(h.jsx)("tbody",{children:A(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(r.a.Component);function j(t,e){switch(t){case"name":return function(t){return _.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}(e);case"lastUpdate":return function(t){return _.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}(e);case"statistic":return function(t){return _.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}(e)}}function y(t,e,a){var n="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),r=t.name,i=t.name;if(e.pr_title){var s="";e.pr?s="(#".concat(e.pr,")"):e.pr_number&&(s="(#".concat(e.pr_number,")")),i="".concat(e.pr_title," ").concat(s)}var p="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(h.jsxs)("ul",{className:"list-unstyled",children:[Object(h.jsxs)("li",{children:[Object(h.jsx)(b.a,{className:a?"failed":"passed",icon:a?k.c:k.a}),"\xa0",Object(h.jsxs)("a",{href:n,className:"report-link",target:"_blank",rel:"noreferrer",children:[i,Object(h.jsx)("br",{})]})]}),Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["#",r," "," \u2022 ",Object(h.jsx)(b.a,{icon:k.b})," ",Object(h.jsx)("a",{href:p,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}function w(t){var e=["failed","passed","total"].map((function(e,a){var n="failed"===e?t[e]+t.broken:t[e];return Object(h.jsxs)(l.a,{className:"label label-status-".concat(e),children:[e," ",n]},a)}));return Object(h.jsx)("div",{children:e})}function g(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(h.jsxs)("ul",{className:"list-unstyled",children:[Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(h.jsx)("li",{children:Object(h.jsxs)("small",{children:["last run id:"," ",Object(h.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}function A(t,e){return j(t,e).map((function(t,e){var a=t.statistic,n=t.metadata,r=a.total!==a.passed;return Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{children:y(t,n,r)}),Object(h.jsx)("td",{children:w(a)}),Object(h.jsx)("td",{children:g(t)})]},e)}))}function U(t,e,a){var n={name:"report id",statistic:"results",lastUpdate:"most recent"},r=a?"sort-by-asc":"sort-by-desc",i=Object.keys(n).map((function(i,s){return Object(h.jsxs)(m.a,{variant:"dark",onClick:function(){t(i,!a)},children:[n[i].toUpperCase(),Object(h.jsx)("span",{className:e===i?r:""})]},s)}));return Object(h.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(h.jsxs)("div",{children:[_.reportsCount," reports"]}),Object(h.jsx)("div",{children:i})]})}var J=function(){return Object(h.jsxs)("div",{className:"App",children:[Object(h.jsx)("header",{className:"App-header",children:"\xa0"}),Object(h.jsx)("div",{className:"App-content",children:Object(h.jsx)(f,{})}),Object(h.jsx)("footer",{className:"App-footer",children:"\xa0"})]})};s.a.render(Object(h.jsx)(r.a.StrictMode,{children:Object(h.jsx)(J,{})}),document.getElementById("root"))},8:function(t){t.exports=JSON.parse('{"reports":[{"name":"0","lastUpdate":"Thu Jun 10 15:55:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"test-branch","pr":"0","pr_number":"0","pr_title":"Test PR name","repository":"automattic/jetpack","run_id":"916686145","run_number":"000"}},{"name":"12521","lastUpdate":"Wed Jun 16 19:53:24 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/admin-page-package","pr":"12521","pr_number":"12521","pr_title":"Package: Add Admin Page Package","repository":"Automattic/jetpack","run_id":"944073936","run_number":"9842"}},{"name":"19818","lastUpdate":"Wed Jun 23 14:51:36 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-generate-autotagger","pr":"19818","pr_number":"19818","pr_title":"CLI - Add Autotagger to Generate","repository":"Automattic/jetpack","run_id":"964700172","run_number":"10112"}},{"name":"19859","lastUpdate":"Thu Jun 10 19:42:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/cli-clean","pr":"19859","repository":"Automattic/jetpack","run_id":"926253527","run_number":"9679"}},{"name":"19885","lastUpdate":"Wed Jun 23 06:15:57 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/static-filters-support","pr":"19885","pr_number":"19885","pr_title":"Add support for group_id","repository":"Automattic/jetpack","run_id":"963234584","run_number":"10078"}},{"name":"19933","lastUpdate":"Fri Jun 11 14:30:10 2021 +0300","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/videopress-in-woa-with-free","pr":"19933","pr_number":"19933","pr_title":"Videopress: disable uploading for Free WoA","repository":"automattic/jetpack","run_id":"925476539","run_number":"000"}},{"name":"19939","lastUpdate":"Thu Jun 24 07:54:02 2021 +0000","statistic":{"failed":0,"broken":3,"skipped":0,"passed":13,"unknown":0,"total":16},"metadata":{"branch":"add/support-for-multi-site-results","pr":"19939","pr_number":"19939","pr_title":"Instant Search: support multi site search results","repository":"Automattic/jetpack","run_id":"967128202","run_number":"10173"}},{"name":"19954","lastUpdate":"Thu Jun 17 09:51:39 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"e2e/allure-reporter","pr":"19954","pr_number":"19954","pr_title":"E2E tests: attach videos in test report","repository":"Automattic/jetpack","run_id":"945922251","run_number":"9859"}},{"name":"19959","lastUpdate":"Wed Jun 16 13:44:52 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/sync-v4-endpoints","pr":"19959","pr_number":"19959","pr_title":"Duplicate Sync endpoints to v4 REST endpoints","repository":"Automattic/jetpack","run_id":"943029106","run_number":"9812"}},{"name":"19960","lastUpdate":"Wed Jun 23 21:56:09 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/idc-endpoint-migration","pr":"19960","pr_number":"19960","pr_title":"Migrate v4 IDC endpoints into package","repository":"Automattic/jetpack","run_id":"965891263","run_number":"10141"}},{"name":"19989","lastUpdate":"Thu Jun 17 13:55:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"renovate/automattic-social-previews-1.x","pr":"19989","pr_number":"19989","pr_title":"Update dependency @automattic/social-previews to v1.1.1","repository":"Automattic/jetpack","run_id":"946607091","run_number":"9870"}},{"name":"19990","lastUpdate":"Thu Jun 17 13:55:20 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"renovate/octokit-rest-18.x","pr":"19990","pr_number":"19990","pr_title":"Update dependency @octokit/rest to v18.6.0","repository":"Automattic/jetpack","run_id":"946604731","run_number":"9869"}},{"name":"19991","lastUpdate":"Thu Jun 17 13:45:05 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"renovate/testing-library-react-11.x","pr":"19991","pr_number":"19991","pr_title":"Update dependency @testing-library/react to v11.2.7","repository":"Automattic/jetpack","run_id":"946576458","run_number":"9867"}},{"name":"19993","lastUpdate":"Mon Jun 14 03:40:02 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/add-csstidy-config-setting-to-preserve-leading-decimal-zero","pr":"19993","pr_number":"19993","pr_title":"CSSTidy: preserve leading decimal zeros in Gutenberg","repository":"Automattic/jetpack","run_id":"934474674","run_number":"9718"}},{"name":"20014","lastUpdate":"Mon Jun 14 03:52:36 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/disable-notifications-in-site-editor","pr":"20014","pr_number":"20014","pr_title":"Notes: Disable Admin menu in Jetpack Notifications when in Site Editor","repository":"Automattic/jetpack","run_id":"934495714","run_number":"9719"}},{"name":"20015","lastUpdate":"Mon Jun 21 20:47:49 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"fix/search-modal-animation","pr":"20015","pr_number":"20015","pr_title":"Instant Search: drop modal animation and use a simple transition","repository":"Automattic/jetpack","run_id":"958396782","run_number":"10002"}},{"name":"20016","lastUpdate":"Fri Jun 18 14:05:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/reusable-docker","pr":"20016","pr_number":"20016","pr_title":"Jetpack Docker: More flexible implementation","repository":"Automattic/jetpack","run_id":"950066566","run_number":"9934"}},{"name":"20042","lastUpdate":"Fri Jun 11 15:54:38 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/gardening-milestone-no-due-date","pr":"20042","pr_number":"20042","pr_title":"Gardening: fallback when we cannot find any with a due date.","repository":"Automattic/jetpack","run_id":"929076338","run_number":"9702"}},{"name":"20044","lastUpdate":"Tue Jun 15 21:19:57 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"fix/gif-block-widget-editor","pr":"20044","pr_number":"20044","pr_title":"Gif Block: Fix issues in Widget Editor / Customizer","repository":"Automattic/jetpack","run_id":"940720328","run_number":"9773"}},{"name":"20047","lastUpdate":"Wed Jun 23 02:56:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/site-logo-transition-code","pr":"20047","pr_number":"20047","pr_title":"Site Logo: 5.8 Compat","repository":"Automattic/jetpack","run_id":"962846707","run_number":"10060"}},{"name":"20052","lastUpdate":"Fri Jun 11 17:30:09 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/premium-theme-info","pr":"20052","pr_number":"20052","pr_title":"Plans: Remove premium theme info","repository":"Automattic/jetpack","run_id":"929307221","run_number":"9706"}},{"name":"20053","lastUpdate":"Wed Jun 16 08:31:38 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/top-amp-ad-size","pr":"20053","pr_number":"20053","pr_title":"WordAds: Set top AMP ad unit to fixed size of 300x250 pixels","repository":"Automattic/jetpack","run_id":"942146339","run_number":"9800"}},{"name":"20056","lastUpdate":"Fri Jun 11 12:45:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/show-carousel-enable-toggle","pr":"20056","pr_number":"20056","pr_title":"Image Carousel: Show carousel enable toggle in media options.","repository":"Automattic/jetpack","run_id":"928291459","run_number":"9694"}},{"name":"20060","lastUpdate":"Wed Jun 16 12:54:07 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/embeds-double-quotes","pr":"20060","pr_number":"20060","pr_title":"Shortcode Embeds: Fix compat Lazy Loading and YouTube start times","repository":"Automattic/jetpack","run_id":"942884061","run_number":"9806"}},{"name":"20061","lastUpdate":"Mon Jun 14 21:44:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"try/backup-plugin-release","pr":"20061","pr_number":"20061","pr_title":"Backup: test release process for Backup plugin prototype","repository":"Automattic/jetpack","run_id":"937255965","run_number":"9754"}},{"name":"20062","lastUpdate":"Fri Jun 11 12:30:28 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/scruffian/r227092-wpcom-1623406878","pr":"20062","pr_number":"20062","pr_title":"Inline PDFs: Fix the height to 800px to overcome theme specific CSS.","repository":"Automattic/jetpack","run_id":"928494389","run_number":"9697"}},{"name":"20064","lastUpdate":"Fri Jun 11 22:42:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/make-paypal-productid-unique","pr":"20064","pr_number":"20064","pr_title":"[Simple Payments]: Do not duplicate productId on block duplication","repository":"Automattic/jetpack","run_id":"930004128","run_number":"9711"}},{"name":"20065","lastUpdate":"Thu Jun 17 09:30:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/modal-close-button-elementor","pr":"20065","pr_number":"20065","pr_title":"Instant Search: prevent override of modal close button styles by theme","repository":"Automattic/jetpack","run_id":"944912352","run_number":"9856"}},{"name":"20067","lastUpdate":"Mon Jun 14 14:08:23 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/move-connection-owner-endpoint","pr":"20067","pr_number":"20067","pr_title":"Connection: Move \'connection/owner\' endpoint to Connection","repository":"Automattic/jetpack","run_id":"935973890","run_number":"9729"}},{"name":"20068","lastUpdate":"Thu Jun 17 09:27:18 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"rna/remove-in-place","pr":"20068","pr_number":"20068","pr_title":"RNA Connection: remove In-Place Connection","repository":"Automattic/jetpack","run_id":"945849063","run_number":"9858"}},{"name":"20070","lastUpdate":"Wed Jun 16 14:21:34 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"update/get-options-by-ids","pr":"20070","pr_number":"20070","pr_title":"Allow for options to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"943139937","run_number":"9821"}},{"name":"20071","lastUpdate":"Wed Jun 16 14:38:11 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/callables-get-objects-by-id","pr":"20071","pr_number":"20071","pr_title":"Allow for callables to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"943200330","run_number":"9824"}},{"name":"20072","lastUpdate":"Wed Jun 16 14:39:49 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/constants-get-objects-by-id","pr":"20072","pr_number":"20072","pr_title":"Allow for constants to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"943203096","run_number":"9825"}},{"name":"20073","lastUpdate":"Wed Jun 16 19:32:38 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/init_idc_sync","pr":"20073","pr_number":"20073","pr_title":"Sync: move the IDC initialization to the Sync package","repository":"Automattic/jetpack","run_id":"944020414","run_number":"9840"}},{"name":"20074","lastUpdate":"Wed Jun 16 14:48:03 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/themes-get-objects-by-id","pr":"20074","pr_number":"20074","pr_title":"Allow for theme-info to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"943235321","run_number":"9827"}},{"name":"20075","lastUpdate":"Wed Jun 16 14:51:44 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/updates-get-objects-by-id","pr":"20075","pr_number":"20075","pr_title":"Allow for updates to be retrieved by the sync/object endpoint","repository":"Automattic/jetpack","run_id":"943237571","run_number":"9828"}},{"name":"20076","lastUpdate":"Thu Jun 17 19:46:24 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/search-widget-setting-for-wp58","pr":"20076","pr_number":"20076","pr_title":"Search: fix widget setting not working for WordPress 5.8","repository":"Automattic/jetpack","run_id":"947596272","run_number":"9901"}},{"name":"20077","lastUpdate":"Thu Jun 17 02:16:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"remove/product-cat-from-sync-block-list","pr":"20077","pr_number":"20077","pr_title":"Sync: remove product_cat from blocked taxonomies","repository":"Automattic/jetpack","run_id":"944910789","run_number":"9855"}},{"name":"20078","lastUpdate":"Tue Jun 15 16:04:56 2021 +0000","statistic":{"failed":0,"broken":3,"skipped":0,"passed":13,"unknown":0,"total":16},"metadata":{"branch":"add/yt-t-arg","pr":"20078","repository":"Automattic/jetpack","run_id":"939905573","run_number":"9766"}},{"name":"20079","lastUpdate":"Tue Jun 15 18:11:32 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/backup-0_1_0-beta","pr":"20079","pr_number":"20079","pr_title":"Backup: 0.1.0-beta changelog","repository":"Automattic/jetpack","run_id":"940234184","run_number":"9770"}},{"name":"20080","lastUpdate":"Wed Jun 23 15:44:38 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/recurring-payments-widget-editor","pr":"20080","pr_number":"20080","pr_title":"Recurring Payments: Open new window to connect instead of loading in place","repository":"Automattic/jetpack","run_id":"964874986","run_number":"10121"}},{"name":"20081","lastUpdate":"Tue Jun 15 21:33:47 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"kraftbj-patch-2","pr":"20081","pr_number":"20081","pr_title":"Plugin API: Only use should_update if we are trying to autoupdate","repository":"Automattic/jetpack","run_id":"940742207","run_number":"9776"}},{"name":"20082","lastUpdate":"Tue Jun 15 21:47:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/expanded-search-results","pr":"20082","pr_number":"20082","pr_title":"Search: Fix render-breaking typo for Expanded search results","repository":"Automattic/jetpack","run_id":"940778923","run_number":"9779"}},{"name":"20083","lastUpdate":"Tue Jun 15 21:43:32 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"backup/branch-0.1.0","pr":"20083","pr_number":"20083","pr_title":"Backup: init 0.2.0-alpha cycle","repository":"Automattic/jetpack","run_id":"940774896","run_number":"9778"}},{"name":"20084","lastUpdate":"Fri Jun 18 16:42:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/backup-init-0_2_0-alpha","pr":"20084","pr_number":"20084","pr_title":"Backup: init 0.2.0-alpha cycle","repository":"Automattic/jetpack","run_id":"950479031","run_number":"9952"}},{"name":"20085","lastUpdate":"Wed Jun 23 15:29:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/babel-eslint\u2192@babel-eslint-parser","pr":"20085","pr_number":"20085","pr_title":"Update babel-eslint \u2192 @babel/eslint-parser","repository":"Automattic/jetpack","run_id":"964817995","run_number":"10117"}},{"name":"20090","lastUpdate":"Wed Jun 16 19:59:42 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/beta-no-jetpack-dev","pr":"20090","pr_number":"20090","pr_title":"Beta: Soft-require Markdown","repository":"Automattic/jetpack","run_id":"944082696","run_number":"9843"}},{"name":"20091","lastUpdate":"Wed Jun 16 21:42:19 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/docker-dev-packages","pr":"20091","pr_number":"20091","pr_title":"Docker: Use monorepo packages","repository":"Automattic/jetpack","run_id":"944351530","run_number":"9849"}},{"name":"20092","lastUpdate":"Tue Jun 22 16:50:42 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/move-eslint-changed-to-project","pr":"20092","pr_number":"20092","pr_title":"eslint-changed: Make it a project","repository":"Automattic/jetpack","run_id":"961414833","run_number":"10041"}},{"name":"20093","lastUpdate":"Thu Jun 17 21:59:10 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/increase-touch-zone-for-carousel-close","pr":"20093","pr_number":"20093","pr_title":"[Carousel]: Increase the size of the touch zone for the close button","repository":"Automattic/jetpack","run_id":"947936785","run_number":"9909"}},{"name":"20094","lastUpdate":"Thu Jun 17 00:24:55 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/show-payments-configuration-in-small-width","pr":"20094","pr_number":"20094","pr_title":"Fix/show payments configuration in small width","repository":"Automattic/jetpack","run_id":"944691293","run_number":"9854"}},{"name":"20095","lastUpdate":"Thu Jun 17 02:51:51 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/search-admin-page","pr":"20095","pr_number":"20095","pr_title":"Search: add WP-Admin page for search and instant search toggling","repository":"Automattic/jetpack","run_id":"944980365","run_number":"9857"}},{"name":"20097","lastUpdate":"Fri Jun 18 09:35:16 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/backup-v4-endpoints","pr":"20097","pr_number":"20097","pr_title":"Backup: Copy backup-helper endpoints to backup package","repository":"Automattic/jetpack","run_id":"949365257","run_number":"9927"}},{"name":"20098","lastUpdate":"Wed Jun 23 16:57:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/vaultpress-plugin-monorepo","pr":"20098","pr_number":"20098","pr_title":"Monorepo: add VaultPress plugin","repository":"Automattic/jetpack","run_id":"965089600","run_number":"10124"}},{"name":"20099","lastUpdate":"Fri Jun 18 15:11:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/idc-disconnect","pr":"20099","pr_number":"20099","pr_title":"Implement disconnect_site function of Connection Manager and migrate IDC disconnect","repository":"Automattic/jetpack","run_id":"950253641","run_number":"9942"}},{"name":"20100","lastUpdate":"Fri Jun 18 14:32:34 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-calypso-settings-submenus","pr":"20100","pr_number":"20100","pr_title":"Admin menu: Register Calypso settings pages as independent submenus","repository":"Automattic/jetpack","run_id":"950133500","run_number":"9936"}},{"name":"20101","lastUpdate":"Thu Jun 17 21:55:33 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/make-carousel-more-robust-against-missing-properties","pr":"20101","pr_number":"20101","pr_title":"Make carousel more robust against missing data","repository":"Automattic/jetpack","run_id":"947931470","run_number":"9908"}},{"name":"20102","lastUpdate":"Thu Jun 17 19:25:33 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/gardening-concurrency","pr":"20102","pr_number":"20102","pr_title":"actions: Set concurrency for gardening workflow","repository":"Automattic/jetpack","run_id":"947548818","run_number":"9898"}},{"name":"20105","lastUpdate":"Thu Jun 17 19:31:46 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/github-deps","pr":"20105","pr_number":"20105","pr_title":"Update GitHub @actions and @octokit packages","repository":"Automattic/jetpack","run_id":"947555462","run_number":"9899"}},{"name":"20106","lastUpdate":"Mon Jun 21 22:01:54 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"improve/carousel-zoom","pr":"20106","pr_number":"20106","pr_title":"[WIP] Gallery Carousel: Add better pinch zoom and panning support","repository":"Automattic/jetpack","run_id":"958619492","run_number":"10008"}},{"name":"20107","lastUpdate":"Thu Jun 24 09:13:39 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"refactor/carousel-to-use-swiper","pr":"20107","pr_number":"20107","pr_title":"Refactor carousel to use swiper.js","repository":"Automattic/jetpack","run_id":"967344481","run_number":"10180"}},{"name":"20108","lastUpdate":"Wed Jun 23 00:58:32 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/jetpack-carousel-module-hide-comments-and-meta","pr":"20108","pr_number":"20108","pr_title":"Jetpack carousel: prevent vertical scrolling","repository":"Automattic/jetpack","run_id":"962628907","run_number":"10053"}},{"name":"20109","lastUpdate":"Wed Jun 23 23:30:04 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/search-default-overlay-trigger","pr":"20109","pr_number":"20109","pr_title":"Instant Search: set the default overlay trigger to \'immediate\'","repository":"Automattic/jetpack","run_id":"966105017","run_number":"10144"}},{"name":"20110","lastUpdate":"Fri Jun 18 07:45:16 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"try/update-carousel-to-use-hi-res-images","pr":"20110","pr_number":"20110","pr_title":"[WIP] Carousel: Try swapping out carousel image for original image when zooming in","repository":"Automattic/jetpack","run_id":"949057632","run_number":"9924"}},{"name":"20111","lastUpdate":"Wed Jun 23 07:48:57 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/rna-connect-button","pr":"20111","pr_number":"20111","pr_title":"RNA Connection: rename Main component into ConnectButton","repository":"Automattic/jetpack","run_id":"963465635","run_number":"10086"}},{"name":"20126","lastUpdate":"Fri Jun 18 20:58:04 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/add-docker-exec-cmd","pr":"20126","pr_number":"20126","pr_title":"Docker: Add exec command","repository":"Automattic/jetpack","run_id":"951043468","run_number":"9959"}},{"name":"20128","lastUpdate":"Wed Jun 23 22:26:50 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/search-app-for-gutenberg","pr":"20128","pr_number":"20128","pr_title":"Search: Prepare application for Gutenberg customization","repository":"Automattic/jetpack","run_id":"965970160","run_number":"10142"}},{"name":"20129","lastUpdate":"Wed Jun 23 12:28:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/custom-css-variable-support","pr":"20129","pr_number":"20129","pr_title":"Customizer > Custom CSS: Add support for CSS variables","repository":"Automattic/jetpack","run_id":"964247077","run_number":"10104"}},{"name":"20133","lastUpdate":"Thu Jun 24 10:22:15 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/share-and-embed-fields","pr":"20133","pr_number":"20133","pr_title":"Add/share and embed fields in Calypso media edit modal","repository":"Automattic/jetpack","run_id":"967553315","run_number":"10183"}},{"name":"20134","lastUpdate":"Mon Jun 21 11:50:23 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"e2e/report-url-in-slack-notif","pr":"20134","pr_number":"20134","pr_title":"E2E: include test report url in Slack notification","repository":"Automattic/jetpack","run_id":"956913793","run_number":"9984"}},{"name":"20135","lastUpdate":"Mon Jun 21 13:14:25 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"e2e/gardening-add-e2e-report-url","pr":"20135","pr_number":"20135","pr_title":"Add e2e report url in pr bot comment","repository":"Automattic/jetpack","run_id":"957135025","run_number":"9989"}},{"name":"20136","lastUpdate":"Mon Jun 21 17:15:31 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"sync/test-reenable","pr":"20136","pr_number":"20136","pr_title":"Re-enable Sync Theme tests.","repository":"Automattic/jetpack","run_id":"957859421","run_number":"9998"}},{"name":"20137","lastUpdate":"Mon Jun 21 17:13:45 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"build/beta-multiple-plugins","pr":"20137","pr_number":"20137","pr_title":"build: Produce plugins artifact holding zips for all plugins","repository":"Automattic/jetpack","run_id":"957853885","run_number":"9997"}},{"name":"20138","lastUpdate":"Tue Jun 22 07:11:25 2021 +0000","statistic":{"failed":0,"broken":1,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"robertbpugh-patch-1","pr":"20138","pr_number":"20138","pr_title":"Update readme.txt","repository":"Automattic/jetpack","run_id":"959697778","run_number":"10018"}},{"name":"20139","lastUpdate":"Wed Jun 23 02:43:57 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/jetpack-carousel-with-fixed-footer-for-comments-and-meta","pr":"20139","pr_number":"20139","pr_title":"[WIP] Carousel: Use CSS Grid for fixed info footer, add icons","repository":"Automattic/jetpack","run_id":"962828241","run_number":"10059"}},{"name":"20140","lastUpdate":"Tue Jun 22 06:35:56 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/backup-plugin-with-backup-pkg","pr":"20140","pr_number":"20140","pr_title":"Jetpack Backup: Utilize endpoints from backup package","repository":"Automattic/jetpack","run_id":"959629209","run_number":"10017"}},{"name":"20141","lastUpdate":"Wed Jun 23 15:40:14 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-plans-default-url","pr":"20141","pr_number":"20141","pr_title":"Masterbar: updates the default URL for Plans","repository":"Automattic/jetpack","run_id":"964860448","run_number":"10119"}},{"name":"20142","lastUpdate":"Tue Jun 22 19:58:58 2021 +0000","statistic":{"failed":1,"broken":0,"skipped":0,"passed":15,"unknown":0,"total":16},"metadata":{"branch":"add/support-for-multi-site-results","pr":"20142","pr_number":"20142","pr_title":"Test PR to generate Phabricator diff","repository":"Automattic/jetpack","run_id":"961920939","run_number":"10043"}},{"name":"20143","lastUpdate":"Wed Jun 23 04:20:22 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/carousel-background-images","pr":"20143","pr_number":"20143","pr_title":"Carousel: Add background images","repository":"Automattic/jetpack","run_id":"963016601","run_number":"10066"}},{"name":"20145","lastUpdate":"Thu Jun 24 06:04:31 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/jetpack-carousel-swiper-fixed-footer","pr":"20145","pr_number":"20145","pr_title":"[WIP] Carousel: Use CSS Grid for fixed info footer, add icons","repository":"Automattic/jetpack","run_id":"966864415","run_number":"10164"}},{"name":"20147","lastUpdate":"Thu Jun 24 09:22:43 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/admin-menu-handle-preferred-screen","pr":"20147","pr_number":"20147","pr_title":"Nav Unification: Add support for preferred view on individual screens","repository":"Automattic/jetpack","run_id":"967369473","run_number":"10181"}},{"name":"20148","lastUpdate":"Thu Jun 24 11:32:18 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/rna-components","pr":"20148","pr_number":"20148","pr_title":"RNA: Components package","repository":"Automattic/jetpack","run_id":"967735665","run_number":"10186"}},{"name":"20151","lastUpdate":"Wed Jun 23 14:52:32 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"e2e/readme-update","pr":"20151","pr_number":"20151","pr_title":"E2E tests update readme with reporting info","repository":"Automattic/jetpack","run_id":"964706993","run_number":"10113"}},{"name":"20152","lastUpdate":"Wed Jun 23 13:26:41 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/e2e-in-place-connection-timeout-increase","pr":"20152","pr_number":"20152","pr_title":"E2E Tests: Increase in-place wait timeout","repository":"Automattic/jetpack","run_id":"964419621","run_number":"10107"}},{"name":"20153","lastUpdate":"Thu Jun 24 12:29:40 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"add/wpcom-dashboard-switcher","pr":"20153","pr_number":"20153","pr_title":"Adds the dasboard switcher to screen options.","repository":"Automattic/jetpack","run_id":"967887953","run_number":"10189"}},{"name":"20154","lastUpdate":"Wed Jun 23 17:31:37 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fix/lint-no-duplicate-names","pr":"20154","pr_number":"20154","pr_title":"Linting: Check that project names are not duplicated","repository":"Automattic/jetpack","run_id":"965187696","run_number":"10126"}},{"name":"20158","lastUpdate":"Wed Jun 23 19:47:18 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/redirect-lib-params","pr":"20158","pr_number":"20158","pr_title":"updates redirect package to accept all params","repository":"Automattic/jetpack","run_id":"965553059","run_number":"10134"}},{"name":"20159","lastUpdate":"Wed Jun 23 21:41:17 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"update/redirect-js-lib-params","pr":"20159","pr_number":"20159","pr_title":"Update/redirect js lib params","repository":"Automattic/jetpack","run_id":"965840952","run_number":"10138"}},{"name":"20163","lastUpdate":"Thu Jun 24 07:11:59 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"fusion-sync/ashiagr/r227673-wpcom-1624515795","pr":"20163","pr_number":"20163","pr_title":"Adds Zendesk site meta info to site API for Jetpack sites","repository":"Automattic/jetpack","run_id":"967020388","run_number":"10168"}},{"name":"master","lastUpdate":"Thu Jun 24 12:47:06 2021 +0000","statistic":{"failed":0,"broken":0,"skipped":0,"passed":16,"unknown":0,"total":16},"metadata":{"branch":"master","pr":"","pr_number":"","pr_title":"","repository":"Automattic/jetpack","run_id":"967941888","run_number":"10190"}}],"reportsCount":90}')}},[[31,1,2]]]);
//# sourceMappingURL=main.a0f8f474.chunk.js.map