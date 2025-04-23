'use strict';
document.addEventListener("DOMContentLoaded", () => {
    //ローカルストレージからデータの取得
    const item = JSON.parse(localStorage.getItem("editTarget"));
    const index = parseInt(localStorage.getItem("editIndex"));
    if (!item) return;

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

        //入力値を元にオブジェクトを作成
        const editItem = {
            service: service,
            price: parseInt(price),
            payType: payType,
            useFrequency: parseInt(useFrequency),
            isHide: isHide,
            canNotCancel: canNotCancel,
            index: index
        };
        localStorage.setItem("editedItem", JSON.stringify(editItem));
        

        window.location.href = "index.html";
    });
});

