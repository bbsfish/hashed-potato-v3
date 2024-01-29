window.addEventListener("DOMContentLoaded", () => {
    main();
})

const main = () => {
    const TopNf = new TopNotification();

    // Ban Email Login 更新
    const button = document.getElementById("actions-banemaillogin");
    const status = document.getElementById("user-banemaillogin-status");
    const input = document.getElementById("user-banemaillogin");

    button.addEventListener("click", (event) => {
        event.preventDefault();
        if (input.value == 1) {
            const pw = new PopupWindow();
            pw.set({
                header: "注意",
                content: `
                    メールアドレスでのログインを拒否すると、ログインIDとしてメールアドレスは利用できなくなり、
                    Public User IDのみをログインIDとして利用することになります。
                    したがって、適切なPublic User IDを設定する必要があります。
                    <a href="/u/account#user-publicuserid">Public User ID の設定はこちら</a>
                `
            });
            pw.cancel({
                label: "変更を取りやめる"
            });
            pw.button({
                label: "設定の変更を続ける",
                type: "submit",
                classList: ["main-btn"],
                onClick: function(){
                    pw.remove();
                    doUpdateBanEmailLogin();
                }
            });
            pw.show();
        } else {
            doUpdateBanEmailLogin();
        }
    });

    function doUpdateBanEmailLogin() {
        fetch("/u/update/banemaillogin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                    datavalue: input.value
                })
        })
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                console.log('応答 /u/update/account:', data);
                if (data.result) return;
                else throw new Error();
            })
            .then(() => {
                // Success
                // notification
                TopNf.viewSuccess(`成功しました #メールアドレスでログインを ${(input.value == 1) ? "拒否" : "許可"} に設定`);
                
                // update nickname
                status.innerText = (input.value == 1) ? "拒否" : "許可"; // Status update
                status.style.color = (input.value == 1) ? "red" : "#00BA00";

                button.value = `メールアドレスでログインを${(input.value == 1) ? "許可" : "拒否"}する`; // button text update

                input.value = (input.value == 1) ? 0 : 1; // hidden input value update
            })
            .catch((err) => {
                console.error(err);
                // Fail
                TopNf.viewFail("失敗しました");
            });
    }
}