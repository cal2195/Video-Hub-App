# Pull base image.
FROM jlesage/baseimage-gui:debian-9

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl git libnss3-dev libdbus-1-3 libgtk-3-dev libxss1 libasound2 \
    && apt-get -y autoclean

# nvm environment variables
#ENV NVM_DIR /usr/local/nvm
ENV NVM_DIR /nvm
RUN mkdir $NVM_DIR
ENV NODE_VERSION 12.13.0

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# confirm installation
#RUN node -v
#RUN npm -v

RUN npm install -g @angular/cli

# Copy the start script.
COPY startapp.sh /startapp.sh

# Set the name of the application.
ENV APP_NAME="Video Hub App 2"

RUN rm /etc/cont-init.d/10-vnc-password.sh
USER root
ENV USER_ID 0
ENV GROUP_ID 0

# RUN apt-get install -y
ENV DISPLAY_WIDTH 1920
ENV DISPLAY_HEIGHT 1080
ENV KEEP_APP_RUNNING 1

# clone repo
RUN git clone --branch docker https://github.com/cal2195/Video-Hub-App.git /Video-Hub-App
RUN cd /Video-Hub-App && npm install
RUN sed-patch 's/electron ./electron . --no-sandbox/' /Video-Hub-App/package.json
