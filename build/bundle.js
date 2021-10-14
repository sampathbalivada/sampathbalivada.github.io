var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function i(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function u(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function d(){return f(" ")}function p(){return f("")}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let g;function m(t){g=t}const $=[],b=[],v=[],w=[],y=Promise.resolve();let _=!1;function k(t){v.push(t)}let x=!1;const j=new Set;function z(){if(!x){x=!0;do{for(let t=0;t<$.length;t+=1){const e=$[t];m(e),C(e.$$)}for(m(null),$.length=0;b.length;)b.pop()();for(let t=0;t<v.length;t+=1){const e=v[t];j.has(e)||(j.add(e),e())}v.length=0}while($.length);for(;w.length;)w.pop()();_=!1,x=!1,j.clear()}}function C(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(k)}}const T=new Set;function A(t,e){t&&t.i&&(T.delete(t),t.i(e))}function E(t,e,n,o){if(t&&t.o){if(T.has(t))return;T.add(t),undefined.c.push((()=>{T.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function L(t){t&&t.c()}function S(t,n,s,l){const{fragment:a,on_mount:c,on_destroy:i,after_update:u}=t.$$;a&&a.m(n,s),l||k((()=>{const n=c.map(e).filter(r);i?i.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(k)}function M(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function N(t,e){-1===t.$$.dirty[0]&&($.push(t),_||(_=!0,y.then(z)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function O(e,r,s,l,a,i,u,f=[-1]){const d=g;m(e);const p=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:a,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(d?d.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:r.target||d.$$.root};u&&u(p.root);let h=!1;if(p.ctx=s?s(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return p.ctx&&a(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),h&&N(e,t)),n})):[],p.update(),h=!0,o(p.before_update),p.fragment=!!l&&l(p.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);p.fragment&&p.fragment.l(t),t.forEach(c)}else p.fragment&&p.fragment.c();r.intro&&A(e.$$.fragment),S(e,r.target,r.anchor,r.customElement),z()}m(d)}class H{$destroy(){M(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function q(e){let n;return{c(){n=u("div"),n.innerHTML='<h1 class="svelte-ocjpw0">sampath balivada</h1> \n    <h6 class="svelte-ocjpw0">Cloud Support Associate at Amazon Web Services</h6> \n    <h6 class="svelte-ocjpw0"><a href="https://twitter.com/sampathbalivada" target="_blank">twitter</a>    \n        <a href="https://linkedin.com/in/sampathbalivada" target="_blank">linkedin</a>    \n        <a href="https://github.com/sampathbalivada" target="_blank">github</a></h6>',h(n,"class","header svelte-ocjpw0")},m(t,e){a(t,n,e)},p:t,i:t,o:t,d(t){t&&c(n)}}}class P extends H{constructor(t){super(),O(this,t,null,q,s,{})}}function B(e){let n;return{c(){n=u("footer"),n.innerHTML='<h6 class="svelte-1klfmfe">languages, tools, frameworks and technologies I worked with: <br/> \n        <strong>python, c, c++, java, golang, amazon redshift, dart, flutter, svelte, react, nodejs, lambda, ec2</strong>  <br/>\n        and more, in no specific order.</h6>',h(n,"class","footer")},m(t,e){a(t,n,e)},p:t,i:t,o:t,d(t){t&&c(n)}}}class I extends H{constructor(t){super(),O(this,t,null,B,s,{})}}function J(e){let n;return{c(){n=u("div"),n.innerHTML='<p class="svelte-egeznk">building<br/>experiences<br/>is my ikigai</p>',h(n,"class","svelte-egeznk")},m(t,e){a(t,n,e)},p:t,i:t,o:t,d(t){t&&c(n)}}}class W extends H{constructor(t){super(),O(this,t,null,J,s,{})}}function D(t,e,n){const o=t.slice();return o[1]=e[n],o[5]=n,o}function F(t,e,n){const o=t.slice();return o[1]=e[n],o}function G(t){let e,n=t[0].slice(0,3),o=[];for(let e=0;e<n.length;e+=1)o[e]=Q(D(t,n,e));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=p()},m(t,n){for(let e=0;e<o.length;e+=1)o[e].m(t,n);a(t,e,n)},p(t,r){if(1&r){let s;for(n=t[0].slice(0,3),s=0;s<n.length;s+=1){const l=D(t,n,s);o[s]?o[s].p(l,r):(o[s]=Q(l),o[s].c(),o[s].m(e.parentNode,e))}for(;s<o.length;s+=1)o[s].d(1);o.length=n.length}},d(t){i(o,t),t&&c(e)}}}function K(e){let n,o=[1,2,3],r=[];for(let t=0;t<3;t+=1)r[t]=R(F(e,o,t));return{c(){for(let t=0;t<3;t+=1)r[t].c();n=p()},m(t,e){for(let n=0;n<3;n+=1)r[n].m(t,e);a(t,n,e)},p:t,d(t){i(r,t),t&&c(n)}}}function Q(t){let e,n,o,r,s,i,p,g=t[1].title.toLowerCase()+"";return{c(){e=u("p"),n=u("a"),o=f("> "),r=f(g),p=d(),h(n,"href",s="https://sampath.dev/"+t[1].slug),h(n,"target","_blank"),h(n,"class",i="blog-post "+(0==t[5]?"first":"")+" svelte-zwdstr"),h(e,"class","svelte-zwdstr")},m(t,s){a(t,e,s),l(e,n),l(n,o),l(n,r),l(e,p)},p(t,e){1&e&&g!==(g=t[1].title.toLowerCase()+"")&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(r,g),1&e&&s!==(s="https://sampath.dev/"+t[1].slug)&&h(n,"href",s)},d(t){t&&c(e)}}}function R(t){let e;return{c(){e=u("p"),e.innerHTML='<a href="." target="." class="blog-post svelte-zwdstr">loading...</a> \n            ',h(e,"class","svelte-zwdstr")},m(t,n){a(t,e,n)},d(t){t&&c(e)}}}function U(e){let n,o,r,s,i;function f(t,e){return 0==t[0].length?K:G}let p=f(e),g=p(e);return{c(){n=u("div"),o=u("p"),o.textContent="latest blog posts:",r=d(),g.c(),s=d(),i=u("a"),i.textContent="view all blog posts",h(o,"class","subtitle svelte-zwdstr"),h(i,"href","https://blog.sampath.dev"),h(i,"target","_blank"),h(i,"class","blog-link svelte-zwdstr"),h(n,"class","svelte-zwdstr")},m(t,e){a(t,n,e),l(n,o),l(n,r),g.m(n,null),l(n,s),l(n,i)},p(t,[e]){p===(p=f(t))&&g?g.p(t,e):(g.d(1),g=p(t),g&&(g.c(),g.m(n,s)))},i:t,o:t,d(t){t&&c(n),g.d()}}}function V(t,e,n){let o=[];return fetch("https://api.hashnode.com/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:'{\n                        user(username: "sampathbalivada") {\n                            publication {\n                                posts(page: 0) {\n                                    title\n                                    slug\n                                }\n                            }\n                        }\n                    }'})}).then((t=>t.json())).then((t=>{n(0,o=t.data.user.publication.posts)})),[o]}class X extends H{constructor(t){super(),O(this,t,V,U,s,{})}}function Y(e){let n,o,r,s,i,f,p,g,m,$,b,v;return o=new P({}),f=new W({}),m=new X({}),b=new I({}),{c(){n=u("main"),L(o.$$.fragment),r=d(),s=u("span"),i=u("div"),L(f.$$.fragment),p=d(),g=u("div"),L(m.$$.fragment),$=d(),L(b.$$.fragment),h(i,"class","svelte-1daebil"),h(g,"class","svelte-1daebil"),h(s,"class","svelte-1daebil"),h(n,"class","svelte-1daebil")},m(t,e){a(t,n,e),S(o,n,null),l(n,r),l(n,s),l(s,i),S(f,i,null),l(s,p),l(s,g),S(m,g,null),l(n,$),S(b,n,null),v=!0},p:t,i(t){v||(A(o.$$.fragment,t),A(f.$$.fragment,t),A(m.$$.fragment,t),A(b.$$.fragment,t),v=!0)},o(t){E(o.$$.fragment,t),E(f.$$.fragment,t),E(m.$$.fragment,t),E(b.$$.fragment,t),v=!1},d(t){t&&c(n),M(o),M(f),M(m),M(b)}}}return new class extends H{constructor(t){super(),O(this,t,null,Y,s,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
