(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{254:function(t,e,n){"use strict";n.r(e);var o=n(0),s=Object(o.a)({},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"network-status"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#network-status","aria-hidden":"true"}},[t._v("#")]),t._v(" Network Status")]),t._v(" "),n("p",[t._v("The "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection",target:"_blank",rel:"noopener noreferrer"}},[t._v("Network Information"),n("OutboundLink")],1),t._v(" is a Web API that provides useful information about the device's connection. To quote from the MDN:")]),t._v(" "),n("blockquote",[n("p",[t._v("containing information about the system's connection, such as the current bandwidth of the user's device or whether the connection is metered. This could be used to select high definition content or low definition content based on the user's connection.")])]),t._v(" "),n("h2",{attrs:{id:"usage"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#usage","aria-hidden":"true"}},[t._v("#")]),t._v(" Usage")]),t._v(" "),n("p",[t._v("You can use the "),n("code",[t._v("useNetworkStatus")]),t._v(" function to gain access to the network information:")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" useNetworkStatus "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'vue-adaptive-utils'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setup")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" info "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("useNetworkStatus")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("p",[t._v("The "),n("code",[t._v("useNetworkStatus")]),t._v(" returns the following properties and methods:")]),t._v(" "),n("div",{staticClass:"custom-block tip"},[n("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),n("p",[t._v("The "),n("strong",[t._v("Ref Type")]),t._v(" column represents the underlying exposed type of the refs. "),n("strong",[t._v("All the exposed Refs are read-only")]),t._v(".")])]),t._v(" "),n("table",[n("thead",[n("tr",[n("th",[t._v("Prop")]),t._v(" "),n("th",[t._v("Ref Type")]),t._v(" "),n("th",[t._v("Fallback Value")]),t._v(" "),n("th",[t._v("Description")])])]),t._v(" "),n("tbody",[n("tr",[n("td",[t._v("isOnline")]),t._v(" "),n("td",[n("code",[t._v("boolean")])]),t._v(" "),n("td",[n("code",[t._v("true")])]),t._v(" "),n("td",[t._v("Wether the device is currently connected or not.")])]),t._v(" "),n("tr",[n("td",[t._v("saveData")]),t._v(" "),n("td",[n("code",[t._v("boolean")])]),t._v(" "),n("td",[n("code",[t._v("false")])]),t._v(" "),n("td",[t._v('Wether the device has the "save data" option enabled or not.')])]),t._v(" "),n("tr",[n("td",[t._v("offlineAt")]),t._v(" "),n("td",[n("code",[t._v("number")])]),t._v(" "),n("td",[n("code",[t._v("undefined")])]),t._v(" "),n("td",[t._v("A timestamp when the user was last disconnected.")])]),t._v(" "),n("tr",[n("td",[t._v("downlink")]),t._v(" "),n("td",[n("code",[t._v("number")])]),t._v(" "),n("td",[n("code",[t._v("undefined")])]),t._v(" "),n("td",[t._v("The average download speed of the connection in megabits per second.")])]),t._v(" "),n("tr",[n("td",[t._v("downlinkMax")]),t._v(" "),n("td",[n("code",[t._v("number")])]),t._v(" "),n("td",[n("code",[t._v("undefined")])]),t._v(" "),n("td",[t._v("The maximum download speed of the connection in megabits per second.")])]),t._v(" "),n("tr",[n("td",[t._v("effectiveConnectionType")]),t._v(" "),n("td",[n("code",[t._v("'slow-2g' | '2g' | '3g' | '4g' | undefined")])]),t._v(" "),n("td",[n("code",[t._v("undefined")])]),t._v(" "),n("td",[t._v("Effective type of the connection.")])]),t._v(" "),n("tr",[n("td",[t._v("networkType")]),t._v(" "),n("td",[n("code",[t._v("'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'")])]),t._v(" "),n("td",[n("code",[t._v("undefined")])]),t._v(" "),n("td",[t._v("type of connection a device is using to communicate with the network.")])]),t._v(" "),n("tr",[n("td",[t._v("isSupported")]),t._v(" "),n("td",[n("code",[t._v("boolean")])]),t._v(" "),n("td",[n("code",[t._v("false")])]),t._v(" "),n("td",[t._v("If the API is supported on this device.")])])])])])},[],!1,null,null,null);e.default=s.exports}}]);