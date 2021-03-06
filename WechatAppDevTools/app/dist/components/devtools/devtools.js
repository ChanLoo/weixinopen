"use strict";

function init() {
    var e = require("../../lib/react.js"),
        t = require("../../lib/react-dom.js"),
        o = require("../../cssStr/cssStr.js"),
        s = require("../../stores/webviewStores.js"),
        i = require("../../stores/windowStores.js"),
        n = require("./../../common/log/log.js"),
        r = e.createClass({
            displayName: "DevTools",
            hideAllDevtools: function() {
                for (var e = this.refs.container.childNodes, t = 0; t < e.length; t++) e[t].style.cssText = "width:0.1px;height:0.1px"
            },
            _changeWebviewID: function(e) {
                this.hideAllDevtools();
                var o = t.findDOMNode(this.refs.container).querySelector(".devtools" + e);
                o && (o.style.cssText = "height:" + global.contentDocument.querySelector(".debugger").clientHeight + "px")
            },
            _setWebviewInfo: function(e) {
                var t = { width: e.width, height: e.height, dpr: e.dpr };
                this.postMessageToAllDevview("webframe", t, "setEmulate")
            },
            _closeWebviewDevtools: function(e) {
                var o = t.findDOMNode(this.refs.container).querySelector(".devtools" + e);
                o && o.parentNode.removeChild(o)
            },
            _openWebviewDevtools: function(e, t, o) {
                var s = this;
                this.hideAllDevtools();
                var i = this.devtoolsview = document.createElement("webview");
                i.className = "devtools-content devtools" + e, i.setAttribute("partition", "persist:devtools");
                var n = i.getUserAgent() + " webview/" + (1e4 + e) + " chromeRuntimeID/" + chrome.runtime.id;
                i.setUserAgentOverride(n), this.addContentScripts(), this.initRuntime(e), i.addEventListener("contentload", function(t) { s.postMessage(e, { command: "init", msg: { width: o.width, height: o.height, dpr: o.dpr }, to: "webframe" }) }), i.src = "about:blank", this.refs.container.appendChild(i), i.addEventListener("loadcommit", function() { t.showDevTools(!0, i), i.style.height = global.contentDocument.querySelector(".debugger").clientHeight + "px" })
            },
            addContentScripts: function() { this.devtoolsview.addContentScripts([{ name: "myRules", matches: ["<all_urls>"], js: { files: ["app/dist/contentscript/contentScript.js"] }, run_at: "document_start" }]) },
            port: {},
            getWebviewPortName: function(e) {
                return "webview" + (1e4 + e)
            },
            initRuntime: function(e) {
                var t = this;
                chrome.runtime.onConnect.addListener(function(o) {
                    var s = t.getWebviewPortName(e);
                    o.name === s && (n.info("devtools.js chrome.runtime.onConnect.addListener " + s), t.port[e] = o, o.onMessage.addListener(function(o) { t.onMessage(e, o) }), o.onDisconnect.addListener(function() { delete t.port[e] }), t.postMessage(e, { command: "SHAKE_HANDS", to: "contentscript" }))
                })
            },
            onMessage: function(e, t) {
                t = t || {};
                var o = t.type;
                "alert" === o && alert(t.msg);
                var s = t.command;
                "INIT_DEVTOOLS_SUCCESS" === s && i.emit("INIT_DEVTOOLS_SUCCESS" + e)
            },
            msgQuery: {},
            postMessage: function(e, t) {
                var o = this,
                    s = this.port[e];
                return s ? (this.msgQuery[e] && (this.msgQuery.forEach(function(e) { o.port.postMessage(e) }), delete this.msgQuery[e]), void s.postMessage(t)) : (this.msgQuery[e] = [], void this.msgQuery[e].push(t))
            },
            postMessageToAllDevview: function(e, t, o, s) {
                var i = { to: e, msg: t, command: o, ext: s };
                for (var n in this.port) i.webviewID = parseInt(n), this.postMessage(n, i)
            },
            componentDidMount: function() { s.on("CHANGE_WEBVIEW_ID", this._changeWebviewID), i.on("SET_WEBVIEW_INFO", this._setWebviewInfo), i.on("OPEN_WEBVIEW_DEVTOOLS", this._openWebviewDevtools), i.on("CLOSE_WEBVIEW_DEVTOOLS", this._closeWebviewDevtools) },
            componentWillUnmount: function() { s.removeListener("CHANGE_WEBVIEW_ID", this._changeWebviewID), i.removeListener("SET_WEBVIEW_INFO", this._setWebviewInfo), i.removeListener("OPEN_WEBVIEW_DEVTOOLS", this._openWebviewDevtools), i.removeListener("CLOSE_WEBVIEW_DEVTOOLS", this._closeWebviewDevtools) },
            render: function() {
                var t = "devtools" === this.props.show ? { height: "100%" } : o.webviewDisplayNone;
                return e.createElement("div", { style: t, ref: "container", className: "devtools" })
            }
        });
    _exports = r
}
var _exports;
init(), module.exports = _exports;
