import{a as qt,c as Wt,d as Zt}from"./chunk-JEGCUGGH.js";import{a as He,c as tt}from"./chunk-4I27SPXQ.js";import{Aa as _e,C as zt,Da as jt,Ea as he,Fa as Kt,G as Le,Ga as et,I as ct,K as Me,N as Dt,P as dt,Q as Bt,R as Ue,S as Be,T as At,V as pt,Z as Nt,aa as Ye,b as at,c as kt,fa as Rt,ha as Pt,ka as Te,l as Ft,la as P,ma as Je,pa as te,ra as Y,s as xe,sa as ue,t as ce,ta as Xe,va as Ht,w as Lt,wa as Qt,x as Mt,xa as $t,y as Fe,za as x}from"./chunk-PF6WOQSH.js";import{c as Gt,d as ut,f as ht,h as mt,i as ft,k as gt}from"./chunk-4O3FVBGX.js";import{a as it}from"./chunk-ZLV36PMH.js";import{j as Ze,k as ke,n as Re,o as ge,s as U,w as Pe}from"./chunk-QI6ZTOCK.js";import{$b as g,Ab as O,Ac as m,Bb as ee,Bc as fe,Cb as d,Cc as Ve,Da as ye,Dc as rt,Eb as V,Fb as ze,Fc as wt,Gc as St,Hc as Ot,Ia as b,Lc as W,Mc as We,Nc as F,Oc as Ie,Pc as Et,Rb as xt,Sb as R,Tb as Oe,Ub as Ee,Zb as s,Zc as Z,_b as f,a as oe,ac as q,b as Ae,bc as lt,cc as st,cd as pe,dc as re,dd as Vt,ec as B,fc as A,ga as Ke,gc as k,gd as z,ha as X,hc as $,ia as le,ib as c,ic as Tt,ka as G,ma as w,mc as N,nc as a,oc as ve,od as v,pb as be,pc as Ce,pd as De,qc as _,rc as j,sa as C,sc as u,ta as I,tc as h,ua as H,wb as M,wc as ae,xb as se,xc as qe,yb as Ge,zc as Ne}from"./chunk-Z3EUQJTI.js";var Ut=`
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;var Oi=["*"],Ei={root:({instance:t})=>["p-iconfield",{"p-iconfield-left":t.iconPosition=="left","p-iconfield-right":t.iconPosition=="right"}]},Yt=(()=>{class t extends te{name="iconfield";style=Ut;classes=Ei;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})();var Jt=new G("ICONFIELD_INSTANCE"),_t=(()=>{class t extends ue{hostName="";_componentStyle=w(Yt);$pcIconField=w(Jt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=w(x,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}iconPosition="left";styleClass;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(i,n){i&2&&m(n.cn(n.cx("root"),n.styleClass))},inputs:{hostName:"hostName",iconPosition:"iconPosition",styleClass:"styleClass"},features:[W([Yt,{provide:Jt,useExisting:t},{provide:Y,useExisting:t}]),ee([x]),O],ngContentSelectors:Oi,decls:1,vars:0,template:function(i,n){i&1&&(ve(),Ce(0))},dependencies:[U,_e],encapsulation:2,changeDetection:0})}return t})(),Ll=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=se({type:t});static \u0275inj=le({imports:[_t]})}return t})();var Vi=["*"],ki={root:"p-inputicon"},Xt=(()=>{class t extends te{name="inputicon";classes=ki;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})(),ei=new G("INPUTICON_INSTANCE"),yt=(()=>{class t extends ue{hostName="";styleClass;_componentStyle=w(Xt);$pcInputIcon=w(ei,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=w(x,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(i,n){i&2&&m(n.cn(n.cx("root"),n.styleClass))},inputs:{hostName:"hostName",styleClass:"styleClass"},features:[W([Xt,{provide:ei,useExisting:t},{provide:Y,useExisting:t}]),ee([x]),O],ngContentSelectors:Vi,decls:1,vars:0,template:function(i,n){i&1&&(ve(),Ce(0))},dependencies:[U,P,_e],encapsulation:2,changeDetection:0})}return t})(),Gl=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=se({type:t});static \u0275inj=le({imports:[yt,P,P]})}return t})();var nt=(()=>{class t extends Wt{required=z(void 0,{transform:v});invalid=z(void 0,{transform:v});disabled=z(void 0,{transform:v});name=z();_disabled=ye(!1);$disabled=pe(()=>this.disabled()||this._disabled());onModelChange=()=>{};onModelTouched=()=>{};writeDisabledState(e){this._disabled.set(e)}writeControlValue(e,i){}writeValue(e){this.writeControlValue(e,this.writeModelValue.bind(this))}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.writeDisabledState(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275dir=Ge({type:t,inputs:{required:[1,"required"],invalid:[1,"invalid"],disabled:[1,"disabled"],name:[1,"name"]},features:[O]})}return t})();var ti=(()=>{class t extends nt{pcFluid=w(jt,{optional:!0,host:!0,skipSelf:!0});fluid=z(void 0,{transform:v});variant=z();size=z();inputSize=z();pattern=z();min=z();max=z();step=z();minlength=z();maxlength=z();$variant=pe(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275dir=Ge({type:t,inputs:{fluid:[1,"fluid"],variant:[1,"variant"],size:[1,"size"],inputSize:[1,"inputSize"],pattern:[1,"pattern"],min:[1,"min"],max:[1,"max"],step:[1,"step"],minlength:[1,"minlength"],maxlength:[1,"maxlength"]},features:[O]})}return t})();var Fi=["data-p-icon","blank"],ii=(()=>{class t extends he{static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["","data-p-icon","blank"]],features:[O],attrs:Fi,decls:1,vars:0,consts:[["width","1","height","1","fill","currentColor","fill-opacity","0"]],template:function(i,n){i&1&&(H(),re(0,"rect",0))},encapsulation:2})}return t})();var Li=["data-p-icon","check"],ni=(()=>{class t extends he{static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["","data-p-icon","check"]],features:[O],attrs:Li,decls:1,vars:0,consts:[["d","M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z","fill","currentColor"]],template:function(i,n){i&1&&(H(),re(0,"path",0))},encapsulation:2})}return t})();var Mi=["data-p-icon","chevron-down"],oi=(()=>{class t extends he{static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["","data-p-icon","chevron-down"]],features:[O],attrs:Mi,decls:1,vars:0,consts:[["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(i,n){i&1&&(H(),re(0,"path",0))},encapsulation:2})}return t})();var zi=["data-p-icon","search"],li=(()=>{class t extends he{pathId;onInit(){this.pathId="url(#"+Ye()+")"}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["","data-p-icon","search"]],features:[O],attrs:zi,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,n){i&1&&(H(),lt(0,"g"),re(1,"path",0),st(),lt(2,"defs")(3,"clipPath",1),re(4,"rect",2),st()()),i&2&&(R("clip-path",n.pathId),c(3),Tt("id",n.pathId))},encapsulation:2})}return t})();var Di=["data-p-icon","times"],si=(()=>{class t extends he{static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["","data-p-icon","times"]],features:[O],attrs:Di,decls:1,vars:0,consts:[["d","M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z","fill","currentColor"]],template:function(i,n){i&1&&(H(),re(0,"path",0))},encapsulation:2})}return t})();var ri=["content"],Ai=["overlay"],Ni=["*"],Ri=(t,r,e)=>({showTransitionParams:t,hideTransitionParams:r,transform:e}),Pi=t=>({value:"visible",params:t}),Hi=t=>({mode:t}),Qi=t=>({$implicit:t});function $i(t,r){t&1&&k(0)}function ji(t,r){if(t&1){let e=$();f(0,"div",3,1),N("click",function(n){C(e);let o=a(2);return I(o.onOverlayContentClick(n))})("@overlayContentAnimation.start",function(n){C(e);let o=a(2);return I(o.onOverlayContentAnimationStart(n))})("@overlayContentAnimation.done",function(n){C(e);let o=a(2);return I(o.onOverlayContentAnimationDone(n))}),Ce(2),d(3,$i,1,0,"ng-container",4),g()}if(t&2){let e=a(2);m(e.cn(e.cx("content"),e.contentStyleClass)),s("pBind",e.ptm("content"))("@overlayContentAnimation",F(10,Pi,Et(6,Ri,e.showTransitionOptions,e.hideTransitionOptions,e.transformOptions[e.modal?e.overlayResponsiveDirection:"default"]))),c(3),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",F(14,Qi,F(12,Hi,e.overlayMode)))}}function Ki(t,r){if(t&1){let e=$();f(0,"div",3,0),N("click",function(){C(e);let n=a();return I(n.onOverlayClick())}),d(2,ji,4,16,"div",2),g()}if(t&2){let e=a();m(e.cn(e.cx("root"),e.styleClass)),s("pBind",e.ptm("root")),c(2),s("ngIf",e.visible)}}var Gi=`
.p-overlay {
    position: absolute;
    top: 0;
}

.p-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-content {
    transform-origin: inherit;
}

/* Github Issue #18560 */
.p-component-overlay.p-component {
    position: relative;
}

.p-overlay-modal > .p-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.p-overlay-top {
    align-items: flex-start;
}
.p-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.p-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.p-overlay-bottom {
    align-items: flex-end;
}
.p-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.p-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.p-overlay-left {
    justify-content: flex-start;
}
.p-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.p-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.p-overlay-right {
    justify-content: flex-end;
}
.p-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.p-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}

