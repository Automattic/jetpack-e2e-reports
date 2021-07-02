(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{21:function(t,e,a){},23:function(t,e,a){},30:function(t,e,a){"use strict";a.r(e);var r=a(1),s=a.n(r),n=a(12),c=a.n(n),i=(a(21),a(22),a(23),a(13)),l=a(14),o=a(16),d=a(15),j=a(32),u=a(34),h=a(33),p=a(11),b=a(8),m=a(0),f=function(t){Object(o.a)(a,t);var e=Object(d.a)(a);function a(t){var r;return Object(i.a)(this,a),(r=e.call(this,t)).updateSorting=function(t,e){return r.setState({sortBy:t,isSortAsc:e})},r.state={data:{reports:[]},sortBy:"lastUpdate",isSortAsc:!1},r}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var t=this;fetch("./summary.json",{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(t){return t.json()})).then((function(e){console.log("Data fetch"),t.setState({data:e}),console.log(t.state.data)})).catch(console.log)}},{key:"sortTable",value:function(t,e){switch(t){case"name":return this.sortAlphabetically(e);case"lastUpdate":return this.sortByDate(e);case"statistic":return this.sortByStatus(e)}}},{key:"sortByDate",value:function(t){return this.state.data.reports.sort((function(e,a){return t?Date.parse(e.lastUpdate)-Date.parse(a.lastUpdate):Date.parse(a.lastUpdate)-Date.parse(e.lastUpdate)}))}},{key:"sortAlphabetically",value:function(t){return this.state.data.reports.sort((function(e,a){return t?e.name-a.name:a.name-e.name}))}},{key:"sortByStatus",value:function(t){return this.state.data.reports.sort((function(e,a){return t?e.statistic.failed+e.statistic.broken-(a.statistic.failed+a.statistic.broken):a.statistic.failed+a.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}},{key:"renderReportLink",value:function(t,e,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),s=t.name,n=t.name;if(e.pr_title){var c="";e.pr?c="(#".concat(e.pr,")"):e.pr_number&&(c="(#".concat(e.pr_number,")")),n="".concat(e.pr_title," ").concat(c)}var i="https://github.com/Automattic/jetpack/tree/".concat(e.branch);return Object(m.jsxs)("ul",{className:"list-unstyled",children:[Object(m.jsxs)("li",{children:[Object(m.jsx)(p.a,{className:a?"failed":"passed",icon:a?b.c:b.a}),"\xa0",Object(m.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",children:[n,Object(m.jsx)("br",{})]})]}),Object(m.jsx)("li",{children:Object(m.jsxs)("small",{children:["#",s," "," \u2022 ",Object(m.jsx)(p.a,{icon:b.b})," ",Object(m.jsx)("a",{href:i,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch})]})})]})}},{key:"renderResults",value:function(t){var e=["failed","passed","total"].map((function(e,a){var r="failed"===e?t[e]+t.broken:t[e];return Object(m.jsxs)(j.a,{className:"label label-status-".concat(e),children:[e," ",r]},a)}));return Object(m.jsx)("div",{children:e})}},{key:"renderMetadataCell",value:function(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(m.jsxs)("ul",{className:"list-unstyled",children:[Object(m.jsx)("li",{children:Object(m.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(m.jsx)("li",{children:Object(m.jsxs)("small",{children:["last run id:"," ",Object(m.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}},{key:"renderTableData",value:function(t,e){var a=this;return this.sortTable(t,e).map((function(t,e){var r=t.statistic,s=t.metadata,n=r.total!==r.passed;return Object(m.jsxs)("tr",{children:[Object(m.jsx)("td",{children:a.renderReportLink(t,s,n)}),Object(m.jsx)("td",{children:a.renderResults(r)}),Object(m.jsx)("td",{children:a.renderMetadataCell(t)})]},e)}))}},{key:"renderTableHeader",value:function(t,e,a){var r={name:"report id",statistic:"results",lastUpdate:"most recent"},s=a?"sort-by-asc":"sort-by-desc",n=Object.keys(r).map((function(n,c){return Object(m.jsxs)(u.a,{variant:"dark",onClick:function(){t(n,!a)},children:[r[n].toUpperCase(),Object(m.jsx)("span",{className:e===n?s:""})]},c)}));return Object(m.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(m.jsxs)("div",{children:[this.state.data.reportsCount," reports"]}),Object(m.jsx)("div",{children:n})]})}},{key:"render",value:function(){return Object(m.jsxs)(h.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",id:"reportsTable",children:[Object(m.jsxs)("thead",{children:[Object(m.jsx)("tr",{children:Object(m.jsx)("th",{colSpan:"3",children:Object(m.jsx)("h1",{className:"display-4",children:"Jetpack e2e test reports"})})}),Object(m.jsx)("tr",{children:Object(m.jsx)("td",{colSpan:"3",id:"sortButtons",children:this.renderTableHeader(this.updateSorting,this.state.sortBy,this.state.isSortAsc)})})]}),Object(m.jsx)("tbody",{children:this.renderTableData(this.state.sortBy,this.state.isSortAsc)})]})}}]),a}(s.a.Component);var O=function(){return Object(m.jsxs)("div",{className:"App",children:[Object(m.jsx)("header",{className:"App-header",children:"\xa0"}),Object(m.jsx)("div",{className:"App-content",children:Object(m.jsx)(f,{})}),Object(m.jsx)("footer",{className:"App-footer",children:Object(m.jsxs)("div",{children:[Object(m.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/",rel:"noreferrer",children:"Code"})," \u2022 ",Object(m.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/actions",rel:"noreferrer",children:"Actions"})]})})]})};c.a.render(Object(m.jsx)(s.a.StrictMode,{children:Object(m.jsx)(O,{})}),document.getElementById("root"))}},[[30,1,2]]]);
//# sourceMappingURL=main.5652477b.chunk.js.map