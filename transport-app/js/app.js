
const RASP_API_KEY = "0e168543-85b1-4b86-80bd-814776ec5fe8";
const RASP_BASE = "https://api.rasp.yandex.net/v3.0";

let map, myPlacemark;

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');

document.getElementById('themeToggle').onclick=()=>{
  document.body.classList.toggle('light');
};

function getPos() {
  return new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej));
}

async function init() {
  const st = document.getElementById('status');
  try {
    const pos = await getPos();
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    st.textContent = `Ваши координаты: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    ymaps.ready(()=> {
      map = new ymaps.Map("map",{center:[lat,lon],zoom:15});
      myPlacemark = new ymaps.Placemark([lat,lon],{balloonContent:"Вы здесь"});
      map.geoObjects.add(myPlacemark);
    });
    loadStops(lat,lon);
  } catch(e) {
    st.textContent="Ошибка геолокации";
  }
}

async function loadStops(lat,lon){
  const url = `${RASP_BASE}/nearest-stations/?lat=${lat}&lng=${lon}&station_types=bus_stop&distance=1000&apikey=${RASP_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const list=document.getElementById('stationsList');
  list.innerHTML="";
  (data.stations||[]).forEach(s=>{
    const li=document.createElement('li');
    li.textContent=s.title||"Остановка";
    list.appendChild(li);
  });
}
window.onload=init;
