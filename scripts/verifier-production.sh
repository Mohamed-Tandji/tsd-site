#!/bin/bash
# Vérification du site en production : ./scripts/verifier-production.sh [domaine]
# (par défaut tsdsystems.net ; INSECURE=1 accepte un certificat de test, pour un essai local)
set -uo pipefail

DOMAIN="${1:-tsdsystems.net}"
BASE="https://$DOMAIN"
CURL=(curl -s --max-time 15)
[ "${INSECURE:-0}" = "1" ] && CURL+=(-k)
FAILS=0

check() { # libellé, valeur obtenue, valeur attendue (expression régulière)
  if [[ "$2" =~ $3 ]]; then echo "OK     $1"; else echo "ÉCHEC  $1 (obtenu : ${2:-rien})"; FAILS=$((FAILS + 1)); fi
}
code() { "${CURL[@]}" -o /dev/null -w '%{http_code}' "$1"; }
redirect() { "${CURL[@]}" -o /dev/null -w '%{http_code} %{redirect_url}' "$1"; }

echo "Vérification de $BASE"
check "HTTP redirige vers HTTPS" "$(curl -s --max-time 15 -o /dev/null -w '%{http_code} %{redirect_url}' "http://$DOMAIN/fr")" "^30[178] https://$DOMAIN/fr"
check "www redirige vers $DOMAIN" "$(redirect "https://www.$DOMAIN/fr")" "^30[178] https://$DOMAIN/fr"
check "/ redirige vers /fr" "$(redirect "$BASE/")" "^30[78] $BASE/fr"

for path in /fr /en /fr/solutions /en/solutions /fr/solutions/kalanso-kunafoni /fr/solutions/stockautoplus \
  /fr/a-propos /en/about /fr/equipe /en/team /fr/contact /en/contact /fr/mentions-legales /en/legal-notice \
  /fr/confidentialite /en/privacy /admin/login /sitemap.xml /robots.txt /og-image.png; do
  check "$path répond" "$(code "$BASE$path")" "^200$"
done
check "FasoLink (bientôt disponible) sans fiche" "$(code "$BASE/fr/solutions/fasolink")" "^404$"
check "/admin protégé" "$(redirect "$BASE/admin")" "^30[78] .*/admin/login"
check "Base de données connectée" "$("${CURL[@]}" "$BASE/api/health")" '"ok":true'

HEADERS="$("${CURL[@]}" -I "$BASE/fr")"
check "En-tête HSTS" "$HEADERS" "[Ss]trict-[Tt]ransport-[Ss]ecurity"
check "En-tête X-Content-Type-Options" "$HEADERS" "[Xx]-[Cc]ontent-[Tt]ype-[Oo]ptions: nosniff"
check "Langue de la page FR" "$("${CURL[@]}" "$BASE/fr")" '<html lang="fr"'
check "Langue de la page EN" "$("${CURL[@]}" "$BASE/en")" '<html lang="en"'
check "Adresse canonique sur le domaine" "$("${CURL[@]}" "$BASE/fr/contact")" "rel=\"canonical\" href=\"$BASE/fr/contact\""
check "Sitemap sur le domaine" "$("${CURL[@]}" "$BASE/sitemap.xml")" "<loc>$BASE/fr</loc>"
check "robots.txt exclut /admin" "$("${CURL[@]}" "$BASE/robots.txt")" "Disallow: /admin"

if [ "${INSECURE:-0}" != "1" ]; then
  EXPIRY="$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)"
  check "Certificat HTTPS valide (expire : ${EXPIRY:-?})" "$EXPIRY" "[0-9]{4}"
fi

echo
if [ "$FAILS" -eq 0 ]; then echo "Tout est en ordre."; else echo "$FAILS vérification(s) en échec."; fi
exit "$FAILS"
