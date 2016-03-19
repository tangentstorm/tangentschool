Project kanban at waffle.io: [![Stories in Ready](https://badge.waffle.io/tangentstorm/tangentschool.png?label=ready&title=Ready)](https://waffle.io/tangentstorm/tangentschool)

# tangentschool
software to run an online course

- **app** contains the python backend
- **web** contains the html/css/coffee-script frontend

# deployment (ubuntu 15.10)

First, install the default nginx:

    sudo apt-get install nginx

Copy files to:

| local | remote          |
|-------|-----------------|
| etc/* | /etc/*          |
| web/* | /var/www/html/* |
| app/* | /var/www/wsgi/* |


Update nginx to use the new config file:

    cd /etc/nginx/sites-enabled/
    sudo rm default
    sudo ln -s ../sites-available/tangentschool.conf
    sudo service nginx restart


install node 5.x for the front-end:

    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
    sudo apt-get install -y nodejs
    cd /var/www/html
    npm install

Install PostgreSQL:

    sudo apt-get install postgresql-9.4 postgresql-server-dev-9.4
    sudo su - postgres
    createuser -P tangentschool
    # (enter password twice)
    # create database with same name, owned by this user
    createdb -O tangentschool tangentschool
    
... with data:

    psql -h localhost -U tangentschool
    # <enter password>
    \i /path/to/tangentschool/sql/tangentschool.sql


now set up the python backend:

    mkdir /var/www/wsgi
    cd /var/www/wsgi
    sudo apt-get install -y python-pip python-dev
    pip install -r requirements.txt
    python serve.py

