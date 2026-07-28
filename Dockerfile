FROM keymetrics/pm2:latest-alpine

# Instalar bash (útil para scripts de entrada, pero opcional)
RUN apk update && apk add bash

# Establecer directorio de trabajo
WORKDIR /src

# Copiar solo los archivos necesarios para instalar dependencias (mejora caché)
COPY package*.json ./

# Instalar dependencias de producción (evita instalar devDependencies)
RUN npm ci --only=production && npm cache clean --force

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto que usa tu aplicación (ajusta si usas otro)
EXPOSE 3000

# Usar pm2-runtime para ejecutar la aplicación en modo producción
CMD [ "pm2-runtime", "start", "pm2.json" ]