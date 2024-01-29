class FormAction {
    constructor(formName) {
        this.form = document.forms[formName];
    }

    putPasswordSwitch (buttonName = "btn_passwd_view", inputName = "password") {
        const button = this.form[buttonName];
        button.addEventListener("click", (e) => {
            if (this.form[inputName].type === "password") {
                this.form[inputName].type = "text";
            } else {
                this.form[inputName].type = "password";
            }
        });
    }

    addKeyDownSubmit (targetElementName = "password") {
        this.form[targetElementName].addEventListener("keydown", (event) => {
            if (event.isComposing || event.keyCode === 13) {
                this.form.submit();
            }
        });
    }

    addEventHref (elementId, href) {
        const target = document.getElementById(elementId);
        target.addEventListener("click", (e) => {
            window.location.href = href;
        });
    }

    addEventSubmit (elementId) {
        const target = document.getElementById(elementId);
        target.addEventListener("click", (e) => {
            this.form.submit();
        });
    }
}

const viewError = function (key = "e", targetId = "errmsg", messageObject = {}) {
    const url = new URL(window.location.href);
    const err = url.searchParams.get(key);
    if (err != null) {
        const target = document.getElementById(targetId);
        target.innerText =  (messageObject.hasOwnProperty(err))
            ? messageObject[err]
            : err;
        target.style.display = "block";
    }
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const myEscape = function (str) {
    return str
        .replace(/\'/g, "\\'")
        .replace(/\"/g, '\\"')
        .replace(/\//g, '\\/');
};

class FormatChecker {
    constructor(){
        this.constrains = {
            passwd: "a-zA-Z0-9!@#$%^&_+-",
            naming: "!@#$%^&*()_+{}[]:;<>,.?~\\/-"
        };
        this.regexp = {
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            passwd: /[^a-zA-Z0-9!@#$%^&_+-]/,   // White List
            naming: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/  // Black list
        }
    }

    email(input){ return this.regexp.email.test(input); }
    passwd(input){ return this.regexp.passwd.test(input); }
    naming(input){ return !this.regexp.naming.test(input); }
}

function isInvalid(text) {
    const invalidCharsPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    return invalidCharsPattern.test(text);
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    const invalidCharsPattern = /[^a-zA-Z0-9!@#$%^&_+-]/;
    return !invalidCharsPattern.test(password);
}

// ポップアップウィンドウ
const PopupWindow = class {
    constructor(){
        this.pwid;
        this.window;
        this.REMOVE;
        this.setElement();
    }

    remove() {
        this.window.remove();
    }

    show(){
        this.window.classList.remove("disabled");
    }

    set ({
        header = "注意",
        content = ""
    }) {
        const pwHeader = this.window.querySelector(".popup-header");
        const pwContent = this.window.querySelector(".popup-content");

        // popup-header
        {
            const h1 = document.createElement("h1");
                h1.innerText = header;
            pwHeader.appendChild(h1);
        }

        // popup-content
        {
            const p = document.createElement("p");
                p.innerHTML = content;
            pwContent.appendChild(p);
        }
    }
    
    button ({
        label = "OK",
        type = "submit",
        classList = ["main-btn"],
        callback = ()=>{}
    }) {
        const pwFooter = this.window.querySelector(".popup-footer");

        const btnId = "pwbtnid-" + this.pwid + "-" + pwFooter.childElementCount;

        const input = document.createElement("input");
            input.setAttribute("type", type);
            input.setAttribute("value", label);
            input.id = btnId;

        classList.forEach(cls => input.classList.add(cls));

        pwFooter.appendChild(input);
        
        pwFooter.querySelector("#" + btnId).addEventListener("click", e => {
            document.querySelector("#" + this.pwid).remove();
            callback(e);
        });
    }

    cancel ({
        label = "Cancel",
        type = "button",
        classList = [],
        callback = ()=>{}
    }){
        const pwFooter = this.window.querySelector(".popup-footer");

        const btnId = "pwbtnid-" + this.pwid + "-" + pwFooter.childElementCount;

        const input = document.createElement("input");
            input.setAttribute("type", type);
            input.setAttribute("value", label);
            input.id = btnId;

        classList.forEach(cls => input.classList.add(cls));

        pwFooter.appendChild(input);
        
        pwFooter.querySelector("#" + btnId).addEventListener("click", e => {
            document.querySelector("#" + this.pwid).remove();
            callback(e);
        });
    }

    setElement() {
        this.pwid = "pwid-" + (document.querySelectorAll(".popup-window").length);

        if ("content" in document.createElement("template")) {
            // template 対応
            const template = document.getElementById("template-popup-window");
            const content = template.content.cloneNode(true);

            content.querySelector(".popup-window").id = this.pwid;
            content.querySelector(".popup-window").classList.add("disabled");

            document.body.appendChild(content);

            this.window = document.querySelector("#" + this.pwid);

            console.log("Created popup window: ", this.window);
        } else {
            // template 非対応
            console.log("This browser is not supported");
        } 

        {
            this.REMOVE = function (elem){
                const pwid = elem.id.split("-")[1];
                console.log("this.pwid: ", pwid)
                document.querySelector("#" + pwid).remove();
            }
        }
    }
}

// function showPopupWindow (
//     headerHTML = "", contentHTML = "",
//     onSubmit = ()=>{}, onCancel = ()=>{},
//     buttonValue = "キャンセル", submitValue = "OK"
// ) {
//     if (document.querySelector(".popup-window") != null) document.querySelector(".popup-window").remove(); // すでにポップアップがあれば削除

//     if ("content" in document.createElement("template")) {
//         // template 対応
//         const template = document.getElementById("template-popup-window");
//         const content = template.content.cloneNode(true);
//         content.querySelector(".popup-header").innerHTML = headerHTML;
//         content.querySelector(".popup-content").innerHTML = contentHTML;
//         content.querySelector(".popup-window-btn-cancel").value = buttonValue;
//         content.querySelector(".popup-window-btn-ok").value = submitValue;

//         content.querySelector(".popup-window-btn-cancel").addEventListener("click", event => {
//             document.querySelector(".popup-window").remove();
//             onCancel();
//         });

//         content.querySelector(".popup-window-btn-ok").addEventListener("click", event => {
//             document.querySelector(".popup-window").remove();
//             onSubmit();
//         });

//         document.body.appendChild(content);
//     } else {
//         // template 非対応
//         console.log("This browser is not supported");
//     }  
// }

// NOTIFICATION
const TopNotification = class {
    constructor() {
        this.notification = null;
        if (("content" in document.createElement("template"))) {
            if (document.querySelector(".notification") == null) {
                const template = document.getElementById("template-notification");
                const content = template.content.cloneNode(true);

                // Close event
                content.querySelector(".notification-close").addEventListener("click", (event) => {
                    document.querySelector(".notification").classList.add("hidden");
                });
                document.body.appendChild(content);
            }
        } else {
            console.log("This browser is not supported");
        }
    }

    viewSuccess (message = "Success") {
        this.notification = (this.nt) ? this.nt : document.querySelector(".notification"); // 初回ならquerySelector
        this.notification.classList.add("hidden"); // すでに表示中なら非表示に
        this.notification.classList.remove("nt-red");
        this.notification.classList.add("nt-green");
        this.notification.querySelector(".notification-status-message").innerText = message;
        this.notification.classList.remove("hidden");
    }

    viewFail (message = "Failed") {
        this.notification = (this.nt) ? this.nt : document.querySelector(".notification");
        this.notification.classList.add("hidden");
        this.notification.classList.remove("nt-green");
        this.notification.classList.add("nt-red");
        this.notification.querySelector(".notification-status-message").innerText = message;
        this.notification.classList.remove("hidden");
    }
}

// panel
document.querySelectorAll(".panel").forEach((pnl, i) => {
    const target = pnl.querySelector(".panel-window");  // 非表示／表示 切り替え
    pnl.querySelector(".panel-tab-btn").addEventListener("click", (evt) => {
        evt.preventDefault();
        if (target.classList.contains("hidden")) {
            // switch 非表示 -> 表示
            target.classList.remove("hidden");
        } else {
            // switch 表示 -> 非表示
            target.classList.add("hidden");
        }
    })
})