.p-overlay-content ~ .p-overlay-content {
    display: none;
}
`,qi={host:"p-overlay-host",root:({instance:t})=>["p-overlay p-component",{"p-overlay-modal p-overlay-mask p-overlay-mask-enter":t.modal,"p-overlay-center":t.modal&&t.overlayResponsiveDirection==="center","p-overlay-top":t.modal&&t.overlayResponsiveDirection==="top","p-overlay-top-start":t.modal&&t.overlayResponsiveDirection==="top-start","p-overlay-top-end":t.modal&&t.overlayResponsiveDirection==="top-end","p-overlay-bottom":t.modal&&t.overlayResponsiveDirection==="bottom","p-overlay-bottom-start":t.modal&&t.overlayResponsiveDirection==="bottom-start","p-overlay-bottom-end":t.modal&&t.overlayResponsiveDirection==="bottom-end","p-overlay-left":t.modal&&t.overlayResponsiveDirection==="left","p-overlay-left-start":t.modal&&t.overlayResponsiveDirection==="left-start","p-overlay-left-end":t.modal&&t.overlayResponsiveDirection==="left-end","p-overlay-right":t.modal&&t.overlayResponsiveDirection==="right","p-overlay-right-start":t.modal&&t.overlayResponsiveDirection==="right-start","p-overlay-right-end":t.modal&&t.overlayResponsiveDirection==="right-end"}],content:"p-overlay-content"},ai=(()=>{class t extends te{name="overlay";style=Gi;classes=qi;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})(),ci=new G("OVERLAY_INSTANCE"),Wi=ft([ht({transform:"{{transform}}",opacity:0}),ut("{{showTransitionParams}}")]),Zi=ft([ut("{{hideTransitionParams}}",ht({transform:"{{transform}}",opacity:0}))]),di=(()=>{class t extends ue{overlayService;zone;$pcOverlay=w(ci,{optional:!0,skipSelf:!0})??void 0;hostName="";get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e}get style(){return He.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e}get styleClass(){return He.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e}get contentStyle(){return He.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e}get contentStyleClass(){return He.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e}get target(){let e=this._target||this.overlayOptions?.target;return e===void 0?"@prev":e}set target(e){this._target=e}get autoZIndex(){let e=this._autoZIndex||this.overlayOptions?.autoZIndex;return e===void 0?!0:e}set autoZIndex(e){this._autoZIndex=e}get baseZIndex(){let e=this._baseZIndex||this.overlayOptions?.baseZIndex;return e===void 0?0:e}set baseZIndex(e){this._baseZIndex=e}get showTransitionOptions(){let e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return e===void 0?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e}get hideTransitionOptions(){let e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return e===void 0?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e}get options(){return this._options}set options(e){this._options=e}appendTo=z(void 0);visibleChange=new V;onBeforeShow=new V;onShow=new V;onBeforeHide=new V;onHide=new V;onAnimationStart=new V;onAnimationDone=new V;overlayViewChild;contentViewChild;contentTemplate;templates;hostAttrSelector=z();$appendTo=pe(()=>this.appendTo()||this.config.overlayAppendTo());_contentTemplate;_visible=!1;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=!1;isOverlayClicked=!1;isOverlayContentClicked=!1;scrollHandler;documentClickListener;documentResizeListener;_componentStyle=w(ai);bindDirectiveInstance=w(x,{self:!0});documentKeyboardListener;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if(Pe(this.platformId))return this.mode==="modal"||this.overlayResponsiveOptions&&this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return oe(oe({},this.config?.overlayOptions),this.options)}get overlayResponsiveOptions(){return oe(oe({},this.overlayOptions?.responsive),this.responsive)}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return Ft(this.target,this.el?.nativeElement)}constructor(e,i){super(),this.overlayService=e,this.zone=i}onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}show(e,i=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&ce(this.targetEl),this.modal&&at(this.document?.body,"p-overflow-hidden")}hide(e,i=!1){if(this.visible)this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&ce(this.targetEl),this.modal&&kt(this.document?.body,"p-overflow-hidden");else return}alignOverlay(){!this.modal&&Xe.alignOverlay(this.overlayEl,this.targetEl,this.$appendTo())}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e)}onOverlayClick(){this.isOverlayClicked=!0}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=!0}onOverlayContentAnimationStart(e){switch(e.toState){case"visible":this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.autoZIndex&&tt.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]),this.hostAttrSelector()&&this.overlayEl&&this.overlayEl.setAttribute(this.hostAttrSelector(),""),Xe.appendOverlay(this.overlayEl,this.$appendTo()==="body"?this.document.body:this.$appendTo(),this.$appendTo()),this.alignOverlay();break;case"void":this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.modal&&at(this.overlayEl,"p-overlay-mask-leave");break}this.handleEvents("onAnimationStart",e)}onOverlayContentAnimationDone(e){let i=this.overlayEl||e.element.parentElement;switch(e.toState){case"visible":this.visible&&(this.show(i,!0),this.bindListeners());break;case"void":if(!this.visible){this.hide(i,!0),this.modalVisible=!1,this.unbindListeners(),Xe.appendOverlay(this.overlayEl,this.targetEl,this.$appendTo()),tt.clear(i),this.cd.markForCheck();break}}this.handleEvents("onAnimationDone",e)}handleEvents(e,i){this[e].emit(i),this.options&&this.options[e]&&this.options[e](i),this.config?.overlayOptions&&(this.config?.overlayOptions)[e]&&(this.config?.overlayOptions)[e](i)}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new Qt(this.targetEl,e=>{(this.listener?this.listener(e,{type:"scroll",mode:this.overlayMode,valid:!0}):!0)&&this.hide(e,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{let n=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target)))&&!this.isOverlayContentClicked;(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:e.which!==3&&n}):n)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!Me()}):!Me())&&this.hide(e,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.document.defaultView,"keydown",e=>{if(this.overlayOptions.hideOnEscape===!1||e.code!=="Escape")return;(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!Me()}):!Me())&&this.zone.run(()=>{this.hide(e,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}onDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&this.$appendTo()!=="self"&&(this.renderer.appendChild(this.el.nativeElement,this.overlayEl),tt.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners()}static \u0275fac=function(i){return new(i||t)(be(Pt),be(ze))};static \u0275cmp=M({type:t,selectors:[["p-overlay"]],contentQueries:function(i,n,o){if(i&1&&(_(o,ri,4),_(o,Te,4)),i&2){let l;u(l=h())&&(n.contentTemplate=l.first),u(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(j(Ai,5),j(ri,5)),i&2){let o;u(o=h())&&(n.overlayViewChild=o.first),u(o=h())&&(n.contentViewChild=o.first)}},inputs:{hostName:"hostName",visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options",appendTo:[1,"appendTo"],hostAttrSelector:[1,"hostAttrSelector"]},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone"},features:[W([ai,{provide:ci,useExisting:t},{provide:Y,useExisting:t}]),ee([x]),O],ngContentSelectors:Ni,decls:1,vars:1,consts:[["overlay",""],["content",""],[3,"class","pBind","click",4,"ngIf"],[3,"click","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,n){i&1&&(ve(),d(0,Ki,3,4,"div",2)),i&2&&s("ngIf",n.modalVisible)},dependencies:[U,ke,ge,P,x],encapsulation:2,data:{animation:[Gt("overlayContentAnimation",[mt(":enter",[gt(Wi)]),mt(":leave",[gt(Zi)])])]},changeDetection:0})}return t})();var pi=["content"],Ui=["item"],Yi=["loader"],Ji=["loadericon"],Xi=["element"],en=["*"],vt=(t,r)=>({$implicit:t,options:r}),tn=t=>({numCols:t}),mi=t=>({options:t}),nn=()=>({styleClass:"p-virtualscroller-loading-icon"}),on=(t,r)=>({rows:t,columns:r});function ln(t,r){t&1&&k(0)}function sn(t,r){if(t&1&&(B(0),d(1,ln,1,0,"ng-container",10),A()),t&2){let e=a(2);c(),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Ie(2,vt,e.loadedItems,e.getContentOptions()))}}function rn(t,r){t&1&&k(0)}function an(t,r){if(t&1&&(B(0),d(1,rn,1,0,"ng-container",10),A()),t&2){let e=r.$implicit,i=r.index,n=a(3);c(),s("ngTemplateOutlet",n.itemTemplate||n._itemTemplate)("ngTemplateOutletContext",Ie(2,vt,e,n.getOptions(i)))}}function cn(t,r){if(t&1&&(f(0,"div",11,3),d(2,an,2,5,"ng-container",12),g()),t&2){let e=a(2);Ne(e.contentStyle),m(e.cn(e.cx("content"),e.contentStyleClass)),s("pBind",e.ptm("content")),c(2),s("ngForOf",e.loadedItems)("ngForTrackBy",e._trackBy)}}function dn(t,r){if(t&1&&q(0,"div",13),t&2){let e=a(2);m(e.cx("spacer")),s("ngStyle",e.spacerStyle)("pBind",e.ptm("spacer"))}}function pn(t,r){t&1&&k(0)}function un(t,r){if(t&1&&(B(0),d(1,pn,1,0,"ng-container",10),A()),t&2){let e=r.index,i=a(4);c(),s("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",F(4,mi,i.getLoaderOptions(e,i.both&&F(2,tn,i.numItemsInViewport.cols))))}}function hn(t,r){if(t&1&&(B(0),d(1,un,2,6,"ng-container",14),A()),t&2){let e=a(3);c(),s("ngForOf",e.loaderArr)}}function mn(t,r){t&1&&k(0)}function fn(t,r){if(t&1&&(B(0),d(1,mn,1,0,"ng-container",10),A()),t&2){let e=a(4);c(),s("ngTemplateOutlet",e.loaderIconTemplate||e._loaderIconTemplate)("ngTemplateOutletContext",F(3,mi,We(2,nn)))}}function gn(t,r){if(t&1&&(H(),q(0,"svg",15)),t&2){let e=a(4);m(e.cx("loadingIcon")),s("spin",!0)("pBind",e.ptm("loadingIcon"))}}function _n(t,r){if(t&1&&d(0,fn,2,5,"ng-container",6)(1,gn,1,4,"ng-template",null,5,Z),t&2){let e=ae(2),i=a(3);s("ngIf",i.loaderIconTemplate||i._loaderIconTemplate)("ngIfElse",e)}}function yn(t,r){if(t&1&&(f(0,"div",11),d(1,hn,2,1,"ng-container",6)(2,_n,3,2,"ng-template",null,4,Z),g()),t&2){let e=ae(3),i=a(2);m(i.cx("loader")),s("pBind",i.ptm("loader")),c(),s("ngIf",i.loaderTemplate||i._loaderTemplate)("ngIfElse",e)}}function bn(t,r){if(t&1){let e=$();B(0),f(1,"div",7,1),N("scroll",function(n){C(e);let o=a();return I(o.onContainerScroll(n))}),d(3,sn,2,5,"ng-container",6)(4,cn,3,7,"ng-template",null,2,Z)(6,dn,1,4,"div",8)(7,yn,4,5,"div",9),g(),A()}if(t&2){let e=ae(5),i=a();c(),m(i.cn(i.cx("root"),i.styleClass)),s("ngStyle",i._style)("pBind",i.ptm("root")),R("id",i._id)("tabindex",i.tabindex),c(2),s("ngIf",i.contentTemplate||i._contentTemplate)("ngIfElse",e),c(3),s("ngIf",i._showSpacer),c(),s("ngIf",!i.loaderDisabled&&i._showLoader&&i.d_loading)}}function vn(t,r){t&1&&k(0)}function Cn(t,r){if(t&1&&(B(0),d(1,vn,1,0,"ng-container",10),A()),t&2){let e=a(2);c(),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Ie(5,vt,e.items,Ie(2,on,e._items,e.loadedColumns)))}}function In(t,r){if(t&1&&(Ce(0),d(1,Cn,2,8,"ng-container",16)),t&2){let e=a();c(),s("ngIf",e.contentTemplate||e._contentTemplate)}}var xn=`
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: dt('virtualscroller.loader.mask.background');
    color: dt('virtualscroller.loader.mask.color');
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-loading-icon {
    font-size: dt('virtualscroller.loader.icon.size');
    width: dt('virtualscroller.loader.icon.size');
    height: dt('virtualscroller.loader.icon.size');
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}
`,Tn={root:({instance:t})=>["p-virtualscroller",{"p-virtualscroller-inline":t.inline,"p-virtualscroller-both p-both-scroll":t.both,"p-virtualscroller-horizontal p-horizontal-scroll":t.horizontal}],content:"p-virtualscroller-content",spacer:"p-virtualscroller-spacer",loader:({instance:t})=>["p-virtualscroller-loader",{"p-virtualscroller-loader-mask":!t.loaderTemplate}],loadingIcon:"p-virtualscroller-loading-icon"},ui=(()=>{class t extends te{name="virtualscroller";css=xn;classes=Tn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})();var hi=new G("SCROLLER_INSTANCE"),Ct=(()=>{class t extends ue{zone;componentName="virtualScroller";bindDirectiveInstance=w(x,{self:!0});$pcScroller=w(hi,{optional:!0,skipSelf:!0})??void 0;hostName="";get id(){return this._id}set id(e){this._id=e}get style(){return this._style}set style(e){this._style=e}get styleClass(){return this._styleClass}set styleClass(e){this._styleClass=e}get tabindex(){return this._tabindex}set tabindex(e){this._tabindex=e}get items(){return this._items}set items(e){this._items=e}get itemSize(){return this._itemSize}set itemSize(e){this._itemSize=e}get scrollHeight(){return this._scrollHeight}set scrollHeight(e){this._scrollHeight=e}get scrollWidth(){return this._scrollWidth}set scrollWidth(e){this._scrollWidth=e}get orientation(){return this._orientation}set orientation(e){this._orientation=e}get step(){return this._step}set step(e){this._step=e}get delay(){return this._delay}set delay(e){this._delay=e}get resizeDelay(){return this._resizeDelay}set resizeDelay(e){this._resizeDelay=e}get appendOnly(){return this._appendOnly}set appendOnly(e){this._appendOnly=e}get inline(){return this._inline}set inline(e){this._inline=e}get lazy(){return this._lazy}set lazy(e){this._lazy=e}get disabled(){return this._disabled}set disabled(e){this._disabled=e}get loaderDisabled(){return this._loaderDisabled}set loaderDisabled(e){this._loaderDisabled=e}get columns(){return this._columns}set columns(e){this._columns=e}get showSpacer(){return this._showSpacer}set showSpacer(e){this._showSpacer=e}get showLoader(){return this._showLoader}set showLoader(e){this._showLoader=e}get numToleratedItems(){return this._numToleratedItems}set numToleratedItems(e){this._numToleratedItems=e}get loading(){return this._loading}set loading(e){this._loading=e}get autoSize(){return this._autoSize}set autoSize(e){this._autoSize=e}get trackBy(){return this._trackBy}set trackBy(e){this._trackBy=e}get options(){return this._options}set options(e){this._options=e,e&&typeof e=="object"&&(Object.entries(e).forEach(([i,n])=>this[`_${i}`]!==n&&(this[`_${i}`]=n)),Object.entries(e).forEach(([i,n])=>this[`${i}`]!==n&&(this[`${i}`]=n)))}onLazyLoad=new V;onScroll=new V;onScrollIndexChange=new V;elementViewChild;contentViewChild;height;_id;_style;_styleClass;_tabindex=0;_items;_itemSize=0;_scrollHeight;_scrollWidth;_orientation="vertical";_step=0;_delay=0;_resizeDelay=10;_appendOnly=!1;_inline=!1;_lazy=!1;_disabled=!1;_loaderDisabled=!1;_columns;_showSpacer=!0;_showLoader=!1;_numToleratedItems;_loading;_autoSize=!1;_trackBy;_options;d_loading=!1;d_numToleratedItems;contentEl;contentTemplate;itemTemplate;loaderTemplate;loaderIconTemplate;templates;_contentTemplate;_itemTemplate;_loaderTemplate;_loaderIconTemplate;first=0;last=0;page=0;isRangeChanged=!1;numItemsInViewport=0;lastScrollPos=0;lazyLoadState={};loaderArr=[];spacerStyle={};contentStyle={};scrollTimeout;resizeTimeout;initialized=!1;windowResizeListener;defaultWidth;defaultHeight;defaultContentWidth;defaultContentHeight;_contentStyleClass;get contentStyleClass(){return this._contentStyleClass}set contentStyleClass(e){this._contentStyleClass=e}get vertical(){return this._orientation==="vertical"}get horizontal(){return this._orientation==="horizontal"}get both(){return this._orientation==="both"}get loadedItems(){return this._items&&!this.d_loading?this.both?this._items.slice(this._appendOnly?0:this.first.rows,this.last.rows).map(e=>this._columns?e:Array.isArray(e)?e.slice(this._appendOnly?0:this.first.cols,this.last.cols):e):this.horizontal&&this._columns?this._items:this._items.slice(this._appendOnly?0:this.first,this.last):[]}get loadedRows(){return this.d_loading?this._loaderDisabled?this.loaderArr:[]:this.loadedItems}get loadedColumns(){return this._columns&&(this.both||this.horizontal)?this.d_loading&&this._loaderDisabled?this.both?this.loaderArr[0]:this.loaderArr:this._columns.slice(this.both?this.first.cols:this.first,this.both?this.last.cols:this.last):this._columns}_componentStyle=w(ui);constructor(e){super(),this.zone=e}onInit(){this.setInitialState()}onChanges(e){let i=!1;if(this.scrollHeight=="100%"&&(this.height="100%"),e.loading){let{previousValue:n,currentValue:o}=e.loading;this.lazy&&n!==o&&o!==this.d_loading&&(this.d_loading=o,i=!0)}if(e.orientation&&(this.lastScrollPos=this.both?{top:0,left:0}:0),e.numToleratedItems){let{previousValue:n,currentValue:o}=e.numToleratedItems;n!==o&&o!==this.d_numToleratedItems&&(this.d_numToleratedItems=o)}if(e.options){let{previousValue:n,currentValue:o}=e.options;this.lazy&&n?.loading!==o?.loading&&o?.loading!==this.d_loading&&(this.d_loading=o.loading,i=!0),n?.numToleratedItems!==o?.numToleratedItems&&o?.numToleratedItems!==this.d_numToleratedItems&&(this.d_numToleratedItems=o.numToleratedItems)}this.initialized&&!i&&(e.items?.previousValue?.length!==e.items?.currentValue?.length||e.itemSize||e.scrollHeight||e.scrollWidth)&&(this.init(),this.calculateAutoSize())}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"item":this._itemTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"loadericon":this._loaderIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewInit(){Promise.resolve().then(()=>{this.viewInit()})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host")),this.initialized||this.viewInit()}onDestroy(){this.unbindResizeListener(),this.contentEl=null,this.initialized=!1}viewInit(){Pe(this.platformId)&&!this.initialized&&ct(this.elementViewChild?.nativeElement)&&(this.setInitialState(),this.setContentEl(this.contentEl),this.init(),this.defaultWidth=Le(this.elementViewChild?.nativeElement),this.defaultHeight=Fe(this.elementViewChild?.nativeElement),this.defaultContentWidth=Le(this.contentEl),this.defaultContentHeight=Fe(this.contentEl),this.initialized=!0)}init(){this._disabled||(this.bindResizeListener(),this.setSpacerSize(),setTimeout(()=>{this.setSize(),this.calculateOptions(),this.cd.detectChanges()},1))}setContentEl(e){this.contentEl=e||this.contentViewChild?.nativeElement||xe(this.elementViewChild?.nativeElement,".p-virtualscroller-content")}setInitialState(){this.first=this.both?{rows:0,cols:0}:0,this.last=this.both?{rows:0,cols:0}:0,this.numItemsInViewport=this.both?{rows:0,cols:0}:0,this.lastScrollPos=this.both?{top:0,left:0}:0,(this.d_loading===void 0||this.d_loading===!1)&&(this.d_loading=this._loading||!1),this.d_numToleratedItems=this._numToleratedItems,this.loaderArr=this.loaderArr.length>0?this.loaderArr:[]}getElementRef(){return this.elementViewChild}getPageByFirst(e){return Math.floor(((e??this.first)+this.d_numToleratedItems*4)/(this._step||1))}isPageChanged(e){return this._step?this.page!==this.getPageByFirst(e??this.first):!0}scrollTo(e){this.elementViewChild?.nativeElement?.scrollTo(e)}scrollToIndex(e,i="auto"){if(this.both?e.every(o=>o>-1):e>-1){let o=this.first,{scrollTop:l=0,scrollLeft:p=0}=this.elementViewChild?.nativeElement,{numToleratedItems:L}=this.calculateNumItems(),E=this.getContentPosition(),T=this.itemSize,J=(S=0,D)=>S<=D?0:S,Q=(S,D,ne)=>S*D+ne,de=(S=0,D=0)=>this.scrollTo({left:S,top:D,behavior:i}),K=this.both?{rows:0,cols:0}:0,we=!1,y=!1;this.both?(K={rows:J(e[0],L[0]),cols:J(e[1],L[1])},de(Q(K.cols,T[1],E.left),Q(K.rows,T[0],E.top)),y=this.lastScrollPos.top!==l||this.lastScrollPos.left!==p,we=K.rows!==o.rows||K.cols!==o.cols):(K=J(e,L),this.horizontal?de(Q(K,T,E.left),l):de(p,Q(K,T,E.top)),y=this.lastScrollPos!==(this.horizontal?p:l),we=K!==o),this.isRangeChanged=we,y&&(this.first=K)}}scrollInView(e,i,n="auto"){if(i){let{first:o,viewport:l}=this.getRenderedRange(),p=(T=0,J=0)=>this.scrollTo({left:T,top:J,behavior:n}),L=i==="to-start",E=i==="to-end";if(L){if(this.both)l.first.rows-o.rows>e[0]?p(l.first.cols*this._itemSize[1],(l.first.rows-1)*this._itemSize[0]):l.first.cols-o.cols>e[1]&&p((l.first.cols-1)*this._itemSize[1],l.first.rows*this._itemSize[0]);else if(l.first-o>e){let T=(l.first-1)*this._itemSize;this.horizontal?p(T,0):p(0,T)}}else if(E){if(this.both)l.last.rows-o.rows<=e[0]+1?p(l.first.cols*this._itemSize[1],(l.first.rows+1)*this._itemSize[0]):l.last.cols-o.cols<=e[1]+1&&p((l.first.cols+1)*this._itemSize[1],l.first.rows*this._itemSize[0]);else if(l.last-o<=e+1){let T=(l.first+1)*this._itemSize;this.horizontal?p(T,0):p(0,T)}}}else this.scrollToIndex(e,n)}getRenderedRange(){let e=(o,l)=>l||o?Math.floor(o/(l||o)):0,i=this.first,n=0;if(this.elementViewChild?.nativeElement){let{scrollTop:o,scrollLeft:l}=this.elementViewChild.nativeElement;if(this.both)i={rows:e(o,this._itemSize[0]),cols:e(l,this._itemSize[1])},n={rows:i.rows+this.numItemsInViewport.rows,cols:i.cols+this.numItemsInViewport.cols};else{let p=this.horizontal?l:o;i=e(p,this._itemSize),n=i+this.numItemsInViewport}}return{first:this.first,last:this.last,viewport:{first:i,last:n}}}calculateNumItems(){let e=this.getContentPosition(),i=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetWidth-e.left:0)||0,n=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetHeight-e.top:0)||0,o=(E,T)=>T||E?Math.ceil(E/(T||E)):0,l=E=>Math.ceil(E/2),p=this.both?{rows:o(n,this._itemSize[0]),cols:o(i,this._itemSize[1])}:o(this.horizontal?i:n,this._itemSize),L=this.d_numToleratedItems||(this.both?[l(p.rows),l(p.cols)]:l(p));return{numItemsInViewport:p,numToleratedItems:L}}calculateOptions(){let{numItemsInViewport:e,numToleratedItems:i}=this.calculateNumItems(),n=(p,L,E,T=!1)=>this.getLast(p+L+(p<E?2:3)*E,T),o=this.first,l=this.both?{rows:n(this.first.rows,e.rows,i[0]),cols:n(this.first.cols,e.cols,i[1],!0)}:n(this.first,e,i);this.last=l,this.numItemsInViewport=e,this.d_numToleratedItems=i,this._showLoader&&(this.loaderArr=this.both?Array.from({length:e.rows}).map(()=>Array.from({length:e.cols})):Array.from({length:e})),this._lazy&&Promise.resolve().then(()=>{this.lazyLoadState={first:this._step?this.both?{rows:0,cols:o.cols}:0:o,last:Math.min(this._step?this._step:this.last,this._items.length)},this.handleEvents("onLazyLoad",this.lazyLoadState)})}calculateAutoSize(){this._autoSize&&!this.d_loading&&Promise.resolve().then(()=>{if(this.contentEl){this.contentEl.style.minHeight=this.contentEl.style.minWidth="auto",this.contentEl.style.position="relative",this.elementViewChild.nativeElement.style.contain="none";let[e,i]=[Le(this.contentEl),Fe(this.contentEl)];e!==this.defaultContentWidth&&(this.elementViewChild.nativeElement.style.width=""),i!==this.defaultContentHeight&&(this.elementViewChild.nativeElement.style.height="");let[n,o]=[Le(this.elementViewChild.nativeElement),Fe(this.elementViewChild.nativeElement)];(this.both||this.horizontal)&&(this.elementViewChild.nativeElement.style.width=n<this.defaultWidth?n+"px":this._scrollWidth||this.defaultWidth+"px"),(this.both||this.vertical)&&(this.elementViewChild.nativeElement.style.height=o<this.defaultHeight?o+"px":this._scrollHeight||this.defaultHeight+"px"),this.contentEl.style.minHeight=this.contentEl.style.minWidth="",this.contentEl.style.position="",this.elementViewChild.nativeElement.style.contain=""}})}getLast(e=0,i=!1){return this._items?Math.min(i?(this._columns||this._items[0]).length:this._items.length,e):0}getContentPosition(){if(this.contentEl){let e=getComputedStyle(this.contentEl),i=parseFloat(e.paddingLeft)+Math.max(parseFloat(e.left)||0,0),n=parseFloat(e.paddingRight)+Math.max(parseFloat(e.right)||0,0),o=parseFloat(e.paddingTop)+Math.max(parseFloat(e.top)||0,0),l=parseFloat(e.paddingBottom)+Math.max(parseFloat(e.bottom)||0,0);return{left:i,right:n,top:o,bottom:l,x:i+n,y:o+l}}return{left:0,right:0,top:0,bottom:0,x:0,y:0}}setSize(){if(this.elementViewChild?.nativeElement){let e=this.elementViewChild.nativeElement,i=e.parentElement?.parentElement,n=e.offsetWidth,o=i?.offsetWidth||0,l=this._scrollWidth||`${n||o}px`,p=e.offsetHeight,L=i?.offsetHeight||0,E=this._scrollHeight||`${p||L}px`,T=(J,Q)=>e.style[J]=Q;this.both||this.horizontal?(T("height",E),T("width",l)):T("height",E)}}setSpacerSize(){if(this._items){let e=this.getContentPosition(),i=(n,o,l,p=0)=>this.spacerStyle=Ae(oe({},this.spacerStyle),{[`${n}`]:(o||[]).length*l+p+"px"});this.both?(i("height",this._items,this._itemSize[0],e.y),i("width",this._columns||this._items[1],this._itemSize[1],e.x)):this.horizontal?i("width",this._columns||this._items,this._itemSize,e.x):i("height",this._items,this._itemSize,e.y)}}setContentPosition(e){if(this.contentEl&&!this._appendOnly){let i=e?e.first:this.first,n=(l,p)=>l*p,o=(l=0,p=0)=>this.contentStyle=Ae(oe({},this.contentStyle),{transform:`translate3d(${l}px, ${p}px, 0)`});if(this.both)o(n(i.cols,this._itemSize[1]),n(i.rows,this._itemSize[0]));else{let l=n(i,this._itemSize);this.horizontal?o(l,0):o(0,l)}}}onScrollPositionChange(e){let i=e.target;if(!i)throw new Error("Event target is null");let n=this.getContentPosition(),o=(y,S)=>y?y>S?y-S:y:0,l=(y,S)=>S||y?Math.floor(y/(S||y)):0,p=(y,S,D,ne,me,Se)=>y<=me?me:Se?D-ne-me:S+me-1,L=(y,S,D,ne,me,Se,je)=>y<=Se?0:Math.max(0,je?y<S?D:y-Se:y>S?D:y-2*Se),E=(y,S,D,ne,me,Se=!1)=>{let je=S+ne+2*me;return y>=me&&(je+=me+1),this.getLast(je,Se)},T=o(i.scrollTop,n.top),J=o(i.scrollLeft,n.left),Q=this.both?{rows:0,cols:0}:0,de=this.last,K=!1,we=this.lastScrollPos;if(this.both){let y=this.lastScrollPos.top<=T,S=this.lastScrollPos.left<=J;if(!this._appendOnly||this._appendOnly&&(y||S)){let D={rows:l(T,this._itemSize[0]),cols:l(J,this._itemSize[1])},ne={rows:p(D.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],y),cols:p(D.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],S)};Q={rows:L(D.rows,ne.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],y),cols:L(D.cols,ne.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],S)},de={rows:E(D.rows,Q.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0]),cols:E(D.cols,Q.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],!0)},K=Q.rows!==this.first.rows||de.rows!==this.last.rows||Q.cols!==this.first.cols||de.cols!==this.last.cols||this.isRangeChanged,we={top:T,left:J}}}else{let y=this.horizontal?J:T,S=this.lastScrollPos<=y;if(!this._appendOnly||this._appendOnly&&S){let D=l(y,this._itemSize),ne=p(D,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,S);Q=L(D,ne,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,S),de=E(D,Q,this.last,this.numItemsInViewport,this.d_numToleratedItems),K=Q!==this.first||de!==this.last||this.isRangeChanged,we=y}}return{first:Q,last:de,isRangeChanged:K,scrollPos:we}}onScrollChange(e){let{first:i,last:n,isRangeChanged:o,scrollPos:l}=this.onScrollPositionChange(e);if(o){let p={first:i,last:n};if(this.setContentPosition(p),this.first=i,this.last=n,this.lastScrollPos=l,this.handleEvents("onScrollIndexChange",p),this._lazy&&this.isPageChanged(i)){let L={first:this._step?Math.min(this.getPageByFirst(i)*this._step,this._items.length-this._step):i,last:Math.min(this._step?(this.getPageByFirst(i)+1)*this._step:n,this._items.length)};(this.lazyLoadState.first!==L.first||this.lazyLoadState.last!==L.last)&&this.handleEvents("onLazyLoad",L),this.lazyLoadState=L}}}onContainerScroll(e){if(this.handleEvents("onScroll",{originalEvent:e}),this._delay){if(this.scrollTimeout&&clearTimeout(this.scrollTimeout),!this.d_loading&&this._showLoader){let{isRangeChanged:i}=this.onScrollPositionChange(e);(i||(this._step?this.isPageChanged():!1))&&(this.d_loading=!0,this.cd.detectChanges())}this.scrollTimeout=setTimeout(()=>{this.onScrollChange(e),this.d_loading&&this._showLoader&&(!this._lazy||this._loading===void 0)&&(this.d_loading=!1,this.page=this.getPageByFirst()),this.cd.detectChanges()},this._delay)}else!this.d_loading&&this.onScrollChange(e)}bindResizeListener(){Pe(this.platformId)&&(this.windowResizeListener||this.zone.runOutsideAngular(()=>{let e=this.document.defaultView,i=Me()?"orientationchange":"resize";this.windowResizeListener=this.renderer.listen(e,i,this.onWindowResize.bind(this))}))}unbindResizeListener(){this.windowResizeListener&&(this.windowResizeListener(),this.windowResizeListener=null)}onWindowResize(){this.resizeTimeout&&clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{if(ct(this.elementViewChild?.nativeElement)){let[e,i]=[Le(this.elementViewChild?.nativeElement),Fe(this.elementViewChild?.nativeElement)],[n,o]=[e!==this.defaultWidth,i!==this.defaultHeight];(this.both?n||o:this.horizontal?n:this.vertical?o:!1)&&this.zone.run(()=>{this.d_numToleratedItems=this._numToleratedItems,this.defaultWidth=e,this.defaultHeight=i,this.defaultContentWidth=Le(this.contentEl),this.defaultContentHeight=Fe(this.contentEl),this.init()})}},this._resizeDelay)}handleEvents(e,i){return this.options&&this.options[e]?this.options[e](i):this[e].emit(i)}getContentOptions(){return{contentStyleClass:`p-virtualscroller-content ${this.d_loading?"p-virtualscroller-loading":""}`,items:this.loadedItems,getItemOptions:e=>this.getOptions(e),loading:this.d_loading,getLoaderOptions:(e,i)=>this.getLoaderOptions(e,i),itemSize:this._itemSize,rows:this.loadedRows,columns:this.loadedColumns,spacerStyle:this.spacerStyle,contentStyle:this.contentStyle,vertical:this.vertical,horizontal:this.horizontal,both:this.both,scrollTo:this.scrollTo.bind(this),scrollToIndex:this.scrollToIndex.bind(this),orientation:this._orientation,scrollableElement:this.elementViewChild?.nativeElement}}getOptions(e){let i=(this._items||[]).length,n=this.both?this.first.rows+e:this.first+e;return{index:n,count:i,first:n===0,last:n===i-1,even:n%2===0,odd:n%2!==0}}getLoaderOptions(e,i){let n=this.loaderArr.length;return oe({index:e,count:n,first:e===0,last:e===n-1,even:e%2===0,odd:e%2!==0,loading:this.d_loading},i)}static \u0275fac=function(i){return new(i||t)(be(ze))};static \u0275cmp=M({type:t,selectors:[["p-scroller"],["p-virtualscroller"],["p-virtual-scroller"],["p-virtualScroller"]],contentQueries:function(i,n,o){if(i&1&&(_(o,pi,4),_(o,Ui,4),_(o,Yi,4),_(o,Ji,4),_(o,Te,4)),i&2){let l;u(l=h())&&(n.contentTemplate=l.first),u(l=h())&&(n.itemTemplate=l.first),u(l=h())&&(n.loaderTemplate=l.first),u(l=h())&&(n.loaderIconTemplate=l.first),u(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(j(Xi,5),j(pi,5)),i&2){let o;u(o=h())&&(n.elementViewChild=o.first),u(o=h())&&(n.contentViewChild=o.first)}},hostVars:2,hostBindings:function(i,n){i&2&&qe("height",n.height)},inputs:{hostName:"hostName",id:"id",style:"style",styleClass:"styleClass",tabindex:"tabindex",items:"items",itemSize:"itemSize",scrollHeight:"scrollHeight",scrollWidth:"scrollWidth",orientation:"orientation",step:"step",delay:"delay",resizeDelay:"resizeDelay",appendOnly:"appendOnly",inline:"inline",lazy:"lazy",disabled:"disabled",loaderDisabled:"loaderDisabled",columns:"columns",showSpacer:"showSpacer",showLoader:"showLoader",numToleratedItems:"numToleratedItems",loading:"loading",autoSize:"autoSize",trackBy:"trackBy",options:"options"},outputs:{onLazyLoad:"onLazyLoad",onScroll:"onScroll",onScrollIndexChange:"onScrollIndexChange"},features:[W([ui,{provide:hi,useExisting:t},{provide:Y,useExisting:t}]),ee([x]),O],ngContentSelectors:en,decls:3,vars:2,consts:[["disabledContainer",""],["element",""],["buildInContent",""],["content",""],["buildInLoader",""],["buildInLoaderIcon",""],[4,"ngIf","ngIfElse"],[3,"scroll","ngStyle","pBind"],[3,"class","ngStyle","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"ngStyle","pBind"],[4,"ngFor","ngForOf"],["data-p-icon","spinner",3,"spin","pBind"],[4,"ngIf"]],template:function(i,n){if(i&1&&(ve(),d(0,bn,8,10,"ng-container",6)(1,In,2,1,"ng-template",null,0,Z)),i&2){let o=ae(2);s("ngIf",!n._disabled)("ngIfElse",o)}},dependencies:[U,Ze,ke,ge,Re,Kt,P,x],encapsulation:2})}return t})(),tr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=se({type:t});static \u0275inj=le({imports:[Ct,P,P]})}return t})();var fi=`
    .p-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .p-select:not(.p-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .p-select:not(.p-disabled).p-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .p-select.p-variant-filled {
        background: dt('select.filled.background');
    }

    .p-select.p-variant-filled:not(.p-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .p-select.p-variant-filled:not(.p-disabled).p-focus {
        background: dt('select.filled.focus.background');
    }

    .p-select.p-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .p-select.p-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .p-select-clear-icon {
        align-self: center;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .p-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .p-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.p-invalid .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .p-select.p-disabled .p-select-label {
        color: dt('select.disabled.color');
    }

    .p-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.p-select-label {
        cursor: default;
    }

    .p-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
    }

    .p-select-header {
        padding: dt('select.list.header.padding');
    }

    .p-select-filter {
        width: 100%;
    }

    .p-select-list-container {
        overflow: auto;
    }

    .p-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .p-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .p-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option.p-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .p-select-option.p-select-option-selected.p-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }

    .p-select-option-blank-icon {
        flex-shrink: 0;
    }

    .p-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .p-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .p-select-fluid {
        display: flex;
        width: 100%;
    }

    .p-select-sm .p-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .p-select-sm .p-select-dropdown .p-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .p-select-lg .p-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .p-select-lg .p-select-dropdown .p-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }

    .p-floatlabel-in .p-select-filter {
        padding-block-start: dt('select.padding.y');
        padding-block-end: dt('select.padding.y');
    }
