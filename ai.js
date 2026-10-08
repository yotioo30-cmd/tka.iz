const ball=document.getElementById("ball");
const panel=document.getElementById("panel");
const close=document.getElementById("close");
const result=document.getElementById("result");

const apiKey=document.getElementById("apiKey");
const baseUrl=document.getElementById("baseUrl");
const model=document.getElementById("model");
const questions=document.getElementById("questions");

ball.onclick=()=>{
panel.style.display=
panel.style.display==="block"?"none":"block";
};

close.onclick=()=>{
panel.style.display="none";
};

async function load(){
const x=await chrome.storage.local.get([
"apiKey","baseUrl","model"
]);

apiKey.value=x.apiKey||"";
baseUrl.value=x.baseUrl||
"https://openrouter.ai/api/v1";
model.value=x.model||
"deepseek/deepseek-chat-v3.1:free";
}

document.getElementById("save").onclick=async()=>{
await chrome.storage.local.set({
apiKey:apiKey.value.trim(),
baseUrl:baseUrl.value.trim(),
model:model.value.trim()
});

result.textContent="✅ API tersimpan";
};

async function askAI(prompt){

if(!apiKey.value.trim())
throw new Error("API Key belum diisi");

const r=await fetch(
baseUrl.value.replace(/\/$/,"")+
"/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+apiKey.value
},
body:JSON.stringify({
model:model.value,
messages:[
{
role:"system",
content:
"Kamu adalah PANGLIMA AI, asisten belajar. Kerjakan soal dengan benar dan jelaskan langkahnya."
},
{
role:"user",
content:prompt
}
],
temperature:.2
})
}
);

if(!r.ok)
throw new Error("API Error "+r.status);

const d=await r.json();

return d.choices?.[0]?.message?.content||
"Tidak ada jawaban.";
}

document.getElementById("one").onclick=async()=>{

if(!questions.value.trim()){
result.textContent="Masukkan soal.";
return;
}

result.textContent="⚡ Mengerjakan soal 1...";

try{
result.textContent=await askAI(`
Kerjakan hanya soal nomor 1.

Berikan:
- Jawaban
- Langkah
- Penjelasan

SOAL:
${questions.value}
`);
}catch(e){
result.textContent="❌ "+e.message;
}
};

document.getElementById("all").onclick=async()=>{

if(!questions.value.trim()){
result.textContent="Masukkan soal.";
return;
}

result.textContent="🚀 Mengerjakan semua soal...";

try{
result.textContent=await askAI(`
Kerjakan SEMUA soal sampai selesai.

Untuk setiap nomor berikan:
- Jawaban
- Langkah pengerjaan
- Penjelasan

Jangan melewati nomor.

SOAL:
${questions.value}
`);
}catch(e){
result.textContent="❌ "+e.message;
}
};

document.getElementById("clear").onclick=()=>{
questions.value="";
result.textContent="PANGLIMA AI siap.";
};

load();
