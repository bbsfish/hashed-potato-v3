document.querySelectorAll(".private-data-content").forEach(wrapper => {
    const datatype = wrapper.querySelector(".private-data-type").value;
    const databody = wrapper.querySelector(".private-data-body");
    const plus = wrapper.querySelector(".plus");
    const tooglebtn = wrapper.querySelector(".toggle-view");
    wrapper.querySelector(".plus").addEventListener("click", (event) => {
        event.preventDefault();
        databody.classList.remove("disabled");
        if (plus.classList.contains("show")) {
            // 隠す
            databody.classList.add("disabled");
            plus.classList.remove("show");
            plus.textContent = "表示する";
            wrapper.querySelector(".plus").innerText = "*****";
        } else {
            // 表示
            databody.classList.remove("disabled");
            plus.classList.add("show");
            plus.textContent = "隠す";
        }
    })
    const datavalue = wrapper.querySelector(".data-value");
    const changedatabtn = wrapper.querySelector(".btn-change-data-content");
})

// # Confirm
// 
// 
// ## Cancel
document.getElementById("cancelConfirm").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = FM;
});
// ## Try
document.getElementById("tryConfirm").addEventListener("click", (event) => {
    const errorblock = document.getElementById(ERRMSG_IDS.confirm);

    event.preventDefault();

    const uSrvLabel = document.getElementById("user-service-label").value.trim(); // Collect form value

    // Ajax Prepare
    const options = (bodyObject = {}) => {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(bodyObject)
        }
    }
    // ------------

    // Ajax /link/confirm
    fetch(HOST + "/link/confirm", options({
        usersServiceLabel: uSrvLabel
    }))
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            console.log('応答 /link/confirm:', data);
            if (data.result) {
                // 登録成功
                window.location.href = (FM) ? FM : "/";
            } else {
                // 登録失敗
                if (data.error == "session_expired") throw `セッションが切れました. <a href="${FM}">もとのサービスに戻る</a>`;
                if (data.error == "database") throw `登録中にエラーが発生しました. <a href="${FM}">もとのサービスに戻る</a>`;
            }
        })
        .catch((error) => {
            errorblock.innerHTML = error;
            errorblock.style.display = "block";
        });
});

function inquiryPrivateDataValue(data_type) {
    const errorElement = document.getElementById("error-message");
    errorElement.style.display = "none";

    fetch("/link/pinfo?type=" + data_type, {method: "GET"})
        .then(response => {
            if (!response.ok) throw new Error("response error");
            return response.json();
        })
        .then(data => {
            console.log('応答 /link/pinfo:', data);

            if (data.result) {
                // 取得成功

            } else {
                // 取得失敗
                switch (data.error) {
                    case "database":
                        errorElement.innerText = `エラーが発生しました. <a href="${FM}">もとのサービスに戻る</a>`;

                    case "session_expired":
                        errorElement.innerText = `セッションが切れました. <a href="${FM}">もとのサービスに戻る</a>`;

                    case "not_required":
                        errorElement.innerText = `不正なデータが要求され、ブロックされました. <a href="${FM}">もとのサービスに戻る</a>`;

                    case "invalid_content":
                        errorElement.innerText = `エラーが発生しました. <a href="${FM}">もとのサービスに戻る</a>`;

                    default:
                        break;
                }
                errorElement.style.display = "block";
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
