'use strict';
document.addEventListener('DOMContentLoaded',()=>{
    const service = document.querySelector("#service");
    const price = document.querySelector("#price");
    const payType = document.querySelector("#payType");
    const useFrequency = document.querySelector("#useFrequency");
    const isHide = document.querySelector("#isHide");
    const canNotCancel = document.querySelector("#canNotCancel")
    const bt = document.querySelector("#addItem");
    const ul=document.createElement("ul");
    ul.id = "subscriptioinList";
    document.body.appendChild(ul);

    let list=JSON.parse(localStorage.getItem('subscriptionList'))||[];
    
    const saveToLocalStorage = () =>{
        localStorage.setItem("subscriptionList",JSON.stringify(list));
    }

    const displayList = () =>{
        ul.innerHTML = "";
        list.forEach((item,index)=>{
            const li = document.createElement("li");
            li.dataset.index = index;

            const info=`${item.isHide ? "非表示":""}${item.service}:¥${item.price}/${item.payType}|利用頻度:${item.canNotCancel ? "|解約不可" : ""}`;
            li.textContent = info;

            const delBtn = document.createElement("button");
            delBtn.textContent = "削除";
            delBtn.addEventListener("click",()=>{
                list.splice(index,1);
                saveToLocalStorage();
                displayList();
            });
            li.appendChild(delBtn);
            ul.appendChild(li);
        });
    };
    bt.addEventListener('click',(e)=>{
        e.preventDefault();

        const item ={
            service: service.value.trim(),
            price: parseInt(price.value),
            payType: payType.value,
            useFrequency: parseInt(useFrequency.value),
            isHide: isHide.checked,
            canNotCancel: canNotCancel.checked
        };
        list.push(item);
        saveToLocalStorage();
        displayList();

        //フォームリセット
        service.value="";
        price.value="";
        payType.value="月額";
        useFrequency.value="";
        isHide.checked = false;
        canNotCancel.checked = false;
    });
    displayList();

});