import{a as xe}from"./chunk-NNFBF7OO.js";import{e as ve}from"./chunk-45VHZGPA.js";import{Aa as ye,Ja as Te,O as Y,aa as ee,ba as S,ca as he,ja as fe,ka as G,la as y,ma as te,pa as W,ra as J,s as L,sa as be,xa as Ce,za as b}from"./chunk-MJRXXN54.js";import{c as we,d as ie,f as U,h as ne,i as oe,k as ae}from"./chunk-4O3FVBGX.js";import{a as ke}from"./chunk-3WD3R7GE.js";import{i as ue,k as _e,o as Z,s as $}from"./chunk-OGD6VOHA.js";import{$b as l,$c as E,Ab as R,Bb as F,Bc as P,Cc as f,Eb as Q,Fb as N,Gb as r,Ia as D,Nc as H,Pc as z,Rc as ge,Sb as X,Vb as _,Wb as h,ac as k,bc as v,cb as se,cc as A,ga as le,ha as M,ia as V,ib as u,ic as j,id as me,jc as B,ka as O,ma as C,nb as I,ob as ce,oc as x,pc as s,qc as re,qd as p,rc as pe,rd as q,sa as T,sc as m,ta as w,tc as de,ub as K,uc as d,vc as g}from"./chunk-257IQEAD.js";var Ee=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var Re=["handle"],Fe=["input"],Qe=t=>({checked:t});function Ne(t,o){t&1&&j(0)}function Pe(t,o){if(t&1&&r(0,Ne,1,0,"ng-container",3),t&2){let e=s();l("ngTemplateOutlet",e.handleTemplate||e._handleTemplate)("ngTemplateOutletContext",z(2,Qe,e.checked()))}}var He=`
    ${Ee}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,ze={root:{position:"relative"}},qe={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},Ie=(()=>{class t extends W{name="toggleswitch";style=He;classes=qe;inlineStyles=ze;static \u0275fac=(()=>{let e;return function(i){return(e||(e=D(t)))(i||t)}})();static \u0275prov=M({token:t,factory:t.\u0275fac})}return t})();var je=new O("TOGGLESWITCH_INSTANCE"),Ze={provide:ke,useExisting:le(()=>Be),multi:!0},Be=(()=>{class t extends ve{$pcToggleSwitch=C(je,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=C(b,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=me();ariaLabelledBy;autofocus;onChange=new I;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=C(Ie);templates;onHostClick(e){this.onClick(e)}onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="handle"?this._handleTemplate=e.template:this._handleTemplate=e.template})}onClick(e){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:e,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(e,n){n(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=D(t)))(i||t)}})();static \u0275cmp=R({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(n,i,c){if(n&1&&(m(c,Re,4),m(c,G,4)),n&2){let a;d(a=g())&&(i.handleTemplate=a.first),d(a=g())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&de(Fe,5),n&2){let c;d(c=g())&&(i.input=c.first)}},hostVars:5,hostBindings:function(n,i){n&1&&x("click",function(a){return i.onHostClick(a)}),n&2&&(X("data-pc-name","toggleswitch"),P(i.sx("root")),f(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",q],inputId:"inputId",readonly:[2,"readonly","readonly",p],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",p]},outputs:{onChange:"onChange"},features:[H([Ze,Ie,{provide:je,useExisting:t},{provide:J,useExisting:t}]),N([b]),Q],decls:5,vars:20,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){if(n&1){let c=B();k(0,"input",1,0),x("focus",function(){return T(c),w(i.onFocus())})("blur",function(){return T(c),w(i.onBlur())}),v(),k(2,"div",2)(3,"div",2),_(4,Pe,1,4,"ng-container"),v()()}n&2&&(f(i.cx("input")),l("checked",i.checked())("pAutoFocus",i.autofocus)("pBind",i.ptm("input")),X("id",i.inputId)("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0)("aria-checked",i.checked())("aria-labelledby",i.ariaLabelledBy)("aria-label",i.ariaLabel)("name",i.name())("tabindex",i.tabindex),u(2),f(i.cx("slider")),l("pBind",i.ptm("slider")),u(),f(i.cx("handle")),l("pBind",i.ptm("handle")),u(),h(i.handleTemplate||i._handleTemplate?4:-1))},dependencies:[$,Z,Ce,y,ye,b],encapsulation:2,changeDetection:0})}return t})(),ci=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=F({type:t});static \u0275inj=V({imports:[Be,y,y]})}return t})();var Se=`
    .p-confirmdialog .p-dialog-content {
        display: flex;
        align-items: center;
        gap: dt('confirmdialog.content.gap');
    }

    .p-confirmdialog-icon {
        color: dt('confirmdialog.icon.color');
        font-size: dt('confirmdialog.icon.size');
        width: dt('confirmdialog.icon.size');
        height: dt('confirmdialog.icon.size');
    }
