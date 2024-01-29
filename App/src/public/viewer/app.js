document.addEventListener('DOMContentLoaded', async () => {
  const fileMaster = new FileMaster();

  const transaction = {};

  // URL Path Parameter
  const urlparams = new URLSearchParams(location.search);
  transaction.id = urlparams.get('id');

  // Fetch Link Request
  try {
    const res = await fetch(`http://localhost:8080/api/link/inquery/` + transaction.id);
    if (!res.ok) { throw new Error("server connection error"); }
    const data = await res.json();
    if (!data) { throw new Error("invalid ID"); }
    transaction.data = data;
  } catch (error) {
    console.error(error);
  }

  const form1 = document.getElementById("file-selecter");
  const recentFiles = await fileMaster.getRecentFiles();

  if (recentFiles.length == 0) {
    console.error("no recent files")
    return;
  }

  recentFiles.forEach((fileHandle, index) => {
    const option = document.createElement("option");
    option.setAttribute("value", index);
    option.innerText = fileHandle.name;
    form1.files.appendChild(option);
  });

  form1.open.addEventListener("click", async (event) => {
    event.preventDefault();

    // file open
    const index = form1.files.selectedIndex;
    (await fileMaster.setFileHandle(recentFiles[index]));
    console.log(fileMaster.getFileContent());

    // Check up user account
    if (!fileMaster.isDataEmpty()) {
      const secrets = fileMaster.getSecrets();
      const pwd = await myPrompt("Enter アカウントストア PWD:");
      try {
        await secrets.decrypt(pwd);
      } catch (error) {
        console.error(error);
        return alert("複合化でエラー。やり直してください。");
      }
      const finder = secrets.isExistService(transaction.data.requester_id);
      if (finder > -1) {
        // sign in
        const signin = await myConfirm("アカウントが見つかりました。サインインしますか？");
        if (!signin) {
          console.log("サインインを中断しました");
          return;
        } else {
          console.log("サインインしました");
          return;
        }
      }
    } else {
      console.log("this file has no data", transaction.data);
    }

    // new account
    const signup = await myConfirm("サインアップしますか?");
    if (!signup) {
      console.log("サインアップを中断しました。終了します");
      return;
    }
  });

  const form2 = document.getElementById("new-account-config");
  form2.checkout.addEventListener("click", async (event) => {
    event.preventDefault();

    alert("入力されたパスワードでアカウントを作成しました。")

    transaction.newAccount = {
      serviceid: transaction.data.requester_id,
      account: {
        signuptime: new Date().getTime(),
        scope: (transaction.data.scope.includes("none")) ? ["none"] : transaction.data.scope,
        password: form2.password.value
      }
    }

    console.log("transaction.newAccount", transaction.newAccount);
    const secrets = fileMaster.getSecrets();

    if (!fileMaster.isDataEmpty()) {
      // Need decrypt
      const pwd = await myPrompt("アカウントストア PWD: ");
      try {
        await secrets.decrypt(pwd);
      } catch (error) {
        console.error(error);
        return alert("複合化でエラー。やり直してください。");
      }
    }  // Else data is blank currently

    secrets.pushAccount(transaction.newAccount);
    const newPwd = await myPrompt("New アカウントストア PWD: ");
    const cipher = await secrets.encrypt(newPwd);
    fileMaster.setCipherAsString(cipher);
    await fileMaster.writeOut();
  });
});