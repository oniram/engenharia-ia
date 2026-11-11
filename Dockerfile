# Base interna do CRC (evita pull em registry.access.redhat.com — timeout na VM GCP)
FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:20-minimal-ubi9

WORKDIR /opt/app-root/src

# A pasta deps/ NAO vem do Git — entra no contexto via --from-dir (dependencia local)
COPY deps/ ./deps/
COPY index.js ./

USER 1001
EXPOSE 8080
ENV PORT=8080

CMD ["node", "index.js"]
