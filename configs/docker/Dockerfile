#--- BASE ---
FROM node:14-alpine AS release
RUN set -x && \
    apk update && \
    apk upgrade && \
    apk add --update bash && \
    rm  -rf /tmp/* /var/cache/apk/* /opt/installer
RUN addgroup -S www-data

WORKDIR /usr/src/svc-application

RUN mkdir /etc/service
ADD ./configs/docker/launch.sh /etc/service
CMD ["/etc/service/launch.sh"]

#--- BUILD ---
FROM node:14 AS build
WORKDIR /tmp
ARG IS_CI_RUNNER

COPY ./configs/envs/deployment.env ./configs/envs/deployment.env

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci

COPY . .
RUN npm run build

#--- FINAL---
FROM release AS final
WORKDIR /usr/src/svc-application
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm i --production
COPY --from=build /tmp/dist ./dist