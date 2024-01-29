// # Commit
//
// ## Cancel
document.getElementById("cancelCommit").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = FM;
});
// ## Try
document.getElementById("tryCommit").addEventListener("click", (event) => {
    const errorblock = document.getElementById(ERRMSG_IDS.commit);

    event.preventDefault();

    // Collect form values
    const inputs = (() => {
        let arr = [];
        document.querySelectorAll(".commit-content")
        .forEach(el => {
            if (!el.classList.contains("disabled")) {
                // 必要な（表示中の）infotypeのみ
                arr.push(el.getElementsByTagName("input")[0]);
            }
        });
        return arr;
    })();

    // Check form values
    try {
        inputs.forEach((input => {
            if (input.value.trim() == "") {
                errorblock.innerHTML = "項目を空にすることはできません";
                errorblock.style.display = "block";
                throw null;
            }
        }));
    } catch (error) {
        console.error(error);
        return;
    }

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

    let bodyobj = {}; // post body obj
    inputs.forEach(element => bodyobj[element.name] = element.value);

    // Ajax /link/commit
    fetch(HOST + "/link/commit", options(bodyobj))
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            console.log('応答 /link/commit:', data);
            if (data.result) {
                // 登録成功
                // 不足データなしか再問合せ
                lookupHistory();
            } else {
                // 登録失敗
                throw `不明なエラーが発生しました. <a href="${FM}">もとのサービスに戻る</a>`;
            }
        }).catch((error) => {
            errorblock.innerHTML = error;
            errorblock.style.display = "block";
        });
});

function enableCommit(enabledScopes) {
    const arr = enabledScopes;
    arr.forEach(scope => {
        document.getElementById(`tmp-${scope}`).classList.remove("disabled");
    });
}

// Lookup Linkages
// 
function lookupHistory() {
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

    // Ajax /link/history
    fetch(HOST + "/link/history", options())
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            console.log('応答 /link/history:', data);
            if (data.connected) {
                // 記録あり
                // 
                window.location.href = FM;
                throw null
            } else {
                // 記録なし

                return data;
            }
        })
        .then(data => {
            // 記録なし -> 連携処理
            if (data.required.length == 0) {
                // 要求データなし
                toggleit([1, 0]);
                viewDataList(data.scope);
            } else {
                // 要求データあり
                // -> # Commit の該当データフォームを活性化
                data.required.forEach(scope => document.getElementById(`tmp-${scope}`).classList.remove("disabled"));
                setPrvCtVisibleBtn();
                toggleit([0, 1]);
            }
            setPrvCtVisibleBtn();
        }).catch(error => console.error(error));
}
