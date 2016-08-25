FROM node:6
MAINTAINER Laurent Renard <laurent34azerty@gmail.com>
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 5001
CMD ["npm", "start"]