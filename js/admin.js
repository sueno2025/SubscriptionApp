'use strict';
//変更が反映されない5/1
document.addEventListener("DOMContentLoaded", () => {

    //ローカルストレージからデータの取得
    const item = JSON.parse(localStorage.getItem("editTarget"));
    if (!item) return;

    document.querySelector("#itemId").value = item.id;
    document.querySelector("#service").value = item.service;
    document.querySelector("#price").value = item.price;
    document.querySelector("#payType").value = item.payType;
    document.querySelector("#useFrequency").value = item.useFrequency;
    document.querySelector("#isHide").checked = item.isHide;
    document.querySelector("#canNotCancel").checked = item.canNotCancel;
    const updateBtn = document.querySelector("#updateItem");


    updateBtn.addEventListener("click", (e) => {

        e.preventDefault();

        //更新後の値の取得

        const service = document.querySelector("#service").value.trim();
        const price = document.querySelector("#price").value;
        const payType = document.querySelector("#payType").value;
        const useFrequency = document.querySelector("#useFrequency").value;
        const isHide = document.querySelector("#isHide").checked;
        const canNotCancel = document.querySelector("#canNotCancel").checked;
        //バリデーション
        
        
        
        if (!service || !price|| !useFrequency) {
            alert("未入力または不正な値の項目があります。");
            return;
        }
        //ここは通らない？
        if (isNaN(parseInt(price))) {
            alert("価格はは半角の数字で入力してください");
            return;
        } if (isNaN(parseInt(useFrequency))) {
            alert("利用頻度は半角の数字で入力してください");
            return;
        }
        if (useFrequency < 1 || useFrequency > 10) {
            alert("利用頻度は1〜10の範囲で入力してください");
            return;
        }


        //入力値を元にオブジェクトを作成
        const editItem = {
            id: parseInt(document.querySelector("#itemId").value),
            service: service,
            price: parseInt(price),
            payType: payType,
            useFrequency: parseInt(useFrequency),
            isHide: isHide,
            canNotCancel: canNotCancel,
        };
        localStorage.setItem("editedItem", JSON.stringify(editItem));


        window.location.href = "index.html";
    });
});

