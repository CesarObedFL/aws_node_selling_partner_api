FROM keymetrics/pm2:latest-alpine

# Instalar bash (opcional, útil para scripts)
RUN apk add --no-cache bash

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /src

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias de producción con pnpm
RUN pnpm install --prefer-frozen-lockfile --prod && pnpm cache clean

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de inicio con PM2
CMD [ "pm2-runtime", "start", "pm2.json" ]