// =============================================
// admin-auth.js — Autenticación con SHA-256
// Compatible con ES Modules (Firebase)
// =============================================

const AUTH_KEY        = 'evoka_admin_credentials';
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

// ---------- SHA-256 (implementación propia) ----------
function sha256(input) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    const msg = [];
    for (let i = 0; i < input.length; i++) {
        let c = input.charCodeAt(i);
        if (c < 0x80)                 { msg.push(c); }
        else if (c < 0x800)           { msg.push(0xc0|(c>>6), 0x80|(c&0x3f)); }
        else if (c < 0xd800 || c >= 0xe000) { msg.push(0xe0|(c>>12), 0x80|((c>>6)&0x3f), 0x80|(c&0x3f)); }
        else { i++; c = 0x10000+(((c&0x3ff)<<10)|(input.charCodeAt(i)&0x3ff)); msg.push(0xf0|(c>>18),0x80|((c>>12)&0x3f),0x80|((c>>6)&0x3f),0x80|(c&0x3f)); }
    }
    const msgLenBits = msg.length * 8;
    msg.push(0x80);
    while ((msg.length * 8) % 512 !== 448) msg.push(0);
    for (let i = 7; i >= 0; i--) msg.push((msgLenBits >>> (i * 8)) & 0xff);
    const H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    for (let i = 0; i < msg.length; i += 64) {
        const chunk = msg.slice(i, i+64);
        const W = new Array(64);
        for (let t=0;t<16;t++) W[t]=(chunk[t*4]<<24)|(chunk[t*4+1]<<16)|(chunk[t*4+2]<<8)|chunk[t*4+3];
        for (let t=16;t<64;t++) { const s0=rightRotate(W[t-15],7)^rightRotate(W[t-15],18)^(W[t-15]>>>3); const s1=rightRotate(W[t-2],17)^rightRotate(W[t-2],19)^(W[t-2]>>>10); W[t]=(W[t-16]+s0+W[t-7]+s1)|0; }
        let a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
        for (let t=0;t<64;t++) { const S1=rightRotate(e,6)^rightRotate(e,11)^rightRotate(e,25); const ch=(e&f)^(~e&g); const temp1=(h+S1+ch+K[t]+W[t])|0; const S0=rightRotate(a,2)^rightRotate(a,13)^rightRotate(a,22); const maj=(a&b)^(a&c)^(b&c); const temp2=(S0+maj)|0; h=g;g=f;f=e;e=(d+temp1)|0;d=c;c=b;b=a;a=(temp1+temp2)|0; }
        H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;
    }
    let result = '';
    for (let i=0;i<8;i++) result += ('00000000'+(H[i]>>>0).toString(16)).slice(-8);
    return result;
}

// ---------- Credenciales ----------
function inicializarCredenciales() {
    if (!localStorage.getItem(AUTH_KEY)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({
            username: DEFAULT_USERNAME,
            hash: sha256(DEFAULT_PASSWORD)
        }));
    }
}

function obtenerCredenciales() {
    inicializarCredenciales();
    return JSON.parse(localStorage.getItem(AUTH_KEY));
}

export async function verificarCredenciales(username, password) {
    const creds = obtenerCredenciales();
    return username === creds.username && sha256(password) === creds.hash;
}

export async function guardarPasswordHash(nuevaPassword) {
    const creds = obtenerCredenciales();
    creds.hash = sha256(nuevaPassword);
    localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
}

export function verificarSesion() {
    const auth = sessionStorage.getItem('adminAuth') === 'true';
    const time  = parseInt(sessionStorage.getItem('adminTokenTime'));
    const ahora = Date.now();
    if (!auth || !time || (ahora - time > 2 * 60 * 60 * 1000)) {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminTokenTime');
        return false;
    }
    sessionStorage.setItem('adminTokenTime', ahora);
    return true;
}

export function iniciarSesion() {
    sessionStorage.setItem('adminAuth', 'true');
    sessionStorage.setItem('adminTokenTime', Date.now());
}
