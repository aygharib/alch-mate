FROM ubuntu

ENV TZ=America/Toronto

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update

RUN apt-get install npm git -y

RUN git clone https://github.com/Develorain/alch-mate.git

WORKDIR /alch-mate

RUN npm install

ENTRYPOINT npm start
#CMD bash

#sudo docker build . -t develorain/alch-mate-container2
#sudo docker run -it develorain/alch-mate-container2
#sudo docker run -p 1337:3000 -it develorain/alch-mate-container2