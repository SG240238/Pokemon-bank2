/* --------------------------------------------------------
   POKÉMON BANK - MÓDULO DE TRANSACCIONES
   Integrante 2: Depósito, Retiro, Consulta + Historial
--------------------------------------------------------- */

// KEY DE LOCALSTORAGE
const KEY = "pokemonBankUser";

// USUARIO BASE (SI NO EXISTE)
const USUARIO_DEFAULT = {
    nombre: "Usuario de Prueba",
    cuenta: "1234567890",
    saldo: 1000.00,
    transacciones: [] // <-- AQUI SE GUARDA EL HISTORIAL
};

// CARGAR USUARIO
function cargar() {
    let data = localStorage.getItem(KEY);
    if (!data) {
        localStorage.setItem(KEY, JSON.stringify(USUARIO_DEFAULT));
        return { ...USUARIO_DEFAULT };
    }
    return JSON.parse(data);
}

// GUARDAR USUARIO
function guardar(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

// FORMATO DE DINERO
function money(n) {
    return Number(n).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
}

// ------------------------------------------------------------------
// OBJETO PRINCIPAL DE TRANSACCIONES
// ------------------------------------------------------------------
const transacciones = {

    render() {
        const user = cargar();
        const saldo = document.getElementById("saldo");
        if (saldo) saldo.textContent = money(user.saldo);
    },

    // ------------------------------------------------------------
    // DEPÓSITO
    // ------------------------------------------------------------
    deposito() {
        const monto = Number(document.getElementById("monto").value);
        if (!monto || monto <= 0) {
            Swal.fire("Monto inválido", "Ingresa un monto mayor a 0", "error");
            return;
        }

        Swal.fire({
            title: "¿Confirmar depósito?",
            text: "Vas a depositar " + money(monto),
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, depositar"
        }).then(res => {
            if (!res.isConfirmed) return;

            let user = cargar();
            user.saldo += monto;

            // Registrar historial
            user.transacciones.push({
                referencia: this.generarNumeroReferencia(),
                tipo: "Depósito",
                descripcion: "Depósito de fondos",
                monto: monto,
                fecha: new Date().toLocaleString()
            });

            guardar(user);

            Swal.fire("Depósito exitoso", "Nuevo saldo: " + money(user.saldo), "success");
            this.render();
        });
    },

    // ------------------------------------------------------------
    // RETIRO
    // ------------------------------------------------------------
    retiro() {
        const monto = Number(document.getElementById("monto").value);
        const user = cargar();

        if (!monto || monto <= 0) {
            Swal.fire("Monto inválido", "Ingresa un monto mayor a 0", "error");
            return;
        }

        if (monto > user.saldo) {
            Swal.fire("Fondos insuficientes", "Tu saldo es " + money(user.saldo), "error");
            return;
        }

        Swal.fire({
            title: "¿Confirmar retiro?",
            text: "Vas a retirar " + money(monto),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, retirar"
        }).then(res => {
            if (!res.isConfirmed) return;

            user.saldo -= monto;

            // Registrar historial
            user.transacciones.push({
                referencia: this.generarNumeroReferencia(),
                tipo: "Retiro",
                descripcion: "Retiro de fondos cajero automático",
                monto: monto,
                fecha: new Date().toLocaleString()
            });

            guardar(user);

            Swal.fire("Retiro exitoso", "Nuevo saldo: " + money(user.saldo), "success");
            this.render();
        });
    },

    // ------------------------------------------------------------
    // CONSULTA DE SALDO
    // ------------------------------------------------------------
    consulta() {
        let user = cargar();

        Swal.fire("Saldo actual", money(user.saldo), "info");

        // Registrar historial
        user.transacciones.push({
            referencia: this.generarNumeroReferencia(),
            tipo: "Consulta",
            monto: 0,
            fecha: new Date().toLocaleString()
        });

        guardar(user);
        this.render();
    },

    //funcion para generar numero de referencia unico para cada transaccion
    generarNumeroReferencia() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const randomPadded = String(random).padStart(3, "0");
        return `REF${timestamp}${randomPadded}`;
    }
};