`;var $e=t=>({height:t}),It=t=>({$implicit:t});function wn(t,r){if(t&1&&(H(),q(0,"svg",6)),t&2){let e=a(2);m(e.cx("optionCheckIcon")),s("pBind",e.$pcSelect==null?null:e.$pcSelect.ptm("optionCheckIcon"))}}function Sn(t,r){if(t&1&&(H(),q(0,"svg",7)),t&2){let e=a(2);m(e.cx("optionBlankIcon")),s("pBind",e.$pcSelect==null?null:e.$pcSelect.ptm("optionBlankIcon"))}}function On(t,r){if(t&1&&(B(0),d(1,wn,1,3,"svg",4)(2,Sn,1,3,"svg",5),A()),t&2){let e=a();c(),s("ngIf",e.selected),c(),s("ngIf",!e.selected)}}function En(t,r){if(t&1&&(f(0,"span",8),fe(1),g()),t&2){let e=a();s("pBind",e.$pcSelect==null?null:e.$pcSelect.ptm("optionLabel")),c(),Ve(e.label??"empty")}}function Vn(t,r){t&1&&k(0)}var kn=["item"],Fn=["group"],Ln=["loader"],Mn=["selectedItem"],zn=["header"],gi=["filter"],Dn=["footer"],Bn=["emptyfilter"],An=["empty"],Nn=["dropdownicon"],Rn=["loadingicon"],Pn=["clearicon"],Hn=["filtericon"],Qn=["onicon"],$n=["officon"],jn=["cancelicon"],Kn=["focusInput"],Gn=["editableInput"],qn=["items"],Wn=["scroller"],Zn=["overlay"],Un=["firstHiddenFocusableEl"],Yn=["lastHiddenFocusableEl"],_i=t=>({class:t}),yi=t=>({options:t}),bi=(t,r)=>({$implicit:t,options:r}),Jn=()=>({});function Xn(t,r){if(t&1&&(B(0),fe(1),A()),t&2){let e=a(2);c(),Ve(e.label()==="p-emptylabel"?"\xA0":e.label())}}function eo(t,r){if(t&1&&k(0,24),t&2){let e=a(2);s("ngTemplateOutlet",e.selectedItemTemplate||e._selectedItemTemplate)("ngTemplateOutletContext",F(2,It,e.selectedOption))}}function to(t,r){if(t&1&&(f(0,"span"),fe(1),g()),t&2){let e=a(3);c(),Ve(e.label()==="p-emptylabel"?"\xA0":e.label())}}function io(t,r){if(t&1&&d(0,to,2,1,"span",18),t&2){let e=a(2);s("ngIf",e.isSelectedOptionEmpty())}}function no(t,r){if(t&1){let e=$();f(0,"span",22,3),N("focus",function(n){C(e);let o=a();return I(o.onInputFocus(n))})("blur",function(n){C(e);let o=a();return I(o.onInputBlur(n))})("keydown",function(n){C(e);let o=a();return I(o.onKeyDown(n))}),d(2,Xn,2,1,"ng-container",20)(3,eo,1,4,"ng-container",23)(4,io,1,1,"ng-template",null,4,Z),g()}if(t&2){let e=ae(5),i=a();m(i.cx("label")),s("pBind",i.ptm("label"))("pTooltip",i.tooltip)("tooltipPosition",i.tooltipPosition)("positionStyle",i.tooltipPositionStyle)("tooltipStyleClass",i.tooltipStyleClass)("pAutoFocus",i.autofocus),R("aria-disabled",i.$disabled())("id",i.inputId)("aria-label",i.ariaLabel||(i.label()==="p-emptylabel"?void 0:i.label()))("aria-labelledby",i.ariaLabelledBy)("aria-haspopup","listbox")("aria-expanded",i.overlayVisible??!1)("aria-controls",i.overlayVisible?i.id+"_list":null)("tabindex",i.$disabled()?-1:i.tabindex)("aria-activedescendant",i.focused?i.focusedOptionId:void 0)("aria-required",i.required())("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0),c(2),s("ngIf",!i.selectedItemTemplate&&!i._selectedItemTemplate)("ngIfElse",e),c(),s("ngIf",(i.selectedItemTemplate||i._selectedItemTemplate)&&!i.isSelectedOptionEmpty())}}function oo(t,r){if(t&1){let e=$();f(0,"input",25,5),N("input",function(n){C(e);let o=a();return I(o.onEditableInput(n))})("keydown",function(n){C(e);let o=a();return I(o.onKeyDown(n))})("focus",function(n){C(e);let o=a();return I(o.onInputFocus(n))})("blur",function(n){C(e);let o=a();return I(o.onInputBlur(n))}),g()}if(t&2){let e=a();m(e.cx("label")),s("pBind",e.ptm("label"))("pAutoFocus",e.autofocus),R("id",e.inputId)("aria-haspopup","listbox")("placeholder",e.modelValue()===void 0||e.modelValue()===null?e.placeholder():void 0)("aria-label",e.ariaLabel||(e.label()==="p-emptylabel"?void 0:e.label()))("aria-activedescendant",e.focused?e.focusedOptionId:void 0)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)}}function lo(t,r){if(t&1){let e=$();H(),f(0,"svg",28),N("click",function(n){C(e);let o=a(2);return I(o.clear(n))}),g()}if(t&2){let e=a(2);m(e.cx("clearIcon")),s("pBind",e.ptm("clearIcon")),R("data-pc-section","clearicon")}}function so(t,r){}function ro(t,r){t&1&&d(0,so,0,0,"ng-template")}function ao(t,r){if(t&1){let e=$();f(0,"span",29),N("click",function(n){C(e);let o=a(2);return I(o.clear(n))}),d(1,ro,1,0,null,30),g()}if(t&2){let e=a(2);m(e.cx("clearIcon")),s("pBind",e.ptm("clearIcon")),R("data-pc-section","clearicon"),c(),s("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)("ngTemplateOutletContext",F(6,_i,e.cx("clearIcon")))}}function co(t,r){if(t&1&&(B(0),d(1,lo,1,4,"svg",26)(2,ao,2,8,"span",27),A()),t&2){let e=a();c(),s("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),c(),s("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function po(t,r){t&1&&k(0)}function uo(t,r){if(t&1&&(B(0),d(1,po,1,0,"ng-container",31),A()),t&2){let e=a(2);c(),s("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function ho(t,r){if(t&1&&q(0,"span",33),t&2){let e=a(3);m(e.cn(e.cx("loadingIcon"),"pi-spin"+e.loadingIcon)),s("pBind",e.ptm("loadingIcon"))}}function mo(t,r){if(t&1&&q(0,"span",33),t&2){let e=a(3);m(e.cn(e.cx("loadingIcon"),"pi pi-spinner pi-spin")),s("pBind",e.ptm("loadingIcon"))}}function fo(t,r){if(t&1&&(B(0),d(1,ho,1,3,"span",32)(2,mo,1,3,"span",32),A()),t&2){let e=a(2);c(),s("ngIf",e.loadingIcon),c(),s("ngIf",!e.loadingIcon)}}function go(t,r){if(t&1&&(B(0),d(1,uo,2,1,"ng-container",18)(2,fo,3,2,"ng-container",18),A()),t&2){let e=a();c(),s("ngIf",e.loadingIconTemplate||e._loadingIconTemplate),c(),s("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate)}}function _o(t,r){if(t&1&&q(0,"span",36),t&2){let e=a(3);m(e.cn(e.cx("dropdownIcon"),e.dropdownIcon)),s("pBind",e.ptm("dropdownIcon"))}}function yo(t,r){if(t&1&&(H(),q(0,"svg",37)),t&2){let e=a(3);m(e.cx("dropdownIcon")),s("pBind",e.ptm("dropdownIcon"))}}function bo(t,r){if(t&1&&(B(0),d(1,_o,1,3,"span",34)(2,yo,1,3,"svg",35),A()),t&2){let e=a(2);c(),s("ngIf",e.dropdownIcon),c(),s("ngIf",!e.dropdownIcon)}}function vo(t,r){}function Co(t,r){t&1&&d(0,vo,0,0,"ng-template")}function Io(t,r){if(t&1&&(f(0,"span",36),d(1,Co,1,0,null,30),g()),t&2){let e=a(2);m(e.cx("dropdownIcon")),s("pBind",e.ptm("dropdownIcon")),c(),s("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)("ngTemplateOutletContext",F(5,_i,e.cx("dropdownIcon")))}}function xo(t,r){if(t&1&&d(0,bo,3,2,"ng-container",18)(1,Io,2,7,"span",34),t&2){let e=a();s("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),c(),s("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function To(t,r){t&1&&k(0)}function wo(t,r){t&1&&k(0)}function So(t,r){if(t&1&&(B(0),d(1,wo,1,0,"ng-container",30),A()),t&2){let e=a(3);c(),s("ngTemplateOutlet",e.filterTemplate||e._filterTemplate)("ngTemplateOutletContext",F(2,yi,e.filterOptions))}}function Oo(t,r){if(t&1&&(H(),q(0,"svg",45)),t&2){let e=a(4);s("pBind",e.ptm("filterIcon"))}}function Eo(t,r){}function Vo(t,r){t&1&&d(0,Eo,0,0,"ng-template")}function ko(t,r){if(t&1&&(f(0,"span",36),d(1,Vo,1,0,null,31),g()),t&2){let e=a(4);s("pBind",e.ptm("filterIcon")),c(),s("ngTemplateOutlet",e.filterIconTemplate||e._filterIconTemplate)}}function Fo(t,r){if(t&1){let e=$();f(0,"p-iconfield",41)(1,"input",42,10),N("input",function(n){C(e);let o=a(3);return I(o.onFilterInputChange(n))})("keydown",function(n){C(e);let o=a(3);return I(o.onFilterKeyDown(n))})("blur",function(n){C(e);let o=a(3);return I(o.onFilterBlur(n))}),g(),f(3,"p-inputicon",41),d(4,Oo,1,1,"svg",43)(5,ko,2,2,"span",44),g()()}if(t&2){let e=a(3);s("pt",e.ptm("pcFilterContainer")),c(),m(e.cx("pcFilter")),s("pSize",e.size())("value",e._filterValue()||"")("variant",e.$variant())("pt",e.ptm("pcFilter")),R("placeholder",e.filterPlaceholder)("aria-owns",e.id+"_list")("aria-label",e.ariaFilterLabel)("aria-activedescendant",e.focusedOptionId),c(2),s("pt",e.ptm("pcFilterIconContainer")),c(),s("ngIf",!e.filterIconTemplate&&!e._filterIconTemplate),c(),s("ngIf",e.filterIconTemplate||e._filterIconTemplate)}}function Lo(t,r){if(t&1){let e=$();f(0,"div",29),N("click",function(n){return C(e),I(n.stopPropagation())}),d(1,So,2,4,"ng-container",20)(2,Fo,6,14,"ng-template",null,9,Z),g()}if(t&2){let e=ae(3),i=a(2);m(i.cx("header")),s("pBind",i.ptm("header")),c(),s("ngIf",i.filterTemplate||i._filterTemplate)("ngIfElse",e)}}function Mo(t,r){t&1&&k(0)}function zo(t,r){if(t&1&&d(0,Mo,1,0,"ng-container",30),t&2){let e=r.$implicit,i=r.options;a(2);let n=ae(9);s("ngTemplateOutlet",n)("ngTemplateOutletContext",Ie(2,bi,e,i))}}function Do(t,r){t&1&&k(0)}function Bo(t,r){if(t&1&&d(0,Do,1,0,"ng-container",30),t&2){let e=r.options,i=a(4);s("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",F(2,yi,e))}}function Ao(t,r){t&1&&(B(0),d(1,Bo,1,4,"ng-template",null,12,Z),A())}function No(t,r){if(t&1){let e=$();f(0,"p-scroller",46,11),N("onLazyLoad",function(n){C(e);let o=a(2);return I(o.onLazyLoad.emit(n))}),d(2,zo,1,5,"ng-template",null,2,Z)(4,Ao,3,0,"ng-container",18),g()}if(t&2){let e=a(2);Ne(F(9,$e,e.scrollHeight)),s("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions)("pt",e.ptm("virtualScroller")),c(4),s("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Ro(t,r){t&1&&k(0)}function Po(t,r){if(t&1&&(B(0),d(1,Ro,1,0,"ng-container",30),A()),t&2){a();let e=ae(9),i=a();c(),s("ngTemplateOutlet",e)("ngTemplateOutletContext",Ie(3,bi,i.visibleOptions(),We(2,Jn)))}}function Ho(t,r){if(t&1&&(f(0,"span",36),fe(1),g()),t&2){let e=a(2).$implicit,i=a(3);m(i.cx("optionGroupLabel")),s("pBind",i.ptm("optionGroupLabel")),c(),Ve(i.getOptionGroupLabel(e.optionGroup))}}function Qo(t,r){t&1&&k(0)}function $o(t,r){if(t&1&&(B(0),f(1,"li",50),d(2,Ho,2,4,"span",34)(3,Qo,1,0,"ng-container",30),g(),A()),t&2){let e=a(),i=e.$implicit,n=e.index,o=a().options,l=a(2);c(),m(l.cx("optionGroup")),s("ngStyle",F(8,$e,o.itemSize+"px"))("pBind",l.ptm("optionGroup")),R("id",l.id+"_"+l.getOptionIndex(n,o)),c(),s("ngIf",!l.groupTemplate&&!l._groupTemplate),c(),s("ngTemplateOutlet",l.groupTemplate||l._groupTemplate)("ngTemplateOutletContext",F(10,It,i.optionGroup))}}function jo(t,r){if(t&1){let e=$();B(0),f(1,"p-selectItem",51),N("onClick",function(n){C(e);let o=a().$implicit,l=a(3);return I(l.onOptionSelect(n,o))})("onMouseEnter",function(n){C(e);let o=a().index,l=a().options,p=a(2);return I(p.onOptionMouseEnter(n,p.getOptionIndex(o,l)))}),g(),A()}if(t&2){let e=a(),i=e.$implicit,n=e.index,o=a().options,l=a(2);c(),s("id",l.id+"_"+l.getOptionIndex(n,o))("option",i)("checkmark",l.checkmark)("selected",l.isSelected(i))("label",l.getOptionLabel(i))("disabled",l.isOptionDisabled(i))("template",l.itemTemplate||l._itemTemplate)("focused",l.focusedOptionIndex()===l.getOptionIndex(n,o)),xt("ariaPosInset",l.getAriaPosInset(l.getOptionIndex(n,o)))("ariaSetSize",l.ariaSetSize),s("index",n)("scrollerOptions",o)}}function Ko(t,r){if(t&1&&d(0,$o,4,12,"ng-container",18)(1,jo,2,12,"ng-container",18),t&2){let e=r.$implicit,i=a(3);s("ngIf",i.isOptionGroup(e)),c(),s("ngIf",!i.isOptionGroup(e))}}function Go(t,r){if(t&1&&fe(0),t&2){let e=a(4);rt(" ",e.emptyFilterMessageLabel," ")}}function qo(t,r){t&1&&k(0,null,14)}function Wo(t,r){if(t&1&&d(0,qo,2,0,"ng-container",31),t&2){let e=a(4);s("ngTemplateOutlet",e.emptyFilterTemplate||e._emptyFilterTemplate||e.emptyTemplate||e._emptyTemplate)}}function Zo(t,r){if(t&1&&(f(0,"li",50),Oe(1,Go,1,1)(2,Wo,1,1,"ng-container"),g()),t&2){let e=a().options,i=a(2);m(i.cx("emptyMessage")),s("ngStyle",F(5,$e,e.itemSize+"px"))("pBind",i.ptm("emptyMessage")),c(),Ee(!i.emptyFilterTemplate&&!i._emptyFilterTemplate&&!i.emptyTemplate?1:2)}}function Uo(t,r){if(t&1&&fe(0),t&2){let e=a(4);rt(" ",e.emptyMessageLabel||e.emptyFilterMessageLabel," ")}}function Yo(t,r){t&1&&k(0,null,15)}function Jo(t,r){if(t&1&&d(0,Yo,2,0,"ng-container",31),t&2){let e=a(4);s("ngTemplateOutlet",e.emptyTemplate||e._emptyTemplate)}}function Xo(t,r){if(t&1&&(f(0,"li",50),Oe(1,Uo,1,1)(2,Jo,1,1,"ng-container"),g()),t&2){let e=a().options,i=a(2);m(i.cx("emptyMessage")),s("ngStyle",F(5,$e,e.itemSize+"px"))("pBind",i.ptm("emptyMessage")),c(),Ee(!i.emptyTemplate&&!i._emptyTemplate?1:2)}}function el(t,r){if(t&1&&(f(0,"ul",47,13),d(2,Ko,2,2,"ng-template",48)(3,Zo,3,7,"li",49)(4,Xo,3,7,"li",49),g()),t&2){let e=r.$implicit,i=r.options,n=a(2);Ne(i.contentStyle),m(n.cn(n.cx("list"),i.contentStyleClass)),s("pBind",n.ptm("list")),R("id",n.id+"_list")("aria-label",n.listLabel),c(2),s("ngForOf",e),c(),s("ngIf",n.filterValue&&n.isEmpty()),c(),s("ngIf",!n.filterValue&&n.isEmpty())}}function tl(t,r){t&1&&k(0)}function il(t,r){if(t&1){let e=$();f(0,"div",38)(1,"span",39,6),N("focus",function(n){C(e);let o=a();return I(o.onFirstHiddenFocus(n))}),g(),d(3,To,1,0,"ng-container",31)(4,Lo,4,5,"div",27),f(5,"div",36),d(6,No,5,11,"p-scroller",40)(7,Po,2,6,"ng-container",18)(8,el,5,10,"ng-template",null,7,Z),g(),d(10,tl,1,0,"ng-container",31),f(11,"span",39,8),N("focus",function(n){C(e);let o=a();return I(o.onLastHiddenFocus(n))}),g()()}if(t&2){let e=a();m(e.cn(e.cx("overlay"),e.panelStyleClass)),s("ngStyle",e.panelStyle)("pBind",e.ptm("overlay")),c(),s("pBind",e.ptm("hiddenFirstFocusableEl")),R("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0),c(2),s("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),c(),s("ngIf",e.filter),c(),m(e.cx("listContainer")),qe("max-height",e.virtualScroll?"auto":e.scrollHeight||"auto"),s("pBind",e.ptm("listContainer")),c(),s("ngIf",e.virtualScroll),c(),s("ngIf",!e.virtualScroll),c(3),s("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),c(),s("pBind",e.ptm("hiddenLastFocusableEl")),R("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0)}}var nl=`
    ${fi}

    /* For PrimeNG */
    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.ng-invalid.ng-dirty {
        border-color: dt('select.invalid.border.color');
    }

    .p-dropdown.ng-invalid.ng-dirty .p-dropdown-label.p-placeholder,
    .p-select.ng-invalid.ng-dirty .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }
