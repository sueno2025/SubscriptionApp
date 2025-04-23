    document.addEventListener("DOMContentLoaded",()=>{
        const item = JSON.parse(localStorage.getItem("editTarget"));
        if(!item) return;

        document.querySelector("#service").value=item.service;
        document.querySelector("#price").value=item.price;
        document.querySelector("#payType").value=item.payType;
        document.querySelector("#useFrequency").value=item.useFrequency;
        document.querySelector("#isHide").checked=item.isHide;
        document.querySelector("#canNotCancel").checked=item.canNotCancel;
        const updateBtn = document.querySelector("#updateItem");

        updateBtn.addEventListener("click",(e)=>{
            e.preventDefault();
            
            window.location.href="index.html";
        });
    });

