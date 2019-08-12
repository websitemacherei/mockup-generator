FROM node:10-slim

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY script/ /app/script
COPY mocks/ /app/mocks
COPY *.json /app/
COPY *.js /app/

RUN groupadd -r app && useradd -g app -r -G audio,video app && \
    mkdir -p /home/app/Downloads && chown app:app -R /app && chown app:app -R /home/app

USER app

WORKDIR /app

RUN npm i

EXPOSE 3000

CMD ["node", "server.js"]
