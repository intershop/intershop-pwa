#!/usr/bin/env bash

set -euo pipefail

certificate_directory="${GITHUB_WORKSPACE:-$(pwd)}/.github/lighthouse/certs"
nss_database="sql:${HOME}/.pki/nssdb"
temporary_directory="$(mktemp -d)"

cleanup() {
  rm -rf "${temporary_directory}"
}
trap cleanup EXIT

mkdir -p "${certificate_directory}" "${HOME}/.pki/nssdb"
rm -f "${certificate_directory}"/*

openssl req -quiet -x509 -newkey rsa:2048 -sha256 -nodes -days 1 \
  -keyout "${temporary_directory}/ca-key.pem" \
  -out "${certificate_directory}/ca-cert.pem" \
  -subj '/CN=Intershop Lighthouse CI CA' \
  -addext 'basicConstraints=critical,CA:TRUE' \
  -addext 'keyUsage=critical,keyCertSign,cRLSign' \
  -addext 'subjectKeyIdentifier=hash'

openssl req -quiet -new -newkey rsa:2048 -sha256 -nodes \
  -keyout "${certificate_directory}/key.pem" \
  -out "${temporary_directory}/server.csr" \
  -subj '/CN=localhost'

cat >"${temporary_directory}/server.ext" <<'EOF'
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=DNS:localhost,IP:127.0.0.1
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer
EOF

openssl x509 -req -sha256 -days 1 \
  -in "${temporary_directory}/server.csr" \
  -CA "${certificate_directory}/ca-cert.pem" \
  -CAkey "${temporary_directory}/ca-key.pem" \
  -CAcreateserial \
  -out "${certificate_directory}/cert.pem" \
  -extfile "${temporary_directory}/server.ext"

openssl verify \
  -CAfile "${certificate_directory}/ca-cert.pem" \
  -verify_hostname localhost \
  "${certificate_directory}/cert.pem"

# Trust the temporary CA for command-line clients using Ubuntu's system store.
sudo cp "${certificate_directory}/ca-cert.pem" \
  /usr/local/share/ca-certificates/intershop-lighthouse-ci-ca.crt
sudo update-ca-certificates

# Chrome on Linux reads locally administered roots from the user's NSS database.
if [[ ! -f "${HOME}/.pki/nssdb/cert9.db" ]]; then
  certutil -N --empty-password -d "${nss_database}"
fi

certutil -D -d "${nss_database}" -n 'Intershop Lighthouse CI CA' 2>/dev/null || true
certutil -A \
  -d "${nss_database}" \
  -n 'Intershop Lighthouse CI CA' \
  -t 'C,,' \
  -i "${certificate_directory}/ca-cert.pem"

certutil -V \
  -d "${nss_database}" \
  -n 'Intershop Lighthouse CI CA' \
  -u L