`;var $e=["header"],Ge=["footer"],We=["rejecticon"],Je=["accepticon"],Ue=["message"],Ke=["icon"],Xe=["headless"],Ye=[[["p-footer"]]],et=["p-footer"],tt=(t,o,e)=>({$implicit:t,onAccept:o,onReject:e}),it=t=>({$implicit:t});function nt(t,o){t&1&&j(0)}function ot(t,o){if(t&1&&r(0,nt,1,0,"ng-container",7),t&2){let e=s(2);l("ngTemplateOutlet",e.headlessTemplate||e._headlessTemplate)("ngTemplateOutletContext",ge(2,tt,e.confirmation,e.onAccept.bind(e),e.onReject.bind(e)))}}function at(t,o){t&1&&r(0,ot,1,6,"ng-template",null,2,E)}function lt(t,o){t&1&&j(0)}function st(t,o){if(t&1&&r(0,lt,1,0,"ng-container",8),t&2){let e=s(3);l("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function ct(t,o){t&1&&r(0,st,1,1,"ng-template",null,4,E)}function rt(t,o){}function pt(t,o){t&1&&r(0,rt,0,0,"ng-template")}function dt(t,o){if(t&1&&r(0,pt,1,0,null,8),t&2){let e=s(3);l("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}function gt(t,o){if(t&1&&A(0,"i",12),t&2){let e=s(4);f(e.option("icon")),l("ngClass",e.cx("icon"))("pBind",e.ptm("icon"))}}function mt(t,o){if(t&1&&r(0,gt,1,4,"i",11),t&2){let e=s(3);l("ngIf",e.option("icon"))}}function ut(t,o){}function _t(t,o){t&1&&r(0,ut,0,0,"ng-template")}function ht(t,o){if(t&1&&r(0,_t,1,0,null,7),t&2){let e=s(3);l("ngTemplateOutlet",e.messageTemplate||e._messageTemplate)("ngTemplateOutletContext",z(2,it,e.confirmation))}}function ft(t,o){if(t&1&&A(0,"span",13),t&2){let e=s(3);f(e.cx("message")),l("pBind",e.ptm("message"))("innerHTML",e.option("message"),se)}}function bt(t,o){if(t&1&&(_(0,dt,1,1)(1,mt,1,1,"i",9),_(2,ht,1,4)(3,ft,1,4,"span",10)),t&2){let e=s(2);h(e.iconTemplate||e._iconTemplate?0:!e.iconTemplate&&!e._iconTemplate&&!e._messageTemplate&&!e.messageTemplate?1:-1),u(2),h(e.messageTemplate||e._messageTemplate?2:3)}}function Ct(t,o){if(t&1&&(_(0,ct,2,0),r(1,bt,4,2,"ng-template",null,3,E)),t&2){let e=s();h(e.headerTemplate||e._headerTemplate?0:-1)}}function yt(t,o){t&1&&j(0)}function Tt(t,o){if(t&1&&(pe(0),r(1,yt,1,0,"ng-container",8)),t&2){let e=s(2);u(),l("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}function wt(t,o){if(t&1&&A(0,"i",18),t&2){let e=s(6);f(e.option("rejectIcon")),l("pBind",e.ptm("pcRejectButton").icon)}}function kt(t,o){if(t&1&&r(0,wt,1,3,"i",17),t&2){let e=s(5);l("ngIf",e.option("rejectIcon"))}}function vt(t,o){}function xt(t,o){t&1&&r(0,vt,0,0,"ng-template")}function Et(t,o){if(t&1&&(_(0,kt,1,1,"i",16),r(1,xt,1,0,null,8)),t&2){let e=s(4);h(e.rejectIcon&&!e.rejectIconTemplate&&!e._rejectIconTemplate?0:-1),u(),l("ngTemplateOutlet",e.rejectIconTemplate||e._rejectIconTemplate)}}function It(t,o){if(t&1){let e=B();k(0,"p-button",15),x("onClick",function(){T(e);let i=s(3);return w(i.onReject())}),r(1,Et,2,2,"ng-template",null,5,E),v()}if(t&2){let e=s(3);l("pt",e.ptm("pcRejectButton"))("label",e.rejectButtonLabel)("styleClass",e.getButtonStyleClass("pcRejectButton","rejectButtonStyleClass"))("ariaLabel",e.option("rejectButtonProps","ariaLabel"))("buttonProps",e.getRejectButtonProps())}}function jt(t,o){if(t&1&&A(0,"i",18),t&2){let e=s(6);f(e.option("acceptIcon")),l("pBind",e.ptm("pcAcceptButton").icon)}}function Bt(t,o){if(t&1&&r(0,jt,1,3,"i",17),t&2){let e=s(5);l("ngIf",e.option("acceptIcon"))}}function St(t,o){}function Dt(t,o){t&1&&r(0,St,0,0,"ng-template")}function At(t,o){if(t&1&&(_(0,Bt,1,1,"i",16),r(1,Dt,1,0,null,8)),t&2){let e=s(4);h(e.acceptIcon&&!e._acceptIconTemplate&&!e.acceptIconTemplate?0:-1),u(),l("ngTemplateOutlet",e.acceptIconTemplate||e._acceptIconTemplate)}}function Lt(t,o){if(t&1){let e=B();k(0,"p-button",15),x("onClick",function(){T(e);let i=s(3);return w(i.onAccept())}),r(1,At,2,2,"ng-template",null,5,E),v()}if(t&2){let e=s(3);l("pt",e.ptm("pcAcceptButton"))("label",e.acceptButtonLabel)("styleClass",e.getButtonStyleClass("pcAcceptButton","acceptButtonStyleClass"))("ariaLabel",e.option("acceptButtonProps","ariaLabel"))("buttonProps",e.getAcceptButtonProps())}}function Mt(t,o){if(t&1&&r(0,It,3,5,"p-button",14)(1,Lt,3,5,"p-button",14),t&2){let e=s(2);l("ngIf",e.option("rejectVisible")),u(),l("ngIf",e.option("acceptVisible"))}}function Vt(t,o){if(t&1&&(_(0,Tt,2,1),_(1,Mt,2,2)),t&2){let e=s();h(e.footerTemplate||e._footerTemplate?0:-1),u(),h(!e.footerTemplate&&!e._footerTemplate?1:-1)}}var Ot={root:"p-confirmdialog",icon:"p-confirmdialog-icon",message:"p-confirmdialog-message",pcRejectButton:"p-confirmdialog-reject-button",pcAcceptButton:"p-confirmdialog-accept-button"},De=(()=>{class t extends W{name="confirmdialog";style=Se;classes=Ot;static \u0275fac=(()=>{let e;return function(i){return(e||(e=D(t)))(i||t)}})();static \u0275prov=M({token:t,factory:t.\u0275fac})}return t})();var Ae=new O("CONFIRMDIALOG_INSTANCE"),Rt=oe([U({transform:"{{transform}}",opacity:0}),ie("{{transition}}",U({transform:"none",opacity:1}))]),Ft=oe([ie("{{transition}}",U({transform:"{{transform}}",opacity:0}))]),Qt=(()=>{class t extends be{confirmationService;zone;$pcConfirmDialog=C(Ae,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=C(b,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}header;icon;message;get style(){return this._style}set style(e){this._style=e,this.cd.markForCheck()}styleClass;maskStyleClass;acceptIcon;acceptLabel;closeAriaLabel;acceptAriaLabel;acceptVisible=!0;rejectIcon;rejectLabel;rejectAriaLabel;rejectVisible=!0;acceptButtonStyleClass;rejectButtonStyleClass;closeOnEscape=!0;dismissableMask;blockScroll=!0;rtl=!1;closable=!0;appendTo="body";key;autoZIndex=!0;baseZIndex=0;transitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)";focusTrap=!0;defaultFocus="accept";breakpoints;modal=!0;get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.maskVisible&&(this.maskVisible=!0),this.cd.markForCheck()}get position(){return this._position}set position(e){switch(this._position=e,e){case"topleft":case"bottomleft":case"left":this.transformOptions="translate3d(-100%, 0px, 0px)";break;case"topright":case"bottomright":case"right":this.transformOptions="translate3d(100%, 0px, 0px)";break;case"bottom":this.transformOptions="translate3d(0px, 100%, 0px)";break;case"top":this.transformOptions="translate3d(0px, -100%, 0px)";break;default:this.transformOptions="scale(0.7)";break}}draggable=!0;onHide=new I;footer;_componentStyle=C(De);headerTemplate;footerTemplate;rejectIconTemplate;acceptIconTemplate;messageTemplate;iconTemplate;headlessTemplate;templates;_headerTemplate;_footerTemplate;_rejectIconTemplate;_acceptIconTemplate;_messageTemplate;_iconTemplate;_headlessTemplate;confirmation;_visible;_style;maskVisible;dialog;wrapper;contentContainer;subscription;preWidth;_position="center";transformOptions="scale(0.7)";styleElement;id=ee("pn_id_");ariaLabelledBy=this.getAriaLabelledBy();translationSubscription;constructor(e,n){super(),this.confirmationService=e,this.zone=n,this.subscription=this.confirmationService.requireConfirmation$.subscribe(i=>{if(!i){this.hide();return}i.key===this.key&&(this.confirmation=i,Object.keys(i).forEach(a=>{this[a]=i[a]}),this.confirmation.accept&&(this.confirmation.acceptEvent=new I,this.confirmation.acceptEvent.subscribe(this.confirmation.accept)),this.confirmation.reject&&(this.confirmation.rejectEvent=new I,this.confirmation.rejectEvent.subscribe(this.confirmation.reject)),this.visible=!0)})}onInit(){this.breakpoints&&this.createStyle(),this.translationSubscription=this.config.translationObserver.subscribe(()=>{this.visible&&this.cd.markForCheck()})}onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"message":this._messageTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"rejecticon":this._rejectIconTemplate=e.template;break;case"accepticon":this._acceptIconTemplate=e.template;break;case"headless":this._headlessTemplate=e.template;break}})}getAriaLabelledBy(){return this.header!==null?ee("pn_id_")+"_header":null}option(e,n){let i=this;if(i.hasOwnProperty(e))return n?i[n]:i[e]}getButtonStyleClass(e,n){let i=this.cx(e),c=this.option(n);return[i,c].filter(Boolean).join(" ")}getElementToFocus(){if(this.dialog?.el?.nativeElement)switch(this.option("defaultFocus")){case"accept":return L(this.dialog.el.nativeElement,".p-confirm-dialog-accept");case"reject":return L(this.dialog.el.nativeElement,".p-confirm-dialog-reject");case"close":return L(this.dialog.el.nativeElement,".p-dialog-header-close");case"none":return null;default:return L(this.dialog.el.nativeElement,".p-confirm-dialog-accept")}}createStyle(){if(!this.styleElement){this.styleElement=this.document.createElement("style"),this.styleElement.type="text/css",Y(this.styleElement,"nonce",this.config?.csp()?.nonce),this.document.head.appendChild(this.styleElement);let e="";for(let n in this.breakpoints)e+=`
                    @media screen and (max-width: ${n}) {
                        .p-dialog[${this.id}] {
                            width: ${this.breakpoints[n]} !important;
                        }
                    }
                `;this.styleElement.innerHTML=e,Y(this.styleElement,"nonce",this.config?.csp()?.nonce)}}close(){this.confirmation?.rejectEvent&&this.confirmation.rejectEvent.emit(S.CANCEL),this.hide(S.CANCEL)}hide(e){this.onHide.emit(e),this.visible=!1,this.unsubscribeConfirmationEvents(),this.confirmation=null}destroyStyle(){this.styleElement&&(this.document.head.removeChild(this.styleElement),this.styleElement=null)}onDestroy(){this.subscription.unsubscribe(),this.unsubscribeConfirmationEvents(),this.translationSubscription&&this.translationSubscription.unsubscribe(),this.destroyStyle()}onVisibleChange(e){e?this.visible=e:this.close()}onAccept(){this.confirmation&&this.confirmation.acceptEvent&&this.confirmation.acceptEvent.emit(),this.hide(S.ACCEPT)}onReject(){this.confirmation&&this.confirmation.rejectEvent&&this.confirmation.rejectEvent.emit(S.REJECT),this.hide(S.REJECT)}unsubscribeConfirmationEvents(){this.confirmation&&(this.confirmation.acceptEvent?.unsubscribe(),this.confirmation.rejectEvent?.unsubscribe())}get acceptButtonLabel(){return this.option("acceptLabel")||this.getAcceptButtonProps()?.label||this.config.getTranslation(te.ACCEPT)}get rejectButtonLabel(){return this.option("rejectLabel")||this.getRejectButtonProps()?.label||this.config.getTranslation(te.REJECT)}getAcceptButtonProps(){return this.option("acceptButtonProps")}getRejectButtonProps(){return this.option("rejectButtonProps")}static \u0275fac=function(n){return new(n||t)(K(he),K(ce))};static \u0275cmp=R({type:t,selectors:[["p-confirmDialog"],["p-confirmdialog"],["p-confirm-dialog"]],contentQueries:function(n,i,c){if(n&1&&(m(c,fe,5),m(c,$e,4),m(c,Ge,4),m(c,We,4),m(c,Je,4),m(c,Ue,4),m(c,Ke,4),m(c,Xe,4),m(c,G,4)),n&2){let a;d(a=g())&&(i.footer=a.first),d(a=g())&&(i.headerTemplate=a.first),d(a=g())&&(i.footerTemplate=a.first),d(a=g())&&(i.rejectIconTemplate=a.first),d(a=g())&&(i.acceptIconTemplate=a.first),d(a=g())&&(i.messageTemplate=a.first),d(a=g())&&(i.iconTemplate=a.first),d(a=g())&&(i.headlessTemplate=a.first),d(a=g())&&(i.templates=a)}},inputs:{header:"header",icon:"icon",message:"message",style:"style",styleClass:"styleClass",maskStyleClass:"maskStyleClass",acceptIcon:"acceptIcon",acceptLabel:"acceptLabel",closeAriaLabel:"closeAriaLabel",acceptAriaLabel:"acceptAriaLabel",acceptVisible:[2,"acceptVisible","acceptVisible",p],rejectIcon:"rejectIcon",rejectLabel:"rejectLabel",rejectAriaLabel:"rejectAriaLabel",rejectVisible:[2,"rejectVisible","rejectVisible",p],acceptButtonStyleClass:"acceptButtonStyleClass",rejectButtonStyleClass:"rejectButtonStyleClass",closeOnEscape:[2,"closeOnEscape","closeOnEscape",p],dismissableMask:[2,"dismissableMask","dismissableMask",p],blockScroll:[2,"blockScroll","blockScroll",p],rtl:[2,"rtl","rtl",p],closable:[2,"closable","closable",p],appendTo:"appendTo",key:"key",autoZIndex:[2,"autoZIndex","autoZIndex",p],baseZIndex:[2,"baseZIndex","baseZIndex",q],transitionOptions:"transitionOptions",focusTrap:[2,"focusTrap","focusTrap",p],defaultFocus:"defaultFocus",breakpoints:"breakpoints",modal:[2,"modal","modal",p],visible:"visible",position:"position",draggable:[2,"draggable","draggable",p]},outputs:{onHide:"onHide"},features:[H([De,{provide:Ae,useExisting:t},{provide:J,useExisting:t}]),N([b]),Q],ngContentSelectors:et,decls:6,vars:18,consts:[["dialog",""],["footer",""],["headless",""],["content",""],["header",""],["icon",""],["role","alertdialog",3,"visibleChange","pt","visible","closable","styleClass","modal","header","closeOnEscape","blockScroll","appendTo","position","dismissableMask","draggable","baseZIndex","autoZIndex","maskStyleClass"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngTemplateOutlet"],[3,"ngClass","class","pBind"],[3,"class","pBind","innerHTML"],[3,"ngClass","class","pBind",4,"ngIf"],[3,"ngClass","pBind"],[3,"pBind","innerHTML"],[3,"pt","label","styleClass","ariaLabel","buttonProps","onClick",4,"ngIf"],[3,"onClick","pt","label","styleClass","ariaLabel","buttonProps"],[3,"class","pBind"],[3,"class","pBind",4,"ngIf"],[3,"pBind"]],template:function(n,i){if(n&1){let c=B();re(Ye),k(0,"p-dialog",6,0),x("visibleChange",function(Le){return T(c),w(i.onVisibleChange(Le))}),_(2,at,2,0)(3,Ct,3,1),r(4,Vt,2,2,"ng-template",null,1,E),v()}n&2&&(P(i.style),l("pt",i.pt)("visible",i.visible)("closable",i.option("closable"))("styleClass",i.cn(i.cx("root"),i.styleClass))("modal",i.option("modal"))("header",i.option("header"))("closeOnEscape",i.option("closeOnEscape"))("blockScroll",i.option("blockScroll"))("appendTo",i.option("appendTo"))("position",i.position)("dismissableMask",i.dismissableMask)("draggable",i.draggable)("baseZIndex",i.baseZIndex)("autoZIndex",i.autoZIndex)("maskStyleClass",i.cn(i.cx("mask"),i.maskStyleClass)),u(2),h(i.headlessTemplate||i._headlessTemplate?2:3))},dependencies:[$,ue,_e,Z,Te,xe,y,b],encapsulation:2,data:{animation:[we("animation",[ne("void => visible",[ae(Rt)]),ne("visible => void",[ae(Ft)])])]},changeDetection:0})}return t})(),Li=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=F({type:t});static \u0275inj=V({imports:[Qt,y,y]})}return t})();export{Be as a,ci as b,Qt as c,Li as d};
