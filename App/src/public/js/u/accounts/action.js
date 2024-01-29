{
    const TopNotification = class {
        constructor() {
            this.success = document.getElementById("success-message");
            this.failure = document.getElementById("fail-message");
        }
    
        viewSuccess (message = "Success") {
            this.success.innerText = message;
            this.failure.closest(".notification").classList.add("hidden");
            this.success.closest(".notification").classList.remove("hidden");
        }
    
        viewFail (message = "Failed") {
            this.failure.innerText = message;
            this.success.closest(".notification").classList.add("hidden");
            this.failure.closest(".notification").classList.remove("hidden");
        }
    }

    const TopNf = new TopNotification();

    // Nickname 更新
    document.getElementById("action-user-nickname").addEventListener("click", (event) => {
        event.preventDefault();
        const input = document.getElementById("user-nickname");
        doUpdate("nickname", input.value)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            console.log('応答 /u/update/account:', data);
            if (data.result) {
                // Success
    
                // notification
                TopNf.viewSuccess("成功しました #ニックネームを更新");
                
                // update nickname
                document.getElementById("user-nickname-status").innerText = input.value;
                input.value = "";
    
            } else {
                throw new Error();
            }
        })
        .catch((err) => {
            console.error(err);
            // Fail
            TopNf.viewFail("失敗しました");
        })
    });

    // Email 更新
    document.getElementById("action-user-email").addEventListener("click", (event) => {
        event.preventDefault();
    
        const input = document.getElementById("user-email");
        doUpdate("email", input.value)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            console.log('応答 /u/update/account:', data);
            if (data.result) {
                // Success
    
                // notification
                TopNf.viewSuccess("成功しました #メールアドレスを更新");
                
                // update nickname
                document.getElementById("user-email-status").innerText = input.value;
                input.value = "";
    
            } else {
                throw new Error(data.error);
            }
        })
        .catch((err) => {
            console.error(err);
            // Fail
            if (err.message == "UNIQUE") {
                TopNf.viewFail("失敗しました. このメールアドレスはすでに使われています");
            } else {
                TopNf.viewFail("失敗しました");
            }
        })
    });

    // Public User ID 更新
    document.getElementById("action-user-publicuserid").addEventListener("click", (event) => {
        event.preventDefault();
    
        const input = document.getElementById("user-publicuserid");
        doUpdate("public_user_id", input.value)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            console.log('応答 /u/update/account:', data);
            if (data.result) {
                // Success
    
                // notification
                TopNf.viewSuccess("成功しました #Public User ID を更新");
                
                // update nickname
                document.getElementById("user-publicuserid-status").innerText = input.value;
                input.value = "";
    
            } else {
                throw new Error(data.error);
            }
        })
        .catch((err) => {
            console.error(err);
            // Fail
            if (err.message == "UNIQUE") {
                TopNf.viewFail("失敗しました. この Public User ID はすでに使われています");
            } else {
                TopNf.viewFail("失敗しました");
            }
        })
    });
}

function doUpdate(datatype, datavalue) {
    return fetch("/u/update/account", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
                datatype: datatype,
                datavalue: datavalue
            })
    });
}