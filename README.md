Project kanban at waffle.io: [![Stories in Ready](https://badge.waffle.io/tangentstorm/tangentschool.png?label=ready&title=Ready)](https://waffle.io/tangentstorm/tangentschool)

# tangentschool
software to run an online course

- **app** contains the python backend
- **web** contains the html/css/coffee-script frontend

# deployment (ubuntu 15.10)

    sudo apt-get install nginx

Copy files to:

| local | remote          |
|-------|-----------------|
| etc/* | /etc/*          |
| web/* | /var/www/html/* |
| app/* | (anywhere)      |

