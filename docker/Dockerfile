FROM node:boron

MAINTAINER Wayne Dovey <wdovey@redhat.com>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Clone game source code
RUN git clone https://github.com/waynedovey/pacman.git .

# Install app dependencies
RUN npm install

# Expose port 8080
EXPOSE 8080

# Run container
CMD ["npm", "start"]
