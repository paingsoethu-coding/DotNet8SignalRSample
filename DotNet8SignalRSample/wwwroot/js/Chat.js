
// For strict code error
"use strict";

// connection ကို assign ချပြီး ဒီကောင်ကို ပြန်ခေါ်ဖို့ build (register) ထားတာပါ 
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// connection မကောင်းရင် ပိတ်ထားပေးမယ်
//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

// Message ကိုရရယူတာပါ
connection.on("ReceiveMessage", function (user, message) {
    // Message လေးတွေတိုးလာရင် table ထဲမြင်ရအောင် ထပ်ထပ် ထည့်ထားတာလေးပါ
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`; 
    // အဲ့ li ထဲကို ဘယ် user က ဘာ message ပြောတယ်ဆိုတာပါ 
});

// Message ကိုပိုတဲ့ကောင်ပါ
connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) { 
    // ဲဒါက error တက်ရင် error Message ပြန်ပေးထားတာပါ 
    return console.error(err.toString());
});

// Button ရဲ့ click Event မှာဆိုရင် user နဲ message ရဲ့ text value ယူတာပါ
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;

    //  The invoke() method returns a promise that resolves when 
    //  the server has successfully processed the message.
    connection.invoke("SendMessage", user, message).catch(function (err) {
        // ဒါက error တက်ရင် error Message ပြန်ပေးထားတာပါ 
        return console.error(err.toString());
    });

    // default action နဲပတ်သက်ပြီး event ကနေဖြစ်လာမယ့်အခြေအနေတွေကို တားပေးတာပါ။
    // Prevents the default action associated with the event from being triggered.
    event.preventDefault();
    //  ဒီကောင်ဘာလို့ထည့်တာလဲဆိုရင် default action ကိုမဖြစ်စေချင်ဘူးပြီးတော့
    //  message ကို SignalR ထဲကိုပို့ပြီး တစ်ခြားကိစ္စအားလုံးကို JavaScript ထဲမှာတင်ပဲ
    //  page reload လုပ်စရာမလိုပဲ handle လုပ်ဖို့ပါ။
    //  (ဒါရှိလို့ စာပို့လိုက်ရင် page reload မဖြစ်ပဲ စာမြင်ရတဲ့ ကိစ္စဖြစ်တာပါ။)
    //  မထည့်ထားရင် page reload ဖြစ်တာတို့ 
    //  user input ကပျက်သွားတာတို့ 
    //  ပထမ user input ပြန်ရလာတာတို့ အစရှိသဖြင့် အဲ့လိုမျိုးတွေ ဖြစ်နိုင်တယ်။
});