`,ol={root:({instance:t})=>["p-select p-component p-inputwrapper",{"p-disabled":t.$disabled(),"p-variant-filled":t.$variant()==="filled","p-focus":t.focused,"p-invalid":t.invalid(),"p-inputwrapper-filled":t.$filled(),"p-inputwrapper-focus":t.focused||t.overlayVisible,"p-select-open":t.overlayVisible,"p-select-fluid":t.hasFluid,"p-select-sm p-inputfield-sm":t.size()==="small","p-select-lg p-inputfield-lg":t.size()==="large"}],label:({instance:t})=>["p-select-label",{"p-placeholder":t.placeholder()&&t.label()===t.placeholder(),"p-select-label-empty":!t.editable&&!t.selectedItemTemplate&&(t.label()===void 0||t.label()===null||t.label()==="p-emptylabel"||t.label().length===0)}],clearIcon:"p-select-clear-icon",dropdown:"p-select-dropdown",loadingIcon:"p-select-loading-icon",dropdownIcon:"p-select-dropdown-icon",overlay:"p-select-overlay p-component-overlay p-component",header:"p-select-header",pcFilter:"p-select-filter",listContainer:"p-select-list-container",list:"p-select-list",optionGroup:"p-select-option-group",optionGroupLabel:"p-select-option-group-label",option:({instance:t})=>["p-select-option",{"p-select-option-selected":t.selected&&!t.checkmark,"p-disabled":t.disabled,"p-focus":t.focused}],optionLabel:"p-select-option-label",optionCheckIcon:"p-select-option-check-icon",optionBlankIcon:"p-select-option-blank-icon",emptyMessage:"p-select-empty-message"},ot=(()=>{class t extends te{name="select";style=nl;classes=ol;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})();var vi=new G("SELECT_INSTANCE"),ll=new G("SELECT_ITEM_INSTANCE"),sl={provide:it,useExisting:Ke(()=>Ci),multi:!0},rl=(()=>{class t extends ue{hostName="select";$pcSelectItem=w(ll,{optional:!0,skipSelf:!0})??void 0;$pcSelect=w(vi,{optional:!0,skipSelf:!0})??void 0;id;option;selected;focused;label;disabled;visible;itemSize;ariaPosInset;ariaSetSize;template;checkmark;index;scrollerOptions;onClick=new V;onMouseEnter=new V;_componentStyle=w(ot);onOptionClick(e){this.onClick.emit(e)}onOptionMouseEnter(e){this.onMouseEnter.emit(e)}getPTOptions(){return this.$pcSelect?.getPTItemOptions?.(this.option,this.scrollerOptions,this.index??0,"option")??this.$pcSelect?.ptm("option",{context:{option:this.option,selected:this.selected,focused:this.focused,disabled:this.disabled}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["p-selectItem"]],inputs:{id:"id",option:"option",selected:[2,"selected","selected",v],focused:[2,"focused","focused",v],label:"label",disabled:[2,"disabled","disabled",v],visible:[2,"visible","visible",v],itemSize:[2,"itemSize","itemSize",De],ariaPosInset:"ariaPosInset",ariaSetSize:"ariaSetSize",template:"template",checkmark:[2,"checkmark","checkmark",v],index:"index",scrollerOptions:"scrollerOptions"},outputs:{onClick:"onClick",onMouseEnter:"onMouseEnter"},features:[W([ot,{provide:Y,useExisting:t}]),O],decls:4,vars:20,consts:[["role","option","pRipple","",3,"click","mouseenter","id","pBind","ngStyle"],[4,"ngIf"],[3,"pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],["data-p-icon","blank",3,"class","pBind",4,"ngIf"],["data-p-icon","check",3,"pBind"],["data-p-icon","blank",3,"pBind"],[3,"pBind"]],template:function(i,n){i&1&&(f(0,"li",0),N("click",function(l){return n.onOptionClick(l)})("mouseenter",function(l){return n.onOptionMouseEnter(l)}),d(1,On,3,2,"ng-container",1)(2,En,2,2,"span",2)(3,Vn,1,0,"ng-container",3),g()),i&2&&(m(n.cx("option")),s("id",n.id)("pBind",n.getPTOptions())("ngStyle",F(16,$e,n.itemSize+"px")),R("aria-label",n.label)("aria-setsize",n.ariaSetSize)("aria-posinset",n.ariaPosInset)("aria-selected",n.selected)("data-p-focused",n.focused)("data-p-highlight",n.selected)("data-p-disabled",n.disabled),c(),s("ngIf",n.checkmark),c(),s("ngIf",!n.template),c(),s("ngTemplateOutlet",n.template)("ngTemplateOutletContext",F(18,It,n.option)))},dependencies:[U,ke,ge,Re,P,et,ni,ii,_e,x],encapsulation:2})}return t})(),Ci=(()=>{class t extends ti{zone;filterService;bindDirectiveInstance=w(x,{self:!0});id;scrollHeight="200px";filter;panelStyle;styleClass;panelStyleClass;readonly;editable;tabindex=0;set placeholder(e){this._placeholder.set(e)}get placeholder(){return this._placeholder.asReadonly()}loadingIcon;filterPlaceholder;filterLocale;inputId;dataKey;filterBy;filterFields;autofocus;resetFilterOnHide=!1;checkmark=!1;dropdownIcon;loading=!1;optionLabel;optionValue;optionDisabled;optionGroupLabel="label";optionGroupChildren="items";group;showClear;emptyFilterMessage="";emptyMessage="";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;overlayOptions;ariaFilterLabel;ariaLabel;ariaLabelledBy;filterMatchMode="contains";tooltip="";tooltipPosition="right";tooltipPositionStyle="absolute";tooltipStyleClass;focusOnHover=!0;selectOnFocus=!1;autoOptionFocus=!1;autofocusFilter=!0;get filterValue(){return this._filterValue()}set filterValue(e){setTimeout(()=>{this._filterValue.set(e)})}get options(){return this._options()}set options(e){Bt(e,this._options())||this._options.set(e)}appendTo=z(void 0);onChange=new V;onFilter=new V;onFocus=new V;onBlur=new V;onClick=new V;onShow=new V;onHide=new V;onClear=new V;onLazyLoad=new V;_componentStyle=w(ot);filterViewChild;focusInputViewChild;editableInputViewChild;itemsViewChild;scroller;overlayViewChild;firstHiddenFocusableElementOnOverlay;lastHiddenFocusableElementOnOverlay;itemsWrapper;$appendTo=pe(()=>this.appendTo()||this.config.overlayAppendTo());itemTemplate;groupTemplate;loaderTemplate;selectedItemTemplate;headerTemplate;filterTemplate;footerTemplate;emptyFilterTemplate;emptyTemplate;dropdownIconTemplate;loadingIconTemplate;clearIconTemplate;filterIconTemplate;onIconTemplate;offIconTemplate;cancelIconTemplate;templates;_itemTemplate;_selectedItemTemplate;_headerTemplate;_filterTemplate;_footerTemplate;_emptyFilterTemplate;_emptyTemplate;_groupTemplate;_loaderTemplate;_dropdownIconTemplate;_loadingIconTemplate;_clearIconTemplate;_filterIconTemplate;_cancelIconTemplate;_onIconTemplate;_offIconTemplate;filterOptions;_options=ye(null);_placeholder=ye(void 0);value;hover;focused;overlayVisible;optionsChanged;panel;dimensionsUpdated;hoveredItem;selectedOptionUpdated;_filterValue=ye(null);searchValue;searchIndex;searchTimeout;previousSearchChar;currentSearchChar;preventModelTouched;focusedOptionIndex=ye(-1);labelId;listId;clicked=ye(!1);get emptyMessageLabel(){return this.emptyMessage||this.config.getTranslation(Je.EMPTY_MESSAGE)}get emptyFilterMessageLabel(){return this.emptyFilterMessage||this.config.getTranslation(Je.EMPTY_FILTER_MESSAGE)}get isVisibleClearIcon(){return this.modelValue()!=null&&this.hasSelectedOption()&&this.showClear&&!this.$disabled()}get listLabel(){return this.config.getTranslation(Je.ARIA).listLabel}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}visibleOptions=pe(()=>{let e=this.getAllVisibleAndNonVisibleOptions();if(this._filterValue()){let n=!(this.filterBy||this.optionLabel)&&!this.filterFields&&!this.optionValue?this.options?.filter(o=>o.label?o.label.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim())!==-1:o.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim())!==-1):this.filterService.filter(e,this.searchFields(),this._filterValue().trim(),this.filterMatchMode,this.filterLocale);if(this.group){let o=this.options||[],l=[];return o.forEach(p=>{let E=this.getOptionGroupChildren(p).filter(T=>n?.includes(T));E.length>0&&l.push(Ae(oe({},p),{[typeof this.optionGroupChildren=="string"?this.optionGroupChildren:"items"]:[...E]}))}),this.flatOptions(l)}return n}return e});label=pe(()=>{let e=this.getAllVisibleAndNonVisibleOptions(),i=e.findIndex(n=>this.isOptionValueEqualsModelValue(n));if(i!==-1){let n=e[i];return this.getOptionLabel(n)}return this.placeholder()||"p-emptylabel"});selectedOption;constructor(e,i){super(),this.zone=e,this.filterService=i,Vt(()=>{let n=this.modelValue(),o=this.visibleOptions();if(o&&Ue(o)){let l=this.findSelectedOptionIndex();if(l!==-1||n===void 0||typeof n=="string"&&n.length===0||this.isModelValueNotSet()||this.editable)this.selectedOption=o[l];else{let p=o.findIndex(L=>this.isSelected(L));p!==-1&&(this.selectedOption=o[p])}}dt(o)&&(n===void 0||this.isModelValueNotSet())&&Ue(this.selectedOption)&&(this.selectedOption=null),n!==void 0&&this.editable&&this.updateEditableLabel(),this.cd.markForCheck()})}isModelValueNotSet(){return this.modelValue()===null&&!this.isOptionValueEqualsModelValue(this.selectedOption)}getAllVisibleAndNonVisibleOptions(){return this.group?this.flatOptions(this.options):this.options||[]}onInit(){this.id=this.id||Ye("pn_id_"),this.autoUpdateModel(),this.filterBy&&(this.filterOptions={filter:e=>this.onFilterInputChange(e),reset:()=>this.resetFilter()})}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"filter":this._filterTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"emptyfilter":this._emptyFilterTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"filtericon":this._filterIconTemplate=e.template;break;case"cancelicon":this._cancelIconTemplate=e.template;break;case"onicon":this._onIconTemplate=e.template;break;case"officon":this._offIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewChecked(){if(this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.optionsChanged&&this.overlayVisible&&(this.optionsChanged=!1,this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1)})),this.selectedOptionUpdated&&this.itemsWrapper){let e=xe(this.overlayViewChild?.overlayViewChild?.nativeElement,"li.p-select-option-selected");e&&Dt(this.itemsWrapper,e),this.selectedOptionUpdated=!1}}flatOptions(e){return(e||[]).reduce((i,n,o)=>{i.push({optionGroup:n,group:!0,index:o});let l=this.getOptionGroupChildren(n);return l&&l.forEach(p=>i.push(p)),i},[])}autoUpdateModel(){this.selectOnFocus&&this.autoOptionFocus&&!this.hasSelectedOption()&&(this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex()),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1))}onOptionSelect(e,i,n=!0,o=!1){if(!this.isOptionDisabled(i)){if(!this.isSelected(i)){let l=this.getOptionValue(i);this.updateModel(l,e),this.focusedOptionIndex.set(this.findSelectedOptionIndex()),o===!1&&this.onChange.emit({originalEvent:e,value:l})}n&&this.hide(!0)}}onOptionMouseEnter(e,i){this.focusOnHover&&this.changeFocusedOptionIndex(e,i)}updateModel(e,i){this.value=e,this.onModelChange(e),this.writeModelValue(e),this.selectedOptionUpdated=!0}allowModelChange(){return!!this.modelValue()&&!this.placeholder()&&(this.modelValue()===void 0||this.modelValue()===null)&&!this.editable&&this.options&&this.options.length}isSelected(e){return this.isOptionValueEqualsModelValue(e)}isOptionValueEqualsModelValue(e){return e!=null&&!this.isOptionGroup(e)&&At(this.modelValue(),this.getOptionValue(e),this.equalityKey())}onAfterViewInit(){this.editable&&this.updateEditableLabel(),this.updatePlaceHolderForFloatingLabel()}updatePlaceHolderForFloatingLabel(){let e=this.el.nativeElement.parentElement,i=e?.classList.contains("p-float-label");if(e&&i&&!this.selectedOption){let n=e.querySelector("label");n&&this._placeholder.set(n.textContent)}}updateEditableLabel(){this.editableInputViewChild&&(this.editableInputViewChild.nativeElement.value=this.getOptionLabel(this.selectedOption)||this.modelValue()||"")}clearEditableLabel(){this.editableInputViewChild&&(this.editableInputViewChild.nativeElement.value="")}getOptionIndex(e,i){return this.virtualScrollerDisabled?e:i&&i.getItemOptions(e).index}getOptionLabel(e){return this.optionLabel!==void 0&&this.optionLabel!==null?Be(e,this.optionLabel):e&&e.label!==void 0?e.label:e}getOptionValue(e){return this.optionValue&&this.optionValue!==null?Be(e,this.optionValue):!this.optionLabel&&e&&e.value!==void 0?e.value:e}getPTItemOptions(e,i,n,o){return this.ptm(o,{context:{option:e,index:n,selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(n,i),disabled:this.isOptionDisabled(e)}})}isSelectedOptionEmpty(){return dt(this.selectedOption)}isOptionDisabled(e){return this.optionDisabled?Be(e,this.optionDisabled):e&&e.disabled!==void 0?e.disabled:!1}getOptionGroupLabel(e){return this.optionGroupLabel!==void 0&&this.optionGroupLabel!==null?Be(e,this.optionGroupLabel):e&&e.label!==void 0?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren!==void 0&&this.optionGroupChildren!==null?Be(e,this.optionGroupChildren):e.items}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(i=>this.isOptionGroup(i)).length:e)+1}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}resetFilter(){this._filterValue.set(null),this.filterViewChild&&this.filterViewChild.nativeElement&&(this.filterViewChild.nativeElement.value="")}onContainerClick(e){this.$disabled()||this.readonly||this.loading||e.target.tagName==="INPUT"||e.target.getAttribute("data-pc-section")==="clearicon"||e.target.closest('[data-pc-section="clearicon"]')||((!this.overlayViewChild||!this.overlayViewChild.el.nativeElement.contains(e.target))&&(this.overlayVisible?this.hide(!0):this.show(!0)),this.focusInputViewChild?.nativeElement.focus({preventScroll:!0}),this.onClick.emit(e),this.clicked.set(!0),this.cd.detectChanges())}isEmpty(){return!this._options()||this.visibleOptions()&&this.visibleOptions().length===0}onEditableInput(e){let i=e.target.value;this.searchValue="",!this.searchOptions(e,i)&&this.focusedOptionIndex.set(-1),this.onModelChange(i),this.updateModel(i||null,e),setTimeout(()=>{this.onChange.emit({originalEvent:e,value:i})},1),!this.overlayVisible&&Ue(i)&&this.show()}show(e){this.overlayVisible=!0,this.focusedOptionIndex.set(this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():this.editable?-1:this.findSelectedOptionIndex()),e&&ce(this.focusInputViewChild?.nativeElement),this.cd.markForCheck()}onOverlayAnimationStart(e){if(e.toState==="visible"){if(this.itemsWrapper=xe(this.overlayViewChild?.overlayViewChild?.nativeElement,this.virtualScroll?".p-scroller":".p-select-list-container"),this.virtualScroll&&this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.options&&this.options.length)if(this.virtualScroll){let i=this.modelValue()?this.focusedOptionIndex():-1;i!==-1&&this.scroller?.scrollToIndex(i)}else{let i=xe(this.itemsWrapper,".p-select-option.p-select-option-selected");i&&i.scrollIntoView({block:"nearest",inline:"nearest"})}this.filterViewChild&&this.filterViewChild.nativeElement&&(this.preventModelTouched=!0,this.autofocusFilter&&!this.editable&&this.filterViewChild.nativeElement.focus()),this.onShow.emit(e)}e.toState==="void"&&(this.itemsWrapper=null,this.onModelTouched(),this.onHide.emit(e))}hide(e){this.overlayVisible=!1,this.focusedOptionIndex.set(-1),this.clicked.set(!1),this.searchValue="",this.overlayOptions?.mode==="modal"&&Ht(),this.filter&&this.resetFilterOnHide&&this.resetFilter(),e&&(this.focusInputViewChild&&ce(this.focusInputViewChild?.nativeElement),this.editable&&this.editableInputViewChild&&ce(this.editableInputViewChild?.nativeElement)),this.cd.markForCheck()}onInputFocus(e){if(this.$disabled())return;this.focused=!0;let i=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(i),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),!this.preventModelTouched&&!this.overlayVisible&&this.onModelTouched(),this.preventModelTouched=!1}onKeyDown(e,i=!1){if(!(this.$disabled()||this.readonly||this.loading)){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,this.editable);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,this.editable);break;case"Delete":this.onDeleteKey(e);break;case"Home":this.onHomeKey(e,this.editable);break;case"End":this.onEndKey(e,this.editable);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Space":this.onSpaceKey(e,i);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e,this.editable);break;case"ShiftLeft":case"ShiftRight":break;default:!e.metaKey&&Nt(e.key)&&(!this.overlayVisible&&this.show(),!this.editable&&this.searchOptions(e,e.key));break}this.clicked.set(!1)}}onFilterKeyDown(e){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,!0);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,!0);break;case"Home":this.onHomeKey(e,!0);break;case"End":this.onEndKey(e,!0);break;case"Enter":case"NumpadEnter":this.onEnterKey(e,!0);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e,!0);break;default:break}}onFilterBlur(e){this.focusedOptionIndex.set(-1)}onArrowDownKey(e){if(!this.overlayVisible)this.show(),this.editable&&this.changeFocusedOptionIndex(e,this.findSelectedOptionIndex());else{let i=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.clicked()?this.findFirstOptionIndex():this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,i)}e.preventDefault(),e.stopPropagation()}changeFocusedOptionIndex(e,i){if(this.focusedOptionIndex()!==i&&(this.focusedOptionIndex.set(i),this.scrollInView(),this.selectOnFocus)){let n=this.visibleOptions()[i];this.onOptionSelect(e,n,!1)}}get virtualScrollerDisabled(){return!this.virtualScroll}scrollInView(e=-1){let i=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=xe(this.itemsViewChild.nativeElement,`li[id="${i}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}hasSelectedOption(){return this.modelValue()!==void 0}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}equalityKey(){return this.optionValue?void 0:this.dataKey}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let i=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return i>-1?i+e+1:e}findPrevOptionIndex(e){let i=e>0?pt(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return i>-1?i:e}findLastOptionIndex(){return pt(this.visibleOptions(),e=>this.isValidOption(e))}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}isValidOption(e){return e!=null&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionGroup(e){return this.optionGroupLabel!==void 0&&this.optionGroupLabel!==null&&e.optionGroup!==void 0&&e.optionGroup!==null&&e.group}onArrowUpKey(e,i=!1){if(e.altKey&&!i){if(this.focusedOptionIndex()!==-1){let n=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,n)}this.overlayVisible&&this.hide()}else{let n=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.clicked()?this.findLastOptionIndex():this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,n),!this.overlayVisible&&this.show()}e.preventDefault(),e.stopPropagation()}onArrowLeftKey(e,i=!1){i&&this.focusedOptionIndex.set(-1)}onDeleteKey(e){this.showClear&&(this.clear(e),e.preventDefault())}onHomeKey(e,i=!1){if(i&&e.currentTarget&&e.currentTarget.setSelectionRange){let n=e.currentTarget;e.shiftKey?n.setSelectionRange(0,n.value.length):(n.setSelectionRange(0,0),this.focusedOptionIndex.set(-1))}else this.changeFocusedOptionIndex(e,this.findFirstOptionIndex()),!this.overlayVisible&&this.show();e.preventDefault()}onEndKey(e,i=!1){if(i&&e.currentTarget&&e.currentTarget.setSelectionRange){let n=e.currentTarget;if(e.shiftKey)n.setSelectionRange(0,n.value.length);else{let o=n.value.length;n.setSelectionRange(o,o),this.focusedOptionIndex.set(-1)}}else this.changeFocusedOptionIndex(e,this.findLastOptionIndex()),!this.overlayVisible&&this.show();e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onSpaceKey(e,i=!1){!this.editable&&!i&&this.onEnterKey(e)}onEnterKey(e,i=!1){if(!this.overlayVisible)this.focusedOptionIndex.set(-1),this.onArrowDownKey(e);else{if(this.focusedOptionIndex()!==-1){let n=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,n)}!i&&this.hide()}e.preventDefault()}onEscapeKey(e){this.overlayVisible&&(this.hide(!0),e.preventDefault(),e.stopPropagation())}onTabKey(e,i=!1){if(!i)if(this.overlayVisible&&this.hasFocusableElements())ce(e.shiftKey?this.lastHiddenFocusableElementOnOverlay?.nativeElement:this.firstHiddenFocusableElementOnOverlay?.nativeElement),e.preventDefault();else{if(this.focusedOptionIndex()!==-1&&this.overlayVisible){let n=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,n)}this.overlayVisible&&this.hide(this.filter)}e.stopPropagation()}onFirstHiddenFocus(e){let i=e.relatedTarget===this.focusInputViewChild?.nativeElement?Mt(this.overlayViewChild?.el?.nativeElement,":not(.p-hidden-focusable)"):this.focusInputViewChild?.nativeElement;ce(i)}onLastHiddenFocus(e){let i=e.relatedTarget===this.focusInputViewChild?.nativeElement?zt(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])'):this.focusInputViewChild?.nativeElement;ce(i)}hasFocusableElements(){return Lt(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])').length>0}onBackspaceKey(e,i=!1){i&&!this.overlayVisible&&this.show()}searchFields(){return this.filterBy?.split(",")||this.filterFields||[this.optionLabel]}searchOptions(e,i){this.searchValue=(this.searchValue||"")+i;let n=-1,o=!1;return n=this.visibleOptions().findIndex(l=>this.isOptionMatched(l)),n!==-1&&(o=!0),n===-1&&this.focusedOptionIndex()===-1&&(n=this.findFirstFocusedOptionIndex()),n!==-1&&setTimeout(()=>{this.changeFocusedOptionIndex(e,n)}),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(()=>{this.searchValue="",this.searchTimeout=null},500),o}isOptionMatched(e){return this.isValidOption(e)&&this.getOptionLabel(e).toString().toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale))}onFilterInputChange(e){let i=e.target.value;this._filterValue.set(i),this.focusedOptionIndex.set(-1),this.onFilter.emit({originalEvent:e,filter:this._filterValue()}),!this.virtualScrollerDisabled&&this.scroller?.scrollToIndex(0),setTimeout(()=>{this.overlayViewChild?.alignOverlay()}),this.cd.markForCheck()}applyFocus(){this.editable?xe(this.el.nativeElement,".p-dropdown-label.p-inputtext").focus():ce(this.focusInputViewChild?.nativeElement)}focus(){this.applyFocus()}clear(e){this.updateModel(null,e),this.clearEditableLabel(),this.onModelTouched(),this.onChange.emit({originalEvent:e,value:this.value}),this.onClear.emit(e),this.resetFilter()}writeControlValue(e,i){this.filter&&this.resetFilter(),this.value=e,this.allowModelChange()&&this.onModelChange(e),i(this.value),this.updateEditableLabel(),this.cd.markForCheck()}static \u0275fac=function(i){return new(i||t)(be(ze),be(Rt))};static \u0275cmp=M({type:t,selectors:[["p-select"]],contentQueries:function(i,n,o){if(i&1&&(_(o,kn,4),_(o,Fn,4),_(o,Ln,4),_(o,Mn,4),_(o,zn,4),_(o,gi,4),_(o,Dn,4),_(o,Bn,4),_(o,An,4),_(o,Nn,4),_(o,Rn,4),_(o,Pn,4),_(o,Hn,4),_(o,Qn,4),_(o,$n,4),_(o,jn,4),_(o,Te,4)),i&2){let l;u(l=h())&&(n.itemTemplate=l.first),u(l=h())&&(n.groupTemplate=l.first),u(l=h())&&(n.loaderTemplate=l.first),u(l=h())&&(n.selectedItemTemplate=l.first),u(l=h())&&(n.headerTemplate=l.first),u(l=h())&&(n.filterTemplate=l.first),u(l=h())&&(n.footerTemplate=l.first),u(l=h())&&(n.emptyFilterTemplate=l.first),u(l=h())&&(n.emptyTemplate=l.first),u(l=h())&&(n.dropdownIconTemplate=l.first),u(l=h())&&(n.loadingIconTemplate=l.first),u(l=h())&&(n.clearIconTemplate=l.first),u(l=h())&&(n.filterIconTemplate=l.first),u(l=h())&&(n.onIconTemplate=l.first),u(l=h())&&(n.offIconTemplate=l.first),u(l=h())&&(n.cancelIconTemplate=l.first),u(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(j(gi,5),j(Kn,5),j(Gn,5),j(qn,5),j(Wn,5),j(Zn,5),j(Un,5),j(Yn,5)),i&2){let o;u(o=h())&&(n.filterViewChild=o.first),u(o=h())&&(n.focusInputViewChild=o.first),u(o=h())&&(n.editableInputViewChild=o.first),u(o=h())&&(n.itemsViewChild=o.first),u(o=h())&&(n.scroller=o.first),u(o=h())&&(n.overlayViewChild=o.first),u(o=h())&&(n.firstHiddenFocusableElementOnOverlay=o.first),u(o=h())&&(n.lastHiddenFocusableElementOnOverlay=o.first)}},hostVars:3,hostBindings:function(i,n){i&1&&N("click",function(l){return n.onContainerClick(l)}),i&2&&(R("id",n.id),m(n.cn(n.cx("root"),n.styleClass)))},inputs:{id:"id",scrollHeight:"scrollHeight",filter:[2,"filter","filter",v],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",readonly:[2,"readonly","readonly",v],editable:[2,"editable","editable",v],tabindex:[2,"tabindex","tabindex",De],placeholder:"placeholder",loadingIcon:"loadingIcon",filterPlaceholder:"filterPlaceholder",filterLocale:"filterLocale",inputId:"inputId",dataKey:"dataKey",filterBy:"filterBy",filterFields:"filterFields",autofocus:[2,"autofocus","autofocus",v],resetFilterOnHide:[2,"resetFilterOnHide","resetFilterOnHide",v],checkmark:[2,"checkmark","checkmark",v],dropdownIcon:"dropdownIcon",loading:[2,"loading","loading",v],optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",optionGroupLabel:"optionGroupLabel",optionGroupChildren:"optionGroupChildren",group:[2,"group","group",v],showClear:[2,"showClear","showClear",v],emptyFilterMessage:"emptyFilterMessage",emptyMessage:"emptyMessage",lazy:[2,"lazy","lazy",v],virtualScroll:[2,"virtualScroll","virtualScroll",v],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",De],virtualScrollOptions:"virtualScrollOptions",overlayOptions:"overlayOptions",ariaFilterLabel:"ariaFilterLabel",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",filterMatchMode:"filterMatchMode",tooltip:"tooltip",tooltipPosition:"tooltipPosition",tooltipPositionStyle:"tooltipPositionStyle",tooltipStyleClass:"tooltipStyleClass",focusOnHover:[2,"focusOnHover","focusOnHover",v],selectOnFocus:[2,"selectOnFocus","selectOnFocus",v],autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",v],autofocusFilter:[2,"autofocusFilter","autofocusFilter",v],filterValue:"filterValue",options:"options",appendTo:[1,"appendTo"]},outputs:{onChange:"onChange",onFilter:"onFilter",onFocus:"onFocus",onBlur:"onBlur",onClick:"onClick",onShow:"onShow",onHide:"onHide",onClear:"onClear",onLazyLoad:"onLazyLoad"},features:[W([sl,ot,{provide:vi,useExisting:t},{provide:Y,useExisting:t}]),ee([x]),O],decls:11,vars:16,consts:[["elseBlock",""],["overlay",""],["content",""],["focusInput",""],["defaultPlaceholder",""],["editableInput",""],["firstHiddenFocusableEl",""],["buildInItems",""],["lastHiddenFocusableEl",""],["builtInFilterElement",""],["filter",""],["scroller",""],["loader",""],["items",""],["emptyFilter",""],["empty",""],["role","combobox",3,"class","pBind","pTooltip","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus","focus","blur","keydown",4,"ngIf"],["type","text",3,"class","pBind","pAutoFocus","input","keydown","focus","blur",4,"ngIf"],[4,"ngIf"],["role","button","aria-label","dropdown trigger","aria-haspopup","listbox",3,"pBind"],[4,"ngIf","ngIfElse"],["hostName","select",3,"visibleChange","onAnimationStart","onHide","hostAttrSelector","pt","visible","options","target","appendTo"],["role","combobox",3,"focus","blur","keydown","pBind","pTooltip","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus"],[3,"ngTemplateOutlet","ngTemplateOutletContext",4,"ngIf"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],["type","text",3,"input","keydown","focus","blur","pBind","pAutoFocus"],["data-p-icon","times",3,"class","pBind","click",4,"ngIf"],[3,"class","pBind","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngTemplateOutlet"],["aria-hidden","true",3,"class","pBind",4,"ngIf"],["aria-hidden","true",3,"pBind"],[3,"class","pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"class","pBind",4,"ngIf"],[3,"pBind"],["data-p-icon","chevron-down",3,"pBind"],[3,"ngStyle","pBind"],["role","presentation",1,"p-hidden-accessible","p-hidden-focusable",3,"focus","pBind"],["hostName","select",3,"items","style","itemSize","autoSize","lazy","options","pt","onLazyLoad",4,"ngIf"],[3,"pt"],["pInputText","","type","text","role","searchbox","autocomplete","off",3,"input","keydown","blur","pSize","value","variant","pt"],["data-p-icon","search",3,"pBind",4,"ngIf"],[3,"pBind",4,"ngIf"],["data-p-icon","search",3,"pBind"],["hostName","select",3,"onLazyLoad","items","itemSize","autoSize","lazy","options","pt"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"class","ngStyle","pBind",4,"ngIf"],["role","option",3,"ngStyle","pBind"],[3,"onClick","onMouseEnter","id","option","checkmark","selected","label","disabled","template","focused","ariaPosInset","ariaSetSize","index","scrollerOptions"]],template:function(i,n){if(i&1){let o=$();d(0,no,6,23,"span",16)(1,oo,2,19,"input",17)(2,co,3,2,"ng-container",18),f(3,"div",19),d(4,go,3,2,"ng-container",20)(5,xo,2,2,"ng-template",null,0,Z),g(),f(7,"p-overlay",21,1),Ot("visibleChange",function(p){return C(o),St(n.overlayVisible,p)||(n.overlayVisible=p),I(p)}),N("onAnimationStart",function(p){return C(o),I(n.onOverlayAnimationStart(p))})("onHide",function(){return C(o),I(n.hide())}),d(9,il,13,22,"ng-template",null,2,Z),g()}if(i&2){let o=ae(6);s("ngIf",!n.editable),c(),s("ngIf",n.editable),c(),s("ngIf",n.isVisibleClearIcon),c(),m(n.cx("dropdown")),s("pBind",n.ptm("dropdown")),R("aria-expanded",n.overlayVisible??!1)("data-pc-section","trigger"),c(),s("ngIf",n.loading)("ngIfElse",o),c(3),s("hostAttrSelector",n.$attrSelector)("pt",n.ptm("pcOverlay")),wt("visible",n.overlayVisible),s("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())}},dependencies:[U,Ze,ke,ge,Re,rl,di,qt,$t,si,oi,li,Zt,_t,yt,Ct,P,_e,x],encapsulation:2,changeDetection:0})}return t})(),Br=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=se({type:t});static \u0275inj=le({imports:[Ci,P,P]})}return t})();var Ii=`
    .p-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .p-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .p-togglebutton-checked .p-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .p-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .p-togglebutton.p-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .p-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .p-togglebutton-label,
    .p-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .p-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover .p-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .p-togglebutton:disabled .p-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .p-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .p-togglebutton-sm .p-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .p-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .p-togglebutton-lg .p-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .p-togglebutton-fluid {
        width: 100%;
    }
`;var al=["icon"],cl=["content"],wi=t=>({$implicit:t});function dl(t,r){t&1&&k(0)}function pl(t,r){if(t&1&&q(0,"span",0),t&2){let e=a(3);m(e.cn(e.cx("icon"),e.checked?e.onIcon:e.offIcon,e.iconPos==="left"?e.cx("iconLeft"):e.cx("iconRight"))),s("pBind",e.ptm("icon"))}}function ul(t,r){if(t&1&&Oe(0,pl,1,3,"span",2),t&2){let e=a(2);Ee(e.onIcon||e.offIcon?0:-1)}}function hl(t,r){t&1&&k(0)}function ml(t,r){if(t&1&&d(0,hl,1,0,"ng-container",1),t&2){let e=a(2);s("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)("ngTemplateOutletContext",F(2,wi,e.checked))}}function fl(t,r){if(t&1&&(Oe(0,ul,1,1)(1,ml,1,4,"ng-container"),f(2,"span",0),fe(3),g()),t&2){let e=a();Ee(e.iconTemplate?1:0),c(2),m(e.cx("label")),s("pBind",e.ptm("label")),c(),Ve(e.checked?e.hasOnLabel?e.onLabel:"\xA0":e.hasOffLabel?e.offLabel:"\xA0")}}var gl=`
    ${Ii}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,_l={root:({instance:t})=>["p-togglebutton p-component",{"p-togglebutton-checked":t.checked,"p-invalid":t.invalid(),"p-disabled":t.$disabled(),"p-togglebutton-sm p-inputfield-sm":t.size==="small","p-togglebutton-lg p-inputfield-lg":t.size==="large","p-togglebutton-fluid":t.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},xi=(()=>{class t extends te{name="togglebutton";style=gl;classes=_l;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})();var Ti=new G("TOGGLEBUTTON_INSTANCE"),yl={provide:it,useExisting:Ke(()=>Si),multi:!0},Si=(()=>{class t extends nt{$pcToggleButton=w(Ti,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=w(x,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}onKeyDown(e){switch(e.code){case"Enter":this.toggle(e),e.preventDefault();break;case"Space":this.toggle(e),e.preventDefault();break}}toggle(e){!this.$disabled()&&!(this.allowEmpty===!1&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:e,checked:this.checked}),this.cd.markForCheck())}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=z(void 0,{transform:v});onChange=new V;iconTemplate;contentTemplate;templates;checked=!1;onInit(){(this.checked===null||this.checked===void 0)&&(this.checked=!1)}_componentStyle=w(xi);onBlur(){this.onModelTouched()}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===!0}_iconTemplate;_contentTemplate;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"icon":this._iconTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}writeControlValue(e,i){this.checked=e,i(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(i,n,o){if(i&1&&(_(o,al,4),_(o,cl,4),_(o,Te,4)),i&2){let l;u(l=h())&&(n.iconTemplate=l.first),u(l=h())&&(n.contentTemplate=l.first),u(l=h())&&(n.templates=l)}},hostVars:8,hostBindings:function(i,n){i&1&&N("keydown",function(l){return n.onKeyDown(l)})("click",function(l){return n.toggle(l)}),i&2&&(R("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel)("aria-pressed",n.checked?"true":"false")("role","button")("tabindex",n.tabindex!==void 0?n.tabindex:n.$disabled()?-1:0)("data-pc-name","togglebutton"),m(n.cn(n.cx("root"),n.styleClass)))},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",De],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",v],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[W([yl,xi,{provide:Ti,useExisting:t},{provide:Y,useExisting:t}]),ee([et,x]),O],decls:3,vars:8,consts:[[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","pBind"]],template:function(i,n){i&1&&(f(0,"span",0),d(1,dl,1,0,"ng-container",1),Oe(2,fl,4,5),g()),i&2&&(m(n.cx("content")),s("pBind",n.ptm("content")),c(),s("ngTemplateOutlet",n.contentTemplate||n._contentTemplate)("ngTemplateOutletContext",F(6,wi,n.checked)),c(),Ee(n.contentTemplate?-1:2))},dependencies:[U,ge,P,_e,x],encapsulation:2,changeDetection:0})}return t})(),sa=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=se({type:t});static \u0275inj=le({imports:[Si,P,P]})}return t})();export{ni as a,oi as b,li as c,si as d,nt as e,Si as f,sa as g,ti as h,_t as i,Ll as j,yt as k,Gl as l,di as m,Ct as n,tr as o,Ci as p,Br as q};
