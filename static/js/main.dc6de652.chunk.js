(this["webpackJsonpjetpack-e2e-reports"]=this["webpackJsonpjetpack-e2e-reports"]||[]).push([[0],{54:function(t,e,s){},58:function(t,e,s){},71:function(t,e,s){"use strict";s.r(e);var a=s(1),r=s.n(a),n=s(26),c=s.n(n),i=(s(54),s(13)),l=(s(57),s(58),s(82)),o=s(84),u=s(85),d=s(18),h=s(11),j=s(12),b=s(15),p=s(14),f=s(9),m=s(77),O=s(78),x=s(79),v=s(32),y=s(22),D=s(5),k=s.n(D),g=s(0),N=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(){var t;Object(h.a)(this,s);for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return(t=e.call.apply(e,[this].concat(r))).state={reports:t.props.reports,sort:{by:"lastUpdate",isAsc:!1}},t}return Object(j.a)(s,[{key:"componentDidMount",value:function(){this.sortTable(this.state.sort.by,this.state.sort.isAsc)}},{key:"sortTable",value:function(t,e){switch(this.setState({sort:{by:t,isAsc:e}}),t){case"name":return this.sortByName(e);case"lastUpdate":return this.sortByDate(e);case"statistic":return this.sortByStatus(e)}}},{key:"sortByDate",value:function(t){return this.state.reports.sort((function(e,s){return t?Date.parse(e.lastUpdate)-Date.parse(s.lastUpdate):Date.parse(s.lastUpdate)-Date.parse(e.lastUpdate)}))}},{key:"sortByName",value:function(t){return this.state.reports.sort((function(e,s){return t?e.name-s.name:s.name-e.name}))}},{key:"sortByStatus",value:function(t){return this.state.reports.sort((function(e,s){return t?e.statistic.failed+e.statistic.broken-(s.statistic.failed+s.statistic.broken):s.statistic.failed+s.statistic.broken-(e.statistic.failed+e.statistic.broken)}))}},{key:"getTableHeader",value:function(){var t,e,s=this,a={name:"report id",statistic:"no of failures",lastUpdate:"most recent"},r=this.state.sort.isAsc?"sort-by-asc":"sort-by-desc";return this.props.options.sortButtons&&(t=Object.keys(a).map((function(t,e){return Object(g.jsxs)(m.a,{variant:"dark",onClick:function(){s.sortTable(t,!s.state.sort.isAsc)},children:[a[t].toUpperCase(),Object(g.jsx)("span",{className:s.state.sort.by===t?r:""})]},e)}))),this.props.reportCount&&(e="".concat(this.state.reports.length," reports")),Object(g.jsx)("thead",{children:Object(g.jsx)("tr",{className:"headerRow",children:Object(g.jsx)("td",{colSpan:"3",className:"sort-buttons",children:Object(g.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(g.jsx)("div",{children:e}),Object(g.jsx)("div",{children:t})]})})})})}},{key:"getReportRow",value:function(t,e){var s=t.statistic,a=t.metadata,r=s.total!==s.passed+s.skipped;return Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{className:"reportNameCell",children:this.getReportLinkCell(t,a,r,s.total)}),Object(g.jsx)("td",{children:this.getTestResultsCell(s)}),Object(g.jsx)("td",{children:this.getMetadataCell(t)})]},e)}},{key:"getReportLinkCell",value:function(t,e,s,a){var r="".concat(f.dataSourceURL,"/reports/").concat(t.name,"/report/index.html"),n=t.name,c=t.name;if(e.pr_title){var l="(#".concat(e.pr_number,")");c="".concat(e.pr_title," ").concat(l)}var o="https://github.com/Automattic/jetpack/tree/".concat(e.branch),u="https://github.com/Automattic/jetpack/pull/".concat(e.pr_number),d=y.d,h="warning";return a>0&&(d=s?y.f:y.a,h=s?"failed":"passed"),Object(g.jsxs)("ul",{className:"list-unstyled",children:[Object(g.jsxs)("li",{children:[Object(g.jsx)(v.a,{className:h,icon:d}),"\xa0",Object(g.jsxs)("a",{href:r,className:"report-link",target:"_blank",rel:"noreferrer",onClick:function(){return i.a.pageview("/"+t.name)},children:[c,Object(g.jsx)("br",{})]})]}),Object(g.jsx)("li",{children:Object(g.jsxs)("small",{children:["#",n," "," \u2022 ",Object(g.jsx)(v.a,{icon:y.c})," ",Object(g.jsx)("a",{href:o,target:"_blank",className:"report-link",rel:"noreferrer",children:e.branch}),e.pr_number?" \u2022 ":"",e.pr_number&&Object(g.jsxs)("a",{href:u,target:"_blank",className:"report-link",rel:"noreferrer",children:["PR ",e.pr_number]})]})})]})}},{key:"getTestResultsCell",value:function(t){var e=["failed","passed","total"].map((function(e,s){var a="failed"===e?t[e]+t.broken:t[e];return Object(g.jsxs)(O.a,{className:"label label-status-".concat(e),children:[e," ",a]},s)}));return Object(g.jsx)("div",{children:e})}},{key:"getMetadataCell",value:function(t){var e="https://github.com/Automattic/jetpack/actions/runs/".concat(t.metadata.run_id);return Object(g.jsxs)("ul",{className:"list-unstyled",children:[Object(g.jsx)("li",{children:Object(g.jsxs)("small",{children:["last update: ",k()(t.lastUpdate).fromNow()]})}),Object(g.jsx)("li",{children:Object(g.jsxs)("small",{children:["last run id:"," ",Object(g.jsx)("a",{href:e,target:"_blank",className:"report-link",rel:"noreferrer",children:t.metadata.run_id})]})})]})}},{key:"render",value:function(){var t=this;return Object(g.jsxs)(x.a,{hover:!0,responsive:"sm",size:"sm",variant:"dark",className:"reportsTable",children:[this.getTableHeader(),Object(g.jsx)("tbody",{children:this.state.reports.map((function(e,s){return t.getReportRow(e,s)}))}),Object(g.jsx)("tfoot",{children:Object(g.jsx)("tr",{children:Object(g.jsx)("td",{colSpan:3})})})]})}}]),s}(r.a.Component),w=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(t){var a;return Object(h.a)(this,s),(a=e.call(this,t)).state={reports:[],pinnedReports:[],docsSize:void 0,reportsCount:void 0,isDataFetched:!1},a}return Object(j.a)(s,[{key:"componentDidMount",value:function(){var t=this;fetch("".concat(f.dataSourceURL,"/data/reports.json"),{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(t){return t.json()})).then((function(e){var s,a={reports:[]},r={reports:[]},n=Object(d.a)(e.reports);try{for(n.s();!(s=n.n()).done;){var c=s.value;f.permanent.includes(c.name)?r.reports.push(c):a.reports.push(c)}}catch(i){n.e(i)}finally{n.f()}t.setState({reports:a.reports,pinnedReports:r.reports,docsSize:e.docsSize,reportsCount:e.reportsCount,isDataFetched:!0})})).catch(console.log),i.a.pageview("/reports")}},{key:"render",value:function(){return this.state.isDataFetched?Object(g.jsxs)("div",{children:[Object(g.jsxs)("div",{className:"reports-header",children:[this.state.reportsCount," reports"]}),Object(g.jsx)(N,{reports:this.state.pinnedReports,options:{reportCount:!1,sortButtons:!1}}),Object(g.jsx)(N,{reports:this.state.reports,options:{reportCount:!1,sortButtons:!0}})]}):null}}]),s}(r.a.Component),S=s(49),M=s(6),Y=s(10),C=s.n(Y),R=s(17);function A(t){return L.apply(this,arguments)}function L(){return(L=Object(R.a)(C.a.mark((function t(e){var s;return C.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return(s=t.sent).ok||console.error("Error fetching data from ".concat(e," ").concat(s.status)),t.next=6,s.json();case 6:return t.abrupt("return",t.sent);case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var T=s(24),B=s(80),E=s(86),U=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(){return Object(h.a)(this,s),e.apply(this,arguments)}return Object(j.a)(s,[{key:"getSortButtons",value:function(t,e,s){var a=this,r=s?"sort-by-asc":"sort-by-desc";return Object.keys(t).map((function(n,c){return Object(g.jsxs)(m.a,{variant:"dark",onClick:function(){a.sortData(n,!s)},children:[t[n].toUpperCase(),Object(g.jsx)("span",{className:e===n?r:""})]},c)}))}},{key:"getMasterOnlyFilterButton",value:function(){var t=this,e=this.state.filters.isMasterOnly?y.b:y.e;return Object(g.jsxs)(m.a,{variant:"dark",className:"filter-btn",onClick:function(){t.setState((function(e){return{filters:Object(T.a)(Object(T.a)({},e.filters),{},{isMasterOnly:!t.state.filters.isMasterOnly})}}))},children:[Object(g.jsx)(v.a,{icon:e})," master only"]})}},{key:"getFilterByDateFields",value:function(){var t=this,e="YYYY-MM-DD";function s(t,e){var s=document.getElementById(t);return s.value?s.value:e}return Object(g.jsx)("div",{children:Object(g.jsx)("div",{className:"col filters",children:Object(g.jsxs)(B.a,{children:[[["today",0],["last 7 days",7],["last 14 days",14]].map((function(a,r){return Object(g.jsx)(m.a,{variant:"dark",className:"filter-btn",onClick:function(){t.setDatePickersValues(k()().subtract(a[1],"d").format(e),k()().format(e)),t.setState((function(t){return{filters:Object(T.a)(Object(T.a)({},t.filters),{},{startDate:s("startDate","1970-01-01"),endDate:s("endDate",k()().format(e))})}}))},children:a[0]},r)})),Object(g.jsx)(E.a,{type:"date",id:"startDate",max:k()().format(e),onChange:function(){var t=document.getElementById("endDate"),a=s("startDate","2021-10-01");t.setAttribute("min",a),k()(t.value).format(e)<k()(a).format(e)&&(t.value=a)}}),Object(g.jsx)(E.a,{type:"date",id:"endDate",max:k()().format("YYYY-MM-DD")}),Object(g.jsx)(m.a,{variant:"dark",className:"filter-btn",onClick:function(){t.setState((function(t){return{filters:Object(T.a)(Object(T.a)({},t.filters),{},{startDate:s("startDate","1970-01-01"),endDate:s("endDate",k()().format(e))})}}))},children:"Apply"})]})})})}},{key:"setDatePickersValues",value:function(t,e){var s=document.getElementById("startDate"),a=document.getElementById("endDate");s.value=t,a.value=e}}]),s}(r.a.Component),F=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(){var t;Object(h.a)(this,s);for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return(t=e.call.apply(e,[this].concat(r))).state={rawData:{testsData:{}},tests:{list:[],distinctTests:0,totalTestResults:0,failedResults:0,failedRate:0},filters:{isMasterOnly:!1,startDate:k()().subtract(14,"d").format("YYYY-MM-DD"),endDate:k()().format("YYYY-MM-DD")},sort:{by:"failedRate",isAsc:!1},isDataReady:!1},t}return Object(j.a)(s,[{key:"componentDidMount",value:function(){var t=Object(R.a)(C.a.mark((function t(){return C.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=this,t.next=3,A("".concat(f.dataSourceURL,"/data/tests.json"));case 3:t.t1=t.sent,t.t2={testsData:t.t1},t.t3={rawData:t.t2},t.t0.setState.call(t.t0,t.t3),this.setTestsData(),this.setState({isDataReady:!0}),this.setDatePickersValues(this.state.filters.startDate,this.state.filters.endDate),i.a.pageview("/tests");case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(t,e){this.state.filters!==e.filters&&(console.log(this.state.filters),this.setTestsData()),this.state.tests.list!==e.tests.list&&this.sortData(this.state.sort.by,this.state.sort.isAsc)}},{key:"setTestsData",value:function(){var t=this,e=JSON.parse(JSON.stringify(this.state.rawData.testsData.tests));this.state.filters.startDate&&this.state.filters.endDate&&e.forEach((function(e){e.results=e.results.filter((function(e){return k()(e.time).isBetween(k()(t.state.filters.startDate,"YYYY-MM-DD"),k()(t.state.filters.endDate,"YYYY-MM-DD"),"d","[]")}))})),this.state.filters.isMasterOnly&&e.forEach((function(t){t.results=t.results.filter((function(t){return f.masterRuns.includes(t.report)}))})),e=e.filter((function(t){return t.results.length>0}));var s,a=Object(d.a)(e);try{for(a.s();!(s=a.n()).done;){var r=s.value;r.total=0;for(var n=function(){var t=i[c];r[t]=r.results.filter((function(e){return e.status===t})).length,r.total+=r[t]},c=0,i=["passed","failed","skipped"];c<i.length;c++)n();r.failedRate=(r.failed/r.total*100).toFixed(2),r.results.sort((function(t,e){return t.time-e.time}))}}catch(h){a.e(h)}finally{a.f()}var l=0,o=0;e.forEach((function(t){l+=t.total,o+=t.failed}));var u=(o/l*100).toFixed(2);this.setState({tests:{list:e,distinctTests:e.length,totalTestResults:l,failedResults:o,failedRate:u}})}},{key:"sortData",value:function(t,e){this.state.tests.list.sort((function(s,a){return e?s[t]-a[t]:a[t]-s[t]})),this.setState({sort:{by:t,isAsc:e}})}},{key:"getTotalsBadges",value:function(t){var e=["failed","passed","skipped","total"].map((function(e,s){var a=t[e],r=0===a?"hide":"",n=(a/(t.total-("skipped"===e?0:t.skipped))*100).toFixed(1);return n="total"===e||isNaN(n)?"":"".concat(n,"%"),Object(g.jsx)("li",{children:Object(g.jsxs)(O.a,{className:"label label-fill label-status-".concat(e," ").concat(r),children:[a," ",e,Object(g.jsx)(O.a,{className:"badge-pill stat-pill",children:n})]},s)},s)}));return Object(g.jsx)("ul",{className:"list-unstyled",children:e})}},{key:"getResultsLine",value:function(t){var e=t.results.slice(-150).map((function(t,e){var s,a="no-source";return t.source&&(a="",s="".concat(t.report,"/report/#testresult/").concat(t.source.replace(/.json/,""))),Object(g.jsxs)(O.a,{onClick:function(){s&&window.open(s,"_blank")},className:"has-tooltip label label-small label-status-".concat(t.status," ").concat(a),children:["\xa0",Object(g.jsxs)("span",{className:"tooltip-content",children:[k()(t.time).format("MMM Do, h:mm a"),Object(g.jsx)("br",{}),t.source]})]},e)}));return Object(g.jsx)("div",{children:e})}},{key:"getTestContent",value:function(t,e){return Object(g.jsxs)("div",{className:"test-container",children:[Object(g.jsx)("div",{className:"row",children:Object(g.jsx)("div",{className:"col-sm-auto",children:Object(g.jsx)("h1",{children:t.name})})}),Object(g.jsxs)("div",{className:"row",children:[Object(g.jsx)("div",{className:"col-sm-auto",children:this.getTotalsBadges(t)}),Object(g.jsx)("div",{className:"col",children:this.getResultsLine(t)})]})]},e)}},{key:"render",value:function(){var t=this;return this.state.isDataReady?Object(g.jsxs)("div",{children:[Object(g.jsx)("div",{className:"row",children:this.getFilterByDateFields()}),Object(g.jsx)("hr",{}),Object(g.jsxs)("div",{className:"row text-center",children:[Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsx)("span",{className:"stat-number",children:this.state.tests.distinctTests}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"tests"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsx)("span",{className:"stat-number",children:this.state.tests.totalTestResults}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"results"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsx)("span",{className:"stat-number",children:this.state.tests.failedResults}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"failures"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsxs)("span",{className:"stat-number",children:[this.state.tests.failedRate,"%"]}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"failure rate"})]})})]}),Object(g.jsx)("hr",{}),Object(g.jsxs)("div",{className:"row",children:[Object(g.jsx)("div",{className:"col-sm filters",children:this.getMasterOnlyFilterButton()}),Object(g.jsx)("div",{className:"col-md sort-buttons",children:this.getSortButtons({total:"runs",failedRate:"failure rate"},this.state.sort.by,this.state.sort.isAsc)})]}),Object(g.jsx)("hr",{}),Object(g.jsx)("div",{children:this.state.tests.list.map((function(e,s){return t.getTestContent(e,s)}))})]}):null}}]),s}(U),_=s(23);var P=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(){var t;Object(h.a)(this,s);for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return(t=e.call.apply(e,[this].concat(r))).state={rawData:{dailyData:[],weeklyData:[],monthlyData:[],summaryData:{}},days:[],weeks:[],months:[],summary:{},filters:{isMasterOnly:!0},isDataReady:!1},t}return Object(j.a)(s,[{key:"componentDidMount",value:function(){var t=Object(R.a)(C.a.mark((function t(){return C.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=this,t.next=3,A("".concat(f.dataSourceURL,"/data/results-daily.json"));case 3:return t.t1=t.sent,t.next=6,A("".concat(f.dataSourceURL,"/data/results-weekly.json"));case 6:return t.t2=t.sent,t.next=9,A("".concat(f.dataSourceURL,"/data/results-monthly.json"));case 9:return t.t3=t.sent,t.next=12,A("".concat(f.dataSourceURL,"/data/summary.json"));case 12:t.t4=t.sent,t.t5={dailyData:t.t1,weeklyData:t.t2,monthlyData:t.t3,summaryData:t.t4},t.t6={rawData:t.t5},t.t0.setState.call(t.t0,t.t6),this.setState({days:this.filterData(this.state.rawData.dailyData)}),this.setState({weeks:this.filterData(this.state.rawData.weeklyData)}),this.setState({months:this.filterData(this.state.rawData.monthlyData)}),this.setState({summary:this.filterSummaryData()}),this.setState({isDataReady:!0}),i.a.pageview("/charts");case 22:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(t,e){this.state.filters!==e.filters&&(this.setState({days:this.filterData(this.state.rawData.dailyData)}),this.setState({weeks:this.filterData(this.state.rawData.weeklyData)}),this.setState({months:this.filterData(this.state.rawData.monthlyData)}),this.setState({summary:this.filterSummaryData()}))}},{key:"filterData",value:function(t){var e=JSON.parse(JSON.stringify(t));return(e=this.state.filters.isMasterOnly?e.map((function(t){var e=t.master;return e.date=t.date,e})):e.map((function(t){var e=t.total;return e.date=t.date,e}))).forEach((function(t){t.failedRate=(t.failed/t.total*100).toFixed(2)})),function(t,e){var s=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=t.sort((function(t,s){return t[e]>s[e]?1:s[e]>t[e]?-1:0}));s&&a.reverse()}(e,"date",!1),e}},{key:"filterSummaryData",value:function(){var t=this,e={};return this.state.filters.isMasterOnly?Object.keys(this.state.rawData.summaryData.stats).forEach((function(s){e[s]=t.state.rawData.summaryData.stats[s].master})):Object.keys(this.state.rawData.summaryData.stats).forEach((function(s){e[s]=t.state.rawData.summaryData.stats[s].total})),Object.keys(e).forEach((function(t){e[t].failureRate=(e[t].failed/e[t].total*100).toFixed(2)})),e}},{key:"chartOptions",value:function(t){return{title:{text:"",left:"left",top:"top",textStyle:{fontSize:20,color:"#ccc"}},grid:{left:50,right:50},dataZoom:[{type:"slider",borderColor:"#343a40",fillerColor:"rgba(244,244,244,0.18)"}],tooltip:{trigger:"axis",axisPointer:{type:"cross"}},legend:{textStyle:{color:"#ccc"},left:"right"},xAxis:[{type:"category",data:t.map((function(t){return t.date})),axisLabel:{formatter:"{value}",color:"#ccc"},axisPointer:{label:{formatter:"{value}"}}}],yAxis:[{type:"value",splitLine:{lineStyle:{width:0,type:"dotted",color:"#6b6d76"}}},{type:"value",splitLine:{lineStyle:{width:.5,type:"dashed",color:"#6b6d76"}},min:0,axisLabel:{formatter:"{value} %",color:"#ccc"}}],series:[{name:"failure rate",type:"line",yAxisIndex:1,color:"#e38474",symbol:"roundRect",symbolSize:4,data:t.map((function(t){return t.failedRate}))},{name:"passed tests",type:"bar",stack:"1",emphasis:{focus:"series"},color:"rgba(115, 151, 75, 0.73)",data:t.map((function(t){return t.passed}))},{name:"failed tests",type:"bar",stack:"1",emphasis:{focus:"series"},color:"rgba(253, 90, 62, 0.71)",data:t.map((function(t){return t.failed}))},{name:"skipped tests",type:"bar",stack:"1",emphasis:{focus:"series"},color:"rgba(170, 170, 170, 0.73)",data:t.map((function(t){return t.skipped}))}]}}},{key:"dailyChartOptions",value:function(){var t=this.chartOptions(this.state.days);return t.title.text="Daily",t.dataZoom[0].startValue=k()().subtract(6,"weeks").format("YYYY-MM-DD"),t.xAxis[0].axisLabel.formatter=function(t){return k()(t).format("MMM D, YYYY")},t.xAxis[0].axisPointer.label.formatter=function(t){return k()(t.value).format("MMM D, YYYY")},t}},{key:"weeklyChartOptions",value:function(){var t=this.chartOptions(this.state.weeks);return t.title.text="Weekly",t}},{key:"monthlyChartOptions",value:function(){var t=this.chartOptions(this.state.months);return t.title.text="Monthly",t.xAxis[0].axisLabel.formatter=function(t){return k()(t).format("MMM YYYY")},t.xAxis[0].axisPointer.label.formatter=function(t){return k()(t.value).format("MMM YYYY")},t}},{key:"dailyHeatMapOptions",value:function(){var t=this.state.days.map((function(t){return[t.date,t.failedRate]}));return{title:{text:"Daily failure rate",left:"left",top:"top",textStyle:{fontSize:20,color:"#ccc"}},tooltip:{formatter:function(t){var e=t.value.toString().split(",");return"<b>"+k()(e[0]).format("MMM D, YYYY")+"</b><br/>"+e[1]+"%"}},visualMap:{type:"continuous",min:0,max:5,precision:1,textStyle:{color:"#ccc"},calculable:!0,orient:"horizontal",left:"right",top:"top",inRange:{color:["rgba(115, 151, 75, 0.75)","rgba(148,151,75,0.75)","#ffd050","rgba(250,150,40,0.75)","rgba(240,90,0,0.75)","rgba(200,70,0,0.75)","rgba(160,50,0,0.75)","rgba(120,30,0,0.75)","rgba(90,10,0,0.75)"]}},calendar:{bottom:10,top:100,left:50,right:50,cellSize:["auto",15],range:[k()().subtract(1,"year").format("YYYY-MM-DD"),k()().format("YYYY-MM-DD")],itemStyle:{color:"#343a40",borderColor:"#454c54",borderWidth:.3},splitLine:{show:!0,lineStyle:{width:.3}},yearLabel:{show:!0},dayLabel:{color:"#ccc",firstDay:1,position:"end"},monthLabel:{color:"#ccc"}},series:{type:"heatmap",coordinateSystem:"calendar",data:t}}}},{key:"render",value:function(){return this.state.isDataReady?Object(g.jsxs)("div",{children:[Object(g.jsx)("div",{className:"row",children:Object(g.jsx)("div",{className:"col-sm filters",children:this.getMasterOnlyFilterButton()})}),Object(g.jsx)("hr",{}),Object(g.jsx)("div",{className:"row",children:Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsx)("span",{className:"inner-title",children:"Failure rate"})})}),Object(g.jsxs)("div",{className:"row text-center",children:[Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsxs)("span",{className:"stat-number",children:[this.state.summary["24h"].failureRate,Object(g.jsx)("small",{children:"%"})]}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"24h"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsxs)("span",{className:"stat-number",children:[this.state.summary["7d"].failureRate,Object(g.jsx)("small",{children:"%"})]}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"7d"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsxs)("span",{className:"stat-number",children:[this.state.summary["14d"].failureRate,Object(g.jsx)("small",{children:"%"})]}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"14d"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsxs)("span",{className:"stat-number",children:[this.state.summary["30d"].failureRate,Object(g.jsx)("small",{children:"%"})]}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"30d"})]})})]}),Object(g.jsx)("div",{className:"row",children:Object(g.jsx)("div",{className:"col-sm text-right",children:Object(g.jsxs)("small",{children:["updated ",k()(this.state.rawData.summaryData.lastUpdate).fromNow()]})})}),Object(g.jsx)("hr",{}),Object(g.jsx)(_.a,{option:this.dailyChartOptions()}),Object(g.jsx)("hr",{}),Object(g.jsx)(_.a,{option:this.dailyHeatMapOptions()}),Object(g.jsx)("hr",{}),Object(g.jsx)(_.a,{option:this.weeklyChartOptions()}),Object(g.jsx)("hr",{}),Object(g.jsx)(_.a,{option:this.monthlyChartOptions()}),Object(g.jsx)("hr",{})]}):null}}]),s}(U),z=s(27),J=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(){var t;Object(h.a)(this,s);for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return(t=e.call.apply(e,[this].concat(r))).state={rawData:{errorsData:{}},errors:{list:[],totalErrors:0,distinctErrors:0},filters:{isMasterOnly:!1,startDate:k()().subtract(14,"d").format("YYYY-MM-DD"),endDate:k()().format("YYYY-MM-DD")},sort:{by:"common",isAsc:!1},isDataReady:!1},t}return Object(j.a)(s,[{key:"componentDidMount",value:function(){var t=Object(R.a)(C.a.mark((function t(){return C.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=this,t.next=3,A("".concat(f.dataSourceURL,"/data/errors.json"));case 3:t.t1=t.sent,t.t2={errorsData:t.t1},t.t3={rawData:t.t2},t.t0.setState.call(t.t0,t.t3),this.setErrorsData(),this.setState({isDataReady:!0}),this.setDatePickersValues(this.state.filters.startDate,this.state.filters.endDate),i.a.pageview("/failures");case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(t,e){this.state.filters!==e.filters&&this.setErrorsData(),this.state.errors.list!==e.errors.list&&this.sortData(this.state.sort.by,this.state.sort.isAsc)}},{key:"setErrorsData",value:function(){var t=this,e=JSON.parse(JSON.stringify(this.state.rawData.errorsData.errors));this.state.filters.startDate&&this.state.filters.endDate&&e.forEach((function(e){e.results=e.results.filter((function(e){return k()(e.time).isBetween(k()(t.state.filters.startDate,"YYYY-MM-DD"),k()(t.state.filters.endDate,"YYYY-MM-DD"),"d","[]")}))})),this.state.filters.isMasterOnly&&e.forEach((function(t){t.results=t.results.filter((function(t){return f.masterRuns.includes(t.report)}))})),e=e.filter((function(t){return t.results.length>0}));var s,a=Object(d.a)(e);try{for(a.s();!(s=a.n()).done;){var r=s.value;r.total=r.results.length;var n=r.results.map((function(t){return t.time}));r.newest=Math.max.apply(Math,Object(z.a)(n)),r.oldest=Math.min.apply(Math,Object(z.a)(n));var c=Object(z.a)(new Set(r.results.map((function(t){return t.test}))));r.tests=[];var i,l=Object(d.a)(c);try{var o=function(){var t=i.value,e=r.results.filter((function(e){return e.test===t}));r.tests.push({name:t,times:e.map((function(t){return t.time}))})};for(l.s();!(i=l.n()).done;)o()}catch(h){l.e(h)}finally{l.f()}}}catch(h){a.e(h)}finally{a.f()}var u=e.map((function(t){return t.results})).flat();this.setState({errors:{list:e,distinctErrors:e.length,totalErrors:u.length}})}},{key:"sortData",value:function(t,e){switch(t){case"recent":this.state.errors.list.sort((function(t,s){return e?t.newest-s.newest:s.newest-t.newest}));break;case"common":this.state.errors.list.sort((function(t,s){return e?t.results.length-s.results.length:s.results.length-t.results.length}))}this.setState({sort:{by:t,isAsc:e}})}},{key:"getListOfTests",value:function(t){return Object(g.jsx)("div",{children:t.map((function(t,e){return Object(g.jsxs)(O.a,{className:"label label-status-skipped",children:[t.name," ",Object(g.jsx)(O.a,{className:"badge-pill stat-pill",children:t.times.length})]},e)}))})}},{key:"getListOfFailures",value:function(t){return Object(g.jsx)("div",{children:t.map((function(t,e){var s=k()(t.time).format("MMM Do, h:mm a"),a="no-source";if(!t.source)return"";var r="".concat(t.report,"/report/#testresult/").concat(t.source.replace(/.json/,""));return s=Object(g.jsx)("a",{href:r,target:"_blank",rel:"noreferrer",className:"report-link",children:s}),a="",Object(g.jsx)("span",{className:"failure-link ".concat(a),children:s},e)}))})}},{key:"getErrorContent",value:function(t,e){var s="".concat(t.total," times, since ").concat(k()(t.oldest).fromNow(),". Last failed ").concat(k()(t.newest).fromNow());return 1===t.total&&(s="once, ".concat(k()(t.oldest).fromNow())),Object(g.jsxs)("div",{className:"error-container",children:[Object(g.jsxs)("div",{className:"row",children:[Object(g.jsx)("pre",{className:"error-container-trace",children:t.trace}),Object(g.jsx)("div",{children:s})]}),Object(g.jsx)("div",{className:"row",children:this.getListOfTests(t.tests)}),Object(g.jsx)("div",{className:"row",children:this.getListOfFailures(t.results)})]},e)}},{key:"render",value:function(){var t=this;if(!this.state.isDataReady)return null;var e=k()(this.state.rawData.errorsData.lastUpdate).fromNow();return Object(g.jsxs)("div",{children:[Object(g.jsx)("hr",{}),Object(g.jsxs)("div",{className:"row text-center",children:[Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsx)("span",{className:"stat-number",children:this.state.errors.totalErrors}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"total errors"})]})}),Object(g.jsx)("div",{className:"col-sm",children:Object(g.jsxs)("div",{className:"stat-box",children:[Object(g.jsx)("span",{className:"stat-number",children:this.state.errors.distinctErrors}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{className:"stat-description",children:"distinct errors"})]})})]}),Object(g.jsx)("hr",{}),Object(g.jsx)("div",{className:"row",children:this.getFilterByDateFields()}),Object(g.jsxs)("div",{className:"row",children:[Object(g.jsx)("div",{className:"col-sm filters",children:this.getMasterOnlyFilterButton()}),Object(g.jsx)("div",{className:"col-md sort-buttons",children:this.getSortButtons({recent:"most recent",common:"most common"},this.state.sort.by,this.state.sort.isAsc)})]}),Object(g.jsx)("hr",{}),Object(g.jsx)("div",{children:this.state.errors.list.map((function(e,s){return t.getErrorContent(e,s)}))}),Object(g.jsx)("div",{className:"row",children:Object(g.jsxs)("div",{className:"text-right col small",children:["updated ",e]})})]})}}]),s}(U),I=s(81),H=s(83),V=function(t){Object(b.a)(s,t);var e=Object(p.a)(s);function s(t){var a;return Object(h.a)(this,s),(a=e.call(this,t)).state={selected:"type",rawData:[],isDataFetched:!1,metrics:["serverResponse","firstPaint","domContentLoaded","loaded","firstContentfulPaint","firstBlock","type","focus","listViewOpen","inserterOpen","inserterHover","inserterSearch"]},a}return Object(j.a)(s,[{key:"calcPercent",value:function(t,e){return Math.round(100*(e/t-1)*100)/100}},{key:"prettyTitle",value:function(t){return t.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toUpperCase()}},{key:"prepareChartData",value:function(t){var e={},s=Object.keys(t[t.length-1].baseAvg);t.forEach((function(t){s.forEach((function(s){e[s]||(e[s]=[]);var a=new Date(t.date);a=a.toISOString().split("T")[0],e[s].push({base:t.baseAvg[s],jetpack:t.jetpackAvg[s],date:a})}))}));var a={};return s.forEach((function(t){var s=Object(z.a)(new Set(e[t].map((function(t){return t.date})))).reduce((function(s,a){var r=e[t].filter((function(t){return t.date===a}));return s.push({base:Math.round(r.reduce((function(t,e){return t+e.base}),0)/r.length),jetpack:Math.round(r.reduce((function(t,e){return t+e.jetpack}),0)/r.length),date:a}),s}),[]);a[t]=s})),a}},{key:"componentDidMount",value:function(){var t=Object(R.a)(C.a.mark((function t(){var e=this;return C.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("".concat(f.dataSourceURL,"/data/perf-metrics.json"),{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(t){return t.json()})).then((function(t){e.setState({rawData:t,isDataFetched:!0})})).catch(console.log);case 2:i.a.pageview("performance");case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()},{key:"renderChart",value:function(t,e){var s={grid:{left:60,right:0},title:{text:this.prettyTitle(t),textStyle:{color:"#cccccc",fontSize:"0.9rem"}},tooltip:{trigger:"axis",axisPointer:{type:"cross"}},xAxis:[{type:"category",data:e.map((function(t){return t.date}))}],yAxis:[{type:"value",splitLine:{lineStyle:{type:"dotted",color:"#6b6d76"}}},{type:"value",splitLine:{lineStyle:{type:"dashed",color:"rgba(107,109,118,0.47)"}},min:0,axisLabel:{formatter:"{value} %"}}],dataZoom:[{type:"inside"},{start:50,end:100}],series:[{name:"base",type:"line",emphasis:{focus:"series"},color:"rgb(99,100,138)",data:e.map((function(t){return t.base}))},{name:"jetpack",type:"line",emphasis:{focus:"series"},color:"rgb(99,150,138)",data:e.map((function(t){return t.jetpack}))}]};return Object(g.jsx)(_.a,{option:s,style:{height:"400px",width:"100%"}})}},{key:"onSelect",value:function(t){this.setState({selected:t})}},{key:"renderTypeInfo",value:function(t,e,s){var a=this.calcPercent(s,e);return Object(g.jsxs)(I.a,{style:{justifyContent:"space-between"},children:[Object(g.jsxs)("div",{style:{display:"flex"},children:[Object(g.jsxs)("h5",{children:[t,": ",e," ms."]}),"\xa0from: ",s,"ms."]}),Object(g.jsxs)("span",{children:["\xa0VS previous: ",a,"ms."]})]})}},{key:"renderContainer",value:function(t,e){var s=this,a=e.at(-1),r=e.at(-2);return Object(g.jsxs)(l.a,{className:"perf-button",onClick:function(){return s.onSelect(t)},children:[Object(g.jsx)(I.a,{children:Object(g.jsx)("h4",{children:this.state.selected===t?Object(g.jsx)("u",{children:this.prettyTitle(t)}):this.prettyTitle(t)})}),Object(g.jsx)(I.a,{children:"\xa0"}),this.renderTypeInfo("Base",a.base,r.base),this.renderTypeInfo("Jetpack",a.jetpack,r.jetpack)]})}},{key:"renderButtons",value:function(t){return Object(g.jsxs)(l.a,{fluid:!0,children:[Object(g.jsxs)(I.a,{children:[Object(g.jsx)(H.a,{sm:!0,children:this.renderContainer("type",t.type)}),Object(g.jsx)(H.a,{sm:!0,children:this.renderContainer("loaded",t.loaded)}),Object(g.jsx)(H.a,{sm:!0,children:this.renderContainer("focus",t.focus)})]}),Object(g.jsxs)(I.a,{children:[Object(g.jsx)(H.a,{sm:!0,children:this.renderContainer("inserterOpen",t.inserterOpen)}),Object(g.jsx)(H.a,{sm:!0,children:this.renderContainer("inserterHover",t.inserterHover)}),Object(g.jsx)(H.a,{sm:!0,children:this.renderContainer("inserterSearch",t.inserterSearch)})]})]})}},{key:"render",value:function(){if(!this.state.isDataFetched)return null;var t=this.prepareChartData(this.state.rawData),e=this.state.selected;return Object(g.jsxs)("div",{children:[Object(g.jsx)("h4",{children:"Editor Performance Metrics"}),Object(g.jsx)("p",{children:"This examines block editor performance with and without Jetpack using the Gutenberg performance tests."}),this.renderButtons(t),this.renderChart(e,t[e])]})}}]),s}(r.a.Component);i.a.initialize("UA-208890082-1");var Z=function(){var t="/jetpack-e2e-reports";return Object(g.jsxs)(l.a,{fluid:!0,className:"App",children:[Object(g.jsxs)("div",{className:"App-content",children:[Object(g.jsx)(o.a,{variant:"dark",expand:"md",className:"app-nav-bar",children:Object(g.jsxs)(l.a,{fluid:!0,className:"app-nav-bar-inner-container",children:[Object(g.jsx)(o.a.Brand,{href:"".concat(t,"/#/"),children:"Jetpack test dashboard"}),Object(g.jsx)(o.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(g.jsx)(o.a.Collapse,{id:"basic-navbar-nav",children:Object(g.jsxs)(u.a,{activeKey:location.pathname,className:"ml-auto",children:[Object(g.jsx)(u.a.Link,{href:"".concat(t,"/#/reports"),children:"Reports"}),Object(g.jsx)(u.a.Link,{href:"".concat(t,"/#/charts"),children:"Stats"}),Object(g.jsx)(u.a.Link,{href:"".concat(t,"/#/tests"),children:"Tests"}),Object(g.jsx)(u.a.Link,{href:"".concat(t,"/#/failures"),children:"Failures"}),Object(g.jsx)(u.a.Link,{href:"".concat(t,"/#/performance"),children:"Performance"})]})})]})}),Object(g.jsx)(S.a,{children:Object(g.jsxs)(M.c,{children:[Object(g.jsx)(M.a,{exact:!0,path:"/",element:Object(g.jsx)(w,{})}),Object(g.jsx)(M.a,{exact:!0,path:"/reports",element:Object(g.jsx)(w,{})}),Object(g.jsx)(M.a,{exact:!0,path:"/tests",element:Object(g.jsx)(F,{})}),Object(g.jsx)(M.a,{exact:!0,path:"/failures",element:Object(g.jsx)(J,{})}),Object(g.jsx)(M.a,{exact:!0,path:"/performance",element:Object(g.jsx)(V,{})}),Object(g.jsx)(M.a,{exact:!0,path:"/charts",element:Object(g.jsx)(P,{})})]})})]}),Object(g.jsx)("footer",{className:"App-footer",children:Object(g.jsxs)("div",{children:[Object(g.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/",rel:"noreferrer",children:"Code"})," \u2022 ",Object(g.jsx)("a",{target:"_blank",href:"https://github.com/Automattic/jetpack-e2e-reports/actions",rel:"noreferrer",children:"Actions"})]})})]})};c.a.render(Object(g.jsx)(r.a.StrictMode,{children:Object(g.jsx)(Z,{})}),document.getElementById("root"))},9:function(t){t.exports=JSON.parse('{"permanent":["master","atomic","gutenberg"],"masterRuns":["master","trunk","atomic","gutenberg"],"ignore":["static","e2e","data"],"dataSourceURL":"https://a8c-jetpack-e2e-reports.s3.amazonaws.com"}')}},[[71,1,2]]]);
//# sourceMappingURL=main.dc6de652.chunk.js.map