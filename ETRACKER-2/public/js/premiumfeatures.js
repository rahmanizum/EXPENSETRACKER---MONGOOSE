const lbplaceholder = elements.premiumdiv.querySelector('#lbplaceholder');
const completedownloadbtn = elements.premiumdiv.querySelector('#completedownloadbtn');
const historyplaceholder = elements.premiumdiv.querySelector('#historyplaceholder');
const reportButton = document.querySelector('#list-messages-list');

const reportElement = {
    select : document.querySelector('#reportFilter'),
    total: report_table.querySelector('#report_total'),
    td1 : report_body.querySelector('#td1'),
    td2 : report_body.querySelector('#td2'),
    td3 : report_body.querySelector('#td3'),
    td4 : report_body.querySelector('#td4'),
    td5 : report_body.querySelector('#td5'),
    td6 : report_body.querySelector('#td6'),
    td7 : report_body.querySelector('#td7'),
    td8 : report_body.querySelector('#td8'),
    td9 : report_body.querySelector('#td9'),
}
let option = "cweek";
completedownloadbtn.addEventListener('click', downloadData);
reportButton.addEventListener('click',fetchReport(option));
reportElement.select.addEventListener('change',SelectOption);

function SelectOption(){
    option = reportElement.select.value||'cweek'
    fetchReport(option)
}
async function fetchReport(option){
    // const option = reportElement.select.value;
    let startDate,endDate;
    const today = new Date();    
switch(option){
    case 'cweek':
        startDate = new Date();
        startDate.setDate(today.getDate()-7);
        endDate = new Date();
        break;
    case 'lweek':
        startDate = new Date();
        startDate.setDate(today.getDate()-14);
        endDate = new Date();
        endDate.setDate(today.getDate() - 7);
        break;
    case 'cmonth':
        startDate = new Date();
        startDate.setDate(1);
        endDate = new Date();
        break;
    case 'lmonth':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth()-1,1);
        endDate = new Date();
        endDate.setMonth(endDate.getMonth(),0);
        break;
    case 'cyear':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear(),0,1);
        endDate = new Date();
        break;
    case 'lyear':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1, 0, 1);
        endDate = new Date();
        endDate.setFullYear(endDate.getFullYear(), 0, 0);
        break;
}
const data = {
    startDate,
    endDate
}
    const response = await authenticatedAxios.post('premium/report',data);
    const {filteredData} = response.data;
    ShowReport(filteredData)
}
function showLeaderboard(data,id) {
    lbplaceholder.innerHTML = "";
    data.forEach((ele, index) => {
        if (index < 25) {
            let text;
            const firstName = ele.name.split(' ')[0];
            const li = document.createElement('li');
            li.className = "list-group-item text-nowrap"
            if(id==ele._id){
                 text = `${index + 1}. ${firstName} - Expense: &#8377;${ele.totalexpenses}`;
            }else{
                text = `${index + 1}. User - Expense: &#8377;${ele.totalexpenses}`; 
            }
            li.innerHTML = text;
            lbplaceholder.appendChild(li);
        }

    })

}
function showDownloadhistory(data) {
    if (data.length > 0) {
        historyplaceholder.innerHTML = "";
        data.forEach((ele, index) => {
            if (index < 25) {
                const date = new Date(ele.createdAt).toLocaleString();
                const a = document.createElement('a');
                a.className = "list-group-item text-nowrap";
                a.href = `${ele.url}`
                a.innerHTML = `${date}`;
                historyplaceholder.appendChild(a);
            }

        })
    }
}

function ShowReport(data) {
    let total = 0,gTotal = 0,uTotal = 0, rTotal=0,fTotal = 0, cTotal =0, dTotal = 0, foodTotal =0,eTotal=0,giftTotal = 0;
    data.forEach((ele,index)=>{
     let option = ele.category ;
     total+=parseInt(ele.amount);
     if(option == 'Groceries'){
        gTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Utilities'){
        uTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Rent'){
        rTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Fuel'){
        fTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Clothes'){
        cTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Drinks'){
        dTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Food'){
        foodTotal += parseInt(ele.amount);
     }
     if(option == 'Education'){
        eTotal += parseInt(ele.amount);
        return;
     }
     if(option == 'Gifts'){
        giftTotal += parseInt(ele.amount);
        return;
     }
    }

    
    
    )
    reportElement.td1.innerHTML = `${gTotal} &#8377`;
    reportElement.td2.innerHTML = `${uTotal} &#8377`;
    reportElement.td3.innerHTML = `${rTotal} &#8377`;
    reportElement.td4.innerHTML = `${fTotal} &#8377`;
    reportElement.td5.innerHTML = `${cTotal} &#8377`;
    reportElement.td6.innerHTML = `${dTotal} &#8377`;
    reportElement.td7.innerHTML = `${foodTotal} &#8377`;
    reportElement.td8.innerHTML = `${eTotal} &#8377`;
    reportElement.td9.innerHTML = `${giftTotal} &#8377`;
    reportElement.total.innerHTML = `${total} &#8377`;

}

async function downloadData(e) {
    try {
        e.preventDefault();
        let response = await authenticatedAxios.get('premium/download');
        window.location.href = response.data.URL;
        premium();
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

async function premium() {
    try {
        const leaderboard = await authenticatedAxios.get('premium/leaderborddata');
        const currentuser = await authenticatedAxios.get(`user/currentuser`);
        const { _id } = currentuser.data.user;
        showLeaderboard(leaderboard.data,_id);
        const { data: { history } } = await authenticatedAxios.get('premium/downloadhistory');
        showDownloadhistory(history);
    } catch (error) {
        console.log(error);
    }
}

