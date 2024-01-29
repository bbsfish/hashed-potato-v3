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