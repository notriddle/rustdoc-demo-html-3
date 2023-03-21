"use strict";function resourcePath(basename,extension){return getVar("root-path")+basename+getVar("resource-suffix")+extension}function hideMain(){addClass(document.getElementById(MAIN_ID),"hidden")}function showMain(){removeClass(document.getElementById(MAIN_ID),"hidden")}function elemIsInParent(elem,parent){while(elem&&elem!==document.body){if(elem===parent){return true}elem=elem.parentElement}return false}function blurHandler(event,parentElem,hideCallback){if(!elemIsInParent(document.activeElement,parentElem)&&!elemIsInParent(event.relatedTarget,parentElem)){hideCallback()}}window.rootPath=getVar("root-path");window.currentCrate=getVar("current-crate");function setMobileTopbar(){const mobileLocationTitle=document.querySelector(".mobile-topbar h2");const locationTitle=document.querySelector(".sidebar h2.location");if(mobileLocationTitle&&locationTitle){mobileLocationTitle.innerHTML=locationTitle.innerHTML}}function getVirtualKey(ev){if("key"in ev&&typeof ev.key!=="undefined"){return ev.key}const c=ev.charCode||ev.keyCode;if(c===27){return"Escape"}return String.fromCharCode(c)}const MAIN_ID="main-content";const SETTINGS_BUTTON_ID="settings-menu";const ALTERNATIVE_DISPLAY_ID="alternative-display";const NOT_DISPLAYED_ID="not-displayed";const HELP_BUTTON_ID="help-button";function getSettingsButton(){return document.getElementById(SETTINGS_BUTTON_ID)}function getHelpButton(){return document.getElementById(HELP_BUTTON_ID)}function getNakedUrl(){return window.location.href.split("?")[0].split("#")[0]}function insertAfter(newNode,referenceNode){referenceNode.parentNode.insertBefore(newNode,referenceNode.nextSibling)}function getOrCreateSection(id,classes){let el=document.getElementById(id);if(!el){el=document.createElement("section");el.id=id;el.className=classes;insertAfter(el,document.getElementById(MAIN_ID))}return el}function getAlternativeDisplayElem(){return getOrCreateSection(ALTERNATIVE_DISPLAY_ID,"content hidden")}function getNotDisplayedElem(){return getOrCreateSection(NOT_DISPLAYED_ID,"hidden")}function switchDisplayedElement(elemToDisplay){const el=getAlternativeDisplayElem();if(el.children.length>0){getNotDisplayedElem().appendChild(el.firstElementChild)}if(elemToDisplay===null){addClass(el,"hidden");showMain();return}el.appendChild(elemToDisplay);hideMain();removeClass(el,"hidden")}function browserSupportsHistoryApi(){return window.history&&typeof window.history.pushState==="function"}function loadCss(cssUrl){const link=document.createElement("link");link.href=cssUrl;link.rel="stylesheet";document.getElementsByTagName("head")[0].appendChild(link)}function preLoadCss(cssUrl){const link=document.createElement("link");link.href=cssUrl;link.rel="preload";link.as="style";document.getElementsByTagName("head")[0].appendChild(link)}(function(){const isHelpPage=window.location.pathname.endsWith("/help.html");function loadScript(url){const script=document.createElement("script");script.src=url;document.head.append(script)}getSettingsButton().onclick=event=>{if(event.ctrlKey||event.altKey||event.metaKey){return}window.hideAllModals(false);addClass(getSettingsButton(),"rotate");event.preventDefault();loadCss(getVar("static-root-path")+getVar("settings-css"));loadScript(getVar("static-root-path")+getVar("settings-js"));preLoadCss(getVar("static-root-path")+getVar("theme-light-css"));preLoadCss(getVar("static-root-path")+getVar("theme-dark-css"));preLoadCss(getVar("static-root-path")+getVar("theme-ayu-css"));setTimeout(()=>{const themes=getVar("themes").split(",");for(const theme of themes){if(theme!==""){preLoadCss(getVar("root-path")+theme+".css")}}},0)};window.searchState={loadingText:"Loading search results...",input:document.getElementsByClassName("search-input")[0],outputElement:()=>{let el=document.getElementById("search");if(!el){el=document.createElement("section");el.id="search";getNotDisplayedElem().appendChild(el)}return el},title:document.title,titleBeforeSearch:document.title,timeout:null,currentTab:0,focusedByTab:[null,null,null],clearInputTimeout:()=>{if(searchState.timeout!==null){clearTimeout(searchState.timeout);searchState.timeout=null}},isDisplayed:()=>searchState.outputElement().parentElement.id===ALTERNATIVE_DISPLAY_ID,focus:()=>{searchState.input.focus()},defocus:()=>{searchState.input.blur()},showResults:search=>{if(search===null||typeof search==="undefined"){search=searchState.outputElement()}switchDisplayedElement(search);searchState.mouseMovedAfterSearch=false;document.title=searchState.title},hideResults:()=>{switchDisplayedElement(null);document.title=searchState.titleBeforeSearch;if(browserSupportsHistoryApi()){history.replaceState(null,window.currentCrate+" - Rust",getNakedUrl()+window.location.hash)}},getQueryStringParams:()=>{const params={};window.location.search.substring(1).split("&").map(s=>{const pair=s.split("=");params[decodeURIComponent(pair[0])]=typeof pair[1]==="undefined"?null:decodeURIComponent(pair[1])});return params},setup:()=>{const search_input=searchState.input;if(!searchState.input){return}let searchLoaded=false;function loadSearch(){if(!searchLoaded){searchLoaded=true;loadScript(getVar("static-root-path")+getVar("search-js"));loadScript(resourcePath("search-index",".js"))}}search_input.addEventListener("focus",()=>{search_input.origPlaceholder=search_input.placeholder;search_input.placeholder="Type your search here.";loadSearch()});if(search_input.value!==""){loadSearch()}const params=searchState.getQueryStringParams();if(params.search!==undefined){searchState.setLoadingSearch();loadSearch()}},setLoadingSearch:()=>{const search=searchState.outputElement();search.innerHTML="<h3 class=\"search-loading\">"+searchState.loadingText+"</h3>";searchState.showResults(search)},};function getPageId(){if(window.location.hash){const tmp=window.location.hash.replace(/^#/,"");if(tmp.length>0){return tmp}}return null}const toggleAllDocsId="toggle-all-docs";let savedHash="";function handleHashes(ev){if(ev!==null&&searchState.isDisplayed()&&ev.newURL){switchDisplayedElement(null);const hash=ev.newURL.slice(ev.newURL.indexOf("#")+1);if(browserSupportsHistoryApi()){history.replaceState(null,"",getNakedUrl()+window.location.search+"#"+hash)}const elem=document.getElementById(hash);if(elem){elem.scrollIntoView()}}if(savedHash!==window.location.hash){savedHash=window.location.hash;if(savedHash.length===0){return}expandSection(savedHash.slice(1))}if(savedHash.startsWith("#impl-")){const splitAt=savedHash.indexOf("/");if(splitAt!==-1){const implId=savedHash.slice(1,splitAt);const assocId=savedHash.slice(splitAt+1);const implElem=document.getElementById(implId);if(implElem&&implElem.parentElement.tagName==="SUMMARY"&&implElem.parentElement.parentElement.tagName==="DETAILS"){onEachLazy(implElem.parentElement.parentElement.querySelectorAll(`[id^="${assocId}"]`),item=>{const numbered=/([^-]+)-([0-9]+)/.exec(item.id);if(item.id===assocId||(numbered&&numbered[1]===assocId)){openParentDetails(item);item.scrollIntoView();setTimeout(()=>{window.location.replace("#"+item.id)},0)}})}}}}function onHashChange(ev){hideSidebar();handleHashes(ev)}function openParentDetails(elem){while(elem){if(elem.tagName==="DETAILS"){elem.open=true}elem=elem.parentNode}}function expandSection(id){openParentDetails(document.getElementById(id))}function handleEscape(ev){searchState.clearInputTimeout();switchDisplayedElement(null);if(browserSupportsHistoryApi()){history.replaceState(null,window.currentCrate+" - Rust",getNakedUrl()+window.location.hash)}ev.preventDefault();searchState.defocus();window.hideAllModals(true)}function handleShortcut(ev){const disableShortcuts=getSettingValue("disable-shortcuts")==="true";if(ev.ctrlKey||ev.altKey||ev.metaKey||disableShortcuts){return}if(document.activeElement.tagName==="INPUT"&&document.activeElement.type!=="checkbox"&&document.activeElement.type!=="radio"){switch(getVirtualKey(ev)){case"Escape":handleEscape(ev);break}}else{switch(getVirtualKey(ev)){case"Escape":handleEscape(ev);break;case"s":case"S":ev.preventDefault();searchState.focus();break;case"+":ev.preventDefault();expandAllDocs();break;case"-":ev.preventDefault();collapseAllDocs();break;case"?":showHelp();break;default:break}}}document.addEventListener("keypress",handleShortcut);document.addEventListener("keydown",handleShortcut);function addSidebarItems(){if(!window.SIDEBAR_ITEMS){return}const sidebar=document.getElementsByClassName("sidebar-elems")[0];function block(shortty,id,longty){const filtered=window.SIDEBAR_ITEMS[shortty];if(!filtered){return}const h3=document.createElement("h3");h3.innerHTML=`<a href="index.html#${id}">${longty}</a>`;const ul=document.createElement("ul");ul.className="block "+shortty;for(const name of filtered){let path;if(shortty==="mod"){path=name+"/index.html"}else{path=shortty+"."+name+".html"}const current_page=document.location.href.split("/").pop();const link=document.createElement("a");link.href=path;if(path===current_page){link.className="current"}link.textContent=name;const li=document.createElement("li");li.appendChild(link);ul.appendChild(li)}sidebar.appendChild(h3);sidebar.appendChild(ul)}if(sidebar){block("primitive","primitives","Primitive Types");block("mod","modules","Modules");block("macro","macros","Macros");block("struct","structs","Structs");block("enum","enums","Enums");block("union","unions","Unions");block("constant","constants","Constants");block("static","static","Statics");block("trait","traits","Traits");block("fn","functions","Functions");block("type","types","Type Definitions");block("foreigntype","foreign-types","Foreign Types");block("keyword","keywords","Keywords");block("traitalias","trait-aliases","Trait Aliases")}}window.register_implementors=imp=>{const implementors=document.getElementById("implementors-list");const synthetic_implementors=document.getElementById("synthetic-implementors-list");const inlined_types=new Set();const TEXT_IDX=0;const SYNTHETIC_IDX=1;const TYPES_IDX=2;if(synthetic_implementors){onEachLazy(synthetic_implementors.getElementsByClassName("impl"),el=>{const aliases=el.getAttribute("data-aliases");if(!aliases){return}aliases.split(",").forEach(alias=>{inlined_types.add(alias)})})}let currentNbImpls=implementors.getElementsByClassName("impl").length;const traitName=document.querySelector(".main-heading h1 > .trait").textContent;const baseIdName="impl-"+traitName+"-";const libs=Object.getOwnPropertyNames(imp);const script=document.querySelector("script[data-ignore-extern-crates]");const ignoreExternCrates=script?script.getAttribute("data-ignore-extern-crates"):"";for(const lib of libs){if(lib===window.currentCrate||ignoreExternCrates.indexOf(lib)!==-1){continue}const structs=imp[lib];struct_loop:for(const struct of structs){const list=struct[SYNTHETIC_IDX]?synthetic_implementors:implementors;if(struct[SYNTHETIC_IDX]){for(const struct_type of struct[TYPES_IDX]){if(inlined_types.has(struct_type)){continue struct_loop}inlined_types.add(struct_type)}}const code=document.createElement("h3");code.innerHTML=struct[TEXT_IDX];addClass(code,"code-header");onEachLazy(code.getElementsByTagName("a"),elem=>{const href=elem.getAttribute("href");if(href&&!/^(?:[a-z+]+:)?\/\//.test(href)){elem.setAttribute("href",window.rootPath+href)}});const currentId=baseIdName+currentNbImpls;const anchor=document.createElement("a");anchor.href="#"+currentId;addClass(anchor,"anchor");const display=document.createElement("div");display.id=currentId;addClass(display,"impl");display.appendChild(anchor);display.appendChild(code);list.appendChild(display);currentNbImpls+=1}}};if(window.pending_implementors){window.register_implementors(window.pending_implementors)}function addSidebarCrates(){if(!window.ALL_CRATES){return}const sidebarElems=document.getElementsByClassName("sidebar-elems")[0];if(!sidebarElems){return}const h3=document.createElement("h3");h3.innerHTML="Crates";const ul=document.createElement("ul");ul.className="block crate";for(const crate of window.ALL_CRATES){const link=document.createElement("a");link.href=window.rootPath+crate+"/index.html";if(window.rootPath!=="./"&&crate===window.currentCrate){link.className="current"}link.textContent=crate;const li=document.createElement("li");li.appendChild(link);ul.appendChild(li)}sidebarElems.appendChild(h3);sidebarElems.appendChild(ul)}function expandAllDocs(){const innerToggle=document.getElementById(toggleAllDocsId);removeClass(innerToggle,"will-expand");onEachLazy(document.getElementsByClassName("toggle"),e=>{if(!hasClass(e,"type-contents-toggle")&&!hasClass(e,"more-examples-toggle")){e.open=true}});innerToggle.title="collapse all docs";innerToggle.children[0].innerText="\u2212"}function collapseAllDocs(){const innerToggle=document.getElementById(toggleAllDocsId);addClass(innerToggle,"will-expand");onEachLazy(document.getElementsByClassName("toggle"),e=>{if(e.parentNode.id!=="implementations-list"||(!hasClass(e,"implementors-toggle")&&!hasClass(e,"type-contents-toggle"))){e.open=false}});innerToggle.title="expand all docs";innerToggle.children[0].innerText="+"}function toggleAllDocs(){const innerToggle=document.getElementById(toggleAllDocsId);if(!innerToggle){return}if(hasClass(innerToggle,"will-expand")){expandAllDocs()}else{collapseAllDocs()}}(function(){const toggles=document.getElementById(toggleAllDocsId);if(toggles){toggles.onclick=toggleAllDocs}const hideMethodDocs=getSettingValue("auto-hide-method-docs")==="true";const hideImplementations=getSettingValue("auto-hide-trait-implementations")==="true";const hideLargeItemContents=getSettingValue("auto-hide-large-items")!=="false";function setImplementorsTogglesOpen(id,open){const list=document.getElementById(id);if(list!==null){onEachLazy(list.getElementsByClassName("implementors-toggle"),e=>{e.open=open})}}if(hideImplementations){setImplementorsTogglesOpen("trait-implementations-list",false);setImplementorsTogglesOpen("blanket-implementations-list",false)}onEachLazy(document.getElementsByClassName("toggle"),e=>{if(!hideLargeItemContents&&hasClass(e,"type-contents-toggle")){e.open=true}if(hideMethodDocs&&hasClass(e,"method-toggle")){e.open=false}});const pageId=getPageId();if(pageId!==null){expandSection(pageId)}}());window.rustdoc_add_line_numbers_to_examples=()=>{onEachLazy(document.getElementsByClassName("rust-example-rendered"),x=>{const parent=x.parentNode;const line_numbers=parent.querySelectorAll(".example-line-numbers");if(line_numbers.length>0){return}const count=x.textContent.split("\n").length;const elems=[];for(let i=0;i<count;++i){elems.push(i+1)}const node=document.createElement("pre");addClass(node,"example-line-numbers");node.innerHTML=elems.join("\n");parent.insertBefore(node,x)})};window.rustdoc_remove_line_numbers_from_examples=()=>{onEachLazy(document.getElementsByClassName("rust-example-rendered"),x=>{const parent=x.parentNode;const line_numbers=parent.querySelectorAll(".example-line-numbers");for(const node of line_numbers){parent.removeChild(node)}})};if(getSettingValue("line-numbers")==="true"){window.rustdoc_add_line_numbers_to_examples()}let oldSidebarScrollPosition=null;window.rustdocMobileScrollLock=function(){const mobile_topbar=document.querySelector(".mobile-topbar");if(window.innerWidth<=window.RUSTDOC_MOBILE_BREAKPOINT){oldSidebarScrollPosition=window.scrollY;document.body.style.width=`${document.body.offsetWidth}px`;document.body.style.position="fixed";document.body.style.top=`-${oldSidebarScrollPosition}px`;if(mobile_topbar){mobile_topbar.style.top=`${oldSidebarScrollPosition}px`;mobile_topbar.style.position="relative"}}else{oldSidebarScrollPosition=null}};window.rustdocMobileScrollUnlock=function(){const mobile_topbar=document.querySelector(".mobile-topbar");if(oldSidebarScrollPosition!==null){document.body.style.width="";document.body.style.position="";document.body.style.top="";if(mobile_topbar){mobile_topbar.style.top="";mobile_topbar.style.position=""}window.scrollTo(0,oldSidebarScrollPosition);oldSidebarScrollPosition=null}};function showSidebar(){window.hideAllModals(false);window.rustdocMobileScrollLock();const sidebar=document.getElementsByClassName("sidebar")[0];addClass(sidebar,"shown")}function hideSidebar(){window.rustdocMobileScrollUnlock();const sidebar=document.getElementsByClassName("sidebar")[0];removeClass(sidebar,"shown")}window.addEventListener("resize",()=>{if(window.innerWidth>window.RUSTDOC_MOBILE_BREAKPOINT&&oldSidebarScrollPosition!==null){hideSidebar()}if(window.CURRENT_TOOLTIP_ELEMENT){const base=window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE;const force_visible=base.TOOLTIP_FORCE_VISIBLE;hideTooltip(false);if(force_visible){showTooltip(base);base.TOOLTIP_FORCE_VISIBLE=true}}});const mainElem=document.getElementById(MAIN_ID);if(mainElem){mainElem.addEventListener("click",hideSidebar)}onEachLazy(document.querySelectorAll("a[href^='#']"),el=>{el.addEventListener("click",()=>{expandSection(el.hash.slice(1));hideSidebar()})});onEachLazy(document.querySelectorAll(".toggle > summary:not(.hideme)"),el=>{el.addEventListener("click",e=>{if(e.target.tagName!=="SUMMARY"&&e.target.tagName!=="A"){e.preventDefault()}})});function showTooltip(e){const notable_ty=e.getAttribute("data-notable-ty");if(!window.NOTABLE_TRAITS&&notable_ty){const data=document.getElementById("notable-traits-data");if(data){window.NOTABLE_TRAITS=JSON.parse(data.innerText)}else{throw new Error("showTooltip() called with notable without any notable traits!")}}if(window.CURRENT_TOOLTIP_ELEMENT&&window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE===e){return}window.hideAllModals(false);const wrapper=document.createElement("div");if(notable_ty){wrapper.innerHTML="<div class=\"content\">"+window.NOTABLE_TRAITS[notable_ty]+"</div>"}else if(e.getAttribute("title")!==undefined){const titleContent=document.createElement("div");titleContent.className="content";titleContent.appendChild(document.createTextNode(e.getAttribute("title")));wrapper.appendChild(titleContent)}wrapper.className="tooltip popover";const focusCatcher=document.createElement("div");focusCatcher.setAttribute("tabindex","0");focusCatcher.onfocus=hideTooltip;wrapper.appendChild(focusCatcher);const pos=e.getBoundingClientRect();wrapper.style.top=(pos.top+window.scrollY+pos.height)+"px";wrapper.style.left=0;wrapper.style.right="auto";wrapper.style.visibility="hidden";const body=document.getElementsByTagName("body")[0];body.appendChild(wrapper);const wrapperPos=wrapper.getBoundingClientRect();const finalPos=pos.left+window.scrollX-wrapperPos.width+24;if(finalPos>0){wrapper.style.left=finalPos+"px"}else{wrapper.style.setProperty("--popover-arrow-offset",(wrapperPos.right-pos.right+4)+"px")}wrapper.style.visibility="";window.CURRENT_TOOLTIP_ELEMENT=wrapper;window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE=e;wrapper.onpointerleave=function(ev){if(ev.pointerType!=="mouse"){return}if(!e.TOOLTIP_FORCE_VISIBLE&&!elemIsInParent(event.relatedTarget,e)){hideTooltip(true)}}}function tooltipBlurHandler(event){if(window.CURRENT_TOOLTIP_ELEMENT&&!elemIsInParent(document.activeElement,window.CURRENT_TOOLTIP_ELEMENT)&&!elemIsInParent(event.relatedTarget,window.CURRENT_TOOLTIP_ELEMENT)&&!elemIsInParent(document.activeElement,window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE)&&!elemIsInParent(event.relatedTarget,window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE)){setTimeout(()=>hideTooltip(false),0)}}function hideTooltip(focus){if(window.CURRENT_TOOLTIP_ELEMENT){if(window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE.TOOLTIP_FORCE_VISIBLE){if(focus){window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE.focus()}window.CURRENT_TOOLTIP_ELEMENT.TOOLTIP_BASE.TOOLTIP_FORCE_VISIBLE=false}const body=document.getElementsByTagName("body")[0];body.removeChild(window.CURRENT_TOOLTIP_ELEMENT);window.CURRENT_TOOLTIP_ELEMENT=null}}onEachLazy(document.getElementsByClassName("tooltip"),e=>{e.onclick=function(){this.TOOLTIP_FORCE_VISIBLE=this.TOOLTIP_FORCE_VISIBLE?false:true;if(window.CURRENT_TOOLTIP_ELEMENT&&!this.TOOLTIP_FORCE_VISIBLE){hideTooltip(true)}else{showTooltip(this);window.CURRENT_TOOLTIP_ELEMENT.setAttribute("tabindex","0");window.CURRENT_TOOLTIP_ELEMENT.focus();window.CURRENT_TOOLTIP_ELEMENT.onblur=tooltipBlurHandler}return false};e.onpointerenter=function(ev){if(ev.pointerType!=="mouse"){return}showTooltip(this)};e.onpointerleave=function(ev){if(ev.pointerType!=="mouse"){return}if(!this.TOOLTIP_FORCE_VISIBLE&&!elemIsInParent(ev.relatedTarget,window.CURRENT_TOOLTIP_ELEMENT)){hideTooltip(true)}}});const sidebar_menu_toggle=document.getElementsByClassName("sidebar-menu-toggle")[0];if(sidebar_menu_toggle){sidebar_menu_toggle.addEventListener("click",()=>{const sidebar=document.getElementsByClassName("sidebar")[0];if(!hasClass(sidebar,"shown")){showSidebar()}else{hideSidebar()}})}function helpBlurHandler(event){blurHandler(event,getHelpButton(),window.hidePopoverMenus)}function buildHelpMenu(){const book_info=document.createElement("span");book_info.className="top";book_info.innerHTML="You can find more information in \
            <a href=\"https://doc.rust-lang.org/rustdoc/\">the rustdoc book</a>.";const shortcuts=[["?","Show this help dialog"],["S","Focus the search field"],["↑","Move up in search results"],["↓","Move down in search results"],["← / →","Switch result tab (when results focused)"],["&#9166;","Go to active search result"],["+","Expand all sections"],["-","Collapse all sections"],].map(x=>"<dt>"+x[0].split(" ").map((y,index)=>((index&1)===0?"<kbd>"+y+"</kbd>":" "+y+" ")).join("")+"</dt><dd>"+x[1]+"</dd>").join("");const div_shortcuts=document.createElement("div");addClass(div_shortcuts,"shortcuts");div_shortcuts.innerHTML="<h2>Keyboard Shortcuts</h2><dl>"+shortcuts+"</dl></div>";const infos=["Prefix searches with a type followed by a colon (e.g., <code>fn:</code>) to \
             restrict the search to a given item kind.","Accepted kinds are: <code>fn</code>, <code>mod</code>, <code>struct</code>, \
             <code>enum</code>, <code>trait</code>, <code>type</code>, <code>macro</code>, \
             and <code>const</code>.","Search functions by type signature (e.g., <code>vec -&gt; usize</code> or \
             <code>-&gt; vec</code>)","Search multiple things at once by splitting your query with comma (e.g., \
             <code>str,u8</code> or <code>String,struct:Vec,test</code>)","You can look for items with an exact name by putting double quotes around \
             your request: <code>\"string\"</code>","Look for items inside another one by searching for a path: <code>vec::Vec</code>",].map(x=>"<p>"+x+"</p>").join("");const div_infos=document.createElement("div");addClass(div_infos,"infos");div_infos.innerHTML="<h2>Search Tricks</h2>"+infos;const rustdoc_version=document.createElement("span");rustdoc_version.className="bottom";const rustdoc_version_code=document.createElement("code");rustdoc_version_code.innerText="rustdoc "+getVar("rustdoc-version");rustdoc_version.appendChild(rustdoc_version_code);const container=document.createElement("div");if(!isHelpPage){container.className="popover"}container.id="help";container.style.display="none";const side_by_side=document.createElement("div");side_by_side.className="side-by-side";side_by_side.appendChild(div_shortcuts);side_by_side.appendChild(div_infos);container.appendChild(book_info);container.appendChild(side_by_side);container.appendChild(rustdoc_version);if(isHelpPage){const help_section=document.createElement("section");help_section.appendChild(container);document.getElementById("main-content").appendChild(help_section);container.style.display="block"}else{const help_button=getHelpButton();help_button.appendChild(container);container.onblur=helpBlurHandler;help_button.onblur=helpBlurHandler;help_button.children[0].onblur=helpBlurHandler}return container}window.hideAllModals=function(switchFocus){hideSidebar();window.hidePopoverMenus();hideTooltip(switchFocus)};window.hidePopoverMenus=function(){onEachLazy(document.querySelectorAll(".search-form .popover"),elem=>{elem.style.display="none"})};function getHelpMenu(buildNeeded){let menu=getHelpButton().querySelector(".popover");if(!menu&&buildNeeded){menu=buildHelpMenu()}return menu}function showHelp(){getHelpButton().querySelector("a").focus();const menu=getHelpMenu(true);if(menu.style.display==="none"){window.hideAllModals();menu.style.display=""}}if(isHelpPage){showHelp();document.querySelector(`#${HELP_BUTTON_ID} > a`).addEventListener("click",event=>{const target=event.target;if(target.tagName!=="A"||target.parentElement.id!==HELP_BUTTON_ID||event.ctrlKey||event.altKey||event.metaKey){return}event.preventDefault()})}else{document.querySelector(`#${HELP_BUTTON_ID} > a`).addEventListener("click",event=>{const target=event.target;if(target.tagName!=="A"||target.parentElement.id!==HELP_BUTTON_ID||event.ctrlKey||event.altKey||event.metaKey){return}event.preventDefault();const menu=getHelpMenu(true);const shouldShowHelp=menu.style.display==="none";if(shouldShowHelp){showHelp()}else{window.hidePopoverMenus()}})}setMobileTopbar();addSidebarItems();addSidebarCrates();onHashChange(null);window.addEventListener("hashchange",onHashChange);searchState.setup()}());(function(){let reset_button_timeout=null;const but=document.getElementById("copy-path");if(!but){return}but.onclick=()=>{const parent=but.parentElement;const path=[];onEach(parent.childNodes,child=>{if(child.tagName==="A"){path.push(child.textContent)}});const el=document.createElement("textarea");el.value=path.join("::");el.setAttribute("readonly","");el.style.position="absolute";el.style.left="-9999px";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);but.children[0].style.display="none";let tmp;if(but.childNodes.length<2){tmp=document.createTextNode("✓");but.appendChild(tmp)}else{onEachLazy(but.childNodes,e=>{if(e.nodeType===Node.TEXT_NODE){tmp=e;return true}});tmp.textContent="✓"}if(reset_button_timeout!==null){window.clearTimeout(reset_button_timeout)}function reset_button(){tmp.textContent="";reset_button_timeout=null;but.children[0].style.display=""}reset_button_timeout=window.setTimeout(reset_button,1000)}}())