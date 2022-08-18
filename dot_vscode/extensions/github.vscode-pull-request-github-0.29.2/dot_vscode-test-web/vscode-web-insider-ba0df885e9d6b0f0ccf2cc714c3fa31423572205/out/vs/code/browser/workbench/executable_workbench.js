/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/(function(){var U=["vs/code/browser/workbench/workbench","require","exports","vs/workbench/workbench.web.api","vs/base/common/uri","vs/base/common/event","vs/base/common/uuid","vs/base/common/cancellation","vs/base/common/buffer","vs/base/common/lifecycle","vs/base/parts/request/browser/request","vs/platform/windows/common/windows","vs/base/common/resources","vs/base/browser/browser","vs/nls!vs/code/browser/workbench/workbench","vs/base/common/network","vs/platform/product/common/product","vs/platform/log/common/log"],N=function(g){for(var p=[],u=0,l=g.length;u<l;u++)p[u]=U[g[u]];return p};define(U[0],N([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),function(g,p,u,l,S,P,b,Q,_,A,i,O,D,h,v,T,$){"use strict";Object.defineProperty(p,"__esModule",{value:!0});function y(d,t){let e;if(t){let r=0;t.forEach((o,a)=>{e||(e=""),e+=`${r++==0?"":"&"}${a}=${encodeURIComponent(o)}`})}return l.URI.parse(window.location.href).with({path:d,query:e})}class E{constructor(){let t;const e=document.getElementById("vscode-workbench-auth-session"),r=e?e.getAttribute("data-settings"):void 0;if(r)try{t=JSON.parse(r)}catch(o){}t&&(this.setPassword(`${T.default.urlProtocol}.login`,"account",JSON.stringify(t)),this.authService=`${T.default.urlProtocol}-${t.providerId}.login`,this.setPassword(this.authService,"account",JSON.stringify(t.scopes.map(o=>({id:t.id,scopes:o,accessToken:t.accessToken})))))}get credentials(){if(!this._credentials){try{const t=window.localStorage.getItem(E.CREDENTIALS_OPENED_KEY);t&&(this._credentials=JSON.parse(t))}catch(t){}Array.isArray(this._credentials)||(this._credentials=[])}return this._credentials}save(){window.localStorage.setItem(E.CREDENTIALS_OPENED_KEY,JSON.stringify(this.credentials))}async getPassword(t,e){return this.doGetPassword(t,e)}async doGetPassword(t,e){for(const r of this.credentials)if(r.service===t&&(typeof e!="string"||e===r.account))return r.password;return null}async setPassword(t,e,r){this.doDeletePassword(t,e),this.credentials.push({service:t,account:e,password:r}),this.save();try{if(r&&t===this.authService){const o=JSON.parse(r);Array.isArray(o)&&o.length===0&&await this.logout(t)}}catch(o){console.log(o)}}async deletePassword(t,e){const r=await this.doDeletePassword(t,e);if(r&&t===this.authService)try{await this.logout(t)}catch(o){console.log(o)}return r}async doDeletePassword(t,e){let r=!1;return this._credentials=this.credentials.filter(o=>o.service===t&&o.account===e?(r=!0,!1):!0),r&&this.save(),r}async findPassword(t){return this.doGetPassword(t)}async findCredentials(t){return this.credentials.filter(e=>e.service===t).map(({account:e,password:r})=>({account:e,password:r}))}async logout(t){const e=new Map;e.set("logout",String(!0)),e.set("service",t),await(0,A.request)({url:y("/auth/logout",e).toString(!0)},b.CancellationToken.None)}}E.CREDENTIALS_OPENED_KEY="credentials.provider";class s extends _.Disposable{constructor(){super(...arguments);this._onCallback=this._register(new S.Emitter),this.onCallback=this._onCallback.event}create(t){const e=new Map,r=(0,P.generateUuid)();e.set(s.QUERY_KEYS.REQUEST_ID,r);const{scheme:o,authority:a,path:c,query:w,fragment:m}=t||{scheme:void 0,authority:void 0,path:void 0,query:void 0,fragment:void 0};return o&&e.set(s.QUERY_KEYS.SCHEME,o),a&&e.set(s.QUERY_KEYS.AUTHORITY,a),c&&e.set(s.QUERY_KEYS.PATH,c),w&&e.set(s.QUERY_KEYS.QUERY,w),m&&e.set(s.QUERY_KEYS.FRAGMENT,m),this.periodicFetchCallback(r,Date.now()),y("/callback",e)}async periodicFetchCallback(t,e){const r=new Map;r.set(s.QUERY_KEYS.REQUEST_ID,t);const o=await(0,A.request)({url:y("/fetch-callback",r).toString(!0)},b.CancellationToken.None),a=await(0,Q.streamToBuffer)(o.stream);if(a.byteLength>0){try{this._onCallback.fire(l.URI.revive(JSON.parse(a.toString())))}catch(c){console.error(c)}return}Date.now()-e<s.FETCH_TIMEOUT&&setTimeout(()=>this.periodicFetchCallback(t,e),s.FETCH_INTERVAL)}}s.FETCH_INTERVAL=500,s.FETCH_TIMEOUT=5*60*1e3,s.QUERY_KEYS={REQUEST_ID:"vscode-requestId",SCHEME:"vscode-scheme",AUTHORITY:"vscode-authority",PATH:"vscode-path",QUERY:"vscode-query",FRAGMENT:"vscode-fragment"};class n{constructor(t,e){this.workspace=t,this.payload=e,this.trusted=!0}async open(t,e){if(e?.reuse&&!e.payload&&this.isSame(this.workspace,t))return!0;const r=this.createTargetUrl(t,e);if(r){if(e?.reuse)return window.location.href=r,!0;{let o;return D.isStandalone?o=window.open(r,"_blank","toolbar=no"):o=window.open(r),!!o}}return!1}createTargetUrl(t,e){let r;return t?(0,i.isFolderToOpen)(t)?r=`${document.location.origin}${document.location.pathname}?${n.QUERY_PARAM_FOLDER}=${encodeURIComponent(t.folderUri.toString())}`:(0,i.isWorkspaceToOpen)(t)&&(r=`${document.location.origin}${document.location.pathname}?${n.QUERY_PARAM_WORKSPACE}=${encodeURIComponent(t.workspaceUri.toString())}`):r=`${document.location.origin}${document.location.pathname}?${n.QUERY_PARAM_EMPTY_WINDOW}=true`,e?.payload&&(r+=`&${n.QUERY_PARAM_PAYLOAD}=${encodeURIComponent(JSON.stringify(e.payload))}`),r}isSame(t,e){return!t||!e?t===e:(0,i.isFolderToOpen)(t)&&(0,i.isFolderToOpen)(e)?(0,O.isEqual)(t.folderUri,e.folderUri):(0,i.isWorkspaceToOpen)(t)&&(0,i.isWorkspaceToOpen)(e)?(0,O.isEqual)(t.workspaceUri,e.workspaceUri):!1}hasRemote(){if(this.workspace){if((0,i.isFolderToOpen)(this.workspace))return this.workspace.folderUri.scheme===v.Schemas.vscodeRemote;if((0,i.isWorkspaceToOpen)(this.workspace))return this.workspace.workspaceUri.scheme===v.Schemas.vscodeRemote}return!0}}n.QUERY_PARAM_EMPTY_WINDOW="ew",n.QUERY_PARAM_FOLDER="folder",n.QUERY_PARAM_WORKSPACE="workspace",n.QUERY_PARAM_PAYLOAD="payload";class k{constructor(t){this.onDidChange=S.Event.None;let e,r;if(t){let o;(0,i.isFolderToOpen)(t)?o=t.folderUri:(0,i.isWorkspaceToOpen)(t)&&(o=t.workspaceUri),(o?.scheme==="github"||o?.scheme==="codespace")&&([e,r]=o.authority.split("+"))}r&&e?(this.label=(0,h.localize)(0,null,e,r),this.tooltip=(0,h.localize)(1,null,e,r)):(this.label=(0,h.localize)(2,null),this.tooltip=(0,h.localize)(3,null))}}(function(){const d=document.getElementById("vscode-workbench-web-configuration"),t=d?d.getAttribute("data-settings"):void 0;if(!d||!t)throw new Error("Missing web configuration element");const e=JSON.parse(t);let r=!1,o,a=Object.create(null),c;new URL(document.location.href).searchParams.forEach((f,R)=>{switch(R){case n.QUERY_PARAM_FOLDER:o={folderUri:l.URI.parse(f)},r=!0;break;case n.QUERY_PARAM_WORKSPACE:o={workspaceUri:l.URI.parse(f)},r=!0;break;case n.QUERY_PARAM_EMPTY_WINDOW:o=void 0,r=!0;break;case n.QUERY_PARAM_PAYLOAD:try{a=JSON.parse(f)}catch(I){console.error(I)}break;case"logLevel":c=f;break}}),r||(e.folderUri?o={folderUri:l.URI.revive(e.folderUri)}:e.workspaceUri?o={workspaceUri:l.URI.revive(e.workspaceUri)}:o=void 0);const m=new n(o,a),C={href:"https://github.com/microsoft/vscode",icon:"code",title:(0,h.localize)(4,null)};let Y;m.hasRemote()||(Y=new k(o));const q=f=>{let R=`quality=${f}`;new URL(document.location.href).searchParams.forEach((K,M)=>{M!=="quality"&&(R+=`&${M}=${K}`)}),window.location.href=`${window.location.origin}?${R}`},F=e.settingsSyncOptions?{enabled:e.settingsSyncOptions.enabled}:void 0;(0,u.create)(document.body,{...e,developmentOptions:{logLevel:c?(0,$.parseLogLevel)(c):void 0,...e.developmentOptions},settingsSyncOptions:F,homeIndicator:C,windowIndicator:Y,productQualityChangeHandler:q,workspaceProvider:m,urlCallbackProvider:new s,credentialsProvider:new E})})()})}).call(this);

//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ba0df885e9d6b0f0ccf2cc714c3fa31423572205/core/vs/code/browser/workbench/workbench.js.map