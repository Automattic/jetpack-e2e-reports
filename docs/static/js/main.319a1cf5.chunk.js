(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{160:function(t){t.exports=JSON.parse('{"permanent":["master","atomic","gutenberg"],"ignore":["static","e2e"]}')},189:function(t,e,s){},193:function(t,e,s){},331:function(t,e,s){"use strict";s.r(e);var a=s(0),r=s.n(a),n=s(38),c=s.n(n),i=(s(189),s(22)),o=s(40),l=(s(192),s(193),s(343)),p=s(342),u=s(344),d=s(20),j=s(52),h=s(53),b=s(54),f=s(59),m=s(160),O=s(334),v=s(335),x=s(336),k=s(119),y=s(75),g=s(3),C=function(t){Object(b.a)(s,t);var e=Object(f.a)(s);function s(){var t;Object(j.a)(this,s);for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return(t=e.call.apply(e,[this].concat(r))).state={reports:t.props.reports,sort:{by:"lastUpdate",isAsc:!1}},t}return Object(h.a)(s,[{key:"componentDidMount",value:function(){this.sortTable(this.state.sort.by,this.state.sort.isAsc)}},{key:"sortTable",value:function(t,e){switch(this.setState({sort:{by:t,isAsc:e}}),t){case"name":return this.sortByName(e);case"lastUpdate":return this.sortByDate(e);case"statistic":return this.sortByStatus(e)}}},{key:"sortByDate",value:function(t){return this.state.reports.sort((function(e,s){return t?Date.parse(e.lastUpdate)-Date.parse(s.lastUpdate):Date.parse(s.lastUpdate)-Date.parse(e.lastUpdate)}))}},{key:"sortByName",value:function(t){return this.state.reports.sort((function(e,s){return t?e.name-s.name:s.name-e.name}))}},{key:"sortByStatus",value:function(t){return this.state.reports.sort((function(e,s){return t?e.statistic.failed+e.statistic.broken-(s.statistic.failed+s.statistic.broken):s.statistic.failed+s.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}},{key:"getTableHeader",value:function(){var t,e,s=this,a={name:"report id",statistic:"no of failures",lastUpdate:"most recent"},r=this.state.sort.isAsc?"sort-by-asc":"sort-by-desc";return this.props.options.sortButtons&&(t=Object.keys(a).map((function(t,e){return Object(g.jsxs)(O.a,{variant:"dark",onClick:function(){s.sortTable(t,!s.state.sort.isAsc)},children:[a[t].toUpperCase(),Object(g.jsx)("span",{className:s.state.sort.by===t?r:""})]},e)}))),this.props.reportCount&&(e="".concat(this.state.reports.length," reports")),Object(g.jsx)("thead",{children:Object(g.jsx)("tr",{className:"headerRow",children:Object(g.jsx)("td",{colSpan:"3",className:"sortButtons",children:Object(g.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(g.jsx)("div",{children:e}),Object(g.jsx)("div",{children:t})]})})})})}},{key:"getReportRow",value:function(t,e){var s=t.statistic,a=t.metadata,r=s.total!==s.passed+s.skipped;return Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{className:"reportNameCell",children:this.getReportLinkCell(t,a,r,s.total)}),Object(g.jsx)("td",{children:this.getTestResultsCell(s)}),Object(g.jsx)("td",{children:this.getMetadataCell(t)})]},e)}},{key:"getReportLinkCell",value:function(t,e,s,a){var r="https://automattic.github.io/jetpack-e2e-reports/".concat(t.name,"/report/"),n=t.name,c=t.name;if(e.pr_title){var i="(#".concat(e.pr_number,")");c="".concat(e.pr_title," ").concat(i)}var l="https://github.com/Automattic/jetpack/tree/".concat(e.branch),p="https://github.com/Automattic/jetpack/pull/".concat(e.pr_number),u=y.c,d="warning";return a>0&&(u=s?y.d:y.a,d=s?"failed":"passed"),Object(g.jsxs)("ul",{className:"list-unstyled",children:[Object(g.jsxs)("li",{children:[Object(g.jsx)(k.a,{className:d,icon:u}),"\xa0",Object(g.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",onClick:function(){return o.a.pageview("/"+t.name)},children:[c,Object(g.jsx)("br",{})]})]}),Object(g.jsx)("li",{children:Object(g.jsxs)("small",{children:["#",n," "," \u2022 ",Object(g.jsx)(k.a,{icon:y.b})," ",Object(g.jsx)("a",{href:l,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch}),e.pr_number?" \u2022 ":"",e.pr_number&&Object(g.jsxs)("a",{href:p,target:"_blank",className:"report-link",rel:"noreferrer",children:["PR ",e.pr_number]})]})})]})}},{key:"getTestResultsCell",value:function(t){var e=["failed","passed","total"].map((function(e,s){var a="failed"===e?t[e]+t.broken:t[e];return Object(g.jsxs)(v.a,{className:"label label-status-".concat(e),children:[e," ",a]},s)}));return Object(g.jsx)("div",{children:e})}},{key:"getMetadataCell",value:function(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(g.jsxs)("ul",{className:"list-unstyled",children:[Object(g.jsx)("li",{children:Object(g.jsxs)("small",{children:["last update:"," ",new Date(Date.parse(t.lastUpdate)).toLocaleString()]})}),Object(g.jsx)("li",{children:Object(g.jsxs)("small",{children:["last run id:"," ",Object(g.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}},{key:"render",value:function(){var t=this;return Object(g.jsxs)(x.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",className:"reportsTable",children:[this.getTableHeader(),Object(g.jsx)("tbody",{children:this.state.reports.map((function(e,s){return t.getReportRow(e,s)}))}),Object(g.jsx)("tfoot",{children:Object(g.jsx)("tr",{children:Object(g.jsx)("td",{colSpan:3})})})]})}}],[{key:"getDerivedStateFromProps",value:function(t,e){return t.reports!==e.reports?{reports:t.reports}:null}}]),s}(r.a.Component),S=function(t){Object(b.a)(s,t);var e=Object(f.a)(s);function s(t){var a;return Object(j.a)(this,s),(a=e.call(this,t)).state={reports:[],pinnedReports:[],docsSize:void 0,reportsCount:void 0},a}return Object(h.a)(s,[{key:"componentDidMount",value:function(){var t=this;fetch("./summary.json",{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(t){return t.json()})).then((function(e){var s,a={reports:[]},r={reports:[]},n=Object(d.a)(e.reports);try{for(n.s();!(s=n.n()).done;){var c=s.value;m.permanent.includes(c.name)?r.reports.push(c):a.reports.push(c)}}catch(i){n.e(i)}finally{n.f()}t.setState({reports:a.reports,pinnedReports:r.reports,docsSize:e.docsSize,reportsCount:e.reportsCount})})).catch(console.log),o.a.pageview("/reports")}},{key:"render",value:function(){return Object(g.jsxs)("div",{children:[Object(g.jsxs)("div",{className:"reports-header",children:[this.state.reportsCount," reports"]}),Object(g.jsx)(C,{reports:this.state.pinnedReports,options:{reportCount:!1,sortButtons:!1}}),Object(g.jsx)(C,{reports:this.state.reports,options:{reportCount:!1,sortButtons:!0}}),Object(g.jsxs)("small",{className:"footnote",children:["docs size: ",this.state.docsSize]})]})}}]),s}(r.a.Component),N=s(337),A=s(341),T=s(174),w=s(175),D=s(78),R=s(73),_=s(179),B=function(t){Object(b.a)(s,t);var e=Object(f.a)(s);function s(t){var a;return Object(j.a)(this,s),(a=e.call(this,t)).state={data:{reports:[]},sortBy:"lastUpdate",isSortAsc:!1,stats:[],failedTests:[],statsChartData:[]},a}return Object(h.a)(s,[{key:"parseStats",value:function(){var t={};this.state.stats.forEach((function(e){var s=new Date(e.time.start).toISOString().split("T")[0];t[s]?(t[s].failed+=e.statistic.failed+e.statistic.broken,t[s].skipped+=e.statistic.skipped,t[s].passed+=e.statistic.passed,t[s].unknown+=e.statistic.unknown,t[s].total+=e.statistic.total):(t[s]=Object.assign({},e.statistic),t[s].failed+=e.statistic.broken,t[s].date=s)})),this.setState({statsChartData:Object.values(t)})}},{key:"componentDidMount",value:function(){var t=this;fetch("./metrics.json",{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(t){return t.json()})).then((function(e){t.setState({stats:e.stats}),t.setState({failedTests:e.failedTests}),t.parseStats()})).catch(console.log),o.a.pageview("/metrics")}},{key:"renderStatsSummary",value:function(){var t=this.state.stats.reduce((function(t,e){return t.failed+=e.statistic.failed+e.statistic.broken,t.testCases+=e.statistic.total,t.total++,t}),{failed:0,testCases:0,total:0});console.log(JSON.stringify(t));var e=t.failed/t.testCases*100;return Object(g.jsx)("div",{children:Object(g.jsxs)("p",{children:["Failures: ",e,"% Test case runs:"," ",t.testCases," Total runs: ",t.total]})})}},{key:"renderFailedTests",value:function(){return this.state.failedTests.map((function(t,e){return Object(g.jsxs)("div",{children:[t.fileName," ",t.name," ",t.error.statusMessage," ",t.error.statusTrace.substring(20)]},e)}))}},{key:"renderSummaryChart",value:function(){return Object(g.jsx)("div",{children:Object(g.jsxs)(N.a,{width:1200,height:300,data:this.state.statsChartData,margin:{top:5,right:60,bottom:5,left:60},children:[Object(g.jsx)(A.a,{stroke:"white"}),Object(g.jsx)(T.a,{dataKey:"date",stroke:"white"}),Object(g.jsx)(w.a,{stroke:"white"}),Object(g.jsx)(D.a,{}),Object(g.jsx)(R.a,{}),Object(g.jsx)(_.a,{type:"monotone",dataKey:"passed",stroke:"#8884d8",isAnimationActive:!1}),Object(g.jsx)(_.a,{type:"monotone",dataKey:"failed",stroke:"#82ca9d",isAnimationActive:!1})]})})}},{key:"render",value:function(){return Object(g.jsxs)("div",{children:[Object(g.jsx)("span",{children:"METRICS"}),this.renderStatsSummary(),this.renderSummaryChart()]})}}]),s}(r.a.Component);o.a.initialize("UA-208890082-1");var U=function(t,e){t(e),location.hash=e};function M(t){var e=t.activeNavbar,s=t.setActiveNavbar;return Object(g.jsx)(l.a,{variant:"dark",expand:"md",className:"app-nav-bar",children:Object(g.jsxs)(p.a,{fluid:!0,className:"app-nav-bar-inner-container",children:[Object(g.jsx)(l.a.Brand,{href:"#",children:"Jetpack test results dashboard"}),Object(g.jsx)(l.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(g.jsx)(l.a.Collapse,{id:"basic-navbar-nav",children:Object(g.jsxs)(u.a,{activeKey:e,className:"ml-auto",children:[Object(g.jsx)(u.a.Link,{href:"#reports",onSelect:function(t){return U(s,t)},children:"Recent reports"}),Object(g.jsx)(u.a.Link,{href:"#metrics",onSelect:function(t){return U(s,t)},children:"Metrics"})]})})]})})}var z=function(){var t=Object(a.useState)("#reports"),e=Object(i.a)(t,2),s=e[0],r=e[1];return location.hash&&["#reports","#metrics"].includes(location.hash)&&s!==location.hash&&r(location.hash),Object(g.jsxs)(p.a,{fluid:!0,className:"App",children:[Object(g.jsxs)("div",{className:"App-content",children:[Object(g.jsx)(M,{activeNavbar:s,setActiveNavbar:r}),"#reports"===s?Object(g.jsx)(S,{}):Object(g.jsx)(B,{})]}),Object(g.jsx)("footer",{className:"App-footer",children:Object(g.jsxs)("div",{children:[Object(g.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/",rel:"noreferrer",children:"Code"})," \u2022 ",Object(g.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/actions",rel:"noreferrer",children:"Actions"})]})})]})};c.a.render(Object(g.jsx)(r.a.StrictMode,{children:Object(g.jsx)(z,{})}),document.getElementById("root"))}},[[331,1,2]]]);
//# sourceMappingURL=main.319a1cf5.chunk.js.map