// En Hostinger (hosting compartido) compilar en el servidor choca con el tope de hilos de la cuenta
// (CloudLinux ~120 hilos; Turbopack abre uno por núcleo y se queda esperando). Por eso el ZIP lleva la
// build hecha en local y, con USAR_BUILD_PRECOMPILADO=1 (variable de la Web App), aquí no se vuelve a compilar.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (process.env.USAR_BUILD_PRECOMPILADO === "1" && existsSync(".next/BUILD_ID")) {
	console.log("Usando la build precompilada incluida en el ZIP (.next).");
	process.exit(0);
}

const r = spawnSync("npx", ["next", "build"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
