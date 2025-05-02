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

    //ローカルストレージからデータ取得
    let list = JSON.parse(localStorage.getItem('subscriptionList')) || [];
    const container = document.createElement("div");
    container.className = "table-container";
    document.body.appendChild(container);
    //リストの作成
    const table = document.createElement("table");
    table.id = "subscriptionTable";
    //table.border = "1";  //cssを追加したら消す
    container.appendChild(table);



    const displayList = () => {
        //adminからのページ遷移後のデータ取得
        const editedItem = JSON.parse(localStorage.getItem("editedItem"));
        //nullチェック
        if (editedItem) {
            const index = list.findIndex(item => item.id === editedItem.id);
            //変更したcolmunがあった場合
            if (index !== -1) {
                list[index] = editedItem;
                saveToLocalStorage();
            }
            localStorage.removeItem("editedItem");
        }
        //テーブルの初期化、見出し行作成
        table.innerHTML = "";
        const thead = document.createElement("thead");
        thead.innerHTML = `
        <tr>
        <th>サービス</th>
        <th>料金</th>
        <th>タイプ</th>
        <th>利用頻度</th>
        <th colspan=2>更新</th>
        </tr> 
        
        `;
        table.appendChild(thead);


        const tbody = document.createElement("tbody");
        // 使用頻度の高い順にソート
        list.sort((a, b) => b.useFrequency - a.useFrequency);
        list.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.dataset.index = index;

            tr.innerHTML = `
            <td>${item.isHide ? "secret" : item.service}</td>  
            <td>${item.price}円</td>  
            <td>${item.payType}</td>  
            <td>${item.useFrequency}</td>  
            <td>${item.canNotCancel ? "" : `<button class="delete-btn">削除</button>`}
            </td>  
            <td><button class="update-btn">変更</button></td>  
            `
            //削除ボタン機能
            if (!item.canNotCancel) {
                tr.querySelector(".delete-btn")?.addEventListener("click", () => {
                    //alert表示
                    const confirmed = confirm("この項目を削除してもよろしいですか？");
                    if (confirmed) {
                        list.splice(index, 1);
                        saveToLocalStorage();
                        displayList();
                    }
                })
            };
            tbody.appendChild(tr);
            //更新ボタンでのページ遷移
            tr.querySelector(".update-btn")?.addEventListener("click", () => {
                const itemData = list[index];
                localStorage.setItem("editTarget", JSON.stringify(itemData));
                localStorage.setItem("editIndex", index);
                window.location.href = "admin.html";
            });
        });

        table.appendChild(tbody);

    };

    //ローカルストレージに保存
    const saveToLocalStorage = () => {
        localStorage.setItem("subscriptionList", JSON.stringify(list));
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
            return;
        } if (isNaN(parseInt(freqVal))) {
            alert("利用頻度は半角の数字で入力してください");
            return;
        }
        if (freqVal < 1 || freqVal > 10) {
            alert("利用頻度は1〜10の範囲で入力してください");
            return;
        }
    
        //入力値を元にオブジェクトを作成
        const item = {
            id:Date.now(),
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

    //合計金額の表示
    const monthly = Math.round(calcMonth(list));
    const yearly = calcYear(list);
    const result = document.createElement("div");
    result.innerHTML = `
    <h5>現在の加入状況</h5>
    <p>毎月の支払額 : ${monthly}円</p>
    <p>年間の支払額: ${yearly}円</p>
    `;
    document.body.appendChild(result);
    //これは後半に配置する
    //利用頻度３以上のアイテムだけ残したリスト
    const filteredList = list.filter(item => item.useFrequency > 3 || item.canNotCancel);
    //金額の算出
    const monthlyCurrent = Math.round(calcMonth(list));
    const yearlyCurrent = calcYear(list);
    const monthlyFiltered = Math.round(calcMonth(filteredList));
    const yearlyFiltered = calcYear(filteredList);
    //差額の算出
    const monthlyDiff = monthlyCurrent - monthlyFiltered;
    const yearlyDiff = yearlyCurrent - yearlyFiltered;

    //表示部分
    const savingMessage = document.createElement("div");
    savingMessage.innerHTML = `
            <h5>もし利用頻度が3以下のサービスを解約したら...?</h5>
            <p>一ヶ月あたり<strong>${monthlyDiff}円</strong>の節約になります</p>
            <p>年間の節約額は<strong>${yearlyDiff}円</strong>です</p>
        `;
    document.body.appendChild(savingMessage)




    //合計月額の計算関数
    function calcMonth(list) {
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].payType == "月額") {
                sum += list[i].price;
            } else {
                sum += list[i].price / 12;
            }
        }
        return sum;

    }
    //合計年額の計算関数
    function calcYear(list) {
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].payType == "年額") {
                sum += list[i].price;
            } else {
                sum += list[i].price * 12;
            }
        }
        return sum;
    }


});