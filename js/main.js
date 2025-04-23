'use strict';
//HTMLのすべての要素を読み込んだあとに実行(null防止)
document.addEventListener('DOMContentLoaded', () => {
    //DOMの取得
    const service = document.querySelector("#service");
    const price = document.querySelector("#price");
    const payType = document.querySelector("#payType");
    const useFrequency = document.querySelector("#useFrequency");
    const isHide = document.querySelector("#isHide");
    const canNotCancel = document.querySelector("#canNotCancel")
    const bt = document.querySelector("#addItem");


    //リストの作成
    const ul = document.createElement("ul");
    ul.id = "subscriptionList";
    document.body.appendChild(ul);
    //ローカルストレージからデータ取得
    let list = JSON.parse(localStorage.getItem('subscriptionList')) || [];

    //ローカルストレージに保存
    const saveToLocalStorage = () => {
        localStorage.setItem("subscriptionList", JSON.stringify(list));
    }
    //リストを画面に表示する関数
    const displayList = () => {
        //ulの中身を空文字に
        ul.innerHTML = "";
        list.forEach((item, index) => {
            const li = document.createElement("li");
            li.dataset.index = index;

            const info = `${item.isHide ? "非表示" : ""}${item.service}:${item.price}円|${item.payType}|利用頻度${item.canNotCancel ? "|解約不可" : ""}`;
            li.textContent = info;

            const delBtn = document.createElement("button");
            delBtn.textContent = "削除";
            delBtn.addEventListener("click", () => {
                list.splice(index, 1);
                saveToLocalStorage();
                displayList();
            });
            li.appendChild(delBtn);
            ul.appendChild(li);
        });
    };
    //「追加」ボタンのクリックイベント
    bt.addEventListener('click', (e) => {
        e.preventDefault();
        //バリデーション
        const serviceVal = service.value.trim();
        const priceVal = price.value.trim();
        const freqVal = useFrequency.value.trim();
        if (!serviceVal || !priceVal || !freqVal) {
            alert("未入力または不正な値の項目があります。");
            return;
        }
        //ここは通らない？
        if (isNaN(parseInt(priceVal))) {
            alert("価格はは半角の数字で入力してください");
        } if (isNaN(parseInt(freqVal))) {
            alert("利用頻度は半角の数字で入力してください");
        }
        //入力値を元にオブジェクトを作成
        const item = {
            service: service.value.trim(),
            price: parseInt(price.value),
            payType: payType.value,
            useFrequency: parseInt(useFrequency.value),
            isHide: isHide.checked,
            canNotCancel: canNotCancel.checked
        };
        //リストに追加、ローカルストレージに保存、リストの表示
        list.push(item);
        saveToLocalStorage();
        displayList();

        //フォームリセット
        service.value = "";
        price.value = "";
        payType.value = "月額";
        useFrequency.value = "";
        isHide.checked = false;
        canNotCancel.checked = false;
    });
    //初回リスト表示
    displayList();

});