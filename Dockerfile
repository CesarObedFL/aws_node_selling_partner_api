FROM keymetrics/pm2:latest-alpine

# Instalar bash (útil para scripts, opcional)
RUN apk add --no-cache bash

# Instalar pnpm globalmente
RUN npm install -g pnpm@9

# Establecer directorio de trabajo
WORKDIR /src

# Copiar archivos de dependencias
COPY package*.json pnpm-lock.yaml ./

# Instalar dependencias con pnpm (usando frozen lockfile para producción)
RUN pnpm install --frozen-lockfile --prod && pnpm cache clean

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Usar pm2-runtime para ejecutar la aplicación
CMD [ "pm2-runtime", "start", "pm2.json" ]