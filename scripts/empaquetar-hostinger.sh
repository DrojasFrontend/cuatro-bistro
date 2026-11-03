#!/usr/bin/env bash
# Arma el ZIP para Hostinger Web Apps con la build hecha en local (ver scripts/build.mjs).
# La build en el servidor choca con el tope de hilos de la cuenta, así que se sube .next ya compilado:
# salida standalone + public y .next/static copiados + binarios Linux de sharp (el standalone trae los de macOS).
# Uso: scripts/empaquetar-hostinger.sh   (desde la raíz del repo, con el código ya commiteado)
set -euo pipefail

: "${WPGRAPHQL_URL:=https://mintcream-goose-834497.hostingersite.com/graphql}"
: "${NEXT_PUBLIC_SITE_URL:=https://cuatrobistro.com}"
export WPGRAPHQL_URL NEXT_PUBLIC_SITE_URL

if [ -n "$(git status --porcelain)" ]; then
	echo "Hay cambios sin commit: el ZIP sale de HEAD." >&2
	exit 1
fi

rm -rf .next
npx next build

# Lo que el standalone no copia solo.
cp -R public .next/standalone/public
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static

# sharp para Linux x64 (glibc), mismas versiones que pide el sharp instalado.
VERSIONES=$(node -e 'const d=require("./node_modules/sharp/package.json").optionalDependencies;console.log(d["@img/sharp-linux-x64"]+" "+d["@img/sharp-libvips-linux-x64"])')
read -r V_SHARP V_LIBVIPS <<<"$VERSIONES"
TMP=$(mktemp -d)
(cd "$TMP" && npm pack "@img/sharp-linux-x64@$V_SHARP" "@img/sharp-libvips-linux-x64@$V_LIBVIPS" --silent >/dev/null)
for paquete in sharp-linux-x64 sharp-libvips-linux-x64; do
	mkdir -p ".next/standalone/node_modules/@img/$paquete"
	tar xzf "$TMP"/img-"$paquete"-*.tgz -C ".next/standalone/node_modules/@img/$paquete" --strip-components=1
done
rm -rf "$TMP"

ZIP="../herramientas/deploys/cuatro-$(git rev-parse --short HEAD)-precompilado.zip"
rm -f "$ZIP"
git archive --format=zip -o "$ZIP" HEAD
zip -qr "$ZIP" .next -x ".next/cache/*"
echo "Listo: $ZIP ($(du -h "$ZIP" | cut -f1))"
