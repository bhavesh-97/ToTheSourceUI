import{c as C}from"./chunk-THKDUAJ2.js";import{D as P,J as ne,K as re,b as ee,h as te,ha as se,ka as ae,la as b,m as ie,oa as le,pa as ce,ra as pe,s as oe,sa as de,wa as ue,za as u}from"./chunk-MJRXXN54.js";import{c as he,d as D,f as y,g,h as E}from"./chunk-4O3FVBGX.js";import{k as U,n as X,o as G,s as J,w as v}from"./chunk-OGD6VOHA.js";import{$b as d,Ab as R,Bb as F,Cc as I,Eb as Z,Fb as M,Gb as h,Ia as _,Nc as W,Pc as q,Qc as O,Sb as N,ac as T,bc as j,ha as V,hb as B,ia as A,ib as w,jc as Q,ka as H,ma as l,nb as k,ob as z,oc as f,pc as r,qc as $,qd as m,rc as Y,rd as K,sa as c,sc as S,ta as p,uc as x,vc as L}from"./chunk-257IQEAD.js";var ve=["content"],be=["*"],ye=(i,s)=>({showTransitionParams:i,hideTransitionParams:s}),ge=(i,s)=>({value:i,params:s}),Ce=i=>({closeCallback:i});function _e(i,s){}function we(i,s){i&1&&h(0,_e,0,0,"ng-template")}function ke(i,s){if(i&1){let e=Q();T(0,"div",1),f("click",function(o){c(e);let n=r();return p(n.onOverlayClick(o))})("@animation.start",function(o){c(e);let n=r();return p(n.onAnimationStart(o))})("@animation.done",function(o){c(e);let n=r();return p(n.onAnimationEnd(o))}),T(1,"div",2),f("click",function(o){c(e);let n=r();return p(n.onContentClick(o))})("mousedown",function(o){c(e);let n=r();return p(n.onContentClick(o))}),Y(2),h(3,we,1,0,null,3),j()()}if(i&2){let e=r();I(e.cn(e.cx("root"),e.styleClass)),d("pBind",e.ptm("root"))("ngStyle",e.style)("@animation",O(16,ge,e.overlayVisible?"open":"close",O(13,ye,e.showTransitionOptions,e.hideTransitionOptions))),N("aria-modal",e.overlayVisible)("aria-label",e.ariaLabel)("aria-labelledBy",e.ariaLabelledBy),w(),I(e.cx("content")),d("pBind",e.ptm("content")),w(2),d("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",q(19,Ce,e.onCloseClick.bind(e)))}}var Te=`
.p-popover {
    margin-top: dt('popover.gutter');
    background: dt('popover.background');
    color: dt('popover.color');
    border: 1px solid dt('popover.border.color');
    border-radius: dt('popover.border.radius');
    box-shadow: dt('popover.shadow');
    position: absolute
}

.p-popover-content {
    padding: dt('popover.content.padding');
}

.p-popover-flipped {
    margin-top: calc(dt('popover.gutter') * -1);
    margin-bottom: dt('popover.gutter');
}

.p-popover-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-popover-leave-to {
    opacity: 0;
}

.p-popover-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1), opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-popover-leave-active {
    transition: opacity 0.1s linear;
}

.p-popover:after,
.p-popover:before {
    bottom: 100%;
    left: calc(dt('popover.arrow.offset') + dt('popover.arrow.left'));
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.p-popover:after {
    border-width: calc(dt('popover.gutter') - 2px);
    margin-left: calc(-1 * (dt('popover.gutter') - 2px));
    border-style: solid;
    border-color: transparent;
    border-bottom-color: dt('popover.background');
}

.p-popover:before {
    border-width: dt('popover.gutter');
    margin-left: calc(-1 * dt('popover.gutter'));
    border-style: solid;
    border-color: transparent;
    border-bottom-color: dt('popover.border.color');
}

.p-popover-flipped:after,
.p-popover-flipped:before {
    bottom: auto;
    top: 100%;
}

.p-popover.p-popover-flipped:after {
    border-bottom-color: transparent;
    border-top-color: dt('popover.background');
}

.p-popover.p-popover-flipped:before {
    border-bottom-color: transparent;
    border-top-color: dt('popover.border.color');
}

`,Se={root:"p-popover p-component",content:"p-popover-content"},fe=(()=>{class i extends ce{name="popover";style=Te;classes=Se;static \u0275fac=(()=>{let e;return function(o){return(e||(e=_(i)))(o||i)}})();static \u0275prov=V({token:i,factory:i.\u0275fac})}return i})(),me=new H("POPOVER_INSTANCE"),xe=(()=>{class i extends de{$pcPopover=l(me,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(u,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}ariaLabel;ariaLabelledBy;dismissable=!0;style;styleClass;appendTo="body";autoZIndex=!0;ariaCloseLabel;baseZIndex=0;focusOnShow=!0;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";onShow=new k;onHide=new k;container;overlayVisible=!1;render=!1;isOverlayAnimationInProgress=!1;selfClick=!1;documentClickListener;target;willHide;scrollHandler;documentResizeListener;contentTemplate;templates;_contentTemplate;destroyCallback;overlayEventListener;overlaySubscription;_componentStyle=l(fe);zone=l(z);overlayService=l(se);onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="content"&&(this._contentTemplate=e.template)})}bindDocumentClickListener(){if(v(this.platformId)&&!this.documentClickListener){let e=ne()?"touchstart":"click",t=this.el?this.el.nativeElement.ownerDocument:this.document;this.documentClickListener=this.renderer.listen(t,e,o=>{this.dismissable&&(!this.container?.contains(o.target)&&this.target!==o.target&&!this.target.contains(o.target)&&!this.selfClick&&this.hide(),this.selfClick=!1,this.cd.markForCheck())})}}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null,this.selfClick=!1)}toggle(e,t){this.isOverlayAnimationInProgress||(this.overlayVisible?(this.hasTargetChanged(e,t)&&(this.destroyCallback=()=>{this.show(null,t||e.currentTarget||e.target)}),this.hide()):this.show(e,t))}show(e,t){t&&e&&e.stopPropagation(),!this.isOverlayAnimationInProgress&&(this.target=t||e.currentTarget||e.target,this.overlayVisible=!0,this.render=!0,this.cd.markForCheck())}onOverlayClick(e){this.overlayService.add({originalEvent:e,target:this.el.nativeElement}),this.selfClick=!0}onContentClick(e){let t=e.target;this.selfClick=e.offsetX<t.clientWidth&&e.offsetY<t.clientHeight}hasTargetChanged(e,t){return this.target!=null&&this.target!==(t||e.currentTarget||e.target)}appendContainer(){this.appendTo&&(this.appendTo==="body"?this.renderer.appendChild(this.document.body,this.container):ie(this.appendTo,this.container))}restoreAppend(){this.container&&this.appendTo&&this.renderer.appendChild(this.el.nativeElement,this.container)}align(){this.autoZIndex&&C.set("overlay",this.container,this.baseZIndex+this.config.zIndex.overlay),te(this.container,this.target,!1);let e=P(this.container),t=P(this.target),o=this.document.defaultView?.getComputedStyle(this.container).getPropertyValue("border-radius"),n=0;e.left<t.left&&(n=t.left-e.left-parseFloat(o)*2),this.container?.style.setProperty(le("popover.arrow.left").name,`${n}px`),e.top<t.top&&(this.container?.setAttribute("data-p-popover-flipped","true"),ee(this.container,"p-popover-flipped"))}onAnimationStart(e){e.toState==="open"&&(this.container=e.element,this.container?.setAttribute(this.$attrSelector,""),this.appendContainer(),this.align(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindScrollListener(),this.focusOnShow&&this.focus(),this.overlayEventListener=t=>{this.container&&this.container.contains(t.target)&&(this.selfClick=!0)},this.overlaySubscription=this.overlayService.clickObservable.subscribe(this.overlayEventListener),this.onShow.emit(null)),this.isOverlayAnimationInProgress=!0}onAnimationEnd(e){switch(e.toState){case"void":this.destroyCallback&&(this.destroyCallback(),this.destroyCallback=null),this.overlaySubscription&&this.overlaySubscription.unsubscribe();break;case"close":this.autoZIndex&&C.clear(this.container),this.overlaySubscription&&this.overlaySubscription.unsubscribe(),this.onContainerDestroy(),this.onHide.emit({}),this.render=!1;break}this.isOverlayAnimationInProgress=!1}focus(){let e=oe(this.container,"[autofocus]");e&&this.zone.runOutsideAngular(()=>{setTimeout(()=>e.focus(),5)})}hide(){this.overlayVisible=!1,this.cd.markForCheck()}onCloseClick(e){this.hide(),e.preventDefault()}onEscapeKeydown(e){this.hide()}onWindowResize(){this.overlayVisible&&!re()&&this.hide()}bindDocumentResizeListener(){if(v(this.platformId)&&!this.documentResizeListener){let e=this.document.defaultView;this.documentResizeListener=this.renderer.listen(e,"resize",this.onWindowResize.bind(this))}}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindScrollListener(){v(this.platformId)&&(this.scrollHandler||(this.scrollHandler=new ue(this.target,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener())}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}onContainerDestroy(){this.cd.destroyed||(this.target=null),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindScrollListener()}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.container&&this.autoZIndex&&C.clear(this.container),this.cd.destroyed||(this.target=null),this.destroyCallback=null,this.container&&(this.restoreAppend(),this.onContainerDestroy()),this.overlaySubscription&&this.overlaySubscription.unsubscribe()}static \u0275fac=(()=>{let e;return function(o){return(e||(e=_(i)))(o||i)}})();static \u0275cmp=R({type:i,selectors:[["p-popover"]],contentQueries:function(t,o,n){if(t&1&&(S(n,ve,4),S(n,ae,4)),t&2){let a;x(a=L())&&(o.contentTemplate=a.first),x(a=L())&&(o.templates=a)}},hostBindings:function(t,o){t&1&&f("keydown.escape",function(a){return o.onEscapeKeydown(a)},B)},inputs:{ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",dismissable:[2,"dismissable","dismissable",m],style:"style",styleClass:"styleClass",appendTo:"appendTo",autoZIndex:[2,"autoZIndex","autoZIndex",m],ariaCloseLabel:"ariaCloseLabel",baseZIndex:[2,"baseZIndex","baseZIndex",K],focusOnShow:[2,"focusOnShow","focusOnShow",m],showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions"},outputs:{onShow:"onShow",onHide:"onHide"},features:[W([fe,{provide:me,useExisting:i},{provide:pe,useExisting:i}]),M([u]),Z],ngContentSelectors:be,decls:1,vars:1,consts:[["role","dialog",3,"pBind","class","ngStyle","click",4,"ngIf"],["role","dialog",3,"click","pBind","ngStyle"],[3,"click","mousedown","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(t,o){t&1&&($(),h(0,ke,4,21,"div",0)),t&2&&d("ngIf",o.render)},dependencies:[J,U,G,X,b,u],encapsulation:2,data:{animation:[he("animation",[g("void",y({transform:"scaleY(0.8)",opacity:0})),g("close",y({opacity:0})),g("open",y({transform:"translateY(0)",opacity:1})),E("void => open",D("{{showTransitionParams}}")),E("open => close",D("{{hideTransitionParams}}"))])]},changeDetection:0})}return i})(),Xe=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=F({type:i});static \u0275inj=A({imports:[xe,b,b]})}return i})();export{Xe as a};
