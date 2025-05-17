let wss = null;

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'Ali' && password === '12345678') {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('control-page').style.display = 'block';
    connectWebSocket();
  } else {
    alert('عزک. الرمز اشتباه');
  }
}

function connectWebSocket() {
  // آدرس IP ماژول ESP8266 رو اینجا وارد کنید
  wss = new WebSocket('wss://192.168.177.183:81');

  wss.onopen = () => {
    console.log('WebSocket connected');
  };

  wss.onmessage = (event) => {
    const data = event.data;
    if (data.startsWith('STATUS')) {
      const parts = data.split(':');
      const relayNum = parseInt(parts[1]);
      const state = parseInt(parts[2]);
      updateRelayStatus(relayNum, state);
    }
  };

  wss.onclose = () => {
    console.log('WebSocket disconnected. Reconnecting...');
    setTimeout(connectWebSocket, 5000);
  };

  wss.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

function toggleRelay(relayNum) {
  const state = document.getElementById(`status${relayNum}`).textContent === 'ON' ? 0 : 1;
  if (wss && wss.readyState === WebSocket.OPEN) {
    wss.send(`RELAY${relayNum}:${state}`);
  }
}

function updateRelayStatus(relayNum, state) {
  const statusElement = document.getElementById(`status${relayNum}`);
  const buttonElement = document.getElementById(`relay${relayNum}`);
  statusElement.textContent = state ? 'ON' : 'OFF';
  statusElement.style.color = state ? '#00e676' : '#ff1744';
  buttonElement.style.backgroundColor = state ? '#00e676' : '#6200ea';
}